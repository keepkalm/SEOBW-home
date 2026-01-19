"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DataPoint {
  [key: string]: string | number;
}

interface BarChartProps {
  data: DataPoint[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  colors?: string[];
  height?: number;
  showGrid?: boolean;
  layout?: "horizontal" | "vertical";
  formatTooltip?: (value: number) => string;
}

export function BarChart({
  data,
  dataKey,
  xAxisKey = "name",
  color = "#3b82f6",
  colors,
  height = 200,
  showGrid = true,
  layout = "horizontal",
  formatTooltip,
}: BarChartProps) {
  const isVertical = layout === "vertical";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 10, right: 10, left: isVertical ? 60 : 0, bottom: 0 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            horizontal={!isVertical}
            vertical={isVertical}
          />
        )}
        {isVertical ? (
          <>
            <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={60}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={40} />
          </>
        )}
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
          cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
        />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} fill={color}>
          {colors &&
            data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
