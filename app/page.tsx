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

  // تشغيل صوت الخطأ (error.mp3)
  const playErrorSound = () => {
    try {
      const audio = new Audio('/error.mp3');
      audio.play().catch(e => console.log("Audio play blocked:", e));
    } catch (err) {
      console.log(err);
    }
  };

  // تشغيل صوت الفوز (finish.mp3)
  const playFinishSound = () => {
    try {
      const audio = new Audio('/finish.mp3');
      audio.play().catch(e => console.log("Audio play blocked:", e));
    } catch (err) {
      console.log(err);
    }
  };

  // النطق الصوتي يعمل فقط عند الضغط على زر "جم القيد؟"
  const speakResult = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `النتيجة حالياً، لنا ${usScore} ولهم ${themScore}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
  };

  const showErr = (msg: string) => {
    setErrText(msg);
    playErrorSound(); // تشغيل ملف الصوت الخاص بالخطأ فقط
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
      playFinishSound(); // تشغيل ملف الصوت الخاص بالفوز فقط
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

        {/* حاوية مربعات الفريقين مع السجلات تحتها */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px', maxWidth: '650px', margin: '0 auto 25px', alignItems: 'flex-start' }}>
          
          {/* فريق لنا */}
          <div style={{ background: '#C9A45C', padding: '25px 20px', borderRadius: '16px', border: '1px solid #b8934b', flex: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <h3 style={{ color: '#1C1F26', fontSize: '18px', marginBottom: '10px', fontWeight: '800' }}>لنا</h3>
            <div style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', color: '#1C1F26' }}>{usScore}</div>
            <input 
              type="number" 
              placeholder="نقاط لنا" 
              value={usInput}
              onChange={(e) => setUsInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #b8934b', background: '#1C1F26', color: '#E0E0E0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', outline: 'none', marginBottom: '15px' }}
            />
            
            {rounds.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                {rounds.map((round, index) => (
                  <div key={index} style={{ background: '#b8934b', color: '#1C1F26', padding: '10px', borderRadius: '8px', fontWeight: '900', fontSize: '18px', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    {round.us}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* فريق لهم */}
          <div style={{ background: '#2A2E35', padding: '25px 20px', borderRadius: '16px', border: '1px solid #3A3F48', flex: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <h3 style={{ color: '#2E4A7D', fontSize: '18px', marginBottom: '10px', fontWeight: '700' }}>لهم</h3>
            <div style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', color: '#E0E0E0' }}>{themScore}</div>
            <input 
              type="number" 
              placeholder="نقاط لهم" 
              value={themInput}
              onChange={(e) => setThemInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #3A3F48', background: '#1C1F26', color: '#E0E0E0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', outline: 'none', marginBottom: '15px' }}
            />

            {rounds.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                {rounds.map((round, index) => (
                  <div key={index} style={{ background: '#1C1F26', color: '#E0E0E0', padding: '10px', borderRadius: '8px', fontWeight: '900', fontSize: '18px', textAlign: 'center', border: '1px solid #3A3F48' }}>
                    {round.them}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', maxWidth: '480px', margin: '0 auto 15px' }}>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '14px', background: '#2E4A7D', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(46,74,125,0.4)' }}>
            إضافة القيد
          </button>
          <button onClick={handleUndo} style={{ flex: 1, padding: '14px', background: '#2A2E35', color: '#E0E0E0', border: '1px solid #3A3F48', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            تراجع
          </button>
        </div>

        <div style={{ maxWidth: '480px', margin: '0 auto 15px' }}>
          <button onClick={speakResult} style={{ width: '100%', padding: '12px', background: '#C9A45C', color: '#1C1F26', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer' }}>
            🎙️ جم القيد؟
          </button>
        </div>

        <button onClick={resetGame} style={{ padding: '10px 22px', background: 'transparent', color: '#C9A45C', border: '1px solid #3A3F48', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginBottom: '30px' }}>
          لعبة جديدة
        </button>

      </div>

      <footer style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', textAlign: 'center' }}>
        <span style={{ color: '#94a3b8' }}>Made By </span>
        <a href="https://na9er.net" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A45C', fontWeight: '700', textDecoration: 'none' }}>Tech idea</a>
      </footer>

    </div>
  );
}