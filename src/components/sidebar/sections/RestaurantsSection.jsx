import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import { Plus, Trash2, MapPin, UploadCloud } from 'lucide-react';
import { fileToBase64 } from '../../../lib/utils';
import { db } from '../../../lib/db';

export default function RestaurantsSection({ tripData, updateTripData }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(db.getCountries());
  }, []);

  const tripCities = countries.find(c => c.name === tripData.country)?.cities || [];
  const addCity = () => {
    updateTripData(prev => ({
      ...prev,
      restaurants: [...(prev.restaurants || []), { id: uuidv4(), city: '', list: [] }]
    }));
  };

  const updateCity = (id, newCity) => {
    updateTripData(prev => ({
      ...prev,
      restaurants: prev.restaurants.map(c => c.id === id ? { ...c, city: newCity } : c)
    }));
  };

  const removeCity = (id) => {
    updateTripData(prev => ({
      ...prev,
      restaurants: prev.restaurants.filter(c => c.id !== id)
    }));
  };

  const addRestaurant = (cityId) => {
    updateTripData(prev => ({
      ...prev,
      restaurants: prev.restaurants.map(c => c.id === cityId ? {
        ...c, list: [...c.list, { id: uuidv4(), name: '', nameEn: '', image: '', desc: '', location: '' }]
      } : c)
    }));
  };

  const updateRestaurant = (cityId, restId, field, value) => {
    updateTripData(prev => ({
      ...prev,
      restaurants: prev.restaurants.map(c => c.id === cityId ? {
        ...c, list: c.list.map(r => r.id === restId ? { ...r, [field]: value } : r)
      } : c)
    }));
  };

  const handleImageUpload = async (cityId, restId, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        updateRestaurant(cityId, restId, 'image', base64);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  const removeRestaurant = (cityId, restId) => {
    updateTripData(prev => ({
      ...prev,
      restaurants: prev.restaurants.map(c => c.id === cityId ? {
        ...c, list: c.list.filter(r => r.id !== restId)
      } : c)
    }));
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)' }}>المطاعم 🍽</h3>
        <button onClick={addCity} style={addBtnStyle}><Plus size={14} /> أضف مدينة</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tripData.restaurants?.map(cityGroup => (
          <div key={cityGroup.id} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={18} color="var(--g)" />
              <select
                value={cityGroup.city}
                onChange={e => updateCity(cityGroup.id, e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="" style={{ color: '#000' }}>— اختر المدينة —</option>
                {tripCities.map(city => (
                  <option key={city.id} value={city.name} style={{ color: '#000' }}>{city.name}</option>
                ))}
              </select>
              <button onClick={() => removeCity(cityGroup.id)} style={delBtnStyle}><Trash2 size={14} /></button>
            </div>
            {tripCities.length === 0 && (
              <div style={{ fontSize: '11px', color: '#ffa500', marginBottom: '10px' }}>⚠️ اختر دولة الرحلة ومدنها أولاً من قسم المعلومات الأساسية.</div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '12px', borderRight: '2px solid var(--bg-card-border)' }}>
              {cityGroup.list.map(rest => (
                <div key={rest.id} style={{ background: 'var(--bg-card-dark)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <input 
                      placeholder="اسم المطعم" 
                      value={rest.name} 
                      onChange={e => updateRestaurant(cityGroup.id, rest.id, 'name', e.target.value)}
                      style={{ ...inputStyle, width: '70%' }}
                    />
                    <button onClick={() => removeRestaurant(cityGroup.id, rest.id)} style={delBtnStyle}><Trash2 size={14} /></button>
                  </div>
                  <input 
                    placeholder="اسم المطعم (إنجليزي)" 
                    value={rest.nameEn} 
                    onChange={e => updateRestaurant(cityGroup.id, rest.id, 'nameEn', e.target.value)}
                    style={{ ...inputStyle, marginBottom: '8px', direction: 'ltr' }}
                  />
                  <input 
                    placeholder="رابط الموقع (Google Maps)" 
                    value={rest.location || ''} 
                    onChange={e => updateRestaurant(cityGroup.id, rest.id, 'location', e.target.value)}
                    style={{ ...inputStyle, marginBottom: '8px', direction: 'ltr' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--bg-input)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer', marginBottom: '8px' }}>
                    <UploadCloud size={16} color="var(--ne)" />
                    <span style={{ fontSize: '11px', color: 'var(--text-main)' }}>رفع صورة المطعم (Recommended: 800x600)</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(cityGroup.id, rest.id, e)} />
                  </label>
                  {rest.image && <img src={rest.image} alt="preview" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />}
                  <textarea 
                    placeholder="لمحة عن المطعم..." 
                    value={rest.desc} 
                    onChange={e => updateRestaurant(cityGroup.id, rest.id, 'desc', e.target.value)}
                    style={{ ...inputStyle, minHeight: '50px' }}
                  />
                </div>
              ))}
              <button onClick={() => addRestaurant(cityGroup.id)} style={{ ...addBtnStyle, width: 'fit-content' }}>
                <Plus size={14} /> أضف مطعم
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
