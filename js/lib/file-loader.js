var FileLoader = (function(){

	function queue(files){
		this.count = files.length;
		for(var i = 0; i < files.length; i++){
			var file = files[i];
			var reader = new FileReader();
			reader.onerror = this.error;
			reader.onload = this.load;
			reader.file = file;
			switch(this.readAs){
				case 'text':
					reader.readAsText(file, this.encoding);
					break;
				case 'binary':
					reader.readAsBinaryString(file);
					break;
				case 'url':
					reader.readAsDataURL(file);
					break;
				case 'buffer':
					reader.readAsArrayBuffer(file);
					break;
			}
		}
	}
	
	function load(e){
		var file = e.target.file;
		this.files[file.name] = e.target.result;
		this.successCount++;
		this.checkIfDone();
	}
	
	function error(e){
		this.errorCount++;
		console.error("Error loading file:", e);
	}
	
	function checkIfDone(){
		if(this.successCount == this.count){
			this.success(this.files);
			this.done();
		}
		else if(this.successCount + this.errorCount == this.count){
			this.error();
			this.done();
		}
	}

	function noop(){};
	
	function create(options){
		var fileLoader = {};
		fileLoader.queue = queue.bind(fileLoader);
		fileLoader.error = error.bind(fileLoader);
		fileLoader.load = load.bind(fileLoader);
		fileLoader.checkIfDone = checkIfDone.bind(fileLoader);
		fileLoader.success = options.success || noop;
		fileLoader.error = options.error || noop;
		fileLoader.done = options.done || noop;
		fileLoader.files = {};
		fileLoader.count = 0;
		fileLoader.successCount = 0;
		fileLoader.errorCount = 0;
		fileLoader.readAs = options.readAs || "text";
		fileLoader.encoding = options.encoding;
		
		if(options.files){
			fileLoader.queue(options.files);
		}
	}

	return {
		create : create
	};

})();