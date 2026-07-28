export default function HelloPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'Cairo, sans-serif',
      backgroundColor: '#07101F',
      color: '#00E5FF',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋 أهلاً بك! (Hello World)</h1>
      <p style={{ fontSize: '1.25rem', color: '#ffffff' }}>
        إذا كنت ترى هذه الصفحة، فهذا يعني أن التحديث التلقائي للسيرفر يعمل بنجاح! 🚀
      </p>
    </div>
  );
}
