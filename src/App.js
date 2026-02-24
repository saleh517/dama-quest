import React, { useState, useEffect } from 'react';

// بيانات الموسوعة (DMBOK)
const encyclopediaData = [
  { id: 1, title: "حوكمة البيانات", content: "تحديد الصلاحيات والمسؤوليات لضمان إدارة البيانات بشكل صحيح." },
  { id: 2, title: "جودة البيانات", content: "التأكد من أن البيانات دقيقة، كاملة، ومتسقة." },
  { id: 3, title: "أمن البيانات", content: "حماية البيانات من الوصول غير المصرح به وضمان الخصوصية." }
];

function App() {
  // 1. حالة اللعبة (State)
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('dama_save');
    return saved ? JSON.parse(saved) : {
      gold: 100,
      lives: 3,
      xp: 0,
      unlockedChapters: [1],
      currentView: 'map' // map, battle, store, encyclopedia
    };
  });

  // 2. دالة المزامنة السحابية (المرحلة 3)
  const saveToCloud = async (state) => {
    try {
      const response = await fetch('/api/saveProgress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "saleh_517", // يمكن تغييره لاحقاً لنظام تسجيل دخول
          id: "saleh_517",
          gold: state.gold,
          lives: state.lives,
          xp: state.xp,
          unlockedChapters: state.unlockedChapters
        }),
      });
      if (response.ok) console.log("تمت المزامنة مع Azure ✅");
    } catch (error) {
      console.error("فشل الاتصال بالسحاب - يعمل في الوضع المحلي حالياً");
    }
  };

  // 3. المراقب (useEffect) للحفظ التلقائي
  useEffect(() => {
    // حفظ محلي
    localStorage.setItem('dama_save', JSON.stringify(gameState));
console.log("المراقب اكتشف تغييراً!"); // سطر للتأكد
    // حفظ سحابي (تأخير 3 ثوانٍ لتجنب كثرة الطلبات)
    const timeoutId = setTimeout(() => {
      saveToCloud(gameState);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [gameState.gold, gameState.lives, gameState.xp, gameState.unlockedChapters]);

  // 4. منطق اللعبة (اللعب، الشراء، التنقل)
  const buyLife = () => {
    if (gameState.gold >= 50) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - 50,
        lives: prev.lives + 1
      }));
    } else {
      alert("الذهب غير كافٍ!");
    }
  };

  const winBattle = () => {
    setGameState(prev => ({
      ...prev,
      gold: prev.gold + 20,
      xp: prev.xp + 50,
      currentView: 'map'
    }));
    alert("أحسنت يا حكيم! ربحت 20 ذهبية.");
  };

  // 5. واجهة المستخدم (التصميم)
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'right', direction: 'rtl' }}>
      <header style={{ background: '#2c3e50', color: 'white', padding: '15px', borderRadius: '10px' }}>
        <h2>🏰 أسطورة حكيم البيانات</h2>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <span>💰 الذهب: {gameState.gold}</span>
          <span>❤️ القلوب: {gameState.lives}</span>
          <span>⭐ الخبرة: {gameState.xp}</span>
        </div>
      </header>

      <nav style={{ margin: '20px 0', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => setGameState(p => ({ ...p, currentView: 'map' }))}>الخريطة</button>
        <button onClick={() => setGameState(p => ({ ...p, currentView: 'store' }))}>المتجر</button>
        <button onClick={() => setGameState(p => ({ ...p, currentView: 'encyclopedia' }))}>الموسوعة</button>
      </nav>

      <main style={{ background: '#ecf0f1', padding: '20px', borderRadius: '10px', minHeight: '300px' }}>
        {gameState.currentView === 'map' && (
          <div>
            <h3>خريطة البيانات</h3>
            <button onClick={() => setGameState(p => ({ ...p, currentView: 'battle' }))} style={{ padding: '20px', fontSize: '1.2rem', cursor: 'pointer' }}>
              ⚔️ ابدأ معركة حوكمة البيانات
            </button>
          </div>
        )}

        {gameState.currentView === 'battle' && (
          <div style={{ textAlign: 'center' }}>
            <h3>⚔️ معركة الحوكمة</h3>
            <p>سؤال: من المسؤول عن وضع سياسات البيانات؟</p>
            <button onClick={winBattle}>مجلس الحوكمة</button>
            <button onClick={() => {
               setGameState(p => ({ ...p, lives: p.lives - 1 }));
               alert("إجابة خاطئة! فقدت قلباً.");
            }}>المبرمج فقط</button>
          </div>
        )}

        {gameState.currentView === 'store' && (
          <div style={{ textAlign: 'center' }}>
            <h3>🛒 المتجر السحري</h3>
            <p>اشترِ قلباً مقابل 50 ذهبية</p>
            <button onClick={buyLife} style={{ background: '#e67e22', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
              شراء ❤️
            </button>
          </div>
        )}

        {gameState.currentView === 'encyclopedia' && (
          <div>
            <h3>📚 موسوعة DMBOK</h3>
            {encyclopediaData.map(item => (
              <div key={item.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                <h4>{item.title}</h4>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ marginTop: '20px', fontSize: '0.8rem', color: '#7f8c8d' }}>
        حالة السحاب: {gameState.gold > 0 ? "متصل ومراقب جاري الحفظ..." : "جاهز"}
      </footer>
    </div>
  );
}

export default App;