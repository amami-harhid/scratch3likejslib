const SoundLoader = class {

    static async loadSound(sound, name) {
        if(sound) {
            if(typeof sound === 'string') {
                let responce = await fetch(sound);
                let buffer = await responce.arrayBuffer();
                let data =  new Uint8Array(buffer);
                return {name:name, data:data};
            }
        }
        // 例外を起こすべきところ。
        throw('Scratch3LikeJS loadSound: empty url')
    }

};

module.exports = SoundLoader;