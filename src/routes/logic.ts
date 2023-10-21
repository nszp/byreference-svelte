import { currentVerse, currentVerses, totalCurrentVerses } from './store'
import {
    romansChapterLengths,
    romansReferences,
    romansQuotes,
    romansQuotesRaw,
    jamesChapterLengths,
    jamesReferences,
    jamesQuotes,
    jamesQuotesRaw,
    actsChapterLengths, actsReferences, actsQuotes, actsQuotesRaw
} from './constants'
import { difference, getRandomInt } from './utils'
import { get_store_value } from 'svelte/internal'


function fillWithRomans(start: string, end: string, target: Array<string>): Array<string> {
    const output = target

    if (!start.includes(':')) start = `${start}:1`
    if (!end.includes(':')) end = `${end}:${romansChapterLengths.get(Number(end))}`

    for (let i = romansReferences.indexOf(start); i <= romansReferences.indexOf(end); i++) {
        output.push(`Romans ${romansReferences[i]}`)
    }

    return output
}

function fillWithRomansQuotes(start: string, end: string, target: Array<string>): Array<string> {
    const output = target

    if (!start.includes(':')) start = `${start}:1`
    // @ts-ignore
    if (romansQuotesRaw.includes(start)) start = `${start}q`
    if (!end.includes(':')) end = `${end}:${romansChapterLengths.get(Number(end))}`
    // @ts-ignore
    if (romansQuotesRaw.includes(end)) end = `${end}q`

    for (let i = romansQuotes.indexOf(start); i <= romansQuotes.indexOf(end); i++) {
        if (romansQuotes[i].endsWith('q')) output.push(`Romans ${romansQuotes[i].replace('q', '')}`)
    }

    return output
}

function fillWithJames(start: string, end: string, target: Array<string>): Array<string> {
    const output = target

    if (!start.includes(':')) start = `${start}:1`
    if (!end.includes(':')) end = `${end}:${jamesChapterLengths.get(Number(end))}`

    for (let i = jamesReferences.indexOf(start); i <= jamesReferences.indexOf(end); i++) {
        output.push(`James ${jamesReferences[i]}`)
    }

    return output
}

function fillWithJamesQuotes(start: string, end: string, target: Array<string>): Array<string> {
    const output = target

    if (!start.includes(':')) start = `${start}:1`
    // @ts-ignore
    if (jamesQuotesRaw.includes(start)) start = `${start}q`
    if (!end.includes(':')) end = `${end}:${jamesChapterLengths.get(Number(end))}`
    // @ts-ignore
    if (jamesQuotesRaw.includes(end)) end = `${end}q`

    for (let i = jamesQuotes.indexOf(start); i <= jamesQuotes.indexOf(end); i++) {
        if (jamesQuotes[i].endsWith('q')) output.push(`James ${jamesQuotes[i].replace('q', '')}`)
    }

    return output
}

function fillWithActs(start: string, end: string, target: Array<string>): Array<string> {
    const output = target

    if (!start.includes(':')) start = `${start}:1`
    if (!end.includes(':')) end = `${end}:${actsChapterLengths.get(Number(end))}`

    for (let i = actsReferences.indexOf(start); i <= actsReferences.indexOf(end); i++) {
        output.push(`Acts ${actsReferences[i]}`)
    }

    return output
}

function fillWithActsQuotes(start: string, end: string, target: Array<string>): Array<string> {
    const output = target

    if (!start.includes(':')) start = `${start}:1`
    // @ts-ignore
    if (actsQuotesRaw.includes(start)) start = `${start}q`
    if (!end.includes(':')) end = `${end}:${actsChapterLengths.get(Number(end))}`
    // @ts-ignore
    if (actsQuotesRaw.includes(end)) end = `${end}q`

    for (let i = actsQuotes.indexOf(start); i <= actsQuotes.indexOf(end); i++) {
        if (actsQuotes[i].endsWith('q')) output.push(`Acts ${actsQuotes[i].replace('q', '')}`)
    }

    return output
}

