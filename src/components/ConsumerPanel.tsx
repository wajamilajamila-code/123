import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ArrowRight, Compass, Camera, AlertCircle, RefreshCw, Layers, CheckCircle2, ShoppingCart, ShoppingBag } from 'lucide-react';

interface TraceRecord {
  id: string;
  stageName: string;
  operator: string;
  timestamp: string;
  location: string;
  description: string;
  txHash: string;
  blockNumber: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  origin: string;
  producer: string;
  price: number;
  imageUrl: string;
  specDetails: string;
  blockchainHash: string;
  registeredAt: string;
  trademarkRegNo: string;
  records: TraceRecord[];
}

export default function ConsumerPanel() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [queryLog, setQueryLog] = useState<any>(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Verification State
  const [uploadImg, setUploadImg] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifResult, setVerifResult] = useState<any>(null);
  const [selectedDemoPhotoType, setSelectedDemoPhotoType] = useState<'genuine' | 'altered'>('genuine');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProductList(data);
    } catch (err) {
      console.error("Failed to load products list:", err);
    }
  };

  const handleSearch = async (code: string) => {
    const targetCode = code.trim();
    if (!targetCode) return;

    setLoadingCode(true);
    setErrorMsg('');
    setSelectedProduct(null);
    setVerifResult(null);
    setUploadImg(null);

    try {
      const res = await fetch(`/api/products/${targetCode}`);
      if (!res.ok) {
        throw new Error('未检索到此一物一码追溯防伪码，请核实。');
      }
      const data = await res.json();
      setSelectedProduct(data.product);
      setQueryLog(data.queryLog);
    } catch (err: any) {
      setErrorMsg(err.message || '查询失败，网络问题。');
    } finally {
      setLoadingCode(false);
    }
  };

  // Convert image to base64 helper
  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadImg(reader.result as string);
      setVerifResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Trigger preset demo photos to make verification extremely immediate and useful without uploading real photos
  const applyDemoPhoto = (type: 'genuine' | 'altered') => {
    setSelectedDemoPhotoType(type);
    if (type === 'genuine') {
      // Give a dummy matching base64 representing correct product photo
      setUploadImg("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=");
    } else {
      // Tiny mock corrupt base64 to trigger counterfeit warning analysis
      setUploadImg("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwM");
    }
    setVerifResult(null);
  };

  const runAiVerification = async () => {
    if (!selectedProduct || !uploadImg) return;

    setVerifying(true);
    setVerifResult(null);

    try {
      const res = await fetch('/api/gemini/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          userImageBase64: uploadImg
        })
      });
      const result = await res.json();
      setVerifResult(result);
    } catch (err) {
      console.error("AI verification failed:", err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 p-6 md:p-10 rounded-2xl border border-emerald-900/45 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            国家强制一物一码保障·可信溯源系统已上线
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">
            至真商城——消费者防伪溯源查真端
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            输入农产品或高档手信上的【至真码/Trace Code】，或者选下方的示范产品，即可瞬间调拨区块链数据库进行去中心化正品查验。
          </p>

          {/* Search input bar */}
          <div className="flex gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl max-w-lg mx-auto shadow-2xl focus-within:border-emerald-500/50 transition-colors">
            <input
              type="text"
              placeholder="请输入至真码，例如：TR-602601..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchCode)}
              className="flex-1 bg-transparent px-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
            />
            <button
              onClick={() => handleSearch(searchCode)}
              disabled={loadingCode}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {loadingCode ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              防伪鉴真查询
            </button>
          </div>

          {errorMsg && (
            <div className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-950/20 border border-rose-900/30 px-3.5 py-1.5 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Grid of demo products for easy exploration if chosen */}
      {!selectedProduct && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-1">
            <Compass className="w-4 h-4 text-emerald-400" />
            快速探索：示范特产一物一码追溯牌
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productList.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSearch(p.id)}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-950">
                    <img
                      referrerPolicy="no-referrer"
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/90 border border-emerald-500/30 rounded-full px-2.5 py-0.5 text-[9px] font-mono text-emerald-400 tracking-wider">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono tracking-tighter">码: {p.id}</p>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      原产自: {p.origin}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      关联商标: <span className="text-indigo-400">{p.trademarkRegNo}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1 flex justify-between items-center border-t border-slate-800">
                  <span className="text-emerald-400 font-bold text-sm">￥{p.price.toFixed(1)}/套</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold group-hover:text-emerald-300">
                    了解详情并验真 <ArrowRight className="w-3 h-3 text-emerald-400" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Product trace view & AI Comparison (Split View) */}
      {selectedProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          
          {/* Left panel: Trace details & Visual timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              
              {/* Product Header details */}
              <div className="flex flex-col sm:flex-row gap-5 pb-5 border-b border-slate-800">
                <div className="w-full sm:w-1/3 h-28 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-950 border border-emerald-500/20 rounded px-2 py-0.5 text-[9px] font-mono text-emerald-400">{selectedProduct.category}</span>
                    <span className="text-[10px] font-mono text-indigo-400">核定商标: {selectedProduct.trademarkRegNo}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{selectedProduct.name}</h3>
                  <p className="text-xs text-slate-400">商户: {selectedProduct.producer}</p>
                  <p className="text-xs text-slate-500 font-mono">创世区块哈希: <span className="text-emerald-400/80 break-all text-[9px]">{selectedProduct.blockchainHash}</span></p>
                </div>
              </div>

              {/* Warning box if repeated queries are logged */}
              {queryLog && queryLog.verificationStatus === 'warning' && (
                <div className="bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-rose-400">⚠️ 系统异地重复扫码风险预警</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {queryLog.details}
                    </p>
                  </div>
                </div>
              )}

              {/* Timeline list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 pl-1">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  至真物理流沙追溯轴 (BLOCKCHAIN LEDGER TIME-LINE)
                </h4>

                <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-800/80 pl-2">
                  {selectedProduct.records.map((rec, rIdx) => (
                    <div key={rec.id} className="relative pl-8 space-y-1.5">
                      {/* Round node badge */}
                      <span className="absolute left-1.5 top-1 w-5 h-5 rounded-full bg-slate-950 border-2 border-emerald-500 text-[10px] text-emerald-400 flex items-center justify-center font-bold">
                        {selectedProduct.records.length - rIdx}
                      </span>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-sm text-slate-100 flex items-center gap-1">
                          {rec.stageName}
                          <span className="inline-flex gap-1.5 items-center px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/20 text-[9px] text-emerald-400 font-semibold font-mono">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Blockchain
                          </span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{new Date(rec.timestamp).toLocaleString()}</span>
                      </div>

                      <div className="bg-slate-950/45 p-4 rounded-xl border border-slate-850 space-y-1.5">
                        <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 pt-1.5 border-t border-slate-900/50">
                          <p>操作责任人: <span className="text-slate-300">{rec.operator}</span></p>
                          <p>物理定位: <span className="text-slate-300">{rec.location}</span></p>
                        </div>
                        <div className="text-[9px] font-mono bg-slate-950/90 text-slate-500 p-1 rounded border border-slate-900/50 overflow-hidden text-ellipsis whitespace-nowrap">
                          交易哈希 txHash: <span className="text-emerald-500">{rec.txHash}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Trigger (C2F Direct Buy) */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center select-none">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">源头直供协议 (C2F Direct Price)</p>
                  <p className="text-lg font-bold text-emerald-400">￥{selectedProduct.price.toFixed(1)}/套</p>
                </div>
                <button
                  onClick={() => alert(`【至真商城】模拟下单成功！系统正在调用该农产工会直供链路投产出库。防伪码: ${selectedProduct.id}`)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  C2F 协同源头直购 (Order Now)
                </button>
              </div>

            </div>
          </div>

          {/* Right panel: AI Visual Verification Engine (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Camera className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-xs text-emerald-300 uppercase tracking-wider">ZhiZhen AI Visual Audit</h3>
                  <h3 className="font-bold text-slate-100 text-sm">随手拍——AI图像智能防伪验真</h3>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                上传当前拍摄的商品实物外包或天然纹理照片，系统将在服务器端连线谷歌大语言模型对两组高精物理状态进行宏观与微观比对。
              </p>

              {/* Demo selectors */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-2">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider">示范比对样本速配：</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyDemoPhoto('genuine')}
                    className={`text-[11px] py-1.5 rounded-lg font-semibold border transition-all cursor-pointer ${uploadImg && selectedDemoPhotoType === 'genuine' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'}`}
                  >
                    绿标：正品实样
                  </button>
                  <button
                    onClick={() => applyDemoPhoto('altered')}
                    className={`text-[11px] py-1.5 rounded-lg font-semibold border transition-all cursor-pointer ${uploadImg && selectedDemoPhotoType === 'altered' ? 'bg-rose-950 border-rose-500/50 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'}`}
                  >
                    红标：变异仿冒样品
                  </button>
                </div>
              </div>

              {/* Upload field */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">或上传本地真实实拍图：</label>
                <div className="border border-dashed border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 text-center bg-slate-950 transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUploadChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadImg ? (
                    <div className="space-y-2">
                      <p className="text-xs text-emerald-400 font-medium font-mono flex items-center justify-center gap-1">✓ 图像特征已采集成功</p>
                      <p className="text-[10px] text-slate-500 truncate">{uploadImg.slice(0, 50)}...</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-4">
                      <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">点击此处选择图片或拖拽到此</p>
                      <p className="text-[10px] text-slate-550">支持PNG、JPG、JPEG格式</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action query button */}
              {uploadImg && (
                <button
                  onClick={runAiVerification}
                  disabled={verifying}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4.5 h-4.5" />}
                  {verifying ? '正在调拨 AI 进行图像微痕比对 1.5s...' : '一键启动 AI 多模态视觉比对'}
                </button>
              )}

              {/* Loader screen inside box representing high tech audit */}
              {verifying && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-3 animate-pulse">
                  <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-300 font-mono">至真AI视觉核验网点运行中...</p>
                  <p className="text-[10px] text-slate-500">正在对比产品商标边缘及哈希网格图像...</p>
                </div>
              )}

              {/* AI Verification Diagnostic Result Screen */}
              {verifResult && (
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 space-y-4 animate-fade-in border-l-4 overflow-hidden relative"
                  style={{ borderLeftColor: verifResult.status === 'success' ? '#10b981' : verifResult.status === 'warning' ? '#f59e0b' : '#f43f5e' }}
                >
                  
                  {/* Decorative faint background bar for high UI polish */}
                  <div className="absolute top-0 right-0 p-3 select-none text-[32px] font-black font-mono opacity-5 text-slate-100">
                    {verifResult.score}%
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500">核验结果报告</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${verifResult.status === 'success' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20' : verifResult.status === 'warning' ? 'bg-amber-950/80 text-amber-400 border border-amber-500/20' : 'bg-rose-950/80 text-rose-400 border border-rose-500/20'}`}>
                      {verifResult.status === 'success' ? '正品通过 CONFIRMED' : verifResult.status === 'warning' ? '微弱差异 SUSPICIOUS' : '疑似假冒 COUNTERFEIT'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-100 font-mono">{verifResult.score}</span>
                      <span className="text-[10px] text-slate-400 font-mono">/ 100 真伪符合分</span>
                    </div>
                    {/* Visual bar graph representation */}
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${verifResult.score}%`,
                          backgroundColor: verifResult.status === 'success' ? '#10b981' : verifResult.status === 'warning' ? '#f59e0b' : '#f43f5e'
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-justify">
                    <span className="text-[10px] font-bold text-slate-400 block font-mono">大模型多维度对比判定结论 (Chinese Translation):</span>
                    <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-900">
                      {verifResult.analysis}
                    </p>
                  </div>

                  {verifResult.mismatchPoints && verifResult.mismatchPoints.length > 0 && (
                    <div className="space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-rose-400 block font-mono">检出非标失稳差异点 (Discrepancies found):</span>
                      <ul className="space-y-1 pl-1">
                        {verifResult.mismatchPoints.map((pt: string, idx: number) => (
                          <li key={idx} className="text-[10px] text-slate-400 flex items-start gap-1 font-mono">
                            <span className="text-rose-500">▪</span> {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
              )}

              {/* Close/Clean Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full hover:bg-slate-800 border-t border-slate-800 text-slate-400 hover:text-slate-200 text-xs py-2 pt-4 transition-colors font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                返回一物一码查询首页
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
