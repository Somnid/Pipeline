var ProcessRunner = (function(){

	function runProcess(process){
		return new Promise(function(resolve, reject){
			var promise = process.inputType == "html" ? Cjax.request({ url : process.input }) : Util.promiseStub();
			var type = process.inputType;
			
			promise.then(function(value){
				for(var i = 0; i < process.steps.length; i++){
					out = Transform.doTransform(process.steps[i].transform, value, process.steps[i].func, type);
					type = out.type;
					value = out.value;
				}
				
				resolve({
					value : value,
					type : type
				});
			});
		});
	}
	
	return {
		runProcess : runProcess
	};

})();