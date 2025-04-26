// src/components/PackageChart.jsx
// Componente de Gráfico (usando Chart.js) - npm install chart.js

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function PackageChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
  
    useEffect(() => {
      console.log('Dados recebidos pelo gráfico:', data); // Adicione este log
      
      if (data && data.length > 0) {
        // Agrupar dados por hora
        const hourlyCounts = Array(24).fill(0);
        
        data.forEach(item => {
          const hour = item.hour;
          hourlyCounts[hour] += 1; // Conta ocorrências por hora
        });
  
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
  
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Array.from({length: 24}, (_, i) => `${i}h`),
            datasets: [{
              label: 'Pacotes por hora',
              data: hourlyCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
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
      }
  
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [data]);
  
    return <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}