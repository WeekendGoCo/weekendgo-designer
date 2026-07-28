"use client";

import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit, Hotel, Globe, MapPin, Star, UploadCloud, FileText, Check, Layers, Car, Clock, CalendarDays, UserCheck } from 'lucide-react';
import { fileToBase64 } from '../lib/utils';
import { HOTEL_TIERS } from '../lib/constants';

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState('packages');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Add hotel editing state
  const [newCityName, setNewCityName] = useState('');
  const [selectedCountryForCity, setSelectedCountryForCity] = useState('');
  const [selectedCityToAdd, setSelectedCityToAdd] = useState('');

  // Countries tab editing state
  const [newCountryName, setNewCountryName] = useState('');
  const [newCityInputs, setNewCityInputs] = useState({}); // { [countryId]: text }

  useEffect(() => {
    db.init().then(() => {
      setTrips(db.getTrips());
      setHotels(db.getHotels());
      setCountries(db.getCountries());
      setCars(db.getCars());
      setLoading(false);
    });
  }, []);

  const handleCreateTrip = () => {
    const newTrip = db.saveTrip(null, 'رحلة جديدة');
    router.push(`/designer?id=${newTrip.id}`);
  };

  const handleDeleteTrip = (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
      db.deleteTrip(id);
      setTrips(db.getTrips());
    }
  };

  // Hotels Management logic
  const handleAddCity = () => {
    if (!selectedCountryForCity || !selectedCityToAdd) {
      alert('اختر الدولة والمدينة أولاً');
      return;
    }
    const country = countries.find(c => c.id === selectedCountryForCity);
    const cityName = selectedCityToAdd;
    const exists = hotels.some(c => c.city === cityName);
    if (exists) {
      alert('هذه المدينة موجودة بالفعل في المستودع');
      return;
    }
    const updated = [...hotels, {
      id: Date.now().toString(),
      countryId: country?.id || '',
      countryName: country?.name || '',
      city: cityName,
      list: []
    }];
    setHotels(updated);
    db.saveHotelsList(updated);
    setSelectedCityToAdd('');
  };

  // Countries Management logic
  const handleAddCountry = () => {
    if (!newCountryName.trim()) return;
    const exists = countries.some(c => c.name.toLowerCase() === newCountryName.trim().toLowerCase());
    if (exists) {
      alert('هذه الدولة موجودة بالفعل');
      return;
    }
    const updated = [...countries, { id: Date.now().toString(), name: newCountryName.trim(), cities: [] }];
    setCountries(updated);
    db.saveCountriesList(updated);
    setNewCountryName('');
  };

  const handleDeleteCountry = (countryId) => {
    if (confirm('هل أنت متأكد من حذف هذه الدولة وجميع مدنها؟')) {
      const updated = countries.filter(c => c.id !== countryId);
      setCountries(updated);
      db.saveCountriesList(updated);
    }
  };

  const handleAddCityToCountry = (countryId) => {
    const cityName = (newCityInputs[countryId] || '').trim();
    if (!cityName) return;
    const updated = countries.map(c => {
      if (c.id !== countryId) return c;
      const exists = c.cities.some(ci => ci.name.toLowerCase() === cityName.toLowerCase());
      if (exists) {
        alert('هذه المدينة موجودة بالفعل لهذه الدولة');
        return c;
      }
      return { ...c, cities: [...c.cities, { id: Date.now().toString(), name: cityName }] };
    });
    setCountries(updated);
    db.saveCountriesList(updated);
    setNewCityInputs(prev => ({ ...prev, [countryId]: '' }));
  };

  const handleDeleteCityFromCountry = (countryId, cityId) => {
    const updated = countries.map(c => {
      if (c.id !== countryId) return c;
      return { ...c, cities: c.cities.filter(ci => ci.id !== cityId) };
    });
    setCountries(updated);
    db.saveCountriesList(updated);
  };

  const handleDeleteCity = (cityId) => {
    if (confirm('هل أنت متأكد من حذف هذه المدينة وجميع فنادقها؟')) {
      const updated = hotels.filter(c => c.id !== cityId);
      setHotels(updated);
      db.saveHotelsList(updated);
    }
  };

  const handleAddHotel = (cityId) => {
    const updated = hotels.map(c => {
      if (c.id === cityId) {
        return {
          ...c,
          list: [
            ...c.list,
            {
              id: Date.now().toString() + Math.random().toString(),
              name: 'فندق جديد',
              stars: 4,
              location: '',
              hotelUrl: '',
              image: '',
              tier: 'silver'
            }
          ]
        };
      }
      return c;
    });
    setHotels(updated);
    db.saveHotelsList(updated);
  };

  const handleUpdateHotel = (cityId, hotelId, field, value) => {
    const updated = hotels.map(c => {
      if (c.id === cityId) {
        return {
          ...c,
          list: c.list.map(h => h.id === hotelId ? { ...h, [field]: value } : h)
        };
      }
      return c;
    });
    setHotels(updated);
    db.saveHotelsList(updated);
  };

  const handleHotelImageUpload = async (cityId, hotelId, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        handleUpdateHotel(cityId, hotelId, 'image', base64);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  const handleDeleteHotel = (cityId, hotelId) => {
    if (confirm('هل أنت متأكد من حذف هذا الفندق؟')) {
      const updated = hotels.map(c => {
        if (c.id === cityId) {
          return {
            ...c,
            list: c.list.filter(h => h.id !== hotelId)
          };
        }
        return c;
      });
      setHotels(updated);
      db.saveHotelsList(updated);
    }
  };

  // Cars Management logic (control panel only)
  const handleAddCar = () => {
    const updated = [
      ...cars,
      {
        id: Date.now().toString() + Math.random().toString(),
        name: 'سيارة جديدة',
        category: '',
        image: '',
        withDriver: { enabled: true, dailyPrice: '' },
        selfDrive: { enabled: false, dailyPrice: '', hourlyPrice: '' }
      }
    ];
    setCars(updated);
    db.saveCarsList(updated);
  };

  const handleUpdateCar = (carId, field, value) => {
    const updated = cars.map(c => c.id === carId ? { ...c, [field]: value } : c);
    setCars(updated);
    db.saveCarsList(updated);
  };

  const handleUpdateCarService = (carId, serviceKey, field, value) => {
    const updated = cars.map(c => {
      if (c.id !== carId) return c;
      return { ...c, [serviceKey]: { ...c[serviceKey], [field]: value } };
    });
    setCars(updated);
    db.saveCarsList(updated);
  };

  const handleCarImageUpload = async (carId, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        handleUpdateCar(carId, 'image', base64);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  const handleDeleteCar = (carId) => {
    if (confirm('هل أنت متأكد من حذف هذه السيارة؟')) {
      const updated = cars.filter(c => c.id !== carId);
      setCars(updated);
      db.saveCarsList(updated);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ne)', fontSize: '16px' }}>
        جاري تحميل البيانات...
      </div>
    );
  }

  return (
    <div className="home-container" style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* App Header */}
      <div className="home-header-responsive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--ne)', textShadow: 'var(--gb2)' }}>WeekendGo Designer</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>لوحة التحكم وإدارة الرحلات والفنادق</p>
        </div>
        
        {activeTab === 'packages' && (
          <button 
            onClick={handleCreateTrip}
            style={{ 
              background: 'var(--g)', color: 'var(--n)', padding: '12px 24px', 
              borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: '700', boxShadow: 'var(--gg)'
            }}
          >
            <Plus size={20} />
            إنشاء رحلة جديدة
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="home-tabs-responsive" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--gb)', marginBottom: '32px', paddingBottom: '12px', overflowX: 'auto', flexWrap: 'nowrap' }}>
        <button
          onClick={() => setActiveTab('packages')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: activeTab === 'packages' ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
            border: `1px solid ${activeTab === 'packages' ? 'var(--ne)' : 'transparent'}`,
            color: activeTab === 'packages' ? 'var(--ne)' : 'var(--text-muted)',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <FileText size={18} />
          الباقات السياحية المحفوظة ({trips.length})
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: activeTab === 'hotels' ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
            border: `1px solid ${activeTab === 'hotels' ? 'var(--ne)' : 'transparent'}`,
            color: activeTab === 'hotels' ? 'var(--ne)' : 'var(--text-muted)',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <Hotel size={18} />
          إدارة مستودع الفنادق
        </button>
        <button
          onClick={() => setActiveTab('countries')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: activeTab === 'countries' ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
            border: `1px solid ${activeTab === 'countries' ? 'var(--ne)' : 'transparent'}`,
            color: activeTab === 'countries' ? 'var(--ne)' : 'var(--text-muted)',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <Globe size={18} />
          الدول والمدن
        </button>
        <button
          onClick={() => setActiveTab('cars')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: activeTab === 'cars' ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
            border: `1px solid ${activeTab === 'cars' ? 'var(--ne)' : 'transparent'}`,
            color: activeTab === 'cars' ? 'var(--ne)' : 'var(--text-muted)',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}
        >
          <Car size={18} />
          السيارات ({cars.length})
        </button>
      </div>

      {/* TAB CONTENT: PACKAGES */}
      {activeTab === 'packages' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {trips.length === 0 ? (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted-dark)' }}>
              لا توجد رحلات محفوظة بعد. ابدأ بإنشاء رحلة جديدة!
            </div>
          ) : (
            trips.map(trip => (
              <div key={trip.id} className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-main)' }}>{trip.name}</h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span>الوجهة: {trip.data?.country || 'غير محددة'}</span>
                    <span>•</span>
                    <span>آخر تعديل: {new Date(trip.updatedAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => router.push(`/designer?id=${trip.id}`)}
                    style={{ background: 'rgba(0, 173, 239, 0.15)', color: 'var(--ne)', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '13px' }}
                  >
                    <Edit size={16} /> تعديل الباقة
                  </button>
                  <button 
                    onClick={() => handleDeleteTrip(trip.id)}
                    style={{ background: 'rgba(255, 80, 80, 0.15)', color: '#ff5050', padding: '10px', borderRadius: '8px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: HOTELS MANAGEMENT */}
      {activeTab === 'hotels' && (
        <div>
          {/* Add City Bar */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <MapPin size={22} color="var(--ne)" />
            <select
              value={selectedCountryForCity}
              onChange={e => { setSelectedCountryForCity(e.target.value); setSelectedCityToAdd(''); }}
              style={{
                background: 'var(--bg-input)', border: '1px solid var(--gb)', borderRadius: '8px',
                padding: '12px 16px', color: 'var(--text-main)', fontSize: '14px', outline: 'none', minWidth: '180px'
              }}
            >
              <option value="" style={{ color: '#000' }}>— اختر الدولة —</option>
              {countries.map(c => (
                <option key={c.id} value={c.id} style={{ color: '#000' }}>{c.name}</option>
              ))}
            </select>
            <select
              value={selectedCityToAdd}
              onChange={e => setSelectedCityToAdd(e.target.value)}
              disabled={!selectedCountryForCity}
              style={{
                flex: 1, background: 'var(--bg-input)', border: '1px solid var(--gb)', borderRadius: '8px',
                padding: '12px 16px', color: 'var(--text-main)', fontSize: '14px', outline: 'none', minWidth: '180px'
              }}
            >
              <option value="" style={{ color: '#000' }}>— اختر المدينة —</option>
              {(countries.find(c => c.id === selectedCountryForCity)?.cities || []).map(ci => (
                <option key={ci.id} value={ci.name} style={{ color: '#000' }}>{ci.name}</option>
              ))}
            </select>
            <button
              onClick={handleAddCity}
              style={{
                background: 'var(--g)',
                color: 'var(--n)',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} /> إضافة المدينة للمستودع
            </button>
          </div>
          {countries.length === 0 && (
            <div style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#ffa500' }}>
              ⚠️ لا توجد دول معرّفة بعد. أضف دولة ومدنها أولاً من تبويب “الدول والمدن”.
            </div>
          )}

          {/* Cities and Hotels list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {hotels.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted-dark)' }}>
                لم يتم إدخال أي مدن أو فنادق في المستودع بعد.
              </div>
            ) : (
              hotels.map(cityGroup => (
                <div key={cityGroup.id} className="glass-panel" style={{ padding: '24px' }}>
                  
                  {/* City Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gb)', paddingBottom: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MapPin size={24} color="var(--g)" />
                      <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--text-main)' }}>{cityGroup.city}</h2>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'var(--bg-card-border)', padding: '2px 10px', borderRadius: '12px' }}>
                        {cityGroup.list?.length || 0} فنادق
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleAddHotel(cityGroup.id)}
                        style={{
                          background: 'rgba(0, 229, 255, 0.15)',
                          color: 'var(--ne)',
                          border: '1px solid var(--ne)',
                          padding: '6px 16px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Plus size={14} /> إضافة فندق للمدينة
                      </button>
                      <button
                        onClick={() => handleDeleteCity(cityGroup.id)}
                        style={{
                          background: 'rgba(255, 80, 80, 0.1)',
                          color: '#ff5050',
                          border: '1px solid rgba(255,80,80,0.2)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700'
                        }}
                      >
                        حذف المدينة
                      </button>
                    </div>
                  </div>

                  {/* Hotels List in City */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {cityGroup.list?.map(hotel => (
                      <div key={hotel.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--bg-card-border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                          <input
                            value={hotel.name}
                            onChange={e => handleUpdateHotel(cityGroup.id, hotel.id, 'name', e.target.value)}
                            style={{
                              flex: 1,
                              background: 'var(--bg-input)',
                              border: '1px solid var(--bg-card-border)',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              color: 'var(--text-main)',
                              fontSize: '14px',
                              fontWeight: '700',
                              outline: 'none'
                            }}
                          />
                          <button
                            onClick={() => handleDeleteHotel(cityGroup.id, hotel.id)}
                            style={{ color: '#ff5050', padding: '6px', background: 'rgba(255,80,80,0.1)', borderRadius: '6px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Stars, Tier & Location inputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-input)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--bg-card-border)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>النجوم:</span>
                            <select
                              value={hotel.stars}
                              onChange={e => handleUpdateHotel(cityGroup.id, hotel.id, 'stars', parseInt(e.target.value) || 4)}
                              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '12px', fontWeight: '700' }}
                            >
                              <option value="3" style={{ color: '#000' }}>3 نجوم</option>
                              <option value="4" style={{ color: '#000' }}>4 نجوم</option>
                              <option value="5" style={{ color: '#000' }}>5 نجوم</option>
                              <option value="6" style={{ color: '#000' }}>6 نجوم</option>
                              <option value="7" style={{ color: '#000' }}>7 نجوم</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-input)', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--bg-card-border)' }}>
                            <Layers size={12} color="var(--g)" />
                            <select
                              value={hotel.tier || 'silver'}
                              onChange={e => handleUpdateHotel(cityGroup.id, hotel.id, 'tier', e.target.value)}
                              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '12px', fontWeight: '700' }}
                            >
                              {HOTEL_TIERS.map(t => (
                                <option key={t.value} value={t.value} style={{ color: '#000' }}>{t.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <input
                          placeholder="رابط الموقع (Google Maps)"
                          value={hotel.location || ''}
                          onChange={e => handleUpdateHotel(cityGroup.id, hotel.id, 'location', e.target.value)}
                          style={{
                            background: 'var(--bg-input)',
                            border: '1px solid var(--bg-card-border)',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            color: 'var(--text-main)',
                            fontSize: '12px',
                            outline: 'none',
                            direction: 'ltr',
                            width: '100%'
                          }}
                        />

                        <input
                          placeholder="رابط الاطلاع على الفندق (Booking / الموقع الرسمي)"
                          value={hotel.hotelUrl || ''}
                          onChange={e => handleUpdateHotel(cityGroup.id, hotel.id, 'hotelUrl', e.target.value)}
                          style={{
                            background: 'var(--bg-input)',
                            border: '1px solid var(--bg-card-border)',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            color: 'var(--text-main)',
                            fontSize: '12px',
                            outline: 'none',
                            direction: 'ltr',
                            width: '100%'
                          }}
                        />

                        {/* Image Uploader */}
                        <label style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          background: 'var(--bg-card-border)', padding: '10px', borderRadius: '8px',
                          border: '1px dashed rgba(255,255,255,0.15)', cursor: 'pointer',
                          fontSize: '12px', color: 'var(--text-muted)'
                        }}>
                          <UploadCloud size={16} />
                          {hotel.image ? 'تغيير صورة الفندق' : 'رفع صورة الفندق'}
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleHotelImageUpload(cityGroup.id, hotel.id, e)} />
                        </label>

                        {hotel.image && (
                          <img src={hotel.image} alt="Hotel Preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                        )}

                      </div>
                    ))}
                    {(!cityGroup.list || cityGroup.list.length === 0) && (
                      <div style={{ gridColumn: '1 / -1', fontSize: '13px', color: 'var(--text-muted-dark)', padding: '12px', textAlign: 'center' }}>
                        لا توجد فنادق مضافة في {cityGroup.city} بعد.
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: COUNTRIES MANAGEMENT */}
      {activeTab === 'countries' && (
        <div>
          {/* Add Country Bar */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Globe size={22} color="var(--ne)" />
            <input
              placeholder="أدخل اسم الدولة الجديدة (مثال: تركيا، ماليزيا...)"
              value={newCountryName}
              onChange={e => setNewCountryName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCountry()}
              style={{
                flex: 1, background: 'var(--bg-input)', border: '1px solid var(--gb)', borderRadius: '8px',
                padding: '12px 16px', color: 'var(--text-main)', fontSize: '14px', outline: 'none'
              }}
            />
            <button
              onClick={handleAddCountry}
              style={{
                background: 'var(--g)', color: 'var(--n)', padding: '12px 24px', borderRadius: '8px',
                fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Plus size={18} /> إضافة دولة
            </button>
          </div>

          {/* Countries List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {countries.length === 0 ? (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted-dark)' }}>
                لم يتم إضافة أي دولة بعد. ابدأ بإضافة دولة جديدة!
              </div>
            ) : (
              countries.map(country => (
                <div key={country.id} className="glass-panel" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gb)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Globe size={22} color="var(--g)" />
                      <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-main)' }}>{country.name}</h2>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'var(--bg-card-border)', padding: '2px 10px', borderRadius: '12px' }}>
                        {country.cities?.length || 0} مدن
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteCountry(country.id)}
                      style={{ background: 'rgba(255, 80, 80, 0.1)', color: '#ff5050', border: '1px solid rgba(255,80,80,0.2)', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}
                    >
                      حذف الدولة
                    </button>
                  </div>

                  {/* Add city to this country */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input
                      placeholder={`أضف مدينة جديدة لـ “${country.name}”`}
                      value={newCityInputs[country.id] || ''}
                      onChange={e => setNewCityInputs(prev => ({ ...prev, [country.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAddCityToCountry(country.id)}
                      style={{
                        flex: 1, background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)', borderRadius: '8px',
                        padding: '9px 14px', color: 'var(--text-main)', fontSize: '13px', outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => handleAddCityToCountry(country.id)}
                      style={{ background: 'rgba(0, 229, 255, 0.15)', color: 'var(--ne)', border: '1px solid var(--ne)', padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={14} /> إضافة مدينة
                    </button>
                  </div>

                  {/* Cities chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(country.cities || []).map(city => (
                      <div key={city.id} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(140,198,63,0.1)', border: '1px solid rgba(140,198,63,0.3)',
                        color: 'var(--text-main)', padding: '6px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '600'
                      }}>
                        <MapPin size={12} color="var(--g)" />
                        {city.name}
                        <button onClick={() => handleDeleteCityFromCountry(country.id, city.id)} style={{ color: '#ff5050', display: 'flex' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {(!country.cities || country.cities.length === 0) && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted-dark)' }}>لا توجد مدن مضافة بعد لهذه الدولة.</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CARS MANAGEMENT (control panel only) */}
      {activeTab === 'cars' && (
        <div>
          <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Car size={22} color="var(--ne)" />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>مستودع السيارات</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>نقل مع سائق • إيجار يومي بدون سائق • إيجار ساعي بدون سائق (للاستخدام الداخلي باللوحة فقط حالياً)</div>
              </div>
            </div>
            <button
              onClick={handleAddCar}
              style={{
                background: 'var(--g)', color: 'var(--n)', padding: '12px 24px', borderRadius: '8px',
                fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              <Plus size={18} /> إضافة سيارة
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
            {cars.length === 0 ? (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'var(--text-muted-dark)' }}>
                لم يتم إضافة أي سيارات بعد. اضغط على “إضافة سيارة” للبدء.
              </div>
            ) : (
              cars.map(car => (
                <div key={car.id} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', borderRadius: '14px' }}>

                  {/* Image */}
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '140px', background: 'var(--bg-card-border)', borderRadius: '10px',
                    border: '1px dashed rgba(255,255,255,0.18)', cursor: 'pointer', overflow: 'hidden', position: 'relative'
                  }}>
                    {car.image ? (
                      <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <UploadCloud size={22} />
                        <span style={{ fontSize: '11px' }}>رفع صورة السيارة</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleCarImageUpload(car.id, e)} />
                  </label>

                  {/* Name + Category + Delete */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      value={car.name}
                      onChange={e => handleUpdateCar(car.id, 'name', e.target.value)}
                      placeholder="اسم / موديل السيارة"
                      style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)', borderRadius: '6px', padding: '8px 12px', color: 'var(--text-main)', fontSize: '14px', fontWeight: '700', outline: 'none' }}
                    />
                    <button onClick={() => handleDeleteCar(car.id)} style={{ color: '#ff5050', padding: '6px', background: 'rgba(255,80,80,0.1)', borderRadius: '6px', flexShrink: 0 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    value={car.category || ''}
                    onChange={e => handleUpdateCar(car.id, 'category', e.target.value)}
                    placeholder="الفئة (اقتصادية / عائلية / فاخرة / فان - اختياري)"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)', borderRadius: '6px', padding: '8px 10px', color: 'var(--text-main)', fontSize: '12px', outline: 'none', width: '100%' }}
                  />

                  {/* With driver service */}
                  <div style={{ background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '10px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: 'var(--ne)' }}>
                      <input
                        type="checkbox"
                        checked={!!car.withDriver?.enabled}
                        onChange={e => handleUpdateCarService(car.id, 'withDriver', 'enabled', e.target.checked)}
                        style={{ width: '14px', height: '14px', accentColor: 'var(--ne)', cursor: 'pointer' }}
                      />
                      <UserCheck size={14} /> نقل مع سائق
                    </label>
                    {car.withDriver?.enabled && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarDays size={13} color="var(--text-muted)" />
                        <input
                          type="number"
                          value={car.withDriver?.dailyPrice || ''}
                          onChange={e => handleUpdateCarService(car.id, 'withDriver', 'dailyPrice', e.target.value)}
                          placeholder="سعر اليوم"
                          style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text-main)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Self drive service */}
                  <div style={{ background: 'rgba(140,198,63,0.06)', border: '1px solid rgba(140,198,63,0.2)', borderRadius: '10px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: 'var(--g)' }}>
                      <input
                        type="checkbox"
                        checked={!!car.selfDrive?.enabled}
                        onChange={e => handleUpdateCarService(car.id, 'selfDrive', 'enabled', e.target.checked)}
                        style={{ width: '14px', height: '14px', accentColor: 'var(--g)', cursor: 'pointer' }}
                      />
                      <Car size={14} /> إيجار بدون سائق
                    </label>
                    {car.selfDrive?.enabled && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CalendarDays size={13} color="var(--text-muted)" />
                          <input
                            type="number"
                            value={car.selfDrive?.dailyPrice || ''}
                            onChange={e => handleUpdateCarService(car.id, 'selfDrive', 'dailyPrice', e.target.value)}
                            placeholder="سعر اليوم"
                            style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text-main)', fontSize: '12px', outline: 'none', minWidth: 0 }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={13} color="var(--text-muted)" />
                          <input
                            type="number"
                            value={car.selfDrive?.hourlyPrice || ''}
                            onChange={e => handleUpdateCarService(car.id, 'selfDrive', 'hourlyPrice', e.target.value)}
                            placeholder="سعر الساعة"
                            style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text-main)', fontSize: '12px', outline: 'none', minWidth: 0 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
