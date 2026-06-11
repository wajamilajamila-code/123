import React, { useState, useEffect } from 'react';
import { Layers, ShieldCheck, PlusCircle, LayoutGrid, Trash2, Camera, AlertTriangle, ListFilter, CheckCircle, RefreshCw, ShoppingCart } from 'lucide-react';

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

export default function ProducerPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scanLogs, setScanLogs] = useState<any[]>([]);
  const [blocksCount, setBlocksCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form states for creating new product
  const [name, setName] = useState('');
  const [category, setCategory] = useState('水果蔬菜');
  const [origin, setOrigin] = useState('河南省新乡市新乡县合胜庄');
  const [producer, setProducer] = useState('新乡至真绿色果蔬专业联社');
  const [price, setPrice] = useState('28.5');
  const [trademarkNo, setTrademarkNo] = useState('TM-新乡-4107038');
  const [specDetails, setSpecDetails] = useState('大棚纯净水源培育、精细套袋保护、无化肥、采摘微多毫、支持双相防伪');
  const [imageUrl, setImageUrl] = useState('');

  // Form states for adding stage trace steps
  const [selectedProductId, setSelectedProductId] = useState('');
  const [stageName, setStageName] = useState('');
  const [operator, setOperator] = useState('');
  const [stepLocation, setStepLocation] = useState('');
  const [stepDesc, setStepDesc] = useState('');

  // Tab control inside producer desk
  const [activeTab, setActiveTab] = useState<'inventory' | 'register' | 'add-step' | 'security'>('inventory');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Products fetch
      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      setProducts(pData);
      if (pData.length > 0 && !selectedProductId) {
        setSelectedProductId(pData[0].id);
      }

      // Logs fetch
      const lRes = await fetch('/api/scan-logs');
      const lData = await lRes.json();
      setScanLogs(lData);

      // Blocks fetch
      const bRes = await fetch('/api/blocks');
      const bData = await bRes.json();
      setBlocksCount(bData.length);
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !producer || !origin) {
      alert("请填写商品名称、生产单位以及种植原产地！");
      return;
    }

    try {
      const res = await fetch('/api/products/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          origin,
          producer,
          price: Number(price),
          trademarkRegNo: trademarkNo,
          specDetails,
          imageUrl: imageUrl || undefined
        })
      });

      if (res.ok) {
        alert("恭喜，新特产登存成功！哈希签名指纹已记录至最新联盟链，Trace QR已生成！");
        // Reset form
        setName('');
        setPrice('28.5');
        // Reload dashboard
        await fetchDashboardData();
        setActiveTab('inventory');
      } else {
        alert("系统登记出现异常，请重试。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProcessStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !stageName || !operator || !stepLocation) {
      alert("请完整填写执行节点名称、经办责任人及操作位置！");
      return;
    }

    try {
      const res = await fetch(`/api/products/${selectedProductId}/add-step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageName,
          operator,
          location: stepLocation,
          description: stepDesc
        })
      });

      if (res.ok) {
        alert("流转记录成功追加！交易签名已存证至最新挖掘出的块。");
        setStageName('');
        setOperator('');
        setStepLocation('');
        setStepDesc('');
        await fetchDashboardData();
        setActiveTab('inventory');
      } else {
        alert("追加步段出现问题。");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safe category colors
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case '水果蔬菜': return 'bg-emerald-950 text-emerald-400 border-emerald-900';
      case '休闲副食': return 'bg-indigo-950 text-indigo-400 border-indigo-900';
      case '非遗手工艺': return 'bg-amber-950 text-amber-400 border-amber-900';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">排产溯源产品</span>
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-black text-slate-100 font-mono">{products.length}</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">批次安全建档</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">已校验挖掘区块</span>
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-black text-slate-100 font-mono">{blocksCount}</span>
            <span className="text-[10px] text-emerald-400 font-mono">联盟链高度 H</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">核准注册商标</span>
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-black text-slate-100 font-mono">{products.length}</span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">合规保护</span>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-[10px] font-mono tracking-wider text-slate-500 block uppercase">高危异常扫码涉窜</span>
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-black text-rose-500 font-mono">
              {scanLogs.filter(s => s.verificationStatus === 'warning' || s.verificationStatus === 'danger').length}
            </span>
            <span className="text-[10px] text-rose-500 font-bold font-mono">⚠️ 待处置预警</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Sub-tabs */}
      <div className="flex border-b border-slate-800 gap-1 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer hover:text-slate-100 ${activeTab === 'inventory' ? 'border-b-2 border-emerald-500 text-emerald-300 bg-slate-900/40 rounded-t-lg' : 'text-slate-400'}`}
        >
          🗂️ 排产批次检索并印码
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer hover:text-slate-100 ${activeTab === 'register' ? 'border-b-2 border-emerald-500 text-emerald-300 bg-slate-900/40 rounded-t-lg' : 'text-slate-400'}`}
        >
          ➕ 登存新产品防伪上链
        </button>
        <button
          onClick={() => setActiveTab('add-step')}
          className={`px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer hover:text-slate-100 ${activeTab === 'add-step' ? 'border-b-2 border-emerald-500 text-emerald-300 bg-slate-900/40 rounded-t-lg' : 'text-slate-400'}`}
        >
          ⏳ 追加流转加工链条
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer hover:text-slate-100 ${activeTab === 'security' ? 'border-b-2 border-emerald-500 text-emerald-300 bg-slate-900/40 rounded-t-lg' : 'text-slate-400'}`}
        >
          🛡️ 防伪套印窜货预警中心
        </button>
      </div>

      {/* Main Tab content router */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 shadow-inner">
        
        {/* Tab 1: List Products (Inventory) */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">目前注册防伪溯源商品档案</h3>
              <button
                onClick={fetchDashboardData}
                className="text-xs text-emerald-400 flex items-center gap-1 hover:text-emerald-300 hover:scale-105 transition-transform font-bold"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> 刷新仪表盘
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-750 transition-all">
                  <div className="flex gap-4">
                    <img
                      referrerPolicy="no-referrer"
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-lg border border-slate-800 bg-slate-950 shrink-0"
                    />
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono font-semibold border ${getCategoryTheme(p.category)}`}>
                          {p.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 truncate">溯源码码: {p.id}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-100 truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed truncate">地址: {p.origin}</p>
                      <p className="text-[10px] text-slate-500 font-mono">商标号: {p.trademarkRegNo}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-slate-900 text-[10px] font-mono">
                    <span className="text-emerald-400 font-medium">累计节点段数: {p.records.length} 个</span>
                    <button
                      onClick={() => alert(`【一物一码印制中】至真码: ${p.id}\n正在配置矢量防伪标标签贴画文件。\n套色商标号: ${p.trademarkRegNo}\n生产指纹SHA256: ${p.blockchainHash}`)}
                      className="bg-slate-800 hover:bg-zinc-700 text-slate-100 px-3 py-1 rounded transition-colors text-[9px] font-bold uppercase"
                    >
                      🖨️ 印一品一码防伪标
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Register New */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterProduct} className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-100">登记录入新批次农产品档案 & 上链防伪</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">商品标准名称 (Product Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="如：信阳车云山特级毛尖"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">物理分属种类</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="水果蔬菜">水果蔬菜 (如鲜茶、红薯、苹果)</option>
                  <option value="休闲副食">休闲副食 (如手工面条、糕点)</option>
                  <option value="非遗手工艺">非遗手工艺 (如太行玉器、编织)</option>
                  <option value="其他">其他品类</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">排产装瓶经销企业 (Producer) *</label>
                <input
                  type="text"
                  required
                  placeholder="如：信阳车云山生态茶产合作社"
                  value={producer}
                  onChange={(e) => setProducer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">原产地理位置 (GPS/Origin) *</label>
                <input
                  type="text"
                  required
                  placeholder="如：河南省信阳市浉河区阳坡二号"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">核准注册在案商标证书编号</label>
                <input
                  type="text"
                  placeholder="如：TM-信阳-4115003"
                  value={trademarkNo}
                  onChange={(e) => setTrademarkNo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">出厂零售单价(元)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">自配产品参考图</label>
                  <select
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none"
                  >
                    <option value="">默认随机特产图</option>
                    <option value="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&auto=format&fit=crop&q=60">精品绿茶罐装示范图</option>
                    <option value="https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&auto=format&fit=crop&q=60">手工粉条捆封示范图</option>
                    <option value="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=60">手工玉雕饰品示范图</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="text-xs font-mono">
              <label className="block text-slate-400 mb-1">微观理化特质或质检标准说明(后期AI验真参照系) *</label>
              <textarea
                value={specDetails}
                onChange={(e) => setSpecDetails(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-emerald-500 h-20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              打包登记，并将初始信息防伪上链发布 (Mine Block)
            </button>
          </form>
        )}

        {/* Tab 3: Add Processing trace step */}
        {activeTab === 'add-step' && (
          <form onSubmit={handleAddProcessStep} className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-100">批量追加最新生产、加工、商检流转历史长链</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">选择目标关联产品批次 *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none text-xs"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (至真码: {p.id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">执行流转节点名称 (Stage) *</label>
                <input
                  type="text"
                  required
                  placeholder="如：清洗脱水分拣、农检部门复检"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">现场操作签字责任人 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：化验师 王伟强"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">具体进行地理GPS位置描述 *</label>
                <input
                  type="text"
                  required
                  placeholder="如：河南省辉县非遗产业园一号实验室"
                  value={stepLocation}
                  onChange={(e) => setStepLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="text-xs font-mono">
              <label className="block text-slate-400 mb-1">当前过程图文记录细节 (Chinese Desc)</label>
              <textarea
                placeholder="在此录入该阶段的质量测定和物理环境参数细节，确保透明合规。"
                value={stepDesc}
                onChange={(e) => setStepDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-indigo-500 h-20 resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-slate-100 font-bold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              追加节点数据，并铸造存证交易 (Mine block txn)
            </button>
          </form>
        )}

        {/* Tab 4: Security Scan alerts (Anti-Counterfeiting Oversight) */}
        {activeTab === 'security' && (
          <div className="space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              消费者扫码校验日志 & AI 风险雷达 (REAL-TIME AUDIT LOGS)
            </h3>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="p-3">记录ID</th>
                    <th className="p-3">产品关联</th>
                    <th className="p-3">操作时间</th>
                    <th className="p-3">扫描地理GPS/IP</th>
                    <th className="p-3">检测状态</th>
                    <th className="p-3">异常及追溯备注</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-[11px] bg-slate-950/25">
                  {scanLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-3 font-semibold text-slate-400">{log.id}</td>
                      <td className="p-3 text-slate-100 font-bold">{log.productName} <span className="text-[10px] text-slate-500">({log.productId})</span></td>
                      <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-300">{log.location}</p>
                        <p className="text-[9px] text-zinc-500">{log.ip}</p>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${log.verificationStatus === 'success' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-rose-950/80 text-rose-400 border border-rose-900/30'}`}>
                          {log.verificationStatus === 'success' ? '✔ 正常' : '⚠️ 高危警报'}
                        </span>
                      </td>
                      <td className="p-3 text-[10px] text-slate-400 leading-relaxed max-w-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
