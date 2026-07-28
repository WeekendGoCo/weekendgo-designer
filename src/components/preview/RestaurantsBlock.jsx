import { MapPin, Navigation } from 'lucide-react';

export default function RestaurantsBlock({ restaurants }) {
  const activeRestaurants = restaurants?.filter(c => c.list && c.list.length > 0) || [];
  if (activeRestaurants.length === 0) return null;

  return (
    <>
      <div className="sec-head"><h2>المطاعم التي ستزورونها</h2><div className="sec-line"></div></div>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .rest-city-group {
            margin-bottom: 28px;
          }
          .rest-city-group:last-child {
            margin-bottom: 0;
          }
          .rest-city-title {
            font-size: 16px;
            font-weight: 800;
            color: var(--ne);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .rest-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .rest-card {
            background: var(--bg-card);
            border: 1px solid var(--bg-card-border);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            page-break-inside: avoid;
          }
          .rest-img {
            width: 100%;
            height: 140px;
            object-fit: cover;
          }
          .rest-noimg {
            width: 100%;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            background: rgba(255,255,255,0.02);
          }
          .rest-body {
            padding: 12px 16px;
          }
          .rest-name {
            font-size: 15px;
            font-weight: 800;
            color: var(--text-main);
            margin-bottom: 2px;
          }
          .rest-name-en {
            font-size: 13px;
            color: var(--text-muted-dark);
            font-weight: 600;
          }
          .loc-btn {
            background: rgba(140, 198, 63, 0.2);
            border: 1px solid rgba(140, 198, 63, 0.5);
            color: var(--g);
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            text-decoration: none;
            backdrop-filter: blur(4px);
            transition: all 0.2s;
            flex-shrink: 0;
            margin-top: 4px;
          }
          .loc-btn:hover {
            background: var(--g);
            color: #111;
          }
          .rest-desc {
            font-size: 12px;
            color: var(--text-muted);
            line-height: 1.6;
            margin-top: 8px;
          }
          @media (max-width: 600px) {
            .rest-grid { grid-template-columns: 1fr; }
          }
        `}} />
        
        {activeRestaurants.map(cityGroup => (
          <div key={cityGroup.id} className="rest-city-group">
            <h3 className="rest-city-title">
              <MapPin size={20} /> مدينة {cityGroup.city}
            </h3>
            <div className="rest-grid">
              {cityGroup.list.map(rest => (
                <div key={rest.id} className="rest-card">
                  {rest.image && <img src={rest.image} className="rest-img" alt={rest.name} loading="eager" />}
                  <div className="rest-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div>
                        <div className="rest-name">{rest.name}</div>
                        {rest.nameEn && <div className="rest-name-en">{rest.nameEn}</div>}
                      </div>
                      {rest.location && (
                        <a href={rest.location} target="_blank" rel="noreferrer" className="loc-btn">
                          <Navigation size={12} /> الموقع
                        </a>
                      )}
                    </div>
                    {rest.desc && <div className="rest-desc">{rest.desc}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
