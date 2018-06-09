// ZCANVAS
// EDITOR
//////////	

		function zc_editor(db) {
			var self = this;
			this.db = db;
			this.trigger = false;
			this.state = new zc_editor_states(this.db);
			this.game;
			this.graphic;
			this.tiles;
			this.areas;
			this.els = {};
			
			
// INITIALISE
//////////

			// check that database and image have loaded
			this.frame = function() {
				if (!this.trigger) {
					if (this.db.trigger) {
						var trig = false;
						for (i=0; i<this.db.img.graphics.length; i++) {
							if (!this.db.img.graphics[i].trigger) {
								trig = true;
							}
						}
						for (i=0; i<this.db.img.sprites.length; i++) {
							if (!this.db.img.sprites[i].trigger) {
								trig = true;
							}
						}
						if (!trig) {
							this.initialise();
						}
					}
				}
			}
			window.setInterval(function(){self.frame();},1000/30);
			
			// on load
			this.initialise = function() {
				this.trigger = true;
				this.titleVersionSet();
				this.buildCursors();
				this.gameLoad(0);
				this.graphicsLoad(0);
				this.tilesetLoad(0);
				this.areaLoad(0);
				$(this.els.loading.id).hide();
				this.showGameAction();
			}
			
			// load modules
			this.gameLoad = function(id) {	
				this.game = new zc_editor_game(this.state,this.db);
			}
			this.graphicsLoad = function(id) {	
				this.graphic = new zc_editor_graphics(id,this.state,this.db);
			}
			this.tilesetLoad = function(id) {
				this.tiles = new zc_editor_tileSet(id,this.state,this.db,this.graphic);
			}			
			this.areaLoad = function(id) {
				this.areas = new zc_editor_areas(id,this.state,this.db,this.graphic,this.tiles,this.els.cursors.xy);
			}			
			
			
// CURSORS
//////////

			this.buildCursors = function() {
			
				// main div
				this.els.cursors = {};
				this.els.cursors.div = document.createElement("div");
				this.els.cursors.div.id = 'zc_editor_cursors';
				$("zcanvas-editor").addChild(this.els.cursors.div);
				
				// delete
				this.els.cursors.del = document.createElement("div");
				this.els.cursors.del.id = this.els.cursors.div.id+'-del';
				this.els.cursors.del.className = 'mouse';
				this.els.cursors.del.innerHTML = '<img src="images/icon-delete.png" alt="">';
				$(this.els.cursors.div.id).addChild(this.els.cursors.del);
				$(this.els.cursors.del.id).mouseMove();
				$(this.els.cursors.del.id).hide();
				buttonAltDown(function(){
					$(self.els.cursors.del.id).show();
				});
				buttonAltUp(function(){
					$(self.els.cursors.del.id).hide();
				});
				
				// add
				this.els.cursors.add = document.createElement("div");
				this.els.cursors.add.id = this.els.cursors.div.id+'-add';
				this.els.cursors.add.className = 'mouse';
				this.els.cursors.add.innerHTML = '<img src="images/icon-add.png" alt="">';
				$(this.els.cursors.div.id).addChild(this.els.cursors.add);
				$(this.els.cursors.add.id).mouseMove();
				$(this.els.cursors.add.id).hide();
				buttonCtrlDown(function(){
					$(self.els.cursors.add.id).show();
				});
				buttonCtrlUp(function(){
					$(self.els.cursors.add.id).hide();
				});
				
				// xy position
				this.els.cursors.xy = document.createElement("div");
				this.els.cursors.xy.id = this.els.cursors.div.id+'-xy';
				this.els.cursors.xy.className = 'mouse xycursor';
				this.els.cursors.xy.innerHTML = '';
				$(this.els.cursors.div.id).addChild(this.els.cursors.xy);
				$(this.els.cursors.xy.id).mouseMove();
				$(this.els.cursors.xy.id).hide();
			
			}
			
			
// TITLEBAR
//////////
			
			// build
			this.els.titlebar = {};
			this.els.titlebar.div = document.createElement("div");
			this.els.titlebar.div.id = 'zc_editor_titlebar';
			this.els.titlebar.div.className = 'titlebar';
			$('zcanvas-editor').addChild(this.els.titlebar.div);			
			
	// buttons
	//////////

			// main ul
			this.els.titlebar.buttons = {};
			this.els.titlebar.buttons.ul = document.createElement("ul");
			this.els.titlebar.buttons.ul.className = 'buttons';
			this.els.titlebar.buttons.ul.id = this.els.titlebar.div.id+'-buttons';
			$(this.els.titlebar.div.id).addChild(this.els.titlebar.buttons.ul);
			
			// title
			this.els.titlebar.title = document.createElement("div");
			this.els.titlebar.title.className = 'title';
			this.els.titlebar.title.innerHTML = 'ZCanvas Editor';
			$(this.els.titlebar.div.id).addChild(this.els.titlebar.title);
			this.titleVersionSet = function() {
				this.els.titlebar.title.innerHTML = 'ZCanvas Editor (v'+this.db.json.game.version+')';
			}
			
			// state
			$(this.els.titlebar.buttons.ul.id).addChild(this.state.els.undo);
			$(this.state.els.undo.id).click(function(){
				self.state.undo();
			});
			$(this.els.titlebar.buttons.ul.id).addChild(this.state.els.redo);
			$(this.state.els.redo.id).click(function(){
				self.state.redo();
			});
	
	
	
	// edit button
	//////////
	
			// toggle
			this.toggleEdit = false;
			
			// button
			this.els.titlebar.buttons.edit = document.createElement("li");
			this.els.titlebar.buttons.edit.id = this.els.titlebar.buttons.ul.id+'-edit';
			this.els.titlebar.buttons.edit.title = 'Edit game data directly';
			this.els.titlebar.buttons.edit.innerHTML = '<img src="images/icon-rename.png">';
			$(this.els.titlebar.buttons.ul.id).addChild(this.els.titlebar.buttons.edit);
			
			// button click
			$(this.els.titlebar.buttons.edit.id).click(function(){
				if (!self.toggleEdit) {
					self.showEdit();
				}
			});
			
			// show
			this.showEdit = function() {
				this.state.add({
					vals:{page:new String(self.current)},
					undo:function(){self.showFromValue(this.vals.page);},
					redo:function(){self.showEditAction();}
				});
				this.showEditAction();
			}
			
			// show action
			this.showEditAction = function() {
				this.hideGameAction();
				this.hideAreasAction();
				this.hideTilesAction();
				this.hideGraphicsAction();
				this.toggleLoad = true;
				this.current = 'edit';
				this.els.titlebar.buttons.edit.className = 'selected';
				$(this.els.dataedit.div.id).show();
				this.populateEditText();
			}
			
			// hide action
			this.hideEditAction = function() {
				this.toggleEdit = false;
				this.els.titlebar.buttons.edit.className = '';
				$(this.els.dataedit.div.id).hide();
			}
			
			
	// main nav
	//////////
			
			// current
			this.current = 'game';
			
			// main ul
			this.els.titlebar.nav = {};
			this.els.titlebar.nav.ul = document.createElement("ul");
			this.els.titlebar.nav.ul.className = 'buttons';
			this.els.titlebar.nav.ul.id = this.els.titlebar.div.id+'-nav';
			$(this.els.titlebar.div.id).addChild(this.els.titlebar.nav.ul);
			
		
	// game nav
	//////////
			
			// toggle
			this.toggleGame = false;
			
			// button
			this.els.titlebar.nav.game = document.createElement("li");
			this.els.titlebar.nav.game.id = this.els.titlebar.nav.ul.id+'-game';
			this.els.titlebar.nav.game.innerHTML = 'Game';
			$(this.els.titlebar.nav.ul.id).addChild(this.els.titlebar.nav.game);
			
			// button click
			$(this.els.titlebar.nav.game.id).click(function(){
				if (!self.toggleGame) {
					self.showGame();
				}
			});
			
			// show
			this.showGame = function() {
				this.state.add({
					vals:{page:new String(self.current)},
					undo:function(){self.showFromValue(this.vals.page);},
					redo:function(){self.showGameAction();}
				});
				this.showGameAction();
			}
			
			// show action
			this.showGameAction = function() {
				this.hideEditAction();
				this.hideAreasAction();
				this.hideTilesAction();
				this.hideGraphicsAction();
				this.toggleGame = true;
				this.current = 'game';
				this.els.titlebar.nav.game.className = 'selected';
				
				$(this.game.els.div.id).show();
				this.game.buildSelect();	
			}
			
			// hide action
			this.hideGameAction = function() {
				this.toggleGame = false;
				this.els.titlebar.nav.game.className = '';
				$(this.game.els.div.id).hide();
			}

		
	// areas nav
	//////////
			
			// toggle
			this.toggleAreas = false;
			
			// button
			this.els.titlebar.nav.areas = document.createElement("li");
			this.els.titlebar.nav.areas.id = this.els.titlebar.nav.ul.id+'-areas';
			this.els.titlebar.nav.areas.innerHTML = 'Areas';
			$(this.els.titlebar.nav.ul.id).addChild(this.els.titlebar.nav.areas);
			
			// button click
			$(this.els.titlebar.nav.areas.id).click(function(){
				if (!self.toggleAreas) {
					self.showAreas();
				}
			});
			
			// show
			this.showAreas = function() {
				this.state.add({
					vals:{page:new String(self.current)},
					undo:function(){self.showFromValue(this.vals.page);},
					redo:function(){self.showAreasAction();}
				});
				this.showAreasAction();
			}
			
			// show action
			this.showAreasAction = function() {
				this.hideEditAction();
				this.hideGameAction();
				this.hideTilesAction();
				this.hideGraphicsAction();
				this.toggleAreas = true;
				this.current = 'area';
				this.els.titlebar.nav.areas.className = 'selected';
				
				$(this.areas.els.div.id).show();
				this.areas.setId(this.areas.id);
			}
			
			// hide action
			this.hideAreasAction = function() {
				this.toggleAreas = false;
				this.els.titlebar.nav.areas.className = '';
				$(this.areas.els.div.id).hide();
			}
			
			
	// tiles nav
	//////////			
	
			// toggle
			this.toggleTiles = false;
			
			// button
			this.els.titlebar.nav.tiles = document.createElement("li");
			this.els.titlebar.nav.tiles.id = this.els.titlebar.nav.ul.id+'-tiles';
			this.els.titlebar.nav.tiles.innerHTML = 'Tiles';
			$(this.els.titlebar.nav.ul.id).addChild(this.els.titlebar.nav.tiles);
			
			// button click
			$(this.els.titlebar.nav.tiles.id).click(function(){
				if (!self.toggleTiles) {
					self.showTiles();
				}
			});

			// show
			this.showTiles = function() {
				this.state.add({
					vals:{page:new String(self.current)},
					undo:function(){self.showFromValue(this.vals.page);},
					redo:function(){self.showTilesAction();}
				});
				this.showTilesAction();
			}
			
			// show action
			this.showTilesAction = function() {
				this.hideEditAction();
				this.hideGameAction();
				this.hideAreasAction();
				this.hideGraphicsAction();
				this.toggleTiles = true;
				this.current = 'tiles';
				this.els.titlebar.nav.tiles.className = 'selected';
				$(this.tiles.els.div.id).show();
				this.tiles.setId(this.tiles.id);
			}
			
			// hide action
			this.hideTilesAction = function() {
				this.toggleTiles = false;
				this.els.titlebar.nav.tiles.className = '';
				$(this.tiles.els.div.id).hide();
			}
			


	// graphics nav
	//////////			
	
			// toggle
			this.toggleGraphics = false;
			
			// button
			this.els.titlebar.nav.graphics = document.createElement("li");
			this.els.titlebar.nav.graphics.id = this.els.titlebar.nav.ul.id+'-graphics';
			this.els.titlebar.nav.graphics.innerHTML = 'Graphics';
			$(this.els.titlebar.nav.ul.id).addChild(this.els.titlebar.nav.graphics);
			
			// button click
			$(this.els.titlebar.nav.graphics.id).click(function(){
				if (!self.toggleGraphics) {
					self.showGraphics();
				}
			});
			
			// show
			this.showGraphics = function() {
				this.state.add({
					vals:{page:new String(self.current)},
					undo:function(){self.showFromValue(this.vals.page);},
					redo:function(){self.showGraphicsAction();}
				});
				this.showGraphicsAction();
			}
			
			// show action
			this.showGraphicsAction = function() {
				this.hideEditAction();
				this.hideGameAction();
				this.hideAreasAction();
				this.hideTilesAction();
				this.toggleGraphics = true;
				this.current = 'graphics';
				this.els.titlebar.nav.graphics.className = 'selected';
				$(this.graphic.els.div.id).show();
			}
			
			// hide action
			this.hideGraphicsAction = function() {
				this.toggleGraphics = false;
				this.els.titlebar.nav.graphics.className = '';
				$(this.graphic.els.div.id).hide();
			}
			

	// navigate based on a toggle
	//////////

			this.showFromValue = function(val) {
				if (val=='edit') {
					this.showEditAction();
				}
				if (val=='game') {
					this.showGameAction();
				}
				if (val=='area') {
					this.showAreasAction();
				}
				if (val=='tiles') {
					this.showTilesAction();
				}
				if (val=='graphics') {
					this.showGraphicsAction();
				}
			}
			
			
	// clear titlebar divs
	//////////
	
			$(this.els.titlebar.div.id).addClearDiv();
			
			
			
// DATA EDIT SCREEN
//////////
			
			this.els.dataedit = {};
			this.els.dataedit.div = document.createElement("div");
			this.els.dataedit.div.id = 'zc_editor_dataedit';
			this.els.dataedit.div.innerHTML = '<h2>Paste Game Data</h2>';
			this.els.dataedit.div.className = 'panel';
			$('zcanvas-editor').addChild(this.els.dataedit.div);
			$(this.els.dataedit.div.id).hide();
			
			// textbox
			this.els.dataedit.text = document.createElement("textarea");
			this.els.dataedit.text.id = this.els.dataedit.div.id+'-text';
			$(this.els.dataedit.div.id).addChild(this.els.dataedit.text);
			
			// button
			this.els.dataedit.button = document.createElement("ul");
			this.els.dataedit.button.className = 'buttons';
			this.els.dataedit.button.id = this.els.dataedit.div.id+'-button';
			this.els.dataedit.button.innerHTML = '<li>Apply</li>';
			$(this.els.dataedit.div.id).addChild(this.els.dataedit.button);
			$(this.els.dataedit.button.id).click(function(){
				self.loadFromText();
			});
			
			$(this.els.dataedit.div.id).addClearDiv();
			
			// save data
			this.populateEditText = function() {
				this.els.dataedit.text.innerHTML = JSON.stringify(this.db.json);
			}
			
			// load data
			this.loadFromText = function() {
				this.db.json = JSON.parse(this.els.dataedit.text.value);
				alert('Data changed');
			}
			
	
	
	
// LOADING SCREEN
//////////
			
			this.els.loading = document.createElement("div");
			this.els.loading.id = 'zc_editor_loading';
			this.els.loading.className = 'loading';
			this.els.loading.innerHTML = 'Loading Resources...';
			$('zcanvas-editor').addChild(this.els.loading);
			
			
// GLOBAL CLICK ACTIONS
//////////
			
			// right click anywhere
			$(document).rightClick(function(){
				if (self.areas.clipboard) {
					self.areas.copyClear();
					blockContextMenu(event);
				}
				if (self.tiles.clipboard) {
					self.tiles.copyClear();
					blockContextMenu(event);
				}
			});
			
			// click anywhere
			$(document).click(function(){
				if (self.tiles.animateTrigger) {
					self.tiles.animateTrigger = false;
				} else {
					self.tiles.animateStop();
				}
			});		
		
		
		}