<script lang="ts">
  let {handleTab,activeTab} = $props()
  

    const tabs = [
      { id: 'transaksi', label: 'Transaksi Penjualan' },
      { id: 'stok', label: 'Stok Minyak' }
    ];
    </script>
  
  <nav class="bg-blue-600 text-white shadow-lg mb-6">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row">
        <div class="py-4 px-6 font-bold text-xl">
          Sistem Penjualan Minyak Tanah
        </div>
        <div class="flex flex-grow">
          {#each tabs as tab}
            <button 
              class="px-4 py-4 hover:bg-blue-700 {activeTab === tab.id ? 'bg-blue-700 font-semibold' : ''}"
              onclick={() => handleTab(tab.id)}
            >
              {tab.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </nav>