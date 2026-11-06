---
'@orangesys/ui': minor
---

Depreciado: mais quatro nomes alinhados antes de a API congelar na 1.0. Os antigos continuam funcionando até a v1.0 e avisam no console em desenvolvimento.

| Onde                             | Antes                                              | Agora                                                                             |
| -------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `ChipGroup`, `ToggleButtonGroup` | `type`                                             | `selectionMode` (como em `Listbox` e `TreeView`)                                  |
| `Stepper`                        | `activeStep`                                       | `step` (como no `Tour`); agora opcional, padrão `0`                               |
| `AppShell`                       | `navBreakpoint`                                    | `navDrawerBelow` (no padrão de `AppHeader.collapseBelow` e `Splitter.stackBelow`) |
| utilitários                      | `clamp`, `range`, `setRef`, `getFocusableElements` | saem da API pública na v1.0                                                       |

O `ToggleButtonGroup` passa a aceitar a omissão do modo, com seleção única como padrão. O `Accordion` mantém `type`, porque ali o modo é de expansão, não de seleção. Continuam públicos os utilitários que ajudam a compor com os componentes: `cx`, `mergeRefs`, `composeEventHandlers` e `interpolate`.

Migração: troque o nome da prop; os valores são os mesmos. Para os utilitários, a mensagem no console mostra o equivalente em uma linha.
