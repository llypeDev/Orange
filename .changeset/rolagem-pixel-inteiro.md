---
'@orangesys/ui': patch
---

`Tabs`, `Picker`, `SplitButton`, `Dropdown` e `ContextMenu`: ao revelar a aba ou o item ativo na ponta da lista, a rolagem arredonda para longe de zero. No Safari (WebKit), que rola em pixels inteiros, o último item ficava cortado por menos de 1px. Encontrado pelos testes de layout, agora rodando também no WebKit e no Firefox.
