/**
 * Sincroniza os tokens do Orange com as variáveis de um arquivo do Figma pela
 * API REST de variáveis.
 *
 *   pnpm --filter @orange/tokens figma:sync --dry-run   # só mostra o payload
 *   FIGMA_TOKEN=… FIGMA_FILE_KEY=… pnpm --filter @orange/tokens figma:sync
 *
 * Nunca roda em CI por padrão (veja `requireSyncEnvironment`). A lógica fica em
 * `figma-variables.ts`; aqui só há argumentos, ambiente e rede.
 */
import {
  buildDesiredCollections,
  buildVariablesPayload,
  describePayload,
  isEmptyPayload,
  parseSyncArgs,
  requireSyncEnvironment,
  usage,
  type LocalVariables,
  type VariablesPayload,
} from './figma-variables'

const API = 'https://api.figma.com/v1'

async function figma<T>(path: string, token: string, body?: VariablesPayload): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'X-Figma-Token': token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  let data: { message?: string; err?: string; error?: boolean } & T
  try {
    data = JSON.parse(text)
  } catch {
    data = { message: text } as typeof data
  }
  if (!response.ok || data.error === true) {
    const detail = data.message ?? data.err ?? response.statusText
    const hint =
      response.status === 403
        ? '\nO token precisa dos escopos file_variables:read e file_variables:write, e o plano do Figma precisa liberar a API REST de variáveis (escrita).'
        : response.status === 404
          ? '\nArquivo não encontrado: confira FIGMA_FILE_KEY (o trecho depois de /design/ na URL).'
          : ''
    throw new Error(`Figma respondeu ${response.status} em ${path}: ${detail}${hint}`)
  }
  return data
}

async function main() {
  const options = parseSyncArgs(process.argv.slice(2))
  if (options.help) {
    console.log(usage)
    return
  }

  const desired = buildDesiredCollections()

  if (options.dryRun) {
    // Sem rede: o payload completo, como se o arquivo ainda não tivesse as variáveis.
    const payload = buildVariablesPayload(desired)
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`)
    console.error(`[dry-run] ${describePayload(payload)}. Nada foi enviado ao Figma.`)
    return
  }

  const { token, fileKey } = requireSyncEnvironment(options, process.env)
  const local = await figma<{ meta: LocalVariables }>(`/files/${fileKey}/variables/local`, token)
  const payload = buildVariablesPayload(desired, local.meta)
  if (isEmptyPayload(payload)) {
    console.log('Nada a sincronizar: as variáveis do Figma já estão iguais aos tokens.')
    return
  }
  await figma(`/files/${fileKey}/variables`, token, payload)
  console.log(`Figma sincronizado: ${describePayload(payload)}.`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
