import { useEffect, useRef, useState } from 'react'
import { useDebouncedValue } from '../../hooks'
import { useLocale } from '../../providers'
import { VisuallyHidden } from '../VisuallyHidden'
import './CharacterCount.css'

export interface CharacterCountProps {
  /** Id do texto do contador (referenciado por `aria-describedby`). */
  id: string
  count: number
  max: number
}

/**
 * Contador "x de y caracteres" (interno). O texto visível é ligado ao campo
 * por `aria-describedby`; uma região `aria-live="polite"` separada anuncia a
 * contagem só quando a pessoa para de digitar — sem interromper a digitação.
 */
export function CharacterCount({ id, count, max }: CharacterCountProps) {
  const { t } = useLocale()
  const [initial] = useState(count)
  const dirty = useRef(false)
  if (count !== initial) dirty.current = true
  const settled = useDebouncedValue(count, 800)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (!dirty.current) return
    setAnnouncement(t('characterCount', { count: settled, max }))
  }, [settled, max, t])

  const remaining = max - count
  const state = remaining <= 0 ? 'limit' : remaining <= Math.max(1, Math.ceil(max * 0.1)) ? 'near' : undefined

  return (
    <div className="or-character-count" data-state={state}>
      <span id={id}>{t('characterCount', { count, max })}</span>
      <VisuallyHidden aria-live="polite" aria-atomic="true">
        {announcement}
      </VisuallyHidden>
    </div>
  )
}
