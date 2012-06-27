PLAY_SUCCEEDED = "playSucceeded";
PLAY_FINISHED = "playFinished";
PLAY_FAILED = "playFailed";

AUDIO_READY = "canplaythrough";
AUDIO_ENDED = "ended";
AUDIO_PLAYED = "play";

/**
 * By default, JavaScript methods do not maintain scope, so passing a method as a callback will result in the
 * method getting called in the scope of the caller. Using a proxy ensures that the method gets called in the
 * correct scope. All internal callbacks use this approach.
 */
proxy = function (method, scope) {
    return function () {
        return method.apply(scope, arguments);
    }
};

function TWSound(src) {
    this.init(src);
}

var p = TWSound.prototype = {
    audio:null,

    src:null,

    playState:null,

    loaded:false,
    offset:0,
    volume:1,

    remainingLoops:0,
    muted:false,
    paused:false,

    onComplete:null,
    onLoop:null,
    onReady:null,

    endedHandler:null,
    readyHandler:null,
    stalledHandler:null,

    init:function (src) {
        this.src = src;
        this.audio = new Audio(this.src);

        this.endedHandler = proxy(this.handleSoundComplete, this);
        this.readyHandler = proxy(this.handleSoundReady, this);
    },

    cleanUp:function () {
        this.audio.pause();
        try {
            this.audio.currentTime = 0;
        } catch (error) {
        }
        this.audio.removeEventListener(AUDIO_ENDED, this.endedHandler, false);
        this.audio.removeEventListener(AUDIO_READY, this.readyHandler, false);
        this.audio = null;
    },

    load:function (offset, loop, volume) {

        if (this.audio == null) {
            this.playFailed();
            return -1;
        }

        this.audio.addEventListener(AUDIO_ENDED, this.endedHandler, false);

        this.offset = offset;
        this.volume = volume;
        this.updateVolume();
        this.remainingLoops = loop;

        if (this.audio.readyState !== 4) {
            this.audio.addEventListener(AUDIO_READY, this.readyHandler, false);
            this.audio.load();
        } else this.handleSoundReady(null);

        return 1;
    },

    handleSoundReady:function (event) {
        this.playState = PLAY_SUCCEEDED;
        this.paused = false;
        this.audio.removeEventListener(AUDIO_READY, this.readyHandler, false);

        if (this.offset >= this.getDuration()) {
            this.playFailed();
            return;
        }

        //this.audio.currentTime = this.offset;

        if (this.onReady != null) {
            this.onReady(this);
        }
    },

    handleSoundComplete:function (event) {
        if (this.remainingLoops != 0) {
            this.remainingLoops--;
            try {
                this.audio.currentTime = 0;
            } catch (error) {
            }
            this.audio.play();
            if (this.onLoop != null) {
                this.onLoop(this);
            }
            return;
        }
        this.playState = PLAY_FINISHED;

        if (this.onComplete != null) {
            this.onComplete(this);
        }
    },

    play:function () {
        this.audio.play();
        this.playState = AUDIO_PLAYED;
    },

    pause:function () {
        this.paused = true;
        this.audio.pause();
    },

    resume:function () {
        this.paused = false;
        this.audio.play();
    },

    stop:function () {
        this.pause();
        this.playState = PLAY_FINISHED;
        try {
            this.audio.currentTime = 0;
        } catch (error) {
        }
    },


    setVolume:function (value) {
        value = (value > 1.0) ? 1.0 : value;
        value = (value < 0.0) ? 0.0 : value;
        this.volume = value;
        this.updateVolume();
    },


    updateVolume:function () {
        this.audio.volume = this.muted ? 0 : this.volume;
    },

    getVolume:function () {
        return this.volume;
    },

    mute:function (isMuted) {
        this.muted = isMuted;
        this.updateVolume();
        return true;
    },

    getPosition:function () {
        return this.audio.currentTime;
    },

    setPosition:function (value) {
        try {
            this.audio.currentTime = value;
        } catch (error) {
        }
    },

    getDuration:function () {
        return this.audio.duration;
    },

    playFailed:function () {
        this.playState = PLAY_FAILED;
        this.cleanUp();
    }
};