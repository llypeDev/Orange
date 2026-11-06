# @orangesys/ui

## 1.0.0

### Major Changes

- [#20](https://github.com/llypeDev/Orange/pull/20) [`4c84062`](https://github.com/llypeDev/Orange/commit/4c840623ef8502b031fd8c1e1f9d58192a310a80) Thanks [@llypeDev](https://github.com/llypeDev)! - Incompatível: Orange 1.0 — a API pública fica estável e saem os nomes depreciados na 0.6. Daqui em diante, mudanças incompatíveis só numa nova major, sempre depois de uma depreciação.

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

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@1.0.0

## 0.6.0

### Minor Changes

- [#16](https://github.com/llypeDev/Orange/pull/16) [`a48a385`](https://github.com/llypeDev/Orange/commit/a48a385104d81fb0beedc610932639cfa0febea3) Thanks [@llypeDev](https://github.com/llypeDev)! - Depreciado: seis props ganharam o nome usado no resto da biblioteca, antes de a API congelar na 1.0. Os nomes antigos continuam funcionando até a v1.0 e avisam no console em desenvolvimento.

  | Componente           | Antes               | Agora                                                                |
  | -------------------- | ------------------- | -------------------------------------------------------------------- |
  | `SegmentedControl`   | `fullWidth`         | `block` (como no `Button`)                                           |
  | `DropdownRadioGroup` | `onValueChange`     | `onChange` (como no `RadioGroup`)                                    |
  | `FileUploader`       | `onFilesChange`     | `onChange` (par de `value`/`defaultValue`)                           |
  | `Table`              | `onSelectionChange` | `onSelectedRowsChange` (par de `selectedRows`/`defaultSelectedRows`) |
  | `LoadingOverlay`     | `visible`           | `open` (como nas outras sobreposições)                               |
  | `Toast`              | `onClose`           | `onDismiss` (como em `Alert`, `Banner` e `toast()`)                  |

  Migração: troque o nome da prop; os valores e os argumentos dos callbacks são os mesmos.

- [#18](https://github.com/llypeDev/Orange/pull/18) [`91c585e`](https://github.com/llypeDev/Orange/commit/91c585e4f92d51607f374703b4f28ce6f6276c69) Thanks [@llypeDev](https://github.com/llypeDev)! - Depreciado: mais quatro nomes alinhados antes de a API congelar na 1.0. Os antigos continuam funcionando até a v1.0 e avisam no console em desenvolvimento.

  | Onde                             | Antes                                              | Agora                                                                             |
  | -------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
  | `ChipGroup`, `ToggleButtonGroup` | `type`                                             | `selectionMode` (como em `Listbox` e `TreeView`)                                  |
  | `Stepper`                        | `activeStep`                                       | `step` (como no `Tour`); agora opcional, padrão `0`                               |
  | `AppShell`                       | `navBreakpoint`                                    | `navDrawerBelow` (no padrão de `AppHeader.collapseBelow` e `Splitter.stackBelow`) |
  | utilitários                      | `clamp`, `range`, `setRef`, `getFocusableElements` | saem da API pública na v1.0                                                       |

  O `ToggleButtonGroup` passa a aceitar a omissão do modo, com seleção única como padrão. O `Accordion` mantém `type`, porque ali o modo é de expansão, não de seleção. Continuam públicos os utilitários que ajudam a compor com os componentes: `cx`, `mergeRefs`, `composeEventHandlers` e `interpolate`.

  Migração: troque o nome da prop; os valores são os mesmos. Para os utilitários, a mensagem no console mostra o equivalente em uma linha.

- [#18](https://github.com/llypeDev/Orange/pull/18) [`91c585e`](https://github.com/llypeDev/Orange/commit/91c585e4f92d51607f374703b4f28ce6f6276c69) Thanks [@llypeDev](https://github.com/llypeDev)! - Todo campo que aceita `error` agora também aceita `invalid`, que marca o campo como inválido sem mostrar mensagem (por exemplo, quando o erro aparece num `ErrorSummary`). A prop é nova em `Field`, `CheckboxGroup`, `RadioGroup`, `ColorField`, `DatePicker`, `DateRangePicker`, `TimeField`, `Rating` e `FileUploader`, e se comporta como `error` sem a mensagem. `Field` passa a repassar `ref` para a `div` raiz.

### Patch Changes

- Updated dependencies []:
  - @orangesys/tokens@0.6.0

## 0.5.1

### Patch Changes

- Updated dependencies [[`bf03fa2`](https://github.com/llypeDev/Orange/commit/bf03fa2e0dab23ac28c4440488106bd15d8b0f75)]:
  - @orangesys/tokens@0.5.1

## 0.5.0

### Minor Changes

- [#8](https://github.com/llypeDev/Orange/pull/8) [`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6) Thanks [@llypeDev](https://github.com/llypeDev)! - Gráficos, reordenação, tour guiado, painéis redimensionáveis e Listbox — todos operáveis sem mouse e sem depender só de cor.

  - `BarChart`, `LineChart` e `Sparkline` em SVG puro, com tabela de dados alternativa e exploração por teclado.
  - `SortableList`: reordene arrastando, pelo teclado ou com os botões "Mover para cima/baixo" (WCAG 2.5.7).
  - `Tour`: passo a passo com destaque no elemento, foco gerenciado e painel inferior no celular.
  - `Splitter`: painéis redimensionáveis no padrão APG Window Splitter, com recolher pelo Enter.
  - `Listbox`: lista de seleção única ou múltipla, com grupos, busca ao digitar e integração com o `Form`.

- [#8](https://github.com/llypeDev/Orange/pull/8) [`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6) Thanks [@llypeDev](https://github.com/llypeDev)! - Primeira publicação no npm. Os dois pacotes passam a sair juntos, sempre com a mesma versão, com changelog gerado a partir dos changesets e publicação com provenance.

  - `@orangesys/ui`: ESM (`dist/orange-ui.js`) e CommonJS (`dist/orange-ui.cjs`), tipos em um único arquivo para `import` e `require` (`index.d.ts` / `index.d.cts`) e `@orangesys/ui/styles.css` com todos os estilos e tokens.
  - `@orangesys/tokens`: tokens em TypeScript (ESM) e `@orangesys/tokens/tokens.css` com as custom properties `--or-*`.
  - `react` e `react-dom` passam a ser peer dependencies com faixa explícita: `^18.2.0 || ^19.0.0`.
  - Política de versionamento e depreciação publicada em https://orange.llypedev.com.br/pt/usage/versioning.

- [#8](https://github.com/llypeDev/Orange/pull/8) [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b) Thanks [@llypeDev](https://github.com/llypeDev)! - Temas de alto contraste e suporte completo a `forced-colors`.

  - Novos temas `dark-hc` e `light-hc` (contraste AAA) e o modo `system` passa a seguir `prefers-contrast: more`.
  - Novos tokens `text-on-success`, `text-on-warning` e `text-on-info`; o `Badge` usa-os em vez de cores fixas.
  - `forced-colors` (contraste do Windows) em todos os componentes, com um teste que impede regressões.
  - Exportação dos tokens em DTCG (um arquivo por modo) e o script `figma:sync` para as variáveis do Figma.
  - `OrangeProvider` aninhado sem tema próprio herda o tema do provider de fora.

### Patch Changes

- [#8](https://github.com/llypeDev/Orange/pull/8) [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b) Thanks [@llypeDev](https://github.com/llypeDev)! - `AppShell`: com o cabeçalho fixo, a rolagem da página reserva a altura dele, para que o elemento em foco nunca fique escondido sob o cabeçalho (WCAG 2.4.11).

- [#8](https://github.com/llypeDev/Orange/pull/8) [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b) Thanks [@llypeDev](https://github.com/llypeDev)! - `SortableList`: o arraste agora alcança a última posição. Com itens da mesma altura, mover o penúltimo item (ou qualquer outro) para o fim não mudava a ordem.
- Updated dependencies [[`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6), [`bbc0bee`](https://github.com/llypeDev/Orange/commit/bbc0bee6b5bbdffafb3f6667802320b39efcd63b), [`667c824`](https://github.com/llypeDev/Orange/commit/667c824ad79469721f9f505d4e192453551dc4f6)]:
  - @orangesys/tokens@0.5.0
