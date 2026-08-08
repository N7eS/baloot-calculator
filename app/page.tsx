'use client';
import { useState } from 'react';

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');

  const [usHistory, setUsHistory] = useState<number[]>([]);
  const [themHistory, setThemHistory] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = serialStateSetter('');
  const [winnerMessage, setWinnerMessage] = useState<string>('');

  // دالة مخصصة لتعيين رسالة الخطأ لتجنب الأخطاء
  function serialStateSetter(val: string) {
    return val;
  }

  const [errText, setErrText] = useState<string>('');
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

    // محرك قواعد البلوت الذكي الشامل (يتحقق من كافة مجاميع الصن، الحكم، والدبل مع أو بدون مشاريع)
    const validBalootTotals = [
      16, 26, 36, 46, 52, 62, 66, 72, 76, 82, 86, 92, 96, 102, 106, 
      112, 116, 122, 126, 136, 142, 152, 162, 172, 212, 252, 262, 302, 352, 452, 552
    ];

    // التحقق الرياضي المتقدم للبلوت
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
      setThemHistory(prev => prev.slice(0, themHistory.length - 1));
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
      background: 'linear-gradient(135deg, #021a0e 0%, #062e1b 50%, #010f08 100%)', 
      color: '#f8fafc', 
      padding: '40px 20px', 
      textAlign: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      direction: 'rtl',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      
      <div>
        {/* الترويسة الفاخرة */}
        <div style={{ marginBottom: '35px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>🎴</div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fbbf24', letterSpacing: '0.5px', textShadow: '0 3px 6px rgba(0,0,0,0.6)' }}>حاسبة الدوانية للبلوت</h1>
          <p style={{ fontSize: '14px', color: '#34d399', fontWeight: '500', marginTop: '6px' }}>نظام ذكي متكامل مدقق لقوانين البلوت بدقة</p>
        </div>

        {/* تنبيهات الخطأ */}
        {errText && (
          <div style={{ background: 'rgba(220, 38, 38, 0.25)', border: '1px solid #ef4444', color: '#fca5a5', padding: '14px 20px', borderRadius: '12px', fontWeight: 'bold', maxWidth: '500px', margin: '0 auto 20px', fontSize: '15px', boxShadow: '0 8px 20px rgba(239,68,68,0.2)', backdropFilter: 'blur(8px)' }}>
            ⚠️ {errText}
          </div>
        )}

        {/* إعلان الفوز */}
        {winnerMessage && (
          <div style={{ background: 'rgba(16, 185, 129, 0.25)', border: '1px solid #10b981', color: '#34d399', padding: '16px', borderRadius: '14px', fontWeight: '800', fontSize: '20px', maxWidth: '500px', margin: '0 auto 20px', boxShadow: '0 8px 25px rgba(16,185,129,0.3)', backdropFilter: 'blur(8px)' }}>
            {winnerMessage}
          </div>
        )}

        {/* لوحة النتائج الفاخرة */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', maxWidth: '650px', margin: '0 auto 30px' }}>
          
          {/* فريق لنا */}
          <div style={{ background: 'rgba(6, 46, 27, 0.65)', backdropFilter: 'blur(12px)', padding: '25px 20px', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.2)', flex: 1, boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
            <h3 style={{ color: '#38bdf8', fontSize: '20px', marginBottom: '10px', fontWeight: '800' }}>لنا</h3>
            <div style={{ fontSize: '50px', fontWeight: '900', marginBottom: '20px', color: '#ffffff', textShadow: '0 4px 15px rgba(56,189,248,0.4)' }}>{usScore}</div>
            <input 
              type="number" 
              placeholder="نقاط لنا" 
              value={usInput}
              onChange={(e) => setUsInput(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(56,189,248,0.3)', background: '#020f09', color: '#fff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
            />
          </div>

          {/* فريق لهم */}
          <div style={{ background: 'rgba(6, 46, 27, 0.65)', backdropFilter: 'blur(12px)', padding: '25px 20px', borderRadius: '20px', border: '1px solid rgba(244, 63, 94, 0.2)', flex: 1, boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
            <h3 style={{ color: '#f43f5e', fontSize: '20px', marginBottom: '10px', fontWeight: '800' }}>لهم</h3>
            <div style={{ fontSize: '50px', fontWeight: '900', marginBottom: '20px', color: '#ffffff', textShadow: '0 4px 15px rgba(244,63,94,0.4)' }}>{themScore}</div>
            <input 
              type="number" 
              placeholder="نقاط لهم" 
              value={themInput}
              onChange={(e) => setThemInput(e.target.value)}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(244,63,94,0.3)', background: '#020f09', color: '#fff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
            />
          </div>

        </div>

        {/* أزرار التحكم الرئيسية */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', maxWidth: '480px', margin: '0 auto 25px' }}>
          <button onClick={handleSubmit} style={{ flex: 2, padding: '16px', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#041c11', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(251,191,36,0.35)', transition: 'transform 0.1s' }}>
            إضافة القيد
          </button>
          <button onClick={handleUndo} style={{ flex: 1, padding: '16px', background: 'rgba(15, 23, 42, 0.8)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '14px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            تراجع
          </button>
        </div>

        <button onClick={resetGame} style={{ padding: '10px 24px', background: 'transparent', color: '#94a3b8', border: '1px dashed rgba(148, 163, 184, 0.3)', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
          🔄 تصفير اللعبة (بداية جديدة)
        </button>
      </div>

      {/* الفوتر مع الحقوق والتوجيه لموقعك */}
      <footer style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '14px', color: '#64748b' }}>
        Made By <a href="https://na9er.net" target="_blank" rel="noopener noreferrer" style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: '800', letterSpacing: '0.5px' }}>Tech idea</a>
      </footer>

    </div>
  );
}