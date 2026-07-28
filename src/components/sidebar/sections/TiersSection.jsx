"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, Layers, Crown } from 'lucide-react';
import { db } from '../../../lib/db';
import { HOTEL_TIERS } from '../../../lib/constants';
import { getCityPeriods, validateTiers } from '../../../lib/tierUtils';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
  } catch { return dateStr; }
}

export default function TiersSection({ tripData, updateTripData }) {
  const [hotelRepo, setHotelRepo] = useState([]);
  const [tierOverrides, setTierOverrides] = useState({}); // `${tier}-${groupId}` -> bool, accept other tiers as fallback

  useEffect(() => {
    setHotelRepo(db.getHotels());
  }, []);

  const cityPeriods = getCityPeriods(tripData);
  const { emptyTiers, partialTiers } = validateTiers(tripData);
  const tiersData = tripData.tiers || [];

  const getRow = (tierValue) => tiersData.find(t => t.tier === tierValue) || { tier: tierValue, price: '', selections: {} };

  const updateRow = (tierValue, updater) => {
    updateTripData(prev => {
      const list = prev.tiers || [];
      const existingIndex = list.findIndex(t => t.tier === tierValue);
      const current = existingIndex >= 0 ? list[existingIndex] : { tier: tierValue, price: '', selections: {} };
      const updatedRow = updater(current);
      const nextList = [...list];
      if (existingIndex >= 0) nextList[existingIndex] = updatedRow;
      else nextList.push(updatedRow);
      return { ...prev, tiers: nextList };
    });
  };

  const setPrice = (tierValue, price) => {
    updateRow(tierValue, row => ({ ...row, price }));
  };

  const toggleHotel = (tierValue, groupId, hotelId) => {
    updateRow(tierValue, row => {
      const current = row.selections?.[groupId] || [];
      const next = current.includes(hotelId)
        ? current.filter(id => id !== hotelId)
        : [...current, hotelId];
      return { ...row, selections: { ...row.selections, [groupId]: next } };
    });
  };

  if (cityPeriods.length === 0) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={16} /> جدول مستويات الباقات
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-muted-dark)', marginTop: '10px' }}>
          أدخل فنادق الرحلة بتواريخها أولاً (قسم الفنادق أعلاه) حتى تظهر هنا المدن والفترات المتاحة لبناء جدول المستويات.
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--gb)' }}>
      <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--ne)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Crown size={16} /> جدول مستويات الباقات (الفاخر)
      </h3>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
        اختر لكل مستوى الفنادق المقترحة في كل مدينة/فترة، وحدّد سعر الباقة لهذا المستوى.
      </div>

      {/* Global blocking warning */}
      {emptyTiers.length > 0 && (
        <div style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '12px', color: '#ff6b6b', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong>لا يمكن تصدير PDF:</strong> المستوى/المستويات التالية مفعّلة (لها سعر) لكن بدون أي فندق مختار في أي مدينة:{' '}
            {emptyTiers.map(t => t.label).join('، ')}. أكمل الاختيار أو احذف السعر لإلغاء تفعيل المستوى.
          </div>
        </div>
      )}

      {/* Partial coverage warning */}
      {partialTiers.length > 0 && (
        <div style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.25)', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', fontSize: '12px', color: '#ffa500', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong>سيتم إخفاء صف بالكامل من الجدول عند التصدير:</strong>
            <div style={{ marginTop: '4px' }}>
              {partialTiers.map(({ tier, missingCities }) => (
                <div key={tier.value}>
                  {tier.label}: ناقص فنادق في {missingCities.map(c => c.city).join('، ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {HOTEL_TIERS.map(tierDef => {
          const row = getRow(tierDef.value);
          return (
            <div key={tierDef.value} style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)', borderRadius: '10px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--g)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} /> {tierDef.label}
                </span>
                <input
                  placeholder="سعر الباقة لهذا المستوى"
                  value={row.price || ''}
                  onChange={e => setPrice(tierDef.value, e.target.value)}
                  style={{
                    background: 'var(--bg-input)', border: '1px solid var(--bg-card-border)', borderRadius: '6px',
                    padding: '6px 10px', color: 'var(--text-main)', fontSize: '12px', outline: 'none', width: '160px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cityPeriods.map(cp => {
                  const cityRepo = hotelRepo.find(c => c.city === cp.city);
                  const tripGroup = (tripData.hotels || []).find(g => g.id === cp.groupId);
                  const addedRepoIds = new Set((tripGroup?.list || []).map(h => h.repoId).filter(Boolean));
                  const overrideKey = `${tierDef.value}-${cp.groupId}`;
                  const acceptOtherTiers = !!tierOverrides[overrideKey];
                  const exactTierHotels = (cityRepo?.list || []).filter(h => (h.tier || 'silver') === tierDef.value && h.name && addedRepoIds.has(h.id));
                  const fallbackHotels = (cityRepo?.list || []).filter(h => h.name && addedRepoIds.has(h.id));
                  const tierHotels = exactTierHotels.length > 0 ? exactTierHotels : (acceptOtherTiers ? fallbackHotels : []);
                  const selected = row.selections?.[cp.groupId] || [];

                  return (
                    <div key={cp.groupId} style={{ background: 'var(--bg-card-dark)', border: '1px solid var(--bg-card-border)', borderRadius: '8px', padding: '8px 10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--ne)', marginBottom: '6px' }}>
                        {cp.city} ({formatDate(cp.checkIn)} — {formatDate(cp.checkOut)})
                      </div>

                      {tierHotels.length === 0 ? (
                      <div>
                      <div style={{ fontSize: '11px', color: '#ffa500', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                        <AlertTriangle size={12} /> لم تُضف فنادق من فئة {tierDef.label} للرحلة في {cp.city} بعد — أضفها من قسم الفنادق أعلاه أولاً.
                          </div>
                          {fallbackHotels.length > 0 && (
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--ne)', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={acceptOtherTiers}
                                onChange={e => setTierOverrides(prev => ({ ...prev, [overrideKey]: e.target.checked }))}
                              />
                              قبول فنادق من فئات أخرى مؤقتاً لهذه المدينة لحين تعبئة المستودع
                            </label>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {tierHotels.map(h => {
                            const active = selected.includes(h.id);
                            return (
                              <button
                                key={h.id}
                                type="button"
                                onClick={() => toggleHotel(tierDef.value, cp.groupId, h.id)}
                                style={{
                                  background: active ? 'rgba(0,148,212,0.18)' : 'var(--bg-input)',
                                  border: `1px solid ${active ? 'var(--ne)' : 'var(--bg-card-border)'}`,
                                  color: active ? 'var(--ne)' : 'var(--text-muted)',
                                  padding: '5px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: '700'
                                }}
                              >
                                {h.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
