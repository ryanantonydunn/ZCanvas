// ZCANVAS
// GAME
//////////

		function zc_game(dat) {
			var self = this;
			this.dat = dat;
			this.area;
			this.els = {};
			this.els.div = document.getElementById('zcanvas-game');

// SET UP
//////////

			// canvas
			this.canvas = document.createElement("canvas");
			this.canvas.width = 320;
			this.canvas.height = 240;
			this.context = this.canvas.getContext("2d");
			
			this.tempCanvas = document.createElement("canvas");
			this.tempCanvas.width = 320;
			this.tempCanvas.height = 240;
			this.tempContext = this.tempCanvas.getContext("2d");
			
			this.tempCanvasMask = document.createElement("canvas");
			this.tempCanvasMask.width = 320;
			this.tempCanvasMask.height = 240;
			this.tempContextMask = this.tempCanvasMask.getContext("2d");

			
// TITLEBAR
//////////
			
			// build
			this.els.titlebar = {};
			this.els.titlebar.div = document.createElement("div");
			this.els.titlebar.div.id = 'zc_game_titlebar';
			this.els.titlebar.div.className = 'titlebar';
			$('zcanvas-game').addChild(this.els.titlebar.div);
			
			// title
			this.els.titlebar.title = document.createElement("div");
			this.els.titlebar.title.className = 'title';
			this.els.titlebar.title.innerHTML = 'ZCanvas';
			$(this.els.titlebar.div.id).addChild(this.els.titlebar.title);
			this.titleVersionSet = function() {
				this.els.titlebar.title.innerHTML = 'ZCanvas (v'+this.dat.json.game.version+')';
			}
			
			
	// buttons
	//////////

			// main ul
			this.els.titlebar.buttons = {};
			this.els.titlebar.buttons.ul = document.createElement("ul");
			this.els.titlebar.buttons.ul.className = 'buttons';
			this.els.titlebar.buttons.ul.id = this.els.titlebar.div.id+'-buttons';
			$(this.els.titlebar.div.id).addChild(this.els.titlebar.buttons.ul);
			
			// reset
			this.els.titlebar.buttons.reset = document.createElement("li");
			this.els.titlebar.buttons.reset.id = this.els.titlebar.buttons.ul.id+'-reset';
			this.els.titlebar.buttons.reset.className = 'button';
			this.els.titlebar.buttons.reset.title = 'Reset Game';
			this.els.titlebar.buttons.reset.innerHTML = '<img src="images/icon-reset.png">';
			$(this.els.titlebar.buttons.ul.id).addChild(this.els.titlebar.buttons.reset);
			
			// reset action
			$(this.els.titlebar.buttons.reset.id).click(function(){
				self.reset();
			});
			
			// clear
			$(this.els.titlebar.div.id).addClearDiv();
			
			
// LOADING RESOURCES
//////////
			
			this.els.loading = document.createElement("div");
			this.els.loading.id = this.els.div.id+'-loading';
			this.els.loading.className = 'loading';
			this.els.loading.innerHTML = 'Loading Resources...';
			$('zcanvas-game').addChild(this.els.loading);

			
// INITIALISE
//////////
			
			// check for loaded data
			this.initialised = false;
			this.initialiseCheck = function() {
				if (this.dat.trigger) {
					var trig = false;
					for (i=0; i<this.dat.img.graphics.length; i++) {
						if (!this.dat.img.graphics[i].trigger) {
							trig = true;
						}
					}
					for (i=0; i<this.dat.img.sprites.length; i++) {
						if (!this.dat.img.sprites[i].trigger) {
							trig = true;
						}
					}
					if (!trig) {
						this.initialise();
					}
				}		
			}
			
			// on load
			this.initialise = function() {
				$(this.els.loading.id).hide();
				$(this.els.div.id).addChild(this.canvas);
				this.initialised = true;
				this.titleVersionSet();
				this.reset();
			}
			
			// reset game
			this.reset = function() {
				var d = this.dat.json.game.start;
				this.openAction(d);	
			}
			
			
	// handle areas
	//////////
			
			// teleport check
			this.teleportCheck = function() {
				if (this.player.teleportTrigger) {
					this.closeTrigger = true;
					this.closeNewArea = this.player.teleportLocation;
				}
			}
			
			// close area
			this.closeNewArea = {area:0,z:0,y:20,x:20};
			this.closeTrigger = false;
			this.closeCount = 0;
			this.closeAdd = function() {
				this.closeCount++;
				if (21<this.closeCount) {
					var c = this.closeNewArea;
					if (c.area==this.area.id) {
						this.openTrigger = true;
						this.player.position.z = c.z;
						this.player.position.y = parseInt(c.y*16);
						this.player.position.x = parseInt(c.x*16);	
					} else {
						this.openAction(c);
					}
					this.closeCount = 0;
					this.closeTrigger = false;
					this.player.teleportTrigger = false;
				}
			}
			
			// open area
			this.openCount = 0;
			this.openTrigger = false;
			this.openAdd = function() {
				this.openCount++;
				if (21<this.openCount) {
					this.openCount = 0;
					this.openTrigger = false;
				}			
			}
			this.openAction = function(loc) {
				this.openTrigger = true;
				this.loadArea(loc.area);
				this.loadPlayer({z:loc.z,y:parseInt(loc.y*16),x:parseInt(loc.x*16)});
			}

			
			// run every frame
			this.openFrame = function() {
				if (this.openTrigger) {
					this.openAdd();
					keyCancel = true;
				} else if (this.closeTrigger) {
					this.closeAdd();
					keyCancel = true;
				}
			}

			// start loading area
			this.loadArea = function(id) {
				this.clearCanvas();
				this.area = new zc_editor_area(id,this.dat);
			}
			
			// start loading player
			this.loadPlayer = function(start) {
				this.player = new zc_editor_player(this.dat,start,this.area);
			}			
			


// LAYERS
//////////		

			// animation frame check
			this.animFrame = 0;
			this.animFrameCount = 0;
			this.animCheck = function() {
				if (this.animFrameCount<8) {
					this.animFrameCount++;
				} else {
					if (this.animFrame<2) {
						this.animFrame++;
					} else {
						this.animFrame = 0;
					}
					this.animFrameCount = 0;
				}
			}

			// clear canvas
			this.clearCanvas = function() {
				this.context.fillStyle = 'black';
				this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
			}
			this.clearCanvas();
			
			// draw fades
			this.drawFade = function() {
				var n = 0;
				if (this.openTrigger) {
					n = 1-(this.openCount/30);
				} else if (this.closeTrigger) {
					n = (this.closeCount/30);
				}
				this.context.fillStyle = 'rgba(0,0,0,'+n+')';
				this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
			}
			

			// draw player value
			this.drawPlayer = 0;
			this.drawPlayerCalc = function() {
				this.drawPlayer = parseInt(this.player.position.z);
				if (this.player.floorUpGraphicTrigger) {
					this.drawPlayer++;
				}
			}
			
			// cut out circle from higher floors
			this.circleFade = 1;
			this.circleTrigger = false;
			this.layerCircleCut = function(offset,ctx) {
				var size = 48;
				var xx1 = parseInt(offset.px+32);
				var yy1 = parseInt(offset.py+32);
				this.tempContextMask.clearRect(0,0,this.tempCanvasMask.width,this.tempCanvasMask.height);
				this.tempContextMask.fillStyle = 'black';
				this.tempContextMask.beginPath();
				this.tempContextMask.arc(xx1, yy1, size, 0, Math.PI*2, true);
				this.tempContextMask.closePath();
				this.tempContextMask.fill();
				ctx.save();
				ctx.globalCompositeOperation = 'destination-out';
				ctx.drawImage(this.tempCanvasMask,0,0);
				ctx.restore();
				return ctx;
			}
			
			// calculate amount of fade on the circle cutter
			this.circleFadeCalc = function() {
				if (this.circleTrigger) {
					this.circleFade -= 0.1;
					if (this.circleFade<0.2) {
						this.circleFade = 0.2;
					}
				} else {
					this.circleFade += 0.1;
					if (1<this.circleFade) {
						this.circleFade = 1;
					}				
				}
			}
			
			// draw layers
			this.drawLayers = function() {
				var coords = this.player.getLocationCoordsCurrent(16);
				this.clearCanvas();
				this.drawPlayerCalc();
				var offset = this.calculateLayerPosition();
				this.circleTrigger = false;
				for (f=0; f<this.area.canvas.length; f++) {
					if (this.area.canvas[f]) {
						this.tempContext.clearRect(0,0,this.tempCanvas.width,this.tempCanvas.height);
						this.tempContext.drawImage(this.area.canvas[f][0],offset.x,offset.y);
						if (this.animFrame!=0) {
							this.tempContext.drawImage(this.area.canvas[f][this.animFrame],offset.x,offset.y);
						}
						if (this.drawPlayer<f) {
							if (this.player.matchAnyTiles(coords,f).all) {
								this.circleTrigger = true;
							}
							if (this.circleTrigger||this.circleFade<1) {
								this.tempContext = this.layerCircleCut(offset,this.tempContext);
								this.tempContext.save();
								this.tempContext.globalAlpha = this.circleFade;
								this.tempContext.drawImage(this.area.canvas[f][0],offset.x,offset.y);
								if (this.animFrame!=0) {
									this.tempContext.drawImage(this.area.canvas[f][this.animFrame],offset.x,offset.y);
								}
								this.tempContext.restore();
								this.circleFadeCalc();
							}
						}
						this.context.drawImage(this.tempCanvas,0,0);
						if (this.drawPlayer==f) {
							this.context.drawImage(this.player.canvas,offset.px,offset.py);
						}
					}
				}
				this.drawFade();
			}
			


			
			// calculate layer position
			this.calculateLayerPosition = function() {
				var obj = {};
				var p = this.player;
				obj.px = parseInt(this.canvas.width-p.canvas.width)/2;
				obj.py = parseInt(this.canvas.height-p.canvas.height)/2;
				obj.y = parseInt(-p.position.y+obj.py+p.offset.y);
				obj.x = parseInt(-p.position.x+obj.px+p.offset.x);
				var checkY = -parseInt(this.area.height-this.canvas.height);
				var checkX = -parseInt(this.area.width-this.canvas.width);
				if (obj.y<checkY) {
					obj.py += parseInt(checkY-obj.y);
					obj.y = checkY;
				}
				if (obj.x<checkX) {
					obj.px += parseInt(checkX-obj.x);
					obj.x = checkX;
				}
				if (0<obj.y) {
					obj.py -= obj.y;
					obj.y = 0;
				}
				if (0<obj.x) {
					obj.px -= obj.x;
					obj.x = 0;
				}
				if (this.player.jumpEnd) {
					if (this.player.jumpEndCount<4) {
						var n = parseInt(this.player.jumpEndCount);
						obj.y += n;
						obj.py += n;
					} else if (this.player.jumpEndCount<8) {
						var n = parseInt((8-this.player.jumpEndCount));
						obj.y += n;
						obj.py += n;
					}
				}
				return obj;
			}



			
			
// FRAME
//////////

			
			// function to run 30 times a second
			this.frame = function() {
				this.clearCanvas();
				if (this.initialised) {
					keyCancel = false;
					this.teleportCheck();
					this.openFrame();
					this.player.interaction();
					this.player.spriteAnimate();
					this.animCheck();
					this.drawLayers();
				} else {
					this.initialiseCheck();
				}
			}
			window.setInterval(function(){self.frame();},1000/30);
			
			
		
		}