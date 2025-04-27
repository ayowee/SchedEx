// components/dashboard/Metrics.jsx
import { 
    PresentationChartBarIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    UserGroupIcon,
    AcademicCapIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';

const MetricCard = ({ title, value, icon: Icon, trend, trendValue, trendDirection }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
                <Icon className="h-6 w-6 text-blue-600" />
            </div>
            
            {trend && (
                <div className={`flex items-center text-sm font-medium ${
                    trendDirection === 'up' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                }`}>
                    {trendDirection === 'up' ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {trendValue}
                </div>
            )}
        </div>
        
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
);

export default function DashboardMetrics() {
    const metrics = {
        presentations: {
            value: '142',
            trend: true,
            trendValue: '5.27%',
            trendDirection: 'up'
        },
        scheduled: {
            value: '45',
            trend: true,
            trendValue: '11.01%',
            trendDirection: 'up'
        },
        completed: {
            value: '87',
            trend: true,
            trendValue: '3.4%',
            trendDirection: 'up'
        },
        examiners: {
            value: '24',
            trend: true,
            trendValue: '9.05%',
            trendDirection: 'down'
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
                title="Total Presentations"
                value={metrics.presentations.value}
                icon={PresentationChartBarIcon}
                trend={metrics.presentations.trend}
                trendValue={metrics.presentations.trendValue}
                trendDirection={metrics.presentations.trendDirection}
            />
            <MetricCard
                title="Scheduled"
                value={metrics.scheduled.value}
                icon={ClockIcon}
                trend={metrics.scheduled.trend}
                trendValue={metrics.scheduled.trendValue}
                trendDirection={metrics.scheduled.trendDirection}
            />
            <MetricCard
                title="Completed"
                value={metrics.completed.value}
                icon={CheckCircleIcon}
                trend={metrics.completed.trend}
                trendValue={metrics.completed.trendValue}
                trendDirection={metrics.completed.trendDirection}
            />
            <MetricCard
                title="Active Examiners"
                value={metrics.examiners.value}
                icon={AcademicCapIcon}
                trend={metrics.examiners.trend}
                trendValue={metrics.examiners.trendValue}
                trendDirection={metrics.examiners.trendDirection}
            />
        </div>
    );
}