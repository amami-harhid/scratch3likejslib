/**
 * Sample50
 * preload/prepare/setting を モジュールとして外出し
 */
import {PlayGround, Library} from '../../build/index.js'

const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

import {preload} from "./sub/_preload.js";
import {prepare} from "./sub/_prepare.js";
import {setting} from "./sub/_setting.js";

Pg.title = "【Sample50】sample22 の preload/prepare/settingをモジュール化"

Pg.preload = preload;

Pg.prepare = prepare;

Pg.setting = setting;