---
'@orangesys/ui': minor
---

Todo campo que aceita `error` agora também aceita `invalid`, que marca o campo como inválido sem mostrar mensagem (por exemplo, quando o erro aparece num `ErrorSummary`). A prop é nova em `Field`, `CheckboxGroup`, `RadioGroup`, `ColorField`, `DatePicker`, `DateRangePicker`, `TimeField`, `Rating` e `FileUploader`, e se comporta como `error` sem a mensagem. `Field` passa a repassar `ref` para a `div` raiz.
