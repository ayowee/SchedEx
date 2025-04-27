import { UserGroupIcon, UserIcon, AcademicCapIcon, UserMinusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const MetricCard = ({ title, value, icon: Icon, trend, trendValue, trendDirection }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            {trend && (
                <div className={`flex items-center text-sm font-medium ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}> 
                    {trendDirection === 'up' ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                    {trendValue}
                </div>
            )}
        </div>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
);

export default function UserMetrics({ stats }) {
    // stats: { total, active, admins, examiners, students, trends }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Total Users" value={stats.total} icon={UserGroupIcon} trend trendValue={stats.trends.total} trendDirection={stats.trends.totalDir} />
            <MetricCard title="Active Users" value={stats.active} icon={UserIcon} trend trendValue={stats.trends.active} trendDirection={stats.trends.activeDir} />
            <MetricCard title="Admins" value={stats.admins} icon={AcademicCapIcon} trend trendValue={stats.trends.admins} trendDirection={stats.trends.adminsDir} />
            <MetricCard title="Examiners" value={stats.examiners} icon={UserMinusIcon} trend trendValue={stats.trends.examiners} trendDirection={stats.trends.examinersDir} />
        </div>
    );
}
