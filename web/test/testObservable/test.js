
//オブジェクトのプロパティの変化を監視する関数
let watchProp = function(obj, propName) {
	let value = obj[propName];
	Object.defineProperty(obj, propName, {
		get: () => value,
		set: newValue => {
			const oldValue = value;
			value = newValue;
			consoleOut(oldValue,value);
		}
	});
}

//プロパティが変化した時に呼び出す関数
let consoleOut = function(oldValue,value){
	document.getElementById("outTime").innerHTML = oldValue+"⇒"+value;
}

//監視させるオブジェクトとプロパティを定義
let timeKeeper = {"count_time" : 0};
watchProp(timeKeeper, "count_time");

//1秒ごとにプロパティをカウントアップ
setInterval("countup()", 1000);
let countup = function(){
	timeKeeper["count_time"] += 1;
	console.log(timeKeeper["count_time"]);
}