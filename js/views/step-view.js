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
		stepView.renderDom = renderDom.bind(stepView);
		stepView.toData = toData.bind(stepView);
		stepView.setupModel = setupModel.bind(stepView);
		stepView.attachEvents = attachEvents.bind(stepView);
		stepView.appendTo = appendTo.bind(stepView);
		stepView.remove = remove.bind(stepView);
	}

	function init(){
		this.setupModel();
		this.renderDom();
	}

	function attachEvents(){
		this.dom.func.addEventListener("keydown", tabHandler);
		this.dom.remove.addEventListener("click", this.remove);
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

		this.dom.tmpl = Tmpl.tmpl(template, {
			".transform-select" : "transform",
			".function" : "func"
		}, this.model);

		this.dom.root = this.dom.tmpl.children[0];
	}

	function gatherSelectors(){
		this.dom.select = this.dom.root.querySelector(".transform-select");
		this.dom.func = this.dom.root.querySelector(".function");
		this.dom.remove = this.dom.root.querySelector(".remove");
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

	function toData(){
		return {
			transform : this.dom.select.value,
			func : this.dom.func.value
		};
	}

	function remove(){
		DomTools.removeElement(this.dom.root);
	}

	function appendTo(element){
		element.appendChild(this.dom.tmpl);
		this.gatherSelectors();
		this.attachEvents();
	}

	return {
		create : create
	};

})();
