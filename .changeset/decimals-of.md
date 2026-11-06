---
'@orangesys/ui': patch
---

`NumberField`: um passo em notação exponencial com casas na mantissa (ex.: `step={1.5e-7}`) era arredondado para 7 casas e virava `0.0000002`; agora as casas da mantissa somam ao expoente e o passo é exato. Por dentro, a contagem de casas decimais e o arredondamento passam a ser um utilitário interno único, usado por `NumberField`, `Slider` e pelos eixos dos gráficos.
