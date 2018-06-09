// ZCANVAS
// EDITOR
// GAME
//////////

		function zc_editor_game(states,dat) {
			var self = this;
			this.states = states;
			this.dat = dat;
			this.els = {};

// CONTROLS
///////////
	
			// set up main div
			this.els.div = document.createElement("div");
			this.els.div.id = 'zc_editor_game';
			
			$('zcanvas-editor').addChild(this.els.div);
			
			// set up controls div
			this.els.control = {};
			this.els.control.div = document.createElement("div");
			this.els.control.div.id = this.els.div.id+'-control';
			this.els.control.div.className = 'panel';
			$(this.els.div.id).addChild(this.els.control.div);

		
	// rename
	//////////		

			// label
			this.els.control.nameLabel = document.createElement("label");
			this.els.control.nameLabel.innerHTML = 'Name';
			$(this.els.control.div.id).addChild(this.els.control.nameLabel);
	
			// input
			this.els.control.name = document.createElement("input");
			this.els.control.name.id = this.els.control.div.id+'-name';
			this.els.control.name.value = this.dat.json.game.name;
			$(this.els.control.div.id).addChild(this.els.control.name);
		
			// on change
			$(this.els.control.name.id).change(function(){
				self.dat.json.game.name = this.value;
			});
			
			// clear control div
			$(this.els.control.div.id).addClearDiv();
			var br = document.createElement("div");
			br.className = 'break';
			$(this.els.control.div.id).addChild(br);
			

	
	// area select
	//////////
	
			// label
			this.els.control.selectLabel = document.createElement("label");
			this.els.control.selectLabel.innerHTML = 'Start Area';
			$(this.els.control.div.id).addChild(this.els.control.selectLabel);
	
			// select element
			this.els.control.select = document.createElement("select");
			this.els.control.select.id = this.els.control.div.id+'-select';
			$(this.els.control.div.id).addChild(this.els.control.select);
			
			// on change
			$(this.els.control.select.id).change(function(){
				self.selectArea(this.value);
			});
			
			// rebuild options
			this.buildSelect = function() {
				this.count = this.dat.json.areas.length;
				$(this.els.control.select.id).clearChildren();
				for(i=0; i<this.count; i++) {
					var op = document.createElement("option");
					op.value = i;
					op.innerHTML = this.dat.json.areas[i].name;
					$(this.els.control.select.id).addChild(op);
				}
				this.selectArea(this.dat.json.game.start.area);
			}

			// select an area
			this.selectArea = function(id) {
				this.buildStartSelects();
				this.dat.json.game.start.area = id;
				this.els.control.select.value = id;
			}
			
			// clear control div
			$(this.els.control.div.id).addClearDiv();
			var br = document.createElement("div");
			br.className = 'break';
			$(this.els.control.div.id).addChild(br);
			
			
	// location select
	//////////
		
			// label x y
			this.els.control.startxyLabel = document.createElement("label");
			this.els.control.startxyLabel.innerHTML = 'Start Coords';
			$(this.els.control.div.id).addChild(this.els.control.startxyLabel);
	
			// select elements x y
			this.els.control.startx = document.createElement("select");
			this.els.control.startx.id = this.els.control.div.id+'-startx';
			$(this.els.control.div.id).addChild(this.els.control.startx);
			this.els.control.starty = document.createElement("select");
			this.els.control.starty.id = this.els.control.div.id+'-starty';
			$(this.els.control.div.id).addChild(this.els.control.starty);
	
			// clear control div
			$(this.els.control.div.id).addClearDiv();
			var br = document.createElement("div");
			br.className = 'break';
			$(this.els.control.div.id).addChild(br);
	
			// label z
			this.els.control.startzLabel = document.createElement("label");
			this.els.control.startzLabel.innerHTML = 'Start Floor';
			$(this.els.control.div.id).addChild(this.els.control.startzLabel);
	
			// select elements z
			this.els.control.startz = document.createElement("select");
			this.els.control.startz.id = this.els.control.div.id+'-startz';
			$(this.els.control.div.id).addChild(this.els.control.startz);
	
			// on change
			$(this.els.control.startx.id).change(function(){
				self.setStartX(this.value);
			});
			$(this.els.control.starty.id).change(function(){
				self.setStartY(this.value);
			});
			$(this.els.control.startz.id).change(function(){
				self.setStartZ(this.value);
			});
			
			// rebuild options
			this.buildStartSelects = function() {
				var d = this.dat.json.areas[this.dat.json.game.start.area].tiles;
				$(this.els.control.startz.id).clearChildren();
				$(this.els.control.starty.id).clearChildren();
				$(this.els.control.startx.id).clearChildren();
				for(i=0; i<d.length; i++) {
					var op = document.createElement("option");
					op.value = i;
					op.innerHTML = i;
					$(this.els.control.startz.id).addChild(op);
				}
				for(i=0; i<d[0].length; i++) {
					var op = document.createElement("option");
					op.value = i;
					op.innerHTML = i;
					$(this.els.control.starty.id).addChild(op);
				}
				for(i=0; i<d[0][0].length; i++) {
					var op = document.createElement("option");
					op.value = i;
					op.innerHTML = i;
					$(this.els.control.startx.id).addChild(op);
				}
				this.setStartZ(this.dat.json.game.start.z);
				this.setStartY(this.dat.json.game.start.y);
				this.setStartX(this.dat.json.game.start.x);
			}
	
			// set start locations
			this.setStartZ = function(id) {
				this.dat.json.game.start.z = id;
				this.els.control.startz.value = id;
			}
			this.setStartY = function(id) {
				this.dat.json.game.start.y = id;
				this.els.control.starty.value = id;
			}
			this.setStartX = function(id) {
				this.dat.json.game.start.x = id;
				this.els.control.startx.value = id;
			}
	
				// clear control div
			$(this.els.control.div.id).addClearDiv();
				
			
	

	
	
	
	
	
			//
			// initialise
			this.buildSelect();	
			

	
			
			
		
		
		}