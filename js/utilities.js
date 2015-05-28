var Util = (function(){

	function promiseStub(){
		return new Promise(function(resolve, reject){
			resolve();
		});
	}
	
	function isPlainObject(value){
		if(typeof(value) !== "object" || value === null){
			return false;
		}
		if(value.nodeType){
			return false;
		}
		if(value.constructor && !Object.prototype.hasOwnProperty.call(value.constructor.prototype, "isPrototypeOf" )){
			return false;
		}

		return true;
	}
	
	function extend() {
		var target = arguments[0] || {};
		var sources = Array.prototype.slice.call(arguments, 1);
		for(var i = 0; i < sources.length; i++){
			var source = sources[i];
			for (var prop in source) {
			  if (isPlainObject(source[prop])) {
				target[prop] = extend(target[prop], source[prop]);
			  } else {
				target[prop] = source[prop];
			  }
			}
		}
		return target;
	}
	
	 function insertAtCursor(element, value){
		if(element.tagName == "TEXTAREA"){
			var startPosition = element.selectionStart;
			var endPosition = element.selectionEnd;
			element.value = element.value.substring(0, startPosition) + value + element.value.substring(endPosition, element.value.length);
			//move cursor
			var newIndex = startPosition + value.length;
			element.setSelectionRange(newIndex, newIndex);
		}
	}

	function download(url, fileName){
    	var link = document.createElement("a");
    	link.href = url;
    	link.download = fileName;
    	link.click();
  	}

  	function stringToFileUrl(text){
    	var file = new Blob([text], {type:'text/plain'});
		return URL.createObjectURL(file);
  	}
	
	function arraySelect(array, selectorFunction){
		var selectionArray = [];
		for(var i = 0; i < array.length; i++){
			selectionArray.push(selectorFunction(array[i]));
		}
		return selectionArray;
	}
	
	return {
	  promiseStub : promiseStub,
	  isPlainObject : isPlainObject,
	  extend : extend,
	  insertAtCursor : insertAtCursor,
	  download : download,
	  stringToFileUrl : stringToFileUrl,
	  arraySelect : arraySelect
	};

})();