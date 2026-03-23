import React, { useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./LineChartComponent.module.scss";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatNumberWithSuffix } from "@/lib/utils";
import { CURRENCY_SYMBOL } from "@/lib/constants";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Title
);

function calculateStepSize(max) {
  const num = max / 3;
  if (num === 0) return 0;

  const digits = Math.floor(Math.log10(num));
  const base = 10 ** digits;

  const rounded = Math.round(num / base) * base;
  return rounded;
}

const LineChartComponent = () => {
  const chartRef = useRef();
  const graphData = useSelector((state) => state.dashboard.graphData) || [];

  const { labels, dataPoints } = useMemo(() => {
    const year = new Date().getFullYear();
    const allMonths = Array.from({ length: 12 }, (_, index) =>
      new Date(year, index, 1).toLocaleDateString("default", {
        month: "short",
       
      })
    );

    const graphMap = new Map(
      graphData.map((item) => [
        new Date(item.month).toLocaleDateString("default", {
          month: "short",
         
        }),
        parseFloat(item.total),
      ])
    );

    const labels = allMonths;
    const dataPoints = allMonths.map((label) => graphMap.get(label) || 0);

    return { labels, dataPoints };
  }, [graphData]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Sales",
        data: dataPoints,
        fill: true,
        borderColor: "#157540",
        pointRadius: dataPoints.length > 1 ? 0 : 3,
        tension: 0.4,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradient.addColorStop(0, "rgba(98, 224, 140, 0.72)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          return gradient;
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "#157540", // Tooltip background
        titleColor: "#fff", // Title text color
        bodyColor: "#fff", // Main text color
        borderColor: "#157540", // Border color
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        titleFont: {
          size: 12,
          weight: "bold",
          family: "Arial",
        },
        bodyFont: {
          size: 11,
          family: "Arial",
        },
        displayColors: false, // Hide color square
        callbacks: {
          label: (context) =>
            `Sales: ${CURRENCY_SYMBOL["AE"]} ${context.parsed.y.toLocaleString()}`,
          title: (context) => `Month: ${context[0].label}`, // Custom title
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (val) => formatNumberWithSuffix(val, 0),
          color: "#aaacae",
          padding: 50,
          stepSize: calculateStepSize(Math.max(...dataPoints)),
        },
        min: 0,
        grid: {
          drawTicks: true,
          drawBorder: false,
          tickColor: "#0000",
          color: "#f0f0f0", // horizontal grid lines
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "#aaacae",
          padding: 16,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        bottom: 32,
        left: -16,
      },
    },
  };

  return (
    <div className={styles.scrollWrapper}>
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default LineChartComponent;
