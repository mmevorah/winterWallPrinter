//
//  Fresco.h
//  FrescoArduinoLib
//
//  Created by Mark Mevorah on 12/26/13.
//  Copyright (c) 2013 Mark Mevorah. All rights reserved.
//

#ifndef Fresco_h
#define Fresco_h

#include "Arduino.h"

class Fresco{
    int canvasWidth;
    int canvasHeight;
    int stepsPerUnitLength;
    
    int currentXLeft;
    int currentYLeft;
    int currentXRight;
    int currentYRight;
    
    int pinDirLeft;
    int pinStpLeft;
    int pinDirRight;
    int pinStpRight;
public:
    Fresco(int pinDirLeft_,
           int pinStpLeft_,
           int pinDirRight_,
           int pinStpRight_,
           int canvasWidth_,
           int canvasHeight_)
    
    void moveToPoint(int x, int y);
};

#endif
