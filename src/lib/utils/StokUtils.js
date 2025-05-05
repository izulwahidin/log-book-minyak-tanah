    // Handlers for stok operations
    function addStok(newStok) {
      if (editingStok !== null) {
          // Update existing stock entry
          stok = stok.map((s, index) => 
          index === editingStok ? newStok : s
          );
          editingStok = null;
      } else {
          // Add new stock entry
          stok = [...stok, { ...newStok, id: Date.now() }];
      }
    }
      
    function deleteStok(index) {
      stok = stok.filter((_, i) => i !== index);
    }
    
    function editStok(index) {
      editingStok = index;
    }
    

function updateStokMasuk(amount: number) {
  if (stok.length === 0) {
    // Create a new stock record if none exists
    const newStokRecord = {
      id: Date.now(),
      tanggal: new Date().toISOString().slice(0, 10),
      jumlahMinyak: amount,
      sisaMinyak: amount,
      stokMasuk: amount,
      stokKeluar: 0
    };
    stok = [newStokRecord];
  } else {
    // Update the latest stock record
    const latestIndex = stok.length - 1;
    const updatedStok = [...stok];
    updatedStok[latestIndex] = {
      ...updatedStok[latestIndex],
      stokMasuk: updatedStok[latestIndex].stokMasuk + amount,
      sisaMinyak: updatedStok[latestIndex].sisaMinyak + amount
    };
    stok = updatedStok;
  }
}

  function updateStokKeluar(amount) {
    if (stok.length === 0) {
      // Create a new stock record if none exists
      const newStokRecord = {
        id: Date.now(),
        tanggal: new Date().toISOString().slice(0, 10),
        jumlahMinyak: 0,
        sisaMinyak: 0,
        stokMasuk: 0,
        stokKeluar: amount
      };
      stok = [newStokRecord];
    } else {
      // Update the latest stock record
      const latestIndex = stok.length - 1;
      const updatedStok = [...stok];
      updatedStok[latestIndex] = {
        ...updatedStok[latestIndex],
        stokKeluar: updatedStok[latestIndex].stokKeluar + amount,
        sisaMinyak: updatedStok[latestIndex].sisaMinyak - amount
      };
      stok = updatedStok;
    }
  }