var Transform = (function(){
	var transforms = {
		select : {
			func : function(array, selectorFunction){
				return new Promise(function(resolve, reject){
					var selectionArray = [];
					for(var i = 0; i < array.length; i++){
						selectionArray.push(selectorFunction(array[i], i));
					}
					resolve(selectionArray);
				});
			},
			bodyType : "function",
			returnType : "json"
		},
		where : {
			func : function(array, whereFunction){
				return new Promise(function(resolve, reject){
					var resultArray = [];
					for(var i = 0; i < array.length; i++){
						if(whereFunction(array[i])){
							resultArray.push(array[i]);
						}
					}
					resolve(resultArray);
				});
			},
			bodyType : "function",
			returnType : "json"
		},
		print : {
			func : function(array, printFunction){
				return new Promise(function(resolve, reject){
					var result = "";
					for(var i = 0; i < array.length; i++){
						result += printFunction(array[i]) + "\n";
					}
					resolve(result);
				});
			},
			bodyType : "function",
			returnType : "json"
		},
		count : {
			func: function(array, countFunction){
				return new Promise(function(resolve, reject){
					var count = 0;
					for(var i = 0; i < array.length; i++){
						if(countFunction(array[i])){
							count++;
						}
					}
					resolve(count);
				});
			},
			bodyType : "function",
			returnType : "json"
		},
		hash : {
			func : function(array, hashFunction){
				return new Promise(function(resolve, reject){
					var result = {};
					for(var i = 0; i < array.length; i++){
						var keyVal = hashFunction(array[i]);
						result[keyVal.key] = keyVal.value;
					}
					resolve(result);
				});
			},
			bodyType : "function",
			returnType : "json"
		},
		distinct : {
			func : function(array, distinctFunction){
				return new Promise(function(resolve, reject){
					var result = [];
					for(var i = 0; i < array.length; i++){
						var value = distinctFunction(array[i]);
						if(result.indexOf(value) == -1){
							result.push(value);
						}
					}
					resolve(result);
				});
			},
			bodyType : "function",
			returnType : "json"
		},
		reject : {
			func : function(array, rejectFunction){
				return new Promise(function(resolve, reject){
					var result = [];
					for(var i = 0; i < array.length; i++){
						if(!rejectFunction(array[i])){
							result.push(array[i]);
						}
					}
					return result;
				});
			},
			bodyType : "function",
			returnType : "json"
		},
		extractHtml : {
			func : function(html, extractionGuide){
				return new Promise((resolve, reject) => {
					var result = Datafy.htmlString(html, extractionGuide);
					resolve(result);
				});
			},
			bodyType : "json",
			returnType : "json"
		},
		unpivot : {
			func : function(pivotObject){
				return new Promise(function(resolve, reject){
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
					resolve(unpivots);
				});
			},
			returnType : "json"
		},
		toText : {
			func : function(array, textFunc){
				return new Promise(function(resolve, reject){
					var result = "";
					for(var i = 0; i < array.length; i++){
						result += textFunc(array[i]);
					}
					resolve(result);
				});
			},
			bodyType : "function",
			returnType : "text"
		},
		httpRequest : {
			func : function(url){
				if(!window.Cjax){
					throw "Need to install Cjax";
				}
				return Cjax.request({ url : url });
			},
			returnType : "html"
		},
		//abstract
		toSqlInsert : {
			func : function(array){
				return new Promise((resolve, reject) => {
					var statement = "INSERT INTO\nVALUES\n";
					array.forEach(x => {
						statement += "(";
						for(var key in x){
							if(/^[0-9]+$/i.test(x[key])){
								statement += `${x[key]}, `;
							}else{
								var value = x[key].replace(/\'/, "''");
								statement += `'${value}', `;
							}
						}
						statement = statement.substring(0, statement.length - 2);
						statement += "),\n";
					});
					statement = statement.substring(0, statement.length - 2);
					resolve(statement);
				});
			},
			returnType : "text"
		}
	};

	return transforms;
})();
