import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react'
import { cx, getFocusableElements, mergeRefs } from '../../utils'
import { ErrorSummary, type ErrorSummaryItem } from '../ErrorSummary'
import './Form.css'

/** Valor de um campo: texto (ou `File`), ou uma lista quando vários controles têm o mesmo `name`. */
export type FormValue = FormDataEntryValue | FormDataEntryValue[]

/** Valores do formulário por `name`, lidos com `FormData`. Campos ausentes (caixa desmarcada) ficam de fora. */
export type FormValues = Record<string, FormValue | undefined>

/** Mensagens de erro por `name`. `undefined` ou `''` = sem erro. */
export type FormErrors = Record<string, string | undefined>

/** Estado exposto pelo render-prop `children` e pelo hook `useForm()`. */
export interface FormState {
  /** Erros visíveis agora (validação depois do envio + erros externos), por `name`. */
  errors: Record<string, string>
  /** `true` enquanto a promessa retornada por `onSubmit` está pendente. */
  isSubmitting: boolean
  /** Número de tentativas de envio (válidas ou não). */
  submitCount: number
  /** `true` quando não há erros visíveis. Antes do primeiro envio, é sempre `true`. */
  isValid: boolean
  /** Mensagem de erro visível de um campo. */
  getError: (name: string) => string | undefined
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  /**
   * Validação síncrona, chamada no envio com os valores do formulário. Retorne
   * uma mensagem por `name` inválido. Depois de um envio com erros, roda de novo
   * a cada alteração para tirar os erros já corrigidos.
   */
  validate?: (values: FormValues) => FormErrors
  /**
   * Chamado só quando não há erros de validação. Se retornar uma promessa, o
   * formulário fica `aria-busy` e bloqueia novos envios até ela terminar. Sem
   * `onSubmit`, um envio válido segue o caminho nativo (`action`/`method`).
   */
  onSubmit?: (values: FormValues, event: FormEvent<HTMLFormElement>) => void | Promise<void>
  /**
   * Erros externos (ex.: retornados pela API), somados aos de validação. Cada um
   * some quando o valor daquele campo muda e volta se `errors` mudar.
   */
  errors?: FormErrors
  /** Mostra o `ErrorSummary` no topo depois de um envio com erros. Padrão: `true`. */
  errorSummary?: boolean
  /** Título do resumo. Padrão: "Corrija os seguintes erros" (dicionário de mensagens). */
  errorSummaryTitle?: ReactNode
  /** Espaçamento entre os filhos: `sm` 12px, `md` 20px, `lg` 32px. Padrão: `md`. */
  gap?: 'sm' | 'md' | 'lg'
  /** Conteúdo do formulário, ou uma função que recebe o `FormState`. */
  children?: ReactNode | ((state: FormState) => ReactNode)
}

const FormContext = createContext<FormState | null>(null)

/**
 * Lê o estado do `Form` mais próximo: `{ errors, isSubmitting, submitCount, isValid, getError }`.
 * @example const { getError } = useForm(); <TextField name="email" error={getError('email')} />
 */
export function useForm(): FormState {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('[Orange] useForm precisa estar dentro de <Form>.')
  return ctx
}

/* -------------------------------------------------------------------------- */
/* Valores                                                                     */
/* -------------------------------------------------------------------------- */

function collectValues(form: HTMLFormElement, submitter?: HTMLElement | null): FormValues {
  let data: FormData
  try {
    data = submitter ? new FormData(form, submitter) : new FormData(form)
  } catch {
    data = new FormData(form)
  }
  const values: FormValues = {}
  data.forEach((value, key) => {
    // Campo de arquivo sem arquivo escolhido: fica de fora, como uma caixa desmarcada.
    if (typeof value !== 'string' && value.name === '' && value.size === 0) return
    const current = Object.prototype.hasOwnProperty.call(values, key) ? values[key] : undefined
    if (current === undefined) values[key] = value
    else values[key] = Array.isArray(current) ? [...current, value] : [current, value]
  })
  return values
}

function valueKey(value: FormValue | undefined): string {
  const one = (v: FormDataEntryValue) => (typeof v === 'string' ? v : `file:${v.name}:${v.size}:${v.lastModified}`)
  if (value === undefined) return ''
  return JSON.stringify(Array.isArray(value) ? value.map(one) : one(value))
}

