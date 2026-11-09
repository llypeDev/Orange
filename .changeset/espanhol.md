---
'@orangesys/ui': minor
---

Idioma espanhol: o dicionário `esES` (espanhol da Espanha) traz traduzidos todos os textos internos dos componentes.

```tsx
import { esES, OrangeProvider } from '@orangesys/ui'

<OrangeProvider locale="es-ES" messages={esES}>
  <App />
</OrangeProvider>
```

O `locale` cuida de datas, números e ordenação; o `messages` troca os textos. O `esES` não vem embutido no provider, para não pesar no bundle de quem não usa — só entra na aplicação que o importa.

Em desenvolvimento, o `OrangeProvider` passa a avisar no console quando recebe um `locale` sem textos embutidos (qualquer um que não seja português ou inglês) e nenhum `messages`: nesse caso os componentes ficam em português.
