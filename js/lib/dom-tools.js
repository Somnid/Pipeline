var DomTools = (function(){

  function removeChildren(element){
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createOptionList(list, valueFunc, displayFunc){
    var docFrag = document.createDocumentFragment();

    for(var i = 0; i < list.length; i++){
      var option = document.createElement("option");
      option.value = valueFunc ? valueFunc(list[i]) : list[i];
      option.textContent = displayFunc ? displayFunc(list[i]) : list[i];
      docFrag.appendChild(option);
    }
    return docFrag;
  }

  function removeElement(element){
    element.parentNode.removeChild(element);
  }

  return {
    removeChildren : removeChildren,
    removeElement : removeElement,
    createOptionsList : createOptionList
  };

})();
