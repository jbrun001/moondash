/*
	Moon Dash! - jbrun001@gold.ac.uk

	bugfixes / enhancements
	* done trees dont stay on ground when resizeCanvas
	* done oxygen doesn't refil when replay after level completed
	* done flagpole position when resize narrow
	* done better meteor hitboxes
	* done how to know if runing slow (remove fog?)
	* oxygen tank overlaps crystal at small heights
	* done meteor collision - reduced radius of hitbox from 50 to 30
	* done latforms fixed character not being able to go to the edge - used constant 118 to adjust based on scale - feels more natural now

	* extras
	* hit counter


	Required
	* DONE copy code from v6
	*	DONE render multiple canyons (canyon array)
	* DONE implement canyon interaction (for multople canyons)
	* DONE render multiple collecables
	* DONE implement collectable interaction (for multipls)
	* DONE game over and level complete statement
		* DONE trigger level complete state (when flag is reached)
		* DONE trigger game over complete state (when lives is zero)
		* DONE trigger life lost (when fall down canyon, run out of oxygen, collide with meteor)
	* DONE add a score counter and a lives counter
		* DONE does the collectable count as part of the score or is this used as something else (like fuel) - make score to begin with x points for each Collectable. this means some collectable should be difficult to get.
		* DONE the amount of oxygen left at the end counts towards score bonus
		* DONE the number of lives left at the end counts towards score bonus

	* make it awesome
		* Resize - make sure game can work based on actual screen size (so re-scales for mobile or window size), make text relative
			* DONE added re-size window so if the user re-sizes the browswer (or rotates on a phone) the game will resize
		* level design
			* DONE Platforms
			* DONE make harder
		* graphics
			* DONE background meteor in sky (small + slow)
			* improve swamp -
				* DONE add bubbles using meteors as template
				* DONE fix swamp doesnt display properly first time
				* DONE change swamp colour
			* done improve floor/platform edge next to the canyon - so not straight down
			* DONE - now can use fog.  now frames are 30 per second. can fog extend the whole width of the level without too much CPU
			* NOT DOING - CPU USE too high - not frames are 30 per second. can fog be moved to the left?
	* parallax
		* done
		* statistics area
			* DONE style - use font and colours like game over, find better palate - pastels
			* DONE Essential; Score (big), lives (pictures of character), large oxygen - think about colours, excplain current conttols?  explain game objective?
			* animation review
			*	death anims for
		* DONE falling,
		* DONE meteor = squash,
		* DONE oxygen - fall down
			* meteor explosion anim (use the ideas from the bonus anim - record the framecount)
		* DONE basic explosion - just a quick ellipse no need for countdown
			* starting countdown?  from 5?  with shield on first tree for countdown?  too complicated?
		* DONE starting animation with instructions and keys
			* DONE crystal anim
			* DONE level complete bonus anims
		* difficulty/playability
			* DONE check oxygen levels gran and drain for playability
		* DONE check platforms and distance for playability
		* meteor texture - reference texture a) use royalty free image b) create texture inside code and re-use - look at second example https://p5js.org/reference/#/p5/texture
		* NO Cant use WEBGL mode as breaks everything - all canvas and relative values don't work
		* change tree array so had a value for each trees oxygen?
		* NO game is complex enough already
		* Tree Oxygen mechanic
		* DONE when character under tree increase oxygen
		* NO game difficult enough without this - until tree has no more oxygen left.  Change appearance of tree to show how much oxygen is left.
		* meteors
		* DONE rotate meteors. make smaller, make meteors fall digonally from right. in foreground and metero hit character = 1 life lost
		* DONE added shooting stars in background with a trail so background more interesting no parallax
			* developer Mode (for testing)
		* DONE god mode - no death - no complete level
		* DONE decrement Lives
		* DONE move Flagpole
		* DONE change char speed
		* DONE change char size
	* to do but no time
	 * Meteors: improve look of meteors
	 * Meteors: better explosion?
	 * Mobile: add mobile touch controls so can play on mobile
	 * Mobile: Controls switch?  Switch to mobile controls button?
	 * Mobile: scales ok but runs slow - remove some features like fog if touch is available?
	 * add sound - no time but might slow up game.  would be better with sound
	 * Playability: game is harder if you can't see very far ahead - this could be used for later levels but not now
*/

//Objects
var game;
var border;
var canyons;
var developer;
var gameChar;
var flagpole;
var crystal;
var crystals;
var mountain;
var mountains;
var hill;
var hills;
var planet;
var meteor;
var meteors;
var shootingStar;
var shootingStars;
var swampBubble;
var swampBubbles;

//Tree
var trees_x;
var trees_y;

//Floor
var floorPos_y;

//Character
var gameCharSpeed;

//Camera
var cameraPos_x;

//for information display
var messageText;
var messageWidth;

// if the browser window is re-sized then change the canvas size, and the key screen values to match
function windowResized(){
	resizeCanvas(innerWidth-4, innerHeight-4);	// remove 32 to allow for scroll bars
	floorPos_y = height * 3/4;					// floor position is relative to height
	sidebarWidth = width/4;				// right hand sidebar width relative to screen width
	treePos_y = floorPos_y-120;		// fix tree glitch on re-size
	flagpole.x_pos = border.rightPos_x+(width-sidebarWidth)-(width-sidebarWidth)/12;   // this wasn't resizing properly
	flagpole.y_pos = floorPos_y+2;
	gameChar.y_pos = floorPos_y;
}

