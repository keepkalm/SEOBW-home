"use client";

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  [key: string]: string | number;
}

interface AreaChartProps {
  data: DataPoint[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  gradientId?: string;
  height?: number;
  showGrid?: boolean;
  formatTooltip?: (value: number) => string;
  formatXAxis?: (value: string) => string;
}

export function AreaChart({
  data,
  dataKey,
  xAxisKey = "date",
  color = "#3b82f6",
  gradientId = "colorValue",
  height = 200,
  showGrid = true,
  formatTooltip,
  formatXAxis,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        )}
        <XAxis
          dataKey={xAxisKey}
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatXAxis}
        />
        <YAxis
          stroke="#64748b"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={40}
        />
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
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
