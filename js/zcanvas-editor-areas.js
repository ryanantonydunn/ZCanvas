// ZCANVAS
// EDITOR
// AREAS
//////////

		function zc_editor_areas(id,states,dat,graphics,tiles,xycursor) {
			var self = this;
			this.id = id;
			this.states = states;
			this.dat = dat;
			this.graphics = graphics;
			this.tiles = tiles;
			this.xycursor = xycursor;
			this.els = {};
			this.count = 0;
			this.ops = '<option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option><option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option><option value="36">36</option><option value="37">37</option><option value="38">38</option><option value="39">39</option><option value="40">40</option><option value="41">41</option><option value="42">42</option><option value="43">43</option><option value="44">44</option><option value="45">45</option><option value="46">46</option><option value="47">47</option><option value="48">48</option><option value="49">49</option><option value="50">50</option><option value="51">51</option><option value="52">52</option><option value="53">53</option><option value="54">54</option><option value="55">55</option><option value="56">56</option><option value="57">57</option><option value="58">58</option><option value="59">59</option><option value="60">60</option><option value="61">61</option><option value="62">62</option><option value="63">63</option><option value="64">64</option>';
	
	
// CONTROLS
///////////
	
	// change the current area
	//////////
	
			this.setId = function(id,cancelbuild) {
				this.id = id;
				this.count = this.dat.json.areas[this.id].length;
				this.els.control.select.value = id;
				this.floor = 0;
				if (!cancelbuild) {
					this.editorBuild();
				}
			}
			

	// set up main divs
	//////////
			
			// set up main div
			this.els.div = document.createElement("div");
			this.els.div.id = 'zc_editor_area';
			
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
				self.hideRename();
				self.hideAddnew();
				self.hideResize();
				self.setId(this.value);
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
				this.hideResize();
				this.els.buttons.rename.toggle.className = 'selected';
				this.els.control.rename.text.value = this.dat.json.areas[this.id].name;
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
				var un = self.dat.json.areas[self.id].name;
				var rn = self.els.control.rename.text.value;
				this.states.add({
					vals:{id:parseInt(self.id),uname:new String(un),rname:new String(rn)},
					undo:function(){self.actionRenameArea(this.vals.id,this.vals.uname);},
					redo:function(){self.actionRenameArea(this.vals.id,this.vals.rname);}
				});
				this.actionRenameArea(self.id,rn);
				this.hideRename();
			}


	// resize
	//////////
			
			// toggle value
			this.resizeShow = false;
			
			// toggle button
			this.els.buttons.resize = {};
			this.els.buttons.resize.toggle = document.createElement("li");
			this.els.buttons.resize.toggle.id = this.els.buttons.ul.id+'-resize';
			this.els.buttons.resize.toggle.innerHTML = '<img src="images/icon-resize.png" alt="">';
			this.els.buttons.resize.toggle.title = 'Resize';
			$(this.els.buttons.ul.id).addChild(this.els.buttons.resize.toggle);
			
			// toggle
			$(this.els.buttons.resize.toggle.id).click(function(){
				if (self.resizeShow) {
					self.hideResize();
				} else {
					self.showResize();
				}
			});
			
			// toggle show
			this.showResize = function() {
				this.hideAddnew();
				this.hideRename();
				this.els.buttons.resize.toggle.className = 'selected';
				this.els.control.resize.height.value = this.dat.json.areas[this.id].tiles[0].length;
				this.els.control.resize.width.value = this.dat.json.areas[this.id].tiles[0][0].length;
				$(this.els.control.resize.div.id).show();
				this.resizeShow = true;
			}
			
			// toggle hide
			this.hideResize = function() {
				this.els.buttons.resize.toggle.className = '';
				$(this.els.control.resize.div.id).hide();
				this.resizeShow = false;
			}
		
			// controls box
			this.els.control.resize = {};
			this.els.control.resize.div = document.createElement("div");
			this.els.control.resize.div.id = this.els.control.div.id+'-resize';
			$(this.els.control.div.id).addChild(this.els.control.resize.div);
			
			this.els.control.resize.width = document.createElement("select");
			this.els.control.resize.height = document.createElement("select");
			this.els.control.resize.width.innerHTML = this.ops;
			this.els.control.resize.height.innerHTML = this.ops;
			this.els.control.resize.width.title = 'Number of columns';
			this.els.control.resize.height.title = 'Number of rows';
			$(this.els.control.resize.div.id).addChild(this.els.control.resize.width);
			$(this.els.control.resize.div.id).addChild(this.els.control.resize.height);
			
			this.els.control.resize.save = document.createElement("ul");
			this.els.control.resize.save.id = this.els.control.resize.div.id+'-save';
			this.els.control.resize.save.title = 'Save new size';
			this.els.control.resize.save.className = 'buttons';
			this.els.control.resize.save.innerHTML = '<li><img src="images/icon-save.png" alt=""></li>';
			$(this.els.control.resize.div.id).addChild(this.els.control.resize.save);			
			
			// hide controls box
			$(this.els.control.resize.div.id).hide();
			
			// save button
			$(this.els.control.resize.save.id).click(function(){
				self.resizeSave();
			});
			
			// save
			this.resizeSave = function() {
				var w = parseInt(this.els.control.resize.width.value);
				var h = parseInt(this.els.control.resize.height.value);
				var d = this.dat.json.areas[this.id];
				var newD = {name:d.name,tiles:[]};
				for (f=0; f<d.tiles.length; f++) {
					newD.tiles[f] = [];
					for (y=0; y<h; y++) {
						newD.tiles[f][y] = [];
						for (x=0; x<w; x++) {
							var match = null;
							var match2 = [0];
							if (d.tiles[f][y]) {
							if (d.tiles[f][y][x]) {
							if (d.tiles[f][y][x][0]) {
								match = d.tiles[f][y][x][0];
								match2 = d.tiles[f][y][x][1];
							}
							}
							}
							newD.tiles[f][y][x] = [match,match2];
						}
					}
				}
				self.states.add({
					vals:{id:parseInt(self.id),uarr:d,rarr:newD.clone()},
					undo:function(){self.actionReplaceArea(this.vals.id,this.vals.uarr);},
					redo:function(){self.actionReplaceArea(this.vals.id,this.vals.rarr);}
				});
				this.actionReplaceArea(this.id,newD);
				this.hideResize();
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
				self.hideResize();
				if (1<self.dat.json.areas.length) {
					var c = confirm('Delete the "'+self.dat.json.areas[self.id].name+'" area?');
					if (c) {
						self.deleteArea();
					}
				} else {
					alert('Last area cannot be deleted');
				}
			});
			
			// delete
			this.deleteArea = function() {
				self.states.add({
					vals:{id:parseInt(self.id),arr:self.dat.json.areas[self.id]},
					undo:function(){self.actionAddArea(this.vals.id,this.vals.arr);},
					redo:function(){self.actionDeleteArea(this.vals.id);}
				});
				this.actionDeleteArea(this.id);
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
				this.hideResize();
				this.els.buttons.addnew.toggle.className = 'selected';
				this.els.control.addnew.height.value = this.dat.json.areas[this.id].tiles[0].length;
				this.els.control.addnew.width.value = this.dat.json.areas[this.id].tiles[0][0].length;
				this.els.control.addnew.text.value = 'New Area';
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
			
			this.els.control.addnew.width = document.createElement("select");
			this.els.control.addnew.height = document.createElement("select");
			this.els.control.addnew.width.innerHTML = this.ops;
			this.els.control.addnew.height.innerHTML = this.ops;
			this.els.control.addnew.width.title = 'Number of columns';
			this.els.control.addnew.height.title = 'Number of rows';
			this.els.control.addnew.width.value = 32;
			this.els.control.addnew.height.value = 32;
			$(this.els.control.addnew.div.id).addChild(this.els.control.addnew.width);
			$(this.els.control.addnew.div.id).addChild(this.els.control.addnew.height);
			
			this.els.control.addnew.save = document.createElement("ul");
			this.els.control.addnew.save.id = this.els.control.addnew.div.id+'-save';
			this.els.control.addnew.save.className = 'buttons';
			this.els.control.addnew.save.title = 'Save new area';
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
				var i = self.dat.json.areas.length;
				var w = parseInt(this.els.control.addnew.width.value);
				var h = parseInt(this.els.control.addnew.height.value);
				var obj = {};
				obj.name = this.els.control.addnew.text.value;
				obj.tiles = [[]];
				for (y=0; y<h; y++) {
					obj.tiles[0][y] = [];
					for (x=0; x<w; x++) {
						obj.tiles[0][y][x] = [null,[0,null]];
					}
				}
				self.states.add({
					vals:{i:parseInt(i),obj:obj.clone()},
					undo:function(){self.actionDeleteArea(this.vals.i);},
					redo:function(){self.actionAddArea(this.vals.i,this.vals.obj);}
				});
				this.actionAddArea(i,obj);
				this.hideAddnew();
			}
			
			
	// duplicate
	//////////

			// button
			this.els.buttons.dupe = document.createElement("li");
			this.els.buttons.dupe.id = this.els.buttons.ul.id+'-dupe';
			this.els.buttons.dupe.innerHTML = '<img src="images/icon-copy.png" alt="">';
			this.els.buttons.dupe.title = 'Duplicate';
			$(this.els.buttons.ul.id).addChild(this.els.buttons.dupe);
			
			// button click
			$(this.els.buttons.dupe.id).click(function(){
				self.hideAddnew();
				self.hideRename();
				self.hideResize();
				var c = confirm('Duplicate the "'+self.dat.json.areas[self.id].name+'" area?');
				if (c) {
					self.duplicateArea();
				}
			});
			
			// delete
			this.duplicateArea = function() {
				var narr = self.dat.json.areas[self.id].clone();
				var nid = self.dat.json.areas.length;
				self.states.add({
					vals:{id:nid,narr:narr},
					undo:function(){self.actionDeleteArea(this.vals.id);},
					redo:function(){self.actionAddArea(this.vals.id,this.vals.narr);}
				});
				this.actionAddArea(nid,narr);
			}
			
	

	// clear main divs
	//////////
	
			$(this.els.control.div.id).addClearDiv();
	

	// actions
	//////////
	
			// add area
			this.actionAddArea = function(i,obj) {
				var arr = self.dat.json.areas;
				arr.splice(i,0,obj);
				self.buildSelect();
				self.setId(i);
			}
			
			// delete area
			this.actionDeleteArea = function(i) {
				var arr = self.dat.json.areas;
				arr.splice(i,1);
				self.buildSelect();
				self.setId(0);
			}
			
			// replace area
			this.actionReplaceArea = function(i,obj) {
				var arr = self.dat.json.areas;
				arr.splice(i,1,obj);
				self.buildSelect();
				self.setId(i);
			}
			
			// rename area
			this.actionRenameArea = function(i,name) {
				var s = self.dat.json.areas;
				self.dat.json.areas[i].name = name;
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
			this.els.editor.div.className = 'canvas scroll';
			$(this.els.div.id).addChild(this.els.editor.div);
			
			// build the editor
			this.editorBuild = function() {
				$(this.els.editor.div.id).clearChildren();
				this.editorBuildFloors(this.els.editor);
				this.editorFrameShow(0);
				this.buildFloorButtons();
			}
			
			// build floor objects/divs
			this.editorBuildFloors = function(obj) {
				var da = this.dat.json.areas[this.id].tiles;
				obj.floor = [];
				for (z=0; z<da.length; z++) {
					obj.floor[z] = {};
					obj.floor[z].div = document.createElement("div");
					obj.floor[z].div.id = obj.div.id+'-'+z;
					obj.floor[z].div.className = 'frame';
					$(obj.div.id).addChild(obj.floor[z].div);
					this.editorBuildFrames(obj.floor[z],z);
					this.editorBuildAction(obj.floor[z],z);
					this.editorBuildActive(obj.floor[z],z);
				}
			}
			
			// build animation frames objects/divs
			this.editorBuildFrames = function(obj,z) {
				obj.frames = [];
				for (f=0; f<this.tiles.frames; f++) {
					obj.frames[f] = {};
					obj.frames[f].div = document.createElement("div");
					obj.frames[f].div.id = obj.div.id+'-frame-'+f;
					obj.frames[f].div.className = 'frame';
					$(obj.div.id).addChild(obj.frames[f].div);
					this.editorBuildRows(obj.frames[f],z,f,'frame')
				}
			}

			// build action objects/divs
			this.editorBuildAction = function(obj,z) {
				obj.action = {};
				obj.action.div = document.createElement("div");
				obj.action.div.id = obj.div.id+'-action';
				obj.action.div.className = 'frame';
				$(obj.div.id).addChild(obj.action.div);
				this.editorBuildRows(obj.action,z,null,'action')
			}
			
			// build active objects/divs
			this.editorBuildActive = function(obj,z) {
				obj.active = {};
				obj.active.div = document.createElement("div");
				obj.active.div.id = obj.div.id+'-active';
				obj.active.div.className = 'frame';
				$(obj.div.id).addChild(obj.active.div);
				this.editorBuildRows(obj.active,z,null,'active')
			}
			
			// build row objects/divs
			this.editorBuildRows = function(obj,z,f,type) {
				var da = this.dat.json.areas[this.id].tiles;
				obj.row = [];
				for (y=0; y<da[0].length; y++) {
					obj.row[y] = {};
					obj.row[y].div = document.createElement("div");
					obj.row[y].div.id = obj.div.id+'-'+y;
					obj.row[y].div.className = 'row';
					obj.row[y].div.style.width = parseInt(da[0][0].length)*16+'px';
					$(obj.div.id).addChild(obj.row[y].div);
					if (type=='frame') { this.editorBuildTiles(obj.row[y],z,y,f); }
					if (type=='action') { this.editorBuildActionTiles(obj.row[y],z,y); }
					if (type=='active') { this.editorBuildActiveTiles(obj.row[y]); }
				}
			}
			
			// build tile objects/divs
			this.editorBuildTiles = function(obj,z,y,f) {
				var da = this.dat.json.areas[this.id].tiles;
				obj.tile = [];
				for (x=0; x<da[0][0].length; x++) {
					obj.tile[x] = {};
					obj.tile[x].div = document.createElement("b");
					obj.tile[x].div.id = obj.div.id+'-'+x;
					$(obj.div.id).addChild(obj.tile[x].div);
					this.editorSetGraphicsFrame(z,y,x,f,da[z][y][x][0]);
				}
			}
				
			// set graphics with frames
			this.editorSetGraphics = function(z,y,x,t) {
				for (i2=0; i2<this.tiles.frames; i2++) {
					this.editorSetGraphicsFrame(z,y,x,i2,t);
				}
			}
				
			// set graphics
			this.editorSetGraphicsFrame = function(z,y,x,f,t) {
				var d = this.els.editor.floor[z].frames[f].row[y].tile[x];
				$(d.div.id).clearChildren();
				if (t) {
					var dt = this.dat.json.tiles[t[0]].tileIds[f][t[1]];
					for (s=0; s<dt.length; s++) {
						var el = document.createElement("span");
						if (dt[s]) {
							el.className = 'tile-'+dt[s][0];
							var y1 = -parseInt(dt[s][1]*8);
							var x1 = -parseInt(dt[s][2]*8);
							el.style.backgroundPosition = x1+'px '+y1+'px';
						}	
						$(d.div.id).addChild(el);
					}
				}
			}

			// build action tile objects/divs
			this.editorBuildActionTiles = function(obj,z,y) {
				var da = this.dat.json.areas[this.id].tiles;
				obj.tile = [];
				for (x=0; x<da[0][0].length; x++) {
					obj.tile[x] = {};
					obj.tile[x].div = document.createElement("b");
					obj.tile[x].div.id = obj.div.id+'-'+x;
					$(obj.div.id).addChild(obj.tile[x].div);
					this.editorSetActionTileImg(z,y,x,da[z][y][x][1][0]);
				}
			}
			
			// set image for action tiles
			this.editorSetActionTileImg = function(z,y,x,id) {
				var a = this.dat.json.actions[id];
				var d = this.els.editor.floor[z].action.row[y].tile[x].div;
				d.style.background = 'url(images/'+a.icon+')';
			}
			
			// build active tile objects/divs
			this.editorBuildActiveTiles = function(obj) {
				var da = this.dat.json.areas[this.id].tiles;
				obj.tile = [];
				for (x=0; x<da[0][0].length; x++) {
					obj.tile[x] = {};
					obj.tile[x].div = document.createElement("b");
					obj.tile[x].div.id = obj.div.id+'-'+x;
					obj.tile[x].div.className = 'interactive';
					$(obj.div.id).addChild(obj.tile[x].div);
					$(obj.tile[x].div.id).mouseDown(function(e){
						if (e.which==1) {
						self.editorMouseDown(event);
						}
					});
					$(obj.tile[x].div.id).mouseUp(function(e){
						if (e.which==1) {
						self.editorMouseUp(event);
						}
					});
					$(obj.tile[x].div.id).click(function(){
						self.editorClick(event);
					});
					$(obj.tile[x].div.id).rightClick(function() {
						self.editorRightClick(event);
						blockContextMenu(event);
					});
					$(obj.tile[x].div.id).hover(function(){
						self.editorHover(event);
					});
					$(obj.tile[x].div.id).hoverOff(function(){
						self.editorHoverOff(event);
					});
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
				var spl = e.target.id.split('-');
				this.xycursor.innerHTML = spl[5]+'-'+spl[4];
				$(this.xycursor.id).show();
				
				if (this.clipboard) {
					this.editorClipPreview(e.target);
					// this.clipboardActive = true;
				} else {
					if (buttonMouse&&this.mouseDownEl) {
						this.editorClearTempSelect();
						this.editorTempSelectShift(e.target,this.mouseDownEl);
					}
				}
			}
	
			// hover off a tile
			this.editorHoverOff = function(e) {
				$(this.xycursor.id).hide();
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
				var x1 = [parseInt(ids1[5]),parseInt(ids2[5])];
				var y1 = [parseInt(ids1[4]),parseInt(ids2[4])];
				x1.sort(function(a,b){return a - b});
				y1.sort(function(a,b){return a - b});
				for (y2=y1[0]; y2<=y1[1]; y2++) {
				for (x2=x1[0]; x2<=x1[1]; x2++) {
					var newEl = this.els.editor.floor[ids1[2]].active.row[y2].tile[x2].div;
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
			
			// unselect temp selected tiles
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
					if (parseInt(spl[4])<y) { y = parseInt(spl[4]); }
					if (parseInt(spl[5])<x) { x = parseInt(spl[5]); }
				}
				return {y:y,x:x};
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
				var d = this.dat.json.areas[this.id].tiles[this.floor];
				for (s=0; s<arr.length; s++) {
					var ids = arr[s].id.split("-");
					var graphics = d[ids[4]][ids[5]][0];
					newArr.push({x:parseInt(ids[5]),y:parseInt(ids[4]),tile:graphics});
				}
				return clipboardTable(newArr);
			}

			// copy selected tiles
			this.editorCopy = function() {
				var arr = this.editorCopySelected();
				// self.states.add({
					// vals:{arr:arr},
					// undo:function(){self.copyClear();},
					// redo:function(){self.copy(this.vals.arr);}
				// });
				this.copy(arr);	
			}

			// delete selected tiles
			this.editorDelete = function() {
				var rarr = this.editorCopySelected();
				var coords = this.getSelectedTopLeft();
				self.states.add({
					vals:{y:parseInt(coords.y),x:parseInt(coords.x),id:parseInt(this.id),floor:parseInt(this.floor),sarr:this.selected.slice(0),rarr:rarr.slice(0),id:parseInt(this.id),floor:parseInt(this.floor)},
					undo:function(){self.editorPasteAction(this.vals.id,this.vals.floor,this.vals.y,this.vals.x,this.vals.rarr);},
					redo:function(){self.editorDeleteAction(this.vals.id,this.vals.floor,this.vals.sarr);}
				});
				this.editorDeleteAction(this.id,this.floor,this.selected);
			}
			
			// paste tiles to location
			this.editorPaste = function(el) {
				var narr = this.editorCopyEls(this.previewTiles.earr);
				var spl = el.id.split("-");
				var y1 = parseInt(spl[4]);
				var x1 = parseInt(spl[5]);
				self.states.add({
					vals:{id:this.id,floor:this.floor,y:y1,x:x1,sarr:this.clipboard,narr:narr,darr:this.previewTiles.earr},
					undo:function(){self.editorDeleteAction(this.vals.id,this.vals.floor,this.vals.darr);self.editorPasteAction(this.vals.id,this.vals.floor,this.vals.y,this.vals.x,this.vals.narr);},
					redo:function(){self.editorPasteAction(this.vals.id,this.vals.floor,this.vals.y,this.vals.x,this.vals.sarr);}
				});
				this.editorPasteAction(this.id,this.floor,y1,x1,this.clipboard);
			}
			
			// preview paste drop
			this.previewTiles = {x:0,y:0,arr:[],earr:[]};
			this.editorClipPreview = function(el) {
				this.els.clipboard.style.display = 'none';
				var d = this.dat.json.areas[this.id].tiles[this.floor];
				var arr = this.clipboard;
				var spl = el.id.split("-");
				var y1 = parseInt(spl[4]);
				var x1 = parseInt(spl[5]);
				var sarr = [];
				var earr = [];
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					var y2 = parseInt(y+y1);
					var x2 = parseInt(x+x1);
					if (x2<d[0].length&&y2<d.length) {
						earr.push(document.getElementById(this.els.editor.floor[this.floor].active.row[y2].tile[x2].div.id));
						sarr.push({y:y2,x:x2,tile:d[y2][x2][0]});
						if (arr[y][x]) {
							this.editorSetGraphics(this.floor,y2,x2,arr[y][x]);
						}
					}
				}
				}
				this.previewTiles.y = y1;
				this.previewTiles.x = x1;
				this.previewTiles.arr = clipboardTable(sarr);
				this.previewTiles.earr = earr;
			}
			
			// preview paste drop cancel
			this.editorClipPreviewCancel = function() {
				var arr = this.previewTiles.arr;
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					this.editorSetGraphics(this.floor,parseInt(y+this.previewTiles.y),parseInt(x+this.previewTiles.x),arr[y][x]);
				}
				}
				this.els.clipboard.style.display = 'block';
			}
			
			// set actions for tiles
			this.editorSetAction = function(id,additional) {
				var current = this.getCurrentActions();
				self.states.add({
					vals:{id:this.id,floor:this.floor,arr:this.selected,aid:id,current:current,additional:additional},
					undo:function(){self.resetActions(this.vals.id,this.vals.floor,this.vals.arr,this.vals.current);},
					redo:function(){self.editorSetActionAction(this.vals.id,this.vals.floor,this.vals.arr,this.vals.aid,this.vals.additional);}
				});
				this.editorSetActionAction(this.id,this.floor,this.selected,id,additional);
			}
			
			// get current action tiles
			this.getCurrentActions = function() {
				var arr = [];
				var d = this.dat.json.areas[this.id].tiles[this.floor];
				for (i=0; i<this.selected.length; i++) {
					var spl = this.selected[i].id.split("-");
					var d2 = d[spl[4]][spl[5]][1];
					arr.push(d2);
				}
				return arr;
			}
			
	
	// editor manipulation actions
	//////////

			// delete tiles action
			this.editorDeleteAction = function(id,z,arr) {
				var d = this.dat.json.areas[id].tiles[z];
				for (s=0; s<arr.length; s++) {
					var ids = arr[s].id.split("-");
					d[ids[4]][ids[5]][0] = null;
					this.editorSetGraphics(this.floor,ids[4],ids[5],null);
				}
				this.editorUnselectAction(this.selected);
			}
	
			// paste tiles action
			this.editorPasteAction = function(id,floor,y1,x1,arr) {
				this.drawTrigger = true;
				var d = this.dat.json.areas[id].tiles[floor];
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					var y2 = parseInt(y+y1);
					var x2 = parseInt(x+x1);
					if (arr[y][x]&&x2<d[0].length&&y2<d.length) {
						this.editorSetGraphics(floor,y2,x2,arr[y][x]);
						d[y2][x2][0] = arr[y][x];
					}
				}
				}
				this.previewTiles = {x:0,y:0,arr:[],earr:[]};
			}
			
			// set array of action tiles
			this.resetActions = function(id,floor,tiles,actions) {
				for (i=0; i<tiles.length; i++) {
					this.editorSetActionAction(id,floor,[tiles[i]],actions[i][0],actions[i][1]);
				}
			}
			
			// set tile action action
			this.editorSetActionAction = function(id,z,arr,aid,additional) {
				var d = this.dat.json.areas[id].tiles[z];
				for (s=0; s<arr.length; s++) {
					var ids = arr[s].id.split("-");
					d[ids[4]][ids[5]][1] = [aid,additional];
					this.editorSetActionTileImg(z,ids[4],ids[5],aid)
				}
				this.editorUnselectAction(this.selected);
			}


			
			
