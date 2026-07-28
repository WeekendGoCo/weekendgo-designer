import { useEffect, useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { CURRENCIES } from '../../../lib/constants';
import { db } from '../../../lib/db';

export default function ExtraCostsSection({ tripData, updateTripData }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(db.getCountries());
  }, []);

  const tripCities = countries.find(c => c.name === tripData.country)?.cities || [];
  const currency = CURRENCIES.find(c => c.code === tripData.currency) || CURRENCIES[0];
  const sym = currency.code === 'SAR' ? 'ريال' : currency.symbol;

  const addItem = () => {
    updateTripData(prev => ({
      ...prev,
      extraCosts: [...(prev.extraCosts || []), { desc: '', city: '', amount: '' }]
    }));
  };

  const updateItem = (index, field, value) => {
    updateTripData(prev => {
      const arr = [...(prev.extraCosts || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, extraCosts: arr };
    });
  };

  const removeItem = (index) => {
    updateTripData(prev => ({
      ...prev,
      extraCosts: prev.extraCosts.filter((_, i) => i !== index)
    }));
  };

  const items = tripData.extraCosts || [];

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,140,0,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#ffb347' }}>
          💰 تكاليف إضافية غير مشمولة
        </h3>
        <button onClick={addItem} style={{ background: 'rgba(255,140,0,0.15)', color: '#ffb347', border: '1px solid rgba(255,140,0,0.35)', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={14} /> إضافة بند
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Header */}
        {items.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 32px', gap: '6px', padding: '6px 8px', fontSize: '10px', fontWeight: '800', color: 'var(--ne)', letterSpacing: '0.5px' }}>
            <span>الوصف / النشاط</span><span>المدينة</span><span>التكلفة ({sym})</span><span></span>
          </div>
        )}

        {items.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 32px', gap: '6px', alignItems: 'center' }}>
            <input
              placeholder="مثال: دخول حديقة كذا"
              value={item.desc}
              onChange={e => updateItem(i, 'desc', e.target.value)}
              style={inputStyle}
            />
            <select
              value={item.city}
              onChange={e => updateItem(i, 'city', e.target.value)}
              style={inputStyle}
            >
              <option value="" style={{ color: '#000' }}>— المدينة —</option>
              {tripCities.map(city => (
                <option key={city.id} value={city.name} style={{ color: '#000' }}>{city.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="المبلغ"
              value={item.amount}
              onChange={e => updateItem(i, 'amount', e.target.value)}
              min={0}
              style={{ ...inputStyle, textAlign: 'center' }}
            />
            <button onClick={() => removeItem(i)} style={{ background: 'rgba(255,80,80,0.15)', color: '#ff5050', padding: '7px', borderRadius: '6px' }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted-dark)', textAlign: 'center', padding: '10px' }}>
            لا توجد تكاليف إضافية مضافة بعد.
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)',
  borderRadius: '6px', padding: '7px 10px', color: 'var(--text-main)', fontSize: '12px',
  outline: 'none', width: '100%'
};
