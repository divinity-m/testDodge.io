// DODGE.IO - FUNCTIONS.JS
function loadingScreen(validInput) {
    if (validInput || endLoading) {
        if (now - loadingGame >= 1000 && gameState == "loading") {
            endLoading = true;
            return true;
        }
        else if (now - loadingGame <= 5000 && gameState == "loading") return true;
    }
}

// KEYBAORD AND MOUSE EVENTS (player inputs)
function recordKeyDown(event) {
    // stops the page from scrolling when arrow keys are pressed
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }
    if (loadingScreen(false)) return;
    
    // Keyboard Inputs (WASD & Shift)
    if (event.code === "KeyW" || event.code === "ArrowUp") wPressed = true;
    if (event.code === "KeyA" || event.code === "ArrowLeft") aPressed = true;
    if (event.code === "KeyS" || event.code === "ArrowDown") sPressed = true;
    if (event.code === "KeyD" || event.code === "ArrowRight") dPressed = true;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") shiftPressed = 0.7;
    if (wPressed || aPressed || sPressed || dPressed) keyboardMovementOn = true;

    // Ability controls
    if ((event.code === "KeyQ" || event.code === "KeyJ") && gameState !== "endlessOver") {
        if (player.dodger === "j-sab" && dash.usable && !dash.activated) dash.activated = true;
            
        else if (player.dodger === "jolt" && shockwave.usable && !shockwave.activated) {
            // activate the shockwave ability and set certain properties
            shockwave.activated = true;
            shockwave.facingAngle = player.facingAngle;
            shockwave.x = player.x;
            shockwave.y = player.y;
            shockwave.movex = Math.cos(shockwave.facingAngle) * 7;
            shockwave.movey = Math.sin(shockwave.facingAngle) * 7;
            shockwave.used = shockwave.active;
            if (shockwave.used === "Shockwave") { shockwave.cd = 8500; shockwave.effect = 0.75; }
            else if (shockwave.used === "Shockray") { shockwave.cd = 5500; shockwave.effect = 0.5; }
        }
    } else if ((event.code === "KeyE" || event.code === "KeyK") && gameState !== "endlessOver") {
        if (player.dodger === "jötunn" && absoluteZero.usable) {
            absoluteZero.usable = false;
            absoluteZero.lastEnded = Date.now();
            if (absoluteZero.passive === "Absolute Zero") absoluteZero.passive = "Glaciation"
            else if (absoluteZero.passive === "Glaciation") absoluteZero.passive = "Stagnation";
            else if (absoluteZero.passive === "Stagnation") absoluteZero.passive = "Absolute Zero";
        }
        if (player.dodger === "jolt" && shockwave.active === "Shockwave") shockwave.active = "Shockray";
        else if (player.dodger === "jolt" && shockwave.active === "Shockray") shockwave.active = "Shockwave";
    }
}

function recordKeyUp(event) {
    if (loadingScreen(false)) return;
    if (event.code === "KeyW" || event.code === "ArrowUp") wPressed = false;
    if (event.code === "KeyA" || event.code === "ArrowLeft") aPressed = false;
    if (event.code === "KeyS" || event.code === "ArrowDown") sPressed = false;
    if (event.code === "KeyD" || event.code === "ArrowRight") dPressed = false;
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") shiftPressed = 1;
    if (!wPressed && !aPressed && !sPressed && !dPressed) keyboardMovementOn = false;
}

function recordRightClick(event) {
    lastPressing = "mouse";
    if (loadingScreen(true)) return;
    
    // Ability Activations
    if (gameState !== "endlessOver") {
        if (player.dodger === "j-sab" && dash.usable && !dash.activated) dash.activated = true;
        
        else if (player.dodger === "jolt" && shockwave.usable && !shockwave.activated) {
            shockwave.activated = true;
            shockwave.facingAngle = player.facingAngle;
            shockwave.x = player.x;
            shockwave.y = player.y;
            shockwave.movex = Math.cos(shockwave.facingAngle) * 7;
            shockwave.movey = Math.sin(shockwave.facingAngle) * 7;
            shockwave.used = shockwave.active;
            if (shockwave.used === "Shockwave") { shockwave.cd = 8500; shockwave.effect = 0.75; }
            else if (shockwave.used === "Shockray") { shockwave.cd = 5500; shockwave.effect = 0.5; }
        }
    }
}

function recordMiddleClick(event) {
    lastPressing = "mouse";
    if (loadingScreen(true)) return;
    
    if (gameState !== "endlessOver") {
        if (player.dodger === "jötunn" && absoluteZero.usable) {
            absoluteZero.usable = false;
            absoluteZero.lastEnded = Date.now();
            if (absoluteZero.passive === "Absolute Zero") absoluteZero.passive = "Glaciation"
            else if (absoluteZero.passive === "Glaciation") absoluteZero.passive = "Stagnation";
            else if (absoluteZero.passive === "Stagnation") absoluteZero.passive = "Absolute Zero";
        }
        if (player.dodger === "jolt" && shockwave.active === "Shockwave") shockwave.active = "Shockray";
        else if (player.dodger === "jolt" && shockwave.active === "Shockray") shockwave.active = "Shockwave";
    }
}

