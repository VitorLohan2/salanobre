// src/components/BoxList.jsx
// src/components/BoxList.jsx
export default function BoxList({ data }) {
    return (
      <div style={{ 
        marginTop: '20px',
        backgroundColor: 'rgb(37 36 36)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ 
          color: '#fff',
          marginBottom: '15px',
          fontSize: '1.3rem',
          borderBottom: '1px solid #333',
          paddingBottom: '10px'
        }}>
          Caixas Registradas
        </h3>
        
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '10px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#555 #000'
        }}>
          {data.map((item, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: '#fff',
                padding: '12px 15px',
                borderRadius: '6px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateX(5px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,255,255,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontWeight: '700',
                color: '#000',
                fontSize: '1.1rem',
                letterSpacing: '0.5px'
              }}>
                {item.boxNumber}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#555',
                backgroundColor: '#f0f0f0',
                padding: '3px 8px',
                borderRadius: '12px'
              }}>
                {item.time}
              </div>
            </div>
          ))}
        </div>
        
        <div style={{
          marginTop: '15px',
          textAlign: 'center',
          color: '#aaa',
          fontSize: '0.9rem',
          borderTop: '1px solid #333',
          paddingTop: '10px'
        }}>
          Total: <span style={{ color: '#fff' }}>{data.length}</span> registros
        </div>
      </div>
    );
  }