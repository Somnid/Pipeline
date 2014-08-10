var stepProto = Object.create(HTMLElement.prototype);

stepProto.createdCallback = function(){
  StepView.create(this);
};

document.registerElement("step-view", {
  prototype : stepProto
});

var StepView = (function(){

	function create(stepView){
		stepView.dom = {}
		bind(stepView);
		stepView.init();
		return stepView;
	}

	function bind(stepView){
		stepView.init = init.bind(stepView);
		stepView.gatherSelectors = gatherSelectors.bind(stepView);
		stepView.transform = transform.bind(stepView);
		stepView.renderShadow = renderShadow.bind(stepView);
	}

	function init(){
	  this.renderShadow();
		this.gatherSelectors();
	}

	function renderShadow(){
	  var template = document.getElementById("step-tmpl");
    var tmpl = Tmpl.tmpl(template, { }, this);
    this.dom.shadowRoot = this.createShadowRoot();
    this.dom.shadowRoot.appendChild(tmpl);
	}

	function gatherSelectors(){
		this.dom.select = this.dom.shadowRoot.querySelector(".transform-select");
		this.dom.func = this.dom.shadowRoot.querySelector(".function");
	}

	function transform(input, type){
		var transformName = this.dom.select.value;
		var func = this.dom.func.value;
		Transform.doTransform(transformName, input, func, type);
	}

	return {
		create : create
	};

})();