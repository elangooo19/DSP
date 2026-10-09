import api from './api';
import { getShops, getTransactions } from './mockStore';

// Public Sales API Service with seamless Spring Boot backend integration & MockStore fallback

export async function fetchPublicShops() {
  try {
    const res = await api.get('/public/shops');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Backend offline / development mode fallback
  }
  return getShops();
}

export async function fetchShopSalesOverview(shopId = 1) {
  try {
    const res = await api.get(`/public/shop/${shopId}/sales/overview`);
    if (res.data && res.data.today) {
      return res.data;
    }
  } catch {
    // Fallback to simulated + reactive store data
  }

  const shop = getShops().find(s => s.id === Number(shopId)) || getShops()[0];
  const txns = getTransactions().filter(t => t.shopId === shop.id && t.status === 'SUCCESS');

  // Baseline figures for a government retail wine shop
  const extraTodayAmount = txns.reduce((sum, t) => sum + t.totalAmount, 0);
  const extraTodayBottles = txns.reduce((sum, t) => sum + t.quantity, 0);
  const extraTodayTxns = txns.length;

  return {
    shopId: shop.id,
    shopName: shop.name,
    locationName: shop.locationName,
    licenseNumber: shop.licenseNumber,
    today: {
      amount: 25480 + extraTodayAmount,
      bottles: 84 + extraTodayBottles,
      transactions: 42 + extraTodayTxns,
    },
    monthly: {
      amount: 685200 + extraTodayAmount,
      bottles: 1890 + extraTodayBottles,
      transactions: 945 + extraTodayTxns,
    },
    yearly: {
      amount: 7850000 + extraTodayAmount,
      bottles: 22400 + extraTodayBottles,
      transactions: 10800 + extraTodayTxns,
    },
  };
}

export async function fetchShopWeeklySales(shopId = 1) {
  try {
    const res = await api.get(`/public/shop/${shopId}/sales/weekly`);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Fallback to simulated shop week
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseAmounts = [24500, 26800, 23400, 28900, 42100, 48500, 34200];

  return days.map((day, idx) => {
    const amount = baseAmounts[idx];
    const bottles = Math.round(amount / 315);
    const txns = Math.round(bottles * 0.52);
    return {
      label: day,
      dayIndex: idx + 1,
      amount,
      bottles,
      transactions: txns,
    };
  });
}

export async function fetchShopDailySales(shopId = 1) {
  try {
    const res = await api.get(`/public/shop/${shopId}/sales/daily`);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Fallback
  }

  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // Deterministic realistic daily series
  const data = [];
  for (let d = 1; d <= daysInMonth; d++) {
    // Weekend bumps on days matching Friday/Saturday
    const dayOfWeek = new Date(now.getFullYear(), now.getMonth(), d).getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    const factor = isWeekend ? 1.45 : 1.0;

    // Slight progression up to today
    const isFuture = d > currentDay;
    const baseAmount = Math.round((20000 + (Math.sin(d * 1.5) * 4500) + (d * 150)) * factor);
    const bottles = Math.round(baseAmount / 320);
    const txns = Math.round(bottles * 0.52);

    data.push({
      label: `${d} ${now.toLocaleString('default', { month: 'short' })}`,
      day: d,
      amount: isFuture ? 0 : baseAmount,
      bottles: isFuture ? 0 : bottles,
      transactions: isFuture ? 0 : txns,
    });
  }

  return data;
}

export async function fetchShopMonthlySales(shopId = 1) {
  try {
    const res = await api.get(`/public/shop/${shopId}/sales/monthly`);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Fallback
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();

  return months.map((m, idx) => {
    const isFuture = idx > currentMonthIdx;
    const baseAmount = Math.round(580000 + Math.sin(idx * 0.8) * 85000 + idx * 8000);
    const bottles = Math.round(baseAmount / 315);
    const txns = Math.round(bottles * 0.5);

    return {
      label: m,
      monthIndex: idx + 1,
      amount: isFuture ? 0 : baseAmount,
      bottles: isFuture ? 0 : bottles,
      transactions: isFuture ? 0 : txns,
    };
  });
}

export async function fetchShopYearlySales(shopId = 1) {
  try {
    const res = await api.get(`/public/shop/${shopId}/sales/yearly`);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {
    // Fallback
  }

  const years = [2024, 2025, 2026];
  const amounts = [6450000, 7120000, 7850000];

  return years.map((y, i) => ({
    label: `${y}`,
    year: y,
    amount: amounts[i],
    bottles: Math.round(amounts[i] / 310),
    transactions: Math.round(amounts[i] / 650),
  }));
}
