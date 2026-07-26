import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register elements with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CustomChart = ({ dataPoints, labels, label = "Health Score", type = "line", height = 250 }) => {
  const isLine = type === "line";

  const chartData = {
    labels: labels && labels.length > 0 ? labels : ["Empty"],
    datasets: [
      {
        label: label,
        data: dataPoints && dataPoints.length > 0 ? dataPoints : [0],
        borderColor: "#10b981", // Emerald-500
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.25)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0.0)");
          return isLine ? gradient : "rgba(6, 182, 212, 0.6)"; // Cyan for bars
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#10b981",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#131b2e",
        titleFont: { family: "Outfit", size: 12, weight: "bold" },
        bodyFont: { family: "Inter", size: 12 },
        borderColor: "#1e293b",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: { family: "Inter", size: 10 },
        },
      },
      y: {
        grid: {
          color: "rgba(30, 41, 59, 0.5)",
        },
        ticks: {
          color: "#64748b",
          font: { family: "Inter", size: 10 },
          maxTicksLimit: 5,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }} className="w-full relative">
      {isLine ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default CustomChart;
