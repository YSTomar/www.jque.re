/* jQuery.mousewheel (3.0.6). Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net) MIT License */
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function (d) {
    var b = ["DOMMouseScroll", "mousewheel"];
    if (d.event.fixHooks) {
        for (var a = b.length; a;) {
            d.event.fixHooks[b[--a]] = d.event.mouseHooks
        }
    }
    d.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var e = b.length; e;) {
                    this.addEventListener(b[--e], c, false)
                }
            } else {
                this.onmousewheel = c
            }
        },
        teardown: function () {
            if (this.removeEventListener) {
                for (var e = b.length; e;) {
                    this.removeEventListener(b[--e], c, false)
                }
            } else {
                this.onmousewheel = null
            }
        }
    };
    d.fn.extend({
        mousewheel: function (e) {
            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
        },
        unmousewheel: function (e) {
            return this.unbind("mousewheel", e)
        }
    });

    function c(j) {
        var h = j || window.event,
            g = [].slice.call(arguments, 1),
            k = 0,
            i = true,
            f = 0,
            e = 0;
        j = d.event.fix(h);
        j.type = "mousewheel";
        if (h.wheelDelta) {
            k = h.wheelDelta / 120
        }
        if (h.detail) {
            k = -h.detail / 3
        }
        e = k;
        if (h.axis !== undefined && h.axis === h.HORIZONTAL_AXIS) {
            e = 0;
            f = -1 * k
        }
        if (h.wheelDeltaY !== undefined) {
            e = h.wheelDeltaY / 120
        }
        if (h.wheelDeltaX !== undefined) {
            f = -1 * h.wheelDeltaX / 120
        }
        g.unshift(j, k, f, e);
        return (d.event.dispatch || d.event.handle).apply(this, g)
    }
})(jQuery);

/* jQuery transit (0.1.3). Copyright 2011, Rico Sta. Cruz MIT License */
/*!
 * jQuery Transit - CSS3 transitions and transformations
 * Copyright(c) 2011 Rico Sta. Cruz <rico@ricostacruz.com>
 * MIT Licensed.
 *
 * http://ricostacruz.com/jquery.transit
 * http://github.com/rstacruz/jquery.transit
 */
