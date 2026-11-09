# FileUploader

Envio de arquivos com arrastar e soltar, validação de tipo e tamanho e lista com progresso.

- Categoria: Formulários · Status: estável
- Importação: `import { FileUploader } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/file-uploader (em inglês: https://orange.llypedev.com.br/en/components/file-uploader)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-fileuploader--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/FileUploader

## Boas práticas

- Diga na `description` quais tipos e qual tamanho são aceitos ("PDF ou PNG, até 5 MB") — e use os mesmos valores em `accept` e `maxSize`.
- Arrastar e soltar é um atalho, nunca o único caminho: o botão "Escolher arquivos" sempre funciona por teclado e no celular.
- Arquivos recusados aparecem na lista com o motivo, para a pessoa entender o que corrigir. Remova-os antes de enviar o formulário.
- Para mostrar progresso real, use o modo controlado: inicie o envio em `onFilesAdded` e atualize `status`/`progress` de cada item.

## Anatomia

- **Área de soltar** — Borda tracejada que fica laranja ao arrastar arquivos sobre ela.
- **Botão** — Botão nativo que aciona o `<input type="file">` visualmente oculto.
- **Lista de arquivos** — Nome, tamanho formatado no idioma, status, barra de progresso e botão remover.

## Exemplos

### Vários arquivos

Arraste arquivos para a área ou use o botão. Arquivos grandes ou de outro tipo entram com erro.

```tsx
import { FileUploader } from '@orangesys/ui'

export default function Basic() {
  return (
    <FileUploader
      label="Comprovantes de despesa"
      description="PDF, PNG ou JPG, até 5 MB cada."
      accept=".pdf,image/png,image/jpeg"
      maxSize={5 * 1024 * 1024}
      multiple
    />
  )
}
```

### Arquivo único

Sem multiple, o novo arquivo substitui o anterior. Com name, o arquivo vai junto no envio do formulário.

```tsx
import { FileUploader } from '@orangesys/ui'

export default function SingleFile() {
  return (
    <FileUploader
      label="Contrato social"
      description="Um único arquivo PDF de até 10 MB. Enviar outro substitui o anterior."
      accept=".pdf"
      maxSize={10 * 1024 * 1024}
      required
      name="contrato"
    />
  )
}
```

### Envio com progresso (controlado)

onFilesAdded inicia o envio; cada item recebe progress e status. Um nome com "erro" simula falha.

```tsx
import { FileUploader, type FileUploaderItem } from '@orangesys/ui'
import { useEffect, useRef, useState } from 'react'

export default function UploadProgress() {
  const [arquivos, setArquivos] = useState<FileUploaderItem[]>([])
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearInterval), [])

  // Simula o envio: troque pelo seu upload (fetch, S3, etc.) atualizando status e progresso.
  const enviar = (novos: FileUploaderItem[]) => {
    novos.forEach((item) => {
      const timer = window.setInterval(() => {
        setArquivos((lista) =>
          lista.map((atual) => {
            if (atual.id !== item.id) return atual
            const progress = Math.min(
              100,
              (atual.progress ?? 0) + 15 + Math.round(Math.random() * 15),
            )
            if (progress === 100) clearInterval(timer)
            const falhou = progress === 100 && atual.file.name.toLowerCase().includes('erro')
            return falhou
              ? { ...atual, progress, status: 'error', error: 'O servidor recusou o arquivo' }
              : { ...atual, progress, status: progress === 100 ? 'success' : 'uploading' }
          }),
        )
      }, 350)
      timers.current.push(timer)
    })
  }

  return (
    <FileUploader
      label="Fotos do imóvel"
      description="Até 6 imagens. Os arquivos são enviados assim que adicionados."
      accept="image/*"
      multiple
      maxFiles={6}
      value={arquivos}
      onChange={setArquivos}
      onFilesAdded={enviar}
    />
  )
}
```

### Status e estados

Enviado, enviando e com erro; campo obrigatório com erro e desabilitado.

```tsx
import { FileUploader, type FileUploaderItem } from '@orangesys/ui'

const arquivo = (nome: string, bytes: number, tipo: string) => {
  const file = new File([''], nome, { type: tipo })
  Object.defineProperty(file, 'size', { value: bytes })
  return file
}

