
<script lang="ts">
    let {totalMinyak,totalSisaMinyak,totalStokMasuk,totalStokKeluar, stokID} = $props()
    // export let totalMinyak: number;
    // export let totalSisaMinyak: number;
    // export let totalStokMasuk: number;
    // export let totalStokKeluar: number;
  </script>
  
  <div class="bg-gray-100 p-4 rounded-lg shadow mb-4">
    <h2 class="text-xl font-semibold mb-2">Ringkasan Stok Distribusi ke {stokID}</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white p-3 rounded shadow">
        <p class="text-gray-500">Distribusi Masuk</p>
        <p class="text-2xl font-bold">{totalMinyak} Liter</p>
      </div>
      <div class="bg-white p-3 rounded shadow">
        <p class="text-gray-500">Minyak Ready</p>
        <p class="text-2xl font-bold">{totalSisaMinyak} Liter</p>
      </div>
      <div class="bg-white p-3 rounded shadow">
        <p class="text-gray-500">Minyak Keluar</p>
        <p class="text-2xl font-bold">{totalStokKeluar} Liter</p>
      </div>
      <div class="bg-white p-3 rounded shadow">
        <p class="text-gray-500">Total Minyak Selama Ini</p>
        <p class="text-2xl font-bold">{totalStokMasuk} Liter</p>
      </div>
    </div>
  </div>
  