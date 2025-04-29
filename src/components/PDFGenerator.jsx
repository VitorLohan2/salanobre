import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
 
 const styles = StyleSheet.create({
   page: { 
     padding: 30, 
     fontFamily: 'Helvetica',
     fontSize: 12
   },
   header: { 
     fontSize: 18, 
     marginBottom: 20, 
     textAlign: 'center', 
     fontWeight: 'bold',
     color: '#2c6e49'
   },
   table: { 
     display: "table", 
     width: "100%", 
     borderStyle: "solid",
     borderWidth: 1,
     borderColor: '#dddddd'
   },
   tableRow: { 
     flexDirection: "row" 
   },
   tableColHeader: { 
     width: "50%", 
     borderStyle: "solid", 
     borderWidth: 1,
     padding: 5, 
     backgroundColor: '#2c6e49',
     color: 'white',
     fontWeight: 'bold',
     fontSize: 10,
     textAlign: 'center'
   },
   tableCol: { 
     width: "50%", 
     borderStyle: "solid", 
     borderWidth: 1,
     padding: 5,
     fontSize: 9,
     textAlign: 'center'
   },
   footer: {
     position: 'absolute',
     bottom: 20,
     left: 0,
     right: 0,
     textAlign: 'center',
     fontSize: 10,
     color: '#666666'
   }
 });
 
 const PDFGenerator = ({ data = [] }) => {
   // Calcula o total de pacotes
   const totalPacotes = data.reduce((sum, item) => sum + (item.quantidade || 0), 0);
 
   return (
     <Document>
       <Page size="A4" style={styles.page}>
         <Text style={styles.header}>Relatório de Pacotes por Hora - Sala Nobre</Text>
         <Text style={{ marginBottom: 15 }}>
           Data do relatório: {new Date().toLocaleDateString('pt-BR')}
         </Text>
         <Text style={{ marginBottom: 15 }}>
           Total de pacotes: {totalPacotes}
         </Text>
         
         <View style={styles.table}>
           {/* Cabeçalho */}
           <View style={styles.tableRow}>
             <Text style={styles.tableColHeader}>Hora</Text>
             <Text style={styles.tableColHeader}>Quantidade de Pacotes</Text>
           </View>
           
           {/* Dados */}
           {data.map((item, index) => (
             <View key={index} style={styles.tableRow}>
               <Text style={styles.tableCol}>{item.hora || '-'}</Text>
               <Text style={styles.tableCol}>{item.quantidade || '0'}</Text>
             </View>
           ))}
         </View>
         
         <Text style={styles.footer}>
           Gerado em {new Date().toLocaleString('pt-BR')} | Sistema Sala Nobre
         </Text>
       </Page>
     </Document>
   );
 };
 
 export default PDFGenerator;