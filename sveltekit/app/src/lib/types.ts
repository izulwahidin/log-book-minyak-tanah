export interface Transaksi {
    id?: number;
    user: User
    tanggal: string;
    jumlahPembelian: number;
    generatedFrom: Transaksi["id"]|null;// i want to null or Transaksi.id
    stokID: number;
  }
  
  export interface Stok {
    id?: number;
    tanggal: string;
    stokMasuk: number;
  }
  
  export interface User {
    id?: number,
    name: string,
    nik: string,
    alamat: string,
    ktp_image: string
  }