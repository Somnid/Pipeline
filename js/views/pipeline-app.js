var PipelineApp = (function(){

	function create(){
		var pipelineApp = {};
		pipelineApp.dom = {};
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
		pipelineApp.attachSubviews = attachSubviews.bind(pipelineApp);
		pipelineApp.loadData = loadData.bind(pipelineApp);
		pipelineApp.save = save.bind(pipelineApp);
		pipelineApp.clear = clear.bind(pipelineApp);
		pipelineApp.downloadFlow = downloadFlow.bind(pipelineApp);
		pipelineApp.outputError = outputError.bind(pipelineApp);
	}

	function init(){
		this.gatherSelectors();
		this.attachEvents();
		this.setupModel();
		this.attachSubviews();
		
		this.loadData(ObjectStorage.get("last-data"));
	}

	function setupModel(){
		this.model = {
			steps : [],
			stepCounter : 0
		};
	}

	function gatherSelectors(){
		this.dom.addStep = document.getElementById("add-step");
		this.dom.transform = document.getElementById("transform");
		this.dom.stepTmpl = document.getElementById("step-tmpl");
		this.dom.steps = document.getElementById("steps");
		this.dom.input = document.getElementById("input");
		this.dom.output = document.getElementById("output");
		this.dom.typeSelect = document.getElementById("type-select");
		this.dom.statusBar = document.getElementById("status-bar");
		this.dom.flowView = document.getElementById("flow-view");
		this.dom.save = document.getElementById("save-flow");
		this.dom.downloadFlow = document.getElementById("download-flow");
		this.dom.clear = document.getElementById("clear");
		this.dom.outputError = document.getElementById("output-error");
	}

	function attachEvents(){
		this.dom.addStep.addEventListener("click", this.addStep);
		this.dom.transform.addEventListener("click", this.transform);
		this.dom.save.addEventListener("click", this.save);
		this.dom.clear.addEventListener("click", this.clear);
		this.dom.downloadFlow.addEventListener("click", this.downloadFlow);
	}
	
	function attachSubviews(){
		this.subviews = {};
		this.subviews.statusBar = StatusBar.create({
			root : this.dom.statusBar
		});
		this.subviews.flowView = FlowView.create({
			root : this.dom.flowView,
			piplineApp : this
		});
	}

	function addStep(step){
		var stepView = StepView.create({
			model : step
		});
		this.model.steps.push(stepView);
		this.dom.steps.appendChild(stepView.dom.root);
		this.model.stepCounter++;
	}

	function transform(){
		this.dom.outputError.style.display = "none";
		var data = {
			inputType : this.dom.typeSelect.value,
			input : this.dom.input.value,
			steps : Util.arraySelect(this.model.steps, function(step){
				return step.toData();
			})
		};
		
		ProcessRunner.runProcess(data)
		.then(function(result){
			if(result.type == "text"){
				this.dom.output.value = result.value;
			}else if(result.type == "json"){
				this.dom.output.value = JSON.stringify(result.value);
			}
		}.bind(this))
		.catch(this.outputError);
	}
	
	function outputError(error){
		this.dom.outputError.style.display = "block";
		this.dom.outputError.textContent = error;
	}

	function save(){
		var data = {
			inputType : this.dom.typeSelect.value,
			input : this.dom.input.value,
			steps : Util.arraySelect(this.model.steps, function(step){
				return step.toData();
			})
		};
		
		ObjectStorage.set("last-data", data);
	}
	
	function loadData(data){
		if(!data){
			return;
		}
		this.dom.typeSelect.value = data.inputType;
		this.dom.input.value = data.input;
		for(var i = 0; i < data.steps.length; i++){
			this.addStep(data.steps[i]);
		}
	}
	
	function clear(){
		DomTools.removeChildren(this.dom.steps);
		this.model.steps = [];
		this.dom.input.value = "";
	}

	function downloadFlow(){
		var data = {
			inputType : this.dom.typeSelect.value,
			input : this.dom.input.value,
			steps : Util.arraySelect(this.model.steps, function(step){
				return step.toData();
			})
		};
		var saveString = JSON.stringify(data);
		var objectUrl = Util.stringToFileUrl(saveString);
		Util.download(objectUrl, "flow.json");
	}

	return {
		create : create
	};

})();