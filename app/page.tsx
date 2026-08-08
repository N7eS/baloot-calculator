'use client';
import { useState } from 'react';

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');
  
  const [projectUs, setProjectUs] = useState<number>(0);
  const [projectThem, setProjectThem] = useState<number>(0);

  const [usHistory, setUsHistory] = useState<number[]>([]);
  const [themHistory, setThemHistory] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [winnerMessage, setWinnerMessage] = useState<string>('');

  const handleSubmit = () => {
    setErrorMessage('');
    const usVal = parseInt(usInput) || 0;
    const themVal = parseInt(themInput) || 0;

    if (usVal === 0 && themVal === 0 && projectUs === 0 && projectThem === 0) return;

    const baseTotal = usVal + themVal;
    
    // التحقق الذكي والأوتوماتيكي لمجاميع البلوت الصحيحة (16 للحكم، 26 للصن العادي، 52 للصن الدبل)
    const validTotals = [16, 26, 52];
    if (!validTotals.includes(baseTotal)) {
      setErrorMessage(`خطأ في الحساب! مجموع النقاط الأساسية (${baseTotal}) غير صحيح. المجاميع المقبولة للبلوت هي 16 (حكم)، 26 (صن)، أو 52 (دبل).`);
      return;
    }

    setUsHistory(prev => [...prev, usScore]);
    setThemHistory(prev => [...prev, themScore]);

    const newUsScore = usScore + usVal + projectUs;
    const newThemScore = themScore + themVal + projectThem;

    setUsScore(newUsScore);
    setThemScore(newThemScore);

    setUsInput('');
    setThemInput('');
    setProjectUs(0);
    setProjectThem(0);

    checkWin(newUsScore, newThemScore);
  };

  const handleUndo = () => {
    if (usHistory.length === 0 && themHistory.length === 0) return;

    if (usHistory.length > 0) {
      setUsScore(usHistory[usHistory.length - 1]);
      setUsHistory(prev => prev.slice(0, prev.length - 1));
    }
    if (themHistory.length > 0) {
      setThemScore(themHistory[themHistory.length - 1]);
      setThemHistory(prev => prev.slice(0, themHistory.length - 1));
    }
    setErrorMessage('');
    setWinnerMessage('');
  };

  const checkWin = (us: number, them: number) => {
    if (us >= 152 || them >= 152) {
      const teamName = us > them ? 'لنا' : 'لهم';
      setWinnerMessage(`🎉 مبروك فوز فريق (${teamName}) بالجيّم!`);
    }
  };

  const resetGame = () => {
    setUsScore(0);
    setThemScore(0);
    setUsInput('');
    setThemInput('');
    setProjectUs(0);
    setProjectThem(0);
    setUsHistory([]);
    setThemHistory([]);
    setErrorMessage('');
    setWinnerMessage('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at center, #0f2d21 0%, #06150e 100%)', 
      color: '#f8fafc', 
      padding: '30px 15px', 
      textAlign: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      direction: 'rtl',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      
      <div>
        {/* الهيدر */}
        <div style={{ marginBottom: '30px' }}>
          <span style={{ fontSize: '32px' }}>🃏</span>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fbbf24', marginTop: '5px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>حاسبة البلوت</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>ذكاء اصطناعي يتحقق من الأخطاء أوتوماتيكياً</p>
        </div>

        {/* تنبيهات الخطأ والفوز */}
        {errorMessage && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px', borderRadius: '8px', fontWeight: 'bold', maxWidth: '450px', margin: '0 auto 20px', fontSize: '14px' }}>
            {errorMessage}
          </div>
        )}

        {winnerMessage && (
          <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#86efac', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px', maxWidth: '450px', margin: '0 auto 20px' }}>
            {winnerMessage}
          </div>
        )}

        {/* لوحة النتائج والإدخال */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px', maxWidth: '650px', margin: '0 auto 25px' }}>
          
          {/* فريق لنا */}
          <div style={{ background: 'rgba(9, 38, 26, 0.8)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', border: '1px solid #14532d', flex: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
            <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '8px', fontWeight: '700' }}>لنا</h3>
            <div style={{ fontSize: '42px', fontWeight: '900', marginBottom: '15px', color: '#fff', textShadow: '0 2px 10px rgba(56,189,248,0.3)' }}>{usScore}</div>
            <input 
              type="number" 
              placeholder="نقاط لنا" 
              value={usInput}
              onChange={(e) => setUsInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e3a8a', background: '#030712', color: '#fff', textAlign: 'center', marginBottom: '10px', fontSize: '16px', outline: 'none' }}
            />
            <select 
              value={projectUs} 
              onChange={(e) => setProjectUs(parseInt(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#030712', color: '#cbd5e1', border: '1px solid #1e3a8a', fontSize: '13px', outline: 'none' }}
            >
              <option value={0}>بدون مشاريع</option>
              <option value={10}>سرا (10)</option>
              <option value={20}>سراوين / أربعين (20/40)</option>
              <option value={50}>خمسين (50)</option>
              <option value={100}>مئة (100)</option>
              <option value={400}>أربع مئة (400)</option>
            </select>
          </div>

          {/* فريق لهم */}
          <div style={{ background: 'rgba(9, 38, 26, 0.8)', backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '16px', border: '1px solid #14532d', flex: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
            <h3 style={{ color: '#f43f5e', fontSize: '18px', marginBottom: '8px', fontWeight: '700' }}>لهم</h3>
            <div style={{ fontSize: '42px', fontWeight: '900', marginBottom: '15px', color: '#fff', textShadow: '0 2px 10px rgba(244,63,94,0.3)' }}>{themScore}</div>
            <input 
              type="number" 
              placeholder="نقاط لهم" 
              value={themInput}
              onChange={(e) => setThemInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #881337', background: '#030712', color: '#fff', textAlign: 'center', marginBottom: '10px', fontSize: '16px', outline: 'none' }}
            />
            <select 
              value={projectThem} 
              onChange={(e) => setProjectThem(parseInt(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#030712', color: '#cbd5e1', border: '1px solid #881337', fontSize: '13px', outline: 'none' }}
            >
              <option value={0}>بدون مشاريع</option>
              <option value={10}>سرا (10)</option>
              <option value={20}>سراوين / أربعين (20/40)</option>
              <option value={50}>خمسين (50)</option>
              <option value={100}>مئة (100)</option>
              <option value={400}>أربع مئة (400)</option>
            </select>
          </div>

        </div>

        {/* أزرار التحكم الموحدة */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', maxWidth: '450px', margin: '0 auto 20px' }}>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#06150e', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '17px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(251,191,36,0.3)' }}>
            إضافة القيد
          </button>
          <button onClick={handleUndo} style={{ flex: 1, padding: '14px', background: '#1e293b', color: '#f87171', border: '1px solid #475569', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
            تراجع
          </button>
        </div>

        <button onClick={resetGame} style={{ padding: '8px 20px', background: 'transparent', color: '#94a3b8', border: '1px dashed #334155', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
          🔄 تصفير اللعبة (جديد)
        </button>
      </div>

      {/* الفوتر مع الحقوق ورابط موقعك */}
      <footer style={{ marginTop: '40px', padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: '#64748b' }}>
        Made By <a href="https://na9er.net" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 'bold' }}>Tech idea</a>
      </footer>

    </div>
  );
}