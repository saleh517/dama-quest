import React, { useState } from 'react';
import { chapters } from './Data/chaptersData';


function App() {
  const [gameState, setGameState] = useState({
    gold: 0,
    lives: 3,
    xp: 0,
    unlockedChapters: [0],
    currentScreen: 'map', // map, info, battle, result
    selectedChapter: null,
    monsterHP: 100, // طاقة الوحش
    currentQuestionIndex: 0
  });

  // دالة لبدء المعركة
  const startBattle = () => {
    setGameState({ 
      ...gameState, 
      currentScreen: 'battle', 
      monsterHP: 100, 
      currentQuestionIndex: 0 
    });
  };

  // دالة التحقق من الإجابة
const handleAnswer = (index) => {
  const isCorrect = index === gameState.selectedChapter.questions[gameState.currentQuestionIndex].correct;

  if (isCorrect) {
    // 1. تقليل طاقة الوحش
    const newMonsterHP = gameState.monsterHP - 50;

    if (newMonsterHP <= 0) {
      // 2. حالة الفوز (هنا يضاف الذهب والـ XP)
      setGameState({
        ...gameState,
        gold: gameState.gold + 100, // إضافة 100 ذهبية
        xp: gameState.xp + 50,      // إضافة 50 نقطة خبرة
        monsterHP: 0,
        currentScreen: 'victory'    // الانتقال لشاشة الفوز
      });
    } else {
      setGameState({ ...gameState, monsterHP: newMonsterHP });
    }
  } else {
    // حالة الخطأ: خصم الأرواح
    setGameState({ ...gameState, lives: gameState.lives - 1 });
  }
};

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 text-right font-sans" dir="rtl">
      {/* شريط الإحصائيات المطور */}

<main className="p-6">
  {/* شرط ظهور الموسوعة */}
  {gameState.currentScreen === 'encyclopedia' && (
    <div className="animate-slideUp">
      <h2 className="text-2xl text-purple-400 mb-6 text-center">الموسوعة</h2>
      <div className="space-y-4">
        {chapters.map((chap) => (
          <div key={chap.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800">
            <h3 className="font-bold text-blue-400">{chap.title}</h3>
            <p className="text-sm text-slate-400">{chap.story}</p>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* شرط ظهور الخريطة */}
  {gameState.currentScreen === 'map' && (
    <div className="grid grid-cols-1 gap-4">
      {/* كود عرض فصول الخريطة هنا */}
    </div>
  )}
  {gameState.currentScreen === 'victory' && (
  <div className="max-w-md mx-auto text-center p-10 bg-slate-900 border-2 border-yellow-500 rounded-[2rem] shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-fadeIn">
    <div className="text-6xl mb-6">🏆</div>
    <h2 className="text-3xl font-black text-yellow-500 mb-2">نصر ساحق!</h2>
    <p className="text-slate-400 mb-8">لقد طهرت هذا الفصل من فوضى البيانات</p>
    
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="bg-slate-800 p-4 rounded-2xl">
        <p className="text-xs text-slate-500 uppercase">ذهب مكتسب</p>
        <p className="text-2xl font-bold text-yellow-500">+100</p>
      </div>
      <div className="bg-slate-800 p-4 rounded-2xl">
        <p className="text-xs text-slate-500 uppercase">خبرة مكتسبة</p>
        <p className="text-2xl font-bold text-blue-400">+50</p>
      </div>
    </div>

    <button 
      onClick={() => setGameState({...gameState, currentScreen: 'map'})}
      className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 rounded-2xl font-black text-lg shadow-lg transition-transform active:scale-95"
    >
      العودة للخريطة
    </button>
  </div>
)}
<header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md p-4 border-b border-slate-800 shadow-xl">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        {/* عرض النقاط والذهب من الـ State */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <span className="font-black text-yellow-500">{gameState.gold}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <span className="font-black text-red-500">{gameState.lives}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <span className="text-sm font-bold">XP</span>
            <span className="font-black">{gameState.xp}</span>
          </div>
        </div>

        {/* اسم اللعبة */}
        <h1 className="text-lg font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          DAMA QUEST
        </h1>
      </div>
    </header>
    {/* 4. شاشة المتجر السحري */}
{gameState.currentScreen === 'shop' && (
  <div className="max-w-2xl mx-auto animate-fadeIn pb-20">
    <h2 className="text-3xl font-black mb-8 text-center text-emerald-400">متجر الحكيم 🧙‍♂️</h2>
    <p className="text-center text-slate-400 mb-10">استبدل ذهبك بفرص إضافية للنجاة</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* منتج: شراء قلب */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-red-500/50 transition-all shadow-xl">
        <div className="text-4xl mb-4">❤️</div>
        <h3 className="text-xl font-bold mb-2">قلب حياة إضافي</h3>
        <p className="text-sm text-slate-500 mb-6">يمنحك فرصة إضافية عند الإجابة الخاطئة.</p>
        <button 
          onClick={() => {
            if (gameState.gold >= 50) {
              setGameState({
                ...gameState,
                gold: gameState.gold - 50,
                lives: gameState.lives + 1
              });
              alert("تم شراء قلب بنجاح! ❤️");
            } else {
              alert("ذهبك غير كافٍ! اهزم المزيد من الوحوش 👾");
            }
          }}
          className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-colors"
        >
          شراء (50 🪙)
        </button>
      </div>

      {/* منتج: تلميحة (فكرة للمستقبل) */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 opacity-60">
        <div className="text-4xl mb-4">💡</div>
        <h3 className="text-xl font-bold mb-2">تعويذة الكشف</h3>
        <p className="text-sm text-slate-500 mb-6">قريباً: حذف إجابتين خاطئتين في المعركة.</p>
        <button disabled className="w-full py-3 bg-slate-700 rounded-xl font-bold cursor-not-allowed">
          قريباً
        </button>
      </div>
    </div>
  </div>
)}
{/* ابحث عن شريط الأزرار في أسفل الملف وأضف هذا الزر */}
<button 
  onClick={() => setGameState({...gameState, currentScreen: 'shop'})}
  className={gameState.currentScreen === 'shop' ? 'bg-emerald-600' : 'bg-slate-800'}
>
  🛒 المتجر
</button>
</main>
      {/* 1. الخريطة */}
      {gameState.currentScreen === 'map' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {chapters.map((chap, index) => {
            const isUnlocked = gameState.unlockedChapters.includes(index);
            return (
              <button
                key={chap.id}
                disabled={!isUnlocked}
                onClick={() => setGameState({ ...gameState, selectedChapter: chap, currentScreen: 'info' })}
                className={`p-6 rounded-3xl border-2 transition-all text-right group ${
                  isUnlocked ? 'bg-slate-900 border-slate-800 hover:border-blue-500 shadow-lg' : 'bg-slate-950 border-slate-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-3xl mb-2">{isUnlocked ? '🔓' : '🔒'}</div>
                <h3 className="text-lg font-bold group-hover:text-blue-400">{chap.title}</h3>
                <p className="text-xs text-slate-500 mt-2">الوحش: {chap.monster}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. شاشة المعلومات (القصة) */}
      {gameState.currentScreen === 'info' && (
        <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-3xl border border-blue-500/30 shadow-2xl animate-slideUp">
          <h2 className="text-3xl font-black text-blue-400 mb-6">{gameState.selectedChapter.title}</h2>
          <div className="space-y-6">
             <div className="p-5 bg-blue-950/30 rounded-2xl border-r-4 border-blue-500">
                <p className="text-slate-200 leading-relaxed leading-7 italic">" {gameState.selectedChapter.story} "</p>
             </div>
             <button 
               onClick={startBattle}
               className="w-full p-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl font-black text-xl hover:scale-[1.02] transition-transform shadow-lg shadow-blue-900/20"
             >
               🚀 ابدأ التحدي الآن
             </button>
          </div>
        </div>
      )}

      {/* 3. شاشة المعركة */}
      {gameState.currentScreen === 'battle' && (
        <div className="max-w-2xl mx-auto text-center animate-pulseSlow">
          {/* صحة الوحش */}
          <div className="mb-12">
            <div className="flex justify-between mb-2 px-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <span>{gameState.selectedChapter.monster}</span>
              <span>HP: {gameState.monsterHP}%</span>
            </div>
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-red-600 to-orange-500 h-full transition-all duration-500" 
                style={{ width: `${gameState.monsterHP}%` }}
              ></div>
            </div>
            <div className="text-8xl mt-6 transform hover:scale-110 transition-transform">👾</div>
          </div>
      {/* 4. شاشة الموسوعة */}
      {/* عرض شاشة الموسوعة - تأكد من مطابقة الأسماء */}
      {gameState.currentScreen === 'encyclopedia' && (
        <div className="max-w-4xl mx-auto pb-32 animate-slideUp">
          <h2 className="text-3xl font-black mb-8 text-center text-purple-400">موسوعة حكيم البيانات</h2>
          <div className="grid gap-6">
            {/* تأكد أن المتغير هنا هو chapters الذي استوردناه في أعلى الملف */}
            {chapters && chapters.length > 0 ? (
              chapters.map((chap) => {
                // التأكد من وجود return داخل الـ map
                return (
                  <div key={chap.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-blue-400">{chap.id + 1}. {chap.title}</h3>
                      <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-slate-400 uppercase tracking-widest text-left">DMBOK Module</span>
                    </div>
                    
                    {/* عرض القصة إذا كانت موجودة */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 italic">
                      {chap.story ? `"${chap.story}"` : "لا توجد قصة لهذا الفصل بعد."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                        <p className="text-blue-500 text-[10px] font-black mb-1 uppercase">المدخلات والعمليات</p>
                        <p className="text-xs text-slate-300">{chap.inputs || "غير محدد"}</p>
                      </div>
                      <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                        <p className="text-emerald-500 text-[10px] font-black mb-1 uppercase">المخرجات</p>
                        <p className="text-xs text-slate-300">{chap.outputs || "غير محدد"}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-20 text-slate-500">جاري تحميل البيانات...</div>
            )}
          </div>
        </div>
      )}
      
          {/* السؤال */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-right shadow-2xl">
            <p className="text-xl font-bold mb-8 leading-relaxed">
              {gameState.selectedChapter.questions[gameState.currentQuestionIndex].q}
            </p>
            <div className="grid gap-4">
              {gameState.selectedChapter.questions[gameState.currentQuestionIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="p-5 bg-slate-800 hover:bg-blue-600 border border-slate-700 rounded-2xl transition-all text-right font-medium hover:translate-x-[-8px]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* شريط التحكم السفلي - يظهر دائماً */}
<div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 px-6 z-50">
  <button 
    onClick={() => setGameState({...gameState, currentScreen: 'map'})}
    className={`px-6 py-3 rounded-2xl font-bold shadow-lg transition-all ${gameState.currentScreen === 'map' ? 'bg-blue-600' : 'bg-slate-800'}`}
  >
    🗺️ الخريطة
  </button>
  
  <button 
    onClick={() => setGameState({...gameState, currentScreen: 'encyclopedia'})}
    className={`px-6 py-3 rounded-2xl font-bold shadow-lg transition-all ${gameState.currentScreen === 'encyclopedia' ? 'bg-purple-600' : 'bg-slate-800'}`}
  >
    📖 الموسوعة
  </button>
<button 
  onClick={() => setGameState({...gameState, currentScreen: 'shop'})}
  className={gameState.currentScreen === 'shop' ? 'bg-emerald-600' : 'bg-slate-800'}
>
  🛒 المتجر
</button>
  
</div>
    </div>
  );
}

export default App;