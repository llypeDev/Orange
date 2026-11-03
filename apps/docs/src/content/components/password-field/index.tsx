import { Bullets, Code, ComponentPage, DoDont, Example, KeyboardTable, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import { PasswordField } from '@orange/ui'
import Confirm from './examples/Confirm'
import ConfirmCode from './examples/Confirm?raw'
import Requirements from './examples/Requirements'
import RequirementsCode from './examples/Requirements?raw'
import SignIn from './examples/SignIn'
import SignInCode from './examples/SignIn?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import { meta } from './meta'

export default function PasswordFieldPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Sempre permita mostrar a senha: reduz erros de digitação, principalmente no celular.',
              en: 'Always allow showing the password: it reduces typing errors, especially on mobile.',
            },
            {
              pt: 'Mostre os requisitos antes da pessoa digitar e atualize-os em tempo real — não esconda as regras até o envio.',
              en: 'Show requirements before people type and update them in real time — don\'t hide the rules until submit.',
            },
            {
              pt: (
                <>
                  Use <Code>autoComplete="current-password"</Code> no login e <Code>"new-password"</Code> no cadastro para que
                  gerenciadores de senha funcionem (o padrão já segue isso).
                </>
              ),
              en: (
                <>
                  Use <Code>autoComplete="current-password"</Code> for sign-in and <Code>"new-password"</Code> for sign-up so
                  password managers work (the default already does this).
                </>
              ),
            },
            {
              pt: 'Não bloqueie colar no campo: isso atrapalha quem usa gerenciadores de senha.',
              en: "Don't block pasting: it gets in the way of password manager users.",
            },
          ]}
        />
        <DoDont
          doExample={<PasswordField label="Senha" description="Mínimo de 8 caracteres." style={{ width: '100%' }} />}
          dontExample={<PasswordField label="Senha" style={{ width: '100%' }} error="Senha inválida." />}
          doItems={[{ pt: 'Diga as regras antes do erro.', en: 'State the rules before the error.' }]}
          dontItems={[{ pt: 'Erros genéricos que não explicam o que corrigir.', en: "Generic errors that don't explain what to fix." }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Login', en: 'Sign in' }}
          description={{
            pt: 'Clique no olho: o foco e o cursor continuam no campo.',
            en: 'Click the eye: focus and caret stay in the field.',
          }}
          code={SignInCode}
        >
          <SignIn />
        </Example>
        <Example
          title={{ pt: 'Requisitos de senha', en: 'Password requirements' }}
          description={{
            pt: 'Cada item informa "atendido" ou "não atendido" a leitores de tela; o progresso é anunciado após uma pausa na digitação.',
            en: 'Each item reports "met" or "not met" to screen readers; progress is announced after a pause in typing.',
          }}
          code={RequirementsCode}
        >
          <Requirements />
        </Example>
        <Example title={{ pt: 'Confirmação', en: 'Confirmation' }} code={ConfirmCode}>
          <Confirm />
        </Example>
        <Example title={{ pt: 'Tamanhos e estados', en: 'Sizes and states' }} code={StatesCode}>
          <States />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'label', type: 'ReactNode', description: { pt: 'Rótulo visível.', en: 'Visible label.' } },
            { name: 'description / error', type: 'ReactNode', description: { pt: 'Ajuda e mensagem de erro.', en: 'Help text and error message.' } },
            { name: 'required / optional / invalid', type: 'boolean', description: { pt: 'Indicadores e estado de validação.', en: 'Indicators and validation state.' } },
            { name: 'labelAside', type: 'ReactNode', description: { pt: 'Conteúdo ao lado do rótulo (ex.: "Esqueceu a senha?").', en: 'Content next to the label (e.g. "Forgot password?").' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do controle.', en: 'Control height.' } },
            { name: 'startIcon', type: 'ReactNode', description: { pt: 'Ícone decorativo no início.', en: 'Decorative start icon.' } },
            { name: 'requirements', type: '{ label: ReactNode; met: boolean }[]', description: { pt: 'Lista de requisitos abaixo do campo.', en: 'Requirements list below the field.' } },
            { name: 'requirementsLabel', type: 'ReactNode', default: "'Requisitos da senha'", description: { pt: 'Título da lista de requisitos.', en: 'Requirements list title.' } },
            { name: 'visible / defaultVisible', type: 'boolean', default: 'false', description: { pt: 'Senha visível (controlado / inicial).', en: 'Password visible (controlled / initial).' } },
            { name: 'onVisibleChange', type: '(visible: boolean) => void', description: { pt: 'Chamado ao alternar a visibilidade.', en: 'Called when visibility toggles.' } },
            { name: 'value / defaultValue', type: 'string', description: { pt: 'Valor controlado / inicial.', en: 'Controlled / initial value.' } },
            { name: 'onValueChange', type: '(value: string) => void', description: { pt: 'Atalho que recebe o texto atual.', en: 'Shortcut that receives the current text.' } },
            { name: 'autoComplete', type: 'string', default: "'current-password' | 'new-password'", description: { pt: <>Padrão <Code>new-password</Code> quando há <Code>requirements</Code>.</>, en: <>Defaults to <Code>new-password</Code> when <Code>requirements</Code> is set.</> } },
            { name: '...rest', type: 'InputHTMLAttributes', description: { pt: <>Atributos nativos e <Code>ref</Code> vão para o <Code>&lt;input&gt;</Code>.</>, en: <>Native attributes and <Code>ref</Code> go to the <Code>&lt;input&gt;</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>O botão é um <Code>&lt;button&gt;</Code> de alternância com <Code>aria-pressed</Code> e <Code>aria-controls</Code>. Seguindo o WAI-ARIA, o nome acessível ("Mostrar senha") não muda; o estado pressionado indica que a senha está visível. Com mouse ou toque, o foco e a seleção permanecem no campo; pelo teclado, o foco fica no botão para permitir alternar de novo. A lista de requisitos entra em <Code>aria-describedby</Code> e cada item inclui "atendido"/"não atendido" em texto oculto.</>}
            en={<>The toggle is a <Code>&lt;button&gt;</Code> with <Code>aria-pressed</Code> and <Code>aria-controls</Code>. Following WAI-ARIA, its accessible name ("Show password") does not change; the pressed state means the password is visible. With mouse or touch, focus and selection stay in the field; with the keyboard, focus stays on the button so it can be toggled again. The requirements list is part of <Code>aria-describedby</Code> and each item includes hidden "met"/"not met" text.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco do campo para o botão mostrar/ocultar.', en: 'Moves focus from the field to the show/hide button.' } },
            { keys: ['Enter'], description: { pt: 'No botão: mostra ou oculta a senha.', en: 'On the button: shows or hides the password.' } },
            { keys: ['Space'], description: { pt: 'No botão: mostra ou oculta a senha.', en: 'On the button: shows or hides the password.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Requisitos associados ao campo por aria-describedby.', en: 'Requirements associated with the field via aria-describedby.' } },
            { criterion: '1.4.1', description: { pt: 'Requisito atendido indicado por ícone (✓) além da cor.', en: 'Met requirement shown by an icon (✓), not only color.' } },
            { criterion: '3.3.7', description: { pt: <>Compatível com gerenciadores de senha (<Code>autoComplete</Code>, colar permitido).</>, en: <>Works with password managers (<Code>autoComplete</Code>, paste allowed).</> } },
            { criterion: '3.3.8', description: { pt: 'Mostrar a senha evita testes de memória na autenticação.', en: 'Showing the password avoids cognitive tests during authentication.' } },
            { criterion: '4.1.2', description: { pt: 'Botão com nome, papel e estado (aria-pressed).', en: 'Button with name, role and state (aria-pressed).' } },
            { criterion: '4.1.3', description: { pt: 'Progresso dos requisitos anunciado como status.', en: 'Requirements progress announced as status.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
