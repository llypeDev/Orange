# Modal

Diálogo modal que interrompe a tarefa atual para pedir uma decisão ou informação, com foco preso e retorno ao gatilho.

- Categoria: Sobreposições · Status: estável
- Importação: `import { Modal, ModalBody, ModalFooter } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/modal (em inglês: https://orange.llypedev.com.br/en/components/modal)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-modal--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/Modal

## Boas práticas

- Use o Modal só quando a tarefa exige atenção imediata: uma decisão, um formulário curto, uma confirmação. Para conteúdo que pode conviver com a página, prefira um Drawer, um Popover ou uma página própria.
- O título diz o que o usuário vai fazer — **Convidar pessoas**, não **Atenção**. Use a descrição para a consequência ou o contexto.
- No rodapé, a ação principal fica à direita e com verbo específico; Cancelar fica à esquerda dela. Uma única ação primária.
- Não empilhe modais. Se precisar de uma confirmação dentro de um modal, use o ConfirmDialog — e só para ações destrutivas.
- Desligue `closeOnOverlayClick` quando houver dados digitados que se perderiam com um clique acidental.

- Faça: Título com a tarefa, corpo com a consequência e uma ação primária específica.
- Evite: Título genérico, pergunta vaga e duas ações primárias "Sim/Não".

## Anatomia

- **Título** — Obrigatório. Nomeia o diálogo via `aria-labelledby`.
- **Descrição** — Opcional. Lida junto com o título via `aria-describedby`.
- **Botão fechar** — Sempre presente no cabeçalho (a menos que hideCloseButton). Rótulo traduzido "Fechar".
- **ModalBody** — Conteúdo principal. Rola internamente quando passa da altura da tela.
- **ModalFooter** — Ações alinhadas à direita, separadas do corpo por uma borda.

## Exemplos

### Formulário curto

Com `trigger`, o Modal controla o próprio estado. `children` pode ser uma função que recebe `close`. O foco vai para o primeiro campo.

```tsx
import { Button, Field, Modal, ModalBody, ModalFooter } from '@orangesys/ui'

