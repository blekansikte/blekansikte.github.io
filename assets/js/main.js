(function ($, window, document, undefined) {
	var MODE = {
		paint: 1,
		erase: 0
	};

	var doPaint  = false,
		mode     = MODE.paint,
		color    = '#000000',
		$buttons = $('.js-btn-color'),
		$erase   = $('.js-btn-erase'),
		$clear   = $('.js-btn-clear'),
		$logo    = $('#logo'),
		eraser, data;

	var ctx = Sketch.create({
		autoclear: false,
		container: document.getElementById('canvas'),
		fullscreen: false,
		global: false,
		height: window.innerHeight,
		width: window.innerHeight * 0.7
	});

	ctx.mousedown = function () {
		doPaint = true;
	};

	ctx.mouseup = function () {
		doPaint = false;
	}

	ctx.touchmove = function () {
		if (!doPaint) return;

		for (var i = this.touches.length - 1, touch; i >= 0; i--) {
			touch = this.touches[i];

			if (mode === MODE.paint) {
				this.lineCap = 'round';
				this.lineJoin = 'round';
				this.fillStyle = this.strokeStyle = color;
				this.lineWidth = 5;

				this.beginPath();
				this.moveTo( touch.ox, touch.oy );
				this.lineTo( touch.x, touch.y );
				this.stroke();
			}
			
			if (mode === MODE.erase) {
				this.save();
				this.beginPath();
				this.arc(touch.ox, touch.oy, 10, 0, PI*2);
				this.clip();
				this.clearRect(0, 0, this.width, this.height);
				this.restore();
			}
		}
	};

	ctx.resize = function () {
		this.height = window.innerHeight;
		this.width = window.innerHeight * 0.7;
	};

	$(window).on('resize', function () {
		ctx.resize();
	});

	$buttons.on('click', function () {
		var $self = $(this);

		$buttons.removeClass('is-active');
		$self.addClass('is-active');
		color = $self.data('color');

		mode = MODE.paint;

		return false;
	});

	$erase.on('click', function () {
		mode = MODE.erase;

		return false;
	});

	$clear.on('click', function () {
		ctx.clear();

		return false;
	});

	/*$logo.on('click', function () {
		var tmp = ctx.getImageData(0, 0, ctx.width, ctx.height),
			ctx2 = $('#canvas2'),
			sw, sh;

		if (!data) {
			data = tmp;
		}

		if (ctx.width != data.width && ctx.height == data.height)  {
			sw = ((data.width - ctx.width) / 2) * -1;
			sh = ctx.height;

			ctx.putImageData(data, sw, 0);

			data = ctx.getImageData(0, 0, ctx.width, ctx.height);
		}

		if (ctx.height != data.height) {
			sw = +(data.width / ctx.width).toFixed(2);
			sh = +(data.height / ctx.height).toFixed(2);

			ctx2.attr({
				width: data.width,
				height: data.height
			});

			ctx2 = ctx2[0];
			ctx2.getContext('2d').putImageData(data, 0, 0);

			ctx.drawImage(ctx2, 0, 0, ctx.width, ctx.height);

			data = ctx.getImageData(0, 0, ctx.width, ctx.height);
		}
	});*/

	FastClick.attach(document.body);
})(jQuery, window, document);