function setup(){
	//createCanvas(1274, 576);
	createCanvas(innerWidth-4, innerHeight-4);	// remove 32 to allow for scroll bars
	floorPos_y = height * 3/4;					// floor position is relative to height
	sidebarWidth = width/4;			// right hand sidebar width relative to screen width
  // counter HTML
	let pageLoads;
	pageLoads=createImg("https://hitwebcounter.com/counter/counter.php?page=8098708&style=0009&nbdigits=5&type=page&initCount=0", "");  // https://global.discourse-cdn.com/standard10/uploads/processingfoundation1/original/2X/4/4258906f2b6e9386a2445c32de6b17c0319fe504.png
  pageLoads.position(0, 0);
  pageLoads.size(1,1);
	let uniqueVisitors;
	uniqueVisitors=createImg("https://hitwebcounter.com/counter/counter.php?page=8098818&style=0010&nbdigits=5&type=ip&initCount=0", "");  // https://global.discourse-cdn.com/standard10/uploads/processingfoundation1/original/2X/4/4258906f2b6e9386a2445c32de6b17c0319fe504.png
  uniqueVisitors.position(0, 0);
  uniqueVisitors.size(1,1);



	//Objects
	game = {
		//Oxygen
		oxygenRemaining: 100,					// current amount in the tank
		oxygenGain: 0.4,						// rate of filling as a percentage
		oxygenDrain: 0.3,						// rate of reduction when moving as a percentage
		//Scores value for each item
		scoreBonusOxygen: 20,					// score per 1% of Oxygen
		scoreBonusCrystal: 400,					// score increase per crystal
		scoreBonusLives: 800,					// score increase per life remaining once level is complete
		//In game counters
		lives: 5,
		score: 0,
		crystalsCollected: 0,
		//Game states
		gameStarted: false,						// game started isnt true because of the start menu
		gameStartedFrame: 0,					// for timing end animation
		gameOver: false,						// did not complete level
		levelComplete: false,					// completed level
		levelCompleteFrame: 0,					// for timing end animation
		levelReset: false,						// used to trigger re-stsart of level
		// key values
		maxLives: 5,
		framesPerSecond: 30,
		version: "7.9.1",
	}
	border = {									// defines the left and right most camera position
		leftPos_x: -500,
		rightPos_x: 2000,
	}
	canyons = [
		{x_pos: -500, width: 200},
		{x_pos: 200, width: 150},
		{x_pos: 500, width: 150},
		{x_pos: 700, width: 75},
		{x_pos: 825, width: 150},
		{x_pos: 1750, width: 150},
		{x_pos: 2325, width: 150},
		{x_pos: 2560, width: 75},
	]
	developer = {								// object for developer mode
		mode: false,
		pwCounter: 0,
		pwArray: ['n', 'a', 'r', 'p', 'a', 's', 's', 'w', 'o', 'r', 'd'],	// Password
		godMode: false,
	}
	//Game character
	gameCharSpeed = 6;								// 3 for 60fps character movement speed
	gameChar = {
		//pos
		x_pos: 100,								// starting position
		y_pos: floorPos_y,
		//Character states
		grav: gameCharSpeed/2,					// gravity (fall speed)
		jumpHeight: 100,						// characher max jump height
		isLeft: false,							// true if character is currently moving left
		isRight: false,							// true if character is currently moving right
		isFalling: false,						// true if the character is falling down
		isPlummeting: false,					// true if character is over the canyons
		isUnderTree: false,							// is the character under any trees
		nearTreeNumber: 0,						// which tree array position is the character under
		isDead: false,							// is the character dead (triggers dead animation)
		causeOfDeath: "NONE",					// cause of death for different death animations
		lastDeathFrame: 0,						// the frame where the last death occured
		//Animation
		animFrame: 0,								// current character animation frame
		animLimbA: [-6, 0, 6, 0],					// right leg and left arm angles for each walk animation frame
		animLimbB: [6, 0, -6, 0],					// left leg and right arm angles for each walk animation frame
		animJumpLeg: [-3.8, -3, -3.8, -3, -3.8],	// leg angles for each jump animation frame
		animJumpArm: [3.2, 4, 3.2, 4],				// arm angles for each jump animation frame
		animJumpHeight: [-1, -4, -4, -1],			// height values for each jump animation frame
		animFrameSpeed: 12-gameCharSpeed,			// 14 for 60fps number of frameCount frames between each character animation frame
		animMeteorDeath: [0.75,0.5,0,0.25,0], // scale y for character squash
		//Character colour
		colourVisor: '#403F3B',						// set colours ofcharacter here so it can be changed in the game
		colourLimb: '#807E75',
		colourEars: '#A792B3',
		colourBase: '#92A1B3',
		colourTorso: '#BFBDB0',
		colourTank: '#92A1B3',
		//Character scale set here so can scale the character in the game
		scale_x: 1.6,								// character scale x axis
		scale_y: 1.6,								// character scale y axis
	}
	//Flagpole
	flagpole = {
		x_pos: border.rightPos_x+(width-sidebarWidth)-(width-sidebarWidth)/12,
		y_pos: floorPos_y+2,
		size: 0.75,
		isReached: false
	}
	//Crystal (collectable)
	crystal = {
		anim: 4,			// for animation
		size: 1
	}
	//Crystals (collectable)
	crystals = [
		{x_pos: -375, y_pos: floorPos_y-60, isFound: false},
		{x_pos: 737.5, y_pos: floorPos_y-60, isFound: false},
		{x_pos: 1200, y_pos: floorPos_y-10, isFound: false},
	]
	//Planet
	planet = {
		x_pos: 900,
		y_pos: 150,
		angle: PI/-5,
		speed: PI/6000,
		size: 10,
		parallax: 1000
	}
	//Meteor
	meteor = {
		parallax: 18,
		vertices: 100,
		wobble: 50,
		smooth: 100,
		radius: 1,
		animRotate: [0, 2, -4, -2],
		speed: 4,												// 2 60fps
		hitBoxOffset_x: -8,
		hitBoxOffset_y: 30,
	}
	//Meteors
	meteors = [
		{x_pos: -150, y_pos: 200, isHitByChar: false},
		{x_pos: 200, y_pos: 150, isHitByChar: false},
		{x_pos: 500, y_pos: 200, isHitByChar: false},
		{x_pos: 800, y_pos: 100, isHitByChar: false},
		{x_pos: 1100, y_pos: 100, isHitByChar: false},
		{x_pos: 1400, y_pos: 150, isHitByChar: false},
		{x_pos: 1700, y_pos: 200, isHitByChar: false},
		{x_pos: 1900, y_pos: 150, isHitByChar: false},
		{x_pos: 2400, y_pos: 150, isHitByChar: false},
	]
	//ShootingStar
	shootingStar = {
		radius: 2.5,
		speed: 1,												// 2 60fps
	}
	//ShootingStars
	shootingStars = [
		{x_pos: -150, y_pos: 200},
		{x_pos: 200, y_pos: 150},
		{x_pos: 500, y_pos: 200},
		{x_pos: 800, y_pos: 100},
		{x_pos: 1100, y_pos: 100},
		{x_pos: 1400, y_pos: 150},
		{x_pos: 1700, y_pos: 200},
		{x_pos: 1900, y_pos: 150},
		{x_pos: 2400, y_pos: 150},
	]
	//SwampBubble
	swampBubble = {
		maxRadius: 25,
		maxSpeed: 1,												// 2 60fps
	}
	//SwampBubbles
	swampBubbles = [
		{x_pos: -150, y_pos: 800, radius:20},
		{x_pos: 200, y_pos: 800, radius:20},
		{x_pos: 500, y_pos: 800, radius:20},
		{x_pos: 800, y_pos: 800, radius:20},
		{x_pos: -150, y_pos: 800, radius:20},
		{x_pos: 200, y_pos: 800, radius:20},
		{x_pos: 500, y_pos: 800, radius:20},
		{x_pos: 800, y_pos: 800, radius:20},
		{x_pos: 1100, y_pos: 800, radius:20},
		{x_pos: 1400, y_pos: 800, radius:20},
		{x_pos: 1700, y_pos: 800, radius:20},
		{x_pos: 1900, y_pos: 800, radius:20},
		{x_pos: 2400, y_pos: 800, radius:20},
	]
	//Mountain
	mountain = {
		size: 1.75,
		parallax: 500
	}
	//Mountains
	mountains = [
		{x_pos: -500, y_pos: 150},
		{x_pos: 12, y_pos: 200},
		{x_pos: 512, y_pos: 200},
		{x_pos: 1012, y_pos: 100},
		{x_pos: 1512, y_pos: 100},
		{x_pos: 2012, y_pos: 150},
		{x_pos: 2512, y_pos: 200},
		{x_pos: 3012, y_pos: 200},
		{x_pos: 3512, y_pos: 150},
	]
	//Hill
	hill = {
		size: 1.75,
		parallax: 5
	}
	//Hills
	hills = [
		{x_pos: -500},
		{x_pos: 512},
		{x_pos: 1512},
		{x_pos: 2512},
		{x_pos: 3512}
	]
	//Tree
	trees_x = [100, 1100, 1600, 2050];
	treePos_y = floorPos_y-120;
	//Camera
	cameraPos_x = 0;
	frameRate(game.framesPerSecond);
}

