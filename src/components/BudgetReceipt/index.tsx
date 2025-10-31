import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 25 },
  section: { marginBottom: 15 },
  label: { fontWeight: "bold", marginRight: 5 },
  infoRow: { flexDirection: "row", marginBottom: 5 },
  total: { marginTop: 20, fontSize: 14, fontWeight: "bold", textAlign: "center" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 10 },
})

interface ViagemProps {
  dados: {
    cliente: string
    origem: string
    destino: string
    data_hora_viagem: string
    date_hour_return_trip: string
    preco_viagem: number
    distancia_total: number
  }
}

export default function BudgetReceipt({ dados }: ViagemProps) {
  const formatDateTime = (dateStr: string) => {
    const dt = new Date(dateStr)
    return dt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>COMPROVANTE DE VIAGEM</Text>
          <Text>Ida: {formatDateTime(dados.data_hora_viagem)}</Text>
          <Text>Retorno: {formatDateTime(dados.date_hour_return_trip)}</Text>
        </View>

        <View style={styles.divider} />

        {/* Passageiro */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cliente:</Text>
            <Text>{dados.cliente}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Distância Total:</Text>
            <Text>{dados.distancia_total} km</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Viagem */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Origem:</Text>
            <Text>{dados.origem}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Destino:</Text>
            <Text>{dados.destino}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data/Horário Ida:</Text>
            <Text>{formatDateTime(dados.data_hora_viagem)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Data/Horário Retorno:</Text>
            <Text>{formatDateTime(dados.date_hour_return_trip)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Preço */}
        <Text style={styles.total}>Valor Total: R$ {dados.preco_viagem.toFixed(2)}</Text>
      </Page>
    </Document>
  )
}
