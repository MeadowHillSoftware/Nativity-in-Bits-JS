//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later
//
//
//
"use strict";
var oNIB = {};

oNIB.addMainEventListeners = function() {
    $('#birthright')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#blackmoor')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#council')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#dark')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#dragonlance')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#eberron')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#fist')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#generate')
        .on('click', oNIB.handleGenerateButton);
    $('#generic')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#ghostwalk')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#greyhawk')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#jakandor')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#lankhmar')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#mahasarpa')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#mystara')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#npc')
        .on('click', oNIB.handleTypeCheckboxes);
    $('#pc')
        .on('click', oNIB.handleTypeCheckboxes);
    $('#pelinore')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#planescape')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#ravenloft')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#realms')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#rokugan')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#spelljammer')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#warcraft')
        .on('click', oNIB.handleSettingCheckboxes);
    $('#wilderlands')
        .on('click', oNIB.handleSettingCheckboxes);
};

oNIB.addNeutralEthics = function(sMorals) {
    if (sMorals === "Neutral") {
        oNIB.oCharacter.sAlignment = "True Neutral";
    } else {
        oNIB.oCharacter.sAlignment = "Neutral " + sMorals;
    }
};

oNIB.analyzeCommunity = function(oSetting, sArea) {
    var oArea = oSetting[sArea];
    var aPlurality = [];
    var iHighest = 0
    var sType = oArea.sType;
    var aProperties = Object.keys(oArea);
    for (var p = 0; p < aProperties.length; p++) {
        var sProperty = aProperties[p];
        if (sProperty[0] !== "i" && sProperty[0] !== "s" && sProperty[0] !== "o") {
            var iPercentage = oArea[sProperty];
            if (iPercentage > iHighest) {
                aPlurality = [sProperty];
            } else if (iPercentage === iHighest) {
                aPlurality.push(sProperty);
            }
        }
    }
    var oCharacter = oNIB.oCharacter;
    var sRace = oCharacter.sRace;
    if (iHighest === 0) {
        aPlurality = ["Human"];
    }
    var iIndex = oNIB.roll(aPlurality.length);
    iIndex--;
    var sPlurality = aPlurality[iIndex];
    var iPopulation = oArea.iPopulation;
    var sSize = "";
    if (sType === "compound") {
        sSize = "Religious, Arcane, Monastic, or Military Compound";
    } else {
        if (iPopulation < 20) {
            sSize = "Frontier Homestead";
        } else if (iPopulation < 81) {
            if (sPlurality === "Dwarf") {
                sSize = "Fortress";
            } else if (sPlurality === "Elf") {
                sSize = "Camp";
            } else {
                sSize = "Thorp";
            }
        } else if (iPopulation < 401) {
            if (sPlurality === "Dwarf") {
                sSize = "Citadel";
            } else if (sPlurality === "Elf") {
                sSize = "Outpost";
            } else {
                sSize = "Hamlet";
            }
        } else if (iPopulation < 901) {
            sSize = "Village";
        } else if (iPopulation < 2001) {
            sSize = "Small Town";
        } else if (iPopulation < 5001) {
            sSize = "Large Town";
        } else if (iPopulation < 12001) {
            sSize = "Small City";
        } else if (iPopulation < 25001) {
            sSize = "Large City";
        } else {
            sSize = "Metropolis";
        }
    }
    if (sRace !== sPlurality) {
        oCharacter.sCommunity = sPlurality + " Community: " + sSize;
    } else {
        oCharacter.sCommunity = sSize;
    }
};

oNIB.checkForDemographics = function(oSetting) {
    var aProperties = Object.keys(oSetting);
    var aNonDemographic = ["iPopulation", "sSource", "sType"];
    var iCorrect = 0;
    for (var p = 0; p < aProperties.length; p++) {
        var sName = aProperties[p];
        if (sName[0] !== "a") {
            var oObject = oSetting[sName];
            var aInfo = Object.keys(oObject);
            for (var i = 0; i < aInfo.length; i++) {
                var sInfo = aInfo[i];
                if (aNonDemographic.indexOf(sInfo) === -1) {
                    if (aInfo.indexOf("other") === -1) {
                        console.log(sName);
                    } else {
                        iCorrect++
                    }
                }
            }
        }
    }
};

oNIB.checkForSpecialization = function() {
    var oCharacter = oNIB.oCharacter;
    var sRace = oCharacter.sRace;
    var iRoll = oNIB.roll(85);
    if (sRace === "Gnome") {
        if (iRoll < 66) {
            oCharacter.sClass = "Illusionist";
        } else {
            iRoll = oNIB.roll(85);
            if (iRoll > 65) {
                oNIB.createSpecialistWizard();
            }
        }
    } else {
        if (iRoll > 65) {
            oNIB.createSpecialistWizard();
        }
    }
};

oNIB.createAge = function() {
    var oBaseAges = {
        "iDwarf": 40,
        "iElf": 110,
        "iGnome": 40,
        "iHalf-Elf": 20,
        "iHalfling": 20,
        "iHalf-Orc": 14,
        "iHuman": 15
    };
    var oCharacter = oNIB.oCharacter;
    var sClass = oCharacter.sClass;
    var sRace = oCharacter.sRace;
    var iNumber = 0;
    var iDie = 0;
    if (sClass === ("Barbarian" || "Rogue" || "Sorcerer")) {
        if (sRace === ("Human" || "Half-Orc")) {
            iNumber = 1;
            iDie = 4;
        } else if (sRace === "Dwarf") {
            iNumber = 3;
            iDie = 6;
        } else if (sRace === ("Elf" || "Gnome")) {
            iNumber = 4;
            iDie = 6;
        } else if (sRace === "Half-Elf") {
            iNumber = 1;
            iDie = 6;
        } else {
            iNumber = 2;
            iDie = 4;
        }
    } else if (sClass === ("Bard" || "Fighter" || "Paladin" || "Ranger")) {
        if (sRace === ("Human" || "Half-Orc")) {
            iNumber = 1;
            iDie = 6;
        } else if (sRace === "Dwarf") {
            iNumber = 5;
            iDie = 6;
        } else if (sRace === ("Elf" || "Gnome")) {
            iNumber = 6;
            iDie = 6;
        } else if (sRace === "Half-Elf") {
            iNumber = 2;
            iDie = 6;
        } else {
            iNumber = 3;
            iDie = 6;
        }
    } else {
        if (sRace === ("Human" || "Half-Orc")) {
            iNumber = 2;
            iDie = 6;
        } else if (sRace === "Dwarf") {
            iNumber = 7;
            iDie = 6;
        } else if (sRace === "Elf") {
            iNumber = 10;
            iDie = 6;
        } else if (sRace === "Gnome") {
            iNumber = 9;
            iDie = 6;
        } else if (sRace === "Half-Elf") {
            iNumber = 3;
            iDie = 6;
        } else {
            iNumber = 4;
            iDie = 6;
        }
    }
    var iRoll = oNIB.roll(iDie, iNumber);
    var iAge = oBaseAges[("i" + sRace)] + iRoll;
    oCharacter.sAge = String(iAge);
};

oNIB.createAncestorsOfNote = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sAncestors = "";
    if (iRoll < 50) {
        sAncestors = "None";
    } else if (iRoll < 56) {
        sAncestors = "Forgotten";
    } else if (iRoll < 61) {
        sAncestors = "Immigrant";
    } else if (iRoll < 64) {
        sAncestors = "Master Artisan";
    } else if (iRoll < 67) {
        sAncestors = "Successful Merchant";
    } else if (iRoll < 70) {
        sAncestors = "Unsuccessful Merchant";
    } else if (iRoll < 73) {
        sAncestors = "Cleric";
    } else if (iRoll < 76) {
        sAncestors = "Arcanist";
    } else if (iRoll < 78) {
        sAncestors = "Magic Item";
    } else if (iRoll < 79) {
        sAncestors = "Spell Creator";
    } else if (iRoll < 80) {
        sAncestors = "Item Creator";
    } else if (iRoll < 82) {
        sAncestors = "Victorious Hero";
    } else if (iRoll < 84) {
        sAncestors = "Defeated Hero";
    } else if (iRoll < 85) {
        sAncestors = "Successful Founder";
    } else if (iRoll < 86) {
        sAncestors = "Unsuccessful Founder";
    } else if (iRoll < 87) {
        sAncestors = "Successful Leader";
    } else if (iRoll < 88) {
        sAncestors = "Unsuccessful Leader";
    } else if (iRoll < 91) {
        sAncestors = "Successful Hero";
    } else if (iRoll < 92) {
        sAncestors = "Disbelieved Hero";
    } else if (iRoll < 93) {
        sAncestors = "False Hero";
    } else if (iRoll < 94) {
        sAncestors = "Exile";
    } else if (iRoll < 95) {
        sAncestors = "Failed Rebel";
    } else if (iRoll < 96) {
        sAncestors = "Traitor";
    } else if (iRoll < 97) {
        sAncestors = "Cultist";
    } else if (iRoll < 98) {
        sAncestors = "Villain";
    } else if (iRoll < 99) {
        sAncestors = "Prophecy";
    } else if (iRoll < 100) {
        sAncestors = "God-Touched";
    } else {
        sAncestors = "Otherworldly";
    }
    oCharacter.sAncestorsOfNote = sAncestors;
};

oNIB.createArchetype = function() {
    var oCharacter = oNIB.oCharacter;
    var sClass = oCharacter.sClass;
    var aWizards = [
        "Abjurer",
        "Conjurer",
        "Diviner",
        "Enchanter", 
        "Evoker", 
        "Illusionist", 
        "Necromancer", 
        "Transmuter", 
        "Wizard"
    ];
    var oArchetypes = {
        "aBarbarian": [
            "Challenger", 
            "Explorer", 
            "Mercenary", 
            "Orphan", 
            "Renegade", 
            "Savage", 
            "Seeker", 
            "Simple Soul", 
            "Wanderer"
        ], 
        "aBard": [
            "Agent", 
            "Daredevil", 
            "Explorer", 
            "Innocent", 
            "Mercenary", 
            "Orphan", 
            "Rebel", 
            "Renegade", 
            "Royalty", 
            "Trickster", 
            "Wanderer"
        ], 
        "aCleric": [
            "Agent", 
            "Companion", 
            "Crusader", 
            "Innocent", 
            "Leader", 
            "Martyr", 
            "Orphan", 
            "Prophet", 
            "Royalty", 
            "Sage", 
            "Seeker", 
            "Simple Soul", 
            "Theorist"
        ], 
        "aDruid": [
            "Agent", 
            "Crusader", 
            "Explorer", 
            "Innocent", 
            "Martyr", 
            "Orphan", 
            "Prophet", 
            "Renegade", 
            "Sage", 
            "Savage", 
            "Wanderer"
        ], 
        "aFighter": [
            "Challenger", 
            "Companion", 
            "Leader", 
            "Martyr", 
            "Mercenary", 
            "Orphan", 
            "Rebel", 
            "Renegade", 
            "Royalty", 
            "Seeker", 
            "Simple Soul", 
            "Strategist", 
            "Theorist"
        ], 
        "aMonk": [
            "Agent", 
            "Challenger", 
            "Companion", 
            "Crusader", 
            "Innocent", 
            "Martyr", 
            "Orphan", 
            "Prophet", 
            "Seeker", 
            "Wanderer"
        ], 
        "aPaladin": [
            "Agent", 
            "Companion", 
            "Crusader", 
            "Leader", 
            "Martyr", 
            "Prophet", 
            "Royalty", 
            "Strategist"
        ], 
        "aRanger": [
            "Agent", 
            "Explorer", 
            "Orphan", 
            "Savage", 
            "Seeker", 
            "Wanderer"
        ], 
        "aRogue": [
            "Agent", 
            "Challenger", 
            "Daredevil", 
            "Explorer", 
            "Mercenary", 
            "Orphan", 
            "Rebel", 
            "Renegade", 
            "Simple Soul", 
            "Strategist", 
            "Trickster", 
            "Wanderer"
        ], 
        "aSorcerer": [
            "Companion", 
            "Daredevil", 
            "Innocent", 
            "Mercenary", 
            "Orphan", 
            "Renegade", 
            "Royalty", 
            "Sage", 
            "Seeker", 
            "Simple Soul", 
            "Wanderer"
        ], 
        "aWizard": [
            "Agent", 
            "Challenger", 
            "Crusader", 
            "Innocent", 
            "Mercenary", 
            "Renegade", 
            "Royalty", 
            "Sage", 
            "Seeker", 
            "Strategist", 
            "Theorist"
        ], 
        "aAll": [
            "Agent", 
            "Challenger", 
            "Companion", 
            "Crusader", 
            "Daredevil", 
            "Explorer", 
            "Innocent", 
            "Leader", 
            "Martyr", 
            "Mercenary", 
            "Orphan", 
            "Prophet", 
            "Rebel", 
            "Renegade", 
            "Royalty", 
            "Sage", 
            "Savage", 
            "Seeker", 
            "Simple Soul", 
            "Strategist", 
            "Theorist", 
            "Trickster", 
            "Wanderer"
        ]
    };
    if (aWizards.indexOf(sClass) !== -1) {
        if (sClass === "Illusionist") {
            oArchetypes["aWizard"].push("Trickster");
        }
        var aCommonArchetypes = oArchetypes["aWizard"]
    } else {
        var aCommonArchetypes = oArchetypes[("a" + sClass)];
    }
    if (aCommonArchetypes === undefined) {
        if (sClass === "Warrior") {
            var aCommonArchetypes = oArchetypes["aFighter"];
        } else {
            var aCommonArchetypes = oArchetypes["aAll"];
        }
    }
    var iRoll = oNIB.roll(85);
    if (iRoll < 66) {
        iRoll = oNIB.roll(aCommonArchetypes.length);
        iRoll--;
        oCharacter.sArchetype = aCommonArchetypes[iRoll];
    } else {
        var aAllArchetypes = oArchetypes["aAll"];
        var aNPCClasses = ["Adept", "Aristocrat", "Commoner", "Expert"];
        if (aNPCClasses.indexOf(sClass) === -1) {
            var aUncommonArchetypes = [];
            for (var a = 0; a < aAllArchetypes.length; a++) {
                var sArchetype = aAllArchetypes[a];
                if (aCommonArchetypes.indexOf(sArchetype) === -1) {
                    aUncommonArchetypes.push(sArchetype);
                }
            }
        } else {
            var aUncommonArchetypes = aAllArchetypes;
        }
        iRoll = oNIB.roll(aUncommonArchetypes.length);
        iRoll--;
        oCharacter.sArchetype = aUncommonArchetypes[iRoll];
    }
};

oNIB.createClass = function() {
    if ($('#' + 'pc').is(":checked")) {
        oNIB.createPCClass();
    } else {
        oNIB.createNPCClass();
    }
};

oNIB.createCommunity = function() {
    var oCharacter = oNIB.oCharacter;
    var sRace = oCharacter.sRace;
    var iRoll = 0;
    var sCommunity = "";
    if (sRace === "Dwarf") {
        iRoll = oNIB.roll(10);
        if (iRoll < 10) {
            sCommunity = oNIB.createDwarvenCommunity();
        } else {
            sCommunity = oNIB.createHumanCommunity();
            sCommunity = "Human Area: " + sCommunity;
        }
    } else if (sRace === "Elf") {
        iRoll = oNIB.roll(20);
        if (iRoll < 20) {
            sCommunity = oNIB.createElvenCommunity();
        } else {
            sCommunity = oNIB.createHumanCommunity();
            sCommunity = "Human Area: " + sCommunity;
        }
    } else if (sRace === "Gnome") {
        iRoll = oNIB.roll(10);
        if (iRoll < 8) {
            sCommunity = oNIB.createGnomishCommunity();
        } else if (iRoll < 9) {
            sCommunity = oNIB.createDwarvenCommunity();
            sCommunity = "Dwarven Area: " + sCommunity;
        } else if (iRoll < 10) {
            sCommunity = oNIB.createElvenCommunity();
            sCommunity = "Elven Area: " + sCommunity;
        } else {
            sCommunity = oNIB.createHumanCommunity();
            sCommunity = "Human Area: " + sCommunity;
        }
    } else if (sRace === "Half-Elf") {
        iRoll = oNIB.roll(100);
        if (iRoll < 21) {
            sCommunity = "Fringe Community";
        } else if (iRoll < 86) {
            sCommunity = oNIB.createHumanCommunity();
            sCommunity = "Human Area: " + sCommunity;
        } else {
            sCommunity = oNIB.createElvenCommunity();
            sCommunity = "Elven Area: " + sCommunity;
        }
    } else if (sRace === "Halfling") {
        iRoll = oNIB.roll(20);
        if (iRoll < 20) {
            sCommunity = oNIB.createHinCommunity();
        } else {
            sCommunity = oNIB.createHumanCommunity();
            sCommunity = "Human Area: " + sCommunity;
        }
    } else if (sRace === "Half-Orc") {
        iRoll = oNIB.roll(100);
        if (iRoll < 21) {
            sCommunity = "Fringe Community";
        } else if (iRoll < 86) {
            sCommunity = oNIB.createHumanCommunity();
            sCommunity = "Human Area: " + sCommunity;
        } else {
            sCommunity = "Orc-Dominated Area";
        }
    } else if (sRace === "Human") {
        sCommunity = oNIB.createHumanCommunity();
    }
    oCharacter.sCommunity = sCommunity;
};

oNIB.createCommunityString = function(sCommunity, oAreaObject) {
    var aHistory = oAreaObject.aHistory;
    for (var a = 0; a < aHistory.length; a++) {
        var sArea = aHistory[a];
        if (sArea.indexOf("(undefined)") === -1) {
            sCommunity += (" (" + sArea + ")");
        }
    }
    oNIB.oCharacter.sCommunity = sCommunity;
};

oNIB.createDwarvenCommunity = function() {
    var iRoll = oNIB.roll(100);
    var sCommunity = ""
    if (iRoll < 11) {
        sCommunity = "Fortress";
    } else if (iRoll < 21) {
        sCommunity = "Citadel";
    } else if (iRoll < 36) {
        sCommunity = "Village";
    } else if (iRoll < 51) {
        sCommunity = "Small Town";
    } else if (iRoll < 76) {
        sCommunity = "Large Town";
    } else if (iRoll < 86) {
        sCommunity = "Small City";
    } else if (iRoll < 96) {
        sCommunity = "Large City";
    } else {
        sCommunity = "Metropolis";
    }
    return sCommunity;
};

oNIB.createDwarvenEthics = function(sMorals) {
    var iRoll = oNIB.roll(96);
    if (iRoll < 66) {
        oNIB.oCharacter.sAlignment = "Lawful " + sMorals;
    } else if (iRoll < 86) {
        oNIB.addNeutralEthics(sMorals);
    } else {
        oNIB.oCharacter.sAlignment = "Chaotic " + sMorals;
    }
};

oNIB.createEarlyChildhoodEvents = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sEvent = "";
    if (iRoll < 16) {
        sEvent = "Survived Childhood Danger";
    } else if (iRoll < 31) {
        sEvent = "Survived Major Danger to Community";
    } else if (iRoll < 46) {
        sEvent = "Undertook a Long Journey";
    } else if (iRoll < 56) {
        sEvent = "Witness";
    } else if (iRoll < 61) {
        sEvent = "Astronomical Event";
    } else if (iRoll < 66) {
        sEvent = "Personal Epiphany";
    } else if (iRoll < 76) {
        sEvent = "Became a Refugee";
    } else if (iRoll < 86) {
        sEvent = "Death in the Family";
    } else if (iRoll < 96) {
        sEvent = "Illness";
    } else {
        sEvent = "Injury or Physical Defect";
    }
    oCharacter.sEarlyChildhoodEvents = sEvent;
};

oNIB.createEarlyChildhoodInstruction = function() {
    var iRoll = oNIB.roll(100)
    var oCharacter = oNIB.oCharacter;
    var sInstruction = "";
    if (iRoll < 21) {
        sInstruction = "Outdoors";
    } else if (iRoll < 41) {
        sInstruction = "Book Learning";
    } else if (iRoll < 56) {
        sInstruction = "Religious";
    } else if (iRoll < 66) {
        sInstruction = "Language";
    } else if (iRoll < 76) {
        sInstruction = "Arts";
    } else if (iRoll < 86) {
        sInstruction = "Multicultural";
    } else if (iRoll < 96) {
        sInstruction = "Business/Politics";
    } else {
        sInstruction = "Magic";
    }
    oCharacter.sEarlyChildhoodInstruction = sInstruction;
};

oNIB.createElvenCommunity = function() {
    var iRoll = oNIB.roll(100);
    var sCommunity = ""
    if (iRoll < 16) {
        sCommunity = "Camp";
    } else if (iRoll < 31) {
        sCommunity = "Outpost";
    } else if (iRoll < 51) {
        sCommunity = "Village";
    } else if (iRoll < 71) {
        sCommunity = "Small Town";
    } else if (iRoll < 91) {
        sCommunity = "Large Town";
    } else if (iRoll < 96) {
        sCommunity = "Small City";
    } else if (iRoll < 100) {
        sCommunity = "Large City";
    } else {
        sCommunity = "Metropolis";
    }
    return sCommunity;
};

oNIB.createElvenEthics = function(sMorals) {
    var iRoll = oNIB.roll(96);
    if (iRoll < 66) {
        oNIB.oCharacter.sAlignment = "Chaotic " + sMorals;
    } else if (iRoll < 86) {
        oNIB.addNeutralEthics(sMorals);
    } else {
        oNIB.oCharacter.sAlignment = "Lawful " + sMorals;
    }
};

oNIB.createEnemies = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sEnemies = "";
    if (iRoll < 16) {
        sEnemies = "No Enemies. Yet...";
    } else if (iRoll < 26) {
        sEnemies = "Minor Childhood Enemy";
    } else if (iRoll < 31) {
        sEnemies = "Jilted Lover";
    } else if (iRoll < 36) {
        sEnemies = "Jilted Lover's Friend or Relative";
    } else if (iRoll < 41) {
        sEnemies = "Romantic Rival";
    } else if (iRoll < 51) {
        sEnemies = "Enemy of the Family";
    } else if (iRoll < 56) {
        sEnemies = "The Enemy of My Friend Is My Enemy";
    } else if (iRoll < 61) {
        sEnemies = "Social Rival";
    } else if (iRoll < 66) {
        sEnemies = "Villain";
    } else if (iRoll < 71) {
        sEnemies = "Monster";
    } else if (iRoll < 76) {
        sEnemies = "Alignment Enemy";
    } else if (iRoll < 81) {
        sEnemies = "Political Enemy";
    } else if (iRoll < 86) {
        sEnemies = "Arcane Rival";
    } else if (iRoll < 91) {
        sEnemies = "Diabolic Enemy";
    } else if (iRoll < 96) {
        sEnemies = "Enemy Within";
    } else {
        sEnemies = "Imaginary Foe";
    }
    oCharacter.sEnemies = sEnemies;
};

oNIB.createEthics = function() {
    var oCharacter = oNIB.oCharacter;
    var sClass = oCharacter.sClass;
    var sRace = oCharacter.sRace;
    var sMorals = oCharacter.sAlignment;
    if (sClass === "Bard" || sClass === "Barbarian") {
        if (sRace === "Dwarf") {
            oNIB.createNonlawfulDwarf(sMorals);
        } else if (sRace === "Halfling" ) {
            oNIB.createNonlawfulHin(sMorals);
        } else if (sRace === "Gnome" || sRace === "Human") {
            oNIB.createNonlawfulEthics(sMorals);
        } else {
            oNIB.createNonlawfulElf(sMorals);
        }
    } else if (sClass === "Druid") {
        if (sMorals !== "Neutral") {
            oCharacter.sAlignment = "Neutral " + sMorals;
        } else {
            if (sRace === "Dwarf") {
                oNIB.createDwarvenEthics(sMorals);
            } else if (sRace === "Halfling") {
                oNIB.createHinEthics(sMorals);
            } else if (sRace === "Gnome" || sRace === "Human") {
                oNIB.createNormalEthics(sMorals);
            } else {
                oNIB.createElvenEthics(sMorals);
            }
        }
    } else if (sClass === "Monk") {
        oNIB.oCharacter.sAlignment = "Lawful " + sMorals;
    } else if (sClass === "Paladin") {
        oNIB.oCharacter.sAlignment = "Lawful Good";
    } else {
        if (sRace === "Dwarf") {
            oNIB.createDwarvenEthics(sMorals);
        } else if (sRace === "Halfling") {
            oNIB.createHinEthics(sMorals);
        } else if (sRace === "Gnome" || sRace === "Human") {
            oNIB.createNormalEthics(sMorals);
        } else {
            oNIB.createElvenEthics(sMorals);
        }
    }
    var sClass = oCharacter.sClass;
    if (sClass === "Wizard") {
        oNIB.checkForSpecialization();
    }
};

oNIB.createExtendedFamily = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sFamily = "";
    if (iRoll < 11) {
        sFamily = "None";
    } else if (iRoll < 21) {
        sFamily = "No Known Relatives";
    } else if (iRoll < 56) {
        var iNumber = oNIB.roll(10);
        sFamily = String(iNumber) + " Living Relatives";
    } else if (iRoll < 91) {
        var iNumber = oNIB.roll(12, 2);
        sFamily = String(iNumber) + " Living Relatives";
    } else {
        sFamily = "Huge Extended Family";
    }
    oCharacter.sExtendedFamily = sFamily;
};

oNIB.createFamilyDefenseReadiness = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sDefense = "";
    if (iRoll < 11) {
        sDefense = "None";
    } else if (iRoll < 21) {
        sDefense = "Low";
    } else if (iRoll < 41) {
        sDefense = "Rudimentary";
    } else if (iRoll < 56) {
        sDefense = "Medium";
    } else if (iRoll < 71) {
        sDefense = "High";
    } else if (iRoll < 81) {
        sDefense = "Outstanding";
    } else if (iRoll < 91) {
        sDefense = "Hired";
    } else if (iRoll < 96) {
        sDefense = "Magical";
    } else {
        sDefense = "Mixed";
    }
    oCharacter.sFamilyDefenseReadiness = sDefense;
};

oNIB.createFamilyEconomicStatus = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sEconomics = "";
    if (iRoll < 6) {
        sEconomics = "Orphan";
    } else if (iRoll < 16) {
        sEconomics = "Refugee";
    } else if (iRoll < 41) {
        sEconomics = "Poor";
    } else if (iRoll < 61) {
        sEconomics = "Moderate";
    } else if (iRoll < 76) {
        sEconomics = "Wealthy";
    } else if (iRoll < 81) {
        sEconomics = "Religious Order";
    } else if (iRoll < 86) {
        sEconomics = "Arcane Order";
    } else if (iRoll < 91) {
        sEconomics = "Monastic Order";
    } else if (iRoll < 96) {
        sEconomics = "Wealth Unimportant";
    } else {
        sEconomics = "Military Support";
    }
    oCharacter.sFamilyEconomicStatus = sEconomics;
};

oNIB.createFamilyPoliticalViews = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sPolitics = "";
    if (iRoll < 16) {
        sPolitics = "Apolitical";
    } else if (iRoll < 31) {
        sPolitics = "Supportive";
    } else if (iRoll < 41) {
        sPolitics = "Enfranchised";
    } else if (iRoll < 46) {
        sPolitics = "Enfranchised Progressive";
    } else if (iRoll < 51) {
        sPolitics = "Enfranchised Radical";
    } else if (iRoll < 66) {
        sPolitics = "Loyal Opposition";
    } else if (iRoll < 76) {
        sPolitics = "Dissatisified";
    } else if (iRoll < 86) {
        sPolitics = "Dissident";
    } else if (iRoll < 91) {
        sPolitics = "Radical";
    } else {
        sPolitics = "Mixed";
    }
    oCharacter.sFamilyPoliticalViews = sPolitics;
};

oNIB.createFamilyPowerStructure = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sPower = "";
    if (iRoll < 11) {
        sPower = "Unorganized";
    } else if (iRoll < 31) {
        sPower = "Elders";
    } else if (iRoll < 41) {
        sPower = "Patriarchy";
    } else if (iRoll < 51) {
        sPower = "Matriarchy";
    } else if (iRoll < 61) {
        sPower = "Oligarchy";
    } else if (iRoll < 71) {
        sPower = "Meritocracy";
    } else if (iRoll < 91) {
        sPower = "Divided";
    } else if (iRoll < 96) {
        sPower = "External";
    } else {
        sPower = "Domination";
    }
    oCharacter.sFamilyPowerStructure = sPower;
};

oNIB.createFamilyPrivateEthics = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sEthics = "";
    if (iRoll < 26) {
        sEthics = "Neutral";
    } else if (iRoll < 51) {
        sEthics = "Fair";
    } else if (iRoll < 76) {
        sEthics = "Good";
    } else if (iRoll < 91) {
        sEthics = "Untrustworthy";
    } else {
        sEthics = "Evil";
    }
    oCharacter.sFamilyPrivateEthics = sEthics;
};

oNIB.createFamilyPublicEthics = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sEthics = "";
    if (iRoll < 61) {
        sEthics = "Normal";
    } else if (iRoll < 76) {
        sEthics = "Undeserved";
    } else if (iRoll < 91) {
        sEthics = "Recent Change";
    } else {
        sEthics = "Beyond Reproach/Beyond Contempt";
    }
    oCharacter.sFamilyPublicEthics = sEthics;
};

oNIB.createFamilyReligiousCommitment = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sReligion = "";
    if (iRoll < 21) {
        sReligion = "Neutral/Uninterested";
    } else if (iRoll < 41) {
        sReligion = "Strong";
    } else if (iRoll < 61) {
        sReligion = "Historical";
    } else if (iRoll < 71) {
        sReligion = "Enmity";
    } else if (iRoll < 81) {
        sReligion = "Participatory";
    } else if (iRoll < 86) {
        sReligion = "Open Heretics";
    } else if (iRoll < 91) {
        sReligion = "Hidden Heretics";
    } else {
        sReligion = "Mixed";
    }
    oCharacter.sFamilyReligiousCommitment = sReligion;
};

oNIB.createFamilyReputation = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sReputation = "";
    if (iRoll < 41) {
        sReputation = "Unknown";
    } else if (iRoll < 56) {
        sReputation = "Good";
    } else if (iRoll < 66) {
        sReputation = "Outstanding";
    } else if (iRoll < 76) {
        sReputation = "A Black Sheep or Two";
    } else if (iRoll < 91) {
        sReputation = "Mostly Bad";
    } else {
        sReputation = "Bad";
    }
    oCharacter.sFamilyReputation = sReputation;
};

oNIB.createFamilySocialStanding = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sStanding = "";
    if (iRoll < 11) {
        sStanding = "Newcomer";
    } else if (iRoll < 16) {
        sStanding = "Criminal";
    } else if (iRoll < 21) {
        sStanding = "Slave";
    } else if (iRoll < 46) {
        sStanding = "Lower Class";
    } else if (iRoll < 66) {
        sStanding = "Skilled Trade or Merchant Family";
    } else if (iRoll < 76) {
        sStanding = "Positive Religious, Arcane, Monastic, or Military Order";
    } else if (iRoll < 86) {
        sStanding = "Negative Religious, Arcane, Monastic, or Military Order";
    } else if (iRoll < 96) {
        sStanding = "Upper Class";
    } else {
        sStanding = "Noble";
    }
    oCharacter.sFamilySocialStanding = sStanding;
};

oNIB.createFormalEducation = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sEducation = "";
    if (iRoll < 26) {
        sEducation = "Agriculture";
    } else if (iRoll < 31) {
        sEducation = "History";
    } else if (iRoll < 36) {
        sEducation = "Politics";
    } else if (iRoll < 41) {
        sEducation = "Religion";
    } else if (iRoll < 46) {
        sEducation = "Natural History";
    } else if (iRoll < 51) {
        sEducation = "Multicultural";
    } else if (iRoll < 56) {
        sEducation = "Arts";
    } else if (iRoll < 61) {
        sEducation = "Literature";
    } else if (iRoll < 66) {
        sEducation = "Math";
    } else if (iRoll < 71) {
        sEducation = "Advanced Math";
    } else if (iRoll < 76) {
        sEducation = "Astronomy";
    } else if (iRoll < 86) {
        sEducation = "Finishing School";
    } else if (iRoll < 96) {
        sEducation = "School of Hard Knocks";
    } else {
        sEducation = "Magic";
    }
    oCharacter.sFormalEducation = sEducation;
};

oNIB.createFriends = function() {
    var iRoll = oNIB.roll(100)
    var oCharacter = oNIB.oCharacter;
    var sFriends = "";
    if (iRoll < 16) {
        sFriends = "No Friends";
    } else if (iRoll < 31) {
        sFriends = "Lost";
    } else if (iRoll < 51) {
        sFriends = "Few";
    } else if (iRoll < 81) {
        sFriends = "Some";
    } else {
        sFriends = "Many";
    }
    oCharacter.sFriends = sFriends;
};

oNIB.createGender = function() {
    var iRoll = oNIB.roll(4);
    if (iRoll < 3) {
        oNIB.oCharacter.sGender = "Female";
    } else {
        oNIB.oCharacter.sGender = "Male";
    }
};

oNIB.createGenericCommunity = function(oSetting, sArea) {
    var oArea = oSetting[sArea];
    var iPopulation = oArea.iPopulation;
    var oCharacter = oNIB.oCharacter;
    var sRace = oCharacter.sRace;
    var bTooLarge = true;
    var iResidents = 0;
    while (bTooLarge === true) {
        oNIB.createCommunity();
        var sCommunity = oCharacter.sCommunity;
        if (sCommunity.indexOf("Tribe") !== -1) {
            iResidents = 25;
        } else if (sCommunity.indexOf("Compound") !== -1) {
            iResidents = 50;
        } else if (sCommunity.indexOf("Homestead") !== -1) {
            iResidents = 5;
        } else if (sCommunity.indexOf("Thorp") !== -1) {
            iResidents = 100;
        } else if (sCommunity.indexOf("Hamlet") !== -1) {
            iResidents = 81;
        } else if (sCommunity.indexOf("Village") !== -1) {
            iResidents = 401;
        } else if (sCommunity.indexOf("Small Town") !== -1) {
            iResidents = 901;
        } else if (sCommunity.indexOf("Large Town") !== -1) {
            iResidents = 2001;
        } else if (sCommunity.indexOf("Small City") !== -1) {
            iResidents = 5001;
        } else if (sCommunity.indexOf("Large City") !== -1) {
            iResidents = 12001;
        } else if (sCommunity.indexOf("Metropolis") !== -1) {
            iResidents = 25001;
        } else if (sCommunity.indexOf("Fortress") !== -1) {
            iResidents = 20;
        } else if (sCommunity.indexOf("Citadel") !== -1) {
            iResidents = 81;
        } else if (sCommunity.indexOf("Camp") !== -1) {
            iResidents = 20;
        } else if (sCommunity.indexOf("Outpost") !== -1) {
            iResidents = 81;
        } else if (sCommunity.indexOf("Fringe") !== -1) {
            iResidents = 5;
        }
        if (iResidents <= iPopulation) {
            bTooLarge = false;
        }
        return sCommunity;
    }
};

oNIB.createGnomishCommunity = function() {
    var iRoll = oNIB.roll(100);
    var sCommunity = ""
    if (iRoll < 21) {
        sCommunity = "Thorp";
    } else if (iRoll < 41) {
        sCommunity = "Hamlet";
    } else if (iRoll < 61) {
        sCommunity = "Village";
    } else if (iRoll < 81) {
        sCommunity = "Small Town";
    } else if (iRoll < 96) {
        sCommunity = "Large Town";
    } else {
        sCommunity = "Small City";
    }
    return sCommunity;
};

oNIB.createGrandparents = function() {
    var iRoll = oNIB.roll(100)
    var oCharacter = oNIB.oCharacter;
    var sGrandparents = "";
    if (iRoll < 21) {
        sGrandparents = "No Grandparents";
    } else if (iRoll < 31) {
        sGrandparents = "Mother's Parents Alive";
    } else if (iRoll < 41) {
        sGrandparents = "Father's Parents Alive";
    } else if (iRoll < 61) {
        sGrandparents = "One Grandparent on Each Side";
    } else if (iRoll < 71) {
        sGrandparents = "Three Grandparents Alive";
    } else if (iRoll < 81) {
        sGrandparents = "Great-Grandparent Alive";
    } else {
        sGrandparents = "Grandparents Unknown";
    }
    oCharacter.sGrandparents = sGrandparents;
};

oNIB.createHeight = function() {
    var oCharacter = oNIB.oCharacter;
    var sRace = oCharacter.sRace;
    var sGender = oCharacter.sGender;
    var iBaseHeight = 0;
    var iDie = 4;
    var iNumber = 2;
    if (sRace === "Human") {
        if (sGender === "Male") {
            iBaseHeight = 58;
        } else {
            iBaseHeight = 53;
        }
        iDie = 10;
    } else if (sRace === "Dwarf") {
        if (sGender === "Male") {
            iBaseHeight = 45;
        } else {
            iBaseHeight = 43;
        }
    } else if (sRace === "Elf") {
        if (sGender === "Male") {
            iBaseHeight = 53;
        } else {
            iBaseHeight = 53;
        }
        iDie = 6;
    } else if (sRace === "Gnome") {
        if (sGender === "Male") {
            iBaseHeight = 36;
        } else {
            iBaseHeight = 34;
        }
    } else if (sRace === "Half-Elf") {
        if (sGender === "Male") {
            iBaseHeight = 55;
        } else {
            iBaseHeight = 53;
        }
        iDie = 8;
    } else if (sRace === "Half-Orc") {
        if (sGender === "Male") {
            iBaseHeight = 58;
        } else {
            iBaseHeight = 53;
        }
        iDie = 12;
    } else {
        if (sGender === "Male") {
            iBaseHeight = 32;
        } else {
            iBaseHeight = 30;
        }
    }
    var iRoll = oNIB.roll(iDie, iNumber);
    var iTotal = iBaseHeight + iRoll;
    var iFeet = Math.floor((iTotal / 12));
    var iMultiple = iFeet * 12;
    var iInches = iTotal - iMultiple;
    var sHeight = String(iFeet) + " ft. " + String(iInches) + " in.";
    oCharacter.sHeight = sHeight;
};

