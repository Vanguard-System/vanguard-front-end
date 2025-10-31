import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 20 },
  section: { marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  bold: { fontWeight: "bold" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 8 },
  total: { marginTop: 15, fontSize: 14, fontWeight: "bold", textAlign: "right" },
})

interface HoleriteSimplificadoProps {
  dados: {
    funcionario: string
    mes: string
    ano: string
    viagens: { quantidade: number; valor: number, totalDays: number, totalRemuneration: number }
  }
}

export default function RemunerationReceipt({ dados }: HoleriteSimplificadoProps) {
  const total = dados.viagens.quantidade * dados.viagens.valor

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>HOLERITE</Text>
          <Text>{dados.mes}/{dados.ano}</Text>
        </View>

        <View style={styles.divider} />

        {/* Funcionário */}
        <View style={styles.section}>
          <Text><Text style={styles.bold}>Funcionário:</Text> {dados.funcionario}</Text>
        </View>

        <View style={styles.divider} />

        {/* Viagens */}
        <View style={styles.section}>
          <Text style={styles.bold}>Viagens</Text>
          <View style={styles.row}>
            <Text>Quantidade:</Text>
            <Text>{dados.viagens.quantidade}</Text>
          </View>
          <View style={styles.row}>
            <Text>Valor por viagem:</Text>
            <Text>R$ {dados.viagens.valor.toFixed(2)}</Text>
          </View>
        </View>


        <View style={styles.divider} />

        <View style={styles.row}>
          <Text>Dias Totais Fora:</Text>
          <Text>{dados.viagens.totalDays}</Text>
        </View>

        <View style={styles.divider} />


        <Text style={styles.total}>Remuneração Total: R$ {dados.viagens.totalRemuneration.toFixed(2)}</Text>
      </Page>
    </Document>
  )
}
