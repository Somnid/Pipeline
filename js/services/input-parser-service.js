var InputParserService = (function(){

  var inputParserMap = {
    json : parseAsJson,
    text : parseAsTextLines,
    csv : parseAsCsv,
    tsv : parseAsTsv
  };

  function create(){
    var inputParserService = {};
    bind(inputParserService);
    return inputParserService;
  }

  function bind(inputParserService){
    inputParserService.parseAsJson = parseAsJson.bind(inputParserService);
    inputParserService.parseAsCsv = parseAsCsv.bind(inputParserService);
    inputParserService.parseAsTsv = parseAsTsv.bind(inputParserService);
    inputParserService.parseAsTextLines = parseAsTextLines.bind(inputParserService);
    inputParserService.inputToArray = inputToArray.bind(inputParserService);
  }

  function inputToArray(input, format){
    try{
      return inputParserMap[format](input);
    }catch(e){
      console.error("unknown data type", format, input);
    }
  }

  function parseAsJson(input){
    if(typeof(input) == "object"){
      return input;
    }
    return JSON.parse(input);
  }

  function parseAsTextLines(input){
    return input.split("\n");
  }

  function parseAsCsv(){
    return DataTools.csvToArray(input);
  }

  function parseAsTsv(input){
    return DataTools.tsvToArray(input);
  }

  return {
    create : create
  };

})();
