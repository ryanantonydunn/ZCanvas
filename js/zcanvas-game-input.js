// ZCANVAS
// GAME
// INPUT
//////////

		// values
		var keyL = false;
		var keyU = false;
		var keyR = false;
		var keyD = false;
		var keyCancel = false;
		
		// functions
		function keyPress(e) {
			if (e.which==37) { keyL = true; }
			if (e.which==38) { keyU = true; }
			if (e.which==39) { keyR = true; }
			if (e.which==40) { keyD = true; }
		}
		function keyRelease(e) {
			if (e.which==37) { keyL = false; }
			if (e.which==38) { keyU = false; }
			if (e.which==39) { keyR = false; }
			if (e.which==40) { keyD = false; }
		}
		
		// events
		if (document.attachEvent) {
			document.attachEvent("keydown", keyPress);
			document.attachEvent("keyup", keyRelease);
		} else if (document.addEventListener) {
			document.addEventListener("keydown", keyPress, false);
			document.addEventListener("keyup", keyRelease, false);
		} else {
			document.onkeydown = keyPress;
			document.onkeyup = keyRelease;
		}