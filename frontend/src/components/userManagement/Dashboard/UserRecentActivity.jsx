import { UserIcon } from '@heroicons/react/24/solid';

export default function UserRecentActivity({ activities }) {
    // activities: [{ id, user: { name, avatar, color }, action, subject, time }]
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 lg:w-1/2">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent User Activity</h3>
            <ul className="divide-y divide-gray-100">
                {activities.length === 0 ? (
                    <li className="py-6 text-gray-400 text-center">No recent activity</li>
                ) : (
                    activities.map((activity) => (
                        <li key={activity.id} className="flex items-center py-4 gap-4">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-lg ${activity.user.color || 'bg-blue-500'}`}>
                                {activity.user.avatar || <UserIcon className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">{activity.user.name}</span> {activity.action} <span className="font-medium text-blue-700">{activity.subject}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
