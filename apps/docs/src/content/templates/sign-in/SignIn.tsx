import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Eyebrow,
  Form,
  Heading,
  Icon,
  Link,
  Paper,
  PasswordField,
  Text,
  TextField,
  type FormErrors,
  type FormValues,
} from '@orangesys/ui'
import { useId, useState } from 'react'
import './SignIn.css'

const text = (value: FormValues[string]) => String(value ?? '').trim()

/** Validação no envio: só confere o preenchimento e o formato do e-mail. */
function validate(values: FormValues): FormErrors {
  const email = text(values.email)
  return {
    email: !email
      ? 'Informe seu e-mail de trabalho.'
      : /^\S+@\S+\.\S+$/.test(email)
        ? undefined
        : 'Informe um e-mail no formato nome@empresa.com.br.',
    senha: text(values.senha) ? undefined : 'Informe sua senha.',
  }
}

/**
 * Simula a API de login. Na demonstração, a senha "aurora-demo" entra e
 * qualquer outra é recusada — troque pela chamada real.
 */
async function entrar(senha: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 900))
  return senha === 'aurora-demo'
}

type Aviso = 'entrou' | 'sso' | null

export default function SignIn() {
  const titleId = useId()
  const [serverErrors, setServerErrors] = useState<FormErrors>({})
  const [aviso, setAviso] = useState<Aviso>(null)

  const onSubmit = async (values: FormValues) => {
    setServerErrors({})
    setAviso(null)
    const ok = await entrar(text(values.senha))
    if (ok) setAviso('entrou')
    // Não diga qual dos dois está errado: o erro fica na senha, que a pessoa digita de novo.
    else setServerErrors({ senha: 'E-mail ou senha incorretos. Confira os dois e tente de novo.' })
  }

  return (
    <main className="aurora-signin">
      <div className="aurora-signin__main">
        <div className="aurora-signin__card">
          <p className="aurora-signin__logo">
            <Icon name="layers" /> Aurora
          </p>

          <div className="aurora-signin__intro">
            <Heading level={1} size="3xl" id={titleId}>
              Entrar na sua loja
            </Heading>
            <Text tone="muted">Use o e-mail de trabalho cadastrado pela sua equipe.</Text>
          </div>

          {aviso === 'entrou' && (
            <Alert tone="success" live title="Tudo certo, você entrou">
              Em um app, esta tela levaria agora ao painel da loja.
            </Alert>
          )}
          {aviso === 'sso' && (
            <Alert tone="info" live title="Login da empresa">
              Abrindo a página de login da sua empresa…
            </Alert>
          )}

          <Form aria-labelledby={titleId} validate={validate} errors={serverErrors} onSubmit={onSubmit}>
            {({ errors, isSubmitting }) => (
              <>
                <TextField
                  name="email"
                  type="email"
                  label="E-mail de trabalho"
                  autoComplete="username"
                  inputMode="email"
                  spellCheck={false}
                  required
                  error={errors.email}
                />
                <PasswordField
                  name="senha"
                  label="Senha"
                  autoComplete="current-password"
                  required
                  error={errors.senha}
                />
                <div className="aurora-signin__row">
                  <Checkbox
                    name="manterConectado"
                    label="Manter conectado"
                    description="Por 30 dias neste navegador. Não marque em computadores compartilhados."
                  />
                  <Link href="#recuperar-senha" variant="standalone">
                    Esqueci a senha
                  </Link>
                </div>
                <Button type="submit" size="lg" block loading={isSubmitting} loadingText="Entrando">
                  Entrar
                </Button>
              </>
            )}
          </Form>

          <Divider label="ou" spacing={0} />

          <Button
            variant="outline"
            size="lg"
            block
            startIcon={<Icon name="lock" />}
            onClick={() => setAviso('sso')}
          >
            Entrar com o login da empresa (SSO)
          </Button>

          <Text size="sm" tone="muted">
            Ainda não usa a Aurora? <Link href="#fale-com-vendas">Fale com a equipe comercial</Link>.
          </Text>
        </div>
      </div>

      {/* Painel da marca: só em telas largas. Conteúdo de apoio — nada essencial. */}
      <Paper tone="inverse" border="none" padding={0} className="aurora-signin__brand">
        <div className="aurora-signin__pattern" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="aurora-signin__pitch">
          <Eyebrow marker>Aurora · gestão de lojas</Eyebrow>
          <p className="aurora-signin__tagline">Pedidos, estoque e equipe no mesmo painel.</p>
          <ul className="aurora-signin__facts">
            <li>
              <strong>2.400</strong> lojas independentes
            </li>
            <li>
              <strong>18 mil</strong> pedidos por dia
            </li>
            <li>
              <strong>99,9%</strong> de disponibilidade em 2026
            </li>
          </ul>
        </div>
      </Paper>
    </main>
  )
}
