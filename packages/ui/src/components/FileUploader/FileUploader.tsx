import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { useControllableState, useId } from '../../hooks'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { cx } from '../../utils'
import { Button } from '../Button'
import { Field, useField, type FieldContextValue } from '../Field'
import { VisuallyHidden } from '../VisuallyHidden'
import './FileUploader.css'

export type FileUploaderStatus = 'idle' | 'uploading' | 'success' | 'error'

/** Um arquivo da lista. Atualize `status`/`progress` (modo controlado) durante o envio. */
export interface FileUploaderItem {
  /** Identificador estável do item. */
  id: string
  file: File
  /** Estado do envio. Padrão: `idle`. Arquivos recusados chegam como `error`. */
  status?: FileUploaderStatus
  /** Progresso de 0 a 100, exibido quando `status` é `uploading`. */
  progress?: number
  /** Mensagem exibida quando `status` é `error`. */
  error?: string
}

export interface FileUploaderProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue' | 'children'
> {
  /** Rótulo visível do campo. */
  label?: ReactNode
  /** Oculta o rótulo visualmente (continua acessível). */
  hideLabel?: boolean
  /** Texto de ajuda — informe aqui os tipos e o tamanho aceitos. */
  description?: ReactNode
  /** Mensagem de erro do campo. */
  error?: ReactNode
  required?: boolean
  /** Mostra "(opcional)" ao lado do rótulo. */
  optional?: boolean
  disabled?: boolean
  /** Tipos aceitos, como no atributo nativo: `.pdf,image/*`. */
  accept?: string
  /** Permite vários arquivos. Sem `multiple`, um novo arquivo substitui o anterior. */
  multiple?: boolean
  /** Tamanho máximo por arquivo, em bytes. Arquivos maiores entram na lista com erro. */
  maxSize?: number
  /** Quantidade máxima de arquivos válidos (com `multiple`). */
  maxFiles?: number
  /** Lista de arquivos (controlado). */
  value?: FileUploaderItem[]
  /** Lista inicial (não controlado). */
  defaultValue?: FileUploaderItem[]
  /** Chamado com a lista completa sempre que arquivos entram ou saem. */
  onFilesChange?: (items: FileUploaderItem[]) => void
  /** Chamado só com os arquivos aceitos de cada seleção — útil para iniciar o envio. */
  onFilesAdded?: (items: FileUploaderItem[]) => void
  /** Chamado quando o usuário remove um arquivo. */
  onFileRemove?: (item: FileUploaderItem) => void
  /** Nome do campo para envio em formulários nativos. */
  name?: string
  /** Id do `<input type="file">`. */
  id?: string
}

let itemCounter = 0
const createId = () => `or-file-${Date.now().toString(36)}-${(itemCounter++).toString(36)}`

/** Verifica um arquivo contra o atributo `accept` (extensões e tipos MIME, com curinga). */
function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  if (tokens.length === 0) return true
  const name = file.name.toLowerCase()
  const type = (file.type || '').toLowerCase()
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

/** "512 bytes", "48 kB", "2,4 MB" — formatado conforme o locale. */
function formatFileSize(bytes: number, locale: string): string {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const
  let value = bytes
  let index = 0
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index++
  }
  const options: Intl.NumberFormatOptions = {
    style: 'unit',
    unit: units[index],
    unitDisplay: index === 0 ? 'long' : 'short',
    maximumFractionDigits: index < 2 ? 0 : 1,
  }
  try {
    return new Intl.NumberFormat(locale, options).format(value)
  } catch {
    return new Intl.NumberFormat('pt-BR', options).format(value)
  }
}

interface DropzoneProps {
  field: FieldContextValue | null
  inputId?: string
  disabled: boolean
  multiple: boolean
  accept?: string
  name?: string
  items: FileUploaderItem[]
  onFiles: (files: File[]) => void
  buttonRef: Ref<HTMLButtonElement>
}

