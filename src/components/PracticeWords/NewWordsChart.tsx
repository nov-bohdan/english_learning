import { LineChart } from "@mui/x-charts/LineChart";
import { DateTime } from "luxon";

const getLastXDays = (daysToShow: number) => {
  const today = DateTime.now();
  const days = [];
  for (let i = daysToShow - 1; i > 0; i--) {
    days.push(today.minus({ days: i }).toFormat("yyyy-MM-dd"));
  }
  days.push(today.toFormat("yyyy-MM-dd"));
  return days;
};

export default function NewWordsChart({
  data,
  label,
  xAxisDataKey,
  seriesDataKey,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any }[];
  label: string;
  xAxisDataKey: string;
  seriesDataKey: string;
}) {
  const DAYS_TO_SHOW = 14;
  const lastXDays = getLastXDays(DAYS_TO_SHOW);

  // Build a new array that ensures each day has an entry
  const chartData = lastXDays.map((day) => {
    const found = data.find((item) => item[xAxisDataKey] === day);
    return found || { [xAxisDataKey]: day, [seriesDataKey]: 0 };
  });

  return (
    <LineChart
      xAxis={[
        {
          data: lastXDays,
          scaleType: "point",
          label: label,
          disableLine: true,
        },
      ]}
      series={[
        {
          data: chartData.map((item) => item[seriesDataKey]),
          color: "#fdb462",
          area: true,
          baseline: 0,
        },
      ]}
      width={300}
      height={200}
    />
  );
}
