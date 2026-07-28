import { MapPin, Star, Moon, Navigation, Calendar, DoorOpen } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' });
  } catch { return dateStr; }
}

export default function HotelsBlock({ hotels }) {
  // Flatten all hotel entries
  const allEntries = (hotels || []).flatMap(g =>
    (g.list || []).map(h => ({ ...h, city: g.city }))
  ).filter(h => h.name);

  const activeGroups = (hotels || []).filter(g => g.list && g.list.some(h => h.name));

  if (allEntries.length === 0) return null;

  return (
    <>
      <div className="sec-head">
        <h2>إقامتكم المختارة</h2>
        <div className="sec-line"></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* ── Hotel Summary Table ── */
        .hotel-summary-table {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--gb);
          margin-bottom: 36px;
        }
        .hotel-table-head {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 0.7fr 0.7fr;
          background: linear-gradient(135deg, rgba(0,148,212,0.25), rgba(140,198,63,0.1));
          border-bottom: 1px solid rgba(0,173,239,0.3);
          padding: 14px 20px;
          font-size: 13px;
          font-weight: 800;
          color: var(--ne);
          gap: 4px;
        }
        .hotel-table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 0.7fr 0.7fr;
          padding: 13px 20px;
          font-size: 13px;
          gap: 4px;
          border-top: 1px solid var(--gb);
          transition: background 0.2s;
        }
        .hotel-table-row:nth-child(even) { background: rgba(255,255,255,0.02); }
        .hotel-table-row:nth-child(odd) { background: rgba(0,0,0,0.1); }
        .hotel-table-name { font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 6px; }
        .hotel-table-city { color: var(--ne); font-weight: 700; }
        .hotel-table-date { color: var(--text-muted); font-weight: 600; }
        .hotel-table-rooms { color: var(--g); font-weight: 700; text-align: center; }
        .hotel-table-nights { color: var(--ne); font-weight: 800; text-align: center; }
        .hotel-nights-badge {
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(0,148,212,0.12); border: 1px solid rgba(0,148,212,0.2);
          color: var(--ne); padding: 2px 8px; border-radius: 20px;
          font-size: 11px; font-weight: 700; margin-right: 4px;
        }

        /* ── Hotel Cards ── */
        .hotel-city-group { margin-bottom: 32px; }
        .hotel-city-group:last-child { margin-bottom: 0; }
        .hotel-city-title {
          font-size: 17px; font-weight: 800; color: var(--ne);
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
          text-shadow: var(--gb2);
        }
        .hotel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .hotel-card {
          background: var(--gl); border: 1px solid var(--gb);
          border-radius: 14px; overflow: hidden;
          page-break-inside: avoid; display: flex; flex-direction: column;
        }
        .hotel-img { width: 100%; height: 130px; object-fit: cover; border-bottom: 1px solid var(--gb); }
        .hotel-info-wrap { padding: 14px; display: flex; flex-direction: column; gap: 10px; }
        .hotel-name { font-size: 15px; font-weight: 800; color: var(--text-main); flex: 1; }
        .hotel-name-link { text-decoration: none; cursor: pointer; transition: color 0.15s; }
        .hotel-name-link:hover { color: var(--ne); text-decoration: underline; }
        .hotel-meta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; }
        .hotel-stars { display: flex; gap: 2px; color: var(--go); }
        .hotel-dates {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: var(--text-muted);
          background: var(--bg-card); padding: 4px 8px; border-radius: 6px;
        }
        .loc-btn {
          background: rgba(140,198,63,0.2); border: 1px solid rgba(140,198,63,0.5);
          color: var(--g); padding: 4px 8px; border-radius: 6px;
          font-size: 11px; font-weight: 700; display: inline-flex; align-items: center;
          gap: 4px; text-decoration: none; flex-shrink: 0;
        }
        [data-theme="light"] .hotel-table-head { background: linear-gradient(135deg, rgba(0,148,212,0.15), rgba(140,198,63,0.08)); }
        [data-theme="light"] .hotel-table-row:nth-child(even) { background: rgba(0,0,0,0.02); }
        [data-theme="light"] .hotel-table-row:nth-child(odd) { background: rgba(255,255,255,0.6); }
      `}} />

      {/* Summary Table */}
      <div className="hotel-summary-table">
        <div className="hotel-table-head">
          <span>الفندق</span>
          <span>المدينة</span>
          <span>تاريخ الوصول</span>
          <span>تاريخ المغادرة</span>
          <span>الليالي</span>
          <span>الغرف</span>
        </div>
        {allEntries.map((h, i) => (
          <div key={h.id || i} className="hotel-table-row">
            <div className="hotel-table-name">
              <span>{h.name}</span>
            </div>
            <div className="hotel-table-city">{h.city}</div>
            <div className="hotel-table-date">{formatDate(h.checkIn)}</div>
            <div className="hotel-table-date">{formatDate(h.checkOut)}</div>
            <div className="hotel-table-nights">{h.nights > 0 ? (<><Moon size={11} style={{ verticalAlign: '-2px', marginLeft: '3px' }} />{h.nights}</>) : '—'}</div>
            <div className="hotel-table-rooms">{h.rooms || 1} 🚪</div>
          </div>
        ))}
      </div>

      {/* Hotel Cards by City */}
      {activeGroups.map(cityGroup => (
        <div key={cityGroup.id} className="hotel-city-group">
          <h3 className="hotel-city-title">
            <MapPin size={20} /> {cityGroup.city}
          </h3>
          <div className="hotel-grid">
            {cityGroup.list.filter(h => h.name).map(hotel => (
              <div key={hotel.id} className="hotel-card">
                {hotel.image && <img src={hotel.image} className="hotel-img" alt={hotel.name} loading="eager" />}
                <div className="hotel-info-wrap">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    {hotel.hotelUrl ? (
                      <a href={hotel.hotelUrl} target="_blank" rel="noreferrer" className="hotel-name hotel-name-link">{hotel.name}</a>
                    ) : (
                      <div className="hotel-name">{hotel.name}</div>
                    )}
                    {hotel.location && (
                      <a href={hotel.location} target="_blank" rel="noreferrer" className="loc-btn" title="موقع الفندق على خرائط جوجل">
                        <Navigation size={12} /> الموقع
                      </a>
                    )}
                  </div>
                  <div className="hotel-meta">
                    <div className="hotel-stars">
                      {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                    {(hotel.checkIn || hotel.checkOut) && (
                      <div className="hotel-dates">
                        <Calendar size={11} />
                        {formatDate(hotel.checkIn)} — {formatDate(hotel.checkOut)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
