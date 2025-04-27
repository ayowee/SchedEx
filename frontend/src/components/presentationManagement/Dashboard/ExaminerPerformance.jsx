// src/components/dashboard/ExaminerPerformance.jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { EllipsisHorizontalIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

export default function ExaminerPerformance() {
    const targetPercentage = 75.55;
    const data = [
        { name: 'Completed', value: targetPercentage, color: '#2563EB' },
        { name: 'Remaining', value: 100 - targetPercentage, color: '#e5e7eb' }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Presentation Completion</h3>
                <button className="text-gray-400 hover:text-gray-500">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">Target completion rate for this month</p>
            
            <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">{targetPercentage}%</span>
                        <span className="text-sm text-green-500 flex items-center">
                            <ArrowUpIcon className="h-3 w-3 mr-1" />
                            +10%
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-gray-500 text-xs mb-1">Target</p>
                    <p className="text-gray-900 font-medium">85%</p>
                    <p className="text-xs text-red-500">↓</p>
                </div>
                <div>
                    <p className="text-gray-500 text-xs mb-1">Current</p>
                    <p className="text-gray-900 font-medium">75%</p>
                    <p className="text-xs text-green-500">↑</p>
                </div>
                <div>
                    <p className="text-gray-500 text-xs mb-1">Last Month</p>
                    <p className="text-gray-900 font-medium">65%</p>
                    <p className="text-xs text-green-500">↑</p>
                </div>
            </div>
            
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Completed <span className="font-semibold text-gray-900">87</span> presentations this month, up from 79 last month.
                </p>
                <p className="text-sm text-gray-600">
                    Keep up your good work!
                </p>
            </div>
        </div>
    );
}