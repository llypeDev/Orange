import { Footer } from '@orange/ui'

export default function BottomOnly() {
  // Telas internas (checkout, painel): só a barra inferior, sem mapa do site.
  return (
    <Footer
      bottom={
        <>
          <span>© 2026 Aurora Commerce</span>
          <span>
            <a href="#termos">Termos de uso</a> · <a href="#privacidade">Privacidade</a> ·{' '}
            <a href="#ajuda">Ajuda</a>
          </span>
        </>
      }
    />
  )
}
