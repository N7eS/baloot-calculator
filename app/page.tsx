'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Round {
  us: number;
  them: number;
}

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [errText, setErrText] = useState<string>('');
  const [winnerMessage, setWinnerMessage] = useState<string>('');

  // دالة نطق محسنة
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // إيقاف أي نطق سابق لضمان عمل النطق الجديد
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const savedUsScore = localStorage.getItem('baloot_usScore');
    const savedThemScore = localStorage.getItem('baloot_themScore');
    const savedRounds = localStorage.getItem('baloot_rounds');

    if (savedUsScore) setUsScore(parseInt(savedUsScore));
    if (savedThemScore) setThemScore(parseInt(savedThemScore));
    if (savedRounds) setRounds(JSON.parse(savedRounds));
  }, []);

  const saveToStorage = (newUs: number, newThem: number, newRounds: Round[]) => {
    localStorage.setItem('baloot_usScore', newUs.toString());
    localStorage.setItem('baloot_themScore', newThem.toString());
    localStorage.setItem('baloot_rounds', JSON.stringify(newRounds));
  };

  const handleSubmit = () => {
    const usVal = usInput.trim() === '' ? 0 : parseInt(usInput);
    const themVal = themInput.trim() === '' ? 0 : parseInt(themInput);

    if (isNaN(usVal) || isNaN(themVal)) {
      setErrText('الرجاء إدخال أرقام صحيحة');
      speak('خطأ في إدخال الأرقام');
      return;
    }

    const total = usVal + themVal;
    const validBalootTotals = [16, 26, 36, 46, 52, 62, 66, 72, 76, 82, 86, 92, 96, 102, 106, 112, 116, 122, 126, 136, 142, 152, 162, 172, 212, 252, 262, 302, 352, 452, 552];

    if (!validBalootTotals.includes(total)) {
      setErrText('المجموع غير صحيح');
      speak('المجموع غير صحيح');
      return;
    }

    const newUsScore = usScore + usVal;
    const newThemScore = themScore + themVal;
    
    setUsScore(newUsScore);
    setThemScore(newThemScore);
    const updatedRounds = [{us: usVal, them: themVal}, ...rounds];
    setRounds(updatedRounds);
    
    speak(`لنا ${newUsScore} ولهم ${newThemScore}`);
    
    setErrText('');
    setUsInput('');
    setThemInput('');
    saveToStorage(newUsScore, newThemScore, updatedRounds);
  };

  const inputStyle = {
    width: '80%', 
    padding: '15px', 
    marginTop: '10px', 
    borderRadius: '10px', 
    border: '2px solid #C9A45C', 
    background: '#1C1F26', 
    color: '#FFFFFF', 
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1C1F26', color: '#E0E0E0', padding: '40px 20px', textAlign: 'center', direction: 'rtl' }}>
      <h1 style={{ color: '#C9A45C' }}>حاسبة البلوت</h1>
      
      {errText && <p style={{ color: '#ef4444', fontWeight: 'bold' }}>{errText}</p>}

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ background: '#C9A45C', padding: '20px', borderRadius: '16px', flex: 1 }}>
          <h3 style={{ color: '#1C1F26' }}>لنا: {usScore}</h3>
          <input type="number" value={usInput} onChange={(e) => setUsInput(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
        <div style={{ background: '#2A2E35', padding: '20px', borderRadius: '16px', flex: 1 }}>
          <h3 style={{ color: '#2E4A7D' }}>لهم: {themScore}</h3>
          <input type="number" value={themInput} onChange={(e) => setThemInput(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
      </div>

      <button onClick={handleSubmit} style={{ padding: '15px 50px', background: '#2E4A7D', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '18px' }}>إضافة القيد</button>

      <footer style={{ marginTop: '50px' }}>
        <span style={{ color: '#94a3b8' }}>Made By </span>
        <a href="https://na9er.net" target="_blank" style={{ color: '#C9A45C', fontWeight: '700' }}>Tech idea</a>
      </footer>
    </div>
  );
}