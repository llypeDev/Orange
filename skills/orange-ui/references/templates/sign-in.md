# Modelo: Entrar

- Ao vivo: https://orange.llypedev.com.br/pt/templates/sign-in

Tela de login completa: formulário centrado com resumo de erros, link de recuperação de senha, login da empresa (SSO) e painel da marca em telas largas.

O login é a primeira tela de quase todo produto e a que mais sofre com erros pequenos: rótulos que somem, mensagens que não dizem o que fazer, foco perdido depois do envio. Este modelo resolve isso com o `Form` do Orange e campos com rótulo visível, e deixa o painel da marca como apoio — ele some no celular sem levar nada essencial.

## Componentes usados

- **form** (`components/form.md`) — Valida no envio, mostra o resumo de erros no topo com links para os campos e leva o foco até ele. Também recebe o erro do servidor (errors) e bloqueia o envio duplo.
- **text-field** (`components/text-field.md`) — E-mail de trabalho com autocomplete="username" e inputMode="email" — o gerenciador de senhas e o teclado do celular entendem o campo.
- **password-field** (`components/password-field.md`) — Senha com botão de mostrar/ocultar e autocomplete="current-password".
- **checkbox** (`components/checkbox.md`) — "Manter conectado", com a descrição do risco em computadores compartilhados.
- **button** (`components/button.md`) — Entrar (primário, com estado de carregamento anunciado) e o login da empresa (contorno): uma ação principal por tela.
- **link** (`components/link.md`) — "Esqueci a senha" e o contato comercial, depois dos campos na ordem do foco.
- **alert** (`components/alert.md`) — Avisos que surgem depois de uma ação (live): login concluído e redirecionamento para o SSO.
- **divider** (`components/divider.md`) — O "ou" entre o formulário e o login da empresa.
- **paper** (`components/paper.md`) — Painel da marca com tone="inverse": inverte o tema só dentro dele, sobre a grade de 48px.

## Acessibilidade

- **Landmarks** (1.3.1) — Em um app, o formulário fica no <main> e o painel da marca, que é só apoio, fica depois dele no DOM — o leitor de tela chega primeiro ao login.
- **Ordem dos títulos** (1.3.1 · 2.4.6) — Um título por tela ("Entrar na sua loja"), que também nomeia o formulário (aria-labelledby). O resumo de erros entra logo abaixo dele.
- **Ordem do foco** (2.4.3) — E-mail → senha → mostrar senha → manter conectado → esqueci a senha → Entrar → SSO. A ordem visual é a do DOM; o painel da marca não tem nada focável.
- **Tratamento de erros** (3.3.1 · 3.3.3) — Validação só no envio, com mensagens que dizem o que fazer. O erro do servidor não revela qual dado está errado, fica na senha e some quando ela é editada. O botão anuncia "Entrando" e bloqueia o envio duplo.
- **Preenchimento automático** (1.3.5 · 3.3.8) — autocomplete="username" e "current-password": gerenciadores de senha preenchem e colar a senha funciona — nada de teste cognitivo para entrar.
- **Refluxo** (1.4.10) — Em 390px a tela é uma coluna só, sem rolagem horizontal.

## Código

`SignIn.tsx`:

```tsx
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
            <Icon name="layers" className="aurora-signin__logo-icon" /> Aurora
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
                    className="aurora-signin__remember"
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
```

`SignIn.css`:

