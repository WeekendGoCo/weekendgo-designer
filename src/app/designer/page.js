"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '../../lib/db';
import { INITIAL_TRIP_STATE } from '../../lib/constants';
import { validateTiers } from '../../lib/tierUtils';
import SidebarShell from '../../components/sidebar/SidebarShell';
import PreviewShell from '../../components/preview/PreviewShell';

function DesignerContent() {
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

  const handleUpdate = (updater) => {
    setTripData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (trip) {
        db.saveTrip(next, trip.name, trip.id);
      }
      return next;
    });
  };

  const handleNameChange = (newName) => {
    if (trip) {
      const updated = db.saveTrip(tripData, newName, trip.id);
      setTrip(updated);
    }
  };

  const handleExportPDF = () => {
    const { emptyTiers } = validateTiers(tripData);
    if (emptyTiers.length > 0) {
      alert(
        `لا يمكن تصدير PDF الآن:\n\nالمستويات التالية مفعّلة (لها سعر) لكن بدون أي فندق مختار في أي مدينة:\n` +
        emptyTiers.map(t => `• ${t.label}`).join('\n') +
        `\n\nأكمل اختيار الفنادق من قسم “جدول مستويات الباقات” أو احذف السعر منه للمتابعة.`
      );
      return;
    }
    window.open(`/print?id=${trip.id}`, '_blank');
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>;
  }

  if (!trip) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>;
  }

  return (
    <div className="designer-layout" data-theme={tripData.theme || 'dark'} style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar - Control Panel */}
      <div className="sidebar-container" style={{ width: '400px', flexShrink: 0, borderLeft: '1px solid var(--gb)', background: 'var(--n)', overflowY: 'auto' }}>
        <SidebarShell
          tripData={tripData}
          updateTripData={handleUpdate}
          tripName={trip.name}
          onNameChange={handleNameChange}
          onBack={() => router.push('/')}
          onExportPDF={handleExportPDF}
        />
      </div>

      {/* Preview Area */}
      <div className="preview-container-wrapper" style={{ flex: 1, background: 'var(--n)', overflowY: 'auto', position: 'relative' }}>
        <PreviewShell tripData={tripData} />
      </div>
    </div>
  );
}

export default function Designer() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>جاري التحميل...</div>}>
      <DesignerContent />
    </Suspense>
  );
}
