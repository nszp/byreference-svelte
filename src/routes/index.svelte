<script lang="ts">
    import { fly } from 'svelte/transition'
    import { onMount } from 'svelte';
    // @ts-ignore
    import Transition from 'svelte-class-transition'
    import { content, currentVerse, currentVerses, totalCurrentVerses } from './store'
    import { parseChapters, nextVerse, resetVerses, missVerse } from './logic'

    let showBanner = false

    let disabled = false
    let showWords = false
    let resetConfirm = false

    $: showDialog = showWords || resetConfirm

    function normalReset() {
        console.log(($totalCurrentVerses.length - $currentVerses.length) / $totalCurrentVerses.length)
        if (($totalCurrentVerses.length - $currentVerses.length) / $totalCurrentVerses.length >= 0.05) {
            resetConfirm = true
        } else resetVerses()
    }


    $: parseChapters($content)

    function getCurrentVerseContent(): string {
        return 'This feature is not currently available'
        // try {
        //     return NIV[$currentVerse.substr(0, $currentVerse.indexOf(' '))][$currentVerse.substring($currentVerse.indexOf(' ')+1, $currentVerse.indexOf(':'))][$currentVerse.substr($currentVerse.indexOf(':')+1)]
        // } catch(e) {
        //     return 'No Verse Selected'
        // }
    }

    onMount(() => {
        showBanner = window.location.href.includes('vercel') || window.location.href.includes('localhost')
    });

</script>

