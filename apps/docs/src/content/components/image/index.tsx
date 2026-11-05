import {
  Bullets,
  Callout,
  Code,
  ComponentPage,
  DefinitionTable,
  DoDont,
  Example,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { Image } from '@orangesys/ui'
import Caption from './examples/Caption'
import CaptionCode from './examples/Caption?raw'
import Fallbacks from './examples/Fallbacks'
import FallbacksCode from './examples/Fallbacks?raw'
import FitPosition from './examples/FitPosition'
import FitPositionCode from './examples/FitPosition?raw'
import Ratios from './examples/Ratios'
import RatiosCode from './examples/Ratios?raw'
import retrato from './examples/media/retrato.svg'
import { meta } from './meta'

export default function ImagePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  <Code>alt</Code> é obrigatório. Descreva o que a imagem comunica naquele contexto, em uma frase curta — não
                  o arquivo nem "imagem de". Para um produto: cor, tipo e o detalhe que diferencia.
                </>
              ),
              en: (
                <>
                  <Code>alt</Code> is required. Describe what the image conveys in that context, in a short sentence — not
                  the file name nor "image of". For a product: color, type and the distinguishing detail.
                </>
              ),
            },
            {
              pt: (
                <>
                  Use <Code>alt=""</Code> só quando a imagem for <strong>decorativa</strong>: ornamento, textura, ou quando o
                  mesmo conteúdo já está no texto ao lado (o título do cartão, a legenda). Assim leitores de tela a ignoram
                  em vez de repetir a informação.
                </>
              ),
              en: (
                <>
                  Use <Code>alt=""</Code> only when the image is <strong>decorative</strong>: ornament, texture, or when the
                  same content is already in the adjacent text (the card title, the caption). Screen readers then skip it
                  instead of repeating the information.
                </>
              ),
            },
            {
              pt: (
                <>
                  Sempre reserve o espaço: passe <Code>ratio</Code> (ou <Code>width</Code> e <Code>height</Code> numéricos).
                  Sem isso, a altura só é conhecida depois do carregamento e o conteúdo abaixo pula (CLS).
                </>
              ),
              en: (
                <>
                  Always reserve the space: pass <Code>ratio</Code> (or numeric <Code>width</Code> and <Code>height</Code>).
                  Without it, the height is only known after loading and the content below jumps (CLS).
                </>
              ),
            },
            {
              pt: (
                <>
                  Mantenha <Code>loading="lazy"</Code> (padrão) para imagens abaixo da dobra. Para a imagem principal visível
                  ao abrir a página, use <Code>loading="eager"</Code> e <Code>fetchPriority="high"</Code>.
                </>
              ),
              en: (
                <>
                  Keep <Code>loading="lazy"</Code> (default) for images below the fold. For the main image visible when the
                  page opens, use <Code>loading="eager"</Code> and <Code>fetchPriority="high"</Code>.
                </>
              ),
            },
          ]}
        />
        <DoDont
          doExample={<Image src={retrato} alt="Gerente da loja sorrindo atrás do balcão" ratio="4/3" position="top" bordered />}
          dontExample={<Image src={retrato} alt="foto.jpg" ratio="4/3" position="top" bordered />}
          doItems={[{ pt: 'alt descreve o conteúdo e o contexto.', en: 'alt describes the content and context.' }]}
          dontItems={[{ pt: 'alt com nome de arquivo, "imagem" ou vazio numa imagem informativa.', en: 'alt with a file name, "image", or empty on an informative image.' }]}
        />
      </Section>

      <Section title={{ pt: 'Anatomia', en: 'Anatomy' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Contêiner', en: 'Container' }, description: { pt: <>Reserva a proporção com <Code>aspect-ratio</Code>; recebe <Code>className</Code>, <Code>style</Code> e <Code>data-state</Code> (loading, loaded, error).</>, en: <>Reserves the ratio with <Code>aspect-ratio</Code>; receives <Code>className</Code>, <Code>style</Code> and <Code>data-state</Code> (loading, loaded, error).</> } },
            { term: { pt: 'Skeleton', en: 'Skeleton' }, description: { pt: 'Mesmo visual do componente Skeleton, decorativo, até a imagem carregar.', en: 'Same look as the Skeleton component, decorative, until the image loads.' } },
            { term: { pt: '<img>', en: '<img>' }, description: { pt: <>Recebe a <Code>ref</Code> e os demais atributos (<Code>srcSet</Code>, <Code>sizes</Code>, <Code>fetchPriority</Code>…).</>, en: <>Receives the <Code>ref</Code> and the remaining attributes (<Code>srcSet</Code>, <Code>sizes</Code>, <Code>fetchPriority</Code>…).</> } },
            { term: { pt: 'Substituto', en: 'Fallback' }, description: { pt: 'Em erro: superfície neutra com ícone e o alt em texto oculto, ou o seu fallback.', en: 'On error: neutral surface with an icon and the alt as hidden text, or your fallback.' } },
            { term: { pt: 'Legenda', en: 'Caption' }, description: { pt: <>Com <Code>caption</Code>, tudo fica dentro de <Code>&lt;figure&gt;</Code> com <Code>&lt;figcaption&gt;</Code>.</>, en: <>With <Code>caption</Code>, everything goes inside <Code>&lt;figure&gt;</Code> with <Code>&lt;figcaption&gt;</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Proporções', en: 'Aspect ratios' }}
          description={{
            pt: "ratio aceita '1/1', '4/3', '3/2', '16/9', '21/9' ou um número. A área existe antes do download, então nada pula.",
            en: "ratio accepts '1/1', '4/3', '3/2', '16/9', '21/9' or a number. The area exists before the download, so nothing jumps.",
          }}
          code={RatiosCode}
          align="stretch"
        >
          <Ratios />
        </Example>
        <Example
          title={{ pt: 'Enquadramento e ponto focal', en: 'Fit and focal point' }}
          description={{
            pt: 'cover recorta para preencher; position escolhe o que preservar. contain mostra a imagem inteira — use para logotipos.',
            en: 'cover crops to fill; position picks what to keep. contain shows the whole image — use it for logos.',
          }}
          code={FitPositionCode}
          align="stretch"
        >
          <FitPosition />
        </Example>
        <Example
          title={{ pt: 'Erro e substitutos', en: 'Errors and fallbacks' }}
          description={{
            pt: 'Se o src falhar, o Image tenta o fallbackSrc uma vez. Depois mostra o substituto padrão (ícone + "Imagem indisponível: <alt>" para leitores de tela) ou o seu fallback.',
            en: 'If src fails, Image tries fallbackSrc once. Then it shows the default fallback (icon + "Image unavailable: <alt>" for screen readers) or your fallback.',
          }}
          code={FallbacksCode}
          align="stretch"
        >
          <Fallbacks />
        </Example>
        <Example
          title={{ pt: 'Com legenda e borda', en: 'With caption and border' }}
          description={{
            pt: 'caption envolve a imagem em <figure>/<figcaption>. bordered desenha a borda de 1px por cima da imagem.',
            en: 'caption wraps the image in <figure>/<figcaption>. bordered draws the 1px border on top of the image.',
          }}
          code={CaptionCode}
        >
          <Caption />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Carregando', en: 'Loading' }, description: { pt: 'O skeleton (brilho do Skeleton, 1.6s) ocupa a área reservada. Com movimento reduzido ele fica estático.', en: 'The skeleton (Skeleton shimmer, 1.6s) fills the reserved area. With reduced motion it is static.' } },
            { term: { pt: 'Carregou', en: 'Loaded' }, description: { pt: 'A imagem entra com fade de opacidade em --or-duration-medium (250ms), --or-ease-out. Imagens já em cache aparecem direto, sem fade.', en: 'The image fades in with opacity over --or-duration-medium (250ms), --or-ease-out. Cached images appear directly, without a fade.' } },
            { term: { pt: 'Erro', en: 'Error' }, description: { pt: 'O substituto entra com or-fade-in (250ms).', en: 'The fallback enters with or-fade-in (250ms).' } },
            { term: { pt: 'Movimento reduzido', en: 'Reduced motion' }, description: { pt: 'Troca instantânea: as durações zeram pelos tokens.', en: 'Instant swap: durations drop to zero through the tokens.' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'src', type: 'string', required: true, description: { pt: 'URL da imagem.', en: 'Image URL.' } },
            { name: 'alt', type: 'string', required: true, description: { pt: <>Texto alternativo. <Code>""</Code> só para imagens decorativas.</>, en: <>Alternative text. <Code>""</Code> only for decorative images.</> } },
            { name: 'ratio', type: "'1/1' | '4/3' | '3/2' | '16/9' | '21/9' | number", description: { pt: <>Proporção reservada (<Code>aspect-ratio</Code>). Sem ela, usa <Code>width</Code>/<Code>height</Code> numéricos.</>, en: <>Reserved ratio (<Code>aspect-ratio</Code>). Without it, numeric <Code>width</Code>/<Code>height</Code> are used.</> } },
            { name: 'fit', type: "'cover' | 'contain'", default: "'cover'", description: { pt: 'Recorta para preencher ou mostra a imagem inteira.', en: 'Crops to fill or shows the whole image.' } },
            { name: 'position', type: 'string', description: { pt: <>Ponto focal (<Code>object-position</Code>), ex.: <Code>'top'</Code>, <Code>'50% 30%'</Code>.</>, en: <>Focal point (<Code>object-position</Code>), e.g. <Code>'top'</Code>, <Code>'50% 30%'</Code>.</> } },
            { name: 'loading', type: "'lazy' | 'eager'", default: "'lazy'", description: { pt: 'Carregamento sob demanda do navegador.', en: 'Browser lazy loading.' } },
            { name: 'decoding', type: "'async' | 'sync' | 'auto'", default: "'async'", description: { pt: 'Decodificação fora da thread principal.', en: 'Decoding off the main thread.' } },
            { name: 'srcSet / sizes', type: 'string', description: { pt: 'Imagens responsivas, repassadas à <img>.', en: 'Responsive images, passed to the <img>.' } },
            { name: 'fallbackSrc', type: 'string', description: { pt: 'Segunda tentativa quando src falha.', en: 'Second attempt when src fails.' } },
            { name: 'fallback', type: 'ReactNode', description: { pt: 'Substitui o conteúdo padrão do erro.', en: 'Replaces the default error content.' } },
            { name: 'caption', type: 'ReactNode', description: { pt: <>Legenda; envolve em <Code>&lt;figure&gt;</Code>.</>, en: <>Caption; wraps in <Code>&lt;figure&gt;</Code>.</> } },
            { name: 'bordered', type: 'boolean', default: 'false', description: { pt: 'Borda de 1px por cima da imagem.', en: '1px border on top of the image.' } },
            { name: 'className / style', type: 'string / CSSProperties', description: { pt: 'Vão para o contêiner (ou para a figure, com caption).', en: 'Go to the container (or to the figure, with caption).' } },
            { name: '...rest', type: 'ImgHTMLAttributes', description: { pt: <>Demais atributos e a <Code>ref</Code> vão para a <Code>&lt;img&gt;</Code>.</>, en: <>Other attributes and the <Code>ref</Code> go to the <Code>&lt;img&gt;</Code>.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                O tipo exige <Code>alt</Code>, então esquecê-lo vira erro de compilação. Com <Code>alt=""</Code> a imagem sai
                da árvore de acessibilidade. O skeleton é decorativo (<Code>aria-hidden</Code>). Se a imagem falhar, o
                substituto padrão não é uma caixa vazia: ele mantém o conteúdo em texto oculto — "Imagem indisponível:
                Mochila Urbana 22 L".
              </>
            }
            en={
              <>
                The type requires <Code>alt</Code>, so forgetting it is a compile error. With <Code>alt=""</Code> the image
                leaves the accessibility tree. The skeleton is decorative (<Code>aria-hidden</Code>). If the image fails, the
                default fallback is not an empty box: it keeps the content as hidden text — "Image unavailable: Urban
                Backpack 22 L".
              </>
            }
          />
        </p>
        <Callout tone="info" title={{ pt: 'Legendas e alt', en: 'Captions and alt' }}>
          <T
            pt="A legenda complementa o alt, não o substitui: o alt descreve o que se vê; a legenda dá contexto (quando, onde, crédito). Não repita o mesmo texto nos dois."
            en="The caption complements the alt, it does not replace it: alt describes what is seen; the caption gives context (when, where, credit). Do not repeat the same text in both."
          />
        </Callout>
        <WcagList
          items={[
            { criterion: '1.1.1', description: { pt: 'alt obrigatório no tipo; alt="" explícito para imagens decorativas; substituto com o alt em texto.', en: 'alt required by the type; explicit alt="" for decorative images; fallback keeps the alt as text.' } },
            { criterion: '1.3.1', description: { pt: 'Legenda associada pela estrutura nativa <figure>/<figcaption>.', en: 'Caption associated through the native <figure>/<figcaption> structure.' } },
            { criterion: '2.3.3', description: { pt: 'Fade e brilho desligados com movimento reduzido.', en: 'Fade and shimmer turned off with reduced motion.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
