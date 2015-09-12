var ProcessRunner = (function(){

	var dataTransformService = DataTransformService.create({
		inputParserService : InputParserService.create()
	});

	function runProcess(process){
		var promise = Promise.resolve({
			value : process.input,
			type : process.inputType
		});

		for(var i = 0; i < process.steps.length; i++){
			promise = promise.then(function(result){
				return dataTransformService.doTransform(process.steps[this].transform, result.value, process.steps[this].func, result.type);
			}.bind(i));
		}
		return promise;
	}

	return {
		runProcess : runProcess
	};

})();
