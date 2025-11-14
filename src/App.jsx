import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  MessageCircle, 
  AlertTriangle, 
  Award, 
  BookOpen, 
  Send, 
  Smartphone, 
  XCircle,
  CheckCircle2,
  Lock,
  Menu,
  Zap,
  BrainCircuit,
  RefreshCw,
  ArrowRight,
  Trophy,
  Star,
  Crown
} from 'lucide-react';

import { SCENARIOS } from './scenarios';

export default function CyberGuardApp() {
  // --- Game State ---
  const [screen, setScreen] = useState('home'); // home, game, result, victory
  const [wallet, setWallet] = useState(100);
  const [reputation, setReputation] = useState(0);
  const [level, setLevel] = useState(1);
  
  // --- Scenario State ---
  const [currentScenario, setCurrentScenario] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [feedback, setFeedback] = useState(null); // null or object { type, text }
  const [showClue, setShowClue] = useState(false);
  const [isScenarioComplete, setIsScenarioComplete] = useState(false);
  const [usedScenarioIds, setUsedScenarioIds] = useState([]);
  const [animations, setAnimations] = useState([]);
  const [particles, setParticles] = useState([]);

  // --- Utils ---
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, feedback]);

  // Initialize Game
  const startGame = () => {
    setWallet(100);
    setReputation(0);
    setLevel(1);
    setUsedScenarioIds([]);
    loadRandomScenario();
    setScreen('game');
  };

  const loadRandomScenario = () => {
    // Filter out already used scenarios
    const availableScenarios = SCENARIOS.filter(s => !usedScenarioIds.includes(s.id));
    
    // If all scenarios have been used, reset and start over
    if (availableScenarios.length === 0) {
      setUsedScenarioIds([]);
      return loadRandomScenario();
    }
    
    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    const scenario = availableScenarios[randomIndex];
    
    // Mark this scenario as used
    setUsedScenarioIds(prev => [...prev, scenario.id]);
    
    // Shuffle options using Fisher-Yates algorithm
    const shuffledOptions = [...scenario.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    setCurrentScenario({...scenario, options: shuffledOptions});
    setChatHistory([{ 
      role: 'bot', 
      text: scenario.initialMessage, 
      sender: scenario.sender,
      avatar: scenario.avatar
    }]);
    setFeedback(null);
    setShowClue(false);
    setIsScenarioComplete(false);
  };

  const handleChoice = (option) => {
    // 1. Add User Bubble
    const newHistory = [...chatHistory, { role: 'user', text: option.text }];
    setChatHistory(newHistory);

    let xpGain = 0;
    let walletDmg = 0;
    let fbType = 'neutral';

    // 2. Analyze Outcome
    if (option.outcome === 'success') {
      // 500 XP for fast demo (usually 100)
      xpGain = 500; 
      fbType = 'success';
    } else if (option.outcome === 'neutral') {
      walletDmg = 10;
      fbType = 'warning';
    } else {
      walletDmg = 30;
      fbType = 'danger';
    }

    setFeedback({ type: fbType, text: option.feedback });
    setIsScenarioComplete(true);

    // 3. Apply Updates & Trigger Animations
    if (walletDmg > 0) {
      setWallet(prev => Math.max(0, prev - walletDmg));
      // Add wallet damage animation
      const walletAnim = {
        id: Date.now() + Math.random(),
        type: 'wallet',
        value: -walletDmg,
        color: fbType === 'danger' ? 'text-red-500' : 'text-yellow-500'
      };
      setAnimations(prev => [...prev, walletAnim]);
      setTimeout(() => {
        setAnimations(prev => prev.filter(a => a.id !== walletAnim.id));
      }, 2000);

      // Generate dollar particles
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: Date.now() + Math.random() + i,
        type: 'dollar',
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        delay: Math.random() * 0.3
      }));
      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 4000);
    }
    
    if (xpGain > 0) {
      const newReputation = reputation + xpGain;
      setReputation(newReputation);
      // Add XP gain animation
      const xpAnim = {
        id: Date.now() + Math.random(),
        type: 'xp',
        value: xpGain,
        color: 'text-purple-400'
      };
      setAnimations(prev => [...prev, xpAnim]);
      setTimeout(() => {
        setAnimations(prev => prev.filter(a => a.id !== xpAnim.id));
      }, 2000);

      // Generate sparkle particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + Math.random() + i,
        type: 'sparkle',
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        delay: Math.random() * 0.3
      }));
      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 4000);
    }

    // 4. Check for Victory
    if (reputation + xpGain >= 2000) {
      setTimeout(() => {
        setScreen('victory');
      }, 2000);
    } else if (wallet - walletDmg <= 0) {
       setTimeout(() => {
        setScreen('result');
      }, 2000);
    }
  };

  const handleContinue = () => {
    if (wallet > 0) {
      setLevel(prev => prev + 1);
      loadRandomScenario();
    }
  };

  // --- Renders ---

  const RenderHeader = () => (
    <div className="bg-slate-900 p-3 sm:p-4 border-b border-slate-700 flex justify-between items-center sticky top-0 z-20 shadow-lg relative">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="bg-cyan-500/20 p-1.5 sm:p-2 rounded-lg">
          <Shield className="w-5 h-5 sm:w-10 sm:h-10 text-cyan-400" />
        </div>
        <div>
          <h1 className="font-black text-lg sm:text-lg text-white tracking-wide leading-none">CYBER<span className="text-cyan-400">GUARD</span></h1>
          <p className="text-[9px] sm:text-lg text-slate-400 font-mono">НИВО {level}</p>
        </div>
      </div>
      
      <div className="flex gap-2 sm:gap-3">
        {/* Wallet / HP */}
        <div className="flex flex-col items-end">
          <span className="text-[9px] sm:text-[18px] text-slate-400 uppercase font-bold">ПОРТФЕЙЛ</span>
          <div className={`flex items-baseline gap-1 font-mono font-bold text-lg xl:text-xl ${wallet < 30 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
            {wallet}%
          </div>
        </div>
        {/* XP */}
        <div className="flex flex-col items-end">
          <span className="text-[9px] sm:text-[18px] text-slate-400 uppercase font-bold">XP</span>
          <div className="flex items-baseline gap-1 font-mono font-bold text-purple-400 text-lg xl:text-xl">
            {reputation} / 2000
          </div>
        </div>
      </div>
    </div>
  );

  const RenderHome = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      {/* Background elements */}
      {/*<div className="absolute top-10 left-10 text-slate-800 w-32 h-32"><Shield className="w-full h-full opacity-20"/></div> 
      <div className="absolute bottom-10 right-10 text-slate-800 w-48 h-48"><Lock className="w-full h-full opacity-20"/></div>*/}

      <div className="relative group">
        <div className="absolute -inset-12 bg-cyan-500/50 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute -inset-8 bg-cyan-400/60 rounded-full blur-[60px] animate-pulse" style={{animationDuration: '1.5s'}}></div>
        <div className="absolute -inset-4 bg-cyan-300/40 rounded-full blur-xl animate-pulse" style={{animationDuration: '2s'}}></div>
        <Shield className="w-32 h-32 text-cyan-400 relative z-10 drop-shadow-[0_0_40px_rgba(34,211,238,1)] filter brightness-110" />
      </div>
      
      <div className="space-y-4 max-w-xs relative z-10">
        <h2 className="text-3xl font-black text-white uppercase">Търсим Агенти</h2>
        <p className="text-slate-400 text-base">
          Разпознай измамата. Запази парите.<br/>
          Събери <span className="text-purple-400 font-bold">2000 XP</span>,<br/> за да станеш Кибер Страж.
        </p>
      </div>

      <button 
        onClick={startGame}
        className="w-full max-w-xs py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all transform hover:scale-105 flex items-center justify-center gap-2 relative z-10 uppercase tracking-wider"
      >
        <Smartphone className="w-5 h-5" /> Стартирай Симулация
      </button>
    </div>
  );

  const RenderVictory = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in zoom-in duration-700 bg-slate-900">
      {/* Gold Glow Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/10 blur-3xl rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="relative inline-block">
           <div className="absolute -inset-6 bg-amber-400 rounded-full opacity-30 blur-xl animate-pulse"></div>
           <Trophy className="w-32 h-32 text-amber-400 relative z-10 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
           <Star className="w-8 h-8 text-yellow-200 absolute -top-2 -right-4 animate-bounce" />
           <Star className="w-6 h-6 text-yellow-200 absolute bottom-0 -left-4 animate-bounce delay-100" />
        </div>
      </div>
      
      <div className="space-y-4 z-10 max-w-sm">
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-amber-500 tracking-[0.3em] uppercase">Статус Потвърден</h2>
          <h1 className="text-4xl font-black text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
            КИБЕР АГЕНТ
          </h1>
        </div>
        
        <div className="bg-slate-800/80 backdrop-blur-sm border border-amber-500/30 p-6 rounded-xl shadow-2xl">
          <p className="text-slate-300 text-base leading-relaxed">
            Демонстрира изключителни умения за засичане на заплахи. Вече си сертифициран защитник на мрежата.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-amber-400 font-mono font-bold text-xl">
            <Crown className="w-6 h-6" /> {reputation} XP
          </div>
        </div>
      </div>

      <button 
        onClick={startGame}
        className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-full font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 flex items-center gap-2 relative z-10 uppercase"
      >
        <RefreshCw className="w-5 h-5" /> Нова Мисия
      </button>
    </div>
  );

  const RenderGame = () => {
    if (!currentScenario) return null;

    return (
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-slate-950 relative">
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 pb-[280px] sm:pb-[320px]">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.role === 'bot' && (
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3 text-bas sm:text-sm font-bold text-white shadow-lg shrink-0 ${msg.avatar || 'bg-red-700/70 border-red-400'}`}>
                  {msg.role === 'bot' ? '?' : 'АЗ'}
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 text-base sm:text-base leading-relaxed shadow-md break-words ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm border border-slate-700'
              }`}>
                {msg.role === 'bot' && (
                  <div className="text-base sm:text-base text-slate-400 mb-2 font-mono uppercase tracking-widest flex items-center gap-1 sm:gap-2 flex-wrap">
                    <AlertTriangle className="w-3 h-3 text-yellow-200 shrink-0" />
                    <span className="break-all">ВХОДЯЩ СИГНАЛ: {msg.sender}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words">{msg.text}</div>
              </div>

            </div>
          ))}

          {/* Feedback Overlay Bubble */}
          {feedback && (
            <div className={`p-3 sm:p-4 rounded-xl border animate-in slide-in-from-bottom-10 duration-300 ${
              feedback.type === 'success' ? 'bg-green-700/70 border-green-400 text-green-50' :
              feedback.type === 'danger' ? 'bg-red-700/70 border-red-400 text-red-50' :
              'bg-yellow-700/70 border-yellow-400 text-yellow-50'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1 text-sm sm:text-sm uppercase tracking-wider">
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0"/> : <XCircle className="w-4 h-4 shrink-0"/>}
                <span className="break-words">{feedback.type === 'success' ? 'ЗАПЛАХАТА E НЕУТРАЛИЗИРАНА' : 'ПРОБИВ В СИГУРНОСТТА'}</span>
              </div>
              <p className="text-base sm:text-base opacity-90 break-words">{feedback.text}</p>
            </div>
          )}
        </div>

        {/* Interaction Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 p-3 sm:p-4 transition-all shadow-2xl">
          
          {!isScenarioComplete ? (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center px-1 gap-2">
                <span className="text-base sm:text-base text-green-400 font-mono">СИГУРНА ВРЪЗКА: АКТИВНА</span>
                <button 
                  onClick={() => setShowClue(!showClue)}
                  className="text-[11px] sm:text-sm flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wide font-bold whitespace-nowrap"
                >
                  <BrainCircuit className="w-3 h-3 shrink-0" />
                  <span className="hidden sm:inline">{showClue ? 'Скрий данни' : 'Анализ на данни (Жокер)'}</span>
                  <span className="sm:hidden">{showClue ? 'Скрий' : 'Жокер'}</span>
                </button>
              </div>
              
              {showClue && (
                <div className="bg-purple-900/20 border border-purple-500/30 p-2 sm:p-3 rounded-lg text-base sm:text-base text-purple-200 italic flex gap-2 animate-in fade-in">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 shrink-0 text-purple-400 mt-0.5" />
                  <div className="break-words">{currentScenario.clue}</div>
                </div>
              )}

              <div className="grid gap-2">
                {currentScenario.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleChoice(opt)}
                    className="w-full text-left p-2.5 sm:p-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg text-base sm:text-base text-slate-200 transition-all border border-slate-700 hover:border-cyan-500 group"
                  >
                    <span className="text-cyan-500 font-mono mr-2 opacity-50 group-hover:opacity-100">&gt;</span>
                    <span className="break-words">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button 
                onClick={handleContinue}
                className="w-full py-3 sm:py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 animate-pulse uppercase text-sm sm:text-base"
              >
                {wallet > 0 ? 'Следваща Битка' : 'Виж Доклад'} <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const RenderResult = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in zoom-in duration-500">
      <div className="relative">
         <div className="absolute -inset-4 bg-red-500 rounded-full opacity-20 blur-xl"></div>
         <XCircle className="w-24 h-24 text-red-400 relative z-10" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white tracking-tight">
          СИСТЕМАТА Е КОМПРОМЕТИРАНА
        </h2>
        <p className="text-slate-400 max-w-xs mx-auto">
          Твоите кредити свършиха. Измамниците победиха този път.
        </p>
      </div>

      <div className="bg-slate-800 w-full max-w-xs rounded-xl p-6 border border-slate-700 grid grid-cols-2 gap-8">
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">XP</div>
          <div className="text-2xl font-mono text-purple-400 font-bold">{reputation}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Остатък Бюджет</div>
          <div className="text-2xl font-mono font-bold text-red-500">
            0%
          </div>
        </div>
      </div>

      <button 
        onClick={startGame}
        className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-all flex items-center gap-2 group uppercase"
      >
        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Нов Опит
      </button>
    </div>
  );

  return (
    <div className="bg-slate-950 w-full h-full font-sans text-slate-200 flex flex-col selection:bg-cyan-500/30 overflow-hidden">
      {screen !== 'home' && screen !== 'result' && screen !== 'victory' && <RenderHeader />}
      <main className="flex-1 relative overflow-hidden w-full">
        {screen === 'home' && <RenderHome />}
        {screen === 'game' && <RenderGame />}
        {screen === 'victory' && <RenderVictory />}
        {screen === 'result' && <RenderResult />}
      </main>
      
      {/* Centered Animations */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
        {/* Wallet damage animations */}
        {animations.filter(a => a.type === 'wallet').map(anim => (
          <div 
            key={anim.id}
            className={`absolute font-black text-6xl sm:text-8xl ${anim.color} font-mono drop-shadow-[0_0_30px_rgba(239,68,68,1)]`}
            style={{
              animation: 'floatUpFadeBig 4s ease-out forwards'
            }}
          >
            {anim.value}%
          </div>
        ))}
        {/* XP gain animations */}
        {animations.filter(a => a.type === 'xp').map(anim => (
          <div 
            key={anim.id}
            className={`absolute font-black text-7xl sm:text-9xl ${anim.color} font-mono drop-shadow-[0_0_40px_rgba(192,132,252,1)]`}
            style={{
              animation: 'floatUpFadeBig 4s ease-out forwards, pulse 0.8s ease-in-out 3'
            }}
          >
            +{anim.value}
          </div>
        ))}
        
        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute text-3xl sm:text-5xl ${
              particle.type === 'dollar' 
                ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' 
                : 'text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,1)]'
            }`}
            style={{
              left: `calc(50% + ${particle.x}px)`,
              top: `calc(50% + ${particle.y}px)`,
              animation: `particleFloat 4s ease-out forwards`,
              animationDelay: `${particle.delay}s`
            }}
          >
            {particle.type === 'dollar' ? '💵' : '✨'}
          </div>
        ))}
      </div>
    </div>
  );
}
