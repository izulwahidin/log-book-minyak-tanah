<script lang="ts">
	import type { Transaksi, Stok, User } from '$lib/types';
	import TransaksiForm from '$lib/components/TransaksiForm.svelte';
	import StokSummary from '$lib/components/StokSummary.svelte';
	import StokForm from '$lib/components/StokForm.svelte';
	import TransaksiTable from '$lib/components/TransaksiTable.svelte';
	import StokTable from '$lib/components/StokTable.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import PageWrapper from '$lib/components/PageWrapper.svelte';
	import { onMount } from 'svelte';
	import {
		pb,
		pbStokToAppStok,
		pbTransaksiToAppTransaksi,
		appStokToPbStok,
		appTransaksiToPbTransaksi,
		type StokRecord,
		type TransaksiRecord
	} from '$lib/pocketbase';
	import type { RecordModel } from 'pocketbase';

	// State for application
	let transaksi: Transaksi[] = $state([]);
	let stok: Stok[] = $state([]);
	let activeTab = $state('transaksi');
	let editingTransaksi = $state<string | null>(null);
	let editingStok = $state<string | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	// Derived state for calculations
	let latestStok = $derived(() => (stok.length > 0 ? stok[stok.length - 1] : null));
	let latestStokId = $derived(() => latestStok()?.id || null);
	let filteredTransaksi = $derived(() => transaksi.filter((t) => t.stokID === latestStokId()));

	// Calculate totals for current stock batch only
	let totalStok_masuk = $derived(() => stok.reduce((total, item) => total + item.stokMasuk, 0));
	let totalStokKeluar = $derived(() => {
		// Calculate stock out based on transactions for the latest stock ID only
		return filteredTransaksi().reduce((total, t) => total + t.jumlahPembelian, 0);
	});
	let totalMinyak = $derived(() => {
		// Calculate total oil based on the latest stock entry
		return latestStok()?.stokMasuk || 0;
	});
	let totalSisaMinyak = $derived(() => totalMinyak() - totalStokKeluar());

	const handleTab = (tabId: string) => (activeTab = tabId);

	// Load data from PocketBase
	async function loadData() {
		try {
			isLoading = true;
			error = null;

			// Load stock entries sorted by date
			const stokData = await pb.collection('stok').getFullList({
				sort: 'created'
			});

			console.log(stokData);

			stok = stokData.map((record) => pbStokToAppStok(record as unknown as StokRecord));

			// Load transactions with expanded user data
			const transaksiData = await pb.collection('transaksi').getFullList({
				sort: 'created',
				expand: 'costumer,generated_from'
			});

			console.log(transaksiData);
			transaksi = transaksiData.map((record) =>
				pbTransaksiToAppTransaksi(record as unknown as TransaksiRecord)
			);
		} catch (err) {
			console.error('Error loading data:', err);
			error = err.message || 'Failed to load data';
		} finally {
			isLoading = false;
		}
	}

	// Handlers for transaksi operations
	async function addTransaksi(newTransaksi: Transaksi) {
		try {
			if (!latestStokId()) {
				throw new Error('Cannot add transaction: No stock available');
			}

			const transactionData = appTransaksiToPbTransaksi({
				...newTransaksi,
				stokID: latestStokId()
			});

			if (editingTransaksi !== null) {
				// Update existing transaction
				await pb.collection('transaksi').update(editingTransaksi, transactionData);
				editingTransaksi = null;
			} else {
				// Add new transaction
				await pb.collection('transaksi').create(transactionData);
			}

			// Reload data to get latest state
			await loadData();
		} catch (err) {
			console.error('Error saving transaction:', err);
			error = err.message || 'Failed to save transaction';
		}
	}

	async function deleteTransaksi(index: number) {
		try {
			const transaksiToDelete = filteredTransaksi()[index];
			if (!transaksiToDelete?.id) return;

			await pb.collection('transaksi').delete(transaksiToDelete.id);

			// Reload data
			await loadData();
		} catch (err) {
			console.error('Error deleting transaction:', err);
			error = err.message || 'Failed to delete transaction';
		}
	}

	function editTransaksi(index: number) {
		const transaksiToEdit = filteredTransaksi()[index];
		if (transaksiToEdit?.id) {
			editingTransaksi = transaksiToEdit.id;
		}
	}

	// Handlers for stok operations
	async function addStok(newStok: Stok) {
		try {
			const stokData = appStokToPbStok(newStok);

			if (editingStok !== null) {
				// Update existing stock entry
				await pb.collection('stok').update(editingStok, stokData);
				editingStok = null;
			} else {
				// Add new stock entry
				await pb.collection('stok').create(stokData);
			}

			// Reload data
			await loadData();
		} catch (err) {
			console.error('Error saving stock:', err);
			error = err.message || 'Failed to save stock';
		}
	}

	async function deleteStok(index: number) {
		try {
			if (!stok[index]?.id) return;

			await pb.collection('stok').delete(stok[index].id);

			// Reload data
			await loadData();
		} catch (err) {
			console.error('Error deleting stock:', err);
			error = err.message || 'Failed to delete stock';
		}
	}

	function editStok(index: number) {
		if (stok[index]?.id) {
			editingStok = stok[index].id;
		}
	}

	// Initialize with sample data if needed
	async function loadSampleData() {
		try {
			isLoading = true;
			error = null;

			// First check if data already exists
			const existingStok = await pb.collection('stok').getFullList({
				sort: '-created',
				limit: 1
			});

			if (existingStok.length > 0) {
				console.log('Data already exists, skipping sample data load');
				return;
			}

			// Create sample user first
			const userData = {
				name: 'Budi Santoso',
				alamat: 'Jl. Kebon Jeruk No. 15, Jakarta',
				nik: '3173012505800001',
				ktp_image: '' // This would typically be a file upload
			};

			const user = await pb.collection('users').create(userData);

			// Create sample stock entries
			const stok1 = await pb.collection('stok').create({
				tanggal: '2025-03-25',
				stok_masuk: 5000
			});

			const stok2 = await pb.collection('stok').create({
				tanggal: '2025-04-25',
				stok_masuk: 5000
			});

			const stok3 = await pb.collection('stok').create({
				tanggal: '2025-04-25',
				stok_masuk: 5000
			});

			// Create sample transactions
			await pb.collection('transaksi').create({
				user: user.id,
				tanggal: '2025-04-25',
				jumlahPembelian: 5,
				generatedFrom: null,
				stokID: stok3.id
			});

			await pb.collection('transaksi').create({
				user: user.id,
				tanggal: '2025-04-25',
				jumlahPembelian: 1,
				generatedFrom: null,
				stokID: stok3.id
			});

			await pb.collection('transaksi').create({
				user: user.id,
				tanggal: '2025-04-25',
				jumlahPembelian: 2,
				generatedFrom: null,
				stokID: stok3.id
			});

			await pb.collection('transaksi').create({
				user: user.id,
				tanggal: '2025-04-25',
				jumlahPembelian: 24,
				generatedFrom: null,
				stokID: stok1.id
			});

			await pb.collection('transaksi').create({
				user: user.id,
				tanggal: '2025-04-25',
				jumlahPembelian: 2,
				generatedFrom: null,
				stokID: stok1.id
			});

			console.log('Sample data loaded successfully');

			// Load the data we just created
			await loadData();
		} catch (err) {
			console.error('Error loading sample data:', err);
			error = err.message || 'Failed to load sample data';
		} finally {
			isLoading = false;
		}
	}

	// Initial data load
	onMount(async () => {
		await loadData();

		// If no data, load sample data
		if (stok.length === 0) {
			await loadSampleData();
		}
	});
