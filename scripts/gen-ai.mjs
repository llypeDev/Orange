#!/usr/bin/env node
/**
 * Referência do @orangesys/ui para IAs: gera `skills/orange-ui/references/**` (lida pelo skill
 * `orange-ui` e publicada no site como /llms.txt e /llms-full.txt).
 *
 * Tudo vem do código, para não divergir:
 * - componentes: `apps/docs/src/content/components/<slug>/meta.ts` (nome, categoria, descrição);
 * - props: o TypeScript de `packages/ui` via react-docgen-typescript (o mesmo do Storybook);
 * - boas práticas, acessibilidade, movimento e exemplos: o JSX das páginas da documentação
 *   (blocos do kit — Section, Bullets, DoDont, KeyboardTable… — viram Markdown, em português);
 *   o código de cada exemplo é o arquivo `examples/*.tsx` que a página mostra;
 * - hooks e utilitários: JSDoc e assinatura de cada export;
 * - tokens: `packages/tokens/css/tokens.css`; ícones: `iconPaths`.
 *
 * Uso: `pnpm gen:ai` (escreve) · `pnpm gen:ai --check` (CI: falha se estiver desatualizado).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import docgen from 'react-docgen-typescript'
import ts from 'typescript'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const uiDir = join(root, 'packages/ui')
const docsContent = join(root, 'apps/docs/src/content')
const outDir = join(root, 'skills/orange-ui/references')
const SITE = 'https://orange.llypedev.com.br'
const REPO = 'https://github.com/llypeDev/Orange'
const check = process.argv.includes('--check')

const rel = (file) => relative(root, file).replaceAll('\\', '/')

// ---------------------------------------------------------------------------------------------
// TypeScript de packages/ui (mesma configuração do build de tipos)
// ---------------------------------------------------------------------------------------------
const tsconfigPath = join(uiDir, 'tsconfig.build.json')
const tsconfig = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
const parsedConfig = ts.parseJsonConfigFileContent(tsconfig.config, ts.sys, uiDir)
const compilerOptions = { ...parsedConfig.options, noEmit: true, declaration: false }
const program = ts.createProgram({ rootNames: parsedConfig.fileNames, options: compilerOptions })
const checker = program.getTypeChecker()

const indexSource = program.getSourceFile(join(uiDir, 'src/index.ts'))
const exportedValues = new Map() // nome → símbolo de destino (só valores, não tipos)
const exportedTypes = new Map() // nome → declaração (interfaces, aliases e enums só de tipo)
for (const symbol of checker.getExportsOfModule(checker.getSymbolAtLocation(indexSource))) {
  const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
  if (target.flags & ts.SymbolFlags.Value) exportedValues.set(symbol.getName(), target)
  else if (
    target.flags &
    (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Enum)
  ) {
    const decl = target.declarations?.[0]
    if (decl) exportedTypes.set(symbol.getName(), decl)
  }
}

/**
 * Tipos exportados declarados numa pasta (ex.: `components/Form` → FormValues, FormErrors), exceto
 * `*Props`, que já estão nas tabelas. O texto é o da declaração, com o JSDoc.
 */
function typesMarkdown(dirs, { heading = '###', title = 'Tipos' } = {}) {
  const wanted = [...exportedTypes.entries()]
    .filter(([name, decl]) => {
      const dir = rel(dirname(decl.getSourceFile().fileName)).replace(/^packages\/ui\/src\//, '')
      return dirs.includes(dir) && !/Props$/.test(name)
    })
    .sort(([a], [b]) => a.localeCompare(b))
  if (!wanted.length) return ''
  const blocks = wanted.map(([name, decl]) => {
    const sf = decl.getSourceFile()
    const comments = ts.getLeadingCommentRanges(sf.text, decl.getFullStart()) ?? []
    const last = comments.at(-1)
    const doc =
      last && sf.text.slice(last.pos, last.pos + 3) === '/**'
        ? `${sf.text.slice(last.pos, last.end)}\n`
        : ''
    let text = decl.getText(sf)
    // Dicionários enormes (ex.: todas as mensagens, todos os nomes de ícone): só o começo.
    if (text.length > 2500)
      text = `${text.slice(0, 600).replace(/\n[^\n]*$/, '')}\n  // … (veja o código: ${rel(sf.fileName)})`
    return `\`${name}\`:\n\n\`\`\`ts\n${doc}${text}\n\`\`\``
  })
  return [`${heading} ${title}`, '', blocks.join('\n\n'), ''].join('\n')
}

// ---------------------------------------------------------------------------------------------
// Props dos componentes (react-docgen-typescript)
// ---------------------------------------------------------------------------------------------
const parser = docgen.withCompilerOptions(compilerOptions, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: () => true, // filtramos abaixo, registrando de onde vêm os atributos herdados
})
const componentFiles = parsedConfig.fileNames.filter((f) => f.endsWith('.tsx'))
// Componentes (PascalCase) e funções auxiliares de um componente (ex.: `buttonClassName`). Hooks
// e constantes ficam em hooks.md e foundations.md.
const isComponentName = (name) => /^[A-Z]/.test(name)
const componentDocs = parser
  .parseWithProgramProvider(componentFiles, () => program)
  .filter((doc) => exportedValues.has(doc.displayName) && !/^use[A-Z]/.test(doc.displayName))
  .filter((doc) => {
    const symbol = exportedValues.get(doc.displayName)
    return isComponentName(doc.displayName) || !!(symbol.flags & ts.SymbolFlags.Function)
  })

/** Componentes exportados por pasta de `packages/ui/src` (ex.: `components/Tabs`). */
const docsByDir = new Map()
const seen = new Set()
for (const doc of componentDocs) {
  if (seen.has(doc.displayName)) continue
  seen.add(doc.displayName)
  const dir = rel(dirname(doc.filePath)).replace(/^packages\/ui\/src\//, '')
  if (!docsByDir.has(dir)) docsByDir.set(dir, [])
  docsByDir.get(dir).push(doc)
}

const fromNodeModules = (decl) => /node_modules/.test(decl.fileName)

// ---------------------------------------------------------------------------------------------
// Padrão de cada prop: o da função do próprio componente
// ---------------------------------------------------------------------------------------------
// O react-docgen-typescript junta os padrões de TODAS as funções do arquivo por nome de prop (a
// última declarada vence). Num arquivo com vários componentes o padrão de um vaza para o outro:
// `DropdownCheckboxItem.closeOnSelect` saía `true` (o do `DropdownRadioItem`, declarado depois),
// embora o código use `false`; e uma prop obrigatória virava opcional se outro componente do
// arquivo tivesse um padrão para o mesmo nome. Aqui o padrão vem só da desestruturação do primeiro
// parâmetro da função do componente.

/** A função de um componente: desfaz `forwardRef(...)`, `memo(...)`, `as …` e segue identificadores. */
function componentFunction(node, depth = 0) {
  if (!node || depth > 8) return null
  if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node))
    return node
  if (ts.isVariableDeclaration(node)) return componentFunction(node.initializer, depth + 1)
  if (
    ts.isParenthesizedExpression(node) ||
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression(node) ||
    ts.isNonNullExpression(node)
  )
    return componentFunction(node.expression, depth + 1)
  if (ts.isCallExpression(node)) {
    // forwardRef(fn), memo(fn), Object.assign(fn, { … })
    if (!/(^|\.)(forwardRef|memo|assign)$/.test(node.expression.getText())) return null
    return componentFunction(node.arguments[0], depth + 1)
  }
  if (ts.isIdentifier(node)) {
    let symbol = checker.getSymbolAtLocation(node)
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
    return componentFunction(symbol?.valueDeclaration ?? symbol?.declarations?.[0], depth + 1)
  }
  return null
}

