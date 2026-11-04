import { Icon, ProgressCircle } from '@orange/ui'
import { useEffect, useState } from 'react'

const files = [
  { name: 'contrato-assinado.pdf', size: '1,2 MB', speed: 9 },
  { name: 'nota-fiscal-4821.xml', size: '48 KB', speed: 25 },
  { name: 'fotos-vistoria.zip', size: '18,4 MB', speed: 4 },
]

export default function Uploads() {
  const [progress, setProgress] = useState(files.map(() => 0))

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((list) => list.map((p, i) => (p >= 100 ? 0 : Math.min(100, p + files[i].speed))))
    }, 300)
    return () => clearInterval(timer)
  }, [])

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: '100%', maxWidth: 440 }}>
      {files.map((file, i) => (
        <li
          key={file.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0',
            borderTop: '1px solid var(--or-color-border)',
          }}
        >
          <Icon name="file" />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block' }}>{file.name}</span>
            <span style={{ fontSize: 12, color: 'var(--or-color-text-subtle)' }}>{file.size}</span>
          </span>
          {progress[i] >= 100 ? (
            <span style={{ color: 'var(--or-color-success-text)', display: 'inline-flex' }}>
              <Icon name="check-circle" label={`${file.name} enviado`} />
            </span>
          ) : (
            <ProgressCircle size="sm" value={progress[i]} label={`Enviando ${file.name}`} />
          )}
        </li>
      ))}
    </ul>
  )
}
