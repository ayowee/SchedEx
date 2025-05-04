import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function UserCharts({ userTypeData }) {
    // userTypeData: [{ type, value, color }], monthlyData: [{ month, value }]
    return (
        <div className="mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">User Type Distribution</h3>
                <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                        <Pie data={userTypeData} dataKey="value" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                            {userTypeData.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
