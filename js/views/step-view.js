var StepView = (function(){

	var defaults = {
		model : null
	};

	function create(options){
		var stepView = {};
		stepView.options = Util.extend({}, defaults, options);
		bind(stepView);
		stepView.init();
		return stepView;
	}

	function bind(stepView){
		stepView.init = init.bind(stepView);
		stepView.gatherSelectors = gatherSelectors.bind(stepView);
		stepView.transform = transform.bind(stepView);
		stepView.renderDom = renderDom.bind(stepView);
		stepView.toData = toData.bind(stepView);
		stepView.setupModel = setupModel.bind(stepView);
		stepView.attachEvents = attachEvents.bind(stepView);
	}

	function init(){
		this.setupModel();
		this.renderDom();
		this.gatherSelectors();
		this.attachEvents();
	}
	
	function attachEvents(){
		this.dom.func.addEventListener("keydown", tabHandler);
	}
	
	function setupModel(){
		this.model = this.options.model || {
			transform : null,
			func : ""
		};
	}

	function renderDom(){
		var template = document.getElementById("step-tmpl");
		this.dom = {};
		
		this.dom.root = Tmpl.tmpl(template, { 
			".transform-select" : "transform",
			".function" : "func"
		}, this.model);
	}

	function gatherSelectors(){
		this.dom.select = this.dom.root.querySelector(".transform-select");
		this.dom.func = this.dom.root.querySelector(".function");
	}
	
	function tabHandler(e) {
		var TABKEY = 9;
		if(e.keyCode == TABKEY) {
			Util.insertAtCursor(e.target, "\t");
			if(e.preventDefault) {
				e.preventDefault();
			}
			return false;
		}
	}

	function transform(input, type){
		var transformName = this.dom.select.value;
		var func = this.dom.func.value;
		return Transform.doTransform(transformName, input, func, type);
	}
	
	function toData(){
		return {
			transform : this.dom.select.value,
			func : this.dom.func.value
		};
	}

	return {
		create : create
	};

})();