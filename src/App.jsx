// import logo from './logo.svg';
import { useEffect, useState } from 'react';
import { TambahBarang } from './components/TambahBarang';
import { uid } from 'uid';
import './App.css';
import { Link } from 'react-router-dom';
const url = 'https://list-barang.cyclic.app/data';

function App(props) {
  const [barang, setBarang] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dataSerch, setDataSerch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(barang.length / itemsPerPage);

  useEffect(() => {
    fetchBarang();
  }, []);
  const fetchBarang = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      setBarang(data);
      setDataSerch(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (searchText === '') {
      setBarang(dataSerch);
      setNotFound('');
    } else {
      const filteredData = dataSerch.filter((item) => item.namaBarang.toLowerCase().includes(searchText.toLowerCase()));
      if (filteredData.length === 0) {
        setNotFound('Data yang Anda cari tidak ada. Harap cari data lain yang ada!');
      } else {
        setNotFound('');
      }
      setBarang(filteredData);
    }
  }, [searchText, dataSerch]);

  // save dataBarang
  const [saveData, setSaveData] = useState({
    namaBarang: '',
    hargaJual: 0,
    hargaBeli: 0,
    stock: 0,
  });

  const handelChange = (e) => {
    let data = { ...saveData };
    data[e.target.name] = e.target.value;
    setSaveData(data);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const urlBlob = reader.result;
        setImageUrl(urlBlob);
      };
      reader.readAsDataURL(file);
    }
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements['foto-barang'].files[0];
    const allowedTypes = ['image/png', 'image/jpeg'];
    const maxSize = 100 * 1024; // 100 KB
    if (file.type !== allowedTypes && file.size > maxSize) {
      alert('file gambar harus jpg/png dan max 100kb');
      return;
    }
    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
      const reader = new FileReader();
      reader.onload = async () => {
        const urlBlob = reader.result; // URL Blob gambar

        // Cek apakah nama barang sudah ada di listBarang
        const isDuplicateName = barang.some((barang) => barang.namaBarang === saveData.namaBarang);

        // Cek apakah URL gambar sudah ada di listBarang
        const isDuplicateImageUrl = barang.some((barang) => barang.fotoBarang === urlBlob);

        if (isDuplicateName) {
          alert('Nama barang sudah ada, harap masukkan nama yang berbeda');
        } else if (isDuplicateImageUrl) {
          alert('Gambar sudah ada, harap pilih gambar lain');
        } else {
          try {
            const data = {
              id: uid(),
              fotoBarang: urlBlob,
              namaBarang: saveData.namaBarang,
              hargaJual: saveData.hargaJual,
              hargaBeli: saveData.hargaBeli,
              stock: saveData.stock,
            };

            await fetch(url, {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            await fetchBarang();
            setSaveData({ namaBarang: '', hargaJual: 0, hargaBeli: 0, stock: 0 });
            setImageUrl('');
          } catch (error) {
            console.error(error);
          }
        }
      };

      reader.readAsDataURL(file);
    }
  };
  // pagination

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = barang.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // delet barang
  const handleDeleteBarang = async (id) => {
    try {
      window.confirm('apakah anda yakin akan menghapus data ini ?');
      // Kirim permintaan DELETE ke API dengan ID barang yang akan dihapus
      await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });
      await fetchBarang();
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  console.log(barang);
  return (
    <div>
      <div className="container ">
        <button className="btn btn-primary mt-3" onClick={() => setIsShow(!isShow)}>
          Tambah barang +
        </button>
        {isShow ? <TambahBarang handelSubmit={handelSubmit} saveData={saveData} handleFile={handleFile} handelChange={handelChange} imageUrl={imageUrl} /> : ''}
        {/* serchbox */}
        <input className={isShow ? 'border-primary mt-3 ms-2 rounded-5 p-2' : 'border-primary mt-5 ms-3 rounded-5 p-2'} type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Serch Nama Barang ..." />
        <table className="table mt-5">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Foto Barang</th>
              <th scope="col">Nama Barang</th>
              <th scope="col">Harga Jual</th>
              <th scope="col">Harga Beli</th>
              <th scope="col">Stock</th>
              <th scope="col">ACtion</th>
            </tr>
          </thead>
          <tbody>
            {/* maping data barang */}
            {isLoading ? (
              <tr>
                <td> loding ...</td>
              </tr>
            ) : barang.length === 0 ? (
              <tr>
                <td className="text-danger">{notFound}</td>
              </tr>
            ) : (
              currentItems.map((data, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <img src={data.fotoBarang} alt={data.namaBarang} width="70px" />
                    </td>
                    <td>{data.namaBarang}</td>
                    <td>{data.hargaJual}</td>
                    <td>{data.hargaBeli}</td>
                    <td>{data.stock}</td>
                    <td>
                      <button className="btn btn-warning me-1">
                        <Link to={`/edit/${data.id}`}>Edit</Link>
                      </button>
                      <button className="btn btn-danger  " onClick={() => handleDeleteBarang(data.id)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* pagination */}
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="/" onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </a>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li className={`page-item ${currentPage === index + 1 ? 'active' : ''}`} key={index + 1}>
                <p className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </p>
              </li>
            ))}
            <li className="page-item">
              <p className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </p>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
