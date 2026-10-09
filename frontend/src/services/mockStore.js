// ─── MOCK DATA STORE ────────────────────────────────────────────────────────

export const DAILY_BOTTLE_LIMIT   = 1;   // 1 bottle per person daily
export const MONTHLY_BOTTLE_LIMIT = 1;   // Alias for backward compatibility
export const BOTTLE_SIZE_ML       = 250; // 250 ml standard volume
export const DAILY_ML_LIMIT       = DAILY_BOTTLE_LIMIT * BOTTLE_SIZE_ML; // 250 ml
export const MIN_AGE              = 21;

// ─── SEED DATA ───────────────────────────────────────────────────────────────
export const USERS = [
  { id: 1, username: 'admin',     password: 'admin123', role: 'ADMIN' },
  { id: 2, username: 'shop1',     password: 'shop123',  role: 'SHOP'  },
  { id: 7, username: 'shop2',     password: 'shop123',  role: 'SHOP'  },
  { id: 3, username: 'customer1', password: 'cust123',  role: 'CUSTOMER' },
  { id: 4, username: 'customer2', password: 'cust123',  role: 'CUSTOMER' },
  { id: 5, username: 'customer3', password: 'cust123',  role: 'CUSTOMER' },
  { id: 6, username: 'customer4', password: 'cust123',  role: 'CUSTOMER' },
];

export const CUSTOMERS = [
  // age 29 — verified — 0 bottles today (250 ml / 1 bottle available today)
  { id: 1, userId: 3, name: 'Arun Kumar',    dob: '1995-06-15', dateOfBirth: '1995-06-15', age: 29, mobile: '9876543210', aadhaarNumber: 'XXXX-XXXX-1234', aadhaarId: 'MOCK-XXXX-1001', rfidCard: 'RFID-TN-8821', qrId: 'SADMS-CUSTOMER-1001', dailyLimit: 1, verified: true,  blocked: false },
  // age 26 — verified — 0 bottles today (250 ml / 1 bottle available today)
  { id: 2, userId: 4, name: 'Priya Devi',    dob: '1998-03-22', dateOfBirth: '1998-03-22', age: 26, mobile: '9876543211', aadhaarNumber: 'XXXX-XXXX-5678', aadhaarId: 'MOCK-XXXX-1002', rfidCard: 'RFID-TN-8822', qrId: 'SADMS-CUSTOMER-1002', dailyLimit: 1, verified: true,  blocked: false },
  // age 19 — under-age demo
  { id: 3, userId: 5, name: 'Ravi Shankar',  dob: '2005-11-05', dateOfBirth: '2005-11-05', age: 19, mobile: '9876543212', aadhaarNumber: 'XXXX-XXXX-9012', aadhaarId: 'MOCK-XXXX-1003', rfidCard: 'RFID-TN-8823', qrId: 'SADMS-CUSTOMER-1003', dailyLimit: 1, verified: true,  blocked: false },
  // age 24 — daily limit reached today (1/1 bottle, 250 ml claimed today)
  { id: 4, userId: 6, name: 'Karthik Raja',  dob: '2000-04-10', dateOfBirth: '2000-04-10', age: 24, mobile: '9876543213', aadhaarNumber: 'XXXX-XXXX-3456', aadhaarId: 'MOCK-XXXX-1004', rfidCard: 'RFID-TN-8824', qrId: 'SADMS-CUSTOMER-1004', dailyLimit: 1, verified: true,  blocked: false },
];

export const SHOPS = [
  {
    id: 1,
    userId: 2,
    name: 'Government Wine Shop - Anna Nagar, Chennai',
    locationType: 'City',
    locationName: 'Anna Nagar, Chennai',
    ownerName: 'Government of Tamil Nadu (TASMAC)',
    licenseNumber: 'TASMAC-TN-CHN-4012',
    address: 'Shop No. 4012, 2nd Avenue, Anna Nagar, Chennai - 600040',
    active: true,
  },
  {
    id: 2,
    userId: 7,
    name: 'Government Wine Shop - Alanganallur Village, Madurai',
    locationType: 'Village',
    locationName: 'Alanganallur Village, Madurai',
    ownerName: 'Government of Tamil Nadu (TASMAC)',
    licenseNumber: 'TASMAC-TN-MDU-2105',
    address: 'Shop No. 2105, Main Bazaar Road, Alanganallur Village, Madurai - 625501',
    active: true,
  },
];

