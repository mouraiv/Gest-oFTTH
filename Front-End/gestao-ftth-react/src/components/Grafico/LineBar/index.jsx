import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineChart = ({ chartData }) => {
    return (
      <div style={{width: '100%'}}>
        <h4 style={{ textAlign: "center" }}>REGIÕES</h4>
        <Line
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