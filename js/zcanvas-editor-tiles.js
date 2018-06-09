// ZCANVAS
// EDITOR
// TILES
//////////

		function zc_editor_tileSet(id,states,dat,graphics) {
			var self = this;
			this.states = states;
			this.id = id;
			this.dat = dat;
			this.graphics = graphics;
			this.count = this.dat.json.tiles.length;
			this.els = {};
			this.cols = 16;
			this.editorWidth = parseInt(1+(this.cols*32))+'px';
			this.frames = this.dat.json.tiles[0].tileIds.length;
			this.drawTrigger = false;
			this.clipTemp = [];

// CONTROLS
///////////
	
	// change the current row
	//////////
			
			this.setId = function(id,cancelbuild) {
				this.id = id;
				this.els.control.select.value = id;
				if (!cancelbuild) {
					this.editorBuild();
					this.editorFrameShowAction(0);
				}
			}
			
			
	// set up main divs
	//////////
			
			// set up main div
			this.els.div = document.createElement("div");
			this.els.div.id = 'zc_editor_tiles';
			$('zcanvas-editor').addChild(this.els.div);
			
			// set up controls div
			this.els.control = {};
			this.els.control.div = document.createElement("div");
			this.els.control.div.id = this.els.div.id+'-control';
			this.els.control.div.className = 'panel';
			$(this.els.div.id).addChild(this.els.control.div);

	
	// selector
	//////////

			// set up selector
			this.els.control.select = document.createElement("select");
			this.els.control.select.id = this.els.control.div.id+'-select';
			$(this.els.control.div.id).addChild(this.els.control.select);
			
			// on change
			$(this.els.control.select.id).change(function(){
				self.hideAddnew();
				self.hideRename();
				self.setId(this.value);
			});
			
			// rebuild options
			this.buildSelect = function() {
				$(this.els.control.select.id).clearChildren();
				var d = this.dat.json.tiles;
				for(i=0; i<d.length; i++) {
					var op = document.createElement("option");
					op.value = i;
					op.innerHTML = d[i].name;
					$(this.els.control.select.id).addChild(op);
				}
			}
			
			// initialise
			this.buildSelect();		

	// buttons
	//////////
			
			// set up buttons
			this.els.buttons = {};
			this.els.buttons.ul = document.createElement("ul");
			this.els.buttons.ul.id = this.els.control.div.id+'-buttons';
			this.els.buttons.ul.className = 'buttons';
			$(this.els.control.div.id).addChild(this.els.buttons.ul);
			

	// rename
	//////////

			// toggle value
			this.renameShow = false;
			
			// toggle button
			this.els.buttons.rename = {};
			this.els.buttons.rename.toggle = document.createElement("li");
			this.els.buttons.rename.toggle.id = this.els.buttons.ul.id+'-rename';
			this.els.buttons.rename.toggle.innerHTML = '<img src="images/icon-rename.png" alt="">';
			this.els.buttons.rename.toggle.title = 'Rename';
			$(this.els.buttons.ul.id).addChild(this.els.buttons.rename.toggle);
			
			// toggle
			$(this.els.buttons.rename.toggle.id).click(function(){
				if (self.renameShow) {
					self.hideRename();
				} else {
					self.showRename();
				}
			});
			
			// toggle show
			this.showRename = function() {
				this.hideAddnew();
				this.els.buttons.rename.toggle.className = 'selected';
				this.els.control.rename.text.value = this.dat.json.tiles[this.id].name;
				$(this.els.control.rename.div.id).show();
				this.renameShow = true;
			}
			
			// toggle hide
			this.hideRename = function() {
				this.els.buttons.rename.toggle.className = '';
				$(this.els.control.rename.div.id).hide();
				this.renameShow = false;
			}
			
			// controls box
			this.els.control.rename = {};
			this.els.control.rename.div = document.createElement("div");
			this.els.control.rename.div.id = this.els.control.div.id+'-rename';
			$(this.els.control.div.id).addChild(this.els.control.rename.div);
			
			this.els.control.rename.text = document.createElement("input");
			$(this.els.control.rename.div.id).addChild(this.els.control.rename.text);
			
			this.els.control.rename.save = document.createElement("ul");
			this.els.control.rename.save.id = this.els.control.rename.div.id+'-save';
			this.els.control.rename.save.title = 'Save rename';
			this.els.control.rename.save.className = 'buttons';
			this.els.control.rename.save.innerHTML = '<li><img src="images/icon-save.png" alt=""></li>';
			$(this.els.control.rename.div.id).addChild(this.els.control.rename.save);	

			// hide controls box
			$(this.els.control.rename.div.id).hide();			
			
			// save button
			$(this.els.control.rename.save.id).click(function(){
				self.renameSave();
			});
			
			// save
			this.renameSave = function() {
				var un = self.dat.json.tiles[self.id].name;
				var rn = self.els.control.rename.text.value;
				this.states.add({
					vals:{id:parseInt(self.id),uname:new String(un),rname:new String(rn)},
					undo:function(){self.actionRenameTileset(this.vals.id,this.vals.uname);},
					redo:function(){self.actionRenameTileset(this.vals.id,this.vals.rname);}
				});
				this.actionRenameTileset(self.id,rn);
				this.hideRename();
			}


	// delete
	//////////

			// button
			this.els.buttons.del = document.createElement("li");
			this.els.buttons.del.id = this.els.buttons.ul.id+'-del';
			this.els.buttons.del.innerHTML = '<img src="images/icon-delete.png" alt="">';
			this.els.buttons.del.title = 'Delete';
			$(this.els.buttons.ul.id).addChild(this.els.buttons.del);
			
			// button click
			$(this.els.buttons.del.id).click(function(){
				self.hideAddnew();
				self.hideRename();
				if (1<self.dat.json.tiles.length) {
					var c = confirm('Delete the "'+self.dat.json.tiles[self.id].name+'" tileset? This will likely break the graphics in existing areas.');
					if (c) {
						self.deleteTileset();
					}
				} else {
					alert('Last tileset cannot be deleted');
				}
			});
			
			// delete
			this.deleteTileset = function() {
				self.states.add({
					vals:{id:parseInt(self.id),arr:self.dat.json.tiles[self.id]},
					undo:function(){self.actionAddTileset(this.vals.id,this.vals.arr);},
					redo:function(){self.actionDeleteTileset(this.vals.id);}
				});
				this.actionDeleteTileset(this.id);
			}

			
	// add new
	//////////

			// toggle value
			this.addnewShow = false;
			
			// toggle button
			this.els.buttons.addnew = {};
			this.els.buttons.addnew.toggle = document.createElement("li");
			this.els.buttons.addnew.toggle.id = this.els.buttons.ul.id+'-addnew';
			this.els.buttons.addnew.toggle.innerHTML = '<img src="images/icon-add.png" alt="">';
			this.els.buttons.addnew.toggle.title = 'Add new';
			$(this.els.buttons.ul.id).addChild(this.els.buttons.addnew.toggle);

			// toggle
			$(this.els.buttons.addnew.toggle.id).click(function(){
				if (self.addnewShow) {
					self.hideAddnew();
				} else {
					self.showAddnew();
				}
			});
			
			// toggle show
			this.showAddnew = function() {
				this.hideRename();
				this.els.buttons.addnew.toggle.className = 'selected';
				this.els.control.addnew.text.value = 'New Tileset';
				$(this.els.control.addnew.div.id).show();
				this.addnewShow = true;
			}
			
			// toggle hide
			this.hideAddnew = function() {
				this.els.buttons.addnew.toggle.className = '';
				$(this.els.control.addnew.div.id).hide();
				this.addnewShow = false;
			}
		
			// controls box
			this.els.control.addnew = {};
			this.els.control.addnew.div = document.createElement("div");
			this.els.control.addnew.div.id = this.els.control.div.id+'-addnew';
			$(this.els.control.div.id).addChild(this.els.control.addnew.div);
			
			this.els.control.addnew.text = document.createElement("input");
			$(this.els.control.addnew.div.id).addChild(this.els.control.addnew.text);
			
			this.els.control.addnew.save = document.createElement("ul");
			this.els.control.addnew.save.id = this.els.control.addnew.div.id+'-save';
			this.els.control.addnew.save.className = 'buttons';
			this.els.control.addnew.save.title = 'Save new tileset';
			this.els.control.addnew.save.innerHTML = '<li><img src="images/icon-save.png" alt=""></li>';
			$(this.els.control.addnew.div.id).addChild(this.els.control.addnew.save);	

			// hide controls box
			$(this.els.control.addnew.div.id).hide();
			
			// save button
			$(this.els.control.addnew.save.id).click(function(){
				self.addnewSave();
			});
			
			// save
			this.addnewSave = function() {
				var len = this.dat.json.tiles.length;
				var obj = {};
				obj.name = this.els.control.addnew.text.value;
				obj.tileIds = [];
				for (i=0; i<3; i++) {
					obj.tileIds[i] = [];
					for (j=0; j<256; j++) {
						obj.tileIds[i][j] = [];
						for (k=0; k<4; k++) {
							obj.tileIds[i][j][k] = null;
						}
					}
				}
				obj.behaviour = [];
				for (j=0; j<256; j++) {
					obj.behaviour[j] = [];
					for (k=0; k<4; k++) {
						obj.behaviour[j][k] = 0;
					}
				}
				self.states.add({
					vals:{i:parseInt(len),obj:obj.clone()},
					undo:function(){self.actionDeleteTileset(this.vals.i);},
					redo:function(){self.actionAddTileset(this.vals.i,this.vals.obj);}
				});
				this.actionAddTileset(len,obj);
				this.hideAddnew();
			}
	

	// clear main divs
	//////////
	
			$(this.els.control.div.id).addClearDiv();
	

	// actions
	//////////
	
			// add tileset
			this.actionAddTileset = function(i,obj) {
				var arr = self.dat.json.tiles;
				arr.splice(i,0,obj);
				self.buildSelect();
				self.setId(i);
			}
			
			// delete tileset
			this.actionDeleteTileset = function(i) {
				var arr = self.dat.json.tiles;
				arr.splice(i,1);
				self.buildSelect();
				self.setId(0);
			}
			
			// replace tileset
			this.actionReplaceTileset = function(i,obj) {
				var arr = self.dat.json.tiles;
				arr.splice(i,1,obj);
				self.buildSelect();
				self.setId(i);
			}
			
			// rename tileset
			this.actionRenameTileset = function(i,name) {
				self.dat.json.tiles[i].name = name;
				self.buildSelect();
				self.els.control.select.value = i;
			}

			

// EDITOR
//////////			
			
	// build editor
	//////////					
			
			// setup
			this.els.editor = {};
			this.els.editor.div = document.createElement("div");
			this.els.editor.div.id = this.els.div.id+'-editor';
			this.els.editor.div.className = 'canvas scroll double';
			$(this.els.div.id).addChild(this.els.editor.div);
			
			// build the editor
			this.editorBuild = function() {
				$(this.els.editor.div.id).clearChildren();
				this.editorBuildBehaviour(this.els.editor);
				this.editorBuildFrames(this.els.editor);
			}			
			
			// build behaviour objects/divs
			this.editorBuildBehaviour = function(obj) {
				obj.behaviour = {};
				obj.behaviour.div = document.createElement("div");
				obj.behaviour.div.id = obj.div.id+'-behaviour';
				obj.behaviour.div.className = 'frame';
				obj.behaviour.div.style.width = this.editorWidth;
				$(obj.div.id).addChild(obj.behaviour.div);
				$(obj.behaviour.div.id).hide();
				this.editorBuildBehaviourTiles(obj.behaviour);
			}
			
			// build behaviour tile objects/divs
			this.editorBuildBehaviourTiles = function(obj) {
				var da = this.dat.json.tiles[this.id].tileIds[0];
				obj.tile = [];
				for (id=0; id<da.length; id++) {
					obj.tile[id] = {};
					obj.tile[id].div = document.createElement("b");
					obj.tile[id].div.id = obj.div.id+'-'+id;
					$(obj.div.id).addChild(obj.tile[id].div);
					this.editorBuildBehaviourSubtiles(obj.tile[id],id);
				}
			}
		
			// build behaviour tile objects/divs
			this.editorBuildBehaviourSubtiles = function(obj,id) {
				var da = this.dat.json.tiles[this.id].behaviour[id];
				obj.subtile = [];
				for (subid=0; subid<da.length; subid++) {
					obj.subtile[subid] = {};
					obj.subtile[subid].div = document.createElement("span");
					obj.subtile[subid].div.id = obj.div.id+'-'+subid;
					$(obj.div.id).addChild(obj.subtile[subid].div);
					this.editorSetBehaviourSubtileAction(id,subid,da[subid]);
				}
			}
		
			// build animation frames objects/divs
			this.editorBuildFrames = function(obj) {
				obj.frames = [];
				for (f=0; f<this.frames; f++) {
					obj.frames[f] = {};
					obj.frames[f].div = document.createElement("div");
					obj.frames[f].div.id = obj.div.id+'-frame-'+f;
					obj.frames[f].div.className = 'frame';
					obj.frames[f].div.style.width = this.editorWidth;
					$(obj.div.id).addChild(obj.frames[f].div);
					this.editorBuildFramesTiles(obj.frames[f],f);
				}
			}
			
			// build animation frames tile objects/divs
			this.editorBuildFramesTiles = function(obj,f) {
				var da = this.dat.json.tiles[this.id].tileIds[f];
				obj.tile = [];
				for (id=0; id<da.length; id++) {
					obj.tile[id] = {};
					obj.tile[id].div = document.createElement("b");
					obj.tile[id].div.id = obj.div.id+'-'+id;
					$(obj.div.id).addChild(obj.tile[id].div);
					this.editorBuildFramesSubtiles(obj.tile[id],f,id);
				}
			}
			
			// build animation frames subtile objects/divs
			this.editorBuildFramesSubtiles = function(obj,f,id) {
				var da = this.dat.json.tiles[this.id].tileIds[f][id];
				obj.subtile = [];
				if (da) {
					for (subid=0; subid<da.length; subid++) {
						obj.subtile[subid] = {};
						obj.subtile[subid].div = document.createElement("span");
						obj.subtile[subid].div.id = obj.div.id+'-'+subid;
						obj.subtile[subid].className = 'interactive tile';
						$(obj.div.id).addChild(obj.subtile[subid].div);
						this.editorSetGraphicsAction(f,id,subid,da[subid]);
						$(obj.subtile[subid].div.id).mouseDown(function(e){
							if (e.which==1) {
							self.editorMouseDown(event);
							}
						});
						$(obj.subtile[subid].div.id).mouseUp(function(e){
							if (e.which==1) {
							self.editorMouseUp(event);
							}
						});
						$(obj.subtile[subid].div.id).click(function(){
							self.editorClick(event);
						});
						$(obj.subtile[subid].div.id).rightClick(function() {
							self.editorRightClick(event);
							blockContextMenu(event);
						});
						$(obj.subtile[subid].div.id).hover(function(){
							self.editorHover(event);
						});
						$(obj.subtile[subid].div.id).hoverOff(function(){
							self.editorHoverOff(event);
						});
					}
				}
			}
			

	// editor interactions
	//////////
			
			// mouse down on a tile
			this.mouseDownEl = null;
			this.editorMouseDown = function(e) {
				this.mouseDownEl = e.target;
				this.editorTempSelect(e.target);
			}
			
			// mouse up on a tile
			this.editorMouseUp = function(e) {
				clearSelection();
				this.mouseDownEl = null;
				if (0<this.selectedTemp.length) {
					if (buttonCtrl&&!buttonAlt) {
						this.editorAddSelect();
					}
					if (!buttonCtrl&&buttonAlt) {
						this.editorUnselect();
					}
					if (!buttonCtrl&&!buttonAlt) {
						this.editorReplaceSelect();
					}					
					this.editorClearTempSelect();
				}
			}
			
			// hover on a tile
			this.editorHover = function(e) {
				if (this.clipboard) {
					this.editorClipPreview(e.target);
				} else {
					if (buttonMouse&&this.mouseDownEl) {
						this.editorClearTempSelect();
						this.editorTempSelectShift(e.target,this.mouseDownEl);
					}
				}
			}
	
			// hover off a tile
			this.editorHoverOff = function(e) {
				if (this.clipboard) {
					this.editorClipPreviewCancel();
				}
			}
			
			// click on a tile
			this.editorClick = function(e) {
				var el = e.target;
				if (this.clipboard) {
					self.editorPaste(el);
				}
			}
			
			// right click on a tile
			this.editorRightClick = function(e) {
				var el = e.target;
				if (this.clipboard) {
					self.editorHoverOff(e);
					self.copyClear();
				} else {
					self.contextMenuOpen(e);
				}
			}

			
	// editor selection
	//////////
			
			// selected tiles
			this.selectedTemp = [];
			this.selected = [];
			
			// temporarily select a tile
			this.editorTempSelect = function(el) {
				el.className += ' tempSelected';
				this.selectedTemp.push(el);
			}			
			
			// temporarily select tiles
			this.editorTempSelectShift = function(el1,el2) {
				var ids1 = el1.id.split("-");
				var ids2 = el2.id.split("-");
				var coords1 = this.translateLocationIds(ids1[4],ids1[5]);
				var coords2 = this.translateLocationIds(ids2[4],ids2[5]);
				var x1 = [parseInt(coords1.x),parseInt(coords2.x)];
				var y1 = [parseInt(coords1.y),parseInt(coords2.y)];
				x1.sort(function(a,b){return a - b});
				y1.sort(function(a,b){return a - b});
				for (y2=y1[0]; y2<=y1[1]; y2++) {
				for (x2=x1[0]; x2<=x1[1]; x2++) {
					var ids = this.translateLocationCoords(x2,y2);
					var newEl = this.els.editor.frames[ids1[3]].tile[ids.id].subtile[ids.subid].div;
					this.editorTempSelect(newEl);
				}
				}
			}
			
			// untempselect all tiles
			this.editorClearTempSelect = function() {
				for (i=0; i<this.selectedTemp.length; i++) {
					var cl = this.selectedTemp[i].className;
					this.selectedTemp[i].className = cl.replace(" tempSelected","");
				}
				this.selectedTemp = [];
			}		
			
			// add select temp selected tiles
			this.editorAddSelect = function() {
				self.states.add({
					vals:{tarr:this.selectedTemp.slice(0),sarr:this.selected.slice(0)},
					undo:function(){self.editorUnselectAction(this.vals.tarr);self.editorAddSelectAction(this.vals.sarr);},
					redo:function(){self.editorAddSelectAction(this.vals.tarr);}
				});
				this.editorAddSelectAction(this.selectedTemp);
			}
			
			// unselect tiles
			this.editorUnselect = function() {
				self.states.add({
					vals:{tarr:self.selectedTemp.slice(0),sarr:self.selected.slice(0)},
					undo:function(){self.editorAddSelectAction(this.vals.sarr);},
					redo:function(){self.editorUnselectAction(this.vals.tarr);}
				});
				this.editorUnselectAction(this.selectedTemp);
			}
			
			// unselect all tiles
			this.editorClearSelect = function() {
				if (0<this.selected.length) {
					self.states.add({
						vals:{arr:self.selected.slice(0)},
						undo:function(){self.editorAddSelectAction(this.vals.arr);},
						redo:function(){self.editorUnselectAction(this.vals.arr);}
					});
					this.editorUnselectAction(this.selected);
				}
			}
			
			// replace select temp selected tiles
			this.editorReplaceSelect = function() {
				self.states.add({
					vals:{tarr:self.selectedTemp.slice(0),sarr:self.selected.slice(0)},
					undo:function(){self.editorUnselectAction(this.vals.tarr); self.editorAddSelectAction(this.vals.sarr);},
					redo:function(){self.editorUnselectAction(this.vals.sarr); self.editorAddSelectAction(this.vals.tarr);}
				});
				this.editorUnselectAction(this.selected);
				this.editorAddSelectAction(this.selectedTemp);
			}
					
			// calculate top left most selected tile
			this.getSelectedTopLeft = function() {
				var y = 1000;
				var x = 1000;
				for (i=0; i<this.selected.length; i++) {
					var spl = this.selected[i].id.split("-");
					var xy = this.translateLocationIds(parseInt(spl[4]),parseInt(spl[5]));
					if (xy.y<y) { y = xy.y; }
					if (xy.x<x) { x = xy.x; }
				}
				var ids = this.translateLocationCoords(x,y);
				return {id:ids.id,subid:ids.subid};
			}

			// calculate x y co-ordinates for tiles and subtiles
			this.translateLocationIds = function(id,subid) {
				var y = Math.floor(id/this.cols);
				var x = id-(y*this.cols);
				y *= 2;
				x *= 2;
				if (subid==2||subid==3) { y++; }
				if (subid==1||subid==3) { x++; }
				return {x:x,y:y};
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
				var id = (y2*this.cols)+x2;
				return {id:id,subid:subid};
			}
						
			
	// editor selection actions
	//////////
			
			// select action
			this.editorAddSelectAction = function(arr) {
				for (s1=0; s1<arr.length; s1++) {
					var match = false;
					for (s2=0; s2<this.selected.length; s2++) {
						if (arr[s1]==this.selected[s2]) {
							match = true;
						}
					}
					if (!match) {
						arr[s1].className += ' selected';
						this.selected.push(arr[s1]);
						
					}
				}
			}
			
			// unselect action
			this.editorUnselectAction = function(arr) {
				var newArr = [];
				for (s2=0; s2<this.selected.length; s2++) {
					var match = false;
					for (s1=0; s1<arr.length; s1++) {
						if (arr[s1]==this.selected[s2]) {
							match = true;
							var cl = arr[s1].className;
							arr[s1].className = cl.replace(" selected","");
						}
					}
					if (!match) {
						newArr.push(this.selected[s2]);
					}
				}
				this.selected = newArr;
			}


	// editor manipulation
	//////////
	
			// copy selected tiles and return array of details
			this.editorCopySelected = function() {
				return this.editorCopyEls(this.selected);
			}
	
			// copy some tiles and return array of details
			this.editorCopyEls = function(arr) {
				var newArr = [];
				var d = this.dat.json.tiles[this.id].tileIds[this.frame];
				for (s=0; s<arr.length; s++) {
					var ids = arr[s].id.split("-");
					var graphics = d[ids[4]][ids[5]];
					var coords = this.translateLocationIds(ids[4],ids[5]);
					newArr.push({x:coords.x,y:coords.y,tile:graphics});
				}
				return clipboardTable(newArr);
			}

			// copy selected tiles
			this.editorCopy = function() {
				var arr = this.editorCopySelected();
				this.copy(arr);	
			}

			// delete selected tiles
			this.editorDelete = function() {
				var rarr = this.editorCopySelected();
				var ids = this.getSelectedTopLeft();
				self.states.add({
					vals:{tid:parseInt(this.id),frame:parseInt(this.frame),tileid:ids.id,tilesubid:ids.subid,sarr:this.selected.slice(0),rarr:rarr.slice(0),id:parseInt(this.id)},
					undo:function(){self.editorPasteAction(this.vals.tid,this.vals.frame,this.vals.tileid,this.vals.tilesubid,this.vals.rarr);},
					redo:function(){self.editorDeleteAction(this.vals.tid,this.vals.sarr);}
				});
				this.editorDeleteAction(this.id,this.selected);
			}

			// paste tiles to location
			this.editorPaste = function(el) {
				var narr = this.editorCopyEls(this.previewTiles.earr);
				var spl = el.id.split("-");
				var id = parseInt(spl[4]);
				var subid = parseInt(spl[5]);
				self.states.add({
					vals:{tid:this.id,frame:this.frame,id:id,subid:subid,sarr:this.clipboard,narr:narr,darr:this.previewTiles.earr},
					undo:function(){self.editorDeleteAction(this.vals.tid,this.vals.darr);self.editorPasteAction(this.vals.tid,this.vals.frame,this.vals.id,this.vals.subid,this.vals.narr);},
					redo:function(){self.editorPasteAction(this.vals.tid,this.vals.frame,this.vals.id,this.vals.subid,this.vals.sarr);}
				});
				this.editorPasteAction(this.id,this.frame,id,subid,this.clipboard);
			}

			// preview paste drop
			this.previewTiles = {x:0,y:0,arr:[],earr:[]};
			this.editorClipPreview = function(el) {
				this.els.clipboard.style.display = 'none';
				var checkX = parseInt(this.cols*2);
				var checkY = Math.ceil(parseInt(256/this.cols)*2);
				var d = this.dat.json.tiles[this.id].tileIds[this.frame];
				var arr = this.clipboard;
				var spl = el.id.split("-");
				var coords = this.translateLocationIds(parseInt(spl[4]),parseInt(spl[5]));
				var sarr = [];
				var earr = [];
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					var y2 = parseInt(y+coords.y);
					var x2 = parseInt(x+coords.x);
					if (x2<checkX&&y2<checkY) {
						var ids = this.translateLocationCoords(x2,y2);
						var d1 = d[ids.id][ids.subid];
						earr.push(document.getElementById(this.els.editor.frames[this.frame].tile[ids.id].subtile[ids.subid].div.id));
						sarr.push({y:y2,x:x2,tile:d1});
						if (arr[y][x]) {
							this.editorSetGraphicsAction(this.frame,ids.id,ids.subid,arr[y][x]);
						}
					}
				}
				}
				this.previewTiles.y = coords.y;
				this.previewTiles.x = coords.x;
				this.previewTiles.arr = clipboardTable(sarr);
				this.previewTiles.earr = earr;
			}
			
			// preview paste drop cancel
			this.editorClipPreviewCancel = function() {
				var arr = this.previewTiles.arr;
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					var ids = this.translateLocationCoords(parseInt(x+this.previewTiles.x),parseInt(y+this.previewTiles.y));
					this.editorSetGraphicsAction(this.frame,ids.id,ids.subid,arr[y][x]);
				}
				}
				this.els.clipboard.style.display = 'block';
			}
	
			// store current behaviour
			this.storeCurrentBehaviour = function() {
				var newArr = [];
				var d = this.dat.json.tiles[this.id].behaviour;
				for (i=0; i<this.selected.length; i++) {
					var ids = this.selected[i].id.split("-");
					var obj = {id:ids[4],subid:ids[5],bid:d[ids[4]][ids[5]]};
					newArr.push(obj);
				}
				return newArr;
			}
	
			// set behaviour of selected tiles
			this.editorSetBehaviour = function(e) {
				var oarr = this.storeCurrentBehaviour();
				var bid = e.target.id.split("-")[3];
				self.states.add({
					vals:{bid:bid,sarr:this.selected,oarr:oarr},
					undo:function(){self.editorRestoreBehaviour(this.vals.oarr);},
					redo:function(){self.editorSetBehaviourAction(this.vals.bid,this.vals.sarr);}
				});
				this.editorSetBehaviourAction(bid,this.selected);
			}
	
	
	// editor manipulation actions
	//////////			

			// change graphics in the tiles
			this.editorSetGraphicsAction = function(f,id,subid,tile) {
				var el = this.els.editor.frames[f].tile[id].subtile[subid].div;
				el.className = 'interactive';
				if (tile) {
					var sel = '';
					var cl = el.className.indexOf("selected");
					if (cl!=-1) { sel = " selected"; }
					el.className = 'interactive tile-'+tile[0]+sel;
					var y1 = -parseInt(tile[1]*16);
					var x1 = -parseInt(tile[2]*16);
					el.style.backgroundPosition = x1+'px '+y1+'px';
				}
			}
	
			// delete selected tiles action
			this.editorDeleteAction = function(id,arr) {
				var d = this.dat.json.tiles[id].tileIds;
				for (s=0; s<arr.length; s++) {
					var ids = arr[s].id.split("-");
					d[ids[3]][ids[4]][ids[5]] = null;
					arr[s].className = 'interactive';
				}
				this.editorUnselectAction(this.selected);
			}
					
			// paste tiles to location action
			this.editorPasteAction = function(tid,frame,id,subid,arr) {
				this.drawTrigger = true;
				var checkX = parseInt(this.cols*2);
				var checkY = Math.ceil(parseInt(256/this.cols)*2);
				var d = this.dat.json.tiles[tid].tileIds[frame];
				var coords = this.translateLocationIds(id,subid);
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					var y2 = parseInt(y+coords.y);
					var x2 = parseInt(x+coords.x);
					var ids = this.translateLocationCoords(x2,y2);
					if (arr[y][x]&&x2<checkX&&y2<checkY) {
						d[ids.id][ids.subid] = arr[y][x];
						this.editorSetGraphicsAction(frame,ids.id,ids.subid,arr[y][x]);
					}
				}
				}
				this.clipTemp = [];
				this.previewTiles = {x:0,y:0,arr:[],earr:[]};
			}
			
			// set behaviour of tiles action
			this.editorSetBehaviourAction = function(bid,arr) {
				var b = this.dat.json.behaviour;
				var d = this.dat.json.tiles[this.id].behaviour;
				for (i=0; i<arr.length; i++) {
					var ids = arr[i].id.split("-");
					this.editorSetBehaviourSubtileAction(ids[4],ids[5],bid);
				}			
			}
			
			// restore stored behaviour
			this.editorRestoreBehaviour = function(arr) {
				for (i=0; i<arr.length; i++) {
					this.editorSetBehaviourSubtileAction(arr[i].id,arr[i].subid,arr[i].bid);
				}			
			}
			
			// set behaviour of individual tile action
			this.editorSetBehaviourSubtileAction = function(id,subid,bid) {
				var b = this.dat.json.behaviour;
				var el = this.els.editor.behaviour.tile[id].subtile[subid].div;
				el.style.backgroundImage = 'url(images/'+b[bid].url+')';
				this.dat.json.tiles[this.id].behaviour[id][subid] = bid;
			}


			
