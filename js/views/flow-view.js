var flowProto = Object.create(HTMLElement.prototype);

flowProto.ownerDoc = document.currentScript.ownerDocument;
flowProto.createdCallback = function(){
  FlowView.create(this);
};

document.registerElement("flow-view", {
  prototype : flowProto
});

var FlowView = (function(){

	var defaults = {
		root : null, //required
		pipelineApp : null //required
	};

	function create(options){
		var flowView = {};
		flowView.options = Util.extend({}, defaults, options);
		bind(flowView);
		flowView.init();
		return flowView;
	}

	function bind(flowView){
		flowView.cacheDom = cacheDom.bind(flowView);
		flowView.init = init.bind(flowView);
		flowView.attachEvents = attachEvents.bind(flowView);
	}
	
	function cacheDom(){
		this.dom = {};
		this.dom.root = this.options.root;
	}
	
	function attachEvents(){

	}

	function init(){
		this.cacheDom();
		this.attachEvents();
	}

	return {
	  create : create
	};

})();
