import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Line,
    CartesianGrid
} from 'recharts';

// Utility functions
const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date();

    for (let i = -7; i <= 0; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        data.push({
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 20) + 5,
            movingAverage: Math.floor(Math.random() * 18) + 7
        });
    }
    return data;
};

const formatXAxis = (date) => {
    const [year, month, day] = date.split('-');
    return `${month}/${day}`;
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="font-semibold">{payload[0].payload.date}</p>
                <p className="text-blue-600">Presentations: {payload[0].value}</p>
                <p className="text-purple-600">7-day Avg: {payload[0].payload.movingAverage}</p>
            </div>
        );
    }
    return null;
};

const PresentationsBarChart = () => {
    const chartData = generateTimeSeriesData();

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.2} />
                    </linearGradient>
                </defs>

                <XAxis
                    dataKey="date"
                    tick={{ fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={formatXAxis}
                />

                <YAxis
                    tick={{ fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={value => `${value}`}
                />

                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: '#e5e7eb', opacity: 0.5 }}
                />

                <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                    animationBegin={100}
                />

                <Line
                    type="monotone"
                    dataKey="movingAverage"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={false}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default PresentationsBarChart;