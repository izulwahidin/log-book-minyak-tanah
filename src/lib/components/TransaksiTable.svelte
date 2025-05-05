<script lang="ts">
  import type {Transaksi} from "$lib/types";
    let {
        data = [] as Transaksi[], 
        onDelete, 
        onEdit
    } = $props()
    

    // console.log(data)
    
    // Format date to DD/MM/YYYY
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID');
    }
  </script>
  
  <div class="overflow-x-auto">
    <h3 class="font-semibold text-lg mb-2">Daftar Transaksi</h3>
    
    {#if data.length === 0}
      <p class="text-gray-500 italic">Belum ada data Transaksi</p>
    {:else}
      <table class="min-w-full bg-white">
        <thead class="bg-gray-200">
          <tr>
            <th class="py-2 px-4 text-left">Tanggal</th>
            <th class="py-2 px-4 text-left">Nama lengkap</th>
            <th class="py-2 px-4 text-left">NIK</th>
            <th class="py-2 px-4 text-left">Alamat</th>
            <th class="py-2 px-4 text-left">Pembelian (Liter)</th>
            <th class="py-2 px-4 text-left">Foto KTP</th>
            <th class="py-2 px-4 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
            
          {#each data as item, index}
            <tr class="border-b">
              <td class="py-2 px-4">{formatDate(item.tanggal)}</td>
              <td class="py-2 px-4">{item.user.name}</td>
              <td class="py-2 px-4">{item.user.name}</td>
              <td class="py-2 px-4">{item.user.alamat}</td>
              <td class="py-2 px-4">{item.jumlahPembelian}</td>
              <td class="py-2 px-4">{item?.user.ktp_image}</td>
              <td class="py-2 px-4 flex flex-wrap lg:flex-nowrap gap-2">
                <button 
                  class="bg-yellow-500 text-white px-2 py-1 rounded"
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
                {#if item.jumlahPembelian > 20}
                  <button 
                    class="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Generate
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>