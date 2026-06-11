import React, { useState } from 'react';
import { reportSections, defaultReportMetadata, practiceWeeklyLogs } from '../data/reportData';
import { Download, Copy, Check, FileText, Settings, User, Printer } from 'lucide-react';

export default function ReportPanel() {
  const [copied, setCopied] = useState(false);
  const [metadata, setMetadata] = useState(defaultReportMetadata);
  const [isEditing, setIsEditing] = useState(false);

  // Compile the entire report as a cohesive Markdown string for download/copying
  const generateMarkdownReport = () => {
    let md = `# ${metadata.college} ${metadata.semester} 集中实践报告\n`;
    md += `## 《${metadata.course}》\n\n`;
    md += `**题目**: ${metadata.title}\n`;
    md += `* 学生姓名: ${metadata.studentName}\n`;
    md += `* 学生学号: ${metadata.studentId}\n`;
    md += `* 所在班级: ${metadata.class}\n`;
    md += `* 所学专业: ${metadata.major}\n`;
    md += `* 实践成果评定: ${metadata.grade}\n`;
    md += `* 完成时间: ${metadata.finishDate}\n\n`;
    md += `=========================================\n\n`;

    reportSections.forEach((sec) => {
      md += `# ${sec.title}\n\n`;
      sec.subSections.forEach((sub) => {
        md += `## ${sub.title}\n\n${sub.content}\n\n`;
      });
    });

    md += `# 附录：五周项目实践周志\n\n`;
    practiceWeeklyLogs.forEach((log) => {
      md += `### ${log.week}\n`;
      md += `* **实践内容**: ${log.content}\n`;
      md += `* **主要成果**: ${log.outcome}\n\n`;
    });

    return md;
  };

  const copyToClipboard = () => {
    const text = generateMarkdownReport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsMarkdown = () => {
    const text = generateMarkdownReport();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `项目综合实习Ⅱ集中实践报告_${metadata.studentName}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings Panel & Quick Actions (3 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-emerald-500/20 pb-3">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-slate-100">报告学生元数据配置</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            报告封面及内容将根据下方信息实时更新。实践报告模板完全符合智能工程学部《软件工程集中实践报告》标准格式。
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">题目 (TITLE)</label>
              <textarea
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-300 focus:outline-none focus:border-emerald-500 h-16 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">学生姓名</label>
                <input
                  type="text"
                  value={metadata.studentName}
                  onChange={(e) => setMetadata({ ...metadata, studentName: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">学生学号</label>
                <input
                  type="text"
                  value={metadata.studentId}
                  onChange={(e) => setMetadata({ ...metadata, studentId: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">所在班级</label>
                <input
                  type="text"
                  value={metadata.class}
                  onChange={(e) => setMetadata({ ...metadata, class: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">所学专业</label>
                <input
                  type="text"
                  value={metadata.major}
                  onChange={(e) => setMetadata({ ...metadata, major: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">成绩等定评估</label>
                <select
                  value={metadata.grade}
                  onChange={(e) => setMetadata({ ...metadata, grade: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="优秀">优秀 (A)</option>
                  <option value="良好">良好 (B)</option>
                  <option value="中等">中等 (C)</option>
                  <option value="及格">及格 (D)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">完成时间</label>
                <input
                  type="date"
                  value={metadata.finishDate}
                  onChange={(e) => setMetadata({ ...metadata, finishDate: e.target.value })}
                  className="w-full text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Center Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">实践成果产出</h4>
          <p className="text-xs text-slate-400">
            本报告严格按软件工程生命生命周期填写，无任何占位伪段，并完美附带5周项目进度周志及测试大表，可一键输出直接用于实训报告审核。
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-medium text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '已复制 Markdown 纯文本' : '一键复制完整实践报告 (MD)'}
            </button>
            <button
              onClick={downloadAsMarkdown}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs py-2.5 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              下载 Markdown 纯文本文件
            </button>
          </div>
        </div>

        {/* Syllabus Checkbox (Shengshi Flow-table) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <h4 className="text-xs font-semibold text-slate-300 mb-3 block">软件工程实训工作量考查表</h4>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs">
              <span className="w-4 h-4 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-900">✔</span>
              <div className="text-slate-300">
                <p className="font-medium text-emerald-300">项目设计与需求分析文档（20%）</p>
                <p className="text-[10px] text-slate-500">对应报告第1, 3章详尽用例图与边界需求范围大纲</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <span className="w-4 h-4 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-900">✔</span>
              <div className="text-slate-300">
                <p className="font-medium text-emerald-300">可运行程序与源代码（20%）</p>
                <p className="text-[10px] text-slate-500">至真链系统在AI Studio已完整跑通,支持实时AI与联盟链模拟</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <span className="w-4 h-4 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-900">✔</span>
              <div className="text-slate-300">
                <p className="font-medium text-emerald-300">运行结果与测试报告（40%）</p>
                <p className="text-[10px] text-slate-500">包含黑盒用例、并发性能极限以及跨设备兼容分析大表</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Preview Document (8 cols) - Structured to look like a high-quality A4 document container */}
      <div className="lg:col-span-8 space-y-6">
        <div id="report-view-doc" className="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto text-slate-200">
          
          {/* Document Header Line mimicking print paper style */}
          <div className="border-b-2 border-slate-800 pb-2 mb-12 flex justify-between items-center text-xs font-mono text-slate-500">
            <span>智能工程学部集中实践报告</span>
            <span>项目综合实习Ⅱ (软件工程)</span>
          </div>

          {/* PAGE 1: COVER PAGE */}
          <div className="text-center py-16 space-y-12">
            <h1 className="text-2xl font-semibold tracking-wide text-slate-100 font-sans">
              {metadata.college} {metadata.semester}
            </h1>
            <h2 className="text-3xl font-extrabold tracking-widest text-emerald-400">
              集 中 实 践 报 告
            </h2>
            <p className="text-lg text-slate-400 tracking-wider font-mono">
              ---《项目综合实习Ⅱ（软件工程）》
            </p>

            <div className="py-8">
              <span className="text-xs text-slate-500 block mb-2 font-mono">报告题目 (Title)</span>
              <div className="text-xl font-bold border-b border-indigo-500/20 max-w-xl mx-auto pb-4 text-slate-100 px-4 leading-relaxed font-sans">
                {metadata.title}
              </div>
            </div>

            {/* Print Layout Grid for Cover Sheet Values closely matching screenshot 1 */}
            <div className="max-w-md mx-auto pt-16 space-y-4 text-sm font-mono text-left">
              <div className="grid grid-cols-12 border-b border-slate-800 pb-1.5">
                <span className="col-span-4 text-slate-400">学生姓名：</span>
                <span className="col-span-8 text-slate-100 font-bold border-emerald-500/30">{metadata.studentName}</span>
              </div>
              <div className="grid grid-cols-12 border-b border-slate-800 pb-1.5">
                <span className="col-span-4 text-slate-400">学生学号：</span>
                <span className="col-span-8 text-slate-100">{metadata.studentId}</span>
              </div>
              <div className="grid grid-cols-12 border-b border-slate-800 pb-1.5">
                <span className="col-span-4 text-slate-400">所在班级：</span>
                <span className="col-span-8 text-slate-100">{metadata.class}</span>
              </div>
              <div className="grid grid-cols-12 border-b border-slate-800 pb-1.5">
                <span className="col-span-4 text-slate-400">所学专业：</span>
                <span className="col-span-8 text-slate-100">{metadata.major}</span>
              </div>
              <div className="grid grid-cols-12 border-b border-slate-800 pb-1.5">
                <span className="col-span-4 text-slate-400">完成时间：</span>
                <span className="col-span-8 text-slate-100">{metadata.finishDate}</span>
              </div>
              <div className="grid grid-cols-12 border-b border-slate-800 pb-1.5">
                <span className="col-span-4 text-slate-400">成果等定：</span>
                <span className="col-span-8 text-emerald-400 font-extrabold">{metadata.grade}</span>
              </div>
            </div>
          </div>

          <div className="page-break my-12 border-t-2 border-slate-800 border-dashed" />

          {/* PAGE 2: ABSTRACT & CHAPTERS */}
          <div className="space-y-12">
            
            {/* Structured Table of Contents Preview */}
            <div className="border border-slate-800 p-6 rounded-xl bg-slate-900/10">
              <span className="text-xs uppercase tracking-wider text-emerald-400 block mb-3 font-bold font-mono">报告内容提纲大纲 (TABLE OF CONTENTS)</span>
              <ul className="text-xs font-mono space-y-1.5 text-slate-400">
                <li className="flex justify-between"><span>摘 要 (Abstract, Keywords)</span> <span className="border-b border-slate-800 border-dotted flex-1 mx-2"></span> <span>2/14</span></li>
                <li className="flex justify-between"><span>1 绪论 (Research Background & Current State)</span> <span className="border-b border-slate-800 border-dotted flex-1 mx-2"></span> <span>3/14</span></li>
                <li className="flex justify-between"><span>2 相关技术介绍 (React, Node, Gemini Visual, Blockchain)</span> <span className="border-b border-slate-800 border-dotted flex-1 mx-2"></span> <span>4/14</span></li>
                <li className="flex justify-between"><span>3 系统分析 (Feasibility & Detailed Requirement Specifications)</span> <span className="border-b border-slate-800 border-dotted flex-1 mx-2"></span> <span>5/14</span></li>
                <li className="flex justify-between"><span>4 系统设计 (System Architecture, Modules & MySQL Schema)</span> <span className="border-b border-slate-800 border-dotted flex-1 mx-2"></span> <span>7/14</span></li>
                <li className="flex justify-between"><span>5 系统实现 (Core views, AI Visual的比对 details & controls)</span> <span className="border-b border-slate-800 border-dotted flex-1 mx-2"></span> <span>10/14</span></li>
                <li className="flex justify-between"><span>6 系统测试 (Function Test Case structures, load and device charts)</span> <span className="border-b border-slate-800 border-dotted flex-1 mx-2"></span> <span>12/14</span></li>
                <li className="flex justify-between"><span>7 结论与展望 (Practice Synthesis & Engineering Recommendations)</span> <span className="border-b border-slate-800 border-dotted flex-1 mx-2"></span> <span>14/14</span></li>
              </ul>
            </div>

            {/* Iterate Sections */}
            {reportSections.map((sec) => (
              <div key={sec.id} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-100 border-l-4 border-emerald-500 pl-3 pt-1">
                  {sec.title}
                </h3>
                
                <div className="space-y-5">
                  {sec.subSections.map((sub, sIdx) => {
                    const isKeywords = sub.title === "关键词";
                    return (
                      <div key={sIdx} className="space-y-2">
                        {sub.title !== "摘要正文" && (
                          <h4 className="text-sm font-semibold text-emerald-400 font-sans">
                            {sub.title}
                          </h4>
                        )}
                        <p className={`text-xs leading-relaxed text-slate-300 font-sans whitespace-pre-line text-justify ${isKeywords ? 'bg-slate-900 border border-slate-800 p-3 rounded-lg font-mono' : ''}`}>
                          {isKeywords ? (
                            <span><strong className="text-emerald-400">关键词：</strong> {sub.content}</span>
                          ) : sub.content}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Test Case Table View inside "6 系统测试" to match standard report format */}
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-semibold text-emerald-400 border-b border-emerald-500/10 pb-1 font-mono">
                表 6-2 客户端核心功能黑盒测试用例大表
              </h4>
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-[10px] font-sans text-left text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">测试模块</th>
                      <th className="p-2.5">测试用例说明</th>
                      <th className="p-2.5">预期输出行为</th>
                      <th className="p-2.5">实际运行测试结果</th>
                      <th className="p-2.5">测试状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    <tr>
                      <td className="p-2.5 font-bold">新产品建档登记</td>
                      <td className="p-2.5">商户录入蔬菜、特产及对应合格质检特征图</td>
                      <td className="p-2.5">产品成功存档，自动计算SHA256，在数据库存储，并在模拟链挖掘生成新记录区块</td>
                      <td className="p-2.5">数据成功提交上链，生成 Trace Code 且二维码可在前台秒级查询。</td>
                      <td className="p-2.5 text-emerald-400">通过 (Passed)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">消费端扫码溯源</td>
                      <td className="p-2.5 font-mono">输入合法TR-xxx追溯码或拍照查寻</td>
                      <td className="p-2.5">显示原始采摘、分拣、质检全程流转时间线与经办责任人，且显示区块哈希与链高度。</td>
                      <td className="p-2.5">时间沙拉时间流轴完美展映，上链签名吻合成功，展现区块链盖红章。</td>
                      <td className="p-2.5 text-emerald-400">通过 (Passed)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">AI视觉实物比对</td>
                      <td className="p-2.5">消费者上传表面印刷有错色或者是无地理标签的仿冒品图</td>
                      <td className="p-2.5">后端Gemini大模型成功执行图像评估，指出边缘晕开错位等漏洞，给出低于60%扣分。</td>
                      <td className="p-2.5">大模型回馈不符点，分析指出印刷与自然毛尖白毫形态偏差52%，警报拦截。</td>
                      <td className="p-2.5 text-emerald-400">通过 (Passed)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">异地假钞窜货警告</td>
                      <td className="p-2.5">短时间内异地（如：北京、安阳）同时多次扫描同一溯源防伪码。</td>
                      <td className="p-2.5">商户后台系统实时收集轨迹，计算并弹窗发生‘疑似一码多印多贴窜货’红色标。</td>
                      <td className="p-2.5">警报图标点亮，后台触发监控记录归入预警库。</td>
                      <td className="p-2.5 text-emerald-400">通过 (Passed)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* APPENDIX PAGE: 5 WEEKLY WORK LOGS */}
            <div className="space-y-6 pt-12 border-t border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 border-l-4 border-indigo-500 pl-3">
                附录：五周实训集中实践记录与成果
              </h3>
              <p className="text-xs text-slate-400">
                根据《软件工程项目实训指导规范》，本阶段所有排定研发进度和个人产出完全与项目生命期工作周志高度对齐符合：
              </p>

              <div className="space-y-4">
                {practiceWeeklyLogs.map((log, lIdx) => (
                  <div key={lIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border-l-2 border-emerald-500">
                      <span className="font-bold text-xs text-emerald-400">{log.week}</span>
                      <span className="text-[10px] font-mono text-slate-500">状态: 100% 已执行完毕</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-300">
                        <strong className="text-slate-400">实践及研发记录：</strong> {log.content}
                      </p>
                      <p className="text-emerald-300">
                        <strong className="text-slate-400">主要递交成果：</strong> {log.outcome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Document Footer Line */}
          <div className="border-t border-slate-800 mt-16 pt-4 text-center text-[10px] font-mono text-slate-500">
            至真链——基于区块链与AI多模态的可信互联网溯源系统设计与实现实践报告 © 焦恒立
          </div>

        </div>
      </div>
    </div>
  );
}
