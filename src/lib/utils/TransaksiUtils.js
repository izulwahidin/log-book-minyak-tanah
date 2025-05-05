
// Handlers for transaksi operations
function addTransaksi(newTransaksi) {
    if (editingTransaksi !== null) {
      // Update existing transaction
      transaksi = transaksi.map((t, index) => 
        index === editingTransaksi ? newTransaksi : t
      );
      editingTransaksi = null;
    } else {
      // Add new transaction
      transaksi = [...transaksi, { ...newTransaksi, id: Date.now() }];
      
      // Update stock out based on transaction
      updateStokKeluar(newTransaksi.jumlahPembelian);
    }
  }



  
function deleteTransaksi(index) {
    const deletedAmount = transaksi[index].jumlahPembelian;
    transaksi = transaksi.filter((_, i) => i !== index);
    
    // Update stock when a transaction is deleted
    updateStokMasuk(deletedAmount);
}
    
function editTransaksi(index) {
    editingTransaksi = index;
}
 

export const {
  addTransaksi,
  deleteTransaksi,
  deleteTransaksi
}