export async function prepare() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
    P.stage.addSound( P.sounds.BossaNova , { 'volume' : 25 } );
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat1 );
    P.cat.addImage( P.images.Cat2 );
}