function draw(){
	///////////DRAWING CODE//////////
	//Camera position
	if(gameChar.x_pos <= border.leftPos_x+((width-sidebarWidth)/2)){					// if the character position is half a screen from the left border fix the camera position
		cameraPos_x = border.leftPos_x;
	}else if(gameChar.x_pos >= border.rightPos_x+((width-sidebarWidth)/2)){// if the character position is half a screen from the right border fix the camera position
		cameraPos_x = border.rightPos_x;
	}else{																										// otherwise set the camera pos to keep the character in the middle of the screen
		cameraPos_x = gameChar.x_pos - (width-sidebarWidth)/2;
	}

	//Character position
	if(gameChar.x_pos <= border.leftPos_x+(gameChar.scale_x*15)){								// stop character moveing left when reaches left boarder (account for size of character)
		gameChar.isLeft = false;
	}else if(gameChar.x_pos >= (border.rightPos_x+(width-250))-(gameChar.scale_x*15)){				// stop character moveing right when reaches right boarder (account for size of character)
		gameChar.isRight = false;
	}

	//Character is dead if falls off the bottom of the screen
	if(gameChar.y_pos >= height+(gameChar.scale_y*60)){
		gameChar.isDead = true;
		gameChar.causeOfDeath = "FALL"
	}

	//Character boarder movement
	if(gameChar.x_pos <= border.leftPos_x+(gameChar.scale_x*15)){								// stop character moveing left when reaches left boarder (account for size of character)
		gameChar.isLeft = false;
	}else if(gameChar.x_pos >= (border.rightPos_x+(width-250))-(gameChar.scale_x*15)){				// stop character moveing right when reaches right boarder (account for size of character)
		gameChar.isRight = false;
	}

	//Character death movement
	if(gameChar.isDead == true){				// stops teh character moveing if dead
		gameChar.isRight = false;
		gameChar.isLeft = false;
	}

	background(0);	// fill the sky Black
	noStroke();
	push();
		translate(-cameraPos_x, 0);
		//Planet
		push();
			translate(-cameraPos_x/planet.parallax, 0);
			drawPlanet();
		pop();
		//Shooting Stars
		drawShootingStars();
		//Mountain
		push();
			translate(-cameraPos_x/mountain.parallax, 0);
			drawMountains();
		pop();
		//Back Hills
		push();
			translate(-cameraPos_x/hill.parallax, 0);
			drawHills(0);// offset 0
		pop();
		//Fog
		push();
			translate(cameraPos_x, 0);// no parallax for the fog
			drawFog();
		pop();
		//Front Hills
		push();
			translate(-cameraPos_x/hill.parallax*2, 0);
			drawHills(200); // offset second hills
		pop();
	pop();

	// developer mode options - show developer keybind menu
	if(developer.mode == true){
		drawDevControls();
	}
	push();
		translate(-cameraPos_x, 0);
		drawPlatforms();	// this uses the canyon array to draw platforms so the canyon can show the hills behind
		drawTrees();
		drawFlagpole();
		drawCrystals();
		//Meteor only draw when playing
		if(game.levelComplete == false && game.gameStarted == true && game.gameOver == false){
			drawMeteors();
		}
		//Game Character movement, and death actions
		if(gameChar.isDead == true){
			// record the framecount if the lastDeathframe has not already been set
			if(gameChar.lastDeathFrame == 0){
				gameChar.lastDeathFrame = frameCount;
			}
			// if dead and anim playing loop for 0.75 seconds to play animation before removing life and resetting
			if(gameChar.lastDeathFrame > 0 && (frameCount-gameChar.lastDeathFrame)/game.framesPerSecond < 0.75){
				// death Animation causeOfDeath NONE FALL METEOR OXYGEN
				switch (gameChar.causeOfDeath){
					case "METEOR":
						charFall(gameChar.animMeteorDeath[gameChar.animFrame],gameChar.x_pos,gameChar.y_pos);
						break;
					case "OXYGEN":
						push();
							translate(gameChar.x_pos,gameChar.y_pos)
							rotate(-PI/2);
							charWalk(1,0,0);
						pop();
						break;
				}
			}else{// dead and animation is over
				if(developer.godMode == false){
					if(game.lives <= 1){
						game.lives = 0;
						game.gameOver = true;
					}else{
						resetCharacter();
						game.lives -= 1;
					}
				}else{
					resetCharacter();
				}
	 		}
 		}else{ // not dead - normal movement
			if(gameChar.isLeft && gameChar.isFalling){
				charFallMoving(-1, gameChar.x_pos, gameChar.y_pos);
			}
			else if(gameChar.isRight && gameChar.isFalling){
				charFallMoving(1, gameChar.x_pos, gameChar.y_pos);
			}
			else if(gameChar.isLeft){
				charWalk(-1, gameChar.x_pos, gameChar.y_pos);
			}
			else if(gameChar.isRight){
				charWalk(1, gameChar.x_pos, gameChar.y_pos);
			}
			else if(gameChar.isFalling){
				charFall(1, gameChar.x_pos, gameChar.y_pos);
			}
			else if(gameChar.isPlummeting){
				if(gameChar.animFrame%2 == 0){
					charFall(1, gameChar.x_pos, gameChar.y_pos);
				}
				else{
					charStand(1, gameChar.x_pos, gameChar.y_pos);
				}
			}
			else{
				charStand(1, gameChar.x_pos, gameChar.y_pos);
			}
		}
	pop();

	//SwampBubbles
	push();
		translate(-cameraPos_x, 0);
		drawSwampBubbles();				// draw drawSwampBubbles here so is in front of character and infont of Swamp
	pop();

	//Swamp
	drawSwamp(0, (height/16)-5, width, height/4, color(157, 193, 131,20), color(46, 139, 80,60));			// draw Swamp here so is in front of character

	//Stats
	drawStats();
	// animations and text to show score at the end of the game or level
	if(game.gameStarted == false){
		drawStartGame();
	}
	if(game.gameOver == true || game.levelComplete == true){
		drawEndGame();
	}
	if(game.levelReset == true){
		game.levelReset = false;
		game.gameOver = true;
		game.gameStarted = false;
		resetCharacter();
		resetLevel();
	}

	// animation control
	// mod the frameCount by animFrameSpeed to increment the character animation frame by 1 - reset to zero if 3
	if(frameCount%gameChar.animFrameSpeed == 0){
		if(gameChar.animFrame == 3){
			gameChar.animFrame = 0;
		}
		else{
			gameChar.animFrame++;
		}
	}

	///////////INTERACTION CODE//////////
	//Conditional statements to move the game character
	if(gameChar.isPlummeting == false){
		if(gameChar.isLeft == true){
			gameChar.x_pos -= gameCharSpeed;
		}
		else if(gameChar.isRight == true){
			gameChar.x_pos += gameCharSpeed;
		}
	}
	if(game.oxygenRemaining <= 100 - (game.oxygenGain) && gameChar.isUnderTree == true){
		game.oxygenRemaining += (game.oxygenGain);
	}
	else if(gameChar.isUnderTree == false){
		game.oxygenRemaining -= (game.oxygenDrain)
	}

	// character is dead if runs out of oxygen
	if(game.oxygenRemaining <= 0){
		gameChar.isDead = true;
		gameChar.causeOfDeath = "OXYGEN";
	}

	// character is in the air gravity will aply
	if(gameChar.y_pos < floorPos_y){
		gameChar.y_pos += gameChar.grav;
		gameChar.isFalling = true;
	}else {
		gameChar.isFalling = false;
	}

	//Canyons
	for(var i = 0; i < canyons.length; i++){
		//If character is in canyon set isPlummeting to true
		// need to adjust edge of canyon by a little - how to do that when scaling - x use constant 118
		if(gameChar.x_pos > canyons[i].x_pos+(width/118) &&
			gameChar.x_pos < canyons[i].x_pos+canyons[i].width-(width/118) &&
			gameChar.y_pos >= floorPos_y){
			gameChar.isPlummeting = true;
			gameChar.y_pos += gameChar.grav*2;
		}
	}

	//Trees
	for(var i = 0; i < trees_x.length; i++){
		//If character is on tree character gains oxygen
		if(gameChar.x_pos > trees_x[i]-50 && gameChar.x_pos < trees_x[i]+50){
			gameChar.isUnderTree = true;
			gameChar.nearTreeNumber = i;
			break;// break out of for when we have found the tree the character is under so doesnt set to false and also less processing
	 	}else{
	 		gameChar.isUnderTree = false;
	 	}
	}
}