function recordLeftClick() {
    lastPressing = "mouse";
    if (loadingScreen(true)) return;
    previousMM = false;
    
    // Mouse Movement
    if (mouseMovementOn && !settings.disableMM) {
        mouseMovementOn = false;
        previousMM = true;
    } else if (!mouseMovementOn && !settings.disableMM) {
        mouseMovementOn = true;
        previousMM = false;
    }
    
    // Start screen buttons
    if (innerGameState === "mainMenu" && (mouseOver.play || mouseOver.settings || mouseOver.selector)) {
        if (mouseOver.play) innerGameState = "selectDifficulty";
        else if (mouseOver.settings) innerGameState = "settings";
        else if (mouseOver.selector) innerGameState = "selectDodger";

        resetBgVars();
        mouseMovementOn = previousMM;
    }
    // Buttons that redirect back to the start screen
    else if (gameState === "endlessOver" && mouseOver.restart ||
            innerGameState === "settings" && mouseOver.settings ||
            innerGameState === "selectDodger" && mouseOver.selector ||
            innerGameState === "selectDifficulty" && mouseOver.play) {
        // Saves the users settings options when they exit the settings
        if (innerGameState === "settings") {
            userData.settings = settings;
            if (now - clickEventSave > 500) {
                localStorage.setItem('localUserData', JSON.stringify(userData));
                clickEventSave = Date.now();
            }
        }
        // Plays 'A New Start' when users are redirected back to the Main Menu
        if (gameState === "endlessOver") {
            allEnemies = [];
            dash.lastEnded = 0;
            shockwave.reset();
            amplify.reset();
            music = {var: aNewStart, name: "A New Start", artist: "Thygan Buch"};
            music.var.currentTime = 0;
            music.promise = music.var.play();
        }
        resetBgVars();
        gameState = "startScreen";
        innerGameState = "mainMenu";
        mouseMovementOn = previousMM;
    }

    // Settings
    else if (innerGameState === "settings") {
        ["enemyOutBtn", "disableMMBtn", "musicSlider", "sfxSlider", "aZ_RangeBtn", "aZ_AvSlider", "customCursorBtn", "cursorTrailSlider"].forEach(setting => {
            if (mouseOver?.[setting]) {
                // Buttons
                if (mouseOver?.enemyOutBtn) {
                    if (settings.enemyOutlines) settings.enemyOutlines = false;
                    else settings.enemyOutlines = true;
                }
                if (mouseOver?.disableMMBtn) {
                    if (settings.disableMM) settings.disableMM = false;
                    else { settings.disableMM = true; mouseMovementOn = false; }
                }
                if (mouseOver?.aZ_RangeBtn) {
                    if (settings.aZ_Range) settings.aZ_Range = false;
                    else settings.aZ_Range = true;
                }
                if (mouseOver?.customCursorBtn) {
                    if (settings.customCursor) settings.customCursor = false;
                    else settings.customCursor = true;
                }
                // Sliders
                if (mouseOver?.musicSlider) settings.musicSliderX = Math.min(Math.max(mouseX, 565), 715);
                if (mouseOver?.sfxSlider) settings.sfxSliderX = Math.min(Math.max(mouseX, 552), 702);
                if (mouseOver?.aZ_AvSlider) settings.aZ_Av = Math.min(Math.max(mouseX, 555), 705);
                if (mouseOver?.cursorTrailSlider) settings.cursorTrail = Math.min(Math.max(mouseX, 550), 700);
    
                // Saves the users settings options
                userData.settings = settings;

                if (now - clickEventSave > 500) {
                    localStorage.setItem('localUserData', JSON.stringify(userData));
                    clickEventSave = Date.now();
                }
    
                if (!settings.disableMM) mouseMovementOn = previousMM;
            }
        })
    }

    // Difficulty Choice
    else if (innerGameState === "selectDifficulty" && mouseOver) {
        ["easy", "medium", "hard"].forEach(level => {
            if (mouseOver?.[level]) {
                pauseAudio(music.promise, music.var);
                if (mouseOver?.easy) difficulty = {level: "easy", color: "rgb(0, 225, 255)"};
                if (mouseOver?.medium) difficulty = {level: "medium", color: "rgb(255, 255, 0)"};
                if (mouseOver?.hard) difficulty = {level: "hard", color: "rgb(0, 0, 0)"};
                music = {var: interstellar, name: "interstellar", artist: "pandora., chillwithme, & cødy",
                         color: "rgb(105, 105, 105)", subColor: "rgb(115, 115, 115)",};
                mouseMovementOn = previousMM;
                restartEndless();
            }
        });
        ["limbo", "andromeda", "euphoria"].forEach(level => {
            if (mouseOver?.[level]) {
                pauseAudio(music.promise, music.var);
                if (mouseOver?.limbo) {
                    music = {var: alarm9, name: "Alarm 9", artist: "Blue Cxve",
                             color: "rgb(100, 0, 100)", subColor: "rgb(128, 0, 128)", textColor: "rgb(163, 0, 163)",
                             timestamps: [[0.079], [2.79], [3.13], [3.49], [3.81], [4.17], [5.58], [6.28],
                                          [6.99], [7.7], [8.4], [9.1], [9.8], [10.5], [11.9], [12.6]],};
                    music.timestamps.forEach(ts => ts[1] = "beam");
                    for (let loopNum = 1; loopNum < 11; loopNum++) { // loop amount: 11, wavelength: 11.5
                        loopedPoints = music.timestamps.slice(1, 16).map(x => [x[0] + 11.5*loopNum, x[1]]);
                        music.timestamps = music.timestamps.concat(loopedPoints);
                    }
                    music.timestamps.forEach(ts => { ts[0] -= 0.025; }); // delay slightly for better visual to audio sync
                }
                if (mouseOver?.andromeda) {
                    function solo8Beam(time) {
                        return [ // 8-beam - [0.225, 0.24, 0.23, 0.236, 0.217, 0.258, 0.228]
                        [time, "horizontal"], [time+0.225, "horizontal"], [time+0.456, "vertical"], [time+0.695, "vertical"],
                        [time+0.931, "horizontal"], [time+1.148, "horizontal"], [time+1.406, "vertical"], [time+1.634, "vertical"],
                        ]
                    }
                    function doubleTriple(time, ending="none", addon="none") {
                        // DT to TD [0.475] // TD to DT [0.493] // DT to 8B [0.49] // 8B to DT [0.222]
                        // double-triple - [0.48, 0.465, 0.189, 0.256]
                        // triple doubled - [0.189, 0.256, 0.508, 0.202, 0.226]
                        
                        let DT = [
                            // double-triple
                        [time, "horizontal"], [time+0.48, "horizontal"], [time+0.945, "vertical"], [time+1.134, "vertical"], [time+1.390, "vertical"],
                            
                            // triple doubled
                        [time+1.865, "horizontal"], [time+2.054, "horizontal"], [time+2.310, "horizontal"],
                        [time+2.818, "vertical"], [time+3.020, "vertical"], [time+3.246, "vertical"],
                            
                            // silent double-triple
                        /*[time+3.739, "vertical"],*/ [time+4.219, "horizontal"], [time+4.684, "vertical"], [time+4.873, "horizontal"], [time+5.129, "vertical"],
                        ];
                        // 8-beam
                        if (ending === "8-beam" || ending === "8-beam-cutout") DT.push([time+5.619, "horizontal"], [time+5.844, "horizontal"], [time+6.084, "vertical"], [time+6.314, "vertical"]);
                        if (ending === "8-beam") DT.push([time+6.550, "horizontal"], [time+6.767, "horizontal"], [time+7.025, "vertical"], [time+7.253, "vertical"]);
                        // quintuple
                        if (ending === "quintuple") DT.push([time+5.608, "ring"], [time+6.078, "ring"], [time+6.545, "ring"], [time+7.015, "ring"], [time+7.248, "ring"]);
                        // addon
                        if (addon === "bombs") DT.push([time, "bomb"], [time+0.945, "bomb"], [time+1.865, "bomb"], [time+2.818, "bomb"], [time+3.739, "bomb"], [time+4.684, "bomb"]);
                        if (addon === "bombs" && ending === "8-beam") DT.push([time+5.619, "bomb"], [time+6.550, "bomb"])
                        return DT;
                    }
                    function drumBuildUp(time) {
                        DBU = [// 15-beat (16th cuts out) // 0.242 horiz, 0.356 vert
                        [time, "bomb"], [time+0.479, "bomb"], [time+0.912, "bomb"], [time+1.411, "bomb"], [time+1.885, "bomb"], 
                        [time+2.356, "bomb"], [time+2.819, "bomb"], [time+3.296, "bomb"], [time+3.761, "bomb"], [time+4.236, "bomb"], 
                        [time+4.695, "bomb"], [time+5.165, "bomb"], [time+5.638, "bomb"], [time+6.106, "bomb"], [time+6.575, "bomb"], 
                            
                            // 16-beat, drum tempo increased // avg 0.235
                        [time+7.509, "bomb"], [time+7.744, "bomb"], [time+7.979, "bomb"], [time+8.214, "bomb"],
                        [time+8.449, "bomb"], [time+8.684, "bomb"], [time+8.919, "bomb"], [time+9.153, "bomb"],
                        [time+9.386, "bomb"], [time+9.619, "bomb"], [time+9.857, "bomb"], [time+10.088, "bomb"],
                        [time+10.317, "bomb"], [time+10.556, "bomb"], [time+10.798, "bomb"], [time+11.019, "bomb"],
                            
                            // accelerando // 0.225, 0.24, 0.23, 0.236, 0.217, 0.258, 0.228
                        [time+11.265, "bomb"], [time+11.500, "bomb"], [time+11.732, "bomb"], [time+11.952, "bomb"],
                        [time+12.195, "bomb"], [time+12.425, "bomb"], [time+12.738, "bomb"], [time+12.671, "bomb"],

                            // quintuple ring // 0.47, 0.467, 0.47, 0.233
                        [time+13.140, "ring"], [time+13.610, "ring"], [time+14.077, "ring"], [time+14.547, "ring"], [time+14.780, "ring"],
                        ];
                            // in-betweens
                        for (let i = 0; i < DBU.length; i+=3) {
                            if (i < 15) DBU.push([DBU[i][0]+0.242, "horizontal"], [DBU[i][0]+0.356, "vertical"]);
                            else if (i < 39) DBU.push([DBU[i][0], "horizontal"], [DBU[i][0], "vertical"]);
                        }
                        return DBU;
                    }
                    function ending(time) {
                        let finale =  [ // 6-beat
                        [time, "ring"], [time+0.459, "ring"], [time+0.942, "ring"],
                        [time+1.405, "ring"], [time+1.879, "ring"], [time+2.329, "ring"],
                        [time, "horizontal"], [time+0.459, "horizontal"], [time+0.942, "horizontal"],
                        [time+1.405, "horizontal"], [time+1.879, "horizontal"], [time+2.329, "horizontal"],
                            
                        [time+2.827, "bomb"],

                            // 4-beam
                        [time+2.827, "vertical"], [time+3.061, "horizontal"], [time+3.269, "vertical"], [time+3.495, "horizontal"],
                        [time+2.827, "bomb"], [time+3.061, "bomb"], [time+3.269, "bomb"], [time+3.495, "bomb"],

                            // 6-beat
                        [time+3.755, "ring"], [time+4.214, "ring"], [time+4.691, "ring"],
                        [time+5.140, "ring"], [time+5.631, "ring"],  [time+6.094, "ring"],
                        [time+3.755, "vertical"], [time+4.214, "vertical"], [time+4.691, "vertical"],
                        [time+5.140, "vertical"], [time+5.631, "vertical"], [time+6.094, "vertical"],

                            // 5-beam
                        [time+6.279, "vertical"], [time+6.578, "horizontal"], [time+6.796, "vertical"], [time+7.101, "horizontal"], [time+7.276, "vertical"],
                        [time+6.279, "bomb"], [time+6.578, "bomb"], [time+6.796, "bomb"], [time+7.101, "bomb"], [time+7.276, "bomb"],

                            // drum build up
                        [time+7.509, "bomb"], [time+7.946, "bomb"], [time+8.429, "bomb"], [time+8.903, "bomb"],
                        [time+9.377, "bomb"], [time+9.827, "bomb"], [time+10.312, "bomb"], [time+10.748, "bomb"],
                        [time+11.267, "bomb"], [time+11.724, "bomb"], [time+12.188, "bomb"], [time+12.626, "bomb"],
                        [time+13.127, "bomb"], [time+13.579, "bomb"], [time+14.074, "bomb"], 

                            // final echo
                        [time+14.538, "ring"],
                        ]
                            // layers
                        for (let i = 43; i < 58; i++) { finale.push([finale[i][0], "vertical"], [finale[i][0], "horizontal"]); }
                        return finale;
                    }
                    music = {var: astralProjection, name: "Astral Projection", artist: "Hallmore",
                             color: "rgb(220, 220, 220)", subColor: "rgb(240, 240, 240)", textColor: "rgb(0, 0, 0)",
                             timestamps: [],
                            };
                    // structure
                    music.timestamps = music.timestamps.concat(solo8Beam(0.075));
                    music.timestamps = music.timestamps.concat(doubleTriple(1.931, "8-beam"), doubleTriple(9.433, "8-beam"));
                    music.timestamps = music.timestamps.concat(doubleTriple(16.931, "8-beam"), doubleTriple(24.435, "8-beam-cutout"));
                    music.timestamps = music.timestamps.concat(drumBuildUp(31.925));
                    music.timestamps = music.timestamps.concat(doubleTriple(46.959, "8-beam", "bombs"), doubleTriple(54.459, "quintuple", "bombs"));
                    music.timestamps = music.timestamps.concat(doubleTriple(61.935, "8-beam", "bombs"), doubleTriple(69.393, "none", "bombs"));
                    music.timestamps = music.timestamps.concat([[76.461, "ring"]]);
                    // 8 consecutive solo 8-beams
                    for (let i = 0; i < 8; i++) { music.timestamps = music.timestamps.concat(solo8Beam(84.430+(1.882*i))); }
                    music.timestamps = music.timestamps.concat(doubleTriple(99.437, "8-beam"), doubleTriple(106.925, "8-beam-cutout"));
                    music.timestamps = music.timestamps.concat(drumBuildUp(114.417));
                    music.timestamps = music.timestamps.concat(doubleTriple(129.431, "8-beam", "bombs"), doubleTriple(136.390, "quintuple", "bombs"));
                    music.timestamps = music.timestamps.concat(doubleTriple(144.438, "8-beam", "bombs"), doubleTriple(151.909, "8-beam", "bombs"));
                    music.timestamps = music.timestamps.concat(ending(159.426));
                    music.timestamps.forEach(ts => { ts[0] -= 0.025; });
                }
                if (mouseOver?.euphoria) {
                    const xMid = GAME_WIDTH/2;
                    const yMid = GAME_HEIGHT/2;
                    function lessThan(time = 33.590) {
                        return [[time, "horizontal", {size: 150, coords: ["player"]}], [time+0.388, "vertical", {size: 150, coords: ["player"]}], [time+0.902, "horizontal", {size: 150, coords: ["player"]}],
                                  // 2.095, 2.47
                                  [time+2.00, "bomb", {size: 150}], [time+2.375, "bomb", {size: 180}],
                                  // 3.06, 3.538
                                  [time+1.900, "spike", {size: 22.5, location: "tl", spawnRate: 0.6}], [time+2.275, "spike", {size: 22.5, location: "tr", spawnRate: 0.6}]];
                    }
                    function heyAh_heyHi(time = 66.920) {
                        return [[time, "vertical", {coords: ["player"], spawnRate: 0.5, despawnRate: 3}], [time+0.18, "vertical", {coords: ["player"], spawnRate: 0.5, despawnRate: 3}],
                                [time+1.083, "horizontal", {coords: ["player"], spawnRate: 0.5, despawnRate: 3}], [time+1.606, "horizontal", {coords: ["player"], spawnRate: 0.5, despawnRate: 3}]];
                    }
                    function bg16Beat(time = 91.834, difficulty = "easy") {
                        let bg = [[time, "spike"], [time+0.547, "spike"], [time+1.091, "spike"], [time+1.586, "spike"],
                                [time+2.133, "horizontal"], [time+2.637, "horizontal"], [time+3.178, "horizontal"],
                                [time+3.694, "bomb"], [time+3.942, "bomb"],
                                [time+4.222, "spike"], [time+4.74, "spike"], [time+5.265, "spike"], [time+5.775, "spike"],
                                [time+6.307, "horizontal", {despawnRate: 3}], [time+6.826, "horizontal", {despawnRate: 3}], [time+7.336, "horizontal", {despawnRate: 3}]];
                        if (difficulty !== "easy") {
                            bg.push([time+1.036, "ring"], [time+3.096, "ring"], [time+5.175, "ring"], [time+7.246, "ring"]);
                            if (difficulty === "hard") { for (let i = 0; i < 16; i+=2) bg.push([bg[i][0]+0.231, "vertical"]); }
                            bg.push([time, "bomb", {size: 150, despawnRate: 3}], [time+2.07, "bomb", {size: 150, despawnRate: 3}],
                                    [time+4.167, "bomb", {size: 150, despawnRate: 3}], [time+6.253, "bomb", {size: 150, despawnRate: 3}]);
                        }
                        return bg;
                    }
                    function deepSynth(time = 150.313, extras = "none") {
                        dS = [[time, "vertical", {size: xMid, coords: [xMid/2, 0], spawnRate: 0.3, despawnRate: 3}],
                              [time+1.029, "horizontal", {size: yMid, coords: [0, yMid/2], spawnRate: 0.3, despawnRate: 3}],
                              [time+2.359, "bomb", {spawnRate: 0.7, despawnRate: 4}], [time+3.118, "bomb", {spawnRate: 0.7, despawnRate: 4}]];
                        let duration = 3.995 - 3.137;
                        if (extras === "leftSpikeWall" || extras === "rightSpikeWall") {
                            let interval = (duration / 14);
                            let margin = (GAME_HEIGHT-(30*14)) / 15; // 650 = (r*2 * 14) + 15n
                            let xValue;
                            if (extras === "leftSpikeWall") xValue = 10 * 1.501;
                            else if (extras === "rightSpikeWall") xValue = GAME_WIDTH - 10 * 1.501;
                            for (let i = 0; i < 14; i++) {
                                dS.push([time+3.137 + (interval*i), "spike", {size: 10, speed: 5, coords: [xValue, margin*(i+1) + 30*i + 15], spawnRate: 0.5}]);
                            }
                        } else if (extras === "encirclingSpikes") {
                            let interval = (duration / 8);
                            let intIndex = 0;
                            ["bl", "lm", "tl", "tm", "tr", "rm", "br", "bm"].forEach(spawn => {
                                dS.push([time+3.137 + (interval*intIndex), "spike", {size: 25, speed: 3.5, location: spawn, spawnRate: 0.5}]);
                                intIndex++;
                            })
                        }
                        return dS;
                    }
                    music = {var: divine, name: "Divine", artist: "SOTAREKO",
                             color: "rgb(223, 255, 156)", subColor: "rgb(224, 255, 232)", textColor: "rgb(255, 165, 252)",
                             timestamps: [
                                 [16.730, "vertical", {size: 80, coords: [140, 0]}], [17.268, "vertical", {size: 80, coords: [360, 0]}], [17.835, "vertical", {size: 80, coords: [580, 0]}],
                                 [18.400, "horizontal", {size: 80, coords: [0, 490/3]}], [18.900, "horizontal", {size: 80, coords: [0, 2*490/3 + 80]}],
                                 [19.400, "vertical", {size: 200, coords: [50, 0]}], [19.670, "vertical", {size: 200, coords: [300, 0]}], [19.950, "vertical", {size: 200, coords: [550, 0]}],
                                 [20.430, "horizontal", {size: 200, coords: [0, 250/3]}], [20.800, "horizontal", {size: 200, coords: [0, 2*250/3 + 200]}],
                                 [23.550, "vertical", {size: 100, coords: [0, 0]}], [23.800, "horizontal", {size: 100, coords: [0, 0]}],
                                 [24.075, "vertical", {size: 100, coords: [700, 0]}], [24.592, "horizontal", {size: 100, coords: [0, 550]}],
                                 [25.100, "vertical", {size: 100, coords: [100, 0]}], [25.688, "horizontal", {size: 100, coords: [0, 100]}],
                                 [26.175, "vertical", {size: 100, coords: [600, 0]}], [26.700, "horizontal", {size: 100, coords: [0, 450]}],
                                 [27.220, "bomb", {size: 300, coords: [xMid, yMid], spawnRate: 0.3, despawnRate: 2.5}],
                                 [29.246, "ring", {size: 400, coords: [xMid, yMid], spawnRate: 0.3, despawnRate: 2.2}], // shrink
                                 [30.050, "ring", {size: 200, coords: [xMid, yMid], spawnRate: 0.4, despawnRate: 2.5}],
                                 [30.800, "ring", {size: 75, coords: [xMid, yMid], spawnRate: 0.5, despawnRate: 3}],
                                 [32.093, "bomb", {size: 100, coords: [xMid, yMid], spawnRate: 0.3, despawnRate: 3}], // growth
                                 [32.630, "bomb", {size: 250, coords: [xMid, yMid], spawnRate: 0.3, despawnRate: 3}],
                                 [32.930, "bomb", {size: 350, coords: [xMid, yMid], spawnRate: 0.3, despawnRate: 3}],
                                 [32.631, "spike", {size: 20, speed: 3.5, location: "tl", spawnRate: 0.8, despawnRate: 3}],
                                 [32.632, "spike", {size: 20, speed: 3.5, location: "tr", spawnRate: 0.5, despawnRate: 3}],
                                 [32.931, "spike", {size: 20, speed: 3.5, location: "br", spawnRate: 0.4, despawnRate: 3}],
                                 [73.081, "vertical", {size: GAME_WIDTH/2, coords: [0, 0], spawnRate: 1, despawnRate: 5}], // 4 walls
                                 [73.610, "vertical", {size: GAME_WIDTH/2, coords: [xMid, 0], spawnRate: 1, despawnRate: 5}],
                                 [74.125, "horizontal", {size: GAME_HEIGHT/2, coords: [0, yMid], spawnRate: 1, despawnRate: 5}],
                                 [74.646, "horizontal", {size: GAME_HEIGHT/2, coords: [0, 0], spawnRate: 1, despawnRate: 5}],
                                 [85.341, "vertical", {size: 200, coords: ["player"]}], [87.219, "vertical", {size: 200, coords: ["player"]}],
                                 [87.400, "horizontal", {size: 200, coords: ["player"]}], [89.331, "horizontal", {size: 200, coords: ["player"]}],
                                 [140.914, "bomb", {size: 500, coords: [GAME_WIDTH, GAME_HEIGHT], spawnRate: 1, despawnRate: 5}], // 2 corner semi circles
                                 [141.458, "bomb", {size: 500, coords: [0, 0], spawnRate: 1, despawnRate: 5}],
                                 [141.957, "spike", {size: 50, location: "bl", spawnRate: 0.3, despawnRate: 3}], // spike triangle
                                 [142.482, "spike", {size: 50, location: "tm", spawnRate: 0.3, despawnRate: 3}],
                                 [142.986, "spike", {size: 50, location: "br", spawnRate: 0.3, despawnRate: 3}],
                                 [192.047, "text", {text: "Thank", coords: [265, 100], despawnRate: 0.2}], // thanks
                                 [193.098, "text", {text: "You", coords: [440, 100], despawnRate: 0.3}],
                                 [194.134, "text", {text: "For", coords: [260, 175], despawnRate: 0.2}],
                                 [195.186, "text", {text: "Playing", coords: [360, 175], despawnRate: 0.3}],
                                 [196.226, "text", {text: "This", coords: [285, 100], despawnRate: 0.2}],
                                 [197.391, "text", {text: "Was", coords: [400, 100], despawnRate: 0.3}],
                                 [198.577, "text", {text: "Dodge", coords: [280, 175], despawnRate: 0}],
                                 [199.300, "text", {text: ".io", coords: [443, 175], despawnRate: 0}],
                             ],
                            };
                    music.timestamps = music.timestamps.concat(lessThan(33.590));
                    music.timestamps = music.timestamps.concat(lessThan(37.760));
                    music.timestamps = music.timestamps.concat(lessThan(41.930));
                    music.timestamps = music.timestamps.concat(lessThan(46.123));
                    let spb = 60/115; // bpm = 115
                    let startBeat = 50.102;
                    let beats = 29; // beam sync to increase difficulty
                    for (let i = startBeat; i < startBeat-0.01 + spb*beats; i+=spb) music.timestamps.push([i, "beam", {despawnRate: 3}]);
                    music.timestamps = music.timestamps.concat(lessThan(50.814));
                    music.timestamps = music.timestamps.concat(lessThan(54.460));
                    music.timestamps = music.timestamps.concat(lessThan(58.620));
                    // music.timestamps = music.timestamps.concat(lessThan(62.810)); excluded
                    // ring spam
                    startBeat = 66.797;
                    beats = 12;
                    music.timestamps.push([64.749, "ring", {size: 450, invincible: true, coords: [xMid, yMid], spawnRate: 0.325}]);
                    for (let i = startBeat; i < startBeat-0.01 + spb*(beats-1); i+=spb) music.timestamps.push([i-0.2, "ring", {size: 450, invincible: true, coords: [xMid, yMid], spawnRate: 1}]);
                    music.timestamps = music.timestamps.concat(heyAh_heyHi(66.920));
                    music.timestamps = music.timestamps.concat(heyAh_heyHi(69.020));
                    music.timestamps = music.timestamps.concat(heyAh_heyHi(71.120));
                    // 73.081-74.646 4 half-walls
                    // 4 corner circles
                    startBeat = 75.250;
                    beats = 16;
                    let corner = 1;
                    let coords = {1:[0, 0], 2:[GAME_WIDTH, 0], 3:[GAME_WIDTH, GAME_HEIGHT], 4:[0, GAME_HEIGHT]};
                    for (let i = startBeat; i < startBeat-0.01 + spb*beats; i+=spb) {
                        music.timestamps.push([i-0.2, "bomb", {size: 300, coords: coords[corner], spawnRate: 1}]);
                        corner++;
                        if (corner > 4) corner = 1;
                    }
                    music.timestamps = music.timestamps.concat(heyAh_heyHi(75.250));
                    music.timestamps = music.timestamps.concat(heyAh_heyHi(77.350));
                    music.timestamps = music.timestamps.concat(heyAh_heyHi(79.434));
                    music.timestamps = music.timestamps.concat(heyAh_heyHi(81.521));
                    music.timestamps = music.timestamps.concat(bg16Beat(91.834));
                    music.timestamps = music.timestamps.concat(bg16Beat(100.233, "medium"));
                    music.timestamps = music.timestamps.concat(bg16Beat(108.580, "hard"));
                    music.timestamps = music.timestamps.concat(bg16Beat(116.926, "medium"));
                    music.timestamps = music.timestamps.concat(lessThan(117.032));
                    music.timestamps = music.timestamps.concat(lessThan(121.180));
                    music.timestamps = music.timestamps.concat(lessThan(125.376));
                    // music.timestamps = music.timestamps.concat(bg16Beat(125.276, "medium")); excluded
                    // music.timestamps = music.timestamps.concat(lessThan(129.568)); excluded
                    // music.timestamps = music.timestamps.concat(lessThan(133.700)); excluded
                    // 4 Walls spam
                    startBeat = 133.619;
                    beats = 15;
                    let side = 1;
                    coords = {1:[0, 0, "vertical", xMid], 2:[0, 0, "horizontal", yMid],
                              3:[xMid, 0, "vertical", xMid], 4:[0, yMid, "horizontal", yMid]};
                    music.timestamps.push([131.571, "vertical", {size: GAME_WIDTH/2, coords: [0, 0], spawnRate: 0.325, despawnRate: 5,}]);
                    for (let i = startBeat; i < startBeat-0.01 + spb*(beats-1); i+=spb) {
                        side++;
                        if (side > 4) side = 1;
                        music.timestamps.push([i-0.2, coords[side][2], {size: coords[side][3], coords: coords[side], spawnRate: 1, despawnRate: 5,}]);
                    }
                    // 140.914-141.458 2 corner circles
                    music.timestamps = music.timestamps.concat(lessThan(142.062));
                    // music.timestamps = music.timestamps.concat(lessThan(146.222)); excluded
                    // Bomb Encircling
                    startBeat = 146.135;
                    beats = 3;
                    let w = 300;
                    for (let i = startBeat; i < startBeat-0.01 + spb*beats; i+=spb) {
                        music.timestamps.push([i, "bomb", {size: w, coords: [0, 0], spawnRate: 0.3, despawnRate: 0.7,}]);
                        music.timestamps.push([i, "bomb", {size: w, coords: [GAME_WIDTH, 0], spawnRate: 0.3, despawnRate: 0.7,}]);
                        music.timestamps.push([i, "bomb", {size: w, coords: [GAME_WIDTH, GAME_HEIGHT], spawnRate: 0.3, despawnRate: 0.7,}]);
                        music.timestamps.push([i, "bomb", {size: w, coords: [0, GAME_HEIGHT], spawnRate: 0.3, despawnRate: 0.7,}]);
                        w += 80;
                    }
                    music.timestamps = music.timestamps.concat(deepSynth(150.313));
                    music.timestamps = music.timestamps.concat(deepSynth(154.472, "leftSpikeWall"));
                    music.timestamps = music.timestamps.concat(deepSynth(158.662));
                    music.timestamps = music.timestamps.concat(deepSynth(162.985, "rightSpikeWall"));
                    music.timestamps = music.timestamps.concat(deepSynth(167.002));
                    music.timestamps = music.timestamps.concat(deepSynth(171.190, "encirclingSpikes"));
                    music.timestamps = music.timestamps.concat(deepSynth(175.353));
                    music.timestamps = music.timestamps.concat(deepSynth(179.531));
                    music.timestamps = music.timestamps.concat(deepSynth(183.669));
                    music.timestamps = music.timestamps.concat(deepSynth(187.874));
                    // music.timestamps = music.timestamps.concat(deepSynth(192.047)); excluded
                    // music.timestamps = music.timestamps.concat(deepSynth(196.226)); excluded
                    music.timestamps.forEach(ts => { ts[0] -= 0.025; });
                    for (let i = 1; i < 16; i++) music.timestamps.unshift([i, "ring", {size: 40+(i-1)*25, invincible: true, coords: [xMid, yMid]}]);
                }
                music.timestamps.sort((a, b) => a[0] - b[0]);
                music.backUpTS = [...music.timestamps];
                mouseMovementOn = previousMM;
                restartMusicMode();
            }
        })
    }
    
    // Hero Choice
    else if (innerGameState === "selectDodger") {
        if (!dash.activated && (mouseOver.evader || mouseOver.j_sab || mouseOver.jötunn || mouseOver.jolt || mouseOver.crescendo)) {
            if (mouseOver.evader) {
                player.dodger = "evader";
                player.color = "rgb(255, 255, 255)";
                player.subColor = "rgb(230, 230, 230)";
                amplify.reset();
            }
            else if (mouseOver.j_sab && highscore.andromeda === 100) {
                player.dodger = "j-sab";
                player.color = "rgb(255, 0, 0)";
                player.subColor = "rgb(230, 0, 0)";
                amplify.reset();
            }
            else if (mouseOver.jötunn && highscore.limbo === 100) {
                player.dodger = "jötunn";
                player.color = "rgb(79, 203, 255)";
                player.subColor = "rgb(70, 186, 235)";
                amplify.reset();
            }
            else if (mouseOver.jolt && highscore.medium >= 30) {
                player.dodger = "jolt";
                player.color = "rgb(255, 255, 0)";
                player.subColor = "rgb(230, 230, 0)";
                amplify.reset();
            }
            else if (mouseOver.crescendo && highscore.hard >= 60) {
                player.dodger = "crescendo";
                player.color = "rgb(0, 0, 0)";
                player.subColor = "rgb(40, 40, 40)";
            }
            mouseMovementOn = previousMM;
            // saves the players values to the local storage to keep track of the players dodger
            userData.player = player;
            if (now - clickEventSave > 500) {
                localStorage.setItem('localUserData', JSON.stringify(userData));
                clickEventSave = Date.now();
            }
        }
    }
}

