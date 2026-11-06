import type React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { FileUploader, type FileUploaderItem } from './FileUploader'

const makeFile = (name: string, size: number, type = 'application/pdf') => {
  const file = new File(['x'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

const getInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement
const getDropzone = (container: HTMLElement) =>
  container.querySelector('.or-file-uploader__dropzone') as HTMLElement
const dataTransfer = (files: File[]) => ({
  dataTransfer: { files, types: ['Files'], dropEffect: 'none' },
})

describe('FileUploader', () => {
  it('renderiza a área de soltar, o botão rotulado e o input nativo acessível', () => {
    const { container } = render(
      <FileUploader
        label="Comprovantes"
        description="PDF ou PNG, até 5 MB"
        multiple
        accept=".pdf,image/png"
      />,
    )
    const button = screen.getByRole('button', { name: 'Comprovantes Escolher arquivos' })
    expect(button).toHaveAccessibleDescription('PDF ou PNG, até 5 MB')
    expect(screen.getByText('Arraste e solte arquivos aqui ou')).toBeInTheDocument()
    const input = getInput(container)
    expect(input).toHaveAccessibleName('Comprovantes')
    expect(input).toHaveAttribute('tabindex', '-1')
    expect(input).toHaveAttribute('accept', '.pdf,image/png')
    expect(input).toHaveAttribute('multiple')
  })

  it('usa "Escolher arquivo" no modo de arquivo único', () => {
    render(<FileUploader label="Contrato" />)
    expect(screen.getByRole('button', { name: 'Contrato Escolher arquivo' })).toBeInTheDocument()
  })

  it('o botão aciona o input de arquivo', async () => {
    const user = userEvent.setup()
    const { container } = render(<FileUploader label="Contrato" />)
    const click = vi.spyOn(getInput(container), 'click')
    await user.click(screen.getByRole('button', { name: /Escolher arquivo/ }))
    screen.getByRole('button', { name: /Escolher arquivo/ }).focus()
    await user.keyboard('{Enter}')
    expect(click).toHaveBeenCalledTimes(2)
  })

  it('adiciona arquivos, lista nome/tamanho e anuncia', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onFilesAdded = vi.fn()
    const { container } = render(
      <FileUploader
        label="Anexos"
        multiple
        onChange={onChange}
        onFilesAdded={onFilesAdded}
      />,
    )
    await user.upload(getInput(container), [
      makeFile('nota-fiscal.pdf', 2048),
      makeFile('recibo.pdf', 3 * 1024 * 1024),
    ])
    const list = screen.getByRole('list', { name: 'Arquivos selecionados' })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('nota-fiscal.pdf')
    expect(items[0]).toHaveTextContent('2 kB')
    expect(items[1]).toHaveTextContent('3 MB')
    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({
        status: 'idle',
        file: expect.objectContaining({ name: 'nota-fiscal.pdf' }),
      }),
      expect.objectContaining({
        status: 'idle',
        file: expect.objectContaining({ name: 'recibo.pdf' }),
      }),
    ])
    expect(onFilesAdded).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('status')).toHaveTextContent('2 arquivos adicionados')
  })

  it('recusa arquivos maiores que maxSize com erro por arquivo', async () => {
    const user = userEvent.setup()
    const onFilesAdded = vi.fn()
    const { container } = render(
      <FileUploader label="Anexos" multiple maxSize={1024 * 1024} onFilesAdded={onFilesAdded} />,
    )
    await user.upload(getInput(container), [makeFile('video.mp4', 8 * 1024 * 1024, 'video/mp4')])
    const item = screen.getByRole('listitem')
    expect(item).toHaveAttribute('data-status', 'error')
    expect(item).toHaveTextContent('Arquivo maior que 1 MB')
    expect(onFilesAdded).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('video.mp4: Arquivo maior que 1 MB')
  })

  it('arrastar mostra o estado visual e soltar valida o tipo aceito', () => {
    const onChange = vi.fn()
    const { container } = render(
      <FileUploader label="Imagens" multiple accept="image/*" onChange={onChange} />,
    )
    const dropzone = getDropzone(container)
    const files = [
      makeFile('foto.png', 500, 'image/png'),
      makeFile('setup.exe', 500, 'application/x-msdownload'),
    ]
    fireEvent.dragEnter(dropzone, dataTransfer(files))
    expect(dropzone).toHaveAttribute('data-dragging')
    fireEvent.dragLeave(dropzone, dataTransfer(files))
    expect(dropzone).not.toHaveAttribute('data-dragging')
    fireEvent.dragEnter(dropzone, dataTransfer(files))
    fireEvent.drop(dropzone, dataTransfer(files))
    expect(dropzone).not.toHaveAttribute('data-dragging')

    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('data-status', 'idle')
    expect(items[1]).toHaveTextContent('Tipo de arquivo não aceito')
    expect(screen.getByRole('status')).toHaveTextContent('foto.png adicionado. 1 recusado(s)')
  })

  it('maxFiles limita a quantidade e mostra o erro no campo', async () => {
    const user = userEvent.setup()
    const { container } = render(<FileUploader label="Fotos" multiple maxFiles={2} />)
    await user.upload(getInput(container), [
      makeFile('a.pdf', 10),
      makeFile('b.pdf', 10),
      makeFile('c.pdf', 10),
    ])
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('button', { name: /Escolher arquivos/ })).toHaveAccessibleDescription(
      'Envie no máximo 2 arquivos',
    )
  })

  it('aceita invalid sem mensagem de erro', () => {
    const { container } = render(<FileUploader label="Fotos" invalid />)
    expect(getDropzone(container)).toHaveAttribute('data-invalid')
    expect(container.querySelector('.or-field')).toHaveAttribute('data-invalid')
    const button = screen.getByRole('button', { name: /Escolher arquivo/ })
    expect(button).not.toHaveAccessibleDescription()
    expect(container.querySelector('.or-field__error')).toBeNull()
  })

  it('sem multiple, um novo arquivo substitui o anterior', async () => {
    const user = userEvent.setup()
    const { container } = render(<FileUploader label="Contrato" />)
    await user.upload(getInput(container), makeFile('v1.pdf', 10))
    await user.upload(getInput(container), makeFile('v2.pdf', 10))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent('v2.pdf')
  })

  it('remove um arquivo, anuncia e move o foco', async () => {
    const user = userEvent.setup()
    const onFileRemove = vi.fn()
    const { container } = render(
      <FileUploader label="Anexos" multiple onFileRemove={onFileRemove} />,
    )
    await user.upload(getInput(container), [makeFile('a.pdf', 10), makeFile('b.pdf', 10)])
    await user.click(screen.getByRole('button', { name: 'Remover a.pdf' }))
    expect(onFileRemove).toHaveBeenCalledWith(
      expect.objectContaining({ file: expect.objectContaining({ name: 'a.pdf' }) }),
    )
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('a.pdf removido')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Remover b.pdf' })).toHaveFocus())
    await user.click(screen.getByRole('button', { name: 'Remover b.pdf' }))
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Escolher arquivos/ })).toHaveFocus(),
    )
  })

  it('modo controlado mostra progresso e status do envio', () => {
    const items: FileUploaderItem[] = [
      { id: '1', file: makeFile('planilha.xlsx', 4096), status: 'uploading', progress: 42 },
      { id: '2', file: makeFile('logo.png', 1024), status: 'success' },
      { id: '3', file: makeFile('dados.csv', 1024), status: 'error' },
    ]
    render(<FileUploader label="Anexos" multiple value={items} />)
    const progress = screen.getByRole('progressbar', { name: 'Enviando planilha.xlsx' })
    expect(progress).toHaveAttribute('aria-valuenow', '42')
    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(screen.getByText('Enviado')).toBeInTheDocument()
    expect(screen.getByText('Falha no envio')).toBeInTheDocument()
  })

  it('desabilitado ignora soltar e bloqueia os botões', () => {
    const onChange = vi.fn()
    const { container } = render(
      <FileUploader label="Anexos" disabled onChange={onChange} />,
    )
    expect(screen.getByRole('button', { name: /Escolher arquivo/ })).toBeDisabled()
    fireEvent.drop(getDropzone(container), dataTransfer([makeFile('a.pdf', 10)]))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('motion: itens novos entram escalonados; os da primeira renderização não', async () => {
    const user = userEvent.setup()
    const initial: FileUploaderItem[] = [{ id: 'x', file: makeFile('existente.pdf', 10) }]
    const { container } = render(<FileUploader label="Anexos" multiple defaultValue={initial} />)
    expect(screen.getByRole('listitem')).not.toHaveClass('or-file-uploader__item--enter')
    await user.upload(getInput(container), [makeFile('a.pdf', 10), makeFile('b.pdf', 10)])
    const [, first, second] = screen.getAllByRole('listitem')
    expect(first).toHaveClass('or-file-uploader__item--enter')
    expect(first.style.getPropertyValue('--_i')).toBe('0')
    expect(second.style.getPropertyValue('--_i')).toBe('1')
  })

  it('motion: progresso cresce com transform e o status anima ao mudar', () => {
    const file = makeFile('planilha.xlsx', 4096)
    const { rerender } = render(
      <FileUploader label="Anexos" value={[{ id: '1', file, status: 'success' }]} />,
    )
    // status presente na primeira renderização não anima
    expect(screen.getByText('Enviado').closest('.or-file-uploader__status')).not.toHaveClass(
      'or-file-uploader__status--animate',
    )
    rerender(<FileUploader label="Anexos" value={[{ id: '1', file, status: 'uploading', progress: 42 }]} />)
    const bar = document.querySelector('.or-file-uploader__progress-bar') as HTMLElement
    expect(bar.style.transform).toBe('scaleX(0.42)')
    rerender(<FileUploader label="Anexos" value={[{ id: '1', file, status: 'success' }]} />)
    expect(screen.getByText('Enviado').closest('.or-file-uploader__status')).toHaveClass(
      'or-file-uploader__status--animate',
    )
    rerender(<FileUploader label="Anexos" value={[{ id: '1', file, status: 'error', error: 'Falhou' }]} />)
    expect(screen.getByText('Falhou')).toHaveClass('or-file-uploader__status--error', 'or-file-uploader__status--animate')
  })

  it('motion: com movimento ativo, o item removido sai animado sem roubar o foco', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <FileUploader label="Anexos" multiple style={{ '--or-duration-fast': '160ms' } as React.CSSProperties} />,
    )
    await user.upload(getInput(container), [makeFile('a.pdf', 10), makeFile('b.pdf', 10)])
    await user.click(screen.getByRole('button', { name: 'Remover a.pdf' }))
    const ghost = container.querySelector('.or-file-uploader__item[data-state="closed"]') as HTMLElement
    expect(ghost).toHaveTextContent('a.pdf')
    expect(ghost).toHaveAttribute('aria-hidden', 'true')
    expect(ghost).toHaveAttribute('inert')
    // fora da árvore de acessibilidade: só o item real é listado
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Remover b.pdf' })).toHaveFocus())
    fireEvent.animationEnd(ghost)
    expect(container.querySelector('.or-file-uploader__item[data-state="closed"]')).toBeNull()
  })

  it('onFilesChange (depreciado) ainda é chamado e avisa no console', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onFilesChange = vi.fn()
    const { container } = render(<FileUploader label="Anexos" onFilesChange={onFilesChange} />)
    await user.upload(getInput(container), makeFile('contrato.pdf', 1024))
    expect(onFilesChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ file: expect.objectContaining({ name: 'contrato.pdf' }) }),
    ])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`onFilesChange` está depreciado'))
    warn.mockRestore()
  })

  it('não possui violações de acessibilidade', async () => {
    const items: FileUploaderItem[] = [
      { id: '1', file: makeFile('planilha.xlsx', 4096), status: 'uploading', progress: 60 },
      { id: '2', file: makeFile('logo.png', 1024), status: 'success' },
      {
        id: '3',
        file: makeFile('video.mp4', 1024),
        status: 'error',
        error: 'Arquivo maior que 5 MB',
      },
    ]
    const { container } = render(
      <FileUploader
        label="Anexos"
        description="Até 5 MB por arquivo"
        multiple
        defaultValue={items}
      />,
    )
    await expectNoA11yViolations(container)
  })
})
