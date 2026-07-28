import { MapPin, Maximize, Users, Languages, Coins, Landmark, ThermometerSun } from 'lucide-react';

export default function CountryInfo({ info, country }) {
  if (!info || (!info.description && !info.capital)) return null;

  return (
    <>
      <div className="sec-head"><h2>معلومات عن {country}</h2><div className="sec-line"></div></div>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .info-desc {
            font-size: 14px;
            color: var(--text-muted);
            line-height: 1.8;
            margin-bottom: 20px;
            text-align: justify;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 20px;
          }
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: var(--bg-card);
            padding: 12px;
            border-radius: 8px;
            border: 1px solid var(--bg-card-border);
          }
          .info-label {
            font-size: 11px;
            color: var(--c);
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .info-val {
            font-size: 13px;
            color: var(--text-main);
            font-weight: 600;
          }
          .climate-box {
            background: rgba(0,173,239,0.08);
            border: 1px solid var(--gb);
            padding: 14px;
            border-radius: 8px;
          }
        `}} />
        
        {info.description && <div className="info-desc">{info.description}</div>}
        
        <div className="info-grid">
          {info.capital && <div className="info-item"><span className="info-label"><MapPin size={14} /> العاصمة</span><span className="info-val">{info.capital}</span></div>}
          {info.area && <div className="info-item"><span className="info-label"><Maximize size={14} /> المساحة</span><span className="info-val">{info.area}</span></div>}
          {info.population && <div className="info-item"><span className="info-label"><Users size={14} /> عدد السكان</span><span className="info-val">{info.population}</span></div>}
          {info.language && <div className="info-item"><span className="info-label"><Languages size={14} /> اللغة الرسمية</span><span className="info-val">{info.language}</span></div>}
          {info.currencyName && <div className="info-item"><span className="info-label"><Coins size={14} /> العملة</span><span className="info-val">{info.currencyName}</span></div>}
          {info.government && <div className="info-item"><span className="info-label"><Landmark size={14} /> نظام الحكم</span><span className="info-val">{info.government}</span></div>}
        </div>

        {info.climate && (
          <div className="climate-box">
            <span className="info-label" style={{ marginBottom: '6px' }}><ThermometerSun size={14} /> المناخ</span>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{info.climate}</div>
          </div>
        )}
      </div>
    </>
  );
}
