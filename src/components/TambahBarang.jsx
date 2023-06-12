import React from 'react';

export const TambahBarang = ({ handelSubmit, saveData, handleFile, handelChange, imageUrl }) => {
  return (
    <div>
      <form onSubmit={handelSubmit}>
        <div className="mb-3 ">
          <div className="sub-form mb-2">
            <label htmlFor="foto-barang" className="form-label">
              Foto Barang
            </label>
            <input type="file" accept=".jpg, .jpeg, .png" name="fotoBarang" className="form-control w-50" value={saveData.fotoBarang} id="foto-barang" onChange={handleFile} />
          </div>
          <div className="sub-form">
            <img src={imageUrl} alt="preview" width="100px" />
          </div>
        </div>

        {/* ======= */}

        <div className="mb-3 d-flex">
          <div className="sub-form me-2">
            <label htmlFor="nama-barang" className="form-label">
              Nama Barang
            </label>
            <input type="text" name="namaBarang" className="form-control" id="nama-barang" placeholder="nama barang" onChange={handelChange} value={saveData.namaBarang} />
          </div>
          <div className="sub-form">
            <label htmlFor="harga-jual" className="form-label">
              Harga Jual
            </label>
            <input type="number" name="hargaJual" className="form-control" value={saveData.hargaJual} id="harga-jual" onChange={handelChange} />
          </div>
        </div>
        {/* ======= */}
        <div className="mb-3 d-flex">
          <div className="sub-form me-2">
            <label htmlFor="harga-beli" className="form-label">
              Harga Beli
            </label>
            <input type="number" name="hargaBeli" className="form-control" value={saveData.hargaBeli} id="harga-beli" onChange={handelChange} />
          </div>
          <div className="sub-form">
            <label htmlFor="stock" className="form-label">
              Stock
            </label>
            <input type="number" name="stock" className="form-control" value={saveData.stock} id="stock" onChange={handelChange} />
          </div>
        </div>
        {/* ======= */}
        <button type="submit" className="btn btn-primary">
          {' '}
          Simpan
        </button>
      </form>
    </div>
  );
};
