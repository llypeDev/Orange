# Modelo: Configurações

- Ao vivo: https://orange.llypedev.com.br/pt/templates/settings

Página de configurações da loja: seções com Fieldset, campos de vários tipos, envio de logo, barra de salvar presa ao rodapé com aviso de sucesso e uma zona de perigo com confirmação.

Configurações costumam ser formulários longos, editados aos poucos. Este modelo divide a página em seções com título (`Fieldset` com um `h2` na legenda), mostra se há alterações não salvas, mantém Salvar sempre à mão e separa as ações destrutivas do resto — cada uma com a sua confirmação.

## Componentes usados

- **app-shell** (`components/app-shell.md`) — Área de configurações com navigation próprio e navDrawerBelow="md": a barra lateral fica visível já a partir de 768px.
- **side-nav** (`components/side-nav.md`) — Páginas das configurações (Loja é a atual) e o caminho de volta ao painel.
- **page-header** (`components/page-header.md`) — Título da página com o estado da loja (Tag) ao lado.
- **form** (`components/form.md`) — Validação no envio, resumo de erros com links e foco no resumo — inclusive para o Listbox, que envia por inputs ocultos.
- **fieldset** (`components/fieldset.md`) — Uma seção por assunto; a legenda é anunciada ao entrar no grupo e contém o título da seção.
- **text-field** (`components/text-field.md`) — Nome, endereço da vitrine (com prefixo e sufixo fixos) e e-mail da equipe.
- **file-uploader** (`components/file-uploader.md`) — Logo com tipos e tamanho informados na descrição; arquivos recusados entram na lista com o motivo.
- **select** (`components/select.md`) — Fuso horário e idioma: escolhas simples, com o select nativo.
- **listbox** (`components/listbox.md`) — Canais de venda: seleção múltipla sempre visível, com descrição por opção.
- **radio-group** (`components/radio-group.md`) — O que fazer com produtos esgotados: três opções exclusivas em cartões, cada uma explicando a consequência.
- **checkbox** (`components/checkbox.md`) — Avisos por e-mail: escolhas que só valem ao salvar o formulário — por isso Checkbox, e não Switch (que é para efeito imediato).
- **confirm-dialog** (`components/confirm-dialog.md`) — Pausar vendas (neutro, controlado) e excluir a loja (danger: foco inicial em Cancelar, botão em carregamento enquanto a API responde).
- **toast** (`components/toast.md`) — Confirma o que deu certo sem tirar o foco do lugar; "Desfazer" no aviso de pausa.

## Acessibilidade

- **Landmarks** (1.3.1 · 2.4.1) — Cabeçalho, navegação das configurações (nomeada), conteúdo principal e o link "Pular para o conteúdo principal". A zona de perigo é uma seção nomeada pelo seu título, fora do formulário.
- **Ordem dos títulos** (1.3.1 · 2.4.6) — "Loja" e, abaixo dele, um título por seção — dentro da legenda de cada Fieldset, então o grupo e o título têm o mesmo nome — e "Zona de perigo" por último.
- **Ordem do foco** (2.4.3 · 2.4.11) — Campos na ordem de leitura, depois Descartar e Salvar, depois a zona de perigo. scroll-padding reserva espaço para o cabeçalho fixo e para a barra de salvar: o campo em foco nunca fica escondido atrás deles. Os diálogos prendem o foco e o devolvem ao botão que os abriu.
- **Tratamento de erros** (3.3.1 · 3.3.3) — Validação só no envio, com mensagens que dizem o formato esperado. O resumo recebe o foco e os erros somem conforme são corrigidos. Arquivos de logo recusados aparecem na lista com o motivo.
- **Estado e confirmações** (3.3.4 · 4.1.3) — "Alterações não salvas" é anunciado educadamente; o sucesso vem em um Toast, sem mover o foco. Excluir pede confirmação em um diálogo danger, com o foco inicial em Cancelar.
- **Refluxo** (1.4.10) — Em 390px a navegação vai para o painel, os selects empilham e a barra de salvar quebra em duas linhas, sem rolagem horizontal.

## Código

`Settings.tsx`:

