import { DAY_NAMES } from '../../lib/constants';

export default function DaysBlock({ daysList }) {
  if (!daysList || daysList.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* ── Day page: each day on its own section ── */
        .day-page {
          position: relative;
          overflow: hidden;
          background: var(--gl);
          border: 0.5px solid var(--gb);
          border-radius: 20px;
          margin-bottom: 0;
        }

        /* ── Day header strip ── */
        .day-label-strip {
          background: linear-gradient(135deg, rgba(0,148,212,0.28), rgba(140,198,63,0.12));
          border-bottom: 0.5px solid rgba(0,173,239,0.22);
          padding: 14px 24px;
          font-size: 22px;
          font-weight: 900;
          color: var(--ne);
          letter-spacing: 0.5px;
          text-shadow: var(--gb2);
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .day-num-badge {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: rgba(0,148,212,0.18);
          border: 1px solid rgba(0,148,212,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900; color: var(--ne);
          direction: ltr; flex-shrink: 0;
        }
        .day-loc-badge {
          margin-right: auto;
          font-size: 13px; font-weight: 700;
          color: var(--c); background: rgba(0,173,239,0.1);
          border: 1px solid rgba(0,173,239,0.2);
          padding: 4px 14px; border-radius: 20px;
        }

        /* ── Photo grid ── */
        .day-photos-1 { display: grid; grid-template-columns: 1fr; height: 340px; }
        .day-photos-2 { display: grid; grid-template-columns: 1fr 1fr; height: 300px; }
        .day-photos-3 { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; height: 300px; }
        .day-photos-4 { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; height: 300px; }
        .day-photos-5 { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr; height: 320px; }

        .day-photos-3 .day-photo:first-child { grid-row: 1 / 3; }
        .day-photos-5 .day-photo:first-child { grid-row: 1 / 3; }

        .day-photo {
          overflow: hidden;
          position: relative;
        }
        .day-photo img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .day-photo-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-size: 48px;
          background: linear-gradient(135deg, var(--bg-card-border), var(--bg-card-dark));
        }

        /* Photo dividers */
        .day-photos-2 .day-photo,
        .day-photos-3 .day-photo,
        .day-photos-4 .day-photo,
        .day-photos-5 .day-photo {
          border: 2px solid var(--gl);
        }

        /* ── Day text area ── */
        .day-text-body {
          padding: 22px 28px;
          direction: rtl;
        }
        .day-title-main {
          font-size: 22px; font-weight: 900;
          color: var(--text-main);
          margin-bottom: 14px;
          line-height: 1.3;
        }
        .day-desc-text {
          font-size: 14px; color: var(--text-muted);
          line-height: 1.95; font-weight: 400;
          white-space: pre-wrap;
        }

        /* ── Decorative glow lines ── */
        .day-deco-svg {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          pointer-events: none;
          opacity: 0.3;
          z-index: 0;
        }

        /* Ensure text is above deco */
        .day-text-body { position: relative; z-index: 1; }

        /* Light mode */
        [data-theme="light"] .day-page { background: #fff; }
        [data-theme="light"] .day-photo-placeholder { background: #f3f4f6; }
      `}} />

      {/* Section heading only on first page */}
      <div className="sec-head">
        <h2>البرنامج اليومي</h2>
        <div className="sec-line"></div>
      </div>

      {daysList.map((day, i) => {
        const imgs = day.imgs || (day.img ? [day.img] : []);
        const count = imgs.length;
        const dayLabel = `اليوم ${DAY_NAMES[i] || String(i + 1)}`;
        const gridClass = count >= 1 ? `day-photos-${Math.min(count, 5)}` : 'day-photos-1';

        return (
          <div key={day.id} className="day-page" style={{ marginBottom: i < daysList.length - 1 ? '0' : '0' }}>
            
            {/* Label strip */}
            <div className="day-label-strip">
              <div className="day-num-badge">{String(i + 1).padStart(2, '0')}</div>
              <span>{dayLabel}</span>
              {day.loc && <span className="day-loc-badge">📍 {day.loc}</span>}
            </div>

            {/* Photo grid */}
            {count > 0 ? (
              <div className={gridClass}>
                {imgs.slice(0, 5).map((img, idx) => (
                  <div key={idx} className="day-photo">
                    <img src={img} alt={`${dayLabel} — صورة ${idx + 1}`} loading="eager" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="day-photos-1">
                <div className="day-photo">
                  <div className="day-photo-placeholder">📷</div>
                </div>
              </div>
            )}

            {/* Text content */}
            <div className="day-text-body">
              {day.title && <div className="day-title-main">{day.title}</div>}
              {day.desc && <div className="day-desc-text">{day.desc}</div>}
            </div>

            {/* Ambient decorative glow lines */}
            <svg className="day-deco-svg" viewBox="0 0 800 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,60 C200,20 400,100 600,40 C700,15 760,70 800,45 L800,120 L0,120 Z" fill="rgba(0,148,212,0.12)" />
              <path d="M0,80 C180,50 360,90 560,65 C680,45 750,80 800,60 L800,120 L0,120 Z" fill="rgba(140,198,63,0.08)" />
              <path d="M0,40 C120,25 250,60 400,38 C530,18 660,55 800,30" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="1.5" />
            </svg>
          </div>
        );
      })}
    </>
  );
}
