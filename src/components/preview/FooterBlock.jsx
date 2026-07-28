import { Phone, Mail, Globe } from 'lucide-react';

export default function FooterBlock({ tripData }) {
  return (
    <div style={{ marginTop: '60px', padding: '40px 20px', background: '#0A1628', borderTop: '2px solid var(--ne)', textAlign: 'center', pageBreakInside: 'avoid' }}>
      <img src="/logo.png" alt="ويكند جو" className="footer-logo" style={{ height: '80px', marginBottom: '24px', opacity: 1 }} />
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tripData.clientPhone && (
          <a href={tripData.wa || `https://wa.me/${tripData.clientPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: '700', textDecoration: 'none', direction: 'ltr' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--ne)">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span style={{ paddingTop: '2px' }}>{tripData.clientPhone}</span>
          </a>
        )}
        {tripData.email && (
          <a href={`mailto:${tripData.email}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: '700', textDecoration: 'none', direction: 'ltr' }}>
            <Mail size={20} color="var(--ne)" /> <span style={{ paddingTop: '2px' }}>{tripData.email}</span>
          </a>
        )}
        {tripData.web && (
          <a href={tripData.web} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px', fontWeight: '700', textDecoration: 'none', direction: 'ltr' }}>
            <Globe size={20} color="var(--ne)" /> <span style={{ paddingTop: '2px' }}>{tripData.web.replace(/^https?:\/\//i, '').replace(/\/$/, '')}</span>
          </a>
        )}
      </div>

      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '2', direction: 'rtl' }}>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 24px' }}>
          <span>🏢 السجل التجاري: <strong style={{ color: 'rgba(255,255,255,0.85)' }}>7052763104</strong></span>
          <span>📋 الرقم الضريبي: <strong style={{ color: 'rgba(255,255,255,0.85)' }}>314445803500003</strong></span>
          <span>🏖️ تصريح وزارة السياحة: <strong style={{ color: 'rgba(255,255,255,0.85)' }}>73107083</strong></span>
        </div>
      </div>
    </div>
  );
}
