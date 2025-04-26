// src/components/DateSelector.jsx
// Componente de Seleção de Data

import { useState } from 'react';

export default function DateSelector({ onDateSelect }) {
    const [selectedDate, setSelectedDate] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!selectedDate) {
        alert('Por favor, selecione uma data');
        return;
      }
      onDateSelect(selectedDate);
    };
  
    return (
      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
          Selecione a data:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              marginLeft: '10px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </label>
        <button type="submit">
          Consultar
        </button>
      </form>
    );
}