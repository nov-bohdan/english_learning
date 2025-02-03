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
  seriesDataKey,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [key: string]: any }[];
  label: string;
  xAxisDataKey: string;
  seriesDataKey: string;
}) {
  // console.log(data);
  const DAYS_TO_SHOW = 14;
  const lastXDays = getLastXDays(DAYS_TO_SHOW);
  lastXDays.forEach((day, index) => {
    const dayExistsInData = data.find((dateItem) => dateItem.date === day);
    if (!dayExistsInData) {
      data.splice(index, 0, { date: day, count: 0 });
    }
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
          data: data.map((dataItem) => dataItem[seriesDataKey]),
          color: "#fdb462",
          area: true,
          baseline: 0,
        },
      ]}
      width={400}
      height={200}
    />
  );
}