// CONTEXT MENU
//////////
			
			// context menu build
			this.els.context = {};
			this.els.context.div = document.createElement("div");
			this.els.context.div.id = this.els.div.id+'-menu-context';
			this.els.context.div.className = 'contextmenu';
			$(this.els.div.id).addChild(this.els.context.div);
			
			// context menu copy
			this.els.context.copy = document.createElement("div");
			this.els.context.copy.id = this.els.context.div.id+'-copy';
			this.els.context.copy.innerHTML = 'Copy';
			this.els.context.copy.className = 'menuItem';
			$(this.els.context.div.id).addChild(this.els.context.copy);
			$(this.els.context.copy.id).click(function(){
				self.contextMenuClose();
				self.editorCopy();
			});
			
			// context menu delete
			this.els.context.del = document.createElement("div");
			this.els.context.del.id = this.els.context.div.id+'-del';
			this.els.context.del.innerHTML = 'Delete';
			this.els.context.del.className = 'menuItem';
			$(this.els.context.div.id).addChild(this.els.context.del);
			$(this.els.context.del.id).click(function(){
				self.contextMenuClose();
				self.editorDelete();
			});
			
			// context menu cut
			this.els.context.cut = document.createElement("div");
			this.els.context.cut.id = this.els.context.div.id+'-cut';
			this.els.context.cut.innerHTML = 'Cut';
			this.els.context.cut.className = 'menuItem';
			$(this.els.context.div.id).addChild(this.els.context.cut);
			$(this.els.context.cut.id).click(function(){
				self.contextMenuClose();
				self.editorCopy();
				self.editorDelete();
			});
			
			// context menu unselect
			this.els.context.unselect = document.createElement("div");
			this.els.context.unselect.id = this.els.context.div.id+'-unselect';
			this.els.context.unselect.innerHTML = 'Unselect';
			this.els.context.unselect.className = 'menuItem';
			$(this.els.context.div.id).addChild(this.els.context.unselect);
			$(this.els.context.unselect.id).click(function(){
				self.contextMenuClose();
				self.editorClearSelect();
			});
			
			// context menu insert
			this.els.context.insert = document.createElement("div");
			this.els.context.insert.id = this.els.context.div.id+'-insert';
			this.els.context.insert.innerHTML = 'Insert tile';
			this.els.context.insert.className = 'menuItem';
			$(this.els.context.div.id).addChild(this.els.context.insert);
			$(this.els.context.insert.id).click(function(e){
				self.openInsertMenu(e);
				self.contextMenuClose();
			});
			
			// context menu action
			this.els.context.action = document.createElement("div");
			this.els.context.action.id = this.els.context.div.id+'-action';
			this.els.context.action.innerHTML = 'Set tile action';
			this.els.context.action.className = 'menuItem';
			$(this.els.context.div.id).addChild(this.els.context.action);
			$(this.els.context.action.id).click(function(e){
				self.actionMenuOpen(e);
				self.contextMenuClose();
			});
			
			// context menu open
			this.contextMenuOpen = function(e) {
				if (this.selected.length==0) {
					this.editorAddSelectAction([e.target]);
				}
				var x = parseInt(mouseX(e)+5);
				var y = parseInt(mouseY(e)+5);
				this.els.context.div.style.left = x+'px';
				this.els.context.div.style.top = y+'px';
				$(this.els.context.div.id).show();
			}
			
			// context menu close
			this.contextMenuClose = function() {
				$(this.els.context.div.id).hide();
			}
			$(this.els.context.div.id).clickOff(function(){
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
				var d = this.dat.json.tiles;
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
				this.buildInsertGallery(this.insertId);
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
			this.els.insert.gallery.div.className = 'canvas scroll';
			$(this.els.insert.div.id).addChild(this.els.insert.gallery.div);
			
			// build insert gallery
			this.buildInsertGallery = function(id) {
				$(this.els.insert.gallery.div.id).clearChildren();
				
				this.els.insert.gallery.graphics = document.createElement("div");
				this.els.insert.gallery.graphics.id = this.els.insert.gallery.div.id+'-graphics';
				this.els.insert.gallery.graphics.className = 'frame';				
				$(this.els.insert.gallery.div.id).addChild(this.els.insert.gallery.graphics);
				
				this.els.insert.gallery.actions = document.createElement("div");
				this.els.insert.gallery.actions.id = this.els.insert.gallery.div.id+'-actions';
				this.els.insert.gallery.actions.className = 'frame';
				$(this.els.insert.gallery.div.id).addChild(this.els.insert.gallery.actions);
				
				var d = this.dat.json.tiles[id].tileIds[0];
				for (i=0; i<d.length; i++) {
				
					var el1 = document.createElement("b");
					el1.id = this.els.insert.gallery.graphics.id+'-'+i;
					$(this.els.insert.gallery.graphics.id).addChild(el1);
					this.buildInsertGalleryGraphics(d,i);
					
					var el2 = document.createElement("b");
					el2.id = this.els.insert.gallery.actions.id+'-'+i;
					el2.className = 'interactive';
					$(this.els.insert.gallery.actions.id).addChild(el2);
					$(el2.id).click(function(){
						self.insertTiles(event.target.id);
					});
					
				}
			}
			
			// build graphics tiles for insert gallery
			this.buildInsertGalleryGraphics = function(d,i) {
				if(d[i]) {
					for (j=0; j<d[i].length; j++) {
						var el2 = document.createElement("span");
						if(d[i][j]) {
							el2.className = 'subtile tile-'+d[i][j][0];
							var y1 = -parseInt(d[i][j][1])*8
							var x1 = -parseInt(d[i][j][2])*8
							el2.style.backgroundPosition = x1+'px '+y1+'px';
						}
						$(this.els.insert.gallery.graphics.id+'-'+i).addChild(el2);
					}
				}
			}
			this.buildInsertGallery(0);
			
			// insert tiles
			this.insertTiles = function(el) {
				var id = parseInt(el.split('-')[5]);
				var row = this.els.insert.select.value;
				var rarr = this.editorCopySelected();
				var coords = this.getSelectedTopLeft();
				self.states.add({
					vals:{y:parseInt(coords.y),x:parseInt(coords.x),id:parseInt(this.id),floor:parseInt(this.floor),sarr:this.selected.slice(0),rarr:rarr.slice(0),trow:row,tid:id},
					undo:function(){self.editorPasteAction(this.vals.id,this.vals.floor,this.vals.y,this.vals.x,this.vals.rarr);},
					redo:function(){self.insertTilesAction(this.vals.id,this.vals.floor,this.vals.sarr,this.vals.trow,this.vals.tid);}
				});
				this.insertTilesAction(this.id,this.floor,this.selected,row,id);
			}
			
			// insert tiles action
			this.insertTilesAction = function(id,floor,els,trow,tid) {
				var d = this.dat.json.areas[id].tiles[floor];
				if (0<els.length) {
					for (i=0; i<els.length; i++) {
						var spl = els[i].id.split('-');
						d[spl[4]][spl[5]][0] = [trow,tid];
						this.editorSetGraphics(floor,spl[4],spl[5],[trow,tid]);
					}
				}
				this.closeInsertMenu();
			}


// ATION MENU
//////////


			// action menu build
			this.contextActionActive = false;
			this.els.action = {};
			this.els.action.div = document.createElement("div");
			this.els.action.div.id = this.els.div.id+'-menu-action';
			this.els.action.div.className = 'contextmenu';
			$(this.els.div.id).addChild(this.els.action.div);
			
			// options
			this.els.action.menu = [];
			this.buildActionMenu = function() {
				var d = this.dat.json.actions;
				for (i=0; i<d.length; i++) {
					this.els.action.menu[i] = document.createElement("img");
					this.els.action.menu[i].id = this.els.action.div.id+'-'+i;
					this.els.action.menu[i].className = 'menuTile';
					this.els.action.menu[i].src = 'images/'+d[i].icon;
					this.els.action.menu[i].title = d[i].name;
					$(this.els.action.div.id).addChild(this.els.action.menu[i]);
					$(this.els.action.menu[i].id).click(function(){
						self.actionMenuClose();
						var id = event.target.id.split("-")[3];
						if (id==1) {
							self.teleportMenuOpen(event);
						} else {
							self.editorSetAction(id);
						}
					});
				}
			}
			this.buildActionMenu();
			
			// action menu open
			this.actionMenuOpen = function(e) {
				this.contextActionActive = true;
				var x = parseInt(mouseX(e)+5);
				var y = parseInt(mouseY(e)-30);
				this.els.action.div.style.left = x+'px';
				this.els.action.div.style.top = y+'px';
				$(this.els.action.div.id).show();
			}
			
			// action menu close
			this.actionMenuClose = function() {
				$(this.els.action.div.id).hide();
			}
			$(this.els.action.div.id).clickOff(function(){
				if (self.contextActionActive) {
					self.contextActionActive = false;
				} else {
					self.actionMenuClose();
				}
			});

			
// TELEPORT MENU
//////////


			// teleport menu build
			this.contextTeleportActive = false;
			this.els.teleport = {};
			this.els.teleport.div = document.createElement("div");
			this.els.teleport.div.id = this.els.div.id+'-menu-teleport';
			this.els.teleport.div.className = 'contextmenu';
			$(this.els.div.id).addChild(this.els.teleport.div);
			
			// area select
			this.els.teleport.areaLabel = document.createElement("label");
			this.els.teleport.areaLabel.innerHTML = 'Area';
			$(this.els.teleport.div.id).addChild(this.els.teleport.areaLabel);
			this.els.teleport.area = document.createElement("select");
			this.els.teleport.area.id = this.els.teleport.div.id+'-area';
			$(this.els.teleport.div.id).addChild(this.els.teleport.area);
			$(this.els.teleport.area.id).change(function(){
				self.buildTeleportXYZ();
			});
			
			// clear div
			$(this.els.teleport.div.id).addClearDiv();
			
			// coords select
			this.els.teleport.xyLabel = document.createElement("label");
			this.els.teleport.xyLabel.innerHTML = 'Coords';
			$(this.els.teleport.div.id).addChild(this.els.teleport.xyLabel);
			this.els.teleport.x = document.createElement("select");
			this.els.teleport.x.id = this.els.teleport.div.id+'-x';
			$(this.els.teleport.div.id).addChild(this.els.teleport.x);
			this.els.teleport.y = document.createElement("select");
			this.els.teleport.y.id = this.els.teleport.div.id+'-y';
			$(this.els.teleport.div.id).addChild(this.els.teleport.y);		
			
			// clear div
			$(this.els.teleport.div.id).addClearDiv();
			
			// floor select
			this.els.teleport.zLabel = document.createElement("label");
			this.els.teleport.zLabel.innerHTML = 'Floor';
			$(this.els.teleport.div.id).addChild(this.els.teleport.zLabel);
			this.els.teleport.z = document.createElement("select");
			this.els.teleport.z.id = this.els.teleport.div.id+'-z';
			$(this.els.teleport.div.id).addChild(this.els.teleport.z);
			
			// clear div
			$(this.els.teleport.div.id).addClearDiv();
			
			// save button
			this.els.teleport.save = document.createElement("ul");
			this.els.teleport.save.id = this.els.teleport.div.id+'-save';
			this.els.teleport.save.className = 'buttons';
			this.els.teleport.save.innerHTML = '<li>Apply</li>';
			$(this.els.teleport.div.id).addChild(this.els.teleport.save);
			$(this.els.teleport.save.id).click(function(){
				self.setTeleportTiles();
			});
			
			// build area select
			this.buildTeleportArea = function() {
				$(this.els.teleport.area.id).clearChildren();
				var d = this.dat.json.areas;
				for (i=0; i<d.length; i++) {
					var el = document.createElement("option");
					el.value = i;
					el.innerHTML = d[i].name;
					$(this.els.teleport.area.id).addChild(el);
				}
				this.els.teleport.area.value = this.id;
				this.buildTeleportXYZ();
			}
			
			// build a x select
			this.buildTeleportXYZ = function() {
				$(this.els.teleport.x.id).clearChildren();
				$(this.els.teleport.y.id).clearChildren();
				$(this.els.teleport.z.id).clearChildren();
				var id = this.els.teleport.area.value;
				var d = this.dat.json.areas[id].tiles;
				for (z=0; z<d.length; z++) {
					var el = document.createElement("option");
					el.value = z;
					el.innerHTML = z;
					$(this.els.teleport.z.id).addChild(el);
				}
				for (y=0; y<d[0].length; y++) {
					var el = document.createElement("option");
					el.value = y;
					el.innerHTML = y;
					$(this.els.teleport.y.id).addChild(el);
				}
				for (x=0; x<d[0][0].length; x++) {
					var el = document.createElement("option");
					el.value = x;
					el.innerHTML = x;
					$(this.els.teleport.x.id).addChild(el);
				}
			}
			
			// initialise
			this.buildTeleportArea();
			
			// teleport menu open
			this.teleportMenuOpen = function(e) {
				this.contextTeleportActive = true;
				var x = parseInt(mouseX(e)+5);
				var y = parseInt(mouseY(e)-30);
				this.els.teleport.div.style.left = x+'px';
				this.els.teleport.div.style.top = y+'px';
				$(this.els.teleport.div.id).show();
			}
			
			// teleport menu close
			this.teleportMenuClose = function() {
				$(this.els.teleport.div.id).hide();
			}
			$(this.els.teleport.div.id).clickOff(function(){
				if (self.contextTeleportActive) {
					self.contextTeleportActive = false;
				} else {
					self.teleportMenuClose();
				}
			});
			
			// set the teleport tiles
			this.setTeleportTiles = function() {
				var obj = {};
				obj.area = this.els.teleport.area.value;
				obj.z = this.els.teleport.z.value;
				obj.y = this.els.teleport.y.value;
				obj.x = this.els.teleport.x.value;
				this.editorSetAction(1,obj);
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
			
	
	// action buttons
	//////////
	
			// build
			this.els.panel.actions = {};
			this.els.panel.actions.ul = document.createElement("ul");
			this.els.panel.actions.ul.id = this.els.panel.div.id+'-actions';
			this.els.panel.actions.ul.className = 'buttons';
			$(this.els.panel.div.id).addChild(this.els.panel.actions.ul);
			
			// copy
			this.els.panel.actions.copy = document.createElement("li");
			this.els.panel.actions.copy.id = this.els.panel.actions.ul.id+'-copy';
			this.els.panel.actions.copy.className = 'button';
			this.els.panel.actions.copy.innerHTML = '<img src="images/icon-copy.png" alt="">';			
			this.els.panel.actions.copy.title = 'Copy selected tiles';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.copy);
			$(this.els.panel.actions.copy.id).click(function(){
				self.editorCopy();
			});
			
			// cut
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
			
			// delete
			this.els.panel.actions.del = document.createElement("li");
			this.els.panel.actions.del.id = this.els.panel.actions.ul.id+'-del';
			this.els.panel.actions.del.className = 'button';
			this.els.panel.actions.del.innerHTML = '<img src="images/icon-delete.png" alt="">';			
			this.els.panel.actions.del.title = 'Delete selected tiles';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.del);
			$(this.els.panel.actions.del.id).click(function(){
				self.editorDelete();
			});
			
			// unselect
			this.els.panel.actions.unselect = document.createElement("li");
			this.els.panel.actions.unselect.id = this.els.panel.actions.ul.id+'-unselect';
			this.els.panel.actions.unselect.className = 'button';
			this.els.panel.actions.unselect.innerHTML = '<img src="images/icon-unselect.png" alt="">';			
			this.els.panel.actions.unselect.title = 'Unselect selected tiles';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.unselect);
			$(this.els.panel.actions.unselect.id).click(function(){
				self.editorClearSelect();
			});
			
			//  insert
			this.els.panel.actions.insert = document.createElement("li");
			this.els.panel.actions.insert.id = this.els.panel.actions.ul.id+'-insert';
			this.els.panel.actions.insert.className = 'button';
			this.els.panel.actions.insert.innerHTML = '<img src="images/icon-insert.png" alt="">';			
			this.els.panel.actions.insert.title = 'Insert a tile';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.insert);
			$(this.els.panel.actions.insert.id).click(function(e){
				self.openInsertMenu(e);
			});
			
			//  insert
			this.els.panel.actions.action = document.createElement("li");
			this.els.panel.actions.action.id = this.els.panel.actions.ul.id+'-action';
			this.els.panel.actions.action.className = 'button';
			this.els.panel.actions.action.innerHTML = '<img src="images/icon-action.png" alt="">';			
			this.els.panel.actions.action.title = 'Set tile action';
			$(this.els.panel.actions.ul.id).addChild(this.els.panel.actions.action);
			$(this.els.panel.actions.action.id).click(function(e){
				self.actionMenuOpen(e);
			});
		

	// floors
	//////////
		
			// setup
			this.floor = 0;
			this.els.panel.floor = {};
			this.els.panel.floor.ul = document.createElement("ul");
			this.els.panel.floor.ul.id = this.els.panel.div.id+'-floor';
			this.els.panel.floor.ul.className = 'buttons';
			$(this.els.panel.div.id).addChild(this.els.panel.floor.ul);
			this.els.panel.floor.li = [];
		
			// build
			this.buildFloorButtons = function() {
				$(this.els.panel.floor.ul.id).clearChildren();
				this.els.panel.floor.li = [];
				var d = this.dat.json.areas[this.id].tiles;
				for (j=0; j<d.length; j++) {
					this.els.panel.floor.li[j] = document.createElement("li");
					this.els.panel.floor.li[j].id = this.els.panel.floor.ul.id+'-f-'+j;
					this.els.panel.floor.li[j].innerHTML = 'F'+parseInt(j+1);
					this.els.panel.floor.li[j].title = 'Edit floor '+parseInt(j+1);
					$(this.els.panel.floor.ul.id).addChild(this.els.panel.floor.li[j]);
					$(this.els.panel.floor.li[j].id).click(function(){
						self.editorButtonFloorPress(event);
					});
				}
				this.els.panel.floor.add = document.createElement("li");
				this.els.panel.floor.add.id = this.els.panel.floor.ul.id+'-add';
				this.els.panel.floor.add.innerHTML = '<img src="images/icon-add.png" alt="">';
				this.els.panel.floor.add.title = 'Add floor';
				$(this.els.panel.floor.ul.id).addChild(this.els.panel.floor.add);
				$(this.els.panel.floor.add.id).click(function(){
					self.editorAddFloor();
				});
				this.els.panel.floor.del = document.createElement("li");
				this.els.panel.floor.del.id = this.els.panel.floor.ul.id+'-del';
				this.els.panel.floor.del.innerHTML = '<img src="images/icon-delete.png" alt="">';
				this.els.panel.floor.del.title = 'Remove current floor';
				$(this.els.panel.floor.ul.id).addChild(this.els.panel.floor.del);
				$(this.els.panel.floor.del.id).click(function(){
					var d = self.dat.json.areas[self.id].tiles;
					if (1<d.length) {
						var c = confirm('Delete this floor?');
						if (c) {
							self.editorRemoveFloor(event);
						}
					} else {
						alert('Cannot delete only floor.');
					}
				});				
				this.editorFloorShowAction(this.floor);
			}
			
			// click
			this.editorButtonFloorPress = function(e) {
				var el = e.srcElement.id;
				var f = el.split("-")[5];
				self.editorFloorShow(f);
			}
			
			// show a floor
			this.editorFloorShow = function(f) {
				self.states.add({
					vals:{nfloor:f,sfloor:this.floor},
					undo:function(){self.editorFloorShowAction(this.vals.sfloor);},
					redo:function(){self.editorFloorShowAction(this.vals.nfloor);}
				});				
				this.editorFloorShowAction(f);
			}
			
			// show a floor action
			this.editorFloorShowAction = function(f) {
				this.floor = f;
				var d = self.dat.json.areas[self.id].tiles;
				for (i=0; i<d.length; i++) {
					self.els.panel.floor.li[i].className = '';
					if (i<f) {
						self.els.editor.floor[i].div.style.opacity = '0.5';
						$(self.els.editor.floor[i].div.id).show();
					} else {
						$(self.els.editor.floor[i].div.id).hide();
					}
				}
				self.els.panel.floor.li[f].className = 'selected';
				self.els.editor.floor[f].div.style.opacity = '1';
				$(self.els.editor.floor[f].div.id).show();
			}

			// add a floor
			this.editorAddFloor = function() {
				var d = this.dat.json.areas[this.id].tiles;
				if (d.length<4) {
					self.states.add({
						vals:{id:this.id,floor:d.length,go:this.floor},
						undo:function(){self.editorRemoveFloorAction(this.vals.id,this.vals.floor,this.vals.go);},
						redo:function(){self.editorAddFloorAction(this.vals.id);}
					});
					this.editorAddFloorAction(this.id);
				} else {
					alert('Floors limited to 4');
				}
			}
			
			// add a floor action
			this.editorAddFloorAction = function(id,arr) {
				var d = this.dat.json.areas[id].tiles;
				if (arr) {
					d.push(arr);
				} else {
					var w = d[0][0].length;
					var h = d[0].length;
					var obj = [];
					for (y=0; y<h; y++) {
						obj[y] = [];
						for (x=0; x<w; x++) {
							obj[y][x] = [null,[0]];
						}
					}
					d.push(obj);
				}
				this.setId(this.id);
				this.editorFloorShowAction(parseInt(d.length-1));
			}
			
			// remove a floor
			this.editorRemoveFloor = function(e) {
				var d = this.dat.json.areas[this.id].tiles;
				self.states.add({
					vals:{id:this.id,floor:d.length,arr:d[this.floor]},
					undo:function(){self.editorAddFloorAction(this.vals.id,this.vals.arr);},
					redo:function(){self.editorRemoveFloorAction(this.vals.id,this.vals.floor,0);}
				});
				this.editorRemoveFloorAction(this.id,parseInt(d.length-1),0);
			}
			
			// remove a floor action
			this.editorRemoveFloorAction = function(id,floor,go) {
				var d = this.dat.json.areas[id].tiles;
				d.splice(floor,1);
				this.floor = go;
				this.setId(id);
			}
	
	
	// animation
	//////////
	
			// vals
			this.animate = false;
			this.animateFrame = 0;
			
			// element setup
			this.els.panel.animate = {};
			this.els.panel.animate.ul = document.createElement("ul");
			this.els.panel.animate.ul.id = this.els.panel.div.id+'-animate';
			this.els.panel.animate.ul.className = 'buttons';
			$(this.els.panel.div.id).addChild(this.els.panel.animate.ul);
			
			// play button
			this.els.panel.animate.play = document.createElement("li");
			this.els.panel.animate.play.id = this.els.panel.animate.ul.id+'-play';
			this.els.panel.animate.play.innerHTML = '<img src="images/icon-animate.png" alt="">';
			this.els.panel.animate.play.title = 'Play tile animation';
			$(this.els.panel.animate.ul.id).addChild(this.els.panel.animate.play);
			
			// button press
			$(this.els.panel.animate.play.id).click(function(){
				if (self.animate) {
					self.animateStop();
				} else {
					self.animateGo();
				}
			});
			
			// start animation
			this.animateGo = function() {
				self.els.panel.animate.play.className = 'selected';
				self.animate = true;
			}
			
			// stop animation
			this.animateStop = function() {
				self.els.panel.animate.play.className = '';
				self.animate = false;
				self.editorFrameShow(0);
			}
			
			// check if animation has been triggered
			runEveryFrame(function(){
				if (self.animate) {
					self.editorFrameShow(self.animateFrame);
					$(self.els.editor.floor[self.floor].frames[0].div.id).show();
					if (self.animateFrame<(self.dat.json.tiles[self.id].tileIds.length-1)) {
						self.animateFrame++;
					} else {
						self.animateFrame = 0;
					}
				}
			});
			
			// show an animation frame
			this.editorFrameShow = function(f) {
				var d = self.dat.json.tiles[self.id].tileIds;
				for (f1=0; f1<d.length; f1++) {
					$(self.els.editor.floor[self.floor].frames[f1].div.id).hide();
				}
				$(self.els.editor.floor[self.floor].frames[f].div.id).show();
			}
			
			
	// clear editor panel divs
	//////////		

			$(this.els.panel.div.id).addClearDiv();

			
