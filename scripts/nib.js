//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later

"use strict";
var oNIB = {};

oNIB.createClass = function() {
    var oCharacter = oNIB.oCharacter;
    var sMorals = oCharacter.sAlignment;
    var iRoll= oNIB.roll(100);
    var sClass = "";
    if (sMorals === "Good") {
        if (iRoll < 6) {
            sClass = "Barbarian";
        } else if (iRoll < 11) {
            sClass = "Bard";
        } else if (iRoll < 31) {
            sClass = "Cleric";
        } else if (iRoll < 36) {
            sClass = "Druid";
        } else if (iRoll < 46) {
            sClass = "Fighter";
        } else if (iRoll < 51) {
            sClass = "Monk";
        } else if (iRoll < 56) {
            sClass = "Paladin";
        } else if (iRoll < 66) {
            sClass = "Ranger";
        } else if (iRoll < 76) {
            sClass = "Rogue";
        } else if (iRoll < 81) {
            sClass = "Sorcerer";
        } else {
            sClass = "Wizard";
        }
    }
    if (sMorals === "Neutral") {
        if (iRoll < 6) {
            sClass = "Barbarian";
        } else if (iRoll < 11) {
            sClass = "Bard";
        } else if (iRoll < 16) {
            sClass = "Cleric";
        } else if (iRoll < 26) {
            sClass = "Druid";
        } else if (iRoll < 46) {
            sClass = "Fighter";
        } else if (iRoll < 51) {
            sClass = "Monk";
        } else if (iRoll < 56) {
            sClass = "Ranger";
        } else if (iRoll < 76) {
            sClass = "Rogue";
        } else if (iRoll < 81) {
            sClass = "Sorcerer";
        } else {
            sClass = "Wizard";
        }
    }
    if (sMorals === "Evil") {
        if (iRoll < 11) {
            sClass = "Barbarian";
        } else if (iRoll < 16) {
            sClass = "Bard";
        } else if (iRoll < 36) {
            sClass = "Cleric";
        } else if (iRoll < 41) {
            sClass = "Druid";
        } else if (iRoll < 51) {
            sClass = "Fighter";
        } else if (iRoll < 56) {
            sClass = "Monk";
        } else if (iRoll < 61) {
            sClass = "Ranger";
        } else if (iRoll < 81) {
            sClass = "Rogue";
        } else if (iRoll < 86) {
            sClass = "Sorcerer";
        } else {
            sClass = "Wizard";
        }
    }
    oCharacter["sClass"] = sClass;
};

oNIB.createMorals = function() {
    var iRoll = oNIB.roll(100);
    var sMorals = "";
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
    var sClass = oNIB.oCharacter.sClass;
    var characterClass = $("<p></p>")
        .attr('id', 'class')
        .text(("Class: " + sClass));
    var body = $("#body")
        .append(alignment)
        .append(characterClass);
};

oNIB.roll = function(die) {
    return Math.round(Math.random() * (die - 1)) + 1;
};

oNIB.createMorals();
oNIB.createClass();
oNIB.printCharacter();