function keyPressed(){
	//Developer mode buttons
	if(key == "=" && developer.mode == true){								//developer mode increase character speed and recalc gravity
		gameCharSpeed += 1;
		gameChar.grav = gameCharSpeed/2;
	}
	if(key == "-" && developer.mode == true && gameCharSpeed > 0){			//developer mode decrease character speed and recalc gravity
		gameCharSpeed -= 1;
		gameChar.grav = gameCharSpeed/2;
	}
	if(key == "+" && developer.mode == true){								//developer mode increase character size
		gameChar.scale_x += 0.2;
		gameChar.scale_y += 0.2;
	}
	if(key == "_" && developer.mode == true && gameChar.scale_x > 0.2){		 //developer mode decrease character size
		gameChar.scale_x -= 0.2;
		gameChar.scale_y -= 0.2;
	}
	if(key == "0" && developer.mode == true){		//developer mode reset character position
	game.levelReset = true;
	}
	if(key == "9" && developer.mode == true){								//developer mode moves flag position to left of spawn
		flagpole.x_pos = -100;
	}
	if(key == "8" && developer.mode == true){								//developer mode switch decrement lives by 1
		if(game.lives > 0){
		game.lives -= 1;
		}
	}
		if(key == "7" && developer.mode == true){								//developer mode toggle god mode
		developer.godMode = !developer.godMode;
	}
	// if the not playing the game or running then return before allowing movement keys to be used
	if(game.gameOver == true || game.levelComplete == true || game.gameStarted == false || gameChar.isDead == true){
		return;
	}
	// if statements to control the animation of the character when
	// keys are pressed.
	//uses W,A,D,[SPACE],UP_ARROW,LEFT_ARROW,RIGHT_ARROW
	if(gameChar.isPlummeting == false){
		if(key == "a" || key == "A" || keyCode == LEFT_ARROW){
			gameChar.isLeft = true;
		}
		else if(key == "d" || key == "D" || keyCode == RIGHT_ARROW){
			gameChar.isRight = true;
		}
	}
	if(key == "w" && gameChar.isFalling == false && gameChar.isPlummeting == false || key == "W" && gameChar.isFalling == false && gameChar.isPlummeting == false || key == " " && gameChar.isFalling == false && gameChar.isPlummeting == false || keyCode == UP_ARROW && gameChar.isFalling == false && gameChar.isPlummeting == false){
		gameChar.y_pos -= gameChar.jumpHeight;
	}
}

function keyReleased(){
	// if statements to control the animation of the character when
	// keys are released.
	if(key == "a" || key == "A" || keyCode == LEFT_ARROW){
		gameChar.isLeft = false;
	}
	else if(key == "d" || key == "D" || keyCode == RIGHT_ARROW){
		gameChar.isRight = false;
	}
		if(key == "1" && game.gameStarted == false){
		game.gameStarted = true;
	}
		if(key == "2" && (game.gameOver == true || game.levelComplete == true)){
		game.levelReset = true;
		}
}
//Developer mode started by entering password as keypresses, pwcounter is used to check the characters in the password array
function keyTyped(){
		if(key == developer.pwArray[developer.pwCounter]){
		developer.pwCounter += 1;
	}else{
		developer.pwCounter = 0;
	}
	if(developer.pwCounter == developer.pwArray.length){
		developer.mode = !developer.mode;
		developer.pwCounter = 0;
	}
}

/////////////////////////////////////////////////////////////////
//called Functions
//reset the character when the character dies (or when 0 developer option)
function resetCharacter(){
	game.oxygenRemaining = 100;
	gameChar.isPlummeting = false;
	gameChar.isDead = false;
	gameChar.lastDeathFrame = 0;
	gameChar.scale_y = 1.6;				// reset scale after death animation - would be better as parameters to drawChar functions
	gameChar.scale_x = 1.6;				// reset scale after death animation - would be better as parameters to drawChar functions
	gameChar.levelCompleteFrame = 0;
	gameChar.levelComplete = false;
	if(developer.godMode == false){
		gameChar.x_pos = 100;
		gameChar.y_pos = floorPos_y;
	}else if(gameChar.y_pos > floorPos_y+50){
		gameChar.y_pos = floorPos_y-150;
	}
}

function resetLevel(){
	gameChar.gameStarted = false;
	game.lives = game.maxLives;
	gameChar.gameOver = false;
	game.crystalsCollected = 0;
	flagpole.isReached = false;
	game.score = 0;
	// loop through crystals array and reset them to not found
	for(var i=0; i<crystals.length; i++){
		crystals[i].isFound = false;
	}
	frameCount = 0;
}

function drawStats(){
	push();
		translate(width-sidebarWidth, 0);
		noStroke();
		//Background Box
		fill(0);
		rect(0,0,sidebarWidth,innerHeight,10, 0,0,0);
		fill(0);
		//Text
		stroke(61, 20, 83);
		strokeWeight(10);
		fill(111, 70, 133);
		let textSpacing = (sidebarWidth/5.76)/2;
		textSize(textSpacing);
		textSpacing = textSpacing*1.5;
		text("Score\n"+game.score, 20, textSpacing*1);
		text("Lives left\n", 20, textSpacing*3);
		text("Crystals\n"+game.crystalsCollected, 20, textSpacing*5);
		// used in testing and for future game ideas
		// text("Last Death:\n" + gameChar.causeOfDeath, 20, textSpacing*7);
		// Lives draw character to show the number of lives
		push();
			translate(30,textSpacing*4);
			scale(sidebarWidth/526,sidebarWidth/526);		 // scale relative to sidebar width
			for (var l = 0; l<game.lives; l++){
				charWalk(1,l*50,0);
			}
		pop();

		// draw oxygen tank showing remaining oxygen
		push();
			translate((sidebarWidth/8),(innerHeight*0.40));
			strokeWeight(1);
			stroke(61,20,83,200)
			fill(100);
			rect(0,0,(sidebarWidth/2),innerHeight*0.6,10);
			noStroke();
			if(game.oxygenRemaining <= 50){
				//fill(200, 0, 0);
				fill(210, 43, 43);
				strokeWeight(gameChar.animFrame);
			}else{
				fill(155,221,255);	// ogygen blue
			}
			rect(0,innerHeight*0.6,(sidebarWidth/2),map(game.oxygenRemaining,0,100,0,innerHeight*0.6)*-1,10,10,0,0);
		pop();
		push();
			translate((sidebarWidth/2.25),(innerHeight-(innerHeight/2)/8));
			rotate(PI/-2);
			// if low levels put red outline around OXYGEN text
			if(gameChar.animFrame%2==0 && game.oxygenRemaining <= 50){
				stroke(200,0,200);
			}
			else{
				stroke(61, 20, 83);
			}
			fill(111, 70, 133);		// ogygen blue
			textStyle(BOLD);
			textSize(sidebarWidth/5.76);			// text scales with width of sidebar
			text("OXYGEN", 0, 0);
		pop();
		push();
			translate(sidebarWidth-(sidebarWidth/16),innerHeight);
			rotate(PI/-2);
			// if low levels put red outline around OXYGEN text
			textStyle(BOLD);
			textSize(sidebarWidth/5.76);			// text scales with width of sidebar
			text("Moon Dash! v" + game.version, 0, 0);
		pop();
	pop();
}

