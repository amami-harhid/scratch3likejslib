import '../../build/likeScratchLib.js'
(function(M, S){

    M.preload = function() {
        this.loadImage('../assets/Jurassic.svg','Jurassic');
        this.loadSound('../assets/Chill.wav','Chill');
        this.loadImage('../assets/cat.svg','Cat');
        this.loadSound('../assets/Cat.wav','Mya');    
    }
    M.prepare = function() {
        S.stage = new M.Stage();
        S.stage.addImage( M.images.Jurassic );
        
        S.cat = new M.Sprite("Cat");
        S.cat.addImage( M.images.Cat );
    
    }
    M.setup = function() {
        S.stage.whenFlag(function(){

        });
    };

})(likeScratchLib.Main, likeScratchLib.Space);
