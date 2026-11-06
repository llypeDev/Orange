import type { ComponentMeta } from '../../types'

export const meta: ComponentMeta = {
  slug: 'save-status',
  name: 'SaveStatus',
  category: 'feedback',
  description: {
    pt: 'Indicador de salvamento automático: “Salvando…”, “Salvo há 2 min.” e “Erro ao salvar”, com nova tentativa.',
    en: 'Autosave indicator: “Saving…”, “Saved 2 min. ago” and “Could not save”, with a retry.',
  },
  status: 'new',
}
