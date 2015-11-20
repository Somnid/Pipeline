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
		pipelineApp.installServiceWorker = installServiceWorker.bind(pipelineApp);
		pipelineApp.serviceWorkerInstalled = serviceWorkerInstalled.bind(pipelineApp);
		pipelineApp.serviceWorkerInstallFailed = serviceWorkerInstallFailed.bind(pipelineApp);
		pipelineApp.gatherSelectors = gatherSelectors.bind(pipelineApp);
		pipelineApp.templateDom = templateDom.bind(pipelineApp);
		pipelineApp.setupModel = setupModel.bind(pipelineApp);
		pipelineApp.attachEvents = attachEvents.bind(pipelineApp);
		pipelineApp.addStep = addStep.bind(pipelineApp);
		pipelineApp.transform = transform.bind(pipelineApp);
		pipelineApp.attachSubviews = attachSubviews.bind(pipelineApp);
		pipelineApp.loadData = loadData.bind(pipelineApp);
		pipelineApp.loadFlow = loadFlow.bind(pipelineApp);
		pipelineApp.save = save.bind(pipelineApp);
		pipelineApp.clear = clear.bind(pipelineApp);
		pipelineApp.downloadFlow = downloadFlow.bind(pipelineApp);
		pipelineApp.outputError = outputError.bind(pipelineApp);
		pipelineApp.dragover = dragover.bind(pipelineApp);
		pipelineApp.tabHandler = tabHandler.bind(pipelineApp);
	}

	function init(){
		this.installServiceWorker();
		this.gatherSelectors();
		this.attachEvents();
		this.setupModel();
		this.templateDom();
		this.attachSubviews();

		this.loadData(ObjectStorage.get("last-data"));
	}

	function installServiceWorker(){
		if("serviceWorker" in navigator){
			navigator.serviceWorker.register("service-worker.js", {scope: "./"})
				.then(this.serviceWorkerInstalled)
				.catch(this.serviceWorkerInstallFailed);
		}
	}

	function serviceWorkerInstalled(registration){
		console.log("App Service registration successful with scope:", registration.scope);
	}

	function serviceWorkerInstallFailed(error){
		console.error("App Service failed to install", error);
	}

	function setupModel(){
		this.model = {
			steps : [],
			stepCounter : 0
		};
	}

	function templateDom(){
		var selectTransform = document.querySelector("#step-tmpl").content.querySelector(".transform-select");
		var optionList = DomTools.createOptionsList(Object.keys(Transform))
		selectTransform.appendChild(optionList);
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
		this.dom.copy = document.getElementById("copy");
	}

	function attachEvents(){
		this.dom.addStep.addEventListener("click", this.addStep);
		this.dom.transform.addEventListener("click", this.transform);
		this.dom.save.addEventListener("click", this.save);
		this.dom.clear.addEventListener("click", this.clear);
		this.dom.downloadFlow.addEventListener("click", this.downloadFlow);
		this.dom.flowView.addEventListener("dragover", this.dragover);
		this.dom.flowView.addEventListener("drop", this.loadFlow);
		this.dom.input.addEventListener("keydown", this.tabHandler);
		this.dom.copy.addEventListener("click", Util.copy.bind(this.dom.output));
	}

	function attachSubviews(){
		this.subviews = {};
		this.subviews.statusBar = StatusBar.create({
			root : this.dom.statusBar
		});
		this.subviews.flowView = FlowView.create({
			root : this.dom.flowView,
			pipelineApp : this
		});
	}

	function tabHandler(e){
		var TABKEY = 9;
		if(e.keyCode == TABKEY) {
			Util.insertAtCursor(e.target, "\t");
			if(e.preventDefault) {
				e.preventDefault();
			}
			return false;
		}
	}

	function addStep(step){
		var stepView = StepView.create({
			model : step
		});
		this.model.steps.push(stepView);
		stepView.appendTo(this.dom.steps);
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
			.then(result => {
				if(result.type == "text"){
					this.dom.output.value = result.value;
				}else if(result.type == "json"){
					this.dom.output.value = JSON.stringify(result.value);
				}
			})
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

	function dragover(e){
		e.preventDefault();
		this.dom.flowView.classList.add("file-over");
	}
	function dragleave(e){
		e.preventDefault();
		this.dom.flowView.classList.remove("file-over");
	}
	function loadFlow(e){
		e.preventDefault();
		Util.readAsJson(e.dataTransfer.files[0])
			.then(json => {
				this.clear();
				this.loadData(json);
			});
		this.dom.flowView.classList.remove("file-over");
	}

	return {
		create : create
	};

})();
