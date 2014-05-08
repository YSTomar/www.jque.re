jQuery.extend(jQuery.easing, {
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	}
});



(function($, window, document, undefined) {
	
	function DroidMomentum() {
		
		this.opt = { overshoot: 250, snapback: 500, easing: 'easeOutSine' }; // overshoot & snapback in msec
		this.reset();
		
	}
	
	$.extend(DroidMomentum.prototype, {
		
		start: function(pos, spd, dur, min, max) {
			
			this.o = { pos: pos, min: min, max: max, spd: spd, stt: (new Date()).getTime(), ste: ((spd !== 0) ? ((pos < min || pos > max) ? 'snapback' : 'scrolling') : 'done') }; // spd: speed, stt: starttime, ste: state
			$.extend(this.o, (this.o.ste == 'snapback') ? { dur: this.opt.snapback, src: pos, dst: ((pos < min) ? min : max) } : { dur: dur, src: 0, dst: 0 });
			
		},
		
		reset: function() {
			
			this.o = { pos: 0, min: 0, max: 0, spd: 0, dur: 0, src: 0, dst: 0, ste: 'done' };
			
		},
		
		update: function() {
			if (this.o.ste == 'done') return this.o.pos;
			
			var elapsed = (((new Date()).getTime() - this.o.stt) > this.o.dur) ? this.o.dur : (new Date()).getTime() - this.o.stt;
			
			if (this.o.ste == 'scrolling' || this.o.ste == 'overshot') {
				var inc = this.o.spd * (1 - $.easing[this.opt.easing](elapsed / this.o.dur, elapsed, 0, 1, this.o.dur));
				var old = this.o.pos + inc;
				var overshot = (this.o.ste == 'scrolling') && ((this.o.pos + inc) < this.o.min || (this.o.pos + inc) > this.o.max);
				
				this.o.pos = (overshot) ? (((this.o.pos + inc) < this.o.min) ? this.o.min : this.o.max) : this.o.pos + inc;
			}
			
			switch (this.o.ste) {
				case 'scrolling': $.extend(this.o, ((overshot) ? { ste: 'overshot', spd: inc / 2, dur: this.opt.overshoot, stt: (new Date()).getTime() } : (elapsed >= this.o.dur) ? { ste: 'done' } : {})); break;
				case 'overshot': $.extend(this.o, ((elapsed >= this.o.dur) ? { ste: 'snapback', src: this.o.pos, dst: ((old < this.o.min) ? this.o.min : this.o.max), dur: this.opt.snapback, stt: (new Date()).getTime() } : {})); break;
				case 'snapback': $.extend(this.o, ((elapsed >= this.o.dur) ? { ste: 'done', pos: this.o.dst } : { pos: (this.o.src + ((this.o.dst - this.o.src) * $.easing[this.opt.easing](elapsed / this.o.dur, elapsed, 0, 1, this.o.dur))) })); break;
			}
			
			return this.o.pos;
		},
		
		done: function() {
			return (this.o.ste == 'done');
		},
		
		getPos: function() {
			return this.o.pos;
		},
		
		getSpeed: function() {
			return this.o.spd;
		},
		
		getState: function() {
			return this.o.ste;
		}
		
	});	
	
	
	
	function DroidScroll(e, opt) {
		
		this.opt = $.extend({ fps: 100, int: 1000, dir: null, scr: false }, opt); // fps: in msec, int; interval in msec, dir: direction; 'vertical', 'horizontal' or null for both, scr: scrollthis; is this element the main focus for keypresses?
		this.opt.scr = !!($(e).data('droidscroll-scr'));
		
		this.wrap = $(e).addClass('droidscroll').wrapInner('<div class="droidscroll-view"/>');
		this.view = this.wrap.children('.droidscroll-view');
		
		this.view.addClass((this.opt.dir) ? ('droidscroll-view-' + this.opt.dir) : '');
		
		// Take existing scroll position and reset it
		var st = e.scrollTop || this.wrap[0].scrollTop;
		var sl = e.scrollLeft || this.wrap[0].scrollLeft;
		
		this.view.css({ 'top': -st, 'left': -sl });
		this.wrap[0].scrollTop = this.wrap[0].scrollLeft = e.scrollTop = e.scrollLeft = 0; 
		
		// Initialize momentum(s)
		this.mH = (this.opt.dir !== 'vertical') ? new DroidMomentum() : null;
		this.mV = (this.opt.dir !== 'horizontal') ? new DroidMomentum() : null;
		
		this.initBehaviors();
		this.addBehaviors();
		this.addBars();
		
	}
	
	$.extend(DroidScroll.prototype, {
		
		start: function(speedX, speedY) {
			
			this.stop();
			this.showBars();
			
			if (this.mH) this.mH.start(parseInt(this.view.css('left'), 10), speedX, this.opt.int, (this.view.width() > this.wrap.width()) ? -(this.view.width() - this.wrap.width()) : 0, 0);
			if (this.mV) this.mV.start(parseInt(this.view.css('top'), 10), speedY, this.opt.int, (this.view.height() > this.wrap.height()) ? -(this.view.height() - this.wrap.height()) : 0, 0);
			
			this.handleMomentum(true);
			
		},
		
		stop: function() {
			
			if (this.id) window.clearTimeout(this.id);
			this.id = 0;
			
			if (this.mH) this.mH.reset();
			if (this.mV) this.mV.reset();
			
			this.hideBars();
			this.view.removeClass('droidscroll-has-momentum');
			
		},
		
		setPos: function(x, y) {
			
			if (x !== null) this.view.css({ 'left': parseInt(x, 10) + 'px' });
			if (y !== null) this.view.css({ 'top': parseInt(y, 10) + 'px' });
			
			if (x !== null && this.hBar) this.hBar.find('.droidscroll-thumb').css('left', (-x / this.view.width() * 100) + '%');
			if (y !== null && this.vBar) this.vBar.find('.droidscroll-thumb').css('top', (-y / this.view.height() * 100) + '%');
			
		},
		
		handleMomentum: function(noUpdate) {
			
			if (!noUpdate) {
				if (this.mH) this.mH.update();
				if (this.mV) this.mV.update();
				
				this.setPos((this.mH) ? this.mH.getPos() : 0, (this.mV) ? this.mV.getPos() : 0);
			}
			
			if (((this.mH) ? this.mH.done() : true) && ((this.mV) ? this.mV.done() : true)) { // finished?
				this.stop();
			} else {
				this.view.addClass('droidscroll-has-momentum');
				this.id = window.setTimeout(this.mCallback, this.opt.int / this.opt.fps);
			}
			
		},
		
		handleMouseDown: function(evt, scrolling) {
			var target = evt.target.nodeName.toLowerCase();
			
			if ((!scrolling) && ((target === 'pre') || (target === 'code'))) return true; // Prevent dragging on pre or code blocks (so text selection is possible) except when called by the scroll routine
			
			if ((this.mH && this.mH.getState() === 'snapback') || (this.mV && this.mV.getState() === 'snapback')) { // Try to prevent to 'freezeclicking' when overshooting
				evt.preventDefault();
				return false;
			}
			
			this.view.addClass('droidscroll-grabbing');
			this.stop();
			
			this.doSnapBackX = this.doSnapBackY = false;
			this.speedX = this.speedY = 0;
			
			this.lastX = (this.mH) ? evt.clientX : this.lastX;
			this.lastY = (this.mV) ? evt.clientY : this.lastY;
			
			if (this.mH || this.mV) this.sizeBars();
			
			$(document).bind({ mousemove: this.mouseMove, mouseup: this.mouseUp, mouseout: this.mouseUp });
			
			evt.preventDefault(); // To prevent selection of text etc - NOTE: Doing this on touch devices disables generation of 'click' events!
			
		},
		
		handleMouseMove: function(evt) {
			
			if (this.mH) {
				var left = parseInt(this.view.css('left'), 10);
				var x = left + (evt.clientX - this.lastX);
				
				if (x > 0 || x < this.maxX) {
					x = left + ((evt.clientX - this.lastX) / 2);
					this.doSnapBackX = true;
				}
				
				this.speedX = evt.clientX - this.lastX;
				this.lastX = evt.clientX;
				this.doSnapBackX = false;
			}
			
			if (this.mV) {
				var top = parseInt(this.view.css('top'), 10);
				var y = top + (evt.clientY - this.lastY);
				
				if (y > 0 || y < this.maxY) {
					y = top + ((evt.clientY - this.lastY) / 2);
					this.doSnapBackY = true;
				}
				
				this.speedY = evt.clientY - this.lastY;
				this.lastY = evt.clientY;
				this.doSnapBackY = false;
			}
			
			this.setPos(x || null, y || null);
			this.showBars();
			
			evt.preventDefault(); // To prevent selection of text etc - NOTE: Doing this on touch devices disables generation of 'click' events!
			
		},
		
		handleMouseUp: function(evt) {
			var x = (this.mH && this.speedX) ? this.speedX : (this.doSnapBackX ? 1 : 0);
			var y = (this.mV && this.speedY) ? this.speedY : (this.doSnapBackY ? 1 : 0);
			
			if (x || y) this.start(x, y); else this.hideBars();
			
			$(document).unbind({ mousemove: this.mouseMove, mouseup: this.mouseUp, mouseout: this.mouseUp });
			
			this.view.removeClass('droidscroll-grabbing');
			
		},
		
		handleMouseScroll: function(evt) {
			// To prevent 'sticking' when already overshooting NOTE: better to remove it and reset the speed when both overshot/snapback and going in the direction it's going?
			if ((this.mH && this.doSnapBackX && !this.mH.done()) || (this.mV && this.doSnapBackY && !this.mV.done())) return;
			
			var delta = (evt.wheelDelta) ? ((window.opera) ? -evt.wheelDelta : evt.wheelDelta) : -evt.detail / 3;
			delta = (delta < -1) ? -1 : (delta > 1) ? 1 : delta;
			if (delta == 0) return;
			
			var distance = (delta * delta) * ((delta > 0) ? 5 : -5); // NOTE: 5 = scrolling distance
			
			// Prevent scrolling if there is either nothing to scroll to or outside the boundaries -- dragging is allowed, though
			if (evt.originalEvent.axis !== 1 && (this.view.height() <= this.wrap.height() || (delta < 0 && (this.wrap.height() + -(parseInt(this.view.css('top'), 10))) === this.view.height()) || (delta > 0 && parseInt(this.view.css('top'), 10) >= 0) || (delta < 0 && ((-(this.view.offset().top) + this.wrap.height()) === this.view.height())))) return;
			if (evt.originalEvent.axis === 1 && (this.view.width() <= this.wrap.width() || (delta < 0 && (this.wrap.width() + -(parseInt(this.view.css('left'), 10))) === this.view.width()) || (delta > 0 && parseInt(this.view.css('left'), 10) >= 0) || (delta < 0 && ((-(this.view.offset().left) + this.wrap.width()) === this.view.width())))) return;
			
			// Acceleration
			distance += (this.mH && evt.originalEvent.axis === 1 && ((delta < 0 && this.mH.getSpeed() < -1) || (delta > 0 && this.mH.getSpeed() > 1))) ? this.mH.getSpeed() : 0;
			distance += (this.mV && evt.originalEvent.axis !== 1 && ((delta < 0 && this.mV.getSpeed() < -1) || (delta > 0 && this.mV.getSpeed() > 1))) ? this.mV.getSpeed() : 0;
			
			this.handleMouseDown(evt, true);
			
			evt.clientX += (this.mH && evt.originalEvent.axis === 1) ? distance : 0;
			evt.clientY += (this.mV && evt.originalEvent.axis !== 1) ? distance : 0;
			
			this.handleMouseMove(evt);
			this.handleMouseUp();
			
			evt.preventDefault();
			evt.stopPropagation(); //?
			
		},
		
		handleMouseClick: function(evt) {
			
			// Intercept in-page anchors
			if (evt.target.href && (evt.target.href.indexOf('#') !== -1)) {
				evt.preventDefault();
				evt.stopPropagation();
				
				var e = $(evt.target.href.substring(evt.target.href.indexOf('#')));
				
				var x = -((this.mH) ? ((e.offset().left - parseInt(this.view.css('left'), 10)) - parseInt(e.css('marginLeft'), 10)) : parseInt(this.view.css('left'), 10));
				var y = -((this.mV) ? ((e.offset().top - parseInt(this.view.css('top'), 10)) - parseInt(e.css('marginTop'), 10)) : parseInt(this.view.css('top'), 10));
				
				this.stop();
				this.setPos(x, y);
				
				return false;
			}
			
			// Intercept clicking on anchors when movement is in progress
			if ((this.mH && !this.mH.done()) || (this.mV && !this.mV.done())) {
				evt.preventDefault();
				evt.stopPropagation();
				
				return false;
			}
			
		},
		
		handleKeyPress: function(evt) {
			if (evt.target.nodeType == 'textarea' || evt.target.nodeType == 'select' || evt.target.nodeType == 'input') return;
			if (!this.wrap.data('droidscroll-scr')) return; // Only if the data is set
			
			// NOTE: Quick hack for keyboard support. It's easy to fake a scroll event when left/up/right/down. But how to use this for pgup/pgdn/home/end? Therefore, setPos() directly for now.
			var x = null, y = null;
			
			switch (evt.keyCode) {
				case 33: y = (this.mV) ? ((parseInt(this.view.css('top'), 10) + this.wrap.height()) - 50) : null; break; // pgup
				case 34: y = (this.mV) ? ((parseInt(this.view.css('top'), 10) - this.wrap.height()) + 50) : null; break; // pgdn
				case 35: y = (this.mV) ? -(this.view.height() - this.wrap.height()) : null; break; // end
				case 36: y = (this.mV) ? 0 : null; break; // home
				case 37: x = (this.mH) ? (parseInt(this.view.css('left'), 10) + 50) : null; break; // left
				case 38: y = (this.mV) ? (parseInt(this.view.css('top'), 10) + 50) : null; break; // top
				case 39: x = (this.mH) ? (parseInt(this.view.css('left'), 10) - 50) : null; break; // right
				case 40: y = (this.mV) ? (parseInt(this.view.css('top'), 10) - 50) : null; break; // bottom
				default: return;
			}
			
			x = (x !== null && x < -(this.view.width() - this.wrap.width())) ? -(this.view.width() - this.wrap.width()) : (x !== null && x > 0) ? 0 : x;
			y = (y !== null && y < -(this.view.height() - this.wrap.height())) ? -(this.view.height() - this.wrap.height()) : (y !== null && y > 0) ? 0 : y;
			
			this.stop();
			this.setPos(x, y);
			
			this.showBars();
			
			if (this.barsTimeout == null) {
				var that = this;
				
				this.barsTimeout = setTimeout(function() {
					that.hideBars();
					clearTimeout(this);
					that.barsTimeout = null;
				}, this.opt.int);
			}
			
		},
		
		handleAnchorFocus: function(evt) {
			
			if (this.view.parent().scrollTop() > 0) {
				this.view.parent().scrollTop(0);
			}
			
			if ((evt.target.offsetTop + evt.target.offsetHeight) > this.wrap.height()) {
				// NOTE: Add 10 pixels so the anchors aren't flush with the bottom of the viewport.
				var x = (this.mH) ? (this.wrap.width() - (evt.target.offsetLeft + evt.target.offsetWidth)) - 10 : null;
				var y = (this.mV) ? (this.wrap.height() - (evt.target.offsetTop + evt.target.offsetHeight)) - 10 : null;
				
				this.stop();
				this.setPos(x, y);
			}
			
			evt.preventDefault();
			
			this.wrap.focus();
			
		},
		
		initBehaviors: function() {
			var that = this;
			
			this.mCallback = function() { that.handleMomentum(); };
			
			this.mouseMove = function(evt) { return that.handleMouseMove(evt); };
			this.mouseUp = function(evt) { return that.handleMouseUp(evt); };
			this.mouseDown = function(evt) { return that.handleMouseDown(evt); };
			this.mouseScroll = function(evt) { return that.handleMouseScroll(evt); };
			this.mouseClick = function(evt) { return that.handleMouseClick(evt); };
			this.anchorFocus = function(evt) { return that.handleAnchorFocus(evt); };
			this.keyPress = function(evt) { return that.handleKeyPress(evt); };
			
		},
		
		addBehaviors: function() {
			
			this.view.bind({ mousedown: this.mouseDown, mousewheel: this.mouseScroll, DOMMouseScroll: this.mouseScroll, click: this.mouseClick });
			
			if (this.opt.scr) $(document).keydown(this.keyPress);
			
			this.view.find('a').each(function() {
				$(this).focus(this.anchorFocus);
			});
			
		},
		
		addBars: function() {
			
			if (this.mH) {
				this.wrap.append('<div class="droidscroll-scrollbar droidscroll-scrollbar-horizontal"><div class="droidscroll-track"><div class="droidscroll-thumb"></div></div></div>');
				this.hBar = this.wrap.children('.droidscroll-scrollbar-horizontal');
			}
			
			if (this.mV) {
				this.wrap.append('<div class="droidscroll-scrollbar droidscroll-scrollbar-vertical"><div class="droidscroll-track"><div class="droidscroll-thumb"></div></div></div>');
				this.vBar = this.wrap.children('.droidscroll-scrollbar-vertical');
			}
			
		},
		
		showBars: function() {
			
			this.sizeBars();
			
			if (this.hBar) this.hBar.addClass('droidscroll-scrollbar-visible');
			if (this.vBar) this.vBar.addClass('droidscroll-scrollbar-visible');
			
		},
		
		hideBars: function() {
			
			if (this.hBar) this.hBar.removeClass('droidscroll-scrollbar-visible');
			if (this.vBar) this.vBar.removeClass('droidscroll-scrollbar-visible');
			
		},
		
		sizeBars: function() {
			
			if (this.mH) {
				var ww = parseInt(this.wrap.width(), 10), vw = parseInt(this.view.width(), 10);
				
				this.maxX = ((ww - vw) > 0) ? 0 : ww - vw;
				
				if (this.hBar) this.hBar.find('.droidscroll-thumb').css({ width: (ww >= vw ? '100%' : Math.round(ww / vw * 100) + '%') });
			}
			
			if (this.mV) {
				var wh = parseInt(this.wrap.height(), 10), vh = parseInt(this.view.height(), 10);
				
				this.maxY = ((wh - vh) > 0) ? 0 : wh - vh;
				
				if (this.vBar) this.vBar.find('.droidscroll-thumb').css({ height: (wh >= vh ? '100%' : Math.round(wh / vh * 100) + '%') });
			}
			
		}
		
	});
	
	
	
	$.DroidScroll = DroidScroll;
	
	$.fn.extend({
		
		initDroidScroll: function(opt) {
			
			this.each(function() {
				$(this).data('initDroidScroll', new DroidScroll(this, opt));
			});
			
			return this;
		}
		
	});
	
})(jQuery, window, document);

