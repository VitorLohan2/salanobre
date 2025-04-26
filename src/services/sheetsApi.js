// src/services/sheetsApi.js

const API_KEY = 'AIzaSyCbPfActt7hnwUiwIsZG62ZwXOUZ_GXTwE'; // Chave
const SPREADSHEET_ID = '1ge9v1lwb3RvgQ0wQ9VyPE-m7TQDF5xUp2AI9dEJJDDU'; // URL da planilha
const SHEET_NAME = 'Dados'; // Nome da aba da planilha
//const RANGE = 'Planilha1!A:D'; // Ajuste para seu intervalo

// Função melhorada para tratamento de datas
function parseBrazilianDateTime(datetimeStr) {
    if (!datetimeStr) return null;
    
    try {
      // Formato esperado: "DD/MM/AAAA HH:MM:SS"
      const [datePart, timePart] = datetimeStr.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes, seconds] = timePart.split(':');
      
      return new Date(year, month-1, day, hours, minutes, seconds);
    } catch (error) {
      console.error('Erro ao parsear data:', datetimeStr, error);
      return null;
    }
  }
  
  // Função principal para buscar dados com tratamento robusto
  export async function getSheetData() {
    try {
      console.log('Iniciando busca de dados...');
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}\n` +
          `Detalhes: ${JSON.stringify(errorData)}`
        );
      }
      
      const data = await response.json();
      
      if (!data.values || !Array.isArray(data.values)) {
        throw new Error('Estrutura de dados inválida retornada pela API');
      }
      
      console.log('Dados brutos recebidos:', data.values.slice(0, 3)); // Log parcial para debug
      
      // Processamento dos dados
      const hasHeader = data.values[0][0].includes('Carimbo');
      const rows = hasHeader ? data.values.slice(1) : data.values;
      
      const processedData = rows.map((row, index) => {
        try {
          return {
            originalIndex: index + (hasHeader ? 2 : 1), // Linha na planilha
            timestamp: row[0],
            boxNumber: row[1],
            date: row[0]?.split(' ')[0] || '', // DD/MM/AAAA
            time: row[0]?.split(' ')[1] || '', // HH:MM:SS
            hour: parseInt(row[0]?.split(' ')[1]?.split(':')[0]) || 0,
            datetime: parseBrazilianDateTime(row[0])
          };
        } catch (error) {
          console.error(`Erro ao processar linha ${index}:`, row, error);
          return null;
        }
      }).filter(item => item !== null); // Remove linhas com erro
      
      if (processedData.length === 0) {
        console.warn('Nenhum dado válido encontrado após processamento');
      }
      
      return processedData;
    } catch (error) {
      console.error('Falha ao buscar dados:', error);
      throw new Error(`Não foi possível carregar os dados: ${error.message}`);
    }
  }
  
  // Função de filtro por data com tratamento melhorado
  export async function getDataByDate(date) {
    try {
      if (!date) {
        throw new Error('Nenhuma data fornecida para filtro');
      }
      
      const allData = await getSheetData();
      const targetDate = new Date(date);
      
      if (isNaN(targetDate.getTime())) {
        throw new Error('Data inválida fornecida');
      }
      
      const targetDateFormatted = targetDate.toLocaleDateString('pt-BR');
      
      const filteredData = allData.filter(item => {
        return item.date === targetDateFormatted;
      });
      
      console.log(`Filtro por data: ${targetDateFormatted}`, {
        totalRegistros: allData.length,
        registrosFiltrados: filteredData.length
      });
      
      return filteredData;
    } catch (error) {
      console.error('Erro no filtro por data:', error);
      throw error;
    }
  }
  
  // Função de debug aprimorada
  export async function debugSheetConnection() {
    try {
      console.group('Debug - Conexão com Google Sheets');
      
      // Teste de conexão básica
      console.log('Testando conexão com API...');
      const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:B1?key=${API_KEY}`;
      console.log('URL de teste:', testUrl);
      
      const testResponse = await fetch(testUrl);
      console.log('Status da resposta:', testResponse.status);
      
      if (!testResponse.ok) {
        const errorData = await testResponse.json();
        console.error('Erro na resposta:', errorData);
        throw new Error('Falha na conexão com a API');
      }
      
      // Teste com dados reais
      console.log('Obtendo 5 primeiros registros...');
      const sampleData = await getSheetData();
      console.log('Amostra de dados:', sampleData.slice(0, 5));
      
      console.groupEnd();
      return { success: true, sampleData: sampleData.slice(0, 5) };
    } catch (error) {
      console.groupEnd();
      console.error('Falha no teste de conexão:', error);
      return { success: false, error: error.message };
    }
  }