/** Texto do valor padrão, no formato do docgen: literais sem aspas, constantes resolvidas. */
function defaultText(initializer, depth = 0) {
  switch (initializer.kind) {
    case ts.SyntaxKind.TrueKeyword:
      return 'true'
    case ts.SyntaxKind.FalseKeyword:
      return 'false'
    case ts.SyntaxKind.NullKeyword:
      return 'null'
    case ts.SyntaxKind.StringLiteral:
      return initializer.text.trim()
    case ts.SyntaxKind.NumericLiteral:
      return initializer.text
    case ts.SyntaxKind.Identifier:
    case ts.SyntaxKind.PropertyAccessExpression: {
      if (initializer.getText() === 'undefined') return 'undefined'
      // Constante (`DEFAULT_SIZE`, `sizes.md`): o valor dela.
      let symbol = checker.getSymbolAtLocation(initializer)
      if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
      const value = symbol?.declarations?.[0]?.initializer
      if (value && depth < 4) return defaultText(value, depth + 1)
      // Nome de uma função interna (`getKey = defaultGetKey`): não diz nada a quem lê a tabela; a
      // descrição da prop explica o padrão.
      return ts.isIdentifier(initializer) ? null : initializer.getText()
    }
    default:
      return initializer.getText().trim()
  }
}

const ownDefaultsCache = new Map()

/**
 * Onde o componente desestrutura as props: no próprio parâmetro (`function Foo({ size = 'md' })`)
 * ou no corpo (`function Foo(props) { const { size = 'md' } = props }`).
 */
function propsPattern(fn) {
  const param = fn.parameters[0]
  if (!param) return null
  if (ts.isObjectBindingPattern(param.name)) return param.name
  if (!ts.isIdentifier(param.name) || !fn.body || !ts.isBlock(fn.body)) return null
  for (const statement of fn.body.statements) {
    if (!ts.isVariableStatement(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isObjectBindingPattern(declaration.name) &&
        declaration.initializer &&
        ts.isIdentifier(declaration.initializer) &&
        declaration.initializer.text === param.name.text
      )
        return declaration.name
    }
  }
  return null
}

/**
 * Padrões declarados pelo próprio componente e o tipo das props, ou `null` quando a função não é
 * encontrada (aí vale o que o docgen disser). Um padrão sem texto útil fica como `null`: a prop
 * tem padrão, só não há o que mostrar.
 */
function ownDefaults(doc) {
  if (ownDefaultsCache.has(doc.displayName)) return ownDefaultsCache.get(doc.displayName)
  const symbol = exportedValues.get(doc.displayName)
  const fn = componentFunction(symbol?.valueDeclaration ?? symbol?.declarations?.[0])
  let result = null
  if (fn) {
    const values = new Map()
    for (const element of propsPattern(fn)?.elements ?? []) {
      if (element.dotDotDotToken || !element.initializer) continue
      const key = element.propertyName ?? element.name
      if (ts.isIdentifier(key) || ts.isStringLiteral(key))
        values.set(key.text, defaultText(element.initializer))
    }
    const param = fn.parameters[0]
    result = { values, propsType: param ? checker.getTypeAtLocation(param) : null }
  }
  ownDefaultsCache.set(doc.displayName, result)
  return result
}

/** Padrão e obrigatoriedade de uma prop, corrigindo o que o docgen misturou de outras funções. */
function propDefault(doc, prop) {
  const own = ownDefaults(doc)
  if (!own)
    return { value: prop.defaultValue?.value ?? prop.tags?.default, required: prop.required }
  const value = own.values.get(prop.name) ?? prop.tags?.default
  // O docgen tira o "obrigatória" de quem tem padrão no código. Se o padrão era de outra função,
  // a obrigatoriedade volta a ser a do tipo.
  const leaked = !!prop.defaultValue && !own.values.has(prop.name)
  const declared = leaked ? own.propsType?.getProperty(prop.name) : null
  const required = declared ? !(declared.flags & ts.SymbolFlags.Optional) : prop.required
  return { value, required }
}

/**
 * A interface de atributos nativos que o componente repassa. Primeiro pelo `extends` da
 * declaração `<Nome>Props` no código (o docgen, num programa com todos os arquivos, às vezes
 * atribui as props nativas a outra interface do @types/react); senão, pela mais frequente.
 */
