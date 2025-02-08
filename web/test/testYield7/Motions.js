import {threads} from './threads.js';
import {sleep} from './sleep.js';

const Motions = class{

    static async move( steps ){
        const obj = threads.nowExecutingObj;
        obj.visualFlag = true;
    }

};
export {Motions}