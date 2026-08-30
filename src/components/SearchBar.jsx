import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, placeholder = "Search cameras, brands, mounts..." }) => {
  return (
    <div style={{
      position: 'relative',
      flex: 1,
      maxWidth: '460px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-full)',
        padding: '10px 18px',
        gap: '12px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '0.92rem',
            width: '100%'
          }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