{#if showBanner}
    <div class="text-center absolute text-gray-200 ml-auto mr-auto" style="left:0; right: 0; top: 300px;">
        <span class="lg:text-8xl md:text-7xl text-6xl">By Reference has moved to <a href="https://byreference.xyz" class="text-purple-400 font-light underline">byreference.xyz</a></span>
    </div>
{/if}
<div class="grid place-items-center h-screen">

    <div class="bg-lgray-700 overflow-hidden shadow rounded-lg divide-y divide-gray-500 text-gray-200 shadow-lg w-full md:w-2/3">
        <div class="px-4 py-5 sm:px-6 text-xl flex flex-wrap justify-center text-center max-h-[5%]">

            <span class="lg:text-7xl md:text-6xl text-5xl w-full grid cursor-pointer select-none"
                  on:click={() => showWords = true}>{#key $currentVerse}<span
                    in:fly="{{ y: -20, duration: 500 }}" out:fly="{{ x: 1, duration: 1 }}"
                    style="grid-column: 1/2; grid-row:1/2;">{$currentVerse}</span>{/key}</span>
            {#key currentVerses}
                <span class="-mt-5 text-xl text-gray-300">
                    {$totalCurrentVerses.length - $currentVerses.length}/{$totalCurrentVerses.length}
                </span>{/key}

        </div>
        <div class="px-4 py-5 sm:p-6 flex justify-center">
            <button type="button"
                    on:click={nextVerse}
                    class="btn inline-flex w-1/3 items-center justify-center px-2 py-1 border border-transparent shadow-sm text-xl transition-colors font-medium rounded-md text-white bg-purple-500 hover:bg-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400">
                <span class="-mb-1">Next Verse</span>
                <!-- Heroicon name: outline/arrow-right -->
                <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
            </button>
            <button type="button"
                    on:click={missVerse}
                    class="btn inline-flex w-1/3 ml-2 items-center justify-center px-2 py-1 border border-transparent shadow-sm text-xl transition-colors font-medium rounded-md text-white bg-purple-600 hover:bg-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400">
                <!-- Heroicon name: outline/x-circle -->
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="-mb-1">Miss</span>
            </button>
            <button type="button"
                    class="btn inline-flex w-1/3 ml-2 items-center justify-center px-2 py-1 border border-transparent shadow-sm text-xl transition-colors font-medium rounded-md text-white bg-lgray-800 hover:bg-lgray-750 focus:outline-none focus:ring-1 focus:ring-lgray-800"
                    on:click={normalReset}
            >
                <!-- Heroicon name: outline/refresh -->
                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span class="-mb-1">Reset</span>
            </button>
        </div>
        <div class="px-4 py-4 sm:px-6">
            <div class="-mt-2">
                <label for="content" class="block text-xl font-medium">Content <a href="/help"
                                                                                  class="text-purple-400 underline font-light">Help</a></label>
                <div class="mt-1 relative rounded-md shadow-sm">
                    <input type="text" name="content" id="content"
                           class="{disabled ? 'text-gray-400' : 'text-white'} shadow-sm bg-lgray-750 focus:ring-purple-300 focus:border-purple-400 text-md w-full border-gray-600 rounded-md transition-colors"
                           placeholder="A 1-28"
                           {disabled}
                           bind:value={$content}>
                    <div class="{disabled ? 'text-red-400' : ''} absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors">
                        <!-- Heroicon name: solid/lock-closed and solid/lock-open -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
                             id="lockIcon" on:click={() => disabled = !disabled}>
                            {#if disabled}
                                <path fill-rule="evenodd"
                                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                      clip-rule="evenodd"/>
                            {:else}
                                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"/>
                            {/if}
                        </svg>
                    </div>
                </div>
            </div>
            <span class="mt-2 -mb-1 text-xl text-center w-full block">Made by <b>Nathaniel Szpunar</b> <a
                    href="/changelog"
                    class="text-purple-400 font-light underline">Changelog</a></span>
        </div>
    </div>
</div>

{#if showDialog}
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!--
              Background overlay, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100"
                To: "opacity-0"
            -->
            <Transition
                    toggle={showDialog}
                    inTransition="ease-out duration-300"
                    inState="opacity-0"
                    onState="opacity-100"
                    outState="opacity-0"
                    outTransition="ease-in duration-200"
            >
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            </Transition>


            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <Transition
                    toggle={showDialog}
                    inTransition="ease-out duration-300"
                    inState="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    onState="opacity-100 translate-y-0 sm:scale-100"
                    outState="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    outTransition="ease-in duration-200"
            >

                {#if showWords}
                    <div class="inline-block align-bottom bg-lgray-700 rounded-lg px-4 pt-5 pb-4 text-left text-gray-200 overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                        <div class="block absolute top-0 right-0 pt-4 pr-4">
                            <button type="button"
                                    class="bg-lgray-750 rounded-md text-gray-200 hover:text-gray-400 transition-colors"
                                    on:click={() => showWords = false}>
                                <span class="sr-only">Close</span>
                                <!-- Heroicon name: outline/x -->
                                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div class="sm:flex sm:items-start">
                            <!--                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">-->
                            <!--                    &lt;!&ndash; Heroicon name: outline/exclamation &ndash;&gt;-->
                            <!--                    <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">-->
                            <!--                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />-->
                            <!--                    </svg>-->
                            <!--                </div>-->
                            <div class="text-center">
                                <h1 class="text-3xl text-gray-300">{$currentVerse}</h1>
                                <p class="text-md">
                                    {@html getCurrentVerseContent()}
                                </p>
                            </div>
                        </div>
                    </div>
                {:else if resetConfirm}
                    <div class="inline-block align-bottom bg-lgray-700 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                        <div>
                            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <!-- Heroicon name: outline/exclamation-circle -->
                                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-5">
                                <h3 class="text-3xl leading-6 font-medium text-gray-300" id="modal-title">
                                    Are you sure you want to reset?
                                </h3>
                                <div class="mt-2">
                                    <p class="text-lg text-gray-200">
                                        You've completed more than 5% of your selected verses.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                            <button type="button" on:click={() => {resetVerses(); resetConfirm = false}} class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-1 bg-purple-600 text-xl font-medium text-white hover:bg-purple-400 transition-colors sm:col-start-2">
                                Reset
                            </button>
                            <button type="button" on:click={() => resetConfirm = false} class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-1 bg-lgray-800 text-xl font-medium text-white hover:bg-lgray-750 transition-colors sm:mt-0 sm:col-start-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                {/if}

            </Transition>
        </div>
    </div>
{/if}

<!--                                     <b>30</b> Just as you who were at one time disobedient to God have now received mercy as a result of their disobedience, <b>31</b> so they too have now become disobedient in order that they too may now receive mercy as a result of God’s mercy to you. <b>32</b> For God has bound everyone over to disobedience so that he may have mercy on them all.
-->

<style>
    .btn {

    }

    .btn:active:focus {
        animation: button-pop 0.25s ease-out;
    }

    #lockIcon:active {
        animation: icon-pop 0.25s ease-out;

    }

    @keyframes button-pop {
        0% {
            transform: scale(0.95);
        }
        40% {
            transform: scale(1.02);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes icon-pop {
        0% {
            transform: scale(0.90);
        }
        40% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
