# Acessibilidade

O Orange é construído para atender à WCAG 2.2 nível AA. Os componentes cuidam da semântica, do teclado, do foco e do contraste — e esta página mostra o que fica com quem monta as telas.

## Nosso compromisso

Acessibilidade é um requisito de entrada: nenhum componente é publicado sem navegação por teclado completa, nome acessível, foco visível, testes com axe-core e contraste validado nos dois temas. Seguimos a WCAG 2.2 no nível AA e os padrões do WAI-ARIA Authoring Practices .

> **Componentes acessíveis não garantem telas acessíveis** Ordem dos títulos, textos dos rótulos, mensagens de erro, texto alternativo de imagens e a ordem de leitura dependem de quem usa os componentes. O checklist no fim desta página cobre essa parte.

Critério por critério, o que o Orange cobre e como foi verificado está no Relatório de conformidade (autoavaliação; a auditoria externa está prevista para a 1.0).

## Princípios POUR

## Teclado

Tudo o que se faz com o mouse precisa ser possível com o teclado (2.1.1). A ordem do foco segue a ordem visual; nunca use `tabindex` positivo. Em widgets compostos — abas, menus, grupos de rádio — o `Tab` entra e sai do grupo e as setas movem entre os itens (padrão *roving tabindex*, disponível em `useRovingFocus`).

| Teclas | Ação |
| --- | --- |
| `Tab` | Move o foco para o próximo elemento interativo. |
| `Shift` + `Tab` | Move o foco para o elemento anterior. |
| `Enter` | Ativa links e botões; envia formulários. |
| `Space` | Ativa botões, marca caixas de seleção, abre selects. |
| `Esc` | Fecha modais, popovers, menus e tooltips; devolve o foco para quem abriu. |
| `← ↑ → ↓` | Navega dentro de abas, menus, listas, grupos de rádio e sliders. |
| `Home` | Vai para o primeiro item do grupo (ou o início do campo de texto). |
| `End` | Vai para o último item do grupo (ou o fim do campo de texto). |
| `Page Up` | Passo maior em sliders; mês anterior em calendários. |
| `Page Down` | Passo maior em sliders; próximo mês em calendários. |
| `a–z` | Busca por digitação em listas e menus (type-ahead). |

## Foco visível

Todo elemento focável mostra um contorno de 2px em `--or-color-focus` com 2px de afastamento, aplicado em `:focus-visible` pelo `base.css`. O contraste do foco contra o fundo é de :1 no tema escuro e :1 no claro — acima dos 3:1 exigidos (1.4.11).

- Nunca remova o contorno com `outline: none` sem oferecer um substituto igualmente visível.
- Elementos fixos não podem esconder o item focado (2.4.11). A documentação usa `scroll-padding-top` com a altura do cabeçalho.
- Ao abrir um modal, o foco vai para dentro; ao fechar, volta para o botão que o abriu (useFocusTrap faz os dois).

### Experimente com Tab

Clique na prévia e use Tab e Shift+Tab. O contorno só aparece na navegação por teclado.

## Leitores de tela

Leitores de tela anunciam a função, o nome e o estado de cada elemento. Os componentes cuidam da função e do estado; o nome quase sempre vem do texto que você escreve.

- **Ícones:** decorativos por padrão (`aria-hidden`). Se o ícone transmite significado sozinho, passe `label`.
- **Botões só com ícone:** `aria-label` no botão, descrevendo a ação (“Remover do carrinho”), não o desenho (“Menos”).
- **Texto extra para leitores:** `VisuallyHidden` esconde visualmente e mantém o conteúdo na árvore de acessibilidade.
- **Mudanças dinâmicas:** anuncie com `role="status"` (educado) ou `role="alert"` (urgente). A região precisa existir antes da mudança.
- **Idioma:** defina `lang` no `<html>` para a pronúncia correta; esta documentação troca entre `pt-BR` e `en`.

### Nome, ícone e região de status

O botão “−” é anunciado como “Remover do carrinho, botão”. A contagem fica em role="status": cada mudança é lida sem mover o foco.

```tsx
<Button variant="outline" startIcon={<Icon name="plus" size="sm" />} onClick={adicionar}>
  Adicionar ao carrinho
</Button>
<Button variant="ghost" iconOnly aria-label="Remover do carrinho" onClick={remover}>
  <Icon name="minus" />
</Button>
<p role="status">
  <Icon name="inbox" size="sm" /> <strong>{total}</strong> itens no carrinho
</p>

{/* Ícone informativo, sem texto ao lado: */}
<Icon name="lock" label="Conteúdo protegido" />
<VisuallyHidden>(abre em nova aba)</VisuallyHidden>
```

