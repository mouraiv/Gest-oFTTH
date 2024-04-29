// components/BarChart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS
.register(  
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const BarChart = ({ chartData }) => {
  return (
    <div style={{width: '100%'}}>
      <h4 style={{ textAlign: "center" }}>VISÃO GERAL DE INVIÁVEIS</h4>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Equipamentos sem justificativas"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};