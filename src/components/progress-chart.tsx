'use client';

import { WithId } from '@/firebase';
import { StressAssessment } from '@/app/schema';
import { format } from 'date-fns';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type ProgressChartProps = {
  assessments: WithId<StressAssessment>[];
};

const chartConfig = {
  stressLevel: {
    label: 'Stress Level',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function ProgressChart({ assessments }: ProgressChartProps) {
  const chartData = assessments
    .map((a) => ({
      date: a.assessmentDate,
      stressLevel: a.stressLevel,
    }))
    .reverse();

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), 'MMM d')}
            
          />
          <YAxis domain={[0, 10]} />
          <Tooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="stressLevel"
            stroke={chartConfig.stressLevel.color}
            fillOpacity={0.4}
            fill={chartConfig.stressLevel.color}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
