// ZCANVAS
// EDITOR
// FRAMEWORK
//////////

// MISCELLANEOUS FUNCTIONS
//////////

	// array management
	//////////

			// build a two dimensional array out of tiles
			function clipboardTable(arr) {
				var newArr = [[null]];
				var bounds = {};
				for (i=0; i<arr.length; i++) {
					var d = arr[i];
					if (i==0) {
						bounds = { top:d.y, bottom:d.y, left:d.x, right:d.x };
					}
					if (parseInt(d.x)<parseInt(bounds.left)) {
						var n = parseInt(bounds.left-d.x);
						newArr = tableAddColBefore(newArr,n);
						bounds.left = d.x;
					}
					if (parseInt(d.y)<parseInt(bounds.top)) {
						var n = parseInt(bounds.top-d.y);
						newArr = tableAddRowBefore(newArr,n);
						bounds.top = d.y;
					}
					if (parseInt(bounds.right)<parseInt(d.x)) {
						var n = parseInt(d.x-bounds.right);
						newArr = tableAddColAfter(newArr,n);
						bounds.right = d.x;
					}
					if (parseInt(bounds.bottom)<parseInt(d.y)) {
						var n = parseInt(d.y-bounds.bottom);
						newArr = tableAddRowAfter(newArr,n);
						bounds.bottom = d.y;
					}
					var newX = parseInt(d.x-bounds.left);
					var newY = parseInt(d.y-bounds.top);
					newArr[newY][newX] = d.tile;
				}
				return newArr;
			}
			
			// add a row to the end of a two dimensional array
			function tableAddRowAfter(arr,n) {
				for (i1=0; i1<n; i1++) {
					arr.push([]);
					for (i2=0; i2<arr[0].length; i2++) {
						arr[(arr.length-1)].push(null);
					}
				}
				return arr
			}
			
			// add a row to the beginning of a two dimensional array
			function tableAddRowBefore(arr,n) {
				arr.reverse();
				for (i1=0; i1<n; i1++) {
					arr.push([]);
					for (i2=0; i2<arr[0].length; i2++) {
						arr[(arr.length-1)].push(null);
					}
				}
				arr.reverse();
				return arr
			}
			
			// add a column to the end of a two dimensional array
			function tableAddColAfter(arr,n) {
				for (i1=0; i1<arr.length; i1++) {
					for (i2=0; i2<n; i2++) {
						arr[i1].push(null);
					}
				}
				return arr
			}
			
			// add a column to the beginning of a two dimensional array
			function tableAddColBefore(arr,n) {
				for (i1=0; i1<arr.length; i1++) {
					arr[i1].reverse();
					for (i2=0; i2<n; i2++) {
						arr[i1].push(null);
					}
					arr[i1].reverse();
				}
				return arr
			}


	// timed actions
	//////////
	
		
			// timed events
			var frameRunFunctions = [];
			function frameRun() {
				for (i1=0; i1<frameRunFunctions.length; i1++) {
					frameRunFunctions[i1]();
				}
			}
			setInterval(frameRun,1000/3);
			
			// add a timed event
			function runEveryFrame(func) {
				frameRunFunctions.push(func);
			}

			
	// clone an object
	//////////
			
			Object.prototype.clone = function() {
				var newObj = (this instanceof Array) ? [] : {};
				for (i in this) {
					if (i == 'clone') continue;
					if (this[i] && typeof this[i] == "object") {
						newObj[i] = this[i].clone();
					} else newObj[i] = this[i]
				} return newObj;
			};