// CONTEXT MENU
//////////			
			
			// context menu
			this.els.context = document.createElement("div");
			this.els.context.id = this.els.div.id+'-context';
			this.els.context.className = 'contextmenu';
			$(this.els.div.id).addChild(this.els.context);
			
			// context menu copy
			this.els.context.copy = document.createElement("div");
			this.els.context.copy.id = this.els.context.id+'-copy';
			this.els.context.copy.innerHTML = 'Copy';
			this.els.context.copy.className = 'menuItem';
			$(this.els.context.id).addChild(this.els.context.copy);
			$(this.els.context.copy.id).click(function(){
				self.contextMenuClose();
				self.editorCopy();
			});
			
			// context menu delete
			this.els.context.del = document.createElement("div");
			this.els.context.del.id = this.els.context.id+'-del';
			this.els.context.del.innerHTML = 'Delete';
			this.els.context.del.className = 'menuItem';
			$(this.els.context.id).addChild(this.els.context.del);
			$(this.els.context.del.id).click(function(){
				self.contextMenuClose();
				self.editorDelete();
			});
			
			// context menu cut
			this.els.context.cut = document.createElement("div");
			this.els.context.cut.id = this.els.context.id+'-cut';
			this.els.context.cut.innerHTML = 'Cut';
			this.els.context.cut.className = 'menuItem';
			$(this.els.context.id).addChild(this.els.context.cut);
			$(this.els.context.cut.id).click(function(){
				self.contextMenuClose();
				self.editorCopy();
				self.editorDelete();
			});
			
			// context menu unselect
			this.els.context.unselect = document.createElement("div");
			this.els.context.unselect.id = this.els.context.id+'-unselect';
			this.els.context.unselect.innerHTML = 'Unselect';
			this.els.context.unselect.className = 'menuItem';
			$(this.els.context.id).addChild(this.els.context.unselect);
			$(this.els.context.unselect.id).click(function(){
				self.contextMenuClose();
				self.editorClearSelect();
			});
			
			// context menu insert
			this.els.context.insert = document.createElement("div");
			this.els.context.insert.id = this.els.context.id+'-insert';
			this.els.context.insert.innerHTML = 'Insert graphics';
			this.els.context.insert.className = 'menuItem';
			$(this.els.context.id).addChild(this.els.context.insert);
			$(this.els.context.insert.id).click(function(e){
				self.openInsertMenu(e);
				self.contextMenuClose();
			});
			
			// context menu behaviour
			this.els.context.behaviour = document.createElement("div");
			this.els.context.behaviour.id = this.els.context.id+'-behaviour';
			this.els.context.behaviour.innerHTML = 'Set behaviour';
			this.els.context.behaviour.className = 'menuItem';
			$(this.els.context.id).addChild(this.els.context.behaviour);
			$(this.els.context.behaviour.id).click(function(){
				self.behaviourMenuOpen(event);
				self.contextMenuClose();
			});
			
			// context menu open
			this.contextMenuOpen = function(e) {
				if (this.selected.length==0) {
					this.editorAddSelectAction([e.target]);
				}
				var x = parseInt(mouseX(e)+5);
				var y = parseInt(mouseY(e)+5);
				this.els.context.style.left = x+'px';
				this.els.context.style.top = y+'px';
				$(this.els.context.id).show();
				self.animateStop();
			}
			
			// context menu close
			this.contextMenuClose = function() {
				$(this.els.context.id).hide();
			}
			$(this.els.context.id).clickOff(function(){
				self.contextMenuClose();
			});
	

