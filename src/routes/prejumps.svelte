<script lang="ts">
    import Code from '../lib/Code.svelte'
    import { onMount } from 'svelte'
    import { getChapter, getVerse, getBook, unique, double, triple, allUnique, allDouble, allTriple } from './content'

    let tab: string = 'Keywords'

    let currentPrompt: string = 'Spain'
    let fullPrompt: string = 'As it is written'

    let selectedReference: number = 0
    let cursorPlacement: number = 1

    let showAnswer: boolean = true

    let references: string[] = [
        'Romans 15:12',
        'James 1:2'
    ]

    let answers: string[][] = [['Romans', '15', '12'], ['', '', '']]

    let answerReferences: string[] = []

    $: {
        answerReferences = []
        answers.forEach(answer => {
            if (answer[0] !== '' && answer[1] !== '' && answer[2] !== '') answerReferences = [...answerReferences, `${answer[0]} ${answer[1]}:${answer[2]}`]
        })
        console.log(answerReferences)
    }

    function selectWord() {
        const maxRandom = (unique.size + double.size + triple.size) - 3
        const random = Math.floor(Math.random() * maxRandom);
        if (random < 919) {
            currentPrompt = allUnique[random]
            fullPrompt = allUnique[random]
            references = [unique.get(currentPrompt)]
        } else if (random < 1193) {
            currentPrompt = allDouble[random - unique.size]
            fullPrompt = allDouble[random - unique.size]
            references = double.get(currentPrompt)
        } else {
            currentPrompt = allTriple[random - unique.size - double.size]
            fullPrompt = allTriple[random - unique.size - double.size]
            references = triple.get(currentPrompt)
        }

        answers = []
        references.forEach(r => {
            answers = [...answers, ['','','']]
        })

        selectedReference = 0
        cursorPlacement = 1
        showAnswer = false
    }

    onMount(() => {
        const digits: string[] = ['1','2','3','4','5','6','7','8','9']
        document.addEventListener('keydown', ev => {
            ev.preventDefault()
            if (ev.key === 'Enter') {
                if (showAnswer) {
                    selectWord()
                } else {
                    showAnswer = true
                }
            }
            if (ev.key !== 'Enter' && showAnswer) return

            if (ev.key.toLowerCase() === 'r' && cursorPlacement !== 2) {
                if (cursorPlacement === 3) {
                    selectedReference++
                }
                const newAnswers = [...answers]
                newAnswers[selectedReference][0] = 'Romans'
                answers = newAnswers
                cursorPlacement = 2
            } else if (ev.key.toLowerCase() === 'j' && cursorPlacement !== 2) {
                if (cursorPlacement === 3) {
                    selectedReference++
                }
                const newAnswers = [...answers]
                newAnswers[selectedReference][0] = 'James'
                answers = newAnswers
                cursorPlacement = 2
            } else if (ev.key === ':') {
                if (cursorPlacement === 2) {
                    cursorPlacement = 3
                }
            } else if (digits.indexOf(ev.key) !== -1 && cursorPlacement !== 1) {

                if (answers[selectedReference][cursorPlacement - 1].length >= (answers[selectedReference][0] === 'James' ? 1 : 2)) {
                    if (cursorPlacement !== 2) return
                    cursorPlacement = 3
                }
                const newAnswers = [...answers]
                newAnswers[selectedReference][cursorPlacement - 1] += ev.key
                answers = newAnswers
            } else if (ev.key === 'ArrowDown') {
                if (selectedReference === references.length-1) {
                    selectedReference = 0
                } else {
                    selectedReference++
                }
                cursorPlacement = 1


            } else if (ev.key === 'ArrowRight' || ev.key === 'Tab') {
                if (cursorPlacement === 3) {
                    cursorPlacement = 1
                    if (selectedReference === references.length-1) {
                        selectedReference = 0
                    } else {
                        selectedReference++
                    }
                } else {
                    cursorPlacement++
                }
            } else if (ev.key === 'ArrowLeft') {
                if (cursorPlacement === 1) {
                    cursorPlacement = 3
                    if (selectedReference === 0) {
                        selectedReference = references.length - 1
                    } else {
                        selectedReference--
                    }
                } else {
                    cursorPlacement--
                }
            } else if (ev.key === 'Backspace') {
                if (cursorPlacement === 1) {
                    if (answers[selectedReference][0] !== '') {
                        const newAnswers = [...answers]
                        newAnswers[selectedReference][0] = ''
                        answers = newAnswers
                    } else {
                        if (selectedReference === 0) {
                            selectedReference = references.length - 1
                        } else {
                            selectedReference--
                        }
                        cursorPlacement = 3
                    }
                } else {
                    if (answers[selectedReference][cursorPlacement - 1] !== '') {
                        const newAnswers = [...answers]
                        newAnswers[selectedReference][cursorPlacement - 1] = newAnswers[selectedReference][cursorPlacement - 1].slice(0, -1)
                        answers = newAnswers
                    } else {
                        cursorPlacement--
                    }
                }
            }
        })
    })

    function isCursorHere(reference: string, int: number) {
        if (!showAnswer) return selectedReference === references.indexOf(reference) && cursorPlacement === int ? 'border-gray-400' : 'border-transparent'
        if (showAnswer) return compareAnswers(reference, int) ? 'border-green-600' : 'border-red-600'
    }

    function compareAnswers(reference: string, int: number) {
        const answered = answers[references.indexOf(reference)][int - 1]
        switch(int) {
            case 1:
                return answered === getBook(reference)
            case 2:
                return answered === getChapter(reference)
            case 3:
                return answered === getVerse(reference)
        }
        return true
    }

    function getAnswer(reference: string, int: number) {
        if (showAnswer) {
            switch (int) {
                case 1:
                    return getBook(reference)
                case 2:
                    return getChapter(reference)
                case 3:
                    return getVerse(reference)
            }
        }

        const answer = answers[references.indexOf(reference)]
        switch (int) {
            case 1:
                return answer[0] === '' ? '????' : answer[0]
            case 2:
                return answer[1] === '' ? '??' : answer[1]
            case 3:
                return answer[2] === '' ? '??' : answer[2]
        }


    }

    function setTab(newTab) {
        tab = newTab
    }
