# Ícones

92 ícones de linha (grade 24×24, traço padrão 1.75 via `strokeWidth`, cor `currentColor`). Use `<Icon name="…" />`: sem `label` o ícone é decorativo (`aria-hidden`); com `label`, ganha nome acessível. Botão só com ícone: `IconButton` com `label` (obrigatório) ou `Button iconOnly` com `aria-label`. Props do `Icon` em `foundations.md`.

```tsx
import { Icon, IconButton } from '@orangesys/ui'

<Icon name="search" />
<Icon name="alert" label="Atenção" />
<IconButton icon="close" label="Fechar" />
```

Nomes disponíveis (`IconName`):

`accessibility` · `alert-circle` · `alert-triangle` · `align-center` · `align-left` · `align-right` · `arrow-down` · `arrow-down-to-line` · `arrow-left` · `arrow-right` · `arrow-up` · `arrow-up-right` · `arrow-up-to-line` · `arrows-up-down` · `bell` · `bold` · `book` · `calendar` · `chart-bar` · `check` · `check-circle` · `chevron-down` · `chevron-left` · `chevron-right` · `chevron-up` · `chevrons-left` · `chevrons-right` · `chevrons-up-down` · `circle` · `clock` · `close` · `code` · `command` · `copy` · `download` · `droplet` · `edit` · `external-link` · `eye` · `eye-off` · `file` · `filter` · `folder` · `folder-open` · `globe` · `grid` · `grip` · `heart` · `help-circle` · `home` · `image` · `inbox` · `info` · `italic` · `keyboard` · `layers` · `layout` · `link` · `list` · `lock` · `log-out` · `mail` · `menu` · `minus` · `monitor` · `moon` · `more-horizontal` · `more-vertical` · `pause` · `play` · `plus` · `redo` · `refresh` · `rocket` · `search` · `send` · `sliders` · `sparkle` · `square` · `star` · `sun` · `tag` · `terminal` · `trash` · `type` · `underline` · `undo` · `upload` · `user` · `users` · `x-circle` · `zap`
