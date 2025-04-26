// src/components/StatsDisplay.jsx
// Componente de Estatísticas

export default function StatsDisplay({ data }) {
    if (!data || data.length === 0) return <p>Nenhum dado disponível</p>;
  
    // Cálculos corrigidos
    const total = data.reduce((sum, row) => sum + 1, 0); // Conta ocorrências
    const averagePerHour = total / 24;
    
    // Encontra a hora com mais ocorrências
    const hourlyCounts = Array(24).fill(0);
    data.forEach(item => {
      const hour = item.datetime?.getHours() || 0;
      hourlyCounts[hour]++;
    });
    const maxHourCount = Math.max(...hourlyCounts);
    const peakHour = hourlyCounts.indexOf(maxHourCount);
  
    return (
      <div style={{ margin: '5px 0', padding: '5px', border: '1px solid #eee', borderRadius: '5px' }}>
        <h3>Estatísticas do Dia</h3>
        <p>Total de pacotes: <strong>{total}</strong></p>
        <p>Média por hora: <strong>{averagePerHour.toFixed(1)}</strong></p>
        <p>Pico horário: <strong>{maxHourCount} pacotes às {peakHour}h</strong></p>
      </div>
    );
  }