function inheritedFrom(doc) {
  const source = readFileSync(doc.filePath, 'utf8')
  const decl = source.match(
    new RegExp(`(?:interface|type)\\s+${doc.displayName}Props\\b[\\s\\S]{0,600}?(?:\\{|;\\n)`),
  )
  if (decl) {
    const attrs = decl[0].match(/\b(\w*HTMLAttributes|SVGProps|SVGAttributes)\b/)
    if (attrs) return attrs[1]
    const tag = decl[0].match(/ComponentProps(?:WithoutRef|WithRef)?<\s*'([a-z]+)'\s*>/)
    if (tag) return `<${tag[1]}>`
  }
  const counts = new Map()
  for (const prop of Object.values(doc.props)) {
    const decls = prop.declarations?.length ? prop.declarations : prop.parent ? [prop.parent] : []
    if (decls.length && decls.every(fromNodeModules)) {
      for (const name of new Set(decls.map((d) => d.name))) {
        counts.set(name, (counts.get(name) ?? 0) + 1)
      }
    }
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  const generic = new Set([
    'HTMLAttributes',
    'AllHTMLAttributes',
    'AriaAttributes',
    'DOMAttributes',
  ])
  const specific = ranked.find(([n]) => /HTMLAttributes$/.test(n) && !generic.has(n))
  if (specific) return specific[0]
  if (counts.has('HTMLAttributes')) return 'HTMLAttributes'
  if (counts.has('SVGAttributes')) return 'SVGAttributes'
  return ranked[0]?.[0] ?? null
}

const cell = (text) =>
  String(text ?? '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\|/g, '\\|')
    .trim()

// Nomes dos ícones: uma união com eles todos vira `IconName` nas tabelas.
const iconNameSet = (() => {
  const iconPaths = exportedValues.get('iconPaths')
  if (!iconPaths) return new Set()
  const type = checker.getTypeOfSymbolAtLocation(iconPaths, iconPaths.valueDeclaration)
  return new Set(checker.getPropertiesOfType(type).map((p) => p.getName()))
})()

function typeText(type) {
  let expanded =
    type.name === 'enum' && Array.isArray(type.value)
      ? type.value.map((v) => v.value).join(' | ')
      : type.name
  const members = expanded.split(' | ')
  const truncated = members.filter((m) => /^\.\.\. \d+ more \.\.\.$/.test(m.trim()))
  const quoted = members.filter((m) => /^"[^"]+"$/.test(m))
  const icons = quoted.filter((m) => iconNameSet.has(m.slice(1, -1)))
  // Todos os nomes de ícone (ou a união truncada pelo TypeScript, só com nomes de ícone visíveis).
  if (icons.length >= 20 || (truncated.length && icons.length >= 2 && icons.length === quoted.length)) {
    expanded = ['IconName', ...members.filter((m) => !icons.includes(m) && !truncated.includes(m))].join(
      ' | ',
    )
  }
  // Uniões gigantes (ex.: `as` genérico expandido em ~180 tags de ElementType): o nome declarado
  // diz mais; sem ele, `("a" & ElementType) | …` vira `ElementType`.
  const huge = expanded.length > 160 || /\.\.\. \d+ more \.\.\./.test(expanded)
  if (!huge) return expanded
  if (type.raw && type.raw.length <= 160) return type.raw
  const intersected = expanded.match(/^\("[^"]+" & (\w+)\)/)
  if (intersected) return intersected[1]
  return `${expanded.split(' | ').slice(0, 4).join(' | ')} | …`
}

function propsMarkdown(doc) {
  const own = Object.values(doc.props)
    .filter((prop) => {
      const decls = prop.declarations?.length ? prop.declarations : prop.parent ? [prop.parent] : []
      return !decls.length || decls.some((d) => !fromNodeModules(d))
    })
    .map((prop) => ({ ...prop, ...propDefault(doc, prop) }))
    .sort((a, b) => {
      if (a.required !== b.required) return a.required ? -1 : 1
      return a.name.localeCompare(b.name)
    })
  const isFunction = !isComponentName(doc.displayName)
  const lines = [
    isFunction ? `### \`${doc.displayName}(opções)\` — função` : `### \`${doc.displayName}\``,
    '',
  ]
  if (doc.description) lines.push(doc.description.trim(), '')
  if (own.length) {
    lines.push(
      `| ${isFunction ? 'Opção' : 'Prop'} | Tipo | Padrão | Descrição |`,
      '| --- | --- | --- | --- |',
    )
    for (const prop of own) {
      const name = `\`${prop.name}\`${prop.required ? ' (obrigatória)' : ''}`
      const def = prop.value
      // Campos que repassam label/description/error ao Field sem JSDoc próprio: a descrição do Field.
      const isField = 'label' in doc.props && 'error' in doc.props
      const description =
        prop.description || (isField ? fieldDescriptions().get(prop.name) : '') || ''
      lines.push(
        `| ${name} | \`${cell(typeText(prop.type))}\` | ${def !== undefined && def !== null && def !== '' ? `\`${cell(def)}\`` : '—'} | ${cell(description) || '—'} |`,
      )
    }
    lines.push('')
  } else {
    lines.push('Sem props próprias.', '')
  }
  const inherited = isFunction ? null : inheritedFrom(doc)
  if (inherited) {
    const native = nativeAttributes[inherited] ?? ''
    lines.push(
      native
        ? `Repassa também os atributos nativos (\`${inherited}\`) ${native}, além de \`className\`, \`style\`, \`aria-*\`, \`data-*\` e eventos.`
        : `Repassa também os atributos nativos (\`${inherited}\`): \`className\`, \`style\`, \`aria-*\`, \`data-*\` e eventos.`,
      '',
    )
  }
  return lines.join('\n')
}

/** Atributos nativos que mais aparecem em cada caso (o que a IA costuma procurar na tabela). */
const nativeAttributes = {
  InputHTMLAttributes:
    'do `<input>`, como `name`, `required`, `disabled`, `readOnly`, `autoComplete`, `placeholder` e `onBlur`',
  SelectHTMLAttributes:
    'do `<select>`, como `name`, `required`, `disabled`, `value`/`defaultValue` e `onChange` (com o evento)',
  TextareaHTMLAttributes:
    'do `<textarea>`, como `name`, `required`, `disabled`, `rows`, `maxLength` e `placeholder`',
  ButtonHTMLAttributes: 'do `<button>`, como `type`, `disabled`, `onClick`, `form` e `name`',
  AnchorHTMLAttributes: 'do `<a>`, como `href`, `target`, `rel` e `download`',
  FormHTMLAttributes: 'do `<form>`, como `id`, `action`, `method` e `noValidate`',
  FieldsetHTMLAttributes: 'do `<fieldset>`, como `name`, `form` e `disabled`',
  ImgHTMLAttributes: 'da `<img>`, como `src`, `alt`, `width`, `height` e `loading`',
  SVGProps: 'do `<svg>`',
  SVGAttributes: 'do `<svg>`',
}

let fieldDescriptionsCache
/** Descrições das props do Field (label, description, error, hideLabel, required, optional…). */
function fieldDescriptions() {
  if (!fieldDescriptionsCache) {
    const field = componentDocs.find((d) => d.displayName === 'Field')
    fieldDescriptionsCache = new Map(
      Object.values(field?.props ?? {})
        .filter((p) => p.description)
        .map((p) => [p.name, p.description]),
    )
  }
  return fieldDescriptionsCache
}

// ---------------------------------------------------------------------------------------------
// Páginas da documentação (JSX do kit → Markdown)
// ---------------------------------------------------------------------------------------------
const attr = (element, name) => {
  const attrs = (element.attributes ?? element.openingElement?.attributes)?.properties ?? []
  const found = attrs.find((a) => ts.isJsxAttribute(a) && a.name.getText() === name)
  if (!found) return undefined
  if (!found.initializer) return true
  if (ts.isStringLiteral(found.initializer)) return found.initializer
  return found.initializer.expression // JsxExpression
}
const tagName = (node) =>
  (ts.isJsxElement(node) ? node.openingElement.tagName : node.tagName).getText()

function unwrap(node) {
  while (node && (ts.isParenthesizedExpression(node) || ts.isAsExpression(node))) {
    node = node.expression
  }
  return node
}

/** O nó em português de `{ pt, en }` (para conteúdo em blocos, como um <p>). */
function ptNode(node) {
  node = unwrap(node)
  if (node && ts.isObjectLiteralExpression(node)) {
    return node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === 'pt')
      ?.initializer
  }
  return node
}

/** Valor em português de `{ pt, en }` (ou o próprio texto). */
function localized(node) {
  node = unwrap(node)
  if (!node) return ''
  if (ts.isObjectLiteralExpression(node)) {
    const pt = node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === 'pt')
    return pt ? inline(pt.initializer) : ''
  }
  return inline(node)
}

function textOfLiteral(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) return node.getText().slice(1, -1)
  return null
}

const entities = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  rarr: '→',
  larr: '←',
  times: '×',
  hellip: '…',
  mdash: '—',
  ndash: '–',
}
const decodeEntities = (text) =>
  text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (m, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1))
      return Number.isFinite(n) ? String.fromCodePoint(n) : m
    }
    return entities[code.toLowerCase()] ?? m
  })