function detectHover() {
    mouseOver.play = gameState === "startScreen" && (innerGameState === "mainMenu" || innerGameState === "selectDifficulty") && mouseX > 250 && mouseX < 550 && mouseY > 50 && mouseY < 150; // const playBtn = { x: 250, y: 50, w: 300, h: 100, };
    mouseOver.selector = gameState === "startScreen" && (innerGameState === "mainMenu" || innerGameState === "selectDodger") && mouseX > 250 && mouseX < 550 && mouseY > 475 && mouseY < 575; // const selectorBtn = { x: 250, y: 475, w: 300, h: 100, };
    mouseOver.settings = gameState === "startScreen" && Math.hypot(770 - mouseX, 620 - mouseY) < 30;
    mouseOver.restart = gameState === "endlessOver" && mouseX > 250 && mouseX < 550 && mouseY > 50 && mouseY < 150;

    mouseOver.evader = gameState === "startScreen" && innerGameState === "selectDodger" && mouseX > 50 && mouseX < 250 && mouseY > 25 && mouseY < 125;
    mouseOver.j_sab = gameState === "startScreen" && innerGameState === "selectDodger" && mouseX > 425 && mouseX < 625 && mouseY > 150 && mouseY < 250;
    mouseOver.jötunn = gameState === "startScreen" && innerGameState === "selectDodger" && mouseX > 550 && mouseX < 750 && mouseY > 25 && mouseY < 125;
    mouseOver.jolt = gameState === "startScreen" && innerGameState === "selectDodger" && mouseX > 300 && mouseX < 500 && mouseY > 25 && mouseY < 125;
    mouseOver.crescendo = gameState === "startScreen" && innerGameState === "selectDodger" && mouseX > 175 && mouseX < 375 && mouseY > 150 && mouseY < 250;

    mouseOver.easy = gameState === "startScreen" && innerGameState === "selectDifficulty" && mouseX > 50 && mouseX < 250 && mouseY > 450 && mouseY < 550;
    mouseOver.medium = gameState === "startScreen" && innerGameState === "selectDifficulty" && mouseX > 300 && mouseX < 500 && mouseY > 450 && mouseY < 550;
    mouseOver.hard = gameState === "startScreen" && innerGameState === "selectDifficulty" && mouseX > 550 && mouseX < 750 && mouseY > 450 && mouseY < 550;
    mouseOver.limbo = gameState === "startScreen" && innerGameState === "selectDifficulty" && mouseX > 50 && mouseX < 250 && mouseY > 250 && mouseY < 350;
    mouseOver.andromeda = gameState === "startScreen" && innerGameState === "selectDifficulty" && mouseX > 300 && mouseX < 500 && mouseY > 250 && mouseY < 350;
    mouseOver.euphoria = gameState === "startScreen" && innerGameState === "selectDifficulty" && mouseX > 550 && mouseX < 750 && mouseY > 250 && mouseY < 350;

    mouseOver.enemyOutBtn = gameState === "startScreen" && innerGameState === "settings" && mouseX > 216 && mouseX < 236 && mouseY > 35 && mouseY < 55;
    mouseOver.disableMMBtn = gameState === "startScreen" && innerGameState === "settings" && mouseX > 318 && mouseX < 338 && mouseY > 85 && mouseY < 105;
    mouseOver.musicSlider = gameState === "startScreen" && innerGameState === "settings" && mouseX >= 555 && mouseX <= 725 && mouseY >= 30 && mouseY <= 60;
    mouseOver.sfxSlider = gameState === "startScreen" && innerGameState === "settings" && mouseX >= 542 && mouseX <= 712 && mouseY >= 80 && mouseY <= 110;
    mouseOver.aZ_RangeBtn = gameState === "startScreen" && innerGameState === "settings" && mouseX > 266 && mouseX < 286 && mouseY > 135 && mouseY < 155;
    mouseOver.aZ_AvSlider = gameState === "startScreen" && innerGameState === "settings" && mouseX >= 545 && mouseX <= 715 && mouseY >= 130 && mouseY <= 160;
    mouseOver.customCursorBtn = gameState === "startScreen" && innerGameState === "settings" && mouseX > 167 && mouseX < 187 && mouseY > 185 && mouseY < 205;
    mouseOver.cursorTrailSlider = gameState === "startScreen" && innerGameState === "settings" && mouseX >= 540 && mouseX <= 710 && mouseY >= 180 && mouseY <= 210;
}