const enviados: FileUploaderItem[] = [
  { id: '1', file: arquivo('balanco-2025.pdf', 2_400_000, 'application/pdf'), status: 'success' },
  {
    id: '2',
    file: arquivo('extrato-outubro.pdf', 860_000, 'application/pdf'),
    status: 'uploading',
    progress: 48,
  },
  {
    id: '3',
    file: arquivo('planilha-custos.numbers', 1_200_000, 'application/octet-stream'),
    status: 'error',
    error: 'Tipo de arquivo não aceito',
  },
]

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 32, width: '100%' }}>
      <FileUploader
        label="Documentos contábeis"
        description="PDF, até 5 MB cada."
        accept=".pdf"
        multiple
        defaultValue={enviados}
      />
      <FileUploader
        label="Nota fiscal"
        required
        error="Envie a nota fiscal para concluir o reembolso."
      />
      <FileUploader
        label="Anexos (bloqueado)"
        description="Disponível após aprovar o pedido."
        disabled
      />
    </div>
  )
}
```

## Movimento

- **Arrastar sobre a área** — Borda tracejada laranja, fundo de acento e scale 1,01 · medium; o ícone sobe 4px com sombra laranja · medium, ease-spring.
- **Adicionar arquivos** — Cada item entra com fade + 4px, escalonado em 40ms dentro do lote · medium, ease-out.
- **Remover** — O item desliza 8px, some e recolhe a altura (grid-template-rows) · fast, ease-in-out. O foco vai na hora para o próximo item.
- **Progresso** — A barra cresce com transform: scaleX · medium, ease-out.
- **Sucesso** — O check é desenhado (or-draw) e o texto aparece · slow (400ms).
- **Erro** — A mensagem do arquivo treme uma vez (or-shake) · slow.
- **Botão "Escolher arquivos"** — O sublinhado engrossa no hover/foco · fast; afunda 1px no clique · press (90ms).
- **Movimento reduzido** — Os tokens de duração e distância viram 0: tudo muda na hora e as saídas não esperam animação.

## Props

### `FileUploader`

Envio de arquivos com área de arrastar e soltar, botão nativo, validação
de tipo/tamanho/quantidade, lista com progresso e anúncios para leitores
de tela.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `accept` | `string` | — | Tipos aceitos, como no atributo nativo: `.pdf,image/*`. |
| `defaultValue` | `FileUploaderItem[]` | `[]` | Lista inicial (não controlado). |
| `description` | `ReactNode` | — | Texto de ajuda — informe aqui os tipos e o tamanho aceitos. |
| `disabled` | `boolean` | `false` | — |
| `error` | `ReactNode` | — | Mensagem de erro do campo. |
| `hideLabel` | `boolean` | — | Oculta o rótulo visualmente (continua acessível). |
| `id` | `string` | — | Id do `<input type="file">`. |
| `invalid` | `boolean` | — | Força o estado inválido sem exibir mensagem (ex.: erro mostrado em um ErrorSummary). |
| `label` | `ReactNode` | — | Rótulo visível do campo. |
| `maxFiles` | `number` | — | Quantidade máxima de arquivos válidos (com `multiple`). |
| `maxSize` | `number` | — | Tamanho máximo por arquivo, em bytes. Arquivos maiores entram na lista com erro. |
| `multiple` | `boolean` | `false` | Permite vários arquivos. Sem `multiple`, um novo arquivo substitui o anterior. |
| `name` | `string` | — | Nome do campo para envio em formulários nativos. |
| `onChange` | `((items: FileUploaderItem[]) => void)` | — | Chamado com a lista completa sempre que arquivos entram ou saem. |
| `onFileRemove` | `((item: FileUploaderItem) => void)` | — | Chamado quando o usuário remove um arquivo. |
| `onFilesAdded` | `((items: FileUploaderItem[]) => void)` | — | Chamado só com os arquivos aceitos de cada seleção — útil para iniciar o envio. |
| `optional` | `boolean` | — | Mostra "(opcional)" ao lado do rótulo. |
| `required` | `boolean` | — | — |
| `value` | `FileUploaderItem[]` | — | Lista de arquivos (controlado). |

Repassa também os atributos nativos (`HTMLAttributes`: `className`, `style`, `aria-*`, `data-*`, eventos…) ao elemento raiz.

## Acessibilidade

O botão "Escolher arquivos" é um `<button>` nativo rotulado pelo rótulo do campo e pelo próprio texto, e descrito pela descrição e pelo erro. O `<input type="file">` continua no documento (oculto visualmente, fora da ordem de tabulação) para formulários e tecnologias assistivas. Adições, recusas e remoções são anunciadas numa região `role="status"`; o progresso usa `role="progressbar"` com o nome do arquivo.

| Teclas | Ação |
| --- | --- |
| `Tab` | Foca o botão "Escolher arquivos" e depois cada botão "Remover". |
| `Enter` | Abre o seletor de arquivos do sistema ou remove o arquivo focado. |
| `Space` | Mesmo que Enter. |

- **2.1.1** — Tudo funciona sem arrastar: o botão é a alternativa de teclado.
- **2.4.3** — Ao remover, o foco vai para o próximo arquivo ou volta ao botão.
- **3.3.1** — Erros por arquivo (tipo, tamanho) e do campo (quantidade) são descritos em texto.
- **4.1.3** — Mensagens de status via `role="status"`, sem mover o foco.