/** Texto em linha: JSX, strings e <Code>/<strong>/<em> → Markdown. */
/** Constantes JSX da página em conversão (`const dateTimePicker = <Link…>DateTimePicker</Link>`). */
let jsxConstants = new Map()

function inline(node) {
  node = unwrap(node)
  if (!node) return ''
  const literal = textOfLiteral(node)
  if (literal !== null) return literal
  if (ts.isIdentifier(node) && jsxConstants.has(node.text))
    return inline(jsxConstants.get(node.text))
  if (ts.isNumericLiteral(node)) return node.text
  if (ts.isJsxText(node)) return decodeEntities(node.text.replace(/\s+/g, ' '))
  if (ts.isJsxExpression(node)) return node.expression ? inline(node.expression) : ''
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return inline(node.left) + inline(node.right)
  }
  if (ts.isJsxFragment(node)) return node.children.map(inline).join('')
  // t({ pt, en }) do useLang()
  if (ts.isCallExpression(node) && node.expression.getText() === 't' && node.arguments[0]) {
    return localized(node.arguments[0])
  }
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    const tag = tagName(node)
    const children = ts.isJsxElement(node) ? node.children.map(inline).join('') : ''
    switch (tag) {
      case 'Code':
      case 'code':
      case 'kbd':
      case 'Kbd':
        return children ? `\`${children.trim()}\`` : ''
      case 'strong':
      case 'b':
        return children ? `**${children.trim()}**` : ''
      case 'em':
      case 'i':
        return children ? `*${children.trim()}*` : ''
      case 'br':
        return ' '
      case 'T':
        return localized(attr(node, 'pt'))
      default:
        return children
    }
  }
  return ''
}

const clean = (text) =>
  text
    .replace(/[ \t]+/g, ' ')
    .replace(/ +\n/g, '\n')
    .trim()

function exampleCodeMap(sourceFile, file) {
  const map = new Map()
  for (const stmt of sourceFile.statements) {
    if (!ts.isImportDeclaration(stmt) || !stmt.importClause?.name) continue
    const spec = stmt.moduleSpecifier.text
    if (!spec.endsWith('?raw')) continue
    const base = resolve(dirname(file), spec.slice(0, -4))
    const target = [base, `${base}.tsx`, `${base}.ts`].find((p) => existsSync(p))
    if (target) map.set(stmt.importClause.name.text, target)
  }
  return map
}

