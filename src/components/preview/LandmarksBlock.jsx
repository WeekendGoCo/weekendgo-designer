import { MapPin, Navigation } from 'lucide-react';

export default function LandmarksBlock({ landmarks, country }) {
  const activeLandmarks = landmarks?.filter(c => c.list && c.list.length > 0) || [];
  if (activeLandmarks.length === 0) return null;

  return (
    <>
      <div className="sec-head">
        <h2>المعالم المميزة في {country || 'الوجهة'}</h2>
        <div className="sec-line"></div>
      </div>
      <div style={{ marginBottom: '40px' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .lm-city-group {
            margin-bottom: 32px;
          }
          .lm-city-group:last-child {
            margin-bottom: 0;
          }
          .lm-city-title {
            font-size: 18px;
            font-weight: 800;
            color: var(--ne);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            text-shadow: var(--gb2);
          }
          .lm-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
          }
          .lm-card {
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--gb);
            border-radius: 16px;
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: column;
            page-break-inside: avoid;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .lm-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            border-color: rgba(0,173,239,0.3);
          }
          .lm-img-wrapper {
            position: relative;
            width: 100%;
            height: 180px;
          }
          .lm-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .lm-noimg {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            background: linear-gradient(135deg, var(--bg-card-border), transparent);
          }
          .lm-img-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.4) 50%, transparent 100%);
          }
          .lm-name-overlay {
            position: absolute;
            bottom: 16px;
            right: 16px;
            left: 16px;
            font-size: 16px;
            font-weight: 800;
            color: var(--text-main);
            text-shadow: 0 2px 8px rgba(0,0,0,0.8);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .lm-loc-btn {
            background: rgba(140, 198, 63, 0.2);
            border: 1px solid rgba(140, 198, 63, 0.5);
            color: var(--g);
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            backdrop-filter: blur(4px);
            transition: all 0.2s;
          }
          .lm-loc-btn:hover {
            background: var(--g);
            color: #111;
          }
          .lm-body {
            padding: 16px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .lm-desc {
            font-size: 13px;
            color: var(--text-muted);
            line-height: 1.7;
          }
        `}} />
        
        {activeLandmarks.map(cityGroup => (
          <div key={cityGroup.id} className="lm-city-group">
            <h3 className="lm-city-title">
              <MapPin size={24} color="var(--ne)" /> مدينة {cityGroup.city}
            </h3>
            <div className="lm-grid">
              {cityGroup.list.map(landmark => (
                <div key={landmark.id} className="lm-card">
                  <div className="lm-img-wrapper">
                    {landmark.image ? (
                      <img src={landmark.image} alt={landmark.name} className="lm-img" />
                    ) : (
                      <div className="lm-noimg">🏛</div>
                    )}
                    <div className="lm-img-overlay"></div>
                    <div className="lm-name-overlay">
                      <span>{landmark.name}</span>
                      {landmark.location && (
                        <a href={landmark.location} target="_blank" rel="noreferrer" className="lm-loc-btn">
                          <Navigation size={14} /> الموقع
                        </a>
                      )}
                    </div>
                  </div>
                  {landmark.desc && (
                    <div className="lm-body">
                      <div className="lm-desc">{landmark.desc}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
