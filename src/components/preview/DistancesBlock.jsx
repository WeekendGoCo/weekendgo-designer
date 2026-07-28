import { MapPin } from 'lucide-react';

export default function DistancesBlock({ distances }) {
  if (!distances || distances.length === 0) return null;

  return (
    <>
      <div className="sec-head"><h2>المسافات بين المدن</h2><div className="sec-line"></div></div>
      <div style={{ padding: '0 24px', marginBottom: '40px' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .dist-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            position: relative;
          }
          .dist-row:last-child {
            margin-bottom: 0;
          }
          .city-node {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            width: 80px;
            z-index: 2;
          }
          .city-icon {
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
          .city-name {
            font-size: 16px;
            font-weight: 800;
            color: var(--text-main);
            text-align: center;
          }
          .path-line {
            flex: 1;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--ne) 20%, var(--g) 50%, var(--ne) 80%, transparent);
            box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
            position: relative;
            margin: 0 16px;
            top: -12px;
          }
          .path-dist {
            position: absolute;
            top: -28px;
            left: 50%;
            transform: translateX(-50%);
            background: transparent;
            font-size: 14px;
            font-weight: 700;
            color: var(--text-main);
            direction: rtl; /* Fix alignment */
            white-space: nowrap;
          }
        `}} />
        
        {distances.map(dist => (
          <div key={dist.id} className="dist-row">
            <div className="city-node">
              <div className="city-icon"><MapPin size={20} /></div>
              <div className="city-name">{dist.city1}</div>
            </div>
            
            <div className="path-line">
              <div className="path-dist">
                {dist.km && `${dist.km} كم`}
              </div>
            </div>
            
            <div className="city-node">
              <div className="city-icon"><MapPin size={20} /></div>
              <div className="city-name">{dist.city2}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