//Objects
function drawPlanet(){
	push();
		translate(planet.x_pos,planet.y_pos);
		scale(planet.size,planet.size);
		// Planet body
		fill(225, 222, 167);
		ellipse(0, 0, 50, 50);
		// Outer Ring
		noFill();
		strokeWeight(8);
		stroke(255);
		arc(0, 0, 75, 25, -QUARTER_PI, PI+QUARTER_PI);
		//Inner Ring
		stroke(200);
		arc(0, 0, 65, 15, -QUARTER_PI/2, PI+(QUARTER_PI/2));
		// Planet body
		noStroke();
		fill(225, 222, 167);
		arc(0, 0, 50, 50, PI, TWO_PI, CHORD);
	pop();
}

function drawMeteors(){
	for(var i=0; i<meteors.length; i++){				// loop through meteors array
		push();
			translate(meteors[i].x_pos,meteors[i].y_pos);
			rotate(PI/(meteor.animRotate[gameChar.animFrame]));
			noStroke();
			fill(127);
			beginShape()				// create lumpy circle useing noise function
				for(var j = 0; j < meteor.vertices; j++){
					let f = noise(50*cos(j/meteor.vertices*2*PI)/meteor.smooth+1+(i/3),
								50*sin(j/meteor.vertices*2*PI)/meteor.smooth+1+(i/3))
					vertex(0+(meteor.radius+meteor.wobble*f) * cos((j/meteor.vertices)*2*PI),
						0+(meteor.radius+meteor.wobble*f) * sin((j/meteor.vertices)*2*PI))
				}
			endShape(CLOSE);
		pop();
		//Only set dead if not already dead - otherwise later metors reset death state
		//the y_pos of gameChar is on the floor - need to raise it so hitbox works - allow for scaling
		let meteorDistance = dist(meteors[i].x_pos, meteors[i].y_pos, gameChar.x_pos-(meteor.hitBoxOffset_x*(gameChar.scale_x)), gameChar.y_pos-(meteor.hitBoxOffset_y*(gameChar.scale_y)));
		if(meteorDistance <= meteor.radius+38  && gameChar.isDead == false){    // was +50
			meteors[i].isHitByChar = true;
			if(gameChar.isDead == false){
				gameChar.isDead = true;
				gameChar.causeOfDeath= "METEOR"
			}
		}
		//movement code
		if(gameChar.animFrame%1 == 0){								// control speed of meteors 1-4 %1 = fast, %4 = slow
			meteors[i].x_pos -= meteor.speed;
			meteors[i].y_pos += meteor.speed;
		}
		// move back up and ground animation
		// if(meteors[i].y_pos >= floorPos_y || meteors[i].isHitByChar){	 // if hits floor or hits character
		if(meteors[i].y_pos >= floorPos_y){	 // if hits floor
			fill(190,190,190,gameChar.animFrame*100);
			ellipse(meteors[i].x_pos, meteors[i].y_pos, 25*gameChar.animFrame, 25*gameChar.animFrame);	// hit animation
			meteors[i].y_pos = random(-100,-500);														// move meteor to off top of screen so can descend again
			meteors[i].x_pos = random(500, 1500)+gameChar.x_pos;
			meteors[i].isHitByChar = false;																// reset meteor state
		}
	}
}

function drawShootingStars(){
	for(var i=0; i<shootingStars.length; i++){				// loop through stars array
		push();
			translate(shootingStars[i].x_pos,shootingStars[i].y_pos);
			fill(250,250,210,60);	// yellow
			ellipse(0,0,shootingStar.radius*2);
			fill(250,250,210,90);	// yellow
			triangle(shootingStar.radius*2,0,-shootingStar.radius*2,0,shootingStar.radius+50,-20);
		pop();
		//movement code
		if(gameChar.animFrame%1 == 0){								// control speed of stars 1-4 %1 = fast, %4 = slow
			shootingStars[i].x_pos -= shootingStar.speed;
			shootingStars[i].y_pos += shootingStar.speed/4;
		}
		//move back up and ground animation
		if(shootingStars[i].y_pos >= floorPos_y-150){	 // if hits 150 above floor
			shootingStars[i].y_pos = random(0,-100);			// move star to off top of screen so can descend again
			shootingStars[i].x_pos = random(500, 1500)+gameChar.x_pos;
		}
	}
	noFill();
}

function drawSwampBubbles(){
	fill(46, 139, 80,40);	// bubble colour
		strokeWeight(1);
		stroke(46, 139, 80, 60);
	for(var i=0; i<swampBubbles.length; i++){				// loop through bubbles array
		push();
			translate(swampBubbles[i].x_pos,swampBubbles[i].y_pos);
			ellipse(0,0,swampBubbles[i].radius*2);
		pop();
		//movement code
		if(gameChar.animFrame%1 == 0){									 // control speed of bubbles 1-4 %1 = fast, %4 = slow
			if(random(0,1) == 0){
				swampBubbles[i].x_pos -= random(0,1);			 // move the bubble a little -x or
			}
			else{
				swampBubbles[i].x_pos += random(0,1);							// a little x
			}
			swampBubbles[i].y_pos -= swampBubble.maxSpeed*(swampBubbles[i].radius/swampBubble.maxRadius);	// speed of bubble based on size, bigger bubble = faster
		}
		//move back down when at top and, change x so when appear is in view of char, change size randomly
		if(swampBubbles[i].y_pos <= floorPos_y+(height/16)){	 // if top of swamp
			swampBubbles[i].y_pos = random(height,height+100);														// move bubble to off bottom of screen so can descend again
			swampBubbles[i].x_pos = random(-(width/2), width/2)+gameChar.x_pos;
			swampBubbles[i].radius = random(8,swampBubble.maxRadius);
		}
	}
	noFill();
}

function drawMountains(){
	for(var i=0; i<mountains.length; i++){				// loop through the mountains array
		//Mountain in the background use bezierVertex to get curved lines
		push();
			translate(mountains[i].x_pos-512,floorPos_y+(height/16))
			scale(mountain.size,mountain.size);
			//lighter shade on the right hand side of the mountain
			fill(195);
			noStroke();
			beginShape();
				vertex(0, 0);
				bezierVertex(0, 0, 300, -35, 450, -205);
				bezierVertex(450, -205, 525, -135, 800, -35);
				vertex(900, 0);
			endShape();
			//darker shade of the mountain in the foreground
			fill(150);
			beginShape();
				vertex(0, 0);
				bezierVertex(0, 0, 300, -35, 450, -205);
				bezierVertex(450, -205, 500, -135, 700, -35);
				vertex(780, 0);
			endShape();
		pop();
	}
}

function drawFog(){
	// may have to remove because of CPU usage
	// random gas cloud sky - use noise to get some small differences, and use transparent overlappting rectangles
	let blockyness = 0.002;
	for(skyPos_x = 0; skyPos_x < (width-sidebarWidth); skyPos_x=skyPos_x+20){	 	// every 20 x pixels, if this is 1 it takes too much CPU, but the texture is smoother
		for(skyPos_y = 0; skyPos_y < floorPos_y; skyPos_y=skyPos_y+20){		// every 20 y pixels, if this is 1 it takes too much CPU, but the texture is smoother was height but changed to floorPos_y to save processing speed
			fill(
			map(noise(skyPos_x*blockyness,skyPos_y*blockyness)*10,0,10,0,255),	// red map to between 0 and 255 (want it more likely to be pink)
			map(noise(skyPos_x*blockyness,skyPos_y*blockyness)*10,0,10,map(skyPos_x,0,(width-sidebarWidth),0,50),180),		// green increase the amount of green between 10 and 50 the further away from 0,0
			map(noise(skyPos_x*blockyness,skyPos_y*blockyness)*10,0,10,50,180),		// blue map to between 10 and 50 blue
			140);		// select colour using noise to vary it a little
			rect(skyPos_x,skyPos_y,20);			// draw a 20x20 rect, because of transparancy these will overlap
		}
	}
}