export const PRODUCTS = [
  { id: 1, name: 'Royal Stag Whisky',  category: 'Whisky',  price: 450, availableQuantity: 42, bottleSizeMl: 250 },
  { id: 2, name: 'Kingfisher Beer',    category: 'Beer',    price: 120, availableQuantity: 18, bottleSizeMl: 250 },
  { id: 3, name: 'Old Monk Rum',       category: 'Rum',     price: 380, availableQuantity: 30, bottleSizeMl: 250 },
  { id: 4, name: 'Sula Red Wine',      category: 'Wine',    price: 520, availableQuantity: 15, bottleSizeMl: 250 },
  { id: 5, name: 'Smirnoff Vodka',     category: 'Vodka',   price: 650, availableQuantity: 25, bottleSizeMl: 250 },
  { id: 6, name: 'McDowell Brandy',    category: 'Brandy',  price: 320, availableQuantity: 5,  bottleSizeMl: 250 },
];

// Seed: Arun & Priya have 0 purchases today (250ml available), Karthik has 1 bottle today (daily quota full)
const _now = new Date();
const daysAgo = (n) => { const d = new Date(_now); d.setDate(d.getDate() - n); return d.toISOString(); };

export const TRANSACTIONS_SEED = [
  { id: 1, billNumber: 'SADMS-000101', customerId: 1, shopId: 1, productId: 1, quantity: 1, unitPrice: 450, totalAmount: 450, status: 'SUCCESS', createdAt: daysAgo(20) },
  { id: 2, billNumber: 'SADMS-000102', customerId: 1, shopId: 1, productId: 2, quantity: 1, unitPrice: 120, totalAmount: 120, status: 'SUCCESS', createdAt: daysAgo(10) },
  { id: 3, billNumber: 'SADMS-000103', customerId: 2, shopId: 2, productId: 3, quantity: 1, unitPrice: 380, totalAmount: 380, status: 'SUCCESS', createdAt: daysAgo(5)  },
  { id: 4, billNumber: 'SADMS-000104', customerId: 4, shopId: 1, productId: 1, quantity: 1, unitPrice: 450, totalAmount: 450, status: 'SUCCESS', createdAt: daysAgo(15) },
  { id: 5, billNumber: 'SADMS-000105', customerId: 4, shopId: 2, productId: 2, quantity: 1, unitPrice: 120, totalAmount: 120, status: 'SUCCESS', createdAt: new Date().toISOString() },
];

// ─── REACTIVE STATE ──────────────────────────────────────────────────────────
let _customers     = [...CUSTOMERS];
let _shops         = [...SHOPS];
let _products      = [...PRODUCTS];
let _transactions  = [...TRANSACTIONS_SEED];
let _rejected      = [];   // rejected sale attempts
let _notifications = [];   // simulated notifications
let _nextTxnId     = 6;
let _nextBillNo    = 106;
let _nextShopId    = 3;
let _nextRejId     = 1;
let _nextNotifId   = 1;

const listeners = new Set();
const notify = () => listeners.forEach(fn => fn());
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

// ─── GETTERS ─────────────────────────────────────────────────────────────────
export const getCustomers      = () => _customers;
export const getProducts       = () => _products;
export const getTransactions   = () => _transactions;
export const getRejected       = () => _rejected;
export const getNotifications  = () => _notifications;
export const getShops          = () => _shops;

export const getCustomerByUserId  = (uid)    => _customers.find(c => c.userId === uid);
export const getCustomerById      = (id)     => _customers.find(c => c.id === id);
export const getProductById       = (id)     => _products.find(p => p.id === id);
export const getShopByUserId      = (uid)    => _shops.find(s => s.userId === uid);
export const getShopById          = (id)     => _shops.find(s => s.id === id);
export const getCustomerByRfid    = (rfid)   => _customers.find(c => c.rfidCard === rfid);

// Lookup by masked Aadhaar (e.g. "XXXX-XXXX-1234")
export const getCustomerByAadhaar = (num) =>
  _customers.find(c => c.aadhaarNumber.trim() === num.trim());

