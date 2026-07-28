import { Check, X, Plane, Hotel, Car, Utensils, Camera, Shield, CreditCard, MapPin, Bus, Ticket } from 'lucide-react';

// Smart icon mapping based on text keywords
function getItemIcon(text) {
  const t = text?.toLowerCase() || '';
  if (t.includes('طير') || t.includes('رحل') || t.includes('تذكر')) return <Plane size={15} />;
  if (t.includes('فند') || t.includes('إقام') || t.includes('سكن')) return <Hotel size={15} />;
  if (t.includes('سيار') || t.includes('نقل') || t.includes('مواصل')) return <Car size={15} />;
  if (t.includes('وجب') || t.includes('إفطار') || t.includes('طعام') || t.includes('عشاء')) return <Utensils size={15} />;
  if (t.includes('جول') || t.includes('سياح') || t.includes('زيار')) return <Camera size={15} />;
  if (t.includes('تأمين') || t.includes('ضمان')) return <Shield size={15} />;
  if (t.includes('تأشير') || t.includes('فيزا')) return <Ticket size={15} />;
  if (t.includes('بطاق') || t.includes('دخول')) return <CreditCard size={15} />;
  if (t.includes('باص') || t.includes('حافل')) return <Bus size={15} />;
  return <MapPin size={15} />;
}

export default function IncludesBlock({ includes }) {
  if (!includes || includes.length === 0) return null;

  const includedItems = includes.filter(item => item.included);
  const excludedItems = includes.filter(item => !item.included);

  if (includedItems.length === 0 && excludedItems.length === 0) return null;

  return (
    <div style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
      <div className="sec-head">
        <h2>مزايا الباقة والتفاصيل</h2>
        <div className="sec-line"></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .incl-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .incl-col {
          border-radius: 18px;
          overflow: hidden;
          backdrop-filter: blur(16px);
        }
        .incl-col-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: 0.3px;
        }
        .incl-col-header-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .incl-col-body {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .incl-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .incl-item-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .incl-item-text {
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
          flex: 1;
        }

        /* Included column — green theme */
        .incl-included {
          background: rgba(57,255,20,0.05);
          border: 1px solid rgba(140,198,63,0.25);
        }
        .incl-included .incl-col-header {
          background: rgba(57,255,20,0.1);
          border-bottom: 1px solid rgba(140,198,63,0.2);
          color: #A6CE39;
        }
        .incl-included .incl-col-header-icon {
          background: rgba(140,198,63,0.2);
          color: #A6CE39;
        }
        .incl-included .incl-item {
          background: rgba(140,198,63,0.04);
        }
        .incl-included .incl-item:hover {
          background: rgba(140,198,63,0.1);
        }
        .incl-included .incl-item-icon {
          background: rgba(140,198,63,0.15);
          color: #A6CE39;
        }
        .incl-included .incl-item-text { color: var(--text-main); }

        /* Excluded column — red theme */
        .incl-excluded {
          background: rgba(255,80,80,0.04);
          border: 1px solid rgba(255,100,100,0.2);
        }
        .incl-excluded .incl-col-header {
          background: rgba(255,80,80,0.1);
          border-bottom: 1px solid rgba(255,100,100,0.15);
          color: #ff7070;
        }
        .incl-excluded .incl-col-header-icon {
          background: rgba(255,80,80,0.2);
          color: #ff7070;
        }
        .incl-excluded .incl-item {
          background: rgba(255,80,80,0.03);
        }
        .incl-excluded .incl-item:hover {
          background: rgba(255,80,80,0.08);
        }
        .incl-excluded .incl-item-icon {
          background: rgba(255,80,80,0.12);
          color: #ff7070;
        }
        .incl-excluded .incl-item-text {
          color: var(--text-muted);
          text-decoration-line: none;
        }

        /* Light mode adjustments */
        [data-theme="light"] .incl-included {
          background: rgba(21,128,61,0.04);
          border-color: rgba(21,128,61,0.2);
        }
        [data-theme="light"] .incl-included .incl-col-header { color: #15803d; }
        [data-theme="light"] .incl-included .incl-col-header-icon { color: #15803d; background: rgba(21,128,61,0.12); }
        [data-theme="light"] .incl-included .incl-item-icon { color: #15803d; background: rgba(21,128,61,0.1); }
        [data-theme="light"] .incl-excluded .incl-col-header { color: #dc2626; }
        [data-theme="light"] .incl-excluded .incl-col-header-icon { color: #dc2626; background: rgba(220,38,38,0.1); }
        [data-theme="light"] .incl-excluded .incl-item-icon { color: #dc2626; background: rgba(220,38,38,0.08); }
      `}} />

      <div className="incl-grid">
        {/* Included */}
        <div className="incl-col incl-included">
          <div className="incl-col-header">
            <div className="incl-col-header-icon">
              <Check size={18} strokeWidth={3} />
            </div>
            <span>يشمل الباقة</span>
          </div>
          <div className="incl-col-body">
            {includedItems.map((item, i) => (
              <div key={i} className="incl-item">
                <div className="incl-item-icon">
                  {item.logoIcon
                    ? <img src="/small_logo.png" alt="" style={{ width: '15px', height: '15px', objectFit: 'contain' }} />
                    : getItemIcon(item.text)
                  }
                </div>
                <span className="incl-item-text">{item.text}</span>
              </div>
            ))}
            {includedItems.length === 0 && (
              <div style={{ fontSize: '13px', color: 'var(--text-muted-dark)', padding: '8px' }}>لا توجد بنود</div>
            )}
          </div>
        </div>

        {/* Excluded */}
        <div className="incl-col incl-excluded">
          <div className="incl-col-header">
            <div className="incl-col-header-icon">
              <X size={18} strokeWidth={3} />
            </div>
            <span>لا يشمل الباقة</span>
          </div>
          <div className="incl-col-body">
            {excludedItems.map((item, i) => (
              <div key={i} className="incl-item">
                <div className="incl-item-icon">
                  <X size={14} strokeWidth={2.5} />
                </div>
                <span className="incl-item-text">{item.text}</span>
              </div>
            ))}
            {excludedItems.length === 0 && (
              <div style={{ fontSize: '13px', color: 'var(--text-muted-dark)', padding: '8px' }}>لا توجد بنود</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
