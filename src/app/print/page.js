"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '../../lib/db';
import { INITIAL_TRIP_STATE } from '../../lib/constants';
import PreviewShell from '../../components/preview/PreviewShell';
import { Printer, ArrowRight, Sun, Moon } from 'lucide-react';

function PrintPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [trip, setTrip] = useState(null);
  const [tripData, setTripData] = useState(INITIAL_TRIP_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.init().then(() => {
      if (id) {
        const existingTrip = db.getTrip(id);
        if (existingTrip) {
          setTrip(existingTrip);
          setTripData(existingTrip.data);
        } else {
          router.push('/');
        }
      }
      setLoading(false);
    });
  }, [id, router]);

  const handlePrint = () => {
    const originalTitle = document.title;
    const countryStr = tripData.country || 'وجهة';
    const clientStr = tripData.clientName || 'عميل';
    document.title = `${countryStr}_${clientStr}`;
    window.print();
    document.title = originalTitle;
  };

  const handleToggleTheme = () => {
    const nextTheme = tripData.theme === 'light' ? 'dark' : 'light';
    setTripData(prev => {
      const updated = { ...prev, theme: nextTheme };
      if (trip) {
        db.saveTrip(updated, trip.name, trip.id);
      }
      return updated;
    });
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ne)' }}>جاري التحميل...</div>;
  }

  if (!trip) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ne)' }}>جاري التحميل...</div>;
  }

  return (
    <div className="print-preview-mode" data-theme={tripData.theme || 'dark'} style={{ minHeight: '100vh', background: 'var(--n)', paddingBottom: '60px' }}>
      
      {/* Floating Control Panel - Hidden in Print */}
      <div className="no-print" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(7, 16, 31, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => router.push(`/designer?id=${trip.id}`)}
            style={{ 
              color: '#fff', 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '8px 16px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <ArrowRight size={16} /> العودة للمصمم
          </button>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
            معاينة قبل الطباعة: <strong style={{ color: '#fff' }}>{trip.name}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme switcher directly in preview */}
          <button
            onClick={handleToggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            {tripData.theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            {tripData.theme === 'light' ? 'تحويل للداكن' : 'تحويل للفاتح'}
          </button>

          <button 
            onClick={async () => {
              try {
                const { exportTripToPDF } = await import('../../lib/pdfExporter');
                const countryStr = tripData.country || 'وجهة';
                const clientStr = tripData.clientName || 'عميل';
                await exportTripToPDF('print-sheets-container', `${countryStr}_${clientStr}.pdf`);
              } catch (e) {
                alert('جاري البدء بالطباعة المباشرة...');
                handlePrint();
              }
            }}
            style={{ 
              background: 'var(--g, #39FF14)', 
              color: '#07101F', 
              padding: '8px 18px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '14px',
              fontWeight: '800',
              boxShadow: '0 0 12px rgba(57, 255, 20, 0.4)'
            }}
          >
            تحميل PDF مباشرة
          </button>

          <button 
            onClick={handlePrint}
            style={{ 
              background: 'var(--b, #0094D4)', 
              color: '#fff', 
              padding: '8px 20px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontSize: '14px',
              fontWeight: '700',
              boxShadow: '0 0 12px rgba(0, 148, 212, 0.4)'
            }}
          >
            <Printer size={18} /> طباعة النظام
          </button>
        </div>
      </div>

      {/* Actual page preview structure */}
      <div className="preview-sheets-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', paddingTop: '40px' }}>
        <PreviewShell tripData={tripData} />
      </div>

    </div>
  );
}

export default function PrintPreview() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--ne)' }}>جاري التحميل...</div>}>
      <PrintPreviewContent />
    </Suspense>
  );
}
