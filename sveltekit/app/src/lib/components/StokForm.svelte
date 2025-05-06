<script lang="ts">
    let {onSubmit, initialData} = $props()
    
    // Form state
    let formData = $state({
      tanggal: '',
      stokMasuk: '',
    });
    
    if (initialData) {
      formData = { ...initialData };
    }
    
    function handleSubmit() {
      // Validate form
      if (!formData.tanggal || 
          formData.stokMasuk === '') {
        alert('Semua kolom harus diisi!');
        return;
      }
      
      // Convert string values to numbers
      const submissionData = {
        ...formData,
        stokMasuk: Number(formData.stokMasuk)
      };
      
      // Submit data to parent
      onSubmit(submissionData);
      
      // Reset form if not editing
      if (!initialData) {
        formData = {
          tanggal: '',
          stokMasuk: '',
        };
      }
    }
  </script>
  
  <div class="bg-gray-100 p-4 rounded-lg mb-6">
    <h3 class="font-semibold text-lg mb-4">{initialData ? 'Edit Data Stok' : 'Tambah Data Stok Baru'}</h3>
    
    <form onsubmit={handleSubmit} class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="mb-2">
        <label class="block text-gray-700 mb-1" for="tanggal">Tanggal</label>
        <input 
          type="date" 
          id="tanggal" 
          class="w-full px-3 py-2 border rounded" 
          bind:value={formData.tanggal}
        />
      </div>
      
      
      <div class="mb-2">
        <label class="block text-gray-700 mb-1" for="stokMasuk">Stok Masuk (Liter)</label>
        <input 
          type="number" 
          id="stokMasuk" 
          class="w-full px-3 py-2 border rounded" 
          placeholder="Stok yang masuk" 
          min="0" 
          bind:value={formData.stokMasuk}
        />
      </div>
      
      <div class="flex items-end mb-2">
        <button 
          type="submit" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {initialData ? 'Update Data Stok' : 'Simpan Data Stok'}
        </button>
      </div>
    </form>
  </div>