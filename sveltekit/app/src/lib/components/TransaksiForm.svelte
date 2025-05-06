<script lang="ts">
	import type { Transaksi } from "$lib/types";

    let {
      onSubmit, 
      initialData = null as Transaksi | null
    } = $props();
    
    // Form state
    let formData: Transaksi = $state({
      tanggal: '',
      user: {
        name: '',
        alamat: '',
        nik: '',
        ktp_image: ''
      },
      jumlahPembelian: 0,
      stokID: 0,
      generatedFrom: null
    });
    
    // Initialize form with initial data if provided
    if (initialData) {
      formData = { ...initialData };
    }
    
    function handleSubmit(e: Event) {
      e.preventDefault(); // Prevent default form submission
      
      // Validate form
      if (!formData.tanggal || !formData.user.name || !formData.user.alamat || 
          !formData.user.nik || !formData.jumlahPembelian) {
        alert('Semua kolom harus diisi!');
        return;
      }
      
      // Convert jumlahPembelian to number if it's a string
      const submissionData = {
        ...formData,
        jumlahPembelian: typeof formData.jumlahPembelian === 'string' 
          ? Number(formData.jumlahPembelian) 
          : formData.jumlahPembelian
      };
      
      // Submit data to parent
      onSubmit(submissionData);
      
      // Reset form if not editing
      if (!initialData) {
        formData = {
          tanggal: '',
          user: {
            name: '',
            alamat: '',
            nik: '',
            ktp_image: ''
          },
          jumlahPembelian: 0,
          stokID: 0,
          generatedFrom: null
        };
      }
    }
  </script>
  
  <div class="bg-gray-100 p-4 rounded-lg mb-6">
    <h3 class="font-semibold text-lg mb-4">{initialData ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}</h3>
    
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
        <label class="block text-gray-700 mb-1" for="nama">Nama Pembeli</label>
        <input 
          type="text" 
          id="nama" 
          class="w-full px-3 py-2 border rounded" 
          placeholder="Nama lengkap pembeli" 
          bind:value={formData.user.name}
        />
      </div>
      
      <div class="mb-2">
        <label class="block text-gray-700 mb-1" for="alamat">Alamat</label>
        <input 
          type="text" 
          id="alamat" 
          class="w-full px-3 py-2 border rounded" 
          placeholder="Alamat lengkap" 
          bind:value={formData.user.alamat}
        />
      </div>
      
      <div class="mb-2">
        <label class="block text-gray-700 mb-1" for="nik">NIK</label>
        <input 
          type="text" 
          id="nik" 
          class="w-full px-3 py-2 border rounded" 
          placeholder="Nomor Induk Kependudukan" 
          bind:value={formData.user.nik}
        />
      </div>
      
      <div class="mb-2">
        <label class="block text-gray-700 mb-1" for="jumlahPembelian">Jumlah Pembelian (Liter)</label>
        <input 
          type="number" 
          id="jumlahPembelian" 
          class="w-full px-3 py-2 border rounded" 
          placeholder="Jumlah dalam liter" 
          min="1" 
          bind:value={formData.jumlahPembelian}
        />
      </div>
      
      <div class="flex items-end mb-2">
        <button 
          type="submit" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {initialData ? 'Update Transaksi' : 'Simpan Transaksi'}
        </button>
      </div>
    </form>
  </div>