(function (k) {
    k.transit = {
        version: "0.1.3",
        propertyMap: {
            marginLeft: "margin",
            marginRight: "margin",
            marginBottom: "margin",
            marginTop: "margin",
            paddingLeft: "padding",
            paddingRight: "padding",
            paddingBottom: "padding",
            paddingTop: "padding"
        },
        enabled: true,
        useTransitionEnd: false
    };
    var d = document.createElement("div");
    var p = {};

    function b(u) {
        var t = ["Moz", "Webkit", "O", "ms"];
        var q = u.charAt(0).toUpperCase() + u.substr(1);
        if (u in d.style) {
            return u
        }
        for (var s = 0; s < t.length; ++s) {
            var r = t[s] + q;
            if (r in d.style) {
                return r
            }
        }
    }
    function e() {
        d.style[p.transform] = "";
        d.style[p.transform] = "rotateY(90deg)";
        return d.style[p.transform] !== ""
    }
    var a = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
    p.transition = b("transition");
    p.transitionDelay = b("transitionDelay");
    p.transform = b("transform");
    p.transformOrigin = b("transformOrigin");
    p.transform3d = e();
    k.extend(k.support, p);
    var i = {
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        WebkitTransition: "webkitTransitionEnd",
        msTransition: "MSTransitionEnd"
    };
    var f = p.transitionEnd = i[p.transition] || null;
    d = null;
    k.cssEase = {
        _default: "ease",
        "in": "ease-in",
        out: "ease-out",
        "in-out": "ease-in-out",
        snap: "cubic-bezier(0,1,.5,1)"
    };
    k.cssHooks.transform = {
        get: function (q) {
            return k(q).data("transform")
        },
        set: function (r, q) {
            var s = q;
            if (!(s instanceof j)) {
                s = new j(s)
            }
            if (p.transform === "WebkitTransform" && !a) {
                r.style[p.transform] = s.toString(true)
            } else {
                r.style[p.transform] = s.toString()
            }
            k(r).data("transform", s)
        }
    };
    k.cssHooks.transformOrigin = {
        get: function (q) {
            return q.style[p.transformOrigin]
        },
        set: function (q, r) {
            q.style[p.transformOrigin] = r
        }
    };
    n("scale");
    n("translate");
    n("rotate");
    n("rotateX");
    n("rotateY");
    n("rotate3d");
    n("perspective");
    n("skewX");
    n("skewY");
    n("x", true);
    n("y", true);

    function j(q) {
        if (typeof q === "string") {
            this.parse(q)
        }
        return this
    }
    j.prototype = {
        setFromString: function (s, r) {
            var q = (typeof r === "string") ? r.split(",") : (r.constructor === Array) ? r : [r];
            q.unshift(s);
            j.prototype.set.apply(this, q)
        },
        set: function (r) {
            var q = Array.prototype.slice.apply(arguments, [1]);
            if (this.setter[r]) {
                this.setter[r].apply(this, q)
            } else {
                this[r] = q.join(",")
            }
        },
        get: function (q) {
            if (this.getter[q]) {
                return this.getter[q].apply(this)
            } else {
                return this[q] || 0
            }
        },
        setter: {
            rotate: function (q) {
                this.rotate = o(q, "deg")
            },
            rotateX: function (q) {
                this.rotateX = o(q, "deg")
            },
            rotateY: function (q) {
                this.rotateY = o(q, "deg")
            },
            scale: function (q, r) {
                if (r === undefined) {
                    r = q
                }
                this.scale = q + "," + r
            },
            skewX: function (q) {
                this.skewX = o(q, "deg")
            },
            skewY: function (q) {
                this.skewY = o(q, "deg")
            },
            perspective: function (q) {
                this.perspective = o(q, "px")
            },
            x: function (q) {
                this.set("translate", q, null)
            },
            y: function (q) {
                this.set("translate", null, q)
            },
            translate: function (q, r) {
                if (this._translateX === undefined) {
                    this._translateX = 0
                }
                if (this._translateY === undefined) {
                    this._translateY = 0
                }
                if (q !== null) {
                    this._translateX = o(q, "px")
                }
                if (r !== null) {
                    this._translateY = o(r, "px")
                }
                this.translate = this._translateX + "," + this._translateY
            }
        },
        getter: {
            x: function () {
                return this._translateX || 0
            },
            y: function () {
                return this._translateY || 0
            },
            scale: function () {
                var q = (this.scale || "1,1").split(",");
                if (q[0]) {
                    q[0] = parseFloat(q[0])
                }
                if (q[1]) {
                    q[1] = parseFloat(q[1])
                }
                return (q[0] === q[1]) ? q[0] : q
            },
            rotate3d: function () {
                var r = (this.rotate3d || "0,0,0,0deg").split(",");
                for (var q = 0; q <= 3; ++q) {
                    if (r[q]) {
                        r[q] = parseFloat(r[q])
                    }
                }
                if (r[3]) {
                    r[3] = o(r[3], "deg")
                }
                return r
            }
        },
        parse: function (r) {
            var q = this;
            r.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function (s, u, t) {
                q.setFromString(u, t)
            })
        },
        toString: function (s) {
            var r = [];
            for (var q in this) {
                if (this.hasOwnProperty(q)) {
                    if ((!p.transform3d) && ((q === "rotateX") || (q === "rotateY") || (q === "perspective") || (q === "transformOrigin"))) {
                        continue
                    }
                    if (q[0] !== "_") {
                        if (s && (q === "scale")) {
                            r.push(q + "3d(" + this[q] + ",1)")
                        } else {
                            if (s && (q === "translate")) {
                                r.push(q + "3d(" + this[q] + ",0)")
                            } else {
                                r.push(q + "(" + this[q] + ")")
                            }
                        }
                    }
                }
            }
            return r.join(" ")
        }
    };

    function m(r, q, s) {
        if (q === true) {
            r.queue(s)
        } else {
            if (q) {
                r.queue(q, s)
            } else {
                s()
            }
        }
    }
    function h(r) {
        var q = [];
        k.each(r, function (s) {
            s = k.camelCase(s);
            s = k.transit.propertyMap[s] || s;
            s = c(s);
            if (k.inArray(s, q) === -1) {
                q.push(s)
            }
        });
        return q
    }
    function g(r, u, w, q) {
        var s = h(r);
        if (k.cssEase[w]) {
            w = k.cssEase[w]
        }
        var v = "" + l(u) + " " + w;
        if (parseInt(q, 10) > 0) {
            v += " " + l(q)
        }
        var t = [];
        k.each(s, function (y, x) {
            t.push(x + " " + v)
        });
        return t.join(", ")
    }
    k.fn.transition = k.fn.transit = function (y, r, x, B) {
        var C = this;
        var t = 0;
        var v = true;
        if (typeof r === "function") {
            B = r;
            r = undefined
        }
        if (typeof x === "function") {
            B = x;
            x = undefined
        }
        if (typeof y.easing !== "undefined") {
            x = y.easing;
            delete y.easing
        }
        if (typeof y.duration !== "undefined") {
            r = y.duration;
            delete y.duration
        }
        if (typeof y.complete !== "undefined") {
            B = y.complete;
            delete y.complete
        }
        if (typeof y.queue !== "undefined") {
            v = y.queue;
            delete y.queue
        }
        if (typeof y.delay !== "undefined") {
            t = y.delay;
            delete y.delay
        }
        if (typeof r === "undefined") {
            r = k.fx.speeds._default
        }
        if (typeof x === "undefined") {
            x = k.cssEase._default
        }
        r = l(r);
        var D = g(y, r, x, t);
        var A = k.transit.enabled && p.transition;
        var s = A ? (parseInt(r, 10) + parseInt(t, 10)) : 0;
        if (s === 0) {
            var z = function (E) {
                    C.css(y);
                    if (B) {
                        B()
                    }
                    E()
                };
            m(C, v, z);
            return C
        }
        var w = {};
        var q = function (G) {
                var F = false;
                var E = function () {
                        if (F) {
                            C.unbind(f, E)
                        }
                        if (s > 0) {
                            C.each(function () {
                                this.style[p.transition] = (w[this] || null)
                            })
                        }
                        if (typeof B === "function") {
                            B.apply(C)
                        }
                        if (typeof G === "function") {
                            G()
                        }
                    };
                if ((s > 0) && (f) && (k.transit.useTransitionEnd)) {
                    F = true;
                    C.bind(f, E)
                } else {
                    window.setTimeout(E, s)
                }
                C.each(function () {
                    if (s > 0) {
                        this.style[p.transition] = D
                    }
                    k(this).css(y)
                })
            };
        var u = function (F) {
                var E = 0;
                if ((p.transition === "MozTransition") && (E < 25)) {
                    E = 25
                }
                window.setTimeout(function () {
                    q(F)
                }, E)
            };
        m(C, v, u);
        return this
    };

    function n(r, q) {
        if (!q) {
            k.cssNumber[r] = true
        }
        k.transit.propertyMap[r] = p.transform;
        k.cssHooks[r] = {
            get: function (u) {
                var s = k(u).css("transform") || new j();
                return s.get(r)
            },
            set: function (u, v) {
                var s = k(u).css("transform") || new j();
                s.setFromString(r, v);
                k(u).css({
                    transform: s
                })
            }
        }
    }
    function c(q) {
        return q.replace(/([A-Z])/g, function (r) {
            return "-" + r.toLowerCase()
        })
    }
    function o(r, q) {
        if ((typeof r === "string") && (!r.match(/^[\-0-9\.]+$/))) {
            return r
        } else {
            return "" + r + q
        }
    }
    function l(r) {
        var q = r;
        if (k.fx.speeds[q]) {
            q = k.fx.speeds[q]
        }
        return o(q, "ms")
    }
    k.transit.getTransitionValue = g
})(jQuery);

