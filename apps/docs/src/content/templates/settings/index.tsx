import { Code } from '../../../kit'
import { TemplateDocPage } from '../_shared/TemplateDocPage'
import Settings from './Settings'
import SettingsCss from './Settings.css?raw'
import SettingsCode from './Settings?raw'

export default function SettingsTemplatePage() {
  return (
    <TemplateDocPage
      path="/templates/settings"
      title={{ pt: 'Configurações', en: 'Settings' }}
      lead={{
        pt: 'Página de configurações da loja: seções com Fieldset, campos de vários tipos, envio de logo, barra de salvar presa ao rodapé com aviso de sucesso e uma zona de perigo com confirmação.',
        en: 'A store settings page: Fieldset sections, many field types, logo upload, a save bar stuck to the bottom with a success toast and a danger zone with confirmation.',
      }}
      embedTitle="Configurações · Aurora"
      template={<Settings />}
      overview={{
        pt: (
          <p>
            Configurações costumam ser formulários longos, editados aos poucos. Este modelo divide a página em seções com
            título (<Code>Fieldset</Code> com um <Code>h2</Code> na legenda), mostra se há alterações não salvas, mantém
            Salvar sempre à mão e separa as ações destrutivas do resto — cada uma com a sua confirmação.
          </p>
        ),
        en: (
          <p>
            Settings are usually long forms, edited bit by bit. This template splits the page into titled sections (
            <Code>Fieldset</Code> with an <Code>h2</Code> in the legend), shows whether there are unsaved changes, keeps
            Save always at hand and separates destructive actions from the rest — each with its own confirmation.
          </p>
        ),
      }}
      components={[
        {
          slug: 'app-shell',
          why: {
            pt: 'Área de configurações com navigation próprio e navDrawerBelow="md": a barra lateral fica visível já a partir de 768px.',
            en: 'Settings area with its own navigation and navDrawerBelow="md": the sidebar is visible from 768px up.',
          },
        },
        {
          slug: 'side-nav',
          why: {
            pt: 'Páginas das configurações (Loja é a atual) e o caminho de volta ao painel.',
            en: 'Settings pages (Loja is the current one) and the way back to the dashboard.',
          },
        },
        {
          slug: 'page-header',
          why: {
            pt: 'Título da página com o estado da loja (Tag) ao lado.',
            en: 'Page title with the store status (Tag) next to it.',
          },
        },
        {
          slug: 'form',
          why: {
            pt: 'Validação no envio, resumo de erros com links e foco no resumo — inclusive para o Listbox, que envia por inputs ocultos.',
            en: 'Validation on submit, an error summary with links and focus on the summary — including the Listbox, which submits through hidden inputs.',
          },
        },
        {
          slug: 'fieldset',
          why: {
            pt: 'Uma seção por assunto; a legenda é anunciada ao entrar no grupo e contém o título da seção.',
            en: 'One section per topic; the legend is announced when entering the group and holds the section heading.',
          },
        },
        {
          slug: 'text-field',
          why: {
            pt: 'Nome, endereço da vitrine (com prefixo e sufixo fixos) e e-mail da equipe.',
            en: 'Name, storefront address (with fixed prefix and suffix) and team email.',
          },
        },
        {
          slug: 'file-uploader',
          why: {
            pt: 'Logo com tipos e tamanho informados na descrição; arquivos recusados entram na lista com o motivo.',
            en: 'Logo with accepted types and size stated in the description; rejected files show up in the list with the reason.',
          },
        },
        {
          slug: 'select',
          why: { pt: 'Fuso horário e idioma: escolhas simples, com o select nativo.', en: 'Time zone and language: simple choices, with the native select.' },
        },
        {
          slug: 'listbox',
          why: {
            pt: 'Canais de venda: seleção múltipla sempre visível, com descrição por opção.',
            en: 'Sales channels: always-visible multiple selection, with a description per option.',
          },
        },
        {
          slug: 'radio-group',
          why: {
            pt: 'O que fazer com produtos esgotados: três opções exclusivas em cartões, cada uma explicando a consequência.',
            en: 'What to do with sold-out products: three exclusive options as cards, each explaining the consequence.',
          },
        },
        {
          slug: 'switch',
          why: {
            pt: 'Avisos que ligam e desligam, com o rótulo à esquerda (labelPosition="start").',
            en: 'Notifications that turn on and off, with the label on the left (labelPosition="start").',
          },
        },
        {
          slug: 'confirm-dialog',
          why: {
            pt: 'Pausar vendas (neutro, controlado) e excluir a loja (danger: foco inicial em Cancelar, botão em carregamento enquanto a API responde).',
            en: 'Pause sales (neutral, controlled) and delete the store (danger: initial focus on Cancel, loading button while the API responds).',
          },
        },
        {
          slug: 'toast',
          why: {
            pt: 'Confirma o que deu certo sem tirar o foco do lugar; "Desfazer" no aviso de pausa.',
            en: "Confirms what worked without moving focus; “Desfazer” (undo) on the pause notice.",
          },
        },
      ]}
      tryIt={[
        {
          pt: 'Mude qualquer campo: a barra avisa que há alterações. Descartar volta aos valores salvos; Salvar mostra o aviso de sucesso.',
          en: 'Change any field: the bar says there are changes. Descartar (discard) goes back to the saved values; Salvar (save) shows the success toast.',
        },
        {
          pt: 'Apague o nome da loja e desmarque todos os canais antes de salvar: o resumo de erros recebe o foco e cada link leva ao campo.',
          en: 'Clear the store name and unselect every channel before saving: the error summary gets focus and each link leads to its field.',
        },
        {
          pt: 'Em Zona de perigo, pause as vendas e use "Desfazer" no aviso; depois tente excluir a loja.',
          en: 'In Zona de perigo (danger zone), pause sales and use “Desfazer” on the notice; then try deleting the store.',
        },
      ]}
      docsAdjustments={[
        {
          pt: (
            <>
              O <Code>ToastProvider</Code> envolve o modelo; em um app, ele fica uma vez só, na raiz.
            </>
          ),
          en: (
            <>
              <Code>ToastProvider</Code> wraps the template; in an app, it lives once, at the root.
            </>
          ),
        },
      ]}
      files={[
        { name: 'Settings.tsx', code: SettingsCode, language: 'tsx' },
        { name: 'Settings.css', code: SettingsCss, language: 'css' },
      ]}
      a11y={[
        {
          topic: { pt: 'Landmarks', en: 'Landmarks' },
          criteria: '1.3.1 · 2.4.1',
          description: {
            pt: 'Cabeçalho, navegação das configurações (nomeada), conteúdo principal e o link "Pular para o conteúdo principal". A zona de perigo é uma seção nomeada pelo seu título, fora do formulário.',
            en: 'Header, settings navigation (named), main content and the "Skip to main content" link. The danger zone is a section named by its heading, outside the form.',
          },
        },
        {
          topic: { pt: 'Ordem dos títulos', en: 'Heading order' },
          criteria: '1.3.1 · 2.4.6',
          description: {
            pt: '"Loja" e, abaixo dele, um título por seção — dentro da legenda de cada Fieldset, então o grupo e o título têm o mesmo nome — e "Zona de perigo" por último.',
            en: '"Loja" and, below it, one heading per section — inside each Fieldset legend, so the group and the heading share the same name — and "Zona de perigo" last.',
          },
        },
        {
          topic: { pt: 'Ordem do foco', en: 'Focus order' },
          criteria: '2.4.3 · 2.4.11',
          description: {
            pt: 'Campos na ordem de leitura, depois Descartar e Salvar, depois a zona de perigo. scroll-padding reserva espaço para o cabeçalho fixo e para a barra de salvar: o campo em foco nunca fica escondido atrás deles. Os diálogos prendem o foco e o devolvem ao botão que os abriu.',
            en: 'Fields in reading order, then Descartar and Salvar, then the danger zone. scroll-padding reserves room for the sticky header and the save bar: the focused field is never hidden behind them. Dialogs trap focus and return it to the button that opened them.',
          },
        },
        {
          topic: { pt: 'Tratamento de erros', en: 'Error handling' },
          criteria: '3.3.1 · 3.3.3',
          description: {
            pt: 'Validação só no envio, com mensagens que dizem o formato esperado. O resumo recebe o foco e os erros somem conforme são corrigidos. Arquivos de logo recusados aparecem na lista com o motivo.',
            en: 'Validation only on submit, with messages stating the expected format. The summary gets focus and errors clear as they are fixed. Rejected logo files show up in the list with the reason.',
          },
        },
        {
          topic: { pt: 'Estado e confirmações', en: 'Status and confirmations' },
          criteria: '3.3.4 · 4.1.3',
          description: {
            pt: '"Alterações não salvas" é anunciado educadamente; o sucesso vem em um Toast, sem mover o foco. Excluir pede confirmação em um diálogo danger, com o foco inicial em Cancelar.',
            en: '"Unsaved changes" is announced politely; success comes in a Toast, without moving focus. Deleting asks for confirmation in a danger dialog, with initial focus on Cancel.',
          },
        },
        {
          topic: { pt: 'Refluxo', en: 'Reflow' },
          criteria: '1.4.10',
          description: {
            pt: 'Em 390px a navegação vai para o painel, os selects empilham e a barra de salvar quebra em duas linhas, sem rolagem horizontal.',
            en: 'At 390px navigation moves to the panel, selects stack and the save bar wraps onto two lines, with no horizontal scrolling.',
          },
        },
      ]}
    />
  )
}
