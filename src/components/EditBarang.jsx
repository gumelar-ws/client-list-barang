import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const url = 'https://list-barang.cyclic.app/data';

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
      const response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Tanggapi berhasil, lakukan tindakan sesuai kebutuhan
        // Misalnya, tampilkan pesan sukses, reset formulir, dll.
        console.log('Barang berhasil diubah');
        navigate('/'); // Navigasi kembali ke halaman utama setelah edit selesai
      } else {
        // Tanggapi gagal, tampilkan pesan error
        console.error('Gagal mengubah barang');
      }
    } catch (error) {
      // Tangani kesalahan yang mungkin terjadi
      console.error('Terjadi kesalahan dalam mengirim permintaan');
    }
  };

  return (
    <div>
      <h2>Edit Barang ID: {id}</h2>
      <form onSubmit={handleEditBarang}>
        <div>
          <label>
            Nama Barang:
            <input type="text" value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Harga Jual:
            <input type="number" value={hargaJual} onChange={(e) => setHargaJual(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Harga Beli:
            <input type="number" value={hargaBeli} onChange={(e) => setHargaBeli(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Stock:
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Foto Barang:
            <input type="file" accept="image/jpeg, image/png" onChange={handleFotoBarangChange} />
          </label>
        </div>
        <div>{previewFoto ? <img src={previewFoto} alt="Foto Barang" width="200" /> : <img src={fotoBarang} alt="Foto Barang" width="200" />}</div>
        <button type="submit">Simpan Perubahan</button>
      </form>
    </div>
  );
}

export default EditBarang;