/** Converte o JSX de uma página em blocos de Markdown. */
function pageToMarkdown(file, { headingLevel = 2, onProps } = {}) {
  const source = readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  jsxConstants = new Map()
  const collectJsx = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
      const init = unwrap(n.initializer)
      if (ts.isJsxElement(init) || ts.isJsxFragment(init) || ts.isJsxSelfClosingElement(init)) {
        jsxConstants.set(n.name.text, init)
      }
    }
    ts.forEachChild(n, collectJsx)
  }
  collectJsx(sf)
  const codes = exampleCodeMap(sf, file)
  // Constantes de texto do arquivo (`const mainTsx = \`...\``), usadas como código nos blocos.
  const constants = new Map()
  const templateText = (node) => {
    node = unwrap(node)
    if (!node || !ts.isTemplateExpression(node)) return textOfLiteral(node)
    let text = node.head.text
    for (const span of node.templateSpans) {
      const expr = unwrap(span.expression)
      text +=
        ts.isIdentifier(expr) && constants.has(expr.text)
          ? constants.get(expr.text)
          : `\${${span.expression.getText()}}`
      text += span.literal.text
    }
    return text
  }
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      const text = decl.initializer && templateText(decl.initializer)
      if (ts.isIdentifier(decl.name) && text !== null && text !== undefined) {
        constants.set(decl.name.text, text)
      }
    }
  }
  /** Código de um atributo: literal, constante do arquivo ou import `?raw`. */
  const codeOf = (expr) => {
    expr = unwrap(expr)
    if (!expr || expr === true) return null
    const literal = textOfLiteral(expr)
    if (literal !== null) return literal
    if (ts.isIdentifier(expr)) {
      if (codes.has(expr.text)) return readFileSync(codes.get(expr.text), 'utf8')
      if (constants.has(expr.text)) return constants.get(expr.text)
    }
    return null
  }
  const fence = (code, language = 'tsx') => {
    if (code) out.push(`\`\`\`${language}`, code.trim(), '```', '')
  }
  const out = []
  let title = null
  const h = (level) => '#'.repeat(Math.min(level, 6))

  function list(items, render, { close = true } = {}) {
    const arr = unwrap(items)
    if (arr && ts.isArrayLiteralExpression(arr)) {
      for (const el of arr.elements) {
        const text = clean(render(unwrap(el)))
        if (text) out.push(`- ${text}`)
      }
    }
    if (close) out.push('')
  }
  /** <table> do JSX → tabela Markdown (linhas literais e `[...].map(...)` de listas literais). */
  function table(node) {
    const rows = []
    const cellsOf = (tr) =>
      (ts.isJsxElement(tr) ? tr.children : [])
        .filter(
          (c) =>
            (ts.isJsxElement(c) || ts.isJsxSelfClosingElement(c)) && /^t[hd]$/.test(tagName(c)),
        )
        .map((c) => clean(ts.isJsxElement(c) ? c.children.map(inline).join('') : ''))
    const walk = (n) => {
      n = unwrap(n)
      if (!n) return
      if (ts.isJsxElement(n) && tagName(n) === 'tr') {
        const cells = cellsOf(n)
        if (cells.some(Boolean)) rows.push(cells)
        return
      }
      if (ts.isJsxExpression(n)) return walk(n.expression)
      if (
        ts.isCallExpression(n) &&
        ts.isPropertyAccessExpression(n.expression) &&
        n.expression.name.text === 'map'
      ) {
        const arr = unwrap(n.expression.expression)
        if (arr && ts.isArrayLiteralExpression(arr)) {
          for (const el of arr.elements.map(unwrap)) {
            if (ts.isArrayLiteralExpression(el))
              rows.push(el.elements.map((x) => clean(localized(x))))
            else if (ts.isObjectLiteralExpression(el)) {
              rows.push(
                el.properties
                  .filter(ts.isPropertyAssignment)
                  .map((p) => clean(localized(p.initializer))),
              )
            }
          }
        }
        return
      }
      if (ts.isJsxElement(n)) n.children.forEach(walk)
    }
    walk(node)
    if (!rows.length) return
    const width = Math.max(...rows.map((r) => r.length))
    const pad = (r) => [...r, ...Array(width - r.length).fill('')]
    out.push(`| ${pad(rows[0]).map(cell).join(' | ')} |`, `|${' --- |'.repeat(width)}`)
    for (const r of rows.slice(1)) out.push(`| ${pad(r).map(cell).join(' | ')} |`)
    out.push('')
  }

  function rowsTable(rows) {
    rows = unwrap(rows)
    if (!rows || !ts.isArrayLiteralExpression(rows) || !rows.elements.length) return
    out.push('| Nome | Tipo | Padrão | Descrição |', '| --- | --- | --- | --- |')
    for (const el of rows.elements.map(unwrap)) {
      const name = inline(prop(el, 'name'))
      const required = prop(el, 'required')
      const type = inline(prop(el, 'type'))
      const def = inline(prop(el, 'default'))
      const desc = clean(localized(prop(el, 'description')))
      const req = required && required.kind === ts.SyntaxKind.TrueKeyword ? ' (obrigatório)' : ''
      out.push(
        `| \`${cell(name)}\`${req} | ${type ? `\`${cell(type)}\`` : '—'} | ${def ? `\`${cell(def)}\`` : '—'} | ${cell(desc) || '—'} |`,
      )
    }
    out.push('')
  }
  const prop = (obj, name) =>
    ts.isObjectLiteralExpression(obj)
      ? obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name)
          ?.initializer
      : undefined

  function block(node, level) {
    node = unwrap(node)
    if (!node) return
    if (ts.isJsxText(node)) {
      const text = clean(node.text)
      if (text) out.push(text, '')
      return
    }
    if (ts.isJsxExpression(node)) return block(node.expression, level)
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
    ) {
      return block(node.right, level)
    }
    if (ts.isJsxFragment(node)) return node.children.forEach((c) => block(c, level))
    if (!ts.isJsxElement(node) && !ts.isJsxSelfClosingElement(node)) return
    const tag = tagName(node)
    const children = ts.isJsxElement(node) ? node.children : []
    switch (tag) {
      case 'ComponentPage':
      case 'DocPage': {
        const t = attr(node, 'title')
        if (t && t !== true) title = clean(localized(t))
        const lead = attr(node, 'lead') ?? attr(node, 'description')
        if (lead && lead !== true) out.push(clean(localized(lead)), '')
        children.forEach((c) => block(c, level))
        return
      }
      case 'Section': {
        const t = attr(node, 'title')
        const heading = t && t !== true ? clean(localized(t)) : ''
        const isProps = heading === 'Props'
        if (isProps && onProps) {
          out.push(`${h(level)} Props`, '', onProps(), '')
          return
        }
        if (heading) out.push(`${h(level)} ${heading}`, '')
        children.forEach((c) => block(c, level + 1))
        return
      }
      case 'TemplateDocPage': {
        // Modelo de página: visão geral, componentes usados, acessibilidade e o código completo.
        const t = attr(node, 'title')
        if (t && t !== true) title = clean(localized(t))
        const lead = attr(node, 'lead')
        if (lead && lead !== true) out.push(clean(localized(lead)), '')
        block(ptNode(attr(node, 'overview')), level)
        out.push(`${h(level)} Componentes usados`, '')
        list(attr(node, 'components'), (el) => {
          const slug = inline(prop(el, 'slug'))
          return `**${slug}** (\`components/${slug}.md\`) — ${clean(localized(prop(el, 'why')))}`
        })
        out.push(`${h(level)} Acessibilidade`, '')
        list(attr(node, 'a11y'), (el) => {
          const topic = clean(localized(prop(el, 'topic')))
          const crit = inline(prop(el, 'criteria'))
          return `**${topic}**${crit ? ` (${crit})` : ''} — ${clean(localized(prop(el, 'description')))}`
        })
        const filesNode = unwrap(attr(node, 'files'))
        if (filesNode && ts.isArrayLiteralExpression(filesNode)) {
          out.push(`${h(level)} Código`, '')
          for (const f of filesNode.elements.map(unwrap)) {
            const name = inline(prop(f, 'name'))
            const language = inline(prop(f, 'language')) || 'tsx'
            out.push(`\`${name}\`:`, '')
            fence(codeOf(prop(f, 'code')), language)
          }
        }
        return
      }
      case 'Bullets':
        return list(attr(node, 'items'), (el) => localized(el))
      case 'DoDont': {
        list(attr(node, 'doItems'), (el) => `Faça: ${localized(el)}`, { close: false })
        list(attr(node, 'dontItems'), (el) => `Evite: ${localized(el)}`)
        return
      }
      case 'HookDoc': {
        // Página de hooks: nome, descrição, assinatura, parâmetros, retorno, uso e exemplo.
        const name = inline(attr(node, 'name'))
        out.push(`${h(level)} \`${name}\``, '')
        const desc = clean(localized(attr(node, 'description')))
        if (desc) out.push(desc, '')
        fence(codeOf(attr(node, 'signature')), 'ts')
        rowsTable(attr(node, 'params'))
        const returns = attr(node, 'returns')
        if (returns && returns !== true) {
          const text = clean(localized(returns))
          if (text) out.push(`Retorna: ${text}`, '')
        }
        fence(codeOf(attr(node, 'usage')))
        const example = unwrap(attr(node, 'example'))
        if (example && ts.isObjectLiteralExpression(example)) {
          const exDesc = clean(localized(prop(example, 'description')))
          if (exDesc) out.push(exDesc, '')
          fence(codeOf(prop(example, 'code')))
        }
        return
      }
      case 'DefinitionTable':
        return list(attr(node, 'rows'), (el) => {
          const term = clean(localized(prop(el, 'term')))
          const desc = clean(localized(prop(el, 'description')))
          return term ? `**${term}** — ${desc}` : desc
        })
      case 'WcagList':
        return list(attr(node, 'items'), (el) => {
          const crit = inline(prop(el, 'criterion'))
          return `**${crit}** — ${clean(localized(prop(el, 'description')))}`
        })
      case 'KeyboardTable': {
        const rows = unwrap(attr(node, 'rows'))
        if (!rows || !ts.isArrayLiteralExpression(rows)) return
        out.push('| Teclas | Ação |', '| --- | --- |')
        for (const el of rows.elements) {
          const keys = unwrap(prop(unwrap(el), 'keys'))
          const keyText =
            keys && ts.isArrayLiteralExpression(keys)
              ? keys.elements.map((k) => `\`${inline(k)}\``).join(' + ')
              : inline(keys)
          out.push(
            `| ${cell(keyText)} | ${cell(clean(localized(prop(unwrap(el), 'description'))))} |`,
          )
        }
        out.push('')
        return
      }
      case 'Example': {
        const t = attr(node, 'title')
        const d = attr(node, 'description')
        const codeExpr = attr(node, 'code')
        const exTitle = t && t !== true ? clean(localized(t)) : 'Exemplo'
        out.push(`${h(level)} ${exTitle}`, '')
        if (d && d !== true) {
          const desc = clean(localized(d))
          if (desc) out.push(desc, '')
        }
        fence(codeOf(codeExpr))
        return
      }
      case 'CodeTabs': {
        const tabs = unwrap(attr(node, 'tabs'))
        if (!tabs || !ts.isArrayLiteralExpression(tabs)) return
        for (const tab of tabs.elements.map(unwrap)) {
          const label = inline(prop(tab, 'label'))
          const langNode = prop(tab, 'language')
          const code = codeOf(prop(tab, 'code'))
          const language = langNode
            ? inline(langNode)
            : /^(pnpm|npm|yarn|npx|bun) /.test(code ?? '')
              ? 'bash'
              : 'tsx'
          if (label) out.push(`**${label}**`, '')
          fence(code, language)
        }
        return
      }
      case 'Steps': {
        const items = unwrap(attr(node, 'items'))
        if (!items || !ts.isArrayLiteralExpression(items)) return
        items.elements.map(unwrap).forEach((item, i) => {
          out.push(`${h(level)} ${i + 1}. ${clean(localized(prop(item, 'title')))}`, '')
          block(prop(item, 'content'), level + 1)
        })
        return
      }
      case 'Checklist':
        return list(attr(node, 'items'), (el) => `[ ] ${localized(el)}`)
      case 'Cards':
        return list(attr(node, 'items'), (el) => {
          const t = clean(localized(prop(el, 'title')))
          const text = clean(localized(prop(el, 'text')))
          return t ? `**${t}** — ${text}` : text
        })
      case 'SubHeading': {
        const t = attr(node, 'title')
        const text = t && t !== true ? clean(localized(t)) : ''
        if (text) out.push(`${h(level)} ${text}`, '')
        return
      }
      case 'table':
        return table(node)
      case 'PropsTable':
        return // a seção Props vem do código (onProps)
      case 'Callout': {
        const t = attr(node, 'title')
        const text = clean(children.map(inline).join(''))
        const head = t && t !== true ? `**${clean(localized(t))}** ` : ''
        if (head || text) out.push(`> ${head}${text}`, '')
        return
      }
      case 'CodeBlock': {
        const lang = attr(node, 'language') ?? attr(node, 'lang')
        const language = lang && lang !== true && ts.isStringLiteral(lang) ? lang.text : 'tsx'
        const t = attr(node, 'title')
        const fileTitle = t && t !== true ? clean(inline(t)) : ''
        const code = codeOf(attr(node, 'code'))
        if (code && fileTitle) out.push(`\`${fileTitle}\`:`, '')
        fence(code, language)
        return
      }
      case 'p':
      case 'T': {
        const text = clean(
          tag === 'T' ? localized(attr(node, 'pt')) : children.map(inline).join(''),
        )
        if (text) out.push(text, '')
        return
      }
      case 'h2':
      case 'h3':
      case 'h4': {
        const text = clean(children.map(inline).join(''))
        if (text) out.push(`${h(level)} ${text}`, '')
        return
      }
      case 'ul':
      case 'ol': {
        for (const c of children) {
          if ((ts.isJsxElement(c) || ts.isJsxSelfClosingElement(c)) && tagName(c) === 'li') {
            const text = clean(ts.isJsxElement(c) ? c.children.map(inline).join('') : '')
            if (text) out.push(`- ${text}`)
          }
        }
        out.push('')
        return
      }
      default:
        // Demonstrações ao vivo e invólucros: o conteúdo de texto (se houver) está nos filhos.
        children.forEach((c) => block(c, level))
    }
  }

  // O JSX devolvido pelo componente padrão da página.
  function visit(n) {
    if (ts.isReturnStatement(n) && n.expression) {
      const expr = unwrap(n.expression)
      if (
        expr &&
        (ts.isJsxElement(expr) || ts.isJsxFragment(expr) || ts.isJsxSelfClosingElement(expr))
      ) {
        const outer = ts.isJsxElement(expr) ? tagName(expr) : ''
        if (outer === 'ComponentPage' || outer === 'DocPage' || !title) block(expr, headingLevel)
        return
      }
    }
    ts.forEachChild(n, visit)
  }
  const defaultFn = sf.statements.find(
    (s) =>
      ts.isFunctionDeclaration(s) &&
      s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) &&
      s.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword),
  )
  if (defaultFn) visit(defaultFn)
  const body = out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return { title, body }
}

