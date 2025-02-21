/**
 * Sample50
 * preload/prepare/setting を モジュールとして外出し
 */
import {PlayGround, Libs, Storage, Images, Sounds} from '../../build/likeScratchLib.js'

const [Pg, St] = [PlayGround, Storage]; // 短縮名にする

import {preload} from "./preload.js";
import {prepare} from "./prepare.js";
import {setting} from "./setting.js";

Pg.title = "【Sample50】sample22 の preload/prepare/settingをモジュール化"

Pg.preload = preload;

Pg.prepare = prepare;

Pg.setting = setting;