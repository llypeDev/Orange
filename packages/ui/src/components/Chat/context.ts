import { createContext } from 'react'

/**
 * Interno: o `ChatThread` avisa às mensagens se a primeira renderização já
 * passou. Só as mensagens que chegam depois entram com animação — o histórico
 * inicial aparece parado.
 */
export const ChatThreadContext = createContext<{ ready: boolean } | null>(null)
