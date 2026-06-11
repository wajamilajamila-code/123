import React, { useState } from 'react';
import ConsumerPanel from './components/ConsumerPanel';
import ProducerPanel from './components/ProducerPanel';
import ReportPanel from './components/ReportPanel';
import BlockchainBrowser from './components/BlockchainBrowser';
import { ShieldCheck, ShoppingBag, LayoutDashboard, FileSpreadsheet, Network, User } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'shop' | 'producer' | 'blocks' | 'report'>('shop');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Brand Brand */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-950 rounded-xl border border-emerald-500/25 shrink-0 shadow-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-widest text-slate-105 select-none uppercase font-sans">
                  至真链溯源平台
                </h1>
                <span className="text-[9px] font-mono text-emerald-400 tracking-tight block leading-none">
                  AI视觉比对 + 商标核验 + 区块链存证
                </span>
              </div>
            </div>

            {/* Desktop Tabs selection */}
            <nav className="hidden md:flex items-center gap-1 select-none">
              <button
                onClick={() => setActiveTab('shop')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'shop' ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
              >
                <ShoppingBag className="w-4 h-4" />
                可信至真商城 (Consumer Shop)
              </button>
              <button
                onClick={() => setActiveTab('producer')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'producer' ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                商户排产商控端 (B-side Control)
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'report' ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                课程集中实践报告 (Report Desk)
              </button>
              <button
                onClick={() => setActiveTab('blocks')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'blocks' ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
              >
                <Network className="w-4 h-4" />
                联盟记账网络浏览器 (Ledger Explorer)
              </button>
            </nav>

            {/* School label Badge */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-semibold text-slate-400">林州红薯试点站已启动</span>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Navigation controls */}
        <div className="md:hidden flex flex-wrap justify-center gap-1 border-b border-slate-900 pb-3 mb-6 select-none">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${activeTab === 'shop' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400'}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> 商城
          </button>
          <button
            onClick={() => setActiveTab('producer')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${activeTab === 'producer' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400'}`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> 控端
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${activeTab === 'report' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400'}`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> 报告
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${activeTab === 'blocks' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400'}`}
          >
            <Network className="w-3.5 h-3.5" /> 区块浏览器
          </button>
        </div>

        {/* Selected Component Router */}
        <div>
          {activeTab === 'shop' && <ConsumerPanel />}
          {activeTab === 'producer' && <ProducerPanel />}
          {activeTab === 'report' && <ReportPanel />}
          {activeTab === 'blocks' && <BlockchainBrowser />}
        </div>

      </main>

      {/* Styled Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5 leading-relaxed">
          <p>
            至真链——基于“AI视觉比对+区块链+商标核验”的互联网可信溯源平台系统设计与开发 (AI Studio Multi-Modal Engine Node)
          </p>
          <p className="text-[10px] text-slate-600">
            实训指导：党留群 副教授 (新乡工程学院智能工程学部) · 技术总监：衡欣 (河南鹏嘉科技有限公司) · 开发：焦恒立 & 团队
          </p>
        </div>
      </footer>

    </div>
  );
}