/** Mantém só mensagens não vazias. */
function cleanErrors(errors: FormErrors | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!errors) return out
  for (const [name, message] of Object.entries(errors)) {
    if (typeof message === 'string' && message.trim() !== '') out[name] = message
  }
  return out
}

function sameErrors(a: Record<string, string>, b: Record<string, string>) {
  const keys = Object.keys(a)
  return keys.length === Object.keys(b).length && keys.every((k) => a[k] === b[k])
}

/* -------------------------------------------------------------------------- */
/* Campos no DOM                                                               */
/* -------------------------------------------------------------------------- */

interface FieldTarget {
  /** Elemento que recebe o foco. */
  element: HTMLElement
  /** Grupo de opções (radios/caixas com o mesmo `name`): rola até a legenda. */
  group: boolean
  /** Id estável para o link do resumo (num grupo, o do `<fieldset>` ou da primeira opção). */
  id: string
}

/** Controle que a pessoa alcança com Tab (exclui ocultos, desabilitados e `tabIndex=-1`). */
function isVisibleControl(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement) || el.tagName === 'FIELDSET' || el.tagName === 'OUTPUT') return false
  if (el instanceof HTMLInputElement && el.type === 'hidden') return false
  return !(el as HTMLInputElement).disabled && el.tabIndex >= 0
}

const firstTabbable = (root: HTMLElement) => getFocusableElements(root).find((el) => el.tabIndex >= 0) ?? null

/**
 * Controle visível de um campo que envia o valor por um input que a pessoa não
 * alcança (`type="hidden"` no Combobox, DatePicker, NumberField, Switch…; o
 * `<input type="file">` oculto do FileUploader): o controle do `Field` que o
 * contém ou, fora de um `Field`, o primeiro focável do ancestral mais próximo.
 */
function visibleControlFor(hidden: HTMLElement, form: HTMLFormElement): HTMLElement | null {
  const field = hidden.closest<HTMLElement>('.or-field')
  if (field && form.contains(field)) {
    const label = field.querySelector('label[for]') as HTMLLabelElement | null
    const control = label ? form.ownerDocument.getElementById(label.htmlFor) : null
    if (control && isVisibleControl(control)) return control
    const first = firstTabbable(field)
    if (first) return first
  }
  for (let node = hidden.parentElement; node && node !== form; node = node.parentElement) {
    const first = firstTabbable(node)
    if (first) return first
  }
  return null
}

/** Encontra o controle de um `name` (ou `id`) com `form.elements.namedItem`. */
function findField(form: HTMLFormElement, name: string): FieldTarget | null {
  const item = form.elements.namedItem(name)
  const list: Element[] = !item ? [] : item instanceof Element ? [item] : Array.from(item)
  if (list.length === 0) {
    const byId = form.ownerDocument.getElementById(name)
    return byId && form.contains(byId) ? { element: byId, group: false, id: byId.id } : null
  }
  const visible = list.filter(isVisibleControl)
  if (visible.length > 0) {
    // Grupo de opções: a marcada ou a primeira.
    const checked = visible.find((el) => (el as HTMLInputElement).checked)
    const element = checked ?? visible[0]
    const isOption = element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox')
    const group = isOption && visible.length > 1
    const fieldset = group ? element.closest('fieldset') : null
    const id = (fieldset && visible.every((el) => fieldset.contains(el)) && fieldset.id) || visible[0].id || name
    return { element, group, id }
  }
  const control = list[0] instanceof HTMLElement ? visibleControlFor(list[0], form) : null
  return control ? { element: control, group: false, id: control.id || list[0].id || name } : null
}

function byDocumentOrder(a: HTMLElement | null, b: HTMLElement | null) {
  if (!a || !b) return a ? -1 : b ? 1 : 0
  if (a === b) return 0
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}

/** Erros na ordem dos campos no formulário; os sem campo encontrado vão para o fim. */
function orderFields(form: HTMLFormElement | null, errors: Record<string, string>) {
  return Object.entries(errors)
    .map(([name, message]) => ({ name, message, target: form ? findField(form, name) : null }))
    .sort((a, b) => byDocumentOrder(a.target?.element ?? null, b.target?.element ?? null))
}