export function parseChapters(input: string) {
    if (input == null || input == '') return
    input = `${input} `
    let output = []

    // @ts-ignore
    // const romansMatch = [...input.matchAll(/[Rr] ?(\d+(:\d+)?)(-(\d+(:\d+)?))? /g)]
    // romansMatch.forEach(match => {
    //     output = fillWithRomans(match[1], match[4] == null ? match[1] : match[4], output)
    // })
    //
    // // @ts-ignore
    // const romansQuotesMatch = [...input.matchAll(/[Rr] ?(\d+(:\d+)?)(-(\d+(:\d+)?))?q /g)]
    // romansQuotesMatch.forEach(match => {
    //     output = fillWithRomansQuotes(match[1], match[4] == null ? match[1] : match[4], output)
    // })
    //
    // // @ts-ignore
    // const jamesMatch = [...input.matchAll(/[Jj] ?(\d+(:\d+)?)(-(\d+(:\d+)?))? /g)]
    // jamesMatch.forEach(match => {
    //     output = fillWithJames(match[1], match[4] == null ? match[1] : match[4], output)
    // })
    //
    // // @ts-ignore
    // const jamesQuotesMatch = [...input.matchAll(/[Jj] ?(\d+(:\d+)?)(-(\d+(:\d+)?))?q /g)]
    // jamesQuotesMatch.forEach(match => {
    //     output = fillWithJamesQuotes(match[1], match[4] == null ? match[1] : match[4], output)
    // })

    const actsMatch = [...input.matchAll(/[Aa] ?(\d+(:\d+)?)(-(\d+(:\d+)?))? /g)]
    actsMatch.forEach(match => {
        output = fillWithActs(match[1], match[4] == null ? match[1] : match[4], output)
    })

    // @ts-ignore
    const actsQuotesMatch = [...input.matchAll(/[Aa] ?(\d+(:\d+)?)(-(\d+(:\d+)?))?q /g)]
    actsQuotesMatch.forEach(match => {
        output = fillWithActsQuotes(match[1], match[4] == null ? match[1] : match[4], output)
    })

    if (output.length === 0) return

    if (get_store_value(totalCurrentVerses).length === get_store_value(currentVerses).length) {
        totalCurrentVerses.set([...output])
        currentVerses.set([...output])
        return
    }

    const finished = difference(get_store_value(currentVerses), get_store_value(totalCurrentVerses))
    totalCurrentVerses.set([...output])
    currentVerses.set([...output])
    finished.forEach(r => {
        if (get_store_value(currentVerses).indexOf(r) !== -1) {
            currentVerses.splice(get_store_value(currentVerses).indexOf(r), 1)
        }
    })

}



export function nextVerse() {
    if (get_store_value(currentVerses).length == 1) {
        currentVerse.set(get_store_value(currentVerses)[0])
        currentVerses.set([])
        console.groupEnd()
        return
    }

    if (get_store_value(currentVerses).length == 0) {
        currentVerse.set('Finished')
        console.groupEnd()
        return
    }

    const rand = getRandomInt(0, get_store_value(currentVerses).length)
    currentVerse.set(get_store_value(currentVerses)[rand])
    currentVerses.splice(rand, 1)
    currentVerses.set(get_store_value(currentVerses))
}

export function missVerse() {
    if (get_store_value(currentVerses).length === 0) return
    const rand = getRandomInt(0, get_store_value(currentVerses).length)
    if (get_store_value(currentVerses).length !== get_store_value(totalCurrentVerses).length) currentVerses.push(get_store_value(currentVerse))
    currentVerse.set(get_store_value(currentVerses)[rand])
    currentVerses.set(get_store_value(currentVerses))
}

export function resetVerses() {
    currentVerses.set([...get_store_value(totalCurrentVerses)])
    nextVerse()
}

