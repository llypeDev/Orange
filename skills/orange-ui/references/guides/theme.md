# Tema

Quatro temas prontos — escuro (padrão), claro e a versão de alto contraste de cada um — trocados por um único atributo data-theme. Os componentes só leem tokens, então qualquer tema novo é questão de sobrescrever variáveis CSS.

## Temas claro e escuro

Mesmos componentes, mesmos tokens, valores diferentes. O tema escuro usa a paleta `carbon` e o laranja 500; o claro usa `paper` e um laranja mais fechado (600) para manter 3:1 sobre o papel.

## Alto contraste

`dark-hc` e `light-hc` são as versões de alto contraste (WCAG AAA) dos dois temas: texto ≥ 7:1, bordas e foco ≥ 4.5:1, pares de acento e textos de status ≥ 7:1. Mesmos tokens, mesma identidade — carvão, creme e laranja —, só mais fortes. Os valores e o menor contraste de cada regra estão em Cor → Alto contraste.

`AltoContraste.tsx`:

```tsx
// Fixo: a pessoa escolheu alto contraste
<OrangeProvider theme="dark-hc">…</OrangeProvider>

// Automático: segue prefers-color-scheme e prefers-contrast: more
<OrangeProvider theme="system">…</OrangeProvider>

// Só CSS, sem React
<html data-theme="light-hc">
```

- Ofereça o alto contraste como escolha explícita no seletor de tema, ao lado de escuro, claro e automático — como no menu de tema desta documentação.
- `useTheme()` expõe `highContrast` e `colorScheme` (`dark-hc` → `dark`) para quem precisa decidir algo pelo esquema, como um gráfico desenhado em canvas.
- Tema próprio? Sobrescreva também `[data-theme='dark-hc']` e `[data-theme='light-hc']`, mirando 7:1 para texto.

## OrangeProvider

O provider guarda a preferência de tema, resolve `system` com `prefers-color-scheme` e `prefers-contrast` e aplica `data-theme` no `<html>` (ou em um `<div>`, com `themeTarget="scoped"`).

`App.tsx`:

```tsx
import { isThemeSetting, OrangeProvider, type ThemeSetting } from '@orangesys/ui'
import { useState } from 'react'

const CHAVE = 'tema'

function lerTema(): ThemeSetting {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (isThemeSetting(salvo)) return salvo // dark, light, dark-hc, light-hc ou system
  } catch {}
  return 'system'
}

export function App() {
  const [tema, setTema] = useState<ThemeSetting>(lerTema)
  return (
    <OrangeProvider
      theme={tema}
      onThemeChange={(proximo) => {
        setTema(proximo)
        try { localStorage.setItem(CHAVE, proximo) } catch {}
      }}
    >
      <Rotas />
    </OrangeProvider>
  )
}
```

## useTheme()

Qualquer componente dentro do provider lê e altera o tema com `useTheme()`: `theme` é a preferência (pode ser `system`), `resolvedTheme` é o tema aplicado de fato, `colorScheme` é o esquema dele (`dark` ou `light`) e `highContrast` diz se é um tema de alto contraste. Fora de um provider, o hook devolve `dark`.

### Tema escopado ao vivo

Um OrangeProvider aninhado com themeTarget="scoped": os botões mudam o tema só desta caixa, sem afetar a página.

```tsx
import { Button, OrangeProvider, useTheme } from '@orangesys/ui'

function SeletorDeTema() {
  const { theme, resolvedTheme, highContrast, setTheme } = useTheme()
  return (
    <div role="group" aria-label="Tema">
      <p>
        theme: {theme} · resolvedTheme: {resolvedTheme} · alto contraste: {highContrast ? 'sim' : 'não'}
      </p>
      {(['dark', 'light', 'dark-hc', 'light-hc', 'system'] as const).map((valor) => (
        <Button
          key={valor}
          variant={theme === valor ? 'primary' : 'outline'}
          aria-pressed={theme === valor}
          onClick={() => setTheme(valor)}
        >
          {valor}
        </Button>
      ))}
    </div>
  )
}

// themeTarget="scoped": o tema vale só para esta seção
<OrangeProvider themeTarget="scoped" defaultTheme="light">
  <SeletorDeTema />
</OrangeProvider>
```

## Tema por seção

Como os tokens semânticos são definidos em `[data-theme='dark']`, `[data-theme='light']` e nos dois de alto contraste (`dark-hc`, `light-hc`), basta o atributo em qualquer elemento para inverter aquela região — útil para um rodapé escuro numa página clara ou para prévias, como as desta documentação.

`Rodape.tsx`:

```tsx
<footer data-theme="dark" className="rodape">
  {/* tudo aqui dentro usa os tokens do tema escuro */}
</footer>

/* rodape.css — o elemento precisa pintar o próprio fundo */
.rodape {
  background: var(--or-color-bg);
  color: var(--or-color-text);
}
```

> **Pinte o fundo da região** O atributo só troca as variáveis. Quem define `background` e `color` é o elemento — sem isso, o texto creme do tema escuro aparece sobre o fundo claro da página.

## Seguir o sistema

Com `theme="system"` (ou `defaultTheme="system"`), o provider acompanha `prefers-color-scheme` e reage quando a pessoa muda o sistema. Os temas também definem `color-scheme`, então barras de rolagem e controles nativos combinam com o tema.

O modo automático também lê `prefers-contrast: more` (a opção "aumentar contraste" do macOS, iOS e Android, ou o alto contraste do navegador): com ela ativa, `dark` vira `dark-hc` e `light` vira `light-hc`. Uma escolha explícita (`theme="light"`) sempre vence. Sem provider, o `tokens.css` faz o mesmo para o tema padrão: sem `data-theme` no `<html>`, `prefers-contrast: more` aplica o `dark-hc`.

prefers-color-scheme: · prefers-contrast: → `system` =

`index.html`:

```html
<script>
  // Antes da primeira pintura: tema salvo ou o do sistema (com alto contraste).
  try {
    var salvo = localStorage.getItem('tema')
    var tema = /^(dark|light)(-hc)?$/.test(salvo || '')
      ? salvo
      : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') +
        (matchMedia('(prefers-contrast: more)').matches ? '-hc' : '')
    document.documentElement.setAttribute('data-theme', tema)
  } catch (e) {}
</script>
```

- Ofereça as opções — automático, escuro, claro e os dois de alto contraste — e lembre a escolha.
- Aplique o tema antes da primeira pintura com um script inline no `<head>` (veja *Começando → Next.js e SSR*).
- Atualize a meta `theme-color` se o navegador pintar a barra de endereço.

## Criando um tema

Para usar a cor da sua marca, sobrescreva os tokens `--or-color-accent*`, `--or-color-focus` e `--or-color-text-on-accent` nos dois temas. Escolha uma cor abaixo: o gerador calcula as variações, ajusta o `accent-text` até 4.5:1 e mostra os contrastes ao vivo.

- O acento como elemento gráfico (botão, borda de seleção) precisa de ≥ 3:1 contra o fundo; texto sobre ele, de ≥ 4.5:1.
- Se o mesmo valor não passa nos dois temas, use tons diferentes por tema — é o que o Orange faz com o laranja 500 e 600.
- Valide no seu CI com `contrastRatio()` de `@orangesys/tokens/contrast`, como em `contrast.test.ts`.
