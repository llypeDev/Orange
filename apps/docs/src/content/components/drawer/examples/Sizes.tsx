import { Button, Drawer, type DrawerSize } from '@orange/ui'

const tamanhos: { size: DrawerSize; label: string }[] = [
  { size: 'sm', label: 'sm · 360px' },
  { size: 'md', label: 'md · 480px' },
  { size: 'lg', label: 'lg · 640px' },
  { size: 'full', label: 'full · 100%' },
]

export default function Sizes() {
  return (
    <>
      {tamanhos.map(({ size, label }) => (
        <Drawer
          key={size}
          size={size}
          title={`Tamanho ${label}`}
          trigger={<Button variant="outline">{label}</Button>}
        >
          <p style={{ margin: 0 }}>
            Em telas estreitas, todos os tamanhos ocupam a largura disponível.
          </p>
        </Drawer>
      ))}
    </>
  )
}
