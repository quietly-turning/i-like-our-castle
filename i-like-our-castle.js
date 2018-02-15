// global game objects
var castle, stage, paddle, ball;

function Brick( brick ){

	this.x = brick.x;
	this.y = brick.y;
	this.w = brick.w;
	this.h = brick.h;
	this.c = brick.c;
	this.text = brick.text;

	this.init = function(i){
		this.obj = new createjs.Shape();
		this.obj.graphics.beginFill(this.c).drawRoundRect(this.x, this.y, this.w, this.h, 4);
		this.obj.alpha = 0;
		stage.addChild(this.obj);
		createjs.Tween.get(this.obj, {loop: false})
			.wait(300)
			.wait(i*60)
			.to({alpha:1}, 200);

		this.phrase = new createjs.Text(this.text, "30px Arial", "#000000");
		this.phrase.x = this.x + this.w/2;
		this.phrase.y = this.y + this.h/2;
		this.phrase.textAlign = "center";
		this.phrase.textBaseline = "middle";
		this.phrase.visible = false;
		this.phrase.scaleX = 0.1;
		this.phrase.scaleY = 0.1;
		stage.addChild(this.phrase);
	};

	this.reveal = function(){
		// increment words_revealed so we can assess endgame
		castle.words_revealed += 1;
		// bring text to the front now
		stage.setChildIndex(this.phrase, stage.getNumChildren()-1);
		// animate the text
		createjs.Tween.get(this.phrase, {loop: false})
			.call(function(){ this.visible = true; })
			.to({x: this.x+10, y: this.y-50, scaleX: 1, scaleY: 1, alpha: 0}, 2100)
			.call(function(){ this.visible = false; });
	};

	this.update = function(){

		if (!this.obj.visible){ return; }
		if (ball.obj == undefined){ return; }

		// collision checking LEFT and RIGHT
		if (ball.obj.y >= this.y && ball.obj.y <= this.y+this.h){
			// ball collides with LEFT of this brick
			if (ball.obj.x <= this.x && ball.obj.x+ball.dx >= this.x ){
				ball.dx = -ball.dx;
				this.obj.visible = false;

			// ball collides with RIGHT of this brick
			} else if (ball.obj.x >= this.x+this.w && ball.obj.x+ball.dx <= this.x+this.w){
				ball.dx = -ball.dx;
				this.obj.visible = false;
			}
		}

		// collision checking TOP and BOTTOM
		if (ball.obj.x >= this.x && ball.obj.x <= this.x+this.w){
			// ball collides with TOP of this brick
			if (ball.obj.y <= this.y && ball.obj.y+ball.dy >= this.y){
				ball.dy = -ball.dy;
				this.obj.visible = false;

			// ball collides with BOTTOM of this brick
			} else if (ball.obj.y >= this.y+this.h && ball.obj.y+ball.dy <= this.y+this.h){
				ball.dy = -ball.dy;
				this.obj.visible = false;
			}
		}

		// we should only get here once, immediately following a collision
		if (!this.obj.visible){
			this.reveal();
		}
	};
}


