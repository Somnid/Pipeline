var Transform = (function(){

	function doTransform(transformName, input, functionString, format){
		var transformType = transforms[transformName];
		if(transformType.bodyType == "function"){
			var func = new Function("item", "index", functionString);
			var array = inputToArray(input, format);
			var result = transformType.func(array, func);
			return {
				value : result,
				type : transformType.returnType
			};
		}else if(transformType.bodyType == "json"){
			var json = JSON.parse(functionString);
			var result = transformType.func(input, json);
			return {
				value : result,
				type : transformType.returnType
			};
		}else{
			var result = transformType.func(input);
			return {
				value : result,
				type : transformType.returnType
			};
		}
	}

	var inputParser = {
		json : parseAsJson,
		text : parseAsTextLines
	};

	function inputToArray(input, format){
		try{
			return inputParser[format](input);
		}catch(e){
			console.error("unknown data type", format, input);
		}
	}

	function parseAsJson(input){
		if(typeof(input) == "object"){
			return input;
		}
		return JSON.parse(input);
	}

	function parseAsTextLines(input){
		return input.split("\n");
	}

	var transforms = {
		select : {
			func : function(array, selectorFunction){
				var selectionArray = [];
				for(var i = 0; i < array.length; i++){
					selectionArray.push(selectorFunction(array[i], i));
				}
				return selectionArray;
			},
			bodyType : "function",
			returnType : "json"
		},
		where : {
			func : function(array, whereFunction){
				var resultArray = [];
				for(var i = 0; i < array.length; i++){
					if(whereFunction(array[i])){
						resultArray.push(array[i]);
					}
				}
				return resultArray;
			},
			bodyType : "function",
			returnType : "json"
		},
		print : {
			func : function(array, printFunction){
				var result = "";
				for(var i = 0; i < array.length; i++){
					result += printFunction(array[i]) + "\n";
				}
				return result;
			},
			bodyType : "function",
			returnType : "json"
		},
		count : {
			func: function(array, countFunction){
				var count = 0;
				for(var i = 0; i < array.length; i++){
					if(countFunction(array[i])){
						count++;
					}
				}
				return count;
			},
			bodyType : "function",
			returnType : "json"
		},
		hash : {
			func : function(array, hashFunction){
				var result = {};
				for(var i = 0; i < array.length; i++){
					var keyVal = hashFunction(array[i]);
					result[keyVal.key] = keyVal.value;
				}
				return result;
			},
			bodyType : "function",
			returnType : "json"
		},
		distinct : {
			func : function(array, distinctFunction){
				var result = [];
				for(var i = 0; i < array.length; i++){
					var value = distinctFunction(array[i]);
					if(result.indexOf(value) == -1){
						result.push(value);
					}
				}
				return result;
			},
			bodyType : "function",
			returnType : "json"
		},
		reject : {
			func : function(array, rejectFunction){
				var result = [];
				for(var i = 0; i < array.length; i++){
					if(!rejectFunction(array[i])){
						result.push(array[i]);
					}
				}
				return result;
			},
			bodyType : "function",
			returnType : "json"
		},
		extractHtml : {
			func : Datafy.htmlString,
			bodyType : "json",
			returnType : "json"
		},
		unpivot : {
			func : function(pivotObject){
				var maxLength = 0;
				
				for(var key in pivotObject){
					maxLength = Math.max(pivotObject[key].length, maxLength);
				}
				
				var unpivots = [];
				for(var i = 0; i < maxLength; i++){
					var unpivot = {};
					for(var key in pivotObject){
						if(pivotObject[key][i]){
							unpivot[key] = pivotObject[key][i]
						}
					}
					unpivots.push(unpivot);
				}
				return unpivots;
			},
			returnType : "json"
		}
	};

	return {
		doTransform : doTransform
	};

})();