# Switch

Liga ou desliga uma configuração com efeito imediato — trilho e polegar quadrados, laranja quando ligado.

- Categoria: Formulários · Status: estável
- Importação: `import { Switch } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/switch (em inglês: https://orange.llypedev.com.br/en/components/switch)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-switch--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Switch

## Boas práticas

- Use Switch para configurações que valem imediatamente, sem botão "Salvar". Em formulários enviados depois, use Checkbox.
- O rótulo nomeia a configuração ("Notificações por e-mail"), não a ação ("Ativar notificações") nem o estado ("Ligado").
- Em listas de configurações, use `labelPosition="start"`: o texto à esquerda e os switches alinhados à direita.
- Se a mudança demora ou falha, mostre o resultado (status ou toast) e volte o switch ao estado anterior em caso de erro.

- Faça: Rótulo afirmativo que nomeia a configuração.
- Evite: Rótulos negativos: "ligar" o "desativar" confunde.

## Exemplos

### Básico

```tsx
import { Switch } from '@orangesys/ui'

export default function Basic() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch label="Modo escuro" defaultChecked />
      <Switch label="Backup automático" description="Salvamos uma cópia dos seus arquivos todos os dias às 3h." />
    </div>
  )
}
```

### Lista de configurações

Rótulo à esquerda e switch à direita.

```tsx
import { Switch } from '@orangesys/ui'

const settings = [
  { id: 'comentarios', label: 'Comentários', description: 'Quando alguém comentar nos seus projetos.', on: true },
  { id: 'mencoes', label: 'Menções', description: 'Quando alguém mencionar você.', on: true },
  { id: 'convites', label: 'Convites', description: 'Quando você for adicionado a uma equipe.', on: false },
  { id: 'resumo', label: 'Resumo semanal', description: 'Um e-mail toda segunda-feira.', on: false },
]

export default function SettingsList() {
  return (
    <div style={{ width: '100%', maxWidth: 480, borderTop: '1px solid var(--or-color-border)' }}>
      {settings.map((item) => (
        <div key={item.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--or-color-border)' }}>
          <Switch labelPosition="start" label={item.label} description={item.description} defaultChecked={item.on} />
        </div>
      ))}
    </div>
  )
}
```

### Controlado

```tsx
import { Switch, Text } from '@orangesys/ui'
import { useState } from 'react'

export default function Controlled() {
  const [maintenance, setMaintenance] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch
        label="Modo manutenção"
        description="Visitantes verão uma página de aviso enquanto estiver ligado."
        checked={maintenance}
        onCheckedChange={setMaintenance}
      />
      <Text size="sm" tone={maintenance ? 'warning' : 'success'} role="status">
        {maintenance ? 'Site em manutenção — apenas administradores têm acesso.' : 'Site no ar para todos os visitantes.'}
      </Text>
    </div>
  )
}
```

### Tamanhos e estados

```tsx
import { Switch } from '@orangesys/ui'

export default function SizesStates() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Switch size="sm" label="Pequeno (sm)" defaultChecked />
      <Switch size="md" label="Médio (md)" defaultChecked />
      <Switch label="Desabilitado" disabled />
      <Switch label="Desabilitado e ligado" disabled defaultChecked />
    </div>
  )
}
```

## Props

### `Switch`

Liga/desliga uma configuração com efeito imediato. `<button role="switch">`
com `aria-checked`; Espaço e Enter alternam. Para escolhas que só valem ao
enviar um formulário, prefira `Checkbox`.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Ligado (controlado). |
| `defaultChecked` | `boolean` | `false` | Ligado inicialmente (não controlado). |
| `description` | `ReactNode` | — | Texto de apoio, ligado por `aria-describedby`. |
| `label` | `ReactNode` | — | Rótulo associado (clicável). Descreva a configuração, não o estado: "Notificações por e-mail". |
| `labelPosition` | `"start" \| "end"` | `end` | Posição do rótulo: `end` (depois do switch, padrão) ou `start` (antes, alinhado à esquerda — listas de configurações). |
| `name` | `string` | — | Envia `name=value` no formulário quando ligado. |
| `onCheckedChange` | `((checked: boolean) => void)` | — | Chamado com o novo estado. |
| `size` | `"sm" \| "md"` | `md` | Tamanho do trilho: `sm` ou `md` (padrão). |
| `value` | `string` | `on` | Valor enviado quando ligado. Padrão: `on`. |

Repassa também os atributos nativos (`ButtonHTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Movimento

Interações rápidas e geométricas, só com tokens de duração e curva. Com `prefers-reduced-motion`, as durações vão a zero e os estados mudam na hora — o movimento nunca é a única pista de estado.

- **Alternar** — O polegar desliza com --or-ease-spring (250ms) e o trilho troca de cor em 250ms (--or-duration-medium).
- **Hover e foco** — Borda mais forte, anel laranja suave e polegar mais claro — 160ms.
- **Pressionar** — No switch ou no rótulo, o polegar encolhe levemente (scale 0.82) em 90ms.

## Acessibilidade

Segue o padrão **Switch** do WAI-ARIA: um `<button type="button" role="switch">` com `aria-checked`, nomeado pelo `<label>` (via `aria-labelledby`), que também é clicável. O estado é indicado pela posição do polegar, além da cor.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o switch. |
| `Space` | Liga ou desliga. |
| `Enter` | Liga ou desliga. |

- **1.4.1** — Estado indicado pela posição do polegar, não só pela cor.
- **1.4.11** — Trilho e polegar com contraste mínimo de 3:1.
- **2.4.7** — Foco visível com contorno laranja de 2px.
- **2.5.8** — Área de toque de no mínimo 24px de altura.
- **4.1.2** — Nome, papel (switch) e estado (aria-checked) expostos.
