---
'@orangesys/ui': patch
---

`DatePicker`, `DateRangePicker`, `DateTimePicker` e `SplitButton`: o calendário e o menu de ações, que abrem em portal no `<body>`, passam a levar o tema da área de onde foram abertos. Dentro de um `<OrangeProvider themeTarget="scoped">` (ou de qualquer elemento com `data-theme`) com tema diferente do da página, eles saíam com as cores da página: um calendário escuro sob um campo claro, por exemplo. Agora seguem o campo, como já faziam `Popover`, `Picker`, `Combobox` e `Dropdown`. Nada a mudar no seu código.
