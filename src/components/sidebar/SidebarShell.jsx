import { ChevronRight, Save, Download, Sun, Moon } from 'lucide-react';
import TripInfoSection from './sections/TripInfoSection';
import CountryInfoSection from './sections/CountryInfoSection';
import DaysSection from './sections/DaysSection';
import DistancesSection from './sections/DistancesSection';
import FlightsSection from './sections/FlightsSection';
import HotelsSection from './sections/HotelsSection';
import IncludesSection from './sections/IncludesSection';
import LandmarksSection from './sections/LandmarksSection';
import RestaurantsSection from './sections/RestaurantsSection';
import NotesSection from './sections/NotesSection';

export default function SidebarShell({ tripData, updateTripData, tripName, onNameChange, onBack }) {
  const handlePrint = () => {
    const originalTitle = document.title;
    const countryStr = tripData.country || 'وجهة';
    const clientStr = tripData.clientName || 'عميل';
    document.title = `${countryStr}_${clientStr}`;
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--gb)', position: 'sticky', top: 0, background: 'var(--n)', zIndex: 10, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button onClick={onBack} style={{ color: 'var(--c)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
            <ChevronRight size={16} /> العودة للرحلات
          </button>
          
          <button 
            onClick={() => updateTripData(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }))}
            style={{ 
              background: 'var(--bg-card-border)', 
              border: '1px solid var(--gb)', 
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px'
            }}
          >
            {tripData.theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            {tripData.theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
          </button>
        </div>
        

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => updateTripData(tripData)} style={{ flex: 1, background: 'rgba(140,198,63,0.15)', border: '1px solid var(--g)', color: 'var(--g)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <Save size={18} /> حفظ التغييرات
          </button>
          <button onClick={handlePrint} style={{ flex: 1, background: 'var(--b)', color: 'var(--text-main)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <Download size={18} /> تصدير PDF
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <TripInfoSection tripData={tripData} updateTripData={updateTripData} tripName={tripName} onNameChange={onNameChange} />
        <CountryInfoSection tripData={tripData} updateTripData={updateTripData} />
        <IncludesSection tripData={tripData} updateTripData={updateTripData} />
        <DaysSection tripData={tripData} updateTripData={updateTripData} />
        <HotelsSection tripData={tripData} updateTripData={updateTripData} />
        <DistancesSection tripData={tripData} updateTripData={updateTripData} />
        <FlightsSection tripData={tripData} updateTripData={updateTripData} />
        <LandmarksSection tripData={tripData} updateTripData={updateTripData} />
        <RestaurantsSection tripData={tripData} updateTripData={updateTripData} />
        <NotesSection tripData={tripData} updateTripData={updateTripData} />
      </div>
    </div>
  );
}
