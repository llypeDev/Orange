import { Kbd } from '@orange/ui'

export default function Combinations() {
  return (
    <>
      <Kbd keys={['Ctrl', 'Shift', 'P']} />
      <Kbd keys={['Alt', 'Tab']} />
      <Kbd keys={['Ctrl', 'Enter']} />
      <Kbd keys={['Shift', 'Space']} />
      <Kbd keys={['ArrowUp', 'ArrowDown']} separator="/" />
      <Kbd keys={['Ctrl', 'Z']} size="sm" />
    </>
  )
}
