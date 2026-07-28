import { DAY_NAMES } from '../../lib/constants';

export default function DaysBlock({ daysList }) {
  if (!daysList || daysList.length === 0) return null;

  return (
    <>
      <div className="sec-head">
        <h2>البرنامج اليومي</h2>
        <div className="sec-line"></div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .day-card {
          background: var(--gl);
          border: .5px solid var(--gb);
          border-radius: 18px;
          margin-bottom: 14px;
          overflow: hidden;
          page-break-inside: avoid;
        }
        .day-label-strip {
          background: linear-gradient(135deg, rgba(0,148,212,0.25), rgba(140,198,63,0.1));
          border-bottom: .5px solid rgba(0,173,239,0.2);
          padding: 13px 20px;
          font-size: 20px;
          font-weight: 800;
          color: var(--ne);
          letter-spacing: 0.5px;
          text-shadow: var(--gb2);
        }
        .day-inner {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 220px;
        }
        .day-reverse {
          direction: rtl; /* This just flips the grid order, but we must ensure content stays RTL aligned */
        }
        .day-reverse .day-img-col {
          direction: ltr; /* Keeps image alignment normal */
        }
        .day-img-col {
          overflow: hidden;
          position: relative;
        }
        .day-img-frame {
          width: 100%;
          height: 100%;
          min-height: 220px;
        }
        .day-img-frame img.day-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .day-img-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          background: var(--bg-card-dark);
          min-height: 220px;
        }
        .day-text-col {
          padding: 0;
          direction: rtl;
        }
        .day-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          border-bottom: .5px solid var(--bg-card-border);
        }
        .day-num {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(0,148,212,0.15);
          border: 1px solid rgba(0,148,212,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 900;
          color: var(--ne);
          text-shadow: var(--gb2);
          flex-shrink: 0;
          direction: ltr;
        }
        .day-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .day-loc {
          font-size: 14px;
          color: var(--c);
          font-weight: 700;
        }
        .day-body {
          padding: 14px 20px;
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.85;
          font-weight: 300;
        }
        @media (max-width: 700px) {
          .day-inner {
            grid-template-columns: 1fr;
            grid-template-rows: 200px auto;
          }
          .day-img-frame { min-height: 200px; }
        }
        @media print {
          /* Force page break every 2 days */
          .day-card.break-before {
            page-break-before: always;
          }
        }
      `}} />

      {daysList.map((day, i) => {
        const isEven = i % 2 === 1;
        const pageBreak = i > 0 && i % 2 === 0 ? " break-before" : "";
        const dayLabel = `اليوم ${DAY_NAMES[i] || String(i + 1)}`;
        
        return (
          <div key={day.id} className={`day-card${pageBreak}`}>
            <div className="day-label-strip">{dayLabel}</div>
            <div className={`day-inner ${isEven ? 'day-reverse' : ''}`}>
              <div className="day-img-col">
                {day.img ? (
                  <div className="day-img-frame"><img src={day.img} className="day-img" loading="eager" /></div>
                ) : (
                  <div className="day-img-frame day-img-placeholder">📷</div>
                )}
              </div>
              <div className="day-text-col">
                <div className="day-header">
                  <div className="day-num">{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <div className="day-title">{day.title}</div>
                    <div className="day-loc">{day.loc}</div>
                  </div>
                </div>
                <div className="day-body">{day.desc}</div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
