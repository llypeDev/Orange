import { Button, Icon } from '@orangesys/ui'
import { useState } from 'react'

export default function Desenho() {
  const [rodada, setRodada] = useState(0)
  return (
    <div className="guide-row">
      {/* or-draw: stroke-dashoffset de --_draw-length até 0 */}
      <svg
        key={`c${rodada}`}
        className="guide-draw"
        viewBox="0 0 48 48"
        width="64"
        height="64"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="44" height="44" className="guide-draw__box" />
        <path
          d="M13 25l7 7 15-15"
          className="guide-draw__path"
          style={{ ['--_draw-length' as string]: 32 }}
        />
      </svg>
      <svg
        key={`l${rodada}`}
        className="guide-draw guide-draw--wide"
        viewBox="0 0 200 64"
        width="200"
        height="64"
        aria-hidden="true"
      >
        <polyline
          points="0,52 40,44 80,48 120,26 160,30 200,8"
          className="guide-draw__path guide-draw__path--line"
          style={{ ['--_draw-length' as string]: 230 }}
        />
      </svg>
      <Button
        size="sm"
        variant="ghost"
        startIcon={<Icon name="refresh" size="sm" />}
        onClick={() => setRodada((n) => n + 1)}
      >
        Repetir
      </Button>
    </div>
  )
}