```tsx
import {
  AppHeader,
  AppShell,
  AppShellNavToggle,
  Button,
  Checkbox,
  ConfirmDialog,
  Fieldset,
  FileUploader,
  Form,
  Grid,
  Heading,
  Icon,
  IconButton,
  Listbox,
  ListboxOption,
  PageHeader,
  RadioGroup,
  Select,
  SideNav,
  SideNavItem,
  SideNavSection,
  Stack,
  Tag,
  Text,
  TextField,
  ToastProvider,
  useToast,
  type FileUploaderItem,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'
import { useEffect, useId, useRef, useState } from 'react'
import './Settings.css'

interface Configuracoes {
  nome: string
  endereco: string
  fuso: string
  idioma: string
  canais: string[]
  esgotado: string
  emailAvisos: string
  avisos: string[]
  logo: FileUploaderItem[]
}

/** O que veio da API. Em um app, carregue antes de montar o formulário. */
const iniciais: Configuracoes = {
  nome: 'Aurora Centro',
  endereco: 'aurora-centro',
  fuso: 'America/Sao_Paulo',
  idioma: 'pt-BR',
  canais: ['site', 'app'],
  esgotado: 'mostrar',
  emailAvisos: 'operacao@aurora-centro.com.br',
  avisos: ['novo-pedido', 'estoque-baixo'],
  logo: [],
}

const text = (value: FormValues[string]) => (typeof value === 'string' ? value.trim() : '')
const list = (value: FormValues[string]) =>
  (Array.isArray(value) ? value : value === undefined ? [] : [value]).filter(
    (item): item is string => typeof item === 'string',
  )

function validate(values: FormValues): FormErrors {
  const endereco = text(values.endereco)
  const email = text(values.emailAvisos)
  return {
    nome: text(values.nome) ? undefined : 'Informe o nome da loja.',
    endereco: !endereco
      ? 'Informe o endereço da vitrine.'
      : /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(endereco)
        ? undefined
        : 'Use de 3 a 30 letras minúsculas, números ou hífens, sem hífen no começo ou no fim.',
    canais: list(values.canais).length > 0 ? undefined : 'Escolha ao menos um canal de venda.',
    emailAvisos: !email
      ? 'Informe o e-mail que recebe os avisos.'
      : /^\S+@\S+\.\S+$/.test(email)
        ? undefined
        : 'Informe um e-mail no formato equipe@empresa.com.br.',
  }
}

/** Retrato dos valores, para saber se há alterações não salvas. */
function retrato(form: HTMLFormElement | null, logo: FileUploaderItem[]) {
  const partes: string[] = []
  if (form) new FormData(form).forEach((value, key) => partes.push(`${key}=${typeof value === 'string' ? value : value.name}`))
  logo.forEach((item) => partes.push(`logo=${item.file.name}:${item.file.size}`))
  return partes.join('&')
}

const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function SettingsScreen() {
  const { toast } = useToast()
  const formId = useId()
  const perigoId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const logoRef = useRef<FileUploaderItem[]>(iniciais.logo)
  const base = useRef('')
  const [salvo, setSalvo] = useState<Configuracoes>(iniciais)
  // Trocar a versão remonta o formulário com os valores salvos (botão "Descartar").
  const [versao, setVersao] = useState(0)
  const [alterado, setAlterado] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [pausada, setPausada] = useState(false)
  const [confirmarPausa, setConfirmarPausa] = useState(false)

  useEffect(() => {
    base.current = retrato(formRef.current, logoRef.current)
  }, [versao, salvo])

  // Espera o React aplicar a mudança (input oculto do Listbox) antes de comparar.
  const conferir = () => {
    window.setTimeout(() => setAlterado(retrato(formRef.current, logoRef.current) !== base.current), 0)
  }

  const salvar = async (values: FormValues) => {
    setSalvando(true)
    await esperar(900) // troque pela chamada à API
    setSalvo({
      nome: text(values.nome),
      endereco: text(values.endereco),
      fuso: text(values.fuso),
      idioma: text(values.idioma),
      canais: list(values.canais),
      esgotado: text(values.esgotado),
      emailAvisos: text(values.emailAvisos),
      avisos: list(values.avisos),
      logo: logoRef.current.filter((item) => item.status !== 'error'),
    })
    setSalvando(false)
    setAlterado(false)
    toast({ tone: 'success', title: 'Configurações salvas', description: 'As mudanças já valem para a loja.' })
  }

  const descartar = () => {
    logoRef.current = salvo.logo
    setVersao((v) => v + 1)
    setAlterado(false)
  }

  const pausar = () => {
    setPausada(true)
    toast({
      tone: 'warning',
      title: 'Vendas pausadas',
      description: 'A vitrine mostra um aviso e não aceita pedidos novos.',
      action: { label: 'Desfazer', onClick: () => setPausada(false) },
    })
  }

  const excluir = async () => {
    await esperar(1200) // troque pela chamada à API
    toast({
      tone: 'danger',
      title: 'Exclusão agendada',
      description: 'A loja saiu do ar e será apagada em 30 dias.',
    })
  }

  return (
    // O AppShell cria o <main> e o link "Pular para o conteúdo principal".
    <AppShell
      className="aurora-settings"
      navDrawerBelow="md"
      header={
        <AppHeader
          brand={
            <>
              <AppShellNavToggle />
              <a href="#inicio" aria-label="Aurora — início">
                <Icon name="layers" /> Aurora
              </a>
            </>
          }
          actions={<IconButton icon="help-circle" label="Central de ajuda" variant="ghost" />}
        />
      }
      navLabel="Seções das configurações"
      navTitle="Configurações"
      navigation={
        <SideNav currentHref="#loja">
          <SideNavItem href="#painel" icon={<Icon name="arrow-left" />}>
            Voltar ao painel
          </SideNavItem>
          <SideNavSection title="Configurações">
            <SideNavItem href="#loja" icon={<Icon name="home" />}>
              Loja
            </SideNavItem>
            <SideNavItem href="#pagamentos" icon={<Icon name="tag" />}>
              Pagamentos
            </SideNavItem>
            <SideNavItem href="#entregas" icon={<Icon name="send" />}>
              Entregas
            </SideNavItem>
            <SideNavItem href="#equipe" icon={<Icon name="users" />}>
              Equipe
            </SideNavItem>
            <SideNavItem href="#integracoes" icon={<Icon name="zap" />}>
              Integrações
            </SideNavItem>
          </SideNavSection>
        </SideNav>
      }
    >
      <PageHeader
        eyebrow="Configurações"
        title="Loja"
        description="Dados da loja Aurora Centro, canais de venda e avisos para a equipe."
        meta={pausada ? <Tag tone="warning">Vendas pausadas</Tag> : <Tag tone="success">Vendendo</Tag>}
        divider
      />

      <div className="aurora-settings__content">
        {/* O formulário e a barra de salvar dividem o mesmo contêiner: a barra fica
            presa no rodapé da tela enquanto o formulário está à vista. */}
        <div className="aurora-settings__editor">
          <Form
            key={versao}
            id={formId}
            ref={formRef}
            aria-label="Configurações da loja"
            validate={validate}
            onSubmit={salvar}
            gap="lg"
            onInputCapture={conferir}
            onChangeCapture={conferir}
            onClickCapture={conferir}
            onKeyUpCapture={conferir}
          >
            {({ errors }) => (
              <>
                <Fieldset
                  className="aurora-settings__section"
                  legend={
                    <Heading level={2} size="lg" className="aurora-settings__legend-title">
                      Identidade da loja
                    </Heading>
                  }
                  description="Como a loja aparece na vitrine, nos pedidos e nos e-mails."
                >
                  <TextField
                    name="nome"
                    label="Nome da loja"
                    defaultValue={salvo.nome}
                    autoComplete="organization"
                    required
                    error={errors.nome}
                  />
                  <TextField
                    name="endereco"
                    label="Endereço da vitrine"
                    description="Letras minúsculas, números e hífens."
                    prefix="https://"
                    suffix=".aurora.app"
                    defaultValue={salvo.endereco}
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    error={errors.endereco}
                  />
                  <FileUploader
                    label="Logo"
                    description="PNG ou SVG quadrado, até 1 MB. Aparece no topo da vitrine e nos e-mails."
                    accept=".png,.svg,image/png,image/svg+xml"
                    maxSize={1024 * 1024}
                    optional
                    defaultValue={salvo.logo}
                    onChange={(items) => {
                      logoRef.current = items
                      conferir()
                    }}
                  />
                  <Grid minItemWidth="14rem" gap={5}>
                    <Select
                      name="fuso"
                      label="Fuso horário"
                      description="Usado nos relatórios e nos prazos."
                      defaultValue={salvo.fuso}
                      options={[
                        { value: 'America/Noronha', label: 'Fernando de Noronha (UTC−2)' },
                        { value: 'America/Sao_Paulo', label: 'Brasília (UTC−3)' },
                        { value: 'America/Manaus', label: 'Manaus (UTC−4)' },
                        { value: 'America/Rio_Branco', label: 'Rio Branco (UTC−5)' },
                      ]}
                    />
                    <Select
                      name="idioma"
                      label="Idioma da vitrine"
                      description="Textos automáticos e e-mails aos clientes."
                      defaultValue={salvo.idioma}
                      options={[
                        { value: 'pt-BR', label: 'Português (Brasil)' },
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Español' },
                      ]}
                    />
                  </Grid>
                </Fieldset>

                <Fieldset
                  className="aurora-settings__section"
                  legend={
                    <Heading level={2} size="lg" className="aurora-settings__legend-title">
                      Vendas e estoque
                    </Heading>
                  }
                  description="Onde a loja vende e o que acontece quando o estoque acaba."
                >
                  <Listbox
                    name="canais"
                    label="Canais de venda"
                    description="Os pedidos de todos os canais aparecem no painel."
                    selectionMode="multiple"
                    defaultValue={salvo.canais}
                    required
                    error={errors.canais}
                  >
                    <ListboxOption value="site" icon={<Icon name="globe" />} description="Vitrine própria na Aurora">
                      Loja virtual
                    </ListboxOption>
                    <ListboxOption value="app" icon={<Icon name="monitor" />} description="Aplicativo da loja para Android e iOS">
                      Aplicativo
                    </ListboxOption>
                    <ListboxOption value="marketplace" icon={<Icon name="layers" />} description="Catálogo sincronizado com marketplaces parceiros">
                      Marketplaces
                    </ListboxOption>
                    <ListboxOption value="pdv" icon={<Icon name="home" />} description="Vendas no balcão, com o mesmo estoque">
                      Loja física
                    </ListboxOption>
                  </Listbox>
                  <RadioGroup
                    name="esgotado"
                    label="Quando um produto esgotar"
                    variant="card"
                    defaultValue={salvo.esgotado}
                    options={[
                      { value: 'ocultar', label: 'Ocultar da vitrine', description: 'O produto some até voltar ao estoque.' },
                      {
                        value: 'mostrar',
                        label: 'Mostrar como esgotado',
                        description: 'Continua visível, com a compra desativada e um aviso de reposição.',
                      },
                      {
                        value: 'encomenda',
                        label: 'Aceitar encomenda',
                        description: 'Vende sem estoque e informa o prazo de entrega na página do produto.',
                      },
                    ]}
                  />
                </Fieldset>

                <Fieldset
                  className="aurora-settings__section"
                  legend={
                    <Heading level={2} size="lg" className="aurora-settings__legend-title">
                      Avisos por e-mail
                    </Heading>
                  }
                  description="Quem recebe os avisos da loja e quando."
                >
                  <TextField
                    name="emailAvisos"
                    type="email"
                    label="E-mail da equipe"
                    description="Use uma caixa compartilhada da empresa."
                    defaultValue={salvo.emailAvisos}
                    autoComplete="off"
                    spellCheck={false}
                    required
                    error={errors.emailAvisos}
                  />
                  {/* Checkbox, não Switch: as escolhas só valem ao clicar em "Salvar alterações". */}
                  <Stack gap={4} separator>
                    <Checkbox
                      name="avisos"
                      value="novo-pedido"
                      label="Novo pedido recebido"
                      defaultChecked={salvo.avisos.includes('novo-pedido')}
                    />
                    <Checkbox
                      name="avisos"
                      value="estoque-baixo"
                      label="Estoque abaixo do mínimo"
                      description="Um e-mail por produto, no máximo uma vez por dia."
                      defaultChecked={salvo.avisos.includes('estoque-baixo')}
                    />
                    <Checkbox
                      name="avisos"
                      value="resumo-semanal"
                      label="Resumo semanal de vendas"
                      description="Toda segunda-feira, às 8h."
                      defaultChecked={salvo.avisos.includes('resumo-semanal')}
                    />
                  </Stack>
                </Fieldset>
              </>
            )}
          </Form>

          <div className="aurora-settings__savebar">
            <Text size="sm" tone={alterado ? 'default' : 'muted'} aria-live="polite" className="aurora-settings__status">
              {alterado ? 'Você tem alterações não salvas.' : 'Tudo salvo.'}
            </Text>
            <div className="aurora-settings__actions">
              <Button type="button" variant="ghost" onClick={descartar}>
                Descartar
              </Button>
              {/* Fora do <form>, o botão envia pelo atributo form. */}
              <Button type="submit" form={formId} loading={salvando} loadingText="Salvando alterações">
                Salvar alterações
              </Button>
            </div>
          </div>
        </div>

        <section className="aurora-settings__danger" aria-labelledby={perigoId}>
          <Heading level={2} size="lg" id={perigoId}>
            Zona de perigo
          </Heading>
          <ul className="aurora-settings__danger-list">
            <li>
              <div>
                <Text weight="semibold">{pausada ? 'Retomar as vendas' : 'Pausar as vendas'}</Text>
                <Text size="sm" tone="muted">
                  A vitrine continua no ar com um aviso, mas não aceita pedidos novos.
                </Text>
              </div>
              <Button variant="outline" onClick={() => (pausada ? setPausada(false) : setConfirmarPausa(true))}>
                {pausada ? 'Retomar vendas' : 'Pausar vendas'}
              </Button>
            </li>
            <li>
              <div>
                <Text weight="semibold">Excluir a loja</Text>
                <Text size="sm" tone="muted">
                  Apaga produtos, pedidos e relatórios. Depois de 30 dias, não dá para recuperar.
                </Text>
              </div>
              <ConfirmDialog
                tone="danger"
                title="Excluir a loja Aurora Centro?"
                description="A loja sai do ar agora. Produtos, pedidos e relatórios são apagados em 30 dias; até lá, o suporte ainda consegue restaurar."
                confirmLabel="Excluir loja"
                loadingText="Excluindo a loja"
                onConfirm={excluir}
                trigger={<Button variant="danger">Excluir loja</Button>}
              />
            </li>
          </ul>
        </section>
      </div>

      <ConfirmDialog
        open={confirmarPausa}
        onOpenChange={setConfirmarPausa}
        title="Pausar as vendas da loja?"
        description="Clientes ainda veem a vitrine, mas não conseguem comprar até você retomar."
        confirmLabel="Pausar vendas"
        onConfirm={pausar}
      />
    </AppShell>
  )
}

export default function Settings() {
  return (
    // Em um app, o ToastProvider fica uma vez só, na raiz.
    <ToastProvider position="top-right">
      <SettingsScreen />
    </ToastProvider>
  )
}
```

