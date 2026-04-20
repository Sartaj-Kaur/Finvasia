export const MOCK_USER = {
  name: 'Jaskaran Singh',
  age: 21,
  agent: 'VOLT',
  income: 72500,
  daysLeft: 10,
  topPattern: '14 Zomato orders this month',
};

export const MOCK_BUDGETS = {
  food:          { limit: 8000,  spent: 6200 },
  transport:     { limit: 3000,  spent: 1100 },
  subscriptions: { limit: 2500,  spent: 2849 },
  shopping:      { limit: 6000,  spent: 3200 },
};

export const MOCK_TRANSACTIONS = [
  { id:'t1', merchant:'Zomato',        category:'Food',      amount:850,   date:'2026-04-20', type:'debit',  scanned:true },
  { id:'t2', merchant:'HDFC Bank',     category:'Income',    amount:72500, date:'2026-04-01', type:'credit', scanned:false },
  { id:'t3', merchant:'Netflix',       category:'Subs',      amount:649,   date:'2026-04-03', type:'debit',  scanned:false },
  { id:'t4', merchant:'Reliance Smart',category:'Groceries', amount:1240,  date:'2026-04-18', type:'debit',  scanned:true },
  { id:'t5', merchant:'Uber',          category:'Transport', amount:320,   date:'2026-04-19', type:'debit',  scanned:false },
];

export const MOCK_RECEIPTS = [
  { id:'r1', merchant:'Starbucks',        category:'Food',      amount:1131.56, date:'2026-04-11', confidence:94 },
  { id:'r2', merchant:'Indian Railways',  category:'Transport', amount:902.19,  date:'2026-03-18', confidence:0  },
  { id:'r3', merchant:'Amazon',           category:'Shopping',  amount:673.19,  date:'2026-03-18', confidence:89 },
  { id:'r4', merchant:'BigBasket',        category:'Groceries', amount:1840.00, date:'2026-04-15', confidence:97 },
  { id:'r5', merchant:'Uber',             category:'Transport', amount:234.00,  date:'2026-04-19', confidence:91 },
];

export const MOCK_MICRO = {
  total: 4230,
  cashbacks: [
    { merchant:'Zomato Pro',    amount:120,  date:'2026-04-01' },
    { merchant:'Amazon Pay',    amount:340,  date:'2026-04-05' },
    { merchant:'PhonePe',       amount:280,  date:'2026-04-08' },
    { merchant:'Swiggy One',    amount:190,  date:'2026-04-12' },
    { merchant:'Flipkart',      amount:910,  date:'2026-04-18' },
  ],
  billSavings: [
    { type:'Electricity',  saved:340 },
    { type:'OTT Bundle',   saved:450 },
    { type:'Mobile Plan',  saved:400 },
  ],
  roundups: 1200,
};

export const MOCK_BILLS_DUE = [
  { id:'b1', name:'Airtel Mobile', amount:399,  dueDate:'2026-04-21', operator:'Airtel' },
  { id:'b2', name:'Tata Power',    amount:1840, dueDate:'2026-04-23', operator:'TPDDL'  },
  { id:'b3', name:'Jio Fiber',     amount:999,  dueDate:'2026-04-25', operator:'Jio'    },
];
