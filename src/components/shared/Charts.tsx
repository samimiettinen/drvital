import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { type MetricDataPoint } from '@/data/mockData';

interface SparklineProps {
  data: MetricDataPoint[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = 'hsl(172, 50%, 36%)', height = 48 }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface TrendChartProps {
  data: MetricDataPoint[];
  baseline?: number;
  color?: string;
  height?: number;
  unit?: string;
}

export function TrendChart({ data, baseline, color = 'hsl(172, 50%, 36%)', height = 180, unit = '' }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: 'hsl(210, 8%, 50%)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'hsl(210, 8%, 50%)' }}
          tickLine={false}
          axisLine={false}
          width={35}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(0, 0%, 100%)',
            border: '1px solid hsl(40, 12%, 90%)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, '']}
          labelFormatter={(label) => {
            const d = new Date(label);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        {baseline !== undefined && (
          <Line
            type="monotone"
            dataKey={() => baseline}
            stroke="hsl(210, 8%, 50%)"
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
            name="Baseline"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
