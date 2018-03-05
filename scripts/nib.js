//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later

"use strict";
var oNIB = {};

oNIB.addNeutralEthics = function(sMorals) {
    if (sMorals === "Neutral") {
        oNIB.oCharacter.sAlignment = "True Neutral";
    } else {
        oNIB.oCharacter.sAlignment = "Neutral " + sMorals;
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
    var iRoll = oNIB.roll(85);
    if (iRoll < 66) {
        iRoll = oNIB.roll(aCommonArchetypes.length);
        iRoll--;
        oCharacter.sArchetype = aCommonArchetypes[iRoll];
    } else {
        var aAllArchetypes = oArchetypes["aAll"];
        var aUncommonArchetypes = [];
        for (var a = 0; a < aAllArchetypes.length; a++) {
            var sArchetype = aAllArchetypes[a];
            if (aCommonArchetypes.indexOf(sArchetype) === -1) {
                aUncommonArchetypes.push(sArchetype);
            }
        }
        iRoll = oNIB.roll(aUncommonArchetypes.length);
        iRoll--;
        oCharacter.sArchetype = aUncommonArchetypes[iRoll];
    }
};

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
    oCharacter.sClass = sClass;
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

oNIB.createEarlyChildhoodInstruction = function() {
    var iRoll = oNIB.roll(100)
    var oCharacter = oNIB.oCharacter
    if (iRoll < 21) {
        oCharacter.sEarlyChildhoodInstruction = "Outdoors";
    } else if (iRoll < 41) {
        oCharacter.sEarlyChildhoodInstruction = "Book Learning";
    } else if (iRoll < 56) {
        oCharacter.sEarlyChildhoodInstruction = "Religious";
    } else if (iRoll < 66) {
        oCharacter.sEarlyChildhoodInstruction = "Language";
    } else if (iRoll < 76) {
        oCharacter.sEarlyChildhoodInstruction = "Arts";
    } else if (iRoll < 86) {
        oCharacter.sEarlyChildhoodInstruction = "Multicultural";
    } else if (iRoll < 96) {
        oCharacter.sEarlyChildhoodInstruction = "Business/Politics";
    } else {
        oCharacter.sEarlyChildhoodInstruction = "Magic";
    }
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

oNIB.createFormalEducation = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    if (iRoll < 26) {
        oCharacter.sFormalEducation = "Agriculture";
    } else if (iRoll < 31) {
        oCharacter.sFormalEducation = "History";
    } else if (iRoll < 36) {
        oCharacter.sFormalEducation = "Politics";
    } else if (iRoll < 41) {
        oCharacter.sFormalEducation = "Religion";
    } else if (iRoll < 46) {
        oCharacter.sFormalEducation = "Natural History";
    } else if (iRoll < 51) {
        oCharacter.sFormalEducation = "Multicultural";
    } else if (iRoll < 56) {
        oCharacter.sFormalEducation = "Arts";
    } else if (iRoll < 61) {
        oCharacter.sFormalEducation = "Literature";
    } else if (iRoll < 66) {
        oCharacter.sFormalEducation = "Math";
    } else if (iRoll < 71) {
        oCharacter.sFormalEducation = "Advanced Math";
    } else if (iRoll < 76) {
        oCharacter.sFormalEducation = "Astronomy";
    } else if (iRoll < 86) {
        oCharacter.sFormalEducation = "Finishing School";
    } else if (iRoll < 96) {
        oCharacter.sFormalEducation = "School of Hard Knocks";
    } else {
        oCharacter.sFormalEducation = "Magic";
    }
};

oNIB.createGender = function() {
    var iRoll = oNIB.roll(4);
    if (iRoll < 3) {
        oNIB.oCharacter.sGender = "Female";
    } else {
        oNIB.oCharacter.sGender = "Male";
    }
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

oNIB.createLearningATrade = function() {
    var iRoll = oNIB.roll(100);
    var oCharacter = oNIB.oCharacter;
    if (iRoll < 21) {
        oCharacter.sLearningATrade = "Farmer";
    } else if (iRoll < 31) {
        oCharacter.sLearningATrade = "Hunter/Trapper";
    } else if (iRoll < 41) {
        oCharacter.sLearningATrade = "Craft";
    } else if (iRoll < 51) {
        oCharacter.sLearningATrade = "Religious";
    } else if (iRoll < 61) {
        oCharacter.sLearningATrade = "Politics";
    } else if (iRoll < 71) {
        oCharacter.sLearningATrade = "Healing";
    } else if (iRoll < 76) {
        oCharacter.sLearningATrade = "Specialized";
    } else if (iRoll < 86) {
        oCharacter.sLearningATrade = "Military Training";
    } else if (iRoll < 91) {
        oCharacter.sLearningATrade = "Specialized Military Training";
    } else if (iRoll < 96) {
        oCharacter.sLearningATrade = "Monastery/Knightly Order";
    } else {
        oCharacter.sLearningATrade = "Arcanist";
    }
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
    oNIB.oCharacter.sAlignment = sMorals;
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

oNIB.createRace = function() {
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

oNIB.createSpecialistWizard = function() {
    var oCharacter = oNIB.oCharacter;
    var sAlignment = oCharacter.sAlignment;
    var iRoll = oNIB.roll(100);
    if (sAlignment === "Lawful Good") {
        if (iRoll < 52) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 54) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 69) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 73) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 85) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 89) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 97) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    } else if (sAlignment === "Lawful Neutral") {
        if (iRoll < 18) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 23) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 71) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 75) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 89) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 93) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 97) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    } else if (sAlignment === "Lawful Evil") {
        if (iRoll < 12) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 18) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 38) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 43) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 59) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 64) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 96) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    } else if (sAlignment === "Neutral Good") {
        if (iRoll < 24) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 31) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 38) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 49) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 67) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 78) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 90) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    } else if (sAlignment === "True Neutral") {
        if (iRoll < 8) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 22) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 42) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 54) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 73) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 84) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 90) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    } else if (sAlignment === "Neutral Evil") {
        if (iRoll < 4) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 16) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 22) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 32) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 48) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 58) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 91) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    } else if (sAlignment === "Chaotic Good") {
        if (iRoll < 8) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 20) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 22) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 43) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 53) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 74) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 80) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    } else if (sAlignment === "Chaotic Neutral") {
        if (iRoll < 3) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 26) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 32) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 51) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 60) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 79) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 82) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    } else {
        if (iRoll < 2) {
            oCharacter.sClass = "Abjurer";
        } else if (iRoll < 23) {
            oCharacter.sClass = "Conjurer";
        } else if (iRoll < 25) {
            oCharacter.sClass = "Diviner";
        } else if (iRoll < 42) {
            oCharacter.sClass = "Enchanter";
        } else if (iRoll < 50) {
            oCharacter.sClass = "Evoker";
        } else if (iRoll < 67) {
            oCharacter.sClass = "Illusionist";
        } else if (iRoll < 84) {
            oCharacter.sClass = "Necromancer";
        } else {
            oCharacter.sClass = "Transmuter";
        }
    }
};

