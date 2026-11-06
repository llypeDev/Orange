import {
  AppHeader,
  AppShell,
  AppShellNavToggle,
  Button,
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
  Switch,
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

  // Espera o React aplicar a mudança (inputs ocultos do Switch e do Listbox) antes de comparar.
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
      navBreakpoint="md"
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
                  legend={
                    <Heading level={2} size="lg">
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
                  legend={
                    <Heading level={2} size="lg">
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
                  legend={
                    <Heading level={2} size="lg">
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
                  <Stack gap={4} separator>
                    <Switch
                      name="avisos"
                      value="novo-pedido"
                      label="Novo pedido recebido"
                      labelPosition="start"
                      defaultChecked={salvo.avisos.includes('novo-pedido')}
                    />
                    <Switch
                      name="avisos"
                      value="estoque-baixo"
                      label="Estoque abaixo do mínimo"
                      description="Um e-mail por produto, no máximo uma vez por dia."
                      labelPosition="start"
                      defaultChecked={salvo.avisos.includes('estoque-baixo')}
                    />
                    <Switch
                      name="avisos"
                      value="resumo-semanal"
                      label="Resumo semanal de vendas"
                      description="Toda segunda-feira, às 8h."
                      labelPosition="start"
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
