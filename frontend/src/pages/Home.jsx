import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Store,
  TrendingUp,
  Package,
  Receipt,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  fetchPublicShops,
  fetchShopSalesOverview,
  fetchShopWeeklySales,
  fetchShopMonthlySales,
  fetchShopYearlySales
} from '../services/salesService';
import './Home.css';

// Recharts Tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const amountVal = payload.find((p) => p.dataKey === 'amount')?.value || 0;
    const bottlesVal = payload.find((p) => p.dataKey === 'bottles')?.value || 0;
    const txnsVal = payload.find((p) => p.dataKey === 'transactions')?.value || 0;

    return (
      <div className="chart-tooltip">
        <div className="tooltip-title">{label}</div>
        <div className="tooltip-item text-amount">
          <span>Revenue:</span>
          <strong>₹{amountVal.toLocaleString('en-IN')}</strong>
        </div>
        <div className="tooltip-item text-bottles">
          <span>Bottles / Volume:</span>
          <strong>{bottlesVal.toLocaleString('en-IN')} Bottles ({(bottlesVal * 250).toLocaleString('en-IN')} ml)</strong>
        </div>
        <div className="tooltip-item text-txns">
          <span>Transactions:</span>
          <strong>{txnsVal.toLocaleString('en-IN')}</strong>
        </div>
      </div>
    );
  }
  return null;
}