// CLIPBOARD
//////////
			
			// setup
			this.clipboard = null;
			this.clipboardActive = false;
			this.els.clipboard = document.createElement("div");
			this.els.clipboard.id = this.els.div.id+'-clipboard';
			this.els.clipboard.className = 'canvas mouse';
			$(this.els.div.id).addChild(this.els.clipboard);
			$(this.els.clipboard.id).mouseMove();
			
			// copy an array of tiles to the clipboard
			this.copy = function(arr) {
				this.clipboard = arr;
				this.clipboardActive = true;
				$(this.els.clipboard.id).clearChildren();
				var newWidth = parseInt(arr[0].length*16);
				$(this.els.clipboard.id).width(newWidth);
				for (y=0; y<arr.length; y++) {
				for (x=0; x<arr[y].length; x++) {
					var d = arr[y][x];
					var el = document.createElement("b");
					el.id = this.els.clipboard.id+'-'+y+'-'+x;
					$(this.els.clipboard.id).addChild(el);
					this.copySpans(d,el);
				}
				}
			}
			
			// build graphic span classes for the clipboard div
			this.copySpans = function(d,el) {
				if (d) {
					var d2 = this.dat.json.tiles[d[0]].tileIds[0][d[1]];
					for (i=0; i<d2.length; i++) {
						var el2 = document.createElement("span");
						el2.className = 'subtile tile-'+d2[i][0];
						var posY = -parseInt(d2[i][1])*8;
						var posX = -parseInt(d2[i][2])*8;
						el2.style.backgroundPosition = posX+'px '+posY+'px';
						$(el.id).addChild(el2);
					}
				}
			}
			
			// clear on click off editor
			$(this.els.control.select.id).clickOff(function(e){
				var id = e.target.id;
				var spl = id.split("-");
				var ch = spl[1]+'-'+spl[2]+'-'+spl[3]+'-'+spl[4];
				if (self.clipboard&&!self.clipboardActive&&ch!='editor-panel-floor-f') {
					self.copyClear();
				}
			});
			
			// clear clipboard
			this.copyClear = function() {
				$(this.els.clipboard.id).clearChildren();
				this.clipboard = null;
			}
			
			
			
			//////////
			// set default tileset
			this.setId(id,true);
		
		}