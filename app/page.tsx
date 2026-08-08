'use client';
import { useState, useRef } from 'react';

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');
  
  const [usHistory, setUsHistory] = useState<number[]>([]);
  const [themHistory, setThemHistory] = useState<number[]>([]);

  const [winnerMessage, setWinnerMessage] = useState<string>('');

  const finishAudio = useRef<HTMLAudioElement | null>(null);
  const specialAudio = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = () => {
    const usVal = parseInt(usInput) || 0;
    const themVal = parseInt(themInput) || 0;

    if (usVal === 0 && themVal === 0) return;

    setUsHistory(prev => [...prev, usScore]);
    setThemHistory(prev => [...prev, themScore]);

    const newUsScore = usScore + usVal;
    const newThemScore = themScore + themVal;

    setUsScore(newUsScore);
    setThemScore(newThemScore);

    setUsInput('');
    setThemInput('');

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
      setThemHistory(prev => prev.slice(0, prev.length - 1));
    }

    setWinnerMessage('');
  };

  const checkWin = (us: number, them: number) => {
    if ((us >= 50 && them === 0) || (them >= 50 && us === 0)) {
      if (specialAudio.current) specialAudio.current.play().catch(() => {});
    }
    if (us >= 152 || them >= 152) {
      const teamName = us > them ? 'لنا' : 'لهم';
      setWinnerMessage(`🎉 مبروك فوز فريق (${teamName}) بالجيّم!`);
      if (finishAudio.current) finishAudio.current.play().catch(() => {});
    }
  };

  const resetGame = () => {
    setUsScore(0);
    setThemScore(0);
    setUsInput('');
    setThemInput('');
    setUsHistory([]);
    setThemHistory([]);
    setWinnerMessage('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '30px 15px', textAlign: 'center', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
      <audio ref={finishAudio} src="/finish.mp3" preload="auto" />
      <audio ref={specialAudio} src="/special.mp3" preload="auto" />

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>حاسبة البلوت</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>نهاية اللعبة عند 152 نقطة</p>

      {winnerMessage && (
        <div style={{ background: '#22c55e', color: '#0f172a', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', maxWidth: '400px', margin: '0 auto 20px' }}>
          {winnerMessage}
        </div>
      )}

      {/* شاشات النتائج وخانات الإدخال */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px' }}>
        
        {/* فريق لنا */}
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', flex: 1 }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '10px' }}>لنا</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>{usScore}</div>
          <input 
            type="number" 
            placeholder="أدخل نقاط لنا" 
            value={usInput}
            onChange={(e) => setUsInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', textAlign: 'center', fontSize: '16px' }}
          />
        </div>

        {/* فريق لهم */}
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', flex: 1 }}>
          <h3 style={{ color: '#f43f5e', fontSize: '18px', marginBottom: '10px' }}>لهم</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>{themScore}</div>
          <input 
            type="number" 
            placeholder="أدخل نقاط لهم" 
            value={themInput}
            onChange={(e) => setThemInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', textAlign: 'center', fontSize: '16px' }}
          />
        </div>

      </div>

      {/* أزرار التحكم الموحدة في الأسفل */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '400px', margin: '0 auto 20px' }}>
        <button onClick={handleSubmit} style={{ flex: 2, padding: '12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          إضافة القيد
        </button>
        <button onClick={handleUndo} style={{ flex: 1, padding: '12px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          تراجع
        </button>
      </div>

      <button onClick={resetGame} style={{ padding: '8px 16px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
        تصفير اللعبة (جديد)
      </button>
    </div>
  );
}