// INSERT MENU
//////////

			// insert menu build
			this.insertId = 0;
			this.els.insert = {};
			this.els.insert.div = document.createElement("div");
			this.els.insert.div.id = this.els.div.id+'-menu-insert';
			this.els.insert.div.className = 'contextmenu';
			$(this.els.div.id).addChild(this.els.insert.div);
			
			// insert menu selector
			this.els.insert.select = document.createElement("select");
			this.els.insert.select.id = this.els.insert.div.id+'-select';
			$(this.els.insert.div.id).addChild(this.els.insert.select);
			
			// build insert menu selector
			this.buildInsertSelect = function() {
				$(this.els.insert.select.id).clearChildren();
				var d = this.dat.json.graphics;
				for (i=0; i<d.length; i++) {
					var opt = document.createElement("option");
					opt.value = i;
					opt.innerHTML = d[i].name;
					$(this.els.insert.select.id).addChild(opt);
				}
			}
			this.buildInsertSelect();
			
			// insert menu selector change
			$(this.els.insert.select.id).change(function(){
				self.insertId = this.value;
				self.buildInsertGallery(this.value);
			});
			
			// insert menu open
			this.openInsertMenu = function(e) {
				this.buildInsertSelect();
				this.els.insert.select.value = this.insertId;
				this.insertMenuTrigger = true;
				var x = parseInt(mouseX(e)+5);
				var y = parseInt(mouseY(e)-200);
				this.els.insert.div.style.left = x+'px';
				this.els.insert.div.style.top = y+'px';
				$(this.els.insert.div.id).show();
			}
			
			// insert menu close
			this.closeInsertMenu = function(e) {
				$(this.els.insert.div.id).hide();
			}
			
			// click anywhere but the menu
			this.insertMenuTrigger = false;
			$(this.els.insert.div.id).clickOff(function(){
				if (!self.insertMenuTrigger) {
					self.closeInsertMenu();
				} else {
					self.insertMenuTrigger = false;
				}
			});
			
			// insert menu gallery
			this.els.insert.gallery = {};
			this.els.insert.gallery.div = document.createElement("div");
			this.els.insert.gallery.div.id = this.els.insert.div.id+'-gallery';
			this.els.insert.gallery.div.className = 'canvas scroll double';
			$(this.els.insert.div.id).addChild(this.els.insert.gallery.div);
			
			// build insert gallery
			this.buildInsertGallery = function(id) {
				$(this.els.insert.gallery.div.id).clearChildren();
				var w = parseInt(this.graphics.cols*16)+scrollBarWidth;
				var h = parseInt(this.graphics.cols*16);
				this.els.insert.gallery.div.style.width = w+'px';
				this.els.insert.gallery.div.style.height = h+'px';
				for (y=0; y<this.graphics.rows; y++) {
				for (x=0; x<this.graphics.cols; x++) {
					var y1 = -parseInt(y*16);
					var x1 = -parseInt(x*16);
					var span = document.createElement("span");
					span.id = this.els.insert.gallery.div.id+'-'+y+'-'+x;
					span.className = 'interactive tile-'+id;
					span.style.backgroundPosition = x1+'px '+y1+'px';
					$(this.els.insert.gallery.div.id).addChild(span);
					$(span.id).click(function(e){
						self.insertTiles(e.target.id);
					});
				}
				}
			}
			this.buildInsertGallery(0);
			
			// insert tiles
			this.insertTiles = function(el) {
				var spl = el.split('-');
				var y = parseInt(spl[4]);
				var x = parseInt(spl[5]);
				var gid = this.els.insert.select.value;
				var rarr = this.editorCopySelected();
				var ids = this.getSelectedTopLeft();
				self.states.add({
					vals:{ttid:parseInt(this.id),frame:parseInt(this.frame),tileid:ids.id,tilesubid:ids.subid,sarr:this.selected.slice(0),rarr:rarr.slice(0),gid:gid,y:y,x:x},
					undo:function(){self.editorPasteAction(this.vals.ttid,this.vals.frame,this.vals.tileid,this.vals.tilesubid,this.vals.rarr);},
					redo:function(){self.insertTilesAction(this.vals.ttid,this.vals.frame,this.vals.sarr,this.vals.gid,this.vals.y,this.vals.x);}
				});
				this.insertTilesAction(this.id,this.frame,this.selected,gid,y,x);
			}
			
			// insert tiles action
			this.insertTilesAction = function(id,frame,els,gid,y,x) {
				var d = this.dat.json.tiles[id].tileIds[frame];
				if (0<els.length) {
					for (i=0; i<els.length; i++) {
						var spl = els[i].id.split('-');
						d[spl[4]][spl[5]] = [gid,y,x];
						this.editorSetGraphicsAction(frame,spl[4],spl[5],[gid,y,x])
					}
				}
				this.closeInsertMenu();
			}


