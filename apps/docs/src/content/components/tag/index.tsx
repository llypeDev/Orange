import {
  Bullets,
  Code,
  ComponentPage,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import Removable from './examples/Removable'
import RemovableCode from './examples/Removable?raw'
import SolidSizes from './examples/SolidSizes'
import SolidSizesCode from './examples/SolidSizes?raw'
import Status from './examples/Status'
import StatusCode from './examples/Status?raw'
import WithIcons from './examples/WithIcons'
import WithIconsCode from './examples/WithIcons?raw'
import { meta } from './meta'

export default function TagPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use tags para categorias e status que o usuário só lê. Para filtros que ele liga e desliga, use Chip.',
              en: 'Use tags for categories and statuses users only read. For filters they toggle, use Chip.',
            },
            {
              pt: 'Escreva rótulos de uma a três palavras. A cor reforça, mas o texto sozinho precisa bastar.',
              en: 'Write one- to three-word labels. Color reinforces, but the text alone must be enough.',
            },
            {
              pt: 'Mantenha o mesmo tom para o mesmo significado em todo o produto (ex.: success sempre = concluído).',
              en: 'Keep the same tone for the same meaning across the product (e.g. success always = done).',
            },
            {
              pt: (
                <>
                  Ao remover uma tag, mova o foco para a tag vizinha ou para um controle próximo — nunca deixe o foco
                  cair no <Code>&lt;body&gt;</Code>.
                </>
              ),
              en: (
                <>
                  When a tag is removed, move focus to the neighboring tag or a nearby control — never let focus fall to
                  the <Code>&lt;body&gt;</Code>.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Status', en: 'Status' }}
          description={{
            pt: 'Variante outline (padrão): borda neutra e marcador quadrado na cor do tom.',
            en: 'Outline variant (default): neutral border and a square marker in the tone color.',
          }}
          code={StatusCode}
        >
          <Status />
        </Example>
        <Example
          title={{ pt: 'Solid e tamanhos', en: 'Solid and sizes' }}
          description={{
            pt: 'solid usa o fundo suave do tom e o texto na cor do tom. Tamanhos sm, md (padrão) e lg.',
            en: 'solid uses the tone subtle background and tone-colored text. Sizes sm, md (default) and lg.',
          }}
          code={SolidSizesCode}
        >
          <SolidSizes />
        </Example>
        <Example
          title={{ pt: 'Com ícones', en: 'With icons' }}
          description={{
            pt: 'icon substitui o marcador; marker={false} remove o marcador.',
            en: 'icon replaces the marker; marker={false} removes it.',
          }}
          code={WithIconsCode}
        >
          <WithIcons />
        </Example>
        <Example
          title={{ pt: 'Removível', en: 'Removable' }}
          description={{
            pt: 'onRemove adiciona o botão "Remover {rótulo}". O exemplo move o foco para a próxima tag após a remoção.',
            en: 'onRemove adds the "Remove {label}" button. The example moves focus to the next tag after removal.',
          }}
          code={RemovableCode}
        >
          <Removable />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: { pt: 'Cor semântica.', en: 'Semantic color.' } },
            { name: 'variant', type: "'outline' | 'solid'", default: "'outline'", description: { pt: 'Borda neutra ou fundo suave do tom.', en: 'Neutral border or tone subtle background.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura de 22, 28 ou 32px.', en: '22, 28 or 32px height.' } },
            { name: 'marker', type: 'boolean', default: 'true', description: { pt: 'Mostra o marcador quadrado.', en: 'Shows the square marker.' } },
            { name: 'icon', type: 'ReactNode', description: { pt: 'Ícone no lugar do marcador.', en: 'Icon instead of the marker.' } },
            { name: 'onRemove', type: '(event) => void', description: { pt: 'Mostra o botão de remover.', en: 'Shows the remove button.' } },
            { name: 'removeLabel', type: 'string', default: 't("removeItem", { label })', description: { pt: 'Rótulo acessível do botão de remover.', en: 'Accessible label of the remove button.' } },
            { name: 'disabled', type: 'boolean', default: 'false', description: { pt: 'Desabilita o botão de remover.', en: 'Disables the remove button.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLSpanElement>', description: { pt: 'Atributos nativos do <span>.', en: 'Native <span> attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                A tag é texto: o marcador e o ícone são decorativos. O botão de remover é um{' '}
                <Code>&lt;button&gt;</Code> nativo com nome "Remover São Paulo" (traduzido via{' '}
                <Code>t('removeItem')</Code>). Para um conjunto de tags, envolva-as em uma lista rotulada.
              </>
            }
            en={
              <>
                The tag is text: the marker and icon are decorative. The remove button is a native{' '}
                <Code>&lt;button&gt;</Code> named "Remove São Paulo" (translated via <Code>t('removeItem')</Code>). For
                a set of tags, wrap them in a labelled list.
              </>
            }
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o botão de remover.', en: 'Moves focus to the remove button.' } },
            { keys: ['Enter'], description: { pt: 'Remove a tag.', en: 'Removes the tag.' } },
            { keys: ['Space'], description: { pt: 'Remove a tag.', en: 'Removes the tag.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.1', description: { pt: 'O significado está no texto, não só na cor do marcador.', en: 'Meaning is in the text, not only in the marker color.' } },
            { criterion: '1.4.3', description: { pt: 'Texto da variante solid com contraste mínimo de 4.5:1 sobre o fundo do tom.', en: 'Solid variant text with at least 4.5:1 contrast on the tone background.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível no botão de remover.', en: 'Visible focus on the remove button.' } },
            { criterion: '4.1.2', description: { pt: 'Botão de remover com nome que inclui o rótulo da tag.', en: 'Remove button named with the tag label.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