// FUNCTIONS THAT DRAWS STUFF TO THE SCREEN
function drawCircle(x = 0, y = 0, r = 12.5, type = "fill") {
    ctx.beginPath()
    ctx.arc(x, y, r, Math.PI * 2, 0)
    if (type === "fill") ctx.fill();
    else if (type === "stroke") ctx.stroke();
}

function decideFillStyle(bool, color1, color2) {
    if (bool) ctx.fillStyle = color1;
    else ctx.fillStyle = color2;
}

function createCursor() {
    let cursor = {
        r: 7.5,
        av: 1,
        subR: 7.5/Math.max(1, 30*trailDensity),
        subAv: 1/Math.max(1, 30*trailDensity),
    }
    cursor.x = cursorX;
    cursor.y = cursorY;
    
    let playerColor = player.color.slice(4, player.color.length-1);
    cursor.color = `rgba(${playerColor}, ${cursor.av})`;
    
    cursor.div = document.createElement("div");
    cursor.div.classList.add("trail");
    document.getElementById("cursor-trail").appendChild(cursor.div);
                
    return cursor;
}

function createClick(button) {
    let click = {
        r: 1,
        av: 1,
        addR: 24/15, // 1 + 24/15 * 15
        subAv: 1/15, // 1 - 1/15 * 15
        button: button,
    }
    click.x = cursorX;
    click.y = cursorY;
    
    let playerColor = player.color.slice(4, player.color.length-1);
    let playerSubColor = player.subColor.slice(4, player.subColor.length-1);
    click.colorLeft = `rgba(${playerColor}, ${click.av})`;
    click.colorRight = `rgba(${playerSubColor}, ${click.av})`;

    click.div = document.createElement("div");
    click.div.classList.add("click");
    document.getElementById("cursor-clicks").appendChild(click.div);
    if (click.button === "middle") {
        click.divMid = document.createElement("div");
        click.divMid.classList.add("click");
        document.getElementById("cursor-clicks").appendChild(click.divMid);
    }
    
    return click;
}

function drawStartScreen() {
    if (innerGameState === "mainMenu" || innerGameState === "selectDifficulty") {
        // Main Menu Background Animation
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(170, 170, 170)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
        ctx.stroke();

        ctx.fillStyle = "rgb(170, 170, 170)";
        ctx.font = '150px Arial';
        ctx.textAlign = 'center';

        let hyp = Math.hypot(GAME_WIDTH, GAME_HEIGHT);
        ctx.save();
        ctx.rotate(Math.atan(GAME_HEIGHT/GAME_WIDTH));
        ctx.fillText("MAIN", BgTopX, 0);
        ctx.restore();
        
        ctx.save();
        ctx.rotate(Math.atan(GAME_HEIGHT/GAME_WIDTH));
        ctx.fillText("MENU", BgBottomX, 103);
        ctx.restore();

        if (BgTopX <= hyp*4/10) BgTopX += 10 * Math.max(0.5, (2 - (now - BgTime)/1000));
        
        if (BgBottomX >= hyp*6/10 && now - BgTime > 1000) BgBottomX -= 10 * Math.max(0.5, (3 - (now - BgTime)/1000));
        
        // Me
        ctx.strokeStyle = player.color;
        ctx.lineWidth = 1.5;
        ctx.font = '30px Roboto';
        ctx.textAlign = 'left';
        ctx.strokeText("Vasto", 5, 30);
        
        // PLAY BUTTON //
        const playBtn = {
            x: 250,
            y: 50,
            w: 300,
            h: 100,
        }
        playBtn.xw = playBtn.x + playBtn.w;
        playBtn.yh = playBtn.y + playBtn.h;
        const playGrad = ctx.createLinearGradient(playBtn.x, playBtn.y, playBtn.xw, playBtn.yh);
        const playGrad2 = ctx.createLinearGradient(playBtn.x, playBtn.yh, playBtn.xw, playBtn.y);
        
        if (mouseOver.play) {
            playGrad.addColorStop(0, "rgb(0, 255, 0)");
            playGrad.addColorStop(1, "rgb(255, 255, 255)");

            playGrad2.addColorStop(0, "rgb(255, 255, 255)");
            playGrad2.addColorStop(1, "rgb(0, 255, 0)");
        } else {
            playGrad.addColorStop(0, "rgb(255, 255, 255)");
            playGrad.addColorStop(1, "rgb(0, 255, 0)");

            playGrad2.addColorStop(0, "rgb(0, 255, 0)");
            playGrad2.addColorStop(1, "rgb(255, 255, 255)");
        }

        ctx.fillStyle = playGrad;
        ctx.fillRect(playBtn.x, playBtn.y, playBtn.w, playBtn.h);
        
        ctx.strokeStyle = playGrad2;
        ctx.lineWidth = 3;
        ctx.strokeRect(playBtn.x, playBtn.y, playBtn.w, playBtn.h);
        ctx.beginPath()
        ctx.moveTo(playBtn.x, playBtn.yh)
        ctx.lineTo(playBtn.xw, playBtn.y)
        ctx.stroke()
        
        ctx.lineWidth = 1.5;
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        let greenBtnColors = ['lime', 'white'];

        if (mouseOver.play) greenBtnColors = ['white', 'lime'];
        else greenBtnColors = ['lime', 'white'];
        
        // swaps between 2 types of buttons for going in and out of the difficulty selection screen
        if (innerGameState === "mainMenu") {
            ctx.strokeStyle = greenBtnColors[0];
            ctx.strokeText('Start', playBtn.x + 70, playBtn.y + 30);
        
            ctx.strokeStyle = greenBtnColors[1];
            ctx.strokeText('Playing', playBtn.x + 220, playBtn.y + 85);
        } else if (innerGameState === "selectDifficulty") {
            ctx.strokeStyle = greenBtnColors[0];
            ctx.strokeText('Back To', playBtn.x + 70, playBtn.y + 30);
        
            ctx.strokeStyle = greenBtnColors[1];
            ctx.strokeText('Main Menu', playBtn.x + 220, playBtn.y + 85);
        }
    }
    if (innerGameState === "mainMenu" || innerGameState === "selectDodger") {
        // DODGER SLECTOR BUTTON //
        const selectorBtn = {
            x: 250,
            y: 475,
            w: 300,
            h: 100,
        }
        selectorBtn.xw = selectorBtn.x + selectorBtn.w;
        selectorBtn.yh = selectorBtn.y + selectorBtn.h;
        const selectorGrad = ctx.createLinearGradient(selectorBtn.x, selectorBtn.y, selectorBtn.xw, selectorBtn.yh);
        const selectorGrad2 = ctx.createLinearGradient(selectorBtn.x, selectorBtn.yh, selectorBtn.xw, selectorBtn.y);
        
        if (mouseOver.selector) {
            selectorGrad.addColorStop(0, "rgb(114, 114, 114)");
            selectorGrad.addColorStop(1, "rgb(255, 255, 255)");

            selectorGrad2.addColorStop(0, "rgb(255, 255, 255)");
            selectorGrad2.addColorStop(1, "rgb(114, 114, 114)");
        } else {
            selectorGrad.addColorStop(0, "rgb(255, 255, 255)");
            selectorGrad.addColorStop(1, "rgb(114, 114, 114)");

            selectorGrad2.addColorStop(0, "rgb(114, 114, 114)");
            selectorGrad2.addColorStop(1, "rgb(255, 255, 255)");
        }

        ctx.fillStyle = selectorGrad;
        ctx.fillRect(selectorBtn.x, selectorBtn.y, selectorBtn.w, selectorBtn.h);
        
        ctx.strokeStyle = selectorGrad2;
        ctx.lineWidth = 3;
        ctx.strokeRect(selectorBtn.x, selectorBtn.y, selectorBtn.w, selectorBtn.h);
        ctx.beginPath()
        ctx.moveTo(selectorBtn.x, selectorBtn.yh)
        ctx.lineTo(selectorBtn.xw, selectorBtn.y)
        ctx.stroke()

        ctx.lineWidth = 1.5;
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        let greyBtnColors = ['grey', 'white'];

        if (mouseOver.selector) greyBtnColors = ['white', 'grey'];
        else greyBtnColors = ['grey', 'white'];

        // swaps between 2 types of buttons for going in and out of the dodger selection screen
        if (innerGameState === "mainMenu") {
            ctx.strokeStyle = greyBtnColors[0];
            ctx.strokeText('Dodger', selectorBtn.x + 70, selectorBtn.y + 30);
        
            ctx.strokeStyle = greyBtnColors[1];
            ctx.strokeText('Selection', selectorBtn.x + 220, selectorBtn.y + 85);
        } else if (innerGameState === "selectDodger") {
            ctx.strokeStyle = greyBtnColors[0];
            ctx.strokeText('Back To', selectorBtn.x + 70, selectorBtn.y + 30);
        
            ctx.strokeStyle = greyBtnColors[1];
            ctx.strokeText('Main Menu', selectorBtn.x + 220, selectorBtn.y + 85);
        }
    }
}