// BEHAVIOUR MENU
//////////
	
			// build
			this.contextBehaviourActive = false;
			this.els.contextBehaviour = {};
			this.els.contextBehaviour.div = document.createElement("div");
			this.els.contextBehaviour.div.id = this.els.div.id+'-menu-behaviour';
			this.els.contextBehaviour.div.className = 'contextmenu';
			$(this.els.div.id).addChild(this.els.contextBehaviour.div);
			
			// options
			this.els.contextBehaviour.menu = [];
			this.buildBehaviourMenu = function() {
				var d = this.dat.json.behaviour;
				for (i=0; i<d.length; i++) {
					this.els.contextBehaviour.menu[i] = document.createElement("img");
					this.els.contextBehaviour.menu[i].id = this.els.contextBehaviour.div.id+'-'+i;
					this.els.contextBehaviour.menu[i].className = 'menuTile';
					this.els.contextBehaviour.menu[i].src = 'images/'+d[i].url;
					this.els.contextBehaviour.menu[i].title = d[i].name;
					$(this.els.contextBehaviour.div.id).addChild(this.els.contextBehaviour.menu[i]);
					$(this.els.contextBehaviour.menu[i].id).click(function(){
						self.behaviourMenuClose();
						self.editorSetBehaviour(event);
					});
				}
			}
			this.buildBehaviourMenu();
			
			// behaviour menu open
			this.behaviourMenuOpen = function(e) {
				this.showBehaviour();
				this.contextBehaviourActive = true;
				var x = parseInt(mouseX(e)+5);
				var y = parseInt(mouseY(e)-240);
				this.els.contextBehaviour.div.style.left = x+'px';
				this.els.contextBehaviour.div.style.top = y+'px';
				$(this.els.contextBehaviour.div.id).show();
			}
			
			// behaviour menu close
			this.behaviourMenuClose = function() {
				$(this.els.contextBehaviour.div.id).hide();
			}
			$(this.els.contextBehaviour.div.id).clickOff(function(){
				if (self.contextBehaviourActive) {
					self.contextBehaviourActive = false;
				} else {
					self.behaviourMenuClose();
				}
			});
			
			// show behaviour
			this.showBehaviour = function() {
				self.states.add({
					undo:function(){self.hideBehaviourAction();},
					redo:function(){self.showBehaviourAction();}
				});
				this.showBehaviourAction();
			}
			
			// show behaviour action
			this.showBehaviourAction = function() {
				this.behaviourShow = true;
				this.els.panel.behaviour.show.className = 'selected';
				for (i=0; i<this.els.editor.frames.length; i++) {
					this.els.editor.frames[i].div.style.opacity = 0.5;
				}
				$(this.els.editor.behaviour.div.id).show();
			}
			
			// hide behaviour
			this.hideBehaviour = function() {
				self.states.add({
					undo:function(){self.showBehaviourAction();},
					redo:function(){self.hideBehaviourAction();}
				});
				this.hideBehaviourAction();
			}
			
			// hide behaviour action
			this.hideBehaviourAction = function() {
				this.behaviourShow = false;
				this.els.panel.behaviour.show.className = '';
				for (i=0; i<this.els.editor.frames.length; i++) {
					this.els.editor.frames[i].div.style.opacity = 1;
				}
				$(this.els.editor.behaviour.div.id).hide();
			}
		
			

