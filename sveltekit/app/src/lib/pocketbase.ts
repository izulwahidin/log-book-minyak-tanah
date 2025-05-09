// src/lib/pocketbase.ts
import PocketBase from 'pocketbase';
import type { Transaksi, Stok, User } from '$lib/types';

// Initialize PocketBase
export const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL

// Export types for PocketBase records
export type StokRecord = {
  id: string;
  stok_masuk: number;
  created: string;
  updated: string;
};

export type UserRecord = {
  id: string;
  name: string;
  nik: string;
  alamat: string;
  ktp: string;
  created: string;
  updated: string;
};

export type TransaksiRecord = {
  id: string;
  user: string; // ID reference to users collection
  tanggal: string;
  jumlah_pembelian: number;
  generated_from: string | null; // ID reference to transaksi collection or null
  stok_id: string; // ID reference to stok collection
  created: string;
  updated: string;
  expand?: {
    user?: UserRecord;
    generatedFrom?: TransaksiRecord;
    stok_id?: StokRecord;
  };
};

// Helper functions to convert between PocketBase records and app types
export function pbStokToAppStok(record: StokRecord): Stok {
  return {
    id: record.id,
    tanggal: record.created,
    stokMasuk:record.stok_masuk,
  };
}

export function appStokToPbStok(stok: Stok): Partial<StokRecord> {
  return {
    created: stok.tanggal,
    stok_masuk: stok.stokMasuk
  };
}

export function pbUserToAppUser(record: UserRecord): User {
  return {
    id: record.id,
    name: record.name,
    nik: record.nik,
    alamat: record.alamat,
    ktp_image: getFileUrl('users', record.id, record.ktp)
  };
}

export function appUserToPbUser(user: User): Partial<UserRecord> {
  // We need to handle the ktp_image separately for file uploads
  return {
    name: user.name,
    nik: user.nik,
    alamat: user.alamat
  };
}

export function pbTransaksiToAppTransaksi(record: TransaksiRecord): Transaksi {
  // Handle expanded relations
  let user: User;
  
  if (record.expand?.user) {
    user = pbUserToAppUser(record.expand.user);
  } else {
    // Placeholder user if not expanded
    user = {
      id: record.user,
      name: '',
      nik: '',
      alamat: '',
      ktp_image: ''
    };
  }
  
  return {
    id: record.id,
    user: user,
    tanggal: record.tanggal,
    jumlahPembelian: record.jumlah_pembelian,
    generatedFrom: record.generated_from,
    stokID: record.stok_id
  };
}

export function appTransaksiToPbTransaksi(transaksi: Transaksi): Partial<TransaksiRecord> {
  return {
    user: transaksi.user.id || '',
    tanggal: transaksi.tanggal,
    jumlah_pembelian: transaksi.jumlahPembelian,
    generated_from: transaksi.generatedFrom,
    stok_id: transaksi.stokID.toString()
  };
}

// File URL helper
export function getFileUrl(collectionName: string, recordId: string, fileName: string) {
  if (!fileName) return '';
  return `${pb.baseUrl}/api/files/${collectionName}/${recordId}/${fileName}`;
}