"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  colors?: string[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  formatTooltip?: (value: number) => string;
}

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
];

export function PieChart({
  data,
  colors = DEFAULT_COLORS,
  height = 200,
  innerRadius = 40,
  outerRadius = 80,
  showLegend = true,
  formatTooltip,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#94a3b8" }}
          itemStyle={{ color: "#f1f5f9" }}
          formatter={(value: number) =>
            formatTooltip ? formatTooltip(value) : value.toLocaleString()
          }
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>
            )}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
