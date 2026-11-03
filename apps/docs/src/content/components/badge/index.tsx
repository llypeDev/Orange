import { Bullets, Code, ComponentPage, DoDont, Example, PropsTable, Section, WcagList } from '../../../kit'
import { T } from '../../../i18n'
import { Badge, Button, Icon } from '@orange/ui'
import Inline from './examples/Inline'
import InlineCode from './examples/Inline?raw'
import OnAvatar from './examples/OnAvatar'
import OnAvatarCode from './examples/OnAvatar?raw'
import Overlay from './examples/Overlay'
import OverlayCode from './examples/Overlay?raw'
import Tones from './examples/Tones'
import TonesCode from './examples/Tones?raw'
import { meta } from './meta'

export default function BadgePage() {
  return (
    <ComponentPage meta={meta}>
      <Section title={{ pt: 'Boas práticas', en: 'Best practices' }}>
        <Bullets
          items={[
            {
              pt: 'Use badges para contagens e sinais curtos que mudam com o uso: notificações, itens pendentes, novidades.',
              en: 'Use badges for counts and short signals that change with use: notifications, pending items, news.',
            },
            {
              pt: (
                <>
                  Sempre informe <Code>label</Code> com a frase completa ("3 notificações não lidas"). Um número solto
                  não diz o que está sendo contado.
                </>
              ),
              en: (
                <>
                  Always provide a <Code>label</Code> with the full sentence ("3 unread notifications"). A bare number
                  does not say what is being counted.
                </>
              ),
            },
            {
              pt: (
                <>
                  Limite números grandes com <Code>max</Code> (padrão 99 → "99+"). O valor exato pode ir no{' '}
                  <Code>label</Code>.
                </>
              ),
              en: (
                <>
                  Cap large numbers with <Code>max</Code> (default 99 → "99+"). The exact value can go in the{' '}
                  <Code>label</Code>.
                </>
              ),
            },
            {
              pt: 'Para rótulos de texto ("Novo", "Beta", status), use Tag. Badge é para números e pontos.',
              en: 'For text labels ("New", "Beta", status), use Tag. Badge is for numbers and dots.',
            },
          ]}
        />
        <DoDont
          doExample={
            <Badge count={3} label="3 notificações não lidas">
              <Button variant="outline" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
            </Badge>
          }
          dontExample={
            <Badge count={3} tone="danger">
              <Button variant="danger" iconOnly aria-label="Notificações" startIcon={<Icon name="bell" />} />
            </Badge>
          }
          doItems={[{ pt: 'Badge com label sobre um botão neutro.', en: 'A badge with a label over a neutral button.' }]}
          dontItems={[{ pt: 'Badge sem label e com a mesma cor do fundo em que está.', en: 'A badge without a label and the same color as its background.' }]}
        />
      </Section>

      <Section title={{ pt: 'Exemplos', en: 'Examples' }}>
        <Example
          title={{ pt: 'Sobre botões', en: 'On buttons' }}
          description={{
            pt: 'Com children, o badge fica no canto superior direito e o label vira a descrição acessível do botão (aria-describedby).',
            en: 'With children, the badge sits in the top-right corner and the label becomes the button accessible description (aria-describedby).',
          }}
          code={OverlayCode}
          align="center"
        >
          <Overlay />
        </Example>
        <Example
          title={{ pt: 'Inline em navegação', en: 'Inline in navigation' }}
          description={{
            pt: 'Sem children, o badge acompanha o texto. Com count={0}, ele some (use showZero para manter).',
            en: 'Without children, the badge follows the text. With count={0}, it disappears (use showZero to keep it).',
          }}
          code={InlineCode}
        >
          <Inline />
        </Example>
        <Example
          title={{ pt: 'Sobre avatares', en: 'On avatars' }}
          description={{
            pt: 'overlap="circle" aproxima o badge da borda de elementos redondos.',
            en: 'overlap="circle" moves the badge closer to the edge of round elements.',
          }}
          code={OnAvatarCode}
          align="center"
        >
          <OnAvatar />
        </Example>
        <Example
          title={{ pt: 'Tons, tamanhos e pontos', en: 'Tones, sizes and dots' }}
          description={{
            pt: 'accent (padrão), neutral, success, warning, danger e info, nos tamanhos md e sm. Pontos sem label são decorativos.',
            en: 'accent (default), neutral, success, warning, danger and info, in md and sm sizes. Dots without a label are decorative.',
          }}
          code={TonesCode}
        >
          <Tones />
        </Example>
      </Section>

      <Section title="Props" id="props">
        <PropsTable
          rows={[
            { name: 'count', type: 'number', description: { pt: 'Número exibido. Com 0 o badge some.', en: 'Displayed number. With 0 the badge disappears.' } },
            { name: 'max', type: 'number', default: '99', description: { pt: 'Acima dele, mostra "max+".', en: 'Above it, shows "max+".' } },
            { name: 'label', type: 'string', description: { pt: 'Texto acessível completo.', en: 'Full accessible text.' } },
            { name: 'dot', type: 'boolean', default: 'false', description: { pt: 'Mostra só um ponto quadrado.', en: 'Shows only a square dot.' } },
            { name: 'tone', type: "'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'", default: "'accent'", description: { pt: 'Cor semântica.', en: 'Semantic color.' } },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: { pt: 'Altura de 16 ou 20px.', en: '16 or 20px height.' } },
            { name: 'showZero', type: 'boolean', default: 'false', description: { pt: 'Mantém o badge com count 0.', en: 'Keeps the badge with count 0.' } },
            { name: 'overlap', type: "'square' | 'circle'", default: "'square'", description: { pt: 'Forma do elemento ancorado.', en: 'Shape of the anchored element.' } },
            { name: 'children', type: 'ReactElement', description: { pt: 'Elemento sobre o qual o badge é posicionado.', en: 'Element the badge is positioned over.' } },
            { name: '...rest', type: 'HTMLAttributes<HTMLSpanElement>', description: { pt: 'Atributos do indicador.', en: 'Indicator attributes.' } },
          ]}
        />
      </Section>

      <Section title={{ pt: 'Acessibilidade', en: 'Accessibility' }}>
        <p>
          <T
            pt={
              <>
                Inline, o número fica oculto para leitores de tela e o <Code>label</Code> é lido no lugar dele. Sobre um
                elemento, o badge visual é <Code>aria-hidden</Code> e o <Code>label</Code> é ligado ao filho via{' '}
                <Code>aria-describedby</Code>: o leitor anuncia "Notificações, botão, 3 notificações não lidas". O filho
                nunca é remontado quando a contagem muda, então o foco é preservado.
              </>
            }
            en={
              <>
                Inline, the number is hidden from screen readers and the <Code>label</Code> is read instead. Over an
                element, the visual badge is <Code>aria-hidden</Code> and the <Code>label</Code> is linked to the child
                via <Code>aria-describedby</Code>: screen readers announce "Notifications, button, 3 unread
                notifications". The child is never remounted when the count changes, so focus is preserved.
              </>
            }
          />
        </p>
        <p>
          <T
            pt="Mudanças de contagem não são anunciadas automaticamente. Se a atualização for importante, anuncie-a com um Toast ou uma região de status."
            en="Count changes are not announced automatically. If an update matters, announce it with a Toast or a status region."
          />
        </p>
        <WcagList
          items={[
            { criterion: '1.1.1', description: { pt: 'O label dá significado ao número ou ponto.', en: 'The label gives meaning to the number or dot.' } },
            { criterion: '1.4.1', description: { pt: 'Informação não depende só da cor: o label descreve o estado.', en: 'Information does not rely on color alone: the label describes the state.' } },
            { criterion: '1.4.3', description: { pt: 'Contraste mínimo de 4.5:1 entre número e fundo em todos os tons.', en: 'Minimum 4.5:1 contrast between number and background in every tone.' } },
            { criterion: '1.4.11', description: { pt: 'Anel na cor do fundo separa o badge do elemento ancorado.', en: 'A background-colored ring separates the badge from the anchored element.' } },
          ]}
        />
      </Section>
    </ComponentPage>
  )
}
