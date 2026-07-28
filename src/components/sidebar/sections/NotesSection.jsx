import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';

export default function NotesSection({ tripData, updateTripData }) {
  const sections = [
    { key: 'cancellation', title: 'سياسة الإلغاء' },
    { key: 'hotels', title: 'الفنادق' },
    { key: 'tours', title: 'الجولات السياحية' },
    { key: 'travelGulf', title: 'إجراءات السفر (جنسية خليجية)' },
    { key: 'travelNonGulf', title: 'إجراءات السفر (جنسية غير خليجية)' },
    { key: 'banking', title: 'المعاملات البنكية' }
  ];

  const addNote = (key) => {
    updateTripData(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [key]: [...(prev.notes?.[key] || []), { id: uuidv4(), text: '' }]
      }
    }));
  };

  const updateNote = (key, id, value) => {
    updateTripData(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [key]: prev.notes[key].map(n => n.id === id ? { ...n, text: value } : n)
      }
    }));
  };

  const removeNote = (key, id) => {
    updateTripData(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [key]: prev.notes[key].filter(n => n.id !== id)
      }
    }));
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'var(--ne)' }}>ملاحظات هامة 📝</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {sections.map(sec => (
          <div key={sec.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--c)' }}>{sec.title}</h4>
              <button onClick={() => addNote(sec.key)} style={addBtnStyle}><Plus size={14} /> إضافة سطر</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tripData.notes?.[sec.key]?.map(note => (
                <div key={note.id} style={{ display: 'flex', gap: '8px' }}>
                  <textarea 
                    value={note.text}
                    onChange={e => updateNote(sec.key, note.id, e.target.value)}
                    placeholder="اكتب الملاحظة هنا..."
                    style={{ ...inputStyle, minHeight: '40px' }}
                  />
                  <button onClick={() => removeNote(sec.key, note.id)} style={delBtnStyle}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)',
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
