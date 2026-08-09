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

  useEffect(() => {
    const savedUs = localStorage.getItem('baloot_usScore');
    const savedThem = localStorage.getItem('baloot_themScore');
    const savedRounds = localStorage.getItem('baloot_rounds');
    if (savedUs) setUsScore(parseInt(savedUs));
    if (savedThem) setThemScore(parseInt(savedThem));
    if (savedRounds) setRounds(JSON.parse(savedRounds));
  }, []);

  // دالة النطق عند الطلب فقط (جم القيد؟)
  const speakResult = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `النتيجة حالياً، لنا ${usScore} ولهم ${themScore}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    const usVal = parseInt(usInput) || 0;
    const themVal = parseInt(themInput) || 0;
    if (usVal === 0 && themVal === 0) return;

    const newUs = usScore + usVal;
    const newThem = themScore + themVal;
    const newRounds = [{us: usVal, them: themVal}, ...rounds];

    setUsScore(newUs);
    setThemScore(newThem);
    setRounds(newRounds);

    localStorage.setItem('baloot_usScore', newUs.toString());
    localStorage.setItem('baloot_themScore', newThem.toString());
    localStorage.setItem('baloot_rounds', JSON.stringify(newRounds));
    setUsInput('');
    setThemInput('');
  };

  const resetGame = () => {
    setUsScore(0); setThemScore(0); setRounds([]);
    localStorage.clear();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1C1F26', color: '#E0E0E0', padding: '40px 20px', textAlign: 'center', direction: 'rtl', fontFamily: 'system-ui' }}>
      {/* اللوجو والعنوان */}
      <div style={{ marginBottom: '30px' }}>
        <Image src="/logo.png" alt="Logo" width={48} height={48} style={{ margin: '0 auto', display: 'block' }} />
        <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#C9A45C', marginTop: '10px' }}>حاسبة البلوت</h1>
      </div>

      {/* مربعات النتيجة */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', maxWidth: '650px', margin: '0 auto 25px' }}>
        <div style={{ background: '#C9A45C', padding: '20px', borderRadius: '16px', flex: 1 }}>
          <h3 style={{ color: '#1C1F26', fontWeight: '800' }}>لنا</h3>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#1C1F26' }}>{usScore}</div>
          <input type="number" value={usInput} onChange={(e) => setUsInput(e.target.value)} placeholder="0" style={{ width: '80%', padding: '10px', borderRadius: '8px', border: 'none', background: '#1C1F26', color: '#FFF', textAlign: 'center', marginTop: '10px' }} />
        </div>
        <div style={{ background: '#2A2E35', padding: '20px', borderRadius: '16px', flex: 1 }}>
          <h3 style={{ color: '#2E4A7D', fontWeight: '800' }}>لهم</h3>
          <div style={{ fontSize: '40px', fontWeight: '900' }}>{themScore}</div>
          <input type="number" value={themInput} onChange={(e) => setThemInput(e.target.value)} placeholder="0" style={{ width: '80%', padding: '10px', borderRadius: '8px', border: 'none', background: '#1C1F26', color: '#FFF', textAlign: 'center', marginTop: '10px' }} />
        </div>
      </div>

      {/* الأزرار */}
      <button onClick={handleSubmit} style={{ padding: '15px 40px', background: '#2E4A7D', color: '#FFF', border: 'none', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px' }}>إضافة القيد</button>
      <br />
      <button onClick={speakResult} style={{ padding: '12px 30px', background: '#C9A45C', color: '#1C1F26', borderRadius: '50px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>🎙️ جم القيد؟</button>

      {/* سجل الجولات */}
      {rounds.length > 0 && (
        <div style={{ maxWidth: '480px', margin: '0 auto', background: '#2A2E35', padding: '15px', borderRadius: '14px' }}>
          <h4 style={{ color: '#C9A45C' }}>سجل الجولات</h4>
          {rounds.map((r, i) => <div key={i} style={{ borderBottom: '1px solid #333', padding: '5px' }}>لنا: {r.us} | لهم: {r.them}</div>)}
        </div>
      )}

      <footer style={{ marginTop: '50px', padding: '20px' }}>
        <span style={{ color: '#94a3b8' }}>Made By </span>
        <a href="https://na9er.net" target="_blank" style={{ color: '#C9A45C', fontWeight: '700' }}>Tech idea</a>
      </footer>
    </div>
  );
}