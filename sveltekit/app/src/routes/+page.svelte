<script lang="ts">
  import type { Transaksi, Stok, User } from '$lib/types';
  import TransaksiForm from '$lib/components/TransaksiForm.svelte';
  import StokSummary from '$lib/components/StokSummary.svelte';
  import StokForm from '$lib/components/StokForm.svelte';
  import TransaksiTable from '$lib/components/TransaksiTable.svelte';
  import StokTable from '$lib/components/StokTable.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import PageWrapper from '$lib/components/PageWrapper.svelte';
  
  // State for application
  let transaksi: Transaksi[] = $state([]);
  let stok: Stok[] = $state([]);
  let activeTab = $state('transaksi');
  let editingTransaksi = $state<number | null>(null);
  let editingStok = $state<number | null>(null);
  
  // Derived state for calculations
  let latestStokId = $derived(() => stok.length > 0 ? stok[stok.length - 1].id : null);
  let filteredTransaksi = $derived(() => transaksi.filter(t => t.stokID === latestStokId()));
  
  // Calculate totals for current stock batch only
  let totalStokMasuk = $derived(() => stok.reduce((total, item) => total + item.stokMasuk, 0));
  let totalStokKeluar = $derived(() => {
    // Calculate stock out based on transactions for the latest stock ID only
    return filteredTransaksi().reduce((total, t) => total + t.jumlahPembelian, 0);
  });
  let totalMinyak = $derived(() => {
    // Calculate total oil based on the latest stock entry
    return stok.length > 0 ? stok[stok.length - 1].stokMasuk : 0;
  });
  let totalSisaMinyak = $derived(() => totalMinyak() - totalStokKeluar());

  const handleTab = (tabId: string) => activeTab = tabId;
  
  // Handlers for transaksi operations
  function addTransaksi(newTransaksi: Transaksi) {
    if (editingTransaksi !== null) {
      // Update existing transaction
      const actualIndex = transaksi.findIndex((t, idx) => idx === editingTransaksi);
      if (actualIndex !== -1) {
        transaksi = transaksi.map((t, idx) => 
          idx === actualIndex ? { ...newTransaksi, stokID: latestStokId() } : t
        );
      }
      editingTransaksi = null;
    } else {
      // Add new transaction with the latest stock ID
      if (latestStokId) {
        transaksi = [...transaksi, { 
          ...newTransaksi, 
          id: Date.now(), 
          stokID: latestStokId()
        }];
      } else {
        console.error("Cannot add transaction: No stock available");
      }
    }
  }
  
  function deleteTransaksi(index: number) {
    // Get actual index in the full transaksi array based on filtered view
    const actualIndex = transaksi.findIndex(t => t.id === filteredTransaksi[index].id);
    if (actualIndex !== -1) {
      transaksi = transaksi.filter((_, i) => i !== actualIndex);
    }
  }
  
  function editTransaksi(index: number) {
    // Get actual index in the full transaksi array based on filtered view
    const actualIndex = transaksi.findIndex(t => t.id === filteredTransaksi()[index].id);
    if (actualIndex !== -1) {
      editingTransaksi = actualIndex;
    }
  }
  
  // Handlers for stok operations
  function addStok(newStok: Stok) {
    if (editingStok !== null) {
      // Update existing stock entry
      stok = stok.map((s, index) => 
        index === editingStok ? newStok : s
      );
      editingStok = null;
    } else {
      // Add new stock entry with a new ID
      const newStockId = Date.now();
      stok = [...stok, { ...newStok, id: newStockId }];
      
      // Reset transactions for the new stock ID
      // (We keep old transactions in history but they're filtered out in the UI)
    }
  }
  
  function deleteStok(index: number) {
    stok = stok.filter((_, i) => i !== index);
  }
  
  function editStok(index: number) {
    editingStok = index;
  }
  
  // Initialize with sample data
  function loadSampleData() {
    // Create sample stock entries first
    stok = [
      {
        id: 1,
        tanggal: '2025-03-25',
        stokMasuk: 5000,
      },
      {
        id: 3,
        tanggal: '2025-04-25',
        stokMasuk: 5000,
      },
      {
        id: 2,
        tanggal: '2025-04-25',
        stokMasuk: 5000,
      }
    ];
    
    const sampleUser: User = {
      name: 'Budi Santoso',
      alamat: 'Jl. Kebon Jeruk No. 15, Jakarta',
      nik: '3173012505800001',
      ktp_image: '/3173012505800001.jpg',
    };
    
    // Create sample transactions associated with the latest stock ID (2)
    transaksi = [
      {
        id: 1,
        tanggal: '2025-04-25',
        user: sampleUser,
        jumlahPembelian: 5,
        generatedFrom: null,
        stokID: 2  // Latest stock ID
      },
      {
        id: 2,
        tanggal: '2025-04-25',
        user: sampleUser,
        jumlahPembelian: 1,
        generatedFrom: null,
        stokID: 2  // Latest stock ID
      },
      {
        id: 3,
        tanggal: '2025-04-25',
        user: sampleUser,
        jumlahPembelian: 2,
        generatedFrom: null,
        stokID: 2  // Latest stock ID
      },
      {
        id: 4,
        tanggal: '2025-04-25',
        user: sampleUser,
        jumlahPembelian: 24,
        generatedFrom: null,
        stokID: 1  // Previous stock ID (should be filtered out in UI)
      },
      {
        id: 5,
        tanggal: '2025-04-25',
        user: sampleUser,
        jumlahPembelian: 2,
        generatedFrom: null,
        stokID: 1  // Previous stock ID (should be filtered out in UI)
      },
    ];
  }
  
  // Load sample data on init
  loadSampleData();
