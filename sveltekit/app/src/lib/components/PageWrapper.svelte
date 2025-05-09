<script lang="ts">
	let { title } = $props();
</script>

<div class="bg-white p-6 rounded-lg shadow">
	<h2 class="text-2xl font-bold mb-4">{title}</h2>
	<slot />
</div>
