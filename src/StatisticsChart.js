// src/StatisticsChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function StatisticsChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Zaman (saniye)",
        data: data.map((d) => d.time),
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ background: "#fff", padding: "1rem", borderRadius: "12px", marginTop: "2rem" }}>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>📊 Günlük İstatistik</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}