// ---------------------------------------------------------------------------------------------
// Metas dos componentes
// ---------------------------------------------------------------------------------------------
async function loadMeta(file) {
  const js = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
  return mod.meta
}

const categoryLabels = {
  actions: 'Ações',
  forms: 'Formulários',
  feedback: 'Feedback',
  overlays: 'Sobreposições',
  navigation: 'Navegação',
  'data-display': 'Exibição de dados',
  layout: 'Layout',
  utilities: 'Utilitários',
}
const statusLabels = { stable: 'estável', beta: 'beta', new: 'novo', deprecated: 'depreciado' }

const componentsDir = join(docsContent, 'components')
const metas = []
for (const slug of readdirSync(componentsDir).sort()) {
  const metaFile = join(componentsDir, slug, 'meta.ts')
  if (existsSync(metaFile)) metas.push(await loadMeta(metaFile))
}
metas.sort((a, b) => a.name.localeCompare(b.name))

const files = new Map() // caminho relativo a references/ → conteúdo
const covered = new Set()

for (const meta of metas) {
  const dir = `components/${meta.sourceDir ?? meta.name}`
  covered.add(dir)
  const docs = [...(docsByDir.get(dir) ?? [])].sort((a, b) => {
    if (a.displayName === meta.name) return -1
    if (b.displayName === meta.name) return 1
    return a.displayName.localeCompare(b.displayName)
  })
  const names = docs.map((d) => d.displayName)
  const importNames = names.length ? names : [meta.name]
  const storyId =
    meta.storyId ?? `componentes-${meta.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}--docs`
  const page = pageToMarkdown(join(componentsDir, meta.slug, 'index.tsx'), {
    onProps: () =>
      [
        docs.length ? docs.map(propsMarkdown).join('\n').trim() : 'Veja a página da documentação.',
        typesMarkdown([dir]),
      ]
        .filter(Boolean)
        .join('\n\n')
        .trim(),
  })
  const header = [
    `# ${meta.name}`,
    '',
    meta.description.pt,
    '',
    `- Categoria: ${categoryLabels[meta.category] ?? meta.category} · Status: ${statusLabels[meta.status ?? 'stable']}`,
    `- Importação: \`import { ${importNames.join(', ')} } from '@orangesys/ui'\``,
    `- Documentação: ${SITE}/pt/components/${meta.slug} (em inglês: ${SITE}/en/components/${meta.slug})`,
    `- Storybook: ${SITE}/storybook/?path=/docs/${storyId}`,
    `- Código: ${REPO}/tree/main/packages/ui/src/${dir}`,
  ]
  if (meta.status === 'deprecated' && meta.deprecation) {
    const d = meta.deprecation
    header.push(
      `- **Depreciado**${d.since ? ` desde ${d.since}` : ''}${d.removal ? `, sai na ${d.removal}` : ''}${d.replacement ? `: use \`${d.replacement}\`` : ''}${d.note?.pt ? ` — ${d.note.pt}` : ''}`,
    )
  }
  files.set(`components/${meta.slug}.md`, `${header.join('\n')}\n\n${page.body}\n`)
}

// Índice de componentes
{
  const lines = [
    '# Componentes do @orangesys/ui',
    '',
    `${metas.length} componentes documentados, por categoria. Cada um tem um arquivo em \`components/<slug>.md\` com boas práticas, props (geradas do código), acessibilidade (teclado e WCAG) e exemplos que funcionam. Leia o arquivo antes de usar o componente.`,
    '',
    'Base que não está nesta lista (provider, `Field`, tipografia, `Icon`, `Portal`, utilitários): `foundations.md`. Hooks: `hooks.md`. Tokens: `tokens.md`. Ícones: `icons.md`. Telas inteiras prontas: `templates/` (sign-in, dashboard, settings). Tema, estilos, i18n e diretrizes de design: `guides/`.',
    '',
  ]
  for (const [category, label] of Object.entries(categoryLabels)) {
    const items = metas.filter((m) => m.category === category)
    if (!items.length) continue
    lines.push(`## ${label} (${items.length})`, '')
    for (const m of items) {
      const status = m.status && m.status !== 'stable' ? ` _(${statusLabels[m.status]})_` : ''
      lines.push(`- **${m.name}**${status} — ${m.description.pt} → \`components/${m.slug}.md\``)
    }
    lines.push('')
  }
  files.set('components.md', lines.join('\n'))
}

