import { writable } from 'svelte/store';
// @ts-ignore
import { browser } from "$app/env";

let currentVersesStored
let totalCurrentVersesStored
let contentStored
let currentVerseStored
if (browser) {
    if (localStorage.getItem("currentVerses") !== null) currentVersesStored = JSON.parse(localStorage.getItem('currentVerses'))
    if (localStorage.getItem("totalCurrentVerses") !== null) totalCurrentVersesStored = JSON.parse(localStorage.getItem('totalCurrentVerses'))
    contentStored = localStorage.content || ''
    currentVerseStored = localStorage.currentVerse || 'Acts ?:??'
}
export const currentVerses = array(currentVersesStored || [])
export const totalCurrentVerses = array(totalCurrentVersesStored || [])
export const content = writable(contentStored)
export const currentVerse = writable(currentVerseStored)
if (browser) {
    currentVerses.subscribe((value) => localStorage.setItem('currentVerses', JSON.stringify(value)))
    totalCurrentVerses.subscribe((value) => localStorage.setItem('totalCurrentVerses', JSON.stringify(value)))
    content.subscribe((value) => localStorage.setItem('content', value))
    currentVerse.subscribe((value) => localStorage.setItem('currentVerse', value))
}


export function array(value = []) {
    const store = writable(value);

    const wrap = method => {
        return (...args) => {
            let ret;
            store.update(value => {
                ret = value[method](...args);
                return value;
            });
            return ret;
        };
    };

    return {
        ...store,
        push: wrap('push'),
        pop: wrap('pop'),
        shift: wrap('shift'),
        unshift: wrap('unshift'),
        reverse: wrap('reverse'),
        slice: wrap('slice'),
        splice: wrap('splice')
    };
}