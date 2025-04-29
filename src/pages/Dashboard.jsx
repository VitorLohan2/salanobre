// src/pages/Dashboard.jsx
// Página Principal

import { useState, useRef, useEffect } from 'react';
import BoxList from '../components/BoxList';
import DateSelector from '../components/DateSelector';
import PackageChart from '../components/PackageChart';
import StatsDisplay from '../components/StatsDisplay';
import { getDataByDate } from '../services/sheetsApi';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFGenerator from '../components/PDFGenerator';
import * as XLSX from 'xlsx';

export default function Dashboard() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const chartRef = useRef(null);
  const pollingInterval = useRef(null);

  const fetchData = async (date) => {
    if (!date) return;
    
    setLoading(true);
    setError(null);
    try {
      const utcDate = new Date(date);
      utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
      
      const data = await getDataByDate(utcDate);
      
      // Atualiza apenas se os dados mudaram
      setChartData(prev => {
        const newData = JSON.stringify(data);
        const oldData = prev ? JSON.stringify(prev) : null;
        return newData !== oldData ? data : prev;
      });
      
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    // Cancela o polling anterior
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    
    // Busca imediata
    fetchData(date);
    
    // Configura polling a cada 30 segundos (ajuste conforme necessidade)
    pollingInterval.current = setInterval(() => {
      fetchData(date);
    }, 30000);
  };

  const exportToExcel = () => {
    if (!chartData) return;
    
    const worksheet = XLSX.utils.json_to_sheet(chartData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `relatorio_pacotes_${dateStr}.xlsx`);
  };

  // Limpa o intervalo ao desmontar o componente
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sala Nobre Registro</h1>
      <DateSelector onDateSelect={handleDateSelect} />
      
      {lastUpdate && (
        <div style={{ fontSize: '0.8em', color: '#666', margin: '5px 0' }}>
          Última atualização: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
      
      {loading && <p>Carregando dados...</p>}
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Erro: {error}
        </div>
      )}
      
      {chartData && (
        <>
          {chartData.length === 0 ? (
            <p style={{ margin: '20px 0' }}>
              Nenhum registro encontrado para a data selecionada
            </p>
          ) : (
            <>
              <StatsDisplay 
                data={chartData} 
                key={lastUpdate ? lastUpdate.getTime() : 'initial'}
              />
              <div style={{ height: '400px', width: '100%', margin: '20px 0' }}>
                <PackageChart data={chartData} ref={chartRef} />
              </div>
              <BoxList data={chartData} />

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                  onClick={exportToExcel}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#217345',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Exportar para Excel
                </button>
                
                <PDFDownloadLink
                  document={<PDFGenerator data={chartData} />}
                  fileName={`relatorio_pacotes_${new Date().toISOString().slice(0,10)}.pdf`}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#d33f3f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'none'
                  }}
                >
                  {({ loading }) => (
                    loading ? 'Preparando PDF...' : 'Exportar para PDF'
                  )}
                </PDFDownloadLink>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}