// Lookup by QR identifier (e.g. "SADMS-CUSTOMER-1001")
export const getCustomerByQR = (qrId) =>
  _customers.find(c => c.qrId === qrId.trim());

// Daily 250ml bottle count for current day (per person daily limit)
export const getDailyPurchased = (customerId) => {
  const now = new Date();
  return _transactions
    .filter(t => {
      if (t.customerId !== customerId || t.status !== 'SUCCESS') return false;
      const d = new Date(t.createdAt);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    })
    .reduce((sum, t) => sum + t.quantity, 0);
};

// Alias to return daily purchased under per day 250 ml quota policy
export const getMonthlyPurchased = (customerId) => getDailyPurchased(customerId);

export const getCustomerBottleBalance = (customerId) => {
  const purchased = getDailyPurchased(customerId);
  const remaining = Math.max(0, DAILY_BOTTLE_LIMIT - purchased);
  const totalMlAllowed = DAILY_BOTTLE_LIMIT * BOTTLE_SIZE_ML; // 250 ml
  const totalMlPurchased = purchased * BOTTLE_SIZE_ML;
  const totalMlRemaining = remaining * BOTTLE_SIZE_ML;
  const percentUsed = Math.min(100, Math.round((purchased / DAILY_BOTTLE_LIMIT) * 100));

  let status = 'AVAILABLE';
  if (remaining === 0) status = 'EXHAUSTED';
  else if (remaining <= 0) status = 'LOW';

  return {
    dailyLimit: DAILY_BOTTLE_LIMIT,
    dailyPurchased: purchased,
    monthlyLimit: DAILY_BOTTLE_LIMIT,
    monthlyPurchased: purchased,
    bottleSizeMl: BOTTLE_SIZE_ML,
    remaining,
    totalMlAllowed,
    totalMlPurchased,
    totalMlRemaining,
    percentUsed,
    status,
  };
};

export const getTodayPurchased = (customerId) => {
  const today = new Date().toDateString();
  return _transactions
    .filter(t => t.customerId === customerId && new Date(t.createdAt).toDateString() === today && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.quantity, 0);
};

export const getTransactionsByCustomer = (cid) =>
  _transactions.filter(t => t.customerId === cid).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const getTransactionsByShop = (sid) =>
  _transactions.filter(t => t.shopId === sid).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const getTransactionById = (id) => _transactions.find(t => t.id === id);

// Today's shop stats
export const getShopTodayStats = (shopId) => {
  const today = new Date().toDateString();
  const todayTxns = _transactions.filter(t => t.shopId === shopId && new Date(t.createdAt).toDateString() === today && t.status === 'SUCCESS');
  const todayRej  = _rejected.filter(r => r.shopId === shopId && new Date(r.createdAt).toDateString() === today);
  const verifiedToday = new Set([...todayTxns.map(t => t.customerId), ...todayRej.map(r => r.customerId)]).size;
  return {
    todaySales:        todayTxns.reduce((s, t) => s + t.totalAmount, 0),
    todayTransactions: todayTxns.length,
    verifiedToday,
    rejectedToday:     todayRej.length,
    totalStock:        _products.reduce((s, p) => s + p.availableQuantity, 0),
  };
};

// ─── MUTATIONS ───────────────────────────────────────────────────────────────
export const blockCustomer = (customerId, blocked) => {
  _customers = _customers.map(c => c.id === customerId ? { ...c, blocked } : c);
  notify();
};

export const addProduct = (product) => {
  _products = [..._products, { ...product, id: _products.length + 1, price: Number(product.price), availableQuantity: Number(product.availableQuantity), bottleSizeMl: 250 }];
  notify();
};

export const addShop = (shopData) => {
  const newShop = {
    id: _nextShopId++,
    userId: 10 + _nextShopId,
    name: shopData.name || `Government Wine Shop - ${shopData.locationName}`,
    locationType: shopData.locationType || 'City',
    locationName: shopData.locationName || 'Tamil Nadu',
    ownerName: 'Government of Tamil Nadu (TASMAC)',
    licenseNumber: shopData.licenseNumber || `TASMAC-TN-${Math.floor(1000 + Math.random() * 9000)}`,
    address: shopData.address || `${shopData.locationName}`,
    active: true,
  };
  _shops = [..._shops, newShop];
  notify();
  return newShop;
};

