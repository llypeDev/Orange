---
'@orangesys/ui': minor
---

`DateTimePicker` com a hora em segmentos, os mesmos do `TimeField`, no lugar do `<input type="time">` do navegador. As props e o valor (`Date | null`) são os mesmos.

- **Segmento em edição laranja**, igual no Chrome, no Firefox e no Safari. Antes, o destaque era o azul do sistema.
- **Relógio pelo idioma do provider:** 24 horas em `pt-BR` e `es-ES`, 12 horas com AM/PM em `en-US`. Antes, a data seguia o `OrangeProvider` e a hora seguia o idioma do navegador de cada pessoa: as duas podiam aparecer em convenções diferentes. Os avisos de limite ("Escolha um horário a partir de 08:00.") usam o mesmo relógio.
- **Setas que respeitam `step`, `min` e `max`:** andam no `step` (contado a partir da meia-noite), dão a volta dentro do segmento e, no dia de `min` ou de `max`, param no horário-limite em vez de passar dele. PageUp/PageDown, Home/End, Backspace e colar (`14h30`, `2:30 pm`) também funcionam.
- **Relógio:** clicar nele, ou na área livre da hora, leva o foco ao primeiro segmento. Antes ele pedia o seletor do navegador, que no Firefox não abria.

```tsx
const entrega = <DateTimePicker label="Entrega agendada" min={inicio} max={fim} step={900} />
```

O que muda para quem já usa:

- A hora não é mais um `<input>`: é um grupo com o nome "Hora" e um `spinbutton` por segmento ("hora", "minuto"…). Em testes, `getByLabelText('Hora')` passa a encontrar esse grupo, e `fireEvent.change` na hora não tem mais efeito. Para digitar, use `getByRole('spinbutton', { name: 'hora' })` (ou `'minuto'`) e o teclado (`user.keyboard('1430')`).
- `required` continua marcando a data e a hora. Na validação nativa do formulário (fora do `Form` do Orange), quem barra o envio quando a hora falta ou está pela metade passa a ser o campo de data, com a mensagem "Informe a hora." ou "Horário incompleto.".
- Quando `min` tem segundos (um `new Date()`, por exemplo), as setas param no primeiro minuto inteiro depois dele e o aviso mostra esse minuto: "a partir de 14:24" para um `min` às 14:23:37.
- Um horário digitado fora do `step` continua aceito, como antes: o `step` guia as setas. Se só alguns horários servem, valide em `error`.
- CSS próprio que mirava `.or-date-time-picker__time-input` deixa de ter efeito: os segmentos são `.or-time-field__segment`.

A digitação por teclado virtual (celular) foi verificada por emulação de toque no Chromium, não em aparelhos; os anúncios, por testes automáticos, não com leitores de tela.
