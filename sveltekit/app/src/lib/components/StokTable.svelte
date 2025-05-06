<script lang="ts">
	import type { Stok } from "$lib/types";

    let {
        data = [] as Stok[], 
        onDelete, 
        onEdit
    } = $props()
    
    
    // Format date to DD/MM/YYYY
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID');
    }
</script>
  
  <div class="overflow-x-auto">
    <h3 class="font-semibold text-lg mb-2">Daftar Stok</h3>
    
    {#if data.length === 0}
      <p class="text-gray-500 italic">Belum ada data stok</p>
    {:else}
      <table class="min-w-full bg-white">
        <thead class="bg-gray-200">
          <tr>
            <th class="py-2 px-4 text-left">Tanggal</th>
            <!-- <th class="py-2 px-4 text-left">Jumlah Minyak (Liter)</th>
            <th class="py-2 px-4 text-left">Sisa Minyak (Liter)</th> -->
            <th class="py-2 px-4 text-left">Stok Masuk (Liter)</th>
            <!-- <th class="py-2 px-4 text-left">Stok Keluar (Liter)</th> -->
            <th class="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#each data as item, index}
            <tr class="border-b">
              <td class="py-2 px-4">{formatDate(item.tanggal)}</td>
              <!-- <td class="py-2 px-4">{item.jumlahMinyak}</td>
              <td class="py-2 px-4">{item.sisaMinyak}</td> -->
              <td class="py-2 px-4">{item.stokMasuk}</td>
              <!-- <td class="py-2 px-4">{item.stokKeluar}</td> -->
              <td class="py-2 px-4">
                <button 
                  class="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onclick={() => onEdit(index)}
                >
                  Edit
                </button>
                <button 
                  class="bg-red-500 text-white px-2 py-1 rounded"
                  onclick={() => onDelete(index)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>