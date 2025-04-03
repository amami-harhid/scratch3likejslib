const obj = {x:0, y:0};
if( (obj.x && obj.y) || (obj.x == 0 && obj.y == 0)){
    console.log('obj OK');
}else{
    console.log('obj NG');

}

if( Number.isInteger(obj.x)) {
    console.log(`obj.x is integer`);

}else{
    console.log(`obj.x is not integer`);
}

if( isFinite(obj.x)) {
    console.log(`obj.x is finite`);

}else{
    console.log(`obj.x is not finite`);

}