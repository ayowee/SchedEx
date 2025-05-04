// components/dashboard/Metrics.jsx
import { 
    PresentationChartBarIcon, 
    ClockIcon, 
    CheckCircleIcon, 
    AcademicCapIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const MetricCard = ({ title, value, icon: Icon, trend, trendValue, trendDirection, loading }) => (
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
        
        <h3 className="text-3xl font-bold text-gray-900">
            {loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
            ) : (
                value
            )}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
);

export default function DashboardMetrics({ presentations = [], examiners = [], loading = false }) {
    const [metrics, setMetrics] = useState({
        presentations: { value: '0', trend: false },
        scheduled: { value: '0', trend: false },
        completed: { value: '0', trend: false },
        examiners: { value: '0', trend: false }
    });

    useEffect(() => {
        if (loading) return;

        // Calculate metrics from real data
        const totalPresentations = presentations.length;
        
        const scheduledPresentations = presentations.filter(
            p => p.status.toLowerCase() === 'scheduled'
        ).length;
        
        const completedPresentations = presentations.filter(
            p => p.status.toLowerCase() === 'completed'
        ).length;
        
        const activeExaminers = examiners.length;

        // Calculate trends (this would typically compare to previous period)
        // For now, we'll use placeholder trend values
        // In a real implementation, you would fetch historical data and calculate actual trends
        const calculateTrend = (current, previous) => {
            if (!previous) return { trend: false };
            const percentChange = ((current - previous) / previous) * 100;
            return {
                trend: true,
                trendValue: `${Math.abs(percentChange).toFixed(2)}%`,
                trendDirection: percentChange >= 0 ? 'up' : 'down'
            };
        };

        // Placeholder previous values (in a real app, these would come from historical data)
        const previousValues = {
            presentations: totalPresentations * 0.95, // 5% growth
            scheduled: scheduledPresentations * 0.9, // 10% growth
            completed: completedPresentations * 0.97, // 3% growth
            examiners: activeExaminers * 1.1 // 10% decline
        };

        setMetrics({
            presentations: {
                value: totalPresentations.toString(),
                ...calculateTrend(totalPresentations, previousValues.presentations)
            },
            scheduled: {
                value: scheduledPresentations.toString(),
                ...calculateTrend(scheduledPresentations, previousValues.scheduled)
            },
            completed: {
                value: completedPresentations.toString(),
                ...calculateTrend(completedPresentations, previousValues.completed)
            },
            examiners: {
                value: activeExaminers.toString(),
                ...calculateTrend(activeExaminers, previousValues.examiners)
            }
        });
    }, [presentations, examiners, loading]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
                title="Total Presentations"
                value={metrics.presentations.value}
                icon={PresentationChartBarIcon}
                trend={metrics.presentations.trend}
                trendValue={metrics.presentations.trendValue}
                trendDirection={metrics.presentations.trendDirection}
                loading={loading}
            />
            <MetricCard
                title="Scheduled"
                value={metrics.scheduled.value}
                icon={ClockIcon}
                trend={metrics.scheduled.trend}
                trendValue={metrics.scheduled.trendValue}
                trendDirection={metrics.scheduled.trendDirection}
                loading={loading}
            />
            <MetricCard
                title="Completed"
                value={metrics.completed.value}
                icon={CheckCircleIcon}
                trend={metrics.completed.trend}
                trendValue={metrics.completed.trendValue}
                trendDirection={metrics.completed.trendDirection}
                loading={loading}
            />
            <MetricCard
                title="Active Examiners"
                value={metrics.examiners.value}
                icon={AcademicCapIcon}
                trend={metrics.examiners.trend}
                trendValue={metrics.examiners.trendValue}
                trendDirection={metrics.examiners.trendDirection}
                loading={loading}
            />
        </div>
    );
}