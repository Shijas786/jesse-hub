'use client';

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface MiniLineChartProps<T extends { timestamp: string; value: number }> {
    data: T[];
    color?: string;
}

const tooltipStyle = {
    background: '#0a0a0a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '8px 12px',
};

export function MiniLineChart<T extends { timestamp: string; value: number }>({
    data,
    color = '#00f0ff',
}: MiniLineChartProps<T>) {
    return (
        <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="timestamp" hide />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={tooltipStyle}
                        formatter={(value: number) => value.toFixed(2)}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#neonGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

