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
import Checkout from './examples/Checkout'
import CheckoutCode from './examples/Checkout?raw'
import Clickable from './examples/Clickable'
import ClickableCode from './examples/Clickable?raw'
import Narrow from './examples/Narrow'
import NarrowCode from './examples/Narrow?raw'
import Vertical from './examples/Vertical'
import VerticalCode from './examples/Vertical?raw'
import WithError from './examples/WithError'
import WithErrorCode from './examples/WithError?raw'
import { meta } from './meta'

export default function StepperPage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use para fluxos lineares de 3 a 6 etapas (checkout, cadastro, configuração inicial). Com duas etapas, um título "Etapa 1 de 2" basta.',
              en: 'Use it for linear flows of 3 to 6 steps (checkout, sign-up, onboarding). With two steps, a "Step 1 of 2" heading is enough.',
            },
            {
              pt: 'Nomeie cada etapa pelo que a pessoa faz nela, com uma ou duas palavras: Entrega, Pagamento, Revisão.',
              en: 'Name each step by what people do in it, in one or two words: Shipping, Payment, Review.',
            },
            {
              pt: (
                <>
                  Deixe etapas concluídas clicáveis (<Code>onStepClick</Code>) quando a pessoa puder voltar sem perder dados.
                  Etapas futuras nunca são clicáveis.
                </>
              ),
              en: (
                <>
                  Make completed steps clickable (<Code>onStepClick</Code>) when people can go back without losing data.
                  Future steps are never clickable.
                </>
              ),
            },
            {
              pt: 'Marque etapas com problema com status="error" e explique o problema na descrição — não apenas com cor.',
              en: 'Mark steps with problems with status="error" and explain the issue in the description — not only with color.',
            },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Estados', en: 'States' }}>
        <DefinitionTable
          rows={[
            { term: { pt: 'complete', en: 'complete' }, description: { pt: 'Etapas antes de step. Quadrado com check e conector laranja.', en: 'Steps before step. Square with a check and an orange connector.' } },
            { term: { pt: 'current', en: 'current' }, description: { pt: <>A etapa de <Code>step</Code>. Quadrado laranja e <Code>aria-current="step"</Code>.</>, en: <>The step at <Code>step</Code>. Orange square and <Code>aria-current="step"</Code>.</> } },
            { term: { pt: 'upcoming', en: 'upcoming' }, description: { pt: 'Etapas seguintes. Quadrado com borda e número.', en: 'Following steps. Bordered square with a number.' } },
            { term: { pt: 'error', en: 'error' }, description: { pt: 'Definido por step.status. Quadrado vermelho com alerta.', en: 'Set via step.status. Red square with an alert.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Checkout', en: 'Checkout' }}
          description={{
            pt: 'Horizontal, controlado por step. Avance e volte com os botões.',
            en: 'Horizontal, driven by step. Move forward and back with the buttons.',
          }}
          code={CheckoutCode}
        >
          <Checkout />
        </Example>
        <Example
          title={{ pt: 'Vertical com conteúdo', en: 'Vertical with content' }}
          description={{
            pt: 'Na vertical, step.content aparece sob a etapa atual — bom para onboarding.',
            en: 'Vertically, step.content shows under the current step — good for onboarding.',
          }}
          code={VerticalCode}
        >
          <Vertical />
        </Example>
        <Example
          title={{ pt: 'Etapa com erro', en: 'Step with error' }}
          description={{
            pt: 'O estado de erro é anunciado ("com erro") e explicado na descrição.',
            en: 'The error state is announced ("with error") and explained in the description.',
          }}
          code={WithErrorCode}
        >
          <WithError />
        </Example>
        <Example
          title={{ pt: 'Etapas concluídas clicáveis', en: 'Clickable completed steps' }}
          description={{
            pt: 'Com onStepClick, só as etapas concluídas viram botões.',
            en: 'With onStepClick, only completed steps become buttons.',
          }}
          code={ClickableCode}
        >
          <Clickable />
        </Example>
        <Example
          title={{ pt: 'Em espaço estreito', en: 'In a narrow space' }}
          description={{
            pt: 'Abaixo de ~540px de largura do contêiner, só o rótulo da etapa atual aparece; os demais continuam acessíveis.',
            en: 'Below ~540px of container width, only the current step label shows; the others remain accessible.',
          }}
          code={NarrowCode}
        >
          <Narrow />
        </Example>
      </Section>

      <Section title={{ pt: 'Movimento', en: 'Motion' }}>
        <p>
          <T pt='Durações e curvas vêm dos tokens de motion e zeram com prefers-reduced-motion: o estado continua indicado por cor, borda ou texto.' en='Durations and curves come from the motion tokens and drop to zero with prefers-reduced-motion: state is still conveyed by color, border or text.' />
        </p>
        <DefinitionTable
          rows={[
            { term: { pt: 'Concluir uma etapa', en: 'Completing a step' }, description: { pt: 'O conector se preenche de laranja da esquerda para a direita (scaleX; na vertical, scaleY) — slow (400ms), ease-out. Ao voltar, ele recua.', en: 'The connector fills orange from left to right (scaleX; vertically, scaleY) — slow (400ms), ease-out. Going back retracts it.' } },
            { term: { pt: 'Nova etapa atual', en: 'New current step' }, description: { pt: 'O quadrado "salta" (scale 0.72 → 1) logo depois do conector — medium, ease-bounce, 160ms de atraso.', en: 'The square "pops" (scale 0.72 → 1) right after the connector — medium, ease-bounce, 160ms delay.' } },
            { term: { pt: 'Etapa concluída / com erro', en: 'Completed step / step with error' }, description: { pt: 'O check é desenhado (stroke-dashoffset); o alerta entra com scale-in — medium.', en: 'The check is drawn (stroke-dashoffset); the alert scales in — medium.' } },
            { term: { pt: 'Etapa clicável', en: 'Clickable step' }, description: { pt: 'Hover/foco: sublinhado cresce da esquerda e o quadrado acende (medium); clique: afunda (press).', en: 'Hover/focus: underline grows from the left and the square lights up (medium); click: it sinks (press).' } },
          ]}
        />
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'steps', type: 'StepperStep[]', required: true, description: { pt: '{ label, description?, status?, content? } em ordem.', en: '{ label, description?, status?, content? } in order.' } },
            { name: 'step', type: 'number', default: '0', description: { pt: 'Índice (base 0) da etapa atual.', en: 'Index (0-based) of the current step.' } },
            { name: 'activeStep', type: 'number', deprecated: { replacement: 'step', since: '0.6.0', removal: '1.0.0' }, description: { pt: 'Nome antigo de step.', en: 'Former name of step.' } },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: { pt: 'Orientação.', en: 'Orientation.' } },
            { name: 'onStepClick', type: '(index: number) => void', description: { pt: 'Torna as etapas concluídas clicáveis.', en: 'Makes completed steps clickable.' } },
            { name: 'aria-label', type: 'string', description: { pt: 'Nome da lista (ex.: "Etapas do checkout").', en: 'List name (e.g. "Checkout steps").' } },
            { name: '...rest', type: 'OlHTMLAttributes', description: { pt: <>Atributos nativos de <Code>&lt;ol&gt;</Code>.</>, en: <>Native <Code>&lt;ol&gt;</Code> attributes.</> } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={<>Uma <Code>&lt;ol&gt;</Code>: leitores de tela anunciam a posição ("3 de 4"). A etapa atual tem <Code>aria-current="step"</Code>; o estado de cada etapa vem em texto oculto — "(concluído)", "(atual)", "(com erro)". Números, check e alerta são decorativos. Etapas clicáveis são <Code>&lt;button&gt;</Code> nativos.</>}
            en={<>An <Code>&lt;ol&gt;</Code>: screen readers announce the position ("3 of 4"). The current step has <Code>aria-current="step"</Code>; each step state is given as hidden text — "(completed)", "(current)", "(with error)". Numbers, check and alert are decorative. Clickable steps are native <Code>&lt;button&gt;</Code>s.</>}
          />
        </p>
        <KeyboardTable
          rows={[
            { keys: ['Tab'], description: { pt: 'Percorre as etapas concluídas clicáveis.', en: 'Moves through clickable completed steps.' } },
            { keys: ['Enter'], description: { pt: 'Volta para a etapa em foco.', en: 'Goes back to the focused step.' } },
            { keys: ['Space'], description: { pt: 'Volta para a etapa em foco.', en: 'Goes back to the focused step.' } },
          ]}
        />
        <WcagList
          items={[
            { criterion: '1.3.1', description: { pt: 'Sequência exposta como lista ordenada.', en: 'Sequence exposed as an ordered list.' } },
            { criterion: '1.4.1', description: { pt: 'Estados indicados por ícone, preenchimento e texto, não só por cor.', en: 'States indicated by icon, fill and text, not only color.' } },
            { criterion: '2.4.8', description: { pt: 'Mostra onde a pessoa está dentro do fluxo.', en: 'Shows where people are within the flow.' } },
            { criterion: '4.1.2', description: { pt: 'Etapa atual com aria-current="step".', en: 'Current step with aria-current="step".' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
