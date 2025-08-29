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
    passageiro: string
    documento: string
    origem: string
    destino: string
    dia: string
    hora: string
    preco: number
  }
}

export default function BudgetReceipt({ dados }: ViagemProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>COMPROVANTE DE VIAGEM</Text>
          <Text>{dados.dia} às {dados.hora}</Text>
        </View>

        <View style={styles.divider} />

        {/* Passageiro */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Passageiro:</Text>
            <Text>{dados.passageiro}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Documento:</Text>
            <Text>{dados.documento}</Text>
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
            <Text style={styles.label}>Dia:</Text>
            <Text>{dados.dia}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Hora:</Text>
            <Text>{dados.hora}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Preço */}
        <Text style={styles.total}>Valor Total: R$ {dados.preco.toFixed(2)}</Text>
      </Page>
    </Document>
  )
}