function drawHills(hOffset){
	for(var i=0; i<hills.length; i++){				// loop through the hills array
		// hills in the foreground use bezierVertex to get curved lines
		push();
			translate(hills[i].x_pos-512+hOffset,floorPos_y+(height/16))
			scale(hill.size,hill.size);
			//Lighter colour for the highlight on the hills
			fill(255, 245, 238);
			noStroke();
			beginShape();
				vertex(0, 0);
				bezierVertex(250, -205, 300, -135, 500, -35);
				bezierVertex(500, -35, 600, 15, 759, -85);
				bezierVertex(759, -85, 800, -135, 1024, 0);
			endShape();
			//Darker shade of the hills
			//fill(235);
			fill(248, 200, 220);
			noStroke();
			beginShape();
				vertex(0, 0);
				bezierVertex(250, -217, 300, -115, 500, -35);
				bezierVertex(500, -35, 600, 15, 759, -85);
				bezierVertex(759, -85, 800, -120, 1024, 0);
			endShape();
		pop();
	}
}

function drawTrees(){
	for(var i=0; i<trees_x.length; i++){				// loop through the trees
		//Tree
		push();
			translate(trees_x[i],treePos_y);
			//Align tree trunk
			strokeWeight(2);
			stroke(0 ,150 ,150);
			fill(0 ,200 ,200);
			triangle(0,0.5,-10,125,10, 125);
			//Align orange tree leaves
			noStroke();
			// if tree is giving player oxygen then change the outline and the transparency of the leaves so it pulses
			if(gameChar.isUnderTree == true && gameChar.nearTreeNumber == i){
				fill(140, 255, 0, (gameChar.animFrame*50)+50);
				strokeWeight(gameChar.animFrame);
				stroke(0 ,150 ,150);
			}else {
				fill(255, 140, 0, 200);
			}
			ellipse(0, 40, 75, 75);
			ellipse(-40, 40, 50, 50);
			ellipse(0,0, 75, 75);
			ellipse(40, 0, 50, 50);
			// earth at bottom of tree
			strokeWeight(8);
			fill(255);
			arc(0, 125, 75, 25, -QUARTER_PI/2, PI+(QUARTER_PI/2));
		pop();
	}
}

function drawPlatforms(){
	noStroke();
		// canyon improvement
		// instead of drawing the canyons which then don't lool good
		// use the canyon array to work out where the platforms should be.  start of the canyon is the end of a platform.
		// the end of a canyon is the start of the next platform
		// this way the canyon can be transparent and show the background, the floor can be removed and the platforms can be styled
		// to do this we assume that the canyon array is sorted left to right already
		// keep a record of the platform left and right edge (calculated from the canyons array)
		var currentLeftPlatformEdge = -900;// start on the far left assuming a platform - -999 is off the screen
		var currentRightPlatformEdge = -900;// start on the far left assuming a platform - -999 is off the screen
		for(var i = 0; i < canyons.length; i++){
		currentRightPlatformEdge = canyons[i].x_pos;// thi right edge of the platform is the left edge of the canyon
		drawPlatform(currentLeftPlatformEdge, currentRightPlatformEdge-currentLeftPlatformEdge);
		currentLeftPlatformEdge = currentRightPlatformEdge+canyons[i].width;
		if(i == canyons.length-1){// if we are at the last canyon draw a platfrom to the screen edge
			currentRightPlatformEdge = border.rightPos_x+(width*1.5);
			drawPlatform(currentLeftPlatformEdge, currentRightPlatformEdge-currentLeftPlatformEdge);
		}
	}
}

function drawPlatform(platformX_pos, platformWidth){
 	noStroke();
	fill(244, 246, 240);							 // moon white
	rect(platformX_pos, floorPos_y, platformWidth, (height/16)+2,0,0,20,20);	// draw the platform with rounded corners on the bottom two corners
}

function drawSwamp(swampStartPos_x, swampStartPos_y, swampWidth, swampHeight, swampBottomColour, swampTopColour){
	push();
		translate(0,floorPos_y);
		for (var i = swampStartPos_y; i <= swampStartPos_y + swampHeight; i++){			// loop from the top y to the bottom
			var change = map(i, swampStartPos_y, swampStartPos_y + swampHeight, 0, 1);	// map the changes to known values
			var colourVariation = lerpColor(swampBottomColour, swampTopColour, change - 0.35); // use lerpColor to create the colour
			stroke(colourVariation);
			line(swampStartPos_x, i, swampStartPos_x + swampWidth, i);					// draw one line in the colour
		}
	pop();
}

function drawFlagpole(){
	// Flag up state
	push();
		translate(flagpole.x_pos,flagpole.y_pos);
		scale(flagpole.size,flagpole.size);
		//Flag pole
		noStroke();
		fill(200);
		rect(0, -150, 5, 150);
		fill(255, 55, 55);
		ellipse(2.5, -150, 8, 8)
		//Earth
		fill(255);
		arc(2.5, 0, 75, 25, -QUARTER_PI/2, PI+(QUARTER_PI/2));
		// detect if character has reached flagpole
		if(gameChar.x_pos > flagpole.x_pos-20 && gameChar.x_pos < flagpole.x_pos+20){
			flagpole.isReached=true;
		}
		if(flagpole.isReached == true){
			if(developer.godMode == false){
				game.levelComplete = true;	// don't allow level complete if in god mode
			}
			//Flag
			rect(5, -145, 80, 50);
			fill(255, 165, 0);
			triangle(20, -135, 20, -105, 50, -120);
			triangle(40, -135, 40, -120, 70, -120);
			ellipse(50, -120, 50, 25);
			fill(255);
			triangle(10, -125, 10, -105, 27, -120);
			ellipse(65, -125, 5, 5);
		}
	pop();
}

function drawCrystals(){
	for(var i=0; i<crystals.length; i++){				// loop through crystals array
		//check the distance between player and crystal, if <=25 then crystal is not drawn
		let crystalDistance = dist(crystals[i].x_pos, crystals[i].y_pos, gameChar.x_pos, gameChar.y_pos);
		if(crystalDistance <= 40){
			if(crystals[i].isFound==false){					// if player not found this crystal mark as found and update the total
				game.crystalsCollected +=1
				crystals[i].isFound=true;
				//Calculate in game score (crystals)
				game.score = (game.scoreBonusCrystal*game.crystalsCollected);
			}
		}
		if(crystals[i].isFound == false){					// drow the crystal if it has not been found already
			//Crystal (Collectable)
			push();
				translate(crystals[i].x_pos,crystals[i].y_pos);
				scale(crystal.size,crystal.size);
				//Outside layer
				noStroke();
				fill(111, 70, 133);
				triangle(0, 20, -10, 10, +10, 10);
				rect(-10, -10, 20, 20);
				triangle(-10, -10, 0, -20, 10, -10);
				//Inside layer
				fill(161, 120, 183);
				triangle(0, 15, -5, 10, 5, 10);
				rect(-5, -10, 10, 20);
				triangle(-5, -10, 0, -15, 5, -10);
			pop();
		}
		// animate crystal
		if(gameChar.animFrame%2 == 0) crystals[i].y_pos -= crystal.anim
		else crystals[i].y_pos += crystal.anim;
	}
}

