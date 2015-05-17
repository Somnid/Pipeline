var DomTools = (function(){
  
  function removeChildren(element){
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  
  return {
    removeChildren : removeChildren
  };
  
})();