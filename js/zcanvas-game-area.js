// ZCANVAS
// GAME
// AREA
//////////

		function zc_editor_area(id,dat) {
			var self = this;
			this.id = id;
			this.dat = dat;
			this.canvas = [];
			this.width = 0;
			this.height = 0;
			
// SET UP
//////////

			// tile for drawing graphics
			this.tile = {};
			this.tile.canvas = document.createElement("canvas");
			this.tile.canvas.width = 8;
			this.tile.canvas.height = 8;
			this.tile.context = this.tile.canvas.getContext("2d");

			
// BUILD LAYERS
//////////

			// build the canvas layers of graphics
			this.buildLayers = function() {
				this.canvas = this.buildLayersAction(this.id);
			}

			// build the canvas layers of graphics action
			this.buildLayersAction = function(id) {
				var arr = [];
				var d = this.dat.json.areas[id].tiles;
				var t = this.dat.json.tiles;
				for (f=0; f<d.length; f++) {
					arr[f] = [];
					for (a=0; a<t[0].tileIds.length; a++) {
						var canvas = document.createElement("canvas");
						canvas.width = parseInt(d[0][0].length*16);
						canvas.height = parseInt(d[0].length*16);
						this.width = canvas.width;
						this.height = canvas.height;
						for (y=0; y<d[f].length; y++) {
						for (x=0; x<d[f][y].length; x++) {
							if (d[f][y][x][0]) {
								var y1 = parseInt(y*16);
								var x1 = parseInt(x*16);
								canvas = this.drawTileAction(canvas,a,y1,x1,d[f][y][x][0]);
							}
						}
						}
						arr[f][a] = canvas;
					}
				}
				return arr;
			}
			
			
			// draw a tile to a canvas
			this.drawTileAction = function(canvas,frame,y1,x1,tile) {
				var d2 = this.dat.json.tiles[tile[0]].tileIds[frame][tile[1]];
				var c = canvas.getContext("2d");
				for (i=0; i<d2.length; i++) {
					if (d2[i]) {
						this.setTileCanvas(d2[i]);
						var x2 = 0;
						var y2 = 0;
						if (i==1||i==3) { x2 = 8; }
						if (i==2||i==3) { y2 = 8; }
						var x3 = parseInt(x2+x1);
						var y3 = parseInt(y2+y1);
						c.drawImage(this.tile.canvas,x3,y3);
					}

				}
				return canvas;
			}
			
			// draw a specific graphic to the tile canvas
			this.setTileCanvas = function(tile) {
				this.tile.context.clearRect(0,0,8,8);
				var img = this.dat.img.graphics[tile[0]].img;
				var ypos = -parseInt(tile[1]*8);
				var xpos = -parseInt(tile[2]*8);
				this.tile.context.drawImage(img,xpos,ypos);
			}
			
			
			// build layers
			this.buildLayers();

		
		}