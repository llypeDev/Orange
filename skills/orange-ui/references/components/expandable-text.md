# ExpandableText

Texto longo recolhido em algumas linhas, com botão "Mostrar mais" que só aparece quando o conteúdo não cabe.

- Categoria: Utilitários · Status: estável
- Importação: `import { ExpandableText } from '@orangesys/ui'`
- Documentação: https://orange.llypedev.com.br/pt/components/expandable-text (em inglês: https://orange.llypedev.com.br/en/components/expandable-text)
- Storybook: https://orange.llypedev.com.br/storybook/?path=/docs/componentes-expandabletext--docs
- Código: https://github.com/llypeDev/Orange/tree/main/packages/ui/src/components/ExpandableText

## Boas práticas

- Use para textos longos que nem todos precisam ler inteiros: avaliações, descrições de produto, notas de versão.
- Mostre linhas suficientes para a pessoa decidir se quer continuar — 3 é um bom padrão.
- Em listas com vários textos expansíveis, use **showMoreLabel** para dar contexto ao botão ("Ler notas da v3.2.0" em vez de vários "Mostrar mais").
- Não esconda informações críticas (preços, prazos, avisos legais obrigatórios) atrás do botão.

## Exemplos

### Avaliação de produto

Recolhido em 3 linhas. O botão só aparece porque o texto transborda — redimensione a janela para ver.

```tsx
import { ExpandableText } from '@orangesys/ui'

export default function Review() {
  return (
    <article style={{ maxWidth: 440, padding: 20, border: '1px solid var(--or-color-border)' }}>
      <p className="or-eyebrow" style={{ margin: '0 0 8px' }}>
        Avaliação verificada · 5 de 5
      </p>
      <ExpandableText>
        Comprei para o escritório e a equipe se adaptou rápido. A bateria dura o dia inteiro, o teclado é silencioso e a tela
        tem ótimo brilho mesmo perto da janela. O único ponto negativo é o carregador, que esquenta bastante depois de algumas
        horas de uso contínuo. Ainda assim, recomendo para quem trabalha em trânsito e precisa de um equipamento leve.
      </ExpandableText>
    </article>
  )
}
```

### Vários parágrafos

O conteúdo pode ter marcação própria; o corte conta as linhas de todos os blocos.

```tsx
import { ExpandableText } from '@orangesys/ui'

export default function Paragraphs() {
  return (
    <section aria-labelledby="sobre-evento" style={{ maxWidth: 520 }}>
      <h3 id="sobre-evento" style={{ margin: '0 0 8px', fontSize: 18 }}>
        Sobre o evento
      </h3>
      <ExpandableText lines={4}>
        <p>
          O Encontro Orange reúne equipes de produto, design e engenharia para um dia de palestras sobre sistemas de design,
          acessibilidade e desenvolvimento de interfaces.
        </p>
        <p>
          A programação tem oito palestras, duas oficinas práticas e um painel com equipes que adotaram o Orange em aplicativos
          financeiros e de varejo. Todas as sessões terão intérprete de Libras e legendas ao vivo.
        </p>
        <p>O credenciamento abre às 8h30 e o almoço está incluso para todas as pessoas inscritas.</p>
      </ExpandableText>
    </section>
  )
}
```

### Rótulos com contexto

O segundo item é curto e não mostra botão.

```tsx
import { ExpandableText } from '@orangesys/ui'

const notas = [
  {
    versao: 'v3.2.0',
    texto:
      'Adicionamos o componente TreeView com seleção múltipla, busca por digitação e expansão controlada. O Combobox agora anuncia a quantidade de resultados e a documentação ganhou exemplos em inglês para todos os componentes de formulário.',
  },
  { versao: 'v3.1.1', texto: 'Correção no foco do Modal ao fechar com Escape.' },
]

export default function CustomLabels() {
  return (
    <ul style={{ display: 'grid', gap: 16, margin: 0, padding: 0, listStyle: 'none', maxWidth: 440 }}>
      {notas.map((nota) => (
        <li key={nota.versao}>
          <strong style={{ display: 'block', marginBottom: 4 }}>{nota.versao}</strong>
          <ExpandableText
            lines={2}
            showMoreLabel={`Ler notas da ${nota.versao}`}
            showLessLabel={`Recolher notas da ${nota.versao}`}
          >
            {nota.texto}
          </ExpandableText>
        </li>
      ))}
    </ul>
  )
}
```

### Controlado

expanded + onExpandedChange permitem abrir o texto a partir de outra ação.

```tsx
import { Button, ExpandableText } from '@orangesys/ui'
import { useState } from 'react'

export default function Controlled() {
  const [aberto, setAberto] = useState(false)

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 440 }}>
      <ExpandableText lines={2} expanded={aberto} onExpandedChange={setAberto}>
        Ao assinar, você concorda com a renovação automática do plano ao final de cada período. É possível cancelar a qualquer
        momento pelo painel de cobrança, e o acesso continua disponível até o fim do período já pago. Valores promocionais
        valem apenas para o primeiro ano.
      </ExpandableText>
      <div>
        <Button size="sm" variant="outline" onClick={() => setAberto(true)} disabled={aberto}>
          Ler termos completos
        </Button>
      </div>
    </div>
  )
}
```

## Props

### `ExpandableText`

Texto longo recolhido em algumas linhas, com botão "Mostrar mais". O botão
só aparece quando o conteúdo realmente não cabe.

| Prop | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `as` | `ElementType` | `div` | Elemento que envolve o texto. Padrão: `div` (aceita vários parágrafos). |
| `defaultExpanded` | `boolean` | `false` | Estado inicial (não controlado). Padrão: `false`. |
| `expanded` | `boolean` | — | Estado expandido (controlado). |
| `lines` | `number` | `3` | Linhas visíveis quando recolhido. Padrão: `3`. |
| `onExpandedChange` | `((expanded: boolean) => void)` | — | Chamado ao expandir/recolher. |
| `showLessLabel` | `string` | — | Rótulo do botão quando expandido. Padrão: `t('showLess')`. |
| `showMoreLabel` | `string` | — | Rótulo do botão quando recolhido. Padrão: `t('showMore')`. |

Repassa também os atributos nativos (`HTMLAttributes`): `className`, `style`, `aria-*`, `data-*` e eventos.

## Movimento

- **Mostrar mais** — A altura cresce de N linhas até o texto completo (linha de grade minmax(N linhas, 0fr → 1fr)) — 400ms, ease-out. As reticências somem no início.
- **Mostrar menos** — A altura volta a N linhas — 400ms, ease-in-out. O line-clamp só é reaplicado no fim, então não há salto.
- **Chevron** — Gira 180° — 250ms, ease-spring.
- **Botão** — Hover e foco mostram o sublinhado (160ms); pressionar afunda 1px (90ms).
- **Movimento reduzido** — O texto abre e fecha sem transição.

## Acessibilidade

O botão é um `<button>` nativo com `aria-expanded` e `aria-controls` apontando para o conteúdo. O texto completo permanece no DOM mesmo recolhido, então leitores de tela sempre têm acesso a ele. Os rótulos padrão vêm de `t('showMore')`/`t('showLess')` e seguem o idioma do provider.

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o botão. |
| `Enter` | Expande ou recolhe o texto. |
| `Space` | Expande ou recolhe o texto. |

- **1.3.1** — Relação entre botão e conteúdo exposta com aria-controls.
- **2.4.6** — Rótulos personalizáveis para dar contexto em listas.
- **2.5.8** — Botão com área mínima de 24px de altura.
- **4.1.2** — Estado exposto com aria-expanded.
