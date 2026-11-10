---
'@orangesys/ui': patch
---

`TimeField` e `DateTimePicker`: os segmentos descartam o que estava digitado pela metade quando o valor muda por fora (a aplicação define outro horário, ou limpa o formulário depois de enviar), e isso não volta a aparecer depois. Num campo controlado, digitar `14` (o campo mostra `14:--`), receber `value="09:00"` e em seguida `value=""` deixa o campo em `--:--`, e não mais em `14:--`; no `DateTimePicker`, o mesmo com o `value` indo de `null` para uma data e de volta para `null`.

Apagar um segmento continua mostrando os outros (`--:30`), inclusive quando o `value` chega com atraso (atualizado dentro de `startTransition`, por exemplo). Nada muda nas props nem no valor emitido.
