import { Button, Icon } from '@orange/ui'
import { useState } from 'react'

export default function PecasQueCaem() {
  const [rodada, setRodada] = useState(0)
  return (
    <div className="guide-row">
      {/* or-piece-drop: cada peça cai 40% da própria altura, escalonada por --or-stagger */}
      <svg
        key={rodada}
        className="guide-pieces"
        viewBox="0 0 24 24"
        width="96"
        height="96"
        aria-hidden="true"
      >
        <rect
          x="0"
          y="0"
          width="24"
          height="24"
          className="guide-pieces__piece"
          style={{ ['--_i' as string]: 0 }}
          fill="var(--or-color-accent)"
        />
        <rect
          x="12"
          y="0"
          width="12"
          height="12"
          className="guide-pieces__piece"
          style={{ ['--_i' as string]: 1 }}
          fill="var(--or-color-bg)"
        />
        <rect
          x="15"
          y="3"
          width="6"
          height="6"
          className="guide-pieces__piece"
          style={{ ['--_i' as string]: 2 }}
          fill="var(--or-color-text)"
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
