"use client";

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, MapPin, Calendar } from 'lucide-react';
import { db } from '../../../lib/db';
import { getTierLabel } from '../../../lib/constants';

// Calculate number of nights between two dates
function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

export default function HotelsSection({ tripData, updateTripData }) {
  const [hotelRepo, setHotelRepo] = useState([]); // global repository
  const [openCityId, setOpenCityId] = useState(null);

  useEffect(() => {
    // Get hotels from global repo
    const allHotels = db.getHotels();
    setHotelRepo(allHotels);
  }, []);

  const tripStart = tripData.tripStartDate || '';
  const tripEnd = tripData.tripEndDate || '';

  // Only offer cities belonging to the trip's selected country (falls back to all cities if none/no match)
  const repoForCountry = tripData.country
    ? hotelRepo.filter(c => c.countryName === tripData.country)
    : hotelRepo;
  const cityOptions = repoForCountry.length > 0 ? repoForCountry : hotelRepo;

  // Build list of city groups in the trip
  const hotelGroups = tripData.hotels || [];

  const addCityGroup = () => {
    updateTripData(prev => ({
      ...prev,
      hotels: [...(prev.hotels || []), { id: uuidv4(), city: '', list: [] }]
    }));
  };

  const updateCityName = (groupId, city) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.map(g => g.id === groupId ? { ...g, city } : g)
    }));
  };

  const removeCityGroup = (groupId) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.filter(g => g.id !== groupId)
    }));
  };

  const addHotelEntry = (groupId) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.map(g => g.id === groupId ? {
        ...g,
        list: [...g.list, {
          id: uuidv4(),
          repoId: '',     // selected from repository
          name: '',
          stars: 4,
          image: '',
          location: '',
          hotelUrl: '',
          rooms: 1,
          roomOccupancy: 2,
          checkIn: tripStart,
          checkOut: '',
          nights: 0
        }]
      } : g)
    }));
  };

  const updateHotelEntry = (groupId, hotelId, field, value) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.map(g => g.id === groupId ? {
        ...g,
        list: g.list.map(h => {
          if (h.id !== hotelId) return h;
          let updated = { ...h, [field]: value };

          // If selecting from repo, prefill name/stars/image/location
          if (field === 'repoId') {
            for (const c of hotelRepo) {
              const found = c.list?.find(rh => rh.id === value);
              if (found) {
                updated.name = found.name;
                updated.stars = found.stars;
                updated.image = found.image || '';
                updated.location = found.location || '';
                updated.hotelUrl = found.hotelUrl || '';
                updated.tier = found.tier || 'silver';
                break;
              }
            }
          }

          // Auto-calculate nights when dates change
          if (field === 'checkIn' || field === 'checkOut') {
            const ci = field === 'checkIn' ? value : updated.checkIn;
            const co = field === 'checkOut' ? value : updated.checkOut;
            updated.nights = calcNights(ci, co);
          }

          return updated;
        })
      } : g)
    }));
  };

  const removeHotelEntry = (groupId, hotelId) => {
    updateTripData(prev => ({
      ...prev,
      hotels: prev.hotels.map(g => g.id === groupId ? {
        ...g,
        list: g.list.filter(h => h.id !== hotelId)
      } : g)
    }));
  };

  // Flatten all hotels for summary table
  const allHotelEntries = hotelGroups.flatMap(g =>
    g.list.map(h => ({ ...h, city: g.city }))
  ).filter(h => h.name);

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)' }}>الفنادق 🏨</h3>
        <button onClick={addCityGroup} style={addBtnStyle}>
          <Plus size={14} /> أضف مدينة
        </button>
      </div>

      {/* Trip Date Reminder */}
      {(tripStart || tripEnd) && (
        <div style={{ background: 'rgba(0,148,212,0.08)', border: '1px solid rgba(0,148,212,0.2)', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: 'var(--ne)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} />
          <span>مدة الرحلة: <strong>{formatDate(tripStart)}</strong> ← <strong>{formatDate(tripEnd)}</strong></span>
        </div>
      )}

      {/* Hotel Repository Warning */}
      {hotelRepo.length === 0 && (
        <div style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: '#ffa500' }}>
          ⚠️ لا توجد فنادق في المستودع. أضف فنادق أولاً من الصفحة الرئيسية &rarr; إدارة مستودع الفنادق.
        </div>
      )}

      {/* City Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {hotelGroups.map(group => (
          <div key={group.id} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(0,229,255,0.35)', boxShadow: '0 0 0 1px rgba(0,229,255,0.08), 0 0 18px rgba(0,229,255,0.12)' }}>
            
            {/* City Header */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <MapPin size={16} color="var(--g)" />
              <select
                value={group.city}
                onChange={e => updateCityName(group.id, e.target.value)}
                style={{ ...inputStyle, flex: 1, fontWeight: '700' }}
              >
                <option value="" style={{ color: '#000' }}>— اختر مدينة —</option>
                {cityOptions.map(c => (
                  <option key={c.id} value={c.city} style={{ color: '#000' }}>{c.city}</option>
                ))}
              </select>
              <button onClick={() => removeCityGroup(group.id)} style={delBtnStyle}>
                <Trash2 size={14} />
              </button>
            </div>

            {/* Hotels in this city */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '10px', borderRight: '2px solid rgba(0,148,212,0.2)' }}>
              {group.list.map(hotel => {
                // Available hotels from repo for chosen city
                const cityRepo = hotelRepo.find(c => c.city === group.city);
                const repoOptions = cityRepo?.list || [];

                return (
                  <div key={hotel.id} style={{ background: 'var(--bg-card-dark)', borderRadius: '8px', padding: '10px', border: '1px solid var(--bg-card-border)' }}>
                    
                    {/* Select Hotel from Repo */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                      <select
                        value={hotel.repoId || ''}
                        onChange={e => updateHotelEntry(group.id, hotel.id, 'repoId', e.target.value)}
                        style={{ ...inputStyle, flex: 1, background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.4)', color: 'var(--ne)', fontWeight: '700' }}
                        disabled={!group.city}
                      >
                        <option value="" style={{ color: '#000' }}>— اختر فندقاً —</option>
                        {repoOptions.map(rh => (
                          <option key={rh.id} value={rh.id} style={{ color: '#000' }}>
                            ⭐ {rh.stars} — {rh.name} · {getTierLabel(rh.tier || 'silver')}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => removeHotelEntry(group.id, hotel.id)} style={delBtnStyle}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Hotel Preview Name */}
                    {hotel.name && (
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ne)', marginBottom: '8px' }}>
                        ⭐ {hotel.stars || 0} · 🏨 {hotel.name} · <span style={{ color: 'var(--g)' }}>{getTierLabel(hotel.tier || 'silver')}</span>
                      </div>
                    )}

                    {/* Dates */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--ne)', fontWeight: '700', display: 'block', marginBottom: '3px' }}>وصول</span>
                        <input
                          type="date"
                          value={hotel.checkIn || ''}
                          min={tripStart || undefined}
                          max={tripEnd || undefined}
                          onChange={e => updateHotelEntry(group.id, hotel.id, 'checkIn', e.target.value)}
                          style={{ ...inputStyle }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--ne)', fontWeight: '700', display: 'block', marginBottom: '3px' }}>مغادرة</span>
                        <input
                          type="date"
                          value={hotel.checkOut || ''}
                          min={hotel.checkIn || tripStart || undefined}
                          max={tripEnd || undefined}
                          onChange={e => updateHotelEntry(group.id, hotel.id, 'checkOut', e.target.value)}
                          style={{ ...inputStyle }}
                        />
                      </div>
                    </div>

                    {/* Rooms & Occupancy — own row so it never overflows the sidebar */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '6px', marginTop: '6px' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--ne)', fontWeight: '700', display: 'block', marginBottom: '3px' }}>الغرف</span>
                        <input
                          type="number"
                          value={hotel.rooms || 1}
                          onChange={e => updateHotelEntry(group.id, hotel.id, 'rooms', parseInt(e.target.value) || 1)}
                          min={1}
                          max={20}
                          style={{ ...inputStyle, textAlign: 'center' }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', color: 'var(--ne)', fontWeight: '700', display: 'block', marginBottom: '3px' }}>سعة الغرفة</span>
                        <select
                          value={hotel.roomOccupancy || 2}
                          onChange={e => updateHotelEntry(group.id, hotel.id, 'roomOccupancy', parseInt(e.target.value))}
                          style={{ ...inputStyle }}
                        >
                          <option value={2} style={{ color: '#000' }}>شخصين / غرفة</option>
                          <option value={3} style={{ color: '#000' }}>3 أشخاص / غرفة</option>
                        </select>
                      </div>
                    </div>

                    {/* Auto-calculated nights */}
                    {hotel.nights > 0 && (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--g)', fontWeight: '700' }}>
                        🌙 {hotel.nights} ليالٍ — محسوبة تلقائياً
                      </div>
                    )}
                  </div>
                );
              })}

              <button onClick={() => addHotelEntry(group.id)} style={{ ...addBtnStyle, width: 'fit-content' }} disabled={!group.city}>
                <Plus size={14} /> أضف فندق في {group.city || 'هذه المدينة'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Table */}
      {allHotelEntries.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--ne)', marginBottom: '10px' }}>📊 ملخص الفنادق</div>
          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--bg-card-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 60px', background: 'rgba(0,148,212,0.12)', padding: '8px 10px', fontSize: '11px', fontWeight: '800', color: 'var(--ne)' }}>
              <span>الفندق</span><span>المدينة</span><span>وصول</span><span>مغادرة</span><span>غرف</span>
            </div>
            {allHotelEntries.map((h, i) => (
              <div key={h.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 60px',
                padding: '7px 10px', fontSize: '11px',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                borderTop: '1px solid var(--bg-card-border)', color: 'var(--text-main)'
              }}>
                <span style={{ fontWeight: '700' }}>{h.name}</span>
                <span style={{ color: 'var(--ne)' }}>{h.city}</span>
                <span>{h.checkIn || '—'}</span>
                <span>{h.checkOut || '—'}</span>
                <span style={{ textAlign: 'center' }}>{h.rooms || 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)',
  borderRadius: '6px', padding: '7px 10px', color: 'var(--text-main)', fontSize: '12px',
  outline: 'none', width: '100%',
  colorScheme: 'dark'
};

const addBtnStyle = {
  background: 'rgba(140, 198, 63, 0.15)', color: 'var(--g)', border: '1px solid var(--g)',
  padding: '5px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
  display: 'flex', alignItems: 'center', gap: '4px'
};

const delBtnStyle = {
  background: 'rgba(255, 80, 80, 0.15)', color: '#ff5050', padding: '7px', borderRadius: '6px', flexShrink: 0
};
