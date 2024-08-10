import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart"
import { SummarizedData } from "../../utils/types/dasboardTypes";

type LineChartComponentProps = {
    Data: SummarizedData,
    label: string,
    title: string
}

function formatNumber(value: number): string {
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + "M";
    } else if (value >= 1_000) {
        return (value / 1_000).toFixed(1) + "k";
    } else {
        return value.toString();
    }
}
  
function LineChartComponent({Data, label, title} : LineChartComponentProps) {
    const chartData = Data.dailyData.map((value) => {
        const { year, month, day } = value._id;
    
        const date = new Date(year, month - 1, day);
    
        const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
    
        return {
          day: dayLabel,
          [label]: value.total,
        };
      });
        
    const chartConfig = {
        desktop: {
            label,
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    return (
        <Card className="border-none">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Last 7 Days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-3">
                    <div className="w-full max-w-[100px] overflow-x-hidden">
                        <h1 className="font-semibold text-3xl">{formatNumber(Data.total)}</h1>
                    </div>
                    <div className="w-full">
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Line
                                    dataKey={label}
                                    type="natural"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    <span className={`flex gap-2 ${Data.percentageChange > 0 && 'text-green-600'}`}>{Data.percentageChange}% {Data.percentageChange > 0 && <TrendingUp className="h-4 w-4" />}</span> in last 7 days
                </div>
            </CardFooter>
        </Card>
    )
}

export default LineChartComponent;
