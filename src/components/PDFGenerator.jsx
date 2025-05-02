// src/components/PDFGenerator.jsx

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
 
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  container: {
    flexDirection: 'column',
    gap: 10,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  box: {
    padding: 10,
    borderBottom: '1px solid #ccc',
  },
  row: {
    marginBottom: 5,
  },
});
 
 export default function PDFGenerator({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={styles.header}>Relatório de Pacotes</Text>
          {data.map((item, index) => (
            <View key={index} style={styles.box}>
              <Text style={styles.row}><Text style={{ fontWeight: 'bold' }}>Código:</Text> {item.codigo}</Text>
              <Text style={styles.row}><Text style={{ fontWeight: 'bold' }}>Descrição:</Text> {item.descricao}</Text>
              <Text style={styles.row}><Text style={{ fontWeight: 'bold' }}>Local:</Text> {item.local}</Text>
              <Text style={styles.row}><Text style={{ fontWeight: 'bold' }}>Data:</Text> {item.data}</Text>
              <Text style={styles.row}><Text style={{ fontWeight: 'bold' }}>Responsável:</Text> {item.responsavel}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}