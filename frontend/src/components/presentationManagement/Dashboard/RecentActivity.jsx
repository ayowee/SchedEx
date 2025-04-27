// src/components/dashboard/RecentActivity.jsx
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const activities = [
    {
        id: 1,
        user: {
            name: 'Dr. Smith',
            avatar: 'DS',
            color: 'bg-blue-500'
        },
        action: 'completed evaluation for',
        subject: 'Advanced AI Techniques',
        time: '2 hours ago'
    },
    {
        id: 2,
        user: {
            name: 'Dr. Johnson',
            avatar: 'DJ',
            color: 'bg-blue-400'
        },
        action: 'scheduled a new viva for',
        subject: 'Machine Learning Fundamentals',
        time: '4 hours ago'
    },
    {
        id: 3,
        user: {
            name: 'Dr. Williams',
            avatar: 'DW',
            color: 'bg-blue-600'
        },
        action: 'updated availability for',
        subject: 'Data Visualization Presentations',
        time: 'Yesterday'
    },
    {
        id: 4,
        user: {
            name: 'Dr. Brown',
            avatar: 'DB',
            color: 'bg-blue-700'
        },
        action: 'requested rescheduling for',
        subject: 'Neural Network Applications',
        time: 'Yesterday'
    }
];

export default function RecentActivity() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Examiner Activity</h3>
                <button className="text-gray-400 hover:text-gray-500">
                    <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.user.color} flex items-center justify-center text-white text-sm font-medium`}>
                            {activity.user.avatar}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">{activity.user.name}</span> {activity.action}
                            </p>
                            <p className="text-sm text-gray-600">
                                {activity.subject}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {activity.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-600 transition-colors">
                    View All Activity
                </button>
            </div>
        </div>
    );
}