oNIB.oCharacter = {};

oNIB.printCharacter = function() {
    var oCharacter = oNIB.oCharacter;
    var sGender = oCharacter.sGender;
    var gender = $("<p></p>")
        .attr('id', 'gender')
        .text(("Gender: " + sGender));
    var sRace = oCharacter.sRace;
    var race = $("<p></p>")
        .attr('id', 'race')
        .text(("Race: " + sRace));
    var sClass = oCharacter.sClass;
    var characterClass = $("<p></p>")
        .attr('id', 'class')
        .text(("Class: " + sClass));
    var sAlignment = oCharacter.sAlignment;
    var alignment = $("<p></p>")
        .attr('id', 'alignment')
        .text(("Alignment: " + sAlignment));
    var sAge = oCharacter.sAge;
    var age = $("<p></p>")
        .attr('id', 'age')
        .text(("Age: " + sAge));
    var sHeight = oCharacter.sHeight;
    var height = $("<p></p>")
        .attr('id', 'height')
        .text(("Height: " + sHeight));
    var sInstruction = oCharacter.sEarlyChildhoodInstruction;
    var instruction = $("<p></p>")
        .attr('id', 'instruction')
        .text(("Early Childhood Instruction: " + sInstruction));
    var sEducation = oCharacter.sFormalEducation;
    var education = $("<p></p>")
        .attr('id', 'education')
        .text(("Formal Education: " + sEducation));
    var sTrade = oCharacter.sLearningATrade;
    var trade = $("<p></p>")
        .attr('id', 'trade')
        .text(("Learning a Trade: " + sTrade));
    var sArchetype = oCharacter.sArchetype;
    var archetype = $("<p></p>")
        .attr('id', 'archetype')
        .text(("Archetype: " + sArchetype));
    var sTraits = oCharacter.sPersonalityTraits;
    var traits = $("<p></p>")
        .attr('id', 'traits')
        .text(("Personality Traits: " + sTraits));
    var body = $("#body")
        .append(gender)
        .append(race)
        .append(characterClass)
        .append(alignment)
        .append(age)
        .append(height)
        .append(instruction)
        .append(education)
        .append(trade)
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

oNIB.createGender();
oNIB.createMorals();
oNIB.createClass();
oNIB.createRace();
oNIB.createEthics();
oNIB.createAge();
oNIB.createHeight();
oNIB.createEarlyChildhoodInstruction();
oNIB.createFormalEducation();
oNIB.createLearningATrade();
oNIB.createArchetype();
oNIB.createPersonalityTraits();
oNIB.printCharacter();
