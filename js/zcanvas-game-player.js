// ZCANVAS
// GAME
// PLAYER
//////////

		function zc_editor_player(dat,position,area) {
			var self = this;
			this.dat = dat;
			this.position = position;
			this.area = area;

			
// SETUP
//////////

			// create sprite canvas
			this.canvas = document.createElement("canvas");
			this.canvas.width = 64;
			this.canvas.height = 64;
			this.context = this.canvas.getContext("2d");
			
			// set up collision values
			this.collision = {};
			this.collision.w = 16;
			this.collision.h = 16;
			
			// calculate offsets for drawing
			this.offset = {};
			this.offset.x = parseInt((this.canvas.width/2)-(this.collision.w/2));
			this.offset.y = parseInt((this.canvas.height/2)-(this.collision.h/2));
	
	
// SPRITE
//////////
	
	// setup
	//////////
	
			// set up sprite values
			this.sprite = 0; // id of the sprite sheet to use
			this.spriteFrame = 0;
			this.sprites = {
				'up':   {y:0,x:{'stop':[0],'walk':[0,1,2,3,4,5,6],'stopWater':[8,8,9,9],'swim':[10,10,11,11],'jump':[7]}},
				'down': {y:1,x:{'stop':[0],'walk':[0,1,2,3,4,5,6],'stopWater':[8,8,9,9],'swim':[10,10,11,11],'jump':[7]}},
				'left': {y:2,x:{'stop':[0],'walk':[0,1,2,3,4,5,6],'stopWater':[8,8,9,9],'swim':[10,10,11,11],'jump':[7]}},
				'right':{y:3,x:{'stop':[0],'walk':[0,1,2,3,4,5,6],'stopWater':[8,8,9,9],'swim':[10,10,11,11],'jump':[7]}}
			};
			this.spriteDirection = 'down';
			this.spriteAction = 'stop';
			this.spriteOffset = 0;

			
			// calculate which frame of sprite animation to use
			this.spriteFrameCalculate = function() {
				var arr = this.sprites[this.spriteDirection].x[this.spriteAction];
				this.spriteOffset++;
				if (1<this.spriteOffset) {
					this.spriteOffset = 0;
					this.spriteFrame++;
					if (arr.length<=this.spriteFrame) {
						this.spriteFrame = 0;
					}
				}
			}
			
			// select sprite image to draw
			this.spriteAnimate = function() {
				this.spriteFrameCalculate();
				var d = this.sprites[this.spriteDirection];
				this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
				var y1 = -parseInt(d.y*64);
				var x1 = -parseInt(d.x[this.spriteAction][this.spriteFrame]*64);
				var img = this.dat.img.sprites[this.sprite].img;
				this.context.drawImage(img,x1,y1);
			}
			

	// change current sprite
	//////////
	
			// set direction
			this.spriteUp = function() {
				if (this.spriteDirection!='up') {
					this.spriteDirection = 'up';
				}
			}
			this.spriteDown = function() {
				if (this.spriteDirection!='down') {
					this.spriteDirection = 'down';
				}
			}
			this.spriteLeft = function() {
				if (this.spriteDirection!='left') {
					this.spriteDirection = 'left';
				}
			}
			this.spriteRight = function() {
				if (this.spriteDirection!='right') {
					this.spriteDirection = 'right';
				}
			}
			
			// set action
			this.spriteStop = function() {
				if (this.spriteAction!='stop') {
					this.spriteAction = 'stop';
					this.spriteOffset = 0;
					this.spriteFrame = 0;
				}
			}	
			this.spriteWalk = function() {
				if (this.spriteAction!='walk') {
					this.spriteAction = 'walk';
					this.spriteOffset = 0;
					this.spriteFrame = 0;
				}
			}
			this.spriteStopWater = function() {
				if (this.spriteAction!='stopWater') {
					this.spriteAction = 'stopWater';
					this.spriteOffset = 0;
					this.spriteFrame = 0;
				}
			}	
			this.spriteSwim = function() {
				if (this.spriteAction!='swim') {
					this.spriteAction = 'swim';
					this.spriteOffset = 0;
					this.spriteFrame = 0;
				}
			}	
			this.spriteJump = function() {
				if (this.spriteAction!='jump') {
					this.spriteAction = 'jump';
					this.spriteOffset = 0;
					this.spriteFrame = 0;
				}
			}

	
		
			
// ACTION TILES
//////////

			// setup
			this.actionCheck = function() {
				this.teleport();
				this.floorTransition();
			}
			
			// floor transition
			this.floorUpTrigger = false;
			this.floorUpGraphicTrigger = false;
			this.floorDownTrigger = false;
			this.floorTransition = function() {
				var matchUp = this.actionTileMatch(2,true);
				if (matchUp.trigger) {
					this.floorUpGraphicTrigger = true;
				} else {
					this.floorUpGraphicTrigger = false;
				}
				var matchUp = this.actionTileMatch(2);
				var matchDown = this.actionTileMatch(3);
				if (matchUp.trigger) {
					if (!this.floorUpTrigger&&!this.floorDownTrigger) {
						this.floorUpTrigger = true;
					}
				} else if (matchDown.trigger) {
					if (!this.floorUpTrigger&&!this.floorDownTrigger) {
						this.floorDownTrigger = true;
					}
				} else {
					if (this.floorUpTrigger) {
						this.floorUpTrigger = false;
						var coords = this.getLocationCoordsCurrent(8);
						if (this.matchTilesWalkable(coords,[parseInt(this.position.z+1)])) {
							this.position.z++;
						}
					}
					if (this.floorDownTrigger) {
						this.floorDownTrigger = false;
						var coords = this.getLocationCoordsCurrent(8);
						if (this.matchTilesWalkable(coords,[parseInt(this.position.z-1)])) {
							this.position.z--;
						}
					}
				}
			}
			
			// teleport
			this.teleportTrigger = false;
			this.teleportLocation;
			this.teleport = function() {
				var m = this.actionTileMatch(1);
				if (m.trigger) {
					this.teleportTrigger = true;
					this.teleportLocation = m.dat;
				} else {
					this.teleportTrigger = false;
				}
			}
			
			// match tiles
			this.actionTileMatch = function(id,fullCanvas) {
				var trigger = false;
				var dat;
				var d = this.dat.json.areas[this.area.id].tiles[this.position.z];
				var coords;
				if (fullCanvas) {
					coords = this.getLocationCoordsCurrentFull(16);
				} else {
					coords = this.getLocationCoordsCurrent(16);
				}
				for (y=0; y<coords.length; y++) {
				for (x=0; x<coords[y].length; x++) {
					if (0<coords[y][x].x&&
						0<coords[y][x].y&&
						coords[y][x].x<d[y].length&&
						coords[y][x].y<d.length) {
						var d2 = d[coords[y][x].y][coords[y][x].x][1];
						if (d2[0]==id) {
							trigger = true;
							dat = d2[1];
						}
					}
				}
				}
				return {trigger:trigger,dat:dat};
			}
	
// MATCH TILES
//////////

			// set up tile triggers
			this.swim = false;
			this.climb = false;
			
			// match tiles
			this.tileCheck = function() {
				var coords = this.getLocationCoordsCurrent(8);
				if (this.matchLadder(coords,[this.position.z])) {
					this.climb = true;
				} else {
					this.climb = false;
				}
				if (this.matchWater(coords,[this.position.z])) {
					this.swim = true;
					this.slip = true;
				} else if (this.floorUpTrigger&&
					this.matchWater(coords,[this.position.z,parseInt(this.position.z+1)])) {
					this.swim = true;
					this.slip = true;
				} else if (this.floorDownTrigger&&
					this.matchWater(coords,[this.position.z,parseInt(this.position.z-1)])) {
					this.swim = true;
					this.slip = true;
				} else {
					this.swim = false;
					this.slip = false;
					this.slipCountReset();
				}
			}

	
	// slippery
	//////////
	
			// setup
			this.slip = false;
			this.slipCount;
			this.slipCountReset = function() {
				this.slipCount = {'up':0,'down':0,'left':0,'right':0};
			}
			this.slipCountReset();
			
			// add to the slip counter
			this.slipAdd = function(dir) {
				if (this.slipCount[dir]<24) {
					this.slipCount[dir]++;
				}
			}
			
			// subtract from the slip counter
			this.slipSubtract = function(dir) {
				if (0<this.slipCount[dir]) {
					this.slipCount[dir]--;
				}
			}
			
			// get slip speed
			this.slipSpeed = function(dir) {
				var n = this.slipCount[dir];
				var s = 0;
				if (n<16&&4<n) {
					s = 1;
				}
				if (15<n) {
					s = 2;
				}
				return s;
			}
		

// JUMPING
//////////

			// setup
			this.jumpDir = '';
			this.jumpCount;
			this.jumpStore = {x:0,y:0};
			this.jumpCountReset = function(dir) {
				this.jumpCount[dir] = 0;
			}
	
			// jump trigger clear
			this.jumpStop = function() {
				this.jump = false;
				this.jumpMoveCount = 0;
				this.jumpEnd = false;
				this.jumpEndCount = 0;
			}
			this.jumpStop();
	
			// counting
			this.jumpTrig = function(dir) {
				if (!this.jump) {
					this.jumpCount[dir]++;
					if (16<this.jumpCount[dir]) {
						this.jump = true;
						this.jumpDir = dir;
						this.jumpStore.y = parseInt(this.position.y);
						this.jumpStore.x = parseInt(this.position.x);
						this.jumpTrigClear();
					}
				}
			}
			
			// counting clear
			this.jumpTrigClear = function() {
				this.jumpCount = {'up':0,'down':0,'left':0,'right':0,'upleft':0,'upright':0,'downleft':0,'downright':0};
			}
			this.jumpTrigClear();

			// move
			this.jumpMoveCount = 0;
			this.jumpMove = function(dir) {
				if (this.jumpEnd) {
					this.spriteStop();
					this.jumpEnding();
				} else {
					this.spriteJump();
					this.jumpMoveAction(dir);
				}
			}
			
			// move action
			this.jumpMoveAction = function(dir) {
				var s = this.jumpSpeedCalc(this.jumpMoveCount);
				if (dir=='up')        { this.position.y -= s; }
				if (dir=='down')      { this.position.y += s; }
				if (dir=='left')      { this.position.x -= s; }
				if (dir=='right')     { this.position.y += s; }
				if (dir=='upleft')    { this.position.y -= s; this.position.x -= s; }
				if (dir=='upright')   { this.position.y -= s; this.position.x += s; }
				if (dir=='downleft')  { this.position.y += s; this.position.x -= s; }
				if (dir=='downright') { this.position.y += s; this.position.x += s; }
				if (dir=='left'||dir=='right') {

				}
				var coords16 = this.getLocationCoordsCurrent(16);
				if (!this.matchAnyTiles(coords16,this.position.z).single) {
					this.position.z--;
				}
				if (8<this.jumpMoveCount) {
					var coords8 = this.getLocationCoordsCurrent(8);
					if (this.matchTilesWalkable(coords8,[this.position.z])) {
						if (this.matchWater(coords8,[this.position.z])) {
							this.jumpStop();
						} else {
							this.spriteStop();
							this.jumpEnd = true;
						}
					}
				}
				this.jumpMoveCount++;
			}
			
			// calculate jump speed based on number of frames
			this.jumpSpeedCalc = function(n) {
				var s = 0;
				if (n<4) { s = 0; }
				else if (3<n&&n<6) { s = 1; }
				else if (5<n&&n<8) { s = 3; }
				else if (7<n&&n<10) { s = 5; }
				else { s = 8; }
				return s;
			}
			
			// jump ending
			this.jumpEnd = false;
			this.jumpEndCount = 0;
			this.jumpEnding = function() {
				this.jumpEndCount++;
				if (8<this.jumpEndCount) {
					this.jumpStop();
				}
			}



			

// MOVE PLAYER
//////////

			// main function
			this.interaction = function() {
				if (this.jump) {
					this.jumpMove(this.jumpDir);
				} else {
					this.actionCheck();
					this.tileCheck();
					if ((keyU||keyD||keyL||keyR)&&!keyCancel) {
						if (this.swim) {
							this.spriteSwim();
						} else {
							this.spriteWalk();
						}
						if (keyU) { this.moveUp(); }
						if (keyD) { this.moveDown(); }
						if (keyL) { this.moveLeft(); }
						if (keyR) { this.moveRight(); }
					} else {
						if (this.swim) {
							this.spriteStopWater();
						} else {
							this.spriteStop();
						}
					}
					this.move();
				}
			}

			// triggers
			this.moveTrigger;
			this.moveTriggerReset = function() {
				this.moveTrigger = {'up':false,'down':false,'left':false,'right':false};
			}
			this.moveTriggerReset();

			// directions
			this.moveUp = function() {
				this.spriteUp();
				this.moveTrigger.up = true;
			}
			this.moveDown = function() {
				this.spriteDown();
				this.moveTrigger.down = true;
			}
			this.moveLeft = function() {
				this.spriteLeft();
				this.moveTrigger.left = true;
			}
			this.moveRight = function() {
				this.spriteRight();
				this.moveTrigger.right = true;
			}
			
			// calculate speed
			this.calculateSpeed = function(dir) {
				var sp = 0;
				if (this.moveTrigger[dir]) {
					if (this.climb) {
						sp = 1;
					} else {
						sp = 3;
					}
				}
				if (this.slip) {
					if (this.moveTrigger[dir]) {
						this.slipAdd(dir);
					} else {
						this.slipSubtract(dir);
					}
					sp = this.slipSpeed(dir);
				}
				return sp;
			}
			
			// move
			this.moveJumpTrig = false;
			this.moveJumpDir;
			this.move = function() {
				this.moveJumpTrig = false;
				this.moveAction(-this.calculateSpeed('up'),0,'up');
				this.moveAction(this.calculateSpeed('down'),0,'down');
				this.moveAction(0,-this.calculateSpeed('left'),'left');
				this.moveAction(0,this.calculateSpeed('right'),'right');		
				if (this.moveJumpTrig) {
					this.jumpTrig(this.moveJumpDir);
				} else {
					this.jumpTrigClear();
				}
				this.moveTriggerReset();
			}
			
			// move action
			this.moveAction = function(ySpeed,xSpeed,dir) {
				var jumpT = false;
				var jumpDir;
				if (0<Math.abs(ySpeed)||0<Math.abs(xSpeed)) {
					var edge = this.tileEdge(this.position.y+ySpeed,this.position.x+xSpeed,this.collision.h,this.collision.w);
					var coords = this.getLocationCoords(this.position.y+ySpeed,this.position.x+xSpeed,this.collision.h,this.collision.w,8);
					var walk = this.moveCheckerWalkable(coords);
					if (walk) {
						this.position.y += ySpeed;
						this.position.x += xSpeed;
					} else {
						var edg = this.moveFindEdge(ySpeed,xSpeed,dir);
						if (!edg) {
							this.nudgeWalk(dir,coords);
							if (this.matchJump[dir](coords,[this.position.z])) {
								this.moveJumpTrig = true;
								this.moveJumpDir = dir;
							}
							var jDiag = this.matchJumpDiagonal(coords,[this.position.z],dir);
							if (jDiag.trigger) {
								this.moveJumpTrig = true;
								this.moveJumpDir = jDiag.dir;
							}
						}
					}
				}
			}
			
			// if close to edge, move towards it
			this.nudgeWalk = function(dir,coords) {
				if (dir=='up') {
					if (this.matchNudgeUpRight(coords,[this.position.z])) {
						this.position.x += 1;
					} else if (this.matchNudgeUpLeft(coords,[this.position.z])) {
						this.position.x -= 1;
					}
				}
				if (dir=='down') {
					if (this.matchNudgeDownRight(coords,[this.position.z])) {
						this.position.x += 1;
					} else if (this.matchNudgeDownLeft(coords,[this.position.z])) {
						this.position.x -= 1;
					}
				}
			}
			
			// if can't move at full speed, move to the edge of the tile
			this.moveFindEdge = function(ySpeed,xSpeed,dir) {
				var trig = false;
				var d = this.tileEdge(this.position.y,this.position.x,this.collision.h,this.collision.w);
				if (ySpeed<d.up&&0<d.up&&dir=='up') {
					this.position.y -= d.up;
					trig = true;
				}
				if (d.down<ySpeed&&0<d.down&&dir=='down') {
					this.position.y += d.down;
					trig = true
				}
				if (xSpeed<d.left&&0<d.left&&dir=='left') {
					this.position.x -= d.left;
					trig = true
				}
				if (d.right<xSpeed&&0<d.right&&dir=='right') {
					this.position.x += d.right;
					trig = true
				}
				return trig;
			}

		
// TILE CALCUATION
//////////
		
		
			// calculate walkable stuff
			this.moveCheckerWalkable = function(coords) {
				var ret;
				if (this.floorUpTrigger) {
					ret = this.matchTilesWalkable(coords,[this.position.z,parseInt(this.position.z+1)]);
				} else if (this.floorDownTrigger) { 
					ret = this.matchTilesWalkable(coords,[this.position.z,parseInt(this.position.z-1)]);
				} else {
					ret = this.matchTilesWalkable(coords,[this.position.z]);
				}
				return ret;
			}
		
			// match walkable tiles
			this.matchTilesWalkable = function(arr,z) {
				return this.matchTiles(arr,z,[0,2,3,4,5,6,7,8]).all;
			}
			
			// match a nudge walk
			this.matchNudgeUpRight = function(arr,z) {
				var wall = [[arr[0][0]]];
				var walk = [[arr[0][parseInt(arr[0].length-1)]]];
				return this.matchNudge(walk,wall,z);
			}
			this.matchNudgeUpLeft = function(arr,z) {
				var walk = [[arr[0][0]]];
				var wall = [[arr[0][parseInt(arr[0].length-1)]]];
				return this.matchNudge(walk,wall,z);			
			}
			this.matchNudgeDownRight = function(arr,z) {
				var wall = [[arr[parseInt(arr.length-1)][0]]];
				var walk = [[arr[parseInt(arr.length-1)][parseInt(arr[0].length-1)]]];
				return this.matchNudge(walk,wall,z);
			}
			this.matchNudgeDownLeft = function(arr,z) {
				var walk = [[arr[parseInt(arr.length-1)][0]]];
				var wall = [[arr[parseInt(arr.length-1)][parseInt(arr[0].length-1)]]];
				return this.matchNudge(walk,wall,z);
			}
			
			// match nudge
			this.matchNudge = function(walk,wall,z) {
				var trig = false;
				if (this.matchTiles(walk,z,[0,2,3,4,5,6,7,8]).all&&
					this.matchTiles(wall,z,[1]).all) {
					trig = true;
				}
				return trig;
			}

			

			// match ladder tiles
			this.matchLadder = function(arr,z) {
				var obj = this.matchTiles(arr,z,[4]);
				return obj.single;
			}
			
			// match water tiles
			this.matchWater = function(arr,z) {
				var obj = this.matchTiles(arr,z,[3]);
				return obj.all;
			}
			
			// match jump tiles
			this.matchJump = {
				up:function(arr,z) {
					var newArr = [arr[0]];
					var obj = self.matchTiles(newArr,z,[13]);
					return obj.all;
				},
				down:function(arr,z) {
					var newArr = [arr[arr.length-1]];
					var obj = self.matchTiles(newArr,z,[14]);
					return obj.all;
				},
				left:function(arr,z) {
					var newArr = [];
					for (i=0; i<arr.length; i++) {
						newArr.push([arr[i][0]]);
					}
					var obj = self.matchTiles(newArr,z,[15]);
					return obj.all;
				},
				right:function(arr,z) {
					var newArr = [];
					for (i=0; i<arr.length; i++) {
						newArr.push([arr[i][arr[i].length-1]]);
					}
					var obj = self.matchTiles(newArr,z,[16]);
					return obj.all;			
				}
			};
			
			// match diagonal jump tiles
			this.matchJumpDiagonal = function(arr,z,dir) {
				var trig = false
				var newDir;
				if (dir=='up'||dir=='left') {
					var newArr = [[arr[0][0]]];
					var obj = this.matchTiles(newArr,z,[17]);
					if (obj.all) {
						newDir = 'upleft';
						trig = true;
					}
				}
				if (dir=='up'||dir=='right') {
					var newArr = [[arr[0][arr[0].length-1]]];
					var obj = this.matchTiles(newArr,z,[18]);
					if (obj.all) {
						newDir = 'upright';
						trig = true;
					}
				}
				if (dir=='down'||dir=='left') {
					var newArr = [[arr[arr.length-1][0]]];
					var obj = this.matchTiles(newArr,z,[19]);
					if (obj.all) {
						newDir = 'downleft';
						trig = true;
					}
				}
				if (dir=='down'||dir=='right') {
					var newArr = [[arr[arr.length-1][arr[0].length-1]]];
					var obj = this.matchTiles(newArr,z,[20]);
					if (obj.all) {
						newDir = 'downright';
						trig = true;
					}
				}
				return {trigger:trig,dir:newDir};
			}
			
			// match diagonal walk tiles
			this.matchWalkDiagonal = function(arr,z,dir) {
				var trig = false;
				var newDir;
				if (dir=='left') {
					if (this.matchWalkDiagonalLeftUp(arr,z)) {
						newDir = 'leftup';
						trig = true;
					}
				}
				return {trigger:trig,dir:newDir};
			}
			
			// match diagonal walk tiles up left
			this.matchWalkDiagonalLeftUp = function(arr,z) {
				var newArr = [[arr[arr.length-1][0]]];
				obj = this.matchTiles(newArr,z,[6]);
				return obj.all;
			}
						
			// match behaviour tiles to coordinates
			this.matchTiles = function(arr,zarr,idarr) {
				var trigger = {};
				trigger.single = false;
				trigger.all = true;
				var d = this.dat.json.areas[this.area.id].tiles;
				var t = this.dat.json.tiles;
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					var x1 = parseInt(arr[y][x].x);
					var y1 = parseInt(arr[y][x].y);
					var ids = this.translateLocationCoords(x1,y1);
					if (0<=ids.x&&ids.x<d[0][0].length&&
						0<=ids.y&&ids.y<d[0].length) {
						var trigg = false;
						for (z=0; z<zarr.length; z++) {
							var atile = d[zarr[z]][ids.y][ids.x][0];
							if (atile) {
								var ttile = t[atile[0]].behaviour[atile[1]][ids.subid];
								if (this.arrayMatch(idarr,ttile)) {
									trigg = true;
								}
							}
						}
						if (trigg) {
							trigger.single = true;
						} else {
							trigger.all = false;
						}
					} else {
						trigger.all = false;
					}
				}
				}
				return trigger;
			}
			
			// match any tiles to coordinates
			this.matchAnyTiles = function(arr,z) {
				var trigger = {single:false,all:true};
				var d = this.dat.json.areas[this.area.id].tiles[z];
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					var y1 = arr[y][x].y;
					var x1 = arr[y][x].x;
					if (0<=x1&&x1<d[0].length&&
						0<=y1&&y1<d.length) {
						var atile = d[y1][x1][0];
						if (atile) {
							trigger.single = true;
						} else {
							trigger.all = false;
						}
					} else {
						trigger.all = false;
					}
				}
				}
				return trigger;
			}
			
			// value match inside array
			this.arrayMatch = function(arr,val) {
				var trig = false;
				for (ar=0; ar<arr.length; ar++) {
					if (arr[ar]==val) {
						trig = true;
					}
				}
				return trig;
			}
		
			// get array of currently touched tiles
			this.getLocationCoordsCurrent = function(size) {
				return this.getLocationCoords(
					this.position.y,
					this.position.x,
					this.collision.h,
					this.collision.w,
					size
				);
			}
			
			// get array of currently touched tiles by full canvas
			this.getLocationCoordsCurrentFull = function(size) {
					return this.getLocationCoords(
					parseInt(this.position.y-this.offset.y),
					parseInt(this.position.x-this.offset.x),
					this.canvas.height,
					this.canvas.width,
					size
				);		
			}
			
			
			// build array of touched tile coordinates from a location
			this.getLocationCoords = function(y,x,h,w,size) {
				var arr = [];
				var tly = Math.floor(y/size);
				var tlx = Math.floor(x/size);
				var ny = parseInt(Math.ceil((y+h)/size)-tly);
				var nx = parseInt(Math.ceil((x+w)/size)-tlx);
				for (cy=0; cy<ny; cy++) {
					arr[cy] = [];
					for (cx=0; cx<nx; cx++) {
						arr[cy].push({y:parseInt(tly+cy),x:parseInt(tlx+cx)});
					}
				}
				return arr;
			}
			
			// calculate tile and subtile id's for x y co-ordinates
			this.translateLocationCoords = function(x,y) {
				var subid = 0;
				var x1 = x/2;
				var y1 = y/2;
				var x2 = Math.floor(x1);
				var y2 = Math.floor(y1);
				if (0<(y1-y2)) {
					if (0<(x1-x2)) {
						subid = 3;
					} else {
						subid = 2;
					}
				} else {
					if (0<(x1-x2)) {
						subid = 1;
					}
				}
				return {y:y2,x:x2,subid:subid};
			}
		
			// get distance to edges of tile
			this.tileEdge = function(y,x,h,w,noZero) {
				var obj = {};
				var up = ((this.position.y)/8);
				var down = ((this.position.y+this.collision.h)/8);
				var left = ((this.position.x)/8);
				var right = ((this.position.x+this.collision.w)/8);
				obj.up = parseInt((up-Math.floor(up))*8);
				obj.down = parseInt((Math.ceil(down)-down)*8);
				obj.left = parseInt((left-Math.floor(left))*8);
				obj.right = parseInt((Math.ceil(right)-right)*8);
				if (noZero) {
					if (obj.up==0) { obj.up = 8; }
					if (obj.down==0) { obj.down = 8; }
					if (obj.left==0) { obj.left = 8; }
					if (obj.right==0) { obj.right = 8; }
				}
				return obj;
			}
		
		
			
		}