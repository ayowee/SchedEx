// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// const StatusPieChart = ({ data }) => {
//     const chartData = [
//         { name: 'Completed', value: data.completed, color: '#28a745' },
//         { name: 'Upcoming', value: data.upcoming, color: '#1a73e8' },
//         { name: 'Cancelled', value: data.cancelled, color: '#dc3545' },
//         { name: 'Ongoing', value: data.ongoing, color: '#6f42c1' },
//     ];

//     return (
//         <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//                 <Pie
//                     data={chartData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                 >
//                     {chartData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                 </Pie>
//                 <Tooltip
//                     contentStyle={{
//                         backgroundColor: '#fff',
//                         border: 'none',
//                         borderRadius: '8px',
//                         boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                     }}
//                 />
//             </PieChart>
//         </ResponsiveContainer>
//     );
// };

// export default StatusPieChart;