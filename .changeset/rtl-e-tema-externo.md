---
'@orangesys/ui': minor
---

**Páginas da direita para a esquerda.** Com `dir="rtl"` no `<html>` (ou num contêiner), os componentes espelham: o CSS passa a usar propriedades lógicas (`margin-inline-start`, `inset-inline-end`, `border-inline-start`, `text-align: start`…) em vez de esquerda/direita, e o que se move de lado — polegar do `Switch`, indicadores, barras de progresso, setas que "empurram", entradas que deslizam — troca de sentido. Árabe, persa, urdu e hebraico passam a funcionar sem CSS próprio.

- **Ícones de direção** (`arrow-left`/`-right`, `chevron-left`/`-right`, `chevrons-left`/`-right`) apontam para onde a leitura segue: em RTL, "próximo" aponta para a esquerda.
- **Teclado no sentido da leitura:** em `Tabs`, `Toolbar` (e `ActionBar`), `Calendar`, `DatePicker`, `DateRangePicker`, `TreeView`, `Listbox` horizontal, `NavigationMenu`, `Carousel`, `SortableList`, `PinInput` e no redimensionamento de colunas da `Table`, ← e → se invertem em RTL (→ volta). `Splitter` e `ListView`, que já faziam isso, usam a mesma regra. A direção é lida na hora da tecla.
- **`Slider`:** o trilho, o preenchimento, as marcas e o clique no trilho (modo `range`) acompanham o `<input type="range">` nativo, com o mínimo à direita.
- **`Drawer`:** `placement="start"` e `"end"` seguem o sentido da leitura (em RTL, `start` é a direita). `left` e `right` continuam físicos, agora também em páginas RTL. O menu do `AppShell` em tela estreita abre no início da linha.
- **Sobreposições** com `-start`/`-end` (`bottom-start`…) já alinhavam pelo início da linha; os lados `left`/`right` de `Tooltip`, `Popover` e `Tour` continuam físicos.
- Ficam físicos de propósito: as posições do `Toast`, os gráficos e os campos de hora (`TimeField`, `DateTimePicker`), que sempre mostram `14:30`.

O que muda para quem já usa: nada em páginas da esquerda para a direita. CSS próprio que sobrescrevia `margin-left`/`padding-right`/`left` de uma classe `or-*` pode precisar da propriedade lógica equivalente, porque as duas convivem na cascata. Em testes, o estilo inline das marcas do `Slider` e dos limites do `Meter` passa de `left` para `inset-inline-start`.

**`themeTarget="none"` no `OrangeProvider`.** O provider fornece o tema (`useTheme()`: `theme`, `resolvedTheme`, `colorScheme`, `highContrast`, `setTheme`) sem escrever `data-theme` em lugar nenhum e sem envolver os filhos. É para aplicações que já aplicam o tema sozinhas, antes da pintura: com `document`, o efeito do provider podia trocar o atributo durante a hidratação, quando o tema resolvido dele ainda era diferente do que a aplicação tinha escrito.

```tsx
// O script do <head> já escreveu data-theme; o Orange só lê e informa.
<OrangeProvider theme={preferencia} onThemeChange={salvarPreferencia} themeTarget="none">
  <App />
</OrangeProvider>
```