// DOM FUNCTIONS
//////////
	
	// basic selecting
	//////////
		
			function $(id) {
				return new $el(id);
			}
			function $el(id){
				if (id==document) {
					this.el = document;
				} else {
					this.el = document.getElementById(id);
				}
			}
			$el.prototype.el = this.el;
	
	
	// events
	//////////
	
			// onchange
			$el.prototype.change = $elChange;
			function $elChange(func) {
				if (this.el.attachEvent) {
					this.el.attachEvent("change", func);
				} else if (this.el.addEventListener) {
					this.el.addEventListener("change", func, false);
				} else {
					this.el.onchange = func;
				}	
			}
		
			// click
			$el.prototype.click = $elClick;
			function $elClick(func) {
				if (this.el.attachEvent) {
					this.el.attachEvent("click", func);
				} else if (this.el.addEventListener) {
					this.el.addEventListener("click", func, false);
				} else {
					this.el.onclick = func;
				}	
			}

			// right click
			$el.prototype.rightClick = $elRightClick;
			function $elRightClick(func) {
				if (this.el.attachEvent) {
					this.el.attachEvent("contextmenu", func);
				} else if (this.el.addEventListener) {
					this.el.addEventListener("contextmenu", func, false);
				} else {
					this.el.oncontextmenu = func;
				}
			}
			function blockContextMenu(e) {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		
			// mousedown
			$el.prototype.mouseDown = $elMouseDown;
			function $elMouseDown(func) {
				if (this.el.attachEvent) {
					this.el.attachEvent("mousedown", func);
				} else if (this.el.addEventListener) {
					this.el.addEventListener("mousedown", func, false);
				} else {
					this.el.onmousedown = func;
				}	
			}
		
			// mouseup
			$el.prototype.mouseUp = $elMouseUp;
			function $elMouseUp(func) {
				if (this.el.attachEvent) {
					this.el.attachEvent("mouseup", func);
				} else if (this.el.addEventListener) {
					this.el.addEventListener("mouseup", func, false);
				} else {
					this.el.onmouseup = func;
				}	
			}
		
			// hover
			$el.prototype.hover = $elHover;
			function $elHover(func) {
				if (this.el.attachEvent) {
					this.el.attachEvent("mouseover", func);
				} else if (this.el.addEventListener) {
					this.el.addEventListener("mouseover", func, false);
				} else {
					this.el.onmouseover = func;
				}	
			}
		
			// hover off
			$el.prototype.hoverOff = $elHoverOff;
			function $elHoverOff(func) {
				if (this.el.attachEvent) {
					this.el.attachEvent("mouseout", func);
				} else if (this.el.addEventListener) {
					this.el.addEventListener("mouseout", func, false);
				} else {
					this.el.onmouseout = func;
				}	
			}
		
			// click anywhere but the element
			$el.prototype.clickOff = $elClickOff;
			function $elClickOff(func) {
				var self = this;
				this.func = func;
				this.id = this.el.id;
				$(document).click(function(e){
					var trigger = false;
					if (e.target.id) {
						var spl = e.target.id.split(self.id);
						if (1<spl.length) {
							trigger = true;
						}
					}
					if (!trigger) {
						self.func(e);
					}
				});
			}
			
			// resize window
			var resizeWindowFunctions = [];
			function resizeWindowEvent() {
				for (i1=0; i1<resizeWindowFunctions.length; i1++) {
					resizeWindowFunctions[i1]();
				}
			}
			window.onresize = resizeWindowEvent;
			
			// add a resize window event
			function resizeWindow(func) {
				resizeWindowFunctions.push(func);
			}

		
		
	// actions
	//////////
	
			// hide
			$el.prototype.hide = $elHide;
			function $elHide() {	
				this.el.style.display = 'none';
			}

			// show
			$el.prototype.show = $elShow;
			function $elShow() {	
				this.el.style.display = 'block';
			}
		
		
			// clear all child nodes
			$el.prototype.clearChildren = $elClearChildren;
			function $elClearChildren() {
				if (this.el.hasChildNodes()) {
					while (this.el.childNodes.length>0) {
						this.el.removeChild(this.el.firstChild);
					} 
				}
			}
			
			// add a node to an element
			$el.prototype.addChild = $elAddChild;
			function $elAddChild(child) {
				this.el.appendChild(child);
			}
		
			// add a clear both div to the end of an element
			$el.prototype.addClearDiv = $elAddClearDiv;
			function $elAddClearDiv() {
				var el = document.createElement("div");
				el.style.clear = 'both';
				this.el.appendChild(el);
			}
			
			// set width of an element
			$el.prototype.width = $elWidth;
			function $elWidth(newWidth) {
				this.el.style.width = newWidth+'px';
			}
			
			// add a class to an element
			$el.prototype.addClass = $elAddClass;
			function $elAddClass(clas) {
				var oldClass = this.el.className.split(" ");
				var newClass = '';
				for (i1=0; i1<oldClass.length; i1++) {
					newClass += oldClass[i1]+' ';
				}
				newClass += clas;
				this.el.className = newClass;
			}

			// remove a class from an element
			$el.prototype.removeClass = $elRemoveClass;
			function $elRemoveClass(clas) {
				var oldClass = this.el.className.split(" ");
				var newClass = '';
				for (i1=0; i1<oldClass.length; i1++) {
					if (oldClass[i1]!=clas) {
						newClass += oldClass[i1]+' ';
					}
				}
				newClass = newClass.slice(0,newClass.length-1);
				this.el.className = newClass;
			}
			
			// remove a class from all sub-elements
			$el.prototype.removeClassSub = $elRemoveClassSub;
			function $elRemoveClassSub(clas) {
				if (this.el.hasChildNodes()) {
					var ch = this.el.childNodes;
					for (i1=0; i1<ch.length; i1++) {
						if (ch[i1].id) {
							$(ch[i1].id).removeClass(clas);
						}
					}
				}
			}

		
	// mouse reaction
	//////////
			
			// make the element follow the mouse
			$el.prototype.mouseMove = $elMouseMove;
			function $elMouseMove() {
				mouseMoveElements.push(this.el.id);
			}
		
			// calculate mouse position
			function mouseX(e) {
				if (e.pageX) return e.pageX;
				if (e.clientX) return e.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft);
				return 0;
			}
			function mouseY(e) {
				if (e.pageY) return e.pageY;
				if (e.clientY) return e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
				return 0;
			}
		
			// mouse move events
			if (window.attachEvent) {
				window.attachEvent("mousemove", mouseMove);
			} else if (document.addEventListener) {
				document.addEventListener("mousemove", mouseMove, false);
			} else {
				document.onmousemove = mouseMove;
			}
			
			// function to run when the mouse moves
			var mouseMoveElements = [];
			var mouseMoveTrigger = false;
			function mouseMove(e) {
				if (!mouseMoveTrigger) {
					var x = parseInt(mouseX(e)+10);
					var y = parseInt(mouseY(e)+10);
					for (i1=0; i1<mouseMoveElements.length; i1++) {
						var el = document.getElementById(mouseMoveElements[i1]);
						el.style.left = x+'px';
						el.style.top = y+'px';
					}
				}
			}
		
		
	// button reaction
	//////////

			// button press functions
			var buttonCtrlUpArr = [];
			var buttonCtrlUp = function (func) {
				buttonCtrlUpArr.push(func);
			}
			var buttonAltUpArr = [];
			var buttonAltUp = function (func) {
				buttonAltUpArr.push(func);
			}
			var buttonCtrlDownArr = [];
			var buttonCtrlDown = function (func) {
				buttonCtrlDownArr.push(func);
			}
			var buttonAltDownArr = [];
			var buttonAltDown = function (func) {
				buttonAltDownArr.push(func);
			}
		
			// button presses
			var buttonMouse = false;
			var buttonCtrl = false;
			var buttonAlt = false;
			function buttonDown(e) {
				if (e.which==18) {
					buttonAlt = true;
					for (i=0; i<buttonAltDownArr.length; i++) {
						buttonAltDownArr[i]();
					}
				}	
				if (e.which==17) {
					buttonCtrl = true;
					for (i=0; i<buttonCtrlDownArr.length; i++) {
						buttonCtrlDownArr[i]();
					}
				}
			}
			function buttonUp(e) {
				if (e.which==18) {
					buttonAlt = false;
					for (i=0; i<buttonAltUpArr.length; i++) {
						buttonAltUpArr[i]();
					}
				}	
				if (e.which==17) {
					buttonCtrl = false;
					for (i=0; i<buttonCtrlUpArr.length; i++) {
						buttonCtrlUpArr[i]();
					}
				}	
			}
			function mouseDown(e) {
				if (e.which==1) {
					buttonMouse = true;
				}
			}
			function mouseUp(e) {
				if (e.which==1) {
					buttonMouse = false;
				}
			}
			if (document.attachEvent) {
				document.attachEvent("keydown", buttonDown);
				document.attachEvent("keyup", buttonUp);
				document.attachEvent("mousedown", mouseDown);
				document.attachEvent("mouseup", mouseUp);
			} else if (document.addEventListener) {
				document.addEventListener("keydown", buttonDown, false);
				document.addEventListener("keyup", buttonUp, false);
				document.addEventListener("mousedown", mouseDown, false);
				document.addEventListener("mouseup", mouseUp, false);
			} else {
				document.onkeydown = buttonDown;
				document.onkeyup = buttonUp;
				document.onmousedown = mouseDown;
				document.onmouseup = mouseUp;
			}
			
	// scrollbars
	//////////

			// get scrollbar width
			var scrollBarWidth = 17;
			var setScrollBarWidth = function() {
				document.body.style.overflow = 'hidden';
				var scrollWidth = document.body.clientWidth;
				document.body.style.overflow = 'scroll';
				scrollWidth -= document.body.clientWidth;
				document.body.style.overflow = 'auto';
				scrollBarWidth = scrollWidth;
			}
			window.onload = setScrollBarWidth;
	
	
	// stupid bullshit
	//////////
	
			// clear selected text
			// (what a dick it was to figure out that I needed to do this of all things, jeez)
			var clearSelection = function() {
				if (document.selection) {
					document.selection.empty();
				} else if (window.getSelection) {
					window.getSelection().removeAllRanges();
				}
			}