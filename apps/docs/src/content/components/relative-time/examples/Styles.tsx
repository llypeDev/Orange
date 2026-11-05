import { RelativeTime } from '@orangesys/ui'

const ontem = new Date(Date.now() - 26 * 3_600_000)
const recente = new Date(Date.now() - 42 * 60_000)

export default function Styles() {
  return (
    <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 24px', margin: 0, fontSize: 14 }}>
      <dt>numeric="auto" (padrão)</dt>
      <dd style={{ margin: 0 }}>
        <RelativeTime date={ontem} />
      </dd>
      <dt>numeric="always"</dt>
      <dd style={{ margin: 0 }}>
        <RelativeTime date={ontem} numeric="always" />
      </dd>
      <dt>relativeStyle="short"</dt>
      <dd style={{ margin: 0 }}>
        <RelativeTime date={recente} relativeStyle="short" />
      </dd>
      <dt>format="absolute"</dt>
      <dd style={{ margin: 0 }}>
        <RelativeTime date={recente} format="absolute" />
      </dd>
    </dl>
  )
}
