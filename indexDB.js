var localDatabase ={};
var dbname ='newsDB';
localDatabase.indexedDB = window.indexedDB||window.wibkitIndexedDB;
	function dele(){
		localDatabase.indexedDB.deleteDatabase(dbname);
	}
function createindexdb(schemax,fn){
	var rst = localDatabase.indexedDB.open(dbname,1);
	rst.onerror =function(e){
		console.log('失败'+e.target.errorCode);
	}
	rst.onsuccess= function(e){
		console.log('成功');
		localDatabase.db = rst.result;

		fn();
	}
	rst.onupgradeneeded =function(e){
		for(var key in schemas){
			var newsStore = e.currentTarget.result.createObjectStore(key,{keyPath:"id",autoIncrement:true});
			newsStore.createIndex("urlIndex","url",{unique:true});
			newsStore.createIndex("idIndex","id",{unique:true});
		}
	}
}  




function addnews(tablename,data,fn){
	var count = data.length;
	for(var i=0;i<data.length;i++){
		//插入全部数据  调用 additem 
additem(tablename,data[i],function(){
	count--;
	if(count==0){
		fn();
	}
})
	}
}
//一条一条的往tablename中插入数据
function additem(tablename,data,fn){
	var transaction=null;
	var store = null;
	transaction=localDatabase.db.transaction(tablename,"readwrite");
	store = transaction.objectStore(tablename);
	var request = store.put(data);
	transaction.oncomplete = function(){
			fn();
	};
	transaction.onabort = function(){
			fn();
	}

}



//查询最大值 进行排序

function queryMax(tablename,fn){
	var transaction=null;
	var store = null;
	transaction=localDatabase.db.transaction(tablename,"readwrite");
	store = transaction.objectStore(tablename);

	var request = store.index("idIndex").openCursor(null,"prevunique");

	request.onsuccess =function(e){
		var cursor = e.target.result;
		if(cursor){
			fn(cursor.key);
		}
	}


}

//能够获得某个区间的数据
function fetchNew(tablename,begin,pagecount,fn){
	var result =[];//检索的结果
		var transaction=null;
		var store = null;
		transaction=localDatabase.db.transaction(tablename,"readwrite");
		store = transaction.objectStore(tablename);
		var range = window.IDBKeyRange.bound(begin-pagecount+1,begin,false,false);
		var request = store.index("idIndex").openCursor(range,"prevunique");
	request.onsuccess =function(e){
		var cursor = e.target.result;
		if(cursor){
			result.push(cursor.value);
			cursor.continue();
		}else{
				fn(result);
		}
	}
 

}