function Castle(){

	this.words_revealed = 0;

	this.bricks = [
		{ x: 200, y: 300, w: 49, h: 49, c: "#aaaaaa", text: "What if she's allergic to flowers?" },
		{ x: 200, y: 250, w: 49, h: 49, c: "#aaaaaa", text: "It's a beautiful new day." },
		{ x: 200, y: 200, w: 49, h: 49, c: "#aaaaaa", text: "I wish this feeling would last forever." },
		{ x: 200, y: 150, w: 49, h: 49, c: "#aaaaaa", text: "I love you so much, but..." },
		{ x: 200, y: 100, w: 49, h: 49, c: "#aaaaaa", text: "I miss you." },
		{ x: 200, y:  50, w: 49, h: 49, c: "#aaaaaa", text: "Everything seems mixed up." },

		{ x: 250, y: 300, w: 49, h: 49, c: "#bbbbbb", text: "Life is so long and strange." },
		{ x: 250, y: 250, w: 49, h: 49, c: "#bbbbbb", text: "Why are you so angry?" },
		{ x: 250, y: 200, w: 49, h: 49, c: "#bbbbbb", text: "It's so hard to get out of bed some days." },
		{ x: 250, y: 150, w: 49, h: 49, c: "#bbbbbb", text: "He said he wants kids." },
		{ x: 250, y: 100, w: 49, h: 49, c: "#bbbbbb", text: "This is a quiet life." },

		{ x: 300, y: 300, w: 49, h: 49, c: "#cccccc", text: "A gentle spring breeze." },
		{ x: 300, y: 250, w: 49, h: 49, c: "#cccccc", text: "Ice cream on a hot summer night." },
		{ x: 300, y: 200, w: 49, h: 49, c: "#cccccc", text: "I had a dream in which you died." },
		{ x: 300, y: 150, w: 49, h: 49, c: "#cccccc", text: "The sound of raindrops on an awning." },
		{ x: 300, y: 100, w: 49, h: 49, c: "#cccccc", text: "The smell of chalkboard erasers." },
		{ x: 300, y:  50, w: 49, h: 49, c: "#cccccc", text: "Recalling your smile." },

		{ x: 350, y: 300, w: 49, h: 49, c: "#888888", text: "A smile happy with a secret." },
		{ x: 350, y: 250, w: 49, h: 49, c: "#888888", text: "Finding peace during a midnight walk." },
		{ x: 350, y: 200, w: 49, h: 49, c: "#bbbbbb", text: "You help me feel less alone." },

		{ x: 400, y: 300, w: 49, h: 49, c: "#888888", text: "The warmth of your embrace." },
		{ x: 400, y: 250, w: 49, h: 49, c: "#888888", text: "He wrote me a haiku." },
		{ x: 400, y: 200, w: 49, h: 49, c: "#cccccc", text: "The homeless man's gaze." },

		{ x: 450, y: 300, w: 49, h: 49, c: "#bbbbbb", text: "Socializing tires me out." },
		{ x: 450, y: 250, w: 49, h: 49, c: "#bbbbbb", text: "Why are my feelings so intense?" },
		{ x: 450, y: 200, w: 49, h: 49, c: "#bbbbbb", text: "You inspired me to try harder." },
		{ x: 450, y: 150, w: 49, h: 49, c: "#bbbbbb", text: "Where do these thoughts come from?" },
		{ x: 450, y: 100, w: 49, h: 49, c: "#bbbbbb", text: "Will I ever know peace?" },

		{ x: 500, y: 300, w: 49, h: 49, c: "#cccccc", text: "Fall leaves on the pavement." },
		{ x: 500, y: 250, w: 49, h: 49, c: "#cccccc", text: "I can't turn my mind off." },
		{ x: 500, y: 200, w: 49, h: 49, c: "#cccccc", text: "Where'd you go?" },
		{ x: 500, y: 150, w: 49, h: 49, c: "#cccccc", text: "I'll never accomplish anything worthwhile." },
		{ x: 500, y: 100, w: 49, h: 49, c: "#cccccc", text: "Can I love without fear?" },
	];

	this.init = function(){
		var sky = new createjs.Bitmap("./assets/sky.png")
		sky.scaleX = stage.canvas.width;
		sky.scaleY = stage.canvas.height;
		sky.alpha = 0;
		stage.addChild(sky);
		createjs.Tween.get(sky, {loop:false})
			.to({alpha: 1}, 400);

		var grass = new createjs.Bitmap("./assets/grass.png");
		grass.alpha = 0;
		stage.addChild(grass);
		createjs.Tween.get(grass, {loop:false})
			.to({alpha: 1}, 400);

		for (var i=0; i < this.bricks.length; i++){
			this.bricks[i].obj = new Brick(this.bricks[i]);
			this.bricks[i].obj.init(i);
		}
	};

	this.update = function(){
		for (var i=0; i < this.bricks.length; i++){
			this.bricks[i].obj.update();
		}
	};
};

function Ball( ball ){

	this.x = ball.x;
	this.y = ball.y;
	this.r = ball.r;
	this.velocity = ball.velocity;
	this.c = ball.c;

	this.dx = ball.dx;
	this.dy = ball.dy;

	this.init = function(){
		this.obj = new createjs.Shape();
		this.obj.graphics.beginFill(this.c).drawCircle(this.x, this.y, this.r);
		this.obj.alpha = 0;
		stage.addChild(this.obj);
	};

	this.reset_position = function(){
		this.obj.alpha = 0;
		this.dx = 0;
		this.dy = 0;
		this.obj.y = paddle.y - this.r;
		this.obj.x = paddle.obj.x;
		createjs.Tween.get(this.obj, {loop: false})
			.wait(500).to({alpha: 1}, 500);
	};

	this.update = function(event){
		// safety check
		if (this.obj == undefined){ return; }

		// ball collides with right || left of canvas
		if (this.obj.x + this.dx > stage.canvas.width || this.obj.x + this.dx < 0){
			this.dx = -this.dx;
		}

		// ball collides with top of canvas
		if (castle.words_revealed < castle.bricks.length
		&& this.obj.y + this.dy < 0){
			this.dy = -this.dy;

		// ball goes beyond bottom (plus padding)
		} else if (this.obj.y + this.dy > stage.canvas.height + 20){
			this.reset_position();
		}

		// ball collides with paddle
		if (this.obj.y <= (paddle.y - paddle.h/2)
		&& (this.obj.y + this.dy > (paddle.y - paddle.h/2))
		&& ((this.obj.x) > paddle.obj.x-paddle.w/2)
		&& ((this.obj.x) < (paddle.obj.x + paddle.w/2))){

			// -50 to 50
			var relativeIntersect = this.obj.x - paddle.obj.x;
			// -1 to 1
			var normalizedIntersect = relativeIntersect/(paddle.w/2)
			this.dx = normalizedIntersect * ball.velocity;
			this.dy = -Math.abs(this.dy);
		}

		// remove ball
		if (this.obj.y < -200){
			this.obj.visible = false;
			paddle.remove();
		}

		this.obj.x += this.dx;
		this.obj.y += this.dy;
	};
}


