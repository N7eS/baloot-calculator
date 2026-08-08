'use client';
import { useState } from 'react';

export default function BalootCalculator() {
  const [usScore, setUsScore] = useState<number>(0);
  const [themScore, setThemScore] = useState<number>(0);
  
  const [usInput, setUsInput] = useState<string>('');
  const [themInput, setThemInput] = useState<string>('');
  
  const [gameType, setGameType] = useState<string>('sun_normal'); // صن عادي، دبل، حكم
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

    // التحقق من صحة المجموع بناءً على نوع اللعبة الأساسي
    let expectedTotal = 26; // افتراضي للصن العادي (باستثناء الأكل الأخير والبلوت)
    if (gameType === 'sun_double') expectedTotal = 52;
    if (gameType === 'hokm') expectedTotal = 16;

    // المجموع الأساسي بدون مشاريع يجب أن يتطابق مع القواعد أو يتم التنبيه
    const baseTotal = usVal + themVal;
    if (baseTotal !== expectedTotal && gameType !== 'hokm_flexible') {
      setErrorMessage(`خطأ في الحساب! مجموع النقاط الأساسية يجب أن يكون ${expectedTotal} لهذه اللعبة (المجموع المدخل: ${baseTotal})`);
      return;
    }

    setUsHistory(prev => [...prev, usScore]);
    setThemHistory(prev => [...prev, themScore]);

    // إضافة النقاط مع المشاريع
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
      setThemHistory(prev => prev.slice(0, prev.length - 1));
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
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '30px 15px', textAlign: 'center', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>حاسبة البلوت الذكية</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>التحقق التلقائي من الأخطاء وحساب الصن والحكم</p>

      {errorMessage && (
        <div style={{ background: '#ef4444', color: '#fff', padding: '10px', borderRadius: '8px', fontWeight: 'bold', maxWidth: '400px', margin: '0 auto 15px' }}>
          {errorMessage}
        </div>
      )}

      {winnerMessage && (
        <div style={{ background: '#22c55e', color: '#0f172a', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', maxWidth: '400px', margin: '0 auto 15px' }}>
          {winnerMessage}
        </div>
      )}

      {/* اختيار نوع اللعبة */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '14px', color: '#cbd5e1', marginLeft: '10px' }}>اختر نوع الجلسة:</label>
        <select 
          value={gameType} 
          onChange={(e) => setGameType(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', background: '#1e293b', color: '#fff', border: '1px solid #475569' }}
        >
          <option value="sun_normal">صن عادي (المجموع 26)</option>
          <option value="sun_double">صن دبل (المجموع 52)</option>
          <option value="hokm">حكم عادي (المجموع 16)</option>
          <option value="hokm_flexible">حكم / حر (بدون تقييد المجموع)</option>
        </select>
      </div>

      {/* إدخال النقاط */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px', maxWidth: '600px', margin: '0 auto 20px' }}>
        
        {/* لنا */}
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', flex: 1 }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '10px' }}>لنا</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>{usScore}</div>
          <input 
            type="number" 
            placeholder="نقاط لنا" 
            value={usInput}
            onChange={(e) => setUsInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', textAlign: 'center', marginBottom: '10px' }}
          />
          <select 
            value={projectUs} 
            onChange={(e) => setProjectUs(parseInt(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569' }}
          >
            <option value={0}>بدون مشاريع</option>
            <option value={10}>سرا (10)</option>
            <option value={20}>سراوين / أربعين (20/40)</option>
            <option value={50}>خمسين (50)</option>
            <option value={100}>مئة (100)</option>
            <option value={400}>أربع مئة (400)</option>
          </select>
        </div>

        {/* لهم */}
        <div style={{ background: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', flex: 1 }}>
          <h3 style={{ color: '#f43f5e', fontSize: '18px', marginBottom: '10px' }}>لهم</h3>
          <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px' }}>{themScore}</div>
          <input 
            type="number" 
            placeholder="نقاط لهم" 
            value={themInput}
            onChange={(e) => setThemInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff', textAlign: 'center', marginBottom: '10px' }}
          />
          <select 
            value={projectThem} 
            onChange={(e) => setProjectThem(parseInt(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: '1px solid #475569' }}
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