export default function Basic() {
  return (
    <Modal
      title="Convidar pessoas"
      description="Elas receberão um e-mail com acesso ao projeto Site 2026."
      trigger={<Button>Convidar pessoas</Button>}
    >
      {({ close }) => (
        <>
          <ModalBody>
            <div style={{ display: 'grid', gap: 16 }}>
              <Field
                label="E-mail"
                controlId="convite-email"
                description="Separe vários endereços com vírgula."
              >
                <input
                  id="convite-email"
                  className="or-control"
                  type="email"
                  placeholder="nome@empresa.com"
                />
              </Field>
              <Field label="Permissão" controlId="convite-permissao">
                <select id="convite-permissao" className="or-control" defaultValue="editar">
                  <option value="ver">Pode ver</option>
                  <option value="comentar">Pode comentar</option>
                  <option value="editar">Pode editar</option>
                </select>
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={close}>
              Cancelar
            </Button>
            <Button onClick={close}>Enviar convite</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}
```

### Tamanhos

sm (400px), md (560px, padrão), lg (800px) e full (tela inteira).

```tsx
import { Button, Modal, ModalBody, ModalFooter, type ModalSize } from '@orangesys/ui'

const sizes: { size: ModalSize; label: string }[] = [
  { size: 'sm', label: 'Pequeno (400px)' },
  { size: 'md', label: 'Médio (560px)' },
  { size: 'lg', label: 'Grande (800px)' },
  { size: 'full', label: 'Tela inteira' },
]

export default function Sizes() {
  return (
    <>
      {sizes.map(({ size, label }) => (
        <Modal
          key={size}
          size={size}
          title={label}
          description="A largura acompanha a quantidade de conteúdo."
          trigger={<Button variant="outline">{label}</Button>}
        >
          {({ close }) => (
            <>
              <ModalBody>
                <p>
                  Use <strong>sm</strong> para confirmações curtas, <strong>md</strong> para
                  formulários simples, <strong>lg</strong> para tabelas e prévias e{' '}
                  <strong>full</strong> para editores e fluxos longos.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button onClick={close}>Entendi</Button>
              </ModalFooter>
            </>
          )}
        </Modal>
      ))}
    </>
  )
}
```

### Conteúdo longo

Cabeçalho e rodapé ficam fixos; só o ModalBody rola. Aqui o clique no fundo está desligado.

```tsx
import { Button, Modal, ModalBody, ModalFooter } from '@orangesys/ui'

const clausulas = [
  'Coletamos apenas os dados necessários para operar sua conta: nome, e-mail e informações de uso.',
  'Os projetos ficam armazenados em servidores no Brasil e são copiados diariamente.',
  'Você pode exportar ou excluir seus dados a qualquer momento em Configurações → Privacidade.',
  'Integrações de terceiros só acessam os dados que você autorizar explicitamente.',
  'Avisaremos por e-mail com 30 dias de antecedência sobre mudanças nestes termos.',
  'Contas inativas por mais de 24 meses podem ser arquivadas após aviso prévio.',
  'O uso da API está sujeito aos limites do seu plano.',
  'Conteúdo publicado continua sendo seu; concedemos apenas a licença necessária para exibi-lo.',
]

export default function Scrolling() {
  return (
    <Modal
      title="Termos de uso"
      description="Versão de março de 2026"
      closeOnOverlayClick={false}
      trigger={<Button variant="outline">Revisar termos</Button>}
    >
      {({ close }) => (
        <>
          <ModalBody>
            <ol style={{ display: 'grid', gap: 12, paddingLeft: 20, margin: 0 }}>
              {[...clausulas, ...clausulas].map((texto, i) => (
                <li key={i}>{texto}</li>
              ))}
            </ol>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={close}>
              Recusar
            </Button>
            <Button onClick={close}>Aceitar termos</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}
```

### Controlado com foco inicial

`open` + `onOpenChange` para controlar o estado e `initialFocus` para escolher quem recebe o foco. Um `<form>` pode envolver corpo e rodapé.

```tsx
import { Button, Field, Modal, ModalBody, ModalFooter } from '@orangesys/ui'
import { useRef, useState } from 'react'

export default function Controlled() {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState('Site institucional')
  const [rascunho, setRascunho] = useState(nome)
  const inputRef = useRef<HTMLInputElement>(null)

  const abrir = () => {
    setRascunho(nome)
    setOpen(true)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <span>
        Projeto: <strong>{nome}</strong>
      </span>
      <Button variant="outline" onClick={abrir}>
        Renomear
      </Button>
      <Modal
        title="Renomear projeto"
        size="sm"
        open={open}
        onOpenChange={setOpen}
        initialFocus={inputRef}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setNome(rascunho.trim() || nome)
            setOpen(false)
          }}
        >
          <ModalBody>
            <Field label="Nome do projeto" controlId="renomear-projeto" required>
              <input
                ref={inputRef}
                id="renomear-projeto"
                className="or-control"
                value={rascunho}
                onChange={(event) => setRascunho(event.target.value)}
                required
              />
            </Field>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar nome</Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  )
}
```

## Movimento

- **Abrir** — Painel sobe 8px com escala 0,98 → 1 e opacidade; o fundo faz fade. 250ms (--or-duration-medium), --or-ease-out.
- **Fechar** — Painel desce 4px e some; fundo em fade. 160ms (--or-duration-fast), --or-ease-in-out. O conteúdo fica inerte durante a saída.
- **Botões** — Afundam 1px ao pressionar. 90ms (--or-duration-press).
- **prefers-reduced-motion** — Durações e distâncias vão a zero: o componente aparece e some na hora, sem deslocamento.

## Props

### `Modal`

Diálogo modal: interrompe a tarefa atual para pedir uma decisão ou
informação. Prende o foco, bloqueia o scroll da página e fecha com Escape.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `title` (obrigatória) | `ReactNode` | — | Título visível; nomeia o diálogo via `aria-labelledby`. |
| `children` | `ReactNode \| ((props: ModalRenderProps) => ReactNode)` | — | Conteúdo: use `ModalBody` e `ModalFooter`. Aceita uma função `({ close }) => …`. |
| `closeOnEscape` | `boolean` | `true` | Fecha com a tecla Escape. |
| `closeOnOverlayClick` | `boolean` | `true` | Fecha ao clicar no fundo escurecido. |
| `defaultOpen` | `boolean` | — | Aberto inicialmente (não controlado). |
| `description` | `ReactNode` | — | Texto de apoio sob o título; descreve o diálogo via `aria-describedby`. |
| `finalFocus` | `RefObject<HTMLElement \| null>` | — | Elemento que recebe o foco ao fechar. Padrão: o que estava focado antes de abrir. |
| `hideCloseButton` | `boolean` | `false` | Esconde o botão de fechar do cabeçalho. Garanta outra forma de fechar. |
| `initialFocus` | `RefObject<HTMLElement \| null>` | — | Elemento que recebe o foco ao abrir. Padrão: primeiro elemento focável do conteúdo (ou o que tiver `data-autofocus`). |
| `onOpenChange` | `((open: boolean) => void)` | — | Chamado quando o diálogo pede para abrir ou fechar. |
| `open` | `boolean` | — | Aberto (controlado). Use com `onOpenChange`. |
| `size` | `"sm" \| "md" \| "lg" \| "full"` | `md` | Largura: `sm` 400px, `md` 560px, `lg` 800px, `full` tela inteira. |
| `trigger` | `ReactElement<unknown, string \| JSXElementConstructor<any>>` | — | Elemento que abre o diálogo (modo não controlado). Recebe `onClick` e `aria-haspopup="dialog"`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `ModalBody`

Corpo do Modal. Rola internamente quando o conteúdo passa da altura disponível.

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### `ModalFooter`

Rodapé do Modal com as ações, alinhadas à direita (a principal por último).

Sem props próprias.

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

### Tipos

`ModalSize`:

```ts
export type ModalSize = 'sm' | 'md' | 'lg' | 'full'
```

## Acessibilidade

Segue o padrão *Dialog (Modal)* do WAI-ARIA APG: `role="dialog"` com `aria-modal="true"`, nome pelo título e descrição pelo texto de apoio. O conteúdo é renderizado em portal, o foco fica preso dentro do diálogo, o scroll da página é bloqueado e, ao fechar, o foco volta para quem abriu. Sobreposições abertas dentro do Modal (Popover, Dropdown, Tooltip) ficam acima dele e Escape fecha uma camada por vez.

| Teclas | Ação |
| --- | --- |
| `Tab` | Próximo elemento focável dentro do diálogo; do último volta ao primeiro. |
| `Shift` + `Tab` | Elemento anterior; do primeiro vai ao último. |
| `Esc` | Fecha o diálogo e devolve o foco ao gatilho. |

- **1.3.1** — Título e descrição ligados por aria-labelledby/aria-describedby.
- **2.1.2** — Sem armadilha de teclado: Escape e o botão Fechar sempre saem do diálogo.
- **2.4.3** — Ordem de foco previsível: entra no diálogo ao abrir e volta ao gatilho ao fechar.
- **2.4.7** — Todos os controles mantêm o foco visível laranja.
- **4.1.2** — Papel `dialog`, estado modal e botão Fechar com nome acessível traduzido.