function Paddle( paddle ){

	this.x = paddle.x;
	this.y = paddle.y;
	this.w = paddle.w;
	this.h = paddle.h;
	this.c = paddle.c;

	this.keyboard_right = false;
	this.keyboard_left  = false;
	this.keyboard_dx = 15;

	this.init = function(){
		// position paddle based on how the stage was set
		this.x = -this.w/2;
		this.y = stage.canvas.height-this.h*2;

		this.obj = new createjs.Shape();
		this.obj.graphics.beginFill(this.c).drawRect(this.x, this.y, this.w, this.h);
		this.obj.alpha = 0;
		this.obj.x = stage.canvas.width/2;
		stage.addChild(this.obj);
	};

	this.update = function(){
		if (this.keyboard_right){
			// ensure the paddle doesn't go off the right side of the canvas
			if (this.obj.x + this.keyboard_dx < stage.canvas.width){
				this.obj.x += this.keyboard_dx;
			}
			// if the ball has no motion, its x should track the paddle's x
			if (ball.dy == 0 && ball.dx == 0){
				ball.obj.x = this.obj.x;
			}
		}
		if (this.keyboard_left){
			// ensure the paddle doens't go off the left side of the canvas
			if (this.obj.x - this.keyboard_dx > 0){
				this.obj.x -= this.keyboard_dx;
			}
			// if the ball has no motion, its x should track the paddle's x
			if (ball.dy == 0 && ball.dx == 0){
				ball.obj.x = this.obj.x;
			}
		}
	}

	this.reveal = function(){
		createjs.Tween.get(this.obj, {loop: false})
			.to({alpha: 1}, 1500);
	};

	this.remove = function(){
		createjs.Tween.get(this.obj, {loop: false})
			.to({alpha: 0}, 1000)
			.call(function(){ this.visible = false; })
	};
}


var typewriter = function( str, el, i ){
	if (i <= str.length){
		createjs.Tween.get(el).wait(100)
			.call(function(){
				el.innerHTML = str.substring(0,i);
				i += 1;
				typewriter(str, el, i);
			});
	}
}

function init(){
    createjs.Sound.registerSound("./assets/gymnopedie_no1.mp3", "bgm");

	// set the stage
	stage = new createjs.Stage("canvas");
	castle = new Castle();

	// find #canvas and #title HTML elements
	var canvas = document.getElementById("canvas");
	var title  = document.getElementById("title");

	paddle = new Paddle( { x: 0, y: 0, w: 100, h: 10, c: "#000000" } );
	ball = new Ball( { x: 0, y: 0, r: 14, velocity: 6, c: "DeepSkyBlue", dx: 0, dy: 0 } );

	createjs.Tween.get(canvas, {loop: false})
		.to({width: 800}, 650)
		.to({height:600}, 650)
		.call(function(){
			castle.init();
			// start gameloop
			createjs.Ticker.on("tick", tick);
			createjs.Ticker.setFPS(30);
		})
		.call(function(){
			ball.init();
			paddle.init();
		})
		.wait(2750)
		.call( function(){ typewriter("I like our castle.", title, 1); } )
		.wait(2250)
		.call( function(){
			// reveal paddle
			paddle.reveal();
			// reveal and position ball based on paddle
			ball.reset_position();
		}).call(function(){
			createjs.Sound.play("bgm", {loop:-1.8});
		}).call(function(){
			addEventListeners();
		})

}

function addEventListeners(){
	// event listener for mouseup
	stage.on("stagemouseup", function(evt){
		startBallInMotion();
	});

	// event listener for mousemove
	stage.on("stagemousemove", function(evt){
		// update paddle x to match mouse x
		paddle.obj.x = evt.stageX;

		// if the ball is currently immobile (not playing)
		// move the ball to follow the paddle (until mouseup)
		if (ball.dy == 0 && ball.dx == 0){
			ball.obj.x = paddle.obj.x;
		}
	});

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.onblur = blurHandler;
}

function keyDownHandler(evt){
	if (evt.keyCode == 39){	paddle.keyboard_right = true; }	// RIGHT
	else if (evt.keyCode == 37){ paddle.keyboard_left = true; }	// LEFT
	else if (evt.keyCode == 32) { startBallInMotion(); } // SPACEBAR
}

function keyUpHandler(evt){
	if (evt.keyCode == 39){ paddle.keyboard_right = false; }	// RIGHT
	else if (evt.keyCode == 37){ paddle.keyboard_left = false; }	// LEFT
}

function blurHandler(){
	// if the page loses focus (onblur) manually set
	// these to false now to mitigate keydown/up weirdness
	paddle.keyboard_right = false;
	paddle.keyboard_left = false;
}

function startBallInMotion(){
	// don't allow the ball to start moving while it is still hidden
	if (ball.obj.alpha != 1){ return; }

	// if the ball is currently immobile (not playing)
	// start the ball into motion
	if (ball.dy == 0 && ball.dx == 0){
		ball.dy = -ball.velocity;
	}
}

function tick(event){
	stage.update();
	ball.update(event);
	castle.update();
	paddle.update();
}