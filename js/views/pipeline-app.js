var PipelineApp = (function(){

	function create(){
		var pipelineApp = {};
		pipelineApp.dom = {};
		pipelineApp.model = {};
		bind(pipelineApp);
		pipelineApp.init();

		return pipelineApp;
	}

	function bind(pipelineApp){
		pipelineApp.init = init.bind(pipelineApp);
		pipelineApp.gatherSelectors = gatherSelectors.bind(pipelineApp);
		pipelineApp.setupModel = setupModel.bind(pipelineApp);
		pipelineApp.attachEvents = attachEvents.bind(pipelineApp);
		pipelineApp.addStep = addStep.bind(pipelineApp);
		pipelineApp.transform = transform.bind(pipelineApp);
	}

	function init(){
		this.gatherSelectors();
		this.attachEvents();
		this.setupModel();
	}

	function setupModel(){
		this.model.steps = [];
		this.model.stepCounter = 0;
	}

	function gatherSelectors(){
		this.dom.addStep = document.getElementById("add-step");
		this.dom.transform = document.getElementById("transform");
		this.dom.stepTmpl = document.getElementById("step-tmpl");
		this.dom.steps = document.getElementById("steps");
		this.dom.input = document.getElementById("input");
		this.dom.output = document.getElementById("output");
		this.dom.typeSelect = document.getElementById("type-select");
	}

	function attachEvents(){
		this.dom.addStep.addEventListener("click", this.addStep);
		this.dom.transform.addEventListener("click", this.transform);
	}

	function addStep(){
		var stepView = document.createElement("step-view");
		stepView.step = this.model.stepCounter;
		this.model.steps.push(stepView);
		this.dom.steps.appendChild(stepView);
		this.model.stepCounter++;
	}

	function transform(){
		var value = this.dom.input.value;
		var type = this.dom.typeSelect.value;
		
		var promise = type == "html" ? Ajax.promiseRequest({ url : value }) : Util.promiseStub();
		
		promise.then(function(){
  		for(var i = 0; i < this.model.steps.length; i++){
  			out = this.model.steps[i].transform(value, type);
  			type = out.type;
  			value = out.value;
  		}
  		this.dom.output.value = value;
		}.bind(this));
	}

	return {
		create : create
	};

})();