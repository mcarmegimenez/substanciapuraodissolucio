this.sm = this.sm || {};

(function () {
    var hotAreaArtEngine = function (htmlCanvasId, cfg, animationEnd, unique) {
        this.initialize(htmlCanvasId, cfg, animationEnd, unique);
    };
    var p = hotAreaArtEngine.prototype = new sm.BaseEngine();
    p.singleton = null;

    p.BaseEngine_initialize = p.initialize;

    p.initialize = function (htmlCanvasId, cfg, animationEnd, unique) {
        this.BaseEngine_initialize(htmlCanvasId, cfg, animationEnd, unique);
        this.cfg = cfg;
        this.targetHits = 0;
        this.hits = 0;
        this.enabled = true;
        this.hotAreas = [];
        this.showingHotAreas = false;
    };
    
    p.onEndActivityClic = function (button) {
        button.parent.notifyTotalSuccess();
    };
    
    p.BaseEngine_setupObjects = p.setupObjects;
    p.setupObjects = function () {
       
        this.stage = this.getStage();

        this.hotAreas = [];

        // CREAMOS HEADER Y FOOTER
        this.headerTool = new sm.HeaderTool(this.originalWidth);
        this.headerTool.setTituloEnunciado(this.cfg.enunciado);
        this.footerTool = new sm.FooterTool(this.originalWidth, 0, this.originalHeight - styles.footerSM.height);
        
        if (this.animationEnd != null && this.animationEnd != undefined) {
            this.animationEnd.width = this.originalWidth;
            this.animationEnd.height = this.originalHeight;
            this.addChild(this.animationEnd);
        }

        // AQUI MESSAGEBOX
        var width = this.stage.canvas.width * 0.5;
        var height = this.stage.canvas.height * 0.5;
        var x = 0.5 * (this.stage.canvas.width - width);
        var y = 0.5 * (this.stage.canvas.height - height);
        this.timeline = null;
        this.infoVolverAJugar = null; 
        if (this.cfg.msgEndActivity != null && this.cfg.msgEndActivity != undefined)
        {
            this.infoVolverAJugar = new sm.InfoPopupBigOkCancel(width, height, x, y, this.cfg.msgEndActivity.txtBtnAceptar, this.cfg.msgEndActivity.txtBtnCancelar, createjs.proxy(this.closeInfoOkCancel, this));       
            this.infoVolverAJugar.setText(this.cfg.msgEndActivity.txtConfirmacionRepetir);       
            this.addChild(this.infoVolverAJugar);
            this.infoVolverAJugar.visible = false;
        }

        //Creacion de elementos acordes al Estilo SM

        // BACKGROUND
        if (this.cfg.backgroundImage != undefined) {
            this.bkgImage = new createjs.Bitmap(ImageManager.getImage(this.cfg.backgroundImage.id));
            this.bkgImage.x = this.cfg.backgroundImage.x;
            this.bkgImage.y = this.cfg.backgroundImage.y;
            this.addChild(this.bkgImage);
        }
        
        //HOTAREAART SECTION
        switch (this.cfg.hotAreaArtEngine.gameType) {
            case 'simple':
                //Boton Show Hot Areas
                this.buttonShowHotAreas = new sm.Button(this.cfg.buttonShowHotAreas.width, styles.button.buttonHeight, this.cfg.buttonShowHotAreas.x, this.cfg.buttonShowHotAreas.y, this.ShowHotAreas);
                this.buttonShowHotAreas.setText(this.cfg.buttonShowHotAreas.textShowId);
                this.buttonShowHotAreas.visible = false;
                this.buttonShowHotAreas.enabled = true;
                this.addChild(this.buttonShowHotAreas);

                //Existe pantalla de inicio?
                if (this.cfg.pantallaInicio) {
                    this.createIntroScreen(this.start);
                } else { 
                    this.buttonShowHotAreas.visible = true;
                    this.generateHotAreas(this.cfg.hotAreas);
                }
                this.enableObjects();
                break;
            case 'animated':
                this.generateHotAreas(this.cfg.hotAreas);
                this.disableHotAreas();
                
                if (this.educamosBarNav != null) {
                    this.createMediaControl();
                    this.mediaControl.setEnabled(false);
                }

                if (this.cfg.pantallaInicio) {
                    this.createIntroScreen(this.startAnimated);
                } else {
                    this.startAnimated();
                }
                break;
            default:
                console.log("Tipo de juego erróneo");
                break;
        }
       
        //AGREGAMOS HEADER Y FOOTER
        this.addChild(this.headerTool);
        this.addChild(this.footerTool);
        
        this.BaseEngine_setupObjects();
    };

    p.createIntroScreen = function(eventHandler) {
        //Creamos contenedor
        this.introPopup = new sm.InfoPopupBig(this.cfg.intro.width, this.cfg.intro.height, this.cfg.intro.x, this.cfg.intro.y, null);
        this.introPopup.checkBoxes = [];

        if (this.getSingelton().cfg.platform == "Educamos") {
            var darkBackground = new createjs.Shape();
            darkBackground.graphics.beginFill("#000000").rect(0, 0, this.originalWidth, this.originalHeight);
            darkBackground.alpha = 0.5;
            this.introPopup.darkBackground = darkBackground;
            this.addChild(this.introPopup.darkBackground);
        }
        this.addChild(this.introPopup);
        if (this.educamosBarNav) {
            this.addChild(this.educamosBarNav);
        }       
        else {
            this.addChild(this.headerTool);
            this.addChild(this.footerTool);
        }

        this.introPopup.closeButtonVisible(false);

        //Imagenes
        for (var idxI = 0 in this.cfg.intro.images) {
            var img = new createjs.Bitmap(ImageManager.getImage(this.cfg.intro.images[idxI].value));
            img.x = this.cfg.intro.images[idxI].x;
            img.y = this.cfg.intro.images[idxI].y;
            this.introPopup.addChild(img);
        }

        //Textos
        for (var idxT = 0 in this.cfg.intro.texts) {
            var txt = new createjs.Text(this.cfg.intro.texts[idxT].value, this.cfg.intro.texts[idxT].font, this.cfg.intro.texts[idxT].fontColor);
            txt.x = this.cfg.intro.texts[idxT].x;
            txt.y = this.cfg.intro.texts[idxT].y;
            txt.lineHeight = 19.5;
            if (this.cfg.intro.texts[idxT].width != undefined) {
                txt.lineWidth = this.cfg.intro.texts[idxT].width;
            }
            this.introPopup.addChild(txt);
        }
        
        this.buttonStart = new sm.Button(this.cfg.intro.buttonStart.width, styles.button.buttonHeight, this.cfg.intro.buttonStart.x, this.cfg.intro.buttonStart.y, eventHandler);
        this.buttonStart.setText(this.cfg.intro.buttonStart.textId);
        this.addChild(this.buttonStart);
        this.addChild(this.headerTool);
        this.addChild(this.footerTool); 
    };
    
    p.start = function(button) {
        button.visible = false;
        button.parent.buttonShowHotAreas.visible = true;
        button.parent.generateHotAreas(button.parent.cfg.hotAreas);
        if (button.parent.introPopup != undefined) {
            if (button.parent.introPopup.darkBackground != undefined) {
                button.parent.introPopup.darkBackground.visible = false;
            }
            button.parent.introPopup.visible = false;
        }
    };
    
    p.BaseEngine_stop = p.stop;
    p.stop = function() {
        for (var indexHotArea = 0; indexHotArea < this.hotAreas.length; indexHotArea++) {
            if (this.hotAreas[indexHotArea].sound) {
                SoundManager.stop(this.hotAreas[indexHotArea].sound);
                this.hotAreaSound = null;
            }
            if (this.timeline != null) {
                this.timeline.removeAllEventListeners();
                while (this.timeline._tweens.length > 0) {
                    this.timeline.removeTween(this.timeline._tweens[0]);
                }
            }
        }

        this.BaseEngine_stop();
    };

    p.startAnimatedElapsed = function(target, button) {
        target.addChild(target.headerTool);
        target.addChild(target.footerTool);
        if (button != undefined) {
            button.visible = false;
            if (button.parent.introPopup != undefined) {
                if (button.parent.introPopup.darkBackground != undefined) {
                    button.parent.introPopup.darkBackground.visible = false;
                }
                button.parent.introPopup.visible = false;
            }
            button.parent.createMediaControl();
            button.parent.createTimeline();
            button.parent.playing = true;
            button.parent.mediaControl.play();
        } else {
            target.createMediaControl();
            target.createTimeline();
            target.playing = true;
            target.mediaControl.play();
        }
    };
    
    p.startAnimated = function(button) {
        var target = button != undefined ? button.parent : this;
        var lapsedTime = target.cfg.pantallaInicio ? 500 : 2000;

        setTimeout((function(trg, btn) {
            if (btn != undefined) {
                btn.visible = false;
                if (btn.parent.introPopup != undefined) {
                    if (btn.parent.introPopup.darkBackground != undefined) {
                        btn.parent.introPopup.darkBackground.visible = false;
                    }
                    btn.parent.introPopup.visible = false;
                }
                btn.parent.createMediaControl();
                btn.parent.createTimeline();
                btn.parent.playing = true;
                btn.parent.mediaControl.play();
            } else {
                trg.createMediaControl();
                trg.createTimeline();
                trg.playing = true;
                trg.mediaControl.play();
            }
        }), lapsedTime, target, button);
    };
    
    p.createMediaControl = function() {
        if (this.educamosBarNav != null) {
            if (this.mediaControl != null)
            {
                this.educamosBarNav.removeChild(this.mediaControl);
            }
            var mediaControlBarWidth = this.educamosBarNav.navBarLeft - 70;
            this.mediaControl = new sm.MediaControlBar("media", mediaControlBarWidth, styles.mediaControlBar, null, null, this.mediaControlTogglePlay);
            this.mediaControl.x = 70;
            this.mediaControl.y = 10;
            this.mediaControl.progress = 0;
            this.mediaControl.drawProgressTrackBar();
            this.mediaControl.owner = this;
            this.educamosBarNav.addChild(this.mediaControl);
        }
        else {
            this.mediaControl = new sm.MediaControlBar("media", this.cfg.mediaControlBar.width, styles.mediaControlBar, null, null, this.mediaControlTogglePlay);
            this.mediaControl.x = this.cfg.mediaControlBar.x;
            this.mediaControl.y = this.cfg.mediaControlBar.y;
            this.mediaControl.progress = 0;
            this.mediaControl.drawProgressTrackBar();
            this.mediaControl.owner = this;
            this.addChild(this.mediaControl);
        }
    };
    
    p.createTimeline = function() {
        this.timeline = new createjs.Timeline();
        var timePos = 0;
        var oldtimePos = 0;
        this.hotAreaSound = null;
        for (var indexHotArea = 0; indexHotArea < this.hotAreas.length; indexHotArea++) {
            var target = this.hotAreas[indexHotArea];
            target.name = "hotArea" + indexHotArea;
            if (target.popup != undefined) {
                this.createPopup(target);
            }

            if (target.popup != undefined) {
                this.timeline.addTween(createjs.Tween.get(target)
                    .wait(timePos)
                    .call(
                        function(area) {
                            area.hotAreaVisible = true;
                            area.alpha = 0;
                        }, [target])
                    .to({ alpha: 1 }, 300)
                    .to({ alpha: 0.2 }, 300)
                    .to({ alpha: 1 }, 300)
                    .to({ alpha: 0.2 }, 300)
                    .to({ alpha: 1 }, 300)
                    .to({ alpha: 0 }, 300)
                );

                oldtimePos = timePos;
                timePos += this.timeline.duration - oldtimePos;
                this.timeline.addTween(createjs.Tween.get(target.infoPopupBig)
                    .wait(timePos)
                    .call(
                        function(area) {
                            if (area.parent.educamosBarNav != undefined) {
                                area.parent.addChild(area.infoPopupBig.darkBackground);
                                area.parent.addChild(area.infoPopupBig);
                                area.parent.addChild(area.parent.educamosBarNav);
                            } else {
                                area.parent.addChild(area.parent.headerTool);
                                area.parent.addChild(area.parent.footerTool);
                            }
                        }, [target])
                    .to({ alpha: 1 }, 800)
                    .call(
                        function(area) {
                            if (area.sound) {
                                SoundManager.play(area.sound);
                                area.parent.hotAreaSound = area.sound;
                            }
                        }, [target])
                    .wait(target.infoPopupBig.timeSequence)
                    .call(
                        function(area) {
                            if (area.sound) {
                                SoundManager.stop(area.sound);
                                area.parent.hotAreaSound = null;
                            }
                            if (area.infoPopupBig.darkBackground) {
                                area.parent.removeChild(area.infoPopupBig.darkBackground);
                            }
                        }, [target])
                    .to({ alpha: 0 }, 800)
                );
                timePos += 800 + target.infoPopupBig.timeSequence + 800;
            } else {
                var soundDuration = 0;
                if (target.sound != undefined) {
                    soundDuration = SoundManager.getDuration(target.sound) * 1000;
                }
                this.timeline.addTween(createjs.Tween.get(target)
                    .wait(timePos)
                    .call(
                        function(area) {
                            area.hotAreaVisible = true;
                            area.alpha = 0;
                        }, [target])
                    .to({ alpha: 1 }, 300)
                    .to({ alpha: 0.2 }, 300)
                    .to({ alpha: 1 }, 300)
                    .to({ alpha: 0.2 }, 300)
                    .to({ alpha: 1 }, 300)
                    .to({ alpha: 0 }, 300)
                    .call(
                        function(area) {
                            if (area.sound) {
                                SoundManager.play(area.sound);
                                area.parent.hotAreaSound = area.sound;
                            }
                        }, [target])
                    .wait(soundDuration)
                );
                oldtimePos = timePos;
                timePos += this.timeline.duration - oldtimePos;
            }
        }
        this.timeline.addTween(createjs.Tween.get(this)
            .wait(this.timeline.duration)
            .call(this.notifyTotalSuccess)
        );
        this.timeline.on("change", function(event) {
            this.mediaControl.progress = this.timeline.position * 100 / this.timeline.duration;
            this.mediaControl.drawProgressTrackBar();
        }, this);
        this.timeline.gotoAndStop(0);
    };

    p.mediaControlTogglePlay = function(state) {
        this.owner.playing = state == "play";
        if (this.owner.playing) {
            this.owner.timeline.setPaused(false);
            if (this.owner.hotAreaSound != null) {
                if (SoundManager.isPaused(this.owner.hotAreaSound)) {
                    SoundManager.togglePlay(this.owner.hotAreaSound);
                } else {
                    SoundManager.play(this.owner.hotAreaSound);
                }
            }
        } else {
            this.owner.timeline.setPaused(true);
            if (this.owner.hotAreaSound != null) {
                SoundManager.togglePlay(this.owner.hotAreaSound);
            }
        }
    };

    p.ShowHotAreas = function (button) {
        if (button.parent.showingHotAreas) {
            button.setText(button.parent.cfg.buttonShowHotAreas.textShowId);
        } else {
            button.setText(button.parent.cfg.buttonShowHotAreas.textHideId);
        }
        
        button.parent.showingHotAreas = !button.parent.showingHotAreas;
        for (var i = 0 in button.parent.hotAreas){
            var hotDef = button.parent.hotAreas[i];
            hotDef.hotAreaVisible = button.parent.showingHotAreas;
        }
    };


    p.notifyPartialSuccess = function () {
        if (SoundManager != undefined && SoundManager != null) SoundManager.play(this.cfg.audioClic);
    };
    
    p.notifyTotalSuccess = function () {
        this.enabled = false;
        this.disableObjects();
        if (SoundManager != undefined && SoundManager != null && this.cfg.audioFinal != undefined && this.cfg.audioFinal != null) {
            SoundManager.play(this.cfg.audioFinal, undefined, createjs.proxy(this.onEndActivity, this), undefined);
        } else {
            this.onEndActivity();
        }
    };

    p.BaseEngine_onEndActivity = p.onEndActivity;
    p.onEndActivity = function() {
        if (this.activityEnded){
            return;
        }
        this.activityEnded = true;
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
                var repeatButton = this.educamosBarNav.getButton("Repeat");
                repeatButton.setEnabled(true);
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
                var repeatButton = this.educamosBarNav.getButton("Repeat");
                repeatButton.setEnabled(true);
            }
        }       
    };
    
    p.BaseEngine_onFinishAnimation = p.onFinishAnimation;
    p.onFinishAnimation = function() {
        if (this.infoVolverAJugar != null) this.infoVolverAJugar.visible = true;
    };

    p.BaseEngine_onRepeatActivity = p.onRepeatActivity;
    p.onRepeatActivity = function() {
        var engine = this.parent;
        if (engine != null) {
            if (engine.animationEnd != null) {
                engine.animationEnd.stop();
                engine.removeChild(engine.animationEnd);
            }
            engine.removeChild(engine.getRepeatButton());
            engine.reset();
        }
    };
    
    p.disableObjects = function() {
        if (this.buttonEndActivity != undefined)
            this.buttonEndActivity.setEnabled(false);
        if (this.buttonShowHotAreas != undefined)
            this.buttonShowHotAreas.setEnabled(false);
        
        //hotAreas
        this.disableHotAreas();
            
        this.enabled = false;
    };
    
    p.enableObjects = function() {
        if (this.buttonEndActivity != undefined)
            this.buttonEndActivity.setEnabled(true);
        if (this.buttonShowHotAreas != undefined)
            this.buttonShowHotAreas.setEnabled(true);

        //hotAreas
        this.enableHotAreas();
        
        this.enabled = true;
    };

    p.disableHotAreas = function() {
        for (var i = 0 in this.hotAreas){
            var hotA = this.hotAreas[i];
            hotA.lastState = hotA.enabled;
            hotA.enabled = false;
        }
    };
    
    p.enableHotAreas = function() {
        for (var i = 0 in this.hotAreas){
            var hotA = this.hotAreas[i];
            hotA.enabled = hotA.lastState != undefined ? hotA.lastState : true;
        }
    };
    
    p.closeInfoOkCancel = function(boton) {
        switch(boton) {
            case 'Ok':
                this.infoVolverAJugar.visible = false;
                this.reset();
                if (SoundManager != undefined && SoundManager != null) SoundManager.stop();
                this.animationEnd.stop();
                this.enableObjects();                
            break;
            case 'Cancel':
                this.infoVolverAJugar.visible = false;
            break;            
        };
    };

    p.notifyError = function () {
        if (SoundManager != undefined && SoundManager != null) SoundManager.play(this.cfg.audioKO);
    };

    p.increaseHit = function () {
        if (this.cfg.autoEvaluate == true) {
            this.hits++;
        }

        if (this.hits == this.targetHits) {
            this.notifyTotalSuccess();
            this.hits = 0;
        } else {
            this.notifyPartialSuccess();
        }
    };

    p.generateHotAreas = function(hotAreasDefArray) {
        this.targetHits = 0;
        
        if (hotAreasDefArray) {
            for (var h = 0 in hotAreasDefArray){
                var hotDef = hotAreasDefArray[h];
                var hot = new sm.HotAreaExtended(hotDef.name, hotDef.points, hotDef.sizepos, hotDef.imagepos, hotDef.circle, hotDef.color, hotDef.opacity);
                hot.orderId = hotDef.orderId;
                hot.used = false;
                hot.hotDef = hotDef;
                hot.multidrop = hotDef.multidrop;
                hot.replaceObject = hotDef.replaceObject;
                hot.enabled = hotDef.enabled != undefined ? hotDef.enabled : true;
                hot.hotAreaVisible = hotDef.hotAreaVisible != undefined ? hotDef.hotAreaVisible : false;
                hot.popup = hotDef.popup;
                if (hotDef.popup != null && hotDef.popup.timeSequence != undefined) {
                    hot.popup.timeSequence = hotDef.popup.timeSequence;
                }
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
                if (hotDef.hotAreaText) {
                    hot.setText(hotDef.hotAreaText);
                }
                if (hotDef.dotArea) {
                    hot.setDotArea(hotDef.dotArea);
                }
                
                hot.on("mouseover", function() { if (this.enabled) jQuery('body').css('cursor', 'pointer'); }, hot);
                hot.on("mouseout", function() { jQuery('body').css('cursor', 'default'); }, hot);

                this.hotAreas.push(hot);
            }
        }
    };

    p.onClickHotArea = function(hotArea, mouseX, mouseY) {
        
        if (hotArea.sound) {
            SoundManager.play(hotArea.sound);
        }
            
        if(hotArea.hotDef.disableOnClick){
            hotArea.enabled = false;
        }
                
        //Acciones del popup si las tuvieramos
        if (hotArea.popup) {
            hotArea.parent.disableObjects();
            hotArea.parent.processPopup(hotArea.popup, hotArea);
        } else if (!hotArea.used) {
            hotArea.parent.increaseHit();
            hotArea.used = true;
        }
    };

    p.processPopup = function(popupDefs, hotArea) {
        for (var idx = 0 in popupDefs.elements){
            var popupDef = popupDefs[idx];
            popupDef.owner = popupDef;
            if (!this.processPopup(popupDef, hotArea)) {
                return;
            }
        }
    };

    p.createPopup = function(hotArea) {
        var popupDef = hotArea.popup;
        var infoPopupBig = new sm.InfoPopupBig(popupDef.width, popupDef.height, popupDef.x, popupDef.y, this.onClosePopup, "Cerrar");
        infoPopupBig.hotArea = hotArea;
        infoPopupBig.alpha = 0;
        infoPopupBig.checkBoxes = [];
        if (popupDef.timeSequence != undefined) {
            infoPopupBig.timeSequence = popupDef.timeSequence;
            infoPopupBig.closeButtonVisible(false);
        }
        
        if (this.getSingelton().cfg.platform == "Educamos") {
            var darkBackground = new createjs.Shape();
            darkBackground.graphics.beginFill("#000000").rect(0, 0, this.originalWidth, this.originalHeight);
            darkBackground.alpha = 0.5;
            infoPopupBig.darkBackground = darkBackground;
        }        
        
        hotArea.infoPopupBig = infoPopupBig;
        
        //Preguntas
        if (popupDef.question != null && popupDef.question != undefined) {
            //Enunciado pregunta
            var qst = new createjs.Text(popupDef.question.value, styles.infoPopupBig.fontSize + "px " + styles.fontFamilyBold, "#000000");
            qst.x = popupDef.question.x;
            qst.y = popupDef.question.y;
            infoPopupBig.addChild(qst);
            
            //Opciones respuesta
            for (var idxAnsw = 0 in popupDef.question.answers) {
                var cbx_answer = new sm.CheckBox(popupDef.question.answers[idxAnsw].x,
                    popupDef.question.answers[idxAnsw].y,
                    popupDef.question.answers[idxAnsw].width,
                    this.onAnswerClick,
                    popupDef.question.answers[idxAnsw].result, false);
                
                cbx_answer.setText(popupDef.question.answers[idxAnsw].value);
                cbx_answer.
                infoPopupBig.addChild(cbx_answer);
                infoPopupBig.checkBoxes.push(cbx_answer);
            }
        } 
        
        //Imagenes
        for (var idxI = 0 in popupDef.images) {
            var img = new createjs.Bitmap(ImageManager.getImage(popupDef.images[idxI].value));
            img.x = popupDef.images[idxI].x;
            img.y = popupDef.images[idxI].y;
            infoPopupBig.addChild(img);
        }

        //Textos
        for (var idxT = 0 in popupDef.texts) {
            var txt = new createjs.Text(popupDef.texts[idxT].value, popupDef.texts[idxT].font, popupDef.texts[idxT].fontColor);
            txt.x = popupDef.texts[idxT].x;
            txt.y = popupDef.texts[idxT].y;
            txt.lineHeight = 19.5;
            if (popupDef.texts[idxT].width != undefined) {
                txt.lineWidth = popupDef.texts[idxT].width;
            }
            infoPopupBig.addChild(txt);
        }

        this.addChild(infoPopupBig);
    };

    p.processPopup = function(popupDef, hotArea) {
        var result = true;
        
        //Creamos contenedor
        this.infoPopupBig = new sm.InfoPopupBig(popupDef.width, popupDef.height, popupDef.x, popupDef.y, this.onClosePopup, "Cerrar");
        this.infoPopupBig.hotArea = hotArea;
        this.infoPopupBig.alpha = 0;
        this.infoPopupBig.checkBoxes = [];
        
        if (this.getSingelton().cfg.platform == "Educamos") {
            var darkBackground = new createjs.Shape();
            darkBackground.graphics.beginFill("#000000").rect(0, 0, this.originalWidth, this.originalHeight);
            darkBackground.alpha = 0.5;
            this.infoPopupBig.darkBackground = darkBackground;
            this.addChild(this.infoPopupBig.darkBackground);
        }
        this.addChild(this.infoPopupBig);
        if (this.educamosBarNav) {
            this.addChild(this.educamosBarNav);
        }
        else {
            this.addChild(this.headerTool);
            this.addChild(this.footerTool);
        }

        this.infoPopupBig.hotArea.infoPopupBig = this.infoPopupBig;
        if (popupDef.timeSequence != undefined) {
            this.infoPopupBig.hotArea.infoPopupBig.timeSequence = popupDef.timeSequence;
            this.infoPopupBig.closeButtonVisible(false);
        }

      

        //Objetos definidos

        //Preguntas
        if (popupDef.question != null && popupDef.question != undefined) {
            //Enunciado pregunta
            var qst = new createjs.Text(popupDef.question.value, styles.infoPopupBig.fontSize + "px " + styles.fontFamilyBold, "#000000");
            qst.x = popupDef.question.x;
            qst.y = popupDef.question.y;
            this.infoPopupBig.addChild(qst);
            
            //Opciones respuesta
            for (var idxAnsw = 0 in popupDef.question.answers) {
                var cbx_answer = new sm.CheckBox(popupDef.question.answers[idxAnsw].x,
                    popupDef.question.answers[idxAnsw].y,
                    popupDef.question.answers[idxAnsw].width,
                    this.onAnswerClick,
                    popupDef.question.answers[idxAnsw].result, false);
                
                cbx_answer.setText(popupDef.question.answers[idxAnsw].value);
                this.infoPopupBig.addChild(cbx_answer);
                this.infoPopupBig.checkBoxes.push(cbx_answer);
            }
        } 
        
        //Imagenes
        for (var idxI = 0 in popupDef.images) {
            var img = new createjs.Bitmap(ImageManager.getImage(popupDef.images[idxI].value));
            img.x = popupDef.images[idxI].x;
            img.y = popupDef.images[idxI].y;
            this.infoPopupBig.addChild(img);
        }

        //Textos
        for (var idxT = 0 in popupDef.texts) {
            var txt = new createjs.Text(popupDef.texts[idxT].value, popupDef.texts[idxT].font, popupDef.texts[idxT].fontColor);
            txt.x = popupDef.texts[idxT].x;
            txt.y = popupDef.texts[idxT].y;
            txt.lineHeight = 19.5;
            if (popupDef.texts[idxT].width != undefined) {
                txt.lineWidth = popupDef.texts[idxT].width;
            }
            this.infoPopupBig.addChild(txt);
        }

        if (this.cfg.hotAreaArtEngine.gameType == "simple") {
            createjs.Tween.get(this.infoPopupBig).to({ alpha: 1 }, 800);
        }

        return result;
    };

    p.onAnswerClick = function(cbx) {
        if (cbx.tipoCheck == 2) {
            cbx.parent.parent.notifyError();
            cbx.setEnabled(false);
        }else if (cbx.tipoCheck == 1) {
            
            //Deshabilitar todos???
//            for (var c in cbx.parent.checkBoxes) {
//                cbx.parent.checkBoxes[c].setEnabled(false);
//            }
            cbx.setEnabled(false);
            
            //Cerrar popup al terminar????
//            if (SoundManager != undefined && SoundManager != null) {
//                SoundManager.play(cbx.parent.parent.cfg.audioOK, null, function(event) {
//                    cbx.parent.parent.enableObjects();
//                    cbx.parent.parent.removeChild(cbx.parent);
//                });
//            }
            SoundManager.play(cbx.parent.parent.cfg.audioOK);
        }
        showHandCursor(false);
    };

    p.onClosePopup = function(response) {
        this.parent.closePopup(this, this.parent);
    };

    p.closePopup = function(popup, engine, callback, params, timeToCall) {
        if (popup.hotArea.sound) {
            SoundManager.stop(popup.hotArea.sound);
        }   
        popup.parent.enableObjects();
        if (!popup.hotArea.used) {
            popup.parent.increaseHit();
            popup.hotArea.used = true;
        }
        createjs.Tween.get(popup)
            .to({ alpha: 0 }, 800)
            .call(function() {
                if (popup.darkBackground != undefined) {
                    popup.parent.removeChild(popup.darkBackground);
                }
                popup.parent.removeChild(popup);
                if (callback != undefined && params != undefined && timeToCall != undefined) {
                    setTimeout(callback, timeToCall, engine, params);
                }  
            });
    };

    sm.HotAreaArtEngine = hotAreaArtEngine;
} (window));



// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
(function () {
    var hotAreaExtended = function (name, points, sizepos, imagepos, circle, color, opacity) {
        this.initialize(name, points, sizepos, imagepos, circle, color, opacity);
    };
    var p = hotAreaExtended.prototype = new createjs.Container();
    
    p.points = [];
    p.sizepos = null;
    p.imagepos = null;
    p.mouseIn = false;
    p.enabled = true;
    p.multidrop = false;

    p.Container_initialize = p.initialize;

    p.initialize = function(name, points, sizepos, imagepos, circle, color, opacity) {
        this.name = name;
        this.points = points;
        this.sizepos = sizepos;
        this.imagepos = imagepos;
        this.circle = circle;
        this.enabled = true;
        this.color = color;
        this.opacity = opacity;

        this.Container_initialize();

        if (this.imagepos) {
            var image = ImageManager.getImage(this.imagepos.image);
            if (image != null) {
                this.dummy = new createjs.Bitmap(image);
                this.dummy.x = this.imagepos.x;
                this.dummy.y = this.imagepos.y;
            }
        } else {
            this.dummy = new createjs.Shape();
            this.dummy.graphics.beginFill(this.color);
            this.dummy.alpha = this.opacity;
            if (this.points) {
                this.dummy.graphics.moveTo(this.points[0].x, this.points[0].y);
                for (var i = 1; i < this.points.length; i++) {
                    var point = this.points[i];
                    this.dummy.graphics.lineTo(point.x, point.y);
                }
                this.dummy.graphics.closePath();
            } else if (this.sizepos) {
                this.dummy.graphics.rect(this.sizepos.x, this.sizepos.y, this.sizepos.width, this.sizepos.height);
            } else if (this.circle) {
                this.dummy.graphics.drawCircle(this.circle.x, this.circle.y, this.circle.radius);
            }
        }

        this.on("click", function(event) {
            if (this.enabled && this.onClickArea) {
                this.onClickArea(this, event.stageX, event.stageY);
            }
        });

        this.addChild(this.dummy);
    };

    p.isVisible = function() {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0;
    };
    
    p.DisplayObject_draw = p.draw;

    p.draw = function(ctx, ignoreCache) {
        if (this.hotAreaVisible) {// && this.enabled) {
            if (this.dotArea != undefined) {
                ctx.save();
                this.dotArea.updateContext(ctx);
                this.dotArea.draw(ctx, ignoreCache);
                ctx.restore();
            } else {
                ctx.save();
                this.dummy.updateContext(ctx);
                this.dummy.draw(ctx);
                ctx.restore();
            }
            
            if (this.dummyText != undefined) {
                ctx.save();
                this.dummyText.updateContext(ctx);
                this.dummyText.draw(ctx, ignoreCache);
                ctx.restore();
            }
        }
        return true;
    };
    
    p.setText = function(textDef) {
        this.removeChild(this.dummyText);
        this.dummyText = new createjs.Text(textDef.text, textDef.font, textDef.fontColor);
        this.dummyText.x = textDef.x + 2;
        this.dummyText.y = textDef.y - 2;
        this.addChild(this.dummyText);
    };

    p.setDotArea = function(dotAreaDef) {
        this.removeChild(this.dotArea);
        this.dotArea = new createjs.Shape();
        this.dotArea.x = dotAreaDef.x;
        this.dotArea.y = dotAreaDef.y;
        this.dotArea.graphics.clear()
//            .setStrokeStyle(1)
//            .beginStroke("#666666")
            .beginFill(dotAreaDef.color)
            .drawCircle(0, 0, dotAreaDef.radius)
            .endStroke()
            .endFill();
        
        this.addChild(this.dotArea);
    };

    p.clone = function() {
        var o = new HotArea(this.name, this.points);
        this.cloneProps(o);
        return o;
    };

    p.toString = function() {
        return "[HotArea (name=" + this.name + ")]";
    };

    sm.HotAreaExtended = hotAreaExtended;
} (window));
