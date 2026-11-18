import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, ArrowLeftRight, Tags, Settings, Search, Plus, Bell,
  ChevronDown, Wallet, TrendingUp, TrendingDown, CreditCard, MoreHorizontal,
  Pencil, Trash2, X, LogOut, Menu, CalendarDays, Filter, Download, Sparkles
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const seedTransactions = [
  { id: 1, title: 'Monthly salary', category: 'Salary', date: '2026-11-01', amount: 42000, type: 'income', note: 'November salary' },
  { id: 2, title: 'Apartment rent', category: 'Housing', date: '2026-11-02', amount: 9500, type: 'expense', note: '' },
  { id: 3, title: 'Grocery shopping', category: 'Food', date: '2026-11-04', amount: 1850, type: 'expense', note: 'Weekly groceries' },
  { id: 4, title: 'Freelance design', category: 'Freelance', date: '2026-11-06', amount: 6500, type: 'income', note: '' },
  { id: 5, title: 'Internet bill', category: 'Utilities', date: '2026-11-08', amount: 799, type: 'expense', note: '' },
  { id: 6, title: 'Cafe with friends', category: 'Food', date: '2026-11-10', amount: 620, type: 'expense', note: '' },
  { id: 7, title: 'Bus pass', category: 'Transport', date: '2026-11-12', amount: 900, type: 'expense', note: '' },
  { id: 8, title: 'Online course', category: 'Education', date: '2026-11-14', amount: 1200, type: 'expense', note: '' },
]

const categories = ['Food', 'Transport', 'Housing', 'Utilities', 'Shopping', 'Health', 'Education', 'Entertainment', 'Salary', 'Freelance', 'Other']
const money = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
const readStore = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback } catch { return fallback }
}

