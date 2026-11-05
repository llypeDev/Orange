import { Link, Stack, Text } from '@orangesys/ui'

export default function Separadores() {
  return (
    <Stack gap={6}>
      {/* Na horizontal, o separador vira uma linha vertical da altura da pilha */}
      <Stack direction="horizontal" separator gap={3} align="center">
        <Text size="sm">Pedido enviado</Text>
        <Text size="sm">3 itens</Text>
        <Text size="sm">Frete grátis</Text>
      </Stack>

      {/* as="nav" vira um landmark: dê um nome com aria-label */}
      <Stack as="nav" aria-label="Links do rodapé" direction="horizontal" separator gap={3}>
        <Link href="#ajuda" variant="subtle">
          Central de ajuda
        </Link>
        <Link href="#termos" variant="subtle">
          Termos de uso
        </Link>
        <Link href="#privacidade" variant="subtle">
          Privacidade
        </Link>
      </Stack>
    </Stack>
  )
}
