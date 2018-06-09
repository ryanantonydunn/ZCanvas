// ZCANVAS
// DATABASE
//////////

		function zc_database(url) {
			var self = this;
			this.json;
			this.img;
			this.url = url;
			this.trigger = false;
			this.read = new XMLHttpRequest();
			this.read.open('GET', this.url, true);
			this.read.onreadystatechange = function () {
				if (this.readyState==4) {
					self.json = JSON.parse(this.responseText);
					self.img = new zc_image(self.json);
					self.trigger = true;
				}
			}
			this.read.send(null);
			this.write = function() {
				var write = new XMLHttpRequest();
				var params = "data="+JSON.stringify(this.json);
				write.open("POST",'write.php',false);
				write.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				write.send(params);
				alert('Data saved successfully.');
			}
		}