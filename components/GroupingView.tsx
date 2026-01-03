
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { Users, Shuffle, Info, Download, CheckCircle } from 'lucide-react';

interface GroupingViewProps {
  participants: Participant[];
}

const GroupingView: React.FC<GroupingViewProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadFeedback, setShowDownloadFeedback] = useState(false);

  const generateGroups = () => {
    if (participants.length === 0) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      const newGroups: Group[] = [];
      const numGroups = Math.ceil(shuffled.length / groupSize);

      for (let i = 0; i < numGroups; i++) {
        const members = shuffled.slice(i * groupSize, (i + 1) * groupSize);
        newGroups.push({
          id: `group-${i + 1}`,
          name: `第 ${i + 1} 組`,
          members
        });
      }

      setGroups(newGroups);
      setIsGenerating(false);
    }, 600);
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    // Build CSV content
    let csvContent = "\ufeff"; // BOM for Excel UTF-8 support
    csvContent += "組別,姓名\n";
    
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Feedback
    setShowDownloadFeedback(true);
    setTimeout(() => setShowDownloadFeedback(false), 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">自動分組</h2>
        <p className="text-slate-500 mt-1">智能分配團隊成員，確保平衡與公平</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-6 flex items-center text-indigo-700">
              <Users className="w-5 h-5 mr-2" />
              分組參數
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">每組人數</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    min="2" 
                    max={Math.max(2, participants.length)} 
                    value={groupSize}
                    onChange={(e) => setGroupSize(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="w-10 text-center font-bold text-indigo-600 bg-indigo-50 py-1 rounded-md border border-indigo-100">
                    {groupSize}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>總參與人數:</span>
                  <span className="font-semibold">{participants.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>預計組數:</span>
                  <span className="font-semibold">{Math.ceil(participants.length / groupSize)}</span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <button 
                  onClick={generateGroups}
                  disabled={isGenerating || participants.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  <Shuffle className={`w-5 h-5 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? '分組中...' : groups.length > 0 ? '重新分組' : '開始分組'}
                </button>

                {groups.length > 0 && (
                  <button 
                    onClick={downloadCSV}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center border border-slate-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下載 CSV 紀錄
                  </button>
                )}
              </div>

              {showDownloadFeedback && (
                <div className="flex items-center justify-center text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-lg border border-emerald-100 animate-in fade-in zoom-in">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  已開始下載分組名單
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start">
            <Info className="w-5 h-5 text-indigo-500 mr-2 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              分組採用隨機洗牌演算法。下載 CSV 紀錄可用於存檔或導入其他系統。
            </p>
          </div>
        </div>

        {/* Results Visualization */}
        <div className="lg:col-span-3">
          {groups.length === 0 ? (
            <div className="h-full min-h-[400px] bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 opacity-20" />
               </div>
               <h3 className="text-xl font-semibold text-slate-600">準備好分組了嗎？</h3>
               <p className="max-w-xs mt-2">點擊左側「開始分組」按鈕，系統將自動為您處理名單分配。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">
              {groups.map((group) => (
                <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800">{group.name}</span>
                    <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {group.members.length} 人
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    {group.members.map((member, mIdx) => (
                      <div key={member.id} className="flex items-center group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 mr-3 group-hover:from-indigo-100 group-hover:to-indigo-200 group-hover:text-indigo-600 transition-colors">
                          {mIdx + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupingView;
