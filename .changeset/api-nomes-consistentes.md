---
'@orangesys/ui': minor
---

Depreciado: seis props ganharam o nome usado no resto da biblioteca, antes de a API congelar na 1.0. Os nomes antigos continuam funcionando até a v1.0 e avisam no console em desenvolvimento.

| Componente           | Antes               | Agora                                                                |
| -------------------- | ------------------- | -------------------------------------------------------------------- |
| `SegmentedControl`   | `fullWidth`         | `block` (como no `Button`)                                           |
| `DropdownRadioGroup` | `onValueChange`     | `onChange` (como no `RadioGroup`)                                    |
| `FileUploader`       | `onFilesChange`     | `onChange` (par de `value`/`defaultValue`)                           |
| `Table`              | `onSelectionChange` | `onSelectedRowsChange` (par de `selectedRows`/`defaultSelectedRows`) |
| `LoadingOverlay`     | `visible`           | `open` (como nas outras sobreposições)                               |
| `Toast`              | `onClose`           | `onDismiss` (como em `Alert`, `Banner` e `toast()`)                  |

Migração: troque o nome da prop; os valores e os argumentos dos callbacks são os mesmos.
