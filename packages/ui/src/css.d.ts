// O TypeScript 6 confere imports só de efeito (`noUncheckedSideEffectImports`, ligado por padrão).
// Os `import './X.css'` dos componentes são resolvidos pelo Vite no build e nos testes; isto diz
// ao TypeScript que eles existem. Arquivo .d.ts de entrada: não vai para o dist.
declare module '*.css'
