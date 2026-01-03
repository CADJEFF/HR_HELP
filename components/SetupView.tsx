
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';
import { Upload, ClipboardList, Trash2, UserPlus, CheckCircle2, Users, Database, AlertCircle, CopyCheck } from 'lucide-react';

interface SetupViewProps {
  participants: Participant[];
  onUpdate: (participants: Participant[]) => void;
  onNext: () => void;
}

const SetupView: React.FC<SetupViewProps> = ({ participants, onUpdate, onNext }) => {
  const [rawText, setRawText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Memoize duplicate names for efficient UI feedback
  const duplicateNames = useMemo(() => {
    const names = participants.map(p => p.name);
    return new Set(names.filter((name, index) => names.indexOf(name) !== index));
  }, [participants]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text.split(/[\n,]/).map(n => n.trim()).filter(n => n);
      const newParticipants = names.map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name
      }));
      onUpdate([...participants, ...newParticipants]);
      showSuccess();
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handlePaste = () => {
    const names = rawText.split(/[\n,]/).map(n => n.trim()).filter(n => n);
    const newParticipants = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate([...participants, ...newParticipants]);
    setRawText('');
    showSuccess();
  };

  const useMockData = () => {
    const mockNames = [
      '陳大文', '林小美', '張志明', '王春嬌', '周杰倫', 
      '蔡依林', '李安', '王建民', '郭台銘', '張忠謀',
      '林書豪', '徐若瑄', '舒淇', '桂綸鎂', '張震',
      '王心凌', '楊丞琳', '蕭敬騰', '林俊傑', '田馥甄'
    ];
    const newParticipants = mockNames.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name
    }));
    onUpdate(newParticipants);
    showSuccess();
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
  };

  const showSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const removeParticipant = (id: string) => {
    onUpdate(participants.filter(p => p.id !== id));
  };

  const clearAll = () => {
    if (confirm('確定要清空所有名單嗎？')) {
      onUpdate([]);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">名單設定</h2>
        <p className="text-slate-500 mt-1">請上傳 CSV 檔案、直接貼上姓名或使用模擬名單測試</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-indigo-700">
              <Database className="w-5 h-5 mr-2" />
              數據來源
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-indigo-400 transition-colors bg-slate-50/50 group text-center cursor-pointer">
                <input 
                  type="file" 
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">CSV/TXT 上傳</p>
              </div>

              <button 
                onClick={useMockData}
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-amber-400 hover:bg-amber-50/30 transition-colors bg-slate-50/50 group text-center"
              >
                <Database className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">使用範例名單</p>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold mb-3 flex items-center text-slate-700">
                <ClipboardList className="w-4 h-4 mr-2" />
                手動貼上
              </h4>
              <textarea 
                className="w-full h-32 p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none resize-none"
                placeholder="每行一個姓名，或以逗號分隔..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
              <button 
                onClick={handlePaste}
                disabled={!rawText.trim()}
                className="mt-3 w-full bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                新增至名單
              </button>
            </div>
          </div>

          {isSuccess && (
            <div className="flex items-center p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              名單已成功更新！
            </div>
          )}

          {duplicateNames.size > 0 && (
            <div className="flex items-center justify-between p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 animate-in slide-in-from-left-4 duration-300">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <div>
                  <p className="font-bold text-sm">偵測到重複姓名</p>
                  <p className="text-xs opacity-80">共有 {duplicateNames.size} 個姓名出現多次</p>
                </div>
              </div>
              <button 
                onClick={removeDuplicates}
                className="bg-rose-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-rose-700 transition-colors shadow-sm"
              >
                移除重複項
              </button>
            </div>
          )}
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col max-h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">當前名單 ({participants.length})</h3>
            {participants.length > 0 && (
              <button 
                onClick={clearAll}
                className="text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                全部清除
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {participants.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-60">
                <Users className="w-12 h-12" />
                <p>尚無參與者</p>
              </div>
            ) : (
              participants.map((p, idx) => {
                const isDuplicate = duplicateNames.has(p.name);
                return (
                  <div 
                    key={`${p.id}-${idx}`} 
                    className={`flex items-center justify-between p-3 rounded-lg group transition-all ${
                      isDuplicate 
                        ? 'bg-rose-50 border border-rose-100 ring-1 ring-rose-200' 
                        : 'bg-slate-50 border border-transparent hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-700">{p.name}</span>
                      {isDuplicate && (
                        <span className="ml-2 px-1.5 py-0.5 bg-rose-200 text-rose-700 text-[10px] font-bold rounded uppercase">
                          重複
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => removeParticipant(p.id)}
                      className={`text-slate-400 hover:text-rose-500 transition-all ${isDuplicate ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {participants.length > 0 && (
            <button 
              onClick={onNext}
              className="mt-6 w-full bg-indigo-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-950 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center"
            >
              <CopyCheck className="w-5 h-5 mr-2" />
              確認名單，前往抽籤
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupView;