```css
/*
 * Entrar — tela de login da Aurora.
 * Uma coluna no celular; a partir de 1024px, formulário à esquerda e painel da
 * marca à direita (a ordem visual é a ordem do DOM). Só tokens do Orange.
 */

.aurora-signin {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--or-color-bg);
  color: var(--or-color-text);
}

.aurora-signin__main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: var(--or-space-10) var(--or-space-5);
}

.aurora-signin__card {
  display: grid;
  gap: var(--or-space-6);
  width: 100%;
  max-width: 26rem;
  margin-inline: auto;
  animation: aurora-signin-rise var(--or-duration-reveal) var(--or-ease-out) both;
}

.aurora-signin__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--or-space-2);
  margin: 0;
  font-family: var(--or-font-display);
  font-size: var(--or-text-xl);
  font-weight: var(--or-weight-bold);
  letter-spacing: var(--or-tracking-heading);
}

.aurora-signin__logo .aurora-signin__logo-icon {
  color: var(--or-color-accent);
}

.aurora-signin__intro {
  display: grid;
  gap: var(--or-space-2);
}

/* "Manter conectado" e "Esqueci a senha" na mesma linha; quebram quando falta espaço. */
.aurora-signin__row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--or-space-3) var(--or-space-6);
}

.aurora-signin__row > .aurora-signin__remember {
  flex: 1 1 14rem;
}

/* Painel da marca ------------------------------------------------------------ */

.aurora-signin > .aurora-signin__brand {
  display: none;
}

.aurora-signin__pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--or-color-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--or-color-grid-line) 1px, transparent 1px);
  background-size: 48px 48px;
  background-position: -1px -1px;
  pointer-events: none;
}

/* Composição de quadrados alinhada à grade de 48px (um só acento laranja). */
.aurora-signin__pattern span {
  position: absolute;
  border: var(--or-border-thin) solid var(--or-color-border-strong);
  animation: aurora-signin-fade var(--or-duration-reveal) var(--or-ease-out) both;
}

.aurora-signin__pattern span:nth-child(1) {
  top: 96px;
  right: 96px;
  width: 144px;
  height: 144px;
  border: 0;
  background: var(--or-color-accent);
  animation-delay: calc(var(--or-stagger) * 2);
}

.aurora-signin__pattern span:nth-child(2) {
  top: 240px;
  right: 240px;
  width: 96px;
  height: 96px;
  animation-delay: calc(var(--or-stagger) * 3);
}

.aurora-signin__pattern span:nth-child(3) {
  top: 48px;
  right: 288px;
  width: 48px;
  height: 48px;
  animation-delay: calc(var(--or-stagger) * 4);
}

.aurora-signin__pattern span:nth-child(4) {
  top: 336px;
  right: 48px;
  width: 48px;
  height: 48px;
  background: var(--or-color-text);
  border: 0;
  animation-delay: calc(var(--or-stagger) * 5);
}

.aurora-signin__pitch {
  position: relative;
  display: grid;
  gap: var(--or-space-5);
  max-width: 30rem;
  animation: aurora-signin-rise var(--or-duration-reveal) var(--or-ease-out) both;
  animation-delay: var(--or-stagger);
}

.aurora-signin__tagline {
  margin: 0;
  font-family: var(--or-font-display);
  font-size: var(--or-text-4xl);
  font-weight: var(--or-weight-bold);
  line-height: var(--or-leading-heading);
  letter-spacing: var(--or-tracking-heading);
  text-wrap: balance;
}

.aurora-signin__facts {
  display: grid;
  gap: var(--or-space-2);
  margin: 0;
  padding: var(--or-space-5) 0 0;
  border-top: var(--or-border-thin) solid var(--or-color-border-strong);
  list-style: none;
  color: var(--or-color-text-muted);
}

.aurora-signin__facts strong {
  font-family: var(--or-font-display);
  font-weight: var(--or-weight-bold);
  color: var(--or-color-text);
}

@media (min-width: 1024px) {
  .aurora-signin {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  }

  .aurora-signin__main {
    padding: var(--or-space-12) var(--or-space-10);
  }

  .aurora-signin > .aurora-signin__brand {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-width: 0;
    padding: var(--or-space-12);
    overflow: hidden;
  }
}

@keyframes aurora-signin-rise {
  from {
    opacity: 0;
    transform: translateY(var(--or-distance-lg));
  }
}

@keyframes aurora-signin-fade {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}

@media (forced-colors: active) {
  .aurora-signin__pattern span {
    border: 1px solid CanvasText;
    background: none;
  }
}
```
