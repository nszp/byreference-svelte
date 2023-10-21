<script>
    import Code from '../lib/Code.svelte'
</script>

<div class="grid place-items-center h-screen">
    <div class="bg-lgray-700 overflow-hidden shadow rounded-lg divide-y divide-gray-500 text-gray-200 shadow-lg w-full md:w-1/2">
        <div class="px-4 py-3 sm:px-6 text-5xl flex flex-wrap justify-center text-center">

            Guide to Content

        </div>
        <div class="px-4 py-5 sm:p-6 flex justify-center">
            <p class="text-center w-full block text-lg">
                The content input takes an infinite number of chapter/verse ranges.
                Ranges can be just one chapter: <Code>A1</Code>
                They can also be a range of chapters: <Code>A 1-2</Code>
                Or, you can add a verse number to the end of any chapter reference: <Code>A1:1-2:8</Code>
                You can add all quotes inside of a range by adding "q" to the end: <Code>A1q</Code>
                Lowercase letters also work for (A)cts: <Code>a 1-2</Code>
                A space between the chapter letter and the range itself also does not matter.
                Ranges must be seperated by at least one space: <Code>A 1-28 A 1-28q</Code>
            </p>
        </div>
        <div class="px-4 py-4 sm:px-6">
           <span class="text-2xl text-center w-full block text-purple-400 underline"><a href="/">Back</a></span>
        </div>
    </div>
</div>