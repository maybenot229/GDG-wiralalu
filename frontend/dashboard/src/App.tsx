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
      {/* ... Modal and Header code ... */}
      
      <div className="strategic-grid">
        {/* Left: Huge Map */}
        <main className="map-area">
          <div className="card" style={{ height: 'calc(100vh - 180px)', position: 'relative' }}>
            <h3>City Digital Twin: KK (Strategic View)</h3>
            <div style={{ 
              height: '90%', 
              background: 'rgba(0,0,0,0.4)', 
              borderRadius: '12px', 
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden'
            }}>
              {/* On-Map Metrics Overlay */}
              <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10, display: 'flex', gap: '8px' }}>
                 <div style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(0,0,0,0.8)', borderRadius: '4px', border: '1px solid #10b981' }}>
                    <span style={{ color: '#94a3b8' }}>FLOOD:</span> <span style={{ color: metrics.flood > 1.0 ? '#ef4444' : '#10b981', fontWeight: 800 }}>{metrics.flood}m</span>
                 </div>
                 <div style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(0,0,0,0.8)', borderRadius: '4px', border: '1px solid #38bdf8' }}>
                    <span style={{ color: '#94a3b8' }}>FIELD:</span> <span style={{ color: '#38bdf8', fontWeight: 800 }}>{metrics.stability}%</span>
                 </div>
              </div>

              {/* Pedestrian Dots Distributed across KK */}
              {[
                {t:'48%', l:'42%'}, {t:'52%', l:'48%'}, {t:'25%', l:'22%'}, 
                {t:'18%', l:'60%'}, {t:'70%', l:'35%'}, {t:'65%', l:'68%'}
              ].map((pos, i) => (
                <div key={i} className="pedestrian-dot" style={{ position: 'absolute', top: pos.t, left: pos.l, zIndex: 5 }}></div>
              ))}

              {/* ... SVG Background ... */}
              <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M20 100 Q 100 80 180 100" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="4" fill="none" />
                <path d="M100 20 Q 120 100 100 180" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="4" fill="none" />
                {isFloodSimulated && (
                  <circle cx="40" cy="150" r="2" fill="#ef4444" />
                )}
              </svg>

              {/* Holographic Nodes (Green/Red) */}
              {[
                { name: "Gaya Street", top: '45%', left: '45%' },
                { name: "Waterfront", top: '20%', left: '20%' },
                { name: "Likas", top: '15%', left: '65%' },
                { name: "Penampang", top: '75%', left: '30%' },
                { name: "Inanam", top: '70%', left: '70%' },
                { name: "Kolombong", top: '40%', left: '10%' }
              ].map(node => {
                const isRed = logs.length > 0 && logs[0].intersection === node.name && logs[0].action === "FORCE_RED";
                const isEmergency = isEmergencyActive && node.name === "Gaya Street";
                return (
                  <div key={node.name} style={{ position: 'absolute', top: node.top, left: node.left, textAlign: 'center' }}>
                    <div style={{ 
                      width: '2px', height: '25px', 
                      background: isRed ? 'linear-gradient(transparent, #ef4444, transparent)' : 'linear-gradient(transparent, #10b981, transparent)', 
                      margin: '0 auto',
                      opacity: activeIntersection === node.name ? 1 : 0.3,
                      boxShadow: activeIntersection === node.name ? (isRed ? '0 0 15px #ef4444' : '0 0 15px #10b981') : 'none'
                    }}></div>
                    <div className={`map-node ${activeIntersection === node.name ? 'active' : ''} ${isEmergency ? 'emergency' : ''} ${isRed ? 'red-light' : ''}`}>
                      {node.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Right: Simulation and Compact Latest Decision */}
        <aside className="control-sidebar">
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
          </div>

          {/* COMPACT ACTIVE DECISION */}
          {logs.length > 0 && (
            <div className="card active-decision" style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', padding: '0.8rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.3rem', color: '#38bdf8' }}>
                {logs[0].intersection.toUpperCase()} NODE → <span style={{ color: logs[0].action.includes('EMERGENCY') || logs[0].action === "FORCE_RED" ? '#ef4444' : '#10b981' }}>{logs[0].action}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fff', marginBottom: '0.3rem', lineHeight: '1.3' }}>
                {logs[0].reasoning}
              </div>
              <div style={{ borderTop: '1px solid rgba(56, 189, 248, 0.2)', paddingTop: '0.3rem', fontSize: '0.65rem' }}>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>REJECTED:</span> {logs[0].rejectedAlternative}
              </div>
            </div>
          )}

          {/* Event Stream */}
          <div className="card" style={{ flex: 1, padding: '0.8rem' }}>
            <h3 style={{ fontSize: '0.7rem', marginBottom: '0.3rem' }}>Events</h3>
            <div style={{ fontSize: '0.6rem' }}>
              {logs.slice(1, 6).map(l => (
                <div key={l.id} style={{ padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{l.intersection}</span>
                  <span style={{ color: l.action === "FORCE_RED" ? "#ef4444" : "#10b981" }}>{l.action}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