function drawSettings() {
    const gear = { x: 750, y: 600, };
    const distGear = Math.hypot(gear.x+20 - mouseX, gear.y+20 - mouseY); // (770, 620) is the center of the gear

    settings.musicSliderX = Math.min(Math.max(settings.musicSliderX, 565), 715);
    settings.sfxSliderX = Math.min(Math.max(settings.sfxSliderX, 552), 702);
    settings.aZ_Av = Math.min(Math.max(settings.aZ_Av, 555), 705);
    settings.cursorTrail = Math.min(Math.max(settings.cursorTrail, 550), 700);
    
    musicVolume = Math.max(Math.min((settings.musicSliderX - 565) / (715 - 565), 1), 0);
    sfxVolume = Math.max(Math.min((settings.sfxSliderX - 552) / (702 - 552), 1), 0);
    absoluteZero.av = Math.max(Math.min((settings.aZ_Av - 555) / (705 - 555), 1), 0)
    trailDensity = Math.max(Math.min((settings.cursorTrail - 550) / (700 - 550), 1), 0);
    music.var.volume = musicVolume;
    sharpPop.volume = sfxVolume;

    if (innerGameState === "mainMenu") ctx.drawImage(document.getElementById("gear-filled"), gear.x, gear.y, 40, 40);
    else if (innerGameState === "settings") {
        ctx.drawImage(document.getElementById("gear-unfilled"), gear.x, gear.y, 40, 40);
        
        ctx.textAlign = "left";
        ctx.font = "bold 15px Arial";
        
        // Settings Title Texts
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText("Show Enemy Outlines", 50, 50);
        ctx.fillText("Disable Mouse Movement Activation", 50, 100);
        ctx.fillText("Show Absolute Zero's Range", 50, 150);
        ctx.fillText("Custom Cursor", 50, 200);
        
        ctx.fillText("Music Volume", 450, 50);
        ctx.fillText("SFX Volume", 450, 100);
        ctx.fillText("AZ's Opacity", 450, 150);
        ctx.fillText("Cursor Trail", 450, 200);

        function drawSettingsButton(x, y, bool) {
            ctx.lineWidth = 2;
            if (bool) {
                ctx.fillStyle = "rgba(0, 220, 0, 0.8)";
                ctx.strokeStyle = "rgba(0, 255, 0, 0.8)";
                ctx.fillRect(x, y, 20, 20);
                ctx.strokeRect(x, y, 20, 20);
            }
            else {
                ctx.fillStyle = "rgba(220, 0, 0, 0.8)";
                ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
                ctx.fillRect(x, y, 20, 20);
                ctx.strokeRect(x, y, 20, 20);
            }
        }
        
        // Buttons
        drawSettingsButton(216, 35, settings.enemyOutlines);
        drawSettingsButton(316, 85, settings.disableMM);
        drawSettingsButton(266, 135, settings.aZ_Range);
        drawSettingsButton(167, 185, settings.customCursor);
        
        // Sliders
        if (mouseDown && mouseOver.musicSlider) settings.musicSliderX = Math.min(Math.max(mouseX, 565), 715);
        if (mouseDown && mouseOver.sfxSlider) settings.sfxSliderX = Math.min(Math.max(mouseX, 552), 702);
        if (mouseDown && mouseOver.aZ_AvSlider) settings.aZ_Av = Math.min(Math.max(mouseX, 555), 705);
        if (mouseDown && mouseOver.cursorTrailSlider) settings.cursorTrail = Math.min(Math.max(mouseX, 550), 700);

        function drawSettingsSlider(x, y, sliderX, number) { 
            ctx.beginPath();
            ctx.roundRect(x, y, 150, 10, 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.roundRect(x, y, sliderX - x, 10, 5);
            ctx.fill();
            drawCircle(sliderX, y+5, 10);
            if (number !== undefined) ctx.fillText(number, x+165, y+10);
        }
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.textAlign = "left";
        ctx.font = "bold 15px Arial";

        // Sliders
        drawSettingsSlider(565, 40, settings.musicSliderX, Math.floor(musicVolume*100));
        drawSettingsSlider(552, 90, settings.sfxSliderX, Math.floor(sfxVolume*100));
        drawSettingsSlider(555, 140, settings.aZ_Av, Math.floor(absoluteZero.av*100));
        drawSettingsSlider(550, 190, settings.cursorTrail, Math.floor(trailDensity*100));
    }
}

function drawDifficultySelection() {
    // Nested functions cuz fuck doing this shit over and over again
    function drawDifficultyInfo(x, y, color, difficultyName, score, adversary, ...description) {
        // Level Name
        ctx.fillStyle = color;
        ctx.textAlign = "left";
        ctx.font = "bold 19px 'Lucida Console'";
        ctx.fillText(difficultyName, x, y);

        // Level Score
        if (score !== "none") {
            ctx.textAlign = "right";
            ctx.fillText(score, x + 180, y);
        }

        // Level Description
        ctx.textAlign = "left";
        ctx.font = "15.5px 'Lucida Console'";
        ctx.fillText(`${adversary}:  ${description[0]}`, x, y + 25);
        if (description[1]) ctx.fillText(description[1], x, y + 50);
    }
    function drawPercentCompleted(x, y, color, percent) {
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = 2;
        if (percent === 100) ctx.strokeStyle = color;

        // 50 + 200 + 50 = 300 || 1/6 + 2/3 + 1/6 = 1
        let left = Math.min(1/6*100, percent) * 3; // 1/6
        let middle = Math.max(Math.min(5/6*100-1/6*100, percent-1/6*100), 0) * 3; // 1/6 + 2/3
        let right = Math.max(percent-(5/6*100), 0) * 3; // 1/6 + 2/3 + 1/6
        
        ctx.beginPath();
        ctx.moveTo(x, y+50);
        ctx.lineTo(x, y+50-left);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y+50);
        ctx.lineTo(x, y+50+left);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + middle, y)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y+100);
        ctx.lineTo(x + middle, y+100)
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x+200, y);
        ctx.lineTo(x+200, y+right)
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x+200, y+100);
        ctx.lineTo(x+200, y+100-right)
        ctx.stroke();
    }
    
    // Titles
    ctx.textAlign = "center";
    ctx.fillStyle = "grey";
    
    ctx.font = "bold 30px Arial";
    ctx.fillText("NORMAL LEVELS", GAME_WIDTH/2, 220);
    ctx.fillText("ENDLESS LEVELS", GAME_WIDTH/2, 420);

    // Levels
    decideFillStyle(mouseOver.limbo, "rgb(128, 0, 128)", "rgb(100, 0, 100)");
    ctx.fillRect(50, 250, 200, 100);
    drawDifficultyInfo(60, 280, "rgb(163, 0, 163)", "LIMBO", `${highscore.limbo}%`, "Dangers", "Beams");
    drawPercentCompleted(50, 250, "rgb(163, 0, 163)", highscore.limbo);
    
    decideFillStyle(mouseOver.andromeda, "rgb(240, 240, 240)", "rgb(220, 220, 220)");
    ctx.fillRect(300, 250, 200, 100);
    drawDifficultyInfo(310, 280, "rgb(0, 0, 0)", "ANDROMEDA", `${highscore.andromeda}%`, "Dangers", "Beams  Bombs", "Rings");
    drawPercentCompleted(300, 250, "rgb(0, 0, 0)", highscore.andromeda);

    decideFillStyle(mouseOver.euphoria, "rgb(224, 255, 232)", "rgb(223, 255, 156)");
    ctx.fillRect(550, 250, 200, 100);
    drawDifficultyInfo(560, 280, "rgb(255, 165, 252)", "EUPHORIA", `${highscore.euphoria}%`, "Dangers", "Beams  Bombs", "Rings  Spikes");
    drawPercentCompleted(550, 250, "rgb(255, 165, 252)", highscore.euphoria);

    decideFillStyle(mouseOver.easy, "rgb(0, 191, 216)", "rgb(0, 171, 194)");
    ctx.fillRect(50, 450, 200, 100);
    drawDifficultyInfo(60, 480, "rgb(0, 225, 255)", "EASY", `${highscore.easy}s`, "Enemies", "Normals");
    
    decideFillStyle(mouseOver.medium, "rgb(220, 220, 0)", "rgb(200, 200, 0)");
    ctx.fillRect(300, 450, 200, 100);
    drawDifficultyInfo(310, 480, "rgb(255, 255, 0)", "MEDIUM", `${highscore.medium}s`, "Enemies", "Normals", "Decelerators");

    decideFillStyle(mouseOver.hard, "rgb(40, 40, 40)", "rgb(50, 50, 50)");
    ctx.fillRect(550, 450, 200, 100);
    drawDifficultyInfo(560, 480, "rgb(0, 0, 0)", "HARD", `${highscore.hard}s`, "Enemies", "Normals", "Decelerators  Homings");
}

