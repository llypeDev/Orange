import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Icon,
  Kbd,
  ProgressBar,
  Reveal,
  SegmentedControl,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  TextField,
} from '@orangesys/ui'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useLang, type Localized } from '../../../i18n'

function Tile({
  name,
  slug,
  wide = false,
  full = false,
  children,
}: {
  name: Localized<string>
  slug: string
  wide?: boolean
  full?: boolean
  children: ReactNode
}) {
  const { t, to } = useLang()
  return (
    <div
      className={`home-showcase__tile ${wide ? 'home-showcase__tile--wide' : ''} ${full ? 'home-showcase__tile--full' : ''}`}
    >
      <div className="home-showcase__head">
        <span className="or-eyebrow">{t(name)}</span>
        <Link to={to(`/components/${slug}`)} className="home-showcase__link or-nudge">
          {t({ pt: 'Docs', en: 'Docs' })} <Icon name="arrow-right" size="xs" className="or-nudge__icon" />
          <span className="or-visually-hidden">{t(name)}</span>
        </Link>
      </div>
      <div className="home-showcase__body">{children}</div>
    </div>
  )
}

const periods = {
  week: { pt: 'Semana', en: 'Week', value: 42 },
  month: { pt: 'Mês', en: 'Month', value: 68 },
  year: { pt: 'Ano', en: 'Year', value: 91 },
} as const

/** Vitrine da home: componentes reais da biblioteca, interativos. */
export function Showcase() {
  const { t, lang } = useLang()
  const [period, setPeriod] = useState<keyof typeof periods>('month')
  const [alerts, setAlerts] = useState(true)
  const people = ['Mariana Lopes', 'Rafael Costa', 'Beatriz Nunes', 'Diego Almeida', 'Lívia Martins', 'Thiago Rocha']

  return (
    <Reveal stagger className="home-showcase">
      <Tile name={{ pt: 'Formulário', en: 'Form' }} slug="text-field" wide>
        <form className="home-showcase__form" onSubmit={(e) => e.preventDefault()}>
          <TextField
            label={t({ pt: 'E-mail de trabalho', en: 'Work email' })}
            type="email"
            placeholder="voce@empresa.com"
            description={t({ pt: 'Enviaremos o convite para este endereço.', en: "We'll send the invite to this address." })}
            endIcon={<Icon name="mail" />}
          />
          <Switch
            label={t({ pt: 'Receber alertas de deploy', en: 'Get deploy alerts' })}
            checked={alerts}
            onCheckedChange={setAlerts}
          />
          <Button type="submit" endIcon={<Icon name="arrow-right" />}>
            {t({ pt: 'Enviar convite', en: 'Send invite' })}
          </Button>
        </form>
      </Tile>

      <Tile name={{ pt: 'Controle segmentado', en: 'Segmented control' }} slug="segmented-control">
        <SegmentedControl
          label={t({ pt: 'Período', en: 'Period' })}
          value={period}
          onChange={(v) => setPeriod(v as keyof typeof periods)}
          options={(Object.keys(periods) as (keyof typeof periods)[]).map((key) => ({
            value: key,
            label: periods[key][lang],
          }))}
          block
        />
        <ProgressBar
          label={t({ pt: 'Meta de vendas', en: 'Sales goal' })}
          value={periods[period].value}
          max={100}
        />
      </Tile>

      <Tile name={{ pt: 'Abas', en: 'Tabs' }} slug="tabs">
        <Tabs defaultValue="overview">
          <TabList aria-label={t({ pt: 'Projeto', en: 'Project' })}>
            <Tab value="overview">{t({ pt: 'Resumo', en: 'Overview' })}</Tab>
            <Tab value="team">{t({ pt: 'Equipe', en: 'Team' })}</Tab>
            <Tab value="logs">Logs</Tab>
          </TabList>
          <TabPanel value="overview">
            <p className="home-showcase__text">
              {t({ pt: '12 tarefas abertas · 3 metas no trimestre.', en: '12 open tasks · 3 goals this quarter.' })}
            </p>
          </TabPanel>
          <TabPanel value="team">
            <AvatarGroup label={t({ pt: 'Membros da equipe', en: 'Team members' })} max={4}>
              {people.map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </AvatarGroup>
          </TabPanel>
          <TabPanel value="logs">
            <p className="home-showcase__text">
              {t({ pt: 'Último deploy há 4 minutos, sem erros.', en: 'Last deploy 4 minutes ago, no errors.' })}
            </p>
          </TabPanel>
        </Tabs>
      </Tile>

      <Tile name={{ pt: 'Tags e badges', en: 'Tags and badges' }} slug="tag">
        <div className="home-showcase__row">
          <Tag tone="success">{t({ pt: 'Em produção', en: 'In production' })}</Tag>
          <Tag tone="warning">{t({ pt: 'Revisão', en: 'In review' })}</Tag>
          <Tag tone="info">Beta</Tag>
        </div>
        <div className="home-showcase__row">
          <span className="home-showcase__inbox">
            <Icon name="bell" size="sm" />
            {t({ pt: 'Notificações', en: 'Notifications' })}
            <Badge count={7} tone="accent" label={t({ pt: '7 não lidas', en: '7 unread' })} />
          </span>
        </div>
      </Tile>

      <Tile name={{ pt: 'Atalhos', en: 'Shortcuts' }} slug="kbd">
        <ul className="home-showcase__keys">
          <li>
            <span>{t({ pt: 'Paleta de comandos', en: 'Command palette' })}</span>
            <Kbd keys={['Ctrl', 'K']} />
          </li>
          <li>
            <span>{t({ pt: 'Salvar', en: 'Save' })}</span>
            <Kbd keys={['Ctrl', 'S']} />
          </li>
          <li>
            <span>{t({ pt: 'Fechar diálogo', en: 'Close dialog' })}</span>
            <Kbd keys={['Esc']} />
          </li>
        </ul>
      </Tile>

      <Tile name={{ pt: 'Alerta', en: 'Alert' }} slug="alert" full>
        <Alert tone="success" title={t({ pt: 'Deploy concluído', en: 'Deploy complete' })}>
          {t({
            pt: 'checkout-api v2.4.1 está no ar em sa-east-1. Nenhuma regressão detectada.',
            en: 'checkout-api v2.4.1 is live in sa-east-1. No regressions detected.',
          })}
        </Alert>
      </Tile>
    </Reveal>
  )
}
