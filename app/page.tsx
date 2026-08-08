'use client';
import { useState, useRef } from 'react';

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');
  
  const finishAudio = useRef<HTMLAudioElement | null>(null);
  const specialAudio = useRef<HTMLAudioElement | null>(null);

  const addScore = (team: 'us' | 'them') => {
    if (team === 'us') {
      const val = parseInt(usInput) || 0;
      const newScore = usScore + val;
      setUsScore(newScore);
      setUsInput('');
      checkConditions(newScore, themScore);
    } else {
      const val = parseInt(themInput) || 0;
      const newScore = themScore + val;
      setThemScore(newScore);
      setThemInput('');
      checkConditions(usScore, newScore);
    }
  };

  const undoScore = (team: 'us' | 'them') => {
    if (team === 'us') {
      const val = parseInt(usInput) || 0;
      setUsScore(Math.max(0, usScore - val));
      setUsInput('');
    } else {
      const val = parseInt(themInput) || 0;
      setThemScore(Math.max(0, themScore - val));
      setThemInput('');
    }
  };

  const checkConditions = (us: number, them: number) => {
    if ((us >= 50 && them === 0) || (them >= 50 && us === 0)) {
      if (specialAudio.current) specialAudio.current.play().catch(() => {});
    }
    if (us >= 152 || them >= 152) {
      if (finishAudio.current) finishAudio.current.play().catch(() => {});
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '30px 15px', textAlign: 'center', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
      <audio ref={finishAudio} src="/finish.mp3" preload="auto" />
      <audio ref={specialAudio} src="/special.mp3" preload="auto" />

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>حاسبة البلوت</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
        {/* فريق لنا */}
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', flex: 1 }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '10px' }}>لنا</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>{usScore}</div>
          <input 
            type="number" 
            placeholder="النقاط" 
            value={usInput}
            onChange={(e) => setUsInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', marginBottom: '10px', textAlign: 'center' }}
          />
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => addScore('us')} style={{ flex: 1, padding: '8px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>إضافة</button>
            <button onClick={() => undoScore('us')} style={{ flex: 1, padding: '8px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>تراجع</button>
          </div>
        </div>

        {/* فريق لهم */}
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', flex: 1 }}>
          <h3 style={{ color: '#f43f5e', fontSize: '18px', marginBottom: '10px' }}>لهم</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>{themScore}</div>
          <input 
            type="number" 
            placeholder="النقاط" 
            value={themInput}
            onChange={(e) => setThemInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', marginBottom: '10px', textAlign: 'center' }}
          />
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => addScore('them')} style={{ flex: 1, padding: '8px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>إضافة</button>
            <button onClick={() => undoScore('them')} style={{ flex: 1, padding: '8px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>تراجع</button>
          </div>
        </div>
      </div>
    </div>
  );
}