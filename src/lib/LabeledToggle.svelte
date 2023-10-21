<script>
    export let toggled = true
    export let labelContent = ''

    function toggle(event) {
        return toggled = !toggled
    }
</script>

<div class="flex items-center">
    <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
    <button  on:click={toggle} type="button" class="{toggled ? 'bg-green-700' : 'bg-lgray-750'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-lilith" role="switch" aria-checked="false" aria-labelledby="button-label">
        <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
        <span aria-hidden="true" class="{toggled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-gray-300 shadow transform ring-0 transition ease-in-out duration-200"></span>
    </button>
    <span class="ml-3 -mb-1" id="right-label">
        <span class="text-lg font-medium text-gray-300">{labelContent}</span>
    </span>
</div>
