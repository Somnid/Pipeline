var Datafy = (function(){
  function html(html, extractionGuide){
    var data = {};
    for(var key in extractionGuide){
      data[key] = html.querySelector(extractionGuide[key]).innerText;
    }
    return data;
  }
  return {
    html : html
  };
})();