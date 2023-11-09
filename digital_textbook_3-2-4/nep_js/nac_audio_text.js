
// nac_audio_text.js

$(window).load(function () {
    var surfix = 1;
    $(".nac_audio_text").each(function () {
        var audio = $(this);
        if (!audio.hasClass("nac_animation"))
            return;

        var name = "n" + surfix++;
        var animatedColor = audio.attr("data-animated-color");
        var root = audio.find(".nac_audio_description")[0];
        var cur = NacHandler.nextNode(root, false, root);
        while (cur != null) {
            var next = NacHandler.nextNode(cur, false, root);
            if (cur.nodeType == 3 && !NacHandler.isAllWhiteSpace(cur)) {
                var value = cur.nodeValue;
                for (var i = 0; i < value.length; i++) {
                    var unit = $(document.createElement(name)).html(value[i]);
                    var color = window.getComputedStyle(cur.parentElement, null).getPropertyValue("color");
                    unit.css("background-image", "-webkit-gradient(linear, 0% 0%, 100% 0%, from(" + animatedColor + "), color-stop(0.5, " + animatedColor + "), color-stop(0.5, " + color + "), to(" + color + "))");
                    cur.parentNode.insertBefore(unit[0], cur);
                }
                cur.parentNode.removeChild(cur);
            }
            cur = next;
        }
        $(root).prepend("<style> " + name + " { -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-size:200% 100%; background-position:100%; } </style>");

        NacHandler.items.push(new NacHandler.item(audio, name));
    });
});

var NacHandler = {};

NacHandler.data = function (o, d, t) {
    this.object = o;
    this.duration = d;
    this.time = t;
}

NacHandler.items = new Array;

NacHandler.isAllWhiteSpace = function(node) {
    return /^\s*$/.test(node.textContent);
}

NacHandler.item = function (audio, name) {
    this.audio = audio;
    this.player = audio.find(".nac_player")[0];
    this.currentIndex = 0;
    this.paused = true;
    this.initialized = false;
    this.datas = new Array;
    this.init = function () {
        if (this.initialized)
            return true;
        if (this.player.duration == 0)
            return false;
        var cur = 0;
        var objects = this.audio.find(name);
        var duration = this.player.duration * 1000 / objects.length;
        for (var i = 0; i < objects.length; i++) {
            cur += duration;
            this.datas.push(new NacHandler.data(objects[i], duration, cur));
        }
        this.initialized = true;
        return true;
    }
    this.animate = function () {
        if (!this.initialized)
            return;
        this.paused = false;
        var data = this.datas[this.currentIndex];
        var duration = (this.player.currentTime * 1000 > (data.time - data.duration / 2) ? data.duration * 0.8 : data.duration);
        $(data.object).animate({ "background-position": "0%" }, duration, "linear", function () {
            var item = NacHandler.findItem($(this));
            if (item == null)
                return;
            if (item.paused)
                return;
            if (item.currentIndex == item.datas.length - 1)
                return;
            item.currentIndex++;
            item.animate();
        });
    }
    this.stop = function (now) {
        if (!this.initialized)
            return;
        if (now)
            $(this.datas[this.currentIndex].object).stop();
        this.paused = true;
    }
    this.seek = function (time) {
        if (!this.initialized)
            return;
        var data = this.datas[this.currentIndex];
        if (time <= data.time && time >= data.time - data.duration)
            return;
        for (var i = 0; i < this.datas.length; i++) {
            data = this.datas[i];
            if (time > data.time) {
                $(data.object).css("background-position", "0%");
            }
            else if (time < data.time - data.duration) {
                $(data.object).css("background-position", "100%");
            }
            else if (time <= data.time && time >= data.time - data.duration) {
                var progress = 100 * (data.time - time) / data.duration;
                $(data.object).css("background-position", progress + "%");
                this.currentIndex = i;
            }
        }
    }
}

NacHandler.nextAncestorSibling = function (node, bound) {
    var parent = node.parentNode;
    while (parent) {
        if (parent == bound)
            return null;
        if (parent.nextSibling)
            return parent.nextSibling;
        parent = parent.parentNode;
    }
    return null;
}

NacHandler.nextNode = function (node, skipChilds, bound) {
    if (node == null)
        return null;
    if (!skipChilds && node.firstChild)
        return node.firstChild;
    if (node == bound)
        return null;
    if (node.nextSibling)
        return node.nextSibling;
    return NacHandler.nextAncestorSibling(node, bound);
}

NacHandler.parentAudioText = function (child) {
    var cur = child.parent();
    while (cur.length > 0) {
        if (cur.hasClass("nac_audio_text"))
            return cur;
        cur = cur.parent();
    }
    return null;
}

NacHandler.findItem = function (media) {
    var parent = NacHandler.parentAudioText(media);
    if (parent == null)
        return null;

    for (var i = 0; i < NacHandler.items.length; i++) {
        if (NacHandler.items[i].audio[0] == parent[0])
            return NacHandler.items[i];
    }
    return null;
}

NacHandler.onMediaLoaded = function (media) {
    var item = NacHandler.findItem(media);
    if (item != null)
        item.init();
}

NacHandler.onMediaPlayed = function (media) {
    var count = 0;
    function animateItem(item) {
        count += 1;
        if (count > 200)
            return;
        else if (item.init())
            item.animate();
        else
            setTimeout(animateItem, 10, item);
    }

    var item = NacHandler.findItem(media);
    if (item != null)
        animateItem(item);
}

NacHandler.onMediaPaused = function (media) {
    var item = NacHandler.findItem(media);
    if (item != null)
        item.stop(false);
}

NacHandler.onMediaEnded = function (media) {
    NacHandler.onMediaPaused(media);
}

NacHandler.onMediaProgress = function (media, isPlaying, currentTime) {
    var item = NacHandler.findItem(media);
    if (item != null) {
        item.stop(true);
        item.seek(currentTime * 1000);
        if (isPlaying)
            item.animate();
    }
}





