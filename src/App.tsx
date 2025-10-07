import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [amount, setAmount] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const savedAmount = localStorage.getItem('amount');
    const savedRate = localStorage.getItem('rate');
    const savedStartDate = localStorage.getItem('startDate');
    const savedEndDate = localStorage.getItem('endDate');
    if (savedAmount) setAmount(savedAmount);
    if (savedRate) setRate(savedRate);
    if (savedStartDate) setStartDate(savedStartDate);
    if (savedEndDate) setEndDate(savedEndDate);
  }, []);

  useEffect(() => {
    localStorage.setItem('amount', amount);
    localStorage.setItem('rate', rate);
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
  }, [amount, rate, startDate, endDate]);

  const clearLocalStorage = () => {
    localStorage.removeItem('amount');
    localStorage.removeItem('rate');
    localStorage.removeItem('startDate');
    localStorage.removeItem('endDate');
  };

  const formatNumber = (value: string) => {
    const num = value.replace(/\s/g, '').replace(/,/g, '.');
    if (isNaN(Number(num)) || num === '') return value;
    return Number(num).toLocaleString('ru-RU');
  };

  const calculateInterest = () => {
    const numAmount = Number(amount.replace(/\s/g, ''));
    const numRate = Number(rate);
    if (numAmount <= 0 || numRate <= 0 || !startDate || !endDate) {
      alert('Пожалуйста, введите корректные данные');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      alert('Дата начала должна быть раньше даты окончания');
      return;
    }
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    const interest = numAmount * (numRate / 100) * (days / 365);
    setResult(interest);
    clearLocalStorage();
  };

  const copyToClipboard = async () => {
    if (result === null) return;
    const formattedAmount = Number(amount.replace(/\s/g, '')).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    const formattedInterest = result.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    const formattedStartDate = new Date(startDate).toLocaleDateString('ru-RU');
    const formattedEndDate = new Date(endDate).toLocaleDateString('ru-RU');
    const text = `Расчет процентов на сумму ${formattedAmount} за период с ${formattedStartDate} по ${formattedEndDate} равен ${formattedInterest}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Результат скопирован в буфер обмена!');
    } catch (err) {
      console.error('Ошибка копирования:', err);
      alert('Не удалось скопировать');
    }
  };

  return (
    <div className="app">
      <h1>Расчет процентов</h1>
      <form onSubmit={(e) => { e.preventDefault(); calculateInterest(); }}>
        <div className="form-group">
          <label htmlFor="amount">Текущая сумма:</label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(formatNumber(e.target.value.replace(/[^0-9.,\s]/g, '')))}
            placeholder="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="rate">Процентная ставка в год (%):</label>
          <input
            type="number"
            id="rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Срок от:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">Срок до:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Рассчитать</button>
      </form>
      {result !== null && (
        <div className="result">
          <h2>Результат: {result.toFixed(2)} рублей</h2>
          <button onClick={copyToClipboard}>Копировать результат</button>
        </div>
      )}
    </div>
  )
}

export default App
