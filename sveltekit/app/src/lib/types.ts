export interface Transaksi {
    id: string;
    user: User
    tanggal: string;
    jumlahPembelian: number;
    generatedFrom: Transaksi["id"]|null;// i want to null or Transaksi.id
    stokID: string;
  }
  
  export interface Stok {
    id: string;
    tanggal: string;
    stokMasuk: number;
  }
  
  export interface User {
    id: string,
    name: string,
    nik: string,
    alamat: string,
    ktp_image: string
  }