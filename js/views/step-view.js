var StepView = (function(){

	function create(options){
		var stepView = {};
		stepView.dom = {
			el : options.el
		};
		stepView.model = {
			id : options.id
		};
		bind(stepView);
		stepView.init();
		return stepView;
	}
	
	function bind(stepView){
		stepView.init = init.bind(stepView);
		stepView.gatherSelectors = gatherSelectors.bind(stepView);
		stepView.transform = transform.bind(stepView);
	}
	
	function init(){
		this.gatherSelectors();
		this.setupModel();
	}
	
	function gatherSelectors(){
		this.dom.select = this.dom.el.querySelector(".transform-select");
		this.dom.func = this.dom.el.querySelector(".function");
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