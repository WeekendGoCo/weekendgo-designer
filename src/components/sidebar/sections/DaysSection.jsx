import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, UploadCloud, X, Image } from 'lucide-react';
import { fileToBase64 } from '../../../lib/utils';

export default function DaysSection({ tripData, updateTripData }) {
  const addDay = () => {
    if ((tripData.daysList?.length || 0) >= 14) {
      alert("الحد الأقصى للأيام هو 14 يوم");
      return;
    }
    updateTripData(prev => ({
      ...prev,
      daysList: [...(prev.daysList || []), {
        id: uuidv4(), title: '', loc: '', imgs: [], desc: ''
      }]
    }));
  };

  const updateDay = (id, field, value) => {
    updateTripData(prev => ({
      ...prev,
      daysList: prev.daysList.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  const handleImageUpload = async (id, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const day = tripData.daysList.find(d => d.id === id);
    const currentImgs = day?.imgs || (day?.img ? [day.img] : []);
    const remaining = 5 - currentImgs.length;
    const toProcess = files.slice(0, remaining);

    const newImgs = [];
    for (const file of toProcess) {
      try {
        const base64 = await fileToBase64(file);
        newImgs.push(base64);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
    updateTripData(prev => ({
      ...prev,
      daysList: prev.daysList.map(d => {
        if (d.id !== id) return d;
        const existing = d.imgs || (d.img ? [d.img] : []);
        return { ...d, imgs: [...existing, ...newImgs].slice(0, 5) };
      })
    }));
  };

  const removeImage = (dayId, imgIndex) => {
    updateTripData(prev => ({
      ...prev,
      daysList: prev.daysList.map(d => {
        if (d.id !== dayId) return d;
        const imgs = [...(d.imgs || (d.img ? [d.img] : []))];
        imgs.splice(imgIndex, 1);
        return { ...d, imgs };
      })
    }));
  };

  const removeDay = (id) => {
    updateTripData(prev => ({
      ...prev,
      daysList: prev.daysList.filter(d => d.id !== id)
    }));
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)' }}>البرنامج اليومي</h3>
        <button onClick={addDay} style={addBtnStyle}><Plus size={14} /> أضف يوم</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tripData.daysList?.map((day, i) => {
          const imgs = day.imgs || (day.img ? [day.img] : []);
          return (
            <div key={day.id} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--c)' }}>اليوم {i + 1}</span>
                <button onClick={() => removeDay(day.id)} style={delBtnStyle}><Trash2 size={14} /></button>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                <input 
                  placeholder="عنوان اليوم" 
                  value={day.title} 
                  onChange={e => updateDay(day.id, 'title', e.target.value)}
                  style={inputStyle}
                />
                <input 
                  placeholder="المدينة / الموقع" 
                  value={day.loc} 
                  onChange={e => updateDay(day.id, 'loc', e.target.value)}
                  style={inputStyle}
                />

                {/* Image uploads */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--ne)', fontWeight: '700', marginBottom: '6px' }}>
                    <Image size={12} style={{ display: 'inline', marginLeft: '4px' }} />
                    الصور ({imgs.length}/5) — كل يوم يظهر في صفحة مستقلة
                  </div>

                  {/* Existing images */}
                  {imgs.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '6px', marginBottom: '6px' }}>
                      {imgs.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img src={img} alt={`Day ${i+1} img ${idx+1}`} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                          <button
                            onClick={() => removeImage(day.id, idx)}
                            style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.7)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button (disabled if 5 images) */}
                  {imgs.length < 5 && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--bg-input)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer' }}>
                      <UploadCloud size={16} color="var(--ne)" />
                      <span style={{ fontSize: '11px', color: 'var(--text-main)' }}>
                        {imgs.length === 0 ? 'رفع صورة (حتى 5)' : `إضافة صور (${5 - imgs.length} متبقية)`}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(day.id, e)}
                      />
                    </label>
                  )}
                </div>

                <textarea 
                  placeholder="شرح وتفاصيل اليوم..." 
                  value={day.desc} 
                  onChange={e => updateDay(day.id, 'desc', e.target.value)}
                  style={{ ...inputStyle, minHeight: '60px' }}
                />
              </div>
            </div>
          );
        })}
        {(!tripData.daysList || tripData.daysList.length === 0) && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>لا توجد أيام مضافة.</div>
        )}
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