## Contraste

Os pares abaixo são os mesmos verificados em `packages/tokens/src/contrast.test.ts`, recalculados aqui com `contrastRatio()`. Texto exige 4.5:1 (1.4.3); bordas de campos, foco e o acento como elemento gráfico exigem 3:1 (1.4.11).

A matriz completa de texto × fundo está em Cor.

## Alto contraste (forced-colors)

Nos temas de contraste do Windows (o antigo “Alto contraste”) o navegador entra em `forced-colors: active`: troca as cores da página pela paleta escolhida pela pessoa. Fundos viram `Canvas`, textos e bordas viram `CanvasText`, e `box-shadow`, `text-shadow` e gradientes somem. Tudo o que comunica estado só com fundo ou sombra — a caixa marcada, a aba ativa, o dia escolhido, o anel de foco — desaparece se não houver um plano B.

Todo componente do Orange que desenha estado assim tem um bloco `@media (forced-colors: active)` que repinta esse estado com **cores do sistema** — e elas seguem a paleta da pessoa, seja ela clara, escura ou colorida.

| Cor do sistema | Onde o Orange usa |
| --- | --- |

- **Selecionado, marcado, atual:** `Highlight` com `HighlightText` — Switch, Checkbox, Radio, SegmentedControl, abas, Listbox, Combobox, TreeView, dias do calendário, estrelas do Rating, página atual do SideNav, BottomNavigation e Paginator.
- **Foco:** sempre `outline` (nunca só sombra). Quando o elemento já está em `Highlight`, o anel usa `HighlightText` ou `CanvasText` para não sumir no mesmo fundo — e a seleção nunca ocupa o contorno, que fica livre para o foco.
- **Progresso e trilhos:** preenchimento em `Highlight` sobre trilho vazado (contorno) ou pontilhado — “cheio × vazio” não depende de duas cores do sistema contrastarem entre si.
- **`forced-color-adjust: none` com cuidado:** só quando a cor é o conteúdo (séries de um gráfico, a cor escolhida no ColorField) ou quando há texto sobre `Highlight`/`Mark` — com `auto`, o Chromium pinta uma “placa de leitura” em `Canvas` atrás do texto e o rótulo some no fundo da seleção. Nesses elementos todas as cores (texto, ícones, borda, foco) são definidas explicitamente; no gráfico, texto, grade, eixos e foco continuam em cores do sistema e a tabela “Ver dados” traz os mesmos números.

`O padrão (Switch.css)`:

```css
@media (forced-colors: active) {
  /* Repita os seletores de hover/foco: senão a regra mais específica,
     com cor de token, vence — e o navegador a descarta. */
  .or-switch__control[aria-checked='true'],
  .or-switch__control[aria-checked='true']:focus-visible {
    border-color: Highlight;
    background: Highlight;
  }

  .or-switch__control[aria-checked='true'] .or-switch__thumb {
    background: HighlightText;
  }

  .or-switch__control:disabled .or-switch__thumb {
    background: GrayText;
  }
}
```

### Como testar

### 1. Chrome ou Edge (DevTools)

DevTools → menu `⋮` → *More tools* → *Rendering* → *Emulate CSS media feature forced-colors* → `active`. Combine com `prefers-color-scheme: dark` para ver a paleta escura.

### 2. Windows de verdade

Configurações → Acessibilidade → Temas de contraste (Aquático, Deserto, Crepúsculo, Céu noturno). Atalho: Alt esquerdo + Shift esquerdo + Print Screen.

### 3. Automatizado

O teste `packages/ui/src/test/forcedColors.test.ts` lê o CSS de todos os componentes e falha se um estado ou foco desenhado com fundo ou sombra não tiver bloco forced-colors, se um bloco usar cor de token ou se `forced-color-adjust: none` aparecer fora da lista revisada. Para capturas, o Playwright emula o modo com `browser.newContext({ forcedColors: 'active' })` .

Um tema de alto contraste escolhido dentro do produto é outra coisa: ele usa tokens e vale quando a pessoa o seleciona na interface. O forced-colors vale quando o sistema operacional impõe as cores — e passa por cima de qualquer tema.

## Movimento reduzido

Quando o sistema pede menos movimento, `tokens.css` zera todas as durações `--or-duration-*` e o `base.css` encurta qualquer animação ou transição restante. Para lógica em JavaScript, use `useReducedMotion()`.

Seu sistema agora: ****

