import { Avatar } from '@orangesys/ui'

const customers = [
  'Padaria Aurora',
  'Clínica Bem Viver',
  'Atelier Norte',
  'Mercado São Jorge',
  'Studio Pilates Vila',
  'Oficina do Pedro',
  'Livraria Capitu',
  'Café Moinho',
]

export default function Colors() {
  return (
    <>
      {customers.map((name) => (
        <Avatar key={name} name={name} title={name} />
      ))}
    </>
  )
}
