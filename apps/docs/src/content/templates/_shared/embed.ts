/*
 * Protocolo entre a prévia (página da documentação) e o modelo aberto no iframe.
 *
 * A prévia carrega a própria rota do modelo com `?embed=1`: o iframe tem a sua
 * janela, então media queries, `useMediaQuery` (AppShell, Grid, Toast…) e os
 * Portals respondem à largura do iframe, não à da documentação.
 */

/** Nome de um tema do Orange (`dark`, `light` e variantes como `dark-hc`). */
export type PreviewTheme = string

/** Parâmetro de busca que liga o modo "embed" na rota do modelo. */
export const EMBED_PARAM = 'embed'

/** Mensagem do iframe para a prévia: o modelo está desenhado. */
export const READY_MESSAGE = 'orange-template:ready'

/** Mensagem da prévia para o iframe: troque o tema. */
export const THEME_MESSAGE = 'orange-template:theme'

/** Aceita qualquer nome de tema bem formado: o iframe só repassa o valor para `data-theme`. */
export const isPreviewTheme = (value: unknown): value is PreviewTheme =>
  typeof value === 'string' && /^[a-z]+(?:-[a-z]+)*$/.test(value)

/** Lê `{ type, theme }` de uma mensagem sem confiar no formato. */
export function readMessage(data: unknown): { type?: string; theme?: unknown } {
  if (typeof data !== 'object' || data === null) return {}
  const { type, theme } = data as { type?: unknown; theme?: unknown }
  return { type: typeof type === 'string' ? type : undefined, theme }
}
