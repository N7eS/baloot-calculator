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

  // دالة النطق (Text-to-Speech)
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const savedUsScore = localStorage.getItem('baloot_usScore');
    const savedThemScore = localStorage.getItem('baloot_themScore');
    const savedRounds = localStorage.getItem('baloot_rounds');
    const savedWinner = localStorage.getItem('baloot_winner');

    if (savedUsScore) setUsScore(parseInt(savedUsScore));
    if (savedThemScore) setThemScore(parseInt(savedThemScore));
    if (savedRounds) setRounds(JSON.parse(savedRounds));
    if (savedWinner) setWinnerMessage(savedWinner);
  }, []);

  const saveToStorage = (newUs: number, newThem: number, newRounds: Round[], winner: string) => {
    localStorage.setItem('baloot_usScore', newUs.toString());
    localStorage.setItem('baloot_themScore', newThem.toString());
    localStorage.setItem('baloot_rounds', JSON.stringify(newRounds));
    localStorage.setItem('baloot_winner', winner);
  };

  const showErr = (msg: string) => {
    setErrText(msg);
    speak(msg); // نطق الخطأ صوتياً
    setTimeout(() => setErrText(''), 5000);
  };

  const handleSubmit = () => {
    setErrText('');
    const usVal = usInput.trim() === '' ? 0 : parseInt(usInput);
    const themVal = themInput.trim() === '' ? 0 : parseInt(themInput);

    if (isNaN(usVal) || isNaN(themVal)) {
      showErr('الرجاء إدخال أرقام صحيحة');
      return;
    }

    if (usVal === 0 && themVal === 0) return;

    const total = usVal + themVal;
    const validBalootTotals = [
      16, 26, 36, 46, 52, 62, 66, 72, 76, 82, 86, 92, 96, 102, 106, 
      112, 116, 122, 126, 136, 142, 152, 162, 172, 212, 252, 262, 302, 352, 452, 552
    ];

    if (!validBalootTotals.includes(total)) {
      showErr(`خطأ في الحساب! المجموع ${total} غير صحيح.`);
      return;
    }

    const newRound: Round = { us: usVal, them: themVal };
    const updatedRounds = [newRound, ...rounds];
    const newUsScore = usScore + usVal;
    const newThemScore = themScore + themVal;

    // نطق النتيجة الحالية
    speak(`لنا ${newUsScore} ولهم ${newThemScore}`);

    let newWinner = '';
    if (newUsScore >= 152 || newThemScore >= 152) {
      const teamName = newUsScore > newThemScore ? 'لنا' : 'لهم';
      newWinner = `🎉 مبروك فوز فريق (${teamName}) بالجيّم!`;
      speak(`مبروك فوز فريق ${teamName}`);
    }

    setUsScore(newUsScore);
    setThemScore(newThemScore);
    setRounds(updatedRounds);
    setWinnerMessage(newWinner);
    setUsInput('');
    setThemInput('');
    saveToStorage(newUsScore, newThemScore, updatedRounds, newWinner);
  };

  const handleUndo = () => {
    if (rounds.length === 0) return;
    const lastRound = rounds[0];
    const updatedRounds = rounds.slice(1);
    const newUsScore = usScore - lastRound.us;
    const newThemScore = themScore - lastRound.them;

    setUsScore(newUsScore);
    setThemScore(newThemScore);
    setRounds(updatedRounds);
    setWinnerMessage('');
    saveToStorage(newUsScore, newThemScore, updatedRounds, '');
    speak('تم التراجع عن آخر قيد');
  };

  const resetGame = () => {
    setUsScore(0);
    setThemScore(0);
    setRounds([]);
    setWinnerMessage('');
    localStorage.clear();
    speak('تم بدء لعبة جديدة');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1C1F26', color: '#E0E0E0', padding: '40px 20px', textAlign: 'center', direction: 'rtl', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ marginBottom: '30px', alignItems: 'center' }}>
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#C9A45C' }}>حاسبة البلوت</h1>
        </div>

        {errText && <div style={{ background: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>{errText}</div>}
        {winnerMessage && <div style={{ background: 'rgba(46, 74, 125, 0.3)', color: '#C9A45C', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold' }}>{winnerMessage}</div>}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px' }}>
          <div style={{ background: '#C9A45C', padding: '20px', borderRadius: '16px', flex: 1 }}>
            <h3 style={{ color: '#1C1F26' }}>لنا</h3>
            <div style={{ fontSize: '40px', fontWeight: '900', color: '#1C1F26' }}>{usScore}</div>
            <input type="number" value={usInput} onChange={(e) => setUsInput(e.target.value)} placeholder="نقاط لنا" style={{ width: '90%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: 'none', textAlign: 'center' }} />
          </div>
          <div style={{ background: '#2A2E35', padding: '20px', borderRadius: '16px', flex: 1 }}>
            <h3 style={{ color: '#2E4A7D' }}>لهم</h3>
            <div style={{ fontSize: '40px', fontWeight: '900' }}>{themScore}</div>
            <input type="number" value={themInput} onChange={(e) => setThemInput(e.target.value)} placeholder="نقاط لهم" style={{ width: '90%', padding: '10px', marginTop: '10px', borderRadius: '8px', border: 'none', textAlign: 'center' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
          <button onClick={handleSubmit} style={{ padding: '15px 40px', background: '#2E4A7D', color: '#FFF', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>إضافة القيد</button>
          <button onClick={handleUndo} style={{ padding: '15px 20px', background: '#3A3F48', color: '#FFF', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>تراجع</button>
        </div>
        
        <button onClick={resetGame} style={{ background: 'transparent', color: '#C9A45C', border: '1px solid #3A3F48', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>لعبة جديدة</button>
      </div>

      <footer style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid #333' }}>
        <span style={{ color: '#94a3b8' }}>Made By </span>
        <a href="https://na9er.net" target="_blank" style={{ color: '#C9A45C', fontWeight: '700', textDecoration: 'none' }}>Tech idea</a>
      </footer>
    </div>
  );
}