export const toggleShopStatus = (shopId) => {
  _shops = _shops.map(s => s.id === shopId ? { ...s, active: !s.active } : s);
  notify();
};

// Record a rejected sale attempt + create notification if under-age
export const recordRejection = (customerId, shopId, reason, reasonCode) => {
  const customer = getCustomerById(customerId);
  const shop = _shops.find(s => s.id === shopId);
  const rejected = {
    id: _nextRejId++,
    customerId,
    shopId,
    customerName: customer?.name || 'Unknown',
    aadhaarNumber: customer?.aadhaarNumber || '',
    reason,
    reasonCode,
    createdAt: new Date().toISOString(),
  };
  _rejected = [rejected, ..._rejected];

  // Simulate notification for under-age attempts
  if (reasonCode === 'UNDER_AGE') {
    _notifications = [{
      id: _nextNotifId++,
      customerId,
      customerName: customer?.name,
      phone: customer?.mobile || '******0000',
      message: 'Under-age purchase attempt detected at ' + (shop?.name || 'Government Wine Shop'),
      reason: 'Under-age purchase attempt detected.',
      status: 'Notification Sent',
      createdAt: new Date().toISOString(),
    }, ..._notifications];
  }
  notify();
  return rejected;
};

// Complete a sale — enforces age >= 21 and monthly limit
export const sell = (customerId, productId, quantity, shopId) => {
  const customer = getCustomerById(customerId);
  const product  = getProductById(productId);
  const shop     = _shops.find(s => s.id === shopId) || _shops[0];

  if (!customer || !product || !shop) throw new Error('Invalid data');
  if (!customer.verified || customer.blocked) throw new Error('Customer is not verified or is blocked');
  if (customer.age < MIN_AGE) throw new Error(`Customer is below ${MIN_AGE} years old`);
  if (product.availableQuantity < quantity) throw new Error('Insufficient stock');

  const dailyPurchased = getDailyPurchased(customerId);
  const remaining = DAILY_BOTTLE_LIMIT - dailyPurchased;
  if (quantity > remaining) {
    throw new Error(
      remaining === 0
        ? `Daily limit reached. ${DAILY_BOTTLE_LIMIT * BOTTLE_SIZE_ML} ml (${DAILY_BOTTLE_LIMIT}/${DAILY_BOTTLE_LIMIT} bottle) purchased today.`
        : `Only ${remaining * BOTTLE_SIZE_ML} ml (${remaining} bottle(s)) remaining today.`
    );
  }

  _products = _products.map(p =>
    p.id === productId ? { ...p, availableQuantity: p.availableQuantity - quantity } : p
  );

  const billNumber = `SADMS-${String(_nextBillNo++).padStart(6, '0')}`;
  const txn = {
    id: _nextTxnId++, billNumber,
    customerId, shopId, productId, quantity,
    unitPrice: product.price,
    totalAmount: product.price * quantity,
    status: 'SUCCESS',
    createdAt: new Date().toISOString(),
  };
  _transactions = [txn, ..._transactions];
  notify();

  const dailyAfter = getDailyPurchased(customerId);
  return {
    ...txn,
    customerName:     customer.name,
    aadhaarNumber:    customer.aadhaarNumber,
    shopName:         shop.name,
    productName:      product.name,
    bottleSizeMl:     product.bottleSizeMl,
    dailyLimit:       DAILY_BOTTLE_LIMIT,
    dailyPurchased:   dailyAfter,
    dailyRemaining:   Math.max(0, DAILY_BOTTLE_LIMIT - dailyAfter),
    monthlyLimit:     DAILY_BOTTLE_LIMIT,
    monthlyPurchased: dailyAfter,
    monthlyRemaining: Math.max(0, DAILY_BOTTLE_LIMIT - dailyAfter),
  };
};

export const verifyCustomer = (customerId, aadhaarId) => {
  const generatedRfid = `RFID-TN-${Math.floor(1000 + Math.random() * 9000)}`;
  _customers = _customers.map(c =>
    c.id === customerId
      ? { ...c, aadhaarId, rfidCard: c.rfidCard || generatedRfid, verified: true }
      : c
  );
  notify();
  return getCustomerById(customerId);
};
