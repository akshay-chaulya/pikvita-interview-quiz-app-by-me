import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const ResultsChart = ({ score }: { score: number }) => {
  const data = [{ name: "Quiz Score", score, maximum: 100 }];
  return (
    <div className="w-full h-64 mt-4 flex justify-center">
      <BarChart width={350} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Bar dataKey="score" fill="#1890ff" />
      </BarChart>
    </div>
  );
};

export default ResultsChart;