oNIB.createHinCommunity = function() {
    var iRoll = oNIB.roll(100);
    var sCommunity = ""
    if (iRoll < 21) {
        sCommunity = "Thorp";
    } else if (iRoll < 41) {
        sCommunity = "Hamlet";
    } else if (iRoll < 61) {
        sCommunity = "Village";
    } else if (iRoll < 81) {
        sCommunity = "Small Town";
    } else if (iRoll < 81) {
        sCommunity = "Large Town";
    } else if (iRoll < 81) {
        sCommunity = "Small City";
    } else if (iRoll < 81) {
        sCommunity = "Large City";
    } else {
        sCommunity = "Metropolis";
    }
    return sCommunity;
};

oNIB.createHinEthics = function(sMorals) {
    var iRoll = oNIB.roll(100);
    if (iRoll < 61) {
        oNIB.addNeutralEthics(sMorals);
    } else if (iRoll < 81) {
        oNIB.oCharacter.sAlignment = "Chaotic " + sMorals;
    } else {
        oNIB.oCharacter.sAlignment = "Lawful " + sMorals;
    }
};

oNIB.createHomeCommunity = function() {
    var aSettings = ["generic", "birthright", "blackmoor", "council",
        "dark", "fist", "dragonlance", "eberron", "realms", "ghostwalk", 
        "greyhawk", "jakandor", "lankhmar", "mahasarpa", "mystara", 
        "pelinore", "planescape", "ravenloft", "rokugan", "spelljammer", 
        "warcraft", "wilderlands"];
    var sChecked = "";
    for (var b = 0; b < aSettings.length; b++) {
        var sBox = aSettings[b];
        var box = $(('#' + sBox));
        var bValue = box.is(':checked');
        if (bValue === true) {
            sChecked = sBox;
        }
    }
    if (sChecked === "generic" || sChecked === "") {
        oNIB.createCommunity();
    } else {
        if (sChecked === "birthright") {
            oNIB.getSpecificCommunity("Birthright");
        } else if (sChecked === "blackmoor") {
            oNIB.getSpecificCommunity("Blackmoor");
        } else if (sChecked === "council") {
            oNIB.getSpecificCommunity("Council of Wyrms");
        } else if (sChecked === "dark") {
            oNIB.getSpecificCommunity("Dark Sun");
        } else if (sChecked === "fist") {
            oNIB.getSpecificCommunity("Dragon Fist");
        } else if (sChecked === "dragonlance") {
            oNIB.getSpecificCommunity("Dragonlance");
        } else if (sChecked === "eberron") {
            oNIB.getSpecificCommunity("Eberron");
        } else if (sChecked === "realms") {
            oNIB.getSpecificCommunity("Forgotten Realms");
        } else if (sChecked === "ghostwalk") {
            oNIB.getSpecificCommunity("Ghostwalk");
        } else if (sChecked === "greyhawk") {
            oNIB.getSpecificCommunity("Greyhawk");
        } else if (sChecked === "jakandor") {
            oNIB.getSpecificCommunity("Jakandor");
        } else if (sChecked === "lankhmar") {
            oNIB.getSpecificCommunity("Lankhmar");
        } else if (sChecked === "mahasarpa") {
            oNIB.getSpecificCommunity("Mahasarpa");
        } else if (sChecked === "mystara") {
            oNIB.getSpecificCommunity("Mystara");
        } else if (sChecked === "pelinore") {
            oNIB.getSpecificCommunity("Pelinore");
        } else if (sChecked === "planescape") {
            oNIB.getSpecificCommunity("Planescape");
        } else if (sChecked === "ravenloft") {
            oNIB.getSpecificCommunity("Ravenloft");
        } else if (sChecked === "spelljammer") {
            oNIB.getSpecificCommunity("Spelljammer");
        } else if (sChecked === "warcraft") {
            oNIB.getSpecificCommunity("Warcraft");
        } else if (sChecked === "wilderlands") {
            oNIB.getSpecificCommunity("Wilderlands of High Fantasy");
        } else if (sChecked === "blackmoor") {
            oNIB.getSpecificCommunity("Blackmoor");
        }
    }
};

oNIB.createHumanCommunity = function() {
    var iRoll = oNIB.roll(100);
    var sCommunity = ""
    if (iRoll < 6) {
        sCommunity = "Small Tribe";
    } else if (iRoll < 11) {
        sCommunity = "Religious, Arcane, Monastic, or Military Compound";
    } else if (iRoll < 21) {
        sCommunity = "Frontier Homestead";
    } else if (iRoll < 36) {
        sCommunity = "Thorp";
    } else if (iRoll < 56) {
        sCommunity = "Hamlet";
    } else if (iRoll < 76) {
        sCommunity = "Village";
    } else if (iRoll < 81) {
        sCommunity = "Small Town";
    } else if (iRoll < 86) {
        sCommunity = "Large Town";
    } else if (iRoll < 91) {
        sCommunity = "Small City";
    } else if (iRoll < 96) {
        sCommunity = "Large City";
    } else {
        sCommunity = "Metropolis";
    }
    return sCommunity;
};

oNIB.createInstructors = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sInstructors = "";
    if (iRoll < 16) {
        sInstructors = "No Instructors of Note";
    } else if (iRoll < 41) {
        sInstructors = "Basic";
    } else if (iRoll < 51) {
        sInstructors = "Advanced";
    } else if (iRoll < 56) {
        sInstructors = "Angry";
    } else if (iRoll < 61) {
        sInstructors = "Vanished";
    } else if (iRoll < 66) {
        sInstructors = "Favor";
    } else if (iRoll < 81) {
        sInstructors = "Unrelated";
    } else if (iRoll < 91) {
        sInstructors = "Lower Class";
    } else if (iRoll < 96) {
        sInstructors = "Other Race";
    } else {
        sInstructors = "Exotic";
    }
    oCharacter.sInstructors = sInstructors;
};

oNIB.createLearningATrade = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sTrade = "";
    if (iRoll < 21) {
        sTrade = "Farmer";
    } else if (iRoll < 31) {
        sTrade = "Hunter/Trapper";
    } else if (iRoll < 41) {
        sTrade = "Craft";
    } else if (iRoll < 51) {
        sTrade = "Religious";
    } else if (iRoll < 61) {
        sTrade = "Politics";
    } else if (iRoll < 71) {
        sTrade = "Healing";
    } else if (iRoll < 76) {
        sTrade = "Specialized";
    } else if (iRoll < 86) {
        sTrade = "Military Training";
    } else if (iRoll < 91) {
        sTrade = "Specialized Military Training";
    } else if (iRoll < 96) {
        sTrade = "Monastery/Knightly Order";
    } else {
        sTrade = "Arcanist";
    }
    oCharacter.sLearningATrade = sTrade;
};

oNIB.createMorals = function() {
    if ($('#' + 'pc').is(":checked")) {
        oNIB.createPCMorals();
    } else {
        oNIB.createNPCMorals();
    }
};

oNIB.createNonlawfulDwarf = function(sMorals) {
    var iRoll = oNIB.roll(36);
    if (iRoll < 26) {
        oNIB.addNeutralEthics(sMorals);
    } else {
        oNIB.oCharacter.sAlignment = "Chaotic " + sMorals;
    }
};

oNIB.createNonlawfulElf = function(sMorals) {
    var iRoll = oNIB.roll(85);
    if (iRoll < 66) {
        oNIB.oCharacter.sAlignment = "Chaotic " + sMorals
    } else {
        oNIB.addNeutralEthics(sMorals);
    }
};

oNIB.createNonlawfulEthics = function(sMorals) {
    var iRoll = oNIB.roll(4);
    if (iRoll < 3) {
        oNIB.addNeutralEthics(sMorals);
    } else {
        oNIB.oCharacter.sAlignment = "Chaotic " + sMorals;
    }
};

oNIB.createNonlawfulHin = function(sMorals) {
    var iRoll = oNIB.roll(80);
    if (iRoll < 61) {
        oNIB.addNeutralEthics(sMorals);
    } else {
        oNIB.oCharacter.sAlignment = "Chaotic " + sMorals;
    }
};

oNIB.createNormalEthics = function(sMorals) {
    var iRoll = oNIB.roll(6);
    if (iRoll < 3) {
        oNIB.oCharacter.sAlignment = "Lawful " + sMorals;
    } else if (iRoll < 5) {
        oNIB.addNeutralEthics(sMorals);
    } else {
        oNIB.oCharacter.sAlignment = "Chaotic " + sMorals;
    }
};

oNIB.createNPCClass = function() {
    var iRoll = oNIB.roll(96);
    var oCharacter = oNIB.oCharacter;
    var sClass = "";
    if (iRoll < 66) {
        oCharacter.sClass = "Commoner";
    } else if (iRoll < 86) {
        var iRollTwo = oNIB.roll(4);
        if (iRollTwo === 1) {
            sClass = "Adept";
        } else if (iRollTwo === 2) {
            sClass = "Aristocrat";
        } else if (iRollTwo === 3) {
            sClass = "Expert";
        } else {
            sClass = "Warrior";
        }
        oCharacter.sClass = sClass;
    } else {
        oNIB.createPCClass();
    }
};

oNIB.createNPCMorals = function() {
    var iRoll = oNIB.roll(100);
    var sMorals = "";
    if (iRoll < 21) {
        sMorals = "Good";
    } else if (iRoll < 51) {
        sMorals = "Neutral";
    } else {
        sMorals = "Evil";
    }
    oNIB.oCharacter.sAlignment = sMorals;
};

oNIB.createNPCRace = function() {
    var iRoll = oNIB.roll(85);
    var sRace = "";
    if (iRoll < 38) {
        sRace = "Human";
    } else if (iRoll < 52) {
        sRace = "Elf";
    } else if (iRoll < 62) {
        sRace = "Half-Elf";
    } else if (iRoll < 71) {
        sRace = "Halfling";
    } else if (iRoll < 78) {
        sRace = "Dwarf";
    } else if (iRoll < 84) {
        sRace = "Half-Orc";
    } else {
        sRace = "Gnome";
    }
    oNIB.oCharacter.sRace = sRace;
};

oNIB.createParents = function() {
    var iRoll = oNIB.roll(100)
    var oCharacter = oNIB.oCharacter;
    var sParents = "";
    if (iRoll < 56) {
        sParents = "Two Living Parents";
    } else if (iRoll < 66) {
        sParents = "One Living Parent";
    } else if (iRoll < 71) {
        sParents = "Both Parents Dead";
    } else if (iRoll < 81) {
        sParents = "One Ill";
    } else if (iRoll < 86) {
        sParents = "Both Ill";
    } else if (iRoll < 96) {
        sParents = "Parents Lost or Unknown";
    } else {
        sParents = "Adoptive or Foster Parents";
    }
    oCharacter.sParents = sParents;
};

oNIB.createPCClass = function() {
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
    oCharacter.sClass = sClass;
};

oNIB.createPCMorals = function() {
    var iRoll = oNIB.roll(100);
    var sMorals = "";
    if (iRoll < 51) {
        sMorals = "Good";
    } else if (iRoll < 81) {
        sMorals = "Neutral";
    } else {
        sMorals = "Evil";
    }
    oNIB.oCharacter.sAlignment = sMorals;
};

oNIB.createPCRace = function() {
    var oCharacter = oNIB.oCharacter;
    var sMorals = oCharacter.sAlignment;
    var sClass = oCharacter.sClass;
    var iRoll = 0;
    var sRace = ""
    if (sMorals === "Good") {
        if (sClass === "Barbarian") {
            //table figures multiplied by 75.  Assuming one-third of 1% of good barbarians are gnomes, this yields 25 good gnome barbarians.
            iRoll = oNIB.roll(7375);
            if (iRoll < 151) {
                sRace = "Dwarf";
            } else if (iRoll < 2551) {
                sRace = "Elf";
            } else if (iRoll < 2576) {
                sRace = "Gnome";
            } else if (iRoll < 2651) {
                sRace = "Half-Elf";
            } else if (iRoll < 2726) {
                sRace = "Halfling";
            } else if (iRoll < 4601) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Bard") {
            //table figures multiplied by 3.  This yields 18 good gnome bards.
            iRoll = oNIB.roll(318);
            if (iRoll < 16) {
                sRace = "Dwarf";
            } else if (iRoll < 112) {
                sRace = "Elf";
            } else if (iRoll < 130) {
                sRace = "Gnome";
            } else if (iRoll < 157) {
                sRace = "Half-Elf";
            } else if (iRoll < 166) {
                sRace = "Halfling";
            } else if (iRoll < 169) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Cleric") {
            //table figures multiplied by 5.  This yields 50 good gnome clerics.
            iRoll = oNIB.roll(470);
            if (iRoll < 116) {
                sRace = "Dwarf";
            } else if (iRoll < 201) {
                sRace = "Elf";
            } else if (iRoll < 251) {
                sRace = "Gnome";
            } else if (iRoll < 276) {
                sRace = "Half-Elf";
            } else if (iRoll < 341) {
                sRace = "Halfling";
            } else if (iRoll < 346) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Druid") {
            //table figures multiplied by 36.  Assuming one-third of 1% of good druids are dwarves, this yields 12 good dwarf druids.
            iRoll = oNIB.roll(3577);
            if (iRoll < 13) {
                sRace = "Dwarf";
            } else if (iRoll < 1129) {
                sRace = "Elf";
            } else if (iRoll < 1345) {
                sRace = "Gnome";
            } else if (iRoll < 1669) {
                sRace = "Half-Elf";
            } else if (iRoll < 1741) {
                sRace = "Halfling";
            } else if (iRoll < 1777) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Fighter") {
            //table figures multiplied by 25.  This yields 25 good gnome fighters.
            iRoll = oNIB.roll(2425);
            if (iRoll < 1026) {
                sRace = "Dwarf";
            } else if (iRoll < 1176) {
                sRace = "Elf";
            } else if (iRoll < 1201) {
                sRace = "Gnome";
            } else if (iRoll < 1251) {
                sRace = "Half-Elf";
            } else if (iRoll < 1301) {
                sRace = "Halfling";
            } else if (iRoll < 1426) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Monk") {
            //table figures multiplied by 75.  Assuming one-third of 1% of good monks are gnomes, this yields 25 good gnome monks.
            iRoll = oNIB.roll(7150);
            if (iRoll < 76) {
                sRace = "Dwarf";
            } else if (iRoll < 826) {
                sRace = "Elf";
            } else if (iRoll < 851) {
                sRace = "Gnome";
            } else if (iRoll < 1226) {
                sRace = "Half-Elf";
            } else if (iRoll < 1376) {
                sRace = "Halfling";
            } else if (iRoll < 1751) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Paladin") {
            //table figures multiplied by 3.  Assuming one-third of 1% of paladins are elves, this yields 1 elf paladin.
            iRoll = oNIB.roll(262);
            if (iRoll < 34) {
                sRace = "Dwarf";
            } else if (iRoll < 35) {
                sRace = "Elf";
            } else if (iRoll < 38) {
                sRace = "Gnome";
            } else if (iRoll < 53) {
                sRace = "Half-Elf";
            } else if (iRoll < 59) {
                sRace = "Halfling";
            } else if (iRoll < 62) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Ranger") {
            //table figures multiplied by 9.  This yields 45 good dwarf rangers.
            iRoll = oNIB.roll(873);
            if (iRoll < 46) {
                sRace = "Dwarf";
            } else if (iRoll < 325) {
                sRace = "Elf";
            } else if (iRoll < 379) {
                sRace = "Gnome";
            } else if (iRoll < 514) {
                sRace = "Half-Elf";
            } else if (iRoll < 532) {
                sRace = "Halfling";
            } else if (iRoll < 577) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Rogue") {
            //table figures multiplied by 5.  This yields 30 good gnome rogues.
            iRoll = oNIB.roll(480);
            if (iRoll < 31) {
                sRace = "Dwarf";
            } else if (iRoll < 96) {
                sRace = "Elf";
            } else if (iRoll < 126) {
                sRace = "Gnome";
            } else if (iRoll < 176) {
                sRace = "Half-Elf";
            } else if (iRoll < 361) {
                sRace = "Halfling";
            } else if (iRoll < 386) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Sorcerer") {
            //table figures multiplied by 9.  This yields 36 good dwarf sorcerers.
            iRoll = oNIB.roll(837);
            if (iRoll < 37) {
                sRace = "Dwarf";
            } else if (iRoll < 316) {
                sRace = "Elf";
            } else if (iRoll < 343) {
                sRace = "Gnome";
            } else if (iRoll < 388) {
                sRace = "Half-Elf";
            } else if (iRoll < 487) {
                sRace = "Halfling";
            } else if (iRoll < 505) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Wizard") {
            //table figures multiplied by 12.  This yields 12 good dwarf wizards.
            iRoll = oNIB.roll(1140);
            if (iRoll < 13) {
                sRace = "Dwarf";
            } else if (iRoll < 493) {
                sRace = "Elf";
            } else if (iRoll < 565) {
                sRace = "Gnome";
            } else if (iRoll < 685) {
                sRace = "Half-Elf";
            } else if (iRoll < 793) {
                sRace = "Halfling";
            } else if (iRoll < 805) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        }
    } else if (sMorals === "Neutral") {
        if (sClass === "Barbarian") {
            //gnomes drop by a factor of 5.  This yields 5 neutral gnome barbarians.
            iRoll = oNIB.roll(6530);
            if (iRoll < 151) {
                sRace = "Dwarf";
            } else if (iRoll < 1051) {
                sRace = "Elf";
            } else if (iRoll < 1056) {
                sRace = "Gnome";
            } else if (iRoll < 1206) {
                sRace = "Half-Elf";
            } else if (iRoll < 1431) {
                sRace = "Halfling";
            } else if (iRoll < 4356) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Bard") {
            //gnomes drop by a factor of 3.  This yields 6 neutral gnome bards.
            iRoll = oNIB.roll(267);
            if (iRoll < 10) {
                sRace = "Dwarf";
            } else if (iRoll < 64) {
                sRace = "Elf";
            } else if (iRoll < 70) {
                sRace = "Gnome";
            } else if (iRoll < 100) {
                sRace = "Half-Elf";
            } else if (iRoll < 115) {
                sRace = "Halfling";
            } else if (iRoll < 121) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Cleric") {
            //gnomes drop by a factor of 10.  This yields 5 neutral gnome clerics.
            iRoll = oNIB.roll(450);
            if (iRoll < 131) {
                sRace = "Dwarf";
            } else if (iRoll < 191) {
                sRace = "Elf";
            } else if (iRoll < 196) {
                sRace = "Gnome";
            } else if (iRoll < 241) {
                sRace = "Half-Elf";
            } else if (iRoll < 301) {
                sRace = "Halfling";
            } else if (iRoll < 311) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Druid") {
            //dwarves drop by one-third.  This yields 8 neutral dwarf druids.
            iRoll = oNIB.roll(3176);
            if (iRoll < 9) {
                sRace = "Dwarf";
            } else if (iRoll < 1125) {
                sRace = "Elf";
            } else if (iRoll < 1161) {
                sRace = "Gnome";
            } else if (iRoll < 1341) {
                sRace = "Half-Elf";
            } else if (iRoll < 1413) {
                sRace = "Halfling";
            } else if (iRoll < 1449) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Fighter") {
            //gnomes drop by a factor of 5.  This yields 5 neutral gnome fighters.
            iRoll = oNIB.roll(2405);
            if (iRoll < 851) {
                sRace = "Dwarf";
            } else if (iRoll < 1026) {
                sRace = "Elf";
            } else if (iRoll < 1031) {
                sRace = "Gnome";
            } else if (iRoll < 1156) {
                sRace = "Half-Elf";
            } else if (iRoll < 1206) {
                sRace = "Halfling";
            } else if (iRoll < 1456) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Monk") {
            //gnomes drop by a factor of 5.  This yields 5 neutral gnome monks.
            iRoll = oNIB.roll(7555);
            if (iRoll < 51) {
                sRace = "Dwarf";
            } else if (iRoll < 276) {
                sRace = "Elf";
            } else if (iRoll < 281) {
                sRace = "Gnome";
            } else if (iRoll < 1031) {
                sRace = "Half-Elf";
            } else if (iRoll < 1181) {
                sRace = "Halfling";
            } else if (iRoll < 1931) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Ranger") {
            //dwarves drop by a factor of 5.  This yields 9 neutral dwarf rangers.
            iRoll = oNIB.roll(864);
            if (iRoll < 10) {
                sRace = "Dwarf";
            } else if (iRoll < 325) {
                sRace = "Elf";
            } else if (iRoll < 343) {
                sRace = "Gnome";
            } else if (iRoll < 496) {
                sRace = "Half-Elf";
            } else if (iRoll < 514) {
                sRace = "Halfling";
            } else if (iRoll < 604) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Rogue") {
            //gnomes drop by a factor of 6.  This yields 5 neutral gnome rogues.
            iRoll = oNIB.roll(485);
            if (iRoll < 21) {
                sRace = "Dwarf";
            } else if (iRoll < 46) {
                sRace = "Elf";
            } else if (iRoll < 126) {
                sRace = "Gnome";
            } else if (iRoll < 176) {
                sRace = "Half-Elf";
            } else if (iRoll < 361) {
                sRace = "Halfling";
            } else if (iRoll < 386) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Sorcerer") {
            //dwarves drop by a factor of 4.  This yields 9 neutral dwarf sorcerers.
            iRoll = oNIB.roll(855);
            if (iRoll < 10) {
                sRace = "Dwarf";
            } else if (iRoll < 136) {
                sRace = "Elf";
            } else if (iRoll < 145) {
                sRace = "Gnome";
            } else if (iRoll < 280) {
                sRace = "Half-Elf";
            } else if (iRoll < 388) {
                sRace = "Halfling";
            } else if (iRoll < 433) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Wizard") {
            //dwarves drop by one-third.  This yields 8 neutral dwarf wizards.
            iRoll = oNIB.roll(1172);
            if (iRoll < 9) {
                sRace = "Dwarf";
            } else if (iRoll < 345) {
                sRace = "Elf";
            } else if (iRoll < 357) {
                sRace = "Gnome";
            } else if (iRoll < 537) {
                sRace = "Half-Elf";
            } else if (iRoll < 597) {
                sRace = "Halfling";
            } else if (iRoll < 609) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        }
    } else {
        if (sClass === "Barbarian") {
            //gnomes drop by another factor of 5.  This yields 1 evil gnome barbarian.
            iRoll = oNIB.roll(2943);
            if (iRoll < 18) {
                sRace = "Dwarf";
            } else if (iRoll < 243) {
                sRace = "Elf";
            } else if (iRoll < 244) {
                sRace = "Gnome";
            } else if (iRoll < 319) {
                sRace = "Half-Elf";
            } else if (iRoll < 469) {
                sRace = "Halfling";
            } else if (iRoll < 2194) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Bard") {
            //gnomes drop by a factor of 5.  This yields 1 evil gnome bard.
            iRoll = oNIB.roll(119);
            if (iRoll < 2) {
                sRace = "Dwarf";
            } else if (iRoll < 11) {
                sRace = "Elf";
            } else if (iRoll < 12) {
                sRace = "Gnome";
            } else if (iRoll < 15) {
                sRace = "Half-Elf";
            } else if (iRoll < 21) {
                sRace = "Halfling";
            } else if (iRoll < 90) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Cleric") {
            //gnomes drop by a factor of 5.  This yields 1 evil gnome cleric.
            iRoll = oNIB.roll(281);
            if (iRoll < 16) {
                sRace = "Dwarf";
            } else if (iRoll < 41) {
                sRace = "Elf";
            } else if (iRoll < 42) {
                sRace = "Gnome";
            } else if (iRoll < 92) {
                sRace = "Half-Elf";
            } else if (iRoll < 112) {
                sRace = "Halfling";
            } else if (iRoll < 127) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Druid") {
            //dwarves drop by a factor of 9.  This yields 1 evil dwarf druid.
            iRoll = oNIB.roll(2024);
            if (iRoll < 2) {
                sRace = "Dwarf";
            } else if (iRoll < 73) {
                sRace = "Elf";
            } else if (iRoll < 81) {
                sRace = "Gnome";
            } else if (iRoll < 117) {
                sRace = "Half-Elf";
            } else if (iRoll < 153) {
                sRace = "Halfling";
            } else if (iRoll < 225) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Fighter") {
            //gnomes drop by another factor of 5.  This yields 1 evil gnome fighter.
            iRoll = oNIB.roll(1326);
            if (iRoll < 101) {
                sRace = "Dwarf";
            } else if (iRoll < 176) {
                sRace = "Elf";
            } else if (iRoll < 177) {
                sRace = "Gnome";
            } else if (iRoll < 302) {
                sRace = "Half-Elf";
            } else if (iRoll < 352) {
                sRace = "Halfling";
            } else if (iRoll < 577) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Monk") {
            //gnomes drop by another factor of 5.  This yields 1 evil gnome monk.
            iRoll = oNIB.roll(6888);
            if (iRoll < 7) {
                sRace = "Dwarf";
            } else if (iRoll < 63) {
                sRace = "Elf";
            } else if (iRoll < 64) {
                sRace = "Gnome";
            } else if (iRoll < 814) {
                sRace = "Half-Elf";
            } else if (iRoll < 889) {
                sRace = "Halfling";
            } else if (iRoll < 1639) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Ranger") {
            //dwarves drop by a factor of 9.  This yields 1 evil dwarf ranger.
            iRoll = oNIB.roll(626);
            if (iRoll < 2) {
                sRace = "Dwarf";
            } else if (iRoll < 101) {
                sRace = "Elf";
            } else if (iRoll < 105) {
                sRace = "Gnome";
            } else if (iRoll < 258) {
                sRace = "Half-Elf";
            } else if (iRoll < 276) {
                sRace = "Halfling";
            } else if (iRoll < 357) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Rogue") {
            //gnomes drop by a factor of 5.  This yields 1 evil gnome rogue.
            iRoll = oNIB.roll(351);
            if (iRoll < 6) {
                sRace = "Dwarf";
            } else if (iRoll < 16) {
                sRace = "Elf";
            } else if (iRoll < 17) {
                sRace = "Gnome";
            } else if (iRoll < 92) {
                sRace = "Half-Elf";
            } else if (iRoll < 202) {
                sRace = "Halfling";
            } else if (iRoll < 252) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Sorcerer") {
            //dwarves drop by a factor of 9.  This yields 1 evil dwarf sorcerer.
            iRoll = oNIB.roll(615);
            if (iRoll < 2) {
                sRace = "Dwarf";
            } else if (iRoll < 11) {
                sRace = "Elf";
            } else if (iRoll < 13) {
                sRace = "Gnome";
            } else if (iRoll < 148) {
                sRace = "Half-Elf";
            } else if (iRoll < 211) {
                sRace = "Halfling";
            } else if (iRoll < 256) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        } else if (sClass === "Wizard") {
            //dwarves drop by a factor of 9.  This yields 1 evil dwarf wizard.
            iRoll = oNIB.roll(943);
            if (iRoll < 2) {
                sRace = "Dwarf";
            } else if (iRoll < 134) {
                sRace = "Elf";
            } else if (iRoll < 136) {
                sRace = "Gnome";
            } else if (iRoll < 316) {
                sRace = "Half-Elf";
            } else if (iRoll < 340) {
                sRace = "Halfling";
            } else if (iRoll < 344) {
                sRace = "Half-Orc";
            } else {
                sRace = "Human";
            }
        }
    }
    oCharacter.sRace = sRace;
};

oNIB.createPersonalityTraits = function() {
    var oPersonalityTraits = {
        "aAgent": [
            "Ambitious", 
            "Serious"
        ], 
        "aChallenger": [
            "Bold", 
            "Disciplined"
        ], 
        "aCompanion": [
            "Connected", 
            "Funny", 
            "Loyal"
        ], 
        "aCrusader": [
            "Bold", 
            "Patriotic", 
            "Religious"
        ], 
        "aDaredevil": [
            "Bold", 
            "Energetic", 
            "Flamboyant"
        ], 
        "aExplorer": [
            "Driven", 
            "Exotic"
        ], 
        "aInnocent": [
            "Carefree", 
            "Kind", 
            "Naive"
        ], 
        "aLeader": [
            "Ambitious", 
            "Charming"
        ], 
        "aMartyr": [
            "Kind", 
            "Merciful", 
            "Reformed"
        ], 
        "aMercenary": [
            "Boastful", 
            "Greedy"
        ], 
        "aOrphan": [
            "Calm"
        ], 
        "aProphet": [
            "Energetic", 
            "Fatalistic", 
            "Religious"
        ], 
        "aRebel": [
            "Driven"
        ], 
        "aRenegade": [
            "Exotic", 
            "Skilled", 
            "Vengeful"
        ], 
        "aRoyalty": [
            "Calm", 
            "Charming", 
            "Connected"
        ], 
        "aSage": [
            "Calm", 
            "Erudite"
        ], 
        "aSavage": [
            "Brutal", 
            "Exotic", 
            "Naive"
        ], 
        "aSeeker": [
            "Angry", 
            "Driven"
        ], 
        "aSimple Soul": [
            "Funny", 
            "Skilled"
        ], 
        "aStrategist": [
            "Conservative", 
            "Erudite", 
            "Serious"
        ], 
        "aTheorist": [
            "Disciplined"
        ], 
        "aTrickster": [
            "Flamboyant", 
            "Funny"
        ], 
        "aWanderer": [
            "Peaceful"
        ], 
        "aAll": [
            "Ambitious", 
            "Angry", 
            "Boastful", 
            "Bold", 
            "Brutal", 
            "Calm", 
            "Carefree", 
            "Charming", 
            "Connected", 
            "Conservative", 
            "Disciplined", 
            "Driven", 
            "Energetic", 
            "Erudite", 
            "Exotic", 
            "Fatalistic", 
            "Flamboyant", 
            "Funny", 
            "Greedy", 
            "Kind", 
            "Loyal", 
            "Merciful", 
            "Naive", 
            "Patriotic", 
            "Peaceful", 
            "Reformed", 
            "Religious", 
            "Serious", 
            "Skilled", 
            "Vengeful"
        ]
    };
    var oCharacter = oNIB.oCharacter;
    var sArchetype = oCharacter.sArchetype;
    var aCommonTraits = oPersonalityTraits[("a" + sArchetype)];
    var aAllTraits = oPersonalityTraits.aAll;
    var aUncommonTraits = [];
    var sTrait = "";
    for (var t = 0; t < aAllTraits.length; t++) {
        sTrait = aAllTraits[t];
        if (aCommonTraits.indexOf(sTrait) === -1) {
            aUncommonTraits.push(sTrait);
        }
    }
    var iNumberOfTraits = oNIB.roll(3);
    iNumberOfTraits++;
    var iIndex = 0;
    var aPersonalityTraits = [];
    while (iNumberOfTraits > 0) {
        var iRoll = oNIB.roll(85);
        if ((iRoll < 66) && (aCommonTraits.length > 0)) {
            iIndex = oNIB.roll(aCommonTraits.length);
            iIndex--;
            sTrait = aCommonTraits[iIndex];
            aPersonalityTraits.push(sTrait);
            aCommonTraits.splice(iIndex, (iIndex + 1));
        } else {
            iIndex = oNIB.roll(aUncommonTraits.length);
            iIndex--;
            sTrait = aUncommonTraits[iIndex];
            aPersonalityTraits.push(sTrait);
            aUncommonTraits.splice(iIndex, (iIndex + 1));
        }            
        iNumberOfTraits--;
    }
    aPersonalityTraits.sort();
    var sPersonalityTraits = "";
    for (var t = 0; t < aPersonalityTraits.length; t++) {
        sTrait = aPersonalityTraits[t];
        if (t === 0) {
            sPersonalityTraits += sTrait;
        } else {
            sPersonalityTraits += (", " + sTrait);
        }
    }
    oCharacter.sPersonalityTraits = sPersonalityTraits;
};

oNIB.createPivotalEvents = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sEvent = "";
    if (iRoll < 56) {
        sEvent = "No Pivotal Events";
    } else if (iRoll < 66) {
        sEvent = "Refugee";
    } else if (iRoll < 71) {
        sEvent = "Cultural Shift";
    } else if (iRoll < 76) {
        sEvent = "Under Siege";
    } else if (iRoll < 81) {
        sEvent = "Climactic Battle";
    } else if (iRoll < 86) {
        sEvent = "All-Out War";
    } else if (iRoll < 96) {
        sEvent = "Community Crisis";
    } else {
        sEvent = "Religious Awakening";
    }
    oCharacter.sPivotalEvents = sEvent;
};

oNIB.createRace = function() {
    if ($('#' + 'pc').is(":checked")) {
        oNIB.createPCRace();
    } else {
        oNIB.createNPCRace();
    }
};

oNIB.createSiblings = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sSiblings = "";
    if (iRoll < 26) {
        sSiblings = "No Siblings";
    } else if (iRoll < 46) {
        var iNumber = oNIB.roll(4);
        var sNumber = String(iNumber);
        sSiblings = "Oldest (Younger Siblings: " + sNumber + ")";
    } else if (iRoll < 76) {
        var iYounger = oNIB.roll(3);
        var iOlder = oNIB.roll(3);
        var sYounger = String(iYounger);
        var sOlder = String(iOlder);
        sSiblings = "Middle (Younger Siblings: " + sYounger + ", Older Siblings: " + sOlder + ")";
    } else if (iRoll < 96) {
        var iNumber = oNIB.roll(4);
        var sNumber = String(iNumber);
        sSiblings = "Youngest (Older Siblings: " + sNumber + ")";
    } else {
        sSiblings = "Twin";
    }
    oCharacter.sSiblings = sSiblings;
};

oNIB.createSpecialistWizard = function() {
    var oCharacter = oNIB.oCharacter;
    var sAlignment = oCharacter.sAlignment;
    var iRoll = oNIB.roll(100);
    var sClass = "";
    if (sAlignment === "Lawful Good") {
        if (iRoll < 52) {
            sClass = "Abjurer";
        } else if (iRoll < 54) {
            sClass = "Conjurer";
        } else if (iRoll < 69) {
            sClass = "Diviner";
        } else if (iRoll < 73) {
            sClass = "Enchanter";
        } else if (iRoll < 85) {
            sClass = "Evoker";
        } else if (iRoll < 89) {
            sClass = "Illusionist";
        } else if (iRoll < 97) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    } else if (sAlignment === "Lawful Neutral") {
        if (iRoll < 18) {
            sClass = "Abjurer";
        } else if (iRoll < 23) {
            sClass = "Conjurer";
        } else if (iRoll < 71) {
            sClass = "Diviner";
        } else if (iRoll < 75) {
            sClass = "Enchanter";
        } else if (iRoll < 89) {
            sClass = "Evoker";
        } else if (iRoll < 93) {
            sClass = "Illusionist";
        } else if (iRoll < 97) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    } else if (sAlignment === "Lawful Evil") {
        if (iRoll < 12) {
            sClass = "Abjurer";
        } else if (iRoll < 18) {
            sClass = "Conjurer";
        } else if (iRoll < 38) {
            sClass = "Diviner";
        } else if (iRoll < 43) {
            sClass = "Enchanter";
        } else if (iRoll < 59) {
            sClass = "Evoker";
        } else if (iRoll < 64) {
            sClass = "Illusionist";
        } else if (iRoll < 96) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    } else if (sAlignment === "Neutral Good") {
        if (iRoll < 24) {
            sClass = "Abjurer";
        } else if (iRoll < 31) {
            sClass = "Conjurer";
        } else if (iRoll < 38) {
            sClass = "Diviner";
        } else if (iRoll < 49) {
            sClass = "Enchanter";
        } else if (iRoll < 67) {
            sClass = "Evoker";
        } else if (iRoll < 78) {
            sClass = "Illusionist";
        } else if (iRoll < 90) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    } else if (sAlignment === "True Neutral") {
        if (iRoll < 8) {
            sClass = "Abjurer";
        } else if (iRoll < 22) {
            sClass = "Conjurer";
        } else if (iRoll < 42) {
            sClass = "Diviner";
        } else if (iRoll < 54) {
            sClass = "Enchanter";
        } else if (iRoll < 73) {
            sClass = "Evoker";
        } else if (iRoll < 84) {
            sClass = "Illusionist";
        } else if (iRoll < 90) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    } else if (sAlignment === "Neutral Evil") {
        if (iRoll < 4) {
            sClass = "Abjurer";
        } else if (iRoll < 16) {
            sClass = "Conjurer";
        } else if (iRoll < 22) {
            sClass = "Diviner";
        } else if (iRoll < 32) {
            sClass = "Enchanter";
        } else if (iRoll < 48) {
            sClass = "Evoker";
        } else if (iRoll < 58) {
            sClass = "Illusionist";
        } else if (iRoll < 91) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    } else if (sAlignment === "Chaotic Good") {
        if (iRoll < 8) {
            sClass = "Abjurer";
        } else if (iRoll < 20) {
            sClass = "Conjurer";
        } else if (iRoll < 22) {
            sClass = "Diviner";
        } else if (iRoll < 43) {
            sClass = "Enchanter";
        } else if (iRoll < 53) {
            sClass = "Evoker";
        } else if (iRoll < 74) {
            sClass = "Illusionist";
        } else if (iRoll < 80) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    } else if (sAlignment === "Chaotic Neutral") {
        if (iRoll < 3) {
            sClass = "Abjurer";
        } else if (iRoll < 26) {
            sClass = "Conjurer";
        } else if (iRoll < 32) {
            sClass = "Diviner";
        } else if (iRoll < 51) {
            sClass = "Enchanter";
        } else if (iRoll < 60) {
            sClass = "Evoker";
        } else if (iRoll < 79) {
            sClass = "Illusionist";
        } else if (iRoll < 82) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    } else {
        if (iRoll < 2) {
            sClass = "Abjurer";
        } else if (iRoll < 23) {
            sClass = "Conjurer";
        } else if (iRoll < 25) {
            sClass = "Diviner";
        } else if (iRoll < 42) {
            sClass = "Enchanter";
        } else if (iRoll < 50) {
            sClass = "Evoker";
        } else if (iRoll < 67) {
            sClass = "Illusionist";
        } else if (iRoll < 84) {
            sClass = "Necromancer";
        } else {
            sClass = "Transmuter";
        }
    }
    oCharacter.sClass = sClass;
};

