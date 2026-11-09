# @orangesys/ui

Componentes React acessíveis do **Orange**, um design system open source: geométrico, de cantos retos,
com um único acento laranja e WCAG 2.2 AA desde o primeiro componente.

- 117 componentes (formulários, sobreposições, navegação, exibição de dados, layout, gráficos, conteúdo)
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

### Só o CSS do que você usa

O `styles.css` tem o CSS de todos os componentes (cerca de 65 KB em gzip). Se a aplicação usa poucos,
importe-os de `@orangesys/ui/with-css` — sem importar o `styles.css` — e o bundler leva para a página
só o CSS deles, mais a base (cerca de 6 KB):

```tsx
import { Button, OrangeProvider } from '@orangesys/ui/with-css'
import './app.css' // o seu CSS, depois dos componentes
```

Mesmos exports e tipos da entrada principal. Depende de um bundler que processe `import './x.css'`
dentro das dependências e descarte módulos não usados (verificado com o Vite); só existe em ESM e
não serve para rodar no Node sem bundler. Detalhes em
[Estilos](https://orange.llypedev.com.br/pt/usage/styles).

## Versionamento

Segue SemVer, com a política de depreciação descrita em
[Versionamento e depreciação](https://orange.llypedev.com.br/pt/usage/versioning). As mudanças de cada
versão estão no `CHANGELOG.md`.

## Licença

MIT
