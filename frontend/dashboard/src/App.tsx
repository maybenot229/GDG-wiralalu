import React, { useState, useEffect } from 'react';
import './App.css';

interface ThoughtLog {
  id: string;
  intersection: string;
  action: string;
  reasoning: string;
  rejectedAlternative: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [logs, setLogs] = useState<ThoughtLog[]>([]);
  const [isFloodSimulated, setIsFloodSimulated] = useState(false);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeIntersection, setActiveIntersection] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ flood: 0.2, stability: 98.4, density: 4.2 });
  const [mapCenter, setMapCenter] = useState("116.07,5.98"); // Default Kota Kinabalu

  // Simulated live updates for the hackathon demo
  useEffect(() => {
    const intersections = ["Gaya Street", "Waterfront", "Likas", "Penampang", "Inanam", "Kolombong"];
    
    const mockUpdates = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * intersections.length);
      const scenarioIdx = Math.floor(Math.random() * 4);
      const selectedIntersection = intersections[randomIdx];

      setActiveIntersection(selectedIntersection);

      // Dynamic Metrics Update
      setMetrics({
        flood: isFloodSimulated ? (selectedIntersection === "Likas" ? 2.1 : 0.8) : 0.2,
        stability: isFloodSimulated ? 85.2 : 98.4,
        density: scenarioIdx === 2 ? 8.5 : 4.2
      });

      let action = "MAINTAIN";
      let reasoning = "";
      let rejected = "";

      if (isFloodSimulated && (selectedIntersection === "Likas" || selectedIntersection === "Waterfront")) {
        action = "EMERGENCY_CLEAR";
        reasoning = `Likas Bay water levels are critical at ${metrics.flood}m. Clearing all lanes at ${selectedIntersection} to avoid total gridlock.`;
        rejected = "Keep light green. Rejected because stalled cars would block emergency drainage access.";
      } else if (isEmergencyActive && randomIdx === 0) {
        action = "FORCE_GREEN";
        reasoning = "I hear an ambulance siren! I'm turning all lights green on this path to let it through fast.";
        rejected = "Keep the side-road green. Rejected because saving a life is more important.";
      } else {
        const normalScenarios = [
          {
            a: "EXTEND_GREEN",
            r: `Lots of delivery riders spotted at ${selectedIntersection}. Keeping the light green to help them finish their orders.`,
            rj: "Stop the main road. Rejected because the RapidKK bus is coming and shouldn't wait."
          },
          {
            a: "MAINTAIN",
            r: "Heavy traffic from the city. Balancing both sides so nobody waits too long.",
            rj: "Give extra time to Gaya Street. Rejected because it would cause a jam at the Waterfront."
          },
          {
            a: "FORCE_RED",
            r: "I see many people trying to cross to the market. Stopping cars now to let them walk safely.",
            rj: "Keep cars moving. Rejected because I detected a family with a stroller waiting to cross."
          },
          {
            a: "EXTEND_GREEN",
            r: "Coordinating with Penampang node. Creating a 'Green Wave' so cars don't have to stop and waste fuel.",
            rj: "Let them stop. Rejected because idling engines are bad for Sabah's air quality."
          }
        ];
        action = normalScenarios[scenarioIdx].a;
        reasoning = normalScenarios[scenarioIdx].r;
        rejected = normalScenarios[scenarioIdx].rj;
      }

      const newLog: ThoughtLog = {
        id: Math.random().toString(36).substr(2, 9),
        intersection: selectedIntersection,
        action,
        reasoning,
        rejectedAlternative: rejected,
        timestamp: new Date().toLocaleTimeString(),
      };
      setLogs(prev => [newLog, ...prev].slice(0, 30));

      // Clear highlight after 2 seconds
      setTimeout(() => setActiveIntersection(null), 2000);
    }, 3000);

    return () => clearInterval(mockUpdates);
  }, [isFloodSimulated, isEmergencyActive, metrics.flood]);

  return (
    <div className="dashboard-container">
      {/* History Modal */}
      {showHistory && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="card" style={{ width: '90%', maxHeight: '85%', overflowY: 'auto', border: '1px solid #38bdf8', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ color: '#38bdf8' }}>FULL AGENTIC DECISION HISTORY</h2>
              <button className="btn btn-danger" style={{ padding: '8px 20px' }} onClick={() => setShowHistory(false)}>CLOSE [X]</button>
            </div>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: '#38bdf8', borderBottom: '2px solid #38bdf8' }}>
                  <th style={{ padding: '10px' }}>Timestamp</th>
                  <th>Intersection</th>
                  <th>Action</th>
                  <th>AI Reasoning Chain</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '12px', fontSize: '0.8rem' }}>{l.timestamp}</td>
                    <td style={{ fontWeight: 700 }}>{l.intersection}</td>
                    <td style={{ color: l.action.includes('EMERGENCY') ? '#ef4444' : '#10b981', fontWeight: 800 }}>{l.action}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{l.reasoning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <header className="header" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981', animation: 'pulse 1s infinite' }}></div>
          <h1 className="title">WiraLalu Dashboard</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="status-badge">LIVE SYSTEM: KOTA KINABALU</div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px', fontWeight: 800 }}>AGENTIC CORES: 04 ACTIVE</div>
        </div>
      </header>
      
      <div className="strategic-grid">
        {/* Left: Huge Map */}
        <main className="map-area">
          <div className="card" style={{ height: 'calc(100vh - 180px)', position: 'relative' }}>
            <h3>City Digital Twin: KK (Strategic View)</h3>
            <div style={{ 
              height: '90%', 
              background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
              backgroundColor: '#0f172a',
              borderRadius: '12px', 
              position: 'relative',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              overflow: 'hidden'
            }}>
              {/* Digital Twin Grid Overlay */}
              <div style={{ 
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                zIndex: 1 
              }}></div>

              {/* LIVE RADAR SWEEP */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', width: '150%', height: '150%',
                background: 'conic-gradient(from 0deg, transparent, rgba(56, 189, 248, 0.1) 10%, transparent 20%)',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                animation: 'rotate 4s linear infinite',
                zIndex: 1, pointerEvents: 'none'
              }}></div>

              {/* TERMINAL SCANLINE */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 3px 100%',
                zIndex: 15, pointerEvents: 'none', opacity: 0.1
              }}></div>
              
              {/* High Density Traffic Dots (Hidden during floods) */}
              {!isFloodSimulated && Array.from({length: 60}).map((_, i) => (
                <div key={i} className="pedestrian-dot" style={{ 
                  position: 'absolute', 
                  top: `${Math.random() * 80 + 10}%`, 
                  left: `${Math.random() * 80 + 10}%`, 
                  zIndex: 5,
                  opacity: 0.4
                }}></div>
              ))}

              {/* Arterial Roads Sync'd to City Positions */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
                {/* Coastal: Waterfront(20,20) -> Gaya(45,45) -> Likas(65,15) */}
                <path d="M20 20 L 45 45 L 65 15" stroke="rgba(56, 189, 248, 0.6)" strokeWidth="1.5" fill="none" />
                
                {/* Interior: Kolombong(10,40) -> Gaya(45,45) -> Inanam(70,70) */}
                <path d="M10 40 L 45 45 L 70 70" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.5" fill="none" />
                
                {/* Penampang Link: Gaya(45,45) -> Penampang(30,75) */}
                <path d="M45 45 L 30 75" stroke="rgba(56, 189, 248, 0.5)" strokeWidth="1.5" fill="none" />
                
                {/* Cross Connections */}
                <path d="M20 20 L 10 40" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.5" fill="none" />
                <path d="M65 15 L 70 70" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.5" fill="none" />
                <path d="M30 75 L 70 70" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.5" fill="none" />

                {/* Pulsing Data Flow */}
                <path d="M20 20 L 45 45 L 65 15" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" strokeDasharray="2 6" fill="none">
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2s" repeatCount="indefinite" />
                </path>
              </svg>
              {/* On-Map Metrics Overlay */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '8px' }}>
                 <div style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(0,0,0,0.8)', borderRadius: '4px', border: '1px solid #10b981' }}>
                    <span style={{ color: '#94a3b8' }}>FLOOD:</span> <span style={{ color: metrics.flood > 1.0 ? '#ef4444' : '#10b981', fontWeight: 800 }}>{metrics.flood}m</span>
                 </div>
                 <div style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(0,0,0,0.8)', borderRadius: '4px', border: '1px solid #38bdf8' }}>
                    <span style={{ color: '#94a3b8' }}>FIELD:</span> <span style={{ color: '#38bdf8', fontWeight: 800 }}>{metrics.stability}%</span>
                 </div>
              </div>

              {/* Live Disaster Warnings Overlay */}
              {isFloodSimulated && (
                <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, padding: '10px 20px', background: 'rgba(239, 68, 68, 0.9)', border: '2px solid white', borderRadius: '8px', animation: 'blink 0.5s infinite', color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>
                  ⚠️ FLASH FLOOD WARNING: LIKAS BAY SECTOR
                </div>
              )}
              {isEmergencyActive && (
                <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', zIndex: 20, padding: '10px 20px', background: 'rgba(16, 185, 129, 0.9)', border: '2px solid white', borderRadius: '8px', animation: 'pulse 1s infinite', color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>
                  🚑 LIFE CORRIDOR ACTIVE: GAYA ST PATH
                </div>
              )}

              {/* Pedestrian Dots Distributed across KK (Hidden during floods) */}
              {!isFloodSimulated && [
                {t:'48%', l:'42%'}, {t:'52%', l:'48%'}, {t:'25%', l:'22%'}, 
                {t:'18%', l:'60%'}, {t:'70%', l:'35%'}, {t:'65%', l:'68%'}
              ].map((pos, i) => (
                <div key={i} className="pedestrian-dot" style={{ position: 'absolute', top: pos.t, left: pos.l, zIndex: 5 }}></div>
              ))}

              {/* SVG Map Background - ONLY Disaster Warnings */}
              <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                {isFloodSimulated && (
                  <circle cx="40" cy="150" r="2" fill="#ef4444" />
                )}
              </svg>

              {/* Map Legend */}
              <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10, display: 'flex', gap: '15px', background: 'rgba(0,0,0,0.7)', padding: '5px 12px', borderRadius: '4px', fontSize: '0.6rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#fbbf24', borderRadius: '50%' }}></div>
                  <span style={{ color: '#94a3b8' }}>Pedestrian Density</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#10b981' }}>▲▼</span>
                  <span style={{ color: '#94a3b8' }}>Signal Flow</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#38bdf8' }}>🗼</span>
                  <span style={{ color: '#94a3b8' }}>Agentic Hub</span>
                </div>
              </div>

              {/* Holographic Nodes (Green/Red) */}
              {[
                { name: "Gaya Street", top: '45%', left: '45%' },
                { name: "Waterfront", top: '20%', left: '20%' },
                { name: "Likas", top: '15%', left: '65%' },
                { name: "Penampang", top: '75%', left: '30%' },
                { name: "Inanam", top: '70%', left: '70%' },
                { name: "Kolombong", top: '40%', left: '10%' }
              ].map(node => {
                // Find latest log for THIS specific node
                const nodeLog = logs.find(l => l.intersection === node.name);
                const isRed = nodeLog?.action === "FORCE_RED";
                const isEmergency = isEmergencyActive && node.name === "Gaya Street";
                return (
                  <div key={node.name} style={{ position: 'absolute', top: node.top, left: node.left, textAlign: 'center', zIndex: 10 }}>
                    {/* Traffic Flow Arrows */}
                    <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                      <span style={{ color: isRed ? '#ef4444' : '#10b981', fontSize: '12px', textShadow: '0 0 5px currentColor' }}>▲</span>
                      <span style={{ color: isRed ? '#ef4444' : '#10b981', fontSize: '12px', textShadow: '0 0 5px currentColor' }}>▼</span>
                    </div>
                    <div style={{ 
                      width: '3px', height: '30px', 
                      background: isRed ? 'linear-gradient(transparent, #ef4444, transparent)' : 'linear-gradient(transparent, #10b981, transparent)', 
                      margin: '0 auto',
                      opacity: activeIntersection === node.name ? 1 : 0.4,
                      boxShadow: activeIntersection === node.name ? (isRed ? '0 0 20px #ef4444' : '0 0 20px #10b981') : 'none'
                    }}></div>
                    <div className={`map-node ${activeIntersection === node.name ? 'active' : ''} ${isEmergency ? 'emergency' : ''} ${isRed ? 'red-light' : ''}`} style={{ fontSize: '0.6rem', width: '70px', padding: '5px' }}>
                      {node.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right: Simulation and 3 Most Recent Decisions */}
        <aside className="control-sidebar">
          {/* System Hub */}
          <div className="card" style={{ border: '1px solid #38bdf8', padding: '0.8rem' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>SYSTEM HUB</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <button className={`btn ${isFloodSimulated ? 'btn-primary' : 'btn-danger'}`} style={{ fontSize: '0.7rem' }} onClick={() => setIsFloodSimulated(!isFloodSimulated)}>
                {isFloodSimulated ? "Reset" : "Flood"}
              </button>
              <button className={`btn ${isEmergencyActive ? 'btn-primary' : 'btn-danger'}`} style={{ fontSize: '0.7rem', borderColor: '#10b981' }} onClick={() => setIsEmergencyActive(!isEmergencyActive)}>
                {isEmergencyActive ? "Normal" : "Ambulance"}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '8px' }}>
              <button className="btn" style={{ fontSize: '0.6rem', background: '#991b1b', color: 'white' }} onClick={() => { setIsFloodSimulated(true); setIsEmergencyActive(false); }}>
                FLOOD DEMO
              </button>
              <button className="btn" style={{ fontSize: '0.6rem', background: '#065f46', color: 'white' }} onClick={() => { setIsEmergencyActive(true); setIsFloodSimulated(false); }}>
                AMB DEMO
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => setShowHistory(true)} style={{ width: '100%', marginTop: '0.8rem', fontSize: '0.65rem', border: '1px solid #38bdf8' }}>
              ACCESS FULL HISTORY
            </button>
          </div>

          {/* 3 MOST RECENT DECISIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.slice(0, 3).map((log, index) => (
              <div key={log.id} className="card active-decision" style={{ 
                background: index === 0 ? 'rgba(56, 189, 248, 0.1)' : 'rgba(15, 23, 42, 0.8)', 
                border: index === 0 ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)', 
                padding: '0.6rem',
                opacity: index === 0 ? 1 : 0.7,
              }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: '0.2rem', color: index === 0 ? '#38bdf8' : '#94a3b8' }}>
                  {log.intersection.toUpperCase()} → <span style={{ color: log.action.includes('EMERGENCY') || log.action === "FORCE_RED" ? '#ef4444' : '#10b981' }}>{log.action}</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#fff', lineHeight: '1.2' }}>
                  {log.reasoning.substring(0, 100)}...
                </div>
              </div>
            ))}
          </div>

          {/* LIVE CITY STATUS (EVENTS) */}
          <div className="card" style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '0.6rem', marginBottom: '0.3rem', color: '#38bdf8' }}>LIVE CITY STATUS</h3>
            <div style={{ fontSize: '0.55rem' }}>
              {["Gaya Street", "Waterfront", "Likas", "Penampang", "Inanam", "Kolombong"].map(city => {
                const cityLog = logs.find(l => l.intersection === city);
                return (
                  <div key={city} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: activeIntersection === city ? '#fff' : '#94a3b8' }}>{city}</span>
                    <span style={{ color: cityLog?.action === "FORCE_RED" ? "#ef4444" : "#10b981", fontWeight: 700 }}>
                      {cityLog ? cityLog.action : "MAINTAIN"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SABAH URBAN DNA METRICS */}
          <div className="card" style={{ padding: '0.8rem', marginTop: 'auto' }}>
            <h3 style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>Sabah Urban DNA</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
                🏍️ Motor: 38%<br/>
                🚌 Bus Pri: ON
              </div>
              <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
                👥 Density: {metrics.density}/m²<br/>
                ⚡ Latency: 115ms
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
