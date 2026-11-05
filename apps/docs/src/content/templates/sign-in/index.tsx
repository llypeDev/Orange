import { Code } from '../../../kit'
import { TemplateDocPage } from '../_shared/TemplateDocPage'
import SignIn from './SignIn'
import SignInCss from './SignIn.css?raw'
import SignInCode from './SignIn?raw'

export default function SignInTemplatePage() {
  return (
    <TemplateDocPage
      path="/templates/sign-in"
      title={{ pt: 'Entrar', en: 'Sign in' }}
      lead={{
        pt: 'Tela de login completa: formulário centrado com resumo de erros, link de recuperação de senha, login da empresa (SSO) e painel da marca em telas largas.',
        en: 'A complete sign-in screen: centered form with an error summary, a password recovery link, company sign-in (SSO) and a brand panel on wide screens.',
      }}
      embedTitle="Entrar · Aurora"
      template={<SignIn />}
      overview={{
        pt: (
          <p>
            O login é a primeira tela de quase todo produto e a que mais sofre com erros pequenos: rótulos que somem,
            mensagens que não dizem o que fazer, foco perdido depois do envio. Este modelo resolve isso com o{' '}
            <Code>Form</Code> do Orange e campos com rótulo visível, e deixa o painel da marca como apoio — ele some
            no celular sem levar nada essencial.
          </p>
        ),
        en: (
          <p>
            Sign-in is the first screen of almost every product and the one that suffers most from small mistakes:
            disappearing labels, messages that don't say what to do, focus lost after submitting. This template
            handles that with Orange's <Code>Form</Code> and fields with visible labels, and keeps the brand panel as
            support — it disappears on phones without taking anything essential with it.
          </p>
        ),
      }}
      components={[
        {
          slug: 'form',
          why: {
            pt: 'Valida no envio, mostra o resumo de erros no topo com links para os campos e leva o foco até ele. Também recebe o erro do servidor (errors) e bloqueia o envio duplo.',
            en: 'Validates on submit, shows the error summary at the top with links to the fields and moves focus to it. It also takes the server error (errors) and blocks double submission.',
          },
        },
        {
          slug: 'text-field',
          why: {
            pt: 'E-mail de trabalho com autocomplete="username" e inputMode="email" — o gerenciador de senhas e o teclado do celular entendem o campo.',
            en: 'Work email with autocomplete="username" and inputMode="email" — password managers and phone keyboards understand the field.',
          },
        },
        {
          slug: 'password-field',
          why: {
            pt: 'Senha com botão de mostrar/ocultar e autocomplete="current-password".',
            en: 'Password with a show/hide button and autocomplete="current-password".',
          },
        },
        {
          slug: 'checkbox',
          why: {
            pt: '"Manter conectado", com a descrição do risco em computadores compartilhados.',
            en: '"Keep me signed in", with a description of the risk on shared computers.',
          },
        },
        {
          slug: 'button',
          why: {
            pt: 'Entrar (primário, com estado de carregamento anunciado) e o login da empresa (contorno): uma ação principal por tela.',
            en: 'Sign in (primary, with an announced loading state) and company sign-in (outline): one main action per screen.',
          },
        },
        {
          slug: 'link',
          why: {
            pt: '"Esqueci a senha" e o contato comercial, depois dos campos na ordem do foco.',
            en: '"Forgot password" and the sales contact, after the fields in focus order.',
          },
        },
        {
          slug: 'alert',
          why: {
            pt: 'Avisos que surgem depois de uma ação (live): login concluído e redirecionamento para o SSO.',
            en: 'Messages that appear after an action (live): sign-in completed and redirecting to SSO.',
          },
        },
        {
          slug: 'divider',
          why: { pt: 'O "ou" entre o formulário e o login da empresa.', en: 'The "or" between the form and company sign-in.' },
        },
        {
          slug: 'paper',
          why: {
            pt: 'Painel da marca com tone="inverse": inverte o tema só dentro dele, sobre a grade de 48px.',
            en: 'Brand panel with tone="inverse": flips the theme only inside it, over the 48px grid.',
          },
        },
      ]}
      tryIt={[
        {
          pt: 'Envie o formulário vazio: o resumo de erros recebe o foco e cada link leva ao campo.',
          en: 'Submit the empty form: the error summary gets focus and each link leads to its field.',
        },
        {
          pt: (
            <>
              Preencha qualquer e-mail válido e uma senha qualquer para ver o erro do servidor; com a senha{' '}
              <Code>aurora-demo</Code>, o login dá certo.
            </>
          ),
          en: (
            <>
              Fill in any valid email and any password to see the server error; with the password{' '}
              <Code>aurora-demo</Code>, sign-in succeeds.
            </>
          ),
        },
        {
          pt: 'Troque para Celular: o painel da marca some e a tela vira uma coluna só.',
          en: 'Switch to Phone: the brand panel disappears and the screen becomes a single column.',
        },
      ]}
      docsAdjustments={[
        {
          pt: (
            <>
              A raiz é uma <Code>&lt;div&gt;</Code>; em um app, use <Code>&lt;main className="aurora-signin"&gt;</Code>.
            </>
          ),
          en: (
            <>
              The root is a <Code>&lt;div&gt;</Code>; in an app, use <Code>&lt;main className="aurora-signin"&gt;</Code>.
            </>
          ),
        },
        {
          pt: (
            <>
              O título "Entrar na sua loja" é <Code>{'<Heading level={2}>'}</Code>; em um app, use{' '}
              <Code>level={'{1}'}</Code>.
            </>
          ),
          en: (
            <>
              The "Entrar na sua loja" title is <Code>{'<Heading level={2}>'}</Code>; in an app, use{' '}
              <Code>level={'{1}'}</Code>.
            </>
          ),
        },
      ]}
      files={[
        { name: 'SignIn.tsx', code: SignInCode, language: 'tsx' },
        { name: 'SignIn.css', code: SignInCss, language: 'css' },
      ]}
      a11y={[
        {
          topic: { pt: 'Landmarks', en: 'Landmarks' },
          criteria: '1.3.1',
          description: {
            pt: 'Em um app, o formulário fica no <main> e o painel da marca, que é só apoio, fica depois dele no DOM — o leitor de tela chega primeiro ao login.',
            en: 'In an app, the form sits in <main> and the brand panel, which is only supporting content, comes after it in the DOM — screen readers reach the sign-in first.',
          },
        },
        {
          topic: { pt: 'Ordem dos títulos', en: 'Heading order' },
          criteria: '1.3.1 · 2.4.6',
          description: {
            pt: 'Um título por tela ("Entrar na sua loja"), que também nomeia o formulário (aria-labelledby). O resumo de erros entra logo abaixo dele.',
            en: 'One heading per screen ("Entrar na sua loja"), which also names the form (aria-labelledby). The error summary comes right below it.',
          },
        },
        {
          topic: { pt: 'Ordem do foco', en: 'Focus order' },
          criteria: '2.4.3',
          description: {
            pt: 'E-mail → senha → mostrar senha → manter conectado → esqueci a senha → Entrar → SSO. A ordem visual é a do DOM; o painel da marca não tem nada focável.',
            en: 'Email → password → show password → keep me signed in → forgot password → Sign in → SSO. Visual order matches the DOM; the brand panel has nothing focusable.',
          },
        },
        {
          topic: { pt: 'Tratamento de erros', en: 'Error handling' },
          criteria: '3.3.1 · 3.3.3',
          description: {
            pt: 'Validação só no envio, com mensagens que dizem o que fazer. O erro do servidor não revela qual dado está errado, fica na senha e some quando ela é editada. O botão anuncia "Entrando" e bloqueia o envio duplo.',
            en: "Validation only on submit, with messages that say what to do. The server error doesn't reveal which value is wrong, sits on the password and clears when it's edited. The button announces “Entrando” and blocks double submission.",
          },
        },
        {
          topic: { pt: 'Preenchimento automático', en: 'Autofill' },
          criteria: '1.3.5 · 3.3.8',
          description: {
            pt: 'autocomplete="username" e "current-password": gerenciadores de senha preenchem e colar a senha funciona — nada de teste cognitivo para entrar.',
            en: 'autocomplete="username" and "current-password": password managers fill in and pasting the password works — no cognitive test to sign in.',
          },
        },
        {
          topic: { pt: 'Refluxo', en: 'Reflow' },
          criteria: '1.4.10',
          description: {
            pt: 'Em 390px a tela é uma coluna só, sem rolagem horizontal.',
            en: 'At 390px the screen is a single column, with no horizontal scrolling.',
          },
        },
      ]}
    />
  )
}
