var StatusBar = (function(){

	var defaults = {
		root : null //required
	};

	function create(options){
		var statusBar = {};
		statusBar.options = Util.extend({}, defaults, options);
		bind(statusBar);
		statusBar.init();
		return statusBar;
	}
	
	function bind(statusBar){
		statusBar.cacheDom = cacheDom.bind(statusBar);
		statusBar.init = init.bind(statusBar);
	}
	
	function cacheDom(){
		this.dom = {};
		this.dom.root = this.options.root;
	}
	
	function init(){
		this.cacheDom();
	}
	
	function show(text){
		this.dom.root.textContent = text;
		this.dom.root.style.display = "block";
	}
	
	return {
		create : create
	};

})();