function drawDodgerSelection() {
    // Nested functions to make life easier
    function drawDodgerCard(mouseOver, unlocked, dodger, dodgerName, abilityName, requirement, ...colors) {
        // Rectangle
        decideFillStyle(mouseOver, colors[0], colors[1]);
        ctx.fillRect(dodger.x, dodger.y, 200, 100);

        // Circle
        ctx.fillStyle = colors[2];
        drawCircle(dodger.x + 170, dodger.y + 22);

        // Text
        ctx.textAlign = "left";
        ctx.font = "bold 22px 'Lucida Console'";
        ctx.fillText(dodgerName, dodger.x + 10, dodger.y + 30);
        ctx.font = "14px 'Lucida Console'";
        ctx.fillText(`ABILITY: ${abilityName}`, dodger.x + 10, dodger.y + 80);

        // Locked
        if (!unlocked) {
            if (dodgerName !== "CRESCENDO") ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            else ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(dodger.x, dodger.y, 200, 100);
            ctx.lineWidth = 1.25;
            ctx.textAlign = "center";

            ctx.strokeStyle = "rgb(255, 255, 255)";
            ctx.font = "bold 20px Arial";
            ctx.strokeText(requirement, dodger.x + 100, dodger.y + 55);
            
            ctx.strokeStyle = colors[2];
            ctx.font = "bold 19.5px Arial";
            ctx.strokeText(requirement, dodger.x + 100, dodger.y + 55);
        }
    }
    function drawAbilityDesc(mouseOver, unlocked, bgColor, lockedColor, textColor, abilityName, ...description) {
        if (mouseOver) {
            ctx.fillStyle = bgColor;
            ctx.strokeStyle = textColor;
            ctx.fillRect(50, 275, 700, 175);
            ctx.lineWidth = 5;
            ctx.strokeRect(50, 275, 700, 175);

            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.font = "30px Arial";
            ctx.fillText(abilityName, GAME_WIDTH/2, 310);
            
            ctx.textAlign = "left";
            ctx.font = "17.5px Arial";
            for (let i = 0; i < description.length; i++) ctx.fillText(description[i], 70, 335 + i*25);

            if (!unlocked) {
                if (abilityName !== "AMPLIFY") ctx.fillStyle = "rgba(0, 0, 0, 0.825)";
                else ctx.fillStyle = "rgba(0, 0, 0, 0.525)";
                ctx.fillRect(50, 275, 700, 175);
                ctx.lineWidth = 2;
                ctx.textAlign = "center";

                ctx.strokeStyle = "rgb(255, 255, 255)";
                ctx.font = "bold 71px Arial";
                ctx.strokeText("LOCKED", GAME_WIDTH/2, 387);
                
                ctx.strokeStyle = lockedColor;
                ctx.font = "bold 70px Arial";
                ctx.strokeText("LOCKED", GAME_WIDTH/2, 387);
            }
        }
    }
    
    // Dodger coords
    const evader = { x: 50, y: 25, };
    const jolt = { x: 300, y: 25, };
    const jötunn = { x: 550, y: 25, };
    const crescendo = { x: 175, y: 150, };
    const j_sab = { x: 425, y: 150, };

    // Dodger Cards
    drawDodgerCard(mouseOver.evader, true, evader, "EVADER", "SKILL", "NONE", "rgb(230, 230, 230)", "rgb(220, 220, 220)", "white");
    drawDodgerCard(mouseOver.jolt, highscore.medium >= 30, jolt, "JOLT", "SHOCKWAVE", "MEDIUM 30S", "rgb(230, 230, 0)", "rgb(220, 220, 0)", "yellow");
    drawDodgerCard(mouseOver.jötunn, highscore.limbo === 100, jötunn, "JÖTUNN", "ABSOLUTE ZERO", "LIMBO 100%", "rgb(75, 180, 225)", "rgb(68, 168, 212)", "rgb(79, 203, 255)");
    drawDodgerCard(mouseOver.crescendo, highscore.hard >= 60, crescendo, "CRESCENDO", "AMPLIFY", "HARD 60S", "rgb(30, 30, 30)", "rgb(40, 40, 40)", "rgb(0, 0, 0)");
    drawDodgerCard(mouseOver.j_sab, highscore.andromeda === 100, j_sab, "J-SAB", "DASH", "ANDROMEDA 100%", "rgb(230, 0, 0)", "rgb(220, 0, 0)", "rgb(255, 0, 0)");

    // Ability Descriptions
    drawAbilityDesc(mouseOver.evader, true, "rgba(255, 255, 255, 0.7)", "rgba(220, 220, 220, 0.9)", "rgba(200, 200, 200, 0.7)", "SKILL",
                    "Evaders have no unique abilities or traits; they rely solely on familiarity with their",
                    "adversaries to weave past offensive attacks.",
                    "Base Speed: 5");
    drawAbilityDesc(mouseOver.jolt, highscore.medium >= 30, "rgba(255, 255, 0, 0.7)", "rgba(230, 230, 0, 0.9)", "rgba(200, 200, 0, 0.7)", "SHOCKWAVE",
                    "Jolts summon electromagnetic shockwaves at will—shrinking and stunning any",
                    "unfortunate soul stricken by the electrically infused pluse.",
                    "Shockwave Effect Reduction: 25% | Shockray Effect Reduction: 50%",
                    "Effect Duration: Danger - 2.93s, Enemy - 5.43s",
                    "Shockwave Cooldown: 5.5s | Shockray Cooldown: 8.5s");
    drawAbilityDesc(mouseOver.jötunn, highscore.limbo === 100, "rgba(79, 203, 255, 0.7)", "rgba(70, 186, 235, 0.9)", "rgba(52, 157, 201, 0.7)", "ABSOLUTE ZERO",
                    "Jötunns create spasmodic endothermic reactions within their cores, causing their",
                    "surroundings to rapidly freeze to absolute zero. Such gigantic and erratic drops in",
                    "temperature decelerate the speeds and spawn-rates of nearby adversaries.",
                    "Glaciate affects speed. Stagnate affects spawn-rate. Absolute Zero freezes both.",
                    "Speed Reduction: 0% - 70% | Spawn-rate Reduction: 0% - 20% | Swap Cooldown: 1s");
    drawAbilityDesc(mouseOver.crescendo, highscore.hard >= 60, "rgba(20, 20, 20, 0.85)", "rgba(20, 20, 20, 0.9)", "rgba(0, 0, 0, 0.7)", "AMPLIFY",
                    "Crescendos harness the sound waves of their environment to augment their cores.",
                    "Whenever a melody is audible, these dodgers, as if adapting to the rhythm, accelerate",
                    "with the music, continually modifying their cores until they outpace the waves",
                    "themselves.",
                    "Top Speed: 10.5");
    drawAbilityDesc(mouseOver.j_sab, highscore.andromeda === 100, "rgba(255, 0, 0, 0.6)", "rgba(210, 0, 0, 0.9)", "rgba(200, 0, 0, 0.7)", "DASH",
                    "J-sabs manipulate space and bend it to their will. By eradicating the field ahead of",
                    "them, these dodgers instantaneously warp forward through the erased void, allowing",
                    "them to maneuver swiftly, precisely, and covertly at supersonic speeds.",
                    "Top Speed: 17.5 | Dash Duration: 0.25s | Post-Dash Invinciblility Duration: 0.25s",
                    "Dash Cooldown: 2s");
}