oNIB.createTemperatureZone = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sTemperature = "";
    if (iRoll < 16) {
        sTemperature = "Cold";
    } else if (iRoll < 66) {
        sTemperature = "Temperate";
    } else {
        sTemperature = "Warm";
    }
    oCharacter.sTemperatureZone = sTemperature;
};

oNIB.createTerrain = function() {
    var oCharacter = oNIB.oCharacter;
    var iRoll = oNIB.roll(100);
    var sTerrain = "";
    if (iRoll < 11) {
        sTerrain = "Desert";
    } else if (iRoll < 31) {
        sTerrain = "Plains";
    } else if (iRoll < 46) {
        sTerrain = "Forest";
    } else if (iRoll < 61) {
        sTerrain = "Hills";
    } else if (iRoll < 71) {
        sTerrain = "Mountains";
    } else if (iRoll < 81) {
        sTerrain = "Marsh";
    } else if (iRoll < 86) {
        sTerrain = "Aquatic";
    } else if (iRoll < 91) {
        sTerrain = "Underground";
    } else {
        sTerrain = "Nomadic";
    }
    oCharacter.sTerrain = sTerrain;
};

oNIB.createYouthEvents = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    var sEvent = "";
    if (iRoll < 16) {
        sEvent = "Battle";
    } else if (iRoll < 26) {
        sEvent = "Adventure";
    } else if (iRoll < 36) {
        sEvent = "Politics";
    } else if (iRoll < 51) {
        sEvent = "Great Romance";
    } else if (iRoll < 61) {
        sEvent = "Religion";
    } else if (iRoll < 71) {
        sEvent = "Arcane";
    } else if (iRoll < 81) {
        sEvent = "Healing";
    } else if (iRoll < 96) {
        sEvent = "Crime";
    } else {
        sEvent = "Discovery";
    }
    oCharacter.sYouthEvents = sEvent;
};

oNIB.demographize = function(oArea, sArea) {
    var aProperties = Object.keys(oArea);
    var aOther = ["iPopulation", "sSource", "sType"];
    var aRaces = [];
    var iPopulation = oArea["iPopulation"];
    for (var p = 0; p < aProperties.length; p++) {
        var sProperty = aProperties[p];
        if (aOther.indexOf(sProperty) === -1) {
            aRaces.push(sProperty);
        }
    }
    if (aRaces.length > 0) {
        var oDemographics = {};
        for (var r = 0; r < aRaces.length; r++) {
            var sRace = aRaces[r];
            var iRace = oArea[sRace];
            var iRatio = iRace / 100;
            var iDemographic = iPopulation * iRatio;
            oDemographics[sRace] = iDemographic;
        }
        console.log(sArea, oDemographics);
    }
};

oNIB.findArea = function(oSetting, oAreaObject) {
    var aAreas = oAreaObject.aAreas;
    var iDie = 0;
    var oNumbers = {};
    var sRace = oNIB.oCharacter.sRace;
    for (var a = 0; a < aAreas.length; a++) {
        var sArea = aAreas[a];
        var oArea = oSetting[sArea];
        var aDemographics = Object.keys(oArea);
        if (aDemographics.indexOf(sRace) !== -1) {
            var iPercent = oArea[sRace];
        } else if (aDemographics.indexOf("other") !== -1) {
            var iPercent = oArea["other"];
        } else {
            var iPercent = oNIB.oGeneric[sRace];
        }
        var iMultiplier = iPercent / 100;
        var iProduct = oArea.iPopulation * iMultiplier;
        var iNumber = Math.round(iProduct);
        oNumbers[sArea] = iNumber;
        iDie += iNumber;
    }
    var iRoll = oNIB.roll(iDie);
    var iTotal = 0;
    var aNumbers = Object.keys(oNumbers);
    var sArea = "";
    for (var a = 0; a < aNumbers.length; a++) {
        sArea = aNumbers[a];
        var iPopulation = oNumbers[sArea];
        iTotal += iPopulation
        if (iTotal >= iRoll) {
            break;
        }
    }
    oAreaObject.aHistory.unshift(sArea);
    var oArea = oSetting[sArea];
    var sType = oArea.sType;
    if (sType === "region") {
        var sSubregions = "a" + sArea.replace(/ /g, "");
        var aProperties = Object.keys(oSetting);
        if (aProperties.indexOf(sSubregions) !== -1) {
            var aSubregions = oSetting[sSubregions];
            oAreaObject.aAreas = aSubregions;
            var oAreaObject = oNIB.findArea(oSetting, oAreaObject);
        } else {
            oAreaObject.aAreas = [sArea];
            var sCommunity = oNIB.createGenericCommunity(oSetting, sArea);
            oNIB.createCommunityString(sCommunity, oAreaObject);
        }
    } else if (sType === "undefined") {
        oAreaObject.aAreas = [sArea];
        var sCommunity = oNIB.createGenericCommunity(oSetting, sArea);
        oNIB.createCommunityString(sCommunity, oAreaObject);
    } else {
        oNIB.analyzeCommunity(oSetting, sArea);
        var sCommunity = oNIB.oCharacter.sCommunity;
        oNIB.createCommunityString(sCommunity, oAreaObject);
    }
    return oAreaObject;
};

oNIB.getChildDemographics = function(oSetting) {
    var aProperties = Object.keys(oSetting);
    for (var p = 0; p < aProperties.length; p++) {
        var sProperty = aProperties[p];
        if (sProperty[0] === "a") {
            var aAreas = oSetting[sProperty];
            var iTotal = 0;
            var oDemographics = {};
            for (var a = 0; a < aAreas.length; a++) {
                var sArea = aAreas[a];
                var oArea = oSetting[sArea];
                var aStuff = Object.keys(oArea);
                if (aStuff.indexOf("other") === -1) {
                    break;
                } else {
                    var aRaces = Object.keys(oDemographics);
                    var iPopulation = oArea.iPopulation;
                    iTotal += iPopulation;
                    for (var t = 0; t < aStuff.length; t++) {
                        var sThing = aStuff[t];
                        if (sThing[0] !== "s" && sThing[0] !== "i") {
                            var iPercent = oArea[sThing];
                            var iMultiplier = iPercent / 100;
                            var iProduct = iPopulation * iMultiplier;
                            var iRace = Math.round(iProduct);
                            if (aRaces.indexOf(sThing) === -1) {
                                oDemographics[sThing] = iRace;
                            } else {
                                oDemographics[sThing] += iRace;
                            }
                        }
                    }
                }
            }
            aRaces = Object.keys(oDemographics);
            var oPercentages = {};
            for (var r = 0; r < aRaces.length; r++) {
                var sRace = aRaces[r];
                var iNumber = oDemographics[sRace];
                var iQuotient = iNumber / iTotal;
                var iPercent = iQuotient * 100;
                oPercentages[sRace] = iPercent;
            }
            console.log(sProperty, oPercentages);
        }
    }
};

oNIB.getDemographics = function(oSetting) {
    var aProperties = Object.keys(oSetting);
    for (var p = 0; p < aProperties.length; p++) {
        var sProperty = aProperties[p];
        if (sProperty[0] !== "a") {
            var oArea = oSetting[sProperty];
            oNIB.demographize(oArea, sProperty);
        }
    }
};

oNIB.getGenericDemographics = function() {
    var aPrefixes = ["oGood", "oNeutral", "oEvil"];
    var oDemographics = {};
    var oInfo = {oGoodClasses: {Barbarian: 5, Bard: 5, Cleric: 20, Druid: 5, Fighter: 10, Monk: 5, Paladin: 5, Ranger: 10, Rogue: 10, Sorcerer: 5, Wizard: 20}, 
        oNeutralClasses: {Barbarian: 5, Bard: 5, Cleric: 5, Druid: 10, Fighter: 20, Monk: 5, Ranger: 5, Rogue: 20, Sorcerer: 5, Wizard: 20}, 
        oEvilClasses: {Barbarian: 10, Bard: 5, Cleric: 20, Druid: 5, Fighter: 10, Monk: 5, Ranger: 5, Rogue: 20, Sorcerer: 5, Wizard: 15},
        oGoodBarbarians: {dwarf: 2, elf: 32, "half-elf": 1, halfling: 1, "half-orc": 25, human: 37, "half-celestial": 1, "half-dragon": 1},
        oGoodBards: {aasimar: 1, dwarf: 5, elf: 32, gnome: 7, "half-elf": 9, halfling: 3, "half-orc": 1, human: 40, "half-celestial": 1, "half-dragon": 1},
        oGoodClerics: {aasimar: 1, dwarf: 23, elf: 17, gnome: 11, "half-elf": 5, halfling: 13, "half-orc": 1, human: 25, "half-celestial": 2, "half-dragon": 1, werebear: 1},
        oGoodDruids: {elf: 31, gnome: 6, "half-elf": 9, halfling: 2, "half-orc": 1, human: 50, "half-celestial": 1},
        oGoodFighters: {dwarf: 41, elf: 6, gnome: 1, "half-elf": 2, halfling: 2, "half-orc": 5, human: 40, "half-celestial": 1, "half-dragon": 1, werebear: 1},
        oGoodMonks: {aasimar: 2, dwarf: 1, elf: 10, "half-elf": 5, halfling: 2, "half-orc": 5, human: 72, "half-celestial": 1, "half-dragon": 1, werebear: 1},
        oGoodPaladins: {aasimar: 10, dwarf: 11, gnome: 1, "half-elf": 5, halfling: 2, "half-orc": 1, human: 67, "half-celestial": 1, "half-dragon": 1, werebear: 1},
        oGoodRangers: {dwarf: 5, elf: 31, gnome: 6, "half-elf": 15, halfling: 2, "half-orc": 5, human: 33, "half-celestial": 1, "half-dragon": 1, werebear: 1},
        oGoodRogues: {dwarf: 6, elf: 13, gnome: 7, "half-elf": 10, halfling: 37, "half-orc": 5, human: 19, "half-celestial": 1, "half-dragon": 1, werebear: 1},
        oGoodSorcerers: {aasimar: 2, dwarf: 4, elf: 31, gnome: 4, "half-elf": 5, halfling: 11, "half-orc": 2, human: 37, "half-celestial": 1, "half-dragon": 2, werebear: 1},
        oGoodWizards: {aasimar: 1, dwarf: 1, elf: 40, gnome: 7, "half-elf": 10, halfling: 9, "half-orc": 1, human: 28, "half-celestial": 1, "half-dragon": 1, werebear: 1},
        oNeutralBarbarians: {dwarf: 2, elf: 12, "half-elf": 2, halfling: 3, "half-orc": 39, human: 29, lizardfolk: 11, wereboar: 1, weretiger: 1},
        oNeutralBards: {dwarf: 3, elf: 18, gnome: 2, "half-elf": 10, halfling: 5, "half-orc": 2, human: 58, wereboar: 1, weretiger: 1},
        oNeutralClerics: {dwarf: 26, elf: 12, gnome: 1, "half-elf": 9, halfling: 12, "half-orc": 2, human: 28, lizardfolk: 7, doppelganger: 1, wereboar: 1, weretiger: 1},
        oNeutralDruids: {elf: 31, gnome: 1, "half-elf": 5, halfling: 2, "half-orc": 1, human: 48, lizardfolk: 10, wereboar: 1, weretiger: 1},
        oNeutralFighters: {dwarf: 34, elf: 7, "half-elf": 5, halfling: 2, "half-orc": 10, human: 38, lizardfolk: 1, doppelganger: 1, wereboar: 1, weretiger: 1},
        oNeutralMonks: {elf: 3, "half-elf": 10, halfling: 2, "half-orc": 10, human: 75},
        oNeutralRangers: {dwarf: 1, elf: 35, gnome: 2, "half-elf": 17, halfling: 2, "half-orc": 10, human: 29, lizardfolk: 2, wereboar: 1, weretiger: 1},
        oNeutralRogues: {dwarf: 4, elf: 5, gnome: 1, "half-elf": 15, halfling: 38, "half-orc": 10, human: 24, doppelganger: 1, wereboar: 1, weretiger: 1},
        oNeutralSorcerers: {dwarf: 1, elf: 14, gnome: 1, "half-elf": 15, halfling: 12, "half-orc": 5, human: 47, lizardfolk: 2, doppelganger: 1, wereboar: 1, weretiger: 1},
        oNeutralWizards: {elf: 28, gnome: 1, "half-elf": 15, halfling: 5, "half-orc": 1, human: 47, doppelganger: 1, wereboar: 1, weretiger: 1},
        oEvilBarbarians: {elf: 3, "half-elf": 1, halfling: 2, "half-orc": 23, human: 10, lizardfolk: 5, goblin: 1, hobgoblin: 1, kobold: 1, orc: 30, tiefling: 1, gnoll: 5, troglodyte: 1, bugbear: 2, ogre: 4, minotaur: 4, werewolf: 2, "half-fiend": 2, "half-dragon": 2},
        oEvilBards: {elf: 2, "half-elf": 15, halfling: 3, "half-orc": 2, human: 75, goblin: 1, tiefling: 1, werewolf: 1},
        oEvilClerics: {dwarf: 3, elf: 5, "half-elf": 10, halfling: 4, "half-orc": 3, human: 31, lizardfolk: 7, goblin: 1, hobgoblin: 1, kobold: 1, orc: 1, tiefling: 1, drow: 3, duergar: 1, gnoll: 2, troglodyte: 15, bugbear: 2, ogre: 1, minotaur: 1, "mind flayer": 1, "ogre mage": 1, wererat: 1, werewolf: 1, "half-fiend": 2, "half-dragon": 1},
        oEvilDruids: {elf: 2, "half-elf": 1, halfling: 1, "half-orc": 2, human: 50, lizardfolk: 15, goblin: 1, hobgoblin: 1, kobold: 1, orc: 1, gnoll: 25},
        oEvilFighters: {dwarf: 4, elf: 3, "half-elf": 5, halfling: 2, "half-orc": 9, human: 30, lizardfolk: 1, goblin: 1, hobgoblin: 25, kobold: 1, orc: 5, drow: 2, duergar: 1, derro: 1, gnoll: 1, troglodyte: 1, bugbear: 1, ogre: 1, "mind flayer": 1, "ogre mage": 1, wererat: 1, werewolf: 1, "half-fiend": 1, "half-dragon": 1},
        oEvilMonks: {"half-elf": 10, "half-orc": 10, human: 70, hobgoblin: 3, tiefling: 1, "ogre mage": 2, wererat: 2, "half-fiend": 1, "half-dragon": 1},
        oEvilRangers: {elf: 11, "half-elf": 17, halfling: 2, "half-orc": 9, human: 30, lizardfolk: 2, hobgoblin: 1, gnoll: 20, troglodyte: 1, bugbear: 1, ogre: 1, wererat: 1, werewolf: 2, "half-fiend": 1, "half-dragon": 1},
        oEvilRogues: {dwarf: 1, elf: 2, "half-elf": 15, halfling: 22, "half-orc": 10, human: 20, goblin: 15, hobgoblin: 1, kobold: 1, tiefling: 2, bugbear: 4, "mind flayer": 1, wererat: 2, werewolf: 1, "half-fiend": 2, "half-dragon": 1},
        oEvilSorcerers: {elf: 1, "half-elf": 15, halfling: 7, "half-orc": 5, human: 40, lizardfolk: 1, goblin: 1, hobgoblin: 1, kobold: 15, gnoll: 1, troglodyte: 3, bugbear: 1, ogre: 1, minotaur: 1, "mind flayer": 1, "ogre mage": 1, wererat: 1, werewolf: 1, "half-fiend": 1, "half-dragon": 2},
        oEvilWizards: {elf: 11, "half-elf": 15, halfling: 2, human: 50, hobgoblin: 2, tiefling: 1, drow: 10, gnoll: 1, bugbear: 1, "mind flayer": 1, "ogre mage": 2, wererat: 1, werewolf: 1, "half-fiend": 1, "half-dragon": 1}
    }
    for (var p = 0; p < aPrefixes.length; p++) {
        var sPrefix = aPrefixes[p];
        var sClasses = sPrefix + "Classes";
        var oClasses = oInfo[sClasses]
        var aClasses = Object.keys(oClasses);
        for (var c = 0; c < aClasses.length; c++) {
            var sClass = aClasses[c];
            var iPercent = oClasses[sClass];
            var iMultiplier = iPercent / 5;
            var sRaces = sPrefix + sClass + "s";
            var oRaces = oInfo[sRaces]
            var aRaces = Object.keys(oRaces);
            for (var r = 0; r < aRaces.length; r++) {
                var sRace = aRaces[r];
                iPercent = oRaces[sRace];
                var iProduct = iPercent * iMultiplier;
                var aDemographics = Object.keys(oDemographics);
                if (aDemographics.indexOf(sRace) === -1) {
                    oDemographics[sRace] = 0;
                }
                oDemographics[sRace] += iProduct;
            }
        }
    }
    aDemographics = Object.keys(oDemographics);
    var oPercentages = {};
    for (var d = 0; d < aDemographics.length; d++) {
        var sRace = aDemographics[d];
        var iTotal = oDemographics[sRace];
        var iQuotient = iTotal / 6000
        var iPercent = iQuotient * 100
        oPercentages[sRace] = iPercent;
    }
    var aPercentages = Object.keys(oPercentages);
    var oNew = {"other": 0}
    for (var p = 0; p < aPercentages.length; p++) {
        var sRace = aPercentages[p];
        var iPercent = oPercentages[sRace];
        if (iPercent < 0.5) {
            oNew["other"] += iPercent;
        } else {
            oNew[sRace] = iPercent;
        }
    }
    console.log(oNew);
};

oNIB.getSpecificCommunity = function(sSetting) {
    var sArray = "a" + sSetting.replace(/ /g, "");
    var oSetting = oNIB.oSettings[sSetting];
    var aTopLevel = oNIB.oSettings[sSetting][sArray];
    var oAreaObject = {aAreas: [], aHistory: []};
    for (var a = 0; a < aTopLevel.length; a++) {
        var sArea = aTopLevel[a];
        oAreaObject.aAreas.push(sArea);
    }
    oAreaObject = oNIB.findArea(oSetting, oAreaObject);
};

oNIB.handleGenerateButton = function(event) {
    event.stopPropagation();
    $('#character').empty();
    oNIB.createGender();
    oNIB.createMorals();
    oNIB.createClass();
    oNIB.createRace();
    oNIB.createEthics();
    oNIB.createAge();
    oNIB.createHeight();
    oNIB.createTemperatureZone();
    oNIB.createTerrain();
    oNIB.createHomeCommunity();
    oNIB.createFamilyEconomicStatus();
    oNIB.createFamilySocialStanding();
    oNIB.createFamilyDefenseReadiness();
    oNIB.createFamilyPrivateEthics();
    oNIB.createFamilyPublicEthics();
    oNIB.createFamilyReligiousCommitment();
    oNIB.createFamilyReputation();
    oNIB.createFamilyPoliticalViews();
    oNIB.createFamilyPowerStructure();
    oNIB.createAncestorsOfNote();
    oNIB.createEarlyChildhoodInstruction();
    oNIB.createFormalEducation();
    oNIB.createLearningATrade();
    oNIB.createEarlyChildhoodEvents();
    oNIB.createYouthEvents();
    oNIB.createPivotalEvents();
    oNIB.createParents();
    oNIB.createSiblings();
    oNIB.createGrandparents();
    oNIB.createExtendedFamily();
    oNIB.createFriends();
    oNIB.createEnemies();
    oNIB.createInstructors();
    oNIB.createArchetype();
    oNIB.createPersonalityTraits();
    oNIB.printCharacter();
};

oNIB.handleSettingCheckboxes = function(event) {
    event.stopPropagation();
    var aSettings = ["generic", "birthright", "blackmoor", "council",
        "dark", "fist", "dragonlance", "eberron", "realms", "ghostwalk", 
        "greyhawk", "jakandor", "lankhmar", "mahasarpa", "mystara", 
        "pelinore", "planescape", "ravenloft", "rokugan", "spelljammer", 
        "warcraft", "wilderlands"];
    var target = $(event.target);
    var bValue = target.is(':checked');
    if (bValue === true) {
        var sId = target.attr('id');
        var aOther = [];
        for (var b = 0; b < aSettings.length; b++) {
            var sSetting = aSettings[b];
            if (sSetting !== sId) {
                aOther.push(sSetting);
            }
        }
        for (var b = 0; b < aOther.length; b++) {
            var sSetting = aOther[b];
            var button = $(('#' + sSetting));
            button.prop('checked', false);
        }
    }
};

oNIB.handleTypeCheckboxes = function(event) {
    event.stopPropagation();
    var target = $(event.target);
    var sId = target.attr('id');
    var bValue = target.is(':checked');
    if (sId === "npc") {
        if (bValue === true) {
            $('#pc').prop('checked', false);
        } else {
            $('#pc').prop('checked', true);
        }
    } else {
        if (bValue === true) {
            $('#npc').prop('checked', false);
        } else {
            $('#npc').prop('checked', true);
        }
    }
};

oNIB.iDefined = 0;

oNIB.iUndefined = 0;

oNIB.oCharacter = {};

oNIB.oGeneric = {
    Human: 37, Elf: 14, "Half-Elf": 10, Halfling: 9, Dwarf: 7, 
    "Half-Orc": 6, Gnome: 2, Lizardfolk: 2, Bugbear: 1, Drow: 1, 
    Gnoll: 1, Goblin: 1, "Half-Dragon": 1, Hobgoblin: 1, Orc: 1, 
    Troglodyte: 1, other: 5
};

oNIB.oSettings = {
    "Birthright": {}, 
    "Blackmoor": {}, 
    "Council of Wyrms": {}, 
    "Dark Sun": {}, 
    "Dragon Fist": {}, 
    "Dragonlance": {}, 
    "Eberron": {}, 
    "Forgotten Realms": {}, 
    "Ghostwalk": {}, 
    "Greyhawk": {}, 
    "Jakandor": {}, 
    "Lankhmar": {}, 
    "Mahasarpa": {}, 
    "Mystara": {}, 
    "Pelinore": {}, 
    "Planescape": {}, 
    "Ravenloft": {}, 
    "Rokugan": {}, 
    "Spelljammer": {}, 
    "Warcraft": {}, 
    "Wilderlands of High Fantasy": {}
};

