import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useId } from '../../hooks'
import { useLocale, type MessageKey } from '../../providers'
import { clamp, cx } from '../../utils'
import type { RenderLink } from '../Link'
import { ProgressBar } from '../ProgressBar'
import { Tag, type TagTone } from '../Tag'
import './TaskList.css'

export type TaskListStatus = 'complete' | 'in-progress' | 'not-started' | 'cannot-start' | 'error'

const statusKeys: Record<TaskListStatus, MessageKey> = {
  complete: 'taskListComplete',
  'in-progress': 'taskListInProgress',
  'not-started': 'taskListNotStarted',
  'cannot-start': 'taskListCannotStart',
  error: 'taskListError',
}

/** Tom da tag de cada status. `cannot-start` é texto simples, sem tag. */
const statusTones: Record<Exclude<TaskListStatus, 'cannot-start'>, TagTone> = {
  complete: 'success',
  'in-progress': 'info',
  'not-started': 'neutral',
  error: 'danger',
}

function isTaskListStatus(value: unknown): value is TaskListStatus {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(statusKeys, value)
}

interface TaskListContextValue {
  renderLink?: RenderLink
}

const TaskListContext = createContext<TaskListContextValue>({})

/* -------------------------------------------------------------------------- */
/* TaskListItem                                                               */
/* -------------------------------------------------------------------------- */

export interface TaskListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'onClick'> {
  /** Nome da tarefa. Em linhas acionáveis, é o texto (e o nome acessível) do link ou botão. */
  children: ReactNode
  /** Texto de apoio abaixo do nome. Descreve o link/botão da linha (`aria-describedby`). */
  description?: ReactNode
  /**
   * Situação da tarefa: `complete` (tag verde), `in-progress` (azul), `not-started`
   * (neutra), `error` (vermelha) ou `cannot-start` (texto simples; a linha nunca é link).
   */
  status: TaskListStatus
  /** Substitui o texto padrão do status (ex.: "Disponível após o frete"). */
  statusLabel?: ReactNode
  /** Destino da tarefa. A linha inteira vira o alvo do link. */
  href?: string
  /** Sem `href`, torna a linha um botão (ex.: abrir um diálogo). Com `href`, é repassado ao link. */
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

/**
 * Uma tarefa da `TaskList`: nome (link ou botão quando acionável), descrição
 * opcional e status em texto + tag.
 */
export const TaskListItem = forwardRef<HTMLLIElement, TaskListItemProps>(function TaskListItem(
  { status, statusLabel, description, href, onClick, className, children, ...rest },
  ref,
) {
  const { t } = useLocale()
  const { renderLink } = useContext(TaskListContext)
  const baseId = useId('or-task-list-item')
  const descriptionId = `${baseId}-description`
  const statusId = `${baseId}-status`
  const hasDescription = description !== undefined && description !== null && description !== false
  const actionable = status !== 'cannot-start' && Boolean(href || onClick)
  const label = statusLabel ?? t(statusKeys[status])

  // Motion: o status só "salta" quando muda depois de montado (nada se move no carregamento).
  const [shownStatus, setShownStatus] = useState(status)
  const [changed, setChanged] = useState(false)
  if (shownStatus !== status) {
    setShownStatus(status)
    setChanged(true)
  }

  // Como no GOV.UK: o nome é o rótulo; descrição e status descrevem o controle.
  const describedBy = [hasDescription ? descriptionId : undefined, statusId]
    .filter(Boolean)
    .join(' ')
  const controlClass = 'or-task-list__label or-task-list__link'

  let name: ReactNode
  if (actionable && href) {
    const linkProps = {
      href,
      className: controlClass,
      'aria-describedby': describedBy,
      onClick,
      children,
    }
    name = renderLink ? renderLink(linkProps) : <a {...linkProps} />
  } else if (actionable) {
    name = (
      <button
        type="button"
        className={controlClass}
        aria-describedby={describedBy}
        onClick={onClick}
      >
        {children}
      </button>
    )
  } else {
    name = <span className="or-task-list__label">{children}</span>
  }

  return (
    <li
      ref={ref}
      className={cx(
        'or-task-list__item',
        actionable && 'or-task-list__item--actionable',
        className,
      )}
      data-status={status}
      {...rest}
    >
      <div className="or-task-list__main">
        {name}
        {hasDescription && (
          <div id={descriptionId} className="or-task-list__description">
            {description}
          </div>
        )}
      </div>
      <div id={statusId} className="or-task-list__status" data-changed={changed || undefined}>
        {status === 'cannot-start' ? (
          <span key={status} className="or-task-list__status-value or-task-list__status-text">
            {label}
          </span>
        ) : (
          <Tag key={status} className="or-task-list__status-value" tone={statusTones[status]}>
            {label}
          </Tag>
        )}
      </div>
    </li>
  )
})

/* -------------------------------------------------------------------------- */
/* TaskList                                                                   */
/* -------------------------------------------------------------------------- */

export interface TaskListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Título do resumo acima da lista (ex.: "Configure sua loja"). Também nomeia a lista. */
  title?: ReactNode
  /** Nível do heading do `title`. Padrão: `2`. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /**
   * Mostra o progresso ("3 de 5 concluídas") com uma `ProgressBar`.
   * Padrão: `true` quando há `title`.
   */
  showProgress?: boolean
  /**
   * Tarefas concluídas. Padrão: contadas a partir dos `TaskListItem` filhos
   * diretos com `status="complete"`.
   */
  completed?: number
  /** Total de tarefas. Padrão: o número de `TaskListItem` filhos diretos. */
  total?: number
  /**
   * Renderiza os links das tarefas com o componente do seu roteador:
   * `renderLink={({ href, ...p }) => <RouterLink to={href} {...p} />}`.
   */
  renderLink?: RenderLink
  /** Elementos `TaskListItem`. */
  children?: ReactNode
}

