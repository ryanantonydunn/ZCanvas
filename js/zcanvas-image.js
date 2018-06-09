// ZCANVAS
// IMAGE
//////////
	
		function zc_image(json) {
			var self = this;
			this.json = json;
			this.graphics = [];
			this.sprites = [];
			this.elements = {};

			// main div
			this.elements.style = document.createElement("div");
			this.elements.style.id = 'zc_editor_css';
			$('zcanvas-editor').addChild(this.elements.style);		
		
// LOAD IMAGES
//////////

			this.load = function() {
				$(this.elements.style.id).clearChildren();
				var d = this.json.graphics;
				for (i=0; i<d.length; i++) {
					this.graphics[i] = {};
					this.graphics[i].trigger = false;
					this.graphics[i].canvas = document.createElement("canvas");
					this.graphics[i].context = this.graphics[i].canvas.getContext("2d");
					this.graphics[i].img = new Image();
					this.graphics[i].img.id = parseInt(i);
					this.graphics[i].img.onload = function(e) {
						var id = e.target.id;
						self.graphics[id].canvas.width = this.width;
						self.graphics[id].canvas.height = this.height;
						self.graphics[id].context.drawImage(this,0,0);
						self.canvasUrlSet(id,'tile');
						self.graphics[id].trigger = true;
					}
					this.graphics[i].img.src = d[i].filename;
				}
				var s = this.json.sprites;
				for (i=0; i<s.length; i++) {
					this.sprites[i] = {};
					this.sprites[i].trigger = false;
					this.sprites[i].canvas = document.createElement("canvas");
					this.sprites[i].context = this.sprites[i].canvas.getContext("2d");
					this.sprites[i].img = new Image();
					this.sprites[i].img.id = parseInt(i);
					this.sprites[i].img.onload = function(e) {
						var id = e.target.id;
						self.sprites[id].canvas.width = this.width;
						self.sprites[id].canvas.height = this.height;
						self.sprites[id].context.drawImage(this,0,0);
						self.canvasUrlSet(id,'sprite');
						self.sprites[id].trigger = true;
					}
					this.sprites[i].img.src = s[i].url;
				}
			}
				
			// set canvas url
			this.canvasUrlSet = function(id,type) {
				var dataUrl = this.graphics[id].canvas.toDataURL();
				var el = document.createElement('style');
				var doubleX = parseInt(this.graphics[id].canvas.width*2);
				var doubleY = parseInt(this.graphics[id].canvas.height*2);
				el.innerHTML = '.canvas .'+type+'-'+id+' { background-image: url('+dataUrl+'); }';
				el.innerHTML += '.double .'+type+'-'+id+' { background-size: '+doubleX+'px '+doubleY+'px }';
				$(this.elements.style.id).addChild(el);
			}
			
			// load
			this.load();

		}
	