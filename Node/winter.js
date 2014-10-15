//Includes
var j5 = require("johnny-five");
var svgParser = require('./parseSVG.js');
var Raphael = require("raphael-browserify");

//SVG
//Required that this is preformatted to the correct size of the
//canvas
var svgFileName = "test-01.svg";

//Hardware
//var board = new j5.Board();
var brushAgainstWall = false;

//Get Offsets, should add these values to coordinate 
//system to account for the svg ViewBox
var viewBox = svgParser.getViewBox(svgFileName);
var SVG_OFFSET_X = viewBox[0] * -1;
var SVG_OFFSET_Y = viewBox[1] * -1;

//Geometry
var PTS_PER_INCH = 72;
var CANVAS_HEIGHT = 34 * PTS_PER_INCH;  //On my wall 34in
var CANVAS_WIDTH =  24 * PTS_PER_INCH;   //On my wall 24in
var X_Current = ( CANVAS_WIDTH / 2 );
var Y_Current = CANVAS_HEIGHT;

var PIXEL_PER_MM = 2.834645669; 
var PI = Math.PI;
var PULLEY_DIAMETER = 10; //mm
var STEPS_PER_ROTATION = 200;
var PIXELS_PER_STEP = ((PULLEY_DIAMETER * PI) * PIXEL_PER_MM)/STEPS_PER_ROTATION;


//SVG origin is upper left hand corner
//Values increase down and to the right
var getLeftLength = function(x, y) {
    var adjX = x + SVG_OFFSET_X;
    var adjY = y + SVG_OFFSET_Y;
    var length = Math.sqrt(Math.pow(adjX, 2) + Math.pow(adjY, 2));
    return length;
}

var getRightLength = function(x, y) {
    var adjX = x + SVG_OFFSET_X;
    var adjY = y + SVG_OFFSET_Y;
    var length = Math.sqrt(Math.pow(CANVAS_WIDTH - adjX, 2) + Math.pow(adjY, 2));
    return length;
}

function MoveBrushAwayFromWall(){
    console.log("Moving Brush Away From Wall");
}

function MoveBrushTowardsWall(){
    console.log("Moving Bush Towards Wall");
}

function MoveBrushTo(endX, endY){
    
    var X_Next = endX;
    var Y_Next = endY;
    
    //Get lengths
    
    console.log("Moving from (", X_Current, ", ", Y_Current,") to (", X_Next, ", ", Y_Next, ")");
    
    
    X_Current = X_Next;
    Y_Current = Y_Next;
    
}


function PaintInstruction(instruction){
 
    var currentLengthLeft = getLeftLength(X_Current, Y_Current);
    var currentLengthRight = getRightLength(X_Current, Y_Current);
    
    var deltaLengthLeft = 0;
    var deltaLengthRight = 0;
    
    //Prepare instruction to get length
    var instructionStr = instruction.join();
    
    //MCurrentX,CurrentY
    var dummyMove = 'M'.concat(X_Current).concat(',').concat(Y_Current);
    //MCurrentX,CurrentY,instr
    var path = dummyMove.concat(instructionStr);
    var pathLength = Raphael.getTotalLength(path);
    
    var endPoint = Raphael.getPointAtLength(path, pathLength);
    console.log("Moving from (", X_Current, ", ", Y_Current,") to (", endPoint.x, ", ", endPoint.y, ")");    
    
    
    //Traverse path pt by pt
    for(var i = 0; i < pathLength; i += PIXEL_PER_MM){
        var pointOnPath = Raphael.getPointAtLength(path, i);
        
        var nextLengthLeft = getLeftLength(pointOnPath.x, pointOnPath.y);
        var nextLengthRight = getRightLength(pointOnPath.x, pointOnPath.y);
        
        deltaLengthLeft = nextLengthLeft - currentLengthLeft;
        deltaLengthRight = nextLengthRight - currentLengthRight;
        
        var moveCW_Left = true;
        var moveCW_Right = false;
        if(deltaLengthLeft > 0){
            moveCW_Left = false;   
        }
        
        if(deltaLengthRight > 0){
            moveCW_Right = true;
        }
        
        var stepsLeft = Math.abs(deltaLengthLeft / PIXELS_PER_STEP);
        var stepsRight = Math.abs(deltaLengthRight / PIXELS_PER_STEP);
        
        var stepsLeft_LeftOver = stepsLeft - Math.floor(stepsLeft);
        stepsLeft = Math.floor(stepsLeft);
        if(stepsLeft_LeftOver > .5){
            stepsLeft = Math.ceil(stepsLeft);   
        }
        
        var stepsRight_RightOver = stepsRight - Math.floor(stepsRight);
        stepsRight = Math.floor(stepsRight); 
        if(stepsRight_RightOver > .5){
            stepsRight = Math.ceil(stepsRight);   
        }
        
        //console.log('stepsLeft:',stepsLeft);
        //console.log('stepsRight:', stepsRight);
        
        //Step here
        
        //console.log('Moving from (',X_Current,', ',Y_Current,') to (', pointOnPath.x, ', ', pointOnPath.y, ' )');
        
        currentLengthLeft = nextLengthLeft;
        currentLengthRight = nextLengthRight;
        X_Current = pointOnPath.x;
        Y_Current = pointOnPath.y;
    }

}


var instructions = svgParser.getSVGPathInstructions(svgFileName);

for(var i = 0; i < instructions.length; i++){
    var instruction = instructions[i];
    
    var instructionType = instruction[0];
    switch(instructionType){
        case 'M':
            MoveBrushAwayFromWall();
            console.log("Move Absolute");
            MoveBrushTo(instruction[1], instruction[2]);
            break;
        case 'm':
            MoveBrushAwayFromWall();
            console.log("Move Relative");
            MoveBrushTo(instruction[1] + X_Current, instruction[2] + Y_Current);
            break;
         case 'L':
            MoveBrushTowardsWall();
            console.log("Line Absolute");
            break;
        case 'l':
            MoveBrushTowardsWall();
            console.log("Line Relative");
            break;
        case 'C':
            MoveBrushTowardsWall();
            console.log("Curve Absolute");
            PaintInstruction(instruction);
            break;
        case 'c':
            MoveBrushTowardsWall();
            console.log("Curve Relative");
            PaintInstruction(instruction);
            break;
    }  
    
}