export default function Home() {
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(1);
  const [overview, setOverview] = useState(null);
  const [timeframe, setTimeframe] = useState('weekly'); // 'weekly' | 'monthly' | 'yearly'
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  // Load shops and overview
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const shopList = await fetchPublicShops();
        setShops(shopList);
        const targetShopId = shopList.length > 0 ? shopList[0].id : 1;
        setSelectedShopId(targetShopId);

        const overviewData = await fetchShopSalesOverview(targetShopId);
        setOverview(overviewData);
      } catch {
        // Fallback handled in salesService
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // When selected shop or timeframe changes, load chart data
  useEffect(() => {
    async function loadChart() {
      if (!selectedShopId) return;
      try {
        setChartLoading(true);
        let data = [];
        if (timeframe === 'weekly') {
          data = await fetchShopWeeklySales(selectedShopId);
        } else if (timeframe === 'monthly') {
          data = await fetchShopMonthlySales(selectedShopId);
        } else {
          data = await fetchShopYearlySales(selectedShopId);
        }
        setChartData(data);
      } catch {
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    }
    loadChart();
  }, [selectedShopId, timeframe]);

  // When changing shop dropdown
  const handleShopChange = async (e) => {
    const id = Number(e.target.value);
    setSelectedShopId(id);
    setLoading(true);
    try {
      const data = await fetchShopSalesOverview(id);
      setOverview(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const selectedShop = shops.find((s) => s.id === selectedShopId) || shops[0] || {};

  return (
    <div className="home-wrapper">
      {/* ── 1. Top Navigation Bar: Brand on Left, Login of Them on Right Corner ── */}
      <header className="home-navbar" role="banner">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <ShieldCheck size={28} className="brand-logo-icon" />
            <div className="nav-brand-text">
              <span className="brand-name">SADMS</span>
              <span className="brand-subtitle">Smart Alcohol Distribution &amp; Monitoring</span>
            </div>
          </Link>

          {/* Right Corner: Login Links to Unified Single Login Page */}
          <div className="corner-login-group">
            <Link to="/login?role=customer" className="corner-login-btn corner-btn-customer" id="corner-customer-login">
              <User size={15} />
              <span>Customer Login</span>
            </Link>
            <Link to="/login?role=shop" className="corner-login-btn corner-btn-shop" id="corner-shop-login">
              <Store size={15} />
              <span>Wine Shop Login</span>
            </Link>
            <Link to="/login?role=admin" className="corner-login-btn corner-btn-admin" id="corner-admin-login">
              <ShieldCheck size={15} />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. Compact Header Banner (No Paragraphs) ── */}
      <section className="home-hero">
        <div className="hero-container">
          <div className="hero-badge">
            <ShieldCheck size={15} />
            <span>CENTRALIZED EXCISE &amp; RETAIL MONITORING PORTAL</span>
          </div>

          <h1 className="hero-title">
            SMART ALCOHOL DISTRIBUTION AND MONITORING SYSTEM
          </h1>

          {/* Quick Metrics Strip */}
          <div className="hero-tags-row">
            <span className="hero-tag-chip">
              <CheckCircle2 size={14} color="#22c55e" /> Mock Aadhaar 21+ Age Verified
            </span>
            <span className="hero-tag-chip">
              <CheckCircle2 size={14} color="#22c55e" /> Max 250 ml Daily Quota (1 Bottle/Day)
            </span>
            <span className="hero-tag-chip">
              <CheckCircle2 size={14} color="#22c55e" /> Hardware RFID Dispensation
            </span>
            <span className="hero-tag-chip">
              <CheckCircle2 size={14} color="#22c55e" /> Real-time Cloud Telemetry
            </span>
          </div>
        </div>
      </section>



      {/* ── 3. Single-Shop Sales Metrics (Today, Monthly, Yearly) ── */}
      <section className="sales-section" id="sales-overview">
        <div className="section-container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">OUTLET SALES TELEMETRY</span>
              <h2 className="section-title">Single-Shop Sales Overview</h2>
            </div>

            {/* Shop Selector Dropdown */}
            <div className="shop-selector-wrapper">
              <label htmlFor="shop-select" className="shop-select-label">
                <Store size={15} /> Outlet:
              </label>
              <select
                id="shop-select"
                value={selectedShopId}
                onChange={handleShopChange}
                className="shop-select-input"
              >
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.locationType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Shop Identity Strip */}
          <div className="active-shop-strip">
            <div className="active-shop-item">
              <MapPin size={16} className="text-muted" />
              <span>Location: <strong>{selectedShop.locationName || 'Anna Nagar, Chennai'}</strong></span>
            </div>
            <div className="active-shop-item">
              <FileText size={16} className="text-muted" />
              <span>License No: <strong>{selectedShop.licenseNumber || 'TASMAC-TN-CHN-4012'}</strong></span>
            </div>
            <div className="active-shop-item">
              <CheckCircle2 size={16} color="#15803d" />
              <span>Status: <strong style={{ color: '#15803d' }}>Active POS Linked</strong></span>
            </div>
          </div>

          {/* 3 Main Sales Cards: Today, Monthly, Yearly */}
          {loading || !overview ? (
            <div className="sales-cards-loading">
              <Clock size={28} className="spin-icon" />
              <span>Loading outlet metrics...</span>
            </div>
          ) : (
            <div className="sales-cards-grid">
              {/* Card 1: Today's Sales */}
              <div className="sales-card card-today">
                <div className="card-top">
                  <div className="card-title-group">
                    <span className="card-period-tag">TODAY</span>
                    <h3 className="card-heading">Today's Sales</h3>
                  </div>
                  <div className="card-icon-bubble bubble-today">
                    <TrendingUp size={22} />
                  </div>
                </div>

                <div className="card-amount">
                  ₹{overview.today.amount.toLocaleString('en-IN')}
                </div>

                <div className="card-stats-row">
                  <div className="stat-sub-item">
                    <Package size={15} />
                    <span>Bottles: <strong>{overview.today.bottles.toLocaleString('en-IN')}</strong></span>
                  </div>
                  <div className="stat-sub-item">
                    <Receipt size={15} />
                    <span>Txns: <strong>{overview.today.transactions.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card 2: This Month's Sales */}
              <div className="sales-card card-month">
                <div className="card-top">
                  <div className="card-title-group">
                    <span className="card-period-tag">THIS MONTH</span>
                    <h3 className="card-heading">Monthly Sales</h3>
                  </div>
                  <div className="card-icon-bubble bubble-month">
                    <Calendar size={22} />
                  </div>
                </div>

                <div className="card-amount">
                  ₹{overview.monthly.amount.toLocaleString('en-IN')}
                </div>

                <div className="card-stats-row">
                  <div className="stat-sub-item">
                    <Package size={15} />
                    <span>Bottles: <strong>{overview.monthly.bottles.toLocaleString('en-IN')}</strong></span>
                  </div>
                  <div className="stat-sub-item">
                    <Receipt size={15} />
                    <span>Txns: <strong>{overview.monthly.transactions.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card 3: This Year's Sales */}
              <div className="sales-card card-year">
                <div className="card-top">
                  <div className="card-title-group">
                    <span className="card-period-tag">THIS YEAR</span>
                    <h3 className="card-heading">Yearly Sales</h3>
                  </div>
                  <div className="card-icon-bubble bubble-year">
                    <BarChart3 size={22} />
                  </div>
                </div>

                <div className="card-amount">
                  ₹{overview.yearly.amount.toLocaleString('en-IN')}
                </div>

                <div className="card-stats-row">
                  <div className="stat-sub-item">
                    <Package size={15} />
                    <span>Bottles: <strong>{overview.yearly.bottles.toLocaleString('en-IN')}</strong></span>
                  </div>
                  <div className="stat-sub-item">
                    <Receipt size={15} />
                    <span>Txns: <strong>{overview.yearly.transactions.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── 4. Sales Flow Chart: Week, Monthly, Year Filter ── */}
          <div className="analytics-card" id="sales-analytics">
            <div className="analytics-header">
              <div>
                <span className="section-eyebrow">FLOW CHART</span>
                <h3 className="analytics-title">Sales Flow Trends</h3>
              </div>

              {/* Timeframe Controls: Week / Monthly / Year */}
              <div className="timeframe-button-group" role="tablist" aria-label="Sales Flow Timeframe">
                <button
                  type="button"
                  role="tab"
                  aria-selected={timeframe === 'weekly'}
                  className={`timeframe-btn ${timeframe === 'weekly' ? 'active' : ''}`}
                  onClick={() => setTimeframe('weekly')}
                >
                  Week
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={timeframe === 'monthly'}
                  className={`timeframe-btn ${timeframe === 'monthly' ? 'active' : ''}`}
                  onClick={() => setTimeframe('monthly')}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={timeframe === 'yearly'}
                  className={`timeframe-btn ${timeframe === 'yearly' ? 'active' : ''}`}
                  onClick={() => setTimeframe('yearly')}
                >
                  Year
                </button>
              </div>
            </div>

            {/* Chart Render Area */}
            <div className="chart-render-wrapper">
              {chartLoading ? (
                <div className="chart-loading-state">
                  <Clock size={32} className="spin-icon" />
                  <span>Loading sales trends...</span>
                </div>
              ) : chartData.length === 0 ? (
                <div className="chart-empty-state">
                  <BarChart3 size={40} className="text-muted" />
                  <span>No records available</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={340}>
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 15, bottom: 5 }}>
                    <defs>
                      <linearGradient id="salesAmountGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#002147" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#002147" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="bottlesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#002147"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(val) => (val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${(val / 1000).toFixed(0)}k`)}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#15803d"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="amount"
                      name="Sales Revenue (₹)"
                      stroke="#002147"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#salesAmountGrad)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="bottles"
                      name="Bottles Sold (250ml)"
                      stroke="#15803d"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#bottlesGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Public Footer ── */}
      <footer className="home-footer" role="contentinfo">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <ShieldCheck size={22} color="#f59e0b" />
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>SADMS</span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Department of Prohibition and Excise &bull; Regulated Citizen Quota System
              </span>
            </div>

            <div className="footer-links-group">
              <span className="footer-heading">Access Portals</span>
              <Link to="/login?role=customer">Citizen / Customer Login</Link>
              <Link to="/login?role=shop">Wine Shop Retailer Login</Link>
              <Link to="/login?role=admin">State Administrator Login</Link>
            </div>

            <div className="footer-links-group">
              <span className="footer-heading">Statutory Acts</span>
              <span>Tamil Nadu Prohibition Act, 1937</span>
              <span>IT Act, 2000 Security Standard</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; 2026 SADMS &bull; Government of Tamil Nadu</span>
            <span className="footer-tech-tag">State Excise Automated Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