// EDITOR PANEL
//////////

	// main panel
	//////////
			
			this.els.panel = {};
			this.els.panel.div = document.createElement("div");
			this.els.panel.div.id = this.els.div.id+'-editor-panel';
			this.els.panel.div.className = 'panel';
			$(this.els.div.id).addChild(this.els.panel.div);
			
			
	// editor manipulation
	//////////
			
			// actions buttons
			this.els.panel.actions = {};
			this.els.panel.actions.ul = document.createElement("ul");
			this.els.panel.actions.ul.id = this.els.panel.div.id+'-actions';
			this.els.panel.actions.ul.className = 'buttons';
			$(this.els.panel.div.id).addChild(this.els.panel.actions.ul);
			
			// actions buttons copy
			this.els.panel.actions.copy = document.createElement("li");
			this.els.panel.actions.copy.id = this.els.panel.actions.ul.id+'-copy';
			this.els.panel.actions.copy.className = 'button';
			this.els.panel.actions.copy.innerHTML = '<img src="images/icon-copy.png" alt="">';			
			this.els.panel.actions.copy.title = 'Copy selected tiles';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.copy);
			$(this.els.panel.actions.copy.id).click(function(){
				self.editorCopy();
			});

			// actions buttons cut
			this.els.panel.actions.cut = document.createElement("li");
			this.els.panel.actions.cut.id = this.els.panel.actions.ul.id+'-cut';
			this.els.panel.actions.cut.className = 'button';
			this.els.panel.actions.cut.innerHTML = '<img src="images/icon-cut.png" alt="">';			
			this.els.panel.actions.cut.title = 'Cut selected tiles';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.cut);
			$(this.els.panel.actions.cut.id).click(function(){
				self.editorCopy();
				self.editorDelete();
			});
			
			// actions buttons delete
			this.els.panel.actions.del = document.createElement("li");
			this.els.panel.actions.del.id = this.els.panel.actions.ul.id+'-del';
			this.els.panel.actions.del.className = 'button';
			this.els.panel.actions.del.innerHTML = '<img src="images/icon-delete.png" alt="">';			
			this.els.panel.actions.del.title = 'Delete selected tiles';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.del);
			$(this.els.panel.actions.del.id).click(function(){
				self.editorDelete();
			});
			
			// actions buttons unselect
			this.els.panel.actions.unselect = document.createElement("li");
			this.els.panel.actions.unselect.id = this.els.panel.actions.ul.id+'-unselect';
			this.els.panel.actions.unselect.className = 'button';
			this.els.panel.actions.unselect.innerHTML = '<img src="images/icon-unselect.png" alt="">';			
			this.els.panel.actions.unselect.title = 'Unselect selected tiles';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.unselect);
			$(this.els.panel.actions.unselect.id).click(function(){
				self.editorClearSelect();
			});
			
			// actions buttons insert
			this.els.panel.actions.insert = document.createElement("li");
			this.els.panel.actions.insert.id = this.els.panel.actions.ul.id+'-insert';
			this.els.panel.actions.insert.className = 'button';
			this.els.panel.actions.insert.innerHTML = '<img src="images/icon-insert.png" alt="">';			
			this.els.panel.actions.insert.title = 'Insert graphics';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.insert);
			$(this.els.panel.actions.insert.id).click(function(e){
				self.openInsertMenu(e);
			});
			
			// actions buttons behaviour
			this.els.panel.actions.behaviour = document.createElement("li");
			this.els.panel.actions.behaviour.id = this.els.panel.actions.ul.id+'-behaviour';
			this.els.panel.actions.behaviour.className = 'button';
			this.els.panel.actions.behaviour.innerHTML = '<img src="images/icon-behaviour-edit.png" alt="">';			
			this.els.panel.actions.behaviour.title = 'Change behaviour of selected tiles';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.behaviour);
			$(this.els.panel.actions.behaviour.id).click(function(e){
				self.behaviourMenuOpen(event);
			});
		
		
	// animation
	//////////
		
			//  animation buttons
			this.els.panel.animate = {};
			this.els.panel.animate.ul = document.createElement("ul");
			this.els.panel.animate.ul.id = this.els.panel.div.id+'-animate';
			this.els.panel.animate.ul.className = 'buttons';
			$(this.els.panel.div.id).addChild(this.els.panel.animate.ul);
			
			this.els.panel.animate.frame = [];
			this.buildAnimateButtons = function() {
				$(this.els.panel.animate.ul.id).clearChildren();
				this.els.panel.animate.frame = [];
				var d = this.dat.json.tiles[this.id].tileIds;
				for (j=0; j<d.length; j++) {
					this.els.panel.animate.frame[j] = document.createElement("li");
					this.els.panel.animate.frame[j].id = this.els.panel.animate.ul.id+'-'+j;
					this.els.panel.animate.frame[j].innerHTML = 'A'+parseInt(j+1);
					this.els.panel.animate.frame[j].title = 'Edit animation frame '+parseInt(j+1);
					$(this.els.panel.animate.ul.id).addChild(this.els.panel.animate.frame[j]);
					$(this.els.panel.animate.frame[j].id).click(function(){
						self.editorButtonFramePress(event);
					});
				}
				this.els.panel.animate.play = document.createElement("li");
				this.els.panel.animate.play.id = this.els.panel.animate.ul.id+'-play';
				this.els.panel.animate.play.innerHTML = '<img src="images/icon-animate.png" alt="">';
				this.els.panel.animate.play.title = 'Play animation';
				$(this.els.panel.animate.ul.id).addChild(this.els.panel.animate.play);
			}
			this.buildAnimateButtons();
			
			// press a frame button
			this.editorButtonFramePress = function(e) {
				var el = e.srcElement.id;
				var f = el.split("-")[4];
				self.editorFrameShow(f);
			}
			
			// show a frame in the editor
			this.editorFrameShow = function(f) {
				self.states.add({
					vals:{oframe:this.frame,nframe:f},
					undo:function(){self.editorFrameShowAction(this.vals.oframe);},
					redo:function(){self.editorFrameShowAction(this.vals.nframe);}
				});
				this.editorFrameShowAction(f);
			}
			
			// show a frame in the editor
			this.editorFrameShowAction = function(f) {
				this.frame = f;
				var d = this.dat.json.tiles[this.id].tileIds;
				for (i=0; i<d.length; i++) {
					this.els.panel.animate.frame[i].className = '';
					$(this.els.editor.frames[i].div.id).hide();
				}
				this.els.panel.animate.frame[f].className = 'selected';
				$(this.els.editor.frames[f].div.id).show();
			}
			
			// animate frames of animation
			this.animate = false;
			this.frame = 0;
			this.animateTrigger = false;
			$(this.els.panel.animate.play.id).click(function(){
				self.animateTrigger = true;
				if (self.animate) {
					self.animateStop();
				} else {
					self.animateGo();
				}
			});

			this.animateGo = function() {
				self.editorUnselectAction(this.selected);
				self.els.panel.animate.play.className = 'selected';
				self.els.editor.frames[1].div.className = 'frame';
				self.els.editor.frames[2].div.className = 'frame';
				self.animate = true;
			}
			this.animateStop = function() {
				if (self.animate) {
					self.els.panel.animate.play.className = '';
					self.els.editor.frames[1].div.className = 'frame tilesBg';
					self.els.editor.frames[2].div.className = 'frame tilesBg';
					self.animate = false;
					self.editorFrameShowAction(0);
				}
			}
			runEveryFrame(function(){
				if (self.animate) {
					self.editorFrameShowAction(self.frame);
					$(self.els.editor.frames[0].div.id).show();
					if (self.frame<(self.dat.json.tiles[self.id].tileIds.length-1)) {
						self.frame++;
					} else {
						self.frame = 0;
					}
				}
			});
		
		
	// behaviour
	//////////
		
			// show behaviour
			this.behaviourShow = false;
			this.els.panel.behaviour = {};
			this.els.panel.behaviour.ul = document.createElement("ul");
			this.els.panel.behaviour.ul.id = this.els.panel.div.id+'-behaviour';
			this.els.panel.behaviour.ul.className = 'buttons';
			$(this.els.panel.div.id).addChild(this.els.panel.behaviour.ul);
			
			// show behaviour button
			this.els.panel.behaviour.show = document.createElement("li");
			this.els.panel.behaviour.show.id = this.els.panel.behaviour.ul.id+'-show';
			this.els.panel.behaviour.show.innerHTML = '<img src="images/icon-behaviour.png" alt="">';
			this.els.panel.behaviour.show.title = 'Show behaviour';
			$(this.els.panel.behaviour.ul.id).addChild(this.els.panel.behaviour.show);
			
			$(this.els.panel.behaviour.show.id).click(function(){
				if (self.behaviourShow) {
					self.hideBehaviour();
				} else {
					self.showBehaviour();
				}
			});
			
			// add clear div to panel
			$(this.els.panel.div.id).addClearDiv();

			
