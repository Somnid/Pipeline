var Util = (function(){

	function promiseStub(){
		return new Promise(function(resolve, reject){
			resolve();
		});
	}
	
	return {
	  promiseStub : promiseStub
	};

})();