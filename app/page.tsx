'use client';
import { useState, useEffect } from 'react';

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');

  // استرجاع البيانات عند فتح الصفحة
  useEffect(() => {
    const savedUs = localStorage.getItem('baloot_us');
    const savedThem = localStorage.getItem('baloot_them');
    if (savedUs) setUsScore(parseInt(savedUs));
    if (savedThem) setThemScore(parseInt(savedThem));
  }, []);

  // دالة نطق النتيجة عند الطلب فقط
  const speakResult = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `النتيجة حالياً، لنا ${usScore} ولهم ${themScore}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    const usVal = parseInt(usInput) || 0;
    const themVal = parseInt(themInput) || 0;
    
    const newUs = usScore + usVal;
    const newThem = themScore + themVal;
    
    setUsScore(newUs);
    setThemScore(newThem);
    
    localStorage.setItem('baloot_us', newUs.toString());
    localStorage.setItem('baloot_them', newThem.toString());
    
    setUsInput('');
    setThemInput('');
  };

  const resetGame = () => {
    setUsScore(0);
    setThemScore(0);
    localStorage.clear();
  };

  // تصميم مربعات الإدخال
  const inputStyle = {
    width: '90%',
    padding: '12px',
    marginTop: '10px',
    borderRadius: '8px',
    border: '2px solid #C9A45C',
    background: '#1C1F26',
    color: '#FFF',
    textAlign: 'center' as const,
    fontSize: '18px'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1C1F26', color: '#FFF', padding: '40px 20px', textAlign: 'center', direction: 'rtl' }}>
      <h1 style={{ color: '#C9A45C', marginBottom: '30px' }}>حاسبة البلوت</h1>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
        {/* صندوق لنا */}
        <div style={{ background: '#2A2E35', padding: '20px', borderRadius: '16px', flex: 1, border: '1px solid #3A3F48' }}>
          <h3 style={{ color: '#C9A45C' }}>لنا: {usScore}</h3>
          <input type="number" value={usInput} onChange={(e) => setUsInput(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
        
        {/* صندوق لهم */}
        <div style={{ background: '#2A2E35', padding: '20px', borderRadius: '16px', flex: 1, border: '1px solid #3A3F48' }}>
          <h3 style={{ color: '#2E4A7D' }}>لهم: {themScore}</h3>
          <input type="number" value={themInput} onChange={(e) => setThemInput(e.target.value)} placeholder="0" style={inputStyle} />
        </div>
      </div>

      <button onClick={handleSubmit} style={{ padding: '15px 40px', background: '#2E4A7D', color: '#FFF', border: 'none', borderRadius: '10px', fontSize: '18px', cursor: 'pointer', marginBottom: '20px' }}>
        إضافة القيد
      </button>

      {/* زر السؤال الصوتي */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={speakResult} style={{ padding: '15px 30px', background: '#C9A45C', color: '#1C1F26', borderRadius: '50px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
          🎙️ جم القيد؟
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={resetGame} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '12px' }}>تصفير اللعبة</button>
      </div>

      <footer style={{ marginTop: '60px', borderTop: '1px solid #333', paddingTop: '20px' }}>
        <span style={{ color: '#94a3b8' }}>Made By </span>
        <a href="https://na9er.net" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A45C', fontWeight: '700', textDecoration: 'none' }}>Tech idea</a>
      </footer>
    </div>
  );
}