// CLIPBOARD
//////////
			
			// setup
			this.clipboard = null;
			this.clipboardActive = false;
			this.els.clipboard = document.createElement("div");
			this.els.clipboard.id = this.els.div.id+'-clipboard';
			this.els.clipboard.className = 'canvas mouse double';
			$(this.els.div.id).addChild(this.els.clipboard);
			$(this.els.clipboard.id).mouseMove();
			
			// copy an array of tiles to the clipboard
			this.copy = function(arr) {
				this.clipboard = arr;
				this.clipboardActive = true;
				$(this.els.clipboard.id).clearChildren();
				var newWidth = parseInt(this.clipboard[0].length*16);
				$(this.els.clipboard.id).width(newWidth);
				for (y=0; y<this.clipboard.length; y++) {
				for (x=0; x<this.clipboard[y].length; x++) {
					var d = this.clipboard[y][x];
					var el = document.createElement("span");
					if (d) {
						el.className = 'tile-'+d[0];
						var posY = -parseInt(d[1]*16);
						var posX = -parseInt(d[2]*16);
						el.style.backgroundPosition = posX+'px '+posY+'px';
					}
					$(this.els.clipboard.id).addChild(el);
				}
				}
			}
			
			// clear on click off editor
			$(this.els.control.select.id).clickOff(function(e){
				var id = e.target.id;
				var spl = id.split("-");
				var ch = spl[0]+'-'+spl[1]+'-'+spl[2]+'-'+spl[3];
				if (self.clipboard&&!self.clipboardActive&&ch!='tiles-editor-panel-animate') {
					self.copyClear();
				}
			});
			
			// clear clipboard
			this.copyClear = function() {
				$(this.els.clipboard.id).clearChildren();
				this.clipboard = null;
			}
			
			// set default tileset
			this.setId(id,true);
			
		}