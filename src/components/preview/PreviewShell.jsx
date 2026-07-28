import CoverPage from './CoverPage';
import CountryInfo from './CountryInfo';
import DistancesBlock from './DistancesBlock';
import FlightsBlock from './FlightsBlock';
import HotelsBlock from './HotelsBlock';
import TiersBlock from './TiersBlock';
import IncludesBlock from './IncludesBlock';
import LandmarksBlock from './LandmarksBlock';
import RestaurantsBlock from './RestaurantsBlock';
import NotesBlock from './NotesBlock';
import FooterBlock from './FooterBlock';
import ExtraCostsBlock from './ExtraCostsBlock';
import { DAY_NAMES } from '../../lib/constants';
import { useEffect, useState } from 'react';
import { db } from '../../lib/db';

// Decorative ambient glow divider between sections (hidden during print)
function GlowDivider() {
  return (
    <svg className="section-glow-lines no-print" viewBox="0 0 800 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,30 C150,10 350,50 500,25 C650,5 750,40 800,20" fill="none" stroke="rgba(0,229,255,0.25)" strokeWidth="1.5"/>
      <path d="M0,40 C200,20 400,55 600,30 C720,15 780,45 800,35" fill="none" stroke="rgba(140,198,63,0.18)" strokeWidth="1"/>
    </svg>
  );
}

// Single day card — used once per print-page-section
function DayCard({ day, index, isFirst }) {
  const imgs = day.imgs || (day.img ? [day.img] : []);
  const count = imgs.length;
  const dayLabel = `اليوم ${DAY_NAMES[index] || String(index + 1)}`;
  const gridClass = count >= 1 ? `day-photos-${Math.min(count, 5)}` : 'day-photos-1';

  return (
    <>
      {/* Section header only on first day */}
      {isFirst && (
        <div className="sec-head">
          <h2>البرنامج اليومي</h2>
          <div className="sec-line"></div>
        </div>
      )}

      <div className="day-page">
        <div className="day-label-strip">
          <div className="day-num-badge">{String(index + 1).padStart(2, '0')}</div>
          <span>{dayLabel}</span>
          {day.loc && <span className="day-loc-badge">📍 {day.loc}</span>}
        </div>

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

        <div className="day-text-body">
          {day.title && <div className="day-title-main">{day.title}</div>}
          {day.desc && <div className="day-desc-text">{day.desc}</div>}
        </div>

        {/* Decorative glow lines at bottom of each day */}
        <svg className="day-deco-svg" viewBox="0 0 800 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C200,20 400,100 600,40 C700,15 760,70 800,45 L800,120 L0,120 Z" fill="rgba(0,148,212,0.12)" />
          <path d="M0,80 C180,50 360,90 560,65 C680,45 750,80 800,60 L800,120 L0,120 Z" fill="rgba(140,198,63,0.08)" />
          <path d="M0,40 C120,25 250,60 400,38 C530,18 660,55 800,30" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="1.5" />
        </svg>
      </div>
    </>
  );
}

