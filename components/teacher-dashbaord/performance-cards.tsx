"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Mock data for Competency by PD Module
const competencyData = [
  { module: "AI in Teaching", score: 40 },
  { module: "ToC Module", score: 90 },
  { module: "Classroom Management", score: 75 },
  { module: "Differentiated Learning", score: 68 },
  { module: "Assessment Strategies", score: 82 },
  { module: "Student Engagement", score: 71 },
];

// Mock data for Performance Score Growth
const performanceData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Apr", score: 70 },
  { month: "May", score: 75 },
  { month: "Jun", score: 78 },
  { month: "Jul", score: 80 },
  { month: "Aug", score: 82 },
  { month: "Sep", score: 85 },
  { month: "Oct", score: 84 },
  { month: "Nov", score: 87 },
  { month: "Dec", score: 90 },
];

const competencyConfig = {
  competency: {
    label: "Competency Score",
    color: "#f97316", // Orange color
  },
} satisfies ChartConfig;

const performanceConfig = {
  score: {
    label: "Performance Score",
    color: "#f97316", // Orange color
  },
} satisfies ChartConfig;

const PerformanceCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Competency by PD Module Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Competency</CardTitle>
          <CardDescription>
            Your competency scores across different PD modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={competencyConfig} className="h-[300px] w-full">
            <BarChart data={competencyData} layout="vertical" barSize={30}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="module"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={120}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) => [`${value}%`, "Score"]}
                  />
                }
              />
              <Bar
                dataKey="score"
                fill="var(--color-competency)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance Score Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Score Growth</CardTitle>
          <CardDescription>
            Your performance score trend over the past year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={performanceConfig}
            className="h-[300px] w-full"
          >
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-score)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-score)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => `${value}`}
                  />
                }
              />
              <Area
                dataKey="score"
                type="monotone"
                fill="url(#fillScore)"
                stroke="var(--color-score)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceCards;
