import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CryptoChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Generate random chart data for demo
  const generateChartData = () => {
    const points = [];
    let y = 50;
    
    for (let i = 0; i < 12; i++) {
      y = Math.max(10, Math.min(90, y + (Math.random() * 30 - 15)));
      points.push({ x: i * 25, y });
    }
    
    return points;
  };
  
  const chartData = generateChartData();
  
  // Generate SVG path from points
  const generatePath = (points: Array<{ x: number, y: number }>) => {
    return points.map((point, i) => {
      return `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`;
    }).join(" ");
  };
  
  // Generate smooth curve path
  const generateSmoothPath = (points: Array<{ x: number, y: number }>) => {
    if (points.length < 2) return "";
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const x1 = points[i].x;
      const y1 = points[i].y;
      const x2 = points[i + 1].x;
      const y2 = points[i + 1].y;
      
      const cpx1 = x1 + (x2 - x1) / 3;
      const cpy1 = y1;
      const cpx2 = x1 + 2 * (x2 - x1) / 3;
      const cpy2 = y2;
      
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
    }
    
    return path;
  };
  
  const linePath = generateSmoothPath(chartData);
  
  // Generate area path (line path + path to bottom)
  const generateAreaPath = (points: Array<{ x: number, y: number }>, height: number) => {
    const linePath = generateSmoothPath(points);
    return `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  };
  
  const areaPath = generateAreaPath(chartData, 100);
  
  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d={linePath}
        className="chart-line"
      />
      
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        d={areaPath}
        className="chart-area"
      />
      
      {chartData.map((point, index) => (
        <motion.circle
          key={index}
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: 3, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
          cx={point.x}
          cy={point.y}
          className="chart-dot"
        />
      ))}
    </svg>
  );
};

export default CryptoChart;
