//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later

"use strict";
var oNIB = {};

oNIB.createMorals = function() {
    var iRoll = oNIB.roll(100);
    var sMorals = ""
    if (iRoll < 51) {
        sMorals = "Good";
    } else if (iRoll < 91) {
        sMorals = "Neutral";
    } else {
        sMorals = "Evil";
    }
    oNIB.oCharacter["sAlignment"] = sMorals;
};

oNIB.oCharacter = {};

oNIB.printCharacter = function() {
    var sAlignment = oNIB.oCharacter.sAlignment;
    var alignment = $("<p></p>")
        .attr('id', 'alignment')
        .text(("Alignment: " + sAlignment));
    var body = $("#body").append(alignment);
};

oNIB.roll = function(die) {
    return Math.round(Math.random() * (die - 1)) + 1;
};

oNIB.createMorals();
oNIB.printCharacter();
