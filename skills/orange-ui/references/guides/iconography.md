# Iconografia

${iconNames.length} ícones desenhados para o Orange: grade de 24px, traço de 1.75, terminações quadradas e cantos vivos. Leves, geométricos e coerentes com as bordas de 1px do resto do sistema.

## Princípios

- **Grade de 24×24** Desenho dentro de uma área viva de 20×20, com 2px de respiro em cada lado.
- **Traço de 1.75** Contorno, nunca preenchimento. Escala junto com o tamanho do ícone.
- **Terminações quadradas** `stroke-linecap: square` · `stroke-linejoin: miter`
- **Cantos vivos** Curvas só onde a forma pede (círculos, relógio). Nada de cantos arredondados decorativos.
- **currentColor** O ícone herda a cor do texto ao redor e acompanha o tema.

## Tamanhos

Use os tamanhos nomeados da prop `size`; um número em pixels também é aceito para casos especiais. Acompanhe a altura do texto ou do controle onde o ícone está.

## Decorativo ou informativo

Por padrão o `Icon` é **decorativo**: recebe `aria-hidden` e o leitor de tela o ignora. Isso é o certo quando há texto ao lado. Quando o ícone é a única forma de transmitir a informação, ele é **informativo**: passe `label` e ele ganha `role="img"` e `aria-label`.

### Exemplo

```tsx
import { Button, Icon } from '@orangesys/ui'

{/* Decorativo: o texto já diz tudo */}
<Button startIcon={<Icon name="download" />}>Exportar CSV</Button>

{/* Informativo: sem texto ao lado, precisa de label */}
<Icon name="lock" label="Arquivo protegido" />

{/* Botão só com ícone: o nome vai no botão */}
<Button iconOnly variant="outline" aria-label="Excluir relatório">
  <Icon name="trash" />
</Button>
```

## Galeria

Clique em um ícone para copiar `<Icon name="…" />`. A busca filtra pelo nome em inglês, em kebab-case.

## Uso

- Faça: Ícone do mesmo tamanho da fonte e na cor do texto.
- Faça: Um ícone por botão, reforçando o rótulo.
- Evite: Ícone maior que o texto e pintado de laranja só para enfeitar.
- Evite: Dois ícones disputando o mesmo rótulo.

- Um conceito, um ícone: “excluir” é sempre trash, “fechar” é sempre close.
- Ícones direcionais (`arrow-right`, `chevron-right`) indicam movimento ou navegação; `arrow-up-right` sinaliza link externo.
- Ícones informativos isolados precisam de ≥ 3:1 de contraste com o fundo (1.4.11) — currentColor sobre text e text-muted já garante.

## Como adicionar um ícone

### 1. Desenhe na grade de 24px

Área viva de 20×20, traço de 1.75 sem preenchimento, terminações quadradas e junções em quina. Exporte com viewBox 0 0 24 24.

### 2. Simplifique o SVG

Use apenas `<path>`, `<circle>`, `<rect>` ou `<line>`, sem `fill`, `stroke` ou `style` — o componente define tudo isso.

### 3. Registre em paths.tsx

Adicione uma chave em `packages/ui/src/icons/paths.tsx`, em ordem alfabética e kebab-case. O tipo `IconName` e a lista `iconNames` se atualizam sozinhos.

`packages/ui/src/icons/paths.tsx`:

```tsx
export const iconPaths = {
  // …
  'credit-card': <path d="M3 5.5h18v13H3zM3 10h18M6.5 15h4" />,
  // …
}
```

### 4. Confira e abra o PR

Veja o ícone nesta galeria e no Storybook (Fundamentos/Ícones) nos dois temas e nos tamanhos sm a xl antes de abrir o pull request.

> **Por que não uma biblioteca externa?** Ícones próprios garantem o mesmo traço e as mesmas terminações em todo o sistema, sem dependência extra. Se precisar de muitos ícones de domínio, mantenha as regras de desenho acima ao misturar fontes.