`tokens.css`:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --or-duration-instant: 0ms;
    --or-duration-fast: 0ms;
    --or-duration-medium: 0ms;
    --or-duration-slow: 0ms;
    --or-duration-slower: 0ms;
  }
}
```

- Nada pisca mais de três vezes por segundo (2.3.1).
- Movimento automático com mais de 5 segundos precisa de pausa (2.2.2) — a faixa da página inicial para no hover e some com movimento reduzido.
- Troque deslocamentos grandes por fade quando o movimento estiver reduzido; a informação não pode depender da animação.

## Tamanho de alvo

A WCAG 2.2 exige alvos de pelo menos 24×24px (2.5.8). Os controles do Orange começam em 32px: os tokens `--or-control-sm`, `-md` e `-lg` definem as alturas de botões, campos e selects.

24px

mínimo WCAG

- Ícones pequenos (16px) dentro de botões: a área clicável é o botão inteiro, não o ícone.
- Links dentro de texto corrido são isentos, mas listas de links soltos não — dê a eles altura de linha suficiente.
- Arrastar nunca é a única forma de agir (2.5.7): sliders e listas ordenáveis também aceitam teclado e cliques.

## Formulários

Todo controle de formulário do Orange usa o `Field`, que liga rótulo ( `for`), descrição e erro (`aria-describedby`) e marca o campo como inválido (`aria-invalid`). Envie o formulário vazio abaixo para ver o erro.

- Rótulo visível sempre. Placeholder não é rótulo: some ao digitar e costuma ter pouco contraste.
- Erros dizem o que fazer (“Informe um e-mail no formato…”), não só o que deu errado (“Inválido”).
- Use `autoComplete` nos campos de dados pessoais (1.3.5) e não peça a mesma informação duas vezes (3.3.7).
- Login sem testes cognitivos: permita colar senhas e usar gerenciadores (3.3.8).

### Exemplo

```tsx
import { Button, Field, useFieldControlProps } from '@orangesys/ui'
import { useState } from 'react'

function EmailInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  // id, aria-describedby, aria-invalid e required vêm do Field
  const fieldProps = useFieldControlProps()
  return <input {...fieldProps} {...props} className="or-control" type="email" autoComplete="email" />
}

export function Convite() {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState<string>()
  return (
    <form noValidate onSubmit={(e) => {
      e.preventDefault()
      setErro(/^\S+@\S+\.\S+$/.test(email) ? undefined : 'Informe um e-mail no formato nome@empresa.com.')
    }}>
      <Field label="E-mail de trabalho" description="Enviaremos o convite para este endereço." error={erro} required>
        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Button type="submit">Enviar convite</Button>
    </form>
  )
}
```

## Como testamos

- **axe-core em cada componente** — Os testes chamam `expectNoA11yViolations()` e falham com a lista de violações.
- **Teclado com Testing Library** — Interações com `user-event`: Tab, setas, Escape, Home e End.
- **Painel a11y do Storybook** — axe com layout real em todas as stories, nos dois temas.
- **Testes de contraste** — 19 pares de tokens verificados por tema a cada execução de pnpm test.

## Critérios novos da WCAG 2.2

- **2.4.11** — Foco não obscurecido: cabeçalhos fixos não cobrem o elemento focado.
- **2.5.7** — Movimentos de arrastar têm alternativa com um único ponteiro ou teclado.
- **2.5.8** — Alvos de pelo menos 24×24px — os controles do Orange começam em 32px.
- **3.2.6** — Ajuda consistente: links de ajuda no mesmo lugar em todas as páginas.
- **3.3.7** — Entrada redundante: não peça de novo o que já foi informado.
- **3.3.8** — Autenticação acessível: sem quebra-cabeças; colar e gerenciadores de senha permitidos.

## Checklist para quem constrói telas

- [ ] Um único h1 por página e títulos sem pular níveis (h2 → h3, nunca h2 → h4).
- [ ] Landmarks presentes: `header`, `nav`, `main`, `footer`, e um link “Pular para o conteúdo”.
- [ ] Toda a tela navegável por teclado, na ordem visual, com foco sempre visível.
- [ ] Imagens informativas com alt descritivo; decorativas com alt="".
- [ ] Botões e links com textos que fazem sentido fora de contexto (nada de “clique aqui”).
- [ ] Cores fora dos tokens verificadas: 4.5:1 para texto, 3:1 para ícones e bordas.
- [ ] Nenhuma informação transmitida só por cor, posição ou forma.
- [ ] Zoom de 200% e largura de 320px sem perda de conteúdo nem rolagem horizontal (1.4.10).
- [ ] Mensagens de sucesso e erro anunciadas por região de status ou alerta.
- [ ] Testado com pelo menos um leitor de tela (NVDA, VoiceOver ou TalkBack).
