import { Button, Icon, PasswordField, TextField } from '@orange/ui'

export default function SignIn() {
  return (
    <form style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 380 }} onSubmit={(event) => event.preventDefault()}>
      <TextField label="E-mail" type="email" autoComplete="username" />
      <PasswordField
        label="Senha"
        startIcon={<Icon name="lock" />}
        labelAside={<a href="#recuperar-senha">Esqueceu a senha?</a>}
      />
      <Button type="submit" block>
        Entrar
      </Button>
    </form>
  )
}
