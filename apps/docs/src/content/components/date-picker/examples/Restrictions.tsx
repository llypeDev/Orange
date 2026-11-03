import { DatePicker } from '@orange/ui'

const hoje = new Date()
const limite = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 60)
// feriados no formato mês-dia
const feriados = ['11-15', '11-20', '12-25', '01-01']

const ehFeriado = (data: Date) =>
  feriados.includes(
    `${data.getMonth() + 1}`.padStart(2, '0') + '-' + `${data.getDate()}`.padStart(2, '0'),
  )
const ehFimDeSemana = (data: Date) => data.getDay() === 0 || data.getDay() === 6

export default function Restrictions() {
  return (
    <DatePicker
      label="Agendar visita técnica"
      description="Dias úteis nos próximos 60 dias, exceto feriados."
      min={hoje}
      max={limite}
      isDateDisabled={(data) => ehFimDeSemana(data) || ehFeriado(data)}
      weekStartsOn={1}
    />
  )
}
