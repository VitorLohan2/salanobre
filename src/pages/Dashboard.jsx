// src/pages/Dashboard.jsx
// Página Principal

import { useState } from 'react';
import BoxList from '../components/BoxList';
import DateSelector from '../components/DateSelector';
import PackageChart from '../components/PackageChart';
import StatsDisplay from '../components/StatsDisplay';
import { getDataByDate } from '../services/sheetsApi';


export default function Dashboard() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDateSelect = async (date) => {
    setLoading(true);
    setError(null);
    try {
        // Garante que a data seja tratada como UTC para evitar deslocamento
        const utcDate = new Date(date);
        utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
        
        const data = await getDataByDate(utcDate);
        console.log('Dados filtrados:', {
          selectedDate: utcDate,
          filteredData: data
        });
        
        setChartData(data);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sala Nobre Registro</h1>
      <DateSelector onDateSelect={handleDateSelect} />
      
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
              <StatsDisplay data={chartData} />
              <div style={{ height: '400px', width: '100%', margin: '20px 0' }}>
                <PackageChart data={chartData} />
              </div>
              
              <BoxList data={chartData} />
            </>
          )}
        </>
      )}
    </div>
  );
}