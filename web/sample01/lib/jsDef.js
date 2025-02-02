function createStage(name) {
    P.stage = new P.Stage(name);
}
function addImage(imgName) {
    P.stage.addImage(P.images[imgName]);
}
P.preload = function() {
    rubyVM.evalAsync("preload");
}
P.prepare = function() {
    console.log('prepare --- start')
    rubyVM.evalAsync("prepare")
}

P.setting = function() {
    console.log('setting --- start')
    rubyVM.evalAsync("setting")
}