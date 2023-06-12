import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const url = 'https://server-json-delta.vercel.app/data';

function EditBarang() {
  const { id } = useParams(); // Menangkap ID dari parameter rute
  const navigate = useNavigate();

  const [namaBarang, setNamaBarang] = useState('');
  const [hargaJual, setHargaJual] = useState(0);
  const [hargaBeli, setHargaBeli] = useState(0);
  const [stock, setStock] = useState(0);
  const [fotoBarang, setFotoBarang] = useState(null);
  const [previewFoto, setPreviewFoto] = useState('');

  useEffect(() => {
    // Fetch data barang berdasarkan ID
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/${id}`);
        const data = await response.json();

        setNamaBarang(data.namaBarang);
        setHargaJual(data.hargaJual);
        setHargaBeli(data.hargaBeli);
        setStock(data.stock);
        setPreviewFoto(data.fotoBarang);
      } catch (error) {
        console.error('Terjadi kesalahan dalam mengambil data barang');
      }
    };

    fetchData();
  }, [id]);

  const handleFotoBarangChange = (e) => {
    const file = e.target.files[0];

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      // Mengatur pratinjau foto saat diedit
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewFoto(reader.result);
      };
      reader.readAsDataURL(file);

      // Mengatur file foto yang akan dikirim ke server
      setFotoBarang(file);
    } else {
      // Jika file yang dipilih bukan jpg/png, reset foto dan pratinjau
      setFotoBarang(null);
      setPreviewFoto('');
    }
  };

  const handleEditBarang = async (e) => {
    e.preventDefault();

    // Buat objek data edit barang
    const data = {
      id: id,
      namaBarang: namaBarang,
      hargaJual: hargaJual,
      hargaBeli: hargaBeli,
      stock: stock,
      fotoBarang: previewFoto,
    };

    try {
      // Lakukan permintaan PUT ke server
      await fetch(`${url}/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Barang berhasil diubah');
      navigate('/');
    } catch (error) {
      // Tangani kesalahan yang mungkin terjadi
      console.error('Terjadi kesalahan dalam mengirim permintaan');
    }
  };

  return (
    <div className="container">
      <h2>Edit Barang ID: {id}</h2>
      <form onSubmit={handleEditBarang}>
        <div className="mb-3 ">
          <div className="sub-form mb-2">
            <label htmlFor="foto-barang" className="form-label">
              Foto Barang
            </label>
            <input type="file" name="fotoBarang" className="form-control w-50" id="foto-barang" accept="image/jpeg, image/png" onChange={handleFotoBarangChange} />
          </div>
          <div className="sub-form">
            <div>{previewFoto ? <img src={previewFoto} alt="Foto Barang" width="200" /> : <img src={fotoBarang} alt="Foto Barang" width="200" />}</div>
          </div>
        </div>

        {/* ======= */}

        <div className="mb-3 d-flex">
          <div className="sub-form me-2">
            <label htmlFor="nama-barang" className="form-label">
              Nama Barang
            </label>
            <input type="text" name="namaBarang" className="form-control" id="nama-barang" onChange={(e) => setNamaBarang(e.target.value)} value={namaBarang} />
          </div>
          <div className="sub-form">
            <label htmlFor="harga-jual" className="form-label">
              Harga Jual
            </label>
            <input type="number" name="hargaJual" className="form-control" id="harga-jual" value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} />
          </div>
        </div>
        {/* ======= */}
        <div className="mb-3 d-flex">
          <div className="sub-form me-2">
            <label htmlFor="harga-beli" className="form-label">
              Harga Beli
            </label>
            <input type="number" name="hargaBeli" className="form-control" id="harga-beli" value={hargaBeli} onChange={(e) => setHargaBeli(e.target.value)} />
          </div>
          <div className="sub-form">
            <label htmlFor="stock" className="form-label">
              Stock
            </label>
            <input type="number" name="stock" className="form-control" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
        </div>
        {/* ======= */}
        <button type="submit" className="btn btn-success">
          {' '}
          Simpan Perubahan
        </button>
      </form>
      {/* =============== */}
      {/* <form >
        <div>
          <label>
            Nama Barang:
            <input type="text" value={namaBarang}  />
          </label>
        </div>
        <div>
          <label>
            Harga Jual:
            <input type="number"  />
          </label>
        </div>
        <div>
          <label>
            Harga Beli:
            <input type="number" />
          </label>
        </div>
        <div>
          <label>
            Stock:
            <input type="number"  />
          </label>
        </div>
        <div>
          <label>
            Foto Barang:
            <input type="file"  />
          </label>
        </div>
       
        <button type="submit">Simpan Perubahan</button>
      </form> */}
    </div>
  );
}

export default EditBarang;
