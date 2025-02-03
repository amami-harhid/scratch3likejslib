import {sleep} from './sleep.js'

const arr = [1,2,3,4,5,6,7];

const arr01 = [...arr];
const arr02 = arr01.splice(0,arr01.length-1);
console.log(arr02)