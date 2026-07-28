import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, MapPin, UploadCloud } from 'lucide-react';
import { fileToBase64 } from '../../../lib/utils';

export default function LandmarksSection({ tripData, updateTripData }) {
  const addCity = () => {
    updateTripData(prev => ({
      ...prev,
      landmarks: [...(prev.landmarks || []), { id: uuidv4(), city: '', list: [] }]
    }));
  };

  const updateCity = (id, newCity) => {
    updateTripData(prev => ({
      ...prev,
      landmarks: prev.landmarks.map(c => c.id === id ? { ...c, city: newCity } : c)
    }));
  };

  const removeCity = (id) => {
    updateTripData(prev => ({
      ...prev,
      landmarks: prev.landmarks.filter(c => c.id !== id)
    }));
  };

  const addLandmark = (cityId) => {
    updateTripData(prev => ({
      ...prev,
      landmarks: prev.landmarks.map(c => c.id === cityId ? {
        ...c, list: [...c.list, { id: uuidv4(), name: '', image: '', desc: '', location: '' }]
      } : c)
    }));
  };

  const updateLandmark = (cityId, landmarkId, field, value) => {
    updateTripData(prev => ({
      ...prev,
      landmarks: prev.landmarks.map(c => c.id === cityId ? {
        ...c, list: c.list.map(l => l.id === landmarkId ? { ...l, [field]: value } : l)
      } : c)
    }));
  };

  const handleImageUpload = async (cityId, landmarkId, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        updateLandmark(cityId, landmarkId, 'image', base64);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  const removeLandmark = (cityId, landmarkId) => {
    updateTripData(prev => ({
      ...prev,
      landmarks: prev.landmarks.map(c => c.id === cityId ? {
        ...c, list: c.list.filter(l => l.id !== landmarkId)
      } : c)
    }));
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)' }}>المعالم المميزة 🏛</h3>
        <button onClick={addCity} style={addBtnStyle}><Plus size={14} /> أضف مدينة</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tripData.landmarks?.map(cityGroup => (
          <div key={cityGroup.id} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={18} color="var(--g)" />
              <input 
                placeholder="اسم المدينة" 
                value={cityGroup.city} 
                onChange={e => updateCity(cityGroup.id, e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button onClick={() => removeCity(cityGroup.id)} style={delBtnStyle}><Trash2 size={14} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '12px', borderRight: '2px solid var(--bg-card-border)' }}>
              {cityGroup.list.map(landmark => (
                <div key={landmark.id} style={{ background: 'var(--bg-card-dark)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <input 
                      placeholder="اسم المعلم" 
                      value={landmark.name} 
                      onChange={e => updateLandmark(cityGroup.id, landmark.id, 'name', e.target.value)}
                      style={{ ...inputStyle, width: '70%' }}
                    />
                    <button onClick={() => removeLandmark(cityGroup.id, landmark.id)} style={delBtnStyle}><Trash2 size={14} /></button>
                  </div>
                  
                  <input 
                    placeholder="رابط الموقع (Google Maps)" 
                    value={landmark.location} 
                    onChange={e => updateLandmark(cityGroup.id, landmark.id, 'location', e.target.value)}
                    style={{ ...inputStyle, marginBottom: '8px', direction: 'ltr' }}
                  />

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--bg-input)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer', marginBottom: '8px' }}>
                    <UploadCloud size={16} color="var(--ne)" />
                    <span style={{ fontSize: '11px', color: 'var(--text-main)' }}>رفع صورة المعلم (Recommended: 800x600)</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(cityGroup.id, landmark.id, e)} />
                  </label>
                  {landmark.image && <img src={landmark.image} alt="preview" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />}

                  <textarea 
                    placeholder="لمحة عن المعلم..." 
                    value={landmark.desc} 
                    onChange={e => updateLandmark(cityGroup.id, landmark.id, 'desc', e.target.value)}
                    style={{ ...inputStyle, minHeight: '50px' }}
                  />
                </div>
              ))}
              <button onClick={() => addLandmark(cityGroup.id)} style={{ ...addBtnStyle, width: 'fit-content' }}>
                <Plus size={14} /> أضف معلم
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)',
  borderRadius: '6px', padding: '8px 10px', color: 'var(--text-main)', fontSize: '12px',
  outline: 'none', width: '100%'
};

const addBtnStyle = {
  background: 'rgba(140, 198, 63, 0.15)', color: 'var(--g)', border: '1px solid var(--g)',
  padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
  display: 'flex', alignItems: 'center', gap: '4px'
};

const delBtnStyle = {
  background: 'rgba(255, 80, 80, 0.15)', color: '#ff5050', padding: '8px', borderRadius: '6px'
};
