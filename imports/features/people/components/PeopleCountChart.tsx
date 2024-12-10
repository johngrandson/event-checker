import * as React from 'react';

import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '/components/ui/chart';
import { CheckedInData } from '/imports/features/people/schemas';
import { UsersRoundIcon } from 'lucide-react';

interface Options {
  first: { label: string; total: string | null };
  second: { label: string; total: string | null };
  third: { label: string; total: string | null };
}

const optionsConfig = {
  totalCheckedIn: {
    label: 'Total people checked in',
    total: 'N/A',
  },
  first: {
    label: 'People in the event right now',
    total: 'N/A',
  },
  second: {
    label: 'People by company in the event right now',
    total: 'N/A',
  },
  third: {
    label: 'People not checked in',
    total: 'N/A',
  },
};

export function PeopleCountChart({
  total = 'N/A',
  notChecked = 'N/A',
  chartData = [],
  eventSelected = false,
}: {
  total: string | null;
  notChecked: string | null;
  chartData: CheckedInData[];
  eventSelected: boolean;
}) {
  const [activeChart] = React.useState<keyof typeof optionsConfig>('second');

  const setCounts = (options: Options) => {
    options.first.total = total;
    options.second.total = chartData.length.toString();
    options.third.total = notChecked;
  };
  setCounts(optionsConfig);

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-2xl">Event Summary</CardTitle>
        </div>
        <div className="flex w-[70%]">
          {['first', 'second', 'third'].map((key) => {
            const chart = key as keyof typeof optionsConfig;
            return (
              <div
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              >
                <span className="text-xl text-muted-foreground">
                  {optionsConfig[chart].label}
                </span>
                <div className="flex items-center space-x-2 text-lg font-bold leading-none sm:text-3xl">
                  <UsersRoundIcon className="h-9 w-9" />
                  <span>{optionsConfig[chart].total || 'N/A'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardHeader>
      {eventSelected && chartData.length > 0 && (
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={optionsConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="companyName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="totalCheckedIn"
                    labelFormatter={(value) => `Company: ${value}`}
                  />
                }
              />
              <Bar
                dataKey="totalCheckedIn"
                fill={`var(--color-${activeChart})`}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
