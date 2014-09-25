var Transform = (function(){

	function doTransform(transformName, input, functionString, format){
		var func = new Function("item", "index", functionString);
		var array = inputToArray(input, format);
		var result = transforms[transformName](array, func);
		return {
			value : result,
			type : format
		};
	}

	var inputParser = {
		json : parseAsJson,
		text : parseAsTextLines
	};

	function inputToArray(input, format){
		try{
			return inputParser[format](input);
		}catch(e){
			console.error("unknown data type");
		}
	}

	function parseAsJson(input){
		return JSON.parse(input);
	}

	function parseAsTextLines(input){
		return input.split("\n");
	}

	var transforms = {
		select : function(array, selectorFunction){
			var selectionArray = [];
			for(var i = 0; i < array.length; i++){
				selectionArray.push(selectorFunction(array[i], i));
			}
			return selectionArray;
		},
		where : function(array, whereFunction){
			var resultArray = [];
			for(var i = 0; i < array.length; i++){
				if(whereFunction(array[i])){
					resultArray.push(array[i]);
				}
			}
			return resultArray;
		},
		print : function(array, printFunction){
			var result = "";
			for(var i = 0; i < array.length; i++){
				result += printFunction(array[i]) + "\n";
			}
			return result;
		},
		count : function(array, countFunction){
			var count = 0;
			for(var i = 0; i < array.length; i++){
				if(countFunction(array[i])){
					count++;
				}
			}
			return count;
		},
		hash : function(array, hashFunction){
			var result = {};
			for(var i = 0; i < array.length; i++){
				var keyVal = hashFunction(array[i]);
				result[keyVal.key] = keyVal.value;
			}
			return result;
		},
		distinct : function(array, distinctFunction){
			var result = [];
			for(var i = 0; i < array.length; i++){
				var value = distinctFunction(array[i]);
				if(result.indexOf(value) == -1){
					result.push(value);
				}
			}
			return result;
		},
		reject : function(array, rejectFunction){
			var result = [];
			for(var i = 0; i < array.length; i++){
				if(!rejectFunction(array[i])){
					result.push(array[i]);
				}
			}
			return result;
		}
	};

	return {
		doTransform : doTransform
	};

})();