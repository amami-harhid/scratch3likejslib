const test01 =  function(){
}
const test02 =  async function(){
}
const test03 =  async function*(){
}
const test04 =  function*(){
}
const test05 =  ()=>{
}
const test06 =  async ()=>{
}
const test07 =  async ()=>{
    let y = 1;
    while(true){
        y+=1;
        if(y>10) break;
        continue;
    }
    const arr = ["a","b","c"];
    for(const x of arr){
        console.log(x)
    }
    arr.forEach(x => {console.log(x)});
    let x = 0;
    do {
        x+=1;
        if(x>10) break;
        yield;
    } while(true);
}
const test08 =  function(){
    return __asyncGenerator(this, arguments, function* () {
		let x = 0;
	})
}


module.exports  = {test01,test02,test03,test04,test05,test06, test07,test08};
