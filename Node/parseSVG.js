var getJSONFromXML = function(filePath) {
    var fs = require('fs');
    var xml2js = require('xml2js');
    var json;
    try {
        var fileData = fs.readFileSync(filePath, 'ascii');
        var parser = new xml2js.Parser();
        parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
            jsonString = JSON.stringify(result);
            json = JSON.parse(jsonString);
            //console.log(JSON.stringify(result));
        });

        //console.log("File '" + filePath + "/ was successfully read.\n");
        return json;
    } catch (ex) {console.log(ex)} 
}

var getSVGPaths = function(filePath){
    var json = getJSONFromXML(filePath);
    var rawPaths = json.svg.path;
    var trimmedPaths = [];
    
    for(var i = 0; i < rawPaths.length; i++){
        var content = rawPaths[i].$.d;        
        trimmedPaths[i] = content;
    }

    return trimmedPaths;
}

var getSVGPathInstructions = function(filePath){
    var svgPaths = getSVGPaths(filePath);
        
    var parse = require('parse-svg-path')
    var instructions = [];
    
    for(var i = 0; i < svgPaths.length; i++){
        var parsedPaths = parse(svgPaths[i]);
        for(var j = 0; j < parsedPaths.length; j++){
            var parsedPath = parsedPaths[j];
            
            instructions.push(parsedPath);   
        }
    }
    
    return instructions;
    
}

var getViewBox = function(filePath){
    var json = getJSONFromXML(filePath);
    var rawViewbox = json.svg.$.viewBox;
    var viewBoxStrings = rawViewbox.split(" ");
    var viewBox = [0, 0, 0, 0];
    
    for(var i = 0; i < 4; i++){
        viewBox[i] = parseFloat(viewBoxStrings[i]);
    }
    
    return viewBox;
}

module.exports.getSVGPathInstructions = getSVGPathInstructions;
module.exports.getViewBox = getViewBox;