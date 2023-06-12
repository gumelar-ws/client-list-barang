import React from 'react';

export default function SearchBox(searchKeyword, handleSearch) {
  return (
    <div>
      <input type="text" className="form-control mb-3" placeholder="Cari barang..." value={searchKeyword} onChange={handleSearch} />
    </div>
  );
}