/** Área de soltar + botão + input nativo (lê os ids do Field para os vínculos ARIA). */
function Dropzone({
  field,
  inputId,
  disabled,
  multiple,
  accept,
  name,
  items,
  onFiles,
  buttonRef,
}: DropzoneProps) {
  const { t } = useLocale()
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [dragging, setDragging] = useState(false)
  const buttonTextId = useId('or-file-uploader-button')
  const describedBy = [field?.descriptionId, field?.errorId].filter(Boolean).join(' ') || undefined

  // Mantém o FileList do input nativo em sincronia para envio em <form>.
  useEffect(() => {
    const input = inputRef.current
    if (!input || !name || typeof DataTransfer === 'undefined') return
    try {
      const transfer = new DataTransfer()
      items
        .filter((item) => item.status !== 'error')
        .forEach((item) => transfer.items.add(item.file))
      input.files = transfer.files
    } catch {
      // navegadores sem DataTransfer construível: o envio fica a cargo da aplicação.
    }
  }, [items, name])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!name) event.target.value = '' // permite escolher o mesmo arquivo de novo
    if (files.length > 0) onFiles(files)
  }

  const hasFiles = (event: DragEvent) =>
    Array.from(event.dataTransfer?.types ?? []).includes('Files')

  return (
    <div
      className="or-file-uploader__dropzone"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      data-invalid={field?.invalid || undefined}
      onDragEnter={(event) => {
        if (disabled || !hasFiles(event)) return
        event.preventDefault()
        dragDepth.current += 1
        setDragging(true)
      }}
      onDragOver={(event) => {
        if (disabled || !hasFiles(event)) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
      }}
      onDragLeave={() => {
        if (disabled) return
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (dragDepth.current === 0) setDragging(false)
      }}
      onDrop={(event) => {
        if (disabled) return
        event.preventDefault()
        dragDepth.current = 0
        setDragging(false)
        const files = Array.from(event.dataTransfer?.files ?? [])
        if (files.length > 0) onFiles(files)
      }}
    >
      <span className="or-file-uploader__glyph" aria-hidden="true">
        <Icon name="upload" size="lg" />
      </span>
      <p className="or-file-uploader__prompt">
        <span>{t('dropFiles')}</span>{' '}
        <button
          ref={buttonRef}
          type="button"
          className="or-file-uploader__button"
          disabled={disabled}
          aria-labelledby={[field?.labelId, buttonTextId].filter(Boolean).join(' ')}
          aria-describedby={describedBy}
          onClick={() => inputRef.current?.click()}
        >
          <span id={buttonTextId}>{t(multiple ? 'chooseFiles' : 'chooseFile')}</span>
        </button>
      </p>
      <input
        ref={inputRef}
        id={inputId ?? field?.controlId}
        type="file"
        className="or-visually-hidden"
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        name={name}
        disabled={disabled}
        aria-describedby={describedBy}
        onChange={handleChange}
      />
    </div>
  )
}

/** Lê o contexto do Field (precisa estar dentro dele). */
function WithField({ children }: { children: (field: FieldContextValue | null) => ReactNode }) {
  return <>{children(useField())}</>
}

/**
 * Envio de arquivos com área de arrastar e soltar, botão nativo, validação
 * de tipo/tamanho/quantidade, lista com progresso e anúncios para leitores
 * de tela.
 */
export const FileUploader = forwardRef<HTMLDivElement, FileUploaderProps>(function FileUploader(
  {
    label,
    hideLabel,
    description,
    error,
    required,
    optional,
    disabled = false,
    accept,
    multiple = false,
    maxSize,
    maxFiles,
    value,
    defaultValue = [],
    onFilesChange,
    onFilesAdded,
    onFileRemove,
    name,
    id,
    className,
    ...rest
  },
  ref,
) {
  const { t, locale } = useLocale()
  const [items, setItems] = useControllableState<FileUploaderItem[]>({
    value,
    defaultValue,
    onChange: onFilesChange,
  })
  const [countError, setCountError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const maxSizeLabel = useMemo(
    () => (maxSize ? formatFileSize(maxSize, locale) : ''),
    [maxSize, locale],
  )

  const announce = (message: string) =>
    setAnnouncement((prev) => (prev === message ? `${message}\u00a0` : message))

  const addFiles = (files: File[]) => {
    if (disabled) return
    const incoming = multiple ? files : files.slice(0, 1)
    const kept = multiple ? items : []
    let validCount = kept.filter((item) => item.status !== 'error').length
    let overflow = false
    const added: FileUploaderItem[] = []
    for (const file of incoming) {
      let fileError: string | undefined
      if (!matchesAccept(file, accept)) fileError = t('fileTypeNotAccepted')
      else if (maxSize !== undefined && file.size > maxSize)
        fileError = t('fileTooLarge', { size: maxSizeLabel })
      if (!fileError && multiple && maxFiles !== undefined && validCount >= maxFiles) {
        overflow = true
        continue
      }
      if (!fileError) validCount++
      added.push({ id: createId(), file, status: fileError ? 'error' : 'idle', error: fileError })
    }
    setCountError(overflow ? t('tooManyFiles', { max: maxFiles ?? 0 }) : null)
    if (added.length === 0) {
      if (overflow) announce(t('tooManyFiles', { max: maxFiles ?? 0 }))
      return
    }
    setItems([...kept, ...added])

    const accepted = added.filter((item) => item.status !== 'error')
    const rejected = added.filter((item) => item.status === 'error')
    if (accepted.length > 0) onFilesAdded?.(accepted)
    const parts: string[] = []
    if (added.length === 1) {
      const [only] = added
      parts.push(
        only.error ? `${only.file.name}: ${only.error}` : t('fileAdded', { name: only.file.name }),
      )
    } else {
      if (accepted.length === 1) parts.push(t('fileAdded', { name: accepted[0].file.name }))
      else if (accepted.length > 1) parts.push(t('filesAdded', { count: accepted.length }))
      if (rejected.length > 0) parts.push(t('filesRejected', { count: rejected.length }))
    }
    if (overflow) parts.push(t('tooManyFiles', { max: maxFiles ?? 0 }))
    announce(parts.join('. '))
  }

  const removeItem = (item: FileUploaderItem) => {
    const index = items.findIndex((i) => i.id === item.id)
    const next = items.filter((i) => i.id !== item.id)
    setItems(next)
    setCountError(null)
    onFileRemove?.(item)
    announce(t('fileRemoved', { name: item.file.name }))
    // Leva o foco ao próximo "remover" (ou ao botão de escolher arquivos).
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
        '.or-file-uploader__remove',
      )
      const target = buttons?.[Math.min(index, buttons.length - 1)] ?? buttonRef.current
      target?.focus()
    })
  }

  const fieldError = error ?? countError ?? undefined

  return (
    <div ref={ref} className={cx('or-file-uploader', className)} {...rest}>
      <Field
        label={label}
        hideLabel={hideLabel}
        description={description}
        error={fieldError}
        required={required}
        optional={optional}
        disabled={disabled}
        controlId={id}
      >
        <WithField>
          {(field) => (
            <Dropzone
              field={field}
              inputId={id}
              disabled={disabled}
              multiple={multiple}
              accept={accept}
              name={name}
              items={items}
              onFiles={addFiles}
              buttonRef={buttonRef}
            />
          )}
        </WithField>

        {items.length > 0 && (
          <ul ref={listRef} className="or-file-uploader__list" aria-label={t('selectedFiles')}>
            {items.map((item) => {
              const status = item.status ?? 'idle'
              const progress = Math.round(Math.min(100, Math.max(0, item.progress ?? 0)))
              return (
                <li key={item.id} className="or-file-uploader__item" data-status={status}>
                  <Icon
                    name={status === 'error' ? 'alert-circle' : 'file'}
                    className="or-file-uploader__file-icon"
                  />
                  <div className="or-file-uploader__meta">
                    <span className="or-file-uploader__name" title={item.file.name}>
                      {item.file.name}
                    </span>
                    <span className="or-file-uploader__details">
                      <span>{formatFileSize(item.file.size, locale)}</span>
                      {status === 'uploading' && <span>{progress}%</span>}
                      {status === 'success' && (
                        <span className="or-file-uploader__status or-file-uploader__status--success">
                          <Icon name="check" size="xs" />
                          {t('uploadComplete')}
                        </span>
                      )}
                      {status === 'error' && (
                        <span className="or-file-uploader__status or-file-uploader__status--error">
                          {item.error ?? t('uploadFailed')}
                        </span>
                      )}
                    </span>
                    {status === 'uploading' && (
                      <div
                        className="or-file-uploader__progress"
                        role="progressbar"
                        aria-label={t('uploadingFile', { name: item.file.name })}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progress}
                      >
                        <span
                          className="or-file-uploader__progress-bar"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    className="or-file-uploader__remove"
                    aria-label={t('removeItem', { label: item.file.name })}
                    startIcon={<Icon name="close" />}
                    disabled={disabled}
                    onClick={() => removeItem(item)}
                  />
                </li>
              )
            })}
          </ul>
        )}
        <VisuallyHidden role="status" aria-live="polite">
          {announcement}
        </VisuallyHidden>
      </Field>
    </div>
  )
})
