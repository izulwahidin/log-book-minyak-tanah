<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { pb } from '$lib/pocketbase';

	export let label: string = 'Upload File';
	export let accept: string = 'image/*'; // Default to images
	export let currentFile: string = '';
	export let required: boolean = false;

	const dispatch = createEventDispatcher();

	let fileInput: HTMLInputElement;
	let previewUrl = '';
	let isUploading = false;
	let error = '';

	$: if (currentFile) {
		// If the file is already a full URL, use it directly
		if (currentFile.startsWith('http')) {
			previewUrl = currentFile;
		}
		// Otherwise, if it's just a filename, assume it's from PocketBase
		else if (currentFile) {
			// We don't have the necessary info to construct the URL here,
			// but will handle this when a record is saved/loaded
			previewUrl = '';
		}
	} else {
		previewUrl = '';
	}

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;

		if (!files || files.length === 0) {
			return;
		}

		const file = files[0];
		error = '';

		try {
			isUploading = true;

			// Create a temporary local preview URL
			previewUrl = URL.createObjectURL(file);

			// Dispatch the file to the parent component
			// The actual upload will happen when the record is saved
			dispatch('fileselected', {
				file,
				name: file.name
			});
		} catch (err) {
			console.error('Error handling file:', err);
			error = err.message || 'Failed to process file';
			previewUrl = '';
		} finally {
			isUploading = false;
		}
	}

	function clearFile() {
		if (fileInput) {
			fileInput.value = '';
		}
		previewUrl = '';
		dispatch('fileselected', { file: null, name: '' });
	}
</script>

<div class="file-upload">
	<label>
		{label}
		{#if required}
			<span class="required">*</span>
		{/if}
	</label>

	<div class="upload-control">
		<input
			bind:this={fileInput}
			type="file"
			{accept}
			on:change={handleFileChange}
			class="file-input"
			{required}
		/>

		{#if isUploading}
			<div class="spinner">Loading...</div>
		{/if}
	</div>

	{#if previewUrl}
		<div class="preview">
			<img src={previewUrl} alt="Preview" class="preview-image" />
			<button type="button" class="clear-button" on:click={clearFile}> Clear </button>
		</div>
	{/if}

	{#if error}
		<div class="error">{error}</div>
	{/if}
</div>

<style>
	.file-upload {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
	}

	.required {
		color: red;
	}

	.upload-control {
		position: relative;
	}

	.file-input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 100%;
	}

	.preview {
		margin-top: 0.5rem;
		display: flex;
		align-items: center;
	}

	.preview-image {
		max-width: 100px;
		max-height: 100px;
		border: 1px solid #ddd;
		border-radius: 4px;
		margin-right: 1rem;
	}

	.clear-button {
		background-color: #f44336;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.25rem 0.5rem;
		cursor: pointer;
	}

	.error {
		color: red;
		margin-top: 0.25rem;
		font-size: 0.875rem;
	}

	.spinner {
		margin-top: 0.5rem;
		color: #666;
	}
</style>
