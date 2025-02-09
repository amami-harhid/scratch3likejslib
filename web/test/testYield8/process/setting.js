export async function setting() {

    const y="xxxx"

    P.stage.whenFlag(async function(){
        console.log(y)
        P.cat.addImage( P.images.Cat );
    });
}
