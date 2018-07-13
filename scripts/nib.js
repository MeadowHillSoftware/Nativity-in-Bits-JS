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
    $('#kalamar')
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

oNIB.createBrandobianCommunity = function(sRace) {
    var iRoll = oNIB.roll(10000);
    var sSuffix = "(Brandobia)";
    var sRegion = "";
    var sSettlement = "";
    var sCommunity = "";
    if (sRace === "Dwarf") {
        if (iRoll < 1734) {
            sRegion = "Cosdol";
            if (iRoll < 863) {
                sSettlement = "Napalago Hills";
            } else {
                sSettlement = "Odril Hills";
            }
        } else if (iRoll < 1810) {
            sRegion = "Eldor";
            if (iRoll < 1735) {
                sSettlement = "Inolen";
            } else if (iRoll < 1750) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1759) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 1792) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3913) {
            sRegion = "Elenon Mountains";
            if (iRoll < 2862) {
                sSettlement = "Welpremond Downs";
            } else {
                sSettlement = "Lendelwood";
            }
        } else if (iRoll < 5877) {
            sRegion = "Mendarn";
            if (iRoll < 3925) {
                sSettlement = "Breven";
            } else if (iRoll < 3932) {
                sSettlement = "Dayolen";
            } else if (iRoll < 5758) {
                sSettlement = "Dopromond Hills";
            } else {
                sSettlement = "Narnolen";
            }
        } else if (iRoll < 9210) {
            sRegion = "Pel Brolenon";
            if (iRoll < 6202) {
                sSettlement = "Dowon-Brandel";
            } else if (iRoll < 7381) {
                sSettlement = "Vrendolen";
            } else if (iRoll < 8923) {
                sSettlement = "Yan Elenon Mountains";
            } else if (iRoll < 9034) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9072) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9096) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9481) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace);
        } else if (iRoll < 9537) {
            sCommunity = oNIB.createReanaarianCommunity(sRace);
        } else if (iRoll < 9810) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace);
        } else if (iRoll < 9938) {
            sCommunity = oNIB.createWildLandsCommunity(sRace);
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace);
        }
    } else if (sRace === "Elf") {
        if (iRoll < 2476) {
            sRegion = "Cosdol";
            if (iRoll < 39) {
                sSettlement = "Almven";
            } else if (iRoll < 177) {
                sSettlement = "Cosolen";
            } else if (iRoll < 241) {
                sSettlement = "Crandolen";
            } else if (iRoll < 251) {
                sSettlement = "Dorndern";
            } else if (iRoll < 268) {
                sSettlement = "Napalido";
            } else if (iRoll < 738) {
                sSettlement = "Napalago Hills";
            } else if (iRoll < 1672) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2386) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2473) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 2665) {
            sRegion = "Eldor";
            if (iRoll < 2655) {
                sSettlement = "Brolador Forest";
            } else if (iRoll < 2656) {
                sSettlement = "Inolen";
            } else if (iRoll < 2661) {
                sSettlement = "Unvolen";
            } else if (iRoll < 2662) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2663) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2664) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8016) {
            sRegion = "Elenon Mountains";
            if (iRoll < 3625) {
                sSettlement = "Welpromond Downs";
            } else if (iRoll < 4586) {
                sSettlement = "Lendelwood";
            } else if (iRoll < 4729) {
                sSettlement = "Lathlanian";
            } else if (iRoll < 6400) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7195) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7351) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8281) {
            sRegion = "Mendarn";
            if (iRoll < 8224) {
                sSettlement = "Crondor Woods";
            } else if (iRoll < 8227) {
                sSettlement = "Dayolen";
            } else if (iRoll < 8228) {
                sSettlement = "Narnolen";
            } else {
                sSettlement = "Ospolen";
            }
        } else if (iRoll < 8740) {
            sRegion = "Pel Brolenon";
            if (iRoll < 8375) {
                sSettlement = "Dowon-Brandel";
            } else if (iRoll < 8526) {
                sSettlement = "Eldrose Forest";
            } else if (iRoll < 8586) {
                sSettlement = "Yan Elonen Mountains";
            } else if (iRoll < 8646) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8666) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8679) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9878) {
            sRegion = "Voldorwood";
            if (iRoll < 9475) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9825) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9845) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9908) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace);
        } else if (iRoll < 9909) {
            sCommunity = oNIB.createReanaarianCommunity(sRace);
        } else if (iRoll < 9917) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace);
        } else if (iRoll < 9918) {
            sCommunity = oNIB.createWildLandsCommunity(sRace);
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace);
        }
    } else if (sRace === "Gnome") {
        if (iRoll < 929) {
            sRegion = "Cosdol";
            if (iRoll < 497) {
                sSettlement = "Napalago Hills";
            } else {
                sSettlement = "Odril Hills";
            }
        } else if (iRoll < 980) {
            sRegion = "Eldor";
            if (iRoll < 966) {
                sSettlement = "Inolen";
            } else if (iRoll < 967) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 970) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 971) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 2442) {
            sRegion = "Mendarn";
            if (iRoll < 1007) {
                sSettlement = "Breven";
            } else if (iRoll < 1010) {
                sSettlement = "Dayolen";
            } else if (iRoll < 2354) {
                sSettlement = "Dopromond Hills";
            } else if (iRoll < 2355) {
                sSettlement = "Narlven";
            } else if (iRoll < 2417) {
                sSettlement = "Narnolen";
            } else {
                sSettlement = "Ospolen";
            }
        } else if (iRoll < 9710) {
            sRegion = "Pel Brolenon";
            if (iRoll < 2609) {
                sSettlement = "Dowon-Brandel";
            } else if (iRoll < 2688) {
                sSettlement = "Eldrose Forest";
            } else if (iRoll < 4520) {
                sSettlement = "Vrendolen";
            } else if (iRoll < 9464) {
                sSettlement = "Yan Elenon Mountains";
            } else if (iRoll < 9559) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9592) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9613) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9711) {
            sRegion = "Voldorwood";
            sSettlement = "Rural Thorp";
        } else if (iRoll < 9755) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace);
        } else if (iRoll < 9799) {
            sCommunity = oNIB.createReanaarianCommunity(sRace);
        } else if (iRoll < 9874) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace);
        } else if (iRoll < 9903) {
            sCommunity = oNIB.createWildLandsCommunity(sRace);
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace);
        }
    } else if (sRace === "Half-Elf") {
        if (iRoll < 5768) {
            sRegion = "Cosdol";
            if (iRoll < 40) {
                sSettlement = "Almven";
            } else if (iRoll < 424) {
                sSettlement = "Cosolen";
            } else if (iRoll < 603) {
                sSettlement = "Crandolen";
            } else if (iRoll < 630) {
                sSettlement = "Dorndern";
            } else if (iRoll < 678) {
                sSettlement = "Napalido";
            } else if (iRoll < 3426) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5463) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 5753) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 5895) {
            sRegion = "Eldor";
            if (iRoll < 5843) {
                sSettlement = "Brolador Forest";
            } else if (iRoll < 5844) {
                sSettlement = "Inolen";
            } else if (iRoll < 5861) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5863) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 5864) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7714) {
            sRegion = "Elenon Mountains";
            if (iRoll < 6264) {
                sSettlement = "Welpremond Downs";
            } else if (iRoll < 6632) {
                sSettlement = "Lendelwood";
            } else  if (iRoll < 6663) {
                sSettlement = "Lathlanian";
            } else if (iRoll < 7290) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7540) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7589) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7743) {
            sRegion = "Mendarn";
            if (iRoll < 7735) {
                sSettlement = "Crondor Woods";
            } else if (iRoll < 7736) {
                sSettlement = "Dayolen";
            } else if (iRoll < 7737) {
                sSettlement = "Narnolen";
            } else if (iRoll < 7738) {
                sSettlement = "Ospolen";
            } else if (iRoll < 7740) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7741) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7742) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9846) {
            sRegion = "Pel Brolenon";
            if (iRoll < 7900) {
                sSettlement = "Dowon-Brandel";
            } else if (iRoll < 8224) {
                sSettlement = "Eldrose Forest";
            } else if (iRoll < 8682) {
                sSettlement = "Vrendolen";
            } else if (iRoll < 8773) {
                sSettlement = "Yan Elenon Mountains";
            } else if (iRoll < 9108) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9305) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9398) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9972) {
            sRegion = "Voldorwood";
            if (iRoll < 9846) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9912) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9944) {
                sSettlement = "Minor Town";
            } {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9988) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace);
        } else if (iRoll < 9990) {
            sCommunity = oNIB.createReanaarianCommunity(sRace);
        } else if (iRoll < 9991) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace);
        } else if (iRoll < 9992) {
            sCommunity = oNIB.createWildLandsCommunity(sRace);
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace);
        }
    } else if (sRace === "Halfling") {
        if (iRoll < 100) {
            sRegion = "Cosdol";
            if (iRoll < 51) {
                sSettlement = "Napalago Hills";
            } else {
                sSettlement = "Odril Hills";
            }
        } else if (iRoll < 124) {
            sRegion = "Eldor";
            if (iRoll < 112) {
                sSettlement = "Brolador Forest";
            } else if (iRoll < 117) {
                sSettlement = "Inolen";
            } else if (iRoll < 118) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 119) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 120) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6475) {
            sRegion = "Elenon Mountains";
            if (iRoll < 3200) {
                sSettlement = "Welpremond Downs";
            } else if (iRoll < 6276) {
                sSettlement = "Lendelwood";
            } else if (iRoll < 6376) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6426) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6451) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9026) {
            sRegion = "Mendarn";
            if (iRoll < 6476) {
                sSettlement = "Breven";
            } else if (iRoll < 6479) {
                sSettlement = "Crondor Woods";
            } else if (iRoll < 6481) {
                sSettlement = "Dayolen";
            } else if (iRoll < 6482) {
                sSettlement = "Dopromond Hills";
            } else if (iRoll < 6484) {
                sSettlement = "Narlven";
            } else if (iRoll < 6491) {
                sSettlement = "Ospolen";
            } else if (iRoll < 6500) {
                sSettlement = "Yelden";
            } else if (iRoll < 7867) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8880) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9024) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9906) {
            sRegion = "Pel Brolenon";
            if (iRoll < 9139) {
                sSettlement = "Dowon-Brandel";
            } else if (iRoll < 9233) {
                sSettlement = "Eldrose Forest";
            } else if (iRoll < 9463) {
                sSettlement = "Vrendolen";
            } else if (iRoll < 9511) {
                sSettlement = "Yan Elenon Mountains";
            } else if (iRoll < 9634) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9707) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9741) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9924) {
            sRegion = "Voldorwood";
            if (iRoll < 9916) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9920) {
                sSettlement = "Rual Hamlet";
            } else if (iRoll < 9922) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9950) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace);
        } else if (iRoll < 9951) {
            sCommunity = oNIB.createReanaarianCommunity(sRace);
        } else if (iRoll < 9955) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace);
        } else if (iRoll < 9967) {
            sCommunity = oNIB.createWildLandsCommunity(sRace);
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace);
        }
    } else if (sRace === "Half-Orc") {
        if (iRoll < 864) {
            sRegion = "Cosdol";
            if (iRoll < 41) {
                sSettlement = "Dorndern";
            } else if (iRoll < 378) {
                sSettlement = "Odril Hills";
            } else if (iRoll < 722) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 821) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 850) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 1211) {
            sRegion = "Elenon Mountains";
            sSettlement = "Krond Heights";
        } else if (iRoll < 9439) {
            sRegion = "Pel Brolenon";
            if (iRoll < 2016) {
                sSettlement = "Dowon-Brandel";
            } else if (iRoll < 2181) {
                sSettlement = "Vrendolen";
            } else if (iRoll < 8248) {
                sSettlement = "Yan Elenon Mountains";
            } else if (iRoll < 8620) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8839) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8942) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9568) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace);
        } else if (iRoll < 9576) {
            sCommunity = oNIB.createReanaarianCommunity(sRace);
        } else if (iRoll < 9652) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace);
        } else if (iRoll < 9675) {
            sCommunity = oNIB.createWildLandsCommunity(sRace);
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace);
        }
    } else {
        if (iRoll < 587) {
            sRegion = "Cosdol";
            if (iRoll < 2) {
                sSettlement = "Almven";
            } else if (iRoll < 41) {
                sSettlement = "Cosolen";
            } else if (iRoll < 59) {
                sSettlement = "Crandolen";
            } else if (iRoll < 62) {
                sSettlement = "Dorndern";
            } else if (iRoll < 67) {
                sSettlement = "Napalido";
            } else if (iRoll < 348) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 555) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 585) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6193) {
            sRegion = "Eldor";
            if (iRoll < 598) {
                sSettlement = "Andven";
            } else if (iRoll < 607) {
                sSettlement = "Bronven";
            } else if (iRoll < 818) {
                sSettlement = "Dalen";
            } else if (iRoll < 824) {
                sSettlement = "Dralven";
            } else if (iRoll < 875) {
                sSettlement = "Inolen";
            } else if (iRoll < 917) {
                sSettlement = "Nordolen";
            } else if (iRoll < 938) {
                sSettlement = "Premolen";
            } else if (iRoll < 957) {
                sSettlement = "Randolen";
            } else if (iRoll < 963) {
                sSettlement = "Ranven";
            } else if (iRoll < 985) {
                sSettlement = "Unvolen";
            } else if (iRoll < 3798) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5883) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6180) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6224) {
            sRegion = "Elenon Mountains";
            if (iRoll < 6194) {
                sSettlement = "Welpremond Downs";
            } else if (iRoll < 6198) {
                sSettlement = "Lendelwood";
            } else if (iRoll < 6199) {
                sSettlement = "Lathlanian";
            } else if (iRoll < 6212) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6218) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6221) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8329) {
            sRegion = "Mendarn";
            if (iRoll < 6234) {
                sSettlement = "Breven";
            } else if (iRoll < 6235) {
                sSettlement = "Crondor Woods";
            } else if (iRoll < 6264) {
                sSettlement = "Dayolen";
            } else if (iRoll < 6272) {
                sSettlement = "Dopven";
            } else if (iRoll < 6273) {
                sSettlement = "Dopromond Hills";
            } else if (iRoll < 6282) {
                sSettlement = "Narlven";
            } else if (iRoll < 6298) {
                sSettlement = "Narnolen";
            } else if (iRoll < 6387) {
                sSettlement = "Ospolen";
            } else if (iRoll < 6390) {
                sSettlement = "Yelden";
            } else if (iRoll < 7437) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8212) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8323) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9778) {
            sRegion = "Pel Brolenon";
            if (iRoll < 8451) {
                sSettlement = "Dowon-Brandel";
            } else if (iRoll < 8453) {
                sSettlement = "Eldrose Forest";
            } else if (iRoll < 8479) {
                sSettlement = "Vrendolen";
            } else if (iRoll < 8480) {
                sSettlement = "Yan Elenon Mountains";
            } else if (iRoll < 9098) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9508) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9553) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9783) {
            sRegion = "Voldorwood";
            if (iRoll < 9780) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9781) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9782) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9885) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace);
        } else if (iRoll < 9887) {
            sCommunity = oNIB.createReanaarianCommunity(sRace);
        } else if (iRoll < 9954) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace);
        } else if (iRoll < 9972) {
            sCommunity = oNIB.createWildLandsCommunity(sRace);
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace);
        }
    }
    if (sCommunity === "") {
        sCommunity = sSettlement + " (" + sRegion + ") " + sSuffix;
    }
    return sCommunity;
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
        "greyhawk", "jakandor", "kalamar", "lankhmar", "mahasarpa", 
        "mystara", "pelinore", "planescape", "ravenloft", "rokugan", 
        "spelljammer", "warcraft", "wilderlands"];
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
        } else if (sChecked === "kalamar") {
            oNIB.createKalamaranCommunity();
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
        } else if (sChecked === "rokugan") {
            oNIB.getSpecificCommunity("Rokugan");
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

oNIB.createKalamaranCommunity = function() {
    var iRoll = oNIB.roll(6);
    var sTable = "";
    var oCharacter = oNIB.oCharacter;
    var sCommunity = "";
    var sRace = oCharacter.sRace;
    if (iRoll === 1) {
        sCommunity = oNIB.createBrandobianCommunity(sRace);
    } else if (iRoll === 2) {
        sCommunity = oNIB.createKalamaranEmpireCommunity(sRace);
    } else if (iRoll === 3) {
        sCommunity = oNIB.createReanaarianCommunity(sRace);
    } else if (iRoll === 4) {
        sCommunity = oNIB.createSvimozhishianCommunity(sRace);
    } else if (iRoll === 5) {
        sCommunity = oNIB.createWildLandsCommunity(sRace);
    } else {
        sCommunity = oNIB.createYoungKingdomsCommunity(sRace);
    }
    console.log(sCommunity);
    oCharacter.sCommunity = sCommunity;
};

oNIB.createKalamaranEmpireCommunity = function(sRace) {
    var iRoll = oNIB.roll(10000);
    var sSuffix = "(Kalamaran Empire)";
    var sRegion = "";
    var sSettlement = "";
    var sCommunity = "";
    if (sRace === "Dwarf") {
        if (iRoll < 30) {
            sRegion = "Basir";
            if (iRoll < 2) {
                sSettlement = "Bet Urala";
            } else {
                sSettlement = "Ubikokeli Highlands";
            }
        } else if (iRoll < 164) {
            sRegion = "Dodera";
            sSettlement = "Kakidela Mountains";
        } else if (iRoll < 8530) {
            sRegion = "Kalamar";
            if (iRoll < 237) {
                sSettlement = "Alufalik Hills";
            } else if (iRoll < 460) {
                sSettlement = "Bet Kalamar";
            } else if (iRoll < 7851) {
                sSettlement = "Ka'Asa Mountains";
            } else if (iRoll < 8388) {
                sSettlement = "Karasta";
            } else if (iRoll < 8450) {
                sSettlement = "Katagas Rise";
            } else if (iRoll < 8526) {
                sSettlement = "P'Sapas Hills";
            } else if (iRoll < 8529) {
                sSettlement = "Rosaleta";
            } else {
                sSettlement = "Segeleta";
            }
        } else if (iRoll < 8671) {
            sRegion = "O'par";
            if (iRoll < 8543) {
                sSettlement = "Bet Birelli";
            } else if (iRoll < 8567) {
                sSettlement = "Tagaleta";
            } else if (iRoll < 8589) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8610) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8670) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9025) {
            sRegion = "Pekal";
            if (iRoll < 8690) {
                sSettlement = "Baneta";
            } else if (iRoll < 8879) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9005) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9024) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9820) {
            sRegion = "Tarisato";
            if (iRoll < 9027) {
                sSettlement = "Balelido";
            } else if (iRoll < 9032) {
                sSettlement = "Gimbatagh";
            } else if (iRoll < 9037) {
                sSettlement = "Gogido";
            } else if (iRoll < 9038) {
                sSettlement = "Oloseta";
            } else if (iRoll < 9785) {
                sSettlement = "P'Rorul Peaks";
            } else if (iRoll < 9819) {
                sSettlement = "P'Tikor Hills";
            } else {
                sSettlement = "Pagalido";
            }
        } else if (iRoll < 9827) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9847) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9897) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9990) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Elf") {
        if (iRoll < 268) {
            sRegion = "Basir";
            if (iRoll < 224) {
                sSettlement = "Bet Urala";
            } else if (iRoll < 244) {
                sSettlement = "Birirelido";
            } else if (iRoll < 255) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 266) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 267) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 343) {
            sRegion = "Dodera";
            if (iRoll < 271) {
                sSettlement = "Aroroleta";
            } else if (iRoll < 272) {
                sSettlement = "Bebeta";
            } else if (iRoll < 283) {
                sSettlement = "Bet Dodera";
            } else if (iRoll < 285) {
                sSettlement = "Eb'Sarido";
            } else if (iRoll < 327) {
                sSettlement = "P'Rudekela Forest";
            } else if (iRoll < 332) {
                sSettlement = "Ridareta";
            } else {
                sSettlement = "Minor Town";
            }
        } else if (iRoll < 4132) {
            sRegion = "Edosi Forest";
            if (iRoll < 754) {
                sSettlement = "Doulathanorian";
            } else if (iRoll < 2543) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 3978) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 4112) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9389) {
            sRegion = "Kalamar";
            if (iRoll < 4133) {
                sSettlement = "Bet Kalamar";
            } else if (iRoll < 4244) {
                sSettlement = "Kalasali Woods";
            } else if (iRoll < 9387) {
                sSettlement = "Paliba Woods";
            } else {
                sSettlement = "Segeleta";
            }
        } else if (iRoll < 9404) {
            sRegion = "O'par";
            if (iRoll < 9397) {
                sSettlement = "Bet Bireli";
            } else if (iRoll < 9400) {
                sSettlement = "Sobakaseta";
            } else if (iRoll < 9401) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9402) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9403) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9741) {
            sRegion = "Pekal";
            if (iRoll < 9417) {
                sSettlement = "Baneta";
            } else if (iRoll < 9497) {
                sSettlement = "Bet Rogala";
            } else if (iRoll < 9634) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9726) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9740) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9826) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9828) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9844) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9853) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Gnome") {
        if (iRoll < 707) {
            sRegion = "Basir";
            if (iRoll < 2) {
                sSettlement = "Birirelido";
            } else if (iRoll < 511) {
                sSettlement = "Ubikokeli Highlands";
            } else if (iRoll < 616) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 626) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 634) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 1351) {
            sRegion = "Dodera";
            if (iRoll < 708) {
                sSettlement = "Bet Dodera";
            } else if (iRoll < 1337) {
                sSettlement = "Kakidela Mountains";
            } else if (iRoll < 1338) {
                sSettlement = "Ridareta";
            } else if (iRoll < 1342) {
                sSettlement = "Rural Thorp";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 5588) {
            sRegion = "Kalamar";
            if (iRoll < 2853) {
                sSettlement = "Alufalik Hills";
            } else if (iRoll < 2854) {
                sSettlement = "Bet Kalamar";
            } else if (iRoll < 2858) {
                sSettlement = "Ka'Asa Mountains";
            } else if (iRoll < 2866) {
                sSettlement = "Kalasali Woods";
            } else if (iRoll < 4007) {
                sSettlement = "Katagas Rise";
            } else if (iRoll < 5240) {
                sSettlement = "P'Sapas Hills";
            } else if (iRoll < 5587) {
                sSettlement = "Paliba Woods";
            } else {
                sSettlement = "Segeleta";
            }
        } else if (iRoll < 5723) {
            sRegion = "O'par";
            if (iRoll < 5595) {
                sSettlement = "Sobakaseta";
            } else if (iRoll < 5698) {
                sSettlement = "Tagaleta";
            } else if (iRoll < 5705) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5712) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 5717) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8892) {
            sRegion = "Pekal";
            if (iRoll < 5849) {
                sSettlement = "Baneta";
            } else if (iRoll < 6585) {
                sSettlement = "Bet Rogala";
            } else if (iRoll < 6669) {
                sSettlement = "Kamarela Mounds";
            } else if (iRoll < 7924) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8760) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8886) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9485) {
            sRegion = "Tarisato";
            if (iRoll < 8900) {
                sSettlement = "Balelido";
            } else if (iRoll < 8903) {
                sSettlement = "Gimbatagh";
            } else if (iRoll < 8904) {
                sSettlement = "Oloseta";
            } else {
                sSettlement = "P'Tikor Hills";
            }
        } else if (iRoll < 9538) {
            sRegion = "Tokis";
            if (iRoll < 9506) {
                sSettlement = "Bet Seder";
            } else if (iRoll < 9507) {
                sSettlement = "Gaketa";
            } else if (iRoll < 9509) {
                sSettlement = "Salirido";
            } else if (iRoll < 9517) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9521) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9591) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9687) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9769) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9894) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Half-Elf") {
        if (iRoll < 2066) {
            sRegion = "Basir";
            if (iRoll < 282) {
                sSettlement = "Bet Urala";
            } else if (iRoll < 316) {
                sSettlement = "Birirelido";
            } else if (iRoll < 322) {
                sSettlement = "Ubikokeli Highlands";
            } else if (iRoll < 1021) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1590) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2059) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3379) {
            sRegion = "Dodera";
            if (iRoll < 2075) {
                sSettlement = "Aroroleta";
            } else if (iRoll < 2077) {
                sSettlement = "Bebeta";
            } else if (iRoll < 2110) {
                sSettlement = "Bet Dodera";
            } else if (iRoll < 2114) {
                sSettlement = "Eb'Sarodp";
            } else if (iRoll < 2185) {
                sSettlement = "P'Rudekela Forest";
            } else if (iRoll < 2201) {
                sSettlement = "Ridareta";
            } else if (iRoll < 2250) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3379) {
            sRegion = "Edosi Forest";
            if (iRoll < 3163) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 3223) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 3334) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7801) {
            sRegion = "Kalamar";
            if (iRoll < 3382) {
                sSettlement = "Bet Kalamar";
            } else if (iRoll < 3662) {
                sSettlement = "Kalasali Woods";
            } else if (iRoll < 7790) {
                sSettlement = "Paliba Woods";
            } else if (iRoll < 7791) {
                sSettlement = "Rosaleta";
            } else if (iRoll < 7795) {
                sSettlement = "Segeleta";
            } else {
                sSettlement = "Togeseta";
            }
        } else if (iRoll < 7931) {
            sRegion = "O'par";
            if (iRoll < 7846) {
                sSettlement = "Bet Bireli";
            } else if (iRoll < 7906) {
                sSettlement = "Sobakaseta";
            } else if (iRoll < 7911) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7915) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7920) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8761) {
            sRegion = "Pekal";
            if (iRoll < 7976) {
                sSettlement = "Baneta";
            } else if (iRoll < 7977) {
                sSettlement = "Bet Rogala";
            } else if (iRoll < 8419) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8714) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8759) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8905) {
            sRegion = "Tarisato";
            if (iRoll < 8776) {
                sSettlement = "Kabakosikido";
            } else if (iRoll < 8785) {
                sSettlement = "Oloseta";
            } else if (iRoll < 8831) {
                sSettlement = "Pagalido";
            } else if (iRoll < 8867) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8890) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8896) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9806) {
            sRegion = "Tokis";
            if (iRoll < 8913) {
                sSettlement = "Bet Seder";
            } else if (iRoll < 8914) {
                sSettlement = "Fodeta";
            } else if (iRoll < 8915) {
                sSettlement = "Gaketa";
            } else if (iRoll < 8918) {
                sSettlement = "U'Rudaketa";
            } else if (iRoll < 9285) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9745) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9758) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9955) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9967) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9970) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9974) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Halfling") {
        if (iRoll < 1459) {
            sRegion = "Basir";
            if (iRoll < 359) {
                sSettlement = "Bet Urala";
            } else if (iRoll < 360) {
                sSettlement = "Birirelido";
            } else if (iRoll < 700) {
                sSettlement = "Ubikokeli Highlands";
            } else if (iRoll < 1111) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1378) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 1455) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 1900) {
            sRegion = "Dodera";
            if (iRoll < 1471) {
                sSettlement = "Aroroleta";
            } else if (iRoll < 1477) {
                sSettlement = "Bebeta";
            } else if (iRoll < 1478) {
                sSettlement = "Bet Dodera";
            } else if (iRoll < 1538) {
                sSettlement = "Eb'Sarido";
            } else if (iRoll < 1595) {
                sSettlement = "Kakapela Hills";
            } else if (iRoll < 1637) {
                sSettlement = "Kaleta";
            } else if (iRoll < 1647) {
                sSettlement = "P'Rudekela Forest";
            } else if (iRoll < 1865) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1883) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 1898) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 1982) {
            sRegion = "Edosi Forest";
            if (iRoll < 1917) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1961) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 1981) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 2708) {
            sRegion = "Kalamar";
            if (iRoll < 2088) {
                sSettlement = "Alufalik Hills";
            } else if (iRoll < 2089) {
                sSettlement = "Bet Kalamar";
            } else if (iRoll < 2324) {
                sSettlement = "Kalasali Woods";
            } else if (iRoll < 2464) {
                sSettlement = "Katagas Rise";
            } else if (iRoll < 2579) {
                sSettlement = "P'Sapas Hills";
            } else if (iRoll < 2705) {
                sSettlement = "Paliba Woods";
            } else if (iRoll < 2706) {
                sSettlement = "Rolutel Forest";
            } else {
                sSettlement = "Segeleta";
            }
        } else if (iRoll < 2710) {
            sRegion = "Lopoliri Mountains";
            sSettlement = "";
        } else if (iRoll < 2803) {
            sRegion = "O'par";
            if (iRoll < 2731) {
                sSettlement = "Bet Bireli";
            } else if (iRoll < 2750) {
                sSettlement = "Sobakaseta";
            } else if (iRoll < 2763) {
                sSettlement = "Tagaleta";
            } else if (iRoll < 2777) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2779) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2802) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3978) {
            sRegion = "Pekal";
            if (iRoll < 2829) {
                sSettlement = "Baneta";
            } else if (iRoll < 2992) {
                sSettlement = "Bet Rogala";
            } else if (iRoll < 3531) {
                sSettlement = "Kamarela Mounds";
            } else if (iRoll < 3784) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 3952) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 3977) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 4467) {
            sRegion = "Tarisato";
            if (iRoll < 3983) {
                sSettlement = "Balelido";
            } else if (iRoll < 3989) {
                sSettlement = "Gogido";
            } else if (iRoll < 4028) {
                sSettlement = "Kolido";
            } else if (iRoll < 4029) {
                sSettlement = "Oloseta";
            } else if (iRoll < 4030) {
                sSettlement = "Pagalido";
            } else if (iRoll < 4216) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 4384) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 4462) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9759) {
            sRegion = "Tokis";
            if (iRoll < 4795) {
                sSettlement = "Bet Seder";
            } else if (iRoll < 4796) {
                sSettlement = "Fodeta";
            } else if (iRoll < 4797) {
                sSettlement = "Gaketa";
            } else if (iRoll < 4805) {
                sSettlement = "Salirido";
            } else if (iRoll < 4806) {
                sSettlement = "U'Rudaketa";
            } else if (iRoll < 8010) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9111) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9737) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9825) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9830) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9837) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9936) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Half-Orc") {
        if (iRoll < 90) {
            sRegion = "Basir";
            if (iRoll < 20) {
                sSettlement = "Ubikokeli Highlands";
            } else if (iRoll < 43) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 62) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 64) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 126) {
            sRegion = "Dodera";
            if (iRoll < 91) {
                sSettlement = "Bet Dodera";
            } else if (iRoll < 104) {
                sSettlement = "Kakapela Hills";
            } else if (iRoll < 119) {
                sSettlement = "Kakidela Mountains";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7652) {
            sRegion = "Kalamar";
            if (iRoll < 897) {
                sSettlement = "Alufalik Hills";
            } else if (iRoll < 7051) {
                sSettlement = "Bet Kalamar";
            } else if (iRoll < 7052) {
                sSettlement = "Kalasali Woods";
            } else if (iRoll < 7565) {
                sSettlement = "P'Sapas Hills";
            } else if (iRoll < 7580) {
                sSettlement = "Rural Thorp";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8644) {
            sRegion = "Pekal";
            if (iRoll < 7705) {
                sSettlement = "Baneta";
            } else if (iRoll < 8235) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8588) {
                sSettlement = "Rual Hamlet";
            } else if (iRoll < 8641) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9789) {
            sRegion = "Tarisato";
            if (iRoll < 8801) {
                sSettlement = "Batullagh";
            } else if (iRoll < 8816) {
                sSettlement = "Gimbatagh";
            } else if (iRoll < 8847) {
                sSettlement = "Gogido";
            } else if (iRoll < 8849) {
                sSettlement = "Kabakosikido";
            } else if (iRoll < 8850) {
                sSettlement = "Oloseta";
            } else if (iRoll < 8998) {
                sSettlement = "P'Rorul Peaks";
            } else if (iRoll < 9685) {
                sSettlement = "P'Tikor Hills";
            } else if (iRoll < 9737) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9738) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9753) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9807) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9813) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9842) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9877) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else {
        if (iRoll < 647) {
            sRegion = "Basir";
            if (iRoll < 36) {
                sSettlement = "Bet Urala";
            } else if (iRoll < 41) {
                sSettlement = "Birirelido";
            } else if (iRoll < 42) {
                sSettlement = "Ubikokeli Highlands";
            } else if (iRoll < 372) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 617) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 646) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 1187) {
            sRegion = "Dodera";
            if (iRoll < 672) {
                sSettlement = "Aroroleta";
            } else if (iRoll < 680) {
                sSettlement = "Bebeta";
            } else if (iRoll < 698) {
                sSettlement = "Bet Dodera";
            } else if (iRoll < 702) {
                sSettlement = "Eb'Sarido";
            } else if (iRoll < 703) {
                sSettlement = "Kakapela Hills";
            } else if (iRoll < 705) {
                sSettlement = "Kakidela Mountains";
            } else if (iRoll < 714) {
                sSettlement = "Kaleta";
            } else if (iRoll < 715) {
                sSettlement = "P'Rudekela Forest";
            } else if (iRoll < 722) {
                sSettlement = "Ridareta";
            } else if (iRoll < 972) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1160) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 1186) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 1191) {
            sRegion = "Edosi Forest";
            if (iRoll < 1188) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1189) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 1190) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 5678) {
            sRegion = "Kalamar";
            if (iRoll < 1193) {
                sSettlement = "Alufalik Hills";
            } else if (iRoll < 1445) {
                sSettlement = "Bet Kalamar";
            } else if (iRoll < 1450) {
                sSettlement = "Falikido";
            } else if (iRoll < 1455) {
                sSettlement = "Ka'Asa Mountains";
            } else if (iRoll < 1479) {
                sSettlement = "Kalasali Woods";
            } else if (iRoll < 1483) {
                sSettlement = "Karasta";
            } else if (iRoll < 1490) {
                sSettlement = "Katagas Rise";
            } else if (iRoll < 1498) {
                sSettlement = "Lidereta";
            } else if (iRoll < 1500) {
                sSettlement = "P'Sapas Hills";
            } else if (iRoll < 1501) {
                sSettlement = "Paliba Woods";
            } else if (iRoll < 1738) {
                sSettlement = "Rolutel Forest";
            } else if (iRoll < 1753) {
                sSettlement = "Rosaleta";
            } else if (iRoll < 1763) {
                sSettlement = "Salireta";
            } else if (iRoll < 1774) {
                sSettlement = "Segeleta";
            } else if (iRoll < 1833) {
                sSettlement = "Sobeteta";
            } else if (iRoll < 1840) {
                sSettlement = "Togeseta";
            } else if (iRoll < 3913) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5449) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 5667) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6212) {
            sRegion = "O'par";
            if (iRoll < 5687) {
                sSettlement = "Bet Bireli";
            } else if (iRoll < 5692) {
                sSettlement = "Kasido";
            } else if (iRoll < 5701) {
                sSettlement = "Sobakaseta";
            } else if (iRoll < 5708) {
                sSettlement = "Tagaleta";
            } else if (iRoll < 5982) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6185) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6211) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7446) {
            sRegion = "Pekal";
            if (iRoll < 6225) {
                sSettlement = "Baneta";
            } else if (iRoll < 6236) {
                sSettlement = "Bet Rogala";
            } else if (iRoll < 6237) {
                sSettlement = "Kamarela Mountains";
            } else if (iRoll < 6887) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7373) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7442) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8298) {
            sRegion = "Tarisato";
            if (iRoll < 7452) {
                sSettlement = "Balelido";
            } else if (iRoll < 7454) {
                sSettlement = "Batullagh";
            } else if (iRoll < 7456) {
                sSettlement = "Gimbatagh";
            } else if (iRoll < 7458) {
                sSettlement = "Gogido";
            } else if (iRoll < 7462) {
                sSettlement = "Kabakosikido";
            } else if (iRoll < 7467) {
                sSettlement = "Kolido";
            } else if (iRoll < 7492) {
                sSettlement = "Oloseta";
            } else if (iRoll < 7493) {
                sSettlement = "P'Rorul Peaks";
            } else if (iRoll < 7501) {
                sSettlement = "P'Tikor Hills";
            } else if (iRoll < 7505) {
                sSettlement = "Pagalido";
            } else if (iRoll < 7935) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8252) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8296) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9895) {
            sRegion = "Tokis";
            if (iRoll < 8341) {
                sSettlement = "Bet Seder";
            } else if (iRoll < 8350) {
                sSettlement = "Fodeta";
            } else if (iRoll < 8358) {
                sSettlement = "Gaketa";
            } else if (iRoll < 8363) {
                sSettlement = "Pipido";
            } else if (iRoll < 8366) {
                sSettlement = "Salirido";
            } else if (iRoll < 8383) {
                sSettlement = "U'Rudaketa";
            } else if (iRoll < 9211) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9844) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9891) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9919) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9921) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9953) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9987) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    }
    if (sCommunity === "") {
        sCommunity = sSettlement + " (" + sRegion + ") " + sSuffix;
    }
    return sCommunity;
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

oNIB.createReanaarianCommunity = function(sRace) {
    var iRoll = oNIB.roll(10000);
    var sSuffix = "(Reanaaria Bay)";
    var sRegion = "";
    var sSettlement = "";
    var sCommunity = "";
    if (sRace === "Dwarf") {
        if (iRoll < 688) {
            sRegion = "Courai Heights";
            if (iRoll < 83) {
                sSettlement = "Geanavue";
            } else if (iRoll < 503) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 658) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 687) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8813) {
            sRegion = "Faunee Rise";
            sSettlement = "";
        } else if (iRoll < 9589) {
            sRegion = "Fautee Peninsula";
            if (iRoll < 8944) {
                sSettlement = "Zoa";
            } else if (iRoll < 9338) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9560) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9588) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9606) {
            sRegion = "Khydoban Desert";
            sSettlement = "Thygasha";
        } else if (iRoll < 9610) {
            sRegion = "Kaotoon Island";
            if (iRoll < 9607) {
                sSettlement = "Aasaer";
            } else if (iRoll < 9608) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9609) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9610) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9711) {
            sRegion = "Neebau Cliffs";
            sSettlement = "";
        } else if (iRoll < 9715) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9794) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9847) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9996) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Elf") {
        if (iRoll < 40) {
            sRegion = "Courai Heights";
            if (iRoll < 24) {
                sSettlement = "Geanavue";
            } else if (iRoll < 37) {
                sSettlement = "Rural Hamlet";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 2825) {
            sRegion = "Fautee Peninsula";
            if (iRoll < 510) {
                sSettlement = "Zoa";
            } else if (iRoll < 1923) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2722) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2824) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 2879) {
            sRegion = "Kaotoon Island";
            if (iRoll < 2850) {
                sSettlement = "Aasaer";
            } else if (iRoll < 2865) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2876) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2878) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3282) {
            sRegion = "Nanakary Forest";
            if (iRoll < 2960) {
                sSettlement = "Baethel";
            } else if (iRoll < 3121) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 3257) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 3273) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3288) {
            sRegion = "Reanaaria Bay";
            if (iRoll < 3288) {
                sSettlement = "Saaniema";
            } else if (iRoll < 3525) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 3650) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 3713) {
                sSettlement = "Minor Town";
            } else if (iRoll < 3715) {
                sSettlement = "Farmstead";
            } else if (iRoll < 3846) {
                sSettlement = "Shyff";
            } else if (iRoll < 6430) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8281) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8358) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3700) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9336) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9455) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9565) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Gnome") {
        if (iRoll < 840) {
            sRegion = "Courai Heights";
            if (iRoll < 125) {
                sSettlement = "Geanavue";
            } else if (iRoll < 619) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 803) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 837) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 849) {
            sRegion = "Faunee Rise";
            sSettlement = "";
        } else if (iRoll < 1234) {
            sRegion = "Fautee Forest";
            if (iRoll < 921) {
                sSettlement = "Xaarum";
            } else if (iRoll < 1116) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1216) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 1232) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 2467) {
            sRegion = "Fautee Peninsula";
            if (iRoll < 1440) {
                sSettlement = "Zoa";
            } else if (iRoll < 2061) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2413) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2458) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7885) {
            sRegion = "Khydoban Desert";
            if (iRoll < 4326) {
                sSettlement = "Arajyd Hills";
            } else if (iRoll < 4578) {
                sSettlement = "Thygasha";
            } else if (iRoll < 6437) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7677) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7863) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7890) {
            sRegion = "Kaotoon Island";
            if (iRoll < 7886) {
                sSettlement = "Aasaer";
            } else if (iRoll < 7887) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7888) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7889) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9207) {
            sRegion = "Nanakary Forest";
            if (iRoll < 8154) {
                sSettlement = "Baethel";
            } else if (iRoll < 8724) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9144) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9204) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9232) {
            sRegion = "Neebau Cliffs";
        } else if (iRoll < 9500) {
            sRegion = "Renaaria Bay";
            if (iRoll < 9329) {
                sSettlement = "Shyff";
            } else if (iRoll < 9403) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9476) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9498) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9908) {
            sRegion = "Sotai Gagalia Headlands";
        } else if (iRoll < 9914) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9930) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9949) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9992) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Half-Elf") {
        if (iRoll < 2162) {
            sRegion = "Courai Heights";
            if (iRoll < 261) {
                sSettlement = "Geanavue";
            } else if (iRoll < 1582) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2071) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2161) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7686) {
            sRegion = "Fautee Peninsula";
            if (iRoll < 3093) {
                sSettlement = "Zoa";
            } else if (iRoll < 5885) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7467) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7670) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8238) {
            sRegion = "Khydoban Desert";
            if (iRoll < 8138) {
                sSettlement = "Arajyd Hills";
            } else {
                sSettlement = "Thygasha";
            }
        } else if (iRoll < 8568) {
            sRegion = "Kaotoon Island";
            if (iRoll < 8396) {
                sSettlement = "Aasaer";
            } else if (iRoll < 8489) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8557) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8567) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9687) {
            sRegion = "Reanaaria Bay";
            if (iRoll < 8625) {
                sSettlement = "Saaniema";
            } else if (iRoll < 9197) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9497) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9648) {
                sSettlement = "Minor Town";
            } else if (iRoll < 9653) {
                sSettlement = "Farmstead";
            } else if (iRoll < 9658) {
                sSettlement = "Shyff";
            } else if (iRoll < 9666) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9679) {
                sSettlement = "Rural Hamlet";
            } else {
                sSettlement = "Minor Town";
            }
        } else if (iRoll < 9822) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9964) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9970) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9983) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Halfling") {
        if (iRoll < 17) {
            sRegion = "Courai Heights";
            sSettlement = "Geanavue";
        } else if (iRoll < 1643) {
            sRegion = "Fautee Forest";
            if (iRoll < 319) {
                sSettlement = "Xaarum";
            } else if (iRoll < 1134) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1557) {
                sSettlement = "Rural Hamlet";
            } else {
                sSettlement = "Minor Town";
            }
        } else if (iRoll < 5311) {
            sRegion = "Fautee Peninsula";
            if (iRoll < 2262) {
                sSettlement = "Zoa";
            } else if (iRoll < 4122) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5175) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 5310) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8777) {
            sRegion = "Khydoban Desert";
            if (iRoll < 7833) {
                sSettlement = "Arajyd Hills";
            } else if (iRoll < 7925) {
                sSettlement = "Thygasha";
            } else if (iRoll < 8507) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8717) {
                sSettlement = "Rual Hamlet";
            } else if (iRoll < 8775) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8796) {
            sRegion = "Kaotoon Island";
            if (iRoll < 8785) {
                sSettlement = "Aasaer";
            } else if (iRoll < 8790) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8794) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8795) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8936) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9247) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9277) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9898) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Half-Orc") {
        if (iRoll < 62) {
            sRegion = "Courai Heights";
            if (iRoll < 14) {
                sSettlement = "Geanavue";
            } else if (iRoll < 23) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 25) {
                sSettlement = "Rural Hamlet";
            } else {
                sSettlement = "Minor Town";
            }
        } else if (iRoll < 809) {
            sRegion = "Faunee Rise";
        } else if (iRoll < 4543) {
            sRegion = "Fautee Peninsula"
            if (iRoll < 1437) {
                sSettlement = "Zoa";
            } else if (iRoll < 3321) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 4389) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 4526) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 4694) {
            sRegion = "Khydroban Desert"
            if (iRoll < 4593) {
                sSettlement = "Arajyd Hills";
            } else {
                sSettlement = "Dynaj";
            }
        } else if (iRoll < 6388) {
            sRegion = "Kaotoon Island";
            if (iRoll < 5504) {
                sSettlement = "Aasaer";
            } else if (iRoll < 5981) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6335) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6385) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8486) {
            sRegion = "Masau Hills"
        } else if (iRoll < 9267) {
            sRegion = "Neebau Cliffs";
        } else if (iRoll < 9298) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9555) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9656) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9838) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else {
        if (iRoll < 267) {
            sRegion = "Courai Heights";
            if (iRoll < 67) {
                sSettlement = "Geanavue";
            } else if (iRoll < 92) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 250) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 266) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 275) {
            sRegion = "Faunee Rise";
        } else if (iRoll < 657) {
            sRegion = "Fautee Forest";
            if (iRoll < 354) {
                sSettlement = "Xaarum";
            } else if (iRoll < 506) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 639) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 656) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3692) {
            sRegion = "Fautee Peninsula";
            if (iRoll < 1308) {
                sSettlement = "Zoa";
            } else if (iRoll < 2516) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 3535) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 3686) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6045) {
            sRegion = "Khydoban Desert";
            if (iRoll < 3702) {
                sSettlement = "Arajyd Hills";
            } else if (iRoll < 3774) {
                sSettlement = "Dynaj";
            } else if (iRoll < 4414) {
                sSettlement = "Thygasha";
            } else if (iRoll < 5271) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5957) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6031) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6219) {
            sRegion = "Kaotoon Island";
            if (iRoll < 6128) {
                sSettlement = "Aasaer";
            } else if (iRoll < 6177) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6213) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6218) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6848) {
            sRegion = "Keenoa Tors";
            if (iRoll < 6346) {
                sSettlement = "Giilia";
            } else if (iRoll < 6617) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6817) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6846) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7172) {
            sRegion = "Nanakary Forest";
            if (iRoll < 6913) {
                sSettlement = "Baethel";
            } else if (iRoll < 7053) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7156) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7171) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7189) {
            sRegion = "Neebau Cliffs";
        } else if (iRoll < 7893) {
            sRegion = "Reanaaria Bay";
            if (iRoll < 7275) {
                sSettlement = "Saaniema";
            } else if (iRoll < 7358) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7429) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7430) {
                sSettlement = "Minor Town";
            } else if (iRoll < 7431) {
                sSettlement = "Farmstead";
            } else if (iRoll < 7524) {
                sSettlement = "Fymar";
            } else if (iRoll < 7659) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7759) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7773) {
                sSettlement = "Minor Town";
            } else if (iRoll < 7774) {
                sSettlement = "Farmstead";
            } else if (iRoll < 7876) {
                sSettlement = "Shyff";
            } else if (iRoll < 7880) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7882) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7892) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7901) {
            sRegion = "Sotai Gagalia Headlands";
        } else if (iRoll < 7995) {
            sRegion = "Vry Nasau Headlands";
        } else if (iRoll < 8132) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 8981) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9351) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else if (iRoll < 9941) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    }
    if (sCommunity === "") {
        sCommunity = sSettlement + " (" + sRegion + ") " + sSuffix;
    }
    return sCommunity;
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

oNIB.createSvimozhishianCommunity = function(sRace) {
    var iRoll = oNIB.roll(10000);
    var sSuffix = "(Svimozhish Isle)";
    var sRegion = "";
    var sSettlement = "";
    var sCommunity = "";
    if (sRace === "Dwarf") {
        if (iRoll < 14) {
            sRegion = "Ahznomahn";
            sSettlement = "Zha-Nehzmish";
        } else if (iRoll < 9730) {
            sRegion = "Meznamish";
            if (iRoll < 380) {
                sSettlement = "Dashahn Mountains";
            } else if (iRoll < 517) {
                sSettlement = "Menamo Hills";
            } else if (iRoll < 568) {
                sSettlement = "Monam-Ahnozh";
            } else if (iRoll < 9709) {
                sSettlement = "Tanzeh Mountains";
            } else {
                sSettlement = "Zhano Headlands";
            }
        } else if (iRoll < 9740) {
            sRegion = "Ozhvinmish";
            sSettlement = "Imomena Hills";
        } else if (iRoll < 9862) {
            sRegion = "Ul-Karg";
            if (iRoll < 9753) {
                sSettlement = "Burzumagh";
            } else if (iRoll < 9852) {
                sSettlement = "Krimppatu";
            } else if (iRoll < 9853) {
                sSettlement = "Kazullagh";
            } else {
                sSettlement = "Ronazagh";
            }
        } else if (iRoll < 9867) {
            sRegion = "Vrandol";
            sSettlement = "Vrandol";
        } else if (iRoll < 9896) {
            sRegion = "Zazahni";
            if (iRoll < 9877) {
                sSettlement = "Imomena Hills";
            } else if (iRoll < 9890) {
                sSettlement = "Svomwhi";
            } else {
                sSettlement = "Wimish";
            }
        } else if (iRoll < 9903) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9952) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9972) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9995) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Elf") {
        if (iRoll < 36) {
            sRegion = "Ahznomahn";
            sSettlement = "Zha-Nehzmish";
        } else if (iRoll < 294) {
            sRegion = "Meznamish";
            sSettlement = "Mizohr Woodlands";
        } else if (iRoll < 9300) {
            sRegion = "Ozhvinmish";
            sSettlement = "Miznoh Forest";
        } else if (iRoll < 9328) {
            sRegion = "Zazahni";
            if (iRoll < 9314) {
                sSettlement = "Emosvom";
            } else {
                sSettlement = "Wimish";
            }
        } else if (iRoll < 9591) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9758) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9765) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9772) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Gnome") {
        if (iRoll < 64) {
            sRegion = "Ahznomahn";
            sSettlement = "Zha-Nehzmish";
        } else if (iRoll < 8284) {
            sRegion = "Meznamish";
            if (iRoll < 1686) {
                sSettlement = "Dashahn Mountains";
            } else if (iRoll < 3194) {
                sSettlement = "Menamo Hills";
            } else if (iRoll < 4510) {
                sSettlement = "Mizohr Woodlands";
            } else if (iRoll < 5953) {
                sSettlement = "Tanzeh Mountains";
            } else {
                sSettlement = "Zhano Headlands";
            }
        } else if (iRoll < 8460) {
            sRegion = "Ozhvinmish";
            sSettlement = "Imomena Hills";
        } else if (iRoll < 9637) {
            sRegion = "Ul-Karg";
            if (iRoll < 8824) {
                sSettlement = "Burzumagh";
            } else if (iRoll < 9519) {
                sSettlement = "Krimppatu";
            } else if (iRoll < 9557) {
                sSettlement = "Kazullagh";
            } else {
                sSettlement = "Ronazagh";
            }
        } else if (iRoll < 9832) {
            sRegion = "Zazahni";
            if (iRoll < 9813) {
                sSettlement = "Imomena Hills";
            } else if (iRoll < 9826) {
                sSettlement = "Svomwhi";
            } else {
                sSettlement = "Wimish";
            }
        } else if (iRoll < 9864) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9893) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9950) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9969) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Half-Elf") {
        if (iRoll < 650) {
            sRegion = "Ahznomahn";
            sSettlement = "Zha-Nehzmish";
        } else if (iRoll < 3764) {
            sRegion = "Vohven Jungle";
        } else if (iRoll < 4757) {
            sRegion = "Meznamish";
            sSettlement = "Tanzeh Mountains";
        } else if (iRoll < 6443) {
            sRegion = "Ozhvinmish";
            sSettlement = "Miznoh Forest";
        } else if (iRoll < 7520) {
            sRegion = "Ul-Karg";
            if (iRoll < 7004) {
                sSettlement = "Burzumagh";
            } else {
                sSettlement = "Kazullagh";
            }
        } else if (iRoll < 9147) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9715) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9845) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9858) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Halfling") {
        if (iRoll < 139) {
            sRegion = "Ahznomahn";
            sSettlement = "Zha-Nehzmish";
        } else if (iRoll < 2660) {
            sRegion = "Bronish";
            if (iRoll < 685) {
                sSettlement = "Bronish";
            } else if (iRoll < 1830) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2517) {
                sSettlement = "Rural Hamlet";
            } else {
                sSettlement = "Minor Town";
            }
        } else if (iRoll < 6137) {
            sRegion = "Meznamish";
            if (iRoll < 2858) {
                sSettlement = "Dashahn Mountains";
            } else if (iRoll < 5713) {
                sSettlement = "Menamo Hills";
            } else if (iRoll < 6089) {
                sSettlement = "Tanzeh Mountains";
            } else {
                sSettlement = "Zhano Headlands";
            }
        } else if (iRoll < 7696) {
            sRegion = "Ozhvinmish";
            if (iRoll < 7319) {
                sSettlement = "Imomena Hills";
            } else {
                sSettlement = "Miznoh Forest";
            }
        } else if (iRoll < 8960) {
            sRegion = "Zazahni";
            if (iRoll < 8878) {
                sSettlement = "Imomena Hills";
            } else if (iRoll < 8932) {
                sSettlement = "Svomwhi";
            } else {
                sSettlement = "Wimish";
            }
        } else if (iRoll < 9349) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9637) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9664) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9809) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Half-Orc") {
        if (iRoll < 347) {
            sRegion = "Ahznomahn";
            sSettlement = "Zha-Nehzmish";
        } else if (iRoll < 7083) {
            sRegion = "Vohven Jungle";
        } else if (iRoll < 9758) {
            sRegion = "Whisvomi Forest";
        } else if (iRoll < 9788) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9871) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9881) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9896) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else {
        if (iRoll < 839) {
            sRegion = "Ahznomahn";
            if (iRoll < 202) {
                sSettlement = "Zha-Nehzmish";
            } else if (iRoll < 547) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 804) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 837) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 1580) {
            sRegion = "Vohven Jungle";
        } else if (iRoll < 1630) {
            sRegion = "Bronish";
            if (iRoll < 1590) {
                sSettlement = "Bronish";
            } else if (iRoll < 1611) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 1627) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 1629) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 2872) {
            sRegion = "Meznamish";
            if (iRoll < 1651) {
                sSettlement = "Dashan Mountains";
            } else if (iRoll < 1671) {
                sSettlement = "Menamo Hills";
            } else if (iRoll < 1809) {
                sSettlement = "Monam-Ahnozh";
            } else if (iRoll < 1811) {
                sSettlement = "Mizohr Woodlands";
            } else if (iRoll < 1814) {
                sSettlement = "Tanzeh Mountains";
            } else if (iRoll < 1823) {
                sSettlement = "Zhano Headlands";
            } else if (iRoll < 2390) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2809) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2869) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 5659) {
            sRegion = "Ozhvinmish";
            if (iRoll < 2907) {
                sSettlement = "Anowhizh";
            } else if (iRoll < 3049) {
                sSettlement = "Ashoshani";
            } else if (iRoll < 3062) {
                sSettlement = "Imomena Hills";
            } else if (iRoll < 3074) {
                sSettlement = "Miznahn";
            } else if (iRoll < 3090) {
                sSettlement = "Miznoh Forest";
            } else if (iRoll < 3131) {
                sSettlement = "Nenehi";
            } else if (iRoll < 3327) {
                sSettlement = "Svowmahni";
            } else if (iRoll < 3357) {
                sSettlement = "Zomo-wim";
            } else if (iRoll < 4589) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5502) {
                sSettlement = "Rual Hamlet";
            } else if (iRoll < 5632) {
                sSettlement = "Minor Town";
            } else if (iRoll < 5639) {
                sSettlement = "Farmstead";
            } else {
                sSettlement = "Parnor Hills";
            }
        } else if (iRoll < 5963) {
            sRegion = "Ul-Karg";
            if (iRoll < 5682) {
                sSettlement = "Burzumagh";
            } else if (iRoll < 5700) {
                sSettlement = "Krimppatu";
            } else if (iRoll < 5709) {
                sSettlement = "Kazullagh";
            } else if (iRoll < 5713) {
                sSettlement = "Ronazagh";
            } else if (iRoll < 5761) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5788) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 5789) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6039) {
            sRegion = "Vrandol";
            if (iRoll < 5978) {
                sSettlement = "Vrandol";
            } else if (iRoll < 6004) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6025) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6027) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8326) {
            sRegion = "Zazahni";
            if (iRoll < 6051) {
                sSettlement = "Emosvom";
            } else if (iRoll < 6064) {
                sSettlement = "Imomena Hills";
            } else if (iRoll < 6093) {
                sSettlement = "Svomwhi";
            } else if (iRoll < 6125) {
                sSettlement = "Wimish";
            } else if (iRoll < 6164) {
                sSettlement = "Zenshahn";
            } else if (iRoll < 6177) {
                sSettlement = "Zhanohven";
            } else if (iRoll < 7494) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8212) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8284) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9842) {
            sRegion = "Whisvomi Forest";
        } else if (iRoll < 9864) {
            sRegion = "Whisvomi Hills";
        } else if (iRoll < 9900) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9975) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9977) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9990) {
            sCommunity = oNIB.createWildLandsCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    }
    if (sCommunity === "") {
        sCommunity = sSettlement + " (" + sRegion + ") " + sSuffix;
    }
    return sCommunity;
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

oNIB.createWildLandsCommunity = function(sRace) {
    var iRoll = oNIB.roll(10000);
    var sSuffix = "(Wild Lands)";
    var sRegion = "";
    var sSettlement = "";
    var sCommunity = "";
    if (sRace === "Dwarf") {
        if (iRoll < 4599) {
            sRegion = "Byth Mountains";
            if (iRoll < 804) {
                sSettlement = "Draska";
            } else if (iRoll < 2693) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 4346) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 4583) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 4742) {
            sRegion = "Paru'Bor";
            if (iRoll < 4648) {
                sSettlement = "Bet Regor";
            } else if (iRoll < 4650) {
                sSettlement = "Paketa";
            } else if (iRoll < 4709) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 4720) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 4737) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8439) {
            sRegion = "Shynabyth";
            if (iRoll < 4997) {
                sSettlement = "Gadra Uplands";
            } else if (iRoll < 5153) {
                sSettlement = "Shyf Hills";
            } else if (iRoll < 6846) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8178) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8415) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9307) {
            sRegion = "Slen";
            if (iRoll < 9163) {
                sSettlement = "Deshada Mountains";
            } else if (iRoll < 9191) {
                sSettlement = "Hadaf Highlands";
            } else {
                sSettlement = "Shada Hills";
            }
        } else if (iRoll < 9465) {
            sRegion = "Tharggy";
            if (iRoll < 9452) {
                sSettlement = "Shyf Hills";
            } else {
                sSettlement = "Shynako Hills";
            }
        } else if (iRoll < 9633) {
            sRegion = "Thybaj";
            if (iRoll < 9470) {
                sSettlement = "Dakyno";
            } else if (iRoll < 9484) {
                sSettlement = "Fashyr";
            } else if (iRoll < 9593) {
                sSettlement = "Jenth Ridges";
            } else if (iRoll < 9631) {
                sSettlement = "Shyta-Thybaj";
            } else {
                sSettlement = "Vrykarr Mountains";
            }
        } else if (iRoll < 9640) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9822) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9934) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9980) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Elf") {
        if (iRoll < 1517) {
            sRegion = "Skarrna";
            sSettlement = "Narrajy Forest";
        } else if (iRoll < 3316) {
            sRegion = "Tharggy";
            if (iRoll < 3264) {
                sSettlement = "Fyban Forest";
            } else {
                sSettlement = "Rokk Woods";
            }
        } else if (iRoll < 6584) {
            sRegion = "Thybaj";
            if (iRoll < 3318) {
                sSettlement = "Fashyr";
            } else if (iRoll < 6312) {
                sSettlement = "Jenth Ridges";
            } else {
                sSettlement = "Nyton";
            }
        } else if (iRoll < 7497) {
            sRegion = "Rytarr Woods";
            if (iRoll < 6767) {
                sSettlement = "Narr-Rytar";
            } else if (iRoll < 7161) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7453) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7495) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7837) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 8701) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 8758) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 8818) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Gnome") {
        if (iRoll < 1517) {
            sRegion = "Skarrna";
            sSettlement = "Narrajy Forest";
        } else if (iRoll < 3316) {
            sRegion = "Tharggy";
            if (iRoll < 3264) {
                sSettlement = "Fyban Forest";
            } else {
                sSettlement = "Rokk Woods";
            }
        } else if (iRoll < 6584) {
            sRegion = "Thybaj";
            if (iRoll < 3318) {
                sSettlement = "Fashyr";
            } else if (iRoll < 6312) {
                sSettlement = "Jenth Ridges";
            } else {
                sSettlement = "Nyton";
            }
        } else if (iRoll < 7497) {
            sRegion = "Rytarr Woods";
            if (iRoll < 6767) {
                sSettlement = "Narr-Rytar";
            } else if (iRoll < 7161) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7453) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7495) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7837) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 8701) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 8758) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 8818) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Half-Elf") {
        if (iRoll < 1380) {
            sRegion = "Tharggy";
            if (iRoll < 1268) {
                sSettlement = "Fyban Forest";
            } else {
                sSettlement = "Rokk Woods";
            }
        } else if (iRoll < 4860) {
            sRegion = "Thybaj";
            if (iRoll < 1604) {
                sSettlement = "Fashyr";
            } else if (iRoll < 2976) {
                sSettlement = "Jenth Ridges";
            } else if (iRoll < 3456) {
                sSettlement = "Nyton";
            } else if (iRoll < 4853) {
                sSettlement = "Shyta-Thybaj";
            } else {
                sSettlement = "Vrykarr Mountains";
            }
        } else if (iRoll < 6596) {
            sRegion = "Torakk";
            sSettlement = "Korren Woods";
        } else if (iRoll < 7643) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9105) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9608) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9632) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Halfling") {
        if (iRoll < 602) {
            sRegion = "Byth Mountains";
            if (iRoll < 106) {
                sSettlement = "Daruk";
            } else if (iRoll < 387) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 574) {
                sSettlement = "Rural Hamlet";
            } else {
                sSettlement = "Minor Town";
            }
        } else if (iRoll < 609) {
            sRegion = "Paru'Bor";
            if (iRoll < 606) {
                sSettlement = "Koreta";
            } else if (iRoll < 607) {
                sSettlement = "Paketa";
            } else {
                sSettlement = "Minor Town";
            }
        } else if (iRoll < 7380) {
            sRegion = "Shynabyth";
            if (iRoll < 861) {
                sSettlement = "Shyf Hills";
            } else if (iRoll < 4220) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6910) {
                sSettlement = "Rural Hamlet";
            } else {
                sSettlement = "Minor Town";
            }
        } else if (iRoll < 7534) {
            sRegion = "Skarrna";
            sSettlement = "Narrajy Forest";
        } else if (iRoll < 7984) {
            sRegion = "Tharggy";
            if (iRoll < 7700) {
                sSettlement = "Fyban Forest";
            } else if (iRoll < 7706) {
                sSettlement = "Rokk Woods";
            } else if (iRoll < 7960) {
                sSettlement = "Shyf Hills";
            } else {
                sSettlement = "Shynako Hills";
            }
        } else if (iRoll < 9221) {
            sRegion = "Thybaj";
            if (iRoll < 7997) {
                sSettlement = "Dakyno";
            } else if (iRoll < 7999) {
                sSettlement = "Fashyr";
            } else if (iRoll < 8479) {
                sSettlement = "Jenth Ridges";
            } else if (iRoll < 8549) {
                sSettlement = "Nyton";
            } else if (iRoll < 8588) {
                sSettlement = "Shyta-Thybaj";
            } else if (iRoll < 8589) {
                sSettlement = "Vrykarr Mountains";
            } else if (iRoll < 8998) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9176) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9220) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9319) {
            sRegion = "Torakk";
            sSettlement = "Khorren Woods";
        } else if (iRoll < 9787) {
            sRegion = "Rytarr Woods";
            if (iRoll < 9413) {
                sSettlement = "Narr-Rytarr";
            } else if (iRoll < 9615) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9765) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9786) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9820) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9918) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9932) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9936) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else if (sRace === "Half-Orc") {
        if (iRoll < 8503) {
            sRegion = "Slen";
            sSettlement = "Hadaf Highlands";
        } else if (iRoll < 8613) {
            sRegion = "Thybaj";
            if (iRoll < 8529) {
                sSettlement = "Fashyr";
            } else {
                sSettlement = "Jenth Ridges";
            }
        } else if (iRoll < 8660) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9177) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9270) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9346) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    } else {
        if (iRoll < 92) {
            sRegion = "Byth Mountains";
            if (iRoll < 27) {
                sSettlement = "Daruk";
            } else if (iRoll < 71) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 89) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 91) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3002) {
            sRegion = "Drhokker";
            if (iRoll < 102) {
                sSettlement = "Gothmerr";
            } else if (iRoll < 118) {
                sSettlement = "Nythok";
            } else if (iRoll < 134) {
                sSettlement = "Trarr";
            } else if (iRoll < 1682) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 2829) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 2993) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 3743) {
            sRegion = "Paru'Bor";
            if (iRoll < 3067) {
                sSettlement = "Bet Regor";
            } else if (iRoll < 3090) {
                sSettlement = "Koreta";
            } else if (iRoll < 3147) {
                sSettlement = "Paketa";
            } else if (iRoll < 3466) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 3710) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 3742) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 5216) {
            sRegion = "Shynabyth";
            if (iRoll < 3757) {
                sSettlement = "Byksha";
            } else if (iRoll < 3763) {
                sSettlement = "Gadra Uplands";
            } else if (iRoll < 3809) {
                sSettlement = "Rynoshok";
            } else if (iRoll < 3818) {
                sSettlement = "Sarr";
            } else if (iRoll < 3829) {
                sSettlement = "Shyf Hills";
            } else if (iRoll < 4616) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 5146) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 5213) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 6934) {
            sRegion = "Skarrna";
            if (iRoll < 5263) {
                sSettlement = "Ardarr-Norr";
            } else if (iRoll < 6166) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 6834) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 6929) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7419) {
            sRegion = "Slen";
            if (iRoll < 6944) {
                sSettlement = "Deshada Mountains";
            } else if (iRoll < 6950) {
                sSettlement = "Gadra Uplands";
            } else if (iRoll < 6968) {
                sSettlement = "Hadaf Highlands";
            } else if (iRoll < 7026) {
                sSettlement = "Kako-Gyr";
            } else if (iRoll < 7161) {
                sSettlement = "Shada Hills";
            } else if (iRoll < 7300) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7403) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7418) {
                sSettlement = "Minor Tower";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 7925) {
            sRegion = "Tharggy";
            if (iRoll < 7477) {
                sSettlement = "Bynarr";
            } else if (iRoll < 7478) {
                sSettlement = "Fyban Forest";
            } else if (iRoll < 7490) {
                sSettlement = "Kojy";
            } else if (iRoll < 7491) {
                sSettlement = "Rokk Woods";
            } else if (iRoll < 7500) {
                sSettlement = "Shaggar";
            } else if (iRoll < 7511) {
                sSettlement = "Shyf Forest";
            } else if (iRoll < 7512) {
                sSettlement = "Shynako Hills";
            } else if (iRoll < 7735) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 7900) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 7924) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 8896) {
            sRegion = "Thybaj";
            if (iRoll < 7938) {
                sSettlement = "Dakyno";
            } else if (iRoll < 7950) {
                sSettlement = "Fashyr";
            } else if (iRoll < 7965) {
                sSettlement = "Nyton";
            } else if (iRoll < 8006) {
                sSettlement = "Shyta-Thybaj";
            } else if (iRoll < 8020) {
                sSettlement = "Vrykarr Mountains";
            } else if (iRoll < 8489) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 8845) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 8895) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9230) {
            sRegion = "Rytarr Woods";
            if (iRoll < 8911) {
                sSettlement = "Jorakk Mountains";
            } else if (iRoll < 8916) {
                sSettlement = "Khorren Woods";
            } else if (iRoll < 8919) {
                sSettlement = "Norr-Burr";
            } else if (iRoll < 8928) {
                sSettlement = "Varmorr";
            } else if (iRoll < 9091) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9212) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9229) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9595) {
            sRegion = "Rytarr Woods";
            if (iRoll < 9302) {
                sSettlement = "Narr-Rytarr";
            } else if (iRoll < 9460) {
                sSettlement = "Rural Thorp";
            } else if (iRoll < 9577) {
                sSettlement = "Rural Hamlet";
            } else if (iRoll < 9594) {
                sSettlement = "Minor Town";
            } else {
                sSettlement = "Farmstead";
            }
        } else if (iRoll < 9628) {
            sCommunity = oNIB.createBrandobianCommunity(sRace)
        } else if (iRoll < 9904) {
            sCommunity = oNIB.createKalamaranEmpireCommunity(sRace)
        } else if (iRoll < 9917) {
            sCommunity = oNIB.createReanaarianCommunity(sRace)
        } else if (iRoll < 9962) {
            sCommunity = oNIB.createSvimozhishianCommunity(sRace)
        } else {
            sCommunity = oNIB.createYoungKingdomsCommunity(sRace)
        }
    }
    if (sCommunity === "") {
        sCommunity = sSettlement + " (" + sRegion + ") " + sSuffix;
    }
    return sCommunity;
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
        "greyhawk", "jakandor", "kalamar", "lankhmar", "mahasarpa", 
        "mystara", "pelinore", "planescape", "ravenloft", "rokugan", 
        "spelljammer", "warcraft", "wilderlands"];
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

oNIB.oSettings["Birthright"] = {
    "aBirthright": ["Ariya (region)", "Baruk-Azhik", "Binsada", "Diemed", "Endier", "Illien (region)", "Khourane", "Medoere", "Muden", 
        "Roesone", "Talinie", "Tuarhievel", "Tuornen"], 
    "aAriya(region)": ["Ariya (settlement)", "Ariya (region) (undefined)"], 
    "Ariya (region)": {iPopulation: 85000, sSource: "Player's Secrets of Ariya", sType: "region"}, 
    "Ariya (settlement)": {iPopulation: 70000, sSource: "Domain of Diemed", sType: "settlement"}, 
    "Ariya (region) (undefined)": {iPopulation: 15000, sType: "undefined"}, 
    "aBaruk-Azhik": ["Stone's Rejoicing", "Baruk-Azhik (undefined)"], 
    "Baruk-Azhik": {iPopulation: 38685, Dwarf: 99, other: 1, sType: "region"}, 
    "Stone's Rejoicing": {iPopulation: 20000, Dwarf: 99, other: 1, sSource: "Player's Secrets of Baruk-Azhik", sType: "settlement"}, 
    "Baruk-Azhik (undefined)": {iPopulation: 18685, Dwarf: 99, other: 1, sType: "undefined"}, 
    "aBinsada": ["Andujar", "Barge Village", "Ber Dairas", "Deishel", "el-Tasri", "Ghouref", "High Asarwe", "Khesselim", "Low Asarwe", 
        "Mermoune", "Binsada (undefined)"], 
    "Binsada": {iPopulation: 40000, sSource: "Player's Secrets of Binsada", sType: "region"}, 
    "Andujar": {iPopulation: 5500, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "Barge Village": {iPopulation: 1000, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "Ber Dairas": {iPopulation: 10000, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "Deishel": {iPopulation: 1785, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "el-Tasri": {iPopulation: 3570, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "Ghouref": {iPopulation: 1785, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "High Asarwe": {iPopulation: 4994, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "Khesselim": {iPopulation: 1785, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "Low Asarwe": {iPopulation: 4994, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "Mermoune": {iPopulation: 3570, sSource: "Player's Secrets of Binsada", sType: "settlement"}, 
    "Binsada (undefined)": {iPopulation: 1017, sType: "undefined"}, 
    "aDiemed": ["Aerele", "Bliene", "Ciliene", "Duene", "Moere", "Tier"], 
    "Diemed": {iPopulation: 212164, sType: "region"}, 
    "aAerele": ["Aerele City", "Kaeren Downs", "Aerele (undefined)"], 
    "Aerele": {iPopulation: 50513, sType: "region"}, 
    "Aerele City": {iPopulation: 25000, Human: 90, "Half-Elf": 6, Halfling: 2, other: 2, sSource: "Domain of Diemed", sType: "settlement"}, 
    "Kaeren Downs": {iPopulation: 1000, sSource: "Domain of Diemed", sType: "compound"}, 
    "Aerele (undefined)": {iPopulation: 24513, sType: "undefined"}, 
    "aBliene": ["Loraine", "Bliene (undefined)"], 
    "Bliene": {iPopulation: 5172, Human: 94, Dwarf: 5, other: 1, sType: "region"}, 
    "Loraine": {iPopulation: 2650, Human: 94, Dwarf: 5, other: 1, sSource: "Domain of Diemed", sType: "settlement"}, 
    "Bliene (undefined)": {iPopulation: 2522, Human: 94, Dwarf: 5, other: 1, sType: "undefined"}, 
    "aCiliene": ["Shaelinn", "Ciliene (undefined)"], 
    "Ciliene": {iPopulation: 47398, Human: 96, "Half-Elf": 2, other: 2, sType: "region"}, 
    "Shaelinn": {iPopulation: 24275, Human: 96, "Half-Elf": 2, other: 2, sSource: "Domain of Diemed", sType: "settlement"}, 
    "Ciliene (undefined)": {iPopulation: 23123, Human: 96, "Half-Elf": 2, other: 2, sType: "undefined"}, 
    "aDuene": ["Faramar", "Duene (undefined)"], 
    "Duene": {iPopulation: 5877, Human: 90, "Half-Elf": 6, Halfling: 2, other: 2, sType: "region"}, 
    "Faramar": {iPopulation: 3000, Human: 90, "Half-Elf": 6, Halfling: 2, other: 2, sSource: "Domain of Diemed", sType: "settlement"}, 
    "Duene (undefined)": {iPopulation: 2877, Human: 90, "Half-Elf": 6, Halfling: 2, other: 2, sType: "undefined"}, 
    "aMoere": ["Moerel", "Moere (undefined)"], 
    "Moere": {iPopulation: 97985, Human: 87, "Half-Elf": 7, Halfling: 4, other: 2, sType: "region"}, 
    "Moerel": {iPopulation: 50000, Human: 87, "Half-Elf": 7, Halfling: 4, other: 2, sSource: "Domain of Diemed", sType: "settlement"}, 
    "Moere (undefined)": {iPopulation: 47985, Human: 87, "Half-Elf": 7, Halfling: 4, other: 2, sType: "undefined"}, 
    "aTier": ["Tieren", "Tier (undefined)"], 
    "Tier": {iPopulation: 5219, Human: 96, "Half-Elf": 2, other: 2, sType: "region"}, 
    "Tieren": {iPopulation: 2650, Human: 96, "Half-Elf": 2, other: 2, sSource: "Domain of Diemed", sType: "settlement"}, 
    "Tier (undefined)": {iPopulation: 2569, Human: 96, "Half-Elf": 2, other: 2, sType: "undefined"}, 
    "aEndier": ["Edgelin", "Half Day", "Highland", "Michael's Bluff", "Morildon", "Piercalm", "Rivervale"], 
    "Endier": {iPopulation: 40000, sSource: "Player's Secrets of Endier", sType: "settlement"}, 
    "Edgelin": {iPopulation: 1500, sSource: "Player's Secrets of Endier", sType: "settlement"}, 
    "Half Day": {iPopulation: 2500, sSource: "Player's Secrets of Endier", sType: "settlement"}, 
    "Highland": {iPopulation: 1000, sSource: "Player's Secrets of Endier", sType: "settlement"}, 
    "Michael's Bluff": {iPopulation: 500, sSource: "Player's Secrets of Endier", sType: "settlement"}, 
    "Morildon": {iPopulation: 2000, sSource: "Player's Secrets of Endier", sType: "settlement"}, 
    "Piercalm": {iPopulation: 1000, sSource: "Player's Secrets of Endier", sType: "settlement"}, 
    "Rivervale": {iPopulation: 1250, sSource: "Player's Secrets of Endier", sType: "settlement"}, 
    "aIllien(region)": ["Illien (settlement)", "Illien (region) (undefined)"], 
    "Illien (region)": {iPopulation: 137900, sType: "region"}, 
    "Illien (settlement)": {iPopulation: 70000, sSource: "Player's Secrets of Illien", sType: "settlement"}, 
    "Illien (region) (undefined)": {iPopulation: 67900, sType: "undefined"}, 
    "aKhourane": ["Adeid", "Barein", "Ber Falaia (region)", "Bicheda", "El-Sirte", "Ghourin", "Sahadein", "South Ibnoume", "Tuarmine", "Zulaf"], 
    "Khourane": {iPopulation: 48503, sType: "region"}, 
    "aAdeid": ["Hallam", "Tamir", "Yazira", "Adeid (undefined)"], 
    "Adeid": {iPopulation: 4749, sType: "region"}, 
    "Hallam": {iPopulation: 900, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Tamir": {iPopulation: 600, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Yazira": {iPopulation: 900, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Adeid (undefined)": {iPopulation: 2349, sType: "undefined"}, 
    "aBarein": ["Marala", "Barein (undefined)"], 
    "Barein": {iPopulation: 3562, sType: "region"}, 
    "Marala": {iPopulation: 1800, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Barein (undefined)": {iPopulation: 1762, sType: "undefined"}, 
    "aBerFalaia(region)": ["Ber Falaia (settlement)", "Falaset", "Ber Falaia (region) (undefined)"], 
    "Ber Falaia (region)": {iPopulation: 10688, sType: "region"}, 
    "Ber Falaia (settlement)": {iPopulation: 5000, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Falaset": {iPopulation: 400, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Ber Falaia (region) (undefined)": {iPopulation: 5288, sType: "undefined"}, 
    "aBicheda": ["Bebrid", "Bicheda (undefined)"], 
    "Bicheda": {iPopulation: 2969, sType: "region"}, 
    "Bebrid": {iPopulation: 1500, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Bicheda (undefined)": {iPopulation: 1469, sType: "undefined"}, 
    "aEl-Sirte": ["Yariz", "El-Sirte (undefined)"], 
    "El-Sirte": {iPopulation: 1782, sType: "region"}, 
    "Yariz": {iPopulation: 900, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "El-Sirte (undefined)": {iPopulation: 882, sType: "undefined"}, 
    "aGhourin": ["Mariele", "Ghourin (undefined)"], 
    "Ghourin": {iPopulation: 2376, sType: "region"}, 
    "Mariele": {iPopulation: 1200, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Ghourin (undefined)": {iPopulation: 1176, sType: "undefined"}, 
    "aSahadein": ["Maja", "Sahadein (undefined)"], 
    "Sahadein": {iPopulation: 2178, sType: "region"}, 
    "Maja": {iPopulation: 1100, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Sahadein (undefined)": {iPopulation: 1078, sType: "undefined"}, 
    "aSouthIbnoume": ["Ibnam", "Ibnim", "South Ibnoume (undefined)"], 
    "South Ibnoume": {iPopulation: 5940, sType: "region"}, 
    "Ibnam": {iPopulation: 1500, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Ibnim": {iPopulation: 1500, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "South Ibnoume (undefined)": {iPopulation: 2940, sType: "undefined"}, 
    "aTuarmine": ["Dhotir", "Rammelan", "Tuarmine (undefined)"], 
    "Tuarmine": {iPopulation: 4357, sType: "region"}, 
    "Dhotir": {iPopulation: 600, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Rammelan": {iPopulation: 1600, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Tuarmine (undefined)": {iPopulation: 2157, sType: "undefined"}, 
    "aZulaf": ["Moura", "Zulaf (undefined)"], 
    "Zulaf": {iPopulation: 9902, sType: "region"}, 
    "Moura": {iPopulation: 5000, sSource: "Player's Secrets of Khourane", sType: "settlement"}, 
    "Zulaf (undefined)": {iPopulation: 4902, sType: "undefined"}, 
    "aMedoere": ["Alamier", "Braeme", "Caerwil"], 
    "Medoere": {iPopulation: 40000, sSource: "Player's Secrets of Medoere", sType: "region"}, 
    "Alamier": {iPopulation: 18000, sSource: "Player's Secrets of Medoere", sType: "region"}, 
    "Braeme": {iPopulation: 13000, sSource: "Player's Secrets of Medoere", sType: "region"}, 
    "Caerwil": {iPopulation: 9000, sSource: "Player's Secrets of Medoere", sType: "region"}, 
    "aMuden": ["Brechlen", "Halsarm", "Holr", "Polluciden", "Saamen", "Sagumveit", "Trizenleid", "Muden (undefined)"], 
    "Muden": {iPopulation: 259500, sSource: "Muden", sType: "region"}, 
    "Brechlen": {iPopulation: 43984, sSource: "Muden", sType: "settlement"}, 
    "Halsarm": {iPopulation: 12140, sSource: "Muden", sType: "settlement"}, 
    "Holr": {iPopulation: 8750, sSource: "Muden", sType: "settlement"}, 
    "Polluciden": {iPopulation: 3169, sSource: "Muden", sType: "settlement"}, 
    "Saamen": {iPopulation: 40859, sSource: "Muden", sType: "settlement"}, 
    "Sagumveit": {iPopulation: 3285, sSource: "Muden", sType: "settlement"}, 
    "Trizenleid": {iPopulation: 9411, sSource: "Muden", sType: "settlement"}, 
    "Muden (undefined)": {iPopulation: 137902, sType: "undefined"}, 
    "aRoesone": ["Bellam", "Caercas", "Ghoried", "Roesone (undefined)"], 
    "Roesone": {iPopulation: 75000, sSource: "Player's Secrets of Roesone", sType: "region"}, 
    "aBellam": ["Gheadan", "Bellam (undefined)"], 
    "Bellam": {iPopulation: 3962, sType: "region"}, 
    "Gheadan": {iPopulation: 2000, sSource: "Player's Secrets of Roesone", sType: "settlement"}, 
    "Bellam (undefined)": {iPopulation: 1962, sType: "undefined"}, 
    "aCaercas": ["Proudglaive", "Caercas (undefined)"], 
    "Caercas": {iPopulation: 10000, sSource: "Ruins of Empire", sType: "region"}, 
    "Proudglaive": {iPopulation: 8000, sSource: "Player's Secrets of Roesone", sType: "settlement"}, 
    "Caercas (undefined)": {iPopulation: 2000, sType: "undefined"}, 
    "aGhoried": ["Thoeren's Landing", "Ghoried (undefined)"], 
    "Ghoried": {iPopulation: 792, sType: "region"}, 
    "Thoeren's Landing": {iPopulation: 400, sSource: "Player's Secrets of Roesone", sType: "settlement"}, 
    "Ghoried (undefined)": {iPopulation: 392, sType: "undefined"}, 
    "Roesone (undefined)": {iPopulation: 60246, sType: "undefined"}, 
    "aTalinie": ["Nowelton", "Talinie (undefined)"], 
    "Talinie": {iPopulation: 70000, sSource: "Player's Secrets of Talinie", sType: "region"}, 
    "Nowelton": {iPopulation: 12000, sSource: "Player's Secrets of Talinie", sType: "settlement"}, 
    "Talinie (undefined)": {iPopulation: 58000, sType: "undefined"}, 
    "aTuarhievel": ["Avallaigh", "Bhindraith", "Braethindry", "Cwmbheir", "Cymryr", "Dhoneaghimiere", "Ilyrandor"], 
    "Tuarhievel": {iPopulation: 68057, Elf: 93, "Half-Elf": 4, Halfling: 2, other: 1, sType: "region"}, 
    "aAvallaigh": ["Dagasim", "Avallaigh (undefined)"], 
    "Avallaigh": {iPopulation: 6061, Elf: 99, other: 1, sType: "region"}, 
    "Dagasim": {iPopulation: 3030, Elf: 99, other: 1, sSource: "Player's Secrets of Tuarhievel", sType: "settlement"}, 
    "Avallaigh (undefined)": {iPopulation: 3031, Elf: 99, other: 1, sType: "undefined"}, 
    "aBhindraith": ["House Tuarlacheim", "Bhindraith (undefined)"], 
    "Bhindraith": {iPopulation: 5051, Elf: 99, other: 1, sType: "region"}, 
    "House Tuarlacheim": {iPopulation: 2525, Elf: 99, other: 1, sSource: "Player's Secrets of Tuarhievel", sType: "settlement"}, 
    "Bhindraith (undefined)": {iPopulation: 2526, Elf: 99, other: 1, sType: "undefined"}, 
    "Braethindry": {iPopulation: 9595, Elf: 78, "Half-Elf": 16, Halfling: 5, other: 1, sSource: "Player's Secrets of Tuarhievel", sType: "region"}, 
    "Cwmbheir": {iPopulation: 32200, Elf: 96, "Half-Elf": 3, other: 1, sSource: "Player's Secrets of Tuarhievel", sType: "region"}, 
    "Cymryr": {iPopulation: 9090, Elf: 87, Halfling: 12, other: 1, sSource: "Player's Secrets of Tuarhievel", sType: "region"}, 
    "Dhoneaghimiere": {iPopulation: 4545, Elf: 99, other: 1, sSource: "Player's Secrets of Tuarhievel", sType: "region"}, 
    "Ilyrandor": {iPopulation: 1515, Elf: 99, other: 1, sSource: "Player's Secrets of Tuarhievel", sType: "region"}, 
    "aTuornen": ["Elevesnemiere", "Ghonallison", "Haesrien", "Monsedge", "Nabhriene", "Pechalinn"], 
    "Tuornen": {iPopulation: 20001, sType: "region"}, 
    "aElevesnemiere": ["Benton", "Eame", "Elevesnemiere (undefined)"], 
    "Elevesnemiere": {iPopulation: 2800, sType: "region"}, 
    "Benton": {iPopulation: 700, sSource: "Player's Secrets of Tuornen", sType: "settlement"}, 
    "Eame": {iPopulation: 700, sSource: "Player's Secrets of Tuornen", sType: "settlement"}, 
    "Elevesnemiere (undefined)": {iPopulation: 1400, sType: "undefined"}, 
    "aGhonallison": ["Fox Run", "Ghonallison (undefined)"], 
    "Ghonallison": {iPopulation: 2000, sType: "region"}, 
    "Fox Run": {iPopulation: 1000, sSource: "Player's Secrets of Tuornen", sType: "settlement"}, 
    "Ghonallison (undefined)": {iPopulation: 1000, sType: "undefined"}, 
    "aHaesrien": ["Haes", "Haesrien (undefined)"], 
    "Haesrien": {iPopulation: 12001, sType: "region"}, 
    "Haes": {iPopulation: 6000, sSource: "Player's Secrets of Tuornen", sType: "settlement"}, 
    "Haesrien (undefined)": {iPopulation: 6001, sType: "undefined"}, 
    "aMonsedge": ["Croaker Norge", "Monsedge (undefined)"], 
    "Monsedge": {iPopulation: 1200, sType: "region"}, 
    "Croaker Norge": {iPopulation: 600, sSource: "Player's Secrets of Tuornen", sType: "settlement"}, 
    "Monsedge (undefined)": {iPopulation: 600, sType: "undefined"}, 
    "aNabhriene": ["Avanfair", "Nabhriene (undefined)"], 
    "Nabhriene": {iPopulation: 1600, sType: "region"}, 
    "Avanfair": {iPopulation: 800, sSource: "Player's Secrets of Tuornen", sType: "settlement"}, 
    "Nabhriene (undefined)": {iPopulation: 800, sType: "undefined"}, 
    "aPechalinn": ["Merrel", "Twin Pines", "Pechalinn (undefined)"], 
    "Pechalinn": {iPopulation: 400, sType: "region"}, 
    "Merrel": {iPopulation: 100, sSource: "Player's Secrets of Tuornen", sType: "settlement"}, 
    "Twin Pines": {iPopulation: 100, sSource: "Player's Secrets of Tuornen", sType: "settlement"}, 
    "Pechalinn (undefined)": {iPopulation: 200, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Blackmoor"] = {
    "aBlackmoor": ["Blackmoor (region)", "Elven Lands", "Hak", "Regent of the Mines", "Ten"], 
    "aBlackmoor(region)": ["Archlis", "Boggy Bottom", "Booh", "Blackmoor (settlement)", "Bramwald", "Cloudtop", "Coot's Watch", "Dragonia", 
        "Erak", "Glendower", "Jackport", "Kenville", "Lake Gloomy", "Maus", "Newgate", "Ramshead", "South Pim", "Vestfold", "Williamsfort", 
        "Wizard's Watch", "Blackmoor (region) (undefined)"], 
    "Blackmoor (region)": {iPopulation: 70000, sSource: "Dave Arneson's Blackmoor", sType: "region"}, 
    "Archlis": {iPopulation: 1100, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Boggy Bottom": {iPopulation: 1700, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Booh": {iPopulation: 2700, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Blackmoor (settlement)": {iPopulation: 5400, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Bramwald": {iPopulation: 4100, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Cloudtop": {iPopulation: 1, sSource: "Dave Arneson's Blackmoor", sType: "compound"}, 
    "Coot's Watch": {iPopulation: 50, sSource: "Dave Arneson's Blackmoor", sType: "compound"}, 
    "Dragonia": {iPopulation: 1200, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Erak": {iPopulation: 1350, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Glendower": {iPopulation: 2300, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Jackport": {iPopulation: 1500, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Kenville": {iPopulation: 1300, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Lake Gloomy": {iPopulation: 1450, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Maus": {iPopulation: 18800, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Newgate": {iPopulation: 2900, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Ramshead": {iPopulation: 1000, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "South Pim": {iPopulation: 950, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Vestfold": {iPopulation: 5600, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Williamsfort": {iPopulation: 1400, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Wizard's Watch": {iPopulation: 70, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Blackmoor (region) (undefined)": {iPopulation: 15129, sType: "undefined"}, 
    "aElvenLands": ["Cumasti", "Westryn"], 
    "Elven Lands": {iPopulation: 7300, Elf: 80, Human: 11, Halfling: 5, Gnome: 2, Dwarf: 1, other: 1, sType: "region"}, 
    "aCumasti": ["Cicatri Down", "Ringio Hall", "Cumasti (undefined)"], 
    "Cumasti": {iPopulation: 4200, Elf: 68, Human: 20, Halfling: 7, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "region"}, 
    "Cicatri Down": {iPopulation: 450, Elf: 99, other: 1, sSource: "Redwood Scar", sType: "settlement"}, 
    "Ringio Hall": {iPopulation: 2900, Elf: 68, Human: 20, Halfling: 7, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "compound"}, 
    "Cumasti (undefined)": {iPopulation: 850, Elf: 68, Human: 20, Halfling: 7, Gnome: 2, Dwarf: 2, other: 1, sType: "undefined"}, 
    "Westryn": {iPopulation: 3100, Elf: 96, Halfling: 2, Gnome: 1, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "region"}, 
    "Hak": {iPopulation: 7400, sSource: "Dave Arneson's Blackmoor", sType: "region"}, 
    "Regent of the Mines": {iPopulation: 9300, sSource: "Dave Arneson's Blackmoor", sType: "region"}, 
    "aTen": ["Hanford", "Oktagern", "Port Dacoit", "Robinsport", "Rusagern", "Silverbell", "Starmorgan", "Ten (undefined)"], 
    "Ten": {iPopulation: 78000, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "region"}, 
    "Hanford": {iPopulation: 3100, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Oktagern": {iPopulation: 1350, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Port Dacoit": {iPopulation: 4200, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Robinsport": {iPopulation: 4900, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Rusagern": {iPopulation: 1800, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Silverbell": {iPopulation: 1100, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "settlement"}, 
    "Starmorgan": {iPopulation: 5700, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sSource: "Dave Arneson's Blackmoor", sType: "compound"}, 
    "Ten (undefined)": {iPopulation: 55850, Human: 82, Halfling: 5, "Half-Orc": 5, Elf: 3, Gnome: 2, Dwarf: 2, other: 1, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Council of Wyrms"] = {
    "aCouncilofWyrms": ["Io's Blood Isles", "Land of the Fire Giants", "Land of the Frost Giants"], 
    "aIo'sBloodIsles": ["Northern Isles", "Southern Isles", "Temperate Isles"], 
    "Io's Blood Isles": {iPopulation: 0, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aNorthernIsles": ["Barren Isle", "Coldfire Island", "Desolate Isle", "Everwinter", "Glacianta", "Moonlight", "Sparkle"], 
    "Northern Isles": {iPopulation: 150030, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aBarrenIsle": ["Glaris", "Barren Isle (undefined)"], 
    "Barren Isle": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Glaris": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Barren Isle (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aColdfireIsland": ["Coldfire", "Coldfire Island (undefined)"], 
    "Coldfire Island": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Coldfire": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Coldfire Island (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aDesolateIsle": ["Coldshard", "Icewing Dale", "Desolate Isle (undefined)"], 
    "Desolate Isle": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Coldshard": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Icewing Dale": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Desolate Isle (undefined)": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aEverwinter": ["Coldtown", "Everwinter City", "Iceteeth", "Regalen", "Everwinter (undefined)"], 
    "Everwinter": {iPopulation: 40008, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Coldtown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Everwinter City": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Iceteeth": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Regalen": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Everwinter (undefined)": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aGlacianta": ["City of the Dawn", "Coldstream Junction", "Frostwind", "Foulsnow", "Glacianta (undefined)"], 
    "Glacianta": {iPopulation: 40008, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "City of the Dawn": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Coldstream Junction": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Frostwind": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Foulsnow": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Glacianta (undefined)": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aMoonlight": ["Illsnow", "Moonlight City", "Moonlight (undefined)"], 
    "Moonlight": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Illsnow": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Moonlight City": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Moonlight (undefined)": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aSparkle": ["Icedale", "Sparkle (undefined)"], 
    "Sparkle": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Icedale": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Sparkle (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aSouthernIsles": ["Aridia Isle", "Basilisk", "Bloodtide Island", "Dark Swamp", "Eastern Archipelago", "Eversand", "Fireshore Island", 
        "Flamestrike Isle", "Forbidden Isle", "Inferno", "Inferno's Tail", "Lightning", "Oracle", "Rockshore Isle", "Silver Island", 
        "Storm Island", "Wizard's Isle"], 
    "Southern Isles": {iPopulation: 533706, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aAridiaIsle": ["Brass Town", "Oasis", "Thunder", "Trade Town", "Aridia Isle (undefined)"], 
    "Aridia Isle": {iPopulation: 31806, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Brass Town": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Oasis": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Thunder": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Trade Town": {iPopulation: 900, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Aridia Isle (undefined)": {iPopulation: 15903, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "Basilisk": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aBloodtideIsland": ["Basktown", "Blacklair", "City of One Thousand Tales", "Hilltop", "Lowerrealm", "Malice", "Quietfire", "Seaside", 
        "Shadowtown", "Suntouch", "Triad", "Upperrealm", "Volcanis", "Bloodtide Island (undefined)"], 
    "Bloodtide Island": {iPopulation: 130026, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Basktown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Blacklair": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "City of One Thousand Tales": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Hilltop": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Lowerrealm": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Malice": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Quietfire": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Seaside": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Shadowtown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Suntouch": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Triad": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Upperrealm": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Volcanis": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Bloodtide Island (undefined)": {iPopulation: 65013, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aDarkSwamp": ["Blackwater", "Brighttown", "Nightshriek", "Stoneproud", "Dark Swamp (undefined)"], 
    "Dark Swamp": {iPopulation: 40008, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Blackwater": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Brighttown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Nightshriek": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Stoneproud": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Dark Swamp (undefined)": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "Eastern Archipelago": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aEversand": ["Blazetown", "Five Dunes", "Eversand (undefined)"], 
    "Eversand": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Blazetown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Five Dunes": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Eversand (undefined)": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aFireshoreIsland": ["Becubarb", "Boghold", "Bottomtown", "Brokenland", "Cliffside", "Darknight", "Draconis", "Firelake City", 
        "Glittercave", "Hightide", "Keening", "Magma", "Phlarest", "Summit", "Toptown", "Water's Edge", "Fireshore Island (undefined)"], 
    "Fireshore Island": {iPopulation: 160032, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Becubarb": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Boghold": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Bottomtown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Brokenland": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Cliffside": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Darknight": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Draconis": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Firelake City": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Glittercave": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Hightide": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Keening": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Magma": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Phlarest": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Summit": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Toptown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Water's Edge": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Fireshore Island (undefined)": {iPopulation: 80016, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aFlamestrikeIsle": ["Sparkis", "Flamestrike Isle (undefined)"], 
    "Flamestrike Isle": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Sparkis": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Flamestrike Isle (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "Forbidden Isle": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aInferno": ["Azurial", "Furnace", "Sandtown", "Inferno (undefined)"], 
    "Inferno": {iPopulation: 30006, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Azurial": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Furnace": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Sandtown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Inferno (undefined)": {iPopulation: 15003, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "Inferno's Tail": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aLightning": ["Broken Mt.", "Redsand", "Lightning (undefined)"], 
    "Lightning": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Broken Mt.": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Redsand": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Lightning (undefined)": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "Oracle": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aRockshoreIsle": ["Cracked Peak", "Cutharn", "Rockshore Isle (undefined)"], 
    "Rockshore Isle": {iPopulation: 11802, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Cracked Peak": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Cutharn": {iPopulation: 900, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Rockshore Isle (undefined)": {iPopulation: 5901, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aSilverIsland": ["City of Mists", "Cloud City", "Pinnacle", "Silver Island (undefined)"], 
    "Silver Island": {iPopulation: 30006, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "City of Mists": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Cloud City": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Pinnacle": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Silver Island (undefined)": {iPopulation: 15003, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aStormIsland": ["Darkmoon", "Lastlight", "Storm Island (undefined)"], 
    "Storm Island": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Darkmoon": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Lastlight": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Storm Island (undefined)": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "Wizard's Isle": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aTemperateIsles": ["All Clans Island", "Emerald Isle", "Dark Cloud", "Exaudron", "Fang Isle", "Jade Isle", "Majyst Isle", "Splendor", 
        "Starshine", "Sunblaze Isle", "Triumph"], 
    "Temperate Isles": {iPopulation: 196839, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aAllClansIsland": ["Council Aerie", "All Clans Island (undefined)"], 
    "All Clans Island": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Council Aerie": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "All Clans Island (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aDarkCloud": ["Darkcloud", "Dark Cloud (undefined)"], 
    "Dark Cloud": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Darkcloud": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Dark Cloud (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aEmeraldIsle": ["Baraster", "Foulgrove", "Emerald Isle (undefined)"], 
    "Emerald Isle": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Baraster": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Foulgrove": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Emerald Isle (undefined)": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aExaudron": ["City of Gold", "City of Law", "Coral City", "Maelstrom", "Summer City", "Twin Tree", "Exaudron (undefined)"], 
    "Exaudron": {iPopulation: 60012, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "City of Gold": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "City of Law": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Coral City": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Maelstrom": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Summer City": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Twin Tree": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Exaudron (undefined)": {iPopulation: 30006, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "Fang Isle": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "aJadeIsle": ["Jadetown", "Jade Isle (undefined)"], 
    "Jade Isle": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Jadetown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Jade Isle (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aMajystIsle": ["Clear Lake", "Dwarftown", "Majyst Isle (undefined)"], 
    "Majyst Isle": {iPopulation: 11802, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Clear Lake": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Dwarftown": {iPopulation: 900, Dwarf: 90, Gnome: 6, Human: 3, other: 1, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Majyst Isle (undefined)": {iPopulation: 5901, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aSplendor": ["Evilwood", "Magnificence", "Watertown", "Splendor (undefined)"], 
    "Splendor": {iPopulation: 30006, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Evilwood": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Magnificence": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Watertown": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Splendor (undefined)": {iPopulation: 15003, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aStarshine": ["Stardust", "Topaz", "Veriste", "Starshine (undefined)"], 
    "Starshine": {iPopulation: 20004, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Stardust": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Topaz": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Veriste": {iPopulation: 0, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Starshine (undefined)": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aSunblazeIsle": ["City of the Sun", "Sunblaze Isle (undefined)"], 
    "Sunblaze Isle": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "City of the Sun": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Sunblaze Isle (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "aTriumph": ["Triumphus", "Triumph (undefined)"], 
    "Triumph": {iPopulation: 10002, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "region"}, 
    "Triumphus": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "settlement"}, 
    "Triumph (undefined)": {iPopulation: 5001, Dragon: 60, "Half-Dragon": 20, Kindred: 15, other: 5, sSource: "Council of Wyrms", sType: "undefined"}, 
    "Land of the Fire Giants": {iPopulation: 0, "Fire Giant": 99, other: 1, sSource: "Council of Wyrms", sType: "region"}, 
    "Land of the Frost Giants": {iPopulation: 0, "Frost Giant": 99, other: 1, sSource: "Council of Wyrms", sType: "region"}, 
    sType: "region"
};

oNIB.oSettings["Dark Sun"] = {
    "aDarkSun": ["Balic", "Draj", "Eldaarich", "Gulg", "Kurn", "Nibenay", "Pterran Vale", "Raam", "Saragar", "Thamasku", "Tyr", "Urik", 
        "Winter's Nest"], 
    "aBallic": ["Altaruk", "Last Port", "Walis"], 
    "Balic": {iPopulation: 28000, Human: 78, Dwarf: 8, Elf: 4, "Half-Giant": 4, Mul: 3, "Thri-Kreen": 2, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Altaruk": {iPopulation: 620, Human: 78, Dwarf: 8, Elf: 4, "Half-Giant": 4, Mul: 3, "Thri-Kreen": 2, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Last Port": {iPopulation: 200, Human: 78, Dwarf: 8, Elf: 4, "Half-Giant": 4, Mul: 3, "Thri-Kreen": 2, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Walis": {iPopulation: 120, Human: 78, Dwarf: 8, Elf: 4, "Half-Giant": 4, Mul: 3, "Thri-Kreen": 2, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "aDraj": ["Break Shore", "Bitter Well", "Ket", "Draj (undefined)"], 
    "Draj": {iPopulation: 15000, Human: 59, Dwarf: 15, Elf: 15, Mul: 5, "Half-Elf": 3, "Half-Giant": 2, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Break Shore": {iPopulation: 100, Human: 59, Dwarf: 15, Elf: 15, Mul: 5, "Half-Elf": 3, "Half-Giant": 2, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Bitter Well": {iPopulation: 100, Human: 59, Dwarf: 15, Elf: 15, Mul: 5, "Half-Elf": 3, "Half-Giant": 2, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Ket": {iPopulation: 500, Human: 59, Dwarf: 15, Elf: 15, Mul: 5, "Half-Elf": 3, "Half-Giant": 2, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Draj (undefined)": {iPopulation: 14300, Human: 59, Dwarf: 15, Elf: 15, Mul: 5, "Half-Elf": 3, "Half-Giant": 2, other: 1, sType: "undefined"}, 
    "Eldaarich": {iPopulation: 21000, Human: 85, Dwarf: 8, "Half-Giant": 4, Mul: 2, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "aGulg": ["Losthome", "Gulg (undefined)"], 
    "Gulg": {iPopulation: 13500, Human: 80, Elf: 7, Dwarf: 5, Mul: 3, "Half-Elf": 2, "Thri-Kreen": 2, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Losthome": {iPopulation: 60, Human: 80, Elf: 7, Dwarf: 5, Mul: 3, "Half-Elf": 2, "Thri-Kreen": 2, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Gulg (undefined)": {iPopulation: 13440, Human: 80, Elf: 7, Dwarf: 5, Mul: 3, "Half-Elf": 2, "Thri-Kreen": 2, other: 1, sType: "undefined"}, 
    "aKurn": ["Azeth's Rest", "Kurn (undefined)"], 
    "Kurn": {iPopulation: 18000, Human: 65, Elf: 10, Mul: 6, Aarakocra: 6, Dwarf: 5, "Half-Elf": 4, "Half-Giant": 3, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Azeth's Rest": {iPopulation: 900, Human: 65, Elf: 10, Mul: 6, Aarakocra: 6, Dwarf: 5, "Half-Elf": 4, "Half-Giant": 3, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Kurn (undefined)": {iPopulation: 17100, Human: 65, Elf: 10, Mul: 6, Aarakocra: 6, Dwarf: 5, "Half-Elf": 4, "Half-Giant": 3, other: 1, sType: "undefined"}, 
    "aNibenay": ["Cromlin", "Salt View", "Vavrek", "Nibenay (undefined)"], 
    "Nibenay": {iPopulation: 24000, Human: 60, "Half-Giant": 12, Dwarf: 10, Elf: 10, "Half-Elf": 4, Mul: 3, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Cromlin": {iPopulation: 150, Human: 60, "Half-Giant": 12, Dwarf: 10, Elf: 10, "Half-Elf": 4, Mul: 3, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Salt View": {iPopulation: 550, Human: 60, "Half-Giant": 12, Dwarf: 10, Elf: 10, "Half-Elf": 4, Mul: 3, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Vavrek": {iPopulation: 200, Human: 60, "Half-Giant": 12, Dwarf: 10, Elf: 10, "Half-Elf": 4, Mul: 3, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Nibenay (undefined)": {iPopulation: 23100, Human: 60, "Half-Giant": 12, Dwarf: 10, Elf: 10, "Half-Elf": 4, Mul: 3, other: 1, sType: "undefined"}, 
    "aPterranVale": ["Lost Scale", "Pterran Vale (undefined)"], 
    "Pterran Vale": {iPopulation: 4000, Pterran: 99, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Lost Scale": {iPopulation: 2000, Pterran: 99, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Pterran Vale (undefined)": {iPopulation: 2000, Pterran: 99, other: 1, sType: "undefined"}, 
    "aRaam": ["Daro", "Raam (undefined)"], 
    "Raam": {iPopulation: 40000, Human: 40, Dwarf: 20, Elf: 15, Mul: 10, "Half-Elf": 5, "Half-Giant": 5, "Thri-Kreen": 4, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Daro": {iPopulation: 300, Human: 40, Dwarf: 20, Elf: 15, Mul: 10, "Half-Elf": 5, "Half-Giant": 5, "Thri-Kreen": 4, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Raam (undefined)": {iPopulation: 39700, Human: 40, Dwarf: 20, Elf: 15, Mul: 10, "Half-Elf": 5, "Half-Giant": 5, "Thri-Kreen": 4, other: 1, sType: "undefined"}, 
    "aSaragar": ["Blufftown", "Cubarto", "Kharzden", "Shallat", "Sylvandretta", "Saragar (undefined)"], 
    "Saragar": {iPopulation: 30000, Human: 86, Elf: 6, Dwarf: 6, other: 2, sSource: "Dark Sun 3", sType: "region"}, 
    "Blufftown": {iPopulation: 50, Human: 86, Elf: 6, Dwarf: 6, other: 2, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Cubarto": {iPopulation: 1500, Human: 86, Elf: 6, Dwarf: 6, other: 2, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Kharzden": {iPopulation: 2000, Human: 86, Elf: 6, Dwarf: 6, other: 2, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Shallat": {iPopulation: 300, Human: 86, Elf: 6, Dwarf: 6, other: 2, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Sylvandretta": {iPopulation: 500, Human: 86, Elf: 6, Dwarf: 6, other: 2, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Saragar (undefined)": {iPopulation: 25650, Human: 86, Elf: 6, Dwarf: 6, other: 2, sType: "undefined"}, 
    "aThamasku": ["Sol-fehn", "Thamasku (undefined)"], 
    "Thamasku": {iPopulation: 12000, "Rhul-Thaun": 99, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Sol-fehn": {iPopulation: 300, "Rhul-Thaun": 99, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Thamasku (undefined)": {iPopulation: 11700, "Rhul-Thaun": 99, other: 1, sType: "undefined"}, 
    "aTyr": ["Hidden Village", "Kled", "Mira's Halo", "Tyr (undefined)"], 
    "Tyr": {iPopulation: 15000, Human: 70, Dwarf: 10, "Half-Giant": 9, Mul: 6, Elf: 3, "Half-Elf": 1, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Hidden Village": {iPopulation: 250, Human: 70, Dwarf: 10, "Half-Giant": 9, Mul: 6, Elf: 3, "Half-Elf": 1, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Kled": {iPopulation: 450, Human: 70, Dwarf: 10, "Half-Giant": 9, Mul: 6, Elf: 3, "Half-Elf": 1, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Mira's Halo": {iPopulation: 50, Human: 70, Dwarf: 10, "Half-Giant": 9, Mul: 6, Elf: 3, "Half-Elf": 1, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Tyr (undefined)": {iPopulation: 14250, Human: 70, Dwarf: 10, "Half-Giant": 9, Mul: 6, Elf: 3, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aUrik": ["Makla", "Urik (undefined)"], 
    "Urik": {iPopulation: 30000, Human: 75, "Half-Giant": 10, Dwarf: 5, Mul: 3, "Thri-Kreen": 3, Elf: 2, Halfling: 1, other: 1, sSource: "Dark Sun 3", sType: "region"}, 
    "Makla": {iPopulation: 1000, Human: 75, "Half-Giant": 10, Dwarf: 5, Mul: 3, "Thri-Kreen": 3, Elf: 2, Halfling: 1, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    "Urik (undefined)": {iPopulation: 29000, Human: 75, "Half-Giant": 10, Dwarf: 5, Mul: 3, "Thri-Kreen": 3, Elf: 2, Halfling: 1, other: 1, sType: "undefined"}, 
    "Winter's Nest": {iPopulation: 650, Aarakocra: 99, other: 1, sSource: "Dark Sun 3", sType: "settlement"}, 
    sType: "region"
};

oNIB.oSettings["Dragon Fist"] = {
    "aDragonFist": ["Tianguo", "Yi Barbarians"], 
    "aTianguo": ["Bei Ji", "Bi", "Hou", "Jing", "Qu Ti", "Shang Shen", "Tou", "Tui", "Xin"], 
    "Tianguo": {iPopulation: 120024, sSource: "Dragon Fist", sType: "region"}, 
    "aBeiJi": ["Anmei", "Jade Mountain Monastery", "Yekang", "Bei Ji (undefined)"], 
    "Bei Ji": {iPopulation: 30006, sSource: "Dragon Fist", sType: "region"}, 
    "Anmei": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Jade Mountain Monastery": {iPopulation: 5001, sSource: "Dragon Fist", sType: "compound"}, 
    "Yekang": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Bei Ji (undefined)": {iPopulation: 15003, sSource: "Dragon Fist", sType: "undefined"}, 
    "aBi": ["Huajian", "Bi (undefined)"], 
    "Bi": {iPopulation: 10002, sSource: "Dragon Fist", sType: "region"}, 
    "Huajian": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Bi (undefined)": {iPopulation: 5001, sSource: "Dragon Fist", sType: "undefined"}, 
    "aHou": ["Xing", "Hou (undefined)"], 
    "Hou": {iPopulation: 10002, sSource: "Dragon Fist", sType: "region"}, 
    "Xing": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Hou (undefined)": {iPopulation: 5001, sSource: "Dragon Fist", sType: "undefined"}, 
    "aJing": ["Peiding", "Jing (undefined)"], 
    "Jing": {iPopulation: 10002, sSource: "Dragon Fist", sType: "region"}, 
    "Peiding": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Jing (undefined)": {iPopulation: 5001, sSource: "Dragon Fist", sType: "undefined"}, 
    "aQuTi": ["Baixu", "Qu Ti (undefined)"], 
    "Qu Ti": {iPopulation: 10002, sSource: "Dragon Fist", sType: "region"}, 
    "Baixu": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Qu Ti (undefined)": {iPopulation: 5001, sSource: "Dragon Fist", sType: "undefined"}, 
    "aShangShen": ["Pangdong", "Shang Shen (undefined)"], 
    "Shang Shen": {iPopulation: 10002, sSource: "Dragon Fist", sType: "region"}, 
    "Pangdong": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Shang Shen (undefined)": {iPopulation: 5001, sSource: "Dragon Fist", sType: "undefined"}, 
    "aTou": ["Beisen", "Tou (undefined)"], 
    "Tou": {iPopulation: 10002, sSource: "Dragon Fist", sType: "region"}, 
    "Beisen": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Tou (undefined)": {iPopulation: 5001, sSource: "Dragon Fist", sType: "undefined"}, 
    "aTui": ["Kai", "Tui (undefined)"], 
    "Tui": {iPopulation: 10002, sSource: "Dragon Fist", sType: "region"}, 
    "Kai": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Tui (undefined)": {iPopulation: 5001, sSource: "Dragon Fist", sType: "undefined"}, 
    "aXin": ["Zuyang", "Huang Ren Mountain", "Xin (undefined)"], 
    "Xin": {iPopulation: 20004, sSource: "Dragon Fist", sType: "region"}, 
    "Zuyang": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Huang Ren Mountain": {iPopulation: 5001, sSource: "Dragon Fist", sType: "settlement"}, 
    "Xin (undefined)": {iPopulation: 10002, sSource: "Dragon Fist", sType: "undefined"}, 
    "Yi Barbarians": {iPopulation: 5001, sSource: "Dragon Fist", sType: "region"}, 
    sType: "region"
};

oNIB.oSettings["Dragonlance"] = {
    "aDragonlance": ["Abanasinia", "Balifor", "Blode", "Blood Sea Isles", "Castle Ulgurmere", "Cristyne", "Dragon Isles", "Estwilde", 
        "Goodlund", "Hylo (region)", "Icereach", "Kayolin", "Kern", "Kharolis", "Khur", "Lemish (region)", "Nordmaar", "Northern Ergoth", 
        "Ogrelands", "Plains of Dust", "Qualinesti", "Sancrist", "Schallsea", "Silvanesti", "Solamnia", "Southern Ergoth", "Taman Busuk", 
        "Teyr (region)", "Thorbardin", "Throtl (region)", "Zhakar"], 
    "aAbanasinia": ["Ankatavaka", "Crossing", "Haven", "New Ports", "Long Ridge", "Solace", "Abanasinia (undefined)"], 
    "Abanasinia": {iPopulation: 197016, Human: 74, Dwarf: 9, Centaur: 8, Goblin: 7, Draconian: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Ankatavaka": {iPopulation: 2256, Human: 74, Dwarf: 9, Centaur: 8, Goblin: 7, Draconian: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Crossing": {iPopulation: 1888, Human: 74, Dwarf: 9, Centaur: 8, Goblin: 7, Draconian: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Haven": {iPopulation: 14889, Human: 81, Kender: 8, Draconian: 3, Elf: 2, Dwarf: 2, Goblin: 2, Hobgoblin: 1, other: 1, sSource: "Dragons of Autumn", sType: "settlement"}, 
    "New Ports": {iPopulation: 3219, Human: 74, Dwarf: 9, Centaur: 8, Goblin: 7, Draconian: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Long Ridge": {iPopulation: 1876, Human: 74, Dwarf: 9, Centaur: 8, Goblin: 7, Draconian: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Solace": {iPopulation: 388, Human: 91, Dwarf: 3, "Half-Elf": 3, Goblin: 2, other: 1, sSource: "Dragons of Autumn", sType: "settlement"}, 
    "Abanasinia (undefined)": {iPopulation: 172500, Human: 74, Dwarf: 9, Centaur: 8, Goblin: 7, Draconian: 1, other: 1, sType: "undefined"}, 
    "aBalifor": ["Ak-Bodin", "Ak-Lir", "Ak-Matar", "Ak-Rol", "Brightfield", "Calihand", "Flotsam", "Patience", "Port Balifor", "Balifor (undefined)"], 
    "Balifor": {iPopulation: 88473, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Ak-Bodin": {iPopulation: 400, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ak-Lir": {iPopulation: 400, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ak-Matar": {iPopulation: 400, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ak-Rol": {iPopulation: 400, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Brightfield": {iPopulation: 576, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Calihand": {iPopulation: 1204, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Flotsam": {iPopulation: 3785, Human: 66, Gnome: 10, Kender: 6, "Gully Dwarf": 4, "Half-Elf": 3, Dwarf: 2, Elf: 2, "Half-Ogre": 2, other: 5, sSource: "Spectre of Sorrows", sType: "settlement"}, 
    "Patience": {iPopulation: 421, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Port Balifor": {iPopulation: 4325, Human: 84, Draconian: 6, Ogre: 5, Dwarf: 2, Elf: 1, Kender: 1, other: 1, sSource: "Dragons of Spring", sType: "settlement"}, 
    "Balifor (undefined)": {iPopulation: 76562, Human: 78, Kender: 15, Draconian: 2, Elf: 2, Dwarf: 1, Gnome: 1, other: 1, sType: "undefined"}, 
    "aBlode": ["Bloten", "Bludgeon", "Despair", "Hatl", "Langtree", "Shrentak", "Vantal", "Blode (undefined)"], 
    "Blode": {iPopulation: 127100, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Bloten": {iPopulation: 10672, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Bludgeon": {iPopulation: 772, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Despair": {iPopulation: 2871, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Hatl": {iPopulation: 3900, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Langtree": {iPopulation: 1891, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Shrentak": {iPopulation: 3775, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Vantal": {iPopulation: 6047, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Blode (undefined)": {iPopulation: 97172, Ogre: 70, Human: 20, Dwarf: 4, Centaur: 2, Giant: 2, Lizardfolk: 1, other: 1, sType: "undefined"}, 
    "aBloodSeaIsles": ["Alphens", "Crest", "Kalpethis", "Kuda", "Lacynos", "Pearl", "Sea Reach", "Shiv", "Blood Sea Isles (undefined)"], 
    "Blood Sea Isles": {iPopulation: 448416, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Alphens": {iPopulation: 566, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Crest": {iPopulation: 821, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Kalpethis": {iPopulation: 17095, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Kuda": {iPopulation: 856, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Lacynos": {iPopulation: 20457, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Pearl": {iPopulation: 1212, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Sea Reach": {iPopulation: 18500, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Shiv": {iPopulation: 1228, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Blood Sea Isles (undefined)": {iPopulation: 387681, Minotaur: 66, Human: 23, Kyrie: 10, other: 1, sType: "undefined"}, 
    "Castle Ulgurmere": {iPopulation: 1965, Human: 65, Draconian: 34, other: 1, sSource: "War of the Lance", sType: "compound"}, 
    "aCristyne": ["Merwick", "Cristyne (undefined)"], 
    "Cristyne": {iPopulation: 10461, Human: 37, Elf: 20, Dwarf: 14, "Half-Elf": 9, Kender: 9, Gnome: 5, "Gully Dwarf": 3, "Half-Ogre": 2, other: 1, sType: "region"}, 
    "Merwick": {iPopulation: 8125, Human: 37, Elf: 20, Dwarf: 14, "Half-Elf": 9, Kender: 9, Gnome: 5, "Gully Dwarf": 3, "Half-Ogre": 2, other: 1, sSource: "Price of Courage", sType: "settlement"}, 
    "Cristyne (undefined)": {iPopulation: 2336, Human: 37, Elf: 20, Dwarf: 14, "Half-Elf": 9, Kender: 9, Gnome: 5, "Gully Dwarf": 3, "Half-Ogre": 2, other: 1, sType: "undefined"}, 
    "aDragonIsles": ["Auralastican", "Dragon Isles (undefined)"], 
    "Dragon Isles": {iPopulation: 72656, Human: 60, Elf: 11, Dwarf: 8, Minotaur: 8, Kyrie: 5, Kender: 3, Goblin: 3, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Auralastican": {iPopulation: 7871, Human: 60, Elf: 11, Dwarf: 8, Minotaur: 8, Kyrie: 5, Kender: 3, Goblin: 3, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Dragon Isles (undefined)": {iPopulation: 64785, Human: 60, Elf: 11, Dwarf: 8, Minotaur: 8, Kyrie: 5, Kender: 3, Goblin: 3, Centaur: 1, other: 1, sType: "undefined"}, 
    "aEstwilde": ["Arl's Watch", "Firstwal", "Haltigoth", "Kalaman", "Kwinter Ranch", "Ohme", "Two Creek", "Wheatly", "Estwilde (undefined)"], 
    "Estwilde": {iPopulation: 47506, Human: 77, Goblin: 7, Ogre: 5, "Gully Dwarf": 5, Dwarf: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Arl's Watch": {iPopulation: 4511, Human: 77, Goblin: 7, Ogre: 5, "Gully Dwarf": 5, Dwarf: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Firstwal": {iPopulation: 1290, Human: 57, Dwarf: 18, Centaur: 15, Kender: 7, Hobgoblin: 2, other: 1, sSource: "Price of Courage", sType: "settlement"}, 
    "Haltigoth": {iPopulation: 17614, Human: 77, Goblin: 7, Ogre: 5, "Gully Dwarf": 5, Dwarf: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Kalaman": {iPopulation: 9267, Human: 82, Dwarf: 9, "Half-Elf": 5, "Half-Ogre": 3, other: 1, sSource: "Dragons of Spring", sType: "settlement"}, 
    "Kwinter Ranch": {iPopulation: 221, Human: 77, Goblin: 7, Ogre: 5, "Gully Dwarf": 5, Dwarf: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ohme": {iPopulation: 982, Human: 94, Goblin: 2, Dwarf: 1, "Half-Elf": 1, Kender: 1, other: 1, sSource: "Price of Courage", sType: "settlement"}, 
    "Two Creek": {iPopulation: 2738, Human: 77, Goblin: 7, Ogre: 5, "Gully Dwarf": 5, Dwarf: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Wheatly": {iPopulation: 198, Human: 77, Goblin: 7, Ogre: 5, "Gully Dwarf": 5, Dwarf: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Estwilde (undefined)": {iPopulation: 10685, Human: 77, Goblin: 7, Ogre: 5, "Gully Dwarf": 5, Dwarf: 3, Centaur: 2, other: 1, sType: "undefined"}, 
    "aGoodlund": ["Balinost", "Charred", "Falsh", "Hillshar", "Kendermore", "Khotaa", "Ripzh", "Ssthik", "Szlash", "Trade", "Woodsedge", "Goodlund (undefined)"], 
    "Goodlund": {iPopulation: 128272, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Balinost": {iPopulation: 817, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Charred": {iPopulation: 357, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Falsh": {iPopulation: 900, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Hillshar": {iPopulation: 126, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Kendermore": {iPopulation: 4821, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Khotaa": {iPopulation: 1918, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Ripzh": {iPopulation: 900, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ssthik": {iPopulation: 900, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Szlash": {iPopulation: 900, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Trade": {iPopulation: 389, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Woodsedge": {iPopulation: 1377, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Goodlund (undefined)": {iPopulation: 115670, Kender: 52, Human: 19, Slig: 10, Gnoll: 6, Elf: 5, Goblin: 4, Centaur: 2, Gnome: 1, other: 1, sType: "undefined"}, 
    "aHylo(region)": ["Gobwatch", "Hidal", "Hylo (settlement)", "Legup", "Lemon", "Lookit", "Ocean Town", "Thisway", "Tower", "Hylo (region) (undefined)"], 
    "Hylo (region)": {iPopulation: 91688, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "War of the Lance", sType: "region"}, 
    "Gobwatch": {iPopulation: 75, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Hidal": {iPopulation: 437, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Hylo (settlement)": {iPopulation: 19563, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Legup": {iPopulation: 745, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Lemon": {iPopulation: 4748, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Lookit": {iPopulation: 11076, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Ocean Town": {iPopulation: 533, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Thisway": {iPopulation: 649, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Tower": {iPopulation: 300, Kender: 85, Human: 8, Gnome: 4, other: 3, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Hylo (region) (undefined)": {iPopulation: 53562, Kender: 85, Human: 8, Gnome: 4, other: 3, sType: "undefined"}, 
    "aIcereach": ["Hallik", "Icewall Castle", "Kormesh", "Trandol", "Icereach (undefined)"], 
    "Icereach": {iPopulation: 3400, Human: 50, Thanoi: 47, Ettin: 2, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Hallik": {iPopulation: 721, Human: 50, Thanoi: 47, Ettin: 2, other: 1, sSource: "War of the Lance", sType: "settlement", sType: "settlement"}, 
    "Icewall Castle": {iPopulation: 800, Human: 50, Thanoi: 47, Ettin: 2, other: 1, sSource: "War of the Lance", sType: "compound"}, 
    "Kormesh": {iPopulation: 454, Human: 50, Thanoi: 47, Ettin: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Trandol": {iPopulation: 359, Human: 50, Thanoi: 47, Ettin: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Icereach (undefined)": {iPopulation: 1066, Human: 50, Thanoi: 47, Ettin: 2, other: 1, sType: "undefined"}, 
    "aKayolin": ["Crystal", "Facet", "Garnet-Thax", "Garnet Village", "Geale", "Knollwood", "Rubicon", "Spar", "Kayolin (undefined)"], 
    "Kayolin": {iPopulation: 86592, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Crystal": {iPopulation: 878, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Facet": {iPopulation: 1270, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Garnet-Thax": {iPopulation: 20003, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Garnet Village": {iPopulation: 521, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Geale": {iPopulation: 4199, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Knollwood": {iPopulation: 487, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Rubicon": {iPopulation: 2281, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Spar": {iPopulation: 2808, Dwarf: 93, Human: 6, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Kayolin (undefined)": {iPopulation: 54145, Dwarf: 93, Human: 6, other: 1, sType: "undefined"}, 
    "aKern": ["Hag's Dirk", "Kernen", "OgrEbend", "Sargonath", "Surf", "Kern (undefined)"], 
    "Kern": {iPopulation: 103206, Ogre: 85, Human: 8, "Half-Ogre": 3, Goblin: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Hag's Dirk": {iPopulation: 2651, Ogre: 85, Human: 8, "Half-Ogre": 3, Goblin: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Kernen": {iPopulation: 36887, Ogre: 85, Human: 8, "Half-Ogre": 3, Goblin: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "OgrEbend": {iPopulation: 3749, Ogre: 85, Human: 8, "Half-Ogre": 3, Goblin: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Sargonath": {iPopulation: 1900, Minotaur: 76, Human: 11, Ogre: 7, "Half-Ogre": 5, other: 1, sSource: "Spectre of Sorrows", sType: "settlement"}, 
    "Surf": {iPopulation: 460, "Sea Elf": 94, "Kuo-Toa": 5, other: 1, sSource: "Spectre of Sorrows", sType: "settlement"}, 
    "Kern (undefined)": {iPopulation: 57559, Ogre: 85, Human: 8, "Half-Ogre": 3, Goblin: 2, Centaur: 1, other: 1, sType: "undefined"}, 
    "aKharolis": ["Alsip", "Halter Wood", "Hamlet", "Pensdale", "Than-Kal", "Windkeep", "Kharolis (undefined)"], 
    "Kharolis": {iPopulation: 103206, Human: 72, Dwarf: 15, Goblin: 6, Hobgoblin: 3, Thanoi: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Alsip": {iPopulation: 3869, Human: 72, Dwarf: 15, Goblin: 6, Hobgoblin: 3, Thanoi: 2, Centaur: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Halter Wood": {iPopulation: 377, Human: 72, Dwarf: 15, Goblin: 6, Hobgoblin: 3, Thanoi: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Hamlet": {iPopulation: 855, Human: 72, Dwarf: 15, Goblin: 6, Hobgoblin: 3, Thanoi: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Pensdale": {iPopulation: 1776, Human: 72, Dwarf: 15, Goblin: 6, Hobgoblin: 3, Thanoi: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Than-Kal": {iPopulation: 4561, Human: 72, Dwarf: 15, Goblin: 6, Hobgoblin: 3, Thanoi: 2, Centaur: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Windkeep": {iPopulation: 481, Human: 72, Dwarf: 15, Goblin: 6, Hobgoblin: 3, Thanoi: 2, Centaur: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Kharolis (undefined)": {iPopulation: 91287, Human: 72, Dwarf: 15, Goblin: 6, Hobgoblin: 3, Thanoi: 2, Centaur: 1, other: 1, sType: "undefined"}, 
    "aKhur": ["Ak-Baral", "Ak-Khurman", "Ak-Tubal", "Alan Ak-Khan", "Delphon", "Khuri-Khan", "Kortal", "Pashin"], 
    "Khur": {iPopulation: 371760, Human: 82, Ogre: 10, Draconian: 4, Goblin: 3, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ak-Baral": {iPopulation: 2712, Human: 82, Ogre: 10, Draconian: 4, Goblin: 3, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ak-Khurman": {iPopulation: 9876, Human: 91, Elf: 5, Kender: 2, "Half-Elf": 1, other: 1, sSource: "Key of Destiny", sType: "settlement"}, 
    "Ak-Tubal": {iPopulation: 1232, Human: 82, Ogre: 10, Draconian: 4, Goblin: 3, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Alan Ak-Khan": {iPopulation: 732, Human: 82, Ogre: 10, Draconian: 4, Goblin: 3, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Delphon": {iPopulation: 18751, Human: 82, Ogre: 10, Draconian: 4, Goblin: 3, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Khuri-Khan": {iPopulation: 22424, Human: 82, Ogre: 10, Draconian: 4, Goblin: 3, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Kortal": {iPopulation: 868, Human: 82, Ogre: 10, Draconian: 4, Goblin: 3, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Pashin": {iPopulation: 2351, Human: 96, Kender: 2, Elf: 1, other: 1, sSource: "Key of Destiny", sType: "settlement"}, 
    "aLemish(region)": ["Caermish", "Chisel", "Elmwood", "Fangoth", "Fearfold", "Lemish (settlement)", "Walmish", "Wayfold", "Lemish (region) (undefined)"], 
    "Lemish (region)": {iPopulation: 20501, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Caermish": {iPopulation: 1204, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Chisel": {iPopulation: 131, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Elmwood": {iPopulation: 1677, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Fangoth": {iPopulation: 2541, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Fearfold": {iPopulation: 1034, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Lemish (settlement)": {iPopulation: 10873, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Walmish": {iPopulation: 1204, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Wayfold": {iPopulation: 213, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Lemish (region) (undefined)": {iPopulation: 1624, Human: 79, Hobgoblin: 15, Draconian: 5, other: 1, sType: "undefined"}, 
    "aNordmaar": ["Border Keep", "Jachim", "Jotan", "Jennison", "North Keep", "Pentar", "Picketville", "Ungar", "Willik", "Wulfgar", "Nordmaar (undefined)"], 
    "Nordmaar": {iPopulation: 264176, Human: 82, Lizardfolk: 4, Draconian: 4, Ogre: 3, Dwarf: 2, Elf: 2, Kender: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Border Keep": {iPopulation: 90, Human: 78, "Half-Elf": 10, Elf: 6, Dwarf: 3, "Kapak Draconian": 2, other: 1, sSource: "Price of Courage", sType: "compound"}, 
    "Jachim": {iPopulation: 5829, Human: 82, Lizardfolk: 4, Draconian: 4, Ogre: 3, Dwarf: 2, Elf: 2, Kender: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Jotan": {iPopulation: 900, Human: 82, Lizardfolk: 4, Draconian: 4, Ogre: 3, Dwarf: 2, Elf: 2, Kender: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Jennison": {iPopulation: 701, Human: 82, Lizardfolk: 4, Draconian: 4, Ogre: 3, Dwarf: 2, Elf: 2, Kender: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "North Keep": {iPopulation: 22326, Human: 82, Lizardfolk: 4, Draconian: 4, Ogre: 3, Dwarf: 2, Elf: 2, Kender: 1, Gnome: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Pentar": {iPopulation: 4820, Human: 78, Kender: 9, Elf: 5, Minotaur: 3, Dwarf: 2, "Half-Ogre": 1, "Half-Elf": 1, other: 1, sSource: "Price of Courage", sType: "settlement"}, 
    "Picketville": {iPopulation: 310, "Wild Gnome": 99, other: 1, sSource: "Spectre of Sorrows", sType: "settlement"}, 
    "Ungar": {iPopulation: 900, Human: 82, Lizardfolk: 4, Draconian: 4, Ogre: 3, Dwarf: 2, Elf: 2, Kender: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Willik": {iPopulation: 4521, Human: 82, Lizardfolk: 4, Draconian: 4, Ogre: 3, Dwarf: 2, Elf: 2, Kender: 1, Gnome: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Wulfgar": {iPopulation: 5012, Human: 78, Elf: 9, "Half-Elf": 5, Kender: 3, Gnome: 2, "Gully Dwarf": 1, Dwarf: 1, other: 1, sSource: "Spectre of Sorrows", sType: "settlement"}, 
    "Nordmaar (undefined)": {iPopulation: 222396, Human: 82, Lizardfolk: 4, Draconian: 4, Ogre: 3, Dwarf: 2, Elf: 2, Kender: 1, Gnome: 1, other: 1, sType: "undefined"}, 
    "aNorthernErgoth": ["Beacon", "Dupre", "Gulfport", "Gwynned", "Hillfall", "Ker-Vakt", "Lancton", "Lusid", "Manic", "Northern Ergoth (undefined)"], 
    "Northern Ergoth": {iPopulation: 215049, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Beacon": {iPopulation: 329, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Dupre": {iPopulation: 351, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Gulfport": {iPopulation: 4204, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Gwynned": {iPopulation: 32304, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Hillfall": {iPopulation: 576, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ker-Vakt": {iPopulation: 481, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Lancton": {iPopulation: 14658, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Lusid": {iPopulation: 274, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Manic": {iPopulation: 1421, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Northern Ergoth (undefined)": {iPopulation: 160451, Human: 88, Goblin: 10, Dwarf: 1, other: 1, sType: "undefined"}, 
    "aOgrelands": ["Ogrebond", "Rockhorde", "Ogrelands (undefined)"], 
    "Ogrelands": {iPopulation: 9544, Ogre: 75, Goblin: 8, "Half-Ogre": 5, Human: 5, Elf: 3, "Gully Dwarf": 2, Kobold: 1, other: 1, sType: "region"}, 
    "Ogrebond": {iPopulation: 7207, Ogre: 76, Goblin: 8, "Half-Ogre": 5, Human: 5, Elf: 3, "Gully Dwarf": 2, other: 1, sSource: "Spectre of Sorrows", sType: "settlement"}, 
    "Rockhorde": {iPopulation: 120, Kobold: 77, Ogre: 22, other: 1, sSource: "Spectre of Sorrows", sType: "settlement"}, 
    "Ogrelands (undefined)": {iPopulation: 2217, Ogre: 75, Goblin: 8, "Half-Ogre": 5, Human: 5, Elf: 3, "Gully Dwarf": 2, Kobold: 1, other: 1, sType: "undefined"}, 
    "aPlainsofDust": ["Duntol", "Hopeful", "Missing City", "Qindaras", "Stone Rose", "Tarsis", "Wallach", "Willik", "Zeriak", "Plains of Dust (undefined)"], 
    "Plains of Dust": {iPopulation: 18978, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Duntol": {iPopulation: 853, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Hopeful": {iPopulation: 1177, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Missing City": {iPopulation: 5100, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Qindaras": {iPopulation: 2872, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Stone Rose": {iPopulation: 458, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Tarsis": {iPopulation: 4290, Human: 91, Dwarf: 3, Hobgoblin: 2, Elf: 1, Kender: 1, Draconian: 1, other: 1, sSource: "Dragons of Winter", sType: "settlement"}, 
    "Wallach": {iPopulation: 1894, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Willik": {iPopulation: 892, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Zeriak": {iPopulation: 943, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Plains of Dust (undefined)": {iPopulation: 499, Human: 81, Centaur: 13, Goblin: 3, Gnoll: 1, Thanoi: 1, other: 1, sType: "undefined"}, 
    "aQualinesti": ["Ahlinost", "Lauranost", "Porliost", "Qualinost", "Shrivost", "Qualinesti (undefined)"], 
    "Qualinesti": {iPopulation: 41760, Elf: 90, Dwarf: 4, Human: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Ahlinost": {iPopulation: 685, Elf: 90, Dwarf: 4, Human: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Lauranost": {iPopulation: 782, Elf: 90, Dwarf: 4, Human: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Porliost": {iPopulation: 3766, Elf: 90, Dwarf: 4, Human: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Qualinost": {iPopulation: 20159, Elf: 98, "Half-Elf": 1, other: 1, sSource: "Dragons of Autumn", sType: "settlement"}, 
    "Shrivost": {iPopulation: 998, Elf: 90, Dwarf: 4, Human: 3, Centaur: 2, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Qualinesti (undefined)": {iPopulation: 15370, Elf: 90, Dwarf: 4, Human: 3, Centaur: 2, other: 1, sType: "undefined"}, 
    "aSancrist": ["Ker-Relin", "Mount Nevermind", "Solamnic Settlements", "Xenos", "Sancrist (undefined)"], 
    "Sancrist": {iPopulation: 74234, Gnome: 80, Human: 16, "Gully Dwarf": 2, Elf: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Ker-Relin": {iPopulation: 482, Gnome: 80, Human: 16, "Gully Dwarf": 2, Elf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Mount Nevermind": {iPopulation: 59257, Gnome: 99, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Solamnic Settlements": {iPopulation: 2500, Gnome: 80, Human: 16, "Gully Dwarf": 2, Elf: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Xenos": {iPopulation: 365, Gnome: 80, Human: 16, "Gully Dwarf": 2, Elf: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Sancrist (undefined)": {iPopulation: 11630, Gnome: 80, Human: 16, "Gully Dwarf": 2, Elf: 1, other: 1, sType: "undefined"}, 
    "aSchallsea": ["Port of Schallsea", "Schallsea (undefined)"], 
    "Schallsea": {iPopulation: 17936, Human: 89, Draconian: 5, Goblin: 4, Ogre: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Port of Schallsea": {iPopulation: 9040, Human: 89, Draconian: 5, Goblin: 4, Ogre: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Schallsea (undefined)": {iPopulation: 8896, Human: 89, Draconian: 5, Goblin: 4, Ogre: 1, other: 1, sType: "undefined"}, 
    "aSilvanesti": ["Alinost", "Balinost", "Kurinist", "Pashin", "Ravinost", "Silvanost", "Silvanesti (undefined)"], 
    "Silvanesti": {iPopulation: 1567, Elf: 96, "Green Dragon": 1, Ogre: 1, Goblin: 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Alinost": {iPopulation: 18, Elf: 96, "Green Dragon": 1, Ogre: 1, Goblin: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Balinost": {iPopulation: 14, Elf: 96, "Green Dragon": 1, Ogre: 1, Goblin: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Kurinist": {iPopulation: 36, Elf: 96, "Green Dragon": 1, Ogre: 1, Goblin: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Pashin": {iPopulation: 1100, Elf: 96, "Green Dragon": 1, Ogre: 1, Goblin: 1, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Ravinost": {iPopulation: 13, Elf: 96, "Green Dragon": 1, Ogre: 1, Goblin: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Silvanost": {iPopulation: 20, Elf: 99, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Silvanesti (undefined)": {iPopulation: 366, Elf: 96, "Green Dragon": 1, Ogre: 1, Goblin: 1, other: 1, sType: "undefined"}, 
    "aSolamnia": ["Caergoth", "Hargoth", "Ironrock", "Palanthas", "Solanthus", "Vingaard Keep", "Solamnia (undefined)"], 
    "Solamnia": {iPopulation: 720120, Human: 92, Dwarf: 7, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Caergoth": {iPopulation: 24628, Human: 92, Dwarf: 7, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Hargoth": {iPopulation: 9192, Human: 92, Dwarf: 7, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Ironrock": {iPopulation: 733, Human: 92, Dwarf: 7, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Palanthas": {iPopulation: 30587, Human: 97, "Gully Dwarf": 1, Kender: 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Solanthus": {iPopulation: 23938, Human: 92, Dwarf: 7, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Vingaard Keep": {iPopulation: 10563, Human: 92, Dwarf: 7, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Solamnia (undefined)": {iPopulation: 620479, Human: 92, Dwarf: 7, other: 1, sType: "undefined"}, 
    "aSouthernErgoth": ["Brandal", "Castle Eastwatch", "Dalevil", "Daltigoth", "Daring", "Eastport", "Errow", "Finn", "Helt", "Linsel", "Logan", 
        "Qualimori", "Silvamori", "Varvil", "Welmet", "Zhea Harbor", "Southern Ergoth (undefined)"], 
    "Southern Ergoth": {iPopulation: 221739, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Brandal": {iPopulation: 914, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "Price of Courage", "sType": "region"}, 
    "Castle Eastwatch": {iPopulation: 320, Human: 95, Elf: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Price of Courage", sType: "compound"}, 
    "Dalevil": {iPopulation: 421, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Daltigoth": {iPopulation: 7352, Ogre: 77, Thanoi: 9, "Half-Ogre": 5, Human: 3, Dragonspawn: 2, Elf: 2, Troll: 1, other: 1, sSource: "Price of Courage", sType: "settlement"}, 
    "Daring": {iPopulation: 660, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "Price of Courage", "sType": "region"}, 
    "Eastport": {iPopulation: 3077, Human: 78, Dragonspawn: 9, Ogre: 5, Thanoi: 3, "Half-Ogre": 2, Minotaur: 1, Goblin: 1, other: 1, sSource: "Price of Courage", sType: "settlement"}, 
    "Errow": {iPopulation: 929, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "Price of Courage", "sType": "region"}, 
    "Finn": {iPopulation: 697, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "Price of Courage", "sType": "region"}, 
    "Helt": {iPopulation: 508, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "Price of Courage", "sType": "region"}, 
    "Linsel": {iPopulation: 935, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "Price of Courage", "sType": "region"}, 
    "Logan": {iPopulation: 744, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "Price of Courage", "sType": "region"}, 
    "Qualimori": {iPopulation: 2973, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Silvamori": {iPopulation: 4549, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Varvil": {iPopulation: 421, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Welmet": {iPopulation: 980, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sSource: "Prince of Courage", sType: "settlement"}, 
    "Zhea Harbor": {iPopulation: 4676, Human: 36, Thanoi: 20, Ogre: 18, Dragonspawn: 10, "Half-Ogre": 7, Minotaur: 5, Troll: 3, other: 1, sSource: "Price of Courage", sType: "settlement"}, 
    "Southern Ergoth (undefined)": {iPopulation: 191583, Human: 36, Ogre: 30, Elf: 32, "Half-Ogre": 1, other: 1, sType: "undefined"}, 
    "aTamanBusuk": ["Jelek", "Neraka", "Sanction", "Telvan", "Taman Busuk (undefined)"], 
    "Taman Busuk": {iPopulation: 231152, Human: 60, Goblin: 16, Draconian: 10, Ogre: 7, Gnoll: 4, Dwarf: 2, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Jelek": {iPopulation: 4690, Human: 60, Goblin: 16, Draconian: 10, Ogre: 7, Gnoll: 4, Dwarf: 2, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Neraka": {iPopulation: 10976, Human: 65, Draconian: 19, Goblin: 9, Dwarf: 2, Ogre: 2, Minotaur: 1, "Hill Giant": 1, other: 1, sSource: "Dragons of Spring", sType: "settlement"}, 
    "Sanction": {iPopulation: 15158, Human: 59, Draconian: 16, Goblin: 8, Hobgoblin: 5, Ogre: 4, Minotaur: 3, Troll: 2, "Hill Giant": 1, Shadowperson: 1, other: 1, sSource: "Dragons of Winter", sType: "settlement"}, 
    "Telvan": {iPopulation: 1200, Human: 60, Goblin: 20, Draconian: 13, Gnoll: 5, other: 2, sSource: "Dragons of Spring", sType: "settlement"}, 
    "Taman Busuk (undefined)": {iPopulation: 199128, Human: 60, Goblin: 16, Draconian: 10, Ogre: 7, Gnoll: 4, Dwarf: 2, other: 1, sType: "undefined"}, 
    "aTeyr(region)": ["Teyr (settlement)", "Teyr (region) (undefined)"], 
    "Teyr (region)": {iPopulation: 10224, Draconian: 96, Human: 2, Dwarf: 1, other: 1, sType: "region"}, 
    "Teyr (settlement)": {iPopulation: 7832, Draconian: 96, Human: 2, Dwarf: 1, other: 1, sSource: "Dragons of Krynn", sType: "settlement"}, 
    "Teyr (region) (undefined)": {iPopulation: 2392, Draconian: 96, Human: 2, Dwarf: 1, other: 1, sType: "undefined"}, 
    "aThorbardin": ["Agharbardin", "Daerbardin", "Daerforge", "Hillhome", "Hybardin", "Klarbardin", "New Daebardin", "Theibardin", "Theiwarin", "Thorbardin (undefined)"], 
    "Thorbardin": {iPopulation: 112381, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "region"}, 
    "Agharbardin": {iPopulation: 7054, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "Daerbardin": {iPopulation: 10823, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "Daerforge": {iPopulation: 3511, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "Hillhome": {iPopulation: 521, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "Hybardin": {iPopulation: 20054, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "Klarbardin": {iPopulation: 8230, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "New Daebardin": {iPopulation: 15356, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "Theibardin": {iPopulation: 13887, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "Theiwarin": {iPopulation: 5112, Dwarf: 91, "Gully Dwarf": 6, other: 3, sSource: "War of the Lance", sType: "settlement"}, 
    "Thorbardin (undefined)": {iPopulation: 27833, Dwarf: 91, "Gully Dwarf": 6, other: 3, sType: "undefined"}, 
    "aThrotl(region)": ["East Keep", "Throtl (settlement)", "Throtl (region) (undefined)"], 
    "Throtl (region)": {iPopulation: 76167, Hobgoblin: 51, Human: 39, Goblin: 9, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "East Keep": {iPopulation: 231, Hobgoblin: 51, Human: 39, Goblin: 9, other: 1, sSource: "War of the Lance", sType: "compound"}, 
    "Throtl (settlement)": {iPopulation: 4928, Hobgoblin: 78, Goblin: 9, Human: 5, Bugbear: 3, Draconian: 2, Ogre: 1, Dwarf: 1, other: 1, sSource: "Price of Courage", sType: "settlement"}, 
    "Throtl (region) (undefined)": {iPopulation: 71008, Hobgoblin: 51, Human: 39, Goblin: 9, other: 1, sType: "undefined"}, 
    "aZhakar": ["Fangrock", "Zhakar City", "Zhakar Keep", "Zhakar (undefined)"], 
    "Zhakar": {iPopulation: 32936, Dwarf: 95, Ogre: 4, other: 1, sSource: "War of the Lance", sType: "region"}, 
    "Fangrock": {iPopulation: 278, Dwarf: 95, Ogre: 4, other: 1, sSource: "War of the Lance", sType: "settlement"}, 
    "Zhakar City": {iPopulation: 22197, Dwarf: 95, Ogre: 4, other: 1, sSource: "Dragonlance Campaign Setting", sType: "settlement"}, 
    "Zhakar Keep": {iPopulation: 532, Dwarf: 95, Ogre: 4, other: 1, sSource: "War of the Lance", sType: "compound"}, 
    "Zhakar (undefined)": {iPopulation: 9929, Dwarf: 95, Ogre: 4, other: 1, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Eberron"] = {
    "aEberron": ["Aerenal", "Argonnessen", "Khorvaire", "Sarlona", "Xen'drik"], 
    "aAerenal": ["The City of the Dead", "Pylas Talaear", "Shae Cairdal", "Aerenal (undefined)"], 
    "Aerenal": {iPopulation: 2650000, Elf: 77, Undying: 19, "Half-Elf": 3, other: 1, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "The City of the Dead": {iPopulation: 42460, Elf: 77, Undying: 19, "Half-Elf": 3, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Pylas Talaear": {iPopulation: 10460, Elf: 77, Undying: 19, "Half-Elf": 3, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Shae Cairdal": {iPopulation: 52460, Elf: 77, Undying: 19, "Half-Elf": 3, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Aerenal (undefined)": {iPopulation: 2544620, Elf: 77, Undying: 19, "Half-Elf": 3, other: 1, sType: "undefined"}, 
    "aArgonnessen": ["Io'lokar", "The Light of Siberys", "The Tapestry", "The Thousand", "The Vast"], 
    "Argonnessen": {iPopulation: 221100, Human: 21, Goblin: 15, Dwarf: 11, Orc: 10, "Stone Giant": 10, Shifter: 8, Gnome: 5, Changeling: 4, Halfling: 4, "Yuan-Ti": 2, Elf: 1, "Half-Elf": 1, "Half-Orc": 1, Hobgoblin: 1, other: 6, sType: "region"}, 
    "Io'lokar": {iPopulation: 46000, Human: 14, Dwarf: 13, Goblin: 6, Hobgoblin: 6, Elf: 6, "Half-Elf": 5, Changeling: 11, Orc: 5, "Half-Orc": 5, Halfling: 10, Gnome: 10, Shifter: 8, other: 1, sSource: "Dragons of Eberron", sType: "settlement"}, 
    "The Light of Siberys": {iPopulation: 7200, "Stone Giant": 42, Goblin: 30, Dwarf: 16, Human: 6, other: 6, sSource: "Dragons of Eberron", sType: "region"}, 
    "The Tapestry": {iPopulation: 1000, Human: 39, "Stone Giant": 21, "Yuan-Ti": 20, Dwarf: 12, other: 8, sSource: "Dragons of Eberron", sType: "region"}, 
    "The Thousand": {iPopulation: 24000, Human: 35, "Stone Giant": 21, Goblin: 12, Orc: 9, Dwarf: 8, Gnome: 6, "Yuan-Ti": 3, other: 6, sSource: "Dragons of Eberron", sType: "region"}, 
    "The Vast": {iPopulation: 142900, Human: 21, Goblin: 17, Orc: 12, Dwarf: 11, Shifter: 10, "Stone Giant": 9, "Yuan-Ti": 3, Changeling: 3, Halfling: 3, Gnome: 3, other: 8, sSource: "Dragons of Eberron", sType: "region"}, 
    "aKhorvaire": ["Aundair", "Breland", "Cyre", "Darguun", "The Demon Wastes", "Droaam", "The Eldeen Reaches", "Karrnath", 
        "Lhazaar Principalities", "The Mror Holds", "Q'Barra", "The Shadow Marches", "The Talenta Plains", "Thrane", "Valenar", "Zilargo"], 
    "Khorvaire": {iPopulation: 17120000, Human: 39, Warforged: 9, Dwarf: 8, "Half-Elf": 7, Gnome: 6, Halfling: 6, Elf: 5, Orc: 4, Goblin: 3, Changeling: 2, Bugbear: 1, Demon: 1, Gnoll: 1, Hobgoblin: 1, Kobold: 1, Lizardfolk: 1, Shifter: 1, other: 4, sType: "region"}, 
    "aAundair": ["Arcanix", "Fairhaven", "Stormhome", "Passage", "Aundair (undefined)"], 
    "Aundair": {iPopulation: 2000000, Human: 51, "Half-Elf": 16, Elf: 11, Gnome: 11, Halfling: 5, Shifter: 3, Changeling: 2, other: 1, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Arcanix": {iPopulation: 800, Human: 51, "Half-Elf": 16, Elf: 11, Gnome: 11, Halfling: 5, Shifter: 3, Changeling: 2, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Fairhaven": {iPopulation: 92500, Human: 65, "Half-Elf": 15, Gnome: 9, Elf: 7, Changeling: 2, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "Stormhome": {iPopulation: 14280, Human: 51, "Half-Elf": 16, Elf: 11, Gnome: 11, Halfling: 5, Shifter: 3, Changeling: 2, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Passage": {iPopulation: 16300, Human: 51, "Half-Elf": 16, Elf: 11, Gnome: 11, Halfling: 5, Shifter: 3, Changeling: 2, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Aundair (undefined)": {iPopulation: 1876120, Human: 51, "Half-Elf": 16, Elf: 11, Gnome: 11, Halfling: 5, Shifter: 3, Changeling: 2, other: 1, sType: "undefined"}, 
    "aBreland": ["Ardev", "Argonth", "Cragwar", "First Tower", "Galethspyre", "Mistmarsh", "New Cyre", "Orcbone", "Sharn", "Shavalant", 
        "Shining Valley", "Silent Keep", "Sterngate", "Torch Keep", "Vathirond", "Wroat", "Xandrar", "Breland (undefined)"], 
    "Breland": {iPopulation: 3700000, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Ardev": {iPopulation: 1600, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "Argonth": {iPopulation: 1600, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Cragwar": {iPopulation: 3600, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "First Tower": {iPopulation: 64, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Galethspyre": {iPopulation: 3900, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "Mistmarsh": {iPopulation: 240, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "New Cyre": {iPopulation: 4200, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Orcbone": {iPopulation: 450, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "compound"}, 
    "Sharn": {iPopulation: 211850, Human: 33, Dwarf: 17, Halfling: 9, Goblin: 9, Gnome: 8, Elf: 7, "Half-Elf": 5, Shifter: 4, Changeling: 3, Orc: 1, "Half-Orc": 1, Warforged: 1, Kalashtar: 1, other: 1, sSource: "Sharn", sType: "settlement"}, 
    "Shavalant": {iPopulation: 820, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "Shining Valley": {iPopulation: 52, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "Silent Keep": {iPopulation: 100, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "compound"}, 
    "Sterngate": {iPopulation: 800, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "Torch Keep": {iPopulation: 80, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "Vathirond": {iPopulation: 3100, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Wroat": {iPopulation: 80870, Human: 30, Gnome: 20, "Half-Elf": 15, Elf: 10, Dwarf: 8, Halfling: 5, Changeling: 4, Warforged: 2, Goblin: 2, other: 4, sSource: "Five Nations", sType: "settlement"}, 
    "Xandrar": {iPopulation: 12800, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sSource: "Five Nations", sType: "settlement"}, 
    "Breland (undefined)": {iPopulation: 3373874, Human: 44, Gnome: 14, "Half-Elf": 10, Elf: 8, Dwarf: 7, Halfling: 4, Changeling: 4, Goblin: 4, Orc: 3, other: 2, sType: "undefined"}, 
    "aCyre": ["The Mournland", "Cyre (undefined)"], 
    "Cyre": {iPopulation: 1500000, Warforged: 98, other: 2, sSource: "Five Nations", sType: "region"}, 
    "The Mournland": {iPopulation: 1000, Warforged: 98, other: 2, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Cyre (undefined)": {iPopulation: 1499000, Warforged: 98, other: 2, sType: "undefined"}, 
    "aDarguun": ["Gorgonhorn", "Rhukaan Draal", "Volaar Draal", "Wyvernskull", "Darguun (undefined)"], 
    "Darguun": {iPopulation: 800000, Goblin: 39, Hobgoblin: 29, Bugbear: 13, Kobold: 6, Human: 6, Gnome: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Gorgonhorn": {iPopulation: 700, Goblin: 39, Hobgoblin: 29, Bugbear: 13, Kobold: 6, Human: 6, Gnome: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Rhukaan Draal": {iPopulation: 82460, Goblin: 39, Hobgoblin: 29, Bugbear: 13, Kobold: 6, Human: 6, Gnome: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Volaar Draal": {iPopulation: 8360, Goblin: 39, Hobgoblin: 29, Bugbear: 13, Kobold: 6, Human: 6, Gnome: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Wyvernskull": {iPopulation: 1100, Goblin: 39, Hobgoblin: 29, Bugbear: 13, Kobold: 6, Human: 6, Gnome: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Darguun (undefined)": {iPopulation: 707380, Goblin: 39, Hobgoblin: 29, Bugbear: 13, Kobold: 6, Human: 6, Gnome: 4, other: 3, sType: "undefined"}, 
    "aTheDemonWastes": ["Ashtakala", "Blood", "Festering Holt", "Rotting Blade", "The Demon Wastes (undefined)"], 
    "The Demon Wastes": {iPopulation: 600000, Human: 44, Orc: 28, "Half-Orc": 2, Demon: 25, other: 1, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Ashtakala": {iPopulation: 25001, Human: 44, Orc: 28, "Half-Orc": 2, Demon: 25, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Blood": {iPopulation: 82, Human: 44, Orc: 28, "Half-Orc": 2, Demon: 25, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Festering Holt": {iPopulation: 200, Human: 44, Orc: 28, "Half-Orc": 2, Demon: 25, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Rotting Blade": {iPopulation: 40, Human: 44, Orc: 28, "Half-Orc": 2, Demon: 25, other: 1, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "The Demon Wastes (undefined)": {iPopulation: 574677, Human: 44, Orc: 28, "Half-Orc": 2, Demon: 25, other: 1, sType: "undefined"}, 
    "aDroaam": ["The Great Crag", "Graywall", "Katal Hazath", "Droaam (undefined)"], 
    "Droaam": {iPopulation: 500000, Gnoll: 20, Orc: 19, Goblin: 18, Shifter: 5, other: 38, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "The Great Crag": {iPopulation: 32230, Gnoll: 20, Orc: 19, Goblin: 18, Shifter: 5, other: 38, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Graywall": {iPopulation: 6300, Gnoll: 20, Orc: 19, Goblin: 18, Shifter: 5, other: 38, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Katal Hazath": {iPopulation: 950, Githyanki: 92, Human: 5, other: 3, sSource: "Explorer's Handbook", sType: "settlement"}, 
    "Droaam (undefined)": {iPopulation: 460520, Gnoll: 20, Orc: 19, Goblin: 18, Shifter: 5, other: 38, sType: "undefined"}, 
    "aTheEldeenReaches": ["Greenheart", "Varna", "Cree", "Wolf's Paw", "The Eldeen Reaches (undefined)"], 
    "The Eldeen Reaches": {iPopulation: 500000, Human: 45, "Half-Elf": 16, Shifter: 16, Gnome: 7, Halfling: 7, Orc: 3, Elf: 3, other: 3, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Greenheart": {iPopulation: 1260, Human: 45, "Half-Elf": 16, Shifter: 16, Gnome: 7, Halfling: 7, Orc: 3, Elf: 3, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Varna": {iPopulation: 8000, Human: 45, "Half-Elf": 16, Shifter: 16, Gnome: 7, Halfling: 7, Orc: 3, Elf: 3, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Cree": {iPopulation: 1000, Human: 45, "Half-Elf": 16, Shifter: 16, Gnome: 7, Halfling: 7, Orc: 3, Elf: 3, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Wolf's Paw": {iPopulation: 75, Human: 45, "Half-Elf": 16, Shifter: 16, Gnome: 7, Halfling: 7, Orc: 3, Elf: 3, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "The Eldeen Reaches (undefined)": {iPopulation: 489665, Human: 45, "Half-Elf": 16, Shifter: 16, Gnome: 7, Halfling: 7, Orc: 3, Elf: 3, other: 3, sType: "undefined"}, 
    "aKarrnath": ["Atur", "Crimson Monastery", "Fort Bones", "Korth", "Karrlaktron", "Rekkenmark", "Karrnath (undefined)"], 
    "Karrnath": {iPopulation: 2500000, Human: 52, Dwarf: 18, Halfling: 10, "Half-Elf": 8, Elf: 8, other: 4, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Atur": {iPopulation: 12600, Human: 52, Dwarf: 18, Halfling: 10, "Half-Elf": 8, Elf: 8, other: 4, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Crimson Monastery": {iPopulation: 12600, Human: 52, Dwarf: 18, Halfling: 10, "Half-Elf": 8, Elf: 8, other: 4, sSource: "Five Nations", sType: "compound"}, 
    "Fort Bones": {iPopulation: 400, Human: 52, Dwarf: 18, Halfling: 10, "Half-Elf": 8, Elf: 8, other: 4, sSource: "Five Nations", sType: "compound"}, 
    "Korth": {iPopulation: 85500, Human: 60, Dwarf: 19, Halfling: 6, "Half-Elf": 4, Elf: 4, other: 7, sSource: "Five Nations", sType: "settlement"}, 
    "Karrlaktron": {iPopulation: 60000, Human: 52, Dwarf: 18, Halfling: 10, "Half-Elf": 8, Elf: 8, other: 4, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Rekkenmark": {iPopulation: 14900, Human: 52, Dwarf: 18, Halfling: 10, "Half-Elf": 8, Elf: 8, other: 4, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Karrnath (undefined)": {iPopulation: 2314000, Human: 52, Dwarf: 18, Halfling: 10, "Half-Elf": 8, Elf: 8, other: 4, sType: "undefined"}, 
    "aLhazaarPrincipalities": ["Regalport", "Port Verge", "Lhazaar Principalities (undefined)"], 
    "Lhazaar Principalities": {iPopulation: 500000, Human: 42, Gnome: 16, "Half-Elf": 14, Changeling: 12, Dwarf: 5, Elf: 4, Halfling: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Regalport": {iPopulation: 3330, Human: 42, Gnome: 16, "Half-Elf": 14, Changeling: 12, Dwarf: 5, Elf: 4, Halfling: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Port Verge": {iPopulation: 1100, Human: 42, Gnome: 16, "Half-Elf": 14, Changeling: 12, Dwarf: 5, Elf: 4, Halfling: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Lhazaar Principalities (undefined)": {iPopulation: 495570, Human: 42, Gnome: 16, "Half-Elf": 14, Changeling: 12, Dwarf: 5, Elf: 4, Halfling: 4, other: 3, sType: "undefined"}, 
    "aTheMrorHolds": ["Krona Peak", "Korunda Gate", "The Mror Holds (undefined)"], 
    "The Mror Holds": {iPopulation: 700000, Dwarf: 65, Human: 12, Orc: 10, Gnome: 8, other: 5, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Krona Peak": {iPopulation: 24230, Dwarf: 65, Human: 12, Orc: 10, Gnome: 8, other: 5, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Korunda Gate": {iPopulation: 19500, Dwarf: 65, Human: 12, Orc: 10, Gnome: 8, other: 5, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "The Mror Holds (undefined)": {iPopulation: 656270, Dwarf: 65, Human: 12, Orc: 10, Gnome: 8, other: 5, sType: "undefined"}, 
    "aQ'Barra": ["Ka'rhashan", "Newthorne", "Wyrmwatch", "Q'Barra (undefined)"], 
    "Q'Barra": {iPopulation: 300000, Lizardfolk: 40, Human: 30, Kobold: 15, Halfling: 7, Dwarf: 3, "Half-Elf": 2, other: 3, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Ka'rhashan": {iPopulation: 10600, Lizardfolk: 40, Human: 30, Kobold: 15, Halfling: 7, Dwarf: 3, "Half-Elf": 2, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Newthorne": {iPopulation: 23260, Lizardfolk: 40, Human: 30, Kobold: 15, Halfling: 7, Dwarf: 3, "Half-Elf": 2, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Wyrmwatch": {iPopulation: 452, Lizardfolk: 40, Human: 30, Kobold: 15, Halfling: 7, Dwarf: 3, "Half-Elf": 2, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Q'Barra (undefined)": {iPopulation: 265688, Lizardfolk: 40, Human: 30, Kobold: 15, Halfling: 7, Dwarf: 3, "Half-Elf": 2, other: 3, sType: "undefined"}, 
    "aTheShadowMarches": ["Zarash'ak", "The Shadow Marches (undefined)"], 
    "The Shadow Marches": {iPopulation: 500000, Orc: 55, Human: 25, Goblin: 10, "Half-Orc": 7, other: 3, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Zarash'ak": {iPopulation: 5960, Orc: 55, Human: 25, Goblin: 10, "Half-Orc": 7, other: 3, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "The Shadow Marches (undefined)": {iPopulation: 494040, Orc: 55, Human: 25, Goblin: 10, "Half-Orc": 7, other: 3, sType: "undefined"}, 
    "aTheTalentaPlains": ["Gatherhold", "The Talenta Plains (undefined)"], 
    "The Talenta Plains": {iPopulation: 400000, Halfling: 80, Human: 10, Changeling: 4, Dwarf: 4, other: 2, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Gatherhold": {iPopulation: 2300, Halfling: 80, Human: 10, Changeling: 4, Dwarf: 4, other: 2, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "The Talenta Plains (undefined)": {iPopulation: 397700, Halfling: 80, Human: 10, Changeling: 4, Dwarf: 4, other: 2, sType: "undefined"}, 
    "aThrane": ["Angwar Keep", "Arythawn Keep", "Aruldusk", "Auxylgard", "Daskaran", "Flamekeep", "Fort Light", "Morningcrest", "Sigilstar", 
        "Silvercliff Castle", "Thaliost", "Thrane (undefined)"], 
    "Thrane": {iPopulation: 2300000, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Angwar Keep": {iPopulation: 80, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "compound"}, 
    "Arythawn Keep": {iPopulation: 100, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "compound"}, 
    "Aruldusk": {iPopulation: 10800, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "settlement"}, 
    "Auxylgard": {iPopulation: 200, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "compound"}, 
    "Daskaran": {iPopulation: 4500, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "settlement"}, 
    "Flamekeep": {iPopulation: 150000, Human: 70, Dwarf: 9, Halfling: 6, "Half-Elf": 4, Elf: 4, other: 7, sSource: "Five Nations", sType: "settlement"}, 
    "Fort Light": {iPopulation: 120, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "compound"}, 
    "Morningcrest": {iPopulation: 300, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "compound"}, 
    "Sigilstar": {iPopulation: 12000, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "settlement"}, 
    "Silvercliff Castle": {iPopulation: 50, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "compound"}, 
    "Thaliost": {iPopulation: 24500, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sSource: "Five Nations", sType: "settlement"}, 
    "Thrane (undefined)": {iPopulation: 2097350, Human: 70, "Half-Elf": 10, Dwarf: 9, Elf: 4, Halfling: 4, other: 3, sType: "undefined"}, 
    "aValenar": ["Taer Valaestas", "Valenar (undefined)"], 
    "Valenar": {iPopulation: 70000, Elf: 43, Human: 28, "Half-Elf": 15, Halfling: 5, Hobgoblin: 5, other: 4, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Taer Valaestas": {iPopulation: 19060, Elf: 43, Human: 28, "Half-Elf": 15, Halfling: 5, Hobgoblin: 5, other: 4, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Valenar (undefined)": {iPopulation: 50940, Elf: 43, Human: 28, "Half-Elf": 15, Halfling: 5, Hobgoblin: 5, other: 4, sType: "undefined"}, 
    "aZilargo": ["Korranberg", "Trolanport", "Zalanberg", "Zilargo (undefined)"], 
    "Zilargo": {iPopulation: 250000, Gnome: 60, Human: 16, Dwarf: 11, Kobold: 7, other: 6, sSource: "Eberron Campaign Setting", sType: "region"}, 
    "Korranberg": {iPopulation: 17230, Gnome: 60, Human: 16, Dwarf: 11, Kobold: 7, other: 6, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Trolanport": {iPopulation: 27500, Gnome: 60, Human: 16, Dwarf: 11, Kobold: 7, other: 6, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Zalanberg": {iPopulation: 6170, Gnome: 60, Human: 16, Dwarf: 11, Kobold: 7, other: 6, sSource: "Eberron Campaign Setting", sType: "settlement"}, 
    "Zilargo (undefined)": {iPopulation: 199100, Gnome: 60, Human: 16, Dwarf: 11, Kobold: 7, other: 6, sType: "undefined"}, 
    "aSarlona": ["Adar", "Rierdra", "Syrkarn", "The Tashana Tundra"], 
    "Sarlona": {iPopulation: 14858000, Human: 86, Shifter: 5, Chosen: 2, Changeling: 1, Eneko: 1, Inspired: 1, Kalashtar: 1, Ogre: 1, other: 2, sType: "region"}, 
    "aAdar": ["Dvaarnava", "Ghoza", "Haztaratain Monastery", "Hillcorn", "Kasshta Keep", "Malshashar", "Ruukosi", "Shalquar", "Tashalatora", 
        "Xephanan", "Zi'Til'Natek", "Adar (undefined)"], 
    "Adar": {iPopulation: 320000, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "region"}, 
    "Dvaarnava": {iPopulation: 6730, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Ghoza": {iPopulation: 3250, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "compound"}, 
    "Haztaratain Monastery": {iPopulation: 9950, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "compound"}, 
    "Hillcorn": {iPopulation: 842, Human: 51, Kalashtar: 45, other: 4, sSource: "Explorer's Handbook", sType: "settlement"}, 
    "Kasshta Keep": {iPopulation: 17690, Human: 65, Kalashtar: 32, other: 3, sSource: "Secrets of Sarlona", sType: "compound"}, 
    "Malshashar": {iPopulation: 6500, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "compound"}, 
    "Ruukosi": {iPopulation: 4780, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "compound"}, 
    "Shalquar": {iPopulation: 3500, Kalashtar: 72, Human: 18, other: 10, sSource: "Secrets of Sarlona", sType: "compound"}, 
    "Tashalatora": {iPopulation: 10350, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "compound"}, 
    "Xephanan": {iPopulation: 15440, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Zi'Til'Natek": {iPopulation: 13980, Human: 51, Kalashtar: 45, other: 4, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Adar (undefined)": {iPopulation: 226988, Human: 51, Kalashtar: 45, other: 4, sType: "undefined"}, 
    "aRierdra": ["Borunan", "Corvagura", "Dor Maleer", "Khalesh", "Nulakesh", "Ohr Kaluun", "Pyrine", "Rhiavhaar"], 
    "Rierdra": {iPopulation: 13878000, Human: 90, Shifter: 3, Chosen: 2, Changeling: 1, Inspired: 1, Ogre: 1, other: 2, sSource: "Secrets of Sarlona", sType: "region"}, 
    "aBorunan": ["Mokush", "Borunan (undefined)"], 
    "Borunan": {iPopulation: 96000, Ogre: 80, Human: 8, "Ogre Mage": 4, Shifter: 3, Chosen: 1, Inspired: 1, "Half-Giant": 2, other: 1, sSource: "Secrets of Sarlona", sType: "region"}, 
    "Mokush": {iPopulation: 980, Ogre: 80, Human: 8, "Ogre Mage": 4, Shifter: 3, Chosen: 1, Inspired: 1, "Half-Giant": 2, other: 1, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Borunan (undefined)": {iPopulation: 95020, Ogre: 80, Human: 8, "Ogre Mage": 4, Shifter: 3, Chosen: 1, Inspired: 1, "Half-Giant": 2, other: 1, sType: "undefined"}, 
    "aCorvagura": ["Dar Jin", "Durat Tal", "Dar Myan", "Corvagura (undefined)"], 
    "Corvagura": {iPopulation: 5400000, Human: 91, Shifter: 3, Changeling: 2, Chosen: 1, Inspired: 1, Ogre: 1, other: 1, sSource: "Secrets of Sarlona", sType: "region"}, 
    "Dar Jin": {iPopulation: 392000, Human: 94, Chosen: 1, Inspired: 1, Ogre: 1, other: 3, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Durat Tal": {iPopulation: 631022, Human: 91, Shifter: 3, Changeling: 2, Chosen: 1, Inspired: 1, Ogre: 1, other: 1, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Dar Myan": {iPopulation: 19390, Human: 93, Chosen: 1, Inspired: 1, other: 5, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Corvagura (undefined)": {iPopulation: 4357588, Human: 91, Shifter: 3, Changeling: 2, Chosen: 1, Inspired: 1, Ogre: 1, other: 1, sType: "undefined"}, 
    "Dor Maleer": {iPopulation: 390000, Human: 73, Shifter: 15, Chosen: 2, Inspired: 1, Changeling: 2, Ogre: 2, "Ogre Mage": 1, Dwarf: 2, other: 2, sSource: "Secrets of Sarlona", sType: "region"}, 
    "Khalesh": {iPopulation: 260000, Human: 90, Shifter: 3, Changeling: 2, Chosen: 1, Inspired: 1, Ogre: 1, "Ogre Mage": 1, other: 1, sSource: "Secrets of Sarlona", sType: "region"}, 
    "aNulakesh": ["Tol Deth", "Nulakesh (undefined)"], 
    "Nulakesh": {iPopulation: 4100000, Human: 93, Chosen: 2, Inspired: 1, Changeling: 2, other: 2, sSource: "Secrets of Sarlona", sType: "region"}, 
    "Tol Deth": {iPopulation: 14410, Human: 93, Chosen: 2, Inspired: 1, Changeling: 2, other: 2, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Nulakesh (undefined)": {iPopulation: 4085590, Human: 93, Chosen: 2, Inspired: 1, Changeling: 2, other: 2, sType: "undefined"}, 
    "Ohr Kaluun": {iPopulation: 72000, Human: 67, Skulk: 12, Changeling: 8, Shifter: 5, Chosen: 2, Inspired: 1, Ogre: 1, "Ogre Mage": 1, Dwarf: 2, other: 1, sSource: "Secrets of Sarlona", sType: "region"}, 
    "Pyrine": {iPopulation: 1900000, Human: 92, Chosen: 2, Inspired: 1, Shifter: 2, Changeling: 1, other: 2, sSource: "Secrets of Sarlona", sType: "region"}, 
    "aRhiavhaar": ["Dar Ulatesh", "Rhiavhaar (undefined)"], 
    "Rhiavhaar": {iPopulation: 1660000, Human: 85, Shifter: 5, Chosen: 2, Inspired: 1, Changeling: 3, Ogre: 1, "Ogre Mage": 1, other: 2, sSource: "Secrets of Sarlona", sType: "region"}, 
    "Dar Ulatesh": {iPopulation: 113106, Human: 85, Shifter: 5, Chosen: 2, Inspired: 1, Changeling: 3, Ogre: 1, "Ogre Mage": 1, other: 2, sSource: "Secrets of Sarlona", sType: "settlement"}, 
    "Rhiavhaar (undefined)": {iPopulation: 1546894, Human: 85, Shifter: 5, Chosen: 2, Inspired: 1, Changeling: 3, Ogre: 1, "Ogre Mage": 1, other: 2, sType: "undefined"}, 
    "Syrkarn": {iPopulation: 260000, Human: 44, Eneko: 42, "Half-Giant": 12, Kalashtar: 1, other: 1, sSource: "Secrets of Sarlona", sType: "region"}, 
    "The Tashana Tundra": {iPopulation: 400000, Shifter: 69, Dwarf: 20, Human: 5, "Half-Giant": 3, Maenad: 2, other: 1, sSource: "Secrets of Sarlona", sType: "region"}, 
    "aXen'drik": ["Dar Qat", "Stormreach", "Xen'drik (undefined)"], 
    "Xen'drik": {iPopulation: 19672, Human: 61, Gnome: 6, "Half-Elf": 6, Dwarf: 5, Elf: 4, Halfling: 4, "Half-Orc": 3, Orc: 3, Changeling: 1, Dromite: 1, Shifter: 1, Warforged: 1, other: 4, sType: "region"}, 
    "Dar Qat": {iPopulation: 6430, Human: 95, Dromite: 2, other: 3, sSource: "Secrets of Xen'drik", sType: "settlement"}, 
    "Stormreach": {iPopulation: 11650, Human: 43, Gnome: 9, "Half-Elf": 9, Dwarf: 8, Orc: 4, "Half-Orc": 4, Halfling: 7, Elf: 6, Warforged: 2, Shifter: 2, Changeling: 1, other: 5, sSource: "City of Stormreach", sType: "settlement"}, 
    "Xen'drik (undefined)": {iPopulation: 1592, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Forgotten Realms"] = {
    "aForgottenRealms": ["Anauroch", "Chult", "Cold Lands", "Cormyr", "Dalelands", "Dragon Coast", "Hordelands", "Island Kingdoms", 
        "Lake of Steam", "Lands of Intrigue", "Moonsea", "North", "Old Empires", "Sembia", "Shining South", "Unapproachable East", "Underdark", 
        "Vast", "Vilhon Reach", "Western Heartlands"], 
    "aAnauroch": ["City of Shade", "Isstosseffifil", "Anauroch (undefined)"], 
    "Anauroch": {iPopulation: 139049, Human: 77, Asabi: 17, Gnoll: 5, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "City of Shade": {iPopulation: 25001, Shade: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Isstosseffifil": {iPopulation: 12404, Asabi: 50, Stingtail: 48, "Sarrukh Lich": 1, other: 1, sSource: "Serpent Kingdoms", sType: "region"}, 
    "Anauroch (undefined)": {iPopulation: 101644, Human: 77, Asabi: 17, Gnoll: 5, other: 1, sType: "undefined"}, 
    "aChult": ["Fort Beluarian", "Mezro", "Port Nyanzaru", "Samarach", "Tashalar", "Thindol"], 
    "Chult": {iPopulation: 2620657, Human: 60, Goblin: 20, Lizardfolk: 10, Dwarf: 5, Pterafolk: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Fort Beluarian": {iPopulation: 313, Human: 60, Goblin: 20, Lizardfolk: 10, Dwarf: 5, Pterafolk: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "compound"}, 
    "Mezro": {iPopulation: 23126, Human: 60, Goblin: 20, Lizardfolk: 10, Dwarf: 5, Pterafolk: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Port Nyanzaru": {iPopulation: 9375, Human: 60, Goblin: 20, Lizardfolk: 10, Dwarf: 5, Pterafolk: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aSamarach": ["Rassatan", "Samargol", "Sorl", "Taruin", "Samarach (undefined)"], 
    "Samarach": {iPopulation: 434510, Human: 98, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "region"}, 
    "Rassatan": {iPopulation: 10936, Human: 98, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Samargol": {iPopulation: 105731, Human: 98, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Sorl": {iPopulation: 4612, Human: 98, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Taruin": {iPopulation: 23899, Human: 98, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Samarach (undefined)": {iPopulation: 289332, Human: 98, "Yuan-Ti": 1, other: 1, sType: "undefined"}, 
    "aTashalar": ["Tashluta", "Serpentes", "Tashalar (undefined)"], 
    "Tashalar": {iPopulation: 889920, Human: 94, Lizardfolk: 4, "Yuan-Ti": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Tashluta": {iPopulation: 51522, Human: 94, Lizardfolk: 4, "Yuan-Ti": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aSerpentes": ["Mhairhetel", "Serpentes (undefined)"], 
    "Serpentes": {iPopulation: 126487, "Yuan-Ti": 57, Dwarf: 41, Sarrukh: 1, other: 1, sSource: "Serpent Kingdoms", sType: "region"}, 
    "Mhairhetel": {iPopulation: 9782, "Yuan-Ti": 57, Dwarf: 41, Sarrukh: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Serpentes (undefined)": {iPopulation: 116705, "Yuan-Ti": 57, Dwarf: 41, Sarrukh: 1, other: 1, sType: "undefined"}, 
    "Tashalar (undefined)": {iPopulation: 711911, Human: 94, Lizardfolk: 4, "Yuan-Ti": 1, other: 1, sType: "undefined"}, 
    "aThindol": ["Aztul", "Delselar", "Deltar", "Gurdeth", "Lundeth", "Narubel", "Psamma", "Samagard", "Tchinggult", "Thindar", "Thindol (undefined)"], 
    "Thindol": {iPopulation: 1263413, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "region"}, 
    "Aztul": {iPopulation: 4631, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Delselar": {iPopulation: 76412, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Deltar": {iPopulation: 2863, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Gurdeth": {iPopulation: 17991, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Lundeth": {iPopulation: 23791, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Narubel": {iPopulation: 11301, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Psamma": {iPopulation: 1936, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Samagard": {iPopulation: 4106, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Tchinggult": {iPopulation: 3413, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Thindar": {iPopulation: 98662, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Thindol (undefined)": {iPopulation: 1018307, Human: 86, Dwarf: 7, "Kuo-Toa": 3, Lizardfolk: 2, "Yuan-Ti": 1, other: 1, sType: "undefined"}, 
    "aColdLands": ["Damara", "Narfell", "Vaasa"], 
    "Cold Lands": {iPopulation: 1504080, Human: 85, Dwarf: 8, Halfling: 3, "Half-Orc": 2, Orc: 1, other: 1, sType: "region"}, 
    "aDamara": ["Bloodstone Gate", "Bloodstone Mines", "Firehammer Hall", "Heliogabalus", "Hillsafar Hall", "Ironspur", "Trailsend", 
        "Damara (undefined)"], 
    "Damara": {iPopulation: 1321920, Human: 87, Dwarf: 6, Halfling: 4, "Half-Orc": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Bloodstone Gate": {iPopulation: 13233, Human: 87, Dwarf: 6, Halfling: 4, "Half-Orc": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Bloodstone Mines": {iPopulation: 500, Dwarf: 60, Gnome: 20, Human: 15, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Firehammer Hall": {iPopulation: 300, Dwarf: 60, Gnome: 20, Human: 15, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Heliogabalus": {iPopulation: 44111, Human: 87, Dwarf: 6, Halfling: 4, "Half-Orc": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Hillsafar Hall": {iPopulation: 1500, Dwarf: 60, Gnome: 20, Human: 15, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Ironspur": {iPopulation: 1000, Dwarf: 60, Gnome: 20, Human: 15, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Trailsend": {iPopulation: 14116, Human: 87, Dwarf: 6, Halfling: 4, "Half-Orc": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Damara (undefined)": {iPopulation: 1247160, Human: 87, Dwarf: 6, Halfling: 4, "Half-Orc": 2, other: 1, sType: "undefined"}, 
    "aNarfell": ["Bildoobaris", "Narfell (undefined)"], 
    "Narfell": {iPopulation: 36720, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Bildoobaris": {iPopulation: 33048, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Narfell (undefined)": {iPopulation: 3672, Human: 99, other: 1, sType: "undefined"}, 
    "aVaasa": ["Darmshall", "Palischuk", "Vaasa (undefined)"], 
    "Vaasa": {iPopulation: 145440, Human: 60, Dwarf: 30, Orc: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Darmshall": {iPopulation: 5333, Human: 60, Dwarf: 30, Orc: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Palischuk": {iPopulation: 9211, "Half-Orc": 45, Orc: 20, Dwarf: 18, Human: 15, other: 2, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Vaasa (undefined)": {iPopulation: 130896, Human: 60, Dwarf: 30, Orc: 9, other: 1, sType: "undefined"}, 
    "aCormyr": ["Arabel", "Dhedluk", "Eveningstar", "Immersea", "Marsember", "Suzail", "Thunderstone", "Tilverton", "Waymoot", "Wheloon", "Cormyr (undefined)"], 
    "Cormyr": {iPopulation: 1360800, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Arabel": {iPopulation: 30606, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Dhedluk": {iPopulation: 936, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Eveningstar": {iPopulation: 954, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Immersea": {iPopulation: 1170, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Marsember": {iPopulation: 36007, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Suzail": {iPopulation: 45009, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Thunderstone": {iPopulation: 1800, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Tilverton": {iPopulation: 9002, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Waymoot": {iPopulation: 1980, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Wheloon": {iPopulation: 6692, Human: 81, Halfling: 6, Dwarf: 4, Gnome: 4, "Half-Elf": 2, Elf: 1, "Half-Orc": 1, other: 1, sSource: "Cormyr", sType: "settlement"}, 
    "Cormyr (undefined)": {iPopulation: 1226644, Human: 85, "Half-Elf": 10, Elf: 4, other: 1, sType: "undefined"}, 
    "aDalelands": ["Archendale", "Battledale", "Cormanthor", "Daggerdale", "Deepingdale", "Featherdale", "Harrowdale", "High Dale", 
        "Mistledale", "Scardale", "Shadowdale (region)", "Tasseldale"], 
    "Dalelands": {iPopulation: 602639, Human: 80, Drow: 6, "Half-Elf": 5, Elf: 4, Halfling: 2, Gnome: 1, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "aArchendale": ["Archenbridge", "White Ford", "Archendale (undefined)"], 
	"Archendale": {iPopulation: 92300, Human: 92, "Half-Elf": 3, Gnome: 2, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Archenbridge": {iPopulation: 8179, Human: 92, "Half-Elf": 3, Gnome: 2, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "White Ford": {iPopulation: 1052, Human: 92, "Half-Elf": 3, Gnome: 2, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Archendale (undefined)": {iPopulation: 83069, Human: 92, "Half-Elf": 3, Gnome: 2, Halfling: 2, other: 1, sType: "undefined"}, 
    "aBattledale": ["Essembra", "Hap", "Battledale (undefined)"], 
	"Battledale": {iPopulation: 32714, Human: 87, "Half-Elf": 5, Halfling: 4, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Essembra": {iPopulation: 2804, Human: 87, "Half-Elf": 5, Halfling: 4, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Hap": {iPopulation: 467, Human: 87, "Half-Elf": 5, Halfling: 4, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Battledale (undefined)": {iPopulation: 29443, Human: 87, "Half-Elf": 5, Halfling: 4, Gnome: 2, Dwarf: 1, other: 1, sType: "undefined"}, 
    "aCormanthor": ["Tangled Trees", "Cormanthor (undefined)"], 
	"Cormanthor": {iPopulation: 154223, Drow: 47, Elf: 30, "Half-Elf": 10, Human: 10, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Tangled Trees": {iPopulation: 1168, Elf: 65, "Half-Elf": 20, Human: 11, other: 4, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Cormanthor (undefined)": {iPopulation: 153055, Drow: 47, Elf: 30, "Half-Elf": 10, Human: 10, Halfling: 2, other: 1, sType: "undefined"}, 
    "aDaggerdale": ["Dagger Falls", "Daggerdale (undefined)"], 
	"Daggerdale": {iPopulation: 28041, Human: 88, Dwarf: 5, "Half-Orc": 3, Gnome: 2, Halfling: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Dagger Falls": {iPopulation: 2804, Human: 92, Halfling: 3, Dwarf: 2, "Half-Orc": 2, other: 1, sSource: "City of the Spider Queen", sType: "settlement"}, 
    "Daggerdale (undefined)": {iPopulation: 25237, Human: 88, Dwarf: 5, "Half-Orc": 3, Gnome: 2, Halfling: 1, other: 1, sType: "undefined"}, 
    "aDeepingdale": ["Bristar", "Highmoon", "Moonrise Hill", "Deepingdale (undefined)"], 
	"Deepingdale": {iPopulation: 50239, Human: 70, "Half-Elf": 20, Elf: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Bristar": {iPopulation: 701, Elf: 90, Halfling: 6, Gnome: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Highmoon": {iPopulation: 3505, Human: 60, "Half-Elf": 20, Elf: 15, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Moonrise Hill": {iPopulation: 818, Elf: 98, Halfling: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Deepingdale (undefined)": {iPopulation: 45215, Human: 70, "Half-Elf": 20, Elf: 9, other: 1, sType: "undefined"}, 
    "aFeatherdale": ["Blackfeather Bridge", "Feather Falls", "Featherdale (undefined)"], 
	"Featherdale": {iPopulation: 14020, Human: 84, Halfling: 11, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Blackfeather Bridge": {iPopulation: 818, Human: 84, Halfling: 11, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Feather Falls": {iPopulation: 584, Human: 84, Halfling: 11, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Featherdale (undefined)": {iPopulation: 12618, Human: 84, Halfling: 11, "Half-Elf": 2, Gnome: 2, other: 1, sType: "undefined"}, 
    "aHarrowdale": ["Harrowdale Town", "Harrowdale (undefined)"], 
	"Harrowdale": {iPopulation: 42061, Human: 90, "Half-Elf": 5, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Harrowdale Town": {iPopulation: 4206, Human: 90, "Half-Elf": 5, Elf: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Harrowdale (undefined)": {iPopulation: 37855, Human: 90, "Half-Elf": 5, Elf: 4, other: 1, sType: "undefined"}, 
    "aHighDale": ["Highcastle", "High Dale (undefined)"], 
	"High Dale": {iPopulation: 8179, Human: 86, Gnome: 10, "Half-Elf": 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Highcastle": {iPopulation: 818, Human: 86, Gnome: 10, "Half-Elf": 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "High Dale (undefined)": {iPopulation: 7361, Human: 86, Gnome: 10, "Half-Elf": 3, other: 1, sType: "undefined"}, 
    "aMistledale": ["Ashabenford", "Glen", "Peldan's Helm", "Mistledale (undefined)"], 
	"Mistledale": {iPopulation: 27807, Human: 87, Dwarf: 5, Gnome: 3, Halfling: 2, "Half-Elf": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Ashabenford": {iPopulation: 1869, Human: 87, Dwarf: 5, Gnome: 3, Halfling: 2, "Half-Elf": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Glen": {iPopulation: 701, Dwarf: 98, Gnome: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Peldan's Helm": {iPopulation: 210, Human: 87, Dwarf: 5, Gnome: 3, Halfling: 2, "Half-Elf": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Mistledale (undefined)": {iPopulation: 25027, Human: 87, Dwarf: 5, Gnome: 3, Halfling: 2, "Half-Elf": 2, other: 1, sType: "undefined"}, 
    "aScardale": ["Chandlerscross", "Scardale Town", "Scardale (undefined)"], 
	"Scardale": {iPopulation: 125015, Human: 94, "Half-Orc": 3, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Chandlerscross": {iPopulation: 4790, Human: 94, "Half-Orc": 3, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Scardale Town": {iPopulation: 4440, Human: 94, "Half-Orc": 3, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Scardale (undefined)": {iPopulation: 115785, Human: 94, "Half-Orc": 3, Halfling: 2, other: 1, sType: "undefined"}, 
    "aShadowdale(region)": ["Shadowdale (settlement)", "Shadowdale (region) (undefined)"], 
	"Shadowdale (region)": {iPopulation: 14020, Human: 78, "Half-Elf": 8, Elf: 6, Gnome: 4, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Shadowdale (settlement)": {iPopulation: 1402, Human: 78, "Half-Elf": 8, Elf: 6, Gnome: 4, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Shadowdale (region) (undefined)": {iPopulation: 12618, Human: 78, "Half-Elf": 8, Elf: 6, Gnome: 4, Halfling: 3, other: 1, sType: "undefined"}, 
    "aTasseldale": ["Tegal's Mask", "Tasseldale (undefined)"], 
	"Tasseldale": {iPopulation: 14020, Human: 94, Halfling: 2, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Tegal's Mask": {iPopulation: 1402, Human: 94, Halfling: 2, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Tasseldale (undefined)": {iPopulation: 12618, Human: 94, Halfling: 2, Gnome: 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aDragonCoast": ["Cedarspoke", "Dragonisle", "Elversult", "Ilipur", "Pros", "Proskur", "Reddansyr", "Starmantle", "Teziir", "Westgate", "Dragon Coast (undefined)"], 
    "Dragon Coast": {iPopulation: 820800, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Cedarspoke": {iPopulation: 6080, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Dragonisle": {iPopulation: 2000, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Elversult": {iPopulation: 9728, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Ilipur": {iPopulation: 2432, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Pros": {iPopulation: 1824, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Proskur": {iPopulation: 13984, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Reddansyr": {iPopulation: 608, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Starmantle": {iPopulation: 6080, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Teziir": {iPopulation: 10944, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Westgate": {iPopulation: 29184, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Dragon Coast (undefined)": {iPopulation: 737936, Human: 92, Halfling: 3, "Half-Elf": 2, Gnome: 2, other: 1, sType: "undefined"}, 
    "Hordelands": {iPopulation: 133488, Human: 85, Gnoll: 8, Centaur: 5, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "aIslandKingdoms": ["Evermeet", "Moonshae Isles", "Nelanther Isles"], 
    "Island Kingdoms": {iPopulation: 2342102, Elf: 71, Human: 26, Dwarf: 1, Halfling: 1, other: 1, sType: "region"}, 
    "aEvermeet": ["Leuthilspar", "Evermeet (undefined)"], 
    "Evermeet": {iPopulation: 1658880, Elf: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Leuthilspar": {iPopulation: 50269, Elf: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Evermeet (undefined)": {iPopulation: 1608611, Elf: 99, other: 1, sType: "undefined"}, 
    "aMoonshaeIsles": ["Caer Callidyr", "Caer Corwell", "Iron Keep", "Moonshae Isles (undefined)"], 
    "Moonshae Isles": {iPopulation: 680400, Human: 89, Halfling: 4, Elf: 3, Dwarf: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Caer Callidyr": {iPopulation: 21486, Human: 89, Halfling: 4, Elf: 3, Dwarf: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Caer Corwell": {iPopulation: 11459, Human: 89, Halfling: 4, Elf: 3, Dwarf: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Iron Keep": {iPopulation: 5730, Human: 89, Halfling: 4, Elf: 3, Dwarf: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "compound"}, 
    "Moonshae Isles (undefined)": {iPopulation: 641725, Human: 89, Halfling: 4, Elf: 3, Dwarf: 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "Nelanther Isles": {iPopulation: 2822, Orc: 30, Human: 20, "Half-Orc": 15, Lizardfolk: 15, Ogre: 10, Humanoid: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "aLakeofSteam": ["Ankhapur", "Border Kingdoms", "Innarlith", "Lapaliiya", "Mintar", "Saelmur", "Yhep", "Lake of Steam (undefined)"], 
    "Lake of Steam": {iPopulation: 1745280, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Ankhapur": {iPopulation: 33514, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aBorderKingdoms": ["Beldargan", "Derlusk", "Themasulter", "Theymarsh", "Yallash", "Border Kingdoms (undefined)"], 
    "Border Kingdoms": {iPopulation: 9485, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Beldargan": {iPopulation: 1500, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Derlusk": {iPopulation: 1500, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Themasulter": {iPopulation: 1500, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Theymarsh": {iPopulation: 1500, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Yallash": {iPopulation: 1500, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Border Kingdoms (undefined)": {iPopulation: 1985, Human: 90, Halfling: 9, other: 1, sType: "undefined"}, 
    "Innarlith": {iPopulation: 48691, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aLapaliiya": ["Abreon", "Dungar", "Ilyaport", "Ithmong", "Lapalgard", "Lhazantal", "Lushpool", "Malaxer", "Mierskar", "Ormpur", 
        "Sammaresh", "Sheirlantar", "Uzurr", "Zashuma", "Lapaliiya (undefined)"], 
    "Lapaliiya": {iPopulation: 1217642, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "region"}, 
    "Abreon": {iPopulation: 4680, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Dungar": {iPopulation: 931, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Ilyaport": {iPopulation: 1923, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Ithmong": {iPopulation: 46729, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Lapalgard": {iPopulation: 3701, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "compound"}, 
    "Lhazantal": {iPopulation: 925, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Lushpool": {iPopulation: 17265, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Malaxer": {iPopulation: 4103, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Mierskar": {iPopulation: 1617, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Ormpur": {iPopulation: 24612, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Sammaresh": {iPopulation: 21912, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Sheirlantar": {iPopulation: 7306, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Sheirtalar": {iPopulation: 52135, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Uzurr": {iPopulation: 10305, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Zashuma": {iPopulation: 1399, Gnome: 65, other: 35, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Lapaliiya (undefined)": {iPopulation: 1070234, Human: 94, "Yuan-Ti": 2, Gnome: 2, Dwarf: 1, other: 1, sType: "undefined"}, 
    "Mintar": {iPopulation: 21500, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Saelmur": {iPopulation: 25294, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Yhep": {iPopulation: 5691, Human: 90, Halfling: 9, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Lake of Steam (undefined)": {iPopulation: 383463, Human: 90, Halfling: 9, other: 1, sType: "undefined"}, 
    "aLandsofIntrigue": ["Amn", "Calimshan", "Tethyr"], 
    "Lands of Intrigue": {iPopulation: 12074400, Human: 86, Halfling: 11, Elf: 1, "Half-Orc": 1, other: 1, sType: "region"}, 
    "aAmn": ["Athkatla", "Crimmor", "Eshpurta", "Keczulla", "Murann", "Purskul", "Amn (undefined)"], 
    "Amn": {iPopulation: 2963520, Human: 83, Halfling: 15, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Athkatla": {iPopulation: 118304, Human: 83, Halfling: 15, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Crimmor": {iPopulation: 35491, Human: 83, Halfling: 15, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Eshpurta": {iPopulation: 24252, Human: 83, Halfling: 15, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Keczulla": {iPopulation: 47322, Human: 83, Halfling: 15, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Murann": {iPopulation: 43773, Human: 83, Halfling: 15, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Purskul": {iPopulation: 27210, Human: 83, "Half-Orc": 15, Halfling: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Amn (undefined)": {iPopulation: 2667168, Human: 83, Halfling: 15, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aCalimshan": ["Almraiven", "Calimport", "Memnon", "Suldolphor", "Calimshan (undefined)"], 
    "Calimshan": {iPopulation: 5339520, Human: 94, "Half-Orc": 2, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Almraiven": {iPopulation: 43652, Human: 94, "Half-Orc": 2, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Calimport": {iPopulation: 192795, Human: 94, "Half-Orc": 2, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Memnon": {iPopulation: 29101, Human: 94, "Half-Orc": 2, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Suldolphor": {iPopulation: 143687, Human: 94, "Half-Orc": 2, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Calimshan (undefined)": {iPopulation: 4930285, Human: 94, "Half-Orc": 2, Halfling: 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aTethyr": ["Darromar", "Mosstone", "Myratma", "Riatavin", "Velen", "Zazesspur", "Tethyr (undefined)"], 
    "Tethyr": {iPopulation: 3771360, Human: 76, Halfling: 20, Elf: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Darromar": {iPopulation: 68520, Human: 76, Halfling: 20, Elf: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Mosstone": {iPopulation: 1713, Human: 76, Halfling: 20, Elf: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Myratma": {iPopulation: 51390, Human: 76, Halfling: 20, Elf: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Riatavin": {iPopulation: 85650, Human: 76, Halfling: 20, Elf: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Velen": {iPopulation: 14389, Human: 76, Halfling: 20, Elf: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Zazesspur": {iPopulation: 116485, Human: 76, Halfling: 20, Elf: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Tethyr (undefined)": {iPopulation: 3433213, Human: 76, Halfling: 20, Elf: 3, other: 1, sType: "undefined"}, 
    "aMoonsea": ["Citadel of the Raven", "Elventree", "Hillsfar", "Melvaunt", "Mulmaster", "Phlan", "Ravenswatch", "Teshwave", "Thentia", 
        "Voonlar", "Ylraphon", "Yulash", "Zhentil Keep", "Moonsea (undefined)"], 
    "Moonsea": {iPopulation: 1745280, Human: 69, Orc: 10, "Half-Orc": 6, Halfling: 5, Dwarf: 5, Ogre: 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Citadel of the Raven": {iPopulation: 2782, Human: 76, "Half-Orc": 16, Orc: 5, other: 3, sSource: "Mysteries of the Moonsea", sType: "compound"}, 
    "Elventree": {iPopulation: 366, Elf: 60, "Half-Elf": 20, Human: 15, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Hillsfar": {iPopulation: 39976, Human: 99, other: 1, sSource: "Mysteries of the Moonsea", sType: "settlement"}, 
    "Melvaunt": {iPopulation: 34408, Human: 95, Dwarf: 2, other: 3, sSource: "Mysteries of the Moonsea", sType: "settlement"}, 
    "Mulmaster": {iPopulation: 46639, Human: 96, other: 4, sSource: "Mysteries of the Moonsea", sType: "settlement"}, 
    "Phlan": {iPopulation: 3198, Human: 69, Orc: 10, "Half-Orc": 6, Halfling: 5, Dwarf: 5, Ogre: 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Ravenswatch": {iPopulation: 712, Human: 76, "Half-Orc": 16, Orc: 5, other: 3, sSource: "Mysteries of the Moonsea", sType: "settlement"}, 
    "Teshwave": {iPopulation: 1256, Human: 69, Orc: 10, "Half-Orc": 6, Halfling: 5, Dwarf: 5, Ogre: 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "compound"}, 
    "Thentia": {iPopulation: 26651, Human: 69, Orc: 10, "Half-Orc": 6, Halfling: 5, Dwarf: 5, Ogre: 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Voonlar": {iPopulation: 1578, Human: 69, Orc: 10, "Half-Orc": 6, Halfling: 5, Dwarf: 5, Ogre: 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Ylraphon": {iPopulation: 1666, Human: 69, Orc: 10, "Half-Orc": 6, Halfling: 5, Dwarf: 5, Ogre: 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Yulash": {iPopulation: 1134, Human: 69, Orc: 10, "Half-Orc": 6, Halfling: 5, Dwarf: 5, Ogre: 2, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Zhentil Keep": {iPopulation: 16423, Human: 84, "Half-Orc": 12, Orc: 3, other: 1, sSource: "Mysteries of the Moonsea", sType: "settlement"}, 
    "Moonsea (undefined)": {iPopulation: 1568491, Human: 69, Orc: 10, "Half-Orc": 6, Halfling: 5, Dwarf: 5, Ogre: 2, Gnome: 2, other: 1, sType: "undefined"}, 
    "aNorth": ["High Forest", "Savage Frontier", "Silver Marches", "Sword Coast North", "Waterdeep (region)"], 
    "North": {iPopulation: 3693168, Human: 55, Dwarf: 12, Elf: 11, "Half-Elf": 6, Halfling: 5, Orc: 5, "Half-Orc": 3, Gnome: 2, other: 1, sType: "region"}, 
    "aHighForest": ["Noanar's Hold", "Olostin's Hold", "Reitheillaethor", "Tree Ghost Camp", "High Forest (undefined)"], 
    "High Forest": {iPopulation: 29088, Elf: 52, Gnoll: 12, Centaur: 10, Orc: 10, "Half-Elf": 5, "Half-Orc": 5, Human: 3, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Noanar's Hold": {iPopulation: 120, Humans: 86, "Half-Elf": 7, Halfling: 4, Dwarf: 2, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Olostin's Hold": {iPopulation: 814, Human: 88, "Half-Elf": 6, Halfling: 3, Gnome: 2, other: 1, sSource: "Silver Marches", sType: "compound"}, 
    "Reitheillaethor": {iPopulation: 640, Elf: 94, "Half-Elf": 5, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Tree Ghost Camp": {iPopulation: 224, Human: 86, Elf: 9, "Half-Elf": 4, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "High Forest (undefined)": {iPopulation: 27290, Elf: 52, Gnoll: 12, Centaur: 10, Orc: 10, "Half-Elf": 5, "Half-Orc": 5, Human: 3, Halfling: 2, other: 1, sType: "undefined"}, 
    "aSavageFrontier": ["Dark Arrow Keep", "Garadoc's Camp", "Griffon's Nest", "Llorkh", "Loudwater", "Savage Frontier (undefined)"], 
    "Savage Frontier": {iPopulation: 564480, Human: 55, Orc: 20, Dwarf: 5, "Half-Elf": 5, Elf: 4, "Half-Orc": 4, Halfling: 4, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Dark Arrow Keep": {iPopulation: 1952, Orc: 90, "Half-Orc": 3, Goblin: 2, Ogre: 2, Human: 2, other: 1, sSource: "Silver Marches", sType: "compound"}, 
    "Garadoc's Camp": {iPopulation: 49, Human: 99, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Griffon's Nest": {iPopulation: 6713, Human: 55, Orc: 20, Dwarf: 5, "Half-Elf": 5, Elf: 4, "Half-Orc": 4, Halfling: 4, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Llorkh": {iPopulation: 3051, Human: 55, Orc: 20, Dwarf: 5, "Half-Elf": 5, Elf: 4, "Half-Orc": 4, Halfling: 4, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Loudwater": {iPopulation: 8137, Human: 45, "Half-Elf": 45, other: 10, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Savage Frontier (undefined)": {iPopulation: 544578, Human: 55, Orc: 20, Dwarf: 5, "Half-Elf": 5, Elf: 4, "Half-Orc": 4, Halfling: 4, Gnome: 2, other: 1, sType: "undefined"}, 
    "aSilverMarches": ["Auvandell", "Baraskur", "Beorunna's Well", "Citadel Adbar", "Citadel Felbarr", "Deadsnows", "Doomspire", "Everlund", 
        "Frostrill", "Graevelwood", "Jalanthar", "Mithral Hall", "Nesme", "Newfort", "Quaervarr", "Silverymoon", "Sundabar", "Thradulf's Camp", 
        "Wolmad's Camp", "Silver Marches (undefined)"], 
    "Silver Marches": {iPopulation: 1090800, Human: 40, Dwarf: 20, Elf: 20, "Half-Elf": 10, Halfling: 5, Gnome: 2, "Half-Orc": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Auvandell": {iPopulation: 524, Human: 79, Dwarf: 9, Halfling: 5, "Half-Orc": 4, Gnome: 2, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Baraskur": {iPopulation: 842, Orc: 92, Goblin: 3, Ogre: 2, Human: 2, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Beorunna's Well": {iPopulation: 2139, Human: 92, "Half-Elf": 3, Dwarf: 2, Halfling: 2, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Citadel Adbar": {iPopulation: 19962, Dwarf: 89, Human: 5, "Urdunnir Dwarf": 3, Svirfneblin: 1, "Earth Genasi": 1, other: 1, sSource: "Silver Marches", sType: "compound"}, 
    "Citadel Felbarr": {iPopulation: 6987, Dwarf: 87, "Urdunnir Dwarf": 5, Human: 5, Svirfneblin: 2, other: 1, sSource: "Silver Marches", sType: "compound"}, 
    "Deadsnows": {iPopulation: 830, Human: 54, Dwarf: 23, Elf: 10, "Half-Orc": 8, Halfling: 4, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Doomspire": {iPopulation: 612, Hobgoblin: 84, Bugbear: 7, Goblin: 6, Human: 2, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Everlund": {iPopulation: 21388, Human: 48, Elf: 21, "Half-Elf": 14, "Halfling": 9, Dwarf: 7, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Frostrill": {iPopulation: 44, "Arctic Dwarf": 99, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Graevelwood": {iPopulation: 133, Gnome: 90, Dwarf: 5, Halfling: 4, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Jalanthar": {iPopulation: 226, Human: 88, Halfling: 6, "Half-Elf": 4, Gnome: 1, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Mithral Hall": {iPopulation: 4991, Dwarf: 85, Svirfneblin: 7, Human: 4, "Urdunnir Dwarf": 3, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Nesme": {iPopulation: 1966, Human: 67, Halfling: 10, "Half-Elf": 8, Dwarf: 6, Elf: 5, Gnome: 3, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Newfort": {iPopulation: 138, Human: 93, "Half-Orc": 4, "Half-Elf": 2, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Quaervarr": {iPopulation: 952, Human: 67, "Half-Elf": 25, Dwarf: 7, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Silverymoon": {iPopulation: 37073, Human: 41, Elf: 29, "Half-Elf": 12, Dwarf: 10, Halfling: 5, Gnome: 2, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Sundabar": {iPopulation: 14259, Human: 54, Dwarf: 33, Gnome: 8, Halfling: 3, "Half-Elf": 1, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Thradulf's Camp": {iPopulation: 180, Human: 99, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Wolmad's Camp": {iPopulation: 66, Human: 99, other: 1, sSource: "Silver Marches", sType: "settlement"}, 
    "Silver Marches (undefined)": {iPopulation: 977488, Human: 40, Dwarf: 20, Elf: 20, "Half-Elf": 10, Halfling: 5, Gnome: 2, "Half-Orc": 2, other: 1, sType: "undefined"}, 
    "aSwordCoastNorth": ["Goldenfields", "Icewind Dale", "Luskan", "Mirabar", "Neverwinter", "Sword Coast North (undefined)"], 
    "Sword Coast North": {iPopulation: 660960, Human: 65, Dwarf: 10, Orc: 8, "Half-Orc": 5, Elf: 4, Halfling: 4, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Goldenfields": {iPopulation: 7988, Human: 96, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Environs of Waterdeep", sType: "settlement"}, 
    "Icewind Dale": {iPopulation: 10436, Human: 65, Dwarf: 10, Orc: 8, "Half-Orc": 5, Elf: 4, Halfling: 4, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Luskan": {iPopulation: 14173, Human: 65, Dwarf: 10, Orc: 8, "Half-Orc": 5, Elf: 4, Halfling: 4, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Mirabar": {iPopulation: 10307, Human: 65, Dwarf: 10, Orc: 8, "Half-Orc": 5, Elf: 4, Halfling: 4, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Neverwinter": {iPopulation: 23192, Human: 65, Dwarf: 10, Orc: 8, "Half-Orc": 5, Elf: 4, Halfling: 4, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Sword Coast North (undefined)": {iPopulation: 594864, Human: 65, Dwarf: 10, Orc: 8, "Half-Orc": 5, Elf: 4, Halfling: 4, Gnome: 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aWaterdeep(region)": ["Amphail", "Rassalantar", "Skullport", "Spiderhaven", "T'Quession", "Tharqualnaar", "Waterdeep (settlement)", 
        "Wormbarrow", "Waterdeep (region) (undefined)"], 
    "Waterdeep (region)": {iPopulation: 1347840, Human: 64, Dwarf: 10, Elf: 10, Halfling: 5, "Half-Elf": 5, Gnome: 3, "Half-Orc": 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Amphail": {iPopulation: 850, Human: 64, Dwarf: 10, Elf: 10, Halfling: 5, "Half-Elf": 5, Gnome: 3, "Half-Orc": 2, other: 1, sSource: "Environs of Waterdeep", sType: "settlement"}, 
    "Rassalantar": {iPopulation: 200, Human: 64, Dwarf: 10, Elf: 10, Halfling: 5, "Half-Elf": 5, Gnome: 3, "Half-Orc": 2, other: 1, sSource: "Environs of Waterdeep", sType: "settlement"}, 
    "Skullport": {iPopulation: 2250, Human: 37, "Half-Orc": 18, Goblin: 10, Kobold: 7, Elf: 5, Dwarf: 3, other: 20, sSource: "City of Splendors", sType: "settlement"}, 
    "Spiderhaven": {iPopulation: 400, Gnome: 62, Stonechild: 12, Goblin: 8, Derro: 5, Drow: 10, other: 3, sSource: "Expedition to Undermountain", sType: "settlement"}, 
    "T'Quession": {iPopulation: 240, "Aquatic Elf": 96, Merfolk: 2, "Half-Aquatic Elf": 1, other: 1, sSource: "City of Splendors", sType: "settlement"}, 
    "Tharqualnaar": {iPopulation: 517, Merfolk: 95, "Aquatic Elf": 2, "Half-Aquatic Elf": 2, other: 1, sSource: "City of Splendors", sType: "settlement"}, 
    "Waterdeep (settlement)": {iPopulation: 132661, Human: 64, Dwarf: 10, Elf: 10, Halfling: 5, "Half-Elf": 5, Gnome: 3, "Half-Orc": 2, other: 1, sSource: "City of Splendors", sType: "settlement"}, 
    "Wormbarrow": {iPopulation: 111, Avolakia: 22, Ghost: 3, Mummy: 5, Specter: 3, Vampire: 2, Wight: 11, Zombie: 27, other: 27, sSource: "Expedition to Undermountain", sType: "settlement"}, 
    "Waterdeep (region) (undefined)": {iPopulation: 1210611, Human: 64, Dwarf: 10, Elf: 10, Halfling: 5, "Half-Elf": 5, Gnome: 3, "Half-Orc": 2, other: 1, sType: "undefined"}, 
    "aOldEmpires": ["Chessenta", "Mulhorand", "Unther"], 
    "Old Empires": {iPopulation: 12990240, Human: 93, Dwarf: 2, Halfling: 2, "Half-Orc": 1, Lizardfolk: 1, other: 1, sType: "region"}, 
    "aChessenta": ["Airspur", "Akanax", "Cimbar", "Luthcheq", "Soorenar", "Chessenta (undefined)"], 
    "Chessenta": {iPopulation: 3386880, Human: 82, Halfling: 6, Dwarf: 5, "Half-Orc": 4, Lizardfolk: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Airspur": {iPopulation: 22282, Human: 56, "Half-Orc": 30, Halfling: 6, Dwarf: 5, Lizardfolk: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Akanax": {iPopulation: 24632, Human: 82, Halfling: 6, Dwarf: 5, "Half-Orc": 4, Lizardfolk: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "compound"}, 
    "Cimbar": {iPopulation: 110843, Human: 82, Halfling: 6, Dwarf: 5, "Half-Orc": 4, Lizardfolk: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Luthcheq": {iPopulation: 61580, Human: 87, Halfling: 6, "Half-Orc": 4, Lizardfolk: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Soorenar": {iPopulation: 73896, Human: 82, Halfling: 6, Dwarf: 5, "Half-Orc": 4, Lizardfolk: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Chessenta (undefined)": {iPopulation: 3093647, Human: 82, Halfling: 6, Dwarf: 5, "Half-Orc": 4, Lizardfolk: 2, other: 1, sType: "undefined"}, 
    "aMulhorand": ["Gheldaneth", "Mishtan", "Neldorild", "Skuld", "Mulhorand (undefined)"], 
    "Mulhorand": {iPopulation: 5339520, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Gheldaneth": {iPopulation: 172243, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Mishtan": {iPopulation: 6459, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Neldorild": {iPopulation: 86121, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Skuld": {iPopulation: 204538, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Mulhorand (undefined)": {iPopulation: 4870159, Human: 99, other: 1, sType: "undefined"}, 
    "aUnther": ["Messemprar", "Okoth", "Shussel", "Threskel", "Unthalass", "Unther (undefined)"], 
    "Unther": {iPopulation: 4263840, Human: 94, Dwarf: 3, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Messemprar": {iPopulation: 98776, Human: 94, Dwarf: 3, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aOkoth": ["Azun", "Buldamar", "Okoth (undefined)"], 
    "Okoth": {iPopulation: 8603, Wereserpent: 87, Werecrocodile: 11, Sarrukh: 1, other: 1, sSource: "Serpent Kingdoms", sType: "region"}, 
    "Azun": {iPopulation: 1017, Wereserpent: 87, Werecrocodile: 11, Sarrukh: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Buldamar": {iPopulation: 578, Wereserpent: 87, Werecrocodile: 11, Sarrukh: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Okoth (undefined)": {iPopulation: 7008, Wereserpent: 87, Werecrocodile: 11, Sarrukh: 1, other: 1, sType: "undefined"}, 
    "Shussel": {iPopulation: 9150, Human: 94, Dwarf: 3, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aThreskel": ["Mordulkin", "Mourktar", "Thamor", "Threskel (undefined)"], 
    "Threskel": {iPopulation: 52791, Human: 93, Duergar: 2, Dragonblooded: 2, Troll: 1, "Half-Dragon": 1, other: 1, sSource: "Dragons of Faerun", sType: "region"}, 
    "Mordulkin": {iPopulation: 35706, Human: 93, Duergar: 2, Dragonblooded: 2, Troll: 1, "Half-Dragon": 1, other: 1, sSource: "Dragons of Faerun", sType: "settlement"}, 
    "Mourktar": {iPopulation: 10107, Human: 93, Duergar: 2, Dragonblooded: 2, Troll: 1, "Half-Dragon": 1, other: 1, sSource: "Dragons of Faerun", sType: "settlement"}, 
    "Thamor": {iPopulation: 5163, Human: 93, Duergar: 2, Dragonblooded: 2, Troll: 1, "Half-Dragon": 1, other: 1, sSource: "Dragons of Faerun", sType: "settlement"}, 
    "Threskel (undefined)": {iPopulation: 1815, Human: 93, Duergar: 2, Dragonblooded: 2, Troll: 1, "Half-Dragon": 1, other: 1, sType: "undefined"}, 
    "Unthalass": {iPopulation: 164627, Human: 94, Dwarf: 3, Halfling: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Unther (undefined)": {iPopulation: 3929893, Human: 94, Dwarf: 3, Halfling: 2, other: 1, sType: "undefined"}, 
    "aSembia": ["Daerlun", "Ordulin", "Saerloon", "Selgaunt", "Urmlaspyr", "Yhaunn", "Sembia (undefined)"], 
    "Sembia": {iPopulation: 2462400, Human: 96, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Daerlun": {iPopulation: 52477, Human: 96, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Ordulin": {iPopulation: 36330, Human: 96, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Saerloon": {iPopulation: 54496, Human: 96, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Selgaunt": {iPopulation: 56514, Human: 96, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Urmlaspyr": {iPopulation: 26239, Human: 96, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Yhaunn": {iPopulation: 20184, Human: 96, Halfling: 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Sembia (undefined)": {iPopulation: 2216160, Human: 96, Halfling: 3, other: 1, sType: "undefined"}, 
    "aShiningSouth": ["Dambrath", "Durpar", "Estagund", "Great Rift", "Halruaa", "Luiren", "Shaar", "Ulgarth", "Var the Golden"], 
    "Shining South": {iPopulation: 4793963, Human: 46, Dwarf: 28, Halfling: 17, Centaur: 1, Gnoll: 2, Wemic: 2, Elf: 1, Gnome: 1, "Half-Elf": 1, other: 1, sType: "region"}, 
    "aDambrath": ["Cathyr", "Herath", "Maarlith", "Purl", "T'lindhet", "Dambrath (undefined)"], 
    "Dambrath": {iPopulation: 135498, Human: 73, Crinti: 15, Drow: 5, Halfling: 3, Gnoll: 2, "Half-Orc": 1, other: 1, sType: "region"}, 
    "Cathyr": {iPopulation: 42374, Human: 73, Crinti: 15, Drow: 5, Halfling: 3, Gnoll: 2, "Half-Orc": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Herath": {iPopulation: 18000, Human: 73, Crinti: 15, Drow: 5, Halfling: 3, Gnoll: 2, "Half-Orc": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Maarlith": {iPopulation: 25001, Human: 73, Crinti: 15, Drow: 5, Halfling: 3, Gnoll: 2, "Half-Orc": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Purl": {iPopulation: 400, Human: 73, Crinti: 15, Drow: 5, Halfling: 3, Gnoll: 2, "Half-Orc": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "T'lindhet": {iPopulation: 9000, Human: 73, Crinti: 15, Drow: 5, Halfling: 3, Gnoll: 2, "Half-Orc": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Dambrath (undefined)": {iPopulation: 40723, Human: 73, Crinti: 15, Drow: 5, Halfling: 3, Gnoll: 2, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aDurpar": ["Assur", "Old Vaelen", "Ormpe", "Vaelen", "Durpar (undefined)"], 
    "Durpar": {iPopulation: 49735, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sType: "region"}, 
    "Assur": {iPopulation: 3200, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Old Vaelen": {iPopulation: 2000, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Ormpe": {iPopulation: 4500, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Vaelen": {iPopulation: 25001, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Durpar (undefined)": {iPopulation: 15034, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sType: "undefined"}, 
    "aEstagund": ["Chavyondat", "Estagund (undefined)"], 
    "Estagund": {iPopulation: 96815, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sType: "region"}, 
    "Chavyondat": {iPopulation: 67489, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Estagund (undefined)": {iPopulation: 29326, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sType: "undefined"}, 
    "aGreatRift": ["Eartheart", "Hammer and Anvil", "Underhome", "Great Rift (undefined)"], 
    "Great Rift": {iPopulation: 1308960, Dwarf: 96, Gnome: 2, Halfling: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Eartheart": {iPopulation: 44008, Dwarf: 97, Gnome: 2, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Hammer and Anvil": {iPopulation: 7899, Dwarf: 60, Gnome: 20, Halfling: 10, other: 10, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Underhome": {iPopulation: 49650, Dwarf: 96, Gnome: 2, Halfling: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Great Rift (undefined)": {iPopulation: 1207403, Dwarf: 96, Gnome: 2, Halfling: 1, other: 1, sType: "undefined"}, 
    "aHalruaa": ["Aluarim", "Galdel", "Halagard", "Halarahh", "Khaerbaal", "Maeruhal", "Mount Talath", "Yaulazna", "Zalazuu", "Halruaa (undefined)"], 
    "Halruaa": {iPopulation: 1676160, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Aluarim": {iPopulation: 1328, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Galdel": {iPopulation: 3200, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Halagard": {iPopulation: 7500, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Halarahh": {iPopulation: 8000, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Khaerbaal": {iPopulation: 8500, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Maeruhal": {iPopulation: 693, Human: 82, Dwarf: 8, "Half-Elf": 5, Elf: 2, Halfling: 2, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Mount Talath": {iPopulation: 1170, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "compound"}, 
    "Yaulazna": {iPopulation: 300, Human: 37, Halfling: 23, "Half-Elf": 22, "Half-Orc": 7, Elf: 5, Tiefling: 4, other: 2, sSource: "Shining South", sType: "settlement"}, 
    "Zalazuu": {iPopulation: 5000, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Halruaa (undefined)": {iPopulation: 1640469, Human: 90, Dwarf: 5, Halfling: 2, Elf: 1, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aLuiren": ["Beluir", "Chethel", "Crimel", "Krenalir", "Shoun", "Luiren (undefined)"], 
    "Luiren": {iPopulation: 838080, Halfling: 92, Human: 4, Elf: 2, "Half-Elf": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Beluir": {iPopulation: 27210, Halfling: 92, Human: 4, "Half-Elf": 2, Elf: 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Chethel": {iPopulation: 14512, Halfling: 85, Elf: 7, Human: 4, "Half-Elf": 3, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Crimel": {iPopulation: 476, Halfling: 99, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Krenalir": {iPopulation: 4800, Halfling: 92, Human: 4, Elf: 2, "Half-Elf": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Shoun": {iPopulation: 7487, Halfling: 92, Human: 4, Elf: 2, "Half-Elf": 1, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Luiren (undefined)": {iPopulation: 783595, Halfling: 92, Human: 4, Elf: 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aShaar": ["Delzimmer", "Hardcastle", "Kholtar", "Pyratar", "Shaarmid", "Shaar (undefined)"], 
    "Shaar": {iPopulation: 587520, Human: 60, Wemic: 15, Gnoll: 14, Centaur: 10, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Delzimmer": {iPopulation: 6215, Halfling: 42, Human: 37, "Half-Elf": 10, Dwarf: 6, Gnome: 3, other: 2, sSource: "Shining South", sType: "settlement"}, 
    "Hardcastle": {iPopulation: 1316, Human: 60, Wemic: 15, Gnoll: 14, Centaur: 10, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Kholtar": {iPopulation: 7643, Human: 60, Wemic: 15, Gnoll: 14, Centaur: 10, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Shaarmid": {iPopulation: 23501, Human: 60, Wemic: 15, Gnoll: 14, Centaur: 10, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Shaar (undefined)": {iPopulation: 504456, Human: 60, Wemic: 15, Gnoll: 14, Centaur: 10, other: 1, sType: "undefined"}, 
    "aUlgarth": ["Kelazzan", "Orvyltar", "Ulgarth (undefined)"], 
    "Ulgarth": {iPopulation: 37363, Human: 82, Elf: 5, "Half-Elf": 3, Halfling: 3, Dwarf: 2, "Half-Orc": 2, Gnome: 1, other: 2, sType: "region"}, 
    "Kelazzan": {iPopulation: 5000, Human: 82, Elf: 5, "Half-Elf": 3, Halfling: 3, Dwarf: 2, "Half-Orc": 2, Gnome: 1, other: 2, sSource: "Shining South", sType: "settlement"}, 
    "Orvyltar": {iPopulation: 21000, Human: 82, Elf: 5, "Half-Elf": 3, Halfling: 3, Dwarf: 2, "Half-Orc": 2, Gnome: 1, other: 2, sSource: "Shining South", sType: "settlement"}, 
    "Ulgarth (undefined)": {iPopulation: 11363, Human: 82, Elf: 5, "Half-Elf": 3, Halfling: 3, Dwarf: 2, "Half-Orc": 2, Gnome: 1, other: 2, sType: "undefined"}, 
    "aVartheGolden": ["Pyratar", "Var the Golden (undefined)"], 
    "Var the Golden": {iPopulation: 63832, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sType: "region"}, 
    "Pyratar": {iPopulation: 44389, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sSource: "Shining South", sType: "settlement"}, 
    "Var the Golden (undefined)": {iPopulation: 19443, Human: 81, Halfling: 7, "Half-Elf": 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, other: 1, sType: "undefined"}, 
    "aUnapproachableEast": ["Aglarond", "Great Dale", "Impiltur", "Rashemen", "Thay", "Thesk"], 
    "Unapproachable East": {iPopulation: 9121680, Human: 71, Orc: 6, Dwarf: 5, Gnoll: 5, "Half-Elf": 4, Goblin: 3, Halfling: 3, Elf: 1, Gnome: 1, other: 1, sType: "region"}, 
    "aAglarond": ["Delthuntle", "Emmech", "Furthinghome", "Glarondar", "Relkath's Foot", "Spandeliyon", "Velprintalar", "Aglarond (undefined)"], 
    "Aglarond": {iPopulation: 1270080, Human: 64, "Half-Elf": 30, Elf: 5, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Delthuntle": {iPopulation: 3500, Human: 64, "Half-Elf": 30, Elf: 5, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Emmech": {iPopulation: 7620, Human: 84, "Half-Elf": 14, Halfling: 1, other: 1, sSource: "Unapproachable East", sType: "compound"}, 
    "Furthinghome": {iPopulation: 40643, Human: 64, "Half-Elf": 30, Elf: 5, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Glarondar": {iPopulation: 5489, Human: 57, "Half-Elf": 42, other: 1, sSource: "Unapproachable East", sType: "compound"}, 
    "Relkath's Foot": {iPopulation: 5080, "Half-Elf": 86, Elf: 9, Human: 4, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Spandeliyon": {iPopulation: 4789, Human: 95, "Half-Elf": 3, Halfling: 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Velprintalar": {iPopulation: 66044, Human: 50, "Half-Elf": 40, Elf: 3, Halfling: 3, Dwarf: 1, Gnome: 1, "Half-Orc": 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Aglarond (undefined)": {iPopulation: 1136915, Human: 64, "Half-Elf": 30, Elf: 5, other: 1, sType: "undefined"}, 
    "aGreatDale": ["Bezentil", "Kront", "Mavalgard", "Uthmere", "Great Dale (undefined)"], 
    "Great Dale": {iPopulation: 211680, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Bezentil": {iPopulation: 124, Human: 95, "Half-Elf": 3, Elf: 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Kront": {iPopulation: 267, Human: 95, "Half-Elf": 3, Elf: 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Mavalgard": {iPopulation: 50, Human: 99, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Uthmere": {iPopulation: 8820, Human: 81, "Half-Elf": 7, Elf: 4, Halfling: 3, Dwarf: 2, Gnome: 1, "Half-Orc": 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Great Dale (undefined)": {iPopulation: 202419, Human: 99, other: 1, sType: "undefined"}, 
    "aImpiltur": ["Dilpur", "Hlammach", "Lyrabar", "Impiltur (undefined)"], 
    "Impiltur": {iPopulation: 1205280, Human: 90, Dwarf: 5, Halfling: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Dilpur": {iPopulation: 31838, Human: 90, Dwarf: 5, Halfling: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Hlammach": {iPopulation: 36386, Human: 90, Dwarf: 5, Halfling: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Lyrabar": {iPopulation: 52305, Human: 90, Dwarf: 5, Halfling: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Impiltur (undefined)": {iPopulation: 1084751, Human: 90, Dwarf: 5, Halfling: 4, other: 1, sType: "undefined"}, 
    "aRashemen": ["Citadel Rashemar", "Immilmar", "Mulptan", "Mulsantir", "Shevel", "Taporan", "Thasunta", "Tinnir", "Urling", "Rashemen (undefined)"], 
    "Rashemen": {iPopulation: 654480, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Citadel Rashemar": {iPopulation: 760, Goblin: 77, Hobgoblin: 14, Ogre: 8, other: 1, sSource: "Unapproachable East", sType: "compound"}, 
    "Immilmar": {iPopulation: 21210, Human: 93, "Spirit Folk": 6, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Mulptan": {iPopulation: 39390, Human: 99, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Mulsantir": {iPopulation: 4848, Human: 92, "Spirit Folk": 7, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Shevel": {iPopulation: 3500, Human: 99, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Taporan": {iPopulation: 1450, Human: 99, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Thasunta": {iPopulation: 2150, Human: 99, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Tinnir": {iPopulation: 540, Human: 99, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Urling": {iPopulation: 240, Human: 99, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Rashemen (undefined)": {iPopulation: 580392, Human: 99, other: 1, sType: "undefined"}, 
    "aThay": ["Amruthar", "Bezantur", "Eltabbar", "Escalant", "Nethentir", "Nethjet", "Pyarados", "Surthay", "Tyraturos", "Thay (undefined)"], 
    "Thay": {iPopulation: 4924800, Human: 62, Gnoll: 10, Orc: 10, Dwarf: 8, Goblin: 5, Halfling: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Amruthar": {iPopulation: 41040, Human: 79, "Half-Elf": 8, Halfling: 6, "Half-Orc": 4, Gnome: 1, Elf: 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Bezantur": {iPopulation: 136800, Human: 81, Gnoll: 8, Orc: 6, "Half-Orc": 3, Halfling: 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Eltabbar": {iPopulation: 123120, Human: 83, Gnoll: 8, Orc: 7, "Half-Orc": 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Escalant": {iPopulation: 28728, Human: 82, Gnoll: 5, "Half-Elf": 5, "Half-Orc": 5, Halfling: 2, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Nethentir": {iPopulation: 1872, Human: 81, Gnoll: 8, Orc: 6, "Half-Orc": 2, Halfling: 2, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Nethjet": {iPopulation: 3500, Human: 62, Gnoll: 10, Orc: 10, Dwarf: 8, Goblin: 5, Halfling: 4, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Pyarados": {iPopulation: 54720, Human: 62, Gnoll: 10, Orc: 10, Dwarf: 8, Goblin: 5, Halfling: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Surthay": {iPopulation: 17784, Human: 62, Gnoll: 10, Orc: 10, Dwarf: 8, Goblin: 5, Halfling: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Tyraturos": {iPopulation: 68400, Human: 62, Gnoll: 10, Orc: 10, Dwarf: 8, Goblin: 5, Halfling: 4, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement", sType: "settlement"}, 
    "Thay (undefined)": {iPopulation: 4448836, Human: 62, Gnoll: 10, Orc: 10, Dwarf: 8, Goblin: 5, Halfling: 4, other: 1, sType: "undefined"}, 
    "aThesk": ["Milvarune", "Nyth", "Phent", "Phsant", "Tammar", "Telflamm", "Two Stars", "Thesk (undefined)"], 
    "Thesk": {iPopulation: 855360, Human: 85, Gnome: 8, Orc: 6, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Milvarune": {iPopulation: 6029, Human: 67, Gnome: 13, "Half-Elf": 6, Orc: 6, "Half-Orc": 4, Dwarf: 3, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Nyth": {iPopulation: 11501, Human: 85, Gnome: 8, Orc: 6, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement", sType: "settlement"}, 
    "Phent": {iPopulation: 4662, Human: 78, Orc: 10, "Half-Orc": 5, Gnome: 2, "Half-Elf": 2, Dwarf: 1, Halfling: 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Phsant": {iPopulation: 21564, Human: 73, Orc: 12, "Half-Orc": 6, Dwarf: 2, Gnome: 2, "Half-Elf": 2, Halfling: 2, other: 1, sSource: "Unapproachable East", sType: "settlement", sType: "settlement"}, 
    "Tammar": {iPopulation: 3594, Human: 84, Orc: 8, "Half-Orc": 3, Halfling: 2, Gnome: 2, other: 1, sSource: "Unapproachable East", sType: "settlement", sType: "settlement"}, 
    "Telflamm": {iPopulation: 23361, Human: 83, Orc: 5, "Half-Elf": 4, "Half-Orc": 3, Dwarf: 1, Elf: 1, Gnome: 1, Halfling: 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Two Stars": {iPopulation: 4854, Human: 83, Orc: 5, "Half-Orc": 3, Dwarf: 3, "Half-Elf": 2, Gnome: 2, Halfling: 1, other: 1, sSource: "Unapproachable East", sType: "settlement"}, 
    "Thesk (undefined)": {iPopulation: 779795, Human: 85, Gnome: 8, Orc: 6, other: 1, sType: "undefined"}, 
    "aUnderdark": ["Buried Realms", "Darklands", "Deep Wastes", "Earthroot", "Great Bhaerynden", "Northdark", "Old Shanatar"], 
    "Underdark": {iPopulation: 558968, Drow: 19, "Deep Imaskari": 12, Duergar: 10, Goblin: 6, Halfling: 6, Quaggoth: 6, Dwarf: 4, Gloaming: 4, Human: 3, "Kuo-Toa": 3, Ogre: 3, Cloaker: 2, Slyth: 2, Construct: 1, Derro: 1, Grimlock: 1, Hobgoblin: 1, Illithid: 1, Svirfneblin: 1, Troglodyte: 1, other: 13, sType: "region"}, 
    "aBuriedRealms": ["Ooltul", "Buried Realms (undefined)"], 
    "Buried Realms": {iPopulation: 10504, Goblin: 41, Orc: 28, Asabi: 13, Ogre: 11, Beholder: 4, "Beholder Mage": 2, other: 1, sType: "region"}, 
    "Ooltul": {iPopulation: 7296, Goblin: 41, Orc: 28, Asabi: 13, Ogre: 11, Beholder: 4, "Beholder Mage": 2, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Buried Realms (undefined)": {iPopulation: 3208, Goblin: 41, Orc: 28, Asabi: 13, Ogre: 11, Beholder: 4, "Beholder Mage": 2, other: 1, sType: "undefined"}, 
    "aDarklands": ["Cairnheim", "Drik Hargunen", "Dupapn", "LoobliShar", "Oryndoll", "Darklands (undefined)"], 
    "Darklands": {iPopulation: 77017, Quaggoth: 38, Duergar: 28, Goblin: 9, Illithid: 6, "Kuo-Toa": 4, Orc: 3, Derro: 2, Grimlock: 2, Drow: 1, Dwarf: 1, Skum: 1, "Stone Giant": 1, Svirfneblin: 1, Human: 1, other: 2, sType: "region"}, 
    "Cairnheim": {iPopulation: 546, "Stone Giant": 95, "Undead Stone Giant": 4, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Drik Hargunen": {iPopulation: 24347, Duergar: 60, Goblin: 19, Orc: 7, Grimlock: 5, Derro: 4, Human: 1, Gnome: 1, Svirfneblin: 1, Ogre: 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Dupapn": {iPopulation: 620, Skum: 97, Aboleth: 2, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "LoobliShar": {iPopulation: 1974, "Kuo-Toa": 96, Illithid: 2, Drow: 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Oryndoll": {iPopulation: 26000, Illithid: 13, Quaggoth: 78, Drow: 1, Duergar: 1, Human: 1, Dwarf: 1, Svirfneblin: 1, other: 4, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Darklands (undefined)": {iPopulation: 23530, Quaggoth: 38, Duergar: 28, Goblin: 9, Illithid: 6, "Kuo-Toa": 4, Orc: 3, Derro: 2, Grimlock: 2, Drow: 1, Dwarf: 1, Skum: 1, "Stone Giant": 1, Svirfneblin: 1, Human: 1, other: 2, sType: "undefined"}, 
    "aDeepWastes": ["Blessed Seahaven", "Brikklext", "Deep Wastes (undefined)"], 
    "Deep Wastes": {iPopulation: 405, Goblin: 68, "Kuo-Toa": 14, Bugbear: 10, Blue: 4, Worg: 3, other: 1, sType: "region"}, 
    "Blessed Seahaven": {iPopulation: 39, "Kuo-Toa": 99, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Brikklext": {iPopulation: 242, Goblin: 79, Bugbear: 11, Blue: 5, Worg: 4, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Deep Wastes (undefined)": {iPopulation: 124, Goblin: 68, "Kuo-Toa": 14, Bugbear: 10, Blue: 4, Worg: 3, other: 1, sType: "undefined"}, 
    "aEarthroot": ["Deep Imaskar", "Fraaszummdin", "Sphur Upra", "Undrek'thoz", "Earthroot (undefined)"], 
    "Earthroot": {iPopulation: 187344, "Deep Imaskari": 35, Drow: 15, Orc: 13, Gloaming: 12, Halfling: 9, Human: 6, Cloaker: 2, Goblin: 2, Hobgoblin: 2, Duergar: 1, Grimlock: 1, Ogre: 1, other: 1, sType: "region"}, 
    "Deep Imaskar": {iPopulation: 46187, "Deep Imaskari": 99, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Fraaszummdin": {iPopulation: 3082, Duergar: 34, Hobgoblin: 31, Orc: 25, "Half-Orc": 6, Human: 2, Ogre: 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Sphur Upra": {iPopulation: 20256, Gloaming: 78, Cloaker: 14, Grimlock: 5, Goblin: 2, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Undrek'thoz": {iPopulation: 60403, Drow: 32, Orc: 26, Halfling: 19, Human: 13, Goblin: 3, Hobgoblin: 3, Dwarf: 1, Ogre: 1, other: 2, sSource: "Underdark", sType: "settlement"}, 
    "Earthroot (undefined)": {iPopulation: 57416, "Deep Imaskari": 35, Drow: 15, Orc: 13, Gloaming: 12, Halfling: 9, Human: 6, Cloaker: 2, Goblin: 2, Hobgoblin: 2, Duergar: 1, Grimlock: 1, Ogre: 1, other: 1, sType: "undefined"}, 
    "aGreatBhaerynden": ["Deepburrow", "Earth's End", "Fluvenilstra", "Great Bhaerynden (undefined)"], 
    "Great Bhaerynden": {iPopulation: 30444, Halfling: 46, Slyth: 39, Dwarf: 5, "Earth Creatures": 2, Gnome: 2, Myconid: 2, "Half-Elf": 1, Human: 1, "Urdunnir Dwarf": 1, other: 1, sType: "region"}, 
    "Deepburrow": {iPopulation: 11312, Halfling: 85, Dwarf: 9, Gnome: 3, Human: 1, "Half-Elf": 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Earth's End": {iPopulation: 562, "Earth Creatures": 68, "Urdunnir Dwarf": 19, Xorn: 5, Thoqqua: 2, "Earth Genasi": 2, Duergar: 1, "Earth Mephit": 1, "Earth Weird": 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Fluvenilstra": {iPopulation: 9170, Slyth: 90, Myconid: 4, Grimlock: 3, Svirfneblin: 1, Genasi: 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Great Bhaerynden (undefined)": {iPopulation: 9400, Halfling: 46, Slyth: 39, Dwarf: 5, "Earth Creatures": 2, Gnome: 2, Myconid: 2, "Half-Elf": 1, Human: 1, "Urdunnir Dwarf": 1, other: 1, sType: "undefined"}, 
    "aNorthdark": ["Ch'Chitl", "Gracklstugh", "Menzoberranzan", "Reeshov", "Yathchol", "Northdark (undefined)"], 
    "Northdark": {iPopulation: 109473, Duergar: 30, Drow: 14, Orc: 12, Goblin: 9, Ogre: 9, Dwarf: 5, Derro: 3, Bugbear: 2, Grimlock: 2, Quaggoth: 2, Svirfneblin: 2, Troll: 2, Chitine: 1, Durzagon: 1, Human: 1, Minotaur: 1, Ogrillon: 1, Orog: 1, "Stone Giant": 1, other: 1, sType: "region"}, 
    "Ch'Chitl": {iPopulation: 1304, Illithid: 23, Quaggoth: 71, Drow: 1, Duergar: 1, Human: 1, Dwarf: 1, Svirfneblin: 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Gracklstugh": {iPopulation: 40068, Duergar: 57, Goblin: 13, Dwarf: 10, Derro: 6, Orc: 6, Svirfneblin: 3, Durzagon: 1, Human: 1, Orog: 1, "Stone Giant": 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Menzoberranzan": {iPopulation: 32000, Drow: 33, Ogre: 22, Orc: 22, Bugbear: 4, Goblin: 4, Troll: 4, Minotaur: 2, Ogrillon: 2, Quaggoth: 2, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement", sType: "settlement"}, 
    "Reeshov": {iPopulation: 1838, Grimlock: 78, Quaggoth: 15, Lizardfolk: 4, Troglodyte: 2, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Yathchol": {iPopulation: 422, Chitine: 91, Choldrith: 8, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Northdark (undefined)": {iPopulation: 33841, Duergar: 30, Drow: 14, Orc: 12, Goblin: 9, Ogre: 9, Dwarf: 5, Derro: 3, Bugbear: 2, Grimlock: 2, Quaggoth: 2, Svirfneblin: 2, Troll: 2, Chitine: 1, Durzagon: 1, Human: 1, Minotaur: 1, Ogrillon: 1, Orog: 1, "Stone Giant": 1, other: 1, sType: "undefined"}, 
    "aOldShanatar": ["Gatchorof", "Iltkazar", "Oaxaptupa", "Rringlor Noroth", "Sloopdilmonpolop", "Sschindylryn", "Sshamath", "Old Shanatar (undefined)"], 
    "Old Shanatar": {iPopulation: 143781, Drow: 42, Dwarf: 11, "Kuo-Toa": 8, Orc: 7, Cloaker: 4, Goblin: 4, Ogre: 3, Human: 3, Construct: 2, Troglodyte: 2, Outsider: 1, Stinger: 1, Svirfneblin: 1, other: 11, sType: "region"}, 
    "Gatchorof": {iPopulation: 152, Githyanki: 97, "Red Dragon": 2, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Iltkazar": {iPopulation: 7506, Dwarf: 86, Gnome: 5, Svirfneblin: 4, Human: 3, "Urdunnir Dwarf": 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Oaxaptupa": {iPopulation: 1690, Stinger: 93, Salamander: 3, Azer: 2, Duergar: 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Rringlor Noroth": {iPopulation: 3921, Cloaker: 98, "Cloaker Lord": 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Sloopdilmonpolop": {iPopulation: 10877, "Kuo-Toa": 76, Troglodyte: 16, Drow: 4, Duergar: 2, Slyth: 1, other: 1, sSource: "Underdark", sType: "settlement"}, 
    "Sschindylryn": {iPopulation: 15000, Drow: 33, Ogre: 22, Orc: 22, Bugbear: 4, Goblin: 4, Troll: 4, Minotaur: 2, Ogrillon: 2, Quaggoth: 2, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Sshamath": {iPopulation: 60000, Drow: 60, Dwarf: 7, Orc: 7, Goblin: 5, Human: 4, Construct: 3, Outsider: 2, Svirfneblin: 2, "Beholder Mage": 1, "Chromatic Dragon": 1, "Derro Savant": 1, "Elder Orb": 1, Illithilich: 1, Morkoth: 1, Phaerimm: 1, "Savant Aboleth": 1, Sharn: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Old Shanatar (undefined)": {iPopulation: 44635, Drow: 42, Dwarf: 11, "Kuo-Toa": 8, Orc: 7, Cloaker: 4, Goblin: 4, Ogre: 3, Human: 3, Construct: 2, Troglodyte: 2, Outsider: 1, Stinger: 1, Svirfneblin: 1, other: 11, sType: "undefined"}, 
    "aVast": ["Calaunt", "Procampur", "Ravens Bluff", "Tantras", "Tsurlagol", "Vast (undefined)"], 
    "Vast": {iPopulation: 1308960, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Calaunt": {iPopulation: 38706, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Procampur": {iPopulation: 24631, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Ravens Bluff": {iPopulation: 28150, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Tantras": {iPopulation: 21816, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Tsurlagol": {iPopulation: 17594, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Vast (undefined)": {iPopulation: 1178063, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aVilhonReach": ["Assam", "Chondath", "Hlondeth (region)", "Lheshayl", "Nimpeth", "Ormath", "Sapra", "Sespech", "Surkh", "Turmish", 
        "Vilhon Reach (undefined)"], 
    "Vilhon Reach": {iPopulation: 5505840, Human: 95, Elf: 2, Dwarf: 1, Lizardfolk: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Assam": {iPopulation: 6513, Human: 95, Elf: 2, Dwarf: 1, Lizardfolk: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aChondath": ["Arrabar", "Hlath", "Iljak", "Reth", "Shamph", "Chondath (undefined)"], 
    "Chondath": {iPopulation: 1982880, Human: 96, Elf: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Arrabar": {iPopulation: 61012, Human: 96, Elf: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Hlath": {iPopulation: 23969, Human: 96, Elf: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Iljak": {iPopulation: 17432, Human: 96, Elf: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Reth": {iPopulation: 63191, Human: 96, Elf: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Shamph": {iPopulation: 32685, Human: 96, Elf: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Chondath (undefined)": {iPopulation: 1784591, Human: 96, Elf: 2, Dwarf: 1, other: 1, sType: "undefined"}, 
    "aHlondeth(region)": ["Hlondeth (settlement)", "Hlondeth (region) (undefined)"], 
    "Hlondeth (region)": {iPopulation: 453600, Human: 83, Kobold: 15, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "region"}, 
    "Hlondeth (settlement)": {iPopulation: 45360, Human: 83, Kobold: 15, "Yuan-Ti": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Hlondeth (region) (undefined)": {iPopulation: 408240, Human: 83, Kobold: 15, "Yuan-Ti": 1, other: 1, sType: "undefined"}, 
    "Lheshayl": {iPopulation: 7165, Human: 95, Elf: 2, Dwarf: 1, Lizardfolk: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Nimpeth": {iPopulation: 12375, Human: 95, Elf: 2, Dwarf: 1, Lizardfolk: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Ormath": {iPopulation: 6513, Human: 95, Elf: 2, Dwarf: 1, Lizardfolk: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Sapra": {iPopulation: 3226, Human: 95, Elf: 2, Dwarf: 1, Lizardfolk: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aSespech": ["Elbulder", "Mimph", "Ormpetarr", "Sespech (undefined)"], 
    "Sespech": {iPopulation: 952560, Human: 96, Dwarf: 2, Elf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Elbulder": {iPopulation: 12701, Human: 96, Dwarf: 2, Elf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Mimph": {iPopulation: 27518, Human: 96, Dwarf: 2, Elf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Ormpetarr": {iPopulation: 55037, Human: 96, Dwarf: 2, Elf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Sespech (undefined)": {iPopulation: 857304, Human: 96, Dwarf: 2, Elf: 1, other: 1, sType: "undefined"}, 
    "Surkh": {iPopulation: 9770, Lizardfolk: 99, other: 1, sSource: "Serpent Kingdoms", sType: "settlement", sType: "settlement"}, 
    "aTurmish": ["Alaghon", "Gildenglade", "Nonthal", "Turmish (undefined)"], 
    "Turmish": {iPopulation: 1693440, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Alaghon": {iPopulation: 88704, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Gildenglade": {iPopulation: 48384, Elf: 60, Dwarf: 20, "Half-Elf": 15, other: 5, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Nonthal": {iPopulation: 12902, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Turmish (undefined)": {iPopulation: 1543450, Human: 78, Dwarf: 9, Halfling: 5, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "Vilhon Reach (undefined)": {iPopulation: 377798, Human: 95, Elf: 2, Dwarf: 1, Lizardfolk: 1, other: 1, sType: "undefined"}, 
    "aWesternHeartlands": ["Asbravn", "Baldur's Gate", "Berdusk", "Beregost", "Boareskyr Bridge", "Corm Orp", "Daggerford", "Elturel", 
        "Evereska", "Hill's Edge", "Hluthvar", "Iriaebor", "Najara", "Scornubel", "Secomber", "Western Heartlands (undefined)"], 
    "Western Heartlands": {iPopulation: 1641600, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "region"}, 
    "Asbravn": {iPopulation: 5668, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Baldur's Gate": {iPopulation: 42103, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Berdusk": {iPopulation: 20242, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Beregost": {iPopulation: 2915, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Boareskyr Bridge": {iPopulation: 1112, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Corm Orp": {iPopulation: 810, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Daggerford": {iPopulation: 891, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Elturel": {iPopulation: 22671, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Evereska": {iPopulation: 21051, Elf: 98, Halfling: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Hill's Edge": {iPopulation: 9716, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Hluthvar": {iPopulation: 5668, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Iriaebor": {iPopulation: 16193, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "aNajara": ["Great Petrified Serpent", "Serpent's Cowl", "Ss'essethen'aa", "Ss'khanaja", "Ss'kowlyn'raa", "Ss'zuraass'nee", "Najara (undefined)"], 
    "Najara": {iPopulation: 273820, Ophidian: 51, Lizardfolk: 28, Muckdweller: 10, "Yuan-Ti": 7, "Bone Naga": 1, "Dark Naga": 1, "Spirit Naga": 1, other: 1, sSource: "Serpent Kingdoms", sType: "region"}, 
    "Great Petrified Serpent": {iPopulation: 2730, Ophidian: 51, Lizardfolk: 28, Muckdweller: 10, "Yuan-Ti": 7, "Bone Naga": 1, "Dark Naga": 1, "Spirit Naga": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Serpent's Cowl": {iPopulation: 795, Human: 78, Halfling: 9, "Yuan-Ti": 7, Gnome: 5, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Ss'essethen'aa": {iPopulation: 24372, Ophidian: 51, Lizardfolk: 28, Muckdweller: 10, "Yuan-Ti": 7, "Bone Naga": 1, "Dark Naga": 1, "Spirit Naga": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Ss'khanaja": {iPopulation: 5278, Ophidian: 51, Lizardfolk: 28, Muckdweller: 10, "Yuan-Ti": 7, "Bone Naga": 1, "Dark Naga": 1, "Spirit Naga": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Ss'kowlyn'raa": {iPopulation: 1573, Ophidian: 51, Lizardfolk: 28, Muckdweller: 10, "Yuan-Ti": 7, "Bone Naga": 1, "Dark Naga": 1, "Spirit Naga": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Ss'zuraass'nee": {iPopulation: 17998, Ophidian: 51, Lizardfolk: 28, Muckdweller: 10, "Yuan-Ti": 7, "Bone Naga": 1, "Dark Naga": 1, "Spirit Naga": 1, other: 1, sSource: "Serpent Kingdoms", sType: "settlement"}, 
    "Najara (undefined)": {iPopulation: 221074, Ophidian: 51, Lizardfolk: 28, Muckdweller: 10, "Yuan-Ti": 7, "Bone Naga": 1, "Dark Naga": 1, "Spirit Naga": 1, other: 1, sType: "undefined"}, 
    "Scornubel": {iPopulation: 14574, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Secomber": {iPopulation: 1417, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sSource: "Forgotten Realms Campaign Setting", sType: "settlement"}, 
    "Western Heartlands (undefined)": {iPopulation: 1202749, Human: 78, Elf: 7, "Half-Elf": 4, Halfling: 4, "Half-Orc": 3, Gnome: 2, Dwarf: 1, other: 1, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Ghostwalk"] = {
    "aGhostwalk": ["Bazareene", "Hikirian Peninsula", "Salkiria", "Sura-Khiri", "Tereppek", "Thurkasia", "Xaphan"], 
    "aBazareene": ["Belark", "Brunwall", "Dalagath", "Doru", "Falar", "Hazuk", "Khiras", "Sengult", "Theno", "Throngeth", 
        "Bazareene (undefined)"], 
    "Bazareene": {iPopulation: 3079800, Human: 99, other: 1, sSource: "Ghostwalk", sType: "region"}, 
    "Belark": {iPopulation: 16600, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Brunwall": {iPopulation: 10200, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Dalagath": {iPopulation: 7500, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Doru": {iPopulation: 14500, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Falar": {iPopulation: 21300, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Hazuk": {iPopulation: 64200, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Khiras": {iPopulation: 21300, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Sengult": {iPopulation: 4900, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Theno": {iPopulation: 18600, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Throngeth": {iPopulation: 25600, Human: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Bazareene (undefined)": {iPopulation: 2875100, Human: 99, other: 1, sType: "undefined"}, 
    "aHikirianPeninsula": ["Chulla", "Vestarn", "Manifest", "Hikirian Peninsula (undefined)"], 
    "Hikirian Peninsula": {iPopulation: 26233, sType: "region"}, 
    "Chulla": {iPopulation: 1500, sSource: "Ghostwalk", sType: "settlement"}, 
    "Vestarn": {iPopulation: 1100, sSource: "Ghostwalk", sType: "settlement"}, 
    "Manifest": {iPopulation: 22000, Human: 49, Elf: 9, "Half-Elf": 9, Dwarf: 12, Halfling: 10, Gnome: 7, "Half-Orc": 3, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Hikirian Peninsula (undefined)": {iPopulation: 1633, sType: "undefined"}, 
    "aSalkiria": ["Bouldoh", "Deraant", "Leburn", "Nonaull", "Ridou", "Shedarik", "Shetourn", "Wialto", "Salkiria (undefined)"], 
    "Salkiria": {iPopulation: 1219800, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "region"}, 
    "Bouldoh": {iPopulation: 14600, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Deraant": {iPopulation: 8100, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Donaree": {iPopulation: 17800, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Leburn": {iPopulation: 4800, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Nonaull": {iPopulation: 5600, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Ridou": {iPopulation: 8900, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Shedarik": {iPopulation: 7300, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Shetourn": {iPopulation: 10500, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Wialto": {iPopulation: 3200, Human: 92, Halfling: 7, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Salkiria (undefined)": {iPopulation: 1156800, Human: 92, Halfling: 7, other: 1, sType: "undefined"}, 
    "aSura-Khiri": ["Corenial Maksanastacia", "Kavaniivaediir", "Thalanth Lanialusa", "Sura-Khiri (undefined)"], 
    "Sura-Khiri": {iPopulation: 180300, Elf: 99, other: 1, sSource: "Ghostwalk", sType: "region"}, 
    "Corenial Maksanastacia": {iPopulation: 5400, Elf: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Kavaniivaediir": {iPopulation: 1800, Elf: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Thalanth Lanialusa": {iPopulation: 1500, Elf: 99, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Sura-Khiri (undefined)": {iPopulation: 171600, Elf: 99, other: 1, sType: "undefined"}, 
    "aTereppek": ["Heppara", "Hurmerbor", "Kerl", "Paluak", "Porune", "Reldek", "Sevvil", "Teruek", "Tirappa", "Trin", "Tereppek (undefined)"], 
    "Tereppek": {iPopulation: 3597400, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "region"}, 
    "Heppara": {iPopulation: 12900, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Hurmerbor": {iPopulation: 18900, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Kerl": {iPopulation: 7100, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Paluak": {iPopulation: 76700, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Porune": {iPopulation: 23900, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Reldek": {iPopulation: 26300, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Sevvil": {iPopulation: 15100, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Teruek": {iPopulation: 23000, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Tirappa": {iPopulation: 33000, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Trin": {iPopulation: 2300, Human: 98, Dwarf: 1, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Tereppek (undefined)": {iPopulation: 3358200, Human: 98, Dwarf: 1, other: 1, sType: "undefined"}, 
    "aThurkasia": ["Chellon", "Ferrisin", "Jajin", "Valarn", "Thurkasia (undefined)"], 
    "Thurkasia": {iPopulation: 403400, Human: 95, Gnome: 2, Dwarf: 2, other: 1, sSource: "Ghostwalk", sType: "region"}, 
    "Chellon": {iPopulation: 6100, Human: 95, Gnome: 2, Dwarf: 2, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Ferrisin": {iPopulation: 2900, Human: 95, Gnome: 2, Dwarf: 2, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Jajin": {iPopulation: 2600, Human: 95, Gnome: 2, Dwarf: 2, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Valarn": {iPopulation: 4000, Human: 95, Gnome: 2, Dwarf: 2, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Thurkasia (undefined)": {iPopulation: 387800, Human: 95, Gnome: 2, Dwarf: 2, other: 1, sType: "undefined"}, 
    "aXaphan": ["Inilith", "Xaphan (undefined)"], 
    "Xaphan": {iPopulation: 167200, Human: 4, Undead: 95, other: 1, sSource: "Ghostwalk", sType: "region"}, 
    "Inilith": {iPopulation: 7200, Human: 4, Undead: 95, other: 1, sSource: "Ghostwalk", sType: "settlement"}, 
    "Xaphan (undefined)": {iPopulation: 160000, Human: 4, Undead: 95, other: 1, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Greyhawk"] = {
    "aGreyhawk": ["Ahlissa", "Bandit Kingdoms", "Bissel", "Blackmoor", "Blasingdell", "Bone March", "Bright Lands", "Brindinford", "Celene", 
        "Dyvers (region)", "Ekbir (region)", "Frost Barbarians", "Furyondy", "Geoff", "Gran March", "Greyhawk (region)", "Highfolk (region)", 
        "Ice Barbarians", "Irongate (region)", "Iuz", "Keoland", "Ket", "Lendore Isles", "Lordship of the Isles", "North Kingdom", "Nyrond", 
        "Oakhurst", "Onnwal", "Ossington", "Pale", "Paynims", "Perrenland", "Pomarj", "Ratik", "Rel Astra (region)", "Rovers of the Barrens", 
        "Sea Barons", "Sea Princes", "Shield Lands", "Snow Barbarians", "Sterich", "Stonehold", "Sunndi", "Tenh", "Tiger Nomads", "Tristor", 
        "Tusmit", "Ulek County", "Ulek Duchy", "Ulek Principality", "Ull", "Urnst County", "Urnst Duchy", "Veluna", "Verbobonc (region)", 
        "Wolf Nomads", "Yeomanry", "Zeif (region)"], 
    "aAhlissa": ["Carnifand", "Hexpools", "Innspa", "Jalpa", "Kalstrand", "Naerie", "Nulbish", "Orred", "Pardue", "Prymp", "Ralsand", 
        "Rel Deven", "Sarndt", "Torrich", "Zelradton", "Ahlissa (undefined)"], 
    "Ahlissa": {iPopulation: 3836100, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Carnifand": {iPopulation: 4800, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Hexpools": {iPopulation: 12700, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Innspa": {iPopulation: 12200, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Jalpa": {iPopulation: 22900, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kalstrand": {iPopulation: 24000, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Naerie": {iPopulation: 6300, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Nulbish": {iPopulation: 17100, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Orred": {iPopulation: 5800, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Pardue": {iPopulation: 4100, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Prymp": {iPopulation: 17400, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ralsand": {iPopulation: 2500, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Rel Deven": {iPopulation: 29400, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Sarndt": {iPopulation: 2300, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Torrich": {iPopulation: 27500, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Zelradton": {iPopulation: 12900, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ahlissa (undefined)": {iPopulation: 3634200, Human: 78, Halfling: 9, Elf: 5, Dwarf: 2, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, Orc: 1, other: 1, sType: "undefined"}, 
    "aBanditKingdoms": ["Alhaster", "Balmund", "Groucester", "Hallorn", "Kinemeet", "Marsakeer", "Narleon", "Riftcrag", "Rookroost", "Sarresh", 
        "Senningford", "Stoink", "Bandit Kingdoms (undefined)"], 
    "Bandit Kingdoms": {iPopulation: 475200, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Alhaster": {iPopulation: 4700, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Balmund": {iPopulation: 1300, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Groucester": {iPopulation: 1100, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Hallorn": {iPopulation: 540, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kinemeet": {iPopulation: 7300, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Marsakeer": {iPopulation: 630, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Narleon": {iPopulation: 2400, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Riftcrag": {iPopulation: 5000, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Rookroost": {iPopulation: 17500, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Sarresh": {iPopulation: 3600, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Senningford": {iPopulation: 1200, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Stoink": {iPopulation: 13300, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Bandit Kingdoms (undefined)": {iPopulation: 416630, Human: 78, "Half-Orc": 9, Halfling: 5, Elf: 3, Gnome: 2, Dwarf: 1, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aBissel": ["Pellak", "Bissel (undefined)"], 
    "Bissel": {iPopulation: 123880, Human: 82, Dwarf: 10, Elf: 2, Halfling: 2, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Pellak": {iPopulation: 2300, Human: 82, Dwarf: 10, Elf: 2, Halfling: 2, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Bissel (undefined)": {iPopulation: 121580, Human: 82, Dwarf: 10, Elf: 2, Halfling: 2, Gnome: 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aBlackmoor": ["Dantredun", "Egg of Coot", "Blackmoor (undefined)"], 
    "Blackmoor": {iPopulation: 110000, Human: 37, Orc: 20, Halfling: 18, Elf: 10, Gnome: 7, "Half-Orc": 5, "Half-Elf": 2, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Dantredun": {iPopulation: 700, Human: 37, Orc: 20, Halfling: 18, Elf: 10, Gnome: 7, "Half-Orc": 5, "Half-Elf": 2, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Egg of Coot": {iPopulation: 180, Human: 37, Orc: 20, Halfling: 18, Elf: 10, Gnome: 7, "Half-Orc": 5, "Half-Elf": 2, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Blackmoor (undefined)": {iPopulation: 109120, Human: 37, Orc: 20, Halfling: 18, Elf: 10, Gnome: 7, "Half-Orc": 5, "Half-Elf": 2, other: 1, sType: "undefined"}, 
    "Blasingdell": {iPopulation: 2021, Human: 36, Halfling: 20, Elf: 18, Dwarf: 10, Gnome: 7, "Half-Elf": 5, "Half-Orc":3, other: 1, sSource: "Forge of Fury", sType: "settlement"}, 
    "aBoneMarch": ["Knurl", "Johnsport", "Spinecastle", "Bone March (undefined)"], 
    "Bone March": {iPopulation: 310000, Human: 36, Orc: 20, Halfling: 18, Gnome: 10, Elf: 7, "Half-Orc": 4, "Half-Elf": 3, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Knurl": {iPopulation: 13500, Human: 36, Orc: 20, Halfling: 18, Gnome: 10, Elf: 7, "Half-Orc": 4, "Half-Elf": 3, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Johnsport": {iPopulation: 3500, Human: 36, Orc: 20, Halfling: 18, Gnome: 10, Elf: 7, "Half-Orc": 4, "Half-Elf": 3, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Spinecastle": {iPopulation: 6300, Human: 36, Orc: 20, Halfling: 18, Gnome: 10, Elf: 7, "Half-Orc": 4, "Half-Elf": 3, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Bone March (undefined)": {iPopulation: 286700, Human: 36, Orc: 20, Halfling: 18, Gnome: 10, Elf: 7, "Half-Orc": 4, "Half-Elf": 3, Dwarf: 1, other: 1, sType: "undefined"}, 
    "aBrightLands": ["Ul Bakak", "Bright Lands (undefined)"], 
    "Bright Lands": {iPopulation: 26500, Human: 79, Dwarf: 20, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Ul Bakak": {iPopulation: 900, Human: 79, Dwarf: 20, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Bright Lands (undefined)": {iPopulation: 25600, Human: 79, Dwarf: 20, other: 1, sType: "undefined"}, 
    "Brindinford": {iPopulation: 4807, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Speaker in Dreams", sType: "settlement"}, 
    "aCelene": ["Enstad", "Celene (undefined)"], 
    "Celene": {iPopulation: 140000, Elf: 79, Human: 9, "Half-Elf": 5, Gnome: 3, Halfling: 2, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Enstad": {iPopulation: 7200, Elf: 79, Human: 9, "Half-Elf": 5, Gnome: 3, Halfling: 2, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Celene (undefined)": {iPopulation: 132800, Elf: 79, Human: 9, "Half-Elf": 5, Gnome: 3, Halfling: 2, other: 2, sType: "undefined"}, 
    "aDyvers(region)": ["Caltaran", "Dyvers (settlement)", "Maraven", "Dyvers (region) (undefined)"], 
    "Dyvers (region)": {iPopulation: 128000, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Dyvers (settlement)": {iPopulation: 52000, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Caltaran": {iPopulation: 870, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Maraven": {iPopulation: 530, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Dyvers (region) (undefined)": {iPopulation: 74600, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aEkbir(region)": ["Ekbir (settlement)", "Fashtri", "Kofeh", "Ekbir (region) (undefined)"], 
    "Ekbir (region)": {iPopulation: 1960000, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Ekbir (settlement)": {iPopulation: 63700, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Fashtri": {iPopulation: 10000, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kofeh": {iPopulation: 29400, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ekbir (region) (undefined)": {iPopulation: 1856900, Human: 96, Halfling: 2, Elf: 1, other: 1, sType: "undefined"}, 
    "aFrostBarbarians": ["Djekul", "Krakenheim", "Frost Barbarians (undefined)"], 
    "Frost Barbarians": {iPopulation: 144500, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Djekul": {iPopulation: 3100, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Krakenheim": {iPopulation: 4500, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Frost Barbarians (undefined)": {iPopulation: 136900, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sType: "undefined"}, 
    "aFuryondy": ["Baranford", "Caronis", "Chendl", "Crockport", "Free Borough", "Gorsend", "Grabford", "Greatwall", "Kisail", "Libernen", 
        "Littleberg", "Pantarn", "Redoubt", "Willip", "Furyondy (undefined)"], 
    "Furyondy": {iPopulation: 1481800, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Baranford": {iPopulation: 2200, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Caronis": {iPopulation: 3000, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Chendl": {iPopulation: 15600, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Crockport": {iPopulation: 3400, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Free Borough": {iPopulation: 3100, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Gorsend": {iPopulation: 5200, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Grabford": {iPopulation: 8800, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Greatwall": {iPopulation: 4400, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kisail": {iPopulation: 2300, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Libernen": {iPopulation: 3900, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Littleberg": {iPopulation: 7700, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Pantarn": {iPopulation: 2500, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Redoubt": {iPopulation: 5900, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Willip": {iPopulation: 19000, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Furyondy (undefined)": {iPopulation: 1394800, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aGeoff": ["Hochoch", "Pregmere", "Pest's Crossing", "Geoff (undefined)"], 
    "Geoff": {iPopulation: 70000, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Hochoch": {iPopulation: 5500, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Pregmere": {iPopulation: 300, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Pest's Crossing": {iPopulation: 800, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Geoff (undefined)": {iPopulation: 63400, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aGranMarch": ["Hookhill", "Shiboleth", "Gran March (undefined)"], 
    "Gran March": {iPopulation: 254600, Human: 79, Elf: 8, Dwarf: 5, Halfling: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Hookhill": {iPopulation: 7500, Human: 79, Elf: 8, Dwarf: 5, Halfling: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Shiboleth": {iPopulation: 5900, Human: 79, Elf: 8, Dwarf: 5, Halfling: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Gran March (undefined)": {iPopulation: 241200, Human: 79, Elf: 8, Dwarf: 5, Halfling: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aGreyhawk(region)": ["Elmshire", "Greyhawk (settlement)", "Hardby", "Narwell", "Safeton", "Greyhawk (region) (undefined)"], 
    "Greyhawk (region)": {iPopulation: 160000, Human: 78, Halfling: 9, Gnome: 5, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Elmshire": {iPopulation: 4000, Human: 78, Halfling: 9, Gnome: 5, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Greyhawk (settlement)": {iPopulation: 69500, Human: 78, Halfling: 9, Gnome: 5, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Hardby": {iPopulation: 5100, Human: 78, Halfling: 9, Gnome: 5, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Narwell": {iPopulation: 4400, Human: 78, Halfling: 9, Gnome: 5, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Safeton": {iPopulation: 6100, Human: 78, Halfling: 9, Gnome: 5, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Greyhawk (region) (undefined)": {iPopulation: 70900, Human: 78, Halfling: 9, Gnome: 5, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aHighfolk(region)": ["Flameflower", "Highfolk (settlement)", "Verbeeg Hill", "Highfolk (region) (undefined)"], 
    "Highfolk (region)": {iPopulation: 46000, Elf: 78, Human: 9, "Half-Elf": 5, Halfling: 3, Gnome: 2, Dwarf: 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Flameflower": {iPopulation: 500, Elf: 78, Human: 9, "Half-Elf": 5, Halfling: 3, Gnome: 2, Dwarf: 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Highfolk (settlement)": {iPopulation: 8700, Elf: 78, Human: 9, "Half-Elf": 5, Halfling: 3, Gnome: 2, Dwarf: 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Verbeeg Hill": {iPopulation: 1200, Elf: 78, Human: 9, "Half-Elf": 5, Halfling: 3, Gnome: 2, Dwarf: 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Highfolk (region) (undefined)": {iPopulation: 35600, Elf: 78, Human: 9, "Half-Elf": 5, Halfling: 3, Gnome: 2, Dwarf: 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aIceBarbarians": ["Glot", "Jotsplat", "Ice Barbarians (undefined)"], 
    "Ice Barbarians": {iPopulation: 158800, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Glot": {iPopulation: 5100, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Jotsplat": {iPopulation: 3200, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ice Barbarians (undefined)": {iPopulation: 150500, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sType: "undefined"}, 
    "aIrongate(region)": ["Irongate (settlement)", "Northanchor", "Irongate (region) (undefined)"], 
   "Irongate (region)": {iPopulation: 71000, Human: 83, Dwarf: 15, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Irongate (settlement)": {iPopulation: 51400, Human: 83, Dwarf: 15, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Northanchor": {iPopulation: 4850, Human: 83, Dwarf: 15, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Irongate (region) (undefined)": {iPopulation: 14750, Human: 83, Dwarf: 15, Halfling: 1, other: 1, sType: "undefined"}, 
    "aIuz": ["Delaquenn", "Dorakaa", "Greenreach", "Grossfort", "Ixworth", "Izlen", "Kindell", "Molag", "Iuz (undefined)"], 
    "Iuz": {iPopulation: 700000, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Delaquenn": {iPopulation: 3000, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Dorakaa": {iPopulation: 40000, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Greenreach": {iPopulation: 3500, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Grossfort": {iPopulation: 3500, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ixworth": {iPopulation: 3000, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Izlen": {iPopulation: 2500, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kindell": {iPopulation: 4000, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Molag": {iPopulation: 4000, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Iuz (undefined)": {iPopulation: 636500, Orc: 45, Human: 25, Hobgoblin: 10, Halfling: 5, "Half-Orc": 3, Gnome: 2, other: 10, sType: "undefined"}, 
    "aKeoland": ["Cryllor", "Flen", "Gradsul", "Niole Dra", "Keoland (undefined)"], 
    "Keoland": {iPopulation: 1800000, Human: 75, Elf: 8, Gnome: 6, Halfling: 5, "Half-Elf": 2, Dwarf: 1, other: 3, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Cryllor": {iPopulation: 8400, Human: 75, Elf: 8, Gnome: 6, Halfling: 5, "Half-Elf": 2, Dwarf: 1, other: 3, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Flen": {iPopulation: 11900, Human: 75, Elf: 8, Gnome: 6, Halfling: 5, "Half-Elf": 2, Dwarf: 1, other: 3, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Gradsul": {iPopulation: 49400, Human: 75, Elf: 8, Gnome: 6, Halfling: 5, "Half-Elf": 2, Dwarf: 1, other: 3, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Niole Dra": {iPopulation: 25000, Human: 75, Elf: 8, Gnome: 6, Halfling: 5, "Half-Elf": 2, Dwarf: 1, other: 3, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Keoland (undefined)": {iPopulation: 1705300, Human: 75, Elf: 8, Gnome: 6, Halfling: 5, "Half-Elf": 2, Dwarf: 1, other: 3, sType: "undefined"}, 
    "aKet": ["Falwur", "Lopolla", "Molvar", "Polvar", "Ket (undefined)"], 
    "Ket": {iPopulation: 275000, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Falwur": {iPopulation: 13500, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Lopolla": {iPopulation: 27300, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Molvar": {iPopulation: 16000, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Polvar": {iPopulation: 12600, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ket (undefined)": {iPopulation: 205600, Human: 96, Dwarf: 2, Halfling: 1, other: 1, sType: "undefined"}, 
    "aLendoreIsles": ["Lo Reltarma", "Lendore Isles (undefined)"], 
    "Lendore Isles": {iPopulation: 41000, Elf: 96, "Half-Elf": 2, Human: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Lo Reltarma": {iPopulation: 3200, Elf: 96, "Half-Elf": 2, Human: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Lendore Isles (undefined)": {iPopulation: 37800, Elf: 96, "Half-Elf": 2, Human: 1, other: 1, sType: "undefined"}, 
    "aLordshipoftheIsles": ["Duxchan", "Mahan", "Sulward", "Lordship of the Isles (undefined)"], 
    "Lordship of the Isles": {iPopulation: 266000, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Duxchan": {iPopulation: 8900, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Mahan": {iPopulation: 4100, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Sulward": {iPopulation: 7200, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Lordship of the Isles (undefined)": {iPopulation: 245800, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aNorthKingdom": ["Atirr", "Bellport", "Darnagal", "Delaric", "Eastfair", "Edgefield", "Kaport Bay", "Luvern", "Stringen", "Winetha", "North Kingdom (undefined)"], 
    "North Kingdom": {iPopulation: 2618200, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Atirr": {iPopulation: 19700, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Bellport": {iPopulation: 9100, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Darnagal": {iPopulation: 6400, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Delaric": {iPopulation: 22000, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Eastfair": {iPopulation: 35000, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Edgefield": {iPopulation: 19800, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kaport Bay": {iPopulation: 5800, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Luvern": {iPopulation: 3100, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Stringen": {iPopulation: 4700, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Winetha": {iPopulation: 19300, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "North Kingdom (undefined)": {iPopulation: 2473300, Human: 83, Orc: 9, Goblin: 3, Halfling: 2, "Half-Orc": 1, other: 2, sType: "undefined"}, 
    "aNyrond": ["Arndulanth", "Arnford", "Beetu", "Borneven", "Callistor", "Cordrend", "Curtulenn", "Greenplane", "Hammensend", 
        "Hendrenn Halgood", "Kerrinn", "Midmeadow", "Mithat", "Mowbrenn", "Nessermouth", "Oldred", "Rel Mord", "Swan Bore", "Womtham", 
        "Woodwych", "Wragby", "Nyrond (undefined)"], 
    "Nyrond": {iPopulation: 2618200, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Arndulanth": {iPopulation: 2300, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Arnford": {iPopulation: 3900, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Beetu": {iPopulation: 12100, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Borneven": {iPopulation: 9900, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Callistor": {iPopulation: 4300, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Cordrend": {iPopulation: 5000, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Curtulenn": {iPopulation: 5200, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Greenplane": {iPopulation: 1600, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Hammensend": {iPopulation: 9000, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Hendrenn Halgood": {iPopulation: 14800, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kerrinn": {iPopulation: 3500, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Midmeadow": {iPopulation: 11100, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Mithat": {iPopulation: 29000, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Mowbrenn": {iPopulation: 20700, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Nessermouth": {iPopulation: 3100, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Oldred": {iPopulation: 22000, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Rel Mord": {iPopulation: 46500, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Swan Bore": {iPopulation: 2800, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Womtham": {iPopulation: 19200, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Woodwych": {iPopulation: 24300, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Wragby": {iPopulation: 7300, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Nyrond (undefined)": {iPopulation: 2360600, Human: 78, Elf: 9, Halfling: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "Oakhurst": {iPopulation: 901, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Sunless Citadel", sType: "settlement"}, 
    "aOnnwal": ["Scant", "Onnwal (undefined)"], 
    "Onnwal": {iPopulation: 85500, Human: 79, Dwarf: 9, Gnome: 5, Halfling: 3, Elf: 2, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Scant": {iPopulation: 4500, Human: 79, Dwarf: 9, Gnome: 5, Halfling: 3, Elf: 2, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Onnwal (undefined)": {iPopulation: 81000, Human: 79, Dwarf: 9, Gnome: 5, Halfling: 3, Elf: 2, other: 2, sType: "undefined"}, 
    "Ossington": {iPopulation: 74, Human: 95, Halfling: 2, "Half-Elf": 2, other: 1, sSource: "Standing Stone", sType: "settlement"}, 
    "aPale": ["Eltison", "Hatherleigh", "Hawkburgh", "Holdworthy", "Landrigard", "Ogburg", "Rakervale", "Stradsett", "Wintershiven", 
        "Pale (undefined)"], 
    "Pale": {iPopulation: 395000, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Eltison": {iPopulation: 15400, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Hatherleigh": {iPopulation: 24500, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Hawkburgh": {iPopulation: 12400, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Holdworthy": {iPopulation: 16700, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Landrigard": {iPopulation: 7800, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ogburg": {iPopulation: 17400, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Rakervale": {iPopulation: 13700, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Stradsett": {iPopulation: 10900, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Wintershiven": {iPopulation: 39900, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Pale (undefined)": {iPopulation: 236300, Human: 96, Halfling: 2, Elf: 1, other: 1, sType: "undefined"}, 
    "aPaynims": ["Kanak", "Paynims (undefined)"], 
    "Paynims": {iPopulation: 500000, Human: 96, Centaur: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Kanak": {iPopulation: 12900, Human: 96, Centaur: 2, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Paynims (undefined)": {iPopulation: 487100, Human: 96, Centaur: 2, Halfling: 1, other: 1, sType: "undefined"}, 
    "aPerrenland": ["Krestible", "Schwartzenbruin", "Traft", "Perrenland (undefined)"], 
    "Perrenland": {iPopulation: 468000, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Krestible": {iPopulation: 7300, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Schwartzenbruin": {iPopulation: 27500, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Traft": {iPopulation: 1200, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Perrenland (undefined)": {iPopulation: 432000, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aPomarj": ["Badwall", "Blue", "Elredd", "Fax", "Highport", "Stoneheim", "Pomarj (undefined)"], 
    "Pomarj": {iPopulation: 476000, Orc: 43, Human: 28, Goblin: 15, Hobgoblin: 10, Halfling: 3, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Badwall": {iPopulation: 3300, Orc: 43, Human: 28, Goblin: 15, Hobgoblin: 10, Halfling: 3, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Blue": {iPopulation: 6300, Orc: 43, Human: 28, Goblin: 15, Hobgoblin: 10, Halfling: 3, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Elredd": {iPopulation: 1500, Orc: 43, Human: 28, Goblin: 15, Hobgoblin: 10, Halfling: 3, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Fax": {iPopulation: 2000, Orc: 43, Human: 28, Goblin: 15, Hobgoblin: 10, Halfling: 3, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Highport": {iPopulation: 15000, Orc: 43, Human: 28, Goblin: 15, Hobgoblin: 10, Halfling: 3, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Stoneheim": {iPopulation: 5700, Orc: 43, Human: 28, Goblin: 15, Hobgoblin: 10, Halfling: 3, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Pomarj (undefined)": {iPopulation: 442200, Orc: 43, Human: 28, Goblin: 15, Hobgoblin: 10, Halfling: 3, other: 1, sType: "undefined"}, 
    "aRatik": ["Marner", "Ratikhill", "Ratik (undefined)"], 
    "Ratik": {iPopulation: 138500, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Marner": {iPopulation: 6600, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ratikhill": {iPopulation: 5500, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ratik (undefined)": {iPopulation: 126400, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aRelAstra(region)": ["Farlen", "Grelden", "Ountsy", "Rel Astra (settlement)", "Roland", "Rel Astra (region) (undefined)"], 
    "Rel Astra (region)": {iPopulation: 380000, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Farlen": {iPopulation: 1350, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Grelden": {iPopulation: 1600, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ountsy": {iPopulation: 29500, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Rel Astra (settlement)": {iPopulation: 61000, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Roland": {iPopulation: 5500, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Rel Astra (region) (undefined)": {iPopulation: 281050, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Orc": 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "Rovers of the Barrens": {iPopulation: 35000, Human: 36, Orc: 20, Goblin: 18, Hobgoblin: 10, Halfling: 7, Gnome: 5, "Half-Orc": 3, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "aSeaBarons": ["Asperdi", "Oakenheart", "Sea Barons (undefined)"], 
    "Sea Barons": {iPopulation: 154000, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Asperdi": {iPopulation: 8100, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Oakenheart": {iPopulation: 5000, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Sea Barons (undefined)": {iPopulation: 140900, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aSeaPrinces": ["Hokar", "Monmurg", "Port Toli", "Westkeep", "Sea Princes (undefined)"], 
    "Sea Princes": {iPopulation: 420000, Human: 79, Halfling: 8, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Hokar": {iPopulation: 21000, Human: 79, Halfling: 8, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Monmurg": {iPopulation: 15000, Human: 79, Halfling: 8, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Port Toli": {iPopulation: 11000, Human: 79, Halfling: 8, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Westkeep": {iPopulation: 9500, Human: 79, Halfling: 8, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Sea Princes (undefined)": {iPopulation: 363500, Human: 79, Halfling: 8, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sType: "undefined"}, 
    "aShieldLands": ["Admundfort", "Bright Sentry", "Critwall", "Shield Lands (undefined)"], 
    "Shield Lands": {iPopulation: 27000, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Admundfort": {iPopulation: 5000, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Bright Sentry": {iPopulation: 2700, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Critwall": {iPopulation: 14300, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Shield Lands (undefined)": {iPopulation: 5000, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aSnowBarbarians": ["Knudje", "Soull", "Snow Barbarians (undefined)"], 
    "Snow Barbarians": {iPopulation: 209000, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Knudje": {iPopulation: 4500, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Soull": {iPopulation: 5600, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Snow Barbarians (undefined)": {iPopulation: 198900, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aSterich": ["Istivin", "Sterich (undefined)"], 
    "Sterich": {iPopulation: 144000, Human: 78, Dwarf: 8, Halfling: 6, Gnome: 3, Elf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Istivin": {iPopulation: 12100, Human: 78, Dwarf: 8, Halfling: 6, Gnome: 3, Elf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Sterich (undefined)": {iPopulation: 131900, Human: 78, Dwarf: 8, Halfling: 6, Gnome: 3, Elf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aStonehold": ["Bastro", "Kelten", "Purmill", "Vlekstaad", "Stonehold (undefined)"], 
    "Stonehold": {iPopulation: 55000, Human: 96, Orc: 2, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Bastro": {iPopulation: 1700, Human: 96, Orc: 2, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kelten": {iPopulation: 2800, Human: 96, Orc: 2, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Purmill": {iPopulation: 1900, Human: 96, Orc: 2, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Vlekstaad": {iPopulation: 2200, Human: 96, Orc: 2, Dwarf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Stonehold (undefined)": {iPopulation: 46400, Human: 96, Orc: 2, Dwarf: 1, other: 1, sType: "undefined"}, 
    "aSunndi": ["Newkeep", "Pitchfield", "Sunndi (undefined)"], 
    "Sunndi": {iPopulation: 125000, Human: 79, Elf: 9, Dwarf: 5, Gnome: 3, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Newkeep": {iPopulation: 2700, Human: 79, Elf: 9, Dwarf: 5, Gnome: 3, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Pitchfield": {iPopulation: 3800, Human: 79, Elf: 9, Dwarf: 5, Gnome: 3, Halfling: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Sunndi (undefined)": {iPopulation: 118500, Human: 79, Elf: 9, Dwarf: 5, Gnome: 3, Halfling: 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aTenh": ["Atherstone", "Calbut", "Nevond Nevnend", "Redspan", "Tenh (undefined)"], 
    "Tenh": {iPopulation: 195000, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Atherstone": {iPopulation: 4500, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Calbut": {iPopulation: 14500, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Nevond Nevnend": {iPopulation: 25200, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Redspan": {iPopulation: 21000, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Tenh (undefined)": {iPopulation: 129800, Human: 78, Halfling: 9, Elf: 4, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 2, sType: "undefined"}, 
    "aTigerNomads": ["Yecha", "Tiger Nomads (undefined)"], 
    "Tiger Nomads": {iPopulation: 104000, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Yecha": {iPopulation: 4100, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Tiger Nomads (undefined)": {iPopulation: 99900, Human: 96, Halfling: 2, Elf: 1, other: 1, sType: "undefined"}, 
    "Tristor": {iPopulation: 180, sSource: "Fright at Tristor", sType: "settlement"}, 
    "aTusmit": ["Blashikdur", "Sefmur", "Vilayad", "Tusmit (undefined)"], 
    "Tusmit": {iPopulation: 273000, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Blashikdur": {iPopulation: 9900, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Sefmur": {iPopulation: 21000, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Vilayad": {iPopulation: 12200, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Tusmit (undefined)": {iPopulation: 229900, Human: 78, Dwarf: 8, Halfling: 6, Elf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aUlekCounty": ["Courwood", "Jurnre", "Kewlbanks", "Ulek County (undefined)"], 
    "Ulek County": {iPopulation: 370000, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Courwood": {iPopulation: 7800, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Jurnre": {iPopulation: 13100, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Kewlbanks": {iPopulation: 10900, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ulek County (undefined)": {iPopulation: 338200, Human: 78, Gnome: 8, Halfling: 6, Elf: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aUlekDuchy": ["Axegard", "Tringlee", "Waybury", "Ulek Duchy (undefined)"], 
    "Ulek Duchy": {iPopulation: 392200, Human: 43, "Half-Elf": 32, Elf: 19, Gnome: 3, Halfling: 2, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Axegard": {iPopulation: 13200, Human: 43, "Half-Elf": 32, Elf: 19, Gnome: 3, Halfling: 2, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Tringlee": {iPopulation: 14500, Human: 43, "Half-Elf": 32, Elf: 19, Gnome: 3, Halfling: 2, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Waybury": {iPopulation: 11500, Human: 43, "Half-Elf": 32, Elf: 19, Gnome: 3, Halfling: 2, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ulek Duchy (undefined)": {iPopulation: 353000, Human: 43, "Half-Elf": 32, Elf: 19, Gnome: 3, Halfling: 2, other: 1, sType: "undefined"}, 
    "aUlekPrincipality": ["Eastpass", "Gryrax", "Havenhill", "Thunderstrike", "Ulek Principality (undefined)"], 
    "Ulek Principality": {iPopulation: 538400, Human: 53, Dwarf: 30, Halfling: 10, Elf: 3, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Eastpass": {iPopulation: 15500, Human: 53, Dwarf: 30, Halfling: 10, Elf: 3, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Gryrax": {iPopulation: 27300, Human: 53, Dwarf: 30, Halfling: 10, Elf: 3, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Havenhill": {iPopulation: 32100, Human: 53, Dwarf: 30, Halfling: 10, Elf: 3, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Thunderstrike": {iPopulation: 17400, Human: 53, Dwarf: 30, Halfling: 10, Elf: 3, Gnome: 2, "Half-Elf": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ulek Principality (undefined)": {iPopulation: 446100, Human: 53, Dwarf: 30, Halfling: 10, Elf: 3, Gnome: 2, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "aUll": ["Kester", "Ulakand", "Ull (undefined)"], 
    "Ull": {iPopulation: 277400, Human: 94, Halfling: 2, Orc: 2, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Kester": {iPopulation: 8600, Human: 94, Halfling: 2, Orc: 2, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ulakand": {iPopulation: 6000, Human: 94, Halfling: 2, Orc: 2, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ull (undefined)": {iPopulation: 262800, Human: 94, Halfling: 2, Orc: 2, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aUrnstCounty": ["Brotton", "Caporna", "Didieln", "High Mardreth", "Jedbridge", "Radigast City", "Stone Battle", "Trigol", "Urnst County (undefined)"], 
    "Urnst County": {iPopulation: 682200, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Brotton": {iPopulation: 29000, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Caporna": {iPopulation: 5900, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Didieln": {iPopulation: 3300, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "High Mardreth": {iPopulation: 6400, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Jedbridge": {iPopulation: 7100, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Radigast City": {iPopulation: 44800, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Stone Battle": {iPopulation: 2900, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Trigol": {iPopulation: 9600, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Urnst County (undefined)": {iPopulation: 573200, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aUrnstDuchy": ["Goldplain", "Leukish", "Nellix", "Nyrstran", "Pontyrel", "Seltaren", "Urnst Duchy (undefined)"], 
    "Urnst Duchy": {iPopulation: 751850, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Goldplain": {iPopulation: 6700, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Leukish": {iPopulation: 22300, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Nellix": {iPopulation: 13400, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Nyrstran": {iPopulation: 8600, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Pontyrel": {iPopulation: 7550, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Seltaren": {iPopulation: 9800, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Urnst Duchy (undefined)": {iPopulation: 683500, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "Veluna": {iPopulation: 668800, Human: 78, Elf: 9, Gnome: 5, Halfling: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "aVerbobonc(region)": ["Hommlet", "Rastor", "Verbobonc (settlement)", "Verbobonc (region) (undefined)"], 
    "Verbobonc (region)": {iPopulation: 177800, Human: 78, Elf: 9, Gnome: 5, Halfling: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Hommlet": {iPopulation: 950, Human: 78, Halfling: 7, Elf: 5, Gnome: 4, Dwarf: 3, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Return to the Temple of Elemental Evil", sType: "settlement"}, 
    "Rastor": {iPopulation: 118, Human: 34, Dwarf: 30, Halfling: 8, Orc: 8, "Half-Orc": 8, Gnome: 8, Elf: 3, other: 1, sSource: "Return to the Temple of Elemental Evil", sType: "settlement"}, 
    "Verbobonc (settlement)": {iPopulation: 12700, Human: 78, Elf: 9, Gnome: 5, Halfling: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Verbobonc (region) (undefined)": {iPopulation: 164032, Human: 78, Elf: 9, Gnome: 5, Halfling: 3, Dwarf: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aWolfNomads": ["Ungra Balan", "Wolf Nomads (undefined)"], 
    "Wolf Nomads": {iPopulation: 120000, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Ungra Balan": {iPopulation: 8300, Human: 96, Halfling: 2, Elf: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Wolf Nomads (undefined)": {iPopulation: 111700, Human: 96, Halfling: 2, Elf: 1, other: 1, sType: "undefined"}, 
    "aYeomanry": ["Farvale", "Loftwick", "Longspear", "North Reach", "Westburn", "Yeomanry (undefined)"], 
    "Yeomanry": {iPopulation: 305900, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Farvale": {iPopulation: 4400, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Loftwick": {iPopulation: 8400, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Longspear": {iPopulation: 7700, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "North Reach": {iPopulation: 3700, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Westburn": {iPopulation: 2500, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Yeomanry (undefined)": {iPopulation: 279200, Human: 78, Halfling: 9, Elf: 5, Dwarf: 3, Gnome: 2, "Half-Elf": 1, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aZeif(region)": ["Antalotol", "Ceshra", "Dhabiya", "Zeif (settlement)", "Zeif (region) (undefined)"], 
    "Zeif (region)": {iPopulation: 1628300, Human: 88, Orc: 10, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "region"}, 
    "Antalotol": {iPopulation: 10700, Human: 88, Orc: 10, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Ceshra": {iPopulation: 16600, Human: 88, Orc: 10, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Dhabiya": {iPopulation: 14900, Human: 88, Orc: 10, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Zeif (settlement)": {iPopulation: 43500, Human: 88, Orc: 10, Halfling: 1, other: 1, sSource: "Living Greyhawk Gazetteer", sType: "settlement"}, 
    "Zeif (region) (undefined)": {iPopulation: 1542600, Human: 88, Orc: 10, Halfling: 1, other: 1, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Jakandor"] = {
    "aJakandor": ["Alchatay", "Amaruk", "Anhramtep Camp", "Borhall", "Daalramihn Farms", "Detsahi", "Dironhi", "Dredhall", "Falkrest", 
    "Farfield", "Gallet", "Goklaya", "Hanahi", "Hanfalk", "Hoyoka", "Ihnhotep", "Kaskahi", "Kralrest", "Lanor's Stead", "Lelaka", "Lokkfalk", 
    "Mirqadaal", "Moraka", "Nefeneser", "Nefon Camp", "Nethton Farms", "Nunneka", "Nunohi", "Onaya", "Orchaleum", "Richground", "Sekohi", 
    "Shaleum", "Shanethi Farms", "Shatayet", "Stormbreak", "Suhanet", "Tawya", "Tephodaal Camp", "Uhwahmir", "Urelhi", "Uton Settlement"], 
    "Jakandor": {sType: "region"}, 
    "Alchatay": {iPopulation: 20000, sSource: "Isle of Destiny", sType: "settlement"}, 
    "Amaruk": {iPopulation: 42000, sSource: "Isle of Destiny", sType: "settlement"}, 
    "Anhramtep Camp": {iPopulation: 400, sSource: "Land of Legend", sType: "settlement"}, 
    "Borhall": {iPopulation: 4000, sSource: "Island of War", sType: "settlement"}, 
    "Daalramihn Farms": {iPopulation: 15400, sSource: "Isle of Destiny", sType: "region"}, 
    "Detsahi": {iPopulation: 650, sSource: "Island of War", sType: "settlement"}, 
    "Dironhi": {iPopulation: 500, sSource: "Island of War", sType: "settlement"}, 
    "Dredhall": {iPopulation: 3200, sSource: "Island of War", sType: "settlement"}, 
    "Falkrest": {iPopulation: 5000, sSource: "Island of War", sType: "settlement"}, 
    "Farfield": {iPopulation: 300, sSource: "Island of War", sType: "settlement"}, 
    "Gallet": {iPopulation: 400, sSource: "Island of War", sType: "settlement"}, 
    "Goklaya": {iPopulation: 800, sSource: "Island of War", sType: "settlement"}, 
    "Hanahi": {iPopulation: 400, sSource: "Island of War", sType: "settlement"}, 
    "Hanfalk": {iPopulation: 200, sSource: "Island of War", sType: "settlement"}, 
    "Hoyoka": {iPopulation: 500, sSource: "Island of War", sType: "settlement"}, 
    "Ihnhotep": {iPopulation: 2500, sSource: "Isle of Destiny", sType: "settlement"}, 
    "Kaskahi": {iPopulation: 300, sSource: "Island of War", sType: "settlement"}, 
    "Kralrest": {iPopulation: 3000, sSource: "Island of War", sType: "settlement"}, 
    "Lanor's Stead": {iPopulation: 400, sSource: "Island of War", sType: "settlement"}, 
    "Lelaka": {iPopulation: 600, sSource: "Island of War", sType: "settlement"}, 
    "Lokkfalk": {iPopulation: 200, sSource: "Island of War", sType: "settlement"}, 
    "Mirqadaal": {iPopulation: 3000, sSource: "Land of Legend", sType: "settlement"}, 
    "Moraka": {iPopulation: 500, sSource: "Island of War", sType: "settlement"}, 
    "Nefeneser": {iPopulation: 10000, sSource: "Isle of Destiny", sType: "settlement"}, 
    "Nefon Camp": {iPopulation: 800, sSource: "Isle of Destiny", sType: "settlement"}, 
    "Nethton Farms": {iPopulation: 16000, sSource: "Isle of Destiny", sType: "settlement"}, 
    "Nunneka": {iPopulation: 300, sSource: "Island of War", sType: "settlement"}, 
    "Nunohi": {iPopulation: 800, sSource: "Island of War", sType: "settlement"}, 
    "Onaya": {iPopulation: 400, sSource: "Island of War", sType: "settlement"}, 
    "Orchaleum": {iPopulation: 44000, sSource: "Isle of Destiny", sType: "settlement"}, 
    "Richground": {iPopulation: 500, sSource: "Island of War", sType: "settlement"}, 
    "Sekohi": {iPopulation: 200, sSource: "Island of War", sType: "settlement"}, 
    "Shaleum": {iPopulation: 75, sSource: "Land of Legend", sType: "compound"}, 
    "Shanethi Farms": {iPopulation: 18450, sSource: "Isle of Destiny", sType: "region"}, 
    "Shatayet": {iPopulation: 400, sSource: "Island of War", sType: "settlement"}, 
    "Stormbreak": {iPopulation: 2800, sSource: "Island of War", sType: "settlement"}, 
    "Suhanet": {iPopulation: 400, sSource: "Island of War", sType: "settlement"}, 
    "Tawya": {iPopulation: 200, sSource: "Island of War", sType: "settlement"}, 
    "Tephodaal Camp": {iPopulation: 4000, sSource: "Land of Legend", sType: "settlement"}, 
    "Uhwahmir": {iPopulation: 4000, sSource: "Isle of Destiny", sType: "settlement"}, 
    "Urelhi": {iPopulation: 600, sSource: "Island of War", sType: "settlement"}, 
    "Uton Settlement": {iPopulation: 3200, sSource: "Land of Legend", sType: "settlement"}, 
    sType: "region"
};

oNIB.oSettings["Lankhmar"] = {
    "aLankhmar": ["The East", "Land of the Eight Cities", "Lankhmar (region)", "The North", "Seas"], 
    "aTheEast": ["City of the Ghouls", "Eevanmarensee", "Horborixen", "Ilthmar", "Ool Krut", "Tilsinilit", "The East (undefined)"], 
    "The East": {iPopulation: 35007, sType: "region"}, 
    "City of the Ghouls": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Eevanmarensee": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Horborixen": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Ilthmar": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Ool Krut": {iPopulation: 5001, sSource: "City of Adventure", sType: "settlement"}, 
    "Tilsinilit": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "The East (undefined)": {iPopulation: 5001, sType: "undefined"}, 
    "aLandoftheEightCities": ["Gnamph Nar", "Ilik-Ving", "Klelg Nar", "Kvarch Nar", "Mlurg Nar", "No-Ombrulsk", "Ool Hrusp", "Sarheenmar", 
        "Land of the Eight Cities (undefined)"], 
    "Land of the Eight Cities": {iPopulation: 45009, sType: "region"}, 
    "Gnamph Nar": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Ilik-Ving": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Klelg Nar": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Kvarch Nar": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Mlurg Nar": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "No-Ombrulsk": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Ool Hrusp": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Sarheenmar": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Land of the Eight Cities (undefined)": {iPopulation: 5001, sType: "undefined"}, 
    "aLankhmar(region)": ["Grain Fields", "Klesh", "Kokgnab", "Lakes of Pleea", "Lankhmar City", "Quarmall", "Lankhmar (region) (undefined)"], 
    "Lankhmar (region)": {iPopulation: 35007, sType: "region"}, 
    "Grain Fields": {iPopulation: 5001, sSource: "City of Adventure", sType: "region"}, 
    "Klesh": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "region"}, 
    "Kokgnab": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Lakes of Pleea": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "region"}, 
    "Lankhmar City": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Quarmall": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    "Lankhmar (region) (undefined)": {iPopulation: 5001, sType: "undefined"}, 
    "aTheNorth": ["Bones of the Old Ones", "Cold Corner", "The Cold Wastes", "The Steppes"], 
    "The North": {iPopulation: 20004, sType: "region"}, 
    "Bones of the Old Ones": {iPopulation: 5001, "Ice Gnome": 99, other: 1, sSource: "Fritz Leiber's Lankhmar", sType: "region"}, 
    "Cold Corner": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "region"}, 
    "The Cold Wastes": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "region"}, 
    "The Steppes": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "region"}, 
    "aSeas": ["Rime Isle", "Simorgya"], 
    "Seas": {iPopulation: 10002, sType: "region"}, 
    "Rime Isle": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "region"}, 
    "Simorgya": {iPopulation: 5001, sSource: "Fritz Leiber's Lankhmar", sType: "settlement"}, 
    sType: "region"
};

oNIB.oSettings["Mahasarpa"] = {
    "aMahasarpa": ["Bhalluka", "Gardharua", "Kokaha", "Lakshmana", 
        "Naga", "Singha", "Uriscika"],
    "Bhalluka": {iPopulation: 60000, sSource: "Mahasarpa", 
        sType: "region"},
    "Gardharua": {iPopulation: 30000, sSource: "Mahasarpa", 
        sType: "region"},
    "Kokaha": {iPopulation: 55000, sSource: "Mahasarpa", 
        sType: "region"},
    "Lakshmana": {iPopulation: 45000, sSource: "Mahasarpa", 
        sType: "region"},
    "Naga": {iPopulation: 20000, sSource: "Mahasarpa", sType: "region"},
    "Singha": {iPopulation: 40000, sSource: "Mahasarpa", 
        sType: "region"},
    "Uriscika": {iPopulation: 15000, sSource: "Mahasarpa", 
        sType: "region"}
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

oNIB.oSettings["Pelinore"] = {
    "aPelinore": ["Aurianne", "Cerwyn", "The City League", "The Domains", "Dontaldur", "The Perfect Kingdoms", "Splintered Lands", "Theocratic Principalities", "Tradecities of Xir"], 
    "Aurianne": {iPopulation: 84748, sType: "region"}, 
    "aCerwyn": ["Amberteak", "Amburane", "Amfleat", "Arncastle", "Borth", "Bundock", "Burghalter", "Cipello", "Cloke", "Dahn", "Darkmoor", 
        "Deepvein", "Gallivan", "Gallo", "Galtry", "High Lygol", "Hyrpum", "Jarhalter", "Jarne", "Juhil", "Kaantinnen", "Mamelok", "Markennis", 
        "Newvines", "Oakhoft", "Osport", "Ossby", "Pollard", "Preven", "Roseberry", "Sharifika", "Tellhafter", "Tirhalter", "Urma", "Wicbold", 
        "Cerwyn (undefined)"], 
    "Cerwyn": {iPopulation: 84748, Human: 49, Elf: 8, Gnome: 3, "Half-Elf": 3, other: 37, sType: "region"}, 
    "Amberteak": {iPopulation: 950, Human: 20, other: 80, sSource: "Imagine #25", sType: "settlement"}, 
    "Amburane": {iPopulation: 1100, Human: 74, Elf: 15, Gnome: 5, "Half-Elf": 5, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Amfleat": {iPopulation: 2567, sSource: "Imagine #25", sType: "settlement"}, 
    "Arncastle": {iPopulation: 2567, sSource: "Imagine #25", sType: "settlement"}, 
    "Borth": {iPopulation: 2000, Human: 80, other: 20, sSource: "Imagine #25", sType: "settlement"}, 
    "Bundock": {iPopulation: 500, Human: 20, other: 80, sSource: "Imagine #25", sType: "settlement"}, 
    "Burghalter": {iPopulation: 125, Human: 49, Elf: 25, "Half-Elf": 25, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Cipello": {iPopulation: 750, Human: 90, other: 10, sSource: "Imagine #25", sType: "settlement"}, 
    "Cloke": {iPopulation: 150, Gnome: 50, Human: 30, other: 20, sSource: "Imagine #25", sType: "settlement"}, 
    "Dahn": {iPopulation: 1500, Human: 69, Elf: 30, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Darkmoor": {iPopulation: 2700, Human: 79, Dwarf: 20, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Deepvein": {iPopulation: 550, Dwarf: 80, Human: 19, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Gallivan": {iPopulation: 450, Elf: 40, "Half-Elf": 25, Human: 24, Gnome: 10, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Gallo": {iPopulation: 1000, Human: 90, other: 10, sSource: "Imagine #25", sType: "settlement"}, 
    "Galtry": {iPopulation: 350, Human: 64, Gnome: 35, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "High Lygol": {iPopulation: 7500, Human: 50, other: 50, sSource: "Imagine #25", sType: "settlement"}, 
    "Hyrpum": {iPopulation: 3000, Human: 74, Elf: 15, Dwarf: 5, Gnome: 5, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Jarhalter": {iPopulation: 500, Human: 20, other: 80, sSource: "Imagine #25", sType: "settlement"}, 
    "Jarne": {iPopulation: 500, Human: 50, other: 50, sSource: "Imagine #25", sType: "settlement"}, 
    "Juhil": {iPopulation: 260, Elf: 45, Human: 39, Gnome: 15, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Kaantinnen": {iPopulation: 280, Elf: 35, other: 65, sSource: "Imagine #25", sType: "settlement"}, 
    "Mamelok": {iPopulation: 125, Elf: 75, Human: 24, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Markennis": {iPopulation: 310, Human: 69, Gnome: 30, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Newvines": {iPopulation: 350, Human: 64, Gnome: 35, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Oakhoft": {iPopulation: 175, Human: 90, other: 10, sSource: "Imagine #25", sType: "settlement"}, 
    "Osport": {iPopulation: 7500, Dwarf: 50, Human: 25, other: 25, sSource: "Imagine #25", sType: "settlement"}, 
    "Ossby": {iPopulation: 180, Human: 60, Dwarf: 20, other: 20, sSource: "Imagine #25", sType: "settlement"}, 
    "Pollard": {iPopulation: 210, Human: 74, Elf: 25, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Preven": {iPopulation: 250, Human: 49, Elf: 25, Gnome: 25, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Roseberry": {iPopulation: 1400, Human: 20, other: 80, sSource: "Imagine #25", sType: "settlement"}, 
    "Sharifika": {iPopulation: 500, Human: 90, other: 10, sSource: "Imagine #25", sType: "settlement"}, 
    "Tellhafter": {iPopulation: 350, Human: 95, other: 5, sSource: "Imagine #25", sType: "settlement"}, 
    "Tirhalter": {iPopulation: 300, Human: 99, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Urma": {iPopulation: 175, "Half-Elf": 79, Human: 20, other: 1, sSource: "Imagine #25", sType: "settlement"}, 
    "Wicbold": {iPopulation: 1250, Human: 75, other: 25, sSource: "Imagine #25", sType: "settlement"}, 
    "Cerwyn (undefined)": {iPopulation: 42374, Human: 49, Elf: 8, Gnome: 3, "Half-Elf": 3, other: 37, sType: "undefined"}, 
    "The City League": {iPopulation: 84748, sType: "region"}, 
    "The Domains": {iPopulation: 84748, sType: "region"}, 
    "Dontaldur": {iPopulation: 84748, sType: "region"}, 
    "The Perfect Kingdoms": {iPopulation: 84748, sType: "region"}, 
    "Splintered Lands": {iPopulation: 84748, sType: "region"}, 
    "Theocratic Principalities": {iPopulation: 84748, sType: "region"}, 
    "Tradecities of Xir": {iPopulation: 84748, sType: "region"}, 
    sType: "region"
};

oNIB.oSettings["Planescape"] = {
    "aPlanescape": ["Acheron", "Arcadia", "Astral Plane", "Baator", "Ethereal Plane", "Gehenna", "Grey Waste", "Limbo", "Outlands"], 
    "aAcheron": ["Mesk"], 
    "Acheron": {iPopulation: 1000, sType: "region"}, 
    "Mesk": {iPopulation: 1000, sSource: "Planes of Law", sType: "settlement"}, 
    "aArcadia": ["Ghetto"], 
    "Arcadia": {iPopulation: 5000, sType: "region"}, 
    "Ghetto": {iPopulation: 5000, sSource: "Planes of Law", sType: "settlement"}, 
    "aAstralPlane": ["T'n'ekris", "Xamvadi'm"], 
    "Astral Plane": {iPopulation: 16160, Githyanki: 99, other: 1, sType: "region"}, 
    "T'n'ekris": {iPopulation: 8080, Githyanki: 99, other: 1, sSource: "A Guide to the Astral Plane", sType: "settlement"}, 
    "Xamvadi'm": {iPopulation: 8080, Githyanki: 99, other: 1, sSource: "A Guide to the Astral Plane", sType: "settlement"}, 
    "aBaator": ["Frekstavik", "Khas-tep", "Nibellin", "Snjarll", "Tukhamen"], 
    "Baator": {iPopulation: 115000, sType: "region"}, 
    "Frekstavik": {iPopulation: 30000, sSource: "Planes of Law", sType: "settlement"}, 
    "Khas-tep": {iPopulation: 20000, sSource: "Planes of Law", sType: "settlement"}, 
    "Nibellin": {iPopulation: 40000, sSource: "Planes of Law", sType: "settlement"}, 
    "Snjarll": {iPopulation: 5000, sSource: "Planes of Law", sType: "settlement"}, 
    "Tukhamen": {iPopulation: 20000, sSource: "Planes of Law", sType: "settlement"}, 
    "aEtherealPlane": ["Freehold City"], 
    "Ethereal Plane": {iPopulation: 500, sType: "region"}, 
    "Freehold City": {iPopulation: 500, sSource: "A Guide to the Ethereal Plane", sType: "settlement"}, 
    "aGehenna": ["Cold Fever", "Smertzen"], 
    "Gehenna": {iPopulation: 13000, sType: "region"}, 
    "Cold Fever": {iPopulation: 3000, sSource: "Planes of Conflict", sType: "settlement"}, 
    "Smertzen": {iPopulation: 10000, sSource: "Planes of Conflict", sType: "settlement"}, 
    "aGreyWaste": ["Branwallis", "Death of Innocence"], 
    "Grey Waste": {iPopulation: 12000, sType: "region"}, 
    "Branwallis": {iPopulation: 7000, sSource: "Planes of Conflict", sType: "settlement"}, 
    "Death of Innocence": {iPopulation: 5000, sSource: "Planes of Conflict", sType: "settlement"}, 
    "aLimbo": ["Shra'kt'lor"], 
    "Limbo": {iPopulation: 2000000, Githzerai: 65, other: 35, sType: "region"}, 
    "Shra'kt'lor": {iPopulation: 2000000, Githzerai: 65, other: 35, sSource: "Planes of Chaos", sType: "settlement"}, 
    "aOutlands": ["Automata", "Bedlam", "Curst", "Ecstasy", "Excelsior", "Faunel", "Fortitude", "Dwarven Mountain", "Glorium", "Hopeless", 
        "Palace of Judgment", "Plague-Mort", "Ribcage", "Rigus", "Sylvania", "Torch", "Tradegate", "Xaos"], 
    "Outlands": {iPopulation: 293701, sType: "region"}, 
    "Automata": {iPopulation: 10000, Human: 25, Elf: 25, Dwarf: 25, Halfling: 4, Gnome: 4, Kender: 4, other: 13, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Bedlam": {iPopulation: 50000, Gnoll: 25, Bugbear: 25, Human: 25, other: 25, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Curst": {iPopulation: 15000, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Ecstasy": {iPopulation: 25000, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Excelsior": {iPopulation: 25000, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Faunel": {iPopulation: 900, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Fortitude": {iPopulation: 5000, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "aDwarvenMountain": ["Ironridge"], 
    "Dwarven Mountain": {iPopulation: 500, sType: "region"}, 
    "Ironridge": {iPopulation: 500, sSource: "Planescape Campaign Setting", sType: "settlement"}, 
    "Glorium": {iPopulation: 300, Human: 65, other: 35, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Hopeless": {iPopulation: 20000, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Palace of Judgment": {iPopulation: 9001, sSource: "Planescape Campaign Setting", sType: "settlement"}, 
    "Plague-Mort": {iPopulation: 20000, Human: 25, Tiefling: 25, Orc: 11, Gnoll: 11, Ogre: 11, other: 17, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Ribcage": {iPopulation: 35000, Tiefling: 65, Human: 4, Orc: 4, Gnoll: 4, Ogre: 4, Bauriar: 4, Githzerai: 4, other: 11, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Rigus": {iPopulation: 20000, Human: 13, Tiefling: 13, Orc: 13, Gnoll: 13, Ogre: 13, other: 35, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Sylvania": {iPopulation: 1000, Human: 33, Elf: 33, Bauriar: 33, other: 1, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Torch": {iPopulation: 17000, Human: 11, Tiefling: 11, Orc: 11, Gnoll: 11, Ogre: 11, Githzerai: 11, other: 34, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Tradegate": {iPopulation: 20000, Human: 33, Gnome: 33, other: 34, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    "Xaos": {iPopulation: 20000, Human: 15, Bauriar: 15, Slaad: 15, Githzerai: 15, other: 40, sSource: "A Player's Primer to the Outlands", sType: "settlement"}, 
    sType: "region"
};

oNIB.oSettings["Ravenloft"] = {
    aRavenloft: ["Amber Wastes", "Core", "Frozen Reaches", "Islands of Terror", "Shadowlands", "Shadow Rift", "Verdurous Lands", "Zherisia"], 
    "aAmberWastes": ["Har'Akir", "Pharazia"], 
    "Amber Wastes": {iPopulation: 10800, Human: 99, other: 1, sType: "region"}, 
    "aHar'Akir": ["Muhar", "Har'Akir (undefined)"], 
    "Har'Akir": {iPopulation: 600, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Muhar": {iPopulation: 300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Har'Akir (undefined)": {iPopulation: 300, Human: 99, other: 1, sType: "undefined"}, 
    "aPharazia": ["Phiraz", "Pharazia (undefined)"], 
    "Pharazia": {iPopulation: 10200, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Phiraz": {iPopulation: 8800, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Pharazia (undefined)": {iPopulation: 1400, Human: 99, other: 1, sType: "undefined"}, 
    "aCore": ["Barovia (region)", "Borca", "Darkon", "Dementlieu", "Falkovnia", "Hazlan", "Invidia", "Kartakass", "Keening", "Lamordia", 
        "Mordent", "Necropolis", "Nocturnal Sea", "Nova Vaasa", "Richemulot", "Sea of Sorrows", "Sithicus", "Tepest", "Valachan", "Vechor", 
        "Verbrek"], 
    "Core": {iPopulation: 515870, Human: 84, Halfling: 5, Undead: 5, Elf: 2, Gnome: 2, "Half-Elf": 1, other: 1, sType: "region"}, 
    "aBarovia (region)": ["Barovia (settlement)", "Immol", "Krezk", "Krofberg", "Teufeldorf", "Vallaki", "Zeidenburg"], 
    "Barovia (region)": {iPopulation: 27700, Human: 98, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Barovia (settlement)": {iPopulation: 500, Human: 98, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Immol": {iPopulation: 1600, Human: 98, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Krezk": {iPopulation: 2000, Human: 98, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Krofberg": {iPopulation: 500, Human: 97, "Half-Vistani": 2, other: 1, sSource: "Ravenloft Dungeon Master's Guide", sType: "settlement"}, 
    "Teufeldorf": {iPopulation: 3500, Human: 98, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Vallaki": {iPopulation: 1500, Human: 98, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Zeidenburg": {iPopulation: 4600, Human: 98, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "aBorca": ["Lechberg", "Levkarest", "Sturben", "Ziyden", "Borca (undefined)"], 
    "Borca": {iPopulation: 34200, Human: 95, Halfling: 4, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Lechberg": {iPopulation: 5500, Human: 95, Halfling: 4, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Levkarest": {iPopulation: 8500, Human: 95, Halfling: 4, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Sturben": {iPopulation: 2000, Human: 95, Halfling: 4, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Ziyden": {iPopulation: 1200, Human: 95, Halfling: 4, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Borca (undefined)": {iPopulation: 17000, Human: 95, Halfling: 4, other: 1, sType: "undefined"}, 
    "aDarkon": ["Corvia", "Delagia", "Karg", "Martira Bay", "Maykle", "Mayvin", "Nartok", "Neblus", "Nevuchar Springs", "Rivalis", "Sidnar", 
        "Tempe Falls", "Viaki", "Darkon (undefined)"], 
    "Darkon": {iPopulation: 117300, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Corvia": {iPopulation: 4400, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Delagia": {iPopulation: 1500, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Karg": {iPopulation: 8500, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Martira Bay": {iPopulation: 10400, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Maykle": {iPopulation: 2600, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Mayvin": {iPopulation: 1500, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Nartok": {iPopulation: 7500, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Neblus": {iPopulation: 2900, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Nevuchar Springs": {iPopulation: 1100, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Rivalis": {iPopulation: 5500, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Sidnar": {iPopulation: 1400, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Tempe Falls": {iPopulation: 2500, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Viaki": {iPopulation: 8900, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Darkon (undefined)": {iPopulation: 58600, Human: 75, Halfling: 14, Gnome: 5, Elf: 3, "Half-Elf": 1, Dwarf: 1, other: 1, sType: "undefined"}, 
    "aDementlieu": ["Chateuafaux", "Port-a-Lucine", "Dementlieu (undefined)"], 
    "Dementlieu": {iPopulation: 13600, Human: 94, Halfling: 3, other: 3, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Chateuafaux": {iPopulation: 1500, Human: 94, Halfling: 3, other: 3, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Port-a-Lucine": {iPopulation: 5400, Human: 94, Halfling: 3, other: 3, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Dementlieu (undefined)": {iPopulation: 6700, Human: 94, Halfling: 3, other: 3, sType: "undefined"}, 
    "aFalkovnia": ["Aerie", "Lekar", "Morfenzi", "Silbervas", "Stangengrad", "Falkovnia (undefined)"], 
    "Falkovnia": {iPopulation: 64300, Human: 93, Halfling: 2, "Half-Elf": 2, Gnome: 1, Elf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Aerie": {iPopulation: 2600, Human: 93, Halfling: 2, "Half-Elf": 2, Gnome: 1, Elf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Lekar": {iPopulation: 15900, Human: 93, Halfling: 2, "Half-Elf": 2, Gnome: 1, Elf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Morfenzi": {iPopulation: 1500, Human: 93, Halfling: 2, "Half-Elf": 2, Gnome: 1, Elf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Silbervas": {iPopulation: 5800, Human: 93, Halfling: 2, "Half-Elf": 2, Gnome: 1, Elf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Stangengrad": {iPopulation: 6500, Human: 93, Halfling: 2, "Half-Elf": 2, Gnome: 1, Elf: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Falkovnia (undefined)": {iPopulation: 32000, Human: 93, Halfling: 2, "Half-Elf": 2, Gnome: 1, Elf: 1, other: 1, sType: "undefined"}, 
    "aForlorn": ["Forfarmax"], 
    "Forlorn": {iPopulation: 1900, Goblin: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Forfarmax": {iPopulation: 344, Human: 98, other: 2, sSource: "Ravenloft Gazetteer I", sType: "settlement"}, 
    "aHazlan": ["Ramulai", "Sly-Var", "Toyalis", "Hazlan (undefined)"], 
    "Hazlan": {iPopulation: 26100, Human: 92, Halfling: 4, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Ramulai": {iPopulation: 300, Human: 92, Halfling: 4, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Sly-Var": {iPopulation: 4500, Human: 92, Halfling: 4, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Toyalis": {iPopulation: 8200, Human: 92, Halfling: 4, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Hazlan (undefined)": {iPopulation: 13100, Human: 92, Halfling: 4, Gnome: 3, other: 1, sType: "undefined"}, 
    "aInvidia": ["Curriculo", "Karina", "Invidia (undefined)"], 
    "Invidia": {iPopulation: 6900, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Curriculo": {iPopulation: 1000, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Karina": {iPopulation: 2300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Invidia (undefined)": {iPopulation: 3600, Human: 99, other: 1, sType: "undefined"}, 
    "aKartakass": ["Harmonia", "Skald", "Kartakass (undefined)"], 
    "Kartakass": {iPopulation: 4500, Human: 98, "Half-Elf": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Harmonia": {iPopulation: 1500, Human: 98, "Half-Elf": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Skald": {iPopulation: 2800, Human: 98, "Half-Elf": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Kartakass (undefined)": {iPopulation: 200, Human: 98, "Half-Elf": 1, other: 1, sType: "undefined"}, 
    "Keening": {iPopulation: 970, Undead: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "aLamordia": ["Ludendorf", "Neufurchtenburg", "Lamordia (undefined)"], 
    "Lamordia": {iPopulation: 3200, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Ludendorf": {iPopulation: 900, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Neufurchtenburg": {iPopulation: 700, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Lamordia (undefined)": {iPopulation: 1600, Human: 99, other: 1, sType: "undefined"}, 
    "aMordent": ["Blackburn's Crossing", "Mordentshire", "Mordent (undefined)"], 
    "Mordent": {iPopulation: 5500, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Blackburn's Crossing": {iPopulation: 472, Human: 90, "Half-Elf": 4, Dwarf: 2, Halfling: 2, Elf: 1, other: 1, sSource: "Ravenloft Gazetteer III", sType: "settlement"}, 
    "Mordentshire": {iPopulation: 2600, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Mordent (undefined)": {iPopulation: 2428, Human: 99, other: 1, sType: "undefined"}, 
    "aNecropolis": ["Aluk Merdian", "Aluk Septentrion", "Decimus", "Degradia", "Desolatus", "Despondia"], 
    "Necropolis": {iPopulation: 26800, Undead: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Aluk Merdian": {iPopulation: 17046, Human: 56, Halfling: 21, Gnome: 14, Dwarf: 4, Elf: 3, Caliban: 1, other: 1, sSource: "Ravenloft Gazetteer II", sType: "settlement"}, 
    "Aluk Septentrion": {iPopulation: 4394, Human: 59, Halfling: 25, Elf: 13, "Half-Elf": 2, other: 1, sSource: "Ravenloft Gazetteer II", sType: "settlement"}, 
    "Decimus": {iPopulation: 1293, Human: 80, Gnome: 12, Halfling: 5, Dwarf: 2, other: 1, sSource: "Ravenloft Gazetteer II", sType: "settlement"}, 
    "Degradia": {iPopulation: 1136, Human: 78, Halfling: 10, Elf: 4, Dwarf: 4, Gnome: 2, other: 2, sSource: "Ravenloft Gazetteer II", sType: "settlement"}, 
    "Desolatus": {iPopulation: 2148, Human: 76, Halfling: 12, Elf: 6, Dwarf: 3, Caliban: 1, "Half-Elf": 1, other: 1, sSource: "Ravenloft Gazetteer II", sType: "settlement"}, 
    "Despondia": {iPopulation: 783, Human: 79, Halfling: 9, Elf: 5, Dwarf: 3, "Half-Elf": 2, other: 2, sSource: "Ravenloft Gazetteer II", sType: "settlement"}, 
    "aNocturnalSea": ["Armeikos", "Claveria", "Graben", "Kirchenheim", "Knammen", "Moondale", "Seeheim", "Nocturnal Sea (undefined)"], 
    "Nocturnal Sea": {iPopulation: 14900, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Armeikos": {iPopulation: 3000, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Claveria": {iPopulation: 400, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Graben": {iPopulation: 1900, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Kirchenheim": {iPopulation: 300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Knammen": {iPopulation: 300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Moondale": {iPopulation: 1600, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Seeheim": {iPopulation: 300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Nocturnal Sea (undefined)": {iPopulation: 7100, Human: 99, other: 1, sType: "undefined"}, 
    "aNovaVaasa": ["Arbora", "Bergovitsa", "Egertus", "Kantora", "Liara", "Nova Vaasa (undefined)"], 
    "Nova Vaasa": {iPopulation: 67700, Human: 91, Halfling: 5, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Arbora": {iPopulation: 4500, Human: 91, Halfling: 5, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Bergovitsa": {iPopulation: 6600, Human: 91, Halfling: 5, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Egertus": {iPopulation: 3800, Human: 91, Halfling: 5, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Kantora": {iPopulation: 16500, Human: 91, Halfling: 5, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Liara": {iPopulation: 2600, Human: 91, Halfling: 5, Gnome: 3, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Nova Vaasa (undefined)": {iPopulation: 33700, Human: 91, Halfling: 5, Gnome: 3, other: 1, sType: "undefined"}, 
    "aRichemulot": ["Mortigny", "Pont-a-Museau", "Ste. Ronges", "Richemulot (undefined)"], 
    "Richemulot": {iPopulation: 45300, Human: 93, Halfling: 5, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Mortigny": {iPopulation: 8200, Human: 93, Halfling: 5, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Pont-a-Museau": {iPopulation: 16500, Human: 93, Halfling: 5, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Ste. Ronges": {iPopulation: 6500, Human: 93, Halfling: 5, "Half-Vistani": 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Richemulot (undefined)": {iPopulation: 14100, Human: 93, Halfling: 5, "Half-Vistani": 1, other: 1, sType: "undefined"}, 
    "aSeaofSorrows": ["East Riding", "Sea of Sorrows (undefined)"], 
    "Sea of Sorrows": {iPopulation: 1300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "East Riding": {iPopulation: 600, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Sea of Sorrows (undefined)": {iPopulation: 700, Human: 99, other: 1, sType: "undefined"}, 
    "aSithicus": ["Har-Thelen", "Hroth", "Mal-Erek", "Sithicus (undefined)"], 
    "Sithicus": {iPopulation: 4300, Elf: 96, "Half-Elf": 2, Human: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Har-Thelen": {iPopulation: 500, Elf: 96, "Half-Elf": 2, Human: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Hroth": {iPopulation: 900, Elf: 96, "Half-Elf": 2, Human: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Mal-Erek": {iPopulation: 500, Elf: 96, "Half-Elf": 2, Human: 1, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Sithicus (undefined)": {iPopulation: 2400, Elf: 96, "Half-Elf": 2, Human: 1, other: 1, sType: "undefined"}, 
    "aTepest": ["Briggdarrow", "Kellee", "Linde", "Viktal", "Tepest (undefined)"], 
    "Tepest": {iPopulation: 15500, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Briggdarrow": {iPopulation: 300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Kellee": {iPopulation: 3700, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Linde": {iPopulation: 300, Human: 99, other: 1, sSource: "Ravenloft Gazetteer V", sType: "settlement"}, 
    "Viktal": {iPopulation: 3600, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Tepest (undefined)": {iPopulation: 7600, Human: 99, other: 1, sType: "undefined"}, 
    "aValachan": ["Helbenik", "Rotwald", "Ungrad", "Valachan (undefined)"], 
    "Valachan": {iPopulation: 19100, Human: 97, Gnome: 2, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Helbenik": {iPopulation: 3500, Human: 97, Gnome: 2, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Rotwald": {iPopulation: 4400, Human: 97, Gnome: 2, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Ungrad": {iPopulation: 1500, Human: 97, Gnome: 2, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Valachan (undefined)": {iPopulation: 9700, Human: 97, Gnome: 2, other: 1, sType: "undefined"}, 
    "aVechor": ["Abdok", "Vechor (undefined)"], 
    "Vechor": {iPopulation: 15900, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Abdok": {iPopulation: 8000, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Vechor (undefined)": {iPopulation: 7900, Human: 99, other: 1, sType: "undefined"}, 
    "aVerbrek": ["Alyssum", "Fylfot", "Verbrek (undefined)"], 
    "Verbrek": {iPopulation: 800, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Alyssum": {iPopulation: 62, Werewolf: 99, other: 1, sSource: "Ravenloft Gazetteer IV", sType: "settlement"}, 
    "Fylfot": {iPopulation: 67, Human: 99, other: 1, sSource: "Ravenloft Gazetteer IV", sType: "settlement"}, 
    "Verbrek (undefined)": {iPopulation: 671, Human: 99, other: 1, sType: "undefined"}, 
    "aFrozenReaches": ["Sanguinia", "Vorostokov (region)", "Sebua"], 
    "Frozen Reaches": {iPopulation: 8118, Human: 99, other: 1, sType: "region"}, 
    "aSanguinia": ["Fagaras", "Kosova", "Tirgo", "Sanguinia (undefined)"], 
    "Sanguinia": {iPopulation: 6300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Fagaras": {iPopulation: 800, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Kosova": {iPopulation: 1000, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Tirgo": {iPopulation: 1300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Sanguinia (undefined)": {iPopulation: 3200, Human: 99, other: 1, sType: "undefined"}, 
    "aVorostokov(region)": ["Kargo", "Kirinova", "Nodvik", "Novayalenk", "Oneka", "Torgov", "Voronina", "Vorostokov (settlement)", "Vorostokov (region) (undefined)"], 
    "Vorostokov (region)": {iPopulation: 1100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Kargo": {iPopulation: 100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Kirinova": {iPopulation: 100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Nodvik": {iPopulation: 100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Novayalenk": {iPopulation: 100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Oneka": {iPopulation: 100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Torgov": {iPopulation: 100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Voronina": {iPopulation: 100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Vorostokov (settlement)": {iPopulation: 200, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Vorostokov (region) (undefined)": {iPopulation: 200, Human: 99, other: 1, sType: "undefined"}, 
    "aSebua": ["Shadowed Eye Oasis", "Sebua (undefined)"], 
    "Sebua": {iPopulation: 718, Human: 98, other: 2, sType: "region"}, 
    "Shadowed Eye Oasis": {iPopulation: 350, Human: 98, other: 2, sSource: "Ravenloft Dungeon Master's Guide", sType: "settlement"}, 
    "Sebua (undefined)": {iPopulation: 368, Human: 98, other: 2, sType: "undefined"}, 
    "aIslandsofTerror": ["G'Henna", "Odiare", "Rokushima Taiyoo", "Souragne"], 
    "Islands of Terror": {iPopulation: 41999, Human: 99, other: 1, sType: "region"}, 
    "aG'Henna": ["Zhukar", "G'Henna (undefined)"], 
    "G'Henna": {iPopulation: 19500, Human: 98, other: 2, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Zhukar": {iPopulation: 10100, Human: 98, other: 2, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "G'Henna (undefined)": {iPopulation: 9400, Human: 98, other: 2, sType: "undefined"}, 
    "Odiare": {iPopulation: 99, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "aRokushimaTaiyoo": ["Beikoku", "Chuugoka", "Eikoku", "Roshiya", "Rokushima Taiyoo (undefined)"], 
    "Rokushima Taiyoo": {iPopulation: 19300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Beikoku": {iPopulation: 1800, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Chuugoka": {iPopulation: 3100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Eikoku": {iPopulation: 2300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Roshiya": {iPopulation: 2500, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Rokushima Taiyoo (undefined)": {iPopulation: 9600, Human: 99, other: 1, sType: "undefined"}, 
    "aSouragne": ["Marais d'Tarascon", "Port d'Elhour", "Souragne (undefined)"], 
    "Souragne": {iPopulation: 3100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Marais d'Tarascon": {iPopulation: 300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Port d'Elhour": {iPopulation: 1200, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Souragne (undefined)": {iPopulation: 1600, Human: 99, other: 1, sType: "undefined"}, 
    "aShadowlands": ["Nidala"], 
    "Shadowlands": {iPopulation: 30500, Human: 99, other: 1, sType: "region"}, 
    "aNidala": ["Touraine", "Nidala (undefined)"], 
    "Nidala": {iPopulation: 30500, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Touraine": {iPopulation: 20200, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Nidala (undefined)": {iPopulation: 10300, Human: 99, other: 1, sType: "undefined"}, 
    "aShadowRift": ["Anvolee", "Beliviue", "Esmerth", "Shadow Rift (undefined)"], 
    "Shadow Rift": {iPopulation: 24000, Arak: 40, Changeling: 25, other: 35, sType: "region"}, 
    "Anvolee": {iPopulation: 5000, Changeling: 89, Brag: 4, Alven: 3, other: 4, sSource: "Ravenloft Gazetteer V", sType: "settlement"}, 
    "Beliviue": {iPopulation: 1000, Sith: 91, Muryan: 3, Brag: 2, Powrie: 2, other: 2, sSource: "Ravenloft Gazetteer V", sType: "settlement"}, 
    "Esmerth": {iPopulation: 1500, Shee: 58, Human: 20, Elf: 6, "Half-Elf": 4, Portune: 2, Brag: 2, Alven: 1, other: 7, sSource: "Ravenloft Gazetteer V", sType: "settlement"}, 
    "Shadow Rift (undefined)": {iPopulation: 16500, Arak: 40, Changeling: 25, other: 35, sType: "undefined"}, 
    "aVerdurousLands": ["Saragoss", "Sri Raji"], 
    "Verdurous Lands": {iPopulation: 28300, Human: 99, other: 1, sType: "region"}, 
    "Saragoss": {iPopulation: 1000, Human: 98, other: 2, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "aSriRaji": ["Muladi", "Pakat", "Tvashti", "Sri Raji (undefined)"], 
    "Sri Raji": {iPopulation: 27300, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "region"}, 
    "Muladi": {iPopulation: 8200, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Pakat": {iPopulation: 3500, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Tvashti": {iPopulation: 2100, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Sri Raji (undefined)": {iPopulation: 13500, Human: 99, other: 1, sType: "undefined"}, 
    "aZherisia": ["Paridon", "Zherisia (undefined)"], 
    "Zherisia": {iPopulation: 24504, Human: 99, other: 1, sType: "region"}, 
    "Paridon": {iPopulation: 11600, Human: 99, other: 1, sSource: "Ravenloft Campaign Setting", sType: "settlement"}, 
    "Zherisia (undefined)": {iPopulation: 12904, Human: 99, other: 1, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Rokugan"] = {
    "aRokugan": ["Rokugan (region)"], 
    "aRokugan(region)": ["Crab Clan", "Dragon Clan", "Lion Clan", "Minor Clans", "Phoenix Clan", "Scorpion Clan", "Unicorn Clan"], 
    "Rokugan (region)": {iPopulation: 30000000, Human: 99, other: 1, sSource: "Oriental Adventures", sType: "region"}, 
    "Crab Clan": {iPopulation: 4590000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "Crane Clan": {iPopulation: 3780000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "Dragon Clan": {iPopulation: 1890000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "Lion Clan": {iPopulation: 4540000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "aMinorClans": ["Centipede", "Fox", "Hare", "Mantis", "Monkey", "Naga", "Sparrow", "Tortoise", "Wasp"], 
    "Minor Clans": {iPopulation: 11690000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "Centipede": {iPopulation: 1230000, Human: 99, other: 1, sType: "region"}, 
    "Fox": {iPopulation: 1230000, Human: 99, other: 1, sType: "region"}, 
    "Hare": {iPopulation: 1230000, Human: 99, other: 1, sType: "region"}, 
    "Mantis": {iPopulation: 1080000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "Monkey": {iPopulation: 1230000, Human: 99, other: 1, sType: "region"}, 
    "Naga": {iPopulation: 2000000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "Sparrow": {iPopulation: 1230000, Human: 99, other: 1, sType: "region"}, 
    "Tortoise": {iPopulation: 1230000, Human: 99, other: 1, sType: "region"}, 
    "Wasp": {iPopulation: 1230000, Human: 99, other: 1, sType: "region"}, 
    "Phoenix Clan": {iPopulation: 1620000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "Scorpion Clan": {iPopulation: 1890000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    "Unicorn Clan": {iPopulation: 3780000, Human: 99, other: 1, sSource: "Rokugan Campaign Setting", sType: "region"}, 
    sType: "region"
};

oNIB.oSettings["Spelljammer"] = {
    "aSpelljammer": ["Astromundi Cluster", "Clusterspace", "Heartspace", "Ragespace", "Seldarspace"], 
    "aAstromundiCluster": ["Avarien", "Barukhaza", "Boyarny", "Calimar", "Cerekazadh", "Dalmania", "Drachengard", "Golden Circle", "Hatha", 
        "Highport", "Illiman", "Inner Ring", "Ironport", "Khalzan", "Phalangilon", "Shakalman", "Shaseogan", "Ushathrandra", 
        "Astromundi Cluster (undefined)"], 
    "Astromundi Cluster": {iPopulation: 31932545, sType: "region"}, 
    "Avarien": {iPopulation: 36000, Elf: 99, other: 1, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Barukhaza": {iPopulation: 22000, Dwarf: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Boyarny": {iPopulation: 380000, Varan: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Calimar": {iPopulation: 2400000, Calidian: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Cerekazadh": {iPopulation: 46000, Dwarf: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Chakarak": {iPopulation: 8000, Dwarf: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Dalmania": {iPopulation: 33000, Calidian: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Drachengard": {iPopulation: 18000, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Golden Circle": {iPopulation: 12000000, Antilan: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Hatha": {iPopulation: 25000, Thoric: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Highport": {iPopulation: 25000, sSource: "The Astromundi Cluster", sType: "settlement"}, 
    "Illiman": {iPopulation: 33000, sSource: "The Astromundi Cluster", sType: "region"}, 
    "aInnerRing": ["Atalan", "Sharona", "Thundazar", "Inner Ring (undefined)"], 
    "Inner Ring": {iPopulation: 10000000, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Atalan": {iPopulation: 100000, Antilan: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Sharona": {iPopulation: 1000000, Calidian: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Thundazar": {iPopulation: 20000, Antilan: 33, Calidian: 33, other: 34, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Inner Ring (undefined)": {iPopulation: 8880000, sType: "undefined"}, 
    "Ironport": {iPopulation: 21000, Neogi: 65, other: 35, sSource: "The Astromundi Cluster", sType: "settlement"}, 
    "Khalzan": {iPopulation: 49000, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Phalangilon": {iPopulation: 100, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Shakalman": {iPopulation: 260000, Antilan: 65, other: 35, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Shaseogan": {iPopulation: 8000, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Ushathrandra": {iPopulation: 3000000, Illithid: 33, Varan: 33, other: 34, sSource: "The Astromundi Cluster", sType: "region"}, 
    "Astromundi Cluster (undefined)": {iPopulation: 3576445, sType: "undefined"}, 
    "aClusterspace": ["Eye-Sore", "Port of Elrannarion", "Uramatsu", "Clusterspace (undefined)"], 
    "Clusterspace": {iPopulation: 81970, sType: "region"}, 
    "Eye-Sore": {iPopulation: 250, sSource: "spelljammer.org", sType: "region"}, 
    "Port of Elrannarion": {iPopulation: 2100, sSource: "spelljammer.org", sType: "settlement"}, 
    "Uramatsu": {iPopulation: 22000, sSource: "spelljammer.org", sType: "region"}, 
    "Clusterspace (undefined)": {iPopulation: 57620, sType: "undefined"}, 
    "aHeartspace": ["Crescent", "Desolate", "Lirak's Cube", "Loom", "Starfall", "Vein", "Heartspace (undefined)"], 
    "Heartspace": {iPopulation: 8040933, sType: "region"}, 
    "Crescent": {iPopulation: 500000, sSource: "spelljammer.org", sType: "region"}, 
    "Desolate": {iPopulation: 15000, sSource: "spelljammer.org", sType: "region"}, 
    "Lirak's Cube": {iPopulation: 20000, sSource: "spelljammer.org", sType: "settlement"}, 
    "Loom": {iPopulation: 850000, sSource: "spelljammer.org", sType: "region"}, 
    "Starfall": {iPopulation: 1000000, sSource: "spelljammer.org", sType: "region"}, 
    "Vein": {iPopulation: 10000, sSource: "spelljammer.org", sType: "region"}, 
    "Heartspace (undefined)": {iPopulation: 5645933, sType: "undefined"}, 
    "aRagespace": ["Aius", "Arbani Citadel", "Bitch's Threesome", "BlackSea", "Blackwood", "Crimson Forge", "Dark Crucifix", "Dust Clouds", 
        "Elamshin D'lil Yorn", "Executioner", "Hoodsman's Guard", "Kanoxx", "Kanoxx'Blaze", "Kanoxx'Feha", "Kanoxx'Nabuo", "Kanoxx'Ulga", 
        "Kiiranslee Royal Observatory", "Krayus", "LordMasterBase", "Misplaced", "New Bral", "New Haven", "Order's Island", "Ore", 
        "Selvetarm Royal Station", "Slutmoor", "Void", "Ragespace (undefined)"], 
    "Ragespace": {iPopulation: 2809760622, sType: "region"}, 
    "Aius": {iPopulation: 5000000, sSource: "spelljammer.org", sType: "region"}, 
    "Arbani Citadel": {iPopulation: 150000, sSource: "spelljammer.org", sType: "settlement"}, 
    "Bitch's Threesome": {iPopulation: 250000, sSource: "spelljammer.org", sType: "region"}, 
    "BlackSea": {iPopulation: 2000000, sSource: "spelljammer.org", sType: "region"}, 
    "Blackwood": {iPopulation: 500000, sSource: "spelljammer.org", sType: "region"}, 
    "Crimson Forge": {iPopulation: 500000, sSource: "spelljammer.org", sType: "region"}, 
    "Dark Crucifix": {iPopulation: 3000000, sSource: "spelljammer.org", sType: "region"}, 
    "Dust Clouds": {iPopulation: 10000, sSource: "spelljammer.org", sType: "region"}, 
    "Elamshin D'lil Yorn": {iPopulation: 2500, sSource: "spelljammer.org", sType: "settlement"}, 
    "Executioner": {iPopulation: 5000, sSource: "spelljammer.org", sType: "region"}, 
    "Hoodsman's Guard": {iPopulation: 10000, sSource: "spelljammer.org", sType: "settlement"}, 
    "Kanoxx": {iPopulation: 500000, sSource: "spelljammer.org", sType: "region"}, 
    "Kanoxx'Blaze": {iPopulation: 10000, sSource: "spelljammer.org", sType: "region"}, 
    "Kanoxx'Feha": {iPopulation: 10000, sSource: "spelljammer.org", sType: "region"}, 
    "Kanoxx'Nabuo": {iPopulation: 5000, sSource: "spelljammer.org", sType: "region"}, 
    "Kanoxx'Ulga": {iPopulation: 50000, sSource: "spelljammer.org", sType: "region"}, 
    "Kiiranslee Royal Observatory": {iPopulation: 2000, sSource: "spelljammer.org", sType: "settlement"}, 
    "Krayus": {iPopulation: 1000000, sSource: "spelljammer.org", sType: "region"}, 
    "LordMasterBase": {iPopulation: 75000, sSource: "spelljammer.org", sType: "region"}, 
    "Misplaced": {iPopulation: 1000000000, sSource: "spelljammer.org", sType: "region"}, 
    "New Bral": {iPopulation: 20000, sSource: "spelljammer.org", sType: "settlement"}, 
    "New Haven": {iPopulation: 10000, sSource: "spelljammer.org", sType: "settlement"}, 
    "Order's Island": {iPopulation: 1000000, sSource: "spelljammer.org", sType: "region"}, 
    "Ore": {iPopulation: 50000, sSource: "spelljammer.org", sType: "region"}, 
    "Selvetarm Royal Station": {iPopulation: 15000, sSource: "spelljammer.org", sType: "settlement"}, 
    "Slutmoor": {iPopulation: 200000, sSource: "spelljammer.org", sType: "region"}, 
    "Void": {iPopulation: 5000000, sSource: "spelljammer.org", sType: "region"}, 
    "Ragespace (undefined)": {iPopulation: 1790386122, sType: "undefined"}, 
    "aSeldarspace": ["Angharradh", "Felarthael", "Lareth", "Leafhome", "Mestarine", "Twisted", "Seldarspace (undefined)"], 
    "Seldarspace": {iPopulation: 41115668827, sType: "region"}, 
    "Angharradh": {iPopulation: 15000, sSource: "spelljammer.org", sType: "region"}, 
    "Felarthael": {iPopulation: 1500, sSource: "spelljammer.org", sType: "region"}, 
    "Lareth": {iPopulation: 6000000000, sSource: "spelljammer.org", sType: "region"}, 
    "Leafhome": {iPopulation: 20000000000, sSource: "spelljammer.org", sType: "region"}, 
    "Mestarine": {iPopulation: 1500000, sSource: "spelljammer.org", sType: "region"}, 
    "Twisted": {iPopulation: 10000, sSource: "spelljammer.org", sType: "region"}, 
    "Seldarspace (undefined)": {iPopulation: 15114142327, sType: "undefined"}, 
    sType: "region"
};

oNIB.oSettings["Warcraft"] = {
    "aWarcraft": ["Azeroth", "Kalimdor", "Khaz Modan", "Lordaeron", "Northrend", "South Seas"], 
    "aAzeroth": ["Blasted Lands", "Burning Steppes", "Deadwind Pass", "Duskwood", "Elwynn Forest", "Redridge Mountains", "Stormwind", 
        "Stranglethorn Vale", "Swamp of Sorrows", "Westfall"], 
    "Azeroth": {iPopulation: 244150, Human: 63, Dwarf: 12, Elf: 11, "Half-Elf": 4, "Blackrock Orc": 1, "Bloodscalp Troll": 1, "Dreadmaul Ogre": 1, Goblin: 1, "Green Dragonflight": 1, "Gurubashi Troll": 1, Orc: 1, "Skullsplitter Troll": 1, other: 2, sType: "region"}, 
    "aBlastedLands": ["Nethergarde Keep", "Tainted Scar", "Blasted Lands (undefined)"], 
    "Blasted Lands": {iPopulation: 2000, "Dreadmaul Ogre": 54, Demon: 15, Dranei: 15, Human: 10, Elf: 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Nethergarde Keep": {iPopulation: 300, "Dreadmaul Ogre": 54, Demon: 15, Dranei: 15, Human: 10, Elf: 5, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Tainted Scar": {iPopulation: 300, "Dreadmaul Ogre": 54, Demon: 15, Dranei: 15, Human: 10, Elf: 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Blasted Lands (undefined)": {iPopulation: 1400, "Dreadmaul Ogre": 54, Demon: 15, Dranei: 15, Human: 10, Elf: 5, other: 1, sType: "undefined"}, 
    "aBurningSteppes": ["Blackrock Deeps", "Blackrock Spire", "Blackrock Spire Foothills", "Fire-Gut Rock"], 
    "Burning Steppes": {iPopulation: 3150, "Blackrock Orc": 49, "Fire-Gut Ogre": 30, "Black Dragon": 15, Dwarf: 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Blackrock Deeps": {iPopulation: 300, "Blackrock Orc": 49, "Fire-Gut Ogre": 30, "Black Dragon": 15, Dwarf: 5, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Blackrock Spire": {iPopulation: 450, "Blackrock Orc": 49, "Fire-Gut Ogre": 30, "Black Dragon": 15, Dwarf: 5, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Blackrock Spire Foothills": {iPopulation: 1500, "Blackrock Orc": 49, "Fire-Gut Ogre": 30, "Black Dragon": 15, Dwarf: 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Fire-Gut Rock": {iPopulation: 900, "Blackrock Orc": 49, "Fire-Gut Ogre": 30, "Black Dragon": 15, Dwarf: 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "aDeadwindPass": ["Deadwind Ogre Mounds", "Deadwind Pass (undefined)"], 
    "Deadwind Pass": {iPopulation: 1000, "Dreadmaul Ogre": 74, Human: 15, Undead: 5, Demon: 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Deadwind Ogre Mounds": {iPopulation: 700, "Dreadmaul Ogre": 74, Human: 15, Undead: 5, Demon: 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Deadwind Pass (undefined)": {iPopulation: 300, "Dreadmaul Ogre": 74, Human: 15, Undead: 5, Demon: 5, other: 1, sType: "undefined"}, 
    "aDuskwood": ["Darkshire", "Vol'Gol Ogre Mound", "Duskwood (undefined)"], 
    "Duskwood": {iPopulation: 5000, Human: 59, "Vul'Gol Ogre": 20, Dwarf: 5, "Half-Elf": 5, Elf: 5, Undead: 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Darkshire": {iPopulation: 3500, Human: 59, "Vul'Gol Ogre": 20, Dwarf: 5, "Half-Elf": 5, Elf: 5, Undead: 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Vol'Gol Ogre Mound": {iPopulation: 1000, Human: 59, "Vul'Gol Ogre": 20, Dwarf: 5, "Half-Elf": 5, Elf: 5, Undead: 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Duskwood (undefined)": {iPopulation: 500, Human: 59, "Vul'Gol Ogre": 20, Dwarf: 5, "Half-Elf": 5, Elf: 5, Undead: 5, other: 1, sType: "undefined"}, 
    "aElwynnForest": ["Eastvale", "Goldshire", "Northshire Abbey", "Tower of Azora", "Westbrook Garrison", "Elwynn Forest (undefined)"], 
    "Elwynn Forest": {iPopulation: 10000, Human: 69, Elf: 15, Dwarf: 10, "Half-Elf": 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Eastvale": {iPopulation: 1000, Human: 69, Elf: 15, Dwarf: 10, "Half-Elf": 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Goldshire": {iPopulation: 7000, Human: 69, Elf: 15, Dwarf: 10, "Half-Elf": 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Northshire Abbey": {iPopulation: 500, Human: 69, Elf: 15, Dwarf: 10, "Half-Elf": 5, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Tower of Azora": {iPopulation: 100, Human: 69, Elf: 15, Dwarf: 10, "Half-Elf": 5, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Westbrook Garrison": {iPopulation: 750, Human: 69, Elf: 15, Dwarf: 10, "Half-Elf": 5, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Elwynn Forest (undefined)": {iPopulation: 650, Human: 69, Elf: 15, Dwarf: 10, "Half-Elf": 5, other: 1, sType: "undefined"}, 
    "aRedridgeMountains": ["Lakeshire", "Stonewatch Keep", "Tower of Ilgalar", "Redridge Mountains (undefined)"], 
    "Redridge Mountains": {iPopulation: 2000, Human: 64, Dwarf: 18, "Blackrock Orc": 10, "Half-Elf": 4, Elf: 3, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Lakeshire": {iPopulation: 1500, Human: 64, Dwarf: 18, "Blackrock Orc": 10, "Half-Elf": 4, Elf: 3, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Stonewatch Keep": {iPopulation: 200, Human: 64, Dwarf: 18, "Blackrock Orc": 10, "Half-Elf": 4, Elf: 3, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Tower of Ilgalar": {iPopulation: 100, Human: 64, Dwarf: 18, "Blackrock Orc": 10, "Half-Elf": 4, Elf: 3, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Redridge Mountains (undefined)": {iPopulation: 200, Human: 64, Dwarf: 18, "Blackrock Orc": 10, "Half-Elf": 4, Elf: 3, other: 1, sType: "undefined"}, 
    "aStormwind": ["Stormwind City"], 
    "Stormwind": {iPopulation: 200000, Human: 69, Dwarf: 14, Elf: 12, "Half-Elf": 4, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Stormwind City": {iPopulation: 200000, Human: 69, Dwarf: 14, Elf: 12, "Half-Elf": 4, other: 1, sSource: "Warcraft Campaign Setting 3.5", sType: "settlement"}, 
    "aStranglethornVale": ["Arena", "Booty Bay", "Vile Reef", "Zul'Kunda", "Zul'Mamwe"], 
    "Stranglethorn Vale": {iPopulation: 10000, "Bloodscalp Troll": 25, Goblin: 20, "Skullsplitter Troll": 15, "Gurubashi Troll": 15, "Darkspear Troll": 10, Orc: 6, Naga: 4, other: 5, sSource: "Lands of Conflict", sType: "region"}, 
    "Arena": {iPopulation: 1500, "Bloodscalp Troll": 25, Goblin: 20, "Skullsplitter Troll": 15, "Gurubashi Troll": 15, "Darkspear Troll": 10, Orc: 6, Naga: 4, other: 5, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Booty Bay": {iPopulation: 1000, "Bloodscalp Troll": 25, Goblin: 20, "Skullsplitter Troll": 15, "Gurubashi Troll": 15, "Darkspear Troll": 10, Orc: 6, Naga: 4, other: 5, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Vile Reef": {iPopulation: 1000, "Bloodscalp Troll": 25, Goblin: 20, "Skullsplitter Troll": 15, "Gurubashi Troll": 15, "Darkspear Troll": 10, Orc: 6, Naga: 4, other: 5, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Zul'Kunda": {iPopulation: 4000, "Bloodscalp Troll": 25, Goblin: 20, "Skullsplitter Troll": 15, "Gurubashi Troll": 15, "Darkspear Troll": 10, Orc: 6, Naga: 4, other: 5, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Zul'Mamwe": {iPopulation: 2500, "Bloodscalp Troll": 25, Goblin: 20, "Skullsplitter Troll": 15, "Gurubashi Troll": 15, "Darkspear Troll": 10, Orc: 6, Naga: 4, other: 5, sSource: "Lands of Conflict", sType: "settlement"}, 
    "aSwampofSorrows": ["Fallow Sanctuary", "Lost Temple", "Stonard", "Swamp of Sorrows (undefined)"], 
    "Swamp of Sorrows": {iPopulation: 5000, Orc: 54, "Green Dragonflight": 30, Draenei: 15, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Fallow Sanctuary": {iPopulation: 750, Orc: 54, "Green Dragonflight": 30, Draenei: 15, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Lost Temple": {iPopulation: 1500, Orc: 54, "Green Dragonflight": 30, Draenei: 15, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Stonard": {iPopulation: 2500, Orc: 54, "Green Dragonflight": 30, Draenei: 15, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Swamp of Sorrows (undefined)": {iPopulation: 250, Orc: 54, "Green Dragonflight": 30, Draenei: 15, other: 1, sType: "undefined"}, 
    "aWestfall": ["Moonbrook", "Sentinel Hill", "Westfall (undefined)"], 
    "Westfall": {iPopulation: 6000, Human: 84, Goblin: 8, Elf: 5, "Half-Elf": 2, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Moonbrook": {iPopulation: 4000, Human: 84, Goblin: 8, Elf: 5, "Half-Elf": 2, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Sentinel Hill": {iPopulation: 300, Human: 84, Goblin: 8, Elf: 5, "Half-Elf": 2, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Westfall (undefined)": {iPopulation: 1700, Human: 84, Goblin: 8, Elf: 5, "Half-Elf": 2, other: 1, sType: "undefined"}, 
    "aKalimdor": ["Central Kalimdor", "North Kalimdor", "South Kalimdor"], 
    "Kalimdor": {iPopulation: 168450, Elf: 30, Tauren: 16, Orc: 11, Goblin: 5, Troll: 5, Centaur: 4, Human: 4, Satyr: 4, Demon: 3, Dwarf: 2, Furbolg: 2, Naga: 2, "Blue Dragonflight": 1, Dryad: 1, Forsaken: 1, "Galak Centaur": 1, Gnome: 1, Ogre: 1, "Sea Giant": 1, other: 5, sType: "region"}, 
    "aCentralKalimdor": ["Barrens", "Desolace", "Durotar", "Dustwallow Marsh", "Mulgore", "Stonetalon Mountains", "Thunder Bluff"], 
    "Central Kalimdor": {iPopulation: 82000, Tauren: 28, Orc: 21, Troll: 10, Centaur: 8, Elf: 7, Goblin: 7, Human: 7, Dwarf: 3, Forsaken: 3, Demon: 1, Gnome: 1, "Jungle Troll": 1, Ogre: 1, Satyr: 1, other: 1, sType: "region"}, 
    "aBarrens": ["Bael Modan", "Camp Taurajo", "Crossroads", "Northwatch Hold", "Ratchet", "Barrens (undefined)"], 
    "Barrens": {iPopulation: 17000, Orc: 29, Tauren: 25, Goblin: 20, Troll: 15, Dwarf: 5, Gnome: 3, Elf: 1, Human: 1, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Bael Modan": {iPopulation: 800, Orc: 29, Tauren: 25, Goblin: 20, Troll: 15, Dwarf: 5, Gnome: 3, Elf: 1, Human: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Camp Taurajo": {iPopulation: 500, Orc: 29, Tauren: 25, Goblin: 20, Troll: 15, Dwarf: 5, Gnome: 3, Elf: 1, Human: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Crossroads": {iPopulation: 6000, Orc: 29, Tauren: 25, Goblin: 20, Troll: 15, Dwarf: 5, Gnome: 3, Elf: 1, Human: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Northwatch Hold": {iPopulation: 150, Orc: 29, Tauren: 25, Goblin: 20, Troll: 15, Dwarf: 5, Gnome: 3, Elf: 1, Human: 1, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Ratchet": {iPopulation: 9000, Goblin: 80, other: 20, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Barrens (undefined)": {iPopulation: 550, Orc: 29, Tauren: 25, Goblin: 20, Troll: 15, Dwarf: 5, Gnome: 3, Elf: 1, Human: 1, other: 1, sType: "undefined"}, 
    "aDesolace": ["Ghost Walker Post", "Mannoroc Coven", "Maraudon", "Nijel's Point", "Sargeron", "Shadowbreak Ravine", "Shadowprey", 
        "Thunder Axe Fortress", "Valley of Spears", "Desolace (undefined)"], 
    "Desolace": {iPopulation: 11000, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Ghost Walker Post": {iPopulation: 1250, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Mannoroc Coven": {iPopulation: 500, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Maraudon": {iPopulation: 3500, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Nijel's Point": {iPopulation: 2000, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Sargeron": {iPopulation: 100, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Shadowbreak Ravine": {iPopulation: 200, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Shadowprey": {iPopulation: 900, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Thunder Axe Fortress": {iPopulation: 1000, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Valley of Spears": {iPopulation: 1500, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Desolace (undefined)": {iPopulation: 50, Centaur: 59, Tauren: 10, Troll: 8, Elf: 7, Satyr: 5, Demon: 4, Orc: 4, Human: 1, Naga: 1, other: 1, sType: "undefined"}, 
    "aDurotar": ["Orgrimmar", "Razor Hill", "Sen'jin", "Tiragarde Keep", "Durotar (undefined)"], 
    "Durotar": {iPopulation: 21000, Orc: 54, Troll: 20, Tauren: 15, Forsaken: 8, Human: 2, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Orgrimmar": {iPopulation: 14000, Orc: 69, "Jungle Troll": 13, Tauren: 12, Forsaken: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Razor Hill": {iPopulation: 3000, Orc: 54, Troll: 20, Tauren: 15, Forsaken: 8, Human: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Sen'jin": {iPopulation: 2000, Orc: 54, Troll: 20, Tauren: 15, Forsaken: 8, Human: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Tiragarde Keep": {iPopulation: 200, Orc: 54, Troll: 20, Tauren: 15, Forsaken: 8, Human: 2, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Durotar (undefined)": {iPopulation: 1800, Orc: 54, Troll: 20, Tauren: 15, Forsaken: 8, Human: 2, other: 1, sType: "undefined"}, 
    "aDustwallowMarsh": ["Brackenwall", "Theramore", "Dustwallow Marsh (undefined)"], 
    "Dustwallow Marsh": {iPopulation: 12000, Human: 41, Elf: 23, Dwarf: 12, Gnome: 5, Ogre: 4, Orc: 3, Tauren: 3, "Jungle Troll": 3, "Black Dragonflight": 3, Forsaken: 2, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Brackenwall": {iPopulation: 1000, Human: 41, Elf: 23, Dwarf: 12, Gnome: 5, Ogre: 4, Orc: 3, Tauren: 3, "Jungle Troll": 3, "Black Dragonflight": 3, Forsaken: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Theramore": {iPopulation: 9500, Human: 41, Elf: 23, Dwarf: 12, Gnome: 5, Ogre: 4, Orc: 3, Tauren: 3, "Jungle Troll": 3, "Black Dragonflight": 3, Forsaken: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Dustwallow Marsh (undefined)": {iPopulation: 1500, Human: 41, Elf: 23, Dwarf: 12, Gnome: 5, Ogre: 4, Orc: 3, Tauren: 3, "Jungle Troll": 3, "Black Dragonflight": 3, Forsaken: 2, other: 1, sType: "undefined"}, 
    "aMulgore": ["Bael'Dun", "Bloodhoof", "Camp Narache", "Red Cloud Mesa", "Thunder Bluff", "Venture Company", "Mulgore (undefined)"], 
    "Mulgore": {iPopulation: 9000, Tauren: 84, Goblin: 6, Dwarf: 5, Harpy: 2, Orc: 2, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Bael'Dun": {iPopulation: 200, Tauren: 84, Goblin: 6, Dwarf: 5, Harpy: 2, Orc: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Bloodhoof": {iPopulation: 1000, Tauren: 84, Goblin: 6, Dwarf: 5, Harpy: 2, Orc: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Camp Narache": {iPopulation: 500, Tauren: 84, Goblin: 6, Dwarf: 5, Harpy: 2, Orc: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Red Cloud Mesa": {iPopulation: 650, Tauren: 84, Goblin: 6, Dwarf: 5, Harpy: 2, Orc: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Thunder Bluff": {iPopulation: 6000, Tauren: 87, Orc: 5, Forsaken: 4, Troll: 3, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Venture Company": {iPopulation: 300, Tauren: 84, Goblin: 6, Dwarf: 5, Harpy: 2, Orc: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Mulgore (undefined)": {iPopulation: 350, Tauren: 84, Goblin: 6, Dwarf: 5, Harpy: 2, Orc: 2, other: 1, sType: "undefined"}, 
    "aStonetalonMountains": ["Stonetalon Retreat", "Sun Rock Retreat", "Windshear Crag", "Stonetalon Mountains (undefined)"], 
    "Stonetalon Mountains": {iPopulation: 6000, Goblin: 39, Elf: 30, Tauren: 25, Harpy: 3, "Jungle Troll": 2, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Stonetalon Retreat": {iPopulation: 1750, Goblin: 39, Elf: 30, Tauren: 25, Harpy: 3, "Jungle Troll": 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Sun Rock Retreat": {iPopulation: 1500, Goblin: 39, Elf: 30, Tauren: 25, Harpy: 3, "Jungle Troll": 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Windshear Crag": {iPopulation: 2500, Goblin: 39, Elf: 30, Tauren: 25, Harpy: 3, "Jungle Troll": 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Stonetalon Mountains (undefined)": {iPopulation: 250, Goblin: 39, Elf: 30, Tauren: 25, Harpy: 3, "Jungle Troll": 2, other: 1, sType: "undefined"}, 
    "Thunder Bluff": {iPopulation: 6000, Tauren: 87, Orc: 5, Forsaken: 4, Troll: 3, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "aNorthKalimdor": ["Ashenvale", "Azshara", "Darkshore", "Felwood", "Hyjal Summit", "Moonglade", "Teldrassil", "Winterspring"], 
    "North Kalimdor": {iPopulation: 75000, Elf: 59, Satyr: 7, Demon: 5, Furbolg: 5, Naga: 5, Dryad: 3, "Blue Dragonflight": 2, Goblin: 2, "Sea Giant": 2, Tauren: 2, "Blue Dragonspawn": 1, Dwarf: 1, Human: 1, Orc: 1, "Red Dragonflight": 1, Wildkin: 1, other: 2, sType: "region"}, 
    "aAshenvale": ["Astrannar", "Maestra's Post", "Raynewood Retreat", "Warsong", "Ashenvale (undefined)"], 
    "Ashenvale": {iPopulation: 7000, Elf: 81, Orc: 7, Human: 5, Naga: 4, other: 3, sSource: "Lands of Mystery", sType: "region"}, 
    "Astrannar": {iPopulation: 4000, Elf: 81, Orc: 7, Human: 5, Naga: 4, other: 3, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Maestra's Post": {iPopulation: 500, Elf: 81, Orc: 7, Human: 5, Naga: 4, other: 3, sSource: "Lands of Mystery", sType: "compound"}, 
    "Raynewood Retreat": {iPopulation: 750, Elf: 81, Orc: 7, Human: 5, Naga: 4, other: 3, sSource: "Lands of Mystery", sType: "compound"}, 
    "Warsong": {iPopulation: 450, Elf: 81, Orc: 7, Human: 5, Naga: 4, other: 3, sSource: "Lands of Mystery", sType: "compound"}, 
    "Ashenvale (undefined)": {iPopulation: 1300, Elf: 81, Orc: 7, Human: 5, Naga: 4, other: 3, sType: "undefined"}, 
    "aAzshara": ["Camp Valormok", "Azshara (undefined)"], 
    "Azshara": {iPopulation: 9000, Naga: 39, "Sea Giant": 15, Elf: 15, Satyr: 10, "Blue Dragonspawn": 8, Tauren: 7, Furbolg: 5, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Camp Valormok": {iPopulation: 250, Naga: 39, "Sea Giant": 15, Elf: 15, Satyr: 10, "Blue Dragonspawn": 8, Tauren: 7, Furbolg: 5, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Azshara (undefined)": {iPopulation: 8750, Naga: 39, "Sea Giant": 15, Elf: 15, Satyr: 10, "Blue Dragonspawn": 8, Tauren: 7, Furbolg: 5, other: 1, sType: "undefined"}, 
    "aDarkshore": ["Auberdine", "Darkshore (undefined)"], 
    "Darkshore": {iPopulation: 9000, Elf: 87, Furbolg: 6, Dwarf: 5, other: 2, sSource: "Lands of Mystery", sType: "region"}, 
    "Auberdine": {iPopulation: 5500, Elf: 87, Furbolg: 6, Dwarf: 5, other: 2, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Darkshore (undefined)": {iPopulation: 3500, Elf: 87, Furbolg: 6, Dwarf: 5, other: 2, sType: "undefined"}, 
    "aFelwood": ["Bloodvenom Post", "Deadwood", "Felpaw", "Jadefire Glen", "Jadefire Run", "Jaedenar", "Timbermaw Hold", "Felwood (undefined)"], 
    "Felwood": {iPopulation: 9500, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Bloodvenom Post": {iPopulation: 200, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Deadwood": {iPopulation: 725, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Felpaw": {iPopulation: 650, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Jadefire Glen": {iPopulation: 425, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Jadefire Run": {iPopulation: 275, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Jaedenar": {iPopulation: 3500, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Timbermaw Hold": {iPopulation: 1250, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Felwood (undefined)": {iPopulation: 2475, Satyr: 44, Demon: 23, Furbolg: 15, Elf: 11, Tauren: 6, other: 1, sType: "undefined"}, 
    "aHyjalSummit": ["Astrannar", "Hyjal Summit (undefined)"], 
    "Hyjal Summit": {iPopulation: 5000, Demon: 29, Elf: 20, Dryad: 17, "Blue Dragonflight": 11, "Red Dragonflight": 10, "Bronze Dragonflight": 9, "Keeper of the Grove": 3, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Astrannar": {iPopulation: 4000, Demon: 29, Elf: 20, Dryad: 17, "Blue Dragonflight": 11, "Red Dragonflight": 10, "Bronze Dragonflight": 9, "Keeper of the Grove": 3, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Hyjal Summit (undefined)": {iPopulation: 1000, Demon: 29, Elf: 20, Dryad: 17, "Blue Dragonflight": 11, "Red Dragonflight": 10, "Bronze Dragonflight": 9, "Keeper of the Grove": 3, other: 1, sType: "undefined"}, 
    "aMoonglade": ["Nighthaven", "Moonglade (undefined)"], 
    "Moonglade": {iPopulation: 5000, Elf: 84, Dryad: 8, Tauren: 5, "Keeper of the Grove": 2, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Nighthaven": {iPopulation: 2000, Elf: 84, Dryad: 8, Tauren: 5, "Keeper of the Grove": 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Moonglade (undefined)": {iPopulation: 3000, Elf: 84, Dryad: 8, Tauren: 5, "Keeper of the Grove": 2, other: 1, sType: "undefined"}, 
    "aTeldrassil": ["Aldrassil", "Darnassus", "Dolanaar", "Rut'theran", "Teldrassil (undefined)"], 
    "Teldrassil": {iPopulation: 24000, Elf: 85, Furbolg: 6, Dryad: 5, Human: 3, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Aldrassil": {iPopulation: 2000, Elf: 85, Furbolg: 6, Dryad: 5, Human: 3, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Darnassus": {iPopulation: 15000, Elf: 85, Furbolg: 6, Dryad: 5, Human: 3, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Dolanaar": {iPopulation: 5000, Elf: 85, Furbolg: 6, Dryad: 5, Human: 3, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Rut'theran": {iPopulation: 300, Elf: 85, Furbolg: 6, Dryad: 5, Human: 3, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Teldrassil (undefined)": {iPopulation: 1700, Elf: 85, Furbolg: 6, Dryad: 5, Human: 3, other: 1, sType: "undefined"}, 
    "aWinterspring": ["Everlook", "Mazthoril", "Starfall", "Winterfall", "Winterspring (undefined)"], 
    "Winterspring": {iPopulation: 6500, Elf: 40, Goblin: 25, Wildkin: 15, "Blue Dragonflight": 10, other: 10, sSource: "Lands of Mystery", sType: "region"}, 
    "Everlook": {iPopulation: 3000, Elf: 40, Goblin: 25, Wildkin: 15, "Blue Dragonflight": 10, other: 10, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Mazthoril": {iPopulation: 550, Elf: 40, Goblin: 25, Wildkin: 15, "Blue Dragonflight": 10, other: 10, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Starfall": {iPopulation: 1500, Elf: 40, Goblin: 25, Wildkin: 15, "Blue Dragonflight": 10, other: 10, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Winterfall": {iPopulation: 300, Elf: 40, Goblin: 25, Wildkin: 15, "Blue Dragonflight": 10, other: 10, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Winterspring (undefined)": {iPopulation: 1150, Elf: 40, Goblin: 25, Wildkin: 15, "Blue Dragonflight": 10, other: 10, sType: "undefined"}, 
    "aSouthKalimdor": ["Feralas", "Silithus", "Tanaris", "Thousand Needles", "Un'Goro Crater"], 
    "South Kalimdor": {iPopulation: 11450, Tauren: 19, Goblin: 16, "Galak Centaur": 15, Human: 8, Gnome: 7, Harpy: 7, Ogre: 7, Elf: 5, "Sandfury Troll": 4, "Dunemaul Ogre": 3, Naga: 3, Kobold: 2, Orc: 1, Troll: 1, other: 2, sType: "region"},
    "aFeralas": ["Camp Mojache", "Dire Maul", "Feathermoon Stronghold", "Isle of Dread", "Feralas (undefined)"], 
    "Feralas": {iPopulation: 2200, Ogre: 34, Tauren: 30, Elf: 20, Naga: 15, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Camp Mojache": {iPopulation: 360, Ogre: 34, Tauren: 30, Elf: 20, Naga: 15, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Dire Maul": {iPopulation: 300, Ogre: 34, Tauren: 30, Elf: 20, Naga: 15, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Feathermoon Stronghold": {iPopulation: 240, Ogre: 34, Tauren: 30, Elf: 20, Naga: 15, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Isle of Dread": {iPopulation: 180, Ogre: 34, Tauren: 30, Elf: 20, Naga: 15, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Feralas (undefined)": {iPopulation: 1120, Ogre: 34, Tauren: 30, Elf: 20, Naga: 15, other: 1, sType: "undefined"}, 
    "aSilithus": ["Twilight Base Camp", "Valor's Rest"], 
    "Silithus": {iPopulation: 800, Tauren: 29, Elf: 20, Orc: 20, Troll: 20, Human: 10, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Twilight Base Camp": {iPopulation: 640, Tauren: 29, Elf: 20, Orc: 20, Troll: 20, Human: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Valor's Rest": {iPopulation: 160, Tauren: 29, Elf: 20, Orc: 20, Troll: 20, Human: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "aTanaris": ["Dunemaul Compound", "Gadgetzan", "Lostrigger Cove", "Steamwheedle Port", "Zul'Farrak"], 
    "Tanaris": {iPopulation: 3150, Goblin: 39, Human: 25, "Sandfury Troll": 15, "Dunemaul Ogre": 10, Gnome: 10, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Dunemaul Compound": {iPopulation: 300, Goblin: 39, Human: 25, "Sandfury Troll": 15, "Dunemaul Ogre": 10, Gnome: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Gadgetzan": {iPopulation: 1500, Goblin: 39, Human: 25, "Sandfury Troll": 15, "Dunemaul Ogre": 10, Gnome: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Lostrigger Cove": {iPopulation: 400, Goblin: 39, Human: 25, "Sandfury Troll": 15, "Dunemaul Ogre": 10, Gnome: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Steamwheedle Port": {iPopulation: 500, Goblin: 39, Human: 25, "Sandfury Troll": 15, "Dunemaul Ogre": 10, Gnome: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Zul'Farrak": {iPopulation: 450, Goblin: 39, Human: 25, "Sandfury Troll": 15, "Dunemaul Ogre": 10, Gnome: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "aThousandNeedles": ["Camp E'thok", "Darkcloud Pinnacle", "Freewind Post", "Mirage Raceway", "Roguefeather Den", "Splithoof Crag", "Thousand Needles (undefined)"], 
    "Thousand Needles": {iPopulation: 5000, "Galak Centaur": 34, Tauren: 25, Harpy: 15, Gnome: 10, Goblin: 10, Kobold: 5, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Camp E'thok": {iPopulation: 750, "Galak Centaur": 34, Tauren: 25, Harpy: 15, Gnome: 10, Goblin: 10, Kobold: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Darkcloud Pinnacle": {iPopulation: 450, "Galak Centaur": 34, Tauren: 25, Harpy: 15, Gnome: 10, Goblin: 10, Kobold: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Freewind Post": {iPopulation: 800, "Galak Centaur": 34, Tauren: 25, Harpy: 15, Gnome: 10, Goblin: 10, Kobold: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Mirage Raceway": {iPopulation: 1000, "Galak Centaur": 34, Tauren: 25, Harpy: 15, Gnome: 10, Goblin: 10, Kobold: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Roguefeather Den": {iPopulation: 750, "Galak Centaur": 34, Tauren: 25, Harpy: 15, Gnome: 10, Goblin: 10, Kobold: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Splithoof Crag": {iPopulation: 1000, "Galak Centaur": 34, Tauren: 25, Harpy: 15, Gnome: 10, Goblin: 10, Kobold: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Thousand Needles (undefined)": {iPopulation: 250, "Galak Centaur": 34, Tauren: 25, Harpy: 15, Gnome: 10, Goblin: 10, Kobold: 5, other: 1, sType: "undefined"}, 
    "aUn'GoroCrater": ["Marshal's Refuge", "Un'Goro Crater (undefined)"], 
    "Un'Goro Crater": {iPopulation: 300, sSource: "Lands of Mystery", sType: "region"}, 
    "Marshal's Refuge": {iPopulation: 50, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Un'Goro Crater (undefined)": {iPopulation: 250, sType: "undefined"}, 
    "aKhazModan": ["Badlands", "Dun Morogh", "Loch Modan", "Wetlands"], 
    "Khaz Modan": {iPopulation: 60000, Dwarf: 66, Human: 14, "Dragonmaw Orc": 12, Gnome: 5, "Drysnout Gnoll": 1, "Stonevault Trogg": 1, other: 1, sType: "region"}, 
    "aBadlands": ["Kargath", "Badlands (undefined)"], 
    "Badlands": {iPopulation: 2000, "Drysnout Gnoll": 39, Dwarf: 25, "Stonevault Trogg": 20, "Duskbelcher Ogre": 10, "Horde Orc": 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Kargath": {iPopulation: 100, "Drysnout Gnoll": 39, Dwarf: 25, "Stonevault Trogg": 20, "Duskbelcher Ogre": 10, "Horde Orc": 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Badlands (undefined)": {iPopulation: 1900, "Drysnout Gnoll": 39, Dwarf: 25, "Stonevault Trogg": 20, "Duskbelcher Ogre": 10, "Horde Orc": 5, other: 1, sType: "undefined"}, 
    "aDunMorogh": ["Anvilmar", "Brewnall", "Ironforge", "Kharanos"], 
    "Dun Morogh": {iPopulation: 28000, Dwarf: 87, Gnome: 10, Human: 2, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Anvilmar": {iPopulation: 3400, Dwarf: 87, Gnome: 10, Human: 2, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Brewnall": {iPopulation: 600, Dwarf: 87, Gnome: 10, Human: 2, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Ironforge": {iPopulation: 20000, Dwarf: 87, Gnome: 10, Human: 2, other: 1, sSource: "Warcraft Campaign Setting 3.5", sType: "settlement"}, 
    "Kharanos": {iPopulation: 4000, Dwarf: 87, Gnome: 10, Human: 2, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "aLochModan": ["Thelsamar", "Loch Modan (undefined)"], 
    "Loch Modan": {iPopulation: 5000, Dwarf: 94, Human: 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Thelsamar": {iPopulation: 850, Dwarf: 94, Human: 5, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Loch Modan (undefined)": {iPopulation: 4150, Dwarf: 94, Human: 5, other: 1, sType: "undefined"}, 
    "aWetlands": ["Menethil Harbor", "Wetlands (undefined)"], 
    "Wetlands": {iPopulation: 25000, Dwarf: 39, Human: 30, "Dragonmaw Orc": 30, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Menethil Harbor": {iPopulation: 12000, Dwarf: 39, Human: 30, "Dragonmaw Orc": 30, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Wetlands (undefined)": {iPopulation: 13000, Dwarf: 39, Human: 30, "Dragonmaw Orc": 30, other: 1, sType: "undefined"}, 
    "aLordaeron": ["Alterac Mountains", "Arathi Highlands", "Dalaran", "Eastern Plaguelands", "Hillsbrad Foothills", "Hinterlands", "KulTiras", 
        "Quel'Thalas", "Silverpine Forest", "Tirisfal Glades", "Western Plaguelands"], 
    "Lordaeron": {iPopulation: 184931, sType: "region"}, 
    "aAlteracMountains": ["Alterac City", "Strombrad", "Alterac Mountains (undefined)"], 
    "Alterac Mountains": {iPopulation: 4406, sType: "region"}, 
    "Alterac City": {iPopulation: 1000, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Strombrad": {iPopulation: 800, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Alterac Mountains (undefined)": {iPopulation: 2606, sType: "undefined"}, 
    "aArathiHighlands": ["Hammerfall", "Stromgarde", "Arathi Highlands (undefined)"], 
    "Arathi Highlands": {iPopulation: 6000, Human: 83, "Horde Orc": 10, Dwarf: 5, "Half-Orc": 1, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Hammerfall": {iPopulation: 600, Human: 83, "Horde Orc": 10, Dwarf: 5, "Half-Orc": 1, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Stromgarde": {iPopulation: 1200, Human: 83, "Horde Orc": 10, Dwarf: 5, "Half-Orc": 1, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Arathi Highlands (undefined)": {iPopulation: 4200, Human: 83, "Horde Orc": 10, Dwarf: 5, "Half-Orc": 1, other: 1, sType: "undefined"}, 
    "aDalaran": ["Dalaran City", "Dalaran (undefined)"], 
    "Dalaran": {iPopulation: 7317, sType: "region"}, 
    "Dalaran City": {iPopulation: 3000, sSource: "Warcraft Campaign Setting 3.5", sType: "settlement"}, 
    "Dalaran (undefined)": {iPopulation: 4317, sType: "undefined"}, 
    "aEasternPlaguelands": ["Stratholme", "Tyr's Hand", "Eastern Plaguelands (undefined)"], 
    "Eastern Plaguelands": {iPopulation: 45000, Undead: 72, Human: 20, "Forest Troll": 7, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Stratholme": {iPopulation: 25000, Undead: 99, other: 1, sSource: "Warcraft Campaign Setting 3.5", sType: "settlement"}, 
    "Tyr's Hand": {iPopulation: 9000, Undead: 72, Human: 20, "Forest Troll": 7, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Eastern Plaguelands (undefined)": {iPopulation: 11000, Undead: 72, Human: 20, "Forest Troll": 7, other: 1, sType: "undefined"}, 
    "aHillsbradFoothills": ["Southshore", "Hillsbrad Foothills (undefined)"], 
    "Hillsbrad Foothills": {iPopulation: 15000, Human: 79, Dwarf: 8, Goblin: 5, "Half-Elf": 4, "Half-Orc": 3, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Southshore": {iPopulation: 2000, Human: 79, Dwarf: 8, Goblin: 5, "Half-Elf": 4, "Half-Orc": 3, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Hillsbrad Foothills (undefined)": {iPopulation: 13000, Human: 79, Dwarf: 8, Goblin: 5, "Half-Elf": 4, "Half-Orc": 3, other: 1, sType: "undefined"}, 
    "aHinterlands": ["Aerie Peak", "Hinterlands (undefined)"], 
    "Hinterlands": {iPopulation: 13000, Dwarf: 64, "Forest Troll": 30, Elf: 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Aerie Peak": {iPopulation: 8000, Dwarf: 89, Elf: 10, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Hinterlands (undefined)": {iPopulation: 5000, Dwarf: 64, "Forest Troll": 30, Elf: 5, other: 1, sType: "undefined"}, 
    "aKulTiras": ["Boralus", "KulTiras (undefined)"], 
    "KulTiras": {iPopulation: 10000, Human: 84, Dwarf: 10, Elf: 3, Goblin: 2, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Boralus": {iPopulation: 4000, Human: 84, Dwarf: 10, Elf: 3, Goblin: 2, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "KulTiras (undefined)": {iPopulation: 6000, Human: 84, Dwarf: 10, Elf: 3, Goblin: 2, other: 1, sType: "undefined"}, 
    "aQuel'Thalas": ["Zul'Aman"], 
    "Quel'Thalas": {iPopulation: 20000, sType: "region"}, 
    "aZul'Aman": ["Shrine of Ula-Tek", "Zul'Aman (undefined)"], 
    "Zul'Aman": {iPopulation: 20000, "Forest Troll": 89, Elf: 5, "Scourge Undead": 5, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Shrine of Ula-Tek": {iPopulation: 7000, "Forest Troll": 89, Elf: 5, "Scourge Undead": 5, other: 1, sSource: "Lands of Conflict", sType: "compound"}, 
    "Zul'Aman (undefined)": {iPopulation: 13000, "Forest Troll": 89, Elf: 5, "Scourge Undead": 5, other: 1, sType: "undefined"}, 
    "aSilverpineForest": ["Ambermill", "Pyrewood", "Silverpine Forest (undefined)"], 
    "Silverpine Forest": {iPopulation: 6208, sType: "region"}, 
    "Ambermill": {iPopulation: 2000, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Pyrewood": {iPopulation: 560, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Silverpine Forest (undefined)": {iPopulation: 3648, sType: "undefined"}, 
    "aTirisfalGlades": ["Brill", "Deathknell", "Undercity", "Tirisfal Glades (undefined)"], 
    "Tirisfal Glades": {iPopulation: 18000, Forsaken: 89, Undead: 5, Human: 2, "Horde Jungle Troll": 1, "Horde Orc": 1, Tauren: 1, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Brill": {iPopulation: 3600, Forsaken: 89, Undead: 5, Human: 2, "Horde Jungle Troll": 1, "Horde Orc": 1, Tauren: 1, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Deathknell": {iPopulation: 700, Forsaken: 89, Undead: 5, Human: 2, "Horde Jungle Troll": 1, "Horde Orc": 1, Tauren: 1, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Undercity": {iPopulation: 13000, Forsaken: 89, Undead: 5, "Horde Orc": 3, "Horde Jungle Troll": 1, Tauren: 1, other: 1, sSource: "Warcraft Campaign Setting 3.5", sType: "settlement"}, 
    "Tirisfal Glades (undefined)": {iPopulation: 700, Forsaken: 89, Undead: 5, Human: 2, "Horde Jungle Troll": 1, "Horde Orc": 1, Tauren: 1, other: 1, sType: "undefined"}, 
    "aWesternPlaguelands": ["Andorhal", "Hearthglen", "Western Plaguelands (undefined)"], 
    "Western Plaguelands": {iPopulation: 40000, Undead: 91, Human: 8, other: 1, sSource: "Lands of Conflict", sType: "region"}, 
    "Andorhal": {iPopulation: 8000, Undead: 91, Human: 8, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Hearthglen": {iPopulation: 3000, Undead: 91, Human: 8, other: 1, sSource: "Lands of Conflict", sType: "settlement"}, 
    "Western Plaguelands (undefined)": {iPopulation: 29000, Undead: 91, Human: 8, other: 1, sType: "undefined"}, 
    "aNorthrend": ["Azjol-Nerub", "Borean Tundra", "Coldarra", "Crystalsong Forest", "Dragonblight", "Grizzly Hills", "Howling Fjord", 
        "Icecrown Glacier", "Storm Peaks", "Zul'Drak"], 
    "Northrend": {iPopulation: 396741, Undead: 62, "Drakkari Troll": 10, Furbolg: 7, Tuskarr: 6, Scourge: 5, Dwarf: 4, Human: 2, Naga: 1, Nerubian: 1, other: 2, sType: "region"}, 
    "Azjol-Nerub": {iPopulation: 20000, Scourge: 81, Nerubian: 17, Dwarf: 1, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "aBoreanTundra": ["Kaskala", "Riplash Ruins", "Borean Tundra (undefined)"], 
    "Borean Tundra": {iPopulation: 28500, Tuskarr: 79, "Drakkari Troll": 10, Naga: 8, "Blue Dragonflight": 1, Scourge: 1, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Kaskala": {iPopulation: 12500, Tuskarr: 79, "Drakkari Troll": 10, Naga: 8, "Blue Dragonflight": 1, Scourage: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Riplash Ruins": {iPopulation: 3000, Tuskarr: 79, "Drakkari Troll": 10, Naga: 8, "Blue Dragonflight": 1, Scourage: 1, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Borean Tundra (undefined)": {iPopulation: 13000, Tuskarr: 79, "Drakkari Troll": 10, Naga: 8, "Blue Dragonflight": 1, Scourage: 1, other: 1, sType: "undefined"}, 
    "aColdarra": ["Nexus", "Coldarra (undefined)"], 
    "Coldarra": {iPopulation: 500, "Blue Dragon": 99, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Nexus": {iPopulation: 100, "Blue Dragon": 99, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Coldarra (undefined)": {iPopulation: 400, "Blue Dragon": 99, other: 1, sType: "undefined"}, 
    "Crystalsong Forest": {iPopulation: 141, "Crystalline Golem": 69, "Green Dragon": 30, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "aDragonblight": ["Icemist", "Dragonblight (undefined)"], 
    "Dragonblight": {iPopulation: 800, Nerubian: 49, Tauren: 20, Scourge: 20, "Blue Dragon": 10, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Icemist": {iPopulation: 160, Nerubian: 49, Tauren: 20, Scourge: 20, "Blue Dragon": 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Dragonblight (undefined)": {iPopulation: 640, Nerubian: 49, Tauren: 20, Scourge: 20, "Blue Dragon": 10, other: 1, sType: "undefined"}, 
    "aGrizzlyHills": ["Drak'Tharon Keep", "Grizzlemaw", "Thor Modan", "Grizzly Hills (undefined)"], 
    "Grizzly Hills": {iPopulation: 47500, Furbolg: 59, Dwarf: 30, Scourge: 10, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Drak'Tharon Keep": {iPopulation: 2000, Furbolg: 59, Dwarf: 30, Scourge: 10, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "Grizzlemaw": {iPopulation: 10000, Furbolg: 59, Dwarf: 30, Scourge: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Thor Modan": {iPopulation: 3000, Furbolg: 59, Dwarf: 30, Scourge: 10, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Grizzly Hills (undefined)": {iPopulation: 32500, Furbolg: 59, Dwarf: 30, Scourge: 10, other: 1, sType: "undefined"}, 
    "aHowlingFjord": ["Valgarde", "Howling Fjord (undefined)"], 
    "Howling Fjord": {iPopulation: 11000, Human: 59, Dwarf: 30, Troll: 5, Furbolg: 5, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Valgarde": {iPopulation: 5000, Human: 59, Dwarf: 30, Troll: 5, Furbolg: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Howling Fjord (undefined)": {iPopulation: 6000, Human: 59, Dwarf: 30, Troll: 5, Furbolg: 5, other: 1, sType: "undefined"}, 
    "aIcecrownGlacier": ["Icecrown Citadel"], 
    "Icecrown Glacier": {iPopulation: 250000, Undead: 99, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Icecrown Citadel": {iPopulation: 250000, Undead: 99, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "aStormPeaks": ["Ulduar", "Storm Peaks (undefined)"], 
    "Storm Peaks": {iPopulation: 300, "Storm Giant": 69, "Crystalline Golem": 25, Magnataur: 3, Wendigo: 2, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Ulduar": {iPopulation: 143, "Storm Giant": 69, "Crystalline Golem": 25, Magnataur: 3, Wendigo: 2, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Storm Peaks (undefined)": {iPopulation: 157, "Storm Giant": 69, "Crystalline Golem": 25, Magnataur: 3, Wendigo: 2, other: 1, sType: "undefined"}, 
    "aZul'Drak": ["Gundrak", "Zul'Drak (undefined)"], 
    "Zul'Drak": {iPopulation: 38000, "Drakkari Troll": 94, Wendigo: 5, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Gundrak": {iPopulation: 13000, "Drakkari Troll": 94, Wendigo: 5, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Zul'Drak (undefined)": {iPopulation: 25000, "Drakkari Troll": 94, Wendigo: 5, other: 1, sType: "undefined"}, 
    "aSouthSeas": ["Broken Isles", "Eye", "Isle of Kezan", "Plunder Isle", "Zandalar"], 
    "South Seas": {iPopulation: 147500, sType: "region"}, 
    "Broken Isles": {iPopulation: 2000, sSource: "Lands of Mystery", sType: "region"}, 
    "aEye": ["Mak'aru", "Nazjatar"], 
    "Eye": {iPopulation: 80000, Naga: 59, Makrura: 40, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Mak'aru": {iPopulation: 30000, Naga: 59, Makrura: 40, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Nazjatar": {iPopulation: 50000, Naga: 59, Makrura: 40, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "aIsle of Kezan": ["Bilgwater Port", "Edj", "Undermine", "Voodress"], 
    "Isle of Kezan": {iPopulation: 40000, Goblin: 70, "Forest Troll": 15, Human: 5, Gnome: 2, "Jungle Troll": 2, Elf: 2, Dwarf: 1, Orc: 1, Tauren: 1, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Bilgwater Port": {iPopulation: 14000, Goblin: 70, "Forest Troll": 15, Human: 5, Gnome: 2, "Jungle Troll": 2, Elf: 2, Dwarf: 1, Orc: 1, Tauren: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Edj": {iPopulation: 4000, Goblin: 70, "Forest Troll": 15, Human: 5, Gnome: 2, "Jungle Troll": 2, Elf: 2, Dwarf: 1, Orc: 1, Tauren: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Undermine": {iPopulation: 20000, Goblin: 70, "Forest Troll": 15, Human: 5, Gnome: 2, "Jungle Troll": 2, Elf: 2, Dwarf: 1, Orc: 1, Tauren: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Voodress": {iPopulation: 1000, Goblin: 70, "Forest Troll": 15, Human: 5, Gnome: 2, "Jungle Troll": 2, Elf: 2, Dwarf: 1, Orc: 1, Tauren: 1, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "aPlunderIsle": ["Bloodsail Hold"], 
    "Plunder Isle": {iPopulation: 500, Human: 84, Orc: 10, Goblin: 3, "Jungle Troll": 2, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Bloodsail Hold": {iPopulation: 500, Human: 84, Orc: 10, Goblin: 3, "Jungle Troll": 2, other: 1, sSource: "Lands of Mystery", sType: "compound"}, 
    "aZandalar": ["Zuldazar", "Zandalar (undefined)"], 
    "Zandalar": {iPopulation: 25000, Troll: 99, other: 1, sSource: "Lands of Mystery", sType: "region"}, 
    "Zuldazar": {iPopulation: 17000, Troll: 99, other: 1, sSource: "Lands of Mystery", sType: "settlement"}, 
    "Zandalar (undefined)": {iPopulation: 8000, Troll: 99, other: 1, sType: "undefined"}, 
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
