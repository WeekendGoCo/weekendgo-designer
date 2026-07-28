import { CURRENCIES } from '../../lib/constants';

// Helper: get Arabic day name from date string "YYYY-MM-DD"
function getArabicDayName(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', { weekday: 'long' });
  } catch { return ''; }
}

function formatArabicDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

export default function CoverPage({ tripData }) {
  const currencyObj = CURRENCIES.find(c => c.code === tripData.currency) || CURRENCIES[1];
  const sym = currencyObj.code === 'SAR' ? 'ريال' : currencyObj.symbol;

  const cityChips = tripData.cities
    ? tripData.cities.split(/[·,،\-]/).map(c => c.trim()).filter(Boolean)
    : [];

  const hasImage = !!tripData.coverImage;
  const departureDayName = getArabicDayName(tripData.tripStartDate);
  const returnDayName = getArabicDayName(tripData.tripEndDate);

  return (
    <div className="cover-page page-break-after">
      <style dangerouslySetInnerHTML={{__html: `
        /* ============================================================
           COVER PAGE — A4 Portrait | Dark Cinema | Print-safe
        ============================================================ */

        .cover-page {
          height: 297mm;
          width: 210mm;
          max-width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          color: #fff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          /* Luxury navy gradient — shows when no image */
          background-color: #07101F;
          background-image:
            radial-gradient(ellipse at 25% 15%, rgba(0,148,212,0.55) 0%, transparent 45%),
            radial-gradient(ellipse at 85% 85%, rgba(140,198,63,0.22) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 30%, rgba(0,60,160,0.35) 0%, transparent 50%),
            linear-gradient(170deg, #07101F 0%, #0d1e38 40%, #091525 100%);
          background-size: cover;
          background-position: center;
        }

        /* Cover image layer — print-safe via background-image property */
        .cover-img-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Dark cinematic overlay on top of image */
        .cover-dark-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background: ${hasImage
            ? 'linear-gradient(to top, rgba(4,10,22,0.97) 0%, rgba(4,10,22,0.35) 50%, rgba(4,10,22,0.72) 100%)'
            : 'linear-gradient(170deg, rgba(4,10,22,0.55) 0%, rgba(4,10,22,0.2) 100%)'};
        }

        /* Everything above overlays */
        .cover-page > * { position: relative; z-index: 10; }
        .cover-img-layer, .cover-dark-overlay { position: absolute; }

        /* ─── Flowing decorative SVG lines ─── */
        .cover-deco-lines {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 5;
          pointer-events: none;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* ─── LOGO top-right ─── */
        .cover-logo {
          position: absolute;
          top: 26px;
          right: 26px;
          z-index: 20;
        }
        .cover-logo img {
          height: 130px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 3px 18px rgba(0,0,0,0.55));
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* ─── CLIENT INFO CARD top-left (original style) ─── */
        .client-info-box {
          position: absolute;
          top: 26px;
          left: 26px;
          z-index: 20;
          background: rgba(7,16,31,0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0,229,255,0.25);
          border-radius: 12px;
          padding: 12px 16px;
          max-width: 210px;
        }
        .client-info-box .cib-headline {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
          letter-spacing: 1.2px;
          margin-bottom: 6px;
          line-height: 1.5;
        }
        .client-info-box .cib-name {
          font-size: 15px;
          color: #00E5FF;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 8px;
        }
        .client-info-box .cib-divider {
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.12);
          margin-bottom: 8px;
        }
        .client-info-box .cib-row {
          font-size: 11px;
          color: rgba(255,255,255,0.65);
          font-weight: 500;
          line-height: 1.7;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .client-info-box .cib-date-label {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .client-info-box .cib-date-val {
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          font-weight: 600;
        }
        .client-info-box .cib-pax {
          font-size: 11px;
          color: rgba(255,255,255,0.65);
        }

        /* ─── MAIN CENTER ─── */
        .cover-overlay {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 155px 40px 90px;
          text-align: center;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(57,255,20,0.1);
          border: 1.5px solid rgba(140,198,63,0.55);
          color: #A6CE39;
          border-radius: 100px;
          padding: 6px 22px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        /* Country name — always white, clean shadow only for depth */
        .cover-country {
          font-family: 'Alexandria', 'Cairo', sans-serif;
          font-size: 86px;
          font-weight: 900;
          color: #ffffff !important;
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 18px;
          text-shadow: 0 3px 24px rgba(0,0,0,0.9);
        }

        /* City chips — horizontal separators style */
        .city-chips {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0;
          margin-bottom: 20px;
        }
        .city-chip {
          color: rgba(255,255,255,0.92);
          font-size: 15px;
          font-weight: 700;
          padding: 0 14px;
          position: relative;
        }
        .city-chip:not(:last-child)::after {
          content: '·';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          color: var(--ne, #00E5FF);
          font-size: 18px;
        }

        /* Duration — clean text line, no boxes */
        .dur-line {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255,255,255,0.75);
          letter-spacing: 1px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .dur-nights-val {
          font-size: 28px;
          font-weight: 900;
          color: #00E5FF;
          letter-spacing: -1px;
        }
        .dur-days-val {
          font-size: 28px;
          font-weight: 900;
          color: #A6CE39;
          letter-spacing: -1px;
        }
        .dur-sep {
          color: rgba(255,255,255,0.3);
          font-weight: 300;
          font-size: 22px;
        }

        /* Price — clean and elegant, no glow */
        .price-overlay {
          text-align: center;
          margin-top: 4px;
        }
        .price-before {
          font-size: 14px;
          color: rgba(255,255,255,0.38);
          text-decoration: line-through;
          margin-bottom: 4px;
          font-weight: 500;
        }
        .price-main {
          font-size: 60px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -3px;
          line-height: 1;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 10px;
          direction: ltr;
        }
        .currency-symbol {
          font-size: 20px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0;
        }

        /* ─── CONTACT pill bottom-left ─── */
        .cover-contact {
          position: absolute;
          bottom: 36px;
          left: 28px;
          z-index: 20;
          background: rgba(7,16,31,0.62);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 100px;
          padding: 10px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cover-contact-label {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          font-weight: 600;
          white-space: nowrap;
        }
        .cover-contact-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          text-decoration: none;
          font-weight: 800;
          font-size: 18px;
          direction: ltr;
        }
        .cover-contact-link svg { color: #25D366; flex-shrink: 0; }

        /* Force identical look in both modes */
        [data-theme="light"] .cover-page { color: #fff !important; }
        [data-theme="light"] .cover-country { color: #fff !important; }
        [data-theme="light"] .price-main { color: #fff !important; }

        /* PRINT FIX — force image to render */
        @media print {
          .cover-page {
            page-break-after: always !important;
            break-after: page !important;
            height: 297mm !important;
            overflow: hidden !important;
            background-color: #07101F !important;
          }
          .cover-img-layer {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cover-dark-overlay {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .cover-deco-lines {
            display: block !important;
          }
        }
      `}} />

      {/* ── Cover image as a div (not CSS background) for print compatibility ── */}
      {hasImage && (
        <div
          className="cover-img-layer"
          style={{
            backgroundImage: `url(${tripData.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      <div className="cover-dark-overlay" />

      {/* ── Flowing decorative SVG curves (brand colors) ── */}
      <svg
        className="cover-deco-lines"
        viewBox="0 0 800 220"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5 }}
      >
        <path d="M0,130 C120,70 280,190 440,110 C580,40 700,150 800,90 L800,220 L0,220 Z"
          fill="rgba(0,148,212,0.15)" />
        <path d="M0,165 C180,110 360,185 560,130 C700,90 760,165 800,140 L800,220 L0,220 Z"
          fill="rgba(140,198,63,0.09)" />
        <path d="M0,90 C100,50 220,115 380,72 C520,35 660,100 800,55"
          fill="none" stroke="rgba(0,229,255,0.28)" strokeWidth="1.5" />
        <path d="M0,108 C130,75 260,130 420,88 C560,52 680,115 800,72"
          fill="none" stroke="rgba(140,198,63,0.18)" strokeWidth="1" />
      </svg>

      {/* ── LOGO ── */}
      <div className="cover-logo" style={{ position: 'absolute', top: 26, right: 26, zIndex: 20 }}>
        <img src="/logo.png" alt="ويكند جو" style={{ height: 130, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 3px 18px rgba(0,0,0,0.55))' }} />
      </div>

      {/* ── CLIENT INFO BOX (original compact style) ── */}
      {(tripData.clientName || tripData.paxAdults > 0) && (
        <div className="client-info-box" style={{ position: 'absolute', top: 26, left: 26, zIndex: 20 }}>
          {tripData.clientName && (
            <>
              <div className="cib-headline">
                صمم هذا الباكج السياحي خصيصا لعميلنا
              </div>
              <div className="cib-name">
                {tripData.clientTitle || 'السيد'} {tripData.clientName}
              </div>
            </>
          )}
          <div className="cib-divider" />
          <div className="cib-row">
            {tripData.paxAdults > 0 && (
              <span className="cib-pax">
                باكج سياحي: {tripData.paxAdults} بالغين{tripData.paxChildren > 0 ? `، ${tripData.paxChildren} أطفال` : ''}
              </span>
            )}
            {tripData.tripStartDate && (
              <span>
                <span className="cib-date-label">الانطلاق  </span>
                <span className="cib-date-val">{departureDayName} {formatArabicDate(tripData.tripStartDate)}</span>
              </span>
            )}
            {tripData.tripEndDate && (
              <span>
                <span className="cib-date-label">العودة  </span>
                <span className="cib-date-val">{returnDayName} {formatArabicDate(tripData.tripEndDate)}</span>
              </span>
            )}
            {tripData.offerDate && (
              <span className="cib-pax">تاريخ العرض: {tripData.offerDate}</span>
            )}
          </div>
        </div>
      )}

      {/* ── MAIN CENTER CONTENT ── */}
      <div className="cover-overlay">
        {tripData.badge && <div className="badge-pill">{tripData.badge}</div>}

        <h1 className="cover-country">{tripData.country}</h1>

        {/* Cities — dot separated */}
        {cityChips.length > 0 && (
          <div className="city-chips">
            {cityChips.map((c, i) => <span key={i} className="city-chip">{c}</span>)}
          </div>
        )}

        {/* Duration — clean inline text */}
        {(tripData.nights > 0 || tripData.days > 0) && (
          <div className="dur-line">
            <span><span className="dur-nights-val">{tripData.nights}</span> ليالٍ</span>
            <span className="dur-sep">·</span>
            <span><span className="dur-days-val">{tripData.days}</span> أيام</span>
          </div>
        )}

        {/* Price — clean, no glow */}
        {tripData.price && (
          <div className="price-overlay">
            {tripData.priceBefore && (
              <div className="price-before">السعر قبل الخصم: {tripData.priceBefore} {sym}</div>
            )}
            <div className="price-main">
              <span className="currency-symbol">{sym}</span>
              <span>{tripData.price}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── WHATSAPP CONTACT PILL ── */}
      {tripData.clientPhone && (
        <div className="cover-contact" style={{ position: 'absolute', bottom: 36, left: 28, zIndex: 20 }}>
          <span className="cover-contact-label">فريقنا بانتظاركم</span>
          <a
            href={tripData.wa || `https://wa.me/${tripData.clientPhone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="cover-contact-link"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span>{tripData.clientPhone}</span>
          </a>
        </div>
      )}
    </div>
  );
}
