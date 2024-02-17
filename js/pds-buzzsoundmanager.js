this.pds = this.pds || {};

(function (window) {
    var soundManager = function () {
        this.initialize();
    };

    var p = soundManager.prototype;

    p.initialize = function () {
        this.audiosPath = "";
        this.registerSounds = [];
        this.playAllowed = false;
        this.audioFormat = null;
        
        buzz.defaults.formats = ['ogg', 'mp3'];
        if ((buzz['isMP3Supported']() || 'no') != 'no') {
            this.audioFormat = ".mp3";
        }
        else {
            if ((buzz['isOGGSupported']() || 'no') != 'no') {
                this.audioFormat = ".ogg";
            }
        }
    };

    p.inicializarSnd = function(pathAudios, arrayAudios) {
        if (!buzz.isSupported()) {
            console.log("Sistema de sonido no soportado.");
            return false;
        }
        this.playAllowed = true;

        if (arrayAudios != undefined && pathAudios != undefined) {
            this.audiosPath = pathAudios;
            for (var fx = 0 in arrayAudios) {
                this.registrarAudio(arrayAudios[fx]);
            }
        }

        return this.playAllowed;
    };


    p.registrarEventListener = function(eventType, callbackEventListener) {
        
    };

    p.registrarAudio = function(id, onReadyCallback) {
        var audioSrc = null;
        if (id != undefined && this.playAllowed) {

            audioSrc = new buzz.sound(this.audiosPath + id, {
                formats: ["ogg", "mp3"],
                preload: true,
                autoload: true,
                loop: false
            });
            
            audioSrc.sound._soundId = id;
            audioSrc.setVolume(100);
            audioSrc.sound._onReadyCallback = onReadyCallback;

            if (onReadyCallback != undefined) {
                audioSrc.sound.addEventListener("loadeddata", this.onReady);
            }
            
            this.registerSounds.push(audioSrc);
            
        }

        return audioSrc;
    };

    p.play = function(id, onPlayCallback, onEndCallback, onTimeUpdateCallback) {
        if (this.playAllowed && id != undefined){
            for (var snd in this.registerSounds) {
                if (this.registerSounds[snd].sound._soundId == id) {
                    var instance = this.registerSounds[snd];

                    instance.sound._onPlayCallback = onPlayCallback;
                    instance.sound._onEndCallback = onEndCallback;
                    instance.sound._onTimeUpdateCallback = onTimeUpdateCallback;

                    if (instance.sound._onPlayCallback != undefined) {
                        instance.sound.addEventListener("play", this.onPlay); //OK
                    }
                    if (instance.sound._onEndCallback != undefined) {
                        instance.sound.addEventListener("ended", this.onEnded); //OK
                    }
                    if (instance.sound._onTimeUpdateCallback != undefined) {
                        instance.sound.addEventListener("timeupdate", this.onTimeUpdate); //OK
                    }
                    
                    instance.play();
                    return instance.sound;
                }
            }
        }
        return null;
    };
    
    p.onReady = function(event) {
        console.log("Sonido " + this._soundId + " Evento: ready.");
        if (this._onReadyCallback != undefined && this._onReadyCallback != null) {
            this._onReadyCallback(event, this._soundId);
            this._onReadyCallback = undefined;
            this.removeEventListener("loadeddata", this.onReady);
        }
    };

    p.onPlay = function(event) {
        console.log("Sonido " + this._soundId + " Evento: play.");
        if (this._onPlayCallback != undefined && this._onPlayCallback != null) {
            this._onPlayCallback(event, this._soundId);
            this.removeEventListener("play", this.onPlay);
        }
    };
    
    p.onEnded = function(event) {
        console.log("Sonido " + this._soundId + " Evento: ended.");
        if (this._onEndCallback != undefined && this._onEndCallback != null) {
            this._onEndCallback(event, this._soundId);
            this.removeEventListener("ended", this.onEnded);
            this.removeEventListener("timeupdate", this.onTimeUpdate);
        }
    };
    
    p.onTimeUpdate = function(event) {
        console.log("Sonido " + this._soundId + " Evento: timeupdate.");
        if (this._onTimeUpdateCallback != undefined) {
            this._onTimeUpdateCallback(event, this._soundId);
            this.removeEventListener("timeupdate", this.onTimeUpdate);
        }
    };
    
    p.stop = function(id) {
        if (this.playAllowed && id != undefined){
            for (var snd in this.registerSounds) {
                if (this.registerSounds[snd].sound._soundId == id) {
                    this.registerSounds[snd].stop();
                    break;
                }
            }
        }
    };
    
    p.pause = function(id) {
        if (this.playAllowed && id != undefined){
            for (var snd in this.registerSounds) {
                if (this.registerSounds[snd].sound._soundId == id) {
                    this.registerSounds[snd].pause();
                    break;
                }
            }
        }
    };
    
        
    p.isPaused = function(id) {
        var result = false;
        if (this.playAllowed && id != undefined){
            for (var snd in this.registerSounds) {
                if (this.registerSounds[snd].sound._soundId == id) {
                    result = this.registerSounds[snd].isPaused();
                    break;
                }
            }
        }
        return result;
    };
    
    p.getDuration = function(id) {
        var result = 0;
        if (this.playAllowed && id != undefined){
            for (var snd in this.registerSounds) {
                if (this.registerSounds[snd].sound._soundId == id) {
                    result = this.registerSounds[snd].sound.duration;
                    break;
                }
            }
        }
        return result;
    };
    
    p.togglePlay = function(id) {
        if (this.playAllowed && id != undefined){
            for (var snd in this.registerSounds) {
                if (this.registerSounds[snd].sound._soundId == id) {
                    if (this.registerSounds[snd].sound.paused) {
                        this.registerSounds[snd].togglePlay();
                    } else {
                        this.registerSounds[snd].pause();
                    }
                    break;
                }
            }
        }
    };
    
    p.borrarTodosSonidos = function() {
        if (this.playAllowed){
            this.registerSounds = [];
        }
    };

    pds.SoundManager = soundManager;
    
} (window));

$(document).ready(function() {
    SoundManager = new pds.SoundManager();
});