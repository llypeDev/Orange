import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Colors from './examples/Colors'
import ColorsCode from './examples/Colors?raw'
import Fallbacks from './examples/Fallbacks'
import FallbacksCode from './examples/Fallbacks?raw'
import Presence from './examples/Presence'
import PresenceCode from './examples/Presence?raw'
import SizesShapes from './examples/SizesShapes'
import SizesShapesCode from './examples/SizesShapes?raw'
import { meta } from './meta'

export default function AvatarPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Sempre informe <Code>name</Code>: ele gera as iniciais, a cor de fundo e o nome acessível — mesmo
                  quando há foto, para o caso de ela falhar.
                </>
              ),
              en: (
                <>
                  Always provide <Code>name</Code>: it generates the initials, background color and accessible name —
                  even with a photo, in case it fails.
                </>
              ),
            },
            {
              pt: (
                <>
                  Se o nome já está escrito ao lado do avatar, use <Code>alt=""</Code> para não repeti-lo no leitor de
                  tela.
                </>
              ),
              en: (
                <>
                  If the name is already written next to the avatar, use <Code>alt=""</Code> so screen readers do not
                  repeat it.
                </>
              ),
            },
            {
              pt: 'Use square (padrão) para pessoas e organizações na interface; circle quando o produto pedir um tom mais pessoal, como chats.',
              en: 'Use square (default) for people and organizations in the interface; circle when the product calls for a more personal tone, such as chats.',
            },
            {
              pt: 'Não dependa só da cor do status: mostre o estado em texto quando ele for importante para a tarefa.',
              en: 'Do not rely on status color alone: show the state as text when it matters for the task.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Conteúdo exibido', en: 'Displayed content' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Foto', en: 'Photo' }, description: { pt: 'Quando src carrega. Aparece com um fade suave sobre as iniciais.', en: 'When src loads. Fades in smoothly over the initials.' } },
            { term: { pt: 'Iniciais', en: 'Initials' }, description: { pt: 'Primeira letra do primeiro e do último nome, sobre uma cor derivada do nome.', en: 'First letter of the first and last names, on a color derived from the name.' } },
            { term: { pt: 'Ícone', en: 'Icon' }, description: { pt: 'Sem foto e sem nome. Personalizável via icon.', en: 'No photo and no name. Customizable via icon.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Foto e alternativas', en: 'Photo and fallbacks' }}
          description={{
            pt: 'Foto carregada, foto quebrada (volta para as iniciais), apenas nome e nenhum dado.',
            en: 'Loaded photo, broken photo (falls back to initials), name only and no data.',
          }}
          code={FallbacksCode}
          align="center"
        >
          <Fallbacks />
        </Example>
        <Example
          title={{ pt: 'Tamanhos e formas', en: 'Sizes and shapes' }}
          description={{
            pt: 'xs (24px), sm (32px), md (40px, padrão), lg (48px) e xl (64px), em square ou circle.',
            en: 'xs (24px), sm (32px), md (40px, default), lg (48px) and xl (64px), square or circle.',
          }}
          code={SizesShapesCode}
        >
          <SizesShapes />
        </Example>
        <Example
          title={{ pt: 'Presença', en: 'Presence' }}
          description={{
            pt: 'online, away, busy e offline. O texto do status entra no nome acessível (ou em texto oculto, com alt=""). Use statusLabel para detalhar.',
            en: 'online, away, busy and offline. The status text joins the accessible name (or hidden text, with alt=""). Use statusLabel for details.',
          }}
          code={PresenceCode}
        >
          <Presence />
        </Example>
        <Example
          title={{ pt: 'Cores determinísticas', en: 'Deterministic colors' }}
          description={{
            pt: 'A cor de fundo vem de uma paleta de tokens e é sempre a mesma para o mesmo nome, em qualquer tela.',
            en: 'The background color comes from a token palette and is always the same for the same name, on every screen.',
          }}
          code={ColorsCode}
        >
          <Colors />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'name', type: 'string', description: { pt: 'Nome: gera iniciais, cor e nome acessível.', en: 'Name: generates initials, color and accessible name.' } },
            { name: 'src', type: 'string', description: { pt: 'URL da foto.', en: 'Photo URL.' } },
            { name: 'alt', type: 'string', default: 'name', description: { pt: <>Nome acessível. <Code>""</Code> torna o avatar decorativo.</>, en: <>Accessible name. <Code>""</Code> makes the avatar decorative.</> } },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: { pt: 'Tamanho (24 a 64px).', en: 'Size (24 to 64px).' } },
            { name: 'shape', type: "'square' | 'circle'", default: "'square'", description: { pt: 'Forma.', en: 'Shape.' } },
            { name: 'status', type: "'online' | 'away' | 'busy' | 'offline'", description: { pt: 'Indicador de presença.', en: 'Presence indicator.' } },
            { name: 'statusLabel', type: 'string', description: { pt: 'Substitui o texto do status.', en: 'Overrides the status text.' } },
            { name: 'icon', type: 'ReactNode', default: '<Icon name="user" />', description: { pt: 'Ícone quando não há foto nem nome.', en: 'Icon when there is no photo or name.' } },
            { name: 'imgProps', type: 'ImgHTMLAttributes', description: { pt: <>Atributos da <Code>&lt;img&gt;</Code> (ex.: <Code>loading="lazy"</Code>).</>, en: <><Code>&lt;img&gt;</Code> attributes (e.g. <Code>loading="lazy"</Code>).</> } },
            { name: '...rest', type: 'HTMLAttributes<HTMLSpanElement>', description: { pt: 'Atributos nativos do <span> raiz.', en: 'Native attributes of the root <span>.' } },
          ]}
        />
        <p>
          <T
            pt={<>A cor do anel do status acompanha o fundo da página; em superfícies elevadas, ajuste com a variável CSS <Code>--or-avatar-ring</Code>.</>}
            en={<>The status ring color follows the page background; on raised surfaces, adjust it with the <Code>--or-avatar-ring</Code> CSS variable.</>}
          />
        </p>
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O avatar é exposto como uma única imagem (<Code>role="img"</Code>) cujo nome reúne pessoa e status —
                "Mariana Lopes, Online". Foto, iniciais e indicador são decorativos dentro dele. Com <Code>alt=""</Code>,
                a imagem some da árvore de acessibilidade e só o status permanece, como texto oculto. Não é interativo:
                para abrir um perfil, envolva-o em um link com texto.
              </>
            }
            en={
              <>
                The avatar is exposed as a single image (<Code>role="img"</Code>) whose name combines person and status —
                "Mariana Lopes, Online". Photo, initials and indicator are decorative inside it. With <Code>alt=""</Code>,
                the image leaves the accessibility tree and only the status remains, as hidden text. It is not
                interactive: to open a profile, wrap it in a link with text.
              </>
            }
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.1.1', description: { pt: 'Alternativa em texto pelo nome; modo decorativo com alt="".', en: 'Text alternative from the name; decorative mode with alt="".' } },
            { criterion: '1.4.1', description: { pt: 'Status não depende só da cor: tem texto acessível e formas distintas (busy com barra, offline vazado).', en: 'Status does not rely on color alone: it has accessible text and distinct shapes (busy with a bar, offline hollow).' } },
            { criterion: '1.4.3', description: { pt: 'Iniciais sobre fundo misturado à superfície, com contraste mínimo de 4.5:1 nos dois temas.', en: 'Initials on a background mixed with the surface, with at least 4.5:1 contrast in both themes.' } },
            { criterion: '1.4.11', description: { pt: 'Indicador de status com anel na cor do fundo para se destacar da foto.', en: 'Status indicator with a background-colored ring to stand out from the photo.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
