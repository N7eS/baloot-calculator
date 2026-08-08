'use client';
import { useEffect, useState } from 'react';

export default function BalootCalculator() {
  const [score, setScore] = useState({ us: 0, them: 0 });
  const [lastCommand, stL] = useState('تحدث الآن، قل: كم النتيجة، أو زيد لنا');

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = true;
      recognition.interimResults = true; // عشان يلقط الكلام وهو ينقال

      recognition.onresult = (event: any) => {
        const text = event.results[event.results.length - 1][0].transcript.trim();
        stL(`سمعت: "${text}"`);
        
        // شروط مرنة جداً للتعرف على الصوت
        if (text.includes('نتيجة') || text.includes('كم') || text.includes('البلوت')) {
          speak(`النتيجة يا أبو عبدالله، لنا ${score.us} ولهم ${score.them}`);
        } else if (text.includes('زيد لنا') || text.includes('لنا')) {
          setScore(prev => ({ ...prev, us: prev.us + 50 }));
          speak('تم إضافة خمسين لنا');
        } else if (text.includes('زيد لهم') || text.includes('لهم')) {
          setScore(prev => ({ ...prev, them: prev.them + 50 }));
          speak('تم إضافة خمسين لهم');
        }
      };

      recognition.onerror = (e: any) => console.log(e);
      
      try {
        recognition.start();
      } catch (e) {
        console.log(e);
      }
    }
  }, [score]);

  const speak = (text: string) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'ar-SA';
    window.speechSynthesis.speak(msg);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '40px 20px', textAlign: 'center', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>حاسبة البلوت الصوتية</h1>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '30px' }}>الاستماع التلقائي يعمل في الخلفية</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#38bdf8', fontSize: '18px', marginBottom: '8px' }}>لنا</h3>
          <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{score.us}</span>
        </div>
        <div style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#f43f5e', fontSize: '18px', marginBottom: '8px' }}>لهم</h3>
          <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{score.them}</span>
        </div>
      </div>

      <div style={{ background: '#1e293b', padding: '15px', borderRadius: '8px', maxWidth: '400px', margin: '0 auto', border: '1px solid #475569' }}>
        <p style={{ fontSize: '14px', color: '#cbd5e1' }}>{lastCommand}</p>
      </div>
    </div>
  );
}