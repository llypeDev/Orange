import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useSearchParams } from 'react-router-dom'
import { EMBED_PARAM, isPreviewTheme, READY_MESSAGE, readMessage, THEME_MESSAGE, type PreviewTheme } from './embed'

/** `true` quando a rota do modelo foi aberta pela prévia (`?embed=1`) ou em nova aba. */
export function useEmbedMode(): boolean {
  const [params] = useSearchParams()
  return params.get(EMBED_PARAM) === '1'
}

/**
 * Modo "embed": desenha só o modelo, sem a casca da documentação.
 *
 * - Esconde o `#root` (cabeçalho, menu e `<main>` da documentação) e renderiza o
 *   modelo direto no `<body>` do iframe — os Portals (Drawer, Toast, diálogos)
 *   também vão para esse `<body>` e ficam dentro da moldura.
 * - Aplica o tema pedido pela prévia (`?theme=` e mensagens `postMessage`).
 * - Links `#âncora` não mudam o histórico do iframe nem rolam a página para o
 *   topo: só rolam até o alvo, quando ele existe.
 */
export function TemplateEmbed({ title, children }: { title: string; children: ReactNode }) {
  const [params] = useSearchParams()
  const initialTheme = params.get('theme')
  const [theme, setTheme] = useState<PreviewTheme | null>(isPreviewTheme(initialTheme) ? initialTheme : null)

  useLayoutEffect(() => {
    const root = document.getElementById('root')
    if (!root) return
    const previous = root.style.display
    root.style.display = 'none'
    return () => {
      root.style.display = previous
    }
  }, [])

  useEffect(() => {
    document.title = `${title} · Modelos do Orange`
  }, [title])

  useEffect(() => {
    if (!theme) return
    // O OrangeProvider do app também escreve data-theme no <html> (ao montar ou
    // quando o tema do sistema muda): o tema da prévia é reaplicado por cima.
    const html = document.documentElement
    const apply = () => {
      if (html.getAttribute('data-theme') !== theme) html.setAttribute('data-theme', theme)
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [theme])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const message = readMessage(event.data)
      if (message.type === THEME_MESSAGE && isPreviewTheme(message.theme)) setTheme(message.theme)
    }
    window.addEventListener('message', onMessage)
    if (window.parent !== window) window.parent.postMessage({ type: READY_MESSAGE }, window.location.origin)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    // Fase de bolha no document: roda depois dos handlers do React (SkipLink,
    // ErrorSummary e AppShell já chamam preventDefault quando tratam o clique).
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      const href = link?.getAttribute('href')
      if (!href?.startsWith('#')) return
      event.preventDefault()
      const target = href.length > 1 ? document.getElementById(decodeURIComponent(href.slice(1))) : null
      target?.scrollIntoView({ block: 'start' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return createPortal(
    <div className="tpl-embed" lang="pt-BR">
      {children}
    </div>,
    document.body,
  )
}
