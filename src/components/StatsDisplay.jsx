// src/components/StatsDisplay.jsx
// Componente de Estatísticas

export default function StatsDisplay({ data }) {
  if (!data || data.length === 0) return <p>Nenhum dado disponível</p>;

  const total = data.length;

  // Contagem por hora
  const hourlyCounts = {};
  data.forEach(item => {
    const hour = item.datetime?.getHours();
    if (hour !== undefined) {
      hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    }
  });

  const hoursWithActivity = Object.keys(hourlyCounts).length;
  const averagePerHour = hoursWithActivity > 0 ? total / hoursWithActivity : 0;

  const maxHourCount = Math.max(...Object.values(hourlyCounts));
  const minHourCount = Math.min(...Object.values(hourlyCounts));

  const peakHour = parseInt(
    Object.keys(hourlyCounts).find(hour => hourlyCounts[hour] === maxHourCount)
  );
  const lowHour = parseInt(
    Object.keys(hourlyCounts).find(hour => hourlyCounts[hour] === minHourCount)
  );

  return (
    <div style={{ margin: '5px 0', padding: '5px', border: '1px solid #eee', borderRadius: '5px' }}>
      <h3>Estatísticas do Dia</h3>
      <p>Total de pacotes: <strong>{total}</strong></p>
      <p>Média por hora: <strong>{averagePerHour.toFixed(1)}</strong></p>
      <p>Pico horário: <strong style={{ color: 'green' }}>{maxHourCount} pacotes às {peakHour}h</strong></p>
      <p>Menor movimentação: <strong style={{ color: 'gray' }}>{minHourCount} pacotes às {lowHour}h</strong></p>
    </div>
  );
}