</script>

<svelte:head>
  <title>{activeTab[0].toUpperCase() + activeTab.slice(1)} - Manajemen Distribusi Minyak Tanah</title>
</svelte:head>

<main>
  <Navbar {handleTab} {activeTab} />
  
  <div class="container mx-auto p-4">
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-center mb-2">Sistem Manajemen Penjualan Minyak Tanah</h1>
      
      <!-- Stock Summary -->
      <StokSummary
        stokID ={latestStokId()}
        totalMinyak={totalMinyak()}
        totalSisaMinyak={totalSisaMinyak()}
        totalStokMasuk={totalStokMasuk()}
        totalStokKeluar={totalStokKeluar()}
      />
      
      {#if activeTab === 'transaksi'}
        <!-- Transaksi Section -->
        <PageWrapper title="Data Transaksi Penjualan (Stok ID: {latestStokId() || 'None'})">
          {#if latestStokId()}
            <TransaksiForm 
              onSubmit={addTransaksi} 
              initialData={editingTransaksi !== null ? transaksi[editingTransaksi] : null} 
            />
            
            <TransaksiTable 
              data={filteredTransaksi()} 
              onDelete={deleteTransaksi} 
              onEdit={editTransaksi} 
            />
          {:else}
            <div class="bg-yellow-100 p-4 rounded-md my-4">
              <p class="text-yellow-800">Tidak ada stok tersedia. Silakan tambahkan stok terlebih dahulu.</p>
            </div>
          {/if}
        </PageWrapper>
      {:else if activeTab === 'stok'}
        <PageWrapper title="Data Stok Minyak Tanah">
          <StokForm 
            onSubmit={addStok} 
            initialData={editingStok !== null ? stok[editingStok] : null} 
          />
          
          <StokTable 
            data={stok} 
            onDelete={deleteStok} 
            onEdit={editStok} 
          />
        </PageWrapper>
      {/if}
    </div>
  </div>
</main>

<style>
  :global(body) {
    font-family: 'Inter', sans-serif;
    background-color: #f9fafb;
  }
</style>