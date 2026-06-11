import React, { useState, useEffect } from 'react';
import { Layers, Network, Search, Cpu, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

interface Block {
  index: number;
  timestamp: string;
  txCount: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  data: {
    productId?: string;
    productName?: string;
    action?: string;
    stage?: string;
    operator?: string;
    txHash: string;
  }[];
}

export default function BlockchainBrowser() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHash, setSearchHash] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blocks');
      const data = await res.json();
      setBlocks(data.reverse()); // Latest blocks on top
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlocks = blocks.filter(b => {
    if (!searchHash) return true;
    return b.hash.includes(searchHash) || b.previousHash.includes(searchHash) || b.index.toString() === searchHash;
  });

  return (
    <div className="space-y-6">
      
      {/* Network Health Summary Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 rounded-lg text-emerald-400 border border-emerald-900">
            <Network className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              至真联盟记账网络·超级账本浏览器
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              运行节点: ZhiZhen_Primary_Node_1 (127.0.0.1:3000) · 记账共识协议: PBFT Mock
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 shrink-0">
          <p>共创高度: <span className="text-emerald-400 font-bold">{blocks.length} 块</span></p>
          <span className="text-slate-700">|</span>
          <button
            onClick={fetchBlocks}
            className="text-emerald-400 flex items-center gap-1 hover:text-emerald-300 font-bold cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> 重新加载账本
          </button>
        </div>
      </div>

      {/* Grid with searchable ledger blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Blocks list (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-lg max-w-md shadow">
            <span className="flex items-center pl-2 text-slate-600"><Search className="w-3.5 h-3.5" /></span>
            <input
              type="text"
              placeholder="搜素区块编号、区块哈希或哈希前缀..."
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="w-full bg-transparent p-1.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-3">
            {filteredBlocks.map((b) => (
              <div
                key={b.index}
                onClick={() => setSelectedBlock(b)}
                className={`bg-slate-900 border rounded-xl p-4 cursor-pointer hover:border-emerald-500/30 transition-all ${selectedBlock?.index === b.index ? 'border-emerald-500 bg-slate-900/60 shadow-lg' : 'border-slate-800'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-black font-mono text-emerald-400 block tracking-widest leading-none mt-0.5">
                      #{b.index}
                    </span>
                    <div className="space-y-1 font-mono text-xs overflow-hidden max-w-md sm:max-w-xl">
                      <p className="font-extrabold text-slate-200 flex items-center gap-1">
                        Block Hash: <span className="text-emerald-400 text-[11px] truncate block w-44 sm:w-80 select-none">{b.hash}</span>
                      </p>
                      <p className="text-[10px] text-slate-500">前序区块哈希 Prev: <span className="text-slate-400 truncate text-[10px]">{b.previousHash}</span></p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1 text-[10px] font-mono text-slate-500">
                    <p className="bg-indigo-950 text-indigo-400 border border-indigo-900 px-1.5 py-0.5 rounded inline-block font-extrabold text-[9px] uppercase">
                      {b.txCount} 笔数据交易
                    </p>
                    <p>{new Date(b.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Block details (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-lg space-y-4 font-mono text-xs">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Cpu className="w-4 h-4 text-emerald-400" />
              当前封存区块参数 Details
            </h3>

            {selectedBlock ? (
              <div className="space-y-4 text-xs">
                
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-500 block">BLOCK INDEX</span>
                  <span className="text-base font-black text-emerald-400 font-mono">Height #{selectedBlock.index}</span>
                </div>

                <div className="space-y-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">区块生成时间 (Mined At)</span>
                    <span className="text-[11px] text-slate-300 block">{new Date(selectedBlock.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">默克尔树根指纹 (Merkle Root)</span>
                    <span className="text-[10px] text-indigo-400 break-all bg-slate-950 p-1 rounded font-mono">{selectedBlock.merkleRoot}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">当前区块哈希 (Block Hash)</span>
                    <span className="text-[10px] text-emerald-400 break-all bg-slate-950 p-1 rounded font-mono">{selectedBlock.hash}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">上一关联指向哈希 (Prev Hash)</span>
                    <span className="text-[10px] text-slate-400 break-all bg-slate-950 p-1 rounded font-mono">{selectedBlock.previousHash}</span>
                  </div>
                </div>

                {/* Inside transactions */}
                <div className="space-y-2 pt-2 border-t border-slate-850">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">打包的数据流事务 Data Stream</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedBlock.data.map((tx, idx) => (
                      <div key={idx} className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-lg text-[11px] leading-relaxed space-y-1 text-slate-300">
                        <div className="flex justify-between font-bold text-[9px] uppercase tracking-wider text-indigo-400">
                          <span>{tx.action || "DATALOG_APPEND"}</span>
                          <span className="text-emerald-400">✓ SECURED</span>
                        </div>
                        {tx.productName && <p className="font-semibold text-slate-100">产品: {tx.productName} ({tx.productId})</p>}
                        {tx.stage && <p>阶段: <span className="text-slate-400">{tx.stage}</span></p>}
                        {tx.operator && <p>经办责任人: <span className="text-slate-400">{tx.operator}</span></p>}
                        <p className="text-[9px] text-emerald-500 truncate mt-1 bg-slate-950/90 p-1 border border-slate-900 rounded select-all">Tx: {tx.txHash}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-10 space-y-2 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                <FileText className="w-8 h-8 text-slate-750 mx-auto" />
                <p className="text-xs text-slate-500 select-none">请在左侧列表点击任一记记账块</p>
                <p className="text-[10px] text-slate-600">以展开审查联盟链其结构和物理打包事务详情</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
