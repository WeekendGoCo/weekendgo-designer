export default function NotesBlock({ notes }) {
  if (!notes) return null;

  const sections = [
    { key: 'cancellation', title: 'سياسة الإلغاء' },
    { key: 'hotels', title: 'الفنادق' },
    { key: 'tours', title: 'الجولات السياحية' },
    { key: 'travelGulf', title: 'إجراءات السفر (جنسية خليجية)' },
    { key: 'travelNonGulf', title: 'إجراءات السفر (جنسية غير خليجية)' },
    { key: 'banking', title: 'المعاملات البنكية' }
  ];

  const hasNotes = sections.some(sec => notes[sec.key] && notes[sec.key].length > 0);
  if (!hasNotes) return null;

  return (
    <>
      <div className="sec-head"><h2>ملاحظات هامة</h2><div className="sec-line"></div></div>
      <div className="glass-panel" style={{ padding: '24px' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .notes-section {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          .notes-section:last-child {
            margin-bottom: 0;
          }
          .notes-title {
            font-size: 18px;
            font-weight: 800;
            color: var(--c);
            margin-bottom: 14px;
            border-right: 4px solid var(--c);
            padding-right: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .notes-list {
            list-style: none;
          }
          .notes-list li {
            position: relative;
            padding-right: 20px;
            margin-bottom: 8px;
            font-size: 13px;
            color: var(--text-muted);
            line-height: 1.7;
          }
          .notes-list li::before {
            content: "•";
            position: absolute;
            right: 0;
            color: var(--g);
            font-weight: bold;
            font-size: 18px;
            line-height: 1;
            top: -2px;
          }
        `}} />

        {sections.map(sec => {
          const items = notes[sec.key];
          if (!items || items.length === 0) return null;

          return (
            <div key={sec.key} className="notes-section">
              <h3 className="notes-title">{sec.title}</h3>
              <ul className="notes-list">
                {items.map(item => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
