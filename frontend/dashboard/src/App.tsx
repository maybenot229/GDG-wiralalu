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
  const [activeIntersection, setActiveIntersection] = useState<string | null>(null);

  // Simulated live updates for the hackathon demo
  useEffect(() => {
    const intersections = ["Gaya Street", "Waterfront", "Likas", "Penampang", "Inanam", "Kolombong"];
    
    const mockUpdates = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * intersections.length);
      const scenarioIdx = Math.floor(Math.random() * 4);
      const selectedIntersection = intersections[randomIdx];

      setActiveIntersection(selectedIntersection);

      let action = "MAINTAIN";
      let reasoning = "";
      let rejected = "";

      if (isFloodSimulated) {
        action = "EMERGENCY_CLEAR";
        reasoning = `Water is rising too high at ${selectedIntersection}. I am clearing all cars now to prevent stalling.`;
        rejected = "Stay on normal timer. Rejected because it's too dangerous for small cars.";
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
            rj: "Let them stop. Rejected because idling engines cause more air pollution."
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
      setLogs(prev => [newLog, ...prev].slice(0, 8));

      // Clear highlight after 2 seconds
      setTimeout(() => setActiveIntersection(null), 2000);
    }, 3000);

    return () => clearInterval(mockUpdates);
  }, [isFloodSimulated, isEmergencyActive]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="title">WiraLalu Dashboard</h1>
        <div style={{ textAlign: 'right' }}>
          <div className="status-badge">Region: Kota Kinabalu, Sabah</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Agentic Orchestration Active</div>
        </div>
      </header>

      <div className="grid">
        <main className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>AI Agent Event Log</h2>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>● Real-time Orchestration</div>
          </div>
          <div className="thought-log">
            {logs.map(log => (
              <div key={log.id} className="thought-log-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>[{log.timestamp}] Node: {log.intersection}</strong>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '10px', height: '10px', borderRadius: '50%', 
                      background: log.action === 'FORCE_RED' ? '#ef4444' : '#10b981',
                      boxShadow: log.action === 'FORCE_RED' ? '0 0 8px #ef4444' : '0 0 8px #10b981'
                    }}></div>
                    <span style={{ 
                      color: log.action === 'EMERGENCY_CLEAR' || log.action === 'FORCE_GREEN' ? '#10b981' : '#38bdf8',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>{log.action}</span>
                  </div>
                </div>
                <div className="reasoning-box">{log.reasoning}</div>
                <div className="counterfactual">
                  <div className="counterfactual-title">Rejected Alternative</div>
                  <div className="counterfactual-text">{log.rejectedAlternative}</div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="control-panel">
          <div className="card" style={{ border: '1px solid #38bdf8' }}>
            <h2 style={{ color: '#38bdf8', fontSize: '1rem', margin: 0 }}>SYSTEM ORCHESTRATION HUB</h2>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', boxShadow: '0 0 15px rgba(0, 198, 255, 0.4)' }}>
              ACCESS DECISION HISTORY LOG
            </button>
          </div>

          <div className="card">
            <h3>City Digital Twin: KK</h3>
            <div style={{ 
              height: '350px', 
              background: 'rgba(0,0,0,0.4)', 
              borderRadius: '12px', 
              margin: '1rem 0',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}>
              {/* On-Map Metrics Overlay */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                 <div style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', border: '1px solid #10b981' }}>
                    <span style={{ color: '#94a3b8' }}>FLOOD:</span> <span style={{ color: isFloodSimulated ? '#ef4444' : '#10b981' }}>{isFloodSimulated ? "1.8m" : "0.2m"}</span>
                 </div>
                 <div style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', border: '1px solid #38bdf8' }}>
                    <span style={{ color: '#94a3b8' }}>FIELD:</span> <span style={{ color: '#38bdf8' }}>98.4%</span>
                 </div>
              </div>

              {/* Stylized Road Network SVG */}
              <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Arterial Roads */}
                <path d="M20 100 Q 100 80 180 100" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="4" fill="none" />
                <path d="M100 20 Q 120 100 100 180" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="4" fill="none" />
                
                {/* Submerged Streets with Power Failure Warning */}
                {isFloodSimulated && (
                  <>
                    <circle cx="40" cy="150" r="2" fill="#ef4444" />
                    <text x="45" y="152" fill="#ef4444" style={{ fontSize: '4px', fontWeight: 700 }}>POWER FAILURE</text>
                    <circle cx="160" cy="50" r="2" fill="#ef4444" />
                    <text x="130" y="45" fill="#ef4444" style={{ fontSize: '4px', fontWeight: 700 }}>SUBMERGED</text>
                  </>
                )}
              </svg>

              {/* Positioned Nodes with Holographic Arrays */}
              {[
                { name: "Gaya Street", top: '45%', left: '45%' },
                { name: "Waterfront", top: '20%', left: '20%' },
                { name: "Likas", top: '15%', left: '65%' },
                { name: "Penampang", top: '75%', left: '30%' },
                { name: "Inanam", top: '70%', left: '70%' },
                { name: "Kolombong", top: '40%', left: '10%' }
              ].map(node => (
                <div key={node.name} style={{ position: 'absolute', top: node.top, left: node.left, textAlign: 'center' }}>
                  {/* Holographic Vertical Light Array */}
                  <div style={{ 
                    width: '2px', 
                    height: '20px', 
                    background: 'linear-gradient(transparent, #38bdf8, transparent)', 
                    margin: '0 auto',
                    opacity: activeIntersection === node.name ? 1 : 0.3,
                    boxShadow: activeIntersection === node.name ? '0 0 10px #38bdf8' : 'none'
                  }}></div>
                  <div className={`map-node ${activeIntersection === node.name ? 'active' : ''} ${isEmergencyActive && node.name === "Gaya Street" ? 'emergency' : ''}`} style={{ width: '60px', fontSize: '0.5rem' }}>
                    {node.name}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
              KK Digital Twin: Active Holographic Grid & Infrastructure Monitoring.
            </p>
          </div>

          <div className="card">
            <h3>Simulation Triggers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className={`btn ${isFloodSimulated ? 'btn-primary' : 'btn-danger'}`}
                onClick={() => setIsFloodSimulated(!isFloodSimulated)}
              >
                {isFloodSimulated ? "Reset to Normal" : "Simulate KK Flash Flood"}
              </button>
              <button 
                className={`btn ${isEmergencyActive ? 'btn-primary' : 'btn-danger'}`}
                style={{ borderColor: '#10b981', color: isEmergencyActive ? 'white' : '#10b981' }}
                onClick={() => setIsEmergencyActive(!isEmergencyActive)}
              >
                {isEmergencyActive ? "Clear Emergency" : "Trigger Ambulance Siren"}
              </button>
            </div>
          </div>

          <div className="card">
            <h3>Live Environment Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1rem' }}>
              <div className="metric-box">
                <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>FLOOD DEPTH</div>
                <div style={{ color: isFloodSimulated ? '#ef4444' : '#10b981', fontWeight: 700 }}>{isFloodSimulated ? "1.8m" : "0.2m"}</div>
              </div>
              <div className="metric-box">
                <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>FIELD STABILITY</div>
                <div style={{ color: '#10b981', fontWeight: 700 }}>98.4%</div>
              </div>
              <div className="metric-box">
                <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>PEDESTRIAN DENSITY</div>
                <div style={{ color: '#38bdf8', fontWeight: 700 }}>4.2/m²</div>
              </div>
              <div className="metric-box">
                <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>EMERGENCY ETA</div>
                <div style={{ color: isEmergencyActive ? '#ef4444' : '#94a3b8', fontWeight: 700 }}>{isEmergencyActive ? "2.5 min" : "N/A"}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Sabah Urban DNA</h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#94a3b8' }}>
              <li>🏍️ Motorcycle Vol: 38%</li>
              <li>🚌 Bus Priority: Enabled (Likas Line)</li>
              <li>⚡ Latency (Flash): 115ms</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
