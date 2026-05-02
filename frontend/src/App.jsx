import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/transactions';

  // Fetch transactions on load
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      console.warn("Backend unavailable, falling back to local storage");
      const localData = JSON.parse(localStorage.getItem('smartfinance_data')) || [];
      setTransactions(localData);
      setError("Demo Mode: Backend offline. Saving data locally in browser.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category || !date) return;

    const newTransaction = { title, amount: parseFloat(amount), category, date };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });
      
      if (!response.ok) throw new Error('Failed to add transaction');
      
      const addedTransaction = await response.json();
      setTransactions([addedTransaction, ...transactions]);
      
      setTitle('');
      setAmount('');
    } catch (err) {
      // Demo Mode Fallback
      const newTxFallback = { ...newTransaction, id: Date.now() };
      const updatedTransactions = [newTxFallback, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('smartfinance_data', JSON.stringify(updatedTransactions));
      
      setTitle('');
      setAmount('');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete transaction');
      
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      // Demo Mode Fallback
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      localStorage.setItem('smartfinance_data', JSON.stringify(updatedTransactions));
    }
  };

  // Calculations
  const totalExpenses = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="container">
      <header className="header">
        <h1>💳 SmartFinance Dashboard</h1>
        <p>Track your expenses in real-time</p>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-grid">
        {/* Left Column: Form */}
        <section className="card form-section">
          <h2>Add New Expense</h2>
          <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
              <label>Description</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g., Grocery Shopping" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Amount ($)</label>
              <input 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00" 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Food">🍔 Food</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Utilities">💡 Utilities</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">Add Expense</button>
          </form>
        </section>

        {/* Right Column: List & Stats */}
        <section className="list-section">
          <div className="stats-card">
            <h3>Total Expenses</h3>
            <div className="total-amount">${totalExpenses.toFixed(2)}</div>
          </div>

          <div className="card transaction-list">
            <h2>Recent Transactions</h2>
            {loading ? (
              <p>Loading data...</p>
            ) : transactions.length === 0 ? (
              <p className="empty-state">No transactions yet. Add one to get started!</p>
            ) : (
              <ul>
                {transactions.map((t) => (
                  <li key={t.id} className="transaction-item">
                    <div className="t-info">
                      <span className="t-title">{t.title}</span>
                      <span className="t-meta">{t.category} • {t.date}</span>
                    </div>
                    <div className="t-actions">
                      <span className="t-amount">-${t.amount.toFixed(2)}</span>
                      <button onClick={() => handleDelete(t.id)} className="btn-delete" title="Delete">
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
