var flowProto = Object.create(HTMLElement.prototype);

flowProto.ownerDoc = document.currentScript.ownerDocument;
flowProto.createdCallback = function(){
  FlowView.create(this);
};

document.registerElement("flow-view", {
  prototype : flowProto
});

var FlowView = (function(){

	function create(flowView){
		flowView.dom = {};
		bind(floView);
		flowView.init();
		return flowView;
	}

	function bind(flowView){
	  flowView.init = init.bind(flowView);
	}

	function init(){

	}

	return {
	  create : create
	};

})();
