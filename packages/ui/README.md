# @orangesys/ui

Componentes React acessíveis do **Orange**, um design system open source: geométrico, de cantos retos,
com um único acento laranja e WCAG 2.2 AA desde o primeiro componente.

- 103 componentes (formulários, sobreposições, navegação, exibição de dados, layout, gráficos)
- Temas escuro, claro e de alto contraste (`dark-hc`, `light-hc`), com suporte a `forced-colors`
- Textos internos em português e inglês, motion que respeita `prefers-reduced-motion`
- CSS puro com tokens — sem CSS-in-JS

**Documentação:** https://orange.llypedev.com.br · **Storybook:** https://orange.llypedev.com.br/storybook/

## Instalação

```bash
pnpm add @orangesys/ui
```

Requer `react` e `react-dom` 18.2 ou 19.

## Uso

```tsx
import '@orangesys/ui/styles.css'
import { Button, OrangeProvider } from '@orangesys/ui'

export function App() {
  return (
    <OrangeProvider defaultTheme="system" locale="pt-BR">
      <Button variant="primary">Salvar</Button>
    </OrangeProvider>
  )
}
```

O `OrangeProvider` aplica o tema (`dark`, `light`, `dark-hc`, `light-hc` ou `system`) e o idioma das
mensagens internas. O guia completo está em
[Começando](https://orange.llypedev.com.br/pt/getting-started).

## Versionamento

Segue SemVer, com a política de depreciação descrita em
[Versionamento e depreciação](https://orange.llypedev.com.br/pt/usage/versioning). As mudanças de cada
versão estão no `CHANGELOG.md`.

## Licença

MIT
