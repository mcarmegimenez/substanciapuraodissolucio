this.sm = this.sm || {};

(function () {
    var seriesEngine = function (htmlCanvasId, cfg, animationEnd, unique) {
        this.initialize(htmlCanvasId, cfg, animationEnd, unique);
    };
    var p = seriesEngine.prototype = new sm.BaseEngine();
    p.singleton = null;
    p.BaseEngine_initialize = p.initialize;

    p.initialize = function (htmlCanvasId, cfg, animationEnd, unique) {
        this.BaseEngine_initialize(htmlCanvasId, cfg, animationEnd, unique);
        this.cfg = cfg;
        this.objetos = [];
        this.objetosEscena = [];
        this.hotAreas = [];
        this.aciertos = 0;
        this.hits = 0;
        this.variables = [];
        this.keyboard = null;
        this.editText = "";
        this.lastValue = "";
    };

    p.onEndActivityClic = function (button) {
        var engine = this.parent;
        if(engine != null && engine.buttonEndActivity.enabled)
        {
            for (var i = 0; i < engine.hotAreas.length; i++) {
                if (engine.hotAreas[i].hotDef.hitable) {
                    if (engine.hotAreas[i].dummyText.visible && engine.hotAreas[i].dummyText.text == engine.hotAreas[i].solutionText) {
                        engine.hotAreas[i].enabled = false;
                    } else {
                        engine.hotAreas[i].dummyText.color = "#FF0000";
                    }
                }
            }

            if (engine.keyboard != null) {
                engine.keyboard.visible = false;
            }
            
            engine.buttonEndActivity.setEnabled(false);
            if (engine.checkEndActivity()) {
                engine.notifyTotalSuccess();
            }
        }
    };
    
    p.BaseEngine_setupObjects = p.setupObjects;
        p.setupObjects = function () {      
        this.stage = this.getStage();
         
        if (this.animationEnd != null && this.animationEnd != undefined) {
            this.animationEnd.width = this.originalWidth;
            this.animationEnd.height = this.originalHeight;            
            this.addChild(this.animationEnd);
        }
        
        //Creacion de elementos acordes al Estilo SM
        this.aciertos = 0;
        this.hits = 0;
        this.editText = "";
        this.lastValue = "";

        // BACKGROUND
        if (this.cfg.backgroundImage) {
            this.bkgImage = new createjs.Bitmap(ImageManager.getImage(this.cfg.backgroundImage.id));
            this.bkgImage.name = this.cfg.backgroundImage.id;
            this.bkgImage.x = this.cfg.backgroundImage.x;
            this.bkgImage.y = this.cfg.backgroundImage.y;
            this.bkgImage.z = -1;
            this.addChild(this.bkgImage);
        }    
        
        if (this.cfg.imageObjects){
            this.generateObjects(this.cfg.imageObjects);
        }

        this.hotAreas.length = 0;

        if (this.cfg.hotAreas){
            this.generateHotAreas(this.cfg.hotAreas);
        }
        if (this.cfg.keyboard){
            this.generateKeyboard(this.cfg.keyboard);
        }

        this.buttonEndActivity = new sm.Button(10, 10, 0, 0, null); // Esto es para que siempre esté creado.

        if (this.educamosBarNav != null) {
            this.repeatButton = this.educamosBarNav.getButton("Repeat");
            this.repeatButton.on("mousedown", function() { this.onRepeatActivity.call(this.educamosBarNav); }, this);

            this.buttonEndActivity = this.educamosBarNav.getButton("Corregir");         

            if(this.cfg.SeriesEngine.gameType == "escribir"){
                this.buttonEndActivity.setEnabled(false);
                if(this.cfg.autoEvaluate)
                {
                    this.buttonEndActivity.on("mousedown", function() { this.validateValue.call(this.educamosBarNav); }, this);
                }
                else{
                    this.buttonEndActivity.on("mousedown", function() { this.validateValue.call(this.educamosBarNav); }, this);
                }
            }else{            
                this.buttonEndActivity.visible = false;
                }
        }
        
        //Si la actividad no es autocorregible se añade botón de corrección
        if (this.cfg.autoEvaluate == false || this.cfg.SeriesEngine.gameType == "reescalar") {
            if (this.educamosBarNav != null) {
                this.buttonEndActivity.engine = this;
                if(this.cfg.SeriesEngine.gameType == "reescalar"){
                    this.buttonEndActivity.on("mousedown", function() { this.onEndActivityClic.call(this.educamosBarNav); }, this);
                    this.buttonEndActivity.visible = true;
                }
            } else {
                this.buttonEndActivity = new sm.Button(this.cfg.buttonEnd.width, styles.button.buttonHeight, this.cfg.buttonEnd.x, this.cfg.buttonEnd.y, this.onEndActivityClic);
                this.buttonEndActivity.engine = this;
                if (this.cfg.buttonEnd.textId == undefined || this.cfg.buttonEnd.textId == null) {
                    this.buttonEndActivity.setText("Corregir");
                } else {
                    this.buttonEndActivity.setText(this.cfg.buttonEnd.textId);
                }
                this.addChild(this.buttonEndActivity);
            }
        }

        //Pastilla (HEADER)
        this.headerTool = new sm.HeaderTool(this.originalWidth);
        this.headerTool.setTituloEnunciado(this.cfg.enunciado);
        this.addChild(this.headerTool);
        //FOOTER
        this.footerTool = new sm.FooterTool(this.originalWidth, 0, this.originalHeight - styles.footerSM.height);
        this.addChild(this.footerTool);

        this.enableObjects();
        
        this.BaseEngine_setupObjects();
    };

    p.notifyPartialSuccess = function () {
        if (SoundManager != undefined && SoundManager != null) SoundManager.play(this.cfg.audioOK);
    };

    p.checkEndActivity = function() {
        var result = true;
        
        for (var i= 0; i<this.hotAreas.length; i++) {
            if (this.hotAreas[i].enabled && this.hotAreas[i].hotDef.hitable)
                return false;
        }

        return result;
    };
    
    p.notifyTotalSuccess = function () {
        this.enabled = false;
        this.disableObjects();
        this.buttonEndActivity.setEnabled(false);
        this.repeatButton.setEnabled(false);
        if (SoundManager != undefined && SoundManager != null && this.cfg.audioFinal != undefined && this.cfg.audioFinal != null) {
            SoundManager.play(this.cfg.audioFinal, undefined, createjs.proxy(this.onEndActivity, this), undefined);
        } else {
            this.onEndActivity();
        }
    };
   
    p.BaseEngine_onFinishAnimation = p.onFinishAnimation;
    p.onFinishAnimation = function() {
        if (this.infoVolverAJugar != null) this.infoVolverAJugar.visible = true;
    };

    p.BaseEngine_onRepeatActivity = p.onRepeatActivity;
    p.onRepeatActivity = function() {     
        var engine = this.parent;
        if (engine != null && engine.repeatButton.enabled) {
            if (engine.animationEnd != null) {
                engine.animationEnd.stop();
                engine.removeChild(engine.animationEnd);
            }

            if (SoundManager != undefined && SoundManager != null) SoundManager.stop();
            engine.removeChild(engine.getRepeatButton());
            engine.reset();
        }
    };
    
    p.disableObjects = function() {
        if (this.buttonEndActivity != undefined)
            this.buttonEndActivity.setEnabled(false);

        this.enabled = false;

    };
    
    p.enableObjects = function() {      
        if (this.buttonEndActivity != undefined)
            this.buttonEndActivity.setEnabled(true);

        this.enabled = true;

    };
    
    p.notifyError = function () {
        if (SoundManager != undefined && SoundManager != null) SoundManager.play(this.cfg.audioKO);
    };

    p.generateObjects = function(objectDefArray) {
        if (objectDefArray) {
            for (var o = 0; o < objectDefArray.length; o++) {
                var objDef = objectDefArray[o];
                var obj = new sm.ResizeableBitmap(ImageManager.getImage(objDef.id), this.cfg.resizePointSize);
                obj.z = objDef.z ? objDef.z : 0;
                obj.objDef = objDef;
                obj.locked = false;
                obj.hotAreas = objDef.hotAreas;
                if (objDef.hotAreas != undefined) {
                    for (var indexHotAreaDef = 0; indexHotAreaDef < objDef.hotAreas.length; indexHotAreaDef++) {
                        var hotAreaDef = objDef.hotAreas[indexHotAreaDef];
                        if (hotAreaDef.dropZones != undefined) {
                            for (var indexDropZoneDef = 0; indexDropZoneDef < hotAreaDef.dropZones.length; indexDropZoneDef++) {
                                var dropZoneDef = hotAreaDef.dropZones[indexDropZoneDef];
                                dropZoneDef.dropped = false;
                            }
                        }
                    }
                }

                obj.stage = this.stage;
                obj.clonable = false;
                obj.clonable = objDef.clonable;
                obj.editable = objDef.editable && !objDef.clonable;
                obj.canRemove = objDef.editable && objDef.clonable;
                obj.transformInTool = objDef.transformInTool;

                if (objDef.transformInTool == true) {
                    obj.editable = objDef.editable != undefined ? objDef.editable : false;
                    obj.canResize = objDef.canResize != undefined ? objDef.canResize : true;
                    obj.canRotate = objDef.canRotate != undefined ? objDef.canRotate : true;
                    obj.canRemove = objDef.canRemove != undefined ? objDef.canRemove : true;
                    obj.canMove = objDef.canMove != undefined ? objDef.canMove : true;
                    if (obj.canRotate) {

                    }
                }

                if (objDef.rotationIncrement != undefined) {
                    obj.rotationIncrement = objDef.rotationIncrement;
                }

                //obj.excludeObjects = [this.toolZone];
                obj.excludeObjects = [];
                if (objDef.clickable != undefined) {
                    obj.clickable = objDef.clickable;
                    if (obj.clickable) {
                        if (objDef.clickSound) {
//                            obj.fx = new buzz.sound(objDef.clickSound, { formats: ["ogg", "mp3"], preload: true, autoload: true, loop: false });
//                                    if (SoundManager != undefined && SoundManager != null) SoundManager.play(this.cfg.audioKO);
//                            obj.fx.setVolume(100);
                        }
                        obj.onClickObject = this.onClickObject;
                    }
                } else {
                    obj.clickable = false;
                }
                if (objDef.draggable != undefined) {
                    obj.draggable = objDef.draggable;
                } else {
                    obj.draggable = true;
                    obj.onDragDrop = this.onDragDropObject;
                }
                if (objDef.visible != undefined) {
                    obj.visible = objDef.visible;
                } else {
                    obj.visible = true;
                }
                if (objDef.name != undefined) {
                    obj.name = objDef.name;
                } else {
                    obj.name = "objeto_noname";
                }
                obj.onClone = this.onCloneObject;
                obj.onActivate = this.onActivateObject;
                if (objDef.initScale) {
                    obj.initScale = objDef.initScale;
                    obj.scaleX = objDef.initScale;
                    obj.scaleY = objDef.initScale;
                }
                if (objDef.dropScale) {
                    obj.dropScale = objDef.dropScale;
                }

                if (objDef.dragScale) {
                    obj.dragScale = objDef.dragScale;
                }

                obj.x = objDef.x;
                //* - this.weight + obj.regX;
                obj.y = objDef.y;
                //- this.weight + obj.regY;
                this.addChild(obj);
                this.objetos.push(obj);
            }
        }
    };

    p.generateKeyboard = function(keyboardDef) {
        if (keyboardDef) { 
            if (keyboardDef.type == "Classic") {
                this.keyboard = new sm.KeyboardClassic(keyboardDef, this.keyboardReturn);
            } else if (keyboardDef.type == "Qwerty" || keyboardDef.type == "QwertyExtended") {
                this.keyboard = new sm.KeyboardQwerty(keyboardDef, this.keyboardReturn);
            } else if (keyboardDef.type == "Numeric") {
                this.keyboard = new sm.KeyboardNumeric(keyboardDef, this.keyboardReturn);
            }
            this.keyboard.x = this.cfg.keyboard.x;
            this.keyboard.y = this.cfg.keyboard.y;
            this.keyboard.name = "keyboard";
            this.addChild(this.keyboard);            
            this.keyboard.visible = false;

//            this.keyboard = new sm.Keyboard(keyboardDef.x, keyboardDef.y, keyboardDef.ncolum, keyboardDef.sizeKey,
//                keyboardDef.withChars, keyboardDef.withNumbers, keyboardDef.withSymbols, true, true, true, this.keyboardReturn, 
//                keyboardDef.chars, keyboardDef.numbers, keyboardDef.symbols);
//            
//            this.addChild(this.keyboard);

        }
                            
    };

    p.validateValue = function(obj) {
        var engine = this.parent;
        if (engine != null && engine.buttonEndActivity.enabled) {
            var keyboard = engine.keyboard;
            var hotArea = keyboard.owner;

            keyboard.visible = false;
            if (this.buttonEndActivity != undefined) {
                engine.buttonEndActivity.setEnabled(false);
            }


            //if (engine.cfg.autoEvaluate == true) {
            if (engine.editText == hotArea.solutionText) {
                engine.notifyPartialSuccess();
                hotArea.enabled = false;
                if (engine.checkEndActivity()) {
                    engine.buttonEndActivity.setEnabled(false);
                    //engine.repeatButton.setEnabled(false);
                    engine.notifyTotalSuccess();

                }
            } else {
                engine.notifyError();
                hotArea.editText("");
            }
        }

        engine.editText = "";
        //}
    };

    p.keyboardReturn = function(obj) {
        var code = obj.code;
        var key = obj.text.text;
        var hotArea = obj.parent.owner;
        
        if (code == "delete") {
            hotArea.parent.editText = hotArea.parent.editText.substring(0, hotArea.parent.editText.length - 1);
            hotArea.editText(hotArea.parent.editText);
        } else if (code == "ok") {
                obj.parent.visible = false;
                
                if (hotArea.parent.cfg.autoEvaluate == true) {
                    if (hotArea.parent.editText == hotArea.solutionText) {
                        hotArea.parent.notifyPartialSuccess();
                        hotArea.enabled = false;
                        if (hotArea.parent.checkEndActivity()) {
                            hotArea.parent.notifyTotalSuccess();
                        }
                            
                    } else {
                        hotArea.parent.notifyError();
                        hotArea.editText("");
                    }
                }
                
                hotArea.parent.editText = "";
        } else if (code == "ko") {
            obj.parent.visible = false;
            hotArea.parent.editText = "";
            hotArea.editText(hotArea.parent.lastValue);
        } else if (code == "space") {
            hotArea.dummyText.color = hotArea.hotDef.hotAreaText.fontColor;
            hotArea.parent.editText = hotArea.parent.editText + " ";
            hotArea.editText(hotArea.parent.editText);
        } else {
            hotArea.dummyText.color = hotArea.hotDef.hotAreaText.fontColor;
            hotArea.parent.editText = hotArea.parent.editText + key;
            hotArea.editText(hotArea.parent.editText);
        }
    };

    p.onClickHotArea = function(obj, x, y) {
        var engine = obj.parent;
        var keyboard = engine.keyboard;

        if (keyboard.visible == true && obj != keyboard.owner) {
            return;
        }
        if (keyboard != null && keyboard != undefined) {
            if (keyboard.visible == false) {
                keyboard.visible = true;
                if (engine.buttonEndActivity != undefined) {
                    engine.buttonEndActivity.setEnabled(true);
                }
                keyboard.owner = obj;

                if(obj.dummyText.visible == false){
                    engine.lastValue = "";
                }else{
                    engine.lastValue = obj.dummyText.text;
                }
                
            }
        }
    };

    p.generateHotAreas = function(hotAreasDefArray) {
        this.targetHits = 0;

        if (hotAreasDefArray) {
            for (var h = 0 in hotAreasDefArray) {
                var hotDef = hotAreasDefArray[h];
                var hot = new sm.HotArea(hotDef.name, hotDef.points, hotDef.sizepos, hotDef.imagepos, hotDef.circle);
                hot.locked = false;
                hot.hotDef = hotDef;
                hot.multidrop = hotDef.multidrop;
                hot.replaceObject = hotDef.replaceObject;
                hot.enabled = hotDef.enabled != undefined ? hotDef.enabled : true;
                hot.hotAreaVisible = hotDef.hotAreaVisible != undefined ? hotDef.hotAreaVisible : false;
                hot.popup = hotDef.popup;
                if (hotDef.hitable) {
                    hot.onClickArea = this.onClickHotArea;
                    this.targetHits++;
                }
                hot.sound = null;
                if (hotDef.sound != undefined) {
                    hot.sound = hotDef.sound;
                }
                var addHot = hotDef.add != undefined ? hotDef.add : true;
                if (addHot) {
                    this.addChild(hot);
                }
                if (hotDef.id) {
                    hot.setTextId(hotDef.id);
                }
                if (hotDef.hotAreaText) {
                    var text = {
                        x: hotDef.hotAreaText.x,
                        y: hotDef.hotAreaText.y,
                        text: hotDef.hotAreaText.text,
                        visible: hotDef.hotAreaText.textVisible,

                        font: hotDef.hotAreaText.font,
                        fontColor: hotDef.hotAreaText.fontColor,
                    };

                    hot.enabled = !hotDef.hotAreaText.textVisible;
                    hot.setText(text);
                }

                if(hotDef.hotAreaImage)
                {
                    var image = new createjs.Bitmap(ImageManager.getImage(hotDef.hotAreaImage.id));
                    image.name = hotDef.hotAreaImage.id;
                    image.x = hotDef.hotAreaImage.x;
                    image.y = hotDef.hotAreaImage.y;
                    hot.imagepos = image;
                }

                this.hotAreas.push(hot);
            }
        }
    };

    p.onClickObject = function(obj) {
        if (SoundManager != undefined && SoundManager != null && obj.fx) SoundManager.play(obj.fx);

        if (obj.objDef.disableOnClick) {
            obj.enabled = false;
        }
        if (obj.objDef.actions) {
            this.parent.processActions(obj.objDef.actions);
        }
        if (obj.objDef.doHit) {
            obj.parent.hits++;
            if (obj.parent.cfg.questions) {
                var question = obj.parent.cfg.questions[obj.parent.questionIndex];
                if (obj.parent.hits >= question.totalHits) {
                    obj.parent.aciertos++;
                    obj.parent.checkComplete();
                }
            }
        }
    };

    p.onDragDropObject = function(obj, mouseX, mouseY) {
        if (/*this.parent.IsInBounds(ptDrop.x, ptDrop.y)*/true) {
            if (!obj.clonable) {
                if (this.parent.processObject(obj, mouseX, mouseY)) {
                    if (obj.parent != this.parent) {
                        this.parent.addChild(obj);
                        this.parent.reorderLayers();
                    }
                    
                    if (obj.editable && obj.parent == this.parent) {
                        obj.activate();
                        obj.desactivate();
                        obj.activate();
                    }
                }
            }
        } else {
            obj.x = obj.origin.x;
            obj.y = obj.origin.y;
        }
        // Para volver a poner por encima el header y el footer
        this.parent.addChild(this.parent.headerTool);
        this.parent.addChild(this.parent.footerTool);
    };

    p.onActivateObject = function() {
        // Para volver a poner por encima el header y el footer
        this.parent.addChild(this.parent.headerTool);
        this.parent.addChild(this.parent.footerTool);
    };

    p.onCloneObject = function(obj, mouseX, mouseY) {
        obj.stage = this.parent.stage;
        if (obj.objDef.transformInTool == undefined || obj.objDef.transformInTool == false) {
            obj.editable = obj.objDef.editable != undefined ? obj.objDef.editable : false;
            obj.canResize = obj.objDef.canResize != undefined ? obj.objDef.canResize : true;
            obj.canRemove = obj.objDef.canRemove != undefined ? obj.objDef.canRemove : true;
            obj.canRotate = obj.objDef.canRotate != undefined ? obj.objDef.canRotate : true;
            obj.canMove = obj.objDef.canMove != undefined ? obj.objDef.canMove : true;
            obj.onDragDrop = this.parent.onDragDropObject;
            obj.onActivate = this.parent.onActivateObject;
        }

        var comparisonValue = obj.image.width > obj.image.height ? obj.image.height: obj.image.width;

        if (mouseX >= 0 && mouseX <= this.parent.originalWidth && mouseY >= styles.headerSM.height && mouseY <= this.parent.originalHeight && 
            (mouseX-obj.origin.x)*(mouseX-obj.origin.x) + (mouseY-obj.origin.y)*(mouseY-obj.origin.y) > comparisonValue*comparisonValue*obj.dropScale*obj.dropScale) {
            if (this.parent.processObject(obj, mouseX, mouseY)) {
                this.parent.addChild(obj);
                obj.parent.addChild(obj);
                this.parent.objetosEscena.push(obj);
                this.parent.stage.update();

                if(this.parent.enabled == false)
                {
                    this.parent.onEndActivity();
                }
            }
        }
        if (obj.editable && obj.parent == this.parent) {
            obj.activate();
            obj.desactivate();
            obj.activate();
        }
        this.parent.reorderLayers();
    };

    p.processObject = function(obj, mouseX, mouseY) {
        var game = this;
        var valido = false;
        var dropX = null;
        var dropY = null;
        var dropZ = null;
        var hotArea = null;
        var ajustCoordX = true;
        var ajustCoordY = true;

        if (obj.hotAreas != undefined) {
            for (var i = 0; i < game.hotAreas.length; i++) {
                hotArea = game.hotAreas[i];
                if (hotArea.enabled) {
                    for (var j = 0; j < obj.hotAreas.length; j++) {
                        if (obj.hotAreas[j].hotArea == hotArea.name && hotArea.pointInHotArea(mouseX, mouseY)) {
                            if (obj.hotAreas[j].dropZones != undefined) {
                                for (var indexDropZone = 0; indexDropZone < obj.hotAreas[j].dropZones.length; indexDropZone++) {
                                    var dropZone = obj.hotAreas[j].dropZones[indexDropZone];
                                    if (!dropZone.dropped) {
                                        dropX = dropZone.x;
                                        dropY = dropZone.y;
                                        if (dropZone.z != undefined) dropZ = dropZone.z;
                                        dropZone.dropped = true;
                                        break;
                                    }
                                }
                            } else {
                                var objDropX = "same";
                                var objDropY = "same";
                                var objDropZ = 0;
                                if (obj.hotAreas[j].dropCases != undefined) {
                                    var validDropCase = false;
                                    for (var indexDropCase = 0; indexDropCase < obj.hotAreas[j].dropCases.length; indexDropCase++) {
                                        var dropCase = obj.hotAreas[j].dropCases[indexDropCase];
                                        if (dropCase.ang == obj.rotation) {
                                            objDropX = dropCase.x;
                                            objDropY = dropCase.y;
                                            validDropCase = true;
                                            break;
                                        }
                                    }
                                    if (!validDropCase) {
                                        break;
                                    }
                                } else {
                                    if (obj.hotAreas[j].dropX != undefined) {
                                        objDropX = obj.hotAreas[j].dropX;
                                    }
                                    if (obj.hotAreas[j].dropY != undefined) {
                                        objDropY = obj.hotAreas[j].dropY;
                                    }
                                    if (obj.hotAreas[j].dropZ != undefined) {
                                        objDropZ = obj.hotAreas[j].dropZ;
                                    }
                                }

                                var auxPosObj = { x: 0, y: 0 };
                                if (obj.objDef.inTool) {
//                                auxPosObj.x = obj.x + obj.localToGlobal(mouseX, mouseY).x;
//                                auxPosObj.y = obj.y + obj.localToGlobal(mouseX, mouseY).y;
                                } else {
                                    auxPosObj = obj.globalToLocal(mouseX, mouseY);
                                }
                                if (isNumeric(objDropX)) {
                                    dropX = objDropX;
                                } else {
                                    if (objDropX == "same") {
                                        dropX = mouseX; //mouseX - auxPosObj.x;
                                        ajustCoordX = false;
                                    }
                                }

                                if (isNumeric(objDropY)) {
                                    dropY = objDropY;
                                } else {
                                    if (objDropY == "same") {
                                        dropY = mouseY; //mouseY - auxPosObj.y;
                                        ajustCoordY = false;
                                    }
                                }

                                if (isNumeric(objDropZ)) {
                                    dropZ = objDropZ;
                                }
                            }

                            if (!hotArea.multidrop) {
                                hotArea.enabled = false;
                                hotArea.locked = true;
                            }

                            if (hotArea.replaceObject && hotArea.linkObject) {
                                hotArea.linkObject.scaleX = 1;
                                hotArea.linkObject.scaleY = 1;
                                hotArea.linkObject.x = hotArea.linkObject.origin.x;
                                hotArea.linkObject.y = hotArea.linkObject.origin.y;
                                hotArea.linkObject.enabled = true;
                                this.addChild(hotArea.linkObject);
                            }

                            if (dropX != null && dropY != null && dropX >= 0 && dropY >= 0) {
                                valido = true;
                                if (obj.hotAreas[j].actions != undefined && obj.hotAreas[j].actions != null) {
                                    this.processActions(obj.hotAreas[j].actions);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        } else {
            obj.scaleX = obj.dropScale;
            obj.scaleY = obj.dropScale;
            obj.x = mouseX;
            obj.y = mouseY;
            obj.z = 1;
            return true;
        }
    if (valido && hotArea) {
            if (dropX >= 0 && dropY >= 0) {
                obj.scaleX = obj.dropScale;
                obj.scaleY = obj.dropScale;
                if (ajustCoordX) {
                    obj.x = dropX - ((obj.image.width - (obj.image.width * obj.scaleX)) / 2) + obj.regX;
                } else {
                    obj.x = dropX;
                }
                if (ajustCoordY) {
                    obj.y = dropY - ((obj.image.height - (obj.image.height * obj.scaleY)) / 2) + obj.regY;
                } else {
                    obj.y = dropY;
                }
                if (dropZ != null && dropZ >= 0) {
                    obj.z = dropZ;
                }
                hotArea.linkObject = obj;
            }
            if (dropZ == null || dropZ <= 0) {
                obj.z = 1;
            }
            obj.enabled = false;
            obj.cursor = "default";
            obj.draggable = false;
            obj.locked = true;
            if (obj.editable == true) {
                obj.enabled = true;
            }
            game.reorderLayers();
            if (this.cfg.questions) {
                this.hits++;
                if (!question.totalHits || this.hits >= question.totalHits) {
                    game.aciertos++;
                }
            } else {
                game.aciertos++;
            }
            this.notifyPartialSuccess();
        } else {
            obj.x = obj.origin.x;
            obj.y = obj.origin.y;
            this.notifyError();
        }

        if (valido) {
            game.checkComplete();
        }
        return valido;
    };

    p.reorderLayers = function() {
        if (this.enabled){
            this.children.sort(function(a, b) {
                if (!a.z) a.z = 0;
                if (!b.z) b.z = 0;
                return a.z - b.z;
            });
            // Para volver a poner por encima el header y el footer
            this.addChild(this.headerTool);
            this.addChild(this.footerTool);
        }
    };

    p.desactiveObjects = function() {
        for (var i = 0; i < this.objetosEscena.length; i++) {
            this.objetosEscena[i].desactivate();
        }
        for (i = 0; i < this.objetos.length; i++) {
            this.objetos[i].desactivate();
        }
    };

    p.enableObjects = function() {
        var i;
        for (i = 0; i < this.objetosEscena.length; i++) {
            if (this.objetosEscena[i].locked == undefined || this.objetosEscena[i].locked == false) {
                this.objetosEscena[i].enabled = true;
            }
        }
        for (i = 0; i < this.objetos.length; i++) {
            if (this.objetos[i].locked == undefined || this.objetos[i].locked == false) {
                this.objetos[i].enabled = true;
            }
        }
        for (i = 0; i < this.hotAreas.length; i++) {
            if (this.hotAreas[i].locked == undefined || this.hotAreas[i].locked == false) {
                this.hotAreas[i].enabled = true;
            }
        }
    };

    p.disableObjects = function() {
        var i;
        for (i = 0; i < this.objetosEscena.length; i++) {
            this.objetosEscena[i].enabled = false;
        }
        for (i = 0; i < this.objetos.length; i++) {
            this.objetos[i].enabled = false;
            this.objetos[i].enabled = false;
            try {
                this.objetos[i].desactivate();
            } catch(err) {
            }
        }
        for (i = 0; i < this.hotAreas.length; i++) {
            this.hotAreas[i].enabled = false;
        }
    };

    p.destroyAreas = function() {
        for (var i = 0; i < this.hotAreas.length; i++) {
            this.removeChild(this.hotAreas[i]);
        }
        this.hotAreas = [];
    };

    p.destroyObjects = function() {
        var i;
        for (i = 0; i < this.objetosEscena.length; i++) {
            this.objetosEscena[i].desactivate();
            this.removeChild(this.objetosEscena[i]);
            if (SoundManager != undefined && SoundManager != null && this.objetosEscena[i].fx) {
                SoundManager.stop();
            }
        }
        this.objetosEscena = [];
        for (i = 0; i < this.objetos.length; i++) {
            this.objetos[i].desactivate();
            this.removeChild(this.objetos[i]);
            if (SoundManager != undefined && SoundManager != null && this.objetosEscena[i].fx) {
                SoundManager.stop();
            }
        }
        if (this.forzeDestroy) {
            var objectsToRemove = [];
            for (i = 0; i < this.children.length; i++) {
                if (this.children[i] instanceof createjs.ResizeableBitmap) {
                    objectsToRemove.push(this.children[i]);
                }
            }
            for (i = 0; i < objectsToRemove.length; i++) {
                this.removeChild(objectsToRemove[i]);
            }
        }
        this.objetos = [];
        this.variables = [];
    };

    p.checkComplete = function() {
        var successes = this.cfg.successes != undefined ? this.cfg.successes : this.objetos.length;
        if (successes > 0 && this.aciertos == successes) {
            this.aciertos = 0;
            this.disableObjects();
            this.notifyTotalSuccess();           
        } else {
            if (this.cfg.questions) {
                if (!question.totalHits || this.hits >= question.totalHits) {
                    if (question.actionsAtEnd) {
                        this.disableObjects();
                        this.processActions(question.actionsAtEnd, 0, this.onEndQuestion);
                    } else {
                        this.onEndQuestion();
                    }
                }
            }
        }
    };

    p.BaseEngine_onEndActivity = p.onEndActivity;   
    p.onEndActivity = function() {
        if (this.activityEnded){
            return;
        }
        this.activityEnded = true;
        this.repeatButton.setEnabled(true);
        if(this.isUnique() && this.animationEnd != null && this.animationEnd != undefined) {
            this.removeChild(this.animationEnd);
            this.addChild(this.animationEnd);            
            this.animationEnd.run(this.onFinishAnimation);
            if (this.cfg.platform == "SM") {
                this.repeatButton = this.getRepeatButton();
                this.removeChild(this.repeatButton);
                this.addChild(this.repeatButton);
            }
            else {
                this.repeatButton = this.educamosBarNav.getButton("Repeat");
                this.repeatButton.setEnabled(true);
            }
            
            if (this.infoVolverAJugar != null) this.infoVolverAJugar.visible = true;
        }else if (this.isUnique() == false) {
            this.getSingelton().onEndActivity();
        }else {
            if (this.cfg.platform == "SM") {
                this.repeatButton = this.getRepeatButton();
                this.removeChild(this.repeatButton);
                this.addChild(this.repeatButton);
            }
            else {
                this.repeatButton = this.educamosBarNav.getButton("Repeat");
                repeatButton.setEnabled(true);
            }
        }       
    };

    
    function isNumeric(sText) {
        var validChars = "0123456789.";
        var isNumber = true;
        var caracter;

        for (var indexChar = 0; indexChar < sText.length && isNumber == true; indexChar++) {
            caracter = sText.charAt(indexChar);
            if (validChars.indexOf(caracter) == -1) {
                isNumber = false;
            }
        }
        return isNumber;
    }

    ////////////////////////////////////

    sm.SeriesEngine = seriesEngine;
} (window));
