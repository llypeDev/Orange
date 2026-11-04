import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Basic from './examples/Basic'
import BasicCode from './examples/Basic?raw'
import SingleFile from './examples/SingleFile'
import SingleFileCode from './examples/SingleFile?raw'
import States from './examples/States'
import StatesCode from './examples/States?raw'
import UploadProgress from './examples/UploadProgress'
import UploadProgressCode from './examples/UploadProgress?raw'
import { meta } from './meta'

export default function FileUploaderPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Diga na <Code>description</Code> quais tipos e qual tamanho são aceitos ("PDF ou
                  PNG, até 5 MB") — e use os mesmos valores em <Code>accept</Code> e{' '}
                  <Code>maxSize</Code>.
                </>
              ),
              en: (
                <>
                  State the accepted types and size in the <Code>description</Code> ("PDF or PNG, up
                  to 5 MB") — and use the same values in <Code>accept</Code> and{' '}
                  <Code>maxSize</Code>.
                </>
              ),
            },
            {
              pt: 'Arrastar e soltar é um atalho, nunca o único caminho: o botão "Escolher arquivos" sempre funciona por teclado e no celular.',
              en: 'Drag and drop is a shortcut, never the only path: the "Choose files" button always works with keyboard and on mobile.',
            },
            {
              pt: 'Arquivos recusados aparecem na lista com o motivo, para a pessoa entender o que corrigir. Remova-os antes de enviar o formulário.',
              en: 'Rejected files appear in the list with the reason, so people understand what to fix. Filter them out before submitting.',
            },
            {
              pt: (
                <>
                  Para mostrar progresso real, use o modo controlado: inicie o envio em{' '}
                  <Code>onFilesAdded</Code> e atualize <Code>status</Code>/<Code>progress</Code> de
                  cada item.
                </>
              ),
              en: (
                <>
                  To show real progress, use controlled mode: start the upload in{' '}
                  <Code>onFilesAdded</Code> and update each item's <Code>status</Code>/
                  <Code>progress</Code>.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Área de soltar', en: 'Drop zone' },
              description: {
                pt: 'Borda tracejada que fica laranja ao arrastar arquivos sobre ela.',
                en: 'Dashed border that turns orange while files are dragged over it.',
              },
            },
            {
              term: { pt: 'Botão', en: 'Button' },
              description: {
                pt: (
                  <>
                    Botão nativo que aciona o <Code>&lt;input type="file"&gt;</Code> visualmente
                    oculto.
                  </>
                ),
                en: (
                  <>
                    Native button that triggers the visually hidden{' '}
                    <Code>&lt;input type="file"&gt;</Code>.
                  </>
                ),
              },
            },
            {
              term: { pt: 'Lista de arquivos', en: 'File list' },
              description: {
                pt: 'Nome, tamanho formatado no idioma, status, barra de progresso e botão remover.',
                en: 'Name, locale-formatted size, status, progress bar and remove button.',
              },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Vários arquivos', en: 'Multiple files' }}
          description={{
            pt: 'Arraste arquivos para a área ou use o botão. Arquivos grandes ou de outro tipo entram com erro.',
            en: 'Drag files onto the area or use the button. Large or other-type files come in with an error.',
          }}
          code={BasicCode}
          align="stretch"
        >
          <Basic />
        </Example>
        <Example
          title={{ pt: 'Arquivo único', en: 'Single file' }}
          description={{
            pt: 'Sem multiple, o novo arquivo substitui o anterior. Com name, o arquivo vai junto no envio do formulário.',
            en: 'Without multiple, a new file replaces the previous one. With name, the file is submitted with the form.',
          }}
          code={SingleFileCode}
          align="stretch"
        >
          <SingleFile />
        </Example>
        <Example
          title={{
            pt: 'Envio com progresso (controlado)',
            en: 'Upload with progress (controlled)',
          }}
          description={{
            pt: 'onFilesAdded inicia o envio; cada item recebe progress e status. Um nome com "erro" simula falha.',
            en: 'onFilesAdded starts the upload; each item gets progress and status. A name containing "erro" simulates a failure.',
          }}
          code={UploadProgressCode}
          align="stretch"
        >
          <UploadProgress />
        </Example>
        <Example
          title={{ pt: 'Status e estados', en: 'Status and states' }}
          description={{
            pt: 'Enviado, enviando e com erro; campo obrigatório com erro e desabilitado.',
            en: 'Uploaded, uploading and failed; required field with error and disabled.',
          }}
          code={StatesCode}
          align="stretch"
        >
          <States />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            {
              term: { pt: 'Arrastar sobre a área', en: 'Dragging over the area' },
              description: {
                pt: 'Borda tracejada laranja, fundo de acento e scale 1,01 · medium; o ícone sobe 4px com sombra laranja · medium, ease-spring.',
                en: 'Orange dashed border, accent background and 1.01 scale · medium; the icon lifts 4px with an orange shadow · medium, ease-spring.',
              },
            },
            {
              term: { pt: 'Adicionar arquivos', en: 'Adding files' },
              description: {
                pt: 'Cada item entra com fade + 4px, escalonado em 40ms dentro do lote · medium, ease-out.',
                en: 'Each item enters with a fade + 4px, staggered by 40ms within the batch · medium, ease-out.',
              },
            },
            {
              term: { pt: 'Remover', en: 'Removing' },
              description: {
                pt: 'O item desliza 8px, some e recolhe a altura (grid-template-rows) · fast, ease-in-out. O foco vai na hora para o próximo item.',
                en: 'The item slides 8px, fades and collapses its height (grid-template-rows) · fast, ease-in-out. Focus moves immediately to the next item.',
              },
            },
            {
              term: { pt: 'Progresso', en: 'Progress' },
              description: {
                pt: 'A barra cresce com transform: scaleX · medium, ease-out.',
                en: 'The bar grows with transform: scaleX · medium, ease-out.',
              },
            },
            {
              term: { pt: 'Sucesso', en: 'Success' },
              description: {
                pt: 'O check é desenhado (or-draw) e o texto aparece · slow (400ms).',
                en: 'The check is drawn (or-draw) and the text fades in · slow (400ms).',
              },
            },
            {
              term: { pt: 'Erro', en: 'Error' },
              description: {
                pt: 'A mensagem do arquivo treme uma vez (or-shake) · slow.',
                en: 'The file message shakes once (or-shake) · slow.',
              },
            },
            {
              term: { pt: 'Botão "Escolher arquivos"', en: '"Choose files" button' },
              description: {
                pt: 'O sublinhado engrossa no hover/foco · fast; afunda 1px no clique · press (90ms).',
                en: 'The underline thickens on hover/focus · fast; sinks 1px on click · press (90ms).',
              },
            },
            {
              term: { pt: 'Movimento reduzido', en: 'Reduced motion' },
              description: {
                pt: 'Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.',
                en: 'Duration and distance tokens become 0: everything changes instantly and exits do not wait for animation.',
              },
            },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            {
              name: 'label',
              type: 'ReactNode',
              description: { pt: 'Rótulo do campo.', en: 'Field label.' },
            },
            {
              name: 'description',
              type: 'ReactNode',
              description: { pt: 'Tipos e tamanhos aceitos.', en: 'Accepted types and sizes.' },
            },
            {
              name: 'accept',
              type: 'string',
              description: {
                pt: 'Tipos aceitos: ".pdf,image/*".',
                en: 'Accepted types: ".pdf,image/*".',
              },
            },
            {
              name: 'multiple',
              type: 'boolean',
              default: 'false',
              description: { pt: 'Permite vários arquivos.', en: 'Allows several files.' },
            },
            {
              name: 'maxSize',
              type: 'number',
              description: {
                pt: 'Tamanho máximo por arquivo, em bytes.',
                en: 'Maximum size per file, in bytes.',
              },
            },
            {
              name: 'maxFiles',
              type: 'number',
              description: {
                pt: 'Quantidade máxima de arquivos válidos.',
                en: 'Maximum number of valid files.',
              },
            },
            {
              name: 'value / defaultValue',
              type: 'FileUploaderItem[]',
              description: {
                pt: 'Lista de arquivos (controlada ou inicial).',
                en: 'File list (controlled or initial).',
              },
            },
            {
              name: 'onFilesChange',
              type: '(items: FileUploaderItem[]) => void',
              description: {
                pt: 'Lista completa a cada mudança.',
                en: 'Full list on every change.',
              },
            },
            {
              name: 'onFilesAdded',
              type: '(items: FileUploaderItem[]) => void',
              description: {
                pt: 'Só os arquivos aceitos de cada seleção.',
                en: 'Only the accepted files of each selection.',
              },
            },
            {
              name: 'onFileRemove',
              type: '(item: FileUploaderItem) => void',
              description: {
                pt: 'Arquivo removido pela pessoa.',
                en: 'File removed by the person.',
              },
            },
            {
              name: 'name',
              type: 'string',
              description: {
                pt: 'Nome para envio em <form> nativo.',
                en: 'Name for native <form> submission.',
              },
            },
            {
              name: 'error / required / disabled',
              type: 'ReactNode / boolean',
              description: { pt: 'Estados do campo.', en: 'Field states.' },
            },
          ]}
        />
        <PropsTable
          caption={{ pt: 'FileUploaderItem', en: 'FileUploaderItem' }}
          rows={[
            {
              name: 'id',
              type: 'string',
              required: true,
              description: { pt: 'Identificador estável.', en: 'Stable identifier.' },
            },
            {
              name: 'file',
              type: 'File',
              required: true,
              description: { pt: 'O arquivo.', en: 'The file.' },
            },
            {
              name: 'status',
              type: "'idle' | 'uploading' | 'success' | 'error'",
              default: "'idle'",
              description: { pt: 'Estado do envio.', en: 'Upload state.' },
            },
            {
              name: 'progress',
              type: 'number',
              description: {
                pt: 'Progresso de 0 a 100 (com uploading).',
                en: 'Progress from 0 to 100 (with uploading).',
              },
            },
            {
              name: 'error',
              type: 'string',
              description: { pt: 'Motivo do erro (com error).', en: 'Error reason (with error).' },
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O botão "Escolher arquivos" é um <Code>&lt;button&gt;</Code> nativo rotulado pelo
                rótulo do campo e pelo próprio texto, e descrito pela descrição e pelo erro. O{' '}
                <Code>&lt;input type="file"&gt;</Code> continua no documento (oculto visualmente,
                fora da ordem de tabulação) para formulários e tecnologias assistivas. Adições,
                recusas e remoções são anunciadas numa região <Code>role="status"</Code>; o
                progresso usa <Code>role="progressbar"</Code> com o nome do arquivo.
              </>
            }
            en={
              <>
                The "Choose files" button is a native <Code>&lt;button&gt;</Code> labelled by the
                field label and its own text, and described by the description and error. The{' '}
                <Code>&lt;input type="file"&gt;</Code> stays in the document (visually hidden, out
                of the tab order) for forms and assistive technologies. Additions, rejections and
                removals are announced in a <Code>role="status"</Code> region; progress uses{' '}
                <Code>role="progressbar"</Code> with the file name.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            {
              keys: ['Tab'],
              description: {
                pt: 'Foca o botão "Escolher arquivos" e depois cada botão "Remover".',
                en: 'Focuses "Choose files" and then each "Remove" button.',
              },
            },
            {
              keys: ['Enter'],
              description: {
                pt: 'Abre o seletor de arquivos do sistema ou remove o arquivo focado.',
                en: 'Opens the system file picker or removes the focused file.',
              },
            },
            { keys: ['Space'], description: { pt: 'Mesmo que Enter.', en: 'Same as Enter.' } },
          ]}
        />
        <WcagList
          items={[
            {
              criterion: '2.1.1',
              description: {
                pt: 'Tudo funciona sem arrastar: o botão é a alternativa de teclado.',
                en: 'Everything works without dragging: the button is the keyboard alternative.',
              },
            },
            {
              criterion: '2.4.3',
              description: {
                pt: 'Ao remover, o foco vai para o próximo arquivo ou volta ao botão.',
                en: 'On removal, focus moves to the next file or back to the button.',
              },
            },
            {
              criterion: '3.3.1',
              description: {
                pt: 'Erros por arquivo (tipo, tamanho) e do campo (quantidade) são descritos em texto.',
                en: 'Per-file (type, size) and field (count) errors are described in text.',
              },
            },
            {
              criterion: '4.1.3',
              description: {
                pt: (
                  <>
                    Mensagens de status via <Code>role="status"</Code>, sem mover o foco.
                  </>
                ),
                en: (
                  <>
                    Status messages via <Code>role="status"</Code>, without moving focus.
                  </>
                ),
              },
            },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
