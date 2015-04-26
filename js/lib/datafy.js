var Datafy = (function(){
  function html(html, extractionGuide){
    var data = {};
    for(var key in extractionGuide){
      data[key] = extractValue(html, extractionGuid[key]);
    }
    return data;
  }
  function extractValueOrArray(html, extractionGuide){
	if(Array.isArray(extractionGuide)){
		return extractArray(html, extractionGuide);
	}else{
		return extractValue(html, extractionGuide);
	}
  }
  function extractValue(html, extractionGuide){
	var attrSplit = extractionGuide.split("!");
	if(attrSplit.length == 1){
		return html.querySelector(attrSplit[0]).textContent;
	}else if(attrSplit.length == 2){
		return html.querySelector(attrSplit[0]).getAttribute(attrSplit[1]);
	}
  }
  function extractArray(html, extractionGuide){
	var attrSplit = extractionGuide[0].split("!");
	if(attrSplit.length == 1){
		var elements = html.querySelectorAll(attrSplit[0]);
		var valueArray = [];
		for(var i = 0; i < elements.length; i++){
			valueArray.push(elements[i].textContent);
		}
		return valueArray;
	}else if(attrSplit.length == 2){
		var elements = html.querySelectorAll(attrSplit[0]);
		var valueArray = [];
		for(var i = 0; i < elements.length; i++){
			valueArray.push(elements[i].getAttribute(attrSplit[1]));
		}
		return valueArray;
	}
  }
  return {
    html : html,
	_extractValueOrArray : extractValueOrArray
  };
})();