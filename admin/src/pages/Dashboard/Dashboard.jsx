import React, { useState, useEffect, useContext } from 'react';
import './Dashboard.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'; 

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Chart
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const currentYear = new Date().getFullYear();
const yearOptions = [
    { value: currentYear, label: `${currentYear}` },
    { value: currentYear - 1, label: `${currentYear - 1}` },
    { value: currentYear - 2, label: `${currentYear - 2}` },
];

const months = Array.from({ length: 12 }, (_, i) => i + 1);
const quarters = [1, 2, 3, 4];


const Dashboard = () => {
  const { url, token } = useContext(StoreContext);

  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState(null);

  const [chartView, setChartView] = useState('monthly');
  const [selectedTime, setSelectedTime] = useState(new Date().getMonth() + 1);
  const [selectedYearForSub, setSelectedYearForSub] = useState(currentYear); 

  
  // === SỬA LỖI TRỤC Y ===
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: chartView === 'monthly'
          ? `Doanh thu Tháng ${selectedTime}/${selectedYearForSub}`
          : (chartView === 'quarterly'
            ? `Doanh thu Quý ${selectedTime}/${selectedYearForSub}`
            : `Doanh thu Năm ${selectedTime}`)
      }
    },
    elements: { line: { tension: 0.4 } },
    scales: {
      x: { grid: { display: false } },
      y: { 
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: { callback: (value) => `$${value}` },
        // XÓA BỎ min VÀ max ĐỂ TRỤC Y TỰ ĐỘNG ĐIỀU CHỈNH
        // min: 100,
        // max: 2000
      }
    }
  };
  // === KẾT THÚC SỬA ===

  const fetchStats = async () => {
    try {
        const res = await axios.get(`${url}/api/order/stats`, { 
            headers: { token, 'Cache-Control': 'no-cache' } 
        });
        if (res.data.success) setStats(res.data.data);
        else toast.error("Không thể tải thống kê");
    } catch {
        toast.error("Lỗi API (thống kê)");
    }
  };
  const fetchRecent = async () => {
     try {
        const res = await axios.get(`${url}/api/order/recent`, { 
            headers: { token, 'Cache-Control': 'no-cache' } 
        });
        if (res.data.success) setRecentOrders(res.data.data);
        else toast.error("Không thể tải đơn hàng gần đây");
    } catch {
        toast.error("Lỗi API (đơn hàng gần đây)");
    }
  };

  const fetchChart = async () => {
    let res;
    const config = { 
        headers: { token, 'Cache-Control': 'no-cache' } 
    };
    try {
        if (chartView === "monthly") {
          res = await axios.get(`${url}/api/order/monthly?month=${selectedTime}&year=${selectedYearForSub}`, config);
        } else if (chartView === "quarterly") {
          res = await axios.get(`${url}/api/order/quarterly?quarter=${selectedTime}&year=${selectedYearForSub}`, config);
        } else if (chartView === "yearly") {
          res = await axios.get(`${url}/api/order/yearly?year=${selectedTime}`, config);
        }
        
        if (res.data.success) setChartData(res.data.data);
        else toast.error(res.data.message);
    } catch (error) {
        toast.error("Lỗi API (biểu đồ)");
    }
  };
  
  useEffect(() => { 
      if (token) { 
          fetchStats(); 
          fetchRecent(); 
      } 
  }, [token]);
  
  useEffect(() => { 
      if (token) { 
          Chart.getChart("dashboardChart")?.destroy(); 
          setChartData(null); 
          fetchChart(); 
      } 
  }, [chartView, selectedTime, selectedYearForSub, token]); 

  const handleViewChange = (e) => {
    const newView = e.target.value;
    setChartView(newView);
    if (newView === 'monthly') {
        setSelectedTime(new Date().getMonth() + 1); 
        setSelectedYearForSub(currentYear);
    } else if (newView === 'quarterly') {
        setSelectedTime(1); 
        setSelectedYearForSub(currentYear);
    } else if (newView === 'yearly') {
        setSelectedTime(currentYear); 
    }
  };

  const formatCurrency = n =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <div className="dashboard">
      <h2>Bảng điều khiển</h2>

      <div className="dashboard-stats">
        <div className="stat-card revenue"><h3>Tổng doanh thu</h3><p>{formatCurrency(stats.totalRevenue)}</p></div>
        <div className="stat-card orders"><h3>Tổng đơn hàng</h3><p>{stats.totalOrders}</p></div>
        <div className="stat-card users"><h3>Tổng người dùng</h3><p>{stats.totalUsers}</p></div>
      </div>

      <div className="dashboard-main-content">
        <div className="dashboard-chart">

          <div className="chart-filter-row">
            
            <select className="chart-select"
              value={chartView}
              onChange={handleViewChange}
            >
              <option value="monthly">Theo tháng</option>
              <option value="quarterly">Theo quý</option>
              <option value="yearly">Theo năm</option>
            </select>

            {chartView === "monthly" && (
              <>
                <select className="chart-select"
                  value={selectedYearForSub}
                  onChange={e => setSelectedYearForSub(Number(e.target.value))}
                >
                  {yearOptions.map(y => (
                    <option key={y.value} value={y.value}>{y.label}</option>
                  ))}
                </select>
                <select className="chart-select"
                  value={selectedTime}
                  onChange={e => setSelectedTime(Number(e.target.value))}
                >
                  {months.map(m => (
                    <option key={m} value={m}>Tháng {m}</option> 
                  ))}
                </select>
              </>
            )}

            {chartView === "quarterly" && (
              <>
                <select className="chart-select"
                  value={selectedYearForSub}
                  onChange={e => setSelectedYearForSub(Number(e.target.value))}
                >
                  {yearOptions.map(y => (
                    <option key={y.value} value={y.value}>{y.label}</option>
                  ))}
                </select>
                <select className="chart-select"
                  value={selectedTime}
                  onChange={e => setSelectedTime(Number(e.target.value))}
                >
                  {quarters.map(q => (
                    <option key={q} value={q}>Quý {q}</option> 
                  ))}
                </select>
              </>
            )}

            {chartView === "yearly" && (
              <select className="chart-select"
                value={selectedTime}
                onChange={e => setSelectedTime(Number(e.target.value))}
              >
                {yearOptions.map(y => (
                  <option key={y.value} value={y.value}>{y.label}</option> 
                ))}
              </select>
            )}

          </div>


          <div className="chart-wrapper">
            {chartData ? (
              <Line id="dashboardChart" options={chartOptions} data={chartData} />
            ) : <p>Đang tải dữ liệu...</p>}
          </div>
        </div>

        <div className="dashboard-recent">
          <h3>Đơn hàng gần đây</h3>
          <div className="recent-orders-list">
              {recentOrders.length > 0 ? recentOrders.map(o => (
                <div key={o._id} className="recent-order-item">
                  <img src={assets.parcel_icon} alt="" />
                  <div>
                    <p className="recent-order-items">
                      {o.items.map((i, idx) =>
                        `${i.name} x ${i.quantity}${idx < o.items.length - 1 ? ", " : ""}`
                      )}
                    </p>
                    <p className="recent-order-user">{o.address.firstName}</p>
                  </div>
                  <p className="recent-order-amount">{formatCurrency(o.amount)}</p>
                </div>
              )) : <p>Không có đơn hàng gần đây.</p>} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;