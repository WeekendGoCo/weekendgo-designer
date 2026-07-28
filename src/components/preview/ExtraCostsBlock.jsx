import { DollarSign, MapPin, AlertCircle } from 'lucide-react';
import { CURRENCIES } from '../../lib/constants';

export default function ExtraCostsBlock({ extraCosts, currency }) {
  if (!extraCosts || extraCosts.length === 0) return null;

  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const sym = currencyObj.code === 'SAR' ? 'ريال' : currencyObj.symbol;

  return (
    <>
      <div className="sec-head">
        <h2>تكاليف إضافية غير مشمولة</h2>
        <div className="sec-line"></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .ec-intro {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,165,0,0.08);
          border: 1px solid rgba(255,165,0,0.25);
          border-radius: 12px;
          padding: 12px 18px;
          margin-bottom: 24px;
          font-size: 13px;
          color: rgba(255,180,60,0.9);
          font-weight: 600;
        }
        .ec-table {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--gb);
        }
        .ec-head {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1fr;
          background: linear-gradient(135deg, rgba(255,140,0,0.15), rgba(255,80,80,0.08));
          border-bottom: 1px solid rgba(255,140,0,0.3);
          padding: 13px 20px;
          font-size: 13px;
          font-weight: 800;
          color: #ffb347;
          gap: 8px;
        }
        .ec-row {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1fr;
          padding: 14px 20px;
          font-size: 13px;
          gap: 8px;
          border-top: 1px solid var(--gb);
          align-items: center;
          transition: background 0.2s;
        }
        .ec-row:nth-child(even) { background: rgba(255,255,255,0.02); }
        .ec-row:nth-child(odd)  { background: rgba(0,0,0,0.08); }
        .ec-desc { font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 6px; }
        .ec-city { color: var(--ne); font-weight: 600; display: flex; align-items: center; gap: 4px; }
        .ec-amount {
          font-weight: 900; font-size: 14px;
          color: #ff8c42;
          text-align: left;
          direction: ltr;
        }
        .ec-total {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1fr;
          padding: 14px 20px;
          background: rgba(255,140,0,0.1);
          border-top: 2px solid rgba(255,140,0,0.35);
          font-size: 14px; font-weight: 900; gap: 8px;
        }
        .ec-total-label { color: #ffb347; }
        .ec-total-amount { color: #ff8c42; text-align: left; direction: ltr; }

        [data-theme="light"] .ec-row:nth-child(odd) { background: rgba(0,0,0,0.02); }
        [data-theme="light"] .ec-row:nth-child(even) { background: rgba(255,255,255,0.5); }
        [data-theme="light"] .ec-head { color: #c45c00; }
        [data-theme="light"] .ec-total-label { color: #c45c00; }
      `}} />

      <div className="ec-intro">
        <AlertCircle size={18} />
        <span>التكاليف التالية غير مشمولة في سعر الباقة وتُدفع بشكل منفصل</span>
      </div>

      <div className="ec-table">
        <div className="ec-head">
          <span>الوصف / النشاط</span>
          <span>المدينة</span>
          <span>التكلفة</span>
        </div>
        {extraCosts.map((item, i) => (
          <div key={i} className="ec-row">
            <div className="ec-desc">
              <DollarSign size={14} style={{ flexShrink: 0, color: '#ff8c42' }} />
              {item.desc}
            </div>
            <div className="ec-city">
              {item.city && <><MapPin size={12} />{item.city}</>}
            </div>
            <div className="ec-amount">
              {item.amount} {sym}
            </div>
          </div>
        ))}
        {/* Total row */}
        {extraCosts.filter(e => e.amount).length > 1 && (
          <div className="ec-total">
            <div className="ec-total-label">المجموع التقديري</div>
            <div></div>
            <div className="ec-total-amount">
              {extraCosts.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0).toLocaleString()} {sym}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
