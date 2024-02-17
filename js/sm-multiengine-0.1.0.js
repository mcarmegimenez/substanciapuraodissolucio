this.sm = this.sm || {};

(function () {
    var multiEngine = function (htmlCanvasId, cfg, animationEnd) {
        this.initialize(htmlCanvasId, cfg, animationEnd);
    };
    var p = multiEngine.prototype = new sm.BaseEngine();
    p.singelton = null;
    p.BaseEngine_initialize = p.initialize;

    p.initialize = function (htmlCanvasId, cfg, animationEnd) {
        this.BaseEngine_initialize(htmlCanvasId, cfg, animationEnd, false);
        p.singelton = this;
        this.setupEnvironment();

        this.numItems = this.cfg.items.length;
        this.activeIndex = 0;
        this.engines = [];
        for (var i = 0 in this.cfg.items) {
            this.cfg.items[i].cfg.autoEvaluate = this.cfg.autoEvaluate;
            var classEngine = this.stringToFunction(this.cfg.items[i].engine);
            var engine = new classEngine(this.htmlCanvasId, this.cfg.items[i].cfg, null, false);
            engine.originalWidth = this.originalWidth;
            engine.originalHeight = this.originalHeight;
            engine.getSingelton = this.getSingelton;
            engine.visible = false;
            this.addChild(engine);
            this.engines.push(engine);
        }

        // Barra de navegación
        if (this.cfg.autoEvaluate || this.cfg.platform == "Educamos") {
            this.navBar = new sm.BarraNavegacion(cfg.navigationBar.x, cfg.navigationBar.y, this.numItems, this.navigationBar_Click);
            this.navBar.autoEnabledButtons = !this.cfg.autoEvaluate;
            this.navBar.desactivatePrevious();
            if (this.cfg.autoEvaluate) {
                this.navBar.desactivateNext();
            } else {
                this.navBar.activateNext();
            }
        } else {
            this.navBar = new sm.BarraSeleccion(cfg.navigationBar.x, cfg.navigationBar.y, this.numItems, this.navigationBar_Click);
        }

        // Animación final
        if (this.animationEnd != null && this.animationEnd != undefined) {
            this.animationEnd.width = this.originalWidth;
            this.animationEnd.height = this.originalHeight;
            this.addChild(this.animationEnd);
        }

        //Nos agregamos al stage.
        this.stage.addChild(this);
    };

    p.stringToFunction = function (str) {
        var arr = str.split(".");
        var fn = (window || this);
        for (var i = 0, len = arr.length; i < len; i++) {
            fn = fn[arr[i]];
        }
        if (typeof fn !== "function") {
            throw new Error("function not found");
        }
        return fn;
    };

    p.BaseEngine_setupObjects = p.setupObjects;
    p.setupObjects = function () {
        this.BaseEngine_setupObjects();
        this.resizeCanvas();
    };

    p.BaseEngine_run = p.run;
    p.run = function () {
        this.stage = this.getStage();
        if (p.singelton != null) {
            setTimeout(this.runTimed, 100);
        } else {
            this.setupObjects();
        }
        this.running = true;
    };

    p.runTimed = function () {
        if (p.singelton.cfg.autoEvaluate) {
            p.singelton.activeIndex = 0;
            p.singelton.navBar.reset();
            p.singelton.navBar.desactivatePrevious();
            p.singelton.navBar.desactivateNext();
        }
        if (p.singelton.engines[p.singelton.activeIndex].cfg.educamosBarNav != undefined) {
            p.singelton.engines[p.singelton.activeIndex].navBar = p.singelton.navBar;
            p.singelton.engines[p.singelton.activeIndex].cfg.platform = p.singelton.cfg.platform;
        }
        
        for (var i = 0; i < p.singelton.engines.length; i++) {
            p.singelton.engines[i].visible = false;
        }

        p.singelton.engines[p.singelton.activeIndex].enabled = true;
        p.singelton.engines[p.singelton.activeIndex].run();
        p.singelton.engines[p.singelton.activeIndex].visible = true;
        
        if (p.singelton.engines[p.singelton.activeIndex].cfg.educamosBarNav == undefined) {
            p.singelton.addChild(p.singelton.navBar);
        }
        else {
            var repeatButton = p.singelton.engines[p.singelton.activeIndex].educamosBarNav.getButton("Repeat");
            p.singelton.engines[p.singelton.activeIndex].educamosBarNav.reset();
            //repeatButton.setEnabled(false);
        }
        
        p.singelton.setupObjects();
    };

    p.BaseEngine_stop = p.stop;
    p.stop = function () {
        this.running = false;
        for (var indexEngine = 0; indexEngine < this.engines.length; indexEngine++) {
            this.engines[indexEngine].stop();
        }
    };

    p.navigationBar_Click = function (navigationTool, accion, step) {
        if (p.singelton.cfg.autoEvaluate) {
            if (step == 1 && accion == "prev") {
                p.singelton.navBar.desactivatePrevious();
            } else {
                p.singelton.navBar.activatePrevious();
            }
            p.singelton.navBar.desactivateNext();
        }
        
        p.singelton.engines[p.singelton.activeIndex].stop();
        p.singelton.activeIndex = step - 1;
        
        if (p.singelton.engines[p.singelton.activeIndex].cfg.educamosBarNav != undefined) {
            p.singelton.engines[p.singelton.activeIndex].navBar = p.singelton.navBar;
            p.singelton.engines[p.singelton.activeIndex].cfg.platform = p.singelton.cfg.platform;
        }
        
        if (!p.singelton.engines[p.singelton.activeIndex].running) {
            p.singelton.engines[p.singelton.activeIndex].enabled = true;
            p.singelton.engines[p.singelton.activeIndex].run();
            if (p.singelton.cfg.platform == "Educamos") {
                var repeatButton = p.singelton.engines[p.singelton.activeIndex].educamosBarNav.getButton("Repeat");
                repeatButton.callbackClick = p.singelton.onRepeatActivity;
                //repeatButton.setEnabled(false);
            }
        }
        p.singelton.engines[p.singelton.activeIndex].visible = true;
    };

    p.BaseEngine_tick = p.tick;
    p.tick = function (event) {
        p.singelton.stage.update();
        p.singelton.BaseEngine_tick();
    };

    p.BaseEngine_onResizeWindow = p.onResizeWindow;
    p.onResizeWindow = function () {
        if (p.singelton != null) {
            p.singelton.resizeCanvas();
        }
    };

    p.BaseEngine_rescaleElements = p.rescaleElements;
    p.rescaleElements = function () {
        for (var indexEngine = 0; indexEngine < this.engines.length; indexEngine++) {
            this.engines[indexEngine].originalWidth = this.originalWidth;
            this.engines[indexEngine].originalHeight = this.originalHeight;
            this.engines[indexEngine].rescaleElements();
        }
    };

    p.BaseEngine_getSingelton = p.getSingelton;
    p.getSingelton = function () {
        return p.singelton;
    };

    p.BaseEngine_onEndActivity = p.onEndActivity;
    p.onEndActivity = function () {
        if (this.cfg.autoEvaluate) {
            if (this.activeIndex >= this.engines.length - 1) {
                if (this.animationEnd != null && this.animationEnd != undefined) {
                    this.removeChild(this.animationEnd);
                    this.addChild(this.animationEnd);
                    this.animationEnd.run(null);
                    
                    this.navBar.desactivatePrevious();
                    this.navBar.desactivateNext();
                }
                var engine = this.engines[this.activeIndex];
                if (this.cfg.platform == "SM") {
                    this.repeatButton = engine.getRepeatButton();
                    this.removeChild(this.repeatButton);
                    this.addChild(this.repeatButton);
                }
                else {
                    var repeatButton = engine.educamosBarNav.getButton("Repeat");
                    repeatButton.setEnabled(true);
                }
            } else {
                this.navBar.activateNext(true);
            }
        } else {
            if (this.animationEnd != null) {
                this.removeChild(this.animationEnd);
                this.addChild(this.animationEnd);
                this.animationEnd.run(null);
            }

            var engine = this.engines[this.activeIndex];
            this.removeChild(engine.getRepeatButton());
            this.addChild(engine.getRepeatButton());
            engine.getRepeatButton().callbackClick = this.onRepeatActivity;
        }
    };

    p.BaseEngine_onRepeatActivity = p.onRepeatActivity;
    p.onRepeatActivity = function () {
        var multiengine = this.parent.getSingelton();
        var engine = multiengine.engines[multiengine.activeIndex];
        if (multiengine.animationEnd != null) {
            multiengine.animationEnd.stop();
            multiengine.removeChild(multiengine.animationEnd);
        }
        multiengine.removeChild(engine.getRepeatButton());
        p.singelton.reset();
    };

    sm.MultiEngine = multiEngine;
} (window));