function drawGameOver() {
    const grad = ctx.createLinearGradient(250, 50, 550, 150)
    const grad2 = ctx.createLinearGradient(250, 150, 550, 50)

    if (mouseOver.restart) {
        grad.addColorStop(0, "rgb(255, 0, 0)");
        grad.addColorStop(1, "rgb(255, 255, 255)");

        grad2.addColorStop(0, "rgb(255, 255, 255)");
        grad2.addColorStop(1, "rgb(255, 0, 0)");
    } else {
        grad.addColorStop(0, "rgb(255, 255, 255)");
        grad.addColorStop(1, "rgb(255, 0, 0)");

        grad2.addColorStop(0, "rgb(255, 0, 0)");
        grad2.addColorStop(1, "rgb(255, 255, 255)");
    }

    ctx.fillStyle = grad;
    ctx.fillRect(250, 50, 300, 100);

    ctx.strokeStyle = grad2;
    ctx.lineWidth = 3;
    ctx.strokeRect(250, 50, 300, 100);
    ctx.beginPath();
    ctx.moveTo(250, 150);
    ctx.lineTo(550, 50);
    ctx.stroke();
    
    ctx.lineWidth = 1.5;
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';

    let endlessOverColor = 'red'
    let tryAgainColor = 'white'
    if (mouseOver.restart) {
        endlessOverColor = 'white'
        tryAgainColor = 'red'
    }
    else {
        endlessOverColor = 'red'
        tryAgainColor = 'white'
    }
    
    ctx.strokeStyle = endlessOverColor;
    ctx.strokeText('Game Over', 335, 80);

    ctx.strokeStyle = tryAgainColor;
    ctx.strokeText('Try Again', 480, 135);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function drawPlayer() {
    let prevStrokeStyle = ctx.strokeStyle;
    // Draws Absolute Zero's range
    if (player.dodger === "jötunn" && settings.aZ_Range) {
        const azGradient = ctx.createRadialGradient(player.x, player.y, absoluteZero.slowEnd, player.x, player.y, absoluteZero.slowStart);
        if (gameState !== "musicMode") {
            let azColor = [];
            if (absoluteZero.passive === "Absolute Zero") azColor = [0, 127, 255];
            if (absoluteZero.passive === "Glaciation") azColor = [50, 151, 255];
            if (absoluteZero.passive === "Stagnation") azColor = [102, 177, 255];
            
            azGradient.addColorStop(0, `rgba(${azColor[0]}, ${azColor[1]}, ${azColor[2]}, ${absoluteZero.av})`);
            azGradient.addColorStop(1, `rgba(79, 203, 255, ${absoluteZero.av})`);
            ctx.fillStyle = azGradient;
            ctx.strokeStyle = `rgba(${azColor[0]}, ${azColor[1]}, ${azColor[2]}, 0.75)`;
        } else if (timeLeft <= 0 || innerGameState === "musicModeFail") {
            azGradient.addColorStop(1, `rgba(255, 255, 255, ${absoluteZero.av})`);
            ctx.fillStyle = azGradient;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        } else if (gameState === "musicMode") {
            azGradient.addColorStop(0, `rgba(255, 255, 255, ${absoluteZero.av})`);
            if (prevStrokeStyle[0] === "#") {
                azGradient.addColorStop(1, `rgba(${hexToRgb(prevStrokeStyle).r}, ${hexToRgb(prevStrokeStyle).g}, ${hexToRgb(prevStrokeStyle).b}, ${absoluteZero.av})`);
                ctx.strokeStyle = `rgba(${hexToRgb(prevStrokeStyle).r}, ${hexToRgb(prevStrokeStyle).g}, ${hexToRgb(prevStrokeStyle).b}, 0.75)`;
            } else {
                let prevRGB = prevStrokeStyle.slice(5, 17);
                azGradient.addColorStop(1, `rgba(${prevRGB}, ${absoluteZero.av})`);
                ctx.strokeStyle = `rgba(${prevRGB}, 0.75)`;
            }
            ctx.fillStyle = azGradient;
        }
        drawCircle(player.x, player.y, absoluteZero.slowStart, "fill");
        ctx.lineWidth = 2;
        drawCircle(player.x, player.y, absoluteZero.slowStart, "stroke");
    }

    // Draws the player
    ctx.fillStyle = player.color;
    drawCircle(player.x, player.y, player.r);
    ctx.lineWidth = 3;
    ctx.strokeStyle = player.subColor;
    drawCircle(player.x, player.y, player.r, "stroke");
    
    // Draws player lives
    if (gameState === "musicMode") {
        ctx.textAlign = "center";
        ctx.font = "17.5px Impact";
        ctx.fillStyle = player.subColor;
        ctx.fillText(player.lives, player.x, player.y + 5.4);
    }

    // Determines player invincibility and draws the shield
    if (now-player.hit < 1500 || dash.activated || now-dash.lastEnded < 250) {
        player.invincible = true;
        
        ctx.lineWidth = 1.75;
        ctx.strokeStyle = player.subColor;
    
        ctx.beginPath();
        ctx.moveTo(player.x-7.5, player.y+2.5);
        ctx.lineTo(player.x-7.5, player.y-8);
    
        ctx.quadraticCurveTo(player.x-3.75, player.y-6, player.x, player.y-9.5);
        ctx.quadraticCurveTo(player.x+3.75, player.y-6, player.x+7.5, player.y-8);
    
        ctx.lineTo(player.x+7.5, player.y+3);
        ctx.lineTo(player.x, player.y+10);
        ctx.lineTo(player.x-7.5, player.y+3);
        ctx.stroke();
    }
    else player.invincible = false;
}

function drawEnemies() {
    allEnemies.forEach(enemy => {
        if (enemy.ability == "decelerator") {
            ctx.fillStyle = "rgba(177, 88, 88, 0.47)";
            drawCircle(enemy.x, enemy.y, enemy.auraRadius);
        }

        ctx.fillStyle = enemy.color;
        drawCircle(enemy.x, enemy.y, enemy.r);

        // shows jolt's effect
        if (gameState !== "endlessOver") enemy.swcv = Math.min(1, (now-enemy.reset)/5000); // clamped between 0 and 1;
        let swav = 0.8 - enemy.swcv*0.8;
        ctx.fillStyle = `rgba(150, 150, 0, ${swav})`;
        drawCircle(enemy.x, enemy.y, enemy.r);

        // show jötunn's effect
        const enemyDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        const clampDist = Math.min(Math.max(absoluteZero.slowEnd, enemyDist), absoluteZero.slowStart);
        enemy.azcv = (clampDist - absoluteZero.slowEnd) / (absoluteZero.slowStart - absoluteZero.slowEnd);
        let azav = 0.7 - enemy.azcv*0.7;
        if (player.dodger === "jötunn" && absoluteZero.passive !== "Stagnation") {
            ctx.fillStyle = `rgba(17, 47, 56, ${azav})`;
            drawCircle(enemy.x, enemy.y, enemy.r);
        }

        if (settings.enemyOutlines) {
            let cv;
            if (player.dodger === "jolt") {
                cv = 255 - enemy.swcv*255; // jolts effect on enemy outlines
                ctx.strokeStyle = `rgb(${cv}, ${cv}, 0)`;
            } else if (player.dodger === "jötunn" && absoluteZero.passive !== "Stagnation") {
                cv = 100 - enemy.azcv*100;  // jötunns effect on enemy outlines
                ctx.strokeStyle = `rgb(0, 0, ${cv})`;
            } else ctx.strokeStyle = `rgb(0, 0, 0)`;

            ctx.lineWidth = enemy.r/12.5;
            drawCircle(enemy.x, enemy.y, enemy.r, "stroke");
        }
    })
}

function drawText() { // draws the current time, highest time, and enemy count
    // Current time in seconds
    if (gameState !== "endlessOver") currentTime = ((now-startTime) / 1000).toFixed(2);
    timeLeft = (music.var.duration - music.var.currentTime).toFixed(2);
    if (gameState === "endlessMode" || gameState === "endlessOver" || gameState === "musicMode") {
        // Difficulty Highscore
        if (Number(currentTime) > Number(highscore?.[difficulty.level]) && gameState !== "musicMode") {
            highscore[difficulty.level] = currentTime;
            highscoreColor = difficulty.color
        }

        // Level Percentage
        let percentage = Math.floor(music.var.currentTime / music.var.duration * 100);
        if (gameState === "musicMode") {
            if (music.name === "Alarm 9") highscore.limbo = Math.max(highscore.limbo, percentage);
            if (music.name === "Astral Projection") highscore.andromeda = Math.max(highscore.andromeda, percentage);
            if (music.name === "Divine") highscore.euphoria = Math.max(highscore.euphoria, percentage);
        }
        
        // Saves data every 1.5 seconds incase the user disconnects/crashes
        userData.highscore = highscore;
        if (now - lastSave > 1500) {
            localStorage.setItem('localUserData', JSON.stringify(userData));
            lastSave = Date.now();
        }
    }
    if (gameState === "endlessMode" || gameState === "endlessOver") {
        // Draws the times and the enemy count
        ctx.font = "20px Verdana";
        ctx.textAlign = 'center';
        ctx.fillStyle = "rgb(87, 87, 87)";
        ctx.fillText(`Time Elapsed: ${currentTime}s`, 200, 40);
        ctx.fillText(`Enemy Count: ${allEnemies.length}`, 600, 620);

        if (highscoreColor === difficulty.color) ctx.font = "bold 20px 'Verdana'";
        ctx.fillStyle = highscoreColor;
        // Displays the highest score and the current difficulty (capitalized)
        ctx.fillText(`Highest Time (${difficulty.level.charAt(0).toUpperCase() + difficulty.level.slice(1)}): ${highscore[difficulty.level]}s`, 600, 40);
    }
    if (gameState === "musicMode") {
        // Draws the time left
        ctx.font = "30px Verdana";
        ctx.textAlign = 'center';

        let timeLeftColor;
        
        if (timeLeft > 4 || timeLeft == 0) timeLeftColor = music.textColor;
        else if (timeLeft >= 3) timeLeftColor = "rgb(235, 235, 30)";
        else if (timeLeft >= 2) timeLeftColor = "rgb(235, 102.5, 30)";
        else if (timeLeft > 0) timeLeftColor = "rgb(235, 0, 0)";
        
        ctx.fillStyle = timeLeftColor;
        ctx.fillText(`${timeLeft}s`, GAME_WIDTH/2, 40);
        
        ctx.fillStyle = music.textColor; // credit fillStyle
    }
    else ctx.fillStyle = "rgb(150, 150, 150)";
    // Credits artist in the bottom left corner
    ctx.font = "12.5px Verdana";
    ctx.textAlign = "left";
    ctx.fillText(`Song - ${music.name} by ${music.artist}`, 10, GAME_HEIGHT - 10);
    
    // Abilites
    ctx.font = "20px Verdana";
    ctx.textAlign = 'center';
    ctx.fillStyle = player.subColor;

    // The text should be centered unless the gameState is endlessMode or endlessOver
    textX = 200;
    if (gameState === "endlessMode" || gameState === "endlessOver") {
        if (player.dodger === "jolt") textX = 220;
        else textX = 200;
    }
    else textX = GAME_WIDTH/2

    let controls;
    if (lastPressing === "mouse") controls = ["RMB", "MMB"];
    else if (lastPressing === "kb") controls = ["Q/J", "E/K"];

    // No Abiliy
    if (player.dodger === "evader") ctx.fillText(`Passive: Skill`, textX, 620);

    // Dash
    else if (player.dodger === "j-sab") {
        // Dash CD
        let dashCDLeft = ((1100 - (now - dash.lastEnded)) / 1000).toFixed(2);

        if (now - dash.lastEnded >= 1100) { // 1.1s
            dash.usable = true;
            ctx.fillText(`Active: Dash (${controls[0]})`, textX, 620);
        } else {
            dash.usable = false;
            ctx.fillText(`Active: Dash (${dashCDLeft}s)`, textX, 620);
        }
    }

    // Absolute Zero
    else if (player.dodger === "jötunn") {
        // Absolute Zero CD
        let absoluteZeroCDLeft = ((1000 - (now - absoluteZero.lastEnded)) / 1000).toFixed(3);

        if (now - absoluteZero.lastEnded >= 1000) { // 1s
            absoluteZero.usable = true;
            ctx.fillText(`Passive: ${absoluteZero.passive} | Swap (${controls[1]})`, textX, 620);
        } else {
            absoluteZero.usable = false;
            ctx.fillText(`Passive: ${absoluteZero.passive} | Swap (${absoluteZeroCDLeft})`, textX, 620);
        }
    }

    // Shockwave
    else if (player.dodger === "jolt") {
        // Shockwave CD
        let shockwaveCDLeft = ((shockwave.cd - (now - shockwave.lastEnded)) / 1000).toFixed(2);

        if (now - shockwave.lastEnded < shockwave.cd && !shockwave.activated) { // 5.5s or 8.5s
            shockwave.usable = false;
            ctx.fillText(`Active: ${shockwave.active} (${shockwaveCDLeft}s) | Swap (${controls[1]})`, textX, 620);
        } else {
            shockwave.usable = true;
            ctx.fillText(`Active: ${shockwave.active} (${controls[0]}) | Swap (${controls[1]})`, textX, 620);
        }
    }

    // Amplify
    else if (player.dodger === "crescendo") ctx.fillText(`Passive: Amplify ${player.baseSpeed.toFixed(1)}`, textX, 620);
}

function createEnemy() { // Creates an individual enemy with unique attributes
    let enemy = {
        x: (Math.random() * (GAME_WIDTH-60))+30,  // between 30 and 770
        y: (Math.random() * (GAME_HEIGHT-60))+30,  // between 30 and 520
        r: (Math.random() * 7.5) + 10,  // between 10 and 17.5
        color: "rgb(100, 100, 100)",
        vulnerable: "None",
        reset: 0, // for jolts
    }
    enemy.swcv = Math.min(1, (now-enemy.reset)/5000); // also for jolts
    enemy.azcv = 1; // for jötunns
    enemy.baseRadius = enemy.r;
    
    // Initializes the enemy's ability and other important values based on their ability
    enemyAbilitiesAndStats(enemy);
    
    if (difficulty.level === "easy") enemy.speed = (Math.random() * 2) + 2; // between 2 and 4
    if (difficulty.level === "medium") enemy.speed = (Math.random() * 2) + 2.5; // between 2.5 and 4.5
    if (difficulty.level === "hard") {
        if (enemy.ability === "homing") enemy.speed = (Math.random() * 1.55) + 2.75; // between 2.75 and 4.3 (homings should be slower than the player)
        else enemy.speed = (Math.random() * 2) + 3; // between 3 and 5 (as fast as the player)
    }
    enemy.baseSpeed = enemy.speed;

    let dx = player.x - enemy.x;
    let dy = player.y - enemy.y;
    let distFromPlayer = Math.hypot(dx, dy);

    // used to prevent the enemy from spawning too close to the player
    while(distFromPlayer < 300) {
        enemy.x = (Math.random() * (GAME_WIDTH-60))+30;
        enemy.y = (Math.random() * (GAME_HEIGHT-60))+30;

        dx = player.x - enemy.x;
        dy = player.y - enemy.y;
        distFromPlayer = Math.hypot(dx, dy);
    }
    // Initialization for the angle the enemy moves towards (avoids the weird snapping-towards-the-player effect)
    enemy.facingAngle = Math.atan2(dy, dx); // angle toward the player
    
    // used to make the enemy move toward the player once it spanws
    enemy.movex = Math.cos(enemy.facingAngle) * enemy.speed;
    enemy.movey = Math.sin(enemy.facingAngle) * enemy.speed;

    // Using base values to extend the possibility of what can be done to the enemies speed
    enemy.baseMoveX = enemy.movex;
    enemy.baseMoveY = enemy.movey;

    if (player.dodger === "jolt") {
        Object.defineProperty(enemy, "collisionPoints", {
            get() {
                const piOver3X = this.r*Math.cos(Math.PI/3);
                const piOver3Y = this.r*Math.sin(Math.PI/3);
                const piOver6X = this.r*Math.cos(Math.PI/6);
                const piOver6Y = this.r*Math.sin(Math.PI/6);
                return [[this.x+this.r, this.y], [this.x+piOver6X, this.y+piOver6Y], [this.x+piOver3X, this.y+piOver3Y],
                        [this.x, this.y+this.r], [this.x-piOver3X, this.y+piOver3Y], [this.x-piOver6X, this.y+piOver6Y],
                        [this.x-this.r, this.y], [this.x-piOver6X, this.y-piOver6Y], [this.x-piOver3X, this.y-piOver3Y],
                        [this.x, this.y-this.r], [this.x+piOver3X, this.y-piOver3Y], [this.x+piOver6X, this.y-piOver6Y]];
            }
        })
    }
    
    return enemy;
}

function spawnEnemyPeriodically() {
    if (allEnemies.length < 100 && now - lastSpawn >= enemySpawnPeriod) {
        allEnemies.push(createEnemy());  

        // filter and re-order the array just like in the restartEndless() function (prevents inconsistent overlapping)
        allEnemies = [...allEnemies.filter(enemy => enemy.ability === "decelerator"), ...allEnemies.filter(enemy => enemy.ability !== "decelerator")]
        
        lastSpawn = Date.now();

        // Enemy spawn period is 3000ms by default. This decreases it by 200ms for every 10 enemies spawned to increase difficulty
        if (allEnemies.length % 10 == 0) enemySpawnPeriod -= 200;
    }
}


// PLAYER AND ENEMY MOVEMENT
function keyboardControls() {
    // Moves the player with the keyboard
    if (keyboardMovementOn && player?.x !== undefined && player?.y !== undefined) {
        lastPressing = "kb";

        let dxKB = 0;
        let dyKB = 0;
    
        if (wPressed) dyKB -= 1;
        if (sPressed) dyKB += 1;
        if (aPressed) dxKB -= 1;
        if (dPressed) dxKB += 1;
    
        // Normalize diagonal movement
        if (dxKB !== 0 && dyKB !== 0) {
            const scale = Math.SQRT1_2; // 1 / √2 ≈ 0.7071
            dxKB *= scale;
            dyKB *= scale;
        }
        
        if (!dash.activated) player.speed = player.baseSpeed * shiftPressed * player.slowed;
        if (dxKB !== 0 || dyKB !== 0) player.facingAngle = Math.atan2(dyKB, dxKB);
        
        player.x += dxKB * player.speed;
        player.y += dyKB * player.speed;

        // Anti-no-clip (wall collisions)
        player.x = Math.min(Math.max(player.x, player.r), GAME_WIDTH-player.r);
        player.y = Math.min(Math.max(player.y, player.r), GAME_HEIGHT-player.r);
    }
}

function mouseMovement() {
    // Moves the player towards the cursor
    if (mouseMovementOn && !keyboardMovementOn && player?.x !== undefined && player?.y !== undefined) {
        lastPressing = "mouse";
        
        const dxMouse = mouseX - player.x;
        const dyMouse = mouseY - player.y;
        const mouseDist = Math.hypot(dxMouse, dyMouse);
        
        if (!dash.activated) player.speed = player.baseSpeed * shiftPressed * player.slowed;
        player.facingAngle = Math.atan2(dyMouse, dxMouse);

        const slowStart = player.r + 40;
        const clampDist = Math.min(slowStart, mouseDist);
        const factor = clampDist / slowStart;
        const slowFactor = 0.3 + 0.7 * factor;

        // Prevents player moving into itself when the mouse is directly overtop it

        if (mouseDist > player.speed/6) {
            player.x += Math.cos(player.facingAngle) * player.speed * slowFactor;
            player.y += Math.sin(player.facingAngle) * player.speed * slowFactor;
        }
        

        // Anti-no-clip (wall collisions)
        player.x = Math.min(Math.max(player.x, player.r+1.5), GAME_WIDTH-player.r-1.5); // players lineWidth included
        player.y = Math.min(Math.max(player.y, player.r+1.5), GAME_HEIGHT-player.r-1.5);
    }
}

function moveEnemies() { // Loops through the allEnemies array to move each enemy with their movex and movey
    allEnemies.forEach(enemy => {
        const dxEnemy = player.x - enemy.x;
        const dyEnemy = player.y - enemy.y;
        const enemyDist = Math.hypot(dxEnemy, dyEnemy);
        let homingIn = false;
        
        // Homing enemies move toward the player (if the player is close enough)
        if (enemy.ability === "homing" && enemyDist < enemy.detectionRadius)  {
            const angleToPlayer = Math.atan2(dyEnemy, dxEnemy); // Target angle

            // Calculate shortest angular difference
            let angleDiff = angleToPlayer - enemy.facingAngle;

            // Normalize to [-PI, PI] for shortest rotation direction
            angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

            const turnSpeed = 0.01; // radians per frame
            enemy.facingAngle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnSpeed);

            // Move forward in direction of facingAngle — speed stays constant
            enemy.baseMoveX = Math.cos(enemy.facingAngle) * enemy.speed;
            enemy.baseMoveY = Math.sin(enemy.facingAngle) * enemy.speed;

            // Set homingIn to true so they bounce off the walls correctly
            homingIn = true;
        } else {
            enemy.baseMoveX = Math.cos(enemy.facingAngle) * enemy.speed;
            enemy.baseMoveY = Math.sin(enemy.facingAngle) * enemy.speed;
        }
        
        enemy.movex = enemy.baseMoveX;
        enemy.movey = enemy.baseMoveY;
        enemy.x += enemy.movex;
        enemy.y += enemy.movey;
        
        // Anti-no-clip (wall collisions)
        enemy.x = Math.min(Math.max(enemy.x, enemy.r), GAME_WIDTH-enemy.r);
        enemy.y = Math.min(Math.max(enemy.y, enemy.r), GAME_HEIGHT-enemy.r);
        if (enemy.x === enemy.r || enemy.x === GAME_WIDTH-enemy.r) enemy.facingAngle = Math.PI - enemy.facingAngle;
        if (enemy.y === enemy.r || enemy.y === GAME_HEIGHT-enemy.r) enemy.facingAngle = -enemy.facingAngle;
        
        // Normalize the angle with the ever reliable Math.atan2()
        enemy.facingAngle = Math.atan2(Math.sin(enemy.facingAngle), Math.cos(enemy.facingAngle));
    })
}


