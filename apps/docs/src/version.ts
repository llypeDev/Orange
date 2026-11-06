import uiPackage from '@orangesys/ui/package.json'

/**
 * Versão atual de `@orangesys/ui` (tokens e ui são versionados juntos), lida do `package.json`
 * que o Release atualiza no PR "Versionar pacotes". Como o merge desse PR também publica no npm,
 * selos, textos e "em desenvolvimento" do site viram junto com a publicação, sem PR manual.
 */
export const libVersion: string = uiPackage.version

function parse(version: string): number[] {
  return version.replace(/^v/, '').split('.').map(Number)
}

/** Verdadeiro quando `version` (ex.: `v1.0.0`) ainda não foi publicada. */
export function isUnreleased(version: string): boolean {
  const [a, b] = [parse(version), parse(libVersion)]
  for (let i = 0; i < 3; i++) if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0)
  return false
}

/** Verdadeiro enquanto a biblioteca estiver na série 0.x. */
export const isPreOne = parse(libVersion)[0] === 0
