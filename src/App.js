import React, { useState, useEffect } from 'react';

// بيانات الموسوعة البرمجية (يمكنك زيادتها لاحقاً)
const encyclopediaData = [
  { id: 1, title: "حوكمة البيانات", content: "تحديد الصلاحيات والمسؤوليات لضمان إدارة البيانات بشكل صحيح." },
  { id: 2, title: "جودة البيانات", content: "التأكد من أن البيانات دقيقة، كاملة، ومتسقة." },
  { id: 3, title: "أمن البيانات", content: "حماية البيانات من الوصول غير المصرح به وضمان الخصوصية." }
];

function App() {
  // 1. تعريف حالة اللعبة (State)
  // تحاول اللعبة أولاً التحميل من الذاكرة المحلية (LocalStorage) إذا وجدت بيانات
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('dama_save');
    return saved ? JSON.parse(saved) : {
      gold: 100,
      lives: 3,
      xp: 0,
      unlockedChapters: [1],
      currentView: 'map'
    };
  });

  // 2. دالة المزامنة مع سحابة Azure
  const saveToCloud = async (state) => {
    try {
      const response = await fetch('/api/saveProgress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "saleh_517", // معرف اللاعب
          id: "saleh_517",     // مطلوب لـ Cosmos DB
          gold: state.gold,
          lives: state.lives,
          xp: state.xp,
          unlockedChapters: state.unlockedChapters
        }),
      });

      if (response.ok) {
        console.log("تمت المزامنة مع Azure بنجاح ✅");
      } else {
        console.error("فشل في المزامنة مع السيرفر ⚠️");
      }
    } catch (error) {
      console.log("السيرفر غير متصل حالياً - يتم الحفظ محلياً فقط");
    }
  };

  // 3. المراقب (useEffect): يعمل عند حدوث أي تغيير في الذهب أو النقاط
  useEffect(() => {
    // حفظ نسخة احتياطية في المتصفح فوراً
    localStorage.setItem('dama_save', JSON.stringify(gameState));

    // إرسال البيانات للسحاب بعد 3 ثوانٍ من التوقف عن اللعب (لتجنب ضغط السيرفر)
    const timeoutId = setTimeout(() => {
      saveToCloud(gameState);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [gameState.gold, gameState.lives, gameState.xp]);

  // 4. وظائف اللعبة
  const winBattle = () => {
    setGameState(prev => ({
      ...prev,
      gold: prev.gold + 20,
      xp: prev.xp + 50,
      currentView: 'map'
    }));
  };

  const buyLife = () => {
    if (gameState.gold >= 50) {
      setGameState(prev => ({ ...prev, gold: prev.gold - 50, lives: prev.lives + 1 }));
    } else {
      alert("الذهب غير كافٍ!");
    }
  };

  // 5. واجهة المستخدم (التصميم)
  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, Tahoma', textAlign: 'right', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      
      {/* شريط الحالة العلوى */}
      <header style={{ background: 'linear-gradient(90deg, #2c3e50, #34495e)', color: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0 }}>🏰 أسطورة حكيم البيانات</h1>
        <div style={{ display: 'flex', gap: '30px', marginTop: '15px', fontSize: '1.2rem' }}>
          <span>💰 الذهب: **{gameState.gold}**</span>
          <span>❤️ القلوب: **{gameState.lives}**</span>
          <span>⭐ الخبرة: **{gameState.xp}**</span>
        </div>
      </header>

      {/* قائمة التنقل */}
      <nav style={{ margin: '25px 0', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button style={navButtonStyle} onClick={() => setGameState(p => ({ ...p, currentView: 'map' }))}>🗺️ الخريطة</button>
        <button style={navButtonStyle} onClick={() => setGameState(p => ({ ...p, currentView: 'store' }))}>🛒 المتجر</button>
        <button style={navButtonStyle} onClick={() => setGameState(p => ({ ...p, currentView: 'encyclopedia' }))}>📚 الموسوعة</button>
      </nav>

      {/* ساحة اللعب المتغيرة */}
      <main style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', minHeight: '300px' }}>
        
        {gameState.currentView === 'map' && (
          <div style={{ textAlign: 'center' }}>
            <h3>خريطة المغامرة</h3>
            <p>اختر منطقتك التالية لبدء التعلم واللعب</p>
            <button onClick={() => setGameState(p => ({ ...p, currentView: 'battle' }))} style={battleButtonStyle}>
              ⚔️ دخول معركة الحوكمة
            </button>
          </div>
        )}

        {gameState.currentView === 'battle' && (
          <div style={{ textAlign: 'center' }}>
            <h3>⚔️ تحدي جودة البيانات</h3>
            <p style={{ fontSize: '1.3rem' }}>سؤال: هل البيانات الضخمة تعني دائماً بيانات جيدة؟</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={winBattle} style={choiceButtonStyle}>لا، الجودة أهم من الكم</button>
              <button onClick={() => setGameState(p => ({ ...p, lives: p.lives - 1 }))} style={choiceButtonStyle}>نعم، كلما زادت كان أفضل</button>
            </div>
          </div>
        )}

        {gameState.currentView === 'store' && (
          <div style={{ textAlign: 'center' }}>
            <h3>🛒 متجر الحكيم</h3>
            <p>استبدل ذهبك بموارد حيوية</p>
            <div style={{ border: '1px solid #ddd', padding: '15px', display: 'inline-block', borderRadius: '10px' }}>
              <h4>جرعة حياة (❤️ +1)</h4>
              <p>الثمن: 50 ذهبية</p>
              <button onClick={buyLife} style={{ backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                شراء الآن
              </button>
            </div>
          </div>
        )}

        {gameState.currentView === 'encyclopedia' && (
          <div>
            <h3>📚 مكتبة DMBOK المعرفية</h3>
            {encyclopediaData.map(item => (
              <div key={item.id} style={{ borderBottom: '1px solid #eee', padding: '15px' }}>
                <h4 style={{ color: '#2980b9' }}>{item.title}</h4>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        )}

      </main>

      <footer style={{ marginTop: '20px', textAlign: 'center', color: '#95a5a6', fontSize: '0.9rem' }}>
        نظام الحفظ السحابي نشط لليوزر: **saleh_517**
      </footer>
    </div>
  );
}

// تنسيقات الأزرار (Styles)
const navButtonStyle = {
  padding: '10px 20px',
  fontSize: '1rem',
  cursor: 'pointer',
  borderRadius: '8px',
  border: '1px solid #2c3e50',
  backgroundColor: 'white',
  transition: '0.3s'
};

const battleButtonStyle = {
  padding: '20px 40px',
  fontSize: '1.5rem',
  backgroundColor: '#c0392b',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  marginTop: '20px'
};

const choiceButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#3498db',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default App;