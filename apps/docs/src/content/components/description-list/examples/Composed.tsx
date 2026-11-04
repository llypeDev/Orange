import { DescriptionDetails, DescriptionGroup, DescriptionList, DescriptionTerm } from '@orange/ui'

export default function Composed() {
  return (
    <DescriptionList termVariant="strong" termWidth="10rem" divided={false} size="sm" style={{ width: '100%', maxWidth: 520 }}>
      <DescriptionGroup>
        <DescriptionTerm>Instância</DescriptionTerm>
        <DescriptionDetails>
          <code>api-producao-01</code>
        </DescriptionDetails>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Região</DescriptionTerm>
        <DescriptionDetails>São Paulo (sa-east-1)</DescriptionDetails>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Recursos</DescriptionTerm>
        <DescriptionDetails>4 vCPUs</DescriptionDetails>
        <DescriptionDetails>16 GB de memória</DescriptionDetails>
      </DescriptionGroup>
      <DescriptionGroup>
        <DescriptionTerm>Último deploy</DescriptionTerm>
        <DescriptionDetails>3 de novembro, 14:05</DescriptionDetails>
      </DescriptionGroup>
    </DescriptionList>
  )
}
