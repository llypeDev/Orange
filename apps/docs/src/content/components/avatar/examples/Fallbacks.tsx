import { Avatar } from '@orangesys/ui'
import mariana from './photos/mariana.svg'

export default function Fallbacks() {
  return (
    <>
      {/* 1. Foto carregada */}
      <Avatar src={mariana} name="Mariana Lopes" size="lg" />
      {/* 2. Foto que falhou: volta para as iniciais */}
      <Avatar src="/fotos/rafael-inexistente.jpg" name="Rafael Costa" size="lg" />
      {/* 3. Sem foto: iniciais e cor derivadas do nome */}
      <Avatar name="Beatriz Nunes" size="lg" />
      {/* 4. Sem nome: ícone de usuário */}
      <Avatar alt="Convidado" size="lg" />
    </>
  )
}