/** Rola até o rótulo (ou a legenda do grupo) e foca o controle. */
function focusField({ element, group }: FieldTarget) {
  const legend = group ? element.closest('fieldset')?.querySelector('legend') : null
  const anchor = legend ?? (element as HTMLInputElement).labels?.[0] ?? element
  anchor.scrollIntoView?.({ block: 'center' })
  element.focus({ preventScroll: true })
}

/* -------------------------------------------------------------------------- */
/* Form                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Orquestra um formulário no padrão GOV.UK: valida no envio, mostra um
 * `ErrorSummary` no topo com links para cada campo inválido, move o foco para
 * ele e, depois do primeiro envio, tira os erros conforme são corrigidos. Os
 * erros chegam aos campos pelo render-prop `children` ou por `useForm()`.
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    validate,
    onSubmit,
    errors: errorsProp,
    errorSummary = true,
    errorSummaryTitle,
    gap = 'md',
    className,
    children,
    onReset,
    onInputCapture,
    onChangeCapture,
    onClickCapture,
    onKeyUpCapture,
    onBlurCapture,
    ...rest
  },
  ref,
) {
  const formRef = useRef<HTMLFormElement>(null)
  const mergedRef = useMemo(() => mergeRefs(ref, formRef), [ref])
  const summaryRef = useRef<HTMLElement>(null)
  const submittingRef = useRef(false)

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [submitCount, setSubmitCount] = useState(0)
  const [isSubmitting, setSubmitting] = useState(false)
  const [focusRequest, setFocusRequest] = useState(0)
  const [revalidateTick, setRevalidateTick] = useState(0)

  // Erros externos: estáveis enquanto o conteúdo não muda (objetos inline não disparam efeitos).
  const externalKey = JSON.stringify(Object.entries(cleanErrors(errorsProp)).sort(([a], [b]) => a.localeCompare(b)))
  const externalErrors = useMemo<Record<string, string>>(() => Object.fromEntries(JSON.parse(externalKey)), [externalKey])
  // Campos editados depois que os erros externos chegaram (valem só para aquele conjunto de erros).
  const [dismissed, setDismissed] = useState<{ key: string; names: string[] }>({ key: '', names: [] })
  const dismissedNames = useMemo(
    () => (dismissed.key === externalKey ? dismissed.names : []),
    [dismissed, externalKey],
  )
  const snapshotRef = useRef<FormValues>({})
  const previousExternal = useRef<Record<string, string>>({})

  const errors = useMemo(() => {
    const merged: Record<string, string> = {}
    for (const [name, message] of Object.entries(externalErrors)) {
      if (!dismissedNames.includes(name)) merged[name] = message
    }
    return Object.assign(merged, validationErrors)
  }, [externalErrors, dismissedNames, validationErrors])
  const errorCount = Object.keys(errors).length
  const armed = errorCount > 0

  // Erros externos novos: guarda os valores atuais (para saber quando o campo muda) e move o foco.
  useEffect(() => {
    const form = formRef.current
    snapshotRef.current = form ? collectValues(form) : {}
    const previous = previousExternal.current
    previousExternal.current = externalErrors
    if (Object.entries(externalErrors).some(([name, message]) => previous[name] !== message)) {
      setFocusRequest((n) => n + 1)
    }
  }, [externalErrors])

  // Revalidação depois do envio: só atualiza ou remove erros que já estão visíveis.
  const handledTick = useRef(0)
  useEffect(() => {
    if (revalidateTick === handledTick.current) return
    handledTick.current = revalidateTick
    const form = formRef.current
    if (!form) return
    const values = collectValues(form)
    if (validate && Object.keys(validationErrors).length > 0) {
      const fresh = cleanErrors(validate(values))
      const next: Record<string, string> = {}
      for (const name of Object.keys(validationErrors)) if (fresh[name]) next[name] = fresh[name]
      if (!sameErrors(next, validationErrors)) setValidationErrors(next)
    }
    const changed = Object.keys(externalErrors).filter(
      (name) => !dismissedNames.includes(name) && valueKey(values[name]) !== valueKey(snapshotRef.current[name]),
    )
    if (changed.length > 0) setDismissed({ key: externalKey, names: [...dismissedNames, ...changed] })
  }, [revalidateTick, validate, validationErrors, externalErrors, externalKey, dismissedNames])

  // Foco depois de um envio com erros (ou de erros externos novos): resumo ou primeiro campo inválido.
  const handledFocus = useRef(0)
  useEffect(() => {
    if (focusRequest === handledFocus.current) return
    handledFocus.current = focusRequest
    if (errorSummary && summaryRef.current) {
      summaryRef.current.focus()
      return
    }
    const first = orderFields(formRef.current, errors).find((item) => item.target)
    if (first?.target) focusField(first.target)
  }, [focusRequest, errorSummary, errors])

  const scheduleRevalidation = <E extends SyntheticEvent>(external?: (event: E) => void) => (event: E) => {
    external?.(event)
    if (armed) setRevalidateTick((n) => n + 1)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (submittingRef.current) {
      event.preventDefault()
      return
    }
    const form = event.currentTarget
    const submitter = (event.nativeEvent as SubmitEvent).submitter ?? null
    const values = collectValues(form, submitter)
    const fresh = validate ? cleanErrors(validate(values)) : {}
    setSubmitCount((n) => n + 1)
    setValidationErrors(fresh)
    if (Object.keys(fresh).length > 0) {
      event.preventDefault()
      setFocusRequest((n) => n + 1)
      return
    }
    if (!onSubmit) return // envio nativo
    event.preventDefault()
    const result = onSubmit(values, event)
    if (result && typeof (result as PromiseLike<void>).then === 'function') {
      submittingRef.current = true
      setSubmitting(true)
      const done = () => {
        submittingRef.current = false
        setSubmitting(false)
      }
      Promise.resolve(result).then(done, (error: unknown) => {
        done()
        throw error
      })
    }
  }

  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    onReset?.(event)
    if (event.defaultPrevented) return
    setValidationErrors({})
    setSubmitCount(0)
    setDismissed({ key: externalKey, names: Object.keys(externalErrors) })
  }

  const getError = useCallback((name: string) => errors[name], [errors])
  const state = useMemo<FormState>(
    () => ({ errors, isSubmitting, submitCount, isValid: errorCount === 0, getError }),
    [errors, isSubmitting, submitCount, errorCount, getError],
  )

  // Itens do resumo na ordem do formulário; o link aponta para o id do controle.
  const fields = orderFields(formRef.current, errors)
  const nameById = new Map<string, string>()
  const summaryItems: ErrorSummaryItem[] = fields.map(({ name, message, target }) => {
    const id = target?.id || name
    nameById.set(id, name)
    return { id, message }
  })

  const handleItemClick = (item: ErrorSummaryItem, event: MouseEvent<HTMLAnchorElement>) => {
    const name = nameById.get(item.id)
    const target = name !== undefined && formRef.current ? findField(formRef.current, name) : null
    if (!target) return // segue o comportamento padrão do ErrorSummary (#id)
    event.preventDefault()
    focusField(target)
  }

  return (
    <FormContext.Provider value={state}>
      <form
        ref={mergedRef}
        noValidate
        {...rest}
        className={cx('or-form', `or-form--gap-${gap}`, className)}
        aria-busy={isSubmitting || rest['aria-busy'] || undefined}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onInputCapture={scheduleRevalidation(onInputCapture)}
        onChangeCapture={scheduleRevalidation(onChangeCapture)}
        onClickCapture={scheduleRevalidation(onClickCapture)}
        onKeyUpCapture={scheduleRevalidation(onKeyUpCapture)}
        onBlurCapture={scheduleRevalidation(onBlurCapture)}
      >
        {errorSummary && (
          <ErrorSummary
            ref={summaryRef}
            errors={summaryItems}
            title={errorSummaryTitle}
            onItemClick={handleItemClick}
          />
        )}
        {typeof children === 'function' ? children(state) : children}
      </form>
    </FormContext.Provider>
  )
})

/* -------------------------------------------------------------------------- */
/* FormActions                                                                 */
/* -------------------------------------------------------------------------- */

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Alinhamento dos botões: `start` (padrão), `end` ou `between` (ex.: Voltar … Continuar). */
  align?: 'start' | 'end' | 'between'
}

/**
 * Linha de botões no fim do formulário: espaçamento padrão, quebra de linha em
 * telas estreitas e alinhamento. Coloque o botão de envio primeiro na ordem de leitura.
 */
export const FormActions = forwardRef<HTMLDivElement, FormActionsProps>(function FormActions(
  { align = 'start', className, ...rest },
  ref,
) {
  return <div ref={ref} className={cx('or-form-actions', `or-form-actions--${align}`, className)} {...rest} />
})
