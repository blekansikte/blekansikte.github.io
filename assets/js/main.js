(function ($, window, document, undefined) {
	var MODE = {
		paint: 1,
		erase: 0
	};

	var doPaint  = false,
		mode     = MODE.paint,
		color    = '#000000',
		height   = window.innerHeight,
		width    = window.innerWidth,
		ratio    = 0.7,
		$buttons = $('.js-btn-color'),
		$erase   = $('.js-btn-erase'),
		$clear   = $('.js-btn-clear'),
		$logo    = $('#logo'),
		eraser, data;

	if ((width / height) > ratio) {
		width = (height * ratio);
	}
	else {
		width -= 40;
	}

	var ctx = Sketch.create({
		autoclear: false,
		container: document.getElementById('canvas'),
		fullscreen: false,
		global: false,
		height: height,
		width: width
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
		var newHeight = window.innerHeight,
			newWidth  = window.innerWidth;

		if ((newWidth / newHeight) > ratio) {
			newWidth = (newHeight * ratio);
		}
		else {
			newWidth -= 40;
		}

		this.height = newHeight;
		this.width = newWidth;
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

	FastClick.attach(document.body);
})(jQuery, window, document);