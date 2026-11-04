import { Kbd } from '@orange/ui'

export default function MacSymbols() {
  return (
    <>
      {/* "Mod" vira ⌘ com symbols e Ctrl sem eles */}
      <Kbd keys={['Mod', 'K']} symbols />
      <Kbd keys={['Mod', 'Shift', 'P']} symbols separator="" />
      <Kbd keys={['Alt', 'Backspace']} symbols />
      <Kbd keys={['Ctrl', 'Tab']} symbols />
      <Kbd keys={['Mod', 'Enter']} symbols separator="" />
    </>
  )
}