// ---------------------------------------------------------------------------------------------
// Hooks, utilitários e fundamentos
// ---------------------------------------------------------------------------------------------
function jsDocOf(symbol) {
  const text = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim()
  const examples = symbol
    .getJsDocTags(checker)
    .filter((t) => t.name === 'example')
    .map((t) => ts.displayPartsToString(t.text).trim())
  return { text, examples }
}

function signaturesOf(name, symbol) {
  const decl = symbol.valueDeclaration ?? symbol.declarations?.[0]
  if (!decl) return []
  const type = checker.getTypeOfSymbolAtLocation(symbol, decl)
  return type
    .getCallSignatures()
    .map(
      (sig) =>
        `${name}${checker.signatureToString(sig, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)}`,
    )
}

const sourceOf = (symbol) => {
  const decl = symbol.valueDeclaration ?? symbol.declarations?.[0]
  return decl ? rel(decl.getSourceFile().fileName) : ''
}

// Documentados em arquivos de componente (componentes e funções auxiliares de pastas com página).
const documentedInComponentFiles = new Set(
  [...docsByDir.entries()]
    .filter(([dir]) => covered.has(dir))
    .flatMap(([, d]) => d.map((x) => x.displayName)),
)
const baseDocs = [...docsByDir.entries()]
  .filter(([dir]) => !covered.has(dir))
  .flatMap(([, docs]) => docs)
  .filter((doc) => isComponentName(doc.displayName))
  .sort((a, b) => a.displayName.localeCompare(b.displayName))
const baseNames = new Set(baseDocs.map((d) => d.displayName))
const hookNames = [...exportedValues.keys()].filter((n) => /^use[A-Z]/.test(n)).sort()

function hookSection(name, level = '###') {
  const symbol = exportedValues.get(name)
  const { text, examples } = jsDocOf(symbol)
  const lines = [`${level} \`${name}\``, '']
  const sigs = signaturesOf(name, symbol)
  if (sigs.length) lines.push('```ts', ...sigs, '```', '')
  if (text) lines.push(text, '')
  for (const ex of examples) lines.push('```tsx', ex, '```', '')
  lines.push(`Código: \`${sourceOf(symbol)}\``, '')
  return lines
}

