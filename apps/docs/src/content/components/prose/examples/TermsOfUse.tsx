import { Prose } from '@orangesys/ui'

export default function TermsOfUse() {
  return (
    <Prose size="sm">
      <h2>4. Uso da plataforma</h2>
      <p>Ao usar a plataforma, você concorda em:</p>
      <ol>
        <li>
          Manter seus dados de acesso em sigilo e não compartilhar a conta com outras pessoas.
        </li>
        <li>
          Não usar a plataforma para:
          <ol type="a">
            <li>enviar mensagens não solicitadas em massa;</li>
            <li>publicar conteúdo que viole direitos de terceiros.</li>
          </ol>
        </li>
        <li>Comunicar qualquer uso não autorizado assim que tomar conhecimento.</li>
      </ol>
      <h3>Definições</h3>
      <dl>
        <dt>Conta</dt>
        <dd>Cadastro individual que dá acesso à plataforma.</dd>
        <dt>Espaço de trabalho</dt>
        <dd>Conjunto de lojas, pessoas e relatórios administrado por uma empresa.</dd>
      </dl>
      <p>
        <small>Versão vigente desde 1º de outubro de 2026.</small>
      </p>
    </Prose>
  )
}
