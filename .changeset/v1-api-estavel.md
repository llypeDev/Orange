---
'@orangesys/ui': major
---

Incompatível: Orange 1.0 — a API pública fica estável e saem os nomes depreciados na 0.6. Daqui em diante, mudanças incompatíveis só numa nova major, sempre depois de uma depreciação.

Migração (os valores e os argumentos dos callbacks são os mesmos; só o nome muda):

| Onde                             | Antes               | Agora                  |
| -------------------------------- | ------------------- | ---------------------- |
| `SegmentedControl`               | `fullWidth`         | `block`                |
| `DropdownRadioGroup`             | `onValueChange`     | `onChange`             |
| `FileUploader`                   | `onFilesChange`     | `onChange`             |
| `Table`                          | `onSelectionChange` | `onSelectedRowsChange` |
| `LoadingOverlay`                 | `visible`           | `open`                 |
| `Toast`                          | `onClose`           | `onDismiss`            |
| `ChipGroup`, `ToggleButtonGroup` | `type`              | `selectionMode`        |
| `Stepper`                        | `activeStep`        | `step`                 |
| `AppShell`                       | `navBreakpoint`     | `navDrawerBelow`       |

`clamp`, `range`, `setRef` e `getFocusableElements` saem da API pública: use `Math.min(Math.max(value, min), max)`, `Array.from({ length: end - start + 1 }, (_, i) => start + i)`, `mergeRefs` e `useFocusTrap`. Se o projeto já roda sem avisos de depreciação no console da 0.6, a atualização não exige mudanças.
