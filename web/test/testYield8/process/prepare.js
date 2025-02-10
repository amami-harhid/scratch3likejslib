export async function prepare() {
    P.stage = new P.Stage();
    P.stage.addImage( P.images.Jurassic );
    P.cat = new P.Sprite("Cat");
    P.cat.addImage( P.images.Cat );
}