import { format } from 'date-fns';
import { FiPackage, FiTruck, FiRepeat, FiEdit } from 'react-icons/fi';
import "../../pages/Dashboard.css";

const RecentActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'receipt': return <FiPackage />;
      case 'delivery': return <FiTruck />;
      case 'transfer': return <FiRepeat />;
      case 'adjustment': return <FiEdit />;
      default: return <FiPackage />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'receipt': return 'green';
      case 'delivery': return 'blue';
      case 'transfer': return 'orange';
      case 'adjustment': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="recent-activities">
      <h3>Recent Activities</h3>
      <div className="activities-list">
        {activities?.length === 0 ? (
          <p className="no-data">No recent activities</p>
        ) : (
          activities?.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className={`activity-icon icon-${getActivityColor(activity.operationType)}`}>
                {getActivityIcon(activity.operationType)}
              </div>
              <div className="activity-content">
                <p className="activity-title">
                  {activity.product?.name || 'Product'} - {activity.operationType}
                </p>
                <p className="activity-details">
                  Qty: {activity.quantity} | User: {activity.user?.loginId || 'System'}
                </p>
                <p className="activity-time">
                  {format(new Date(activity.createdAt), 'MMM dd, yyyy hh:mm a')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