</script>

<svelte:head>
	<title
		>{activeTab[0].toUpperCase() + activeTab.slice(1)} - Manajemen Distribusi Minyak Tanah</title
	>
</svelte:head>

<main>
	<Navbar {handleTab} {activeTab} />

	<div class="container mx-auto p-4">
		<div class="mb-4">
			<h1 class="text-3xl font-bold text-center mb-2">Sistem Manajemen Penjualan Minyak Tanah</h1>

			{#if isLoading}
				<div class="flex justify-center items-center p-8">
					<div
						class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
					></div>
				</div>
			{/if}

			{#if error}
				<div class="bg-red-100 p-4 rounded-md my-4">
					<p class="text-red-800">{error}</p>
				</div>
			{/if}

			<!-- Stock Summary -->
			<StokSummary
				totalMinyak={totalMinyak()}
				totalSisaMinyak={totalSisaMinyak()}
				totalStokMasuk={totalStok_masuk()}
				totalStokKeluar={totalStokKeluar()}
			/>

			{#if activeTab === 'transaksi'}
				<!-- Transaksi Section -->
				<PageWrapper title="Data Transaksi Penjualan">
					{#if latestStokId}
						<TransaksiForm
							onSubmit={addTransaksi}
							initialData={editingTransaksi !== null
								? transaksi.find((t) => t.id === editingTransaksi) || null
								: null}
						/>

						<TransaksiTable
							data={filteredTransaksi()}
							onDelete={deleteTransaksi}
							onEdit={editTransaksi}
						/>
					{:else}
						<div class="bg-yellow-100 p-4 rounded-md my-4">
							<p class="text-yellow-800">
								Tidak ada stok tersedia. Silakan tambahkan stok terlebih dahulu.
							</p>
						</div>
					{/if}
				</PageWrapper>
			{:else if activeTab === 'stok'}
				<PageWrapper title="Data Stok Minyak Tanah">
					<StokForm
						onSubmit={addStok}
						initialData={editingStok !== null
							? stok.find((s) => s.id === editingStok) || null
							: null}
					/>

					<StokTable data={stok} onDelete={deleteStok} onEdit={editStok} />
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