`Settings.css`:

```css
/*
 * Configurações — página "Loja" da área de configurações da Aurora.
 * A estrutura vem do AppShell; aqui ficam a coluna do formulário, a barra de
 * salvar presa ao rodapé e a zona de perigo. Só tokens do Orange.
 */

/* O cabeçalho fixo e a barra de salvar não podem cobrir o campo em foco (WCAG 2.4.11):
   ao navegar com Tab, o navegador rola deixando essa folga em cima e embaixo. */
:root:has(.aurora-settings) {
  scroll-padding-block: calc(var(--or-layout-header-height) + var(--or-space-4)) calc(var(--or-space-24) + var(--or-space-4));
}

.aurora-settings__content {
  display: grid;
  gap: var(--or-space-12);
  max-width: 46rem;
  margin-top: var(--or-space-8);
}

.aurora-settings__editor {
  display: grid;
  gap: var(--or-space-8);
  min-width: 0;
}

/* Seções separadas por uma linha de 1px. Classes do modelo, não as internas dos componentes. */
.aurora-settings__editor .aurora-settings__section + .aurora-settings__section {
  padding-top: var(--or-space-8);
  border-top: var(--or-border-thin) solid var(--or-color-border);
}

/* O título da seção mora dentro da <legend>: herda o tamanho dela. */
.aurora-settings__editor .aurora-settings__legend-title {
  font-size: inherit;
}

/* Barra de salvar: presa ao rodapé da janela enquanto o formulário está à vista. */
.aurora-settings__savebar {
  position: sticky;
  bottom: 0;
  z-index: var(--or-z-sticky);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--or-space-3) var(--or-space-4);
  padding: var(--or-space-4) 0;
  border-top: var(--or-border-thin) solid var(--or-color-border-strong);
  background: var(--or-color-bg);
}

.aurora-settings__status {
  margin: 0;
}

.aurora-settings__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--or-space-3);
  margin-left: auto;
}

/* Zona de perigo ------------------------------------------------------------- */

.aurora-settings__danger {
  display: grid;
  gap: var(--or-space-4);
}

.aurora-settings__danger-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border: var(--or-border-thin) solid var(--or-color-danger);
}

.aurora-settings__danger-list > li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--or-space-3) var(--or-space-6);
  padding: var(--or-space-5);
}

.aurora-settings__danger-list > li + li {
  border-top: var(--or-border-thin) solid var(--or-color-border);
}

.aurora-settings__danger-list > li > div {
  display: grid;
  flex: 1 1 18rem;
  gap: var(--or-space-1);
}

@media (forced-colors: active) {
  .aurora-settings__danger-list {
    border-color: CanvasText;
  }
}
```
