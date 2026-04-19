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
            <h2>Intersection Thought Logs</h2>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>● Live Reasoning</div>
          </div>
          <div className="thought-log">
            {logs.map(log => (
              <div key={log.id} className="thought-log-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{log.intersection} Node</strong>
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
          <div className="card">
            <h3>City Digital Twin: KK</h3>
            <div style={{ 
              height: '300px', 
              background: 'rgba(0,0,0,0.4)', 
              borderRadius: '12px', 
              margin: '1rem 0',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}>
              {/* Stylized Road Network SVG */}
              <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Arterial Roads */}
                <path d="M20 100 Q 100 80 180 100" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="4" fill="none" />
                <path d="M100 20 Q 120 100 100 180" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="4" fill="none" />
                <path d="M40 40 L 160 160" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="2" fill="none" />
                <path d="M40 160 L 160 40" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="2" fill="none" />
                
                {/* Coastal Road */}
                <path d="M10 20 Q 50 50 20 180" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.4" />
              </svg>

              {/* Positioned Nodes */}
              <div style={{ position: 'absolute', top: '45%', left: '45%' }}>
                <div className={`map-node ${activeIntersection === "Gaya Street" ? 'active' : ''} ${isEmergencyActive && activeIntersection === "Gaya Street" ? 'emergency' : ''}`} style={{ width: '60px' }}>Gaya St</div>
              </div>
              <div style={{ position: 'absolute', top: '20%', left: '20%' }}>
                <div className={`map-node ${activeIntersection === "Waterfront" ? 'active' : ''}`} style={{ width: '60px' }}>Waterfront</div>
              </div>
              <div style={{ position: 'absolute', top: '15%', left: '65%' }}>
                <div className={`map-node ${activeIntersection === "Likas" ? 'active' : ''}`} style={{ width: '60px' }}>Likas Bay</div>
              </div>
              <div style={{ position: 'absolute', top: '75%', left: '30%' }}>
                <div className={`map-node ${activeIntersection === "Penampang" ? 'active' : ''}`} style={{ width: '65px' }}>Penampang</div>
              </div>
              <div style={{ position: 'absolute', top: '70%', left: '70%' }}>
                <div className={`map-node ${activeIntersection === "Inanam" ? 'active' : ''}`} style={{ width: '60px' }}>Inanam</div>
              </div>
              <div style={{ position: 'absolute', top: '40%', left: '10%' }}>
                <div className={`map-node ${activeIntersection === "Kolombong" ? 'active' : ''}`} style={{ width: '65px' }}>Kolombong</div>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
              Real-time topology of Kota Kinabalu Arteries.
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
