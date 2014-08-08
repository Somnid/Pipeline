var DropField = (function(){

	function init(el){
		el.addEventListener("dragover", dragover);
		el.addEventListener("dragleave", dragleave);
		el.addEventListener("drop", drop);
	}

	function halt(e){
		e.preventDefault();
		e.stopPropagation();
	}

	function dragover(e){
		halt(e);
		e.target.classList.add("dragover");
	}
	
	function dragleave(e){
		halt(e);
		e.target.classList.remove("dragover");
	}
	
	function drop(e){
		halt(e);
		var file = e.dataTransfer.files[0];
		var reader = new FileReader();
		reader.onerror = error;
		reader.onload = load.bind(e.target);
		reader.readAsText(file);
		e.target.classList.remove("dragover");
	}
	
	function error(e){
		console.error(e);
	}
	
	function load(e){
		this.value = e.target.result
	}
	
	return {
		init : init
	};
	
})();