// GAMESTATE CHANGES
function restartEndless() { // Resets certain variables once the play button is pressed
    allEnemies = []
    // The starting amount of enemies is different based on the difficulty
    startAmount = 10;
    if (difficulty.level === "medium") startAmount = 15;
    if (difficulty.level === "hard") startAmount = 20;
    for(let i = 1; i < startAmount; i++) allEnemies.push(createEnemy());
    
    // Re-order the allEnemies array to draw the enemies with the auras (decelerator enemies) first
    // this prevents inconsistent overlapping when they're drawn
    allEnemies = [...allEnemies.filter(enemy => enemy.ability === "decelerator"), ...allEnemies.filter(enemy => enemy.ability !== "decelerator")];

    music.var.currentTime = 0;
    music.promise = music.var.play();
    
    startTime = Date.now();
    currentTime = 0;
    enemySpawnPeriod = 3000;
    lastSpawn = 0;
    
    dash.lastEnded = 0;
    shockwave.reset();
    amplify.reset();
    
    innerGameState = "inEndless";
    gameState = "endlessMode"
}

function collisions() { // Keeps track of when the player touches any enemy in the allEnemies array
    let underAura = 0;
    allEnemies.forEach(enemy => {
        const enemyDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (!player.invincible) {
            if (enemyDist < player.r + enemy.r) {
                pauseAudio(music.promise, music.var);
                gameState = "endlessOver";
                // Saves data once the user dies
                userData.highscore = highscore;
                localStorage.setItem('localUserData', JSON.stringify(userData));
            }
        }
        if (gameState === "endlessOver") underAura = 0;
        else if (enemy.ability === "decelerator" && enemyDist < player.r + enemy.auraRadius) underAura++;
    });
    
    player.slowed = Math.max(1 - (underAura/10), 0.7);
}

// ABILITIES
function abilities() { // player-specific abilities
    // Dash gives the player a powerful but short-lived burst of speed
    if (dash.activated) {
        player.color = "rgb(255, 100, 100)";
        player.subColor = "rgb(230, 100, 100)";
        player.speed += dash.accel;
        if (player.speed > 17.5) {
            dash.deccelerating = true;
            dash.accel *= -1;
            player.speed += dash.accel;
        }
        if (player.speed <= player.baseSpeed && dash.deccelerating) {
            player.speed = player.baseSpeed;
            player.color = "rgb(255, 0, 0)";
            player.subColor = "rgb(230, 0, 0)";
            dash.activated = false;
            dash.deccelerating = false;
            dash.accel *= -1;
            dash.lastEnded = Date.now();
        }
    }
    // Absolute Zero's effect changes enemy speed based on distance
    if (player.dodger === "jötunn" && absoluteZero.passive !== "Stagnation") {
        allEnemies.forEach(enemy => {
            const enemyDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
            // Calculates the distance from the edge of the enemy to the edge of the player, so I subtract the radii
            const realDist = enemyDist - enemy.r - player.r;
            // Limit the distance in order to get a factor between 0 and 1
            const clampDist = Math.min(Math.max(realDist, absoluteZero.slowEnd), absoluteZero.slowStart);
            const factor = (clampDist - absoluteZero.slowEnd) / (absoluteZero.slowStart - absoluteZero.slowEnd);
            const slowFactor = 0.3 + 0.7 * factor;
    
            enemy.speed = enemy.baseSpeed * slowFactor;
            enemy.speed = enemy.baseSpeed * slowFactor;
        })
    }
    // Shockwave launches an electromagnetic pulse that stuns and shrinks adversaries
    if (shockwave.activated) {
        // create the shockwaves path
        shockwave.path = new Path2D();
        if (shockwave.used === "Shockwave") shockwave.path.arc(0, 0, shockwave.radius, Math.PI*2, 0);
        else if (shockwave.used === "Shockray") {
            shockwave.path.moveTo(0, -shockwave.radius);
            shockwave.path.bezierCurveTo(shockwave.radius, -2, shockwave.radius, 2, 0, shockwave.radius);
            shockwave.path.bezierCurveTo(shockwave.radius/2, 2, shockwave.radius/2, -2, 0, -shockwave.radius);
        }

        // save and transform the canvas
        ctx.save();
        ctx.translate(shockwave.x, shockwave.y);
        ctx.rotate(shockwave.facingAngle);

        // draw the shockwave
        if (shockwave.used === "Shockwave") ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        else if (shockwave.used === "Shockray") ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
        ctx.fill(shockwave.path);

        // checks for collisions
        allEnemies.forEach(enemy => { 
            enemy.collisionPoints.forEach(point => {
                if (ctx.isPointInPath(shockwave.path, point[0], point[1])
                    && (enemy.vulnerable === shockwave.used || enemy.vulnerable === "None")) {
                    enemy.reset = Date.now(); // starts the time which an enemy got hit
                    enemy.vulnerable = shockwave.used;
                }
            })
        })

        ctx.restore();

        // pauses beam if the player dies
        if (gameState !== "endlessOver") {
            shockwave.radius *= 1.022;
            if (shockwave.used === "Shockray") { shockwave.x += shockwave.movex; shockwave.y += shockwave.movey; }
        }
        
        // once the radius is big enough, end the entire ability
        if ((shockwave.radius > 1250 && shockwave.used === "Shockwave") || (shockwave.radius > 250 && shockwave.used === "Shockray")) {
            shockwave.activated = false;
            shockwave.radius = 25;
            shockwave.lastEnded = Date.now();
        }
    }
    if (player.dodger === "jolt" && gameState !== "endlessOver") {
        allEnemies.forEach(enemy => {
            // Restore the stats of enemies after 5 seconds have passed
            if (now - enemy.reset >= 5000) {
                if (enemy.r < enemy.baseRadius-0.0001) enemy.r += enemy.baseRadius/100;
                else { enemy.r = enemy.baseRadius; enemy.vulnerable = "None"; }
                if (enemy.speed < enemy.baseSpeed-0.0001) enemy.speed += enemy.baseSpeed/100;
                else enemy.speed = enemy.baseSpeed;
                if (enemy.ability === "decelerator") {
                    if (enemy.auraRadius < enemy.baseAuraRadius-0.0001) enemy.auraRadius += enemy.baseAuraRadius/100;
                    else enemy.auraRadius = enemy.baseAuraRadius;
                }
            }
            // Decrease the stats of enemies under the effect of shockwave
            else {
                enemy.r = enemy.baseRadius*shockwave.effect;
                enemy.speed = enemy.baseSpeed*shockwave.effect;
                if (enemy.ability === "decelerator") enemy.auraRadius = enemy.baseAuraRadius*shockwave.effect;
            }
        })
    }
    // Amplify accelerates the player over time
    if (player.dodger === "crescendo") {
        amplify.accel = 1/music.var.duration * 7;
        if (musicVolume > 0 && gameState !== "endlessOver") { // only accelerate if the music is audible and we're not in the game over screen
            if (gameState === "musicMode") { // reach your peak speed 78.57%~ into a song
                amplify.speed = music.var.currentTime/music.var.duration * 7;
                player.baseSpeed = Math.min(amplify.limit, amplify.baseSpeed + amplify.speed); // limit is 10.5
            } else {
                if (now - amplify.accelRate > 1000) {
                    amplify.speed += amplify.accel;
                    amplify.accelRate = Date.now();
                }
                player.baseSpeed = Math.min(amplify.limit, amplify.baseSpeed + amplify.speed);
            }
        }
        if (musicVolume <= 0) {
                if (now - amplify.accelRate > 1000) {
                    amplify.speed -= amplify.accel;
                    amplify.speed = Math.max(0, amplify.speed);
                    amplify.accelRate = Date.now();
                }
                player.baseSpeed = amplify.baseSpeed + amplify.speed;
        }
    }
}
           

function enemyAbilitiesAndStats(enemy) {
    num = Math.random();

    // All enemies on easy difficulty have no abilities
    if (difficulty.level === "easy")  enemy.ability = "none";

    else if (difficulty.level === "medium") {
        // 25% Chance to get the decelerator ability
        if (num > 0.75) enemy.ability = "decelerator";
        else enemy.ability = "none";
    }
        
    else if (difficulty.level === "hard") {
        // 25% Chance to get the decelerator ability, 15% for the homing ability
        if (num > 0.85) enemy.ability = "homing";
        else if (num > 0.6) enemy.ability = "decelerator";
        else enemy.ability = "none";
    }

    
    if (enemy.ability === "none") enemy.baseColor = "rgb(100, 100, 100)";

    // decelerators need an aura radius for their ability (and are red)
    else if (enemy.ability === "decelerator") {
        enemy.baseColor = "rgb(255, 0, 0)";
        enemy.auraRadius = (Math.random() * 20) + 80;
        enemy.baseAuraRadius = enemy.auraRadius;
    }

    // homings need a detection radius for their ability (and are gold)
    else if (enemy.ability === "homing") {
        enemy.baseColor = "rgb(255, 196, 0)";
        enemy.detectionRadius = 200;
    }
    enemy.color = enemy.baseColor;
}
