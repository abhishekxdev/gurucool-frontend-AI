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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Mock data for Assessments Completed
const assessmentsData = [
  { month: "Jan", completed: 12 },
  { month: "Feb", completed: 18 },
  { month: "Mar", completed: 25 },
  { month: "Apr", completed: 32 },
  { month: "May", completed: 45 },
  { month: "Jun", completed: 58 },
  { month: "Jul", completed: 72 },
  { month: "Aug", completed: 89 },
  { month: "Sep", completed: 105 },
  { month: "Oct", completed: 128 },
  { month: "Nov", completed: 156 },
  { month: "Dec", completed: 185 },
];

// Mock data for Teacher Count Growth
const teacherCountData = [
  { month: "Jan", count: 120 },
  { month: "Feb", count: 122 },
  { month: "Mar", count: 125 },
  { month: "Apr", count: 128 },
  { month: "May", count: 132 },
  { month: "Jun", count: 135 },
  { month: "Jul", count: 138 },
  { month: "Aug", count: 142 },
  { month: "Sep", count: 145 },
  { month: "Oct", count: 147 },
  { month: "Nov", count: 149 },
  { month: "Dec", count: 150 },
];

const assessmentsConfig = {
  completed: {
    label: "Assessments Completed",
    color: "#f97316", // Orange color
  },
} satisfies ChartConfig;

const teacherCountConfig = {
  count: {
    label: "Teacher Count",
    color: "#f97316", // Orange color
  },
} satisfies ChartConfig;

const DataCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Assessments Completed Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Assessments Completed</CardTitle>
          <CardDescription>
            Total assessments completed by teachers over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={assessmentsConfig} className="h-[300px] w-full">
            <AreaChart data={assessmentsData}>
              <defs>
                <linearGradient id="fillAssessments" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-completed)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-completed)"
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
                dataKey="completed"
                type="monotone"
                fill="url(#fillAssessments)"
                stroke="var(--color-completed)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Teacher Count Increase Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Count Growth</CardTitle>
          <CardDescription>
            Teacher headcount increase over the past year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={teacherCountConfig}
            className="h-[300px] w-full"
          >
            <AreaChart data={teacherCountData}>
              <defs>
                <linearGradient id="fillTeachers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
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
                domain={[110, 160]}
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
                dataKey="count"
                type="monotone"
                fill="url(#fillTeachers)"
                stroke="var(--color-count)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCards;