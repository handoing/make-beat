var soundeBean = {
    $tempo: 60,
    _step: 1,
    _clock: -1,
    _playing: false,
    init: function() {
        var self = this,
            tempo = 60;

        this.$bean = $(".default-bean");
        this.$btn = $("#c-btn");

        this.$tempo = self.bpmCalculator(tempo);
        this.soundMap = self.createSoundeMap();

        this.loadKit();
        this.bindEvent();

    },
    bindEvent: function() {
        var self = this;
        
        self.$bean.on('click', function () {
            var $this = $(this);
            $this.toggleClass('on');
            if (!self._playing && $this.hasClass('on')) {
                s = self.soundMap[$this.parent().attr('data-sound')];
                s.currentTime = 0;
                s.play();
            }
        });

        $('#c-btn').on('click', function() {
            var $this = $(this);
            $this.toggleClass('yes');

            $this.hasClass('yes') ? self.startClock() : self.stopClock();
        });
    },
    bpmCalculator: function(bpm) {
        return 60 / bpm;
    },
    createAudio: function() {
        return document.createElement('audio');
    },
    createSoundeMap: function() {
        var _soundMap = {};
        for (var key in _kit.default) {
            _soundMap[key] = this.createAudio();
        }
        return _soundMap;
    },
    loadKit: function(key) {
        var self = this;
        key = (typeof (key) != 'undefined') ? key : 'default';

        if (typeof (_kit[key]) != 'undefined') {
            var k = _kit[key];
            for (var keyName in k) {
                $(self.soundMap[keyName]).attr('src', k[keyName]);
            }
        }

        console.log("Load kit: " + key);
    },
    paint: function(index) {
        this.$bean.removeClass('active');
        $('.c'  + index).addClass('active');
    },
    makeBeats: function() {
        var self = this;
        self._step = self._step == 16 ? 1 : self._step + 1;
        self.paint(self._step);
        for (s in self.soundMap) {
            if ($('#' + s + '-' + self._step).hasClass('on')) {
                _s = self.soundMap[s];
                _s.currentTime = 0;
                _s.play();
            }
        }
    },
    startClock: function() {
        var self  = this;
        self._playing = true;
        self._step = 0;
        self.makeBeats();
        self._clock = setInterval(function() {
            self.makeBeats();
        }, 1000 * self.$tempo / 4);
        self.$btn.text("暂停");
    },
    stopClock: function() {
        var self = this;
        self._playing = false;
        clearInterval(self._clock);
        self.$bean.removeClass('active');
        self.$btn.text("开始");
    },
};

$(function() {
    soundeBean.init();
});