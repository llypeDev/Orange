import {
  Bullets,
  Code,
  ComponentPage,
  DefinitionTable,
  DoDont,
  Example,
  KeyboardTable,
  PropsTable,
  Section,
  WcagList,
} from '../../../kit'
import { T } from '../../../i18n'
import { Button } from '@orangesys/ui'
import Loading from './examples/Loading'
import LoadingCode from './examples/Loading?raw'
import Sizes from './examples/Sizes'
import SizesCode from './examples/Sizes?raw'
import Variants from './examples/Variants'
import VariantsCode from './examples/Variants?raw'
import WithIcons from './examples/WithIcons'
import WithIconsCode from './examples/WithIcons?raw'
import { meta } from './meta'

export default function ButtonPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: (
                <>
                  Não use botões para navegar. Para levar o usuário a outra página, use <strong>Link</strong>.
                </>
              ),
              en: (
                <>
                  Don't use buttons for navigation. To take the user to another page, use <strong>Link</strong>.
                </>
              ),
            },
            {
              pt: (
                <>
                  O rótulo diz o que acontece no clique. Use verbos — <strong>Salvar</strong>, <strong>Excluir</strong> — em
                  caixa de sentença e com até três palavras.
                </>
              ),
              en: (
                <>
                  The label says what happens on click. Use verbs — <strong>Save</strong>, <strong>Delete</strong> — in
                  sentence case, up to three words.
                </>
              ),
            },
            {
              pt: 'Use apenas um botão primary por contexto; as demais ações ficam em secondary, outline ou ghost.',
              en: 'Use only one primary button per context; other actions use secondary, outline or ghost.',
            },
          ]}
        />
        <DoDont
          doExample={
            <>
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar projeto</Button>
            </>
          }
          dontExample={
            <>
              <Button>Cancelar</Button>
              <Button>OK</Button>
            </>
          }
          doItems={[{ pt: 'Uma ação primária com rótulo específico.', en: 'One primary action with a specific label.' }]}
          dontItems={[{ pt: 'Duas ações primárias com rótulos genéricos como "OK".', en: 'Two primary actions with generic labels such as "OK".' }]}
        />
      </Section>

      <Section title={{ pt: 'Tipos de botões', en: 'Button types' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'Primary', en: 'Primary' }, description: { pt: 'A ação principal da tela. Fundo laranja.', en: 'The main action on screen. Orange fill.' } },
            { term: { pt: 'Secondary', en: 'Secondary' }, description: { pt: 'Ação de alto contraste que não compete com o laranja.', en: 'High-contrast action that does not compete with orange.' } },
            { term: { pt: 'Outline', en: 'Outline' }, description: { pt: 'Ações secundárias, como Cancelar ou Voltar.', en: 'Secondary actions such as Cancel or Back.' } },
            { term: { pt: 'Ghost', en: 'Ghost' }, description: { pt: 'Ações terciárias e barras de ferramentas.', en: 'Tertiary actions and toolbars.' } },
            { term: { pt: 'Danger', en: 'Danger' }, description: { pt: 'Ações destrutivas (excluir, remover). Confirme antes de executar.', en: 'Destructive actions (delete, remove). Confirm before executing.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example title={{ pt: 'Variantes', en: 'Variants' }} code={VariantsCode}>
          <Variants />
        </Example>
        <Example
          title={{ pt: 'Tamanhos', en: 'Sizes' }}
          description={{ pt: 'sm (32px), md (40px, padrão) e lg (48px). Use block para ocupar toda a largura.', en: 'sm (32px), md (40px, default) and lg (48px). Use block to fill the width.' }}
          code={SizesCode}
        >
          <Sizes />
        </Example>
        <Example
          title={{ pt: 'Com ícones', en: 'With icons' }}
          description={{
            pt: 'O ícone final desliza no hover. Botões só com ícone precisam de aria-label.',
            en: 'The end icon slides on hover. Icon-only buttons need an aria-label.',
          }}
          code={WithIconsCode}
        >
          <WithIcons />
        </Example>
        <Example
          title={{ pt: 'Carregando e desabilitado', en: 'Loading and disabled' }}
          description={{
            pt: 'Em loading, o botão continua focável, anuncia o status e ignora novos cliques.',
            en: 'While loading, the button stays focusable, announces its status and ignores new clicks.',
          }}
          code={LoadingCode}
        >
          <Loading />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: { pt: 'Estilo visual.', en: 'Visual style.' } },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: { pt: 'Altura do botão.', en: 'Button height.' } },
            { name: 'block', type: 'boolean', default: 'false', description: { pt: 'Ocupa 100% da largura.', en: 'Takes 100% of the width.' } },
            { name: 'loading', type: 'boolean', default: 'false', description: { pt: 'Mostra o indicador e bloqueia cliques.', en: 'Shows the indicator and blocks clicks.' } },
            { name: 'loadingText', type: 'string', description: { pt: 'Texto anunciado durante o carregamento.', en: 'Text announced while loading.' } },
            { name: 'startIcon', type: 'ReactNode', description: { pt: 'Ícone antes do rótulo.', en: 'Icon before the label.' } },
            { name: 'endIcon', type: 'ReactNode', description: { pt: 'Ícone depois do rótulo.', en: 'Icon after the label.' } },
            { name: 'iconOnly', type: 'boolean', default: 'false', description: { pt: <>Botão quadrado só com ícone. Exige <Code>aria-label</Code>.</>, en: <>Square icon-only button. Requires <Code>aria-label</Code>.</> } },
            { name: '...rest', type: 'ButtonHTMLAttributes', description: { pt: 'Todos os atributos nativos de <button>.', en: 'All native <button> attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Renderiza um <Code>&lt;button type="button"&gt;</Code> nativo: foco, teclado e semântica vêm de graça.</>}
            en={<>Renders a native <Code>&lt;button type="button"&gt;</Code>: focus, keyboard and semantics come for free.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Move o foco para o botão.', en: 'Moves focus to the button.' } },
            { keys: ['Enter'], description: { pt: 'Ativa o botão.', en: 'Activates the button.' } },
            { keys: ['Space'], description: { pt: 'Ativa o botão.', en: 'Activates the button.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.4.3', description: { pt: 'Contraste mínimo de 4.5:1 entre rótulo e fundo em todas as variantes.', en: 'Minimum 4.5:1 contrast between label and background in every variant.' } },
            { criterion: '2.4.7', description: { pt: 'Foco visível com contorno laranja de 2px.', en: 'Visible focus with a 2px orange outline.' } },
            { criterion: '2.5.8', description: { pt: 'Área de toque mínima de 32×32px (tamanho sm).', en: 'Minimum 32×32px target size (sm size).' } },
            { criterion: '4.1.2', description: { pt: <>Estado de carregamento exposto com <Code>aria-busy</Code> e região de status.</>, en: <>Loading state exposed with <Code>aria-busy</Code> and a status region.</> } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
