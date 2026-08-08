'use client';
import { useState, useRef } from 'react';

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');
  
  // حفظ سجل النقاط لكل فريق لضمان عمل "التراجع" بدقة
  const [usHistory, setUsHistory] = useState<number[]>([]);
  const [themHistory, setThemHistory] = useState<number[]>([]);

  const [winnerMessage, setWinnerMessage] = useState<string>('');

  const finishAudio = useRef<HTMLAudioElement | null>(null);
  const specialAudio = useRef<HTMLAudioElement | null>(null);

  const addScore = (team: 'us' | 'them') => {
    if (team === 'us') {
      const val = parseInt(usInput);
      if (isNaN(val)) return;
      setUsHistory(prev => [...prev, usScore]);
      const newScore = usScore + val;
      setUsScore(newScore);
      setUsInput('');
      checkWin(newScore, themScore, 'لنا');
    } else {
      const val = parseInt(themInput);
      if (isNaN(val)) return;
      setThemHistory(prev => [...prev, themScore]);
      const newScore = themScore + val;
      setThemScore(newScore);
      setThemInput('');
      checkWin(usScore, newScore, 'لهم');
    }
  };

  const undoScore = (team: 'us' | 'them') => {
    if (team === 'us') {
      if (usHistory.length === 0) return;
      const previousScore = usHistory[usHistory.length - 1];
      setUsScore(previousScore);
      setUsHistory(prev => prev.slice(0, prev.length - 1));
      setWinnerMessage('');
    } else {
      if (themHistory.length === 0) return;
      const previousScore = themHistory[themHistory.length - 1];
      setThemScore(previousScore);
      setThemHistory(prev => prev.slice(0, prev.length - 1));
      setWinnerMessage('');
    }
  };

  const checkWin = (us: number, them: number, teamName: string) => {
    if ((us >= 50 && them === 0) || (them >= 50 && us === 0)) {
      if (specialAudio.current) specialAudio.current.play().catch(() => {});
    }
    if (us >= 152 || them >= 152) {
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

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px', maxWidth: '600px', margin: '0 auto 25px' }}>
        
        {/* فريق لنا */}
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', flex: 1 }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '10px' }}>لنا</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>{usScore}</div>
          <input 
            type="number" 
            placeholder="أدخل النقاط" 
            value={usInput}
            onChange={(e) => setUsInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', marginBottom: '10px', textAlign: 'center', fontSize: '16px' }}
          />
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => addScore('us')} style={{ flex: 1, padding: '10px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>إضافة</button>
            <button onClick={() => undoScore('us')} style={{ flex: 1, padding: '10px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>تراجع</button>
          </div>
        </div>

        {/* فريق لهم */}
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', flex: 1 }}>
          <h3 style={{ color: '#f43f5e', fontSize: '18px', marginBottom: '10px' }}>لهم</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>{themScore}</div>
          <input 
            type="number" 
            placeholder="أدخل النقاط" 
            value={themInput}
            onChange={(e) => setThemInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', marginBottom: '10px', textAlign: 'center', fontSize: '16px' }}
          />
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => addScore('them')} style={{ flex: 1, padding: '10px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>إضافة</button>
            <button onClick={() => undoScore('them')} style={{ flex: 1, padding: '10px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>تراجع</button>
          </div>
        </div>

      </div>

      <button onClick={resetGame} style={{ padding: '10px 20px', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
        تصفير اللعبة (جديد)
      </button>
    </div>
  );
}