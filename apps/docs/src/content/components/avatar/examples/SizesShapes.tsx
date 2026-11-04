import { Avatar } from '@orange/ui'
import rafael from './photos/rafael.svg'

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export default function SizesShapes() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        {sizes.map((size) => (
          <Avatar key={size} size={size} name="Diego Almeida" />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        {sizes.map((size) => (
          <Avatar key={size} size={size} shape="circle" src={rafael} name="Rafael Costa" />
        ))}
      </div>
    </div>
  )
}