export default function PreviewShell({ tripData }) {
  const [hotelRepo, setHotelRepo] = useState([]);

  useEffect(() => {
    setHotelRepo(db.getHotels());
  }, []);

  const hasDistOrFlights = (tripData.distances?.length > 0) || (tripData.flights?.length > 0);
  const hasHotels = tripData.hotels?.some(g => g.list?.some(h => h.name));
  const hasLandmarks = tripData.landmarks?.length > 0;
  const hasRestaurants = tripData.restaurants?.length > 0;
  const hasExtraCosts = tripData.extraCosts?.length > 0;

  return (
    <div id="print-sheets-container" className="preview-container" style={{ position: 'relative', zIndex: 1 }}>
      <style dangerouslySetInnerHTML={{__html: `
        .preview-container { background: var(--n); min-height: 100vh; }
        .page {
          max-width: 800px; margin: 0 auto;
          padding: 28px 18px 60px; position: relative; z-index: 1;
        }
        .preview-container::before {
          content: ''; position: fixed; inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(0,148,212,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(140,198,63,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,10,20,0.65) 100%);
          pointer-events: none; z-index: 0;
        }
        .sec-head { display: flex; align-items: center; gap: 14px; margin: 44px 0 24px; }
        .sec-head h2 {
          font-size: 30px; font-weight: 900; color: var(--text-main);
          text-shadow: var(--gb2); letter-spacing: -0.5px; white-space: nowrap;
        }
        .sec-line {
          flex: 1; height: 3px;
          background: linear-gradient(to left, transparent, var(--ne) 60%);
          margin-top: 10px; border-radius: 2px; opacity: 0.7;
        }
        [data-theme="light"] .preview-container::before {
          background: radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(200,220,240,0.3) 100%);
        }

        /* ── Day card styles ── */
        .day-page {
          position: relative; overflow: hidden;
          background: var(--gl); border: 0.5px solid var(--gb); border-radius: 20px;
        }
        .day-label-strip {
          background: linear-gradient(135deg, rgba(0,148,212,0.28), rgba(140,198,63,0.12));
          border-bottom: 0.5px solid rgba(0,173,239,0.22);
          padding: 14px 24px; font-size: 22px; font-weight: 900;
          color: var(--ne); letter-spacing: 0.5px; text-shadow: var(--gb2);
          display: flex; align-items: center; gap: 14px;
        }
        .day-num-badge {
          width: 42px; height: 42px; border-radius: 12px;
          background: rgba(0,148,212,0.18); border: 1px solid rgba(0,148,212,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900; color: var(--ne); direction: ltr; flex-shrink: 0;
        }
        .day-loc-badge {
          margin-right: auto; font-size: 13px; font-weight: 700;
          color: var(--c); background: rgba(0,173,239,0.1);
          border: 1px solid rgba(0,173,239,0.2); padding: 4px 14px; border-radius: 20px;
        }

        /* Photo grids */
        .day-photos-1 { display: grid; grid-template-columns: 1fr; height: 340px; }
        .day-photos-2 { display: grid; grid-template-columns: 1fr 1fr; height: 300px; }
        .day-photos-3 { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; height: 300px; }
        .day-photos-4 { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; height: 300px; }
        .day-photos-5 { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 1fr 1fr; height: 320px; }
        .day-photos-3 .day-photo:first-child { grid-row: 1 / 3; }
        .day-photos-5 .day-photo:first-child { grid-row: 1 / 3; }
        .day-photo { overflow: hidden; position: relative; }
        .day-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .day-photo-placeholder {
          width: 100%; height: 100%; display: flex; align-items: center;
          justify-content: center; font-size: 48px;
          background: linear-gradient(135deg, var(--bg-card-border), var(--bg-card-dark));
        }
        .day-photos-2 .day-photo,
        .day-photos-3 .day-photo,
        .day-photos-4 .day-photo,
        .day-photos-5 .day-photo { border: 2px solid var(--gl); }

        .day-text-body { padding: 22px 28px; direction: rtl; position: relative; z-index: 1; }
        .day-title-main { font-size: 22px; font-weight: 900; color: var(--text-main); margin-bottom: 14px; line-height: 1.3; }
        .day-desc-text { font-size: 14px; color: var(--text-muted); line-height: 1.95; font-weight: 400; white-space: pre-wrap; }
        .day-deco-svg { position: absolute; bottom: 0; left: 0; right: 0; pointer-events: none; opacity: 0.3; z-index: 0; }

        /* Glow divider */
        .section-glow-lines { width: 100%; height: 60px; opacity: 0.25; display: block; pointer-events: none; }

        [data-theme="light"] .day-page { background: #fff; }
        [data-theme="light"] .day-photo-placeholder { background: #f3f4f6; }
      `}} />

      {/* COVER PAGE */}
      <CoverPage tripData={tripData} />

      {/* INNER SECTIONS */}
      <div className="page">

        {/* Country Info */}
        <div className="print-page-section" style={{ paddingTop: '16px' }}>
          <CountryInfo info={tripData.countryInfo} country={tripData.country} />
        </div>

        <GlowDivider />

        {/* Daily Program — EACH DAY IS ITS OWN PAGE SECTION */}
        {tripData.daysList?.map((day, i) => (
          <div key={day.id} className="print-page-section">
            <DayCard day={day} index={i} isFirst={i === 0} />
          </div>
        ))}

        <GlowDivider />

        {/* Package Includes */}
        {tripData.includes?.length > 0 && (
          <div className="print-page-section">
            <IncludesBlock includes={tripData.includes} />
          </div>
        )}

        <GlowDivider />

        {/* Distances & Flights */}
        {hasDistOrFlights && (
          <div className="print-page-section">
            {tripData.distances?.length > 0 && <DistancesBlock distances={tripData.distances} />}
            {tripData.flights?.length > 0 && <FlightsBlock flights={tripData.flights} />}
          </div>
        )}

        {/* Hotels */}
        {hasHotels && (
          <div className="print-page-section">
            <HotelsBlock hotels={tripData.hotels} country={tripData.country} />
          </div>
        )}

        {/* Package Tiers Comparison */}
        <div className="print-page-section">
          <TiersBlock tripData={tripData} hotelRepo={hotelRepo} currency={tripData.currency} />
        </div>

        <GlowDivider />

        {/* Landmarks */}
        {hasLandmarks && (
          <div className="print-page-section">
            <LandmarksBlock landmarks={tripData.landmarks} country={tripData.country} />
          </div>
        )}

        {/* Restaurants */}
        {hasRestaurants && (
          <div className="print-page-section">
            <RestaurantsBlock restaurants={tripData.restaurants} />
          </div>
        )}

        <GlowDivider />

        {/* Extra Costs */}
        {hasExtraCosts && (
          <div className="print-page-section">
            <ExtraCostsBlock extraCosts={tripData.extraCosts} currency={tripData.currency} />
          </div>
        )}

        {/* Notes */}
        {tripData.notes && (
          <div className="print-page-section">
            <NotesBlock notes={tripData.notes} />
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="footer-block">
        <FooterBlock tripData={tripData} />
      </div>
    </div>
  );
}