//Game Character
function charStand(s,x,y){		//s = -1 for move left and 1 for right
	push();
		translate(x,y);		// reset origin
		scale(gameChar.scale_x,gameChar.scale_y*s);							// increase size of character
		strokeWeight(0.5);								// outline weight
		stroke(0);										// outline colour
		//limbs
		fill(gameChar.colourLimb);								// limbs
		rect(-11.5, -18, 5, 10, 2, 2, 2, 2);			// left arm
		rect(+6.5, -18, 5, 10, 2, 2, 2, 2);				// right arm
		rect(-6.5, -5, 5, 7, 0, 0, 2, 2);				// left Leg
		rect(+1.5, -5, 5, 7, 0, 0, 2, 2);				// rightleg
		//Torso
		fill(gameChar.colourTorso);
		ellipse(0, -13, 17, 20);						// belly
		rect(-8, -23, 16, 20, 5);						// body
		noFill();
		arc(0, -18, 20, 20, PI/4, HALF_PI+HALF_PI/2);	// body detail
		//Head
		fill(gameChar.colourEars);
		rect(-12, -28, 24 ,10 ,4);						// ears
		fill(gameChar.colourBase);
		ellipse(0, -23, 20 ,20);						// base
		fill(gameChar.colourVisor);
		ellipse(0, -22, 20 ,15);						// visor
		fill(gameChar.colourTorso);
		stroke(gameChar.colourVisor);
		ellipse(7,-22,3,3.5);							// visor glint 1
		ellipse(6,-19,2,2.5);							// visor glint 2
		noStroke();
		beginShape();									// visor glint 3
		vertex(-8.5,-20);
		bezierVertex( -8,-19, -12, -26, -1 ,-28 );
		bezierVertex( -3, -28, -8, -24,-8.5,-21);
		endShape();
	pop();
}

function charFall(s,x,y){		//s = -1 for move left and 1 for right
	push();
		translate(x,y+gameChar.animJumpHeight[gameChar.animFrame]);		 // reset origin
		scale(gameChar.scale_x,gameChar.scale_y*s);											// increase size of character
		strokeWeight(0.5);												// outline weight
		stroke(0);														// outline colour
		//Legs
		fill(gameChar.colourLimb);
		rect(-6.5, -5, 5, 7, 0, 0, 2, 2);								// left Leg
		rect(+1.5, -5, 5, 7, 0, 0, 2, 2);								// right leg
		fill(gameChar.colourTorso);
		ellipse(0, -10.5, 17, 20);										// belly
		rect(-8, -20.5, 16, 20, 5);										// body
		noFill();
		arc(0, -14.5, 20, 20, PI/4, HALF_PI + HALF_PI/2);				// body detail
		//Left arm
		fill(gameChar.colourLimb);
		push();															// push origin and rotation so can rotate the arm
			translate(-11.5+(5/2), -15.5);									// this is a translation from the previous reset origin
			rotate(PI/-6);
			rect(-(5/2), 0, 5, 10, 2, 2, 2, 2);								// left arm
		pop();
		//Right arm
		push();															// push origin and rotation so can rotate the arm
			translate(+6.5 + (5/2), -15.5);									// this is a translation from the previous reset origin
			rotate(PI/6);
			rect(-(5/2), 0, 5, 10 , 2, 2, 2, 2);							// right arm
		pop();
		//Head
		fill(gameChar.colourEars);
		rect(-12, -24.5, 24 ,10 ,4);									// ears
		fill(gameChar.colourBase);
		ellipse(0, -20, 20 ,20);										// helmet base
		fill(gameChar.colourVisor);
		ellipse(0, -19, 20 ,13); 										// visor
		fill(gameChar.colourTorso);
		stroke(gameChar.colourVisor)
		ellipse(7,-19,3,3.5);											// visor glint 1
		ellipse(6,-16,2,2.5);											// visor glint 2
		noStroke();
		beginShape();													// visor glint 3
			vertex(-8.5,-17);
			bezierVertex( -8,-16, -12, -23, -1 ,-25 );
			bezierVertex( -3, -25, -8, -21,-8.5,-18);
		endShape();
	pop();
}

function charWalk(s,x,y){		//s = -1 for move left and 1 for right
	push();
		translate(x,y);
		scale(s* gameChar.scale_x,gameChar.scale_y); 								// increase size of the character
		strokeWeight(0.5);
		stroke(0);
		//Left Leg
		push(); 												// push origin and rotation
			fill(gameChar.colourLimb);
			translate(+(5/2),-5);
			rotate(PI/(gameChar.animLimbB[gameChar.animFrame]));					// use the array for this limbs frames
			rect(-(5/2), 0 ,5 ,7 ,0, 0, 2, 2);
		pop(); 													// pop back the orign and rotation for the rest of the shapes
		//Rightleg
		push(); 												// push origin and rotation
			fill(gameChar.colourLimb);
			translate((5/2),-5);
			rotate(PI/(gameChar.animLimbA[gameChar.animFrame]));					// use the array for this limbs frames
			rect(-(5/2), 0 ,5 ,7 ,0, 0, 2, 2);
		pop(); 													// pop back the orign and rotation for the rest of the shapes
		//Left arm
		push(); 												// push origin and rotation
			fill(gameChar.colourLimb);
			translate((5/2),-18);
			rotate(PI/(gameChar.animLimbA[gameChar.animFrame]));					// Use limb anim for right leg as arm moves forward with right leg
			rect(-(5/2),0 ,5 ,10 ,2, 2, 2, 2);
		pop();													// pop origin and rotation
		//Torso
		fill(gameChar.colourTorso);
		stroke(0);
		ellipse(3, -13, 9 ,20);
		rect(-1, -23, 7, 20, 5);
		if (game.oxygenRemaining > 50) {				// change character oxygen tank colour when oxygen is low
				fill(gameChar.colourTank);
		}else {
				fill(210, 43, 43);
		}
		stroke(0);
		rect(-5+(gameChar.animFrame%2)*-1, -20+(gameChar.animFrame%2)*-1, 5, 15, 5);					// use animframe mod 2 to animate
		fill(200,200,200);
		rect(-5+(gameChar.animFrame%2)*-1, -20+(gameChar.animFrame%2)*-1, 5, (100-game.oxygenRemaining)*0.15);					// show remaining oxygen on character
		//Right arm
		push();																		// push origin and rotation
			fill(gameChar.colourLimb);
			translate((5/2),-18);
			rotate(PI/(gameChar.animLimbB[gameChar.animFrame]));										// Use limb anim for left leg as arm moves forward with left leg
			rect(-(5/2),0 ,5 ,10 ,2, 2, 2, 2);
		pop();																		// pop origin and rotation
		//Helmet
		push();
			stroke(0);
			//Base
			fill(gameChar.colourBase);
			ellipse((3+(gameChar.animFrame%2)*-1), (-23+(gameChar.animFrame%2)*-1) ,20 ,20);
			//Visor (use animframe mod 2 to animate)
			fill(gameChar.colourVisor);
			arc((3+(gameChar.animFrame%2)*-1),(-23+(gameChar.animFrame%2)*-1),20 ,20 ,-PI/4,PI/4);
			//Ears (use animframe mod 2 to animate)
			fill(gameChar.colourEars);
			rect((-1+(gameChar.animFrame%2)*-1), (-28+(gameChar.animFrame%2)*-1), 7 ,10 ,4);
		pop();
	pop();
}

