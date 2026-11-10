---
'@orangesys/ui': minor
---

`TimeField` em segmentos próprios, no lugar do `<input type="time">` visível do navegador. As props são as mesmas; o campo fica igual no Chrome, no Firefox e no Safari.

- **Segmento em edição laranja:** hora, minuto, segundo e AM/PM são segmentos do Orange, cada um com foco, nome e valor para leitores de tela. Antes, o destaque era o azul do sistema.
- **Relógio pelo idioma do provider:** 24 horas em `pt-BR` e `es-ES`, 12 horas com AM/PM em `en-US` — não mais pelo idioma do navegador de cada pessoa. A prop nova `hourCycle={12 | 24}` força um dos dois. O valor continua sendo `HH:mm` em 24 horas.
- **Setas que respeitam `step`, `min` e `max`:** andam no passo (contado a partir de `min`), dão a volta dentro do segmento e param no limite em vez de passar dele. PageUp/PageDown, Home/End, Backspace e colar (`14h30`, `2:30 pm`) também funcionam.
- **Avisos do próprio campo:** com `min`, `max` ou `step`, um horário digitado fora da regra marca o campo como inválido e mostra a mensagem ("Escolha um horário até 18:00."), no idioma do provider. Sair com o horário pela metade avisa "Horário incompleto.". A prop `error` substitui esses avisos.
- **Lista de horários:** o relógio agora é um botão no fim do campo e abre uma lista (no intervalo do `step` quando ele é de 5 minutos ou mais; senão de meia em meia hora), no lugar do seletor do navegador, que no Firefox não abria. A prop nova `listStep` muda o intervalo; `listStep={false}` tira o botão.

```tsx
<TimeField label="Reunião" min="08:00" max="18:00" step={900} hourCycle={24} listStep={1800} />
```

O que muda para quem já usa:

- O valor mora num `<input type="time">` oculto, que recebe a `ref`, o `name` e o restante das props: envio de formulário, `FormData` e validação nativa (`required`, `min`, `max`, `step`) continuam funcionando, e `onChange(value, event)` recebe um evento desse input. Focá-lo (rótulo, `ref.current.focus()`) leva o foco ao primeiro segmento. `onFocus`, `onBlur` e `onKeyDown` passam a valer para o campo inteiro.
- Um horário pela metade agora conta como inválido para o formulário (como o `badInput` do input nativo).
- CSS próprio que mirava `.or-time-field__input` ou `.or-time-field__icon` deixa de ter efeito: os segmentos são `.or-time-field__segment` e o relógio, `.or-time-field__button`.
- Em testes, `getByLabelText` passa a encontrar também o grupo dos segmentos, além do input. Para digitar, use `getByRole('spinbutton', { name: 'hora' })` (ou `'minuto'`); `fireEvent.change` no `input[type="time"]` continua funcionando.

A digitação por teclado virtual (celular) foi verificada por emulação de toque no Chromium, não em aparelhos; os anúncios, por testes automáticos, não com leitores de tela. O `DateTimePicker` continua com o campo de hora nativo.