function App() {
  const [user, setUser] = useState(() => readStore('spendly-user', null))
  const [transactions, setTransactions] = useState(() => readStore('spendly-transactions', seedTransactions))
  const [active, setActive] = useState('Overview')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => localStorage.setItem('spendly-transactions', JSON.stringify(transactions)), [transactions])
  useEffect(() => {
    if (user) localStorage.setItem('spendly-user', JSON.stringify(user))
    else localStorage.removeItem('spendly-user')
  }, [user])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const totals = useMemo(() => transactions.reduce((a, t) => {
    a[t.type] += Number(t.amount)
    return a
  }, { income: 0, expense: 0 }), [transactions])
  const balance = totals.income - totals.expense
  const visible = useMemo(() => transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => `${t.title} ${t.category} ${t.note}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [transactions, filter, query])

  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((day, i) => {
      const dayTransactions = transactions.filter(t => new Date(t.date).getDay() === (i + 1) % 7)
      return { day, income: dayTransactions.filter(t => t.type === 'income').reduce((s,t) => s + Number(t.amount), 0),
        expense: dayTransactions.filter(t => t.type === 'expense').reduce((s,t) => s + Number(t.amount), 0) }
    })
  }, [transactions])
  const categoryData = useMemo(() => {
    const sums = {}
    transactions.filter(t => t.type === 'expense').forEach(t => { sums[t.category] = (sums[t.category] || 0) + Number(t.amount) })
    return Object.entries(sums).map(([name, value]) => ({ name, value }))
  }, [transactions])
  const colors = ['#7767ed', '#27b6a4', '#f2a65a', '#e87891', '#4c9bd6', '#a58bd8', '#83b56b']

  function saveTransaction(data) {
    if (editing) {
      setTransactions(current => current.map(t => t.id === editing.id ? { ...data, id: editing.id } : t))
      setToast('Transaction updated')
    } else {
      setTransactions(current => [{ ...data, id: Date.now() }, ...current])
      setToast('Transaction added')
    }
    setModal(false); setEditing(null)
  }
  function deleteTransaction(id) {
    setTransactions(current => current.filter(t => t.id !== id))
    setToast('Transaction deleted')
  }
  function openEdit(t) { setEditing(t); setModal(true) }
  function openAdd() { setEditing(null); setModal(true) }
  function exportCSV() {
    const rows = [['Title','Category','Date','Type','Amount','Note'], ...transactions.map(t => [t.title,t.category,t.date,t.type,t.amount,t.note])]
    const csv = rows.map(row => row.map(v => `"${String(v ?? '').replaceAll('"','""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = 'spendly-transactions.csv'; link.click(); URL.revokeObjectURL(link.href)
    setToast('CSV exported')
  }

  if (!user) return <Login onLogin={setUser} />

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'show' : ''}`}>
      <div className="brand"><div className="brand-mark"><Wallet size={19}/></div><span>spendly</span></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>
        {[['Overview', LayoutDashboard], ['Transactions', ArrowLeftRight], ['Categories', Tags]].map(([name, Icon]) =>
          <button key={name} className={`nav-item ${active === name ? 'selected' : ''}`} onClick={() => {setActive(name);setMobileNav(false)}}>
            <Icon size={18}/><span>{name}</span>{name === 'Transactions' && <span className="nav-count">{transactions.length}</span>}
          </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={16}/></div><strong>Make money mindful.</strong><p>Small steps today, better habits tomorrow.</p></div>
        <button className="nav-item" onClick={() => setToast('Settings are coming soon')}><Settings size={18}/><span>Settings</span></button>
        <div className="profile-mini"><div className="avatar">{user.name.slice(0,1).toUpperCase()}</div><div className="profile-text"><strong>{user.name}</strong><span>Personal account</span></div><button className="icon-button" title="Log out" onClick={() => setUser(null)}><LogOut size={16}/></button></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Menu/></button>
        <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
        <div className="top-actions"><div className="date-chip"><CalendarDays size={15}/> November 2026</div><button className="icon-button notification" onClick={() => setToast('You are all caught up')}><Bell size={18}/><i/></button><div className="top-avatar">{user.name.slice(0,1).toUpperCase()}</div></div>
      </header>

      <div className="page-content">
        <section className="welcome-row">
          <div><div className="eyebrow">YOUR FINANCIAL SNAPSHOT</div><h1>{active === 'Overview' ? `Good day, ${user.name.split(' ')[0]}!` : active}</h1><p>{active === 'Overview' ? 'Here’s what’s happening with your money.' : 'Keep your money organized and your goals in sight.'}</p></div>
          <button className="primary-button" onClick={openAdd}><Plus size={17}/> Add transaction</button>
        </section>

        {active === 'Categories' ? <Categories data={categoryData} colors={colors}/> :
        <>{active === 'Overview' && <>
          <section className="stats-grid">
            <Stat title="Total balance" value={money(balance)} icon={Wallet} tone="purple" change="Available balance"/>
            <Stat title="Total income" value={money(totals.income)} icon={TrendingUp} tone="green" change="Money coming in"/>
            <Stat title="Total expenses" value={money(totals.expense)} icon={TrendingDown} tone="orange" change="Money going out"/>
            <Stat title="Transactions" value={transactions.length} icon={CreditCard} tone="blue" change="All recorded activity"/>
          </section>
          <section className="dashboard-grid">
            <div className="panel chart-panel"><div className="panel-heading"><div><h2>Cash flow</h2><p>Income and expenses by weekday</p></div><span className="period-pill">This week <ChevronDown size={14}/></span></div>
              <div className="chart-legend"><span><i className="legend-income"/> Income</span><span><i className="legend-expense"/> Expenses</span></div>
              <div className="area-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:8,right:8,left:-18,bottom:0}}><defs><linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7868ed" stopOpacity={.22}/><stop offset="95%" stopColor="#7868ed" stopOpacity={0}/></linearGradient><linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2bb6a4" stopOpacity={.18}/><stop offset="95%" stopColor="#2bb6a4" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#eef0f5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:'#9299a8',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#9299a8',fontSize:11}} tickFormatter={v => v >= 1000 ? `${v/1000}k` : v}/><Tooltip formatter={v => money(v)} contentStyle={{border:'1px solid #eceef3',borderRadius:12,fontSize:12}}/><Area type="monotone" dataKey="income" stroke="#7868ed" strokeWidth={2.5} fill="url(#incomeFill)"/><Area type="monotone" dataKey="expense" stroke="#2bb6a4" strokeWidth={2.5} fill="url(#expenseFill)"/></AreaChart></ResponsiveContainer></div>
            </div>
            <div className="panel category-panel"><div className="panel-heading"><div><h2>Spending breakdown</h2><p>Where your money goes</p></div><button className="dots-button" onClick={() => setActive('Categories')}><MoreHorizontal/></button></div>
              {categoryData.length ? <><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={61} outerRadius={83} paddingAngle={3} stroke="none">{categoryData.map((entry,i)=><Cell key={entry.name} fill={colors[i%colors.length]}/>)}</Pie><Tooltip formatter={v => money(v)}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{money(totals.expense)}</strong><span>Total spent</span></div></div><div className="category-legend">{categoryData.slice(0,4).map((c,i)=><div key={c.name}><span><i style={{background:colors[i%colors.length]}}/>{c.name}</span><strong>{money(c.value)}</strong></div>)}</div></> : <Empty text="Add an expense to see your breakdown."/>}
            </div>
          </section>
        </>}
        <section className="panel transactions-panel">
          <div className="panel-heading transaction-heading"><div><h2>{active === 'Overview' ? 'Recent transactions' : 'All transactions'}</h2><p>Track and manage your activity</p></div><div className="table-actions"><div className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search transactions"/></div><select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filter transactions"><option value="all">All types</option><option value="income">Income</option><option value="expense">Expenses</option></select><button className="export-button" onClick={exportCSV}><Download size={15}/> Export</button></div></div>
          <TransactionTable items={active === 'Overview' ? visible.slice(0,5) : visible} onEdit={openEdit} onDelete={deleteTransaction}/>
          {active === 'Overview' && <button className="view-all" onClick={()=>setActive('Transactions')}>View all transactions <span>→</span></button>}
        </section></>}
      </div>
    </main>
    {modal && <TransactionModal initial={editing} onClose={()=>{setModal(false);setEditing(null)}} onSave={saveTransaction}/>}
    {toast && <div className="toast">{toast}</div>}
  </div>
}

function Login({ onLogin }) {
  const [name,setName] = useState('Apoorva')
  const [email,setEmail] = useState('hello@example.com')
  const [error,setError] = useState('')
  function submit(e) { e.preventDefault(); if (!name.trim() || !email.includes('@')) {setError('Enter your name and a valid email address.');return} onLogin({name:name.trim(),email:email.trim()}) }
  return <div className="login-screen"><div className="login-card"><div className="brand login-brand"><div className="brand-mark"><Wallet size={19}/></div><span>spendly</span></div><div className="login-art"><div className="login-art-circle"><Wallet size={30}/></div><div className="floating-card"><span>YOUR BALANCE</span><strong>₹ 24,850</strong><i>↗ &nbsp;Looking good</i></div></div><h1>Money, made simpler.</h1><p className="login-copy">Sign in to your personal finance space and make every rupee count.</p><form onSubmit={submit} className="login-form"><label>Your name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name"/></label><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>{error && <div className="form-error">{error}</div>}<button className="primary-button login-submit">Continue to Spendly <span>→</span></button></form><small className="demo-note">Demo authentication · No password required</small></div><div className="login-footer">A calmer way to manage your money.</div></div>
}

function Stat({title,value,icon:Icon,tone,change}) { return <div className="stat-card"><div className="stat-top"><span>{title}</span><div className={`stat-icon ${tone}`}><Icon size={18}/></div></div><strong className="stat-value">{value}</strong><div className="stat-foot"><span className="status-dot"/> {change}</div></div> }

function TransactionTable({items,onEdit,onDelete}) {
  if (!items.length) return <Empty text="No transactions found. Try another search or add a transaction."/>
  return <div className="table-scroll"><table><thead><tr><th>TRANSACTION</th><th>CATEGORY</th><th>DATE</th><th>AMOUNT</th><th>TYPE</th><th></th></tr></thead><tbody>{items.map(t=><tr key={t.id}><td><div className="transaction-name"><div className={`transaction-symbol ${t.type}`}>{t.type==='income'?<TrendingUp size={16}/>:<CreditCard size={16}/>}</div><div><strong>{t.title}</strong><span>{t.note || (t.type==='income'?'Money received':'Payment')}</span></div></div></td><td><span className="category-tag">{t.category}</span></td><td className="date-cell">{new Date(`${t.date}T00:00:00`).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td><td className={`amount-cell ${t.type}`}>{t.type==='income'?'+':'−'}{money(Number(t.amount))}</td><td><span className={`type-pill ${t.type}`}>{t.type}</span></td><td><div className="row-actions"><button title="Edit" onClick={()=>onEdit(t)}><Pencil size={15}/></button><button title="Delete" onClick={()=>onDelete(t.id)}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div>
}
function Empty({text}) { return <div className="empty-state"><div><ArrowLeftRight size={20}/></div><p>{text}</p></div> }
function Categories({data,colors}) { return <section className="categories-grid">{data.length ? data.map((c,i)=><div className="panel category-card" key={c.name}><div className="category-color" style={{background:colors[i%colors.length]}}/><div><span>{c.name}</span><strong>{money(c.value)}</strong><small>Expense total</small></div></div>) : <div className="panel"><Empty text="Your expense categories will appear here once you add transactions."/></div>}</section> }

function TransactionModal({initial,onClose,onSave}) {
  const [form,setForm] = useState(initial || {title:'',category:'Food',date:new Date().toISOString().slice(0,10),amount:'',type:'expense',note:''})
  const [error,setError] = useState('')
  function update(key,value) { setForm(current=>({...current,[key]:value})) }
  function submit(e) { e.preventDefault(); if(!form.title.trim() || !form.amount || Number(form.amount)<=0 || !form.date) {setError('Please complete the title, date and a valid amount.');return} onSave({...form,title:form.title.trim(),amount:Number(form.amount),note:form.note.trim()}) }
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal"><div className="modal-heading"><div><span className="eyebrow">TRANSACTION DETAILS</span><h2>{initial?'Edit transaction':'Add transaction'}</h2></div><button className="icon-button" onClick={onClose}><X/></button></div><form onSubmit={submit} className="transaction-form"><label>Transaction name<input autoFocus value={form.title} onChange={e=>update('title',e.target.value)} placeholder="e.g. Grocery shopping"/></label><div className="form-row"><label>Type<select value={form.type} onChange={e=>update('type',e.target.value)}><option value="expense">Expense</option><option value="income">Income</option></select></label><label>Category<select value={form.category} onChange={e=>update('category',e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></label></div><div className="form-row"><label>Amount (₹)<input type="number" min="1" step="1" value={form.amount} onChange={e=>update('amount',e.target.value)} placeholder="0"/></label><label>Date<input type="date" value={form.date} onChange={e=>update('date',e.target.value)}/></label></div><label>Note <span className="optional">(optional)</span><textarea rows="3" value={form.note} onChange={e=>update('note',e.target.value)} placeholder="Add a short note..."/></label>{error&&<div className="form-error">{error}</div>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{initial?'Save changes':'Add transaction'}</button></div></form></div></div>
}

export default App
