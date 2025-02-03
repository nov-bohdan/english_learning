import { LineChart } from "@mui/x-charts/LineChart";
import { DateTime } from "luxon";

const getLast7Days = () => {
  const today = DateTime.now();
  const days = [];
  for (let i = 6; i > 0; i--) {
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
  const last7Days = getLast7Days();
  last7Days.forEach((day, index) => {
    const dayExistsInData = data.find((dateItem) => dateItem.date === day);
    if (!dayExistsInData) {
      data.splice(index, 0, { date: day, count: 0 });
    }
  });

  return (
    <LineChart
      xAxis={[
        {
          data: last7Days,
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
