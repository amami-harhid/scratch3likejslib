module.exports =  function* testFunc() {
  const arr = ["1","2","3"];
  let a = 0;
  if( a == 2){
    let y = 0;
    while(true) {
      if(y == 5) break;
      y += 1;
      yield;
    }  
    for(;;){
      y+= 1;
      if(y == 10) break;
      yield;
    }
    arr.forEach( function* (v){
      console.log(v);
      yield(2);
    })
    
  } 

}
