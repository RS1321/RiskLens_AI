import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Zap, 
  Activity, 
  Wallet, 
  History,
  ShieldAlert,
  ShieldEllipsis,
  TrendingUp,
  Search,
  ServerCrash
} from "lucide-react";

/**
 * STYLES
 * Fixed the background-image URL to use the correct public path.
 */
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@300;400;600&display=swap');

    :root {
      --primary: 187 80% 48%;
      --accent: 255 70% 60%;
    }

    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background-color: #060c1a;
      /* CORRECTED IMAGE PATH: Files in /public are accessed via /filename */
      background-image:  
        url('/image 1.png'); 
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      background-repeat: no-repeat;
      color: #f0f4f8;
    }

    h1, h2, h3, h4 {
      font-family: 'Orbitron', sans-serif;
    }

    .bg-grid {
      background-image:
        linear-gradient(hsla(187, 80%, 48%, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, hsla(187, 80%, 48%, 0.04) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    .glow-border {
      border: 1px solid hsla(187, 80%, 48%, 0.25);
      box-shadow: inset 0 0 30px hsla(187, 80%, 48%, 0.05), 0 0 15px hsla(187, 80%, 48%, 0.1);
    }

    .particle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: hsla(187, 80%, 48%, 0.6);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { opacity: 0.3; transform: translateY(0); }
      50% { opacity: 1; transform: translateY(-20px); }
    }
  `}} />
);

// --- Components ---

const RiskStats = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { label: "Scan Volume", value: "1.2M", icon: Activity, color: "text-cyan-400" },
      { label: "Threats Blocked", value: "84.2k", icon: ShieldCheck, color: "text-emerald-400" },
    ].map((stat, i) => (
      <div key={i} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <stat.icon size={16} className={`${stat.color} mb-2`} />
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{stat.label}</div>
        <div className="text-xl font-bold">{stat.value}</div>
      </div>
    ))}
  </div>
);

const AnalyzerForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputs, setInputs] = useState({
    wallet: "0x" + Math.random().toString(16).slice(2, 10),
    token: "GamblingToken",
    amount: "50000",
    network: "North Korea"
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // FIXED: Actually calling your Python Backend on Port 8001
      const response = await fetch("http://127.0.0.1:8001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(inputs.amount),
          location: inputs.network,
          merchant_type: inputs.token
        }),
      });

      if (!response.ok) throw new Error("Backend Offline");

      const data = await response.json();
      setResult({
        riskLevel: data.risk_level,
        riskScore: Math.round(data.risk_score * 100),
        explanation: data.explanation,
        confidence: 98
      });
    } catch (error) {
      setResult({
        riskLevel: "Error",
        riskScore: 0,
        explanation: "Backend Connection Failed. Ensure Python main.py is running on port 8001.",
        confidence: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-3xl glow-border bg-slate-900/30 backdrop-blur-xl border border-slate-800">
      <form onSubmit={handleAnalyze} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Wallet size={12} /> Wallet Address
            </label>
            <input 
              value={inputs.wallet}
              onChange={(e) => setInputs({...inputs, wallet: e.target.value})}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Token Name</label>
            <input 
              value={inputs.token}
              onChange={(e) => setInputs({...inputs, token: e.target.value})}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Transaction Amount</label>
            <input 
              value={inputs.amount}
              onChange={(e) => setInputs({...inputs, amount: e.target.value})}
              type="number" 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Network / Location</label>
            <input 
              value={inputs.network}
              onChange={(e) => setInputs({...inputs, network: e.target.value})}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-sm" 
            />
          </div>
        </div>
        
        <button 
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck size={20} />
              <span>Analyze Transaction Risk</span>
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 rounded-2xl bg-slate-950/40 border border-slate-800 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm">Analysis Result</h4>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${
              result.riskLevel === 'Normal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
              result.riskLevel === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                result.riskLevel === 'Normal' ? 'bg-emerald-500' : 
                result.riskLevel === 'Suspicious' ? 'bg-amber-500' : 'bg-red-500'
              } animate-pulse`} />
              {result.riskLevel} ({result.riskScore}%)
            </div>
          </div>
          <p className="text-sm text-slate-300 mb-2 flex items-center gap-2">
            <ShieldEllipsis size={14} className="text-cyan-400" />
            {result.explanation}
          </p>
          <div className="text-[10px] text-slate-500 italic">Confidence Score: {result.confidence}%</div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket for Live Data
  useEffect(() => {
    let ws: WebSocket;
    const connect = () => {
      ws = new WebSocket("ws://127.0.0.1:8001/ws/stream");
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connect, 3000);
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error) return;
        const newTx = {
          id: "tx-" + Math.random().toString(16).slice(2, 8),
          asset: data.transaction.merchant_type,
          amount: data.transaction.amount.toLocaleString(),
          level: data.analysis.risk_level,
          time: data.transaction.time
        };
        setTransactions(prev => [newTx, ...prev].slice(0, 8));
      };
    };
    connect();
    return () => ws?.close();
  }, []);

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-grid pb-20 relative">
        <main className="container mx-auto px-4 pt-12 lg:pt-20 relative z-10">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-widest mb-6">
              <ShieldCheck size={14} />
              <span>AI-POWERED REAL-TIME ANALYSIS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-slate-100 to-purple-400 uppercase">
              RiskLens <span className="text-white">Fraud & Scam</span> Detector
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
              Advanced risk analysis for digital assets and financial transactions. 
              Identify threats before they execute.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
                  <Activity className="text-cyan-400" size={20} />
                  Network Health
                </h2>
                <RiskStats />
              </div>
              
              <div className="p-6 rounded-2xl glow-border bg-slate-900/50 backdrop-blur-xl border border-slate-800/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-tight">
                  <Zap className="text-purple-400" size={18} />
                  Quick Insights
                </h3>
                <ul className="space-y-3 text-sm text-slate-400 font-light">
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    ML Model v2.5.0 connected to Python brain
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    Real-time monitoring active
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-12">
              <section id="analyzer">
                <AnalyzerForm />
              </section>

              <section id="history" className="pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 uppercase">
                     <History className="text-cyan-400" size={24} />
                     Live Threat Stream
                  </h2>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                    {isConnected ? 'Live Feed Active' : 'Backend Offline'}
                  </div>
                </div>
                
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-md">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800/50 border-b border-slate-800">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Asset</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Risk Level</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {transactions.map((tx, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors animate-in fade-in slide-in-from-left-2 duration-300">
                          <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{tx.id}</td>
                          <td className="px-6 py-4 text-sm font-medium">{tx.asset}</td>
                          <td className="px-6 py-4 text-sm">${tx.amount}</td>
                          <td className="px-6 py-4">
                             <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                               tx.level === 'Normal' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 
                               tx.level === 'Suspicious' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                               'bg-red-500/5 border-red-500/20 text-red-400'
                             }`}>
                               {tx.level}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-[10px] text-slate-500 text-right font-mono">{tx.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;