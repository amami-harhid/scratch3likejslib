module.exports =  function* testFunc() {
  const arr = ["1","2","3"];
  let a = 0;
  if( a == 2){
    let y = 0;
    while(true) {
      if(y == 5) break;
      y += 1;
      while(y<10){
        y+= 1;
        let yy = 0
        while(yy<10){
          let yyy = 0
          while(yyy<10){
            let yyyy = 0
            while(yyyy<10){
              yyyy+=1;
              yield;
            }
            yyy+=1;
            yield;
          }
          yy+=1;
          yield;
        }
        yield;
      }
      for(let z=0;z<10;z++){
        for(let zz=0;zz<10;zz++){
          for(let zzz=0;zzz<10;zzz++){
            console.log(zzz);
            yield;
          }
          console.log(zz);
          yield;
        }
        console.log(z);
        yield;
      }
      yield;
    }  
    for(;;){
      y+= 1;
      if(y == 10) break;
      yield;
    }
    arr.forEach( function* (v){
      for(let z=0;z<10;z++){
        console.log(z);
        yield;
      }
      console.log(v);
      yield;
    })
    let a = 0
    do {
      a += 1;
      yield;
    }while(a>10);

    let s = ["","",""]
    for(const _s in s){

    }
    for(const _s of s){
      
    }
    const mapArray = s.map((v) => {
      console.log(v)
      while(true){
        break;
      }
      return v * 2
    });
  } 

}