{
  const hooksPage = pageToMarkdown(join(docsContent, 'pages/usage/Hooks.tsx'))
  const inGuide = new Set([...hooksPage.body.matchAll(/^#+ `(use[A-Za-z]+)`$/gm)].map((m) => m[1]))
  const rest = hookNames.filter((n) => !inGuide.has(n))
  const lines = [
    '# Hooks do @orangesys/ui',
    '',
    `${hookNames.length} hooks exportados, todos seguros para SSR. Importe de \`@orangesys/ui\`.`,
    '',
    hooksPage.body,
    '',
  ]
  const hookTypes = typesMarkdown(['hooks'], { heading: '##', title: 'Tipos dos hooks' })
  if (hookTypes) lines.push(hookTypes)
  if (rest.length) {
    lines.push(
      '## Outros hooks exportados',
      '',
      'Hooks ligados a um componente ou provider (o uso completo está na referência dele).',
      '',
    )
    for (const name of rest) lines.push(...hookSection(name))
  }
  files.set(
    'hooks.md',
    `${lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()}\n`,
  )
}

{
  const lines = [
    '# Fundamentos: provider, base e utilitários',
    '',
    'Peças que não têm página própria de componente, mas são usadas em toda parte.',
    '',
    '## Componentes de base',
    '',
  ]
  for (const doc of baseDocs) lines.push(propsMarkdown(doc), `Código: \`${rel(doc.filePath)}\``, '')
  const baseDirs = [
    ...new Set(baseDocs.map((d) => rel(dirname(d.filePath)).replace(/^packages\/ui\/src\//, ''))),
  ]
  const baseTypes = typesMarkdown(['providers', 'icons', 'utils', ...baseDirs], { heading: '##' })
  if (baseTypes) lines.push(baseTypes)

  lines.push('## Utilitários e constantes', '')
  const others = [...exportedValues.keys()]
    .filter((n) => !baseNames.has(n) && !documentedInComponentFiles.has(n) && !/^use[A-Z]/.test(n))
    .filter((n) => !isComponentName(n) || !componentDocs.some((d) => d.displayName === n))
    .sort()
  for (const name of others) {
    const symbol = exportedValues.get(name)
    const { text, examples } = jsDocOf(symbol)
    const sigs = signaturesOf(name, symbol)
    lines.push(`### \`${name}\``, '')
    if (sigs.length) {
      lines.push('```ts', ...sigs, '```', '')
    }
    if (text) lines.push(text, '')
    for (const ex of examples) lines.push('```tsx', ex, '```', '')
  }
  files.set('foundations.md', `${lines.join('\n').trim()}\n`)
}

// ---------------------------------------------------------------------------------------------
// Ícones
// ---------------------------------------------------------------------------------------------
{
  const iconPaths = exportedValues.get('iconPaths')
  const type = checker.getTypeOfSymbolAtLocation(iconPaths, iconPaths.valueDeclaration)
  const names = checker
    .getPropertiesOfType(type)
    .map((p) => p.getName())
    .sort()
  const iconDoc = componentDocs.find((d) => d.displayName === 'Icon')
  const strokeDefault = iconDoc?.props.strokeWidth?.defaultValue?.value ?? '1.75'
  files.set(
    'icons.md',
    [
      '# Ícones',
      '',
      `${names.length} ícones de linha (grade 24×24, traço padrão ${strokeDefault} via \`strokeWidth\`, cor \`currentColor\`). Use \`<Icon name="…" />\`: sem \`label\` o ícone é decorativo (\`aria-hidden\`); com \`label\`, ganha nome acessível. Botão só com ícone: \`IconButton\` com \`label\` (obrigatório) ou \`Button iconOnly\` com \`aria-label\`. Props do \`Icon\` em \`foundations.md\`.`,
      '',
      '```tsx',
      "import { Icon, IconButton } from '@orangesys/ui'",
      '',
      '<Icon name="search" />',
      '<Icon name="alert" label="Atenção" />',
      '<IconButton icon="close" label="Fechar" />',
      '```',
      '',
      'Nomes disponíveis (`IconName`):',
      '',
      names.map((n) => `\`${n}\``).join(' · '),
      '',
    ].join('\n'),
  )
}

// ---------------------------------------------------------------------------------------------
// Tokens (CSS)
// ---------------------------------------------------------------------------------------------
{
  const css = readFileSync(join(root, 'packages/tokens/css/tokens.css'), 'utf8')
  const top = css.slice(0, css.indexOf('@media'))
  const blocks = new Map()
  for (const match of top.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1]
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim()
    const vars = new Map()
    for (const v of match[2].matchAll(/(--or-[a-z0-9-]+)\s*:\s*([^;]+);/g))
      vars.set(v[1], v[2].trim())
    blocks.set(selector, vars)
  }
  const base = blocks.get(':root') ?? new Map()
  const themes = {
    escuro: blocks.get(":root, [data-theme='dark']") ?? new Map(),
    claro: blocks.get("[data-theme='light']") ?? new Map(),
    'escuro alto contraste': blocks.get("[data-theme='dark-hc']") ?? new Map(),
    'claro alto contraste': blocks.get("[data-theme='light-hc']") ?? new Map(),
  }
  const semantic = [...themes.escuro.keys()]
  const lines = [
    '# Tokens de design',
    '',
    "Estilize sempre com as variáveis CSS do Orange (`var(--or-…)`), nunca com cores ou medidas fixas: assim o estilo acompanha os quatro temas (escuro, claro e os dois de alto contraste) e a escala do sistema. As variáveis vêm de `@orangesys/ui/styles.css` (ou `@orangesys/tokens/tokens.css`, se usar só os tokens). Os mesmos valores existem em JS: `import { themes, space, motion, breakpoints } from '@orangesys/tokens'`.",
    '',
    '## Cores semânticas (mudam com o tema)',
    '',
    'Use estas — não as primitivas da paleta. `*-subtle` são fundos suaves; `*-text` é o texto sobre o fundo padrão; `text-on-*` é o texto sobre o preenchimento sólido.',
    '',
    `| Variável | ${Object.keys(themes).join(' | ')} |`,
    `| --- |${Object.keys(themes)
      .map(() => ' --- |')
      .join('')}`,
  ]
  for (const name of semantic) {
    lines.push(
      `| \`${name}\` | ${Object.values(themes)
        .map((t) => `\`${cell(t.get(name) ?? '—')}\``)
        .join(' | ')} |`,
    )
  }
  lines.push('')
  const groups = new Map()
  for (const [name, value] of base) {
    if (name.startsWith('--or-palette-')) continue
    const key = name.replace(/^--or-/, '').split('-')[0]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push([name, value])
  }
  lines.push('## Escalas (iguais em todos os temas)', '')
  for (const [key, vars] of groups) {
    lines.push(`### ${key}`, '', '| Variável | Valor |', '| --- | --- |')
    for (const [name, value] of vars) lines.push(`| \`${name}\` | \`${cell(value)}\` |`)
    lines.push('')
  }
  const palette = [...base.keys()].filter((n) => n.startsWith('--or-palette-'))
  lines.push(
    '## Paleta primitiva',
    '',
    `${palette.length} cores base (\`--or-palette-<família>-<nível>\`) usadas para compor as semânticas. Não use direto em componentes: elas não mudam com o tema.`,
    '',
  )
  files.set('tokens.md', `${lines.join('\n').trim()}\n`)
}

// ---------------------------------------------------------------------------------------------
// Guias (Começando, Usando, Design Guidelines)
// ---------------------------------------------------------------------------------------------
const guides = [
  ['getting-started', 'pages/GettingStarted.tsx'],
  ['theme', 'pages/usage/Theme.tsx'],
  ['styles', 'pages/usage/Styles.tsx'],
  ['i18n', 'pages/usage/I18n.tsx'],
  ['versioning', 'pages/usage/Versioning.tsx'],
  ['accessibility', 'pages/guidelines/Accessibility.tsx'],
  ['color', 'pages/guidelines/Color.tsx'],
  ['typography', 'pages/guidelines/Typography.tsx'],
  ['grid', 'pages/guidelines/Grid.tsx'],
  ['iconography', 'pages/guidelines/Iconography.tsx'],
  ['motion', 'pages/guidelines/Motion.tsx'],
  ['data-visualization', 'pages/guidelines/DataVisualization.tsx'],
]
for (const [slug, file] of guides) {
  const page = pageToMarkdown(join(docsContent, file))
  const title = page.title ?? slug
  files.set(`guides/${slug}.md`, `# ${title}\n\n${page.body}\n`)
}

// Modelos: páginas inteiras (entrar, painel, configurações) com o código completo.
const templatesDir = join(docsContent, 'templates')
for (const slug of readdirSync(templatesDir).sort()) {
  const page = join(templatesDir, slug, 'index.tsx')
  if (slug.startsWith('_') || !existsSync(page)) continue
  const { title, body } = pageToMarkdown(page)
  files.set(
    `templates/${slug}.md`,
    `# Modelo: ${title ?? slug}\n\n- Ao vivo: ${SITE}/pt/templates/${slug}\n\n${body}\n`,
  )
}

// ---------------------------------------------------------------------------------------------
// Escrever ou conferir
// ---------------------------------------------------------------------------------------------
function listExisting(dir, prefix = '') {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? listExisting(join(dir, e.name), `${prefix}${e.name}/`)
      : [`${prefix}${e.name}`],
  )
}

const stale = []
for (const [path, content] of files) {
  const target = join(outDir, path)
  const current = existsSync(target) ? readFileSync(target, 'utf8') : null
  if (current === content) continue
  stale.push(path)
  if (!check) {
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content)
  }
}
const extra = listExisting(outDir).filter((p) => !files.has(p))
for (const path of extra) {
  stale.push(`${path} (sobra)`)
  if (!check) rmSync(join(outDir, path))
}

if (check) {
  if (stale.length) {
    console.error(
      `A referência para IAs (skills/orange-ui/references) está desatualizada em ${stale.length} arquivo(s):\n` +
        stale.map((p) => `  - ${p}`).join('\n') +
        '\nRode `pnpm gen:ai` e faça commit do resultado.',
    )
    process.exit(1)
  }
  console.log(`Referência para IAs em dia (${files.size} arquivos).`)
} else {
  console.log(
    stale.length
      ? `Referência para IAs: ${stale.length} arquivo(s) atualizado(s) de ${files.size}.`
      : `Referência para IAs já estava em dia (${files.size} arquivos).`,
  )
}
