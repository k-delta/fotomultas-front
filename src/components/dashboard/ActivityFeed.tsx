import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock } from 'lucide-react';
import { Activity } from '../../types';
import { formatDate } from '../../utils/fineUtils';

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No hay actividades recientes
      </div>
    );
  }
  
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                    <FileText className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 py-1.5">
                  <div className="text-sm text-gray-500">
                    <Link
                      to={`/fines/${activity.fineId}`}
                      className="font-medium text-gray-900 hover:text-blue-700"
                    >
                      {activity.description}
                    </Link>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                    <span>{formatDate(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;