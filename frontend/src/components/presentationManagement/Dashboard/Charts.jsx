// components/dashboard/Charts.jsx
import { useState, useEffect } from 'react';
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
    CartesianGrid,
    Legend
} from 'recharts';
import { 
    EllipsisHorizontalIcon, 
    ChartPieIcon, 
    TableCellsIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

// Define status colors for consistency
const STATUS_COLORS = {
    scheduled: '#3B82F6', // Blue
    completed: '#10B981', // Green
    canceled: '#EF4444',  // Red
    cancelled: '#EF4444', // Support both spellings
    confirmed: '#8B5CF6', // Purple
    default: '#9CA3AF'    // Gray
};

export default function PresentationCharts({ presentations = [], loading = false }) {
    const [statusView, setStatusView] = useState('chart'); // 'chart' or 'table'
    const [sortConfig, setSortConfig] = useState({ key: 'status', direction: 'asc' });
    const [statusData, setStatusData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    
    // Process presentation data for charts
    useEffect(() => {
        if (loading) return;
        
        // Process status data
        const statusCounts = presentations.reduce((acc, presentation) => {
            const status = presentation.status ? presentation.status.toLowerCase() : 'default';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        
        const statusArray = Object.entries(statusCounts).map(([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
            color: STATUS_COLORS[status] || STATUS_COLORS.default,
            percentage: presentations.length > 0 
                ? Math.round((count / presentations.length) * 100) 
                : 0
        }));
        
        setStatusData(statusArray);
        
        // Process monthly data
        const today = new Date();
        const sixMonthsAgo = subMonths(today, 5);
        
        const monthRange = eachMonthOfInterval({
            start: startOfMonth(sixMonthsAgo),
            end: endOfMonth(today)
        });
        
        const monthlyPresentations = monthRange.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);
            
            const count = presentations.filter(p => {
                const date = new Date(p.date);
                return date >= monthStart && date <= monthEnd;
            }).length;
            
            return {
                name: format(month, 'MMM'),
                value: count,
                month: format(month, 'MMMM')
            };
        });
        
        setMonthlyData(monthlyPresentations);
        
    }, [presentations, loading]);
    
    // Sort table data
    const sortedStatusData = [...statusData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
    
    // Handle sort request
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    // Get sort icon
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ArrowsUpDownIcon className="h-4 w-4 text-gray-400" />;
        }
        
        return sortConfig.direction === 'asc' 
            ? <ArrowUpIcon className="h-4 w-4 text-blue-500" />
            : <ArrowDownIcon className="h-4 w-4 text-blue-500" />;
    };
    
    // Calculate total presentations
    const totalPresentations = statusData.reduce((sum, item) => sum + item.value, 0);

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
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="animate-pulse bg-gray-200 rounded h-4/5 w-full"></div>
                        </div>
                    ) : monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
                                    formatter={(value, name, props) => [
                                        `${value} presentations`, 
                                        props.payload.month
                                    ]}
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
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            No presentation data available
                        </div>
                    )}
                </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Presentation Status</h3>
                    <div className="flex space-x-2">
                        <button 
                            className={`p-1.5 rounded-md ${statusView === 'chart' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-500'}`}
                            onClick={() => setStatusView('chart')}
                            title="Chart View"
                        >
                            <ChartPieIcon className="h-5 w-5" />
                        </button>
                        <button 
                            className={`p-1.5 rounded-md ${statusView === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-500'}`}
                            onClick={() => setStatusView('table')}
                            title="Table View"
                        >
                            <TableCellsIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <div className="animate-pulse bg-gray-200 rounded-full h-4/5 w-4/5 max-w-xs"></div>
                    </div>
                ) : statusData.length > 0 ? (
                    statusView === 'chart' ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="status"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value, name) => [`${value} presentations (${Math.round((value/totalPresentations)*100)}%)`, name]}
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
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('status')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Status</span>
                                                {getSortIcon('status')}
                                            </div>
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('value')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Count</span>
                                                {getSortIcon('value')}
                                            </div>
                                        </th>
                                        <th 
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('percentage')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Percentage</span>
                                                {getSortIcon('percentage')}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedStatusData.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                                    <div className="text-sm font-medium text-gray-900">{item.status}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.value} presentations
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[150px]">
                                                        <div className="h-2.5 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{item.percentage}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{totalPresentations} presentations</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">100%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        No presentation data available
                    </div>
                )}
            </div>
        </div>
    );
}