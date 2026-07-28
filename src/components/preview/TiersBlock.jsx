import { Crown } from 'lucide-react';
import { getPrintableTierRows, getCityPeriods } from '../../lib/tierUtils';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' });
  } catch { return dateStr; }
}

export default function TiersBlock({ tripData, hotelRepo, currency }) {
  const printableRows = getPrintableTierRows(tripData);
  const cityPeriods = getCityPeriods(tripData);

  if (printableRows.length === 0 || cityPeriods.length === 0) return null;

  const findHotelNames = (groupId, hotelIds, city) => {
    const cityRepo = (hotelRepo || []).find(c => c.city === city);
    if (!cityRepo) return '';
    return (hotelIds || [])
      .map(id => cityRepo.list?.find(h => h.id === id)?.name)
      .filter(Boolean)
      .join(' \u2022 ');
  };

  return (
    <>
      <div className="sec-head">
        <h2>مستويات الباقة المقترحة</h2>
        <div className="sec-line"></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .tier-table-wrap { width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid var(--gb); margin-bottom: 20px; }
        .tier-table-head, .tier-table-row {
          display: grid;
          grid-template-columns: 1.1fr repeat(var(--city-count), 1.6fr) 1fr;
          gap: 4px;
        }
        .tier-table-head {
          background: linear-gradient(135deg, rgba(212,175,55,0.28), rgba(140,198,63,0.1));
          border-bottom: 1px solid rgba(212,175,55,0.35);
          padding: 14px 18px; font-size: 13px; font-weight: 800; color: var(--ne);
        }
        .tier-table-row { padding: 14px 18px; font-size: 12.5px; border-top: 1px solid var(--gb); }
        .tier-table-row:nth-child(even) { background: rgba(255,255,255,0.02); }
        .tier-table-row:nth-child(odd) { background: rgba(0,0,0,0.1); }
        .tier-cell-name { font-weight: 900; color: var(--g); display: flex; align-items: center; gap: 6px; }
        .tier-cell-hotels { color: var(--text-main); line-height: 1.6; }
        .tier-cell-price { font-weight: 900; color: var(--ne); text-align: center; }
        [data-theme="light"] .tier-table-head { background: linear-gradient(135deg, rgba(212,175,55,0.18), rgba(140,198,63,0.08)); }
        [data-theme="light"] .tier-table-row:nth-child(even) { background: rgba(0,0,0,0.02); }
        [data-theme="light"] .tier-table-row:nth-child(odd) { background: rgba(255,255,255,0.6); }
      `}} />

      <div className="tier-table-wrap">
        <div className="tier-table-head" style={{ '--city-count': cityPeriods.length }}>
          <span>المستوى</span>
          {cityPeriods.map(cp => (
            <span key={cp.groupId}>
              فنادق {cp.city} ({formatDate(cp.checkIn)} — {formatDate(cp.checkOut)})
            </span>
          ))}
          <span>السعر</span>
        </div>
        {printableRows.map(({ tierDef, row }) => (
          <div key={tierDef.value} className="tier-table-row" style={{ '--city-count': cityPeriods.length }}>
            <div className="tier-cell-name">
              <Crown size={14} /> {tierDef.label}
            </div>
            {cityPeriods.map(cp => (
              <div key={cp.groupId} className="tier-cell-hotels">
                {findHotelNames(cp.groupId, row.selections?.[cp.groupId], cp.city) || '—'}
              </div>
            ))}
            <div className="tier-cell-price">{row.price || '—'} {row.price ? currency : ''}</div>
          </div>
        ))}
      </div>
    </>
  );
}
