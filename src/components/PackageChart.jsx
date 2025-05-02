// src/components/PackageChart.jsx
// Componente de Gráfico (usando Chart.js) - npm install chart.js

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function PackageChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const hourlyCounts = Array(24).fill(0);
    data.forEach(item => {
      const hour = item.hour;
      hourlyCounts[hour] += 1;
    });

    const lineData = hourlyCounts.map(value => (value === 0 ? null : value));

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`),
        datasets: [
          {
            label: 'Pacotes por hora',
            data: hourlyCounts,
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
            order: 1,
            type: 'bar'
          },
          {
            label: 'Tendência por hora',
            data: lineData,
            borderColor: 'rgba(236, 72, 153, 1)',
            backgroundColor: 'rgba(236, 72, 153, 0.3)',
            borderWidth: 2,
            pointRadius: 1, // Remove os pontos
            pointHoverRadius: 0,
            fill: false,
            tension: 0.4,
            spanGaps: true, // Não conecta gaps
            order: 0,
            type: 'line'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribuição de Pacotes por Hora',
            font: { size: 18 }
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade de Pacotes'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Hora do Dia'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}
