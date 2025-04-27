// components/dashboard/Charts.jsx
import { 
    PieChart, 
    Pie, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Cell,
    LineChart,
    Line,
    CartesianGrid,
    Legend
} from 'recharts';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const presentationData = [
    { status: 'Scheduled', value: 45, color: '#2563EB' },
    { status: 'Completed', value: 87, color: '#10B981' },
    { status: 'Cancelled', value: 10, color: '#000000' }
];

const monthlyPresentationsData = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 15 },
    { name: 'Mar', value: 10 },
    { name: 'Apr', value: 14 },
    { name: 'May', value: 9 },
    { name: 'Jun', value: 8 },
    { name: 'Jul', value: 12 },
    { name: 'Aug', value: 6 },
    { name: 'Sep', value: 11 },
    { name: 'Oct', value: 18 },
    { name: 'Nov', value: 14 },
    { name: 'Dec', value: 13 }
];

const examinerPerformanceData = [
    { name: 'Dr. Smith', presentations: 24, rating: 4.8 },
    { name: 'Dr. Johnson', presentations: 18, rating: 4.5 },
    { name: 'Dr. Williams', presentations: 15, rating: 4.7 },
    { name: 'Dr. Brown', presentations: 21, rating: 4.9 },
    { name: 'Dr. Jones', presentations: 12, rating: 4.6 }
];

export default function PresentationCharts() {
    return (
        <div className="space-y-6">
            {/* Monthly Presentations Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Monthly Presentations</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyPresentationsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                domain={[0, 'dataMax + 5']}
                            />
                            <Tooltip 
                                formatter={(value) => [`${value} presentations`, 'Count']}
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }}
                            />
                            <Bar 
                                dataKey="value" 
                                fill="#2563EB" 
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Presentation Status</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={presentationData}
                                dataKey="value"
                                nameKey="status"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {presentationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name) => [`${value} presentations`, name]}
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }}
                            />
                            <Legend 
                                layout="horizontal" 
                                verticalAlign="bottom" 
                                align="center"
                                iconType="circle"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Examiner Performance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Top Examiners</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={examinerPerformanceData} 
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis 
                                type="number"
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <YAxis 
                                type="category"
                                dataKey="name"
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <Tooltip 
                                formatter={(value, name) => [
                                    name === 'presentations' ? `${value} presentations` : `${value} rating`,
                                    name === 'presentations' ? 'Presentations' : 'Rating'
                                ]}
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                }}
                            />
                            <Bar 
                                dataKey="presentations" 
                                fill="#2563EB" 
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                                name="Presentations"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}