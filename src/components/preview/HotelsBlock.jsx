import { MapPin, Star, Moon, Navigation } from 'lucide-react';

export default function HotelsBlock({ hotels, country }) {
  const activeHotels = hotels?.filter(c => c.list && c.list.length > 0) || [];
  if (activeHotels.length === 0) return null;

  return (
    <>
      <div className="sec-head">
        <h2>أفضل الفنادق في {country || 'الوجهة'}</h2>
        <div className="sec-line"></div>
      </div>
      <div style={{ padding: '0 24px', marginBottom: '40px' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .hotel-city-group {
            margin-bottom: 24px;
          }
          .hotel-city-group:last-child {
            margin-bottom: 0;
          }
          .hotel-city-title {
            font-size: 16px;
            font-weight: 800;
            color: var(--ne);
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .hotel-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 16px;
          }
          .hotel-card {
            background: var(--gl);
            border: 1px solid var(--gb);
            border-radius: 12px;
            overflow: hidden;
            page-break-inside: avoid;
            display: flex;
            flex-direction: column;
          }
          .hotel-img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-bottom: 1px solid var(--gb);
          }
          .hotel-info-wrap {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .hotel-name {
            font-size: 15px;
            font-weight: 800;
            color: var(--text-main);
            flex: 1;
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
          }
          .loc-btn:hover {
            background: var(--g);
            color: #111;
          }
          .hotel-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .hotel-stars {
            display: flex;
            gap: 2px;
            color: var(--go);
          }
          .hotel-nights {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: var(--text-muted);
            background: var(--bg-card);
            padding: 4px 8px;
            border-radius: 6px;
          }
        `}} />
        
        {activeHotels.map(cityGroup => (
          <div key={cityGroup.id} className="hotel-city-group">
            <h3 className="hotel-city-title">
              <MapPin size={20} /> مدينة {cityGroup.city}
            </h3>
            <div className="hotel-grid">
              {cityGroup.list.map(hotel => (
                <div key={hotel.id} className="hotel-card">
                  {hotel.image && <img src={hotel.image} className="hotel-img" alt={hotel.name} loading="lazy" />}
                  <div className="hotel-info-wrap">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div className="hotel-name">{hotel.name}</div>
                      {hotel.location && (
                        <a href={hotel.location} target="_blank" rel="noreferrer" className="loc-btn">
                          <Navigation size={12} /> الموقع
                        </a>
                      )}
                    </div>
                    <div className="hotel-meta">
                      <div className="hotel-stars">
                        {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" stroke="none" />
                        ))}
                      </div>
                      <div className="hotel-nights">
                        <Moon size={14} /> {hotel.nights} {hotel.nights > 10 ? 'ليلة' : 'ليالٍ'}
                      </div>
                    </div>
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
