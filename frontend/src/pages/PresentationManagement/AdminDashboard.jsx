import { useState } from 'react';
import DashboardMetrics from '../../components/presentationManagement/Dashboard/Metrics';
import PresentationCharts from '../../components/presentationManagement/Dashboard/Charts';
import ExaminerPerformance from '../../components/presentationManagement/Dashboard/ExaminerPerformance';
import RecentActivity from '../../components/presentationManagement/Dashboard/RecentActivity';

export default function AdminDashboard() {
    const [filters, setFilters] = useState({
        dateRange: 'last30',
        status: 'all',
        examiner: ''
    });

    return (
        <>
            {/* Page Title & Filters */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard Overview
                </h1>
                
                <div className="flex flex-wrap gap-3">
                    <select
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                        value={filters.dateRange}
                        onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
                    >
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="last7">Last 7 days</option>
                        <option value="last30">Last 30 days</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                    </select>
                    
                    <select
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                        value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metrics Row - Full Width */}
                <div className="lg:col-span-3">
                    <DashboardMetrics />
                </div>
                
                {/* Charts - 2/3 Width */}
                <div className="lg:col-span-2 space-y-6">
                    <PresentationCharts filters={filters} />
                </div>
                
                {/* Side Panels - 1/3 Width */}
                <div className="space-y-6">
                    <ExaminerPerformance />
                    <RecentActivity />
                </div>
            </div>
        </>
    );
}