</script>

<div class="grid place-items-center h-screen">
    <div class="sm:hidden bg-lgray-700 overflow-hidden shadow rounded-lg divide-y divide-gray-500 text-gray-200 shadow-lg w-full md:w-1/2">
        <div class="px-4 py-3 sm:px-6 text-5xl flex flex-wrap justify-center text-center">

            This is not currently available for small screens.

        </div>
    </div>

    <div class="hidden sm:block bg-lgray-700 overflow-hidden shadow rounded-lg divide-y divide-gray-500 text-gray-200 shadow-lg w-full md:w-1/2">

        <div class="px-3 py-3 sm:px-6 text-5xl flex flex-wrap justify-center text-center">

            <div class="w-full">
                <nav class="w-full rounded-lg shadow flex divide-x divide-lgray-700" aria-label="Tabs">
                    <!-- Current: "text-gray-900", Default: "text-gray-500 hover:text-gray-700" -->
                    <a href="#" on:click={() => setTab('Keywords')}
                       class="rounded-l-lg text-gray-200 group relative min-w-0 flex-1 overflow-hidden bg-lgray-750 py-3 px-3 text-3xl font-medium text-center transition-all hover:bg-lgray-800 focus:z-10"
                       aria-current="page">
                        <span>Keywords</span>
                        <span aria-hidden="true"
                              class="{tab === 'Keywords' ? 'bg-purple-500' : 'bg-transparent'} transition-colors absolute inset-x-0 bottom-0 h-1"></span>
                    </a>

                    <a href="#" on:click={() => setTab('Quotes')}
                       class="text-gray-200 group relative min-w-0 flex-1 overflow-hidden bg-lgray-750 py-3 px-3 text-3xl font-medium text-center transition-all hover:bg-lgray-800 focus:z-10">
                        <span>Quotes</span>
                        <span aria-hidden="true"
                              class="{tab === 'Quotes' ? 'bg-purple-500' : 'bg-transparent'} transition-colors absolute inset-x-0 bottom-0 h-1"></span>
                    </a>

                    <a href="#" on:click={() => setTab('BC')}
                       class="text-gray-200 group relative min-w-0 flex-1 overflow-hidden bg-lgray-750 py-3 px-3 text-3xl font-medium text-center transition-all hover:bg-lgray-800 focus:z-10">
                        <span>B/C</span>
                        <span aria-hidden="true"
                              class="{tab === 'BC' ? 'bg-purple-500' : 'bg-transparent'} transition-colors absolute inset-x-0 bottom-0 h-1"></span>
                    </a>

                    <a href="#" on:click={() => setTab('Quotations')}
                       class="rounded-r-lg text-gray-200 group relative min-w-0 flex-1 overflow-hidden bg-lgray-750 py-3 px-3 text-3xl font-medium text-center transition-all hover:bg-lgray-800 focus:z-10">
                        <span>Quotations</span>
                        <span aria-hidden="true"
                              class="{tab === 'Quotations' ? 'bg-purple-500' : 'bg-transparent'} transition-colors absolute inset-x-0 bottom-0 h-1"></span>
                    </a>
                </nav>
            </div>

        </div>

        <div class="px-4 py-4 sm:px-6 lg:text-6xl md:text-5xl text-4xl w-full grid cursor-pointer select-none text-center">
            {currentPrompt}
        </div>

        <div class="px-4 py-4 sm:px-6 lg:text-4xl md:text-3xl text-2xl cursor-pointer select-none w-full block text-center h-[11.5rem]">
            {#if !showAnswer}
                {#each references as reference}

                    {#key cursorPlacement}
                        <div class={references.indexOf(reference) > 0 ? 'mt-2' : ''}>
                        <Code classNames="lg:text-4xl md:text-3xl text-2xl border-2 {
                cursorPlacement,selectedReference,isCursorHere(reference, 1)
                }">{answers,getAnswer(reference, 1)}</Code>
                        <Code classNames="lg:text-4xl md:text-3xl text-2xl ml-2 border-2 {
                cursorPlacement,selectedReference,isCursorHere(reference, 2)
                }">{
                            answers,getAnswer(reference, 2)}</Code><span class="font-mono">:</span><Code
                            classNames="lg:text-4xl md:text-3xl text-2xl border-2 {
                cursorPlacement,selectedReference,isCursorHere(reference, 3)
                }">{
                        answers,getAnswer(reference, 3)}</Code></div>
                    {/key}
                {/each}
            {:else }
                {#each references as reference}
                    <div class={references.indexOf(reference) > 0 ? 'mt-2' : ''}>
                        <Code classNames="lg:text-4xl md:text-3xl text-2xl border-2 {answerReferences.includes(reference) ? 'border-green-600' : 'border-red-600'}">
                            {reference}
                        </Code>
                    </div>
                {/each}
            {/if}
        </div>

        <div class="px-4 py-4 sm:px-6">
            <span class="text-2xl text-center w-full block text-purple-400 underline"><a href="/">Back</a></span>
        </div>
    </div>
</div>