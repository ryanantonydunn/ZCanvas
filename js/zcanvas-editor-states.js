// ZCANVAS
// EDITOR
// STATES
//////////	

		function zc_editor_states(dat) {
			var self = this;
			this.state = 0;
			this.dat = dat;
			this.arr = [];
			this.els = {};
			
			
// BUTTONS
//////////
			
			// undo
			this.els.undo = document.createElement("li");
			this.els.undo.id = 'zc_editor_states-undo';
			this.els.undo.title = 'Undo';
			
			// disable undo
			this.undoDisable = function() {
				this.els.undo.className = 'disabled';
				this.els.undo.innerHTML = '<img src="images/icon-undo-disabled.png">';
			}
			this.undoDisable();
			
			// enable undo
			this.undoEnable = function() {
				this.els.undo.className = '';
				this.els.undo.innerHTML = '<img src="images/icon-undo.png">';
			}
			
			// redo
			this.els.redo = document.createElement("li");
			this.els.redo.id = 'zc_editor_states-redo';
			this.els.redo.title = 'Redo';
			
			// disable redo
			this.redoDisable = function() {
				this.els.redo.className = 'disabled';
				this.els.redo.innerHTML = '<img src="images/icon-redo-disabled.png">';
			}
			this.redoDisable();
		
			// enable redo
			this.redoEnable = function() {
				this.els.redo.className = '';
				this.els.redo.innerHTML = '<img src="images/icon-redo.png">';
			}

			
// MANAGING STATES
//////////
			
			// add new state
			this.add = function(obj) {
				this.undoEnable();
				this.arr[this.state] = obj;
				if (40<this.state) {
					this.arr.splice(0,1);
				} else {
					this.state++;
				}

			}
			
			// step back a state
			this.undo = function() {
				if (0<this.state) {
					this.redoEnable();
					this.arr[(this.state-1)].undo();
					this.state--;
					if (this.state==0) {
						this.undoDisable();
					}
				}
			}
			
			// step forward a state
			this.redo = function() {
				if (this.state<this.arr.length) {
					this.undoEnable();
					this.arr[this.state].redo();
					this.state++;
					if (this.state==this.arr.length) {
						this.redoDisable();
					}
				}
			}
			
		}