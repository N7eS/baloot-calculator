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
    try {
      const audio = new Audio('/error.mp3');
      audio.play().catch(e => console.log("Audio play blocked:", e));
    } catch (err) {
      console.log(err);
    }
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
      showErr(`خطأ في الحساب! مجموع النقاط (${total}) لا يوافق أي من قوانين البلوت الصحيحة.`);
      return;
    }

    const newRound: Round = { us: usVal, them: themVal };
    const updatedRounds = [newRound, ...rounds];

    const newUsScore = usScore + usVal;
    const newThemScore = themScore + themVal;

    let newWinner = '';
    if (newUsScore >= 152 || newThemScore >= 152) {
      const teamName = newUsScore > newThemScore ? 'لنا' : 'لهم';
      newWinner = `🎉 مبروك فوز فريق (${teamName}) بالجيّم!`;
      
      try {
        const audio = new Audio('/finish.mp3');
        audio.play().catch(e => console.log("Audio play blocked:", e));
      } catch (err) {
        console.log(err);
      }
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
    setErrText('');

    saveToStorage(newUsScore, newThemScore, updatedRounds, '');
  };

  const resetGame = () => {
    setUsScore(0);
    setThemScore(0);
    setUsInput('');
    setThemInput('');
    setRounds([]);
    setErrText('');
    setWinnerMessage('');

    localStorage.removeItem('baloot_usScore');
    localStorage.removeItem('baloot_themScore');
    localStorage.removeItem('baloot_rounds');
    localStorage.removeItem('baloot_winner');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1C1F26', 
      color: '#E0E0E0', 
      padding: '40px 20px', 
      textAlign: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      direction: 'rtl',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      
      <div>
        <div style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '10px' }}>
            <Image src="/logo.png" alt="Logo" width={48} height={48} style={{ objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#C9A45C', letterSpacing: '0.5px' }}>حاسبة البلوت</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '400', marginTop: '6px' }}>نظام دقيق ومحترف لإدارة القيود</p>
        </div>

        {errText && (
          <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '14px 20px', borderRadius: '10px', fontWeight: 'bold', maxWidth: '500px', margin: '0 auto 20px', fontSize: '14px' }}>
            ⚠️ {errText}
          </div>
        )}

        {winnerMessage && (
          <div style={{ background: 'rgba(46, 74, 125, 0.3)', border: '1px solid #2E4A7D', color: '#C9A45C', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '18px', maxWidth: '500px', margin: '0 auto 20px' }}>
            {winnerMessage}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', maxWidth: '650px', margin: '0 auto 25px' }}>
          
          <div style={{ background: '#C9A45C', padding: '25px 20px', borderRadius: '16px', border: '1px solid #b8934b', flex: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <h3 style={{ color: '#1C1F26', fontSize: '18px', marginBottom: '10px', fontWeight: '800' }}>لنا</h3>
            <div style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', color: '#1C1F26' }}>{usScore}</div>
            <input 
              type="number" 
              placeholder="نقاط لنا" 
              value={usInput}
              onChange={(e) => setUsInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #b8934b', background: '#1C1F26', color: '#E0E0E0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', outline: 'none' }}
            />
          </div>

          <div style={{ background: '#2A2E35', padding: '25px 20px', borderRadius: '16px', border: '1px solid #3A3F48', flex: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <h3 style={{ color: '#2E4A7D', fontSize: '18px', marginBottom: '10px', fontWeight: '700' }}>لهم</h3>
            <div style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', color: '#E0E0E0' }}>{themScore}</div>
            <input 
              type="number" 
              placeholder="نقاط لهم" 
              value={themInput}
              onChange={(e) => setThemInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3A3F48', background: '#1C1F26', color: '#E0E0E0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', outline: 'none' }}
            />
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', maxWidth: '480px', margin: '0 auto 20px' }}>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '14px', background: '#2E4A7D', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(46,74,125,0.4)' }}>
            إضافة القيد
          </button>
          <button onClick={handleUndo} style={{ flex: 1, padding: '14px', background: '#2A2E35', color: '#E0E0E0', border: '1px solid #3A3F48', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            تراجع
          </button>
        </div>

        <button onClick={resetGame} style={{ padding: '10px 22px', background: 'transparent', color: '#C9A45C', border: '1px solid #3A3F48', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginBottom: '30px' }}>
          لعبة جديدة
        </button>

        {rounds.length > 0 && (
          <div style={{ maxWidth: '480px', margin: '0 auto', background: '#2A2E35', borderRadius: '14px', border: '1px solid #3A3F48', padding: '15px', textAlign: 'right' }}>
            <h4 style={{ fontSize: '15px', color: '#C9A45C', marginBottom: '12px', textAlign: 'center', fontWeight: '700' }}>سجل الجولات السابقة</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {rounds.map((round, index) => {
                const roundNum = rounds.length - index;
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#1C1F26', borderRadius: '8px', border: '1px solid #3A3F48', fontSize: '14px' }}>
                    <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>جولة {roundNum}</span>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <span style={{ color: '#C9A45C' }}>لنا: <b>{round.us}</b></span>
                      <span style={{ color: '#E0E0E0' }}>لهم: <b>{round.them}</b></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <footer style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', textAlign: 'center' }}>
        <span style={{ color: '#94a3b8' }}>Made By </span>
        <a 
          href="https://na9er.net" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ color: '#C9A45C', fontWeight: '700', textDecoration: 'none' }}
        >
          Tech idea
        </a>
      </footer>

    </div>
  );
}