/* jQuery TouchSwipe (1.2.5). Copyright (c) 2010 Matt Bryson (www.skinkers.com) Dual licensed under the MIT or GPL Version 2 licenses. */
(function (a) {
    a.fn.swipe = function (c) {
        if (!this) {
            return false
        }
        var k = {
            fingers: 1,
            threshold: 75,
            swipe: null,
            swipeLeft: null,
            swipeRight: null,
            swipeUp: null,
            swipeDown: null,
            swipeStatus: null,
            click: null,
            triggerOnTouchEnd: true,
            allowPageScroll: "auto"
        };
        var m = "left";
        var l = "right";
        var d = "up";
        var s = "down";
        var j = "none";
        var u = "horizontal";
        var q = "vertical";
        var o = "auto";
        var f = "start";
        var i = "move";
        var h = "end";
        var n = "cancel";
        var t = "ontouchstart" in window,
            b = t ? "touchstart" : "mousedown",
            p = t ? "touchmove" : "mousemove",
            g = t ? "touchend" : "mouseup",
            r = "touchcancel";
        var e = "start";
        if (c.allowPageScroll == undefined && (c.swipe != undefined || c.swipeStatus != undefined)) {
            c.allowPageScroll = j
        }
        if (c) {
            a.extend(k, c)
        }
        return this.each(function () {
            var D = this;
            var H = a(this);
            var E = null;
            var I = 0;
            var x = {
                x: 0,
                y: 0
            };
            var A = {
                x: 0,
                y: 0
            };
            var K = {
                x: 0,
                y: 0
            };

            function z(N) {
                var M = t ? N.touches[0] : N;
                e = f;
                if (t) {
                    I = N.touches.length
                }
                distance = 0;
                direction = null;
                if (I == k.fingers || !t) {
                    x.x = A.x = M.pageX;
                    x.y = A.y = M.pageY;
                    if (k.swipeStatus) {
                        y(N, e)
                    }
                } else {
                    C(N)
                }
                D.addEventListener(p, J, false);
                D.addEventListener(g, L, false)
            }
            function J(N) {
                if (e == h || e == n) {
                    return
                }
                var M = t ? N.touches[0] : N;
                A.x = M.pageX;
                A.y = M.pageY;
                direction = v();
                if (t) {
                    I = N.touches.length
                }
                e = i;
                G(N, direction);
                if (I == k.fingers || !t) {
                    distance = B();
                    if (k.swipeStatus) {
                        y(N, e, direction, distance)
                    }
                    if (!k.triggerOnTouchEnd) {
                        if (distance >= k.threshold) {
                            e = h;
                            y(N, e);
                            C(N)
                        }
                    }
                } else {
                    e = n;
                    y(N, e);
                    C(N)
                }
            }
            function L(M) {
                M.preventDefault();
                distance = B();
                direction = v();
                if (k.triggerOnTouchEnd) {
                    e = h;
                    if ((I == k.fingers || !t) && A.x != 0) {
                        if (distance >= k.threshold) {
                            y(M, e);
                            C(M)
                        } else {
                            e = n;
                            y(M, e);
                            C(M)
                        }
                    } else {
                        e = n;
                        y(M, e);
                        C(M)
                    }
                } else {
                    if (e == i) {
                        e = n;
                        y(M, e);
                        C(M)
                    }
                }
                D.removeEventListener(p, J, false);
                D.removeEventListener(g, L, false)
            }
            function C(M) {
                I = 0;
                x.x = 0;
                x.y = 0;
                A.x = 0;
                A.y = 0;
                K.x = 0;
                K.y = 0
            }
            function y(N, M) {
                if (k.swipeStatus) {
                    k.swipeStatus.call(H, N, M, direction || null, distance || 0)
                }
                if (M == n) {
                    if (k.click && (I == 1 || !t) && (isNaN(distance) || distance == 0)) {
                        k.click.call(H, N, N.target)
                    }
                }
                if (M == h) {
                    if (k.swipe) {
                        k.swipe.call(H, N, direction, distance)
                    }
                    switch (direction) {
                    case m:
                        if (k.swipeLeft) {
                            k.swipeLeft.call(H, N, direction, distance)
                        }
                        break;
                    case l:
                        if (k.swipeRight) {
                            k.swipeRight.call(H, N, direction, distance)
                        }
                        break;
                    case d:
                        if (k.swipeUp) {
                            k.swipeUp.call(H, N, direction, distance)
                        }
                        break;
                    case s:
                        if (k.swipeDown) {
                            k.swipeDown.call(H, N, direction, distance)
                        }
                        break
                    }
                }
            }
            function G(M, N) {
                if (k.allowPageScroll == j) {
                    M.preventDefault()
                } else {
                    var O = k.allowPageScroll == o;
                    switch (N) {
                    case m:
                        if ((k.swipeLeft && O) || (!O && k.allowPageScroll != u)) {
                            M.preventDefault()
                        }
                        break;
                    case l:
                        if ((k.swipeRight && O) || (!O && k.allowPageScroll != u)) {
                            M.preventDefault()
                        }
                        break;
                    case d:
                        if ((k.swipeUp && O) || (!O && k.allowPageScroll != q)) {
                            M.preventDefault()
                        }
                        break;
                    case s:
                        if ((k.swipeDown && O) || (!O && k.allowPageScroll != q)) {
                            M.preventDefault()
                        }
                        break
                    }
                }
            }
            function B() {
                return Math.round(Math.sqrt(Math.pow(A.x - x.x, 2) + Math.pow(A.y - x.y, 2)))
            }
            function w() {
                var P = x.x - A.x;
                var O = A.y - x.y;
                var M = Math.atan2(O, P);
                var N = Math.round(M * 180 / Math.PI);
                if (N < 0) {
                    N = 360 - Math.abs(N)
                }
                return N
            }
            function v() {
                var M = w();
                if ((M <= 45) && (M >= 0)) {
                    return m
                } else {
                    if ((M <= 360) && (M >= 315)) {
                        return m
                    } else {
                        if ((M >= 135) && (M <= 225)) {
                            return l
                        } else {
                            if ((M > 45) && (M < 135)) {
                                return s
                            } else {
                                return d
                            }
                        }
                    }
                }
            }
            try {
                this.addEventListener(b, z, false);
                this.addEventListener(r, C)
            } catch (F) {}
        })
    }
})(jQuery);