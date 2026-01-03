
import React, { useState, useCallback } from 'react';
import { Participant, View } from './types';
import Sidebar from './components/Sidebar';
import SetupView from './components/SetupView';
import LuckyDrawView from './components/LuckyDrawView';
import GroupingView from './components/GroupingView';
import { Users, Gift, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentView, setCurrentView] = useState<View>('setup');

  const handleUpdateParticipants = (newList: Participant[]) => {
    setParticipants(newList);
  };

  const renderView = () => {
    switch (currentView) {
      case 'setup':
        return (
          <SetupView 
            participants={participants} 
            onUpdate={handleUpdateParticipants} 
            onNext={() => setCurrentView('lucky-draw')}
          />
        );
      case 'lucky-draw':
        return (
          <LuckyDrawView 
            participants={participants} 
          />
        );
      case 'grouping':
        return (
          <GroupingView 
            participants={participants} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-indigo-900 text-white flex flex-col shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">HR Helper</h1>
          <p className="text-indigo-300 text-xs mt-1 uppercase tracking-widest font-semibold">Management Suite</p>
        </div>
        
        <div className="mt-4 flex-1">
          <button 
            onClick={() => setCurrentView('setup')}
            className={`w-full flex items-center px-6 py-4 transition-colors ${currentView === 'setup' ? 'bg-indigo-800 border-l-4 border-indigo-400' : 'hover:bg-indigo-800/50'}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span className="font-medium">名單管理</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('lucky-draw')}
            disabled={participants.length === 0}
            className={`w-full flex items-center px-6 py-4 transition-colors ${participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${currentView === 'lucky-draw' ? 'bg-indigo-800 border-l-4 border-indigo-400' : 'hover:bg-indigo-800/50'}`}
          >
            <Gift className="w-5 h-5 mr-3" />
            <span className="font-medium">獎品抽籤</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('grouping')}
            disabled={participants.length === 0}
            className={`w-full flex items-center px-6 py-4 transition-colors ${participants.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${currentView === 'grouping' ? 'bg-indigo-800 border-l-4 border-indigo-400' : 'hover:bg-indigo-800/50'}`}
          >
            <Users className="w-5 h-5 mr-3" />
            <span className="font-medium">自動分組</span>
          </button>
        </div>

        <div className="p-6 text-xs text-indigo-400 text-center border-t border-indigo-800">
          總人數: {participants.length} 位同仁
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-5xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