oNIB.oSettings["Mystara"] = {
    "aMystara": ["Aeryl", "Alphatia", "Anathy Archipelago", "Bellisaria", "Brun", "Dark Jungle", "Davania", "Eshu", "Iciria", "Isle of Dawn", 
        "Jibaroe", "New Alphatian Sea", "Nimmur", "Pearl Islands", "Qeodhar", "Savage Coast", "Sea of Dawn", "Sea of Dread", "Serraine", 
        "Shadow Elf Territory", "Skothar", "Valoin-Flamaeker", "Wallara", "Western Orclands", "Yannivey Islands"], 
    "aAeryl": ["Ithun", "Aeryl (undefined)"], 
    "Aeryl": {iPopulation: 14685, "Winged Elf": 99, other: 1, sType: "region"}, 
    "Ithun": {iPopulation: 12221, "Winged Elf": 99, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Aeryl (undefined)": {iPopulation: 2464, "Winged Elf": 99, other: 1, sType: "undefined"}, 
    "aAlphatia": ["Ambur", "Ar", "Arogansa", "Bettellyn", "Blackheart", "Eadrin", "Foresthome", "Frisland", "Greenspur", "Haven", "Jafilia", "Limn", 
        "Randel", "Shiye-Lawr", "Stonewall", "Stoutfellow", "Theranderol", "Vertiloch"],
    "Alphatia": {iPopulation: 5096000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Ambur": {iPopulation: 103000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Ar": {iPopulation: 103000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Arogansa": {iPopulation: 138000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Bettellyn": {iPopulation: 330000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Blackheart": {iPopulation: 45000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Eadrin": {iPopulation: 90000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Foresthome": {iPopulation: 85000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Frisland": {iPopulation: 80000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Greenspur": {iPopulation: 565000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Haven": {iPopulation: 895000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Jafilia": {iPopulation: 52000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Limn": {iPopulation: 225000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Randel": {iPopulation: 130000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Shiye-Lawr": {iPopulation: 55000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Stonewall": {iPopulation: 1340000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Stoutfellow": {iPopulation: 58000, Dwarf: 49, Gnome: 26, Halfling: 24, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Theranderol": {iPopulation: 182000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Vertiloch": {iPopulation: 620000, Human: 97, Elf: 2, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "aAnathyArchipelago": ["Shahjapur", "Anathy Archipelago (undefined)"], 
    "Anathy Archipelago": {iPopulation: 3004136, sType: "region"}, 
    "aShahjapur": ["Amtha", "Dharsatra", "Shahjapur (undefined)"], 
    "Shahjapur": {iPopulation: 2500000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Anathy Archipelago (undefined)": {iPopulation: 504136, sType: "undefined"}, 
    "Amtha": {iPopulation: 200000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Dharsatra": {iPopulation: 450000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Shahjapur (undefined)": {iPopulation: 1850000, sType: "undefined"}, 
    "aBellisaria": ["Dawnrim", "Horken (region)", "Lagrius", "Meriander", "Notrion", "Surshield"], 
    "Bellisaria": {iPopulation: 457000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aDawnrim": ["Alinquin", "Dawnrim (undefined)"], 
    "Dawnrim": {iPopulation: 27000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Alinquin": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Dawnrim (undefined)": {iPopulation: 22000, sType: "undefined"}, 
    "aHorken(region)": ["Horken (settlement)", "Horken (region) (undefined)"], 
    "Horken (region)": {iPopulation: 30000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Horken (settlement)": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Horken (region) (undefined)": {iPopulation: 25000, sType: "undefined"}, 
    "aLagrius": ["Blueside", "Lagrius (undefined)"], 
    "Lagrius": {iPopulation: 150000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Blueside": {iPopulation: 15000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Lagrius (undefined)": {iPopulation: 135000, sType: "undefined"}, 
    "aMeriander": ["Alchemos", "Meriander (undefined)"], 
    "Meriander": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Alchemos": {iPopulation: 15000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Meriander (undefined)": {iPopulation: 85000, sType: "undefined"}, 
    "aNotrion": ["Aaslin", "Notrion (undefined)"], 
    "Notrion": {iPopulation: 50000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Notrion (undefined)": {iPopulation: 40000, sType: "undefined"}, 
    "Aaslin": {iPopulation: 10000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "aSurshield": ["Spearpoint", "Surshield (undefined)"], 
    "Surshield": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Spearpoint": {iPopulation: 30000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Surshield (undefined)": {iPopulation: 70000, sType: "undefined"}, 
    "aBrun": ["Aengmor", "Atruaghin Clans", "Broken Lands", "Darokin (region)", "Denagoth", "Ethengar", "Five Shires", "Glantri", "Great Waste", 
        "Heldannic Territories", "Hule", "Karameikos", "Northern Reaches", "Norwold", "Rockhome", "Sind", "Thyatis", "Ulimwengu", "Wendar", 
        "Ylaruam (region)"], 
    "Brun": {iPopulation: 10499070, sType: "region"}, 
    "aAengmor": ["Rafielton", "Aengmor (undefined)"], 
    "Aengmor": {iPopulation: 130000, Elf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Rafielton": {iPopulation: 12120, Elf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Aengmor (undefined)": {iPopulation: 117880, Elf: 99, other: 1, sType: "undefined"}, 
    "aAtruaghinClans": ["Bear Clan", "Elk Clan", "Horse Clan", "Tiger Clan", "Turtle Clan"], 
    "Atruaghin Clans": {iPopulation: 230000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Bear Clan": {iPopulation: 45000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Elk Clan": {iPopulation: 30000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Horse Clan": {iPopulation: 70000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Tiger Clan": {iPopulation: 60000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Turtle Clan": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aBrokenLands": ["Eastern Broken Lands", "Oenkmar", "Western Broken Lands"], 
    "Broken Lands": {iPopulation: 57000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Eastern Broken Lands": {iPopulation: 14000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Oenkmar": {iPopulation: 18000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Western Broken Lands": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aDarokin(region)": ["Akesoli", "Akorros", "Ansimont", "Athenos", "Corunglain", "Darokin (settlement)", "Selenica", 
        "Darokin (region) (undefined)"], 
    "Darokin (region)": {iPopulation: 1260000, Human: 96, other: 4, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Akesoli": {iPopulation: 25000, Human: 96, other: 4, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Akorros": {iPopulation: 25000, Human: 96, other: 4, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Ansimont": {iPopulation: 12000, Human: 96, other: 4, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Athenos": {iPopulation: 15000, Human: 96, other: 4, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Corunglain": {iPopulation: 32000, Human: 96, other: 4, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Darokin (settlement)": {iPopulation: 50000, Human: 96, other: 4, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Selenica": {iPopulation: 41000, Human: 96, other: 4, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Darokin (region) (undefined)": {iPopulation: 1060000, Human: 96, other: 4, sType: "undefined"}, 
    "Denagoth": {iPopulation: 75000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Ethengar": {iPopulation: 330000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aFiveShires": ["Shireton", "Five Shires (undefined)"], 
    "Five Shires": {iPopulation: 220000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Shireton": {iPopulation: 27000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Five Shires (undefined)": {iPopulation: 193000, sType: "undefined"}, 
    "aGlantri": ["Aalban", "Belcadiz", "Bergdhoven", "Boldavia", "Bramyra (region)", "Erewan", "Fenswick", "Glantri City", "Klantyre", "Krondahar", 
        "Morlay-Malinbois", "New Kolland", "Nouvelle Averoigne", "Sablestone", "Glantri (undefined)"], 
    "Glantri": {iPopulation: 605000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aAalban": ["Graez", "Leenz", "Aalban (undefined)"], 
    "Aalban": {iPopulation: 34230, sSource: "Glantri", sType: "region"}, 
    "Graez": {iPopulation: 1100, sSource: "Glantri", sType: "settlement"}, 
    "Leenz": {iPopulation: 4200, sSource: "Glantri", sType: "settlement"}, 
    "Aalban (undefined)": {iPopulation: 28930, sType: "undefined"}, 
    "aBelcadiz": ["New Alvar", "Belcadiz (undefined)"], 
    "Belcadiz": {iPopulation: 12458, sSource: "Glantri", sType: "region"}, 
    "New Alvar": {iPopulation: 5000, sSource: "Glantri", sType: "settlement"}, 
    "Belcadiz (undefined)": {iPopulation: 7458, sType: "undefined"}, 
    "aBergdhoven": ["Altendorf", "Kopstar", "Bergdhoven (undefined)"], 
    "Bergdhoven": {iPopulation: 34350, sSource: "Glantri", sType: "region"}, 
    "Altendorf": {iPopulation: 2750, sSource: "Glantri", sType: "settlement"}, 
    "Kopstar": {iPopulation: 4400, sSource: "Glantri", sType: "settlement"}, 
    "Bergdhoven (undefined)": {iPopulation: 27200, sType: "undefined"}, 
    "aBoldavia": ["Rymskigard", "Boldavia (undefined)"], 
    "Boldavia": {iPopulation: 15120, sSource: "Glantri", sType: "region"}, 
    "Rymskigard": {iPopulation: 6600, sSource: "Glantri", sType: "settlement"}, 
    "Boldavia (undefined)": {iPopulation: 8520, sType: "undefined"}, 
    "aBramyra(region)": ["Bramyra (settlement)", "Bramyra (region) (undefined)"], 
    "Bramyra (region)": {iPopulation: 7450, sSource: "Glantri", sType: "region"}, 
    "Bramyra (settlement)": {iPopulation: 2300, sSource: "Glantri", sType: "settlement"}, 
    "Bramyra (region) (undefined)": {iPopulation: 5150, sType: "undefined"}, 
    "aErewan": ["Erendyl", "Erewan (undefined)"], 
    "Erewan": {iPopulation: 20840, sSource: "Glantri", sType: "region"}, 
    "Erendyl": {iPopulation: 3500, sSource: "Glantri", sType: "settlement"}, 
    "Erewan (undefined)": {iPopulation: 17340, sType: "undefined"}, 
    "Fenswick": {iPopulation: 5890, sSource: "Glantri", sType: "region"}, 
    "Glantri City": {iPopulation: 40000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "aKlantyre": ["Glenmoorloch", "Tavish", "Klantyre (undefined)"], 
    "Klantyre": {iPopulation: 27750, sSource: "Glantri", sType: "region"}, 
    "Glenmoorloch": {iPopulation: 3300, sSource: "Glantri", sType: "settlement"}, 
    "Tavish": {iPopulation: 1500, sSource: "Glantri", sType: "settlement"}, 
    "Klantyre (undefined)": {iPopulation: 22950, sType: "undefined"}, 
    "aKrondahar": ["Braastar", "Krondahar (undefined)"], 
    "Krondahar": {iPopulation: 24860, sSource: "Glantri", sType: "region"}, 
    "Braastar": {iPopulation: 6900, sSource: "Glantri", sType: "settlement"}, 
    "Krondahar (undefined)": {iPopulation: 17960, sType: "undefined"}, 
    "aMorlay-Malinbois": ["Loupmont", "Morlay-Malinbois (undefined)"], 
    "Morlay-Malinbois": {iPopulation: 5390, sSource: "Glantri", sType: "region"}, 
    "Loupmont": {iPopulation: 1100, sSource: "Glantri", sType: "settlement"}, 
    "Morlay-Malinbois (undefined)": {iPopulation: 4290, sType: "undefined"}, 
    "New Kolland": {iPopulation: 29560, sSource: "Glantri", sType: "region"}, 
    "aNouvelleAveroigne": ["Perigon", "Vyonnes", "Ximes", "Nouvelle Averoigne (undefined)"], 
    "Nouvelle Averoigne": {iPopulation: 28650, sSource: "Glantri", sType: "region"}, 
    "Perigon": {iPopulation: 1100, sSource: "Glantri", sType: "settlement"}, 
    "Vyonnes": {iPopulation: 5000, sSource: "Glantri", sType: "settlement"}, 
    "Ximes": {iPopulation: 2300, sSource: "Glantri", sType: "settlement"}, 
    "Nouvelle Averoigne (undefined)": {iPopulation: 20250, sType: "undefined"}, 
    "aSablestone": ["Kern", "Sablestone (undefined)"], 
    "Sablestone": {iPopulation: 16340, sSource: "Glantri", sType: "region"}, 
    "Kern": {iPopulation: 1500, sSource: "Glantri", sType: "settlement"}, 
    "Sablestone (undefined)": {iPopulation: 14840, sType: "undefined"}, 
    "Glantri (undefined)": {iPopulation: 302112, sType: "undefined"}, 
    "aGreatWaste": ["Barren Plain", "Konumtali Savannah", "Plain of Fire", "Sind Desert"], 
    "Great Waste": {iPopulation: 177000, sType: "region"}, 
    "Barren Plain": {iPopulation: 50000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Konumtali Savannah": {iPopulation: 20000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Plain of Fire": {iPopulation: 7000, Elf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Sind Desert": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aHeldannicTerritories": ["Freiburg", "Landfall", "Oceansend", "Heldannic Territories (undefined)"], 
    "Heldannic Territories": {iPopulation: 320000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Freiburg": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Landfall": {iPopulation: 10000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Oceansend": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Heldannic Territories (undefined)": {iPopulation: 260000, sType: "undefined"}, 
    "Hule": {iPopulation: 1000000, Human: 65, other: 35, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aKarameikos": ["Dmitrov", "Fort Doom", "Highforge", "Kelvin", "Krakatos", "Luln", "Marilenev", "Mirros", "Penhaligon", "Rifllian", "Rugalov", 
        "Sulescu", "Threshold", "Vandevicsny", "Verge", "Vorloi", "Karameikos (undefined)"], 
    "Karameikos": {iPopulation: 432000, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Dmitrov": {iPopulation: 6500, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Fort Doom": {iPopulation: 10000, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Highforge": {iPopulation: 7575, Gnome: 86, Dwarf: 13, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Kelvin": {iPopulation: 20000, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Krakatos": {iPopulation: 2000, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Luln": {iPopulation: 5000, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Marilenev": {iPopulation: 900, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Mirros": {iPopulation: 70000, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Penhaligon": {iPopulation: 3750, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Rifllian": {iPopulation: 2000, Elf: 65, other: 35, sSource: "Karameikos", sType: "settlement"}, 
    "Rugalov": {iPopulation: 650, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Sulescu": {iPopulation: 950, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Threshold": {iPopulation: 5000, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Vandevicsny": {iPopulation: 900, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Verge": {iPopulation: 500, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Vorloi": {iPopulation: 7500, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sSource: "Karameikos", sType: "settlement"}, 
    "Karameikos (undefined)": {iPopulation: 288775, Human: 81, Elf: 16, Dwarf: 1, Gnome: 1, other: 1, sType: "undefined"}, 
    "aNorthernReaches": ["Ostland", "Soderfjord (region)", "Vestland"], 
    "Northern Reaches": {iPopulation: 453000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aOstland": ["Zeaburg", "Ostland (undefined)"], 
    "Ostland": {iPopulation: 131000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Zeaburg": {iPopulation: 8000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Ostland (undefined)": {iPopulation: 123000, sType: "undefined"}, 
    "aSoderfjord(region)": ["Soderfjord (settlement)", "Soderfjord (region) (undefined)"], 
    "Soderfjord (region)": {iPopulation: 161000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Soderfjord (settlement)": {iPopulation: 7000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Soderfjord (region) (undefined)": {iPopulation: 154000, sType: "undefined"}, 
    "aVestland": ["Norrvik", "Vestland (undefined)"], 
    "Vestland": {iPopulation: 161000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Norrvik": {iPopulation: 16000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Vestland (undefined)": {iPopulation: 145000, sType: "undefined"}, 
    "aNorwold": ["Alpha (region)", "Leeha (region)", "Norwold (undefined)"], 
    "Norwold": {iPopulation: 138500, Human: 81, Halfling: 14, Elf: 4, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aAlpha(region)": ["Alpha (settlement)"],
    "Alpha (region)": {iPopulation: 90000, Human: 93, Halfling: 2, Elf: 4, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"},
    "Alpha (settlement)": {iPopulation: 30000, Human: 93, Halfling: 2, Elf: 4, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"},
    "aLeeha(region)": ["Leeha (settlement)"],
    "Leeha (region)": {iPopulation: 6500, Halfling: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Leeha (settlement)": {iPopulation: 1200, Halfling: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"},
    "Norwold (undefined)": {iPopulation: 42000, Human: 67, Halfling: 27, Elf: 5, other: 1, sType: "undefined"},
    "aRockhome": ["Dengar", "Stahl", "Rockhome (undefined)"], 
    "Rockhome": {iPopulation: 1000000, Dwarf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Dengar": {iPopulation: 55000, Dwarf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Stahl": {iPopulation: 30000, Dwarf: 99, other: 1, sSource: "Joshuan's Almanac & Book of Facts", sType: "settlement"}, 
    "Rockhome (undefined)": {iPopulation: 915000, Dwarf: 99, other: 1, sType: "undefined"}, 
    "aSind": ["Azadgal", "Baratkand", "Gunjab", "Jaibul (region)", "Jalawar", "Jhengal", "Kadesh", "Nagpuri", "Peshmir", "Putnabad (region)", 
        "Shajarkand", "Sindrastan"], 
    "Sind": {iPopulation: 600000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aAzadgal": ["Sandapur", "Azadgal (undefined)"], 
    "Azadgal": {iPopulation: 45000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Sandapur": {iPopulation: 9000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Azadgal (undefined)": {iPopulation: 36000, sType: "undefined"}, 
    "aBaratkand": ["Baratpur", "Baratkand (undefined)"], 
    "Baratkand": {iPopulation: 40000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Baratpur": {iPopulation: 6500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Baratkand (undefined)": {iPopulation: 33500, sType: "undefined"}, 
    "aGunjab": ["Raneshwar", "Gunjab (undefined)"], 
    "Gunjab": {iPopulation: 15000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Raneshwar": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Gunjab (undefined)": {iPopulation: 10000, sType: "undefined"}, 
    "aJaibul(region)": ["Jaibul (settlement)", "Jaibul (region) (undefined)"], 
    "Jaibul (region)": {iPopulation: 50000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Jaibul (settlement)": {iPopulation: 6000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Jaibul (region) (undefined)": {iPopulation: 44000, sType: "undefined"}, 
    "aJalawar": ["Sambay", "Jalawar (undefined)"], 
    "Jalawar": {iPopulation: 65000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Sambay": {iPopulation: 12000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Jalawar (undefined)": {iPopulation: 53000, sType: "undefined"}, 
    "aJhengal": ["Khamrati", "Jhengal (undefined)"], 
    "Jhengal": {iPopulation: 40000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Khamrati": {iPopulation: 6000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Jhengal (undefined)": {iPopulation: 34000, sType: "undefined"}, 
    "aKadesh": ["Latehar", "Kadesh (undefined)"], 
    "Kadesh": {iPopulation: 30000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Latehar": {iPopulation: 6000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Kadesh (undefined)": {iPopulation: 24000, sType: "undefined"}, 
    "aNagpuri": ["Mahasabad", "Nagpuri (undefined)"], 
    "Nagpuri": {iPopulation: 60000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Mahasabad": {iPopulation: 12000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Nagpuri (undefined)": {iPopulation: 48000, sType: "undefined"}, 
    "aPeshmir": ["Karakandar", "Peshmir (undefined)"], 
    "Peshmir": {iPopulation: 35000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Karakandar": {iPopulation: 10000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Peshmir (undefined)": {iPopulation: 25000, sType: "undefined"}, 
    "aPutnabad(region)": ["Putnabad (settlement)", "Putnabad (region) (undefined)"], 
    "Putnabad (region)": {iPopulation: 75000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Putnabad (settlement)": {iPopulation: 18000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Putnabad (region) (undefined)": {iPopulation: 57000, sType: "undefined"}, 
    "aShajarkand": ["Naral", "Shajarkand (undefined)"], 
    "Shajarkand": {iPopulation: 65000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Naral": {iPopulation: 10000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Shajarkand (undefined)": {iPopulation: 55000, sType: "undefined"}, 
    "aSindrastan": ["Sayr Ulan", "Sindrastan (undefined)"], 
    "Sindrastan": {iPopulation: 80000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Sayr Ulan": {iPopulation: 30000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Sindrastan (undefined)": {iPopulation: 50000, sType: "undefined"}, 
    "aThyatis": ["Actius (region)", "Biazzan (region)", "Borydos", "Buhrohur", "Halatbius", "Hattias (region)", "Kantrium", "Kerendas (region)", 
        "Lucinius", "Machetos (region)", "Mositius", "Retebius (region)", "Tel Akbir (region)", "Terentias", "Thyatis (region)", "Vyalia"], 
    "Thyatis": {iPopulation: 2700000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aActius(region)": ["Actius (settlement)", "Actius (region) (undefined)"], 
    "Actius (region)": {iPopulation: 26158, sType: "region"}, 
    "Actius (settlement)": {iPopulation: 7200, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Actius (region) (undefined)": {iPopulation: 18958, sType: "undefined"}, 
    "aBiazzan(region)": ["Biazzan (settlement)", "Biazzan (region) (undefined)"], 
    "Biazzan (region)": {iPopulation: 41779, sType: "region"}, 
    "Biazzan (settlement)": {iPopulation: 11500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Biazzan (region) (undefined)": {iPopulation: 30279, sType: "undefined"}, 
    "aBorydos": ["Fort Borydos", "Borydos (undefined)"], 
    "Borydos": {iPopulation: 12715, sType: "region"}, 
    "Fort Borydos": {iPopulation: 3500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Borydos (undefined)": {iPopulation: 9215, sType: "undefined"}, 
    "aBuhrohur": ["Makrast", "Buhrohur (undefined)"], 
    "Buhrohur": {iPopulation: 10898, Dwarf: 90, Gnome: 6, Human: 3, other: 1, sType: "region"},
    "Makrast": {iPopulation: 3000, Dwarf: 90, Gnome: 6, Human: 3, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Buhrohur (undefined)": {iPopulation: 7898, sType: "undefined"}, 
    "aHalatbius": ["Goldleaf", "Halatbius (undefined)"], 
    "Halatbius": {iPopulation: 14532, sType: "region"}, 
    "Goldleaf": {iPopulation: 4000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Halatbius (undefined)": {iPopulation: 10532, sType: "undefined"}, 
    "aHattias(region)": ["Hattias (settlement)", "Hattias (region) (undefined)"], 
    "Hattias (region)": {iPopulation: 105355, sType: "region"}, 
    "Hattias (settlement)": {iPopulation: 29000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Hattias (region) (undefined)": {iPopulation: 76355, sType: "undefined"}, 
    "aKantrium": ["Kantridae", "Kantrium (undefined)"], 
    "Kantrium": {iPopulation: 32696, sType: "region"}, 
    "Kantridae": {iPopulation: 9000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Kantrium (undefined)": {iPopulation: 23696, sType: "undefined"}, 
    "aKerendas(region)": ["Kerendas (settlement)", "Kerendas (region) (undefined)"], 
    "Kerendas (region)": {iPopulation: 326965, sType: "region"}, 
    "Kerendas (settlement)": {iPopulation: 90000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Kerendas (region) (undefined)": {iPopulation: 236965, sType: "undefined"}, 
    "aLucinius": ["Port Lucinius", "Lucinius (undefined)"], 
    "Lucinius": {iPopulation: 130786, sType: "region"}, 
    "Port Lucinius": {iPopulation: 36000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Lucinius (undefined)": {iPopulation: 94786, sType: "undefined"}, 
    "aMachetos(region)": ["Machetos (settlement)", "Machetos (region) (undefined)"], 
    "Machetos (region)": {iPopulation: 9082, sType: "region"}, 
    "Machetos (settlement)": {iPopulation: 2500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Machetos (region) (undefined)": {iPopulation: 6582, sType: "undefined"}, 
    "aMositius": ["Argevin Town", "Mositius (undefined)"], 
    "Mositius": {iPopulation: 27247, sType: "region"}, 
    "Argevin Town": {iPopulation: 7500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Mositius (undefined)": {iPopulation: 19747, sType: "undefined"}, 
    "aRetebius(region)": ["Retebius (settlement)", "Retebius (region) (undefined)"], 
    "Retebius (region)": {iPopulation: 50861, sType: "region"}, 
    "Retebius (settlement)": {iPopulation: 14000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Retebius (region) (undefined)": {iPopulation: 36861, sType: "undefined"}, 
    "aTelAkbir(region)": ["Tel Akbir (settlement)", "Tel Akbir (region) (undefined)"], 
    "Tel Akbir (region)": {iPopulation: 72659, sType: "region"}, 
    "Tel Akbir (settlement)": {iPopulation: 20000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Tel Akbir (region) (undefined)": {iPopulation: 52659, sType: "undefined"}, 
    "aTerentias": ["Crossbones", "Terentias (undefined)"], 
    "Terentias": {iPopulation: 18165, Elf: 40, other: 60, sType: "region"}, 
    "Crossbones": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Terentias (undefined)": {iPopulation: 13165, sType: "undefined"}, 
    "aThyatis(region)": ["Thyatis (settlement)", "Thyatis (region) (undefined)"], 
    "Thyatis (region)": {iPopulation: 1816469, sType: "region"}, 
    "Thyatis (settlement)": {iPopulation: 500000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Thyatis (region) (undefined)": {iPopulation: 1316469, sType: "undefined"}, 
    "aVyalia": ["Greenheight", "Vyalia (undefined)"], 
    "Vyalia": {iPopulation: 3633, Elf: 25, other: 75, sType: "region"}, 
    "Greenheight": {iPopulation: 1000, Elf: 80, other: 20, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Vyalia (undefined)": {iPopulation: 2633, Elf: 25, other: 75, sType: "undefined"}, 
    "aUlimwengu": ["Shani Kijiji", "Ulimwengu (undefined)"], 
    "Ulimwengu": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Shani Kijiji": {iPopulation: 40000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Ulimwengu (undefined)": {iPopulation: 60000, sType: "undefined"}, 
    "Wendar": {iPopulation: 442000, Human: 49, Elf: 49, other: 2, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "aYlaruam(region)": ["Abbashan (region)", "Alasiya", "Dythestenia", "Makistan", "Nicostenia", "Nithia (Ylaruam)", "Ylaruam (region) (undefined)"], 
    "Ylaruam (region)": {iPopulation: 230000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aAbbashan(region)": ["Abbashan (settlement)", "Abbashan (region) (undefined)"], 
    "Abbashan (region)": {iPopulation: 30000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Abbashan (settlement)": {iPopulation: 4300, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Abbashan (region) (undefined)": {iPopulation: 25700, sType: "undefined"}, 
    "aAlasiya": ["Ylaruam (settlement)", "Alasiya (undefined)"], 
    "Alasiya": {iPopulation: 80000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Ylaruam (settlement)": {iPopulation: 13000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Alasiya (undefined)": {iPopulation: 67000, sType: "undefined"}, 
    "aDythestenia": ["Ctesiphon", "Dythestenia (undefined)"], 
    "Dythestenia": {iPopulation: 8000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Ctesiphon": {iPopulation: 1000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Dythestenia (undefined)": {iPopulation: 7000, sType: "undefined"}, 
    "aMakistan": ["Parsa", "Makistan (undefined)"], 
    "Makistan": {iPopulation: 30000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Parsa": {iPopulation: 2000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Makistan (undefined)": {iPopulation: 28000, sType: "undefined"}, 
    "aNicostenia": ["Tameronikas", "Nicostenia (undefined)"], 
    "Nicostenia": {iPopulation: 65000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Tameronikas": {iPopulation: 4000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Nicostenia (undefined)": {iPopulation: 61000, sType: "undefined"}, 
    "aNithia(Ylaruam)": ["Surra-Man-Raa", "Nithia (Ylaruam) (undefined)"], 
    "Nithia (Ylaruam)": {iPopulation: 15000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Surra-Man-Raa": {iPopulation: 2000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Nithia (Ylaruam) (undefined)": {iPopulation: 13000, sType: "undefined"}, 
    "Ylaruam (region) (undefined)": {iPopulation: 2000, sType: "undefined"}, 
    "aDarkJungle": ["Black Orchid", "Green Slayers", "Sea Plague", "Silent Death", "Storm Bringers"], 
    "Dark Jungle": {iPopulation: 18479, Orc: 87, Lizardfolk: 4, Ogre: 2, Snapper: 2, "Swamp Troll": 2, Troglodyte: 2, other: 1, sType: "region"}, 
    "aBlackOrchid": ["Ffaug", "Black Orchid (undefined)"], 
    "Black Orchid": {iPopulation: 2381, Orc: 82, Troglodyte: 17, other: 1, sType: "region"}, 
    "Ffaug": {iPopulation: 1828, Orc: 82, Troglodyte: 17, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Black Orchid (undefined)": {iPopulation: 553, Orc: 82, Troglodyte: 17, other: 1, sType: "undefined"}, 
    "aGreenSlayers": ["Argak", "Green Slayers (undefined)"], 
    "Green Slayers": {iPopulation: 3196, Orc: 90, "Swamp Troll": 9, other: 1, sType: "region"}, 
    "Argak": {iPopulation: 2454, Orc: 90, "Swamp Troll": 9, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Green Slayers (undefined)": {iPopulation: 742, Orc: 90, "Swamp Troll": 9, other: 1, sType: "undefined"}, 
    "aSeaPlague": ["Zrag", "Sea Plague (undefined)"], 
    "Sea Plague": {iPopulation: 2696, Orc: 87, Snapper: 12, other: 1, sType: "region"}, 
    "Zrag": {iPopulation: 2070, Orc: 87, Snapper: 12, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Sea Plague (undefined)": {iPopulation: 626, Orc: 87, Snapper: 12, other: 1, sType: "undefined"}, 
    "aSilentDeath": ["Olomi", "Silent Death (undefined)"], 
    "Silent Death": {iPopulation: 6142, Orc: 87, Lizardfolk: 12, other: 1, sType: "region"}, 
    "Olomi": {iPopulation: 4716, Orc: 87, Lizardfolk: 12, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Silent Death (undefined)": {iPopulation: 1426, Orc: 87, Lizardfolk: 12, other: 1, sType: "undefined"}, 
    "aStormBringers": ["Ugmar", "Storm Bringers (undefined)"], 
    "Storm Bringers": {iPopulation: 4064, Orc: 90, Ogre: 9, other: 1, sType: "region"}, 
    "Ugmar": {iPopulation: 3120, Orc: 90, Ogre: 9, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Storm Bringers (undefined)": {iPopulation: 944, Orc: 90, Ogre: 9, other: 1, sType: "undefined"}, 
    "aDavania": ["Emerond", "Davania (undefined)"], 
    "Davania": {iPopulation: 2000000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aEmerond": ["Izmira", "Emerond (undefined)"], 
    "Emerond": {iPopulation: 125000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Izmira": {iPopulation: 12000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Emerond (undefined)": {iPopulation: 113000, sType: "undefined"}, 
    "Davania (undefined)": {iPopulation: 1875000, sType: "undefined"}, 
    "aEshu": ["Sardon", "Eshu (undefined)"], 
    "Eshu": {iPopulation: 14740, Enduk: 99, other: 1, sType: "region"}, 
    "Sardon": {iPopulation: 11312, Enduk: 99, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Eshu (undefined)": {iPopulation: 3428, Enduk: 99, other: 1, sType: "undefined"}, 
    "aIciria": ["Antalian Wastes", "Azcan", "Beastman Wastes", "Brute-Men Territory", "Icevale", "Jennite Holdings", "Kogolor", 
        "Krugel Horde Territory", "Mapheggi Swamp", "Merry Pirate Seas", "Milenian Empire", "Neathar Lands", "Neatharum", "Nithia (Iciria)", 
        "Oltec Kingdom", "Shattenalfheim", "Tanagoro", "Traldar Kingdoms"], 
    "Iciria": {iPopulation: 16947090, sType: "region"}, 
    "Antalian Wastes": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aAzcan": ["Chitlacan", "Azcan (undefined)"], 
    "Azcan": {iPopulation: 3000000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Chitlacan": {iPopulation: 200000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Azcan (undefined)": {iPopulation: 2800000, sType: "undefined"}, 
    "Beastman Wastes": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Brute-Men Territory": {iPopulation: 200000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aIcevale": ["Argandir", "Icevale (undefined)"], 
    "Icevale": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Argandir": {iPopulation: 5500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Icevale (undefined)": {iPopulation: 94500, sType: "undefined"}, 
    "Jennite Holdings": {iPopulation: 400000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aKogolor": ["Kolmstat", "Kogolor (undefined)"], 
    "Kogolor": {iPopulation: 505000, Dwarf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Kolmstat": {iPopulation: 28000, Dwarf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Kogolor (undefined)": {iPopulation: 477000, Dwarf: 99, other: 1, sType: "undefined"}, 
    "aKrugelHordeTerritory": ["Ubul", "Krugel Horde Territory (undefined)"], 
    "Krugel Horde Territory": {iPopulation: 300000, Orc: 98, "Half-Orc": 1, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Ubul": {iPopulation: 6000, Orc: 98, "Half-Orc": 1, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Krugel Horde Territory (undefined)": {iPopulation: 294000, Orc: 98, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "Mapheggi Swamp": {iPopulation: 9090, Lizardfolk: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aMerryPirateSeas": ["Baraga", "Merry Pirate Seas (undefined)"], 
    "Merry Pirate Seas": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Baraga": {iPopulation: 30000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Merry Pirate Seas (undefined)": {iPopulation: 70000, sType: "undefined"}, 
    "aMilenianEmpire": ["Corisa", "Milenian Empire (undefined)"], 
    "Milenian Empire": {iPopulation: 3000000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Corisa": {iPopulation: 250000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Milenian Empire (undefined)": {iPopulation: 2750000, sType: "undefined"}, 
    "Neathar Lands": {iPopulation: 3000000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aNeatharum": ["Haldemar", "Neatharum (undefined)"], 
    "Neatharum": {iPopulation: 33000, Dwarf: 5, Gnome: 5, other: 90, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Haldemar": {iPopulation: 14000, Dwarf: 5, Gnome: 5, other: 90, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Neatharum (undefined)": {iPopulation: 19000, Dwarf: 5, Gnome: 5, other: 90, sType: "undefined"}, 
    "aNithia(Iciria)": ["Tarthis", "Nithia (Iciria) (undefined)"], 
    "Nithia (Iciria)": {iPopulation: 4000000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Tarthis": {iPopulation: 350000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Nithia (Iciria) (undefined)": {iPopulation: 3650000, sType: "undefined"}, 
    "aOltecKingdom": ["Manac", "Oltec Kingdom (undefined)"], 
    "Oltec Kingdom": {iPopulation: 500000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Manac": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Oltec Kingdom (undefined)": {iPopulation: 475000, sType: "undefined"}, 
    "aShattenalfheim": ["Issarthyl", "Shattenalfheim (undefined)"], 
    "Shattenalfheim": {iPopulation: 600000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Issarthyl": {iPopulation: 60000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Shattenalfheim (undefined)": {iPopulation: 540000, sType: "undefined"}, 
    "Tanagoro": {iPopulation: 500000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Traldar Kingdoms": {iPopulation: 500000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aIsleofDawn": ["Caerdwicca (region)", "Dunadale (region)", "East Portage (region)", "Ekto (region)", "Furmenglaive (region)", 
        "Helskir (region)", "Kendach (region)", "Redstone (region)", "Septentriona", "Thothia", "Trikelios (region)", "West Portage (region)", 
        "Westrourke"], 
    "Isle of Dawn": {iPopulation: 466000, sType: "region"}, 
    "aCaerdwicca(region)": ["Caerdwicca (settlement)", "Caerdwicca (region) (undefined)"], 
    "Caerdwicca (region)": {iPopulation: 2000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Caerdwicca (settlement)": {iPopulation: 500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Caerdwicca (region) (undefined)": {iPopulation: 1500, sType: "undefined"}, 
    "aDunadale(region)": ["Dunadale (settlement)", "Dunadale (region) (undefined)"], 
    "Dunadale (region)": {iPopulation: 78000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Dunadale (settlement)": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Dunadale (region) (undefined)": {iPopulation: 53000, sType: "undefined"}, 
    "aEastPortage(region)": ["East Portage (settlement)", "East Portage (region) (undefined)"], 
    "East Portage (region)": {iPopulation: 10000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "East Portage (settlement)": {iPopulation: 3000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "East Portage (region) (undefined)": {iPopulation: 7000, sType: "undefined"}, 
    "aEkto(region)": ["Ekto (settlement)", "Ekto (region) (undefined)"], 
    "Ekto (region)": {iPopulation: 28000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Ekto (settlement)": {iPopulation: 15000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Ekto (region) (undefined)": {iPopulation: 13000, sType: "undefined"}, 
    "aFurmenglaive(region)": ["Furmenglaive (settlement)", "Furmenglaive (region) (undefined)"], 
    "Furmenglaive (region)": {iPopulation: 3000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Furmenglaive (settlement)": {iPopulation: 600, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Furmenglaive (region) (undefined)": {iPopulation: 2400, sType: "undefined"}, 
    "aHelskir(region)": ["Helskir (settlement)", "Helskir (region) (undefined)"], 
    "Helskir (region)": {iPopulation: 40000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Helskir (settlement)": {iPopulation: 15000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Helskir (region) (undefined)": {iPopulation: 25000, sType: "undefined"}, 
    "aKendach(region)": ["Kendach (settlement)", "Kendach (region) (undefined)"], 
    "Kendach (region)": {iPopulation: 35000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Kendach (settlement)": {iPopulation: 3500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "compound"}, 
    "Kendach (region) (undefined)": {iPopulation: 31500, sType: "undefined"}, 
    "aRedstone(region)": ["Redstone (settlement)", "Redstone (region) (undefined)"], 
    "Redstone (region)": {iPopulation: 50000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Redstone (settlement)": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "compound"}, 
    "Redstone (region) (undefined)": {iPopulation: 25000, sType: "undefined"}, 
    "aSeptentriona": ["Laticea", "Septentriona (undefined)"], 
    "Septentriona": {iPopulation: 10000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Laticea": {iPopulation: 1500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Septentriona (undefined)": {iPopulation: 8500, sType: "undefined"}, 
    "aThothia": ["Edairo", "Thothia (undefined)"], 
    "Thothia": {iPopulation: 80000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Edairo": {iPopulation: 32000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Thothia (undefined)": {iPopulation: 48000, sType: "undefined"}, 
    "aTrikelios(region)": ["Trikelios (settlement)", "Trikelios (region) (undefined)"], 
    "Trikelios (region)": {iPopulation: 70000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Trikelios (settlement)": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Trikelios (region) (undefined)": {iPopulation: 45000, sType: "undefined"}, 
    "aWestPortage(region)": ["West Portage (settlement)", "West Portage (region) (undefined)"], 
    "West Portage (region)": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "West Portage (settlement)": {iPopulation: 1200, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "West Portage (region) (undefined)": {iPopulation: 3800, sType: "undefined"}, 
    "aWestrourke": ["Newkirk", "Westrourke (undefined)"], 
    "Westrourke": {iPopulation: 55000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Newkirk": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Westrourke (undefined)": {iPopulation: 30000, sType: "undefined"}, 
    "aJibaroe": ["Itucu", "Jibaroe (undefined)"], 
    "Jibaroe": {iPopulation: 1646, Phanaton: 99, other: 1, sType: "region"}, 
    "Itucu": {iPopulation: 1263, Phanaton: 99, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Jibaroe (undefined)": {iPopulation: 383, Phanaton: 99, other: 1, sType: "undefined"}, 
    "aNewAlphatianSea": ["Floating Ar"], 
    "New Alphatian Sea": {iPopulation: 50000, Human: 94, Elf: 5, other: 1, sType: "region"}, 
    "aFloatingAr": ["Skyreach", "Floating Ar (undefined)"], 
    "Floating Ar": {iPopulation: 50000, Human: 94, Elf: 5, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Skyreach": {iPopulation: 25000, Human: 94, Elf: 5, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Floating Ar (undefined)": {iPopulation: 25000, Human: 94, Elf: 5, other: 1, sType: "undefined"}, 
    "aNimmur": ["Er", "Nimmur (undefined)"], 
    "Nimmur": {iPopulation: 145202, Manscorpion: 99, other: 1, sSource: "Orc's Head", sType: "region"}, 
    "Er": {iPopulation: 19700, Manscoprion: 99, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Nimmur (undefined)": {iPopulation: 125502, Manscoprion: 99, other: 1, sType: "undefined"}, 
    "aPearlIslands": ["Seagirt", "Pearl Islands (undefined)"], 
    "Pearl Islands": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Seagirt": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Pearl Islands (undefined)": {iPopulation: 95000, sType: "undefined"}, 
    "Qeodhar": {iPopulation: 18000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aSavageCoast": ["Almarron", "Ator", "Bellayne", "Cay", "Cimarron", "Eusdria", "Gargona", "Guadalante", "Herath", "Hojah", "Narvaez", 
        "Nova Svoga (region)", "Renardy", "Robrenn", "Saragon", "Shazak", "Slagovich (region)", "Texeiras", "Torreon", "Vilaverde", 
        "Zagora (region)", "Zvornik"], 
    "Savage Coast": {iPopulation: 619694, sType: "region"}, 
    "aAlmarron": ["Ciudad Tejillas", "Almarron (undefined)"], 
    "Almarron": {iPopulation: 5475, sType: "region"}, 
    "Ciudad Tejillas": {iPopulation: 4200, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Almarron (undefined)": {iPopulation: 1275, sType: "undefined"}, 
    "aAtor": ["Gurr'ash", "Ator (undefined)"], 
    "Ator": {iPopulation: 4171, sType: "region"}, 
    "Gurr'ash": {iPopulation: 3200, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Ator (undefined)": {iPopulation: 971, sType: "undefined"}, 
    "aBellayne": ["Farfield", "Kitting", "Leminster", "Pachester", "Penwick", "Theeds (region)"], 
    "Bellayne": {iPopulation: 92867, sType: "region"}, 
    "aFarfield": ["Wickerton", "Farfield (undefined)"], 
    "Farfield": {iPopulation: 8603, sType: "region"}, 
    "Wickerton": {iPopulation: 6600, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Farfield (undefined)": {iPopulation: 2003, sType: "undefined"}, 
    "aKitting": ["Glenswych", "Kitting (undefined)"], 
    "Kitting": {iPopulation: 5866, sType: "region"}, 
    "Glenswych": {iPopulation: 4500, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Kitting (undefined)": {iPopulation: 1366, sType: "undefined"}, 
    "Leminster": {iPopulation: 30300, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "aPachester": ["Wallingford", "Pachester (undefined)"], 
    "Pachester": {iPopulation: 8733, sType: "region"}, 
    "Wallingford": {iPopulation: 6700, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Pachester (undefined)": {iPopulation: 2033, sType: "undefined"}, 
    "aPenwick": ["Norchester", "Penwick (undefined)"], 
    "Penwick": {iPopulation: 10167, sType: "region"}, 
    "Norchester": {iPopulation: 7800, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Penwick (undefined)": {iPopulation: 2367, sType: "undefined"}, 
    "aTheeds(region)": ["Theeds (settlement)", "Theeds (region) (undefined)"], 
    "Theeds (region)": {iPopulation: 29198, sType: "region"}, 
    "Theeds (settlement)": {iPopulation: 22400, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Theeds (region) (undefined)": {iPopulation: 6798, sType: "undefined"}, 
    "aCay": ["Tu'eth", "Cay (undefined)"], 
    "Cay": {iPopulation: 11620, sType: "region"}, 
    "Tu'eth": {iPopulation: 8900, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Cay (undefined)": {iPopulation: 2720, sType: "undefined"}, 
    "aCimarron": ["Dunwick", "Richland", "Smokestone City", "Cimarron (undefined)"], 
    "Cimarron": {iPopulation: 46740, sType: "region"}, 
    "Dunwick": {iPopulation: 22000, sSource: "Savage Baronies", sType: "settlement"}, 
    "Richland": {iPopulation: 2300, sSource: "Savage Baronies", sType: "settlement"}, 
    "Smokestone City": {iPopulation: 11500, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Cimarron (undefined)": {iPopulation: 10940, sType: "undefined"}, 
    "aEusdria": ["Frisonnia", "Harstal (region)", "Mohesia", "Othmar", "Savaria"], 
    "Eusdria": {iPopulation: 61813, sType: "region"}, 
    "aFrisonnia": ["Breimald", "Frisonnia (undefined)"], 
    "Frisonnia": {iPopulation: 16059, sType: "region"}, 
    "Breimald": {iPopulation: 12300, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Frisonnia (undefined)": {iPopulation: 3759, sType: "undefined"}, 
    "aHarstal(region)": ["Harstal (settlement)", "Harstal (region) (undefined)"], 
    "Harstal (region)": {iPopulation: 13578, sType: "region"}, 
    "Harstal (settlement)": {iPopulation: 10400, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Harstal (region) (undefined)": {iPopulation: 3178, sType: "undefined"}, 
    "aMohesia": ["Verdegild", "Mohesia (undefined)"], 
    "Mohesia": {iPopulation: 13578, sType: "region"}, 
    "Verdegild": {iPopulation: 10400, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Mohesia (undefined)": {iPopulation: 3178, sType: "undefined"}, 
    "Othmar": {iPopulation: 7500, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "aSavaria": ["Reslar", "Savaria (undefined)"], 
    "Savaria": {iPopulation: 11098, sType: "region"}, 
    "Reslar": {iPopulation: 8500, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Savaria (undefined)": {iPopulation: 2598, sType: "undefined"}, 
    "aGargona": ["Ciudad Real", "Las Navas", "Gargona (undefined)"], 
    "Gargona": {iPopulation: 16361, sType: "region"}, 
    "Ciudad Real": {iPopulation: 11700, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Las Navas": {iPopulation: 800, sSource: "Savage Baronies", sType: "settlement"}, 
    "Gargona (undefined)": {iPopulation: 3861, sType: "undefined"}, 
    "aGuadalante": ["Ciudad Huelca", "Guadalante (undefined)"], 
    "Guadalante": {iPopulation: 8249, sType: "region"}, 
    "Ciudad Huelca": {iPopulation: 6300, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Guadalante (undefined)": {iPopulation: 1949, sType: "undefined"}, 
    "aHerath": ["Asgamoth", "Berevrom", "Enom", "Ensheya", "Hethzya"], 
    "Herath": {iPopulation: 75588, sType: "region"}, 
    "Asgamoth": {iPopulation: 24000, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "aBerevrom": ["Amion", "Berevrom (undefined)"], 
    "Berevrom": {iPopulation: 5630, sType: "region"}, 
    "Amion": {iPopulation: 4300, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Berevrom (undefined)": {iPopulation: 1330, sType: "undefined"}, 
    "aEnom": ["Nezhev", "Enom (undefined)"], 
    "Enom": {iPopulation: 7463, sType: "region"}, 
    "Nezhev": {iPopulation: 5700, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Enom (undefined)": {iPopulation: 1763, sType: "undefined"}, 
    "aEnsheya": ["Sorodh", "Ensheya (undefined)"], 
    "Ensheya": {iPopulation: 14272, sType: "region"}, 
    "Sorodh": {iPopulation: 10900, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Ensheya (undefined)": {iPopulation: 3372, sType: "undefined"}, 
    "aHethzya": ["Shahav", "Hethzya (undefined)"], 
    "Hethzya": {iPopulation: 24223, sType: "region"}, 
    "Shahav": {iPopulation: 18500, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Hethzya (undefined)": {iPopulation: 5723, sType: "undefined"}, 
    "aHojah": ["Shkodar", "Hojah (undefined)"], 
    "Hojah": {iPopulation: 10226, Human: 65, Dwarf: 17, Elf: 17, other: 1, sType: "region"}, 
    "Shkodar": {iPopulation: 7800, Human: 65, Dwarf: 17, Elf: 17, other: 1, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Hojah (undefined)": {iPopulation: 2426, Human: 65, Dwarf: 17, Elf: 17, other: 1, sType: "undefined"}, 
    "aNarvaez": ["Puerto Morillos", "Narvaez (undefined)"], 
    "Narvaez": {iPopulation: 16126, sType: "region"}, 
    "Puerto Morillos": {iPopulation: 12300, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Narvaez (undefined)": {iPopulation: 3826, sType: "undefined"}, 
    "aNovaSvoga(region)": ["Nova Svoga (settlement)", "Nova Svoga (region) (undefined)"], 
    "Nova Svoga (region)": {iPopulation: 6950, Human: 65, Dwarf: 17, Elf: 17, other: 1, sType: "region"}, 
    "Nova Svoga (settlement)": {iPopulation: 5300, Human: 65, Dwarf: 17, Elf: 17, other: 1, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Nova Svoga (region) (undefined)": {iPopulation: 1650, Human: 65, Dwarf: 17, Elf: 17, other: 1, sType: "undefined"}, 
    "aRenardy": ["Bregoigne", "Louvines", "Marmandie", "Noijou", "Ysembragne"], 
    "Renardy": {iPopulation: 64495, sType: "region"}, 
    "aBregoigne": ["Rochefort", "Bregoigne (undefined)"], 
    "Bregoigne": {iPopulation: 4067, sType: "region"}, 
    "Rochefort": {iPopulation: 3100, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Bregoigne (undefined)": {iPopulation: 967, sType: "undefined"}, 
    "Louvines": {iPopulation: 31700, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "aMarmandie": ["Mons-en-Plecy", "Marmandie (undefined)"], 
    "Marmandie": {iPopulation: 9576, sType: "region"}, 
    "Mons-en-Plecy": {iPopulation: 7300, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Marmandie (undefined)": {iPopulation: 2276, sType: "undefined"}, 
    "aNoijou": ["Pertignac", "Noijou (undefined)"], 
    "Noijou": {iPopulation: 8264, sType: "region"}, 
    "Pertignac": {iPopulation: 6300, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Noijou (undefined)": {iPopulation: 1964, sType: "undefined"}, 
    "aYsembragne": ["Deauvais", "Ysembragne (undefined)"], 
    "Ysembragne": {iPopulation: 10888, sType: "region"}, 
    "Deauvais": {iPopulation: 8300, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Ysembragne (undefined)": {iPopulation: 2588, sType: "undefined"}, 
    "aRobrenn": ["Avarica", "Avernos", "Eyf", "Morguen", "Nemausa", "Sedhuen", "Suerba", "Uthuinn"], 
    "Robrenn": {iPopulation: 92244, sType: "region"}, 
    "aAvarica": ["Dubrax", "Avarica (undefined)"], 
    "Avarica": {iPopulation: 7741, sType: "region"}, 
    "Dubrax": {iPopulation: 5900, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Avarica (undefined)": {iPopulation: 1841, sType: "undefined"}, 
    "aAvernos": ["Arax", "Avernos (undefined)"], 
    "Avernos": {iPopulation: 7741, sType: "region"}, 
    "Arax": {iPopulation: 5900, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Avernos (undefined)": {iPopulation: 1841, sType: "undefined"}, 
    "Eyf": {iPopulation: 25200, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "aMorguen": ["Cernunna", "Morguen (undefined)"], 
    "Morguen": {iPopulation: 14301, sType: "region"}, 
    "Cernunna": {iPopulation: 10900, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Morguen (undefined)": {iPopulation: 3401, sType: "undefined"}, 
    "aNemausa": ["Morigamna", "Nemausa (undefined)"], 
    "Nemausa": {iPopulation: 13251, sType: "region"}, 
    "Morigamna": {iPopulation: 10100, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Nemausa (undefined)": {iPopulation: 3151, sType: "undefined"}, 
    "aSedhuen": ["Venatis", "Sedhuen (undefined)"], 
    "Sedhuen": {iPopulation: 15613, sType: "region"}, 
    "Venatis": {iPopulation: 11900, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Sedhuen (undefined)": {iPopulation: 3713, sType: "undefined"}, 
    "aSuerba": ["Ogmna", "Suerba (undefined)"], 
    "Suerba": {iPopulation: 4986, sType: "region"}, 
    "Ogmna": {iPopulation: 3800, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Suerba (undefined)": {iPopulation: 1186, sType: "undefined"}, 
    "aUthuinn": ["Senerobriva", "Uthuinn (undefined)"], 
    "Uthuinn": {iPopulation: 3411, sType: "region"}, 
    "Senerobriva": {iPopulation: 2600, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Uthuinn (undefined)": {iPopulation: 811, sType: "undefined"}, 
    "aSaragon": ["Ciudad Matacan", "Las Manadas", "Saragon (undefined)"], 
    "Saragon": {iPopulation: 9862, sType: "region"}, 
    "Ciudad Matacan": {iPopulation: 6600, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Las Manadas": {iPopulation: 900, sSource: "Savage Baronies", sType: "settlement"}, 
    "Saragon (undefined)": {iPopulation: 2362, sType: "undefined"}, 
    "aShazak": ["Ah'roog", "Shazak (undefined)"], 
    "Shazak": {iPopulation: 9862, sType: "region"}, 
    "Ah'roog": {iPopulation: 7500, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Shazak (undefined)": {iPopulation: 2362, sType: "undefined"}, 
    "aSlagovich(region)": ["Slagovich (settlement)", "Slagovich (region) (undefined)"], 
    "Slagovich (region)": {iPopulation: 22879, sType: "region"}, 
    "Slagovich (settlement)": {iPopulation: 17400, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Slagovich (region) (undefined)": {iPopulation: 5479, sType: "undefined"}, 
    "aTexeiras": ["Boa Mansao", "Texeiras (undefined)"], 
    "Texeiras": {iPopulation: 11439, sType: "region"}, 
    "Boa Mansao": {iPopulation: 8700, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Texeiras (undefined)": {iPopulation: 2739, sType: "undefined"}, 
    "aTorreon": ["Ciudad de Leon", "Ciudad Morales", "Torreon (undefined)"], 
    "Torreon": {iPopulation: 18671, sType: "region"}, 
    "Ciudad de Leon": {iPopulation: 7400, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Ciudad Morales": {iPopulation: 6800, sSource: "Savage Baronies", sType: "settlement"}, 
    "Torreon (undefined)": {iPopulation: 4471, sType: "undefined"}, 
    "aVilaverde": ["Porto Preto", "Vilaverde (undefined)"], 
    "Vilaverde": {iPopulation: 12886, sType: "region"}, 
    "Porto Preto": {iPopulation: 9800, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Vilaverde (undefined)": {iPopulation: 3086, sType: "undefined"}, 
    "aZagora(region)": ["Zagora (settlement)", "Zagora (region) (undefined)"], 
    "Zagora (region)": {iPopulation: 12360, sType: "region"}, 
    "Zagora (settlement)": {iPopulation: 9400, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Zagora (region) (undefined)": {iPopulation: 2960, sType: "undefined"}, 
    "aZvornik": ["Raska", "Zvornik (undefined)"], 
    "Zvornik": {iPopulation: 8810, sType: "region"}, 
    "Raska": {iPopulation: 6700, sSource: "Red Steel Campaign Setting", sType: "settlement"}, 
    "Zvornik (undefined)": {iPopulation: 2110, sType: "undefined"}, 
    "aSeaofDawn": ["Alatian Islands", "Aquas", "Monster Island", "Ochalea"], 
    "Sea of Dawn": {iPopulation: 241500, sType: "region"}, 
    "aAlatianIslands": ["Aegos", "Aeria", "Gaity", "Ne'er-Do-Well"], 
    "Alatian Islands": {iPopulation: 74000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aAegos": ["Aegopoli", "Aegos (undefined)"], 
    "Aegos": {iPopulation: 20000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Aegopoli": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Aegos (undefined)": {iPopulation: 15000, sType: "undefined"}, 
    "aAeria": ["Featherfall", "Aeria (undefined)"], 
    "Aeria": {iPopulation: 16000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Featherfall": {iPopulation: 10000, sSource: "Poor Wizard's Alamanac III & Book of Facts", sType: "settlement"}, 
    "Aeria (undefined)": {iPopulation: 6000, sType: "undefined"}, 
    "Gaity": {iPopulation: 13000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aNe'er-Do-Well": ["Crossroads", "Ne'er-Do-Well (undefined)"], 
    "Ne'er-Do-Well": {iPopulation: 25000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Crossroads": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Ne'er-Do-Well (undefined)": {iPopulation: 20000, sType: "undefined"}, 
    "Aquas": {iPopulation: 41000, Human: 95, Elf: 4, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Monster Island": {iPopulation: 1500, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aOchalea": ["Beitung", "Ochalea (undefined)"], 
    "Ochalea": {iPopulation: 125000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Beitung": {iPopulation: 50000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Ochalea (undefined)": {iPopulation: 75000, sType: "undefined"}, 
    "aSeaofDread": ["Ierendi", "Minrothad Guilds", "Yavdlom"], 
    "Sea of Dread": {iPopulation: 1265850, sType: "region"}, 
    "aIerendi": ["Alcove Island", "Aloysius Island", "Elegy Island", "Fletcher Island", "Honor Island", "Ierendi Island", "Roister Island", 
        "Safari Island", "Utter Island", "White Island"], 
    "Ierendi": {iPopulation: 57850, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Alcove Island": {iPopulation: 1200, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Aloysius Island": {iPopulation: 2100, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Elegy Island": {iPopulation: 2800, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Fletcher Island": {iPopulation: 1800, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Honor Island": {iPopulation: 1000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Ierendi Island": {iPopulation: 40000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Roister Island": {iPopulation: 850, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Safari Island": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Utter Island": {iPopulation: 3000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "White Island": {iPopulation: 100, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aMinrothadGuilds": ["Alfeisle", "Fire Island", "Fortress Island", "Minrothad", "North Island", "Open Isle", "Trader's Isle", "Verdun"], 
    "Minrothad Guilds": {iPopulation: 208000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aAlfeisle": ["Sea Home", "Alfeisle (undefined)"], 
    "Alfeisle": {iPopulation: 65564, "Water Elf": 95, other: 5, sType: "region"}, 
    "Sea Home": {iPopulation: 25000, "Water Elf": 95, other: 5, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Alfeisle (undefined)": {iPopulation: 40564, "Water Elf": 95, other: 5, sType: "undefined"}, 
    "aFireIsland": ["Cove Harbor", "Fire Island (undefined)"], 
    "Fire Island": {iPopulation: 18358, sType: "region"}, 
    "Cove Harbor": {iPopulation: 7000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Fire Island (undefined)": {iPopulation: 11358, sType: "undefined"}, 
    "aFortressIsland": ["Stronghold", "Fortress Island (undefined)"], 
    "Fortress Island": {iPopulation: 26226, Dwarf: 99, other: 1, sType: "region"}, 
    "Stronghold": {iPopulation: 10000, Dwarf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Fortress Island (undefined)": {iPopulation: 16226, Dwarf: 99, other: 1, sType: "undefined"}, 
    "Minrothad": {iPopulation: 26000, Elf: 43, Human: 43, other: 14, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "aNorthIsland": ["Gapton", "North Island (undefined)"], 
    "North Island": {iPopulation: 13113, sType: "region"}, 
    "Gapton": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "North Island (undefined)": {iPopulation: 8113, sType: "undefined"}, 
    "aOpenIsle": ["Malfton", "Open Isle (undefined)"], 
    "Open Isle": {iPopulation: 13113, Halfling: 80, other: 20, sType: "region"}, 
    "Malfton": {iPopulation: 5000, Halfling: 80, other: 20, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Open Isle (undefined)": {iPopulation: 8113, Halfling: 80, other: 20, sType: "undefined"}, 
    "aTrader'sIsle": ["Harbortown", "Trader's Isle (undefined)"], 
    "Trader's Isle": {iPopulation: 32126, Elf: 43, Human: 43, other: 14, sType: "region"}, 
    "Harbortown": {iPopulation: 12250, Elf: 43, Human: 43, other: 14, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Trader's Isle (undefined)": {iPopulation: 19876, Elf: 43, Human: 43, other: 14, sType: "undefined"}, 
    "Verdun": {iPopulation: 13500, Elf: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Yavdlom": {iPopulation: 1000000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Serraine": {iPopulation: 2400, Gnome: 62, Human: 4, Elf: 3, other: 31, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "aShadowElfTerritory": ["Alfmyr", "City of the Stars", "Losetrel", "New Grunland", "Shadow Elf Territory (undefined)"], 
    "Shadow Elf Territory": {iPopulation: 425000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Alfmyr": {iPopulation: 23000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "City of the Stars": {iPopulation: 200000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Losetrel": {iPopulation: 15000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "New Grunland": {iPopulation: 35000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Shadow Elf Territory (undefined)": {iPopulation: 152000, sType: "undefined"}, 
    "aSkothar": ["Esterhold", "Jen", "Minaean Coast"], 
    "Skothar": {iPopulation: 830000, sType: "region"}, 
    "aEsterhold": ["Anchorage", "Blackrock", "Port Marlin", "Rock Harbor", "Verdan"], 
    "Esterhold": {iPopulation: 230000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Anchorage": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "aBlackrock": ["Skyfyr", "Blackrock (undefined)"], 
    "Blackrock": {iPopulation: 60000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Skyfyr": {iPopulation: 15000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Blackrock (undefined)": {iPopulation: 45000, sType: "undefined"}, 
    "Port Marlin": {iPopulation: 10000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Rock Harbor": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "aVerdan": ["Faraway", "Verdan (undefined)"], 
    "Verdan": {iPopulation: 150000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Faraway": {iPopulation: 35000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Verdan (undefined)": {iPopulation: 115000, sType: "undefined"}, 
    "Jen": {iPopulation: 100000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aMinaeanCoast": ["Minaea", "Minaean Coast (undefined)"], 
    "Minaean Coast": {iPopulation: 500000, Human: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "Minaea": {iPopulation: 25000, Human: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"}, 
    "Minaean Coast (undefined)": {iPopulation: 475000, Human: 99, other: 1, sType: "undefined"}, 
    "aValoin-Flamaeker": ["Oostdok"], 
    "Valoin-Flamaeker": {iPopulation: 20200, Gnome: 99, other: 1, sType: "region"}, 
    "Oostdok": {iPopulation: 20200, Gnome: 99, other: 1, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "region"}, 
    "aWallara": ["Risilvar", "Wallara (undefined)"], 
    "Wallara": {iPopulation: 12645, Wallara: 99, other: 1, sType: "region"}, 
    "Risilvar": {iPopulation: 9595, Wallara: 99, other: 1, sSource: "Orc's Head", sType: "settlement"}, 
    "Wallara (undefined)": {iPopulation: 3050, Wallara: 99, other: 1, sType: "undefined"}, 
    "aWesternOrclands": ["Ghonam", "Sulkar", "Yamekh"], 
    "Western Orclands": {iPopulation: 6262, Orc: 99, other: 1, sType: "region"}, 
    "Ghonam": {iPopulation: 3030, Orc: 99, other: 1, sSource: "Orc's Head", sType: "region"}, 
    "Sulkar": {iPopulation: 1010, Orc: 99, other: 1, sSource: "Orc's Head", sType: "region"}, 
    "Yamekh": {iPopulation: 2222, Orc: 99, other: 1, sSource: "Orc's Head", sType: "region"}, 
    "Yannivey Islands": {iPopulation: 5000, sSource: "Poor Wizard's Almanac III & Book of Facts", sType: "settlement"},
    sType: "region"
};

oNIB.oSettings["Wilderlands of High Fantasy"] = {
    "aWilderlandsofHighFantasy": ["Ament Tundra", "Barbarian Altanis", "City State of the Invincible Overlord (region)", "Desert Lands", 
        "Ebony Coast", "Elphand Lands", "Ghinor", "Ghinor Highlands", "Isles of the Blest", "Isles of the Dawn", "Lenap (region)", 
        "Sea of Five Winds", "Silver Skein Isles", "Southern Reaches", "Tarantis (region)", "Valley of the Ancients", "Valon (region)", 
        "Viridistan (region)"],
    "aAmentTundra": ["Aleshall Hold", "Andlemainge", "Asimar", "Bakshan", "Banarua", "Cadsandria", "Devil's Hollow", "Dhakos", "Dorel",
        "Duchy of Craghold", "Excemora", "Filkhar", "Fort Kaisorn", "Gromooman", "Haspilar", "H'sur", "Ianthon","Icchykul", "Illmar", 
        "Illmorat", "Jadnar", "Jharkorlis", "Josay", "Kanakak", "Kren", "Lolerofel Monastery", "Lormur", "Maidahr", "Monday Isles", 
        "Mux Citadel", "Nadsorkor", "Nargussor", "Nustle Nook", "Ohoy-Kan", "Old Hvelmarch", "Orgator Crossing", "Pikarud", "Ranasay", 
        "Raschell", "Riganarion", "Rufee", "Sequaloris", "Sheagoth", "Southfield Manor", "Sundog Spire", "Tarkesh", "Thokora", "Trepesay",
        "Vilmiran"],
    "Ament Tundra": {iPopulation: 39298, Human: 40, Elf: 16, Halfling: 15, Dwarf: 12, Orc: 8, "Half-Elf": 3, Gnome: 1, Goblin: 1, other: 4, sType: "region"},
    "Aleshall Hold": {iPopulation: 368, Human: 66, Elf: 30, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Andlemainge": {iPopulation: 712, Human: 69, Goblin: 20, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Asimar": {iPopulation: 1944, Elf: 84, "Half-Elf": 10, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Bakshan": {iPopulation: 752, Human: 89, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Banarua": {iPopulation: 416, Human: 84, Goblin: 10, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Cadsandria": {iPopulation: 1636, Human: 89, Elf: 3, Faerie: 2, Gnome: 2, Dwarf: 2, "First Men": 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Devil's Hollow": {iPopulation: 112, Human: 50, Kobold: 20, other: 30, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Dhakos": {iPopulation: 828, Human: 89, Goblin: 5, Troll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Dorel": {iPopulation: 1540, Dwarf: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Duchy of Craghold": {iPopulation: 440, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Excemora": {iPopulation: 320, Halfling: 40, Human: 20, Dwarf: 15, other: 25, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Filkhar": {iPopulation: 444, Human: 93, Elf: 4, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Fort Kaisorn": {iPopulation: 436, Human: 75, other: 25, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Gromooman": {iPopulation: 1108, Orc: 79, Human: 10, Dwarf: 5, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Haspilar": {iPopulation: 388, Dwarf: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "H'sur": {iPopulation: 200, Human: 50, Gnome: 20, other: 30, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Ianthon": {iPopulation: 276, Human: 85, other: 15, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Icchykul": {iPopulation: 204, Human: 80, other: 20, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Illmar": {iPopulation: 964, Dwarf: 79, Human: 15, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Illmorat": {iPopulation: 400, Dwarf: 79, Human: 10, Halfling: 5, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Jadnar": {iPopulation: 920, Elf: 94, Gnome: 4, Pixie: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Jharkorlis": {iPopulation: 520, Elf: 89, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Josay": {iPopulation: 596, Dwarf: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Kanakak": {iPopulation: 1400, Human: 79, Orc: 10, Demonkind: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Kren": {iPopulation: 1372, Halfling: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Lolerofel Monastery": {iPopulation: 392, Elf: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Lormur": {iPopulation: 1420, Halfling: 79, Human: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Maidahr": {iPopulation: 980, "Half-Elf": 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Monday Isles": {iPopulation: 66, Human: 90, Halfling: 5, "Half-Elf": 3, "Half-Orc": 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Mux Citadel": {iPopulation: 800, Human: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Nadsorkor": {iPopulation: 968, Halfling: 94, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Nargussor": {iPopulation: 932, Elf: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Nustle Nook": {iPopulation: 128, Halfling: 98, other: 2, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Ohoy-Kan": {iPopulation: 576, Orc: 79, Gnoll: 10, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Old Hvelmarch": {iPopulation: 948, Human: 89, Elf: 8, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Orgator Crossing": {iPopulation: 696, Orc: 79, Halfling: 15, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Pikarud": {iPopulation: 884, Dwarf: 69, Human: 25, Goblin: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Ranasay": {iPopulation: 544, Human: 79, Elf: 10, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Raschell": {iPopulation: 1928, Human: 94, Troglodites: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Riganarion": {iPopulation: 900, Human: 79, Elf: 10, Dwarf: 5, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Rufee": {iPopulation: 1164, Orc: 79, "Half-Orc": 15, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Sequaloris": {iPopulation: 1760, Human: 79, Elf: 10, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Sheagoth": {iPopulation: 1820, Elf: 79, Dwarf: 10, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Southfield Manor": {iPopulation: 196, Human: 40, Elf: 35, Gnome: 15, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Sundog Spire": {iPopulation: 360, Human: 75, other: 25, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "Tarkesh": {iPopulation: 792, Human: 84, Elf: 10, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Thokora": {iPopulation: 964, Halfling: 84, Gnome: 10, Pixie: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Trepesay": {iPopulation: 500, Halfling: 84, Dwarf: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "Vilmiran": {iPopulation: 1284, Halfling: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "aBarbarianAltanis": ["Actun", "Ahyf", "Algasar", "Anatal", "Angask Lair", "Antil", "Barath", "Besgar", "Bisgen", "Bisituni", "Bistan", 
        "Blood Spear Hold", "Brafylia", "Britis", "Brotherhood of the Eye", "Canstad", "Carchimish", "Castle of the Arang-Tok", 
        "Castle of the Lion", "Castle of the Moon", "Castle of the Wode", "Castle Silvan", "Chacban", "Citadel of Air", "Citadel of Earth", 
        "Colisth", "Conclave of the Green Dales", "Dagoni Tower", "Daitia Hill", "Derkhalf Castle", "Doratis", "Ericsson Clanhold", 
        "Gate-Castle of the Black Sun", "Grove of Serenity", "Gungli Ma Temple", "Halafic", "Halkmenan", "Hall of the Laer", "Hamar Tower", 
        "Hara", "Hekeak Burrow", "Hell Pits of Genak", "Horaja", "Jarmoco", "Kandlis Castle", "Kauran", "Kestizar", "Ketche", "Kolda", 
        "Krens Cairn", "Kukul", "Lagoldurma Tower", "Lanstead Tower", "Larissa's Lair", "Little Kor", "Mysk", "Nippuri", "Onhir", 
        "Palen Spring", "Piyramys", "Plychen", "Quitzit", "Ractuan", "Rantar Keep", "Renth", "Sarene's Den", "Sarn's Tower", "Shadar's Den", 
        "Shedezar", "Shodan", "Skydome", "South March Tower", "South Tower", "Stigrix", "Stones of Whetwyd", "Strantath", "Sykmet", "Talud", 
        "Temple of Azure Dreams", "Temple of the Lady of Wisdom", "Tenoch", "Tower of Harastar", "Tower of Saradon", "Tower of the Tovar-Tal", 
        "Tower of Visions", "Tristor", "Ucatanis", "Unseen Conclave", "Valera", "Westfold Barrens", "Weststar", "Xochete", "Yusan's Den", 
        "Zothay"],
    "Barbarian Altanis": {iPopulation: 70665, Human: 48, Elf: 12, Dwarf: 6, Goblin: 6, "Half-Elf": 6, Gnoll: 4, Halfling: 4, Orc: 4, Gnome: 2, "Half-Orc": 1, "Mer-Elf": 1, other: 6, sType: "region"},
    "Actun": {iPopulation: 1744, Elf: 75, Human: 14, "Half-Elf": 5, Halfling: 3, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ahyf": {iPopulation: 1248, Human: 81, Gnome: 10, Halfling: 5, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Algasar": {iPopulation: 528, Human: 75, Halfling: 10, Elf: 8, "Half-Elf": 5, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Anatal": {iPopulation: 1488, Elf: 91, Dwarf: 4, Human: 3, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Angask Lair": {iPopulation: 50, Orc: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Antil": {iPopulation: 4688, Human: 78, "Half-Elf": 9, Elf: 5, "Hawk Folk": 3, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Barath": {iPopulation: 784, Orc: 60, other: 40, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Besgar": {iPopulation: 968, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bisgen": {iPopulation: 2248, Human: 75, "Half-Elf": 11, Elf: 6, Halfling: 3, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bisituni": {iPopulation: 1012, Halfling: 91, Dwarf: 5, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bistan": {iPopulation: 984, "Mer-Elf": 92, Human: 4, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blood Spear Hold": {iPopulation: 198, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Brafylia": {iPopulation: 1688, Goblin: 86, Ogre: 12, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Britis": {iPopulation: 492, Goblin: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Brotherhood of the Eye": {iPopulation: 42, Human: 84, Elf: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Canstad": {iPopulation: 264, Human: 80, "Half-Elf": 11, Elf: 6, other: 3, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Carchimish": {iPopulation: 1292, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle of the Arang-Tok": {iPopulation: 205, Orc: 89, "Half-Orc": 8, other: 3, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle of the Lion": {iPopulation: 478, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle of the Moon": {iPopulation: 360, Elf: 65, Human: 14, Halfling: 9, "Half-Elf": 8, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle of the Wode": {iPopulation: 492, Human: 75, Dwarf: 13, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle Silvan": {iPopulation: 521, Elf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Chacban": {iPopulation: 1724, Dwarf: 97, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Citadel of Air": {iPopulation: 45, Human: 37, "Half-Elf": 20, Elf: 18, Halfling: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Earth": {iPopulation: 160, Human: 91, Dwarf: 5, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Colisth": {iPopulation: 1044, "Half-Elf": 37, Human: 36, Dwarf: 10, Halfling: 7, other: 10, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Conclave of the Green Dales": {iPopulation: 92, Human: 36, "Half-Elf": 21, Elf: 18, Gnome: 10, Halfling: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dagoni Tower": {iPopulation: 285, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Daitia Hill": {iPopulation: 1336, Goblin: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Derkhalf Castle": {iPopulation: 400, Halfling: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Doratis": {iPopulation: 740, Human: 89, "Sea Elf": 6, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ericsson Clanhold": {iPopulation: 200, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Gate-Castle of the Black Sun": {iPopulation: 211, Human: 40, "Half-Orc": 17, Orc: 16, Goblin: 12, other: 15, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Grove of Serenity": {iPopulation: 244, Elf: 86, other: 14, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Gungli Ma Temple": {iPopulation: 240, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Halafic": {iPopulation: 1560, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Halkmenan": {iPopulation: 1384, "Half-Elf": 35, Elf: 22, Human: 18, Halfling: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hall of the Laer": {iPopulation: 80, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hamar Tower": {iPopulation: 160, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hara": {iPopulation: 976, Human: 82, Gnome: 8, Halfling: 5, Elf: 3, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hekeak Burrow": {iPopulation: 189, Gnoll: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hell Pits of Genak": {iPopulation: 277, Gnoll: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Horaja": {iPopulation: 1560, Orc: 40, "Half-Orc": 28, Human: 22, other: 10, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Jarmoco": {iPopulation: 880, Human: 74, Dwarf: 11, Halfling: 9, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kandlis Castle": {iPopulation: 434, Human: 82, "Half-Orc": 8, "Half-Elf": 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Kauran": {iPopulation: 2088, Human: 63, "Half-Elf": 23, Elf: 11, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kestizar": {iPopulation: 1080, "Half-Elf": 37, Human: 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ketche": {iPopulation: 568, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kolda": {iPopulation: 1428, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Krens Cairn": {iPopulation: 165, Human: 91, "Half-Elf": 5, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kukul": {iPopulation: 868, Goblin: 90, Human: 4, "Half-Orc": 3, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lagoldurma Tower": {iPopulation: 238, Human: 91, Dwarf: 5, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lanstead Tower": {iPopulation: 282, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Larissa's Lair": {iPopulation: 120, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Little Kor": {iPopulation: 680, Orc: 79, "Half-Orc": 9, Human: 5, Goblin: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mysk": {iPopulation: 1384, Human: 80, "Half-Elf": 9, Elf: 5, Dwarf: 3, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nippuri": {iPopulation: 944, Human: 86, Dwarf: 10, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Onhir": {iPopulation: 1824, Elf: 81, "Half-Elf": 7, Human: 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Palen Spring": {iPopulation: 692, Human: 81, Orc: 10, Goblin: 5, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Piyramys": {iPopulation: 864, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Plychen": {iPopulation: 604, Orc: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Quitzit": {iPopulation: 452, "Half-Elf": 37, Human: 20, Elf: 18, Dwarf: 10, Halfling: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ractuan": {iPopulation: 1220, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rantar Keep": {iPopulation: 72, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Renth": {iPopulation: 936, Elf: 68, "Half-Elf": 15, Human: 8, Dwarf: 5, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sarene's Den": {iPopulation: 258, Human: 85, Elf: 10, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sarn's Tower": {iPopulation: 252, Orc: 46, Human: 40, other: 14, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Shadar's Den": {iPopulation: 140, Human: 90, "Half-Elf": 6, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Shedezar": {iPopulation: 1144, Gnoll: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shodan": {iPopulation: 1008, Human: 84, "Half-Orc": 14, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Skydome": {iPopulation: 37, Orc: 95, Human: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "South March Tower": {iPopulation: 280, Human: 63, "Half-Elf": 20, Elf: 14, other: 3, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "South Tower": {iPopulation: 110, Human: 90, "Half-Elf": 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Stigrix": {iPopulation: 1376, Gnoll: 86, Human: 10, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Stones of Whetwyd": {iPopulation: 511, Human: 53, "Half-Elf": 17, Elf: 13, Gnome: 7, Halfling: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Strantath": {iPopulation: 1648, Human: 88, other: 12, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sykmet": {iPopulation: 1744, Human: 87, "Half-Elf": 6, Elf: 4, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Talud": {iPopulation: 748, Human: 90, Dwarf: 6, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Temple of Azure Dreams": {iPopulation: 320, Human: 74, "Half-Elf": 16, Elf: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Temple of the Lady of Wisdom": {iPopulation: 322, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tenoch": {iPopulation: 1020, Human: 75, "Half-Elf": 10, Elf: 8, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tower of Harastar": {iPopulation: 170, Elf: 78, Human: 9, "Half-Elf": 5, Halfling: 3, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of Saradon": {iPopulation: 152, Human: 75, "Mer-Elf": 15, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of the Tovar-Tal": {iPopulation: 40, Orc: 94, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of Visions": {iPopulation: 192, Human: 69, "Half-Orc": 30, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tristor": {iPopulation: 1092, Elf: 90, "Half-Elf": 6, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ucatanis": {iPopulation: 440, Human: 95, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Unseen Conclave": {iPopulation: 260, Gnome: 40, Human: 20, Elf: 18, "Half-Elf": 10, Halfling: 7, Dwarf: 3, other: 2, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Valera": {iPopulation: 1240, Human: 93, Dwarf: 4, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Westfold Barrens": {iPopulation: 162, Goblin: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Weststar": {iPopulation: 422, Human: 75, Halfling: 15, "Half-Elf": 8, other: 2, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Xochete": {iPopulation: 668, Halfling: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Yusan's Den": {iPopulation: 185, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Zothay": {iPopulation: 2220, Human: 65, "Half-Elf": 15, Elf: 10, Dwarf: 5, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "aCityStateoftheInvincibleOverlord(region)": ["Adderwood", "Aldorsson Clanhold", "Anguikan", "Anvil", "Armagh", "Arnett Castle", 
        "Ashenshaft", "Atwain", "Balik's Castle", "Barnelby Citadel", "Benobles", "Bernost", "Bier", "Bondmaid", "Boughrune", "Brezal Castle", 
        "Brushwood", "Bulwark", "Byrny", "Caelam", "Camp Eight", "Camp Eleven", "Camp Five", "Camp Four", "Camp Nine", "Camp One", "Camp Seven", 
        "Camp Six", "Camp Ten", "Camp Three", "Camp Twelve", "Camp Two", "Carnage", "Castle Balarnega", "Castle Gaurdhrakh", 
        "Castle of the Shield Maidens", "Castle Tarvik", "Castle Warwik", "Catalan", "Charnock", "Cilborith's Grove", "Citadel Dire", 
        "Citadel Loudring", "Citadel of Kauran", "Citadel of Ordun", "Citadel of Sulzannarg", "Citadel of Torval", "Citadel of Tenava", 
        "City State of the Invincible Overlord (settlement)", "Clanhold of Rakinach", "Claw Tower", "Conclave of Gwalion", 
        "Conclave of the Crag", "Conclave of the Twilight Anvil", "Council Spire", "Coven of the Shrouded Moon", "Crescent-Thorn Citadel", 
        "Croy", "Crucible", "Darkfield", "Darkling Citadel", "Darkwater Coven", "Dart", "Dearthmead", "Doom", "Dorn", "Dwarfport", 
        "Eastpoint Keep", "Elf-Burn", "Elixer", "Ered Chimera", "Fane of Miasma", "Fang Keep", "Farad", "Finmark", "Fireside", "Flint", 
        "Forecastle", "Forecastle Watch", "Foremost", "Gaehill", "Garman Citadel", "Gasconfold Castle", "Goblin Hill", "Goodnap", "Greenhold", 
        "Greybeard", "Grey Fang Keep", "Grey Haven Citadel", "Grita Heath", "Guilding", "Haghill", "Hankam", "Havocia", "Heatherbrush", 
        "Hidden Monastery of the Order of Tsathoggus", "Hindfell", "Hledra", "Hlymadle", "Holmgard Clanhold", "Hrimsglo", "Hunwood", 
        "Iron Spire Conclave", "Irungsway", "Karn", "Keep of Winter's Light", "Keystone Castle", "Kindoras Keep", "Lakenheath", "Landmarch", 
        "Lightelf", "Limerick", "Luckstone", "Mandan Castle", "Maskholm", "Midheaven", "Mill Haven", "Mistwind Conclave", "Mitra's Shieldhall", 
        "Modron", "Nightcave Coven", "Nightsword Castle", "Northguard Tower", "Oakenbridge", "Omen", "Orlage", "Ossary", "Ottergild", "Palewood",
        "Raedwulf Castle", "Red Cliffe", "Rockhollow", "Roger's Keep", "Ryefield", "Seahill", "Seahill Castle", "Sea Rune", "Seasteadholm", 
        "Seastrand", "Serpeant Little", "Shavenoar", "Shewolf", "Shipshore Harbor", "Shrine of Medr", "Shrine of the Spider and Forge", 
        "Shrine of the Tree", "Silent Winds Conclave", "Skaney", "Smite", "Smitten", "Southguard Castle", "Southguard Tower", 
        "Southwatch Castle", "Springle", "Sticklestead", "Sunfells", "Sunlitten", "Sven's Freehold", "Swain's Cairn", "Syfwitch Hold", "Tain", 
        "Talgard Clanhold", "Tegel", "Temple of the Azure Sky", "Temple of the Deep", "Temple of the Golden Axe", 
        "Temple of the Spider Goddess", "Temple of the Storm Father", "Thorsvirke", "Thunderhold", "Tirantal Keep", "Tower of Anselor", 
        "Tower of Keystone's Shadow", "Tower of Sirron's Vale", "Trollkeep", "Trollslore", "Troth", "Twinhorn Gate", "Varin's Firth", "Warwik", 
        "Weirding Coven", "Wenlock", "Westgate Castle", "Wildwood", "Woe", "Wolfstone", "Wormingford", "Zarthstone"],
    "City State of the Invincible Overlord (region)": {iPopulation: 279359, Human: 68, Dwarf: 9, Elf: 6, Halfling: 6, Gnome: 2, Gnoll: 1, Goblin: 1, "Half-Elf": 1, Orc: 1, other: 5, sType: "region"},
    "Adderwood": {iPopulation: 1248, Elf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Aldorsson Clanhold": {iPopulation: 140, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Anguikan": {iPopulation: 1648, Elf: 79, "Half-Elf": 9, Human: 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Anvil": {iPopulation: 736, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Armagh": {iPopulation: 1068, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Arnett Castle": {iPopulation: 520, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Ashenshaft": {iPopulation: 1704, "Half-Elf": 59, Human: 40, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Atwain": {iPopulation: 1280, Halfling: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Balik's Castle": {iPopulation: 520, "Half-Orc": 37, Human: 20, Orc: 18, Goblin: 10, Gnoll: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Barnelby Citadel": {iPopulation: 80, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Benobles": {iPopulation: 1064, Elf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bernost": {iPopulation: 1952, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bier": {iPopulation: 680, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bondmaid": {iPopulation: 664, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Boughrune": {iPopulation: 920, Human: 71, "Half-Orc": 13, Elf: 9, "Half-Elf": 5, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Brezal Castle": {iPopulation: 320, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Brushwood": {iPopulation: 528, Human: 79, Elf: 9, "Half-Elf": 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bulwark": {iPopulation: 1172, Halfling: 79, Human: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Byrny": {iPopulation: 1848, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Caelam": {iPopulation: 1960, Human: 79, "Half-Orc": 9, Orc: 5, Goblin: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Eight": {iPopulation: 340, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Eleven": {iPopulation: 400, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Five": {iPopulation: 368, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Four": {iPopulation: 352, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Nine": {iPopulation: 400, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp One": {iPopulation: 332, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Seven": {iPopulation: 388, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Six": {iPopulation: 405, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Ten": {iPopulation: 372, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Three": {iPopulation: 376, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Twelve": {iPopulation: 316, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Camp Two": {iPopulation: 380, Gnome: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Carnage": {iPopulation: 960, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle Balarnega": {iPopulation: 280, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Gaurdhrakh": {iPopulation: 499, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle of the Shield Maidens": {iPopulation: 520, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Tarvik": {iPopulation: 440, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Warwik": {iPopulation: 480, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Catalan": {iPopulation: 1968, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Charnock": {iPopulation: 1880, Human: 79, "Half-Elf": 9, Elf: 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Cilborith's Grove": {iPopulation: 40, Elf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel Dire": {iPopulation: 180, Orc: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel Loudring": {iPopulation: 520, Dwarf: 41, Human: 25, Halfling: 10, Elf: 9, "Half-Elf": 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Kauran": {iPopulation: 40, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Ordun": {iPopulation: 160, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Sulzannarg": {iPopulation: 100, Human: 97, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Citadel of Torval": {iPopulation: 250, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Tenava": {iPopulation: 160, Human: 37, Elf: 20, "Half-Elf": 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "City State of the Invincible Overlord (settlement)": {iPopulation: 80000, Human: 72, Dwarf: 16, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Clanhold of Rakinach": {iPopulation: 160, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Claw Tower": {iPopulation: 160, Orc: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Conclave of Gwalion": {iPopulation: 240, Human: 37, Dwarf: 20, Halfling: 18, Elf: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Conclave of the Crag": {iPopulation: 200, Human: 37, Elf: 20, "Half-Elf": 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Conclave of the Twilight Anvil": {iPopulation: 200, Human: 37, Gnome: 20, Halfling: 18, Elf: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Council Spire": {iPopulation: 320, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Coven of the Shrouded Moon": {iPopulation: 320, Human: 79, Goblin: 9, "Half-Orc": 5, Orc: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Crescent-Thorn Citadel": {iPopulation: 48, Elf: 37, "Half-Elf": 20, Human: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Croy": {iPopulation: 1832, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Crucible": {iPopulation: 664, Orc: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Darkfield": {iPopulation: 700, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Darkling Citadel": {iPopulation: 80, Human: 70, Orc: 18, "Half-Orc": 5, Goblin: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Darkwater Coven": {iPopulation: 160, Human: 79, Orc: 9, "Half-Orc": 5, Goblin: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dart": {iPopulation: 1080, Goblin: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dearthmead": {iPopulation: 1240, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Doom": {iPopulation: 1220, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dorn": {iPopulation: 920, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dwarfport": {iPopulation: 75, Dwarf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Eastpoint Keep": {iPopulation: 160, "Half-Elf": 37, Human: 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Elf-Burn": {iPopulation: 576, Elf: 79, Human: 9, "Half-Elf": 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Elixer": {iPopulation: 1560, Dwarf: 37, Human: 20, Halfling: 18, Elf: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ered Chimera": {iPopulation: 1032, Orc: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fane of Miasma": {iPopulation: 280, Human: 92, Dwarf: 4, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Fang Keep": {iPopulation: 480, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Farad": {iPopulation: 270, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Finmark": {iPopulation: 1200, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fireside": {iPopulation: 1320, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Flint": {iPopulation: 1168, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Forecastle": {iPopulation: 620, Gnoll: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Forecastle Watch": {iPopulation: 200, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Foremost": {iPopulation: 1400, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gaehill": {iPopulation: 1576, Dwarf: 35, Human: 22, Halfling: 18, Elf: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Garman Citadel": {iPopulation: 173, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Gasconfold Castle": {iPopulation: 600, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Goblin Hill": {iPopulation: 1828, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Goodnap": {iPopulation: 860, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Greenhold": {iPopulation: 120, Human: 37, "Half-Elf": 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Greybeard": {iPopulation: 1780, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Grey Fang Keep": {iPopulation: 400, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Grey Haven Citadel": {iPopulation: 40, Human: 37, "Half-Elf": 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Grita Heath": {iPopulation: 440, Human: 81, Elf: 10, "Half-Elf": 5, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Guilding": {iPopulation: 1224, "Half-Elf": 37, Human: 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Haghill": {iPopulation: 608, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hankam": {iPopulation: 732, Human: 79, Gnoll: 9, "Half-Orc": 5, Orc: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Havocia": {iPopulation: 620, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Heatherbrush": {iPopulation: 784, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hidden Monastery of the Order of Tsathoggus": {iPopulation: 160, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hindfell": {iPopulation: 1336, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hledra": {iPopulation: 864, Goblin: 79, Human: 9, "Half-Orc": 5, Orc: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hlymadle": {iPopulation: 1360, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Holmgard Clanhold": {iPopulation: 200, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hrimsglo": {iPopulation: 273, Human: 80, Halfling: 8, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hunwood": {iPopulation: 1808, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Iron Spire Conclave": {iPopulation: 560, Human: 37, "Half-Elf": 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Irungsway": {iPopulation: 720, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Karn": {iPopulation: 1060, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Keep of Winter's Light": {iPopulation: 120, Human: 37, Dwarf: 20, Halfling: 18, Elf: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Keystone Castle": {iPopulation: 400, Human: 89, "Half-Orc": 9, other: 2, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Kindoras Keep": {iPopulation: 56, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lakenheath": {iPopulation: 2060, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Landmarch": {iPopulation: 1768, "Half-Elf": 37, Elf: 20, Human: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lightelf": {iPopulation: 1660, Gnome: 69, Human: 30, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Limerick": {iPopulation: 600, Human: 79, "Half-Elf": 9, Elf: 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Luckstone": {iPopulation: 896, Human: 72, Halfling: 17, Elf: 5, Dwarf: 3, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mandan Castle": {iPopulation: 640, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Maskholm": {iPopulation: 1560, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Midheaven": {iPopulation: 334, Human: 88, Elf: 5, "Half-Elf": 2, Dwarf: 1, "Half-Orc": 1, Gnome: 1, Halfling: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mill Haven": {iPopulation: 760, Human: 79, Gnome: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mistwind Conclave": {iPopulation: 120, Human: 37, "Half-Elf": 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Mitra's Shieldhall": {iPopulation: 50, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Modron": {iPopulation: 4920, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nightcave Coven": {iPopulation: 80, Human: 79, Goblin: 9, "Half-Orc": 5, Orc: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Nightsword Castle": {iPopulation: 480, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Northguard Tower": {iPopulation: 160, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Oakenbridge": {iPopulation: 1272, Human: 79, Gnome: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Omen": {iPopulation: 944, Human: 37, Dwarf: 20, Halfling: 18, Elf: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Orlage": {iPopulation: 664, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ossary": {iPopulation: 12800, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ottergild": {iPopulation: 736, Human: 79, "Half-Orc": 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Palewood": {iPopulation: 456, Elf: 79, Human: 9, "Half-Elf": 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Raedwulf Castle": {iPopulation: 240, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Red Cliffe": {iPopulation: 504, Human: 79, "Half-Elf": 9, Elf: 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rockhollow": {iPopulation: 840, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Roger's Keep": {iPopulation: 240, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Ryefield": {iPopulation: 512, Human: 79, Elf: 9, "Half-Elf": 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Seahill": {iPopulation: 1176, Human: 79, "Half-Elf": 9, Elf: 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Seahill Castle": {iPopulation: 360, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Sea Rune": {iPopulation: 540, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Seasteadholm": {iPopulation: 584, Elf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Seastrand": {iPopulation: 1648, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Serpeant Little": {iPopulation: 544, "Half-Elf": 37, Human: 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shavenoar": {iPopulation: 560, Human: 79, Elf: 9, "Half-Elf": 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shewolf": {iPopulation: 652, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shipshore Harbor": {iPopulation: 359, Human: 37, Gnome: 20, Halfling: 18, Elf: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shrine of Medr": {iPopulation: 60, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Shrine of the Spider and Forge": {iPopulation: 240, Dwarf: 37, Human: 20, Halfling: 18, Elf: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Shrine of the Tree": {iPopulation: 240, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Silent Winds Conclave": {iPopulation: 120, Human: 37, Dwarf: 20, Halfling: 18, Elf: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Skaney": {iPopulation: 1136, Gnoll: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Smite": {iPopulation: 1240, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Smitten": {iPopulation: 1840, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Southguard Castle": {iPopulation: 520, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Southguard Tower": {iPopulation: 480, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Southwatch Castle": {iPopulation: 360, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Springle": {iPopulation: 1464, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sticklestead": {iPopulation: 10160, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sunfells": {iPopulation: 1640, Elf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sunlitten": {iPopulation: 1800, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sven's Freehold": {iPopulation: 440, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Swain's Cairn": {iPopulation: 624, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Syfwitch Hold": {iPopulation: 600, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tain": {iPopulation: 1616, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Talgard Clanhold": {iPopulation: 120, Human: 79, "Half-Orc": 9, Orc: 5, Goblin: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tegel": {iPopulation: 920, Human: 79, Elf: 9, "Half-Elf": 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Temple of the Azure Sky": {iPopulation: 80, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Temple of the Deep": {iPopulation: 480, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Temple of the Golden Axe": {iPopulation: 600, Dwarf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Temple of the Spider Goddess": {iPopulation: 160, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Temple of the Storm Father": {iPopulation: 280, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Thorsvirke": {iPopulation: 263, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Thunderhold": {iPopulation: 8000, Human: 37, Dwarf: 20, Halfling: 18, Elf: 10, Gnome: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tirantal Keep": {iPopulation: 240, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of Anselor": {iPopulation: 120, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of Keystone's Shadow": {iPopulation: 160, Human: 37, Elf: 20, "Half-Elf": 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of Sirron's Vale": {iPopulation: 80, Human: 37, "Half-Elf": 20, Elf: 18, Halfling: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Trollkeep": {iPopulation: 240, Dwarf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Trollslore": {iPopulation: 776, Goblin: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Troth": {iPopulation: 708, Human: 69, Dwarf: 19, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Twinhorn Gate": {iPopulation: 40, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Varin's Firth": {iPopulation: 1760, Human: 79, "Half-Elf": 9, Elf: 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Warwik": {iPopulation: 37600, Human: 79, Dwarf: 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Weirding Coven": {iPopulation: 160, Human: 79, Goblin: 9, "Half-Orc": 5, Orc: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wenlock": {iPopulation: 880, Goblin: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Westgate Castle": {iPopulation: 200, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wildwood": {iPopulation: 616, Halfling: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Woe": {iPopulation: 1080, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wolfstone": {iPopulation: 1600, Human: 79, "Half-Orc": 9, Halfling: 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wormingford": {iPopulation: 688, Human: 79, "Half-Orc": 9, Orc: 5, Goblin: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Zarthstone": {iPopulation: 1664, Human: 79, Elf: 9, "Half-Elf": 5, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "aDesertLands": ["Abdu-Kab", "Ajjbawn", "Alas", "Arramas", "Athelsward", "Bassam", "Befalls", "Belitsward", "Blackmarsh", "Bloref's Turret", 
        "Burjani", "Castle Arras", "Castle Gernwill", "Castle Rymafore", "Castle Vardane", "Citadel Fortitude", 
        "Citadel of Riotous Contemplation", "Citadel of the Scraping Wind", "Citadel of the Sullen Stone", "Cragthrob", "Dagonsharp", 
        "Davinotern", "Dier", "Dimark", "Doughty", "Drywatch", "Dyta", "Ell Bastis", "Far Cragthrob Tower", "Farmingcastle", "Ferech Idu", 
        "Fongridge", "Frasket", "Gadorsalt", "Gadorsalt Stronghold", "Goll", "Green Tower", "Grindwell", "Headland Castle", "Holdsforth Spire", 
        "Hothme", "Ihnnyas", "Jarab", "Kamerja", "Kod'l", "Kumari Tower", "Larif", "Lasthill", "Laudehesh", "Laudenesh", "Lonespire", 
        "Lonetower", "Mateh", "Melasures", "Monastery of the Hot Wind", "Moon Tower", "Moramines", "Mountainshadow Tower", "Nari Naglab", 
        "Narrowridge", "Nashurpals", "Nightsward", "Nydad", "Olgerd", "Ordurt", "Parapet Scarpe", "Phialfen Tower", "Questravale", "Rest Tower", 
        "Rowan", "Rymafore", "Shealoh", "Shiktat", "Silmet", "Smoulder Hill", "Snarl", "Stonewright", "Surhsa Galesh", "Talltower", "Taz'm", 
        "Tower Alas", "Tower of Abdu-Kab", "Tower of the Nexus", "Treewatch Tower", "Tumbledown Tower", "Unneffer", "Valleyguard Tower", 
        "Valley Villa", "Vardane", "Varnage", "Wortess", "Wortess Lightcastle", "Zakuta"],
    "Desert Lands": {iPopulation: 56876, Human: 46, Elf: 13, Dwarf: 9, Halfling: 9, Orc: 6, Gnome: 5, Goblin: 4, "Half-Elf": 3, Gnoll: 2, "Half-Orc": 2, other: 1, sType: "region"},
    "Abdu-Kab": {iPopulation: 1572, Human: 69, Dwarf: 18, Gnome: 11, Halfling: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ajjbawn": {iPopulation: 772, Orc: 59, Human: 30, "Half-Orc": 4, Goblin: 3, Gnoll: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Alas": {iPopulation: 500, Human: 69, "Half-Elf": 18, Halfling: 10, "Half-Orc": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Arramas": {iPopulation: 1088, Human: 64, Elf: 20, "Half-Elf": 10, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Athelsward": {iPopulation: 1120, Human: 89, Dwarf: 5, Gnome: 3, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bassam": {iPopulation: 964, Gnome: 59, Human: 25, Halfling: 10, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Befalls": {iPopulation: 664, Human: 69, Halfling: 20, Gnome: 8, "Half-Elf": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Belitsward": {iPopulation: 1120, Human: 59, Elf: 30, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blackmarsh": {iPopulation: 1372, Human: 79, Elf: 15, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bloref's Turret": {iPopulation: 140, Human: 89, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Burjani": {iPopulation: 504, Human: 59, Orc: 20, "Half-Orc": 10, Gnome: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle Arras": {iPopulation: 560, Human: 69, Elf: 18, Halfling: 10, "Half-Orc": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Gernwill": {iPopulation: 660, Human: 95, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Rymafore": {iPopulation: 660, Human: 74, Orc: 20, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Vardane": {iPopulation: 600, Human: 64, Elf: 15, Halfling: 15, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel Fortitude": {iPopulation: 100, Human: 89, Elf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Riotous Contemplation": {iPopulation: 100, Human: 64, Elf: 25, "Half-Elf": 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of the Scraping Wind": {iPopulation: 100, Orc: 89, "Half-Orc": 7, Goblin: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of the Sullen Stone": {iPopulation: 220, Human: 89, "Half-Orc": 6, Orc: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Cragthrob": {iPopulation: 1136, Halfling: 69, Gnome: 20, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dagonsharp": {iPopulation: 860, Goblin: 64, Gnoll: 30, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Davinotern": {iPopulation: 984, Human: 64, Dwarf: 30, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dier": {iPopulation: 1168, Human: 80, Elf: 12, "Half-Elf": 5, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dimark": {iPopulation: 1072, Human: 69, Dwarf: 25, Gnome: 3, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Doughty": {iPopulation: 400, Halfling: 69, Elf: 20, Gnome: 4, Dwarf: 3, Human: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Drywatch": {iPopulation: 100, Orc: 89, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dyta": {iPopulation: 420, Elf: 69, "Half-Elf": 20, Halfling: 8, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ell Bastis": {iPopulation: 612, Orc: 49, Human: 20, Gnoll: 20, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Far Cragthrob Tower": {iPopulation: 240, Troll: 49, Human: 20, Orc: 20, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Farmingcastle": {iPopulation: 600, Human: 39, Dwarf: 25, Elf: 20, Gnome: 5, Halfling: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Ferech Idu": {iPopulation: 1000, Human: 30, Dwarf: 30, Elf: 19, Gnome: 15, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fongridge": {iPopulation: 940, Human: 54, Dwarf: 35, Gnome: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Frasket": {iPopulation: 468, Orc: 59, Human: 20, "Half-Orc": 10, Gnoll: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gadorsalt": {iPopulation: 1092, Human: 64, "Half-Elf": 15, Elf: 12, Halfling: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gadorsalt Stronghold": {iPopulation: 180, Human: 64, "Half-Elf": 15, Elf: 12, Halfling: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Goll": {iPopulation: 704, Elf: 79, "Half-Elf": 10, Gnome: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Green Tower": {iPopulation: 120, Elf: 89, "Half-Elf": 8, Human: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Grindwell": {iPopulation: 532, Dwarf: 59, Elf: 30, Human: 5, Halfling: 3, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Headland Castle": {iPopulation: 480, Human: 49, Elf: 20, Dwarf: 20, Gnome: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Holdsforth Spire": {iPopulation: 80, Elf: 89, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hothme": {iPopulation: 380, Human: 69, Dwarf: 10, Elf: 10, "Stone Giant": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ihnnyas": {iPopulation: 592, Halfling: 64, Gnome: 24, Human: 10, Elf: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Jarab": {iPopulation: 720, Elf: 66, Halfling: 23, Gnome: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kamerja": {iPopulation: 80, Human: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Kod'l": {iPopulation: 592, Human: 64, Dwarf: 15, Gnome: 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kumari Tower": {iPopulation: 140, "Half-Elf": 59, Human: 30, Elf: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Larif": {iPopulation: 584, Halfling: 49, Elf: 30, Human: 10, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lasthill": {iPopulation: 1536, Elf: 79, Halfling: 15, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Laudehesh": {iPopulation: 704, Human: 59, "Half-Orc": 20, Orc: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Laudenesh": {iPopulation: 672, Dwarf: 69, Gnome: 10, Human: 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lonespire": {iPopulation: 240, Human: 89, Dwarf: 7, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lonetower": {iPopulation: 120, Human: 89, Elf: 7, "Half-Elf": 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Mateh": {iPopulation: 1316, Human: 59, Elf: 20, "Half-Elf": 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Melasures": {iPopulation: 480, Elf: 69, "Half-Elf": 15, Gnome: 10, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Monastery of the Hot Wind": {iPopulation: 120, Human: 89, Elf: 5, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Moon Tower": {iPopulation: 420, Human: 59, "Half-Elf": 20, Elf: 10, Gnome: 6, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Moramines": {iPopulation: 852, Dwarf: 59, Human: 30, Elf: 7, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mountainshadow Tower": {iPopulation: 40, Human: 89, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Nari Naglab": {iPopulation: 384, Human: 59, Orc: 29, "Half-Orc": 11, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Narrowridge": {iPopulation: 1224, Orc: 49, Human: 30, "Half-Orc": 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nashurpals": {iPopulation: 1360, Human: 69, Dwarf: 20, Gnome: 6, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nightsward": {iPopulation: 920, Human: 69, Elf: 20, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nydad": {iPopulation: 856, Human: 69, Gnome: 20, Dwarf: 7, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Olgerd": {iPopulation: 968, Human: 59, Elf: 30, "Half-Elf": 8, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ordurt": {iPopulation: 600, Elf: 68, "Half-Elf": 21, "Stone Giant": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Parapet Scarpe": {iPopulation: 308, Gnoll: 56, Orc: 23, Human: 10, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Phialfen Tower": {iPopulation: 220, Human: 45, Orc: 45, "Half-Orc": 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Questravale": {iPopulation: 1548, Goblin: 59, Human: 20, Orc: 10, Gnoll: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rest Tower": {iPopulation: 280, Halfling: 59, Human: 25, Gnome: 10, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Rowan": {iPopulation: 268, Human: 69, Halfling: 20, "Half-Elf": 5, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rymafore": {iPopulation: 428, Human: 49, Dwarf: 40, Gnome: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shealoh": {iPopulation: 340, Dwarf: 69, Human: 20, Gnome: 7, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shiktat": {iPopulation: 544, Halfling: 69, Gnome: 20, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Silmet": {iPopulation: 476, Human: 59, Elf: 30, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Smoulder Hill": {iPopulation: 632, Dwarf: 59, Human: 20, Gnome: 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Snarl": {iPopulation: 644, Human: 59, Dwarf: 15, Elf: 15, Gnome: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Stonewright": {iPopulation: 804, Human: 65, Halfling: 15, Gnome: 10, Elf: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Surhsa Galesh": {iPopulation: 1000, Halfling: 49, Human: 25, Elf: 10, "Half-Elf": 10, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Talltower": {iPopulation: 60, Orc: 89, Goblin: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Taz'm": {iPopulation: 312, Human: 49, Elf: 30, "Half-Elf": 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tower Alas": {iPopulation: 140, Human: 77, Elf: 10, Halfling: 10, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of Abdu-Kab": {iPopulation: 180, Human: 89, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of the Nexus": {iPopulation: 460, Human: 49, Dwarf: 30, Gnome: 10, Halfling: 5, "Half-Elf": 3, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Treewatch Tower": {iPopulation: 220, Human: 59, "Half-Orc": 20, Orc: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tumbledown Tower": {iPopulation: 240, Human: 49, Orc: 25, "Half-Orc": 10, Goblin: 10, Troll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Unneffer": {iPopulation: 280, Halfling: 69, Human: 20, Gnome: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Valleyguard Tower": {iPopulation: 220, Dwarf: 89, Human: 5, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Valley Villa": {iPopulation: 496, Human: 59, Elf: 30, "Half-Elf": 8, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Vardane": {iPopulation: 1056, Human: 59, Elf: 15, Halfling: 15, "Half-Elf": 8, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Varnage": {iPopulation: 628, Goblin: 79, Human: 10, Gnoll: 5, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wortess": {iPopulation: 1428, Human: 64, "Half-Orc": 15, Orc: 15, Gnoll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wortess Lightcastle": {iPopulation: 540, Human: 59, Elf: 10, Orc: 10, "Half-Orc": 10, Gnoll: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Zakuta": {iPopulation: 632, Human: 69, Dwarf: 15, Halfling: 10, Gnome: 3, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "aEbonyCoast": ["Arroworth", "Arunalisia", "Bearfoot Castle", "Billingdoor", "Blackfriars", "Blackwell Keep", "Blood Castle", "Bubbagar", 
        "Castle Jewelsace", "Citadel", "Citadel of High-East Sound", "Citadel of Xez", "Clomgar Castle", "Coatedale Keep", "Coatsong Castle", 
        "Dragonwhite Castle", "Eastview Citadel", "Edominar", "Endgame Castle", "Equestrian Castle", "Finsbury Fields", "Fort Meanknot", 
        "Governor's Mansion", "Greywraith", "Gyleswood", "Henslowe", "Highlandar", "Kale Kala Temple", "Landhaven", "Larkshire", "Livanonia", 
        "Lost Citadel", "Matansar", "Onestone", "Petrashelt", "Pine Inn", "Popinjay", "Questing Pass", "Revelshire", "Spellbash Citadel", 
        "Stonce Castle", "Stonepeak", "Strongblade Citadel", "Sulet Hold", "Twinriver Castle", "Wayfair", "Wesbirth Castle", "Yoikshire", 
        "Zev's Retreat"],
    "Ebony Coast": {iPopulation: 33716, Human: 53, "Half-Elf": 16, Halfling: 9, Elf: 8, Orc: 6, Dwarf: 5, "Half-Orc": 1, Ogre: 1, other: 1, sType: "region"},
    "Arroworth": {iPopulation: 1452, Human: 81, "Half-Elf": 14, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Arunalisia": {iPopulation: 468, Orc: 81, "Half-Orc": 10, Ogre: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bearfoot Castle": {iPopulation: 144, Human: 55, Elf: 34, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Billingdoor": {iPopulation: 1492, Halfling: 79, "Half-Elf": 13, Human: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blackfriars": {iPopulation: 1172, Human: 74, "Half-Elf": 23, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blackwell Keep": {iPopulation: 244, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Blood Castle": {iPopulation: 180, Orc: 86, "Half-Orc": 12, Human: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Bubbagar": {iPopulation: 980, "Half-Elf": 68, Human: 31, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle Jewelsace": {iPopulation: 204, Human: 94, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel": {iPopulation: 152, Elf: 82, "Half-Elf": 12, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of High-East Sound": {iPopulation: 388, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Xez": {iPopulation: 84, Human: 88, Elf: 10, "Half-Elf": 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Clomgar Castle": {iPopulation: 172, Human: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Coatedale Keep": {iPopulation: 344, Human: 89, Troll: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Coatsong Castle": {iPopulation: 424, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dragonwhite Castle": {iPopulation: 316, Human: 85, Halfling: 14, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Eastview Citadel": {iPopulation: 260, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Edominar": {iPopulation: 1120, Human: 84, "Half-Elf": 12, Elf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Endgame Castle": {iPopulation: 264, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Equestrian Castle": {iPopulation: 264, Elf: 80, Human: 18, other: 2, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Finsbury Fields": {iPopulation: 1660, Elf: 74, "Half-Elf": 15, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fort Meanknot": {iPopulation: 228, Human: 89, "Half-Orc": 5, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Governor's Mansion": {iPopulation: 164, Human: 80, "Half-Elf": 14, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Greywraith": {iPopulation: 640, Human: 73, "Half-Elf": 23, Elf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gyleswood": {iPopulation: 584, Halfling: 79, Human: 17, Elf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Henslowe": {iPopulation: 412, Human: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Highlandar": {iPopulation: 1936, Human: 71, Halfling: 22, "Half-Orc": 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kale Kala Temple": {iPopulation: 304, Halfling: 69, Human: 26, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Landhaven": {iPopulation: 564, Human: 63, "Half-Elf": 16, Halfling: 14, Elf: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Larkshire": {iPopulation: 1976, Human: 72, "Half-Elf": 21, Halfling: 4, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Livanonia": {iPopulation: 468, Elf: 83, "Half-Elf": 10, Human: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lost Citadel": {iPopulation: 76, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Matansar": {iPopulation: 1092, Human: 78, "Half-Elf": 19, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Onestone": {iPopulation: 832, "Half-Elf": 81, Human: 15, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Petrashelt": {iPopulation: 1900, Dwarf: 80, Halfling: 15, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Pine Inn": {iPopulation: 368, Human: 89, Elf: 5, Halfling: 3, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Popinjay": {iPopulation: 648, Orc: 64, "Half-Orc": 20, Ogre: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Questing Pass": {iPopulation: 1516, "Half-Elf": 56, Human: 38, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Revelshire": {iPopulation: 1096, "Half-Elf": 70, Human: 20, Elf: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Spellbash Citadel": {iPopulation: 180, Human: 90, "Half-Orc": 3, Orc: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Stonce Castle": {iPopulation: 40, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Stonepeak": {iPopulation: 888, Orc: 93, "Half-Orc": 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Strongblade Citadel": {iPopulation: 376, Orc: 55, Human: 19, "Half-Orc": 14, Ogre: 11, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Sulet Hold": {iPopulation: 1372, Human: 83, "Half-Elf": 14, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Twinriver Castle": {iPopulation: 156, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wayfair": {iPopulation: 1996, Human: 80, Elf: 16, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wesbirth Castle": {iPopulation: 128, Human: 86, "Half-Elf": 11, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Yoikshire": {iPopulation: 1916, Human: 77, "Half-Elf": 16, Halfling: 4, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Zev's Retreat": {iPopulation: 76, Human: 89, Elf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "aElphandLands": ["Adar", "Adsulata Citadel", "Aelfheim", "Ailill", "Aratar", "Archfield", "Aztlan", "Bawar", "Belial", "Bighsdale", 
        "Blackpit", "Blacksheep", "Blackspell", "Bress", "Castamaron Castle", "Castell", "Castle Alduscon", "Castle Bronius", "Castle Bluedrake",
        "Castle of Eagles", "Castle Oldenhain", "Castle Slayer", "Church of Damaka", "Cinnabar Citadel", "Citadel of the Purple Crescent", 
        "Damkina", "Duat", "Eggrot Tower", "Elfwine", "Fairfields", "Falias", "Firbolg", "Fortress Masparak", "Fortress Orcswert", "Frikka", 
        "Greatstone", "Greencastle", "Gwaelod", "Havamal", "Hetep", "Hillcrest", "Holle Citadel", "Honeywax", "Huthelos Citadel", "Icewell Keep",
        "Kahil", "Kailasa", "Kalastar", "Keep of the Undlerlands", "Khaled", "Kolpia", "Kvarnslay Citadel", "Lakeland", "Leechfields", "Maonis", 
        "Mechiev", "Murias", "Murkwall Castle", "Narvonshire", "Norgood", "Oxhorn", "Palace of Bells and Stairs", "Palace of the Oldstone", 
        "Pyramid of Buskemes", "Quickstep", "Quinden", "Ridgewell", "Robdel Castle", "Roost of the Windborne", "Sekhet", "Shopshire", 
        "Shrine of Aphrodite", "Siazee", "Sipar", "Sirat", "Smolos Keep", "Stonewater", "Stourhead", "Stronghold of Beckain", 
        "Stronghold of the Scimitar Brotherhood", "Swarga", "Tanglebush Keep", "Tarsa", "Taunting", "Tehant", "Temple of Brigit", 
        "Temple of Mannar Worle", "Titanshold", "Tower of the Inky Banner", "Tower of Mauve Spires", "Tower of the Tests", "Treebattle", 
        "Turnkeep Castle", "Turnkeep Village", "Vascava", "Vennvale", "Watchtower", "Wenglor", "Westrim", "Whiterock Citadel", "Wildflower", 
        "Winewell Conclave", "Windguard", "Woodmirth Keep"], 
    "Elphand Lands": {iPopulation: 56356, Human: 49, Elf: 14, Halfling: 9, Orc: 9, Dwarf: 8, Goblin: 3, Gnome: 2, "Half-Elf": 2, "Half-Orc": 1, Ogre: 1, other: 2, sType: "region"},
    "Adar": {iPopulation: 260, Human: 62, Elf: 15, Dwarf: 12, Halfling: 8, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Adsulata Citadel": {iPopulation: 440, Human: 32, "Half-Orc": 31, Goblin: 28, Ogre: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Aelfheim": {iPopulation: 416, Human: 72, "Half-Elf": 14, Halfling: 8, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ailill": {iPopulation: 1260, Elf: 66, "Half-Elf": 18, Human: 12, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Aratar": {iPopulation: 840, Human: 70, Elf: 14, Halfling: 12, Goblin: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Archfield": {iPopulation: 612, Halfling: 60, Human: 18, Elf: 14, Gnome: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Aztlan": {iPopulation: 628, Orc: 60, Human: 17, Ogre: 14, other: 9, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bawar": {iPopulation: 520, Halfling: 68, Human: 14, Elf: 12, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Belial": {iPopulation: 612, Human: 74, Dwarf: 12, Gnome: 6, Elf: 4, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bighsdale": {iPopulation: 652, Dwarf: 90, Gnome: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blackpit": {iPopulation: 248, Human: 83, Troglodyte: 16, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blacksheep": {iPopulation: 592, Human: 77, Elf: 22, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blackspell": {iPopulation: 860, Halfling: 65, Human: 20, Elf: 12, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bress": {iPopulation: 828, Dwarf: 71, Elf: 15, Human: 13, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castamaron Castle": {iPopulation: 680, Human: 56, Halfling: 19, Elf: 12, "Half-Elf": 12, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castell": {iPopulation: 1080, Human: 64, Elf: 14, Dwarf: 13, Halfling: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle Alduscon": {iPopulation: 300, Human: 43, Goblin: 40, Orc: 16, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Bronius": {iPopulation: 360, Human: 91, "Half-Elf": 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Bluedrake": {iPopulation: 60, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle of Eagles": {iPopulation: 580, Human: 57, Elf: 34, Halfling: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Oldenhain": {iPopulation: 300, Human: 59, Elf: 24, "Half-Elf": 16, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Slayer": {iPopulation: 460, Human: 70, Orc: 26, Dwarf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Church of Damaka": {iPopulation: 100, Human: 68, Orc: 31, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Cinnabar Citadel": {iPopulation: 200, Human: 87, Orc: 12, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Citadel of the Purple Crescent": {iPopulation: 260, Human: 95, "Half-Elf": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Damkina": {iPopulation: 604, Human: 60, Elf: 10, Dwarf: 10, "Half-Elf": 5, Halfling: 5, Orc: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Duat": {iPopulation: 356, Human: 73, Halfling: 15, Gnome: 9, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Eggrot Tower": {iPopulation: 140, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Elfwine": {iPopulation: 420, Human: 70, Elf: 13, Dwarf: 6, Orc: 6, Ogre: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fairfields": {iPopulation: 272, Human: 69, "Half-Elf": 15, Elf: 8, Dwarf: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Falias": {iPopulation: 1536, Elf: 79, Human: 15, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Firbolg": {iPopulation: 1224, Orc: 73, "Half-Orc": 15, Ogre: 6, other: 6, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fortress Masparak": {iPopulation: 260, Human: 40, Goblin: 31, Orc: 28, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Fortress Orcswert": {iPopulation: 160, Orc: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Frikka": {iPopulation: 868, Dwarf: 94, other: 6, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Greatstone": {iPopulation: 808, Human: 88, Gnome: 11, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Greencastle": {iPopulation: 588, Orc: 60, Goblin: 23, Ogre: 14, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gwaelod": {iPopulation: 856, Elf: 82, Human: 9, "Half-Elf": 4, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Havamal": {iPopulation: 832, Human: 92, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hetep": {iPopulation: 492, Goblin: 61, Orc: 13, "Half-Orc": 9, Hobgoblin: 8, Human: 7, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hillcrest": {iPopulation: 440, Human: 61, Gnome: 19, Halfling: 13, Elf: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Holle Citadel": {iPopulation: 100, Human: 79, Elf: 12, Halfling: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Honeywax": {iPopulation: 684, Human: 62, Elf: 24, Halfling: 11, "Half-Elf": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Huthelos Citadel": {iPopulation: 140, Human: 96, Elf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Icewell Keep": {iPopulation: 140, Human: 70, Elf: 24, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Kahil": {iPopulation: 860, Halfling: 72, Gnome: 14, Dwarf: 10, Human: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kailasa": {iPopulation: 392, Human: 61, "Half-Elf": 21, Halfling: 14, Elf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kalastar": {iPopulation: 1008, Human: 70, Halfling: 19, Dwarf: 8, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Keep of the Undlerlands": {iPopulation: 120, Human: 74, Elf: 20, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Khaled": {iPopulation: 656, Human: 57, Halfling: 23, "Half-Elf": 8, Dwarf: 8, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kolpia": {iPopulation: 792, Human: 77, Dwarf: 15, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kvarnslay Citadel": {iPopulation: 180, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lakeland": {iPopulation: 804, Human: 90, "Half-Elf": 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Leechfields": {iPopulation: 652, Human: 60, Elf: 23, Halfling: 12, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Maonis": {iPopulation: 128, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mechiev": {iPopulation: 400, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Murias": {iPopulation: 720, Elf: 79, Human: 12, Halfling: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Murkwall Castle": {iPopulation: 280, Human: 85, "Half-Elf": 8, Halfling: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Narvonshire": {iPopulation: 1184, Human: 98, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Norgood": {iPopulation: 972, Human: 79, Halfling: 13, Dwarf: 5, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Oxhorn": {iPopulation: 1008, Human: 69, Halfling: 11, Dwarf: 9, Gnome: 7, Elf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Palace of Bells and Stairs": {iPopulation: 400, Human: 89, Elf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Palace of the Oldstone": {iPopulation: 140, Elf: 56, Human: 30, "Half-Elf": 10, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Pyramid of Buskemes": {iPopulation: 60, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Quickstep": {iPopulation: 592, Orc: 75, Human: 9, Hobgoblin: 8, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Quinden": {iPopulation: 512, Halfling: 64, Human: 18, Elf: 15, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ridgewell": {iPopulation: 1296, Human: 70, Elf: 13, Halfling: 11, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Robdel Castle": {iPopulation: 500, Human: 58, Elf: 34, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Roost of the Windborne": {iPopulation: 140, Human: 60, Elf: 28, "Half-Elf": 11, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Sekhet": {iPopulation: 664, Human: 72, Elf: 14, Dwarf: 9, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shopshire": {iPopulation: 360, Human: 91, Orc: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shrine of Aphrodite": {iPopulation: 120, Human: 82, "Half-Orc": 17, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Siazee": {iPopulation: 364, Human: 95, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sipar": {iPopulation: 780, Goblin: 70, Orc: 17, "Half-Orc": 9, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sirat": {iPopulation: 616, Halfling: 72, Human: 13, Elf: 7, Gnome: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Smolos Keep": {iPopulation: 160, Human: 87, Halfling: 6, Elf: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Stonewater": {iPopulation: 884, Human: 88, other: 12, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Stourhead": {iPopulation: 904, Orc: 68, Goblin: 19, Human: 9, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Stronghold of Beckain": {iPopulation: 200, Halfling: 39, Human: 33, "Half-Elf": 23, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Stronghold of the Scimitar Brotherhood": {iPopulation: 80, Human: 40, Orc: 39, "Half-Orc": 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Swarga": {iPopulation: 468, Human: 73, Elf: 12, Halfling: 11, Dwarf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tanglebush Keep": {iPopulation: 160, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tarsa": {iPopulation: 1448, Elf: 79, Human: 17, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Taunting": {iPopulation: 472, Human: 61, Elf: 14, Dwarf: 12, Halfling: 8, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tehant": {iPopulation: 808, Human: 74, Elf: 17, Halfling: 4, Goblin: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Temple of Brigit": {iPopulation: 320, Human: 57, Dwarf: 36, "Half-Elf": 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Temple of Mannar Worle": {iPopulation: 580, Human: 95, Dwarf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Titanshold": {iPopulation: 520, Human: 65, Goblin: 18, Orc: 12, "Half-Orc": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of the Inky Banner": {iPopulation: 80, Human: 79, "Half-Orc": 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of Mauve Spires": {iPopulation: 80, Human: 79, Orc: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of the Tests": {iPopulation: 160, Human: 93, Orc: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Treebattle": {iPopulation: 704, Human: 94, other: 6, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Turnkeep Castle": {iPopulation: 440, Human: 73, Elf: 18, "Half-Orc": 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Turnkeep Village": {iPopulation: 712, Human: 61, Halfling: 21, Goblin: 17, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Vascava": {iPopulation: 372, Human: 94, other: 6, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Vennvale": {iPopulation: 120, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Watchtower": {iPopulation: 160, Human: 69, "Half-Orc": 26, Orc: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wenglor": {iPopulation: 1604, Dwarf: 71, Elf: 12, Human: 8, Halfling: 4, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Westrim": {iPopulation: 920, Orc: 73, "Half-Orc": 13, Human: 13, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Whiterock Citadel": {iPopulation: 160, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wildflower": {iPopulation: 448, Human: 51, Elf: 26, Halfling: 14, Dwarf: 6, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Winewell Conclave": {iPopulation: 180, Human: 87, Halfling: 8, "Half-Elf": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Windguard": {iPopulation: 1104, Human: 80, Gnome: 8, other: 12, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Woodmirth Keep": {iPopulation: 320, Human: 78, "Half-Elf": 12, Elf: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"},
    "aGhinor": ["Blackheart Keep", "Castle Brass", "Chim", "Citadel of Storms", "Citadel of Palms", "Citadel of Waves", "Citadel of Tomes", 
        "Dantell", "Fane of Empyreal Conflagration", "Lofton", "Pantan Citadel", "Serpent's Fortress", "Sunev", "Talon Castle", "Yolin"],
    "Ghinor": {iPopulation: 10428, Human: 50, "Half-Elf": 22, Dwarf: 9, Elf: 6, Orc: 4, Amazon: 3, Halfling: 3, Goblin: 1, "Half-Orc": 1, other: 1, sType: "region"},
    "Blackheart Keep": {iPopulation: 436, Orc: 67, Goblin: 14, Human: 13, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Brass": {iPopulation: 348, Human: 78, Orc: 18, Goblin: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Chim": {iPopulation: 1328, Dwarf: 62, Human: 22, Halfling: 8, "Half-Elf": 4, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Citadel of Storms": {iPopulation: 120, Human: 67, Orc: 22, Goblin: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Palms": {iPopulation: 156, Human: 76, Elf: 12, Halfling: 11, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Waves": {iPopulation: 184, Human: 90, Lizardfolk: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Tomes": {iPopulation: 316, Human: 67, Elf: 16, "Half-Elf": 9, Gnome: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dantell": {iPopulation: 1184, Human: 53, Halfling: 14, "Half-Elf": 12, "Half-Orc": 10, Elf: 5, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fane of Empyreal Conflagration": {iPopulation: 356, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lofton": {iPopulation: 848, "Half-Elf": 52, Human: 36, Elf: 11, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Pantan Citadel": {iPopulation: 280, Human: 85, "Half-Elf": 14, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Serpent's Fortress": {iPopulation: 476, Human: 93, "Half-Elf": 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Sunev": {iPopulation: 2072, "Half-Elf": 68, Human: 21, Elf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Talon Castle": {iPopulation: 364, Amazon: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Yolin": {iPopulation: 1960, Human: 81, "Half-Elf": 9, Elf: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    "aGhinorHighlands": ["Agrim", "Arstonally", "Bloodseep", "Bluefalls Citadel", "Bramly", "Briarsbush", "Castle Amaranth", "Castle Dristhane", 
        "Deerplace", "Delshome", "Doom's End Citadel", "Dristhane", "Eldiston", "Elmwood", "Fall City", "Faneton", "Fathine", 
        "Glade of Adalante", "Halingsbrane", "Hall of the Bard-Lord", "Illwind Citadel", "Jaliquenta", "Kef Nal", "Lak", "Loktole", "Mist", 
        "Murrsburg", "Nestaril", "Nurenthane", "Olgenstone", "Palace of Ut Prandur", "Ploontrep", "Pranstongue", "Prim", "Ramshadow Castle", 
        "Rastingdrung", "Saltorous", "Ten Elms", "Thrush", "Topaine", "Tower of the Prophets", "Treebreath", "Underleaf", "Vastoniat", 
        "Wandjoust Castle", "Wellring Castle", "Woidsag", "Zanda"], 
    "Ghinor Highlands": {iPopulation: 46710, Human: 43, Dwarf: 27, Elf: 12, Gnome: 5, Halfling: 4, Lizardfolk: 4, "Half-Elf": 2, Orc: 2, other: 1, sType: "region"},
    "Agrim": {iPopulation: 1084, Human: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Arstonally": {iPopulation: 588, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bloodseep": {iPopulation: 740, Human: 84, Dwarf: 8, Elf: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bluefalls Citadel": {iPopulation: 200, Human: 76, Halfling: 12, Elf: 11, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Bramly": {iPopulation: 528, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Briarsbush": {iPopulation: 1836, Human: 91, Elf: 5, Dwarf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle Amaranth": {iPopulation: 440, Human: 69, Halfling: 20, Dwarf: 5, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Dristhane": {iPopulation: 520, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Deerplace": {iPopulation: 1640, Dwarf: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Delshome": {iPopulation: 536, Human: 84, Elf: 10, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Doom's End Citadel": {iPopulation: 240, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dristhane": {iPopulation: 1004, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Eldiston": {iPopulation: 1672, Human: 75, Elf: 12, Dwarf: 6, Orc: 4, Mermen: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Elmwood": {iPopulation: 684, Halfling: 56, Human: 34, Elf: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fall City": {iPopulation: 1644, Gnome: 69, Human: 15, Dwarf: 10, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Faneton": {iPopulation: 1680, Elf: 56, Human: 34, Halfling: 6, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fathine": {iPopulation: 800, Human: 66, Halfling: 15, Orc: 12, Elf: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Glade of Adalante": {iPopulation: 120, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Halingsbrane": {iPopulation: 452, Orc: 84, Human: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hall of the Bard-Lord": {iPopulation: 90, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Illwind Citadel": {iPopulation: 240, Human: 69, Orc: 20, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Jaliquenta": {iPopulation: 1452, Human: 84, Elf: 8, "Half-Orc": 4, Orc: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kef Nal": {iPopulation: 1676, Dwarf: 94, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lak": {iPopulation: 1496, Human: 74, Dwarf: 10, Elf: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Loktole": {iPopulation: 600, Halfling: 76, Human: 16, Elf: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mist": {iPopulation: 1492, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Murrsburg": {iPopulation: 1212, Gnome: 74, Human: 14, Dwarf: 11, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nestaril": {iPopulation: 1264, Lizardfolk: 64, Human: 25, Gnome: 8, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nurenthane": {iPopulation: 1544, Human: 85, Dwarf: 12, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Olgenstone": {iPopulation: 932, Human: 83, Halfling: 11, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Palace of Ut Prandur": {iPopulation: 680, Human: 64, Elf: 20, Dwarf: 12, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Ploontrep": {iPopulation: 1112, Human: 79, Elf: 10, Dwarf: 8, Centaur: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Pranstongue": {iPopulation: 1588, Elf: 89, Human: 5, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Prim": {iPopulation: 936, Dwarf: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ramshadow Castle": {iPopulation: 400, Dwarf: 59, Human: 40, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Rastingdrung": {iPopulation: 1832, Human: 74, Halfling: 12, Dwarf: 8, Orc: 3, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Saltorous": {iPopulation: 1740, Dwarf: 95, Human: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ten Elms": {iPopulation: 912, Elf: 87, Human: 8, "Half-Elf": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Thrush": {iPopulation: 1592, Human: 72, Dwarf: 16, Halfling: 7, Orc: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Topaine": {iPopulation: 1392, "Half-Elf": 49, Human: 36, Elf: 9, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tower of the Prophets": {iPopulation: 240, Human: 79, Dwarf: 14, Gnome: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Treebreath": {iPopulation: 912, Lizardfolk: 94, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Underleaf": {iPopulation: 980, Dwarf: 93, Human: 3, Elf: 2, Gnome: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Vastoniat": {iPopulation: 1176, Dwarf: 89, Human: 5, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wandjoust Castle": {iPopulation: 320, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wellring Castle": {iPopulation: 480, Human: 95, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Woidsag": {iPopulation: 1380, Human: 73, Halfling: 16, Dwarf: 7, Orc: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Zanda": {iPopulation: 632, Elf: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "aIslesoftheBlest": ["Abject", "Aerie of the Stonemasters", "Ashwood", "Blackarrow", "Capricia", "Castle Lakewatch", "Cheapside", 
        "College of the Orchia", "Conclave of the Hidden Eye", "Coven of the King", "Covertling", "Diancecht", "Entenwold", "Fauxpass", 
        "Flaking", "Foundation", "Gormcairn", "Great Fish Shores", "Greenwax", "Grove of the Rising Sun", "Harpstring", "Heir Helm", 
        "Howling Winds", "Ironshod", "Kaemoore Keep", "Kentashor", "Klerkenwell", "Koradin", "Kveld's Holm", "Lanax", "Ludgates", "Maidstone", 
        "Mazargog Castle", "Merkab", "Order of Modron", "Praetor", "Red Bull", "Red Tiger Moot", "Ring-Tail", "Snake Hill", "Southpoint Watch", 
        "Southtower", "Staisiswells", "Temple of Thanatos", "Temple of the Uttermost Flame", "Tower of Khelagul", "West Point", "White Elf", "Xochete Tower"], 
    "Isles of the Blest": {iPopulation: 39059, Human: 36, Elf: 18, Dwarf: 12, Halfling: 9, Orc: 8, "Half-Elf": 7, Gnome: 3, "Half-Orc": 3, other: 4, sType: "region"}, 
    "Abject": {iPopulation: 1584, Human: 79, Halfling: 5, Elf: 3, Dwarf: 2, Gnome: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Aerie of the Stonemasters": {iPopulation: 364, Dwarf: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Ashwood": {iPopulation: 688, Human: 79, "Half-Elf": 9, "Half-Orc": 5, Elf: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blackarrow": {iPopulation: 1348, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Capricia": {iPopulation: 1952, Dwarf: 52, Human: 32, Elf: 12, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle Lakewatch": {iPopulation: 416, Human: 93, Elf: 3, Orc: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Cheapside": {iPopulation: 1184, "Half-Elf": 37, Human: 33, Elf: 25, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "College of the Orchia": {iPopulation: 376, Human: 37, Elf: 20, "Half-Elf": 18, Dwarf: 10, Halfling: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Conclave of the Hidden Eye": {iPopulation: 96, Human: 55, Gnome: 22, Elf: 12, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Coven of the King": {iPopulation: 188, Human: 35, Elf: 20, "Half-Orc": 18, Halfling: 10, Dwarf: 7, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Covertling": {iPopulation: 704, Human: 75, Dwarf: 10, Elf: 7, Halfling: 3, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Diancecht": {iPopulation: 588, "Half-Elf": 36, Elf: 21, Human: 18, Dwarf: 10, Halfling: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Entenwold": {iPopulation: 1220, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fauxpass": {iPopulation: 1436, "Half-Elf": 37, Human: 20, Elf: 18, Dwarf: 10, Halfling: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Flaking": {iPopulation: 1936, Human: 73, Elf: 15, Dwarf: 5, Halfling: 4, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Foundation": {iPopulation: 544, "Half-Elf": 93, Halfling: 1, Elf: 2, Gnome: 1, Human: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gormcairn": {iPopulation: 1600, Human: 98, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Great Fish Shores": {iPopulation: 610, Human: 94, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Greenwax": {iPopulation: 1380, Human: 83, "Half-Orc": 8, other: 9, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Grove of the Rising Sun": {iPopulation: 52, Elf: 85, "Half-Elf": 10, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Harpstring": {iPopulation: 420, Human: 85, "Half-Orc": 10, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Heir Helm": {iPopulation: 1280, Orc: 75, "Half-Orc": 15, Human: 6, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Howling Winds": {iPopulation: 1260, Elf: 90, Human: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ironshod": {iPopulation: 1068, "Half-Elf": 48, Human: 20, Elf: 15, Halfling: 10, other: 7, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kaemoore Keep": {iPopulation: 292, Human: 89, "Half-Orc": 6, Orc: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Kentashor": {iPopulation: 1396, Orc: 74, "Half-Orc": 16, Human: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Klerkenwell": {iPopulation: 496, Dwarf: 85, "Half-Elf": 6, Elf: 4, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Koradin": {iPopulation: 612, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kveld's Holm": {iPopulation: 384, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lanax": {iPopulation: 600, Human: 89, Halfling: 3, Elf: 1, Dwarf: 1, Gnome: 2, "Half-Elf": 2, "Half-Orc": 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ludgates": {iPopulation: 1440, Elf: 76, "Half-Elf": 10, Human: 5, other: 9, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Maidstone": {iPopulation: 1880, Halfling: 68, Dwarf: 19, Elf: 5, Human: 3, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mazargog Castle": {iPopulation: 328, Dwarf: 79, other: 21, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Merkab": {iPopulation: 464, Human: 88, Halfling: 2, Elf: 2, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Order of Modron": {iPopulation: 176, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Praetor": {iPopulation: 796, Elf: 94, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Red Bull": {iPopulation: 984, Orc: 75, "Half-Orc": 20, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Red Tiger Moot": {iPopulation: 176, Human: 86, Elf: 10, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Ring-Tail": {iPopulation: 700, Gnome: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Snake Hill": {iPopulation: 1272, Dwarf: 86, Halfling: 12, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Southpoint Watch": {iPopulation: 212, Dwarf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Southtower": {iPopulation: 340, Halfling: 78, "Half-Orc": 10, Orc: 7, Human: 3, other: 2, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Staisiswells": {iPopulation: 1120, Orc: 37, "Half-Orc": 20, Human: 18, Elf: 10, Dwarf: 7, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Temple of Thanatos": {iPopulation: 244, Human: 97, "Half-Orc": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Temple of the Uttermost Flame": {iPopulation: 376, Human: 78, "Half-Elf": 8, Elf: 5, Dwarf: 3, other: 6, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of Khelagul": {iPopulation: 232, Dwarf: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "West Point": {iPopulation: 304, Human: 55, "Half-Orc": 20, "Half-Elf": 14, Dwarf: 5, other: 6, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "White Elf": {iPopulation: 729, Elf: 85, "Half-Elf": 5, "Sea Elf": 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Xochete Tower": {iPopulation: 420, Halfling: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "aIslesoftheDawn": ["Birchall", "Bondpart", "Dourden", "Dragonscar", "Karden", "Karroch's Keep", "K'Dala", "Krag", "Nitefire Keep", 
        "Odin's Fist", "Sunray Citadel"], 
    "Isles of the Dawn": {iPopulation: 5736, Human: 59, Dwarf: 14, "Half-Elf": 11, Halfling: 8, Orc: 4, Elf: 2, "Half-Orc": 1, other: 1, sType: "region"}, 
    "Birchall": {iPopulation: 680, "Half-Elf": 84, Elf: 10, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bondpart": {iPopulation: 960, Human: 69, Halfling: 20, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dourden": {iPopulation: 560, Dwarf: 94, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dragonscar": {iPopulation: 1240, Human: 79, Dwarf: 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Karden": {iPopulation: 880, Human: 79, Halfling: 15, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Karroch's Keep": {iPopulation: 210, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "K'Dala": {iPopulation: 200, Orc: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Krag": {iPopulation: 430, Human: 84, Dwarf: 10, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Nitefire Keep": {iPopulation: 136, Human: 49, "Half-Orc": 25, Orc: 25, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Odin's Fist": {iPopulation: 172, Human: 89, Elf: 5, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Sunray Citadel": {iPopulation: 268, Human: 79, Elf: 11, Halfling: 5, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "aLenap(region)": ["Amasis Spire", "Arngold Quay", "Ashwood", "Ashwood Pillar", "Baluster", "Balaster Redoubt", "Beacon", "Boghra-Little", 
        "Bouyan Beacon", "Castle Lonewood", "Castle of the Princeling", "Citadel of Wovenmist", "Cloven", "Cower", "Cyclone Citadel", "Delan", 
        "Didgewater Fordguard", "Dryport Beacon", "Eldma-Vilyet", "Evergloom", "Finduler's Observatory", "Flamguard", "Forest Bight Fortress", 
        "Forsaken", "Fort Hobnob", "Goldfall", "Gravel Gate", "Headwater Bastion", "Hewn Dell", "Hewn Passgate", "Hregesveglur Station", 
        "Iffing", "Jungle Gap Gate", "Knoll", "Lenap (settlement)", "Lenap Tower", "Lidenstrand", "Menuquet Mound", "Mountainbirth Castle", 
        "Nettle", "Nohaven Keep", "Obelisk of the Endless Simoom", "Redwraith", "Redwraith Castle", "Reek Hill", "Rotneedle", "Rovertop", 
        "Rushkindle", "Sledgetower", "Steadfast Stronghold", "Swanrill", "Tower of Tears", "Tuftipsy", "Tupimare Tower", "Valeyard", 
        "Willowwithy", "Windless", "Winmoot", "Wondernesse", "Woodken", "Wovenmist"], 
    "Lenap (region)": {iPopulation: 46080, Human: 37, Elf: 15, Halfling: 11, Dwarf: 10, Orc: 8, "Half-Elf": 6, Gnome: 5, Goblin: 3, "Half-Orc": 2, "Hill Giant": 1, Troll: 1, other: 1, sType: "region"}, 
    "Amasis Spire": {iPopulation: 140, "Half-Elf": 89, Elf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Arngold Quay": {iPopulation: 1904, Elf: 69, "Half-Elf": 25, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ashwood": {iPopulation: 1480, Halfling: 59, Dwarf: 25, Gnome: 10, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ashwood Pillar": {iPopulation: 140, Halfling: 59, Dwarf: 25, Gnome: 10, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Baluster": {iPopulation: 1612, Elf: 79, Gnome: 15, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Balaster Redoubt": {iPopulation: 520, Elf: 79, Gnome: 15, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Beacon": {iPopulation: 1388, Human: 79, Halfling: 10, Gnome: 8, "Half-Elf": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Boghra-Little": {iPopulation: 576, Human: 50, Troll: 30, Orc: 10, "Half-Orc": 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bouyan Beacon": {iPopulation: 120, Elf: 89, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Lonewood": {iPopulation: 540, Human: 39, Elf: 20, "Half-Elf": 20, Halfling: 10, Gnome: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle of the Princeling": {iPopulation: 620, Dwarf: 79, Gnome: 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Wovenmist": {iPopulation: 160, Human: 63, Elf: 30, Dwarf: 3, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Cloven": {iPopulation: 712, Human: 59, Halfling: 20, Elf: 10, "Half-Elf": 6, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Cower": {iPopulation: 1496, Dwarf: 69, Gnome: 15, Human: 10, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Cyclone Citadel": {iPopulation: 100, Goblin: 89, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Delan": {iPopulation: 820, Human: 59, Gnome: 25, Elf: 10, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Didgewater Fordguard": {iPopulation: 560, Elf: 49, Halfling: 30, Human: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dryport Beacon": {iPopulation: 100, Human: 89, "Half-Orc": 6, Orc: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Eldma-Vilyet": {iPopulation: 812, Human: 69, Dwarf: 15, Gnome: 10, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Evergloom": {iPopulation: 1268, Human: 59, "Hill Giant": 30, Elf: 8, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Finduler's Observatory": {iPopulation: 120, Human: 89, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Flamguard": {iPopulation: 864, Human: 69, Dwarf: 15, Troll: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Forest Bight Fortress": {iPopulation: 560, Human: 49, Elf: 10, Gnome: 10, Halfling: 10, Orc: 10, Goblin: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Forsaken": {iPopulation: 476, Human: 59, Dwarf: 15, Gnome: 10, "Half-Elf": 10, Elf: 3, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fort Hobnob": {iPopulation: 140, Halfling: 69, Gnome: 15, Dwarf: 10, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Goldfall": {iPopulation: 1132, "Half-Elf": 69, Elf: 20, Human: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gravel Gate": {iPopulation: 700, Halfling: 69, Gnome: 15, "Half-Elf": 10, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Headwater Bastion": {iPopulation: 640, Human: 59, Elf: 30, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hewn Dell": {iPopulation: 1448, Human: 69, Elf: 15, "Half-Elf": 8, Halfling: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hewn Passgate": {iPopulation: 40, Goblin: 94, Gnoll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hregesveglur Station": {iPopulation: 120, Elf: 69, Human: 20, Gnome: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Iffing": {iPopulation: 532, Human: 59, Orc: 30, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Jungle Gap Gate": {iPopulation: 240, Orc: 94, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Knoll": {iPopulation: 1044, Orc: 59, "Half-Orc": 15, Human: 15, Ogre: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lenap (settlement)": {iPopulation: 2692, Human: 50, Dwarf: 15, Gnome: 5, Halfling: 5, Orc: 5, "Half-Orc": 5, Goblin: 5, Gnoll: 3, "Half-Elf": 2, Elf: 2, Troll: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lenap Tower": {iPopulation: 200, Human: 50, Dwarf: 15, Gnome: 5, Halfling: 5, Orc: 5, "Half-Orc": 5, Goblin: 5, Gnoll: 3, "Half-Elf": 2, Elf: 2, Troll: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lidenstrand": {iPopulation: 1348, Human: 69, Elf: 10, "Half-Elf": 10, Halfling: 8, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Menuquet Mound": {iPopulation: 100, Human: 89, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Mountainbirth Castle": {iPopulation: 520, Human: 39, Dwarf: 20, Halfling: 20, Gnome: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Nettle": {iPopulation: 1668, Elf: 79, "Half-Elf": 15, Gnome: 3, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nohaven Keep": {iPopulation: 280, Human: 93, "Half-Orc": 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Obelisk of the Endless Simoom": {iPopulation: 200, Human: 59, "Half-Orc": 20, Orc: 10, Goblin: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Redwraith": {iPopulation: 572, Human: 79, Halfling: 12, Gnome: 5, "Half-Elf": 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Redwraith Castle": {iPopulation: 620, Human: 59, Dwarf: 20, Halfling: 12, Gnome: 5, "Half-Elf": 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Reek Hill": {iPopulation: 632, Orc: 69, "Half-Orc": 10, Human: 10, Goblin: 6, Gnoll: 3, Elf: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rotneedle": {iPopulation: 260, Human: 39, Elf: 20, Orc: 10, Dwarf: 10, Gnome: 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Rovertop": {iPopulation: 952, Orc: 69, "Half-Orc": 15, Human: 10, Gnoll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rushkindle": {iPopulation: 1208, Human: 74, Halfling: 15, Gnome: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sledgetower": {iPopulation: 1132, Orc: 79, "Half-Orc": 15, Goblin: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Steadfast Stronghold": {iPopulation: 460, Human: 89, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Swanrill": {iPopulation: 1944, Halfling: 69, Human: 20, Gnome: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tower of Tears": {iPopulation: 160, Orc: 94, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tuftipsy": {iPopulation: 792, Goblin: 59, Human: 25, Orc: 10, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tupimare Tower": {iPopulation: 80, Gnome: 89, Dwarf: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Valeyard": {iPopulation: 1576, Human: 79, Dwarf: 15, Gnome: 3, Orc: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Willowwithy": {iPopulation: 704, Human: 69, "Half-Elf": 15, Elf: 8, Halfling: 4, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Windless": {iPopulation: 1056, Human: 59, Elf: 25, "Half-Elf": 10, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Winmoot": {iPopulation: 592, Human: 69, "Half-Elf": 15, Elf: 5, Gnome: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wondernesse": {iPopulation: 1420, Dwarf: 79, Gnome: 15, Halfling: 3, Human: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Woodken": {iPopulation: 904, Goblin: 60, Troll: 15, "Half-Orc": 15, Orc: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wovenmist": {iPopulation: 884, Human: 59, Elf: 30, "Half-Elf": 7, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "aSeaofFiveWinds": ["Bastille Fear", "Bravado Pass", "Caer Illuman", "Calfat", "Carrion", "Citadel of the Sun", "Dalmaric", "Dotard", 
        "Dunghill", "Eleventy Fields", "Elveskeep", "Encircle", "Errand Row", "Fallowfield", "Font of Samhain", "Forfold", "Fort Hekaloth", 
        "Frogbourn", "Ganesa", "Greydowns", "Grimwood End", "Halfling", "Halgorn Hold", "Hall of Taipur", "Hastmich Citadel", "Haven of Semele", 
        "Haytfyre", "Hearthome Castle", "Heratus", "Hillock Castle", "Husperat Castle", "Kalieman", "Kerealia", "Kubera", "Ladenhollow", "Lanka", 
        "Longbottle", "Looming Pass", "Loregirt", "Marcantine", "Marechal", "Miarseld", "Mimic", "Mons Spama", "Muster", "Oathcoomb", "Ochida", 
        "Oglepuss", "Overlook Keep", "Pale Gorge", "Pillage", "Rmoahals Preserve", "Rock of the Tethered Dale", "Seasprite Rest", 
        "Seithor Palace", "Serpeant-Tail", "Spicefields", "Sunny Bank", "Talimanor", "Tatter Grove", "Thistlefield", "Thistlefield Keep", "Tlan", 
        "Treeslayer", "Vastern Hold", "Vigil Sound Lighthouse", "Wardholm", "Wolly Hollow"], 
    "Sea of Five Winds": {iPopulation: 34328, Human: 64, Dwarf: 9, Halfling: 9, Elf: 8, Orc: 3, Gnoll: 1, Gnome: 1, Goblin: 1, other: 4, sType: "region"}, 
    "Bastille Fear": {iPopulation: 500, Human: 55, Dwarf: 35, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Bravado Pass": {iPopulation: 220, Human: 80, other: 20, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Caer Illuman": {iPopulation: 640, Human: 65, other: 35, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Calfat": {iPopulation: 296, Human: 84, Halfling: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Carrion": {iPopulation: 376, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Citadel of the Sun": {iPopulation: 120, Human: 60, other: 40, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dalmaric": {iPopulation: 504, Halfling: 79, Human: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dotard": {iPopulation: 524, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dunghill": {iPopulation: 572, Human: 94, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Eleventy Fields": {iPopulation: 660, Human: 75, other: 25, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Elveskeep": {iPopulation: 364, Halfling: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Encircle": {iPopulation: 312, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Errand Row": {iPopulation: 1092, Human: 94, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fallowfield": {iPopulation: 912, Halfling: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Font of Samhain": {iPopulation: 104, Human: 65, Goblin: 25, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Forfold": {iPopulation: 648, Human: 94, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fort Hekaloth": {iPopulation: 100, Human: 25, Halfling: 10, Elf: 7, other: 58, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Frogbourn": {iPopulation: 648, Human: 89, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ganesa": {iPopulation: 476, Gnoll: 94, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Greydowns": {iPopulation: 608, Human: 84, Elf: 10, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Grimwood End": {iPopulation: 1208, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Halfling": {iPopulation: 816, Human: 94, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Halgorn Hold": {iPopulation: 480, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hall of Taipur": {iPopulation: 560, Human: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hastmich Citadel": {iPopulation: 140, Human: 85, other: 15, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Haven of Semele": {iPopulation: 60, Human: 35, Elf: 35, Treant: 10, other: 20, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Haytfyre": {iPopulation: 80, Human: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hearthome Castle": {iPopulation: 520, Halfling: 95, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Heratus": {iPopulation: 328, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hillock Castle": {iPopulation: 500, Human: 55, Dwarf: 30, other: 15, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Husperat Castle": {iPopulation: 252, Human: 95, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Kalieman": {iPopulation: 316, Elf: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kerealia": {iPopulation: 1420, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kubera": {iPopulation: 372, Human: 79, Elf: 15, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ladenhollow": {iPopulation: 944, Human: 79, Dwarf: 15, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lanka": {iPopulation: 428, Human: 80, Halfling: 19, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Longbottle": {iPopulation: 1264, Elf: 94, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Looming Pass": {iPopulation: 336, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Loregirt": {iPopulation: 388, Goblin: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Marcantine": {iPopulation: 732, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Marechal": {iPopulation: 364, Halfling: 79, Human: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Miarseld": {iPopulation: 460, Human: 93, Halfling: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mimic": {iPopulation: 872, Orc: 94, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mons Spama": {iPopulation: 140, Human: 35, Orc: 20, Hobgoblin: 15, other: 30, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Muster": {iPopulation: 260, Human: 79, Elf: 15, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Oathcoomb": {iPopulation: 836, Human: 95, Dwarf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ochida": {iPopulation: 344, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Oglepuss": {iPopulation: 100, Gnome: 95, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Overlook Keep": {iPopulation: 192, Halfling: 55, Elf: 20, other: 25, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Pale Gorge": {iPopulation: 568, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Pillage": {iPopulation: 1220, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rmoahals Preserve": {iPopulation: 216, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Rock of the Tethered Dale": {iPopulation: 440, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Seasprite Rest": {iPopulation: 68, Human: 85, other: 15, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Seithor Palace": {iPopulation: 48, Elf: 85, other: 15, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Serpeant-Tail": {iPopulation: 420, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Spicefields": {iPopulation: 200, Human: 95, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Sunny Bank": {iPopulation: 256, Orc: 94, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Talimanor": {iPopulation: 408, Human: 84, Halfling: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tatter Grove": {iPopulation: 1264, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Thistlefield": {iPopulation: 400, Human: 79, Elf: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Thistlefield Keep": {iPopulation: 140, Human: 65, Elf: 20, other: 15, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tlan": {iPopulation: 1952, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Treeslayer": {iPopulation: 640, Human: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Vastern Hold": {iPopulation: 580, Human: 96, other: 4, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Vigil Sound Lighthouse": {iPopulation: 440, Human: 25, Elf: 20, Gnome: 15, other: 40, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wardholm": {iPopulation: 580, Human: 94, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wolly Hollow": {iPopulation: 100, Elf: 90, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "aSilverSkeinIsles": ["Carintoos", "Cordoom", "D'Alfang", "Elmsoak", "Foulmuck Citadel", "Glournd", "Haven", "Kelsville", "Marchoon", 
        "Mitra's Step", "Monastery of the Lion's Might", "Mordston", "Noenthal", "Pilderth", "Prats Landing", "Rallu", "Sailor's Bane Citadel", 
        "Sandover Castle", "Seamist Citadel", "Sheepyard", "Southern Coast Tower", "Tula", "Thalthaskil", "Tradepost", "Verdant Hall", 
        "Waterplace", "Whitepearl Castle", "Windsong"], 
    "Silver Skein Isles": {iPopulation: 64638, Human: 72, Elf: 7, Gnome: 4, "Half-Elf": 4, Dwarf: 3, Halfling: 3, "Half-Orc": 2, Lizardfolk: 1, other: 4, sType: "region"}, 
    "Carintoos": {iPopulation: 1832, Human: 84, Elf: 10, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Cordoom": {iPopulation: 788, Human: 89, Dwarf: 6, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "D'Alfang": {iPopulation: 1312, Human: 98, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Elmsoak": {iPopulation: 1132, Human: 69, Halfling: 20, Elf: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Foulmuck Citadel": {iPopulation: 80, Human: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Glournd": {iPopulation: 468, Lizardfolk: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Haven": {iPopulation: 1360, Human: 74, Dwarf: 15, Elf: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kelsville": {iPopulation: 564, Human: 87, Lizardfolk: 10, "Half-Orc": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Marchoon": {iPopulation: 1480, Human: 74, Dwarf: 15, Elf: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mitra's Step": {iPopulation: 200, Human: 69, Lizardfolk: 30, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Monastery of the Lion's Might": {iPopulation: 200, Human: 94, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Mordston": {iPopulation: 1164, Human: 90, Elf: 5, "Half-Elf": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Noenthal": {iPopulation: 1276, Elf: 87, Human: 12, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Pilderth": {iPopulation: 1100, Human: 74, Dwarf: 15, Elf: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Prats Landing": {iPopulation: 1856, Human: 84, Elf: 5, Dwarf: 5, "Half-Elf": 4, Halfling: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rallu": {iPopulation: 35000, Human: 79, Halfling: 5, Elf: 5, Gnome: 5, "Half-Elf": 3, "Half-Orc": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sailor's Bane Citadel": {iPopulation: 160, Human: 71, Elf: 25, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sandover Castle": {iPopulation: 600, Hobgoblin: 59, "Half-Orc": 30, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Seamist Citadel": {iPopulation: 160, Human: 89, Halfling: 6, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Sheepyard": {iPopulation: 160, Human: 89, Elf: 5, "Half-Elf": 3, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Southern Coast Tower": {iPopulation: 200, Human: 75, Dwarf: 15, other: 10, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tula": {iPopulation: 9102, Human: 50, Elf: 10, "Half-Elf": 10, Gnome: 6, Dwarf: 4, other: 20, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Thalthaskil": {iPopulation: 1484, Human: 74, Dwarf: 10, Elf: 7, "Half-Elf": 5, "Half-Orc": 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tradepost": {iPopulation: 1464, Human: 74, Dwarf: 15, Elf: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Verdant Hall": {iPopulation: 280, Halfling: 89, Human: 5, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Waterplace": {iPopulation: 496, Human: 90, Elf: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Whitepearl Castle": {iPopulation: 600, Dwarf: 79, Human: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Windsong": {iPopulation: 120, Human: 89, Elf: 5, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "aSouthernReaches": ["Armorscape Palace", "Arquay", "Badquen", "Belweif", "Bethplane", "Brantelm", "Bridshin", "Brond's Citadel", 
        "Castle Bendarstor", "Castle Waterwell", "Citadel of Crowns", "Citadel of the Blade", "Claycat", "Dragonsaddle", "Elmhalls", "Estlark", 
        "Faling-Thros", "Fairwatch", "Fangrim Citadel", "Fortress Gruengard", "Gelsford", "Hiling Place", "Khallordain", 
        "Monastery of the Blind Moon", "Mor Dan", "Morgon", "Naglonther's Hold", "O'ercland", "Pantagg Citadel", "Peacock Citadel", "Presbain", 
        "Rand", "Rast Peak", "Ravenlair", "Silverhall", "Silvership Castle", "Stonehold Citadel", "Waterplace", "Whitehaven"], 
    "Southern Reaches": {iPopulation: 33378, Human: 47, Orc: 17, Dwarf: 11, Elf: 8, "Half-Orc": 7, "Half-Elf": 6, Halfling: 3, other: 1, sType: "region"}, 
    "Armorscape Palace": {iPopulation: 640, Human: 84, Dwarf: 12, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Arquay": {iPopulation: 1232, Human: 65, Orc: 20, "Half-Orc": 14, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Badquen": {iPopulation: 1352, Human: 54, Orc: 32, "Half-Orc": 10, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Belweif": {iPopulation: 1988, Human: 73, Orc: 17, "Half-Orc": 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bethplane": {iPopulation: 1172, Human: 61, Elf: 18, "Half-Elf": 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Brantelm": {iPopulation: 1060, Human: 83, Dwarf: 7, "Half-Elf": 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bridshin": {iPopulation: 1568, Human: 64, "Half-Orc": 13, Dwarf: 11, Orc: 7, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Brond's Citadel": {iPopulation: 320, Human: 79, "Half-Orc": 12, Dwarf: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Bendarstor": {iPopulation: 200, Orc: 59, "Half-Orc": 15, Ogre: 20, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Waterwell": {iPopulation: 600, Human: 79, "Half-Orc": 10, Orc: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Crowns": {iPopulation: 200, Orc: 61, "Half-Orc": 16, Human: 16, Ogre: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of the Blade": {iPopulation: 160, Human: 79, "Half-Orc": 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Claycat": {iPopulation: 1744, Orc: 77, "Half-Orc": 18, Human: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dragonsaddle": {iPopulation: 1244, Dwarf: 93, Gnome: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Elmhalls": {iPopulation: 1696, "Half-Elf": 72, Elf: 18, Human: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Estlark": {iPopulation: 856, Human: 87, Dwarf: 6, Gnome: 3, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Faling-Thros": {iPopulation: 592, Human: 94, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fairwatch": {iPopulation: 464, Human: 78, "Half-Orc": 19, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fangrim Citadel": {iPopulation: 280, Orc: 75, "Half-Orc": 13, Troll: 10, Human: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Fortress Gruengard": {iPopulation: 320, Orc: 53, "Half-Orc": 36, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Gelsford": {iPopulation: 496, Human: 77, "Half-Orc": 15, Orc: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hiling Place": {iPopulation: 532, Human: 93, "Half-Elf": 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Khallordain": {iPopulation: 1044, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Monastery of the Blind Moon": {iPopulation: 160, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Mor Dan": {iPopulation: 1828, Orc: 63, Human: 22, "Half-Orc": 14, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Morgon": {iPopulation: 492, Human: 65, "Half-Orc": 31, Orc: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Naglonther's Hold": {iPopulation: 520, Human: 95, Dwarf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "O'ercland": {iPopulation: 816, Halfling: 85, Human: 14, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Pantagg Citadel": {iPopulation: 120, Human: 77, "Half-Elf": 13, Elf: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Peacock Citadel": {iPopulation: 270, "Half-Elf": 75, Elf: 12, Human: 12, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Presbain": {iPopulation: 1388, Human: 85, Halfling: 10, "Half-Orc": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rand": {iPopulation: 1292, Human: 75, "Half-Elf": 15, Dwarf: 7, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rast Peak": {iPopulation: 1684, Orc: 83, "Half-Orc": 8, Human: 4, Dwarf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ravenlair": {iPopulation: 1412, Human: 94, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Silverhall": {iPopulation: 744, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Silvership Castle": {iPopulation: 280, Human: 70, "Half-Elf": 20, Elf: 8, other: 2, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Stonehold Citadel": {iPopulation: 200, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Waterplace": {iPopulation: 496, Human: 76, "Half-Orc": 15, Orc: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Whitehaven": {iPopulation: 1916, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "aTarantis(region)": ["Adwoilath Citadel", "Aelfstead", "Algiran", "Andalusia", "Arrowdale", "Ashkelon", "Avaris", "Bastet", 
        "Battlefield Castle", "Bethan", "Bireznia", "Blackpit", "Blackroot", "Bokozia", "Border Citadel", "Borsippa", "Braztook Citadel", 
        "Bridgefields", "Bridgefields Castle", "Brimstone Castle", "Bulash", "Caldia", "Castle Thendaswen", "Citadel of the Three", 
        "Citadel of Visions", "Citadel of Vorevia", "Croe Citadel", "Crying Citadel", "Daer Keep", "Dark Odyssey", "Delos", "Drakevain", "Dier", 
        "Elves' Citadel", "Erogor", "Far Citadel", "Farine", "Fenshaft", "Filthenor Citadel", "Forest Watch", "Ganzir-Galad", "Garzan", 
        "Gavorbredanten Castle", "Girbag Citadel", "Gishmesh", "Glaeon Citadel", "Green Sea Citadel", "Griffon Castle", "Hadramawti", 
        "Hedrinad Citadel", "Hykos-Faring", "Inheritance", "Invisible Citadel", "Jennadar Keep", "Kanakis", "Kunus Castle", "Lakhish", "Lithyan", 
        "Maedoc Tower", "Megidolar", "Megidolar Castle", "Meri-Amon", "Morgoran Tower", "Nabob", "Nergol", "Nisan-Moot", "Nuriedidin", 
        "Nydauwin", "Paldorius", "Quiet Citadel", "Redflood", "Redharm", "Regina-Far", "Sangorn", "Seraphine", "Shadowmirk", "Sinacherib", 
        "Sintar", "Soma", "Southbattle Castle", "Steppes-End Citadel", "Stonebow", "Stonebridge Castle", "Surintal", "Tallulah", "Tamarizk", 
        "Tarantis (settlement)", "Tashmetun", "Tower of Virshnak", "Twin Rivers Castle", "Tyviel Citadel", "Unodric Tower", "Urillius-Elos", 
        "Waven Castle", "Wayock Citadel", "White Citadel", "Willowsfen", "Wine Valley Citadel", "Wolfskin"], 
    "Tarantis (region)": {iPopulation: 94152, Human: 61, Elf: 10, Dwarf: 6, Orc: 5, Goblin: 4, "Half-Elf": 3, Halfling: 3, Gnoll: 2, Gnome: 1, Hobgoblin: 1, other: 4, sType: "region"}, 
    "Adwoilath Citadel": {iPopulation: 440, Human: 84, Elf: 7, Dwarf: 5, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Aelfstead": {iPopulation: 1328, Gnoll: 91, Human: 5, Goblin: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Algiran": {iPopulation: 1588, Human: 82, Elf: 7, Halfling: 6, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Andalusia": {iPopulation: 1064, Goblin: 85, Orc: 8, Human: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Arrowdale": {iPopulation: 812, Human: 73, Elf: 12, Gnome: 7, Dwarf: 4, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ashkelon": {iPopulation: 436, Human: 82, Elf: 7, Halfling: 4, Dwarf: 4, Pixie: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Avaris": {iPopulation: 1516, Human: 83, Halfling: 5, Elf: 4, Gnome: 4, Dwarf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bastet": {iPopulation: 1192, Human: 83, Elf: 6, Gnome: 4, Dwarf: 3, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Battlefield Castle": {iPopulation: 480, Human: 89, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Bethan": {iPopulation: 1852, Human: 79, Dwarf: 11, Elf: 6, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bireznia": {iPopulation: 2108, Human: 66, Hobgoblin: 20, Orc: 12, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blackpit": {iPopulation: 1268, Orc: 89, Human: 6, Goblin: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Blackroot": {iPopulation: 1420, Human: 77, Dwarf: 9, Gnome: 7, Elf: 4, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bokozia": {iPopulation: 804, Human: 82, Elf: 8, Dwarf: 6, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Border Citadel": {iPopulation: 200, Human: 79, Orc: 15, Gnoll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Borsippa": {iPopulation: 716, Orc: 74, Human: 20, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Braztook Citadel": {iPopulation: 160, Human: 84, "Half-Elf": 10, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Bridgefields": {iPopulation: 1200, Human: 77, Elf: 11, Dwarf: 4, Halfling: 4, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bridgefields Castle": {iPopulation: 320, Human: 89, Gnome: 5, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Brimstone Castle": {iPopulation: 600, Human: 94, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Bulash": {iPopulation: 740, Human: 82, Dwarf: 8, Elf: 4, "Half-Elf": 3, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Caldia": {iPopulation: 772, Human: 77, Orc: 9, "Half-Orc": 7, Goblin: 4, Gnoll: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle Thendaswen": {iPopulation: 280, Human: 79, Elf: 10, Dwarf: 5, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of the Three": {iPopulation: 120, Human: 79, Elf: 10, Gnome: 6, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Visions": {iPopulation: 240, Human: 84, Dwarf: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of Vorevia": {iPopulation: 400, Elf: 74, Human: 20, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Croe Citadel": {iPopulation: 160, Human: 89, Dwarf: 5, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Crying Citadel": {iPopulation: 200, Human: 89, Elf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Daer Keep": {iPopulation: 120, Human: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dark Odyssey": {iPopulation: 1160, Halfling: 78, Human: 10, Elf: 5, Dwarf: 4, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Delos": {iPopulation: 592, Human: 80, Dwarf: 7, Elf: 6, Halfling: 4, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Drakevain": {iPopulation: 1804, Human: 73, Elf: 12, Dwarf: 6, Gnome: 4, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dier": {iPopulation: 1756, Human: 81, Dwarf: 10, Elf: 6, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Elves' Citadel": {iPopulation: 160, Human: 69, Elf: 30, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Erogor": {iPopulation: 80, Gnoll: 94, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Far Citadel": {iPopulation: 120, Human: 74, Elf: 20, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Farine": {iPopulation: 1072, Human: 80, Elf: 9, Dwarf: 4, Gnome: 3, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fenshaft": {iPopulation: 1632, Goblin: 83, Human: 6, Orc: 5, "Half-Orc": 4, Ogre: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Filthenor Citadel": {iPopulation: 80, Human: 82, Elf: 12, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Forest Watch": {iPopulation: 280, Human: 89, Elf: 6, Pixie: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Ganzir-Galad": {iPopulation: 416, Human: 75, Elf: 8, Dwarf: 7, Gnome: 6, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Garzan": {iPopulation: 1192, Dwarf: 77, Elf: 9, Human: 7, Gnome: 4, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gavorbredanten Castle": {iPopulation: 280, Gnome: 64, Human: 35, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Girbag Citadel": {iPopulation: 320, Goblin: 79, Orc: 15, Gnoll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Gishmesh": {iPopulation: 1692, Human: 88, Elf: 4, Dwarf: 2, Gnome: 2, Halfling: 2, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Glaeon Citadel": {iPopulation: 40, Human: 89, "Half-Orc": 5, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Green Sea Citadel": {iPopulation: 160, Human: 79, "Half-Elf": 11, Gnome: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Griffon Castle": {iPopulation: 160, Human: 78, Elf: 11, Halfling: 5, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hadramawti": {iPopulation: 920, Gnoll: 79, Human: 13, Orc: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hedrinad Citadel": {iPopulation: 120, Human: 84, Halfling: 10, Elf: 3, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hykos-Faring": {iPopulation: 592, Human: 90, Dwarf: 4, Elf: 3, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Inheritance": {iPopulation: 80, Human: 89, Halfling: 5, Elf: 3, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Invisible Citadel": {iPopulation: 40, Human: 89, Ogre: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Jennadar Keep": {iPopulation: 200, Halfling: 84, Gnome: 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Kanakis": {iPopulation: 1436, Human: 79, Elf: 12, Dwarf: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kunus Castle": {iPopulation: 360, Dwarf: 79, Human: 14, Halfling: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lakhish": {iPopulation: 1756, "Half-Elf": 79, Human: 11, Dwarf: 3, Halfling: 3, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lithyan": {iPopulation: 1516, Elf: 79, Human: 10, Halfling: 6, Gnome: 2, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Maedoc Tower": {iPopulation: 40, Human: 79, Gnoll: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Megidolar": {iPopulation: 1432, Goblin: 90, Human: 8, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Megidolar Castle": {iPopulation: 40, Goblin: 89, Kobold: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Meri-Amon": {iPopulation: 1656, Elf: 84, Human: 6, Halfling: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Morgoran Tower": {iPopulation: 240, Human: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Nabob": {iPopulation: 200, Hobgoblin: 94, Goblin: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Nergol": {iPopulation: 836, Human: 78, Elf: 9, Dwarf: 5, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nisan-Moot": {iPopulation: 1348, Human: 86, Elf: 6, Dwarf: 4, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nuriedidin": {iPopulation: 1496, Elf: 78, Human: 12, Gnome: 4, "Half-Elf": 3, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nydauwin": {iPopulation: 440, Human: 79, Elf: 10, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Paldorius": {iPopulation: 652, Human: 89, Dwarf: 4, Elf: 3, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Quiet Citadel": {iPopulation: 200, Human: 89, Elf: 5, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Redflood": {iPopulation: 1268, "Half-Elf": 79, Elf: 9, Human: 7, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Redharm": {iPopulation: 972, Human: 97, Orc: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Regina-Far": {iPopulation: 1008, Human: 85, Halfling: 5, Elf: 4, other: 6, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sangorn": {iPopulation: 1464, Human: 93, "Half-Elf": 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Seraphine": {iPopulation: 700, Human: 79, Elf: 8, "Half-Elf": 5, Dwarf: 4, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shadowmirk": {iPopulation: 596, Human: 83, "Half-Elf": 10, Goblin: 4, "Half-Orc": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sinacherib": {iPopulation: 500, Human: 94, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sintar": {iPopulation: 468, Human: 81, Dwarf: 8, Halfling: 6, Gnome: 2, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Soma": {iPopulation: 872, Human: 77, Elf: 9, Dwarf: 7, Gnome: 4, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Southbattle Castle": {iPopulation: 280, Human: 93, Elf: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Steppes-End Citadel": {iPopulation: 280, Human: 89, Dwarf: 6, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Stonebow": {iPopulation: 448, Human: 78, Dwarf: 8, Elf: 6, "Half-Elf": 5, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Stonebridge Castle": {iPopulation: 160, Human: 84, Elf: 10, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Surintal": {iPopulation: 1904, Orc: 93, Human: 5, Goblin: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tallulah": {iPopulation: 860, Human: 76, Elf: 10, "Half-Elf": 6, Dwarf: 4, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tamarizk": {iPopulation: 1048, Human: 87, Elf: 6, Halfling: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tarantis (settlement)": {iPopulation: 24000, Human: 70, Dwarf: 10, Elf: 10, other: 10, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tashmetun": {iPopulation: 1040, Orc: 83, Human: 13, "Half-Orc": 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tower of Virshnak": {iPopulation: 400, Human: 89, Orc: 6, Troll: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Twin Rivers Castle": {iPopulation: 240, Human: 69, Elf: 20, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tyviel Citadel": {iPopulation: 80, Human: 89, Orc: 5, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Unodric Tower": {iPopulation: 80, Human: 84, "Half-Orc": 10, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Urillius-Elos": {iPopulation: 944, Human: 88, Elf: 4, other: 8, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Waven Castle": {iPopulation: 240, Human: 81, Elf: 11, Dwarf: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wayock Citadel": {iPopulation: 120, Human: 79, Orc: 15, Gnoll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "White Citadel": {iPopulation: 120, Human: 89, Elf: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Willowsfen": {iPopulation: 896, Human: 85, Elf: 6, Dwarf: 4, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wine Valley Citadel": {iPopulation: 80, Human: 90, Elf: 5, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wolfskin": {iPopulation: 1952, Human: 79, Elf: 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "aValleyoftheAncients": ["Acre Opposum Keep", "Adoras Shrine", "Aldakar's Tower", "Arkat", "Bantley Castle", "Charmack", "Chumner", 
        "Citadel of the Silver Sickle", "Citadel of the Woods", "Cudgel", "Dome", "Drossyork Castle", "Dwim", "Falon Castle", "Fransk", 
        "Gazarack", "Glackin", "Greenswabs", "Grief Castle", "Gruesome Square", "Hall of the Vanguard", "Heart of Angell", "Huffi Castle", 
        "Hurickta", "Illirasi", "Infamy", "Jackal", "Karnesh", "Keldar", "Klest", "Korqua", "Leonwright Citadel", "Lepas", "Levacant Castle", 
        "Myriad", "Namatar", "Ninsum", "Northern Outpost", "Oblation Shrine", "Polimeros Keep", "Pyre", "Quitlant", "Ruti", "Salyzar", 
        "Shaboban", "Shagarack", "Skull Tower", "Suitizor", "Tammuzi", "Tarsh", "Tonat", "Tower of Shrinking Canyon", "Tower of the North Wind", 
        "Tower of the Tooth", "Veshnar", "Weredstone", "Wererat Citadel", "Windstorm", "Zarast"], 
    "Valley of the Ancients": {iPopulation: 56171, Human: 57, Dwarf: 12, Elf: 10, Halfling: 5, Gnome: 4, Orc: 4, Goblin: 2, "Half-Elf": 2, Gnoll: 1, "Half-Orc": 1, other: 2, sType: "region"},
    "Acre Opposum Keep": {iPopulation: 640, Human: 83, Elf: 12, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Adoras Shrine": {iPopulation: 40, Human: 79, Elf: 15, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Aldakar's Tower": {iPopulation: 160, Human: 86, Elf: 7, Dwarf: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Arkat": {iPopulation: 1140, Halfling: 76, Human: 10, Elf: 9, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Bantley Castle": {iPopulation: 280, Human: 90, Elf: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Charmack": {iPopulation: 2292, Dwarf: 79, Human: 16, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Chumner": {iPopulation: 944, Human: 71, Goblin: 16, Orc: 4, "Half-Orc": 4, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Citadel of the Silver Sickle": {iPopulation: 80, Human: 97, "Stone Troll": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Citadel of the Woods": {iPopulation: 60, Human: 83, Gnome: 7, Elf: 6, Dwarf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Cudgel": {iPopulation: 1336, Human: 83, Elf: 6, Halfling: 5, Dwarf: 3, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Dome": {iPopulation: 656, Gnome: 73, Human: 14, Dwarf: 8, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Drossyork Castle": {iPopulation: 360, Orc: 79, Goblin: 15, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dwim": {iPopulation: 492, Human: 77, Elf: 12, Dwarf: 6, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Falon Castle": {iPopulation: 520, Human: 94, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Fransk": {iPopulation: 436, Human: 82, "Half-Elf": 8, "Half-Orc": 6, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gazarack": {iPopulation: 380, "Half-Elf": 77, Human: 8, Elf: 6, Gnome: 4, Dwarf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Glackin": {iPopulation: 964, Dwarf: 75, Human: 10, Gnome: 6, Elf: 4, Halfling: 2, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Greenswabs": {iPopulation: 2004, Human: 73, Elf: 14, Gnome: 5, "Half-Elf": 3, Dwarf: 2, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Grief Castle": {iPopulation: 320, Human: 95, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Gruesome Square": {iPopulation: 360, "Half-Orc": 63, Human: 24, Orc: 12, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hall of the Vanguard": {iPopulation: 480, Human: 95, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Heart of Angell": {iPopulation: 80, Hobgoblin: 89, Goblin: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Huffi Castle": {iPopulation: 440, Elf: 73, Human: 14, "Half-Elf": 6, Gnome: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hurickta": {iPopulation: 648, Human: 79, Gnome: 7, Elf: 5, "Half-Elf": 4, Dwarf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Illirasi": {iPopulation: 660, Human: 74, Elf: 12, "Half-Elf": 6, Gnome: 5, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Infamy": {iPopulation: 792, Human: 77, Elf: 7, Dwarf: 6, "Half-Elf": 4, Gnome: 3, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Jackal": {iPopulation: 224, Orc: 78, Human: 17, "Half-Orc": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Karnesh": {iPopulation: 472, Orc: 79, Goblin: 10, Human: 6, "Half-Orc": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Keldar": {iPopulation: 400, Human: 82, Elf: 6, Dwarf: 5, Gnome: 3, Halfling: 2, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Klest": {iPopulation: 2712, Human: 70, Gnome: 8, "Half-Elf": 8, Elf: 5, Halfling: 4, Dwarf: 2, "First Men": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Korqua": {iPopulation: 844, Dwarf: 75, Human: 15, Gnome: 6, other: 4, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Leonwright Citadel": {iPopulation: 120, Human: 79, Dwarf: 15, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Lepas": {iPopulation: 692, Human: 80, Elf: 7, Dwarf: 4, Halfling: 4, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Levacant Castle": {iPopulation: 280, Elf: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Myriad": {iPopulation: 828, Human: 79, Orc: 14, "Half-Orc": 4, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Namatar": {iPopulation: 724, Gnoll: 88, Goblin: 5, Orc: 3, Human: 2, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ninsum": {iPopulation: 888, Human: 76, Elf: 15, "Half-Elf": 4, Dwarf: 2, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Northern Outpost": {iPopulation: 520, Human: 59, Elf: 30, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Oblation Shrine": {iPopulation: 80, Halfling: 95, Human: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Polimeros Keep": {iPopulation: 360, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Pyre": {iPopulation: 652, Goblin: 88, Human: 10, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Quitlant": {iPopulation: 1136, Orc: 78, Human: 12, "Half-Orc": 7, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ruti": {iPopulation: 2224, Elf: 70, Human: 15, Gnome: 8, Halfling: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Salyzar": {iPopulation: 2028, Human: 84, Elf: 14, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shaboban": {iPopulation: 688, Dwarf: 86, Human: 10, Elf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shagarack": {iPopulation: 1164, Human: 85, Elf: 6, Orc: 6, other: 3, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Skull Tower": {iPopulation: 43, Undead: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Suitizor": {iPopulation: 488, Human: 79, Elf: 10, "Half-Elf": 6, Dwarf: 2, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tammuzi": {iPopulation: 872, Human: 81, Halfling: 10, Elf: 7, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tarsh": {iPopulation: 14240, Human: 70, Elf: 10, Dwarf: 8, Gnome: 6, Halfling: 4, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tonat": {iPopulation: 572, Human: 79, Elf: 10, Dwarf: 6, "Half-Elf": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tower of Shrinking Canyon": {iPopulation: 200, Human: 54, Orc: 40, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of the North Wind": {iPopulation: 80, Human: 89, Elf: 5, Halfling: 3, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Tower of the Tooth": {iPopulation: 600, Halfling: 79, Human: 14, Elf: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Veshnar": {iPopulation: 1380, Human: 85, Elf: 9, Dwarf: 4, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Weredstone": {iPopulation: 524, Human: 90, Elf: 4, Halfling: 4, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wererat Citadel": {iPopulation: 240, Kobold: 97, Wererat: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Windstorm": {iPopulation: 1392, Human: 82, Elf: 5, "Half-Elf": 4, Halfling: 3, other: 6, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Zarast": {iPopulation: 1940, Dwarf: 69, Human: 20, "Half-Elf": 4, Halfling: 4, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "aValon(region)": ["Aldebaren", "Amaeron", "Arcturan", "Berclazan", "Brazen Spire", "Breem", "Brendare", "Canopusar", 
        "Castle of the Changeling", "Castle of the Crossroads", "Castle Thrinaki", "Cayerva Horn Beacon", "Cayerva Watch", "Cidin-Kazar", 
        "Citadel of the Deadened Bell", "Dancing Dain's Lookout", "Deadtree Tower", "Delavan", "Doomsford", "Elysian Manor", "Etlanna", 
        "Fairlea", "Fairlea Pharos", "Fairway", "Finmaer Tower", "Fomaland", "Fort Freedom", "Fort Rarezac", "Fortress Tilleasy", 
        "Freeman's Fen", "Garthain", "Gloomcastle", "Gnomestead", "Grawaste", "Hallhaven", "Harrowdale", "Heatherdale", "Holly Ridge Bulwark", 
        "Ironholm", "Ironholm Guard Tower", "Kirilith", "Klanith", "Lith-Maven", "Malikarr", "Marshwatch Stronghold", "Milirth Castle", 
        "Milirth", "Moskilt", "Neang-Kazar", "Nimbortan", "Norodom", "Oakenclear", "Orcholding", "Orinco-Dier", "Rivergap Castle", 
        "Roundtop Bastion", "Roversport", "Roversport Stronghold", "Sanctuary Keep", "Serenity Redoubt", "Shadow Valley Stronghold", 
        "Shardwood Castle", "Stumpy Point", "Tilleasy", "Tirthsen", "Torgress", "Tower of Ered Mar", "Uriah-Kazar", "Valon (settlement)", 
        "Vorsteria", "Wolf Point Citadel", "Wyrmwatch Library", "Zindar", "Zurbardor"], 
    "Valon (region)": {iPopulation: 59017, Human: 52, Dwarf: 11, Halfling: 7, Elf: 7, Gnome: 6, "Half-Elf": 6, Goblin: 4, Orc: 4, "Half-Orc": 1, other: 2, sType: "region"}, 
    "Aldebaren": {iPopulation: 1240, Human: 79, "Half-Elf": 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Amaeron": {iPopulation: 640, Human: 61, "Half-Elf": 18, Dwarf: 14, Halfling: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Arcturan": {iPopulation: 720, Human: 79, "Half-Elf": 10, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Berclazan": {iPopulation: 420, Human: 64, Dwarf: 15, Gnome: 8, "Half-Elf": 8, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Brazen Spire": {iPopulation: 560, Goblin: 64, Orc: 25, "Half-Orc": 5, Troll: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Breem": {iPopulation: 1016, Elf: 82, Human: 12, "Half-Elf": 4, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Brendare": {iPopulation: 640, Goblin: 72, Ogre: 17, Orc: 8, "Half-Orc": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Canopusar": {iPopulation: 1860, Human: 67, "Half-Elf": 12, Halfling: 10, Dwarf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Castle of the Changeling": {iPopulation: 400, "Half-Elf": 49, Human: 25, Elf: 15, Gnome: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle of the Crossroads": {iPopulation: 200, Human: 79, "Half-Elf": 10, "Half-Orc": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Castle Thrinaki": {iPopulation: 320, Human: 84, Elf: 10, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Cayerva Horn Beacon": {iPopulation: 120, Human: 54, Elf: 25, Dwarf: 15, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Cayerva Watch": {iPopulation: 160, Human: 93, Halfling: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Cidin-Kazar": {iPopulation: 600, Dwarf: 70, Gnome: 22, Halfling: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Citadel of the Deadened Bell": {iPopulation: 160, Human: 90, Elf: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Dancing Dain's Lookout": {iPopulation: 240, Human: 74, Dwarf: 8, Gnome: 7, Elf: 7, "Half-Elf": 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Deadtree Tower": {iPopulation: 440, Orc: 69, "Half-Orc": 15, Gnoll: 5, Troll: 5, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Delavan": {iPopulation: 720, Halfling: 79, Gnome: 8, Dwarf: 8, Human: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Doomsford": {iPopulation: 1320, Human: 53, Dwarf: 28, Gnome: 15, "Half-Elf": 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Elysian Manor": {iPopulation: 80, Halfling: 89, Gnome: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Etlanna": {iPopulation: 488, Human: 76, "Half-Elf": 10, Halfling: 8, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fairlea": {iPopulation: 460, Human: 79, Elf: 10, Halfling: 8, "Half-Elf": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fairlea Pharos": {iPopulation: 80, Human: 74, Elf: 15, Halfling: 8, "Half-Elf": 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Fairway": {iPopulation: 2440, Human: 77, Dwarf: 12, Halfling: 7, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Finmaer Tower": {iPopulation: 200, Human: 74, "Half-Elf": 10, Halfling: 10, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Fomaland": {iPopulation: 1680, Human: 75, Dwarf: 12, Gnome: 7, other: 6, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fort Freedom": {iPopulation: 160, Elf: 94, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Fort Rarezac": {iPopulation: 89, Gnome: 89, Dwarf: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Fortress Tilleasy": {iPopulation: 320, Human: 74, Elf: 10, Halfling: 10, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Freeman's Fen": {iPopulation: 1260, Human: 64, Dwarf: 15, Gnome: 8, Elf: 8, "Half-Elf": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Garthain": {iPopulation: 1240, Human: 80, "Half-Elf": 11, Dwarf: 6, Gnome: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gloomcastle": {iPopulation: 440, Dwarf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Gnomestead": {iPopulation: 872, Human: 52, Halfling: 25, Gnome: 12, "Half-Elf": 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Grawaste": {iPopulation: 500, Human: 74, Elf: 14, Dwarf: 8, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hallhaven": {iPopulation: 848, Human: 82, "Half-Elf": 11, Halfling: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Harrowdale": {iPopulation: 1360, Human: 60, "Half-Elf": 16, Halfling: 15, Elf: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Heatherdale": {iPopulation: 1440, Gnome: 64, Halfling: 25, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Holly Ridge Bulwark": {iPopulation: 400, Human: 74, Gnome: 10, Dwarf: 8, Halfling: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Ironholm": {iPopulation: 1544, Dwarf: 82, Gnome: 8, Human: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ironholm Guard Tower": {iPopulation: 80, Dwarf: 69, Gnome: 10, Halfling: 10, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Kirilith": {iPopulation: 1744, Goblin: 69, Orc: 25, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Klanith": {iPopulation: 848, Human: 54, "Half-Elf": 20, Dwarf: 18, Elf: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Lith-Maven": {iPopulation: 1080, Human: 69, "Half-Elf": 11, Gnome: 10, Elf: 9, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Malikarr": {iPopulation: 640, Human: 73, "Half-Elf": 14, Halfling: 10, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Marshwatch Stronghold": {iPopulation: 520, Human: 74, Halfling: 13, Gnome: 7, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Milirth Castle": {iPopulation: 400, Elf: 71, Human: 18, Halfling: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Milirth": {iPopulation: 840, Elf: 72, "Half-Elf": 12, Halfling: 10, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Moskilt": {iPopulation: 608, Human: 64, Dwarf: 20, Gnome: 11, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Neang-Kazar": {iPopulation: 880, Gnome: 70, Halfling: 12, Dwarf: 11, Human: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nimbortan": {iPopulation: 680, Human: 74, Halfling: 13, Gnome: 7, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Norodom": {iPopulation: 896, Human: 87, "Half-Elf": 10, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Oakenclear": {iPopulation: 992, Orc: 69, "Half-Orc": 10, Gnoll: 9, Troll: 8, Human: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Orcholding": {iPopulation: 480, Orc: 72, "Half-Orc": 17, Ogre: 1, other: 10, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Orinco-Dier": {iPopulation: 1800, Human: 73, "Half-Elf": 15, Halfling: 8, Elf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rivergap Castle": {iPopulation: 240, Gnome: 89, Dwarf: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Roundtop Bastion": {iPopulation: 280, Human: 59, Orc: 20, "Half-Orc": 10, Goblin: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Roversport": {iPopulation: 340, "Half-Orc": 73, Orc: 16, Ogre: 8, Human: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Roversport Stronghold": {iPopulation: 240, "Half-Orc": 73, Orc: 16, Ogre: 8, Human: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Sanctuary Keep": {iPopulation: 720, Human: 59, "Half-Elf": 25, Elf: 10, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Serenity Redoubt": {iPopulation: 400, Human: 77, Dwarf: 12, Halfling: 7, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Shadow Valley Stronghold": {iPopulation: 240, Goblin: 69, Orc: 25, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Shardwood Castle": {iPopulation: 240, Human: 74, Halfling: 13, Gnome: 7, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Stumpy Point": {iPopulation: 360, Human: 65, "Half-Elf": 11, Gnome: 10, Elf: 7, Dwarf: 6, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tilleasy": {iPopulation: 900, Human: 76, "Half-Elf": 10, Halfling: 8, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tirthsen": {iPopulation: 440, Human: 72, "Half-Elf": 14, Halfling: 8, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Torgress": {iPopulation: 860, Human: 73, "Half-Elf": 10, Halfling: 10, other: 7, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tower of Ered Mar": {iPopulation: 320, Dwarf: 94, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Uriah-Kazar": {iPopulation: 2040, Dwarf: 72, Halfling: 12, Gnome: 8, Human: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Valon (settlement)": {iPopulation: 6760, Human: 70, Elf: 10, Halfling: 5, Dwarf: 5, "Half-Elf": 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Vorsteria": {iPopulation: 1808, Human: 74, Gnome: 10, Dwarf: 8, Halfling: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Wolf Point Citadel": {iPopulation: 200, Human: 74, Elf: 14, Dwarf: 8, Gnome: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Wyrmwatch Library": {iPopulation: 200, Elf: 89, "Half-Elf": 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Zindar": {iPopulation: 584, Human: 64, Halfling: 15, Elf: 12, Gnome: 8, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Zurbardor": {iPopulation: 1680, Human: 80, "Half-Elf": 9, Halfling: 8, Elf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "aViridistan(region)": ["Ambusead", "Anme Caphri", "Augge", "Braddol", "Caer Cadwen", "Calah", "Daican", "Drydale", "Eo Caves", "Erba Alba", 
        "Ezrahaddon", "Fanganbruc", "Feigh", "Gashmu", "Grimlon", "Hefaeland Cleft", "Horse Caverns", "Hyyap", "Jes", "Kahled", "Kevala", 
        "Leafork", "Midwall", "Millo Fortress", "Mishell", "Mislanta", "Moon Tower", "Munj", "Neapolis", "Nho", "Obsidian Citadel", "Oonsla", 
        "Ot Caves", "Pac Caves", "Pamak Illip", "Quickbog", "Quiff", "Raknid", "Ramarch", "Recre", "Rock Haven", "Ruppin Athuk", "Saimon", 
        "Shelter Haven", "Shir", "Shore Camp", "Silver Cove", "Smale", "Sputgar", "Stony Slip", "Stukwrak", "Sully", "Sunwatch", "Tak Shire", 
        "Targnol Port", "Tell Qa", "Trenth", "Ukrak Morfut", "Viridistan (settlement)", "Whan", "Yakin Ley", "Y'Dell", "Yrahm Jakupda"], 
    "Viridistan (region)": {iPopulation: 190407, Human: 70, Dwarf: 7, Elf: 6, "Half-Elf": 3, Halfling: 2, Caveman: 1, Gnome: 1, other: 10, sType: "region"}, 
    "Ambusead": {iPopulation: 168, Goblin: 94, Orc: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Anme Caphri": {iPopulation: 140, Human: 87, Elf: 8, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Augge": {iPopulation: 1400, Human: 79, Centaur: 15, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Braddol": {iPopulation: 1564, Human: 81, Dwarf: 6, Elf: 5, Gnome: 4, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Caer Cadwen": {iPopulation: 3064, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Calah": {iPopulation: 460, Gnome: 79, Dwarf: 10, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Daican": {iPopulation: 668, Human: 69, Dwarf: 15, Gnome: 10, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Drydale": {iPopulation: 128, Human: 89, Elf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Eo Caves": {iPopulation: 804, Caveman: 79, Human: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Erba Alba": {iPopulation: 268, Human: 78, Elf: 12, "Half-Elf": 5, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ezrahaddon": {iPopulation: 1080, Human: 79, Elf: 10, Gnome: 5, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Fanganbruc": {iPopulation: 880, Lizardfolk: 89, Human: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Feigh": {iPopulation: 332, Human: 69, Elf: 12, "Half-Elf": 6, Dwarf: 4, Gnome: 4, "Wild Men": 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Gashmu": {iPopulation: 960, Human: 83, Elf: 8, "Half-Elf": 4, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Grimlon": {iPopulation: 3960, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Hefaeland Cleft": {iPopulation: 1600, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Horse Caverns": {iPopulation: 800, Human: 90, Dwarf: 5, other: 5, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Hyyap": {iPopulation: 1376, Human: 84, Halfling: 10, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Jes": {iPopulation: 1004, Halfling: 94, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kahled": {iPopulation: 320, Elf: 89, Human: 5, Dwarf: 3, Gnome: 1, Halfling: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Kevala": {iPopulation: 636, Human: 89, Elf: 6, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Leafork": {iPopulation: 748, Human: 77, Elf: 18, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Midwall": {iPopulation: 300, Human: 79, Dwarf: 10, Elf: 10, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Millo Fortress": {iPopulation: 2040, Human: 79, Elf: 10, Dwarf: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mishell": {iPopulation: 432, Halfling: 94, Human: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Mislanta": {iPopulation: 1140, Human: 80, Elf: 7, Gnome: 5, Halfling: 4, Dwarf: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Moon Tower": {iPopulation: 420, Human: 89, Dwarf: 5, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Munj": {iPopulation: 708, Human: 84, Elf: 10, Gnome: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Neapolis": {iPopulation: 316, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Nho": {iPopulation: 1391, Human: 89, Dwarf: 4, Gnome: 3, Goblin: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Obsidian Citadel": {iPopulation: 1440, Orc: 39, Zombie: 30, "Cauldron-Born": 30, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Oonsla": {iPopulation: 1156, Human: 79, Orc: 10, Elf: 5, "Half-Orc": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ot Caves": {iPopulation: 1576, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Pac Caves": {iPopulation: 1692, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "compound"}, 
    "Pamak Illip": {iPopulation: 1528, Human: 84, Dwarf: 6, Gnome: 5, Halfling: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Quickbog": {iPopulation: 448, Human: 89, Elf: 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Quiff": {iPopulation: 640, Goblin: 93, Gnoll: 5, Ogre: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Raknid": {iPopulation: 644, Elf: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ramarch": {iPopulation: 1608, Human: 84, Halfling: 5, Elf: 5, "Hill Giant": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Recre": {iPopulation: 648, Human: 89, Gnome: 5, Halfling: 4, Elf: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Rock Haven": {iPopulation: 516, Elf: 89, "Half-Elf": 5, Halfling: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ruppin Athuk": {iPopulation: 1276, Human: 84, "Half-Orc": 15, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Saimon": {iPopulation: 1360, Human: 89, Halfling: 5, Elf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shelter Haven": {iPopulation: 840, Fey: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shir": {iPopulation: 272, Human: 94, Dwarf: 2, "Half-Elf": 1, Elf: 1, Gnome: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Shore Camp": {iPopulation: 1520, Caveman: 80, Human: 8, Dwarf: 2, other: 10, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Silver Cove": {iPopulation: 500, Human: 94, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Smale": {iPopulation: 340, Human: 79, Elf: 10, Halfling: 5, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sputgar": {iPopulation: 392, Human: 94, Dwarf: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Stony Slip": {iPopulation: 244, Human: 84, Elf: 10, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Stukwrak": {iPopulation: 836, Human: 84, Dwarf: 8, Gnome: 7, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sully": {iPopulation: 1108, Human: 78, Elf: 10, Halfling: 6, Dwarf: 4, other: 2, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Sunwatch": {iPopulation: 380, Human: 83, Dwarf: 5, Elf: 5, "Half-Orc": 3, "Half-Elf": 2, Gnome: 1, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tak Shire": {iPopulation: 2756, Human: 83, Elf: 11, Halfling: 3, Dwarf: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Targnol Port": {iPopulation: 11716, Human: 79, Dwarf: 9, Elf: 6, Gnome: 3, Halfling: 2, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Tell Qa": {iPopulation: 3300, Human: 74, Elf: 10, Dwarf: 6, Halfling: 5, Gnome: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Trenth": {iPopulation: 412, Human: 99, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Ukrak Morfut": {iPopulation: 196, Gnoll: 79, Troll: 20, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Viridistan (settlement)": {iPopulation: 120000, Human: 70, Dwarf: 10, Elf: 5, "Half-Elf": 5, other: 10, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Whan": {iPopulation: 80, Halfling: 89, Human: 6, Elf: 4, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Yakin Ley": {iPopulation: 372, "Hill Giant": 94, Ogre: 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Y'Dell": {iPopulation: 972, Human: 81, Elf: 11, Dwarf: 4, Halfling: 3, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"}, 
    "Yrahm Jakupda": {iPopulation: 532, Human: 79, Halfling: 10, Elf: 5, "Half-Elf": 5, other: 1, sSource: "Wilderlands of High Fantasy", sType: "settlement"},
    sType: "region"
};

oNIB.printCharacter = function() {
    var oCharacter = oNIB.oCharacter;
    var header = $('<p></p>')
        .attr('id', 'header')
        .text("--------------------Character--------------------");
    var sGender = oCharacter.sGender;
    var gender = $('<p></p>')
        .attr('id', 'gender')
        .text(("Gender: " + sGender));
    var sRace = oCharacter.sRace;
    var race = $('<p></p>')
        .attr('id', 'race')
        .text(("Race: " + sRace));
    var sClass = oCharacter.sClass;
    var characterClass = $('<p></p>')
        .attr('id', 'class')
        .text(("Class: " + sClass));
    var sAlignment = oCharacter.sAlignment;
    var alignment = $('<p></p>')
        .attr('id', 'alignment')
        .text(("Alignment: " + sAlignment));
    var sAge = oCharacter.sAge;
    var age = $('<p></p>')
        .attr('id', 'age')
        .text(("Age: " + sAge));
    var sHeight = oCharacter.sHeight;
    var height = $('<p></p>')
        .attr('id', 'height')
        .text(("Height: " + sHeight));
    var sTemperature = oCharacter.sTemperatureZone;
    var temperature = $('<p></p>')
        .attr('id', 'temperature')
        .text(("Temperature Zone: " + sTemperature));
    var sTerrain = oCharacter.sTerrain;
    var terrain = $('<p></p>')
        .attr('id', 'terrain')
        .text(("Terrain: " + sTerrain));
    var sCommunity = oCharacter.sCommunity;
    var community = $('<p></p>')
        .attr('id', 'community')
        .text(("Community: " + sCommunity));
    var sEconomics = oCharacter.sFamilyEconomicStatus;
    var economics = $('<p></p>')
        .attr('id', 'economics')
        .text(("Family Economic Status: " + sEconomics));
    var sStanding = oCharacter.sFamilySocialStanding;
    var standing = $('<p></p>')
        .attr('id', 'standing')
        .text(("Family Social Standing: " + sStanding));
    var sDefense = oCharacter.sFamilyDefenseReadiness;
    var defense = $('<p></p>')
        .attr('id', 'defense')
        .text(("Family Defense Readiness: " + sDefense));
    var sPrivate = oCharacter.sFamilyPrivateEthics;
    var privateEthics = $('<p></p>')
        .attr('id', 'private')
        .text(("Family Private Ethics: " + sPrivate));
    var sPublic = oCharacter.sFamilyPublicEthics;
    var publicEthics = $('<p></p>')
        .attr('id', 'public')
        .text(("Family Public Ethics: " + sPublic));
    var sReligion = oCharacter.sFamilyReligiousCommitment;
    var religion = $('<p></p>')
        .attr('id', 'religion')
        .text(("Family Religious Commitment: " + sReligion));
    var sReputation = oCharacter.sFamilyReputation;
    var reputation = $('<p></p>')
        .attr('id', 'reputation')
        .text(("Family Reputation: " + sReputation));
    var sPolitics = oCharacter.sFamilyPoliticalViews;
    var politics = $('<p></p>')
        .attr('id', 'politics')
        .text(("Family Political Views: " + sPolitics));
    var sPower = oCharacter.sFamilyPowerStructure;
    var power = $('<p></p>')
        .attr('id', 'power')
        .text(("Family Power Structure: " + sPower));
    var sAncestors = oCharacter.sAncestorsOfNote;
    var ancestors = $('<p></p>')
        .attr('id', 'ancestors')
        .text(("Ancestors of Note: " + sAncestors));
    var sInstruction = oCharacter.sEarlyChildhoodInstruction;
    var instruction = $('<p></p>')
        .attr('id', 'instruction')
        .text(("Early Childhood Instruction: " + sInstruction));
    var sEducation = oCharacter.sFormalEducation;
    var education = $('<p></p>')
        .attr('id', 'education')
        .text(("Formal Education: " + sEducation));
    var sTrade = oCharacter.sLearningATrade;
    var trade = $('<p></p>')
        .attr('id', 'trade')
        .text(("Learning a Trade: " + sTrade));
    var sChildhood = oCharacter.sEarlyChildhoodEvents;
    var childhood = $('<p></p>')
        .attr('id', 'childhood')
        .text(("Early Childhood Events: " + sChildhood));
    var sYouth = oCharacter.sYouthEvents;
    var youth = $('<p></p>')
        .attr('id', 'youth')
        .text(("Youth Events: " + sYouth));
    var sPivotal = oCharacter.sPivotalEvents;
    var pivotal = $('<p></p>')
        .attr('id', 'pivotal')
        .text(("Pivotal Events: " + sPivotal));
    var sParents = oCharacter.sParents;
    var parents = $('<p></p>')
        .attr('id', 'parents')
        .text(("Parents: " + sParents));
    var sSiblings = oCharacter.sSiblings;
    var siblings = $('<p></p>')
        .attr('id', 'siblings')
        .text(("Siblings: " + sSiblings));
    var sGrandparents = oCharacter.sGrandparents;
    var grandparents = $('<p></p>')
        .attr('id', 'grandparents')
        .text(("Grandparents: " + sGrandparents));
    var sFamily = oCharacter.sExtendedFamily;
    var family = $('<p></p>')
        .attr('id', 'family')
        .text(("Extended Family: " + sFamily));
    var sFriends = oCharacter.sFriends;
    var friends = $('<p></p>')
        .attr('id', 'friends')
        .text(("Friends: " + sFriends));
    var sEnemies = oCharacter.sEnemies;
    var enemies = $('<p></p>')
        .attr('id', 'enemie')
        .text(("Enemies: " + sEnemies));
    var sInstructors = oCharacter.sInstructors;
    var instructors = $('<p></p>')
        .attr('id', 'instructors')
        .text(("Instructors: " + sInstructors));
    var sArchetype = oCharacter.sArchetype;
    var archetype = $('<p></p>')
        .attr('id', 'archetype')
        .text(("Personality Archetype: " + sArchetype));
    var sTraits = oCharacter.sPersonalityTraits;
    var traits = $('<p></p>')
        .attr('id', 'traits')
        .text(("Personality Traits: " + sTraits));
    var character = $("#character")
        .append(header)
        .append(gender)
        .append(race)
        .append(characterClass)
        .append(alignment)
        .append(age)
        .append(height)
        .append(temperature)
        .append(terrain)
        .append(community)
        .append(economics)
        .append(standing)
        .append(defense)
        .append(privateEthics)
        .append(publicEthics)
        .append(religion)
        .append(reputation)
        .append(politics)
        .append(power)
        .append(ancestors)
        .append(instruction)
        .append(education)
        .append(trade)
        .append(childhood)
        .append(youth)
        .append(pivotal)
        .append(parents)
        .append(siblings)
        .append(grandparents)
        .append(family)
        .append(friends)
        .append(enemies)
        .append(instructors)
        .append(archetype)
        .append(traits);
};

oNIB.roll = function(iDie, iNumber = 1) {
    var iRoll = 0;
    while (iNumber > 0) {
        iRoll += Math.round(Math.random() * (iDie - 1)) + 1;
        iNumber--;
    }
    return iRoll;
};

oNIB.testObject = function(oObject) {
    var aProperties = Object.keys(oObject);
    for (var o = 0; o < aProperties.length; o++) {
        var sProperty = aProperties[o];
        if (sProperty[0] !== "a" && sProperty[0] !== "s") {
            var oDictionary = oObject[sProperty];
            var aKeys = Object.keys(oDictionary);
            var iPercent = 0;
            for (var k = 0; k < aKeys.length; k++) {
                var sKey = aKeys[k];
                if (sKey !== "sSource" && sKey !== "sType" && sKey !== "iPopulation") {
                    iPercent += oDictionary[sKey];
                }
            }
            if (iPercent !== 100) {
                console.log(sProperty, iPercent);
            }
            if (aKeys.length > 0) {
                if (aKeys.indexOf("sSource") === -1) {
                    console.log(sProperty, "sSource");
                }
                if (aKeys.indexOf("sType") === -1) {
                    console.log(sProperty, "sType");
                }
            }
        }
    }
};

oNIB.testSetting = function(sSetting) {
    var oSetting = oNIB.oSettings[sSetting];
    var aSettingProperties = Object.keys(oSetting);
    var iSubregions = oNIB.totalPopulation(oSetting, aSettingProperties, sSetting, true);
    var iRatio = oNIB.iDefined / oNIB.iUndefined;
    console.log("Defined:", oNIB.iDefined, "Undefined:", oNIB.iUndefined, "Ratio:", iRatio);
};

oNIB.totalPopulation = function(oSetting, aSettingProperties, sRegion, bWorld) {
    if (bWorld === false) {
        var oRegion = oSetting[sRegion];
    } else {
        var oRegion = oSetting;
    }
    var sType = oRegion.sType;
    if (sType === "region") {
        var sArray = "a" + sRegion.replace(/ /g, "");
        if (aSettingProperties.indexOf(sArray) !== -1) {
            var aArray = oSetting[sArray];
            var aProperties = Object.keys(oRegion);
            var iPopulation = 0;
            if (aProperties.indexOf("iPopulation") !== -1) {
                iPopulation = oRegion.iPopulation;
            }
            var iSubregions = 0;
            for (var r = 0; r < aArray.length; r++) {
                var sObject = aArray[r];
                console.log(sObject);
                var oObject = oSetting[sObject];
                aProperties = Object.keys(oObject);
                var iSubpopulation = 0;
                if (aProperties.indexOf("iPopulation") !== -1) {
                    iSubpopulation = oObject.iPopulation;
                    if (sObject.indexOf("(undefined)") !== -1) {
                        oNIB.iUndefined += iSubpopulation;
                        oNIB.iDefined += iPopulation;
                    }
                }
                iSubregions += iSubpopulation
                var iSubregionsTwo = oNIB.totalPopulation(oSetting, aSettingProperties, sObject, false);
            }
            console.log(sRegion, iPopulation, "subregions", iSubregions);
            if (iPopulation !== 0 && iSubregions > iPopulation) {
                console.log(sRegion, iPopulation, "subregions", iSubregions);
            }
            if (iPopulation !== 0 && iSubregions < iPopulation) {
                var iDifference = iPopulation - iSubregions;
                console.log('"' + sRegion + ' (undefined)": {iPopulation: ' + iDifference + ', sType: "undefined"}');
            }
            return iSubregions;
        }
    }
};

oNIB.addMainEventListeners();
