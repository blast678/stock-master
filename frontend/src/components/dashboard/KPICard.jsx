import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import "../../pages/Dashboard.css";


const KPICard = ({ title, value, icon: Icon, color, trend, trendValue, onClick }) => {
  return (
    <div className={`kpi-card kpi-${color}`} onClick={onClick}>
      <div className="kpi-header">
        <div className="kpi-icon">
          <Icon />
        </div>
        <div className="kpi-content">
          <h3 className="kpi-title">{title}</h3>
          <p className="kpi-value">{value}</p>
        </div>
      </div>
      {trend && (
        <div className={`kpi-trend trend-${trend}`}>
          {trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
