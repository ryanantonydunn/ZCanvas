// ZCANVAS
// EDITOR
// GRAPHICS
//////////		
		
		function zc_editor_graphics(row,states,dat) {
			var self = this;
			this.states = states;
			this.dat = dat;
			this.row = 0;
			this.els = {};
			this.rows = 32;
			this.cols = 16;
	
	
// CONTROLS
///////////
	
	// change the current row
	//////////
			
			this.setRow = function(row) {
				this.row = row;
				this.els.control.select.value = row;
			}
			
			
	// set up main divs
	//////////
			
			// set up main div
			this.els.div = document.createElement("div");
			this.els.div.id = 'zc_editor_graphics';
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
				self.hideUrlset();
				self.setRow(this.value);
			});
			
			// rebuild options
			this.buildSelect = function() {
				$(this.els.control.select.id).clearChildren();
				var d = this.dat.json.graphics;
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
				this.hideUrlset();
				this.els.buttons.rename.toggle.className = 'selected';
				this.els.control.rename.text.value = this.dat.json.graphics[this.row].name;
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
				var un = self.dat.json.graphics[self.row].name;
				var rn = self.els.control.rename.text.value;
				this.states.add({
					vals:{id:parseInt(self.row),uname:new String(un),rname:new String(rn)},
					undo:function(){self.actionRenameGraphics(this.vals.id,this.vals.uname);},
					redo:function(){self.actionRenameGraphics(this.vals.id,this.vals.rname);}
				});
				this.actionRenameGraphics(self.row,rn);
				this.hideRename();
			}


	// change url
	//////////

			// toggle value
			this.urlsetShow = false;
			
			// toggle button
			this.els.buttons.urlset = {};
			this.els.buttons.urlset.toggle = document.createElement("li");
			this.els.buttons.urlset.toggle.id = this.els.buttons.ul.id+'-urlset';
			this.els.buttons.urlset.toggle.innerHTML = '<img src="images/icon-link.png" alt="">';
			this.els.buttons.urlset.toggle.title = 'Change Image URL';
			$(this.els.buttons.ul.id).addChild(this.els.buttons.urlset.toggle);
			
			// toggle
			$(this.els.buttons.urlset.toggle.id).click(function(){
				if (self.urlsetShow) {
					self.hideUrlset();
				} else {
					self.showUrlset();
				}
			});
			
			// toggle show
			this.showUrlset = function() {
				this.hideAddnew();
				this.hideRename();
				this.els.buttons.urlset.toggle.className = 'selected';
				this.els.control.urlset.text.value = this.dat.json.graphics[this.row].filename;
				$(this.els.control.urlset.div.id).show();
				this.urlsetShow = true;
			}
			
			// toggle hide
			this.hideUrlset = function() {
				this.els.buttons.urlset.toggle.className = '';
				$(this.els.control.urlset.div.id).hide();
				this.urlsetShow = false;
			}
			
			// controls box
			this.els.control.urlset = {};
			this.els.control.urlset.div = document.createElement("div");
			this.els.control.urlset.div.id = this.els.control.div.id+'-urlset';
			$(this.els.control.div.id).addChild(this.els.control.urlset.div);
			
			this.els.control.urlset.text = document.createElement("input");
			$(this.els.control.urlset.div.id).addChild(this.els.control.urlset.text);
			
			this.els.control.urlset.save = document.createElement("ul");
			this.els.control.urlset.save.id = this.els.control.urlset.div.id+'-save';
			this.els.control.urlset.save.title = 'Save URL';
			this.els.control.urlset.save.className = 'buttons';
			this.els.control.urlset.save.innerHTML = '<li><img src="images/icon-save.png" alt=""></li>';
			$(this.els.control.urlset.div.id).addChild(this.els.control.urlset.save);	

			// hide controls box
			$(this.els.control.urlset.div.id).hide();			
			
			// save button
			$(this.els.control.urlset.save.id).click(function(){
				self.urlsetSave();
			});
			
			// save
			this.urlsetSave = function() {
				var uurl = self.dat.json.graphics[self.row].url;
				var rurl = self.els.control.urlset.text.value;
				this.states.add({
					vals:{id:parseInt(self.row),uurl:new String(uurl),rurl:new String(rurl)},
					undo:function(){self.actionSeturlGraphics(this.vals.id,this.vals.uurl);},
					redo:function(){self.actionSeturlGraphics(this.vals.id,this.vals.rurl);}
				});
				this.actionSeturlGraphics(self.row,rurl);
				this.hideUrlset();
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
				self.hideUrlset();
				if (1<self.dat.json.graphics.length) {
					var c = confirm('Delete the "'+self.dat.json.graphics[self.row].name+'" graphic set?');
					if (c) {
						self.deleteGraphics();
					}
				} else {
					alert('Last graphic set cannot be deleted');
				}
			});
			
			// delete
			this.deleteGraphics = function() {
				self.states.add({
					vals:{id:parseInt(self.row),arr:self.dat.json.graphics[self.row]},
					undo:function(){self.actionAddGraphics(this.vals.id,this.vals.arr);},
					redo:function(){self.actionDeleteGraphics(this.vals.id);}
				});
				this.actionDeleteGraphics(this.row);
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
				this.hideUrlset();
				this.els.buttons.addnew.toggle.className = 'selected';
				this.els.control.addnew.name.value = 'New Graphic Set';
				this.els.control.addnew.url.value = 'Image URL';
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
			
			this.els.control.addnew.name = document.createElement("input");
			$(this.els.control.addnew.div.id).addChild(this.els.control.addnew.name);
			
			this.els.control.addnew.url = document.createElement("input");
			$(this.els.control.addnew.div.id).addChild(this.els.control.addnew.url);
			
			this.els.control.addnew.save = document.createElement("ul");
			this.els.control.addnew.save.id = this.els.control.addnew.div.id+'-save';
			this.els.control.addnew.save.className = 'buttons';
			this.els.control.addnew.save.title = 'Save new graphic set';
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
				var len = this.dat.json.graphics.length;
				var obj = {};
				obj.name = this.els.control.addnew.name.value;
				obj.filename = this.els.control.addnew.url.value;
				self.states.add({
					vals:{i:parseInt(len),obj:obj.clone()},
					undo:function(){self.actionDeleteGraphics(this.vals.i);},
					redo:function(){self.actionAddGraphics(this.vals.i,this.vals.obj);}
				});
				this.actionAddGraphics(len,obj);
				this.hideAddnew();
			}
	

	// clear main divs
	//////////
	
			$(this.els.control.div.id).addClearDiv();
	

	// actions
	//////////
	
			// add
			this.actionAddGraphics = function(i,obj) {
				var arr = self.dat.json.graphics;
				arr.splice(i,0,obj);
				self.buildSelect();
				self.setRow(i);
			}
			
			// delete
			this.actionDeleteGraphics = function(i) {
				var arr = self.dat.json.graphics;
				arr.splice(i,1);
				self.buildSelect();
				self.setRow(0);
			}
			
			// replace
			this.actionReplaceGraphics = function(i,obj) {
				var arr = self.dat.json.graphics;
				arr.splice(i,1,obj);
				self.buildSelect();
				self.setRow(i);
			}
			
			// rename
			this.actionRenameGraphics = function(i,name) {
				self.dat.json.graphics[i].name = name;
				self.buildSelect();
				self.els.control.select.value = i;
			}
			
			// change url
			this.actionSeturlGraphics = function(i,url) {
				self.dat.json.graphics[i].filename = url;
			}

			
			// default row
			this.setRow(row);
			
		}