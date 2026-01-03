
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { Trophy, RotateCcw, PartyPopper, ChevronRight, Hash } from 'lucide-react';

interface LuckyDrawViewProps {
  participants: Participant[];
}

const LuckyDrawView: React.FC<LuckyDrawViewProps> = ({ participants }) => {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [drawCount, setDrawCount] = useState(1);
  const [remaining, setRemaining] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string>('???');
  const [lastWinner, setLastWinner] = useState<Participant | null>(null);
  const drawIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setRemaining([...participants]);
  }, [participants]);

  const startDraw = () => {
    if (remaining.length === 0 && !allowRepeat) {
      alert('所有參與者都已經中獎了！');
      return;
    }

    setIsDrawing(true);
    setLastWinner(null);
    
    let duration = 3000;
    let startTime = Date.now();
    
    // Animation loop
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        // Fast cycle through names
        const randomIndex = Math.floor(Math.random() * participants.length);
        setCurrentDisplay(participants[randomIndex].name);
        
        // Dynamic interval slowing down
        const delay = 50 + (progress * 300); 
        drawIntervalRef.current = window.setTimeout(tick, delay);
      } else {
        finishDraw();
      }
    };

    tick();
  };

  const finishDraw = () => {
    const listToDrawFrom = allowRepeat ? participants : remaining;
    const randomIndex = Math.floor(Math.random() * listToDrawFrom.length);
    const winner = listToDrawFrom[randomIndex];

    setLastWinner(winner);
    setCurrentDisplay(winner.name);
    setWinners(prev => [winner, ...prev]);

    if (!allowRepeat) {
      setRemaining(prev => prev.filter(p => p.id !== winner.id));
    }

    setIsDrawing(false);
    if (drawIntervalRef.current) clearTimeout(drawIntervalRef.current);
  };

  const reset = () => {
    setRemaining([...participants]);
    setWinners([]);
    setLastWinner(null);
    setCurrentDisplay('???');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">獎品抽籤</h2>
          <p className="text-slate-500 mt-1">設置規則並開始隨機抽取幸運兒</p>
        </div>
        <button 
          onClick={reset}
          className="flex items-center text-sm font-medium text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          重設所有狀態
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings & Control */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-6 flex items-center text-indigo-700">
              <Hash className="w-5 h-5 mr-2" />
              抽籤規則
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700">重複抽取</p>
                  <p className="text-xs text-slate-400">同一個姓名是否可多次中獎</p>
                </div>
                <button 
                  onClick={() => setAllowRepeat(!allowRepeat)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${allowRepeat ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${allowRepeat ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">統計數據</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">待抽人數</span>
                  <span className="font-bold text-indigo-600">{allowRepeat ? '∞' : remaining.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className="text-slate-600">中獎紀錄</span>
                  <span className="font-bold text-emerald-600">{winners.length}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={startDraw}
              disabled={isDrawing || (!allowRepeat && remaining.length === 0)}
              className="mt-8 w-full h-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xl rounded-2xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center overflow-hidden relative"
            >
              {isDrawing ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
              ) : (
                <>
                  <PartyPopper className="w-6 h-6 mr-3" />
                  開始抽籤
                </>
              )}
            </button>
          </div>
        </div>

        {/* Animation Display */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden relative h-[400px] flex items-center justify-center">
             {/* Glowing effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
            
            <div className="text-center z-10 w-full px-4">
              <div className={`text-6xl md:text-8xl font-black tracking-tight transition-all duration-100 ${isDrawing ? 'text-indigo-400 blur-[1px]' : 'text-white'}`}>
                {currentDisplay}
              </div>
              
              {!isDrawing && lastWinner && (
                <div className="mt-8 animate-in zoom-in slide-in-from-top-4 duration-500">
                  <div className="inline-flex items-center bg-indigo-500/20 text-indigo-300 px-6 py-2 rounded-full border border-indigo-500/30 text-lg font-semibold backdrop-blur-md">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
                    恭喜中獎！
                  </div>
                </div>
              )}
            </div>
            
            {/* Corner decorations */}
            <div className="absolute top-8 left-8 text-slate-700 font-mono text-xs uppercase tracking-[0.2em]">Lucky Draw Engine v1.0</div>
            <div className="absolute bottom-8 right-8 flex space-x-2">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full ${isDrawing ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
               ))}
            </div>
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              中獎名單
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {winners.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 italic">
                  尚未產生成果，快按下「開始抽籤」吧！
                </div>
              ) : (
                winners.map((winner, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center animate-in fade-in slide-in-from-left-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                      {winners.length - idx}
                    </div>
                    <span className="font-semibold text-slate-700 truncate">{winner.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDrawView;