function charFallMoving(s,x,y){				//s = -1 for move left and 1 for right
	//Jumping-right code
	push();
		translate(x,y+gameChar.animJumpHeight[gameChar.animFrame]);				// use the height array indexed by the frame for the height movement
		scale(s* gameChar.scale_x,gameChar.scale_y);
		strokeWeight(0.5);
		stroke(0);
		//Left Leg
		fill(gameChar.colourLimb);
		push();
			translate(+(5/2),-5);
			rotate(PI/(gameChar.animJumpLeg[gameChar.animFrame])*-1);		// use the jump array indexed by the frame for the limb angles
			rect(-(5/2), 0 ,5 ,7 ,0, 0, 2, 2);
		pop();
		//Torso
		fill(gameChar.colourTorso);
		stroke(0);
		ellipse(+3, -13, 9 ,20);
		rect(-1, -23, 7, 20, 5);
		if (game.oxygenRemaining > 50) {				// change character oxygen tank colour when oxygen is low
				fill(gameChar.colourTank);
		}else {
				fill(210, 43, 43);
		}
		stroke(0);
		rect(-5, -20, 5, 15, 5);
		fill(200,200,200);
		rect(-5, -20, 5, (100-game.oxygenRemaining)*0.15);
//		fill(gameChar.colourTank);
//		rect(-5, -20, 5, 15, 5);
		//Right arm
		fill(gameChar.colourLimb);
		push();
			translate(+(5/2),-18);
			rotate(PI/(gameChar.animJumpArm[gameChar.animFrame])*-1);				// use the jump array indexed by the frame for the limb angles
					rect(-(5/2),0 ,5 ,10 ,2, 2, 2, 2);
		pop();
		// Helmet
		stroke(0);
		//Base
		fill(gameChar.colourBase);
		ellipse(+3, -23 ,20 ,20);
		//Visor
		fill(gameChar.colourVisor);
		arc(+3, -23 ,20 ,20 ,-PI/4,PI/4);
		//Ears
		fill(gameChar.colourEars);
		rect(-1, -28, 7 ,10 ,4);
	pop();
}

//Developer Mode
function drawDevControls(){
	push();
		translate((width-sidebarWidth)-260-20,20);
		noStroke();
		//Background Box
		fill(25,25,25,50);
		rect(0,0,260,180,10);
		fill(255,255,255,100);
		//Text explaining developer controls
		text("Developer Mode is ON", 20, 20);
		text("keybinds:", 20, 40);
		text("increase / decrease character speed", 50,60);
		text("= / -", 20, 60);
		text("increase / decrease character size", 50,80);
		text("+ / _", 20, 80);
		text("reset character position to spawn", 50,100);
		text("0", 20, 100);
		text("Moves flagpole near spawn", 50,120);
		text("9", 20, 120);
		text("decrements life by 1", 50,140);
		text("8", 20, 140);
		text("toggle God mode. God mode is "+developer.godMode, 50,160);
		text("7", 20, 160);
	pop();
}

// function to output text on the screen centred - was repeated code
function messageCentre(mText,mSize,mLine){
	textSize(innerWidth/mSize);
	messageWidth = textWidth(mText);
	text(mText,((width-sidebarWidth)/4)-messageWidth/2 ,((height/1.5)/2)+((innerWidth/mSize)*2)*mLine);
}

function drawEndGame(){
	if(game.levelCompleteFrame == 0){
		game.levelCompleteFrame = frameCount;	// remember the framecount when we finish the level so we can time animations
	}
	fill(0,0,0,150);
	rect(0,0,width,height);
	gameChar.isLeft = false;
	gameChar.isRight = false;
	stroke(61, 20, 83); // text outline colour - purple
	strokeWeight(10);
	fill(111, 70, 133); // text outline coloure lighter puruple
	push();
		translate((width-sidebarWidth)/4,0);
		textSize(innerWidth/15);
		if(game.gameOver == true){
			game.oxygenRemaining = 0;
			messageText = "Game Over";
		}
		else{
			game.oxygenRemaining = round(game.oxygenRemaining);
			// game.oxygenGain = 0;   //  fix bug when no oxygen gain on restart after level complete
			messageText = "Level Complete";
		}
		messageCentre(messageText,15,0);
		if(round((frameCount-game.levelCompleteFrame)/game.framesPerSecond) >= 2){
			messageCentre("Score: " + game.score,30,1);
		}
		if(round((frameCount-game.levelCompleteFrame)/game.framesPerSecond) >= 4){
			messageCentre("Lives Bonus: " + game.lives + " x " + game.scoreBonusLives + " = " + (game.lives*game.scoreBonusLives),30,2);
		}
		if(round((frameCount-game.levelCompleteFrame)/game.framesPerSecond) == 5){
			game.score = (game.crystalsCollected*game.scoreBonusCrystal)+(game.scoreBonusLives*game.lives);
		}
		if(round((frameCount-game.levelCompleteFrame)/game.framesPerSecond) >= 6){
			messageCentre("Remaining O2 Bonus: " + game.oxygenRemaining + " x " + game.scoreBonusOxygen + " = " + (game.oxygenRemaining*game.scoreBonusOxygen),30,3);
		}
		if(round((frameCount-game.levelCompleteFrame)/game.framesPerSecond) == 7){
			game.score = (game.crystalsCollected*game.scoreBonusCrystal)+(game.scoreBonusLives*game.lives)+(game.scoreBonusOxygen*game.oxygenRemaining);
		}
		if(round((frameCount-game.levelCompleteFrame)/game.framesPerSecond) >= 7){
			messageCentre("restarting in " + (15-(round((frameCount-game.levelCompleteFrame)/game.framesPerSecond))),30,4);
		}
		if(round((frameCount-game.levelCompleteFrame)/game.framesPerSecond) >= 15){			 // after 15 seconds restart
			game.gameOver = false;
			game.gameStarted = false;
			game.levelComplete = false;
			flagpole.isReached = false;
			frameCount = 0;
			game.levelCompleteFrame = 0;
			resetLevel();
			resetCharacter();
		}
	pop();
}

function drawStartGame(){
	fill(0,0,0,150);
	rect(0,0,width,height);
	gameChar.isLeft = false;
	gameChar.isRight = false;
	stroke(61, 20, 83); // text outline colour - purple
	strokeWeight(10);
	fill(111, 70, 133); // text outline coloure lighter puruple
	push();
		translate((width-sidebarWidth)/4,0);
		textSize(innerWidth/15);
		game.oxygenRemaining = 100;
		messageCentre("Moon Dash!",10,0,1);
		messageCentre("jbrun001@gold.ac.uk presents...",100,-5,0);
		if(round((frameCount)/game.framesPerSecond) >= 1){
			messageCentre("Press 1 to Start",30,0.75);
		}
		if(round((frameCount)/game.framesPerSecond) >= 2){
			messageCentre("Collect crystals. Get to the flag",40,2,2);
		}
		if(round((frameCount)/game.framesPerSecond) >= 3){
			messageCentre("Avoid the swamp, meteors and ",40,2.75);
		}
		if(round((frameCount)/game.framesPerSecond) >= 4){
			messageCentre("don't run out of O2! (trees replenish O2)",40,3.5);
		}
		if(round((frameCount)/game.framesPerSecond) >= 5){
			messageCentre("Keys: WAD / Arrows and Space",40,4.25);
		}
		if(round((frameCount)/game.framesPerSecond) >= 6){
			messageCentre("Bonuses for lives and oxygen left",40,5);
		}
		if(round((frameCount)/game.framesPerSecond) >= 7){
			messageCentre("Good Luck! (you will need it)",40,5.75);
		}
	pop();
}
