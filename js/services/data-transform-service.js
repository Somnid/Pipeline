var DataTransformService = (function(){

	var defaults = {
		inputParserService : null //required
	};

	function create(options){
		var dataTransformService = {};
		dataTransformService.options = Util.extend({}, defaults, options);
		bind(dataTransformService);
		return dataTransformService;
	}

	function bind(dataTransformService){
		dataTransformService.doTransform = doTransform.bind(dataTransformService);
		dataTransformService.transformWithFunctionBodyType = transformWithFunctionBodyType.bind(dataTransformService);
		dataTransformService.transformWithJsonBodyType = transformWithJsonBodyType.bind(dataTransformService);
		dataTransformService.transformWithOtherBodyType = transformWithOtherBodyType.bind(dataTransformService);
	}

	function doTransform(transformName, input, transformBody, format){
		return new Promise((resolve, reject) => {
			var transformType = Transform[transformName];

			if(transformType.bodyType == "function"){
			  resolve(this.transformWithFunctionBodyType(input, transformType, format, transformBody));
			}else if(transformType.bodyType == "json"){
			  resolve(this.transformWithJsonBodyType(input, transformType, transformBody));
			}else{
				resolve(this.transformWithOtherBodyType(input, transformType, format));
			}
		});
	}

	function transformWithFunctionBodyType(input, transformType, format, functionBody){
		return new Promise((resolve, reject) => {
			var func = new Function("item", "index", functionBody);
			var array = this.options.inputParserService.inputToArray(input, format);
			transformType.func(array, func)
				.then(result => {
					resolve({
						value : result,
						type : transformType.returnType
					});
				});
		});
	}

	function transformWithJsonBodyType(input, transformType, jsonBody){
		return new Promise((resolve, reject) => {
			var json = JSON.parse(jsonBody);
			transformType.func(input, json)
				.then(result => {
					resolve({
						value : result,
						type : transformType.returnType
					});
				});
		});
	}

	function transformWithOtherBodyType(input, transformType, format){
		return new Promise((resolve, reject) => {
			var array = this.options.inputParserService.inputToArray(input, format);
			transformType.func(array)
				.then(result => {
					resolve({
						value : result,
						type : transformType.returnType
					});
				});
		});
	}

	return {
		create : create
	};
})();
