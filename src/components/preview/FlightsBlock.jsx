import { Plane } from 'lucide-react';

export default function FlightsBlock({ flights }) {
  if (!flights || flights.length === 0) return null;

  return (
    <>
      <div className="sec-head"><h2>الطيران الداخلي</h2><div className="sec-line"></div></div>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .flight-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            position: relative;
          }
          .flight-row:last-child {
            margin-bottom: 0;
          }
          .f-city-node {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 80px;
            z-index: 2;
          }
          .f-city-icon {
            width: 44px;
            height: 44px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(0, 229, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--ne);
            filter: drop-shadow(0 0 8px var(--ne));
          }
          .f-city-name {
            font-size: 16px;
            font-weight: 800;
            color: var(--text-main);
            text-align: center;
          }
          .f-path-line {
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--ne) 20%, var(--g) 50%, var(--ne) 80%, transparent);
            box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
            position: relative;
            margin: 0 16px;
            top: -12px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .f-path-dist {
            position: absolute;
            top: -26px;
            background: transparent;
            font-size: 14px;
            font-weight: 700;
            color: var(--text-main);
            direction: rtl;
            white-space: nowrap;
          }
        `}} />
        
        {flights.map(flight => (
          <div key={flight.id} className="flight-row">
            <div className="f-city-node">
              <div className="f-city-icon"><Plane size={20} /></div>
              <div className="f-city-name">{flight.city1}</div>
            </div>
            
            <div className="f-path-line">
              <div className="f-path-dist">
                {flight.km && `${flight.km} كم`}
                {flight.km && flight.duration && ' / '}
                {flight.duration && `${flight.duration} ساعة`}
              </div>
            </div>
            
            <div className="f-city-node">
              <div className="f-city-icon"><Plane size={20} /></div>
              <div className="f-city-name">{flight.city2}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
