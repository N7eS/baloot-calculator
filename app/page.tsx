'use client';
import { useState } from 'react';

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');

  const [usHistory, setUsHistory] = useState<number[]>([]);
  const [themHistory, setThemHistory] = useState<number[]>([]);

  const [errText, setErrText] = useState<string>('');
  const [winnerMessage, setWinnerMessage] = useState<string>('');

  const showErr = (msg: string) => {
    setErrText(msg);
    setTimeout(() => setErrText(''), 5000);
  };

  const handleSubmit = () => {
    setErrText('');
    const usVal = parseInt(usInput);
    const themVal = parseInt(themInput);

    if (isNaN(usVal) || isNaN(themVal)) {
      showErr('الرجاء إدخال أرقام صحيحة للفريقين');
      return;
    }

    if (usVal === 0 && themVal === 0) return;

    const total = usVal + themVal;

    const validBalootTotals = [
      16, 26, 36, 46, 52, 62, 66, 72, 76, 82, 86, 92, 96, 102, 106, 
      112, 116, 122, 126, 136, 142, 152, 162, 172, 212, 252, 262, 302, 352, 452, 552
    ];

    if (!validBalootTotals.includes(total)) {
      showErr(`خطأ في الحساب! مجموع النقاط (${total}) لا يوافق أي من قوانين وحسابات البلوت الصحيحة (صن، حكم، مشاريع). تأكد من المدخلات.`);
      return;
    }

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
    setErrText('');
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
    setUsHistory([]);
    setThemHistory([]);
    setErrText('');
    setWinnerMessage('');
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
        {/* الترويسة الرسمية الفخمة */}
        <div style={{ marginBottom: '35px' }}>
          <div style={{ fontSize: '38px', marginBottom: '8px' }}>🎴</div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#C9A45C', letterSpacing: '0.5px' }}>حاسبة البلوت الرسمية</h1>
          <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '400', marginTop: '6px' }}>نظام دقيق ومحترف لإدارة القيود</p>
        </div>

        {/* تنبيهات الخطأ */}
        {errText && (
          <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '14px 20px', borderRadius: '10px', fontWeight: 'bold', maxWidth: '500px', margin: '0 auto 20px', fontSize: '14px' }}>
            ⚠️ {errText}
          </div>
        )}

        {/* إعلان الفوز */}
        {winnerMessage && (
          <div style={{ background: 'rgba(46, 74, 125, 0.3)', border: '1px solid #2E4A7D', color: '#C9A45C', padding: '16px', borderRadius: '12px', fontWeight: '800', fontSize: '18px', maxWidth: '500px', margin: '0 auto 20px' }}>
            {winnerMessage}
          </div>
        )}

        {/* لوحة النتائج الفخمة */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', maxWidth: '650px', margin: '0 auto 30px' }}>
          
          {/* فريق لنا (مميز باللون الذهبي الهادئ) */}
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

          {/* فريق لهم */}
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

        {/* أزرار التحكم الرئيسية */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', maxWidth: '480px', margin: '0 auto 25px' }}>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '14px', background: '#2E4A7D', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(46,74,125,0.4)' }}>
            إضافة القيد
          </button>
          <button onClick={handleUndo} style={{ flex: 1, padding: '14px', background: '#2A2E35', color: '#E0E0E0', border: '1px solid #3A3F48', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            تراجع
          </button>
        </div>

        <button onClick={resetGame} style={{ padding: '10px 22px', background: 'transparent', color: '#C9A45C', border: '1px solid #3A3F48', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
          لعبة جديدة
        </button>
      </div>

      {/* الفوتر مع الحقوق والتوجيه لموقعك */}
      <footer style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: '#94a3b8' }}>
        Made By <a href="https://na9er.net" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A45C', textDecoration: 'none', fontWeight: '700' }}>Tech idea</a>
      </footer>

    </div>
  );
}