/**
 * Lista de tarefas com status, para fluxos longos que a pessoa conclui em
 * qualquer ordem e em várias visitas (configuração de conta, onboarding,
 * cadastro em seções). Padrão "Task list" do GOV.UK.
 */
export const TaskList = forwardRef<HTMLDivElement, TaskListProps>(function TaskList(
  {
    title,
    headingLevel = 2,
    showProgress,
    completed: completedProp,
    total: totalProp,
    renderLink,
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...rest
  },
  ref,
) {
  const { t } = useLocale()
  const baseId = useId('or-task-list')
  const titleId = `${baseId}-title`
  const hasTitle = title !== undefined && title !== null && title !== false
  const context = useMemo(() => ({ renderLink }), [renderLink])

  // Contagem a partir dos filhos diretos (arrays de .map() incluídos). Itens
  // dentro de componentes próprios não são vistos: use `completed`/`total`.
  const statuses = Children.toArray(children).flatMap((child) =>
    isValidElement<{ status?: unknown }>(child) && isTaskListStatus(child.props.status)
      ? [child.props.status]
      : [],
  )
  const total = Math.max(0, Math.floor(totalProp ?? statuses.length))
  const completed = clamp(
    Math.floor(completedProp ?? statuses.filter((status) => status === 'complete').length),
    0,
    total,
  )
  const progressVisible = (showProgress ?? hasTitle) && total > 0
  const progressText = t('taskListProgress', { completed, total })
  const Heading = `h${headingLevel}` as 'h2'
  const listLabelledBy =
    [ariaLabelledby, hasTitle ? titleId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <TaskListContext.Provider value={context}>
      <div ref={ref} className={cx('or-task-list', className)} {...rest}>
        {(hasTitle || progressVisible) && (
          <div className="or-task-list__header">
            <div className="or-task-list__summary">
              {hasTitle && (
                <Heading id={titleId} className="or-task-list__heading">
                  {title}
                </Heading>
              )}
              {progressVisible && (
                // Já anunciado pela barra (aria-valuetext); evita leitura duplicada.
                <span className="or-task-list__count" aria-hidden="true">
                  {progressText}
                </span>
              )}
            </div>
            {progressVisible && (
              <ProgressBar
                className="or-task-list__progress"
                size="sm"
                value={completed}
                max={total}
                showValue={false}
                formatValue={() => progressText}
                tone={completed === total ? 'success' : 'accent'}
                aria-labelledby={hasTitle ? titleId : undefined}
                aria-label={hasTitle ? undefined : t('taskListProgressLabel')}
              />
            )}
          </div>
        )}
        <ul
          // `list-style: none` remove a semântica de lista no Safari/VoiceOver; o papel a restaura.
          role="list"
          className="or-task-list__list"
          aria-label={ariaLabel}
          aria-labelledby={listLabelledBy}
        >
          {children}
        </ul>
      </div>
    </TaskListContext.Provider>
  )
})
