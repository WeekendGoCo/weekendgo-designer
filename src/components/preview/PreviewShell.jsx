import CoverPage from './CoverPage';
import CountryInfo from './CountryInfo';
import DaysBlock from './DaysBlock';
import DistancesBlock from './DistancesBlock';
import FlightsBlock from './FlightsBlock';
import HotelsBlock from './HotelsBlock';
import IncludesBlock from './IncludesBlock';
import LandmarksBlock from './LandmarksBlock';
import RestaurantsBlock from './RestaurantsBlock';
import NotesBlock from './NotesBlock';
import FooterBlock from './FooterBlock';

export default function PreviewShell({ tripData }) {
  return (
    <div className="preview-container" style={{ position: 'relative', zIndex: 1 }}>
      <style dangerouslySetInnerHTML={{__html: `
        .preview-container {
          background: var(--n);
          min-height: 100vh;
        }
        .page {
          max-width: 800px;
          margin: 0 auto;
          padding: 28px 18px 60px;
          position: relative;
          z-index: 1;
        }
        /* Ambient background glow */
        .preview-container::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(0,148,212,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(140,198,63,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5,10,20,0.65) 100%);
          pointer-events: none;
          z-index: 0;
        }
        .sec-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 44px 0 24px;
        }
        .sec-head h2 {
          font-size: 30px;
          font-weight: 900;
          color: var(--text-main);
          text-shadow: var(--gb2);
          letter-spacing: -0.5px;
          white-space: nowrap;
        }
        .sec-line {
          flex: 1;
          height: 3px;
          background: linear-gradient(to left, transparent, var(--ne) 60%);
          margin-top: 10px;
          border-radius: 2px;
          opacity: 0.7;
        }
        /* Light mode adjustments */
        [data-theme="light"] .preview-container::before {
          background: radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(200,220,240,0.3) 100%);
        }
      `}} />

      {/* COVER PAGE — always first, always dark */}
      <CoverPage tripData={tripData} />

      {/* INNER SECTIONS — on white/light background */}
      <div className="page">

        {/* Page 2: Country Info + Daily Program */}
        <div className="print-page-section" style={{ paddingTop: '16px' }}>
          <CountryInfo info={tripData.countryInfo} country={tripData.country} />
          <DaysBlock daysList={tripData.daysList} />
        </div>

        {/* Page 3+: Package Details */}
        <div className="print-page-section">
          <IncludesBlock includes={tripData.includes} />

          {tripData.distances?.length > 0 && <DistancesBlock distances={tripData.distances} />}
          {tripData.flights?.length > 0 && <FlightsBlock flights={tripData.flights} />}
        </div>

        {/* Hotels + Landmarks */}
        {(tripData.hotels?.length > 0 || tripData.landmarks?.length > 0) && (
          <div className="print-page-section">
            {tripData.hotels?.length > 0 && <HotelsBlock hotels={tripData.hotels} country={tripData.country} />}
            {tripData.landmarks?.length > 0 && <LandmarksBlock landmarks={tripData.landmarks} country={tripData.country} />}
          </div>
        )}

        {/* Restaurants */}
        {tripData.restaurants?.length > 0 && (
          <div className="print-page-section">
            <RestaurantsBlock restaurants={tripData.restaurants} />
          </div>
        )}

        {/* Notes — last section before footer */}
        <div className="print-page-section">
          <NotesBlock notes={tripData.notes} />
        </div>
      </div>

      {/* FOOTER — always dark background, spans full width */}
      <div className="footer-block">
        <FooterBlock tripData={tripData} />
      </div>
    </div>
  );
}
