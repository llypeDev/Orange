import { Reveal } from '@orange/ui'

export default function Basico() {
  return (
    <div className="guide-reveal-grid guide-reveal-grid--flush">
      {/* up (padrão): opacidade + 24px · fade: só opacidade · scale: opacidade + escala 0.96 */}
      <Reveal className="guide-reveal-card">variant="up"</Reveal>
      <Reveal variant="fade" className="guide-reveal-card">
        variant="fade"
      </Reveal>
      <Reveal variant="scale" className="guide-reveal-card">
        variant="scale"
      </Reveal>
    </div>
  )
}
