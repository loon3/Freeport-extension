var stickerbomb = (function(public) {
	public = public || {};

	var instances = [];

	//var styles = '/* STYLES: Build process inserts styles here. If you\'re seeing this, stickerbomb.js was not correctly built. */';
	var styles = '.stickerbomb{-moz-user-select:none;-ms-user-select:none;-o-user-select:none;-webkit-user-select:none;background-color:#100000;box-sizing:border-box;display:inline-block;font-family:"Arial";font-size:0px;overflow:hidden;padding:0px 2.5rem 2.5rem 2.5rem;position:relative;text-align:center;user-select:none;width:100%;min-height:17rem}@media screen and (max-width: 500px){.stickerbomb{padding:0px 2rem 2rem 2rem}}.stickerbomb div{box-sizing:border-box}.sb_canvas{width:100%;min-height:1rem;cursor:pointer;position:relative;z-index:1;-webkit-tap-highlight-color:transparent;transition:opacity 200ms linear;opacity:1}.sb_canvas.fade{opacity:0.5}.sb_logo{position:absolute;z-index:3;right:0.5rem;bottom:4rem;width:2rem}.sb_popup{background-color:#100000;box-shadow:0px 0px 0px #100011;left:10%;opacity:0;padding:1.2rem;pointer-events:none;position:absolute;text-align:center;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%);transition:opacity 200ms linear;width:80%;z-index:5;font-size:1rem;color:#100015}@media screen and (max-width: 500px){.sb_popup{padding:0.3rem;top:25%;width:70%;left:15%;-webkit-transform:translateY(-25%)}}.sb_popup.active{opacity:1;pointer-events:auto}.sb_popup p{margin-top:0px}.sb_popup input{border:0px;background-color:#100012;width:100%;padding:0.5rem;margin-bottom:0.5rem;box-sizing:border-box;color:#100015}.sb_popup button,.sb_popup a.button{background-color:#100012;color:#100015;padding:0.5rem;margin:0px 0.25rem;display:inline-block;cursor:pointer}.sb_bar{position:absolute;top:0px;display:inline-block;z-index:2;height:100%;overflow:visible;padding-bottom:2.5rem}@media screen and (max-width: 500px){.sb_bar{padding-bottom:2rem}}.sb_bar.sb_tools{background-color:#100001;box-shadow:0px 0px 0px #100001;left:0px}.sb_bar.sb_tools .sb_icon{background-color:#100002;color:#100005}.sb_bar.sb_tools .sb_icon:hover{background-color:#100003;color:#100006}.sb_bar.sb_tools .sb_icon.active{background-color:#100004;color:#100007}.sb_bar.sb_actions{background-color:#100011;box-shadow:0px 0px 0px #100011;right:0px}.sb_bar.sb_actions .sb_icon{background-color:#100012;color:#100015}.sb_bar.sb_actions .sb_icon:hover{background-color:#100013;color:#100016}.sb_bar.sb_actions .sb_icon.active{background-color:#100014;color:#100017}.sb_icon{display:block;position:relative;width:2.5rem;height:2.5rem;text-align:center;cursor:pointer;font-size:1.5rem;line-height:2.5rem}.sb_icon i{font-size:1.5rem;line-height:2.5rem}@media screen and (max-width: 500px){.sb_icon{width:2rem;height:2rem;font-size:1.3rem;line-height:2rem}.sb_icon i{font-size:1.3rem;line-height:2rem}}.sb_icon .sb_tooltip{display:none;pointer-events:none;font-size:1rem;line-height:1rem;padding:0.5rem;background-color:#100022;color:#100021;position:absolute;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%);white-space:nowrap;width:auto;height:auto;z-index:2}.sb_tool .sb_tooltip{left:108%}.sb_action .sb_tooltip{right:108%}.sb_icon:hover .sb_tooltip{display:inline-block}.sb_icon .sb_tooltip:after{content:"";position:absolute;border-style:solid;display:block;width:0;top:50%;transform:translateY(-50%);-webkit-transform:translateY(-50%)}.sb_tools .sb_icon .sb_tooltip:after{border-color:transparent #100022;border-width:7px 10px 7px 0px;right:100%}.sb_actions .sb_icon .sb_tooltip:after{border-color:transparent #100022;border-width:7px 0px 7px 10px;left:100%}.sb_drawers{background-color:#100041;bottom:-11rem;box-shadow:0px 0px 0px #100031;display:block;height:13.5rem;left:0px;overflow-x:auto;position:absolute;transition:bottom 200ms linear;width:100%;z-index:4;overflow-x:hidden}@media screen and (max-width: 500px){.sb_drawers{bottom:-6rem;height:8rem}}.sb_drawers:after{content:"";height:11rem;left:0px;pointer-events:none;position:absolute;top:2.5rem;width:100%;z-index:2}@media screen and (max-width: 500px){.sb_drawers:after{height:6rem;top:2rem}}.sb_drawers.active{bottom:0px}.sb_drawers .sb_drawer_buttons{background-color:#100031;height:4.5rem;padding:0px 2.5rem;overflow-x:auto}@media screen and (max-width: 500px){.sb_drawers .sb_drawer_buttons{height:4rem;padding:0px 2rem}}.sb_drawers .sb_drawer_buttons .sb_drawer_slider{display:inline-block;position:relative;white-space:nowrap}.sb_drawers .sb_drawer_buttons .sb_drawer_scroll{display:inline-block;position:absolute;top:0px;height:2.5rem;width:2.5rem;background-color:#100051;color:#100053;z-index:2;font-size:1.5rem;line-height:2.5rem;cursor:pointer}@media screen and (max-width: 500px){.sb_drawers .sb_drawer_buttons .sb_drawer_scroll{height:2rem;width:2rem;font-size:1.3rem;line-height:2rem}}.sb_drawers .sb_drawer_buttons .sb_drawer_scroll.sb_left{left:0px;border-right:1px solid #100052}.sb_drawers .sb_drawer_buttons .sb_drawer_scroll.sb_right{right:0px;border-left:1px solid #100052}.sb_drawers .sb_drawer_buttons .sb_drawer_scroll:hover{background-color:#100054;color:#100056}.sb_drawers .sb_drawer_buttons .sb_drawer_scroll:hover.sb_left{border-right:1px solid #100055}.sb_drawers .sb_drawer_buttons .sb_drawer_scroll:hover.sb_right{border-left:1px solid #100055}@media screen and (max-width: 500px){.sb_drawers .sb_drawer_buttons .sb_drawer_scroll{display:none}}.sb_drawers .sb_drawer_buttons .sb_button{color:#100035;background-color:#100032;cursor:pointer;display:inline-block;font-size:1.2rem;line-height:2.5rem;height:2.5rem;padding:0px 1rem;position:relative}@media screen and (max-width: 500px){.sb_drawers .sb_drawer_buttons .sb_button{font-size:1rem;line-height:2rem;height:2rem}}.sb_drawers .sb_drawer_buttons .sb_button:hover{background-color:#100033;color:#100036}.sb_drawers .sb_drawer_buttons .sb_button.active{background-color:#100034;color:#100037}.sb_drawers .sb_content_wrapper{background-color:#100041;top:2.5rem;left:0px;position:absolute;width:100%;height:11rem}@media screen and (max-width: 500px){.sb_drawers .sb_content_wrapper{top:2rem;height:6rem}}.sb_drawers .sb_content_wrapper .sb_content{background-color:#100041;position:absolute;top:0px;width:100%;opacity:0;transition:opacity 150ms linear;height:11rem;padding:0px 1rem;pointer-events:none;white-space:nowrap;overflow-x:auto}@media screen and (max-width: 500px){.sb_drawers .sb_content_wrapper .sb_content{height:6rem}}.sb_drawers .sb_content_wrapper .sb_content.active{opacity:1;pointer-events:auto;z-index:1}.sb_drawers .sb_content_wrapper .sb_content img,.sb_drawers .sb_content_wrapper .sb_content object{height:7.95rem !important;margin:1rem;cursor:pointer;position:relative;width:auto !important}@media screen and (max-width: 500px){.sb_drawers .sb_content_wrapper .sb_content img,.sb_drawers .sb_content_wrapper .sb_content object{height:4rem !important}}';





	//////////// USER NOTIFICATIONS ///////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	function error (message) {
		var timestamp = new Date().getTime();
		console.log('Stickerbomb Error @ ' + timestamp + ': ' + message);
		return;
	}





	//////////// RENDERING ////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	function findPointByRotation(px, py, rot, hCenter, vCenter) {
		px = px - hCenter;
		py = py - vCenter;
		rot = rot * Math.PI / 180;
		var nx = (px * Math.cos(rot) - py * Math.sin(rot)) + hCenter;
		var ny = (px * Math.sin(rot) + py * Math.cos(rot)) + vCenter;
		return [nx, ny];
	}

	function positionInfo(instanceNum, object, forceResize) {
		var instance = instances[instanceNum];


		var width = Math.floor(object.widthPercentage * 0.01 * (forceResize ? instance.canvas.width : instance.canvas.offsetWidth));
		var height = Math.floor(width * object.heightFxWidth);


		if (object.left === 'center') {
			// Turn "center" into a percentage
			object.left = Math.floor((instance.canvasHCenter - (width / 2)) / (forceResize ? instance.canvas.width : instance.canvas.offsetWidth) * 100);
		}
		if (object.top === 'center') {
			// Turn "center" into a percentage
			object.top = Math.floor((instance.canvasVCenter - (height / 2)) / (forceResize ? instance.canvas.height : instance.canvas.offsetHeight) * 100);
		}

		var left = object.left * 0.01 * (forceResize ? instance.canvas.width : instance.canvas.offsetWidth);
		var top = object.top * 0.01 * (forceResize ? instance.canvas.height : instance.canvas.offsetHeight);
		var right = left + width;
		var bottom = top + height;

		var objHCenter = left + (width / 2);
		var objVCenter = top + (height / 2);
		var offsetH = (objHCenter - left) * -1;
		var offsetV = (objVCenter - top) * -1;

		return {
			width: width,
			height: height,
			left: left,
			top: top,
			right: right,
			bottom: bottom,
			vertLT: findPointByRotation(left, top, object.angle, objHCenter, objVCenter),
			vertLB: findPointByRotation(left, bottom, object.angle, objHCenter, objVCenter),
			vertRT: findPointByRotation(right, top, object.angle, objHCenter, objVCenter),
			vertRB: findPointByRotation(right, bottom, object.angle, objHCenter, objVCenter),
			hCenter: objHCenter,
			vCenter: objVCenter,
			offsetH: offsetH,
			offsetV: offsetV,
			angle: object.angle
		};
	}

	function resize(instanceNum) {
		var instance = instances[instanceNum];
		var canvas = instance.canvas;
		var proportion = instance.aspectRatio;
		canvas.setAttribute('width', canvas.offsetWidth);
		canvas.setAttribute('height', canvas.offsetWidth / proportion);

		instance.canvasHCenter = Math.floor(canvas.offsetWidth / 2);
		instance.canvasVCenter = Math.floor(canvas.offsetHeight / 2);

		// Hide drawer scroll buttons if they're not necessary
		instance.drawerButtons[0].style.display = 'inline-block';
		instance.drawerButtons[1].style.display = 'inline-block';
		var drawerWidth = instance.drawerButtonBar.clientWidth - instance.drawerButtons[0].clientWidth - instance.drawerButtons[1].clientWidth;
		var drawerButtonWidth = instance.drawerButtonSlider.clientWidth;
		if (drawerButtonWidth < drawerWidth) {
			instance.drawerButtons[0].style.display = 'none';
			instance.drawerButtons[1].style.display = 'none';
			instance.drawerButtonSlider.style.left = '0px';
		} else {
			instance.drawerButtons[0].style.display = 'inline-block';
			instance.drawerButtons[1].style.display = 'inline-block';
		}

		render(instanceNum);
	}

	function forceResize(instanceNum, callback, forceWidth, forceHeight) {
		var instance = instances[instanceNum];
		var canvas = instance.canvas;
		forceWidth = forceWidth || 1550;
		forceHeight = forceHeight || 1000;
		callback = callback || function() {};

		canvas.setAttribute('width', forceWidth);
		canvas.setAttribute('height', forceHeight);

		instance.canvasHCenter = Math.floor(forceWidth / 2);
		instance.canvasVCenter = Math.floor(forceHeight / 2);

		render(instanceNum, true, callback);
		resize(instanceNum);
	}

	function render(instanceNum, forceResize, callback) {
		setTimeout(function() {
			var instance = instances[instanceNum];
			forceResize = !!forceResize;
			instance.context.drawImage(instance.backdrop, 0, 0, (forceResize ? instance.canvas.width : instance.canvas.offsetWidth), (forceResize ? instance.canvas.height : instance.canvas.offsetHeight));

			var layers = instance.objects.length;

			// If no layers present, run the callback now
			if (layers === 0 && typeof callback === 'function') callback();

			for (var i = 0; i < layers; i++) {
				// Select object, calculate positioning info
				var object = instance.objects[i];
				var position = positionInfo(instanceNum, object, forceResize);

				// Translate and rotate the context to draw this object
				instance.context.translate(position.hCenter, position.vCenter);
				instance.context.rotate(position.angle * (Math.PI / 180));

				// If layer helpers are currently active, draw them first
				if (instance.guides) {
					instance.context.fillStyle = 'rgba(' + object.guideColor + ',0.5)';
					instance.context.fillRect(position.offsetH, position.offsetV, position.width, position.height);
				}

				// Mirror if requested
				if (!!object.mirror) { instance.context.save(); instance.context.scale(-1,1); }

				// Draw the object
				instance.context.drawImage(object.image, position.offsetH, position.offsetV, position.width, position.height);

				// Undo mirror
				if (!!object.mirror) { instance.context.restore(); }

				// Undo rotation
				instance.context.rotate(-1 * (position.angle * (Math.PI / 180)));

				// If layer helpers are currently active, draw the layer number (should be unaffected by rotation, but affected by translation)
				if (instance.guides) {
					instance.context.font = '50px sans-serif';
					instance.context.fillStyle = 'rgb(255,255,255)';
					instance.context.strokeStyle = 'rgb(0,0,0)';
					instance.context.fillText(i, -13, 20);
					instance.context.strokeText(i, -13, 20);
				}

				// Undo translation for next draw or viewing
				instance.context.translate(-1 * position.hCenter, -1 * position.vCenter);

				// Run the callback if present on the last layer
				if (i === layers - 1 && typeof callback === 'function') callback();
			}
		},0);
	}





	//////////// OBJECT CREATION //////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	function createObject(instanceNum, drawer, name, custom) {
		var instance = instances[instanceNum];
		custom = custom || {};
		
		var location;
		if (!!custom.hash) {
			location = findSticker(instanceNum, custom.hash);
			drawer = location[0];
			name = location[1];
		}

		if (drawer === false || name === false) return;

		function CreateFromTemplate() {
			var sticker = instance.stickers[drawer][name];

			var guideColor;
			// Resolve guide color
			if (typeof sticker.guideColor === 'function') {
				guideColor = sticker.guideColor();
			} else {
				guideColor = sticker.guideColor;
			}

			return {
				hash: sticker.hash,
				image: sticker.image,
				top: typeof custom.top === 'number' ? custom.top : sticker.top,
				left: typeof custom.left === 'number' ? custom.left : sticker.left,
				widthPercentage: custom.widthPercentage || sticker.widthPercentage,
				heightFxWidth: sticker.heightFxWidth,
				angle: custom.angle || 0,
				guideColor: guideColor,
				mirror: custom.mirror || false
			};
		}

		instance.objects.push(CreateFromTemplate());
		closeDrawers(instanceNum);
		render(instanceNum);
	}

	function findSticker(instanceNum, hash) {
		var instance = instances[instanceNum];
		var i;
		for (var drawer in instance.stickers) {
			for (i = 0; i < instance.stickers[drawer].length; i++) {
				if (instance.stickers[drawer][i].hash === hash) {
					return [drawer, i];
				}
			}
		}
		return [false, false];
	}

	function detectIE() {
		var ua = window.navigator.userAgent;

		// Test values; Uncomment to check result …

		// IE 10
		// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

		// IE 11
		// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

		// Edge 12 (Spartan)
		// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

		// Edge 13
		// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// Edge (IE 12+) => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}





	//////////// CLICK HANDLING ///////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	var lastClick = new Date().getTime();
	function clickStart(instanceNum, e) {
		// Double click protection
		var thisClick = new Date().getTime();
		if (thisClick - lastClick < 200) { return; } else { lastClick = thisClick; }

		var instance = instances[instanceNum];

		var bodyMarginTop = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('margin-top'));
		var bodyMarginLeft = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('margin-left'));
		var containerPaddingLeft = parseInt(window.getComputedStyle(instance.container, null).getPropertyValue('padding-left'));

		var containerOffset = findOffset(instance.container);

		click = [
			(e.clientX || e.touches[0].clientX) - containerOffset[0] - containerPaddingLeft,
			(e.clientY || e.touches[0].clientY) - containerOffset[1] + (window.scrollY || document.documentElement.scrollTop)
		];

		hit = clickHitObject(instanceNum, click);

		var dragfunc = function(e) {
			drag(instanceNum, e, hit, dragStart);
		};

		if (hit >= 0) {
			if (guideTool(instances[instanceNum].tool)) {
				instant(instanceNum, hit);
			} else {
				var position = positionInfo(instanceNum, instance.objects[hit]);
				
				var dragStart = {
					origin: [instance.objects[hit].left, instance.objects[hit].top],  // In percent
					center: [position.hCenter, position.vCenter],  // In pixels
					scale: instance.objects[hit].widthPercentage,  // In percent
					angle: position.angle,  // In degrees
					dragStartAngle: Math.floor(Math.atan2(click[1] - position.vCenter, click[0] - position.hCenter) * 180 / Math.PI)  // In degrees
				};
				
				instance.canvas.addEventListener('mousemove', dragfunc);
				instance.canvas.addEventListener('touchmove', dragfunc);
				instance.canvas.addEventListener('mouseup', function() { instance.canvas.removeEventListener('mousemove', dragfunc); });
				instance.canvas.addEventListener('touchend', function() { instance.canvas.removeEventListener('touchend', dragfunc); });
			}
		} else {
			return;
		}
	}

	function clickHitObject(instanceNum, click) {
		var instance = instances[instanceNum];
		var obj = -1;

		var position;
		for (var i = 0; i < instance.objects.length; i++) {
			position = positionInfo(instanceNum, instance.objects[i]);
			if (
				pointInRect(click, position)
			) {
				obj = i;
			}
		}
		return obj;
	}

	function findOffset(obj){
		var offsetLeft = obj.offsetLeft;
		var offsetTop = obj.offsetTop;

		while(obj.offsetParent){
			if (obj == document.getElementsByTagName('body')[0]) {
				break;
			} else{
				offsetLeft += obj.offsetParent.offsetLeft;
				offsetTop += obj.offsetParent.offsetTop;
				obj = obj.offsetParent;
			}
		}
		var offset = [ offsetLeft, offsetTop ];
		return offset;
	}

	function pointInRect(click, position) {
		var rectArea = Math.round((position.bottom - position.top) * (position.right - position.left));


		var triangles = [
			[
				// Left Side
				distance(click[0], click[1], position.vertLT[0], position.vertLT[1]),
				distance(click[0], click[1], position.vertLB[0], position.vertLB[1]),
				distance(position.vertLT[0],position.vertLT[1], position.vertLB[0], position.vertLB[1]),
			],
			[
				// Top Side
				distance(click[0], click[1], position.vertLT[0], position.vertLT[1]),
				distance(click[0], click[1], position.vertRT[0], position.vertRT[1]),
				distance(position.vertLT[0],position.vertLT[1], position.vertRT[0], position.vertRT[1]),
			],
			[
				// Right Side
				distance(click[0], click[1], position.vertRT[0], position.vertRT[1]),
				distance(click[0], click[1], position.vertRB[0], position.vertRB[1]),
				distance(position.vertRT[0],position.vertRT[1], position.vertRB[0], position.vertRB[1]),
			],
			[
				// Bottom Side
				distance(click[0], click[1], position.vertLB[0], position.vertLB[1]),
				distance(click[0], click[1], position.vertRB[0], position.vertRB[1]),
				distance(position.vertLB[0],position.vertLB[1], position.vertRB[0], position.vertRB[1]),
			],
		];
		
		var areas = [
			triangleArea(triangles[0][0], triangles[0][1], triangles[0][2]),
			triangleArea(triangles[1][0], triangles[1][1], triangles[1][2]),
			triangleArea(triangles[2][0], triangles[2][1], triangles[2][2]),
			triangleArea(triangles[3][0], triangles[3][1], triangles[3][2]),
		];

		var allTrianglesArea = Math.round(areas.reduce(function(a,b) { return a + b; }, 0));



		if (allTrianglesArea > rectArea) {
			return false;
		} else {
			return true;
		}
	}

	function distance(x1, y1, x2, y2) {
		return Math.sqrt( Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) );
	}

	function triangleArea(d1, d2, d3) {
		// Heron's formula
		var s = (d1 + d2 + d3) / 2;
		return Math.sqrt(s * (s - d1) * (s - d2) * (s - d3));
	}

	function drag(instanceNum, e, hit, dragStart) {
		var instance = instances[instanceNum];
		var cursorInfo = {};

		var bodyMarginTop = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('margin-top'));
		var bodyMarginLeft = parseInt(window.getComputedStyle(document.body, null).getPropertyValue('margin-left'));
		var containerPaddingLeft = parseInt(window.getComputedStyle(instance.container, null).getPropertyValue('padding-left'));

		var containerOffset = findOffset(instance.container);

		cursorInfo.client = [
			(e.clientX || e.touches[0].clientX),
			(e.clientY || e.touches[0].clientY)
		];
		cursorInfo.current = [
			(e.clientX || e.touches[0].clientX) - containerOffset[0] - containerPaddingLeft,
			(e.clientY || e.touches[0].clientY) - containerOffset[1] + (window.scrollY || document.documentElement.scrollTop)
		];
		cursorInfo.delta = [
			cursorInfo.current[0] - click[0],
			cursorInfo.current[1] - click[1]
		];
		cursorInfo.percentDelta = [
			Math.floor(cursorInfo.delta[0] / instance.canvas.offsetWidth * 100),
			Math.floor(cursorInfo.delta[1] / instance.canvas.offsetHeight * 100)
		];
		// angle is Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
		// p1 is center of object, p2 is current cursor location
		cursorInfo.angle = Math.floor(Math.atan2(cursorInfo.current[1] - dragStart.center[1], cursorInfo.current[0] - dragStart.center[0]) * 180 / Math.PI);
		
		switch (instance.tool) {
			case 'move':
				move(instanceNum, hit, cursorInfo, dragStart);
				break;
			case 'scale':
				scale(instanceNum, hit, cursorInfo, dragStart);
				break;
			case 'rotate':
				rotate(instanceNum, hit, cursorInfo, dragStart);
				break;
		}
		render(instanceNum);
	}

	function instant(instanceNum, hit) {
		var instance = instances[instanceNum];
		switch (instance.tool) {
			case 'mirror':
				mirror(instanceNum, hit);
				break;
			case 'delete':
				del(instanceNum, hit);
				break;
			case 'back':
				back(instanceNum, hit);
				break;
			case 'forward':
				forward(instanceNum, hit);
				break;
		}
		render(instanceNum);
	}





	//////////// TOOL HANDLING ////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	function guideTool(tool) {
		if (
			tool === 'mirror' ||
			tool === 'back' || 
			tool === 'forward' || 
			tool === 'delete'
		) {
			return true;
		}
		return false;
	}

	function selectTool(instanceNum, tool) {
		var instance = instances[instanceNum];
		
		closeDrawers(instanceNum);

		for (var toolNode in instance.toolNodes) {
			instance.toolNodes[toolNode].classList.remove('active');
		}

		instance.toolNodes[tool].classList.add('active');
		instance.tool = tool;

		if (guideTool(tool)) {
			instance.guides = true;
		} else {
			instance.guides = false;
		}

		render(instanceNum);
	}

	function move(instanceNum, hit, cursorInfo, dragStart) {
		var instance = instances[instanceNum];
		instance.objects[hit].left = dragStart.origin[0] + cursorInfo.percentDelta[0];
		instance.objects[hit].top = dragStart.origin[1] + cursorInfo.percentDelta[1];
	}

	function scale(instanceNum, hit, cursorInfo, dragStart) {
		var instance = instances[instanceNum];
		var avg = Math.floor((cursorInfo.percentDelta[0] + cursorInfo.percentDelta[1]) / 2);
		var newVal = dragStart.scale + avg;
		if (instance.objects[hit].widthPercentage > 0) {
			instance.objects[hit].widthPercentage = newVal > 0 ? newVal : 1;
		} else {
			instance.objects[hit].widthPercentage = newVal < 0 ? newVal : -1;
		}
	}

	function rotate(instanceNum, hit, cursorInfo, dragStart) {
		var instance = instances[instanceNum];
		instance.objects[hit].angle = dragStart.angle - (dragStart.dragStartAngle - cursorInfo.angle);
	}

	function mirror(instanceNum, hit) {
		var instance = instances[instanceNum];
		instance.objects[hit].mirror = !!instance.objects[hit].mirror ? false : true;
	}

	function del(instanceNum, hit) {
		var instance = instances[instanceNum];
		instance.objects.splice(hit, 1);
	}

	function back(instanceNum, hit) {
		var instance = instances[instanceNum];
		if (hit > 0) {
			var obj1 = instance.objects[hit - 1];
			var obj2 = instance.objects[hit];
			instance.objects[hit - 1] = obj2;
			instance.objects[hit] = obj1;
		}
	}

	function forward(instanceNum, hit) {
		var instance = instances[instanceNum];
		if (hit < instance.objects.length - 1) {
			var obj1 = instance.objects[hit];
			var obj2 = instance.objects[hit + 1];
			instance.objects[hit] = obj2;
			instance.objects[hit + 1] = obj1;
		}
	}





	//////////// DRAWER HANDLING //////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	function openDrawer(instanceNum, id) {
		var instance = instances[instanceNum];

		if (!!instance.drawerNodes.content[id].classList.contains('active')) {
			closeDrawers(instanceNum);
			return;
		}

		closeDrawers(instanceNum);

		instance.drawerNodes.content[id].classList.add('active');
		instance.drawerNodes.button[id].classList.add('active');
		instance.barNodes.drawerbar.classList.add('active');
	}

	function closeDrawers(instanceNum) {
		var instance = instances[instanceNum];

		for (var node in instance.drawerNodes.button) {
			instance.drawerNodes.button[node].classList.remove('active');
		}
		for (node in instance.drawerNodes.content) {
			instance.drawerNodes.content[node].classList.remove('active');
		}

		instance.barNodes.drawerbar.classList.remove('active');
	}


	//////////// SHARING AND COMPLETED IMAGE HANDLING /////////////////////////
	///////////////////////////////////////////////////////////////////////////


	function save(instanceNum) {
		var instance = instances[instanceNum];

		var url = instance.canvas.toDataURL('image/png', 0.7);

		if (navigator.msSaveBlob) { // IE 10+ 
			navigator.msSaveBlob(dataURItoBlob(url), (instance.outputImageName ? instance.outputImageName + '.png' : 'createdImage.png')); 
		} else {
			var a = document.createElement('a');
			a.href = url;
			a.download = instance.outputImageName ? instance.outputImageName + '.png' : 'createdImage.png';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}


		function dataURItoBlob(dataURI) {
			// convert base64 to raw binary data held in a string
			// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
			var byteString = atob(dataURI.split(',')[1]);

			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

			// write the bytes of the string to an ArrayBuffer
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) {
			  ia[i] = byteString.charCodeAt(i);
			}

			// write the ArrayBuffer to a blob, and you're done
			var blob = new Blob([ab], {type: mimeString});
			return blob;
		}
	}

	function print(instanceNum) {
		var instance = instances[instanceNum];

		forceResize(instanceNum, function() {
			var url = instance.canvas.toDataURL('image/png', 1);
			var newWindow = window.open();

			printWindowListener(0);

			function printWindowListener(attempts) {
				if (attempts > 30) return;
				console.log(newWindow);
				if (!!newWindow && !!newWindow.document) {
					printWindowActions();
				} else {
					setTimeout(function() { printWindowListener( attempts + 1 ); }, 200);
				}
			}

			function printWindowActions() {
				var img = newWindow.document.createElement('img');
				img.setAttribute('src', url);
				img.style.width = '100%';
				img.style.transform = 'rotate(180deg)';
				img.style.webkitTransform = 'rotate(180deg)';
				newWindow.document.body.appendChild(img);
				newWindow.document.close();
				newWindow.focus();
				setTimeout(function() {
					newWindow.print();
					newWindow.close();
				}, 100);
			}
		});
	}

	var hash = 0;
	function nameHash(str) {
		hash += 1;
		return hash;
	}

	function generateURL(instanceNum) {
		// Instance is recorded as follows: sb[namehash] (e.g. sb923904)
		// Background is recorded as follows: b1
		// Each sticker is recorded as follows: i1t24l40w20a19m1
		// Separator is x

		var instance = instances[instanceNum];

		var url = window.location.protocol + '//' + window.location.hostname + window.location.pathname;

		url += '?sb=sb' + instance.hash + 'x';

		// determine the backdrop
		var backdrop = 0;
		for (var i = 0; i < instance.backdrops.length; i++) {
			if (instance.backdrop === instance.backdrops[i]) {
				backdrop = i;
			}
		}

		url += 'b' + backdrop + 'x';

		for (i = 0; i < instance.objects.length; i++) {
			url += 'i' + instance.objects[i].hash;
			url += 't' + instance.objects[i].top;
			url += 'l' + instance.objects[i].left;
			url += 'w' + instance.objects[i].widthPercentage;
			url += 'a' + instance.objects[i].angle;
			url += 'm' + (instance.objects[i].mirror ? 1 : 0);
			if (i !== instance.objects.length - 1) {
				url += 'x';
			}
		}

		return url;
	}

	function shareURL(instanceNum) {
		var instance = instances[instanceNum];

		var url = generateURL(instanceNum);

		makePopup(instanceNum, 'sb_shareURL', '<p>Copy and paste this URL to share your image:</p><input type="text" value="' + url + '" onclick="this.select();"></input><br><a class="button close">close</a>');
	}

	function facebookURL(instanceNum) {
		var url = generateURL(instanceNum);
		window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
	}

	function twitterURL(instanceNum) {
		var url = generateURL(instanceNum);
		window.open('https://twitter.com/share?url=' + encodeURIComponent(url), '_blank', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
	}

	function reconstructURL(instanceNum) {
		var instance = instances[instanceNum];

		var urlParams = window.location.search.match(/sb=([^&]*)/);
		if (!!urlParams && urlParams.length > 1) urlParams = urlParams[1];

		if (!!urlParams && urlParams.match(/^sb\d+xb\d+x(i\d+t-?\d+l-?\d+w\d+a-?\d+m\d+x?)+$/)) {
			urlParams = urlParams.split('x');

			// If this string was meant for this instance...
			if (urlParams[0] === 'sb' + instance.hash) {
				// Set the backdrop
				instance.backdrop = instance.backdrops[parseInt(urlParams[1].substr(1))];

				// Reconstruct the stickers
				for (var i = 2; i < urlParams.length; i++) {
					createObject(instanceNum, false, false, {
						hash: parseInt(urlParams[i].match(/i(\d+)/)[1]),
						top: parseInt(urlParams[i].match(/t(-?\d+)/)[1]),
						left: parseInt(urlParams[i].match(/l(-?\d+)/)[1]),
						widthPercentage: parseInt(urlParams[i].match(/w(\d+)/)[1]),
						angle: parseInt(urlParams[i].match(/a(-?\d+)/)[1]),
						mirror: parseInt(urlParams[i].match(/m(\d+)/)[1])
					});
				}
			}
		}
	}

	function makePopup(instanceNum, id, html) {
		var instance = instances[instanceNum];

		var popup = document.createElement('div');
		popup.classList.add('sb_popup');
		popup.setAttribute('id', id);
		popup.innerHTML = html;

		closePopups(instanceNum, popup);
		instance.container.appendChild(popup);

		var closeButtons = popup.getElementsByClassName('close');
		var closeFunc = function() {
			closePopups(instanceNum);
		};

		for (var i = 0; i < closeButtons.length; i++) {
			closeButtons[i].onclick = closeFunc;
		}

		instance.canvas.classList.add('fade');
		popup.classList.add('active');

		return popup;
	}

	function closePopups(instanceNum, exclude) {
		var instance = instances[instanceNum];

		var popups = document.getElementsByClassName('sb_popup');

		instance.canvas.classList.remove('fade');
		for (var i = 0; i < popups.length; i++) {
			if (popups[i] !== exclude) popups[i].classList.remove('active');
		}

		setTimeout(function() {
			for (var i = 0; i < popups.length; i++) {
				if (popups[i] !== exclude) instance.container.removeChild(popups[i]);
			}
		}, 200);
	}





	//////////// INSTANTIATION ////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	function hexToRGB(hexString) {
		if (typeof hexString !== 'string') { error('Hex colors must be strings'); return; }
		if (hexString[0] === '#') hexString = hexString.substr(1, hexString.length);
		if (hexString.length !== 6) { error('Incorrect hex color length'); return; }
		if (!hexString.match(/[a-f\d]{6}/i)) { error('Hex color contains invalid characters'); return; }

		var bigint = parseInt(hexString, 16);
		var r = (bigint >> 16) & 255;
		var g = (bigint >> 8) & 255;
		var b = bigint & 255;

		return [r, g, b].join();
	}

	function ratioToFloat(ratio) {
		if (typeof ratio === 'number') return ratio;
		if (typeof ratio !== 'string' || !ratio.match(/^\d+:\d+$/)) { error('Invalid aspect ratio provided'); return; }

		var width = ratio.match(/^\d+/)[0];
		var height = ratio.match(/\d+$/)[0];

		return width / height;
	}

	function insertInterface(container, instanceNum) {
		var instance = instances[instanceNum];

		// Create the toolbar
		var toolbar = document.createElement('div');
		toolbar.classList.add('sb_tools');
		toolbar.classList.add('sb_bar');
		instance.barNodes.toolbar = toolbar;

		// Create the action bar
		var actionbar = document.createElement('div');
		actionbar.classList.add('sb_actions');
		actionbar.classList.add('sb_bar');
		instance.barNodes.actionbar = actionbar;

		// Create the drawer bar
		var drawerbar = document.createElement('div');
		drawerbar.classList.add('sb_drawers');
		instance.barNodes.drawerbar = drawerbar;

		var drawerButtonBar = document.createElement('div');
		drawerButtonBar.classList.add('sb_drawer_buttons');
		drawerbar.appendChild(drawerButtonBar);
		instance.drawerButtonBar = drawerButtonBar;

		var drawerButtonSlider = document.createElement('div');
		drawerButtonSlider.classList.add('sb_drawer_slider');
		drawerButtonSlider.style.left = '0px';
		drawerButtonBar.appendChild(drawerButtonSlider);
		instance.drawerButtonSlider = drawerButtonSlider;

		var leftButton = document.createElement('div');
		leftButton.classList.add('sb_left');
		leftButton.classList.add('sb_drawer_scroll');
		leftButton.onmousedown = function(e) { scroll_listen(e, 'left'); };
		leftButton.ontouchstart = function(e) { scroll_listen(e, 'left'); };
		var leftButtonIcon = document.createElement('i');
		leftButtonIcon.classList.add('fa');
		leftButtonIcon.classList.add('fa-caret-left');
		leftButtonIcon.setAttribute('aria-hidden', 'true');
		leftButton.appendChild(leftButtonIcon);
		drawerButtonBar.appendChild(leftButton);
		leftButton.addEventListener("contextmenu", function(e) { e.preventDefault(); });
		instance.drawerButtons = [];
		instance.drawerButtons[0] = leftButton;

		var rightButton = document.createElement('div');
		rightButton.classList.add('sb_right');
		rightButton.classList.add('sb_drawer_scroll');
		rightButton.onmousedown = function(e) { scroll_listen(e, 'right'); };
		rightButton.ontouchstart = function(e) { scroll_listen(e, 'right'); };
		var rightButtonIcon = document.createElement('i');
		rightButtonIcon.classList.add('fa');
		rightButtonIcon.classList.add('fa-caret-right');
		rightButtonIcon.setAttribute('aria-hidden', 'true');
		rightButton.appendChild(rightButtonIcon);
		rightButton.addEventListener("contextmenu", function(e) { e.preventDefault(); });
		drawerButtonBar.appendChild(rightButton);
		instance.drawerButtons[1] = rightButton;

		var drawerContentWrapper = document.createElement('div');
		drawerContentWrapper.classList.add('sb_content_wrapper');
		drawerbar.appendChild(drawerContentWrapper);


		// Add elements
		container.appendChild(toolbar);
		container.appendChild(actionbar);
		container.appendChild(drawerbar);

		// Add tools
		if (!instance.hideTools || instance.hideTools.indexOf('move') === -1) {
			makeTool('move', 'Move', 'fa-arrows');
		}
		if (!instance.hideTools || instance.hideTools.indexOf('scale') === -1) {
			makeTool('scale', 'Scale', 'fa-expand', true);
		}
		if (!instance.hideTools || instance.hideTools.indexOf('rotate') === -1) {
			makeTool('rotate', 'Rotate', 'fa-repeat');
		}
		if (!instance.hideTools || instance.hideTools.indexOf('mirror') === -1) {
			makeTool('mirror', 'Mirror', 'fa-exchange');
		}
		if (!instance.hideTools || instance.hideTools.indexOf('delete') === -1) {
			makeTool('delete', 'Delete', 'fa-times');
		}
		if (!instance.hideTools || instance.hideTools.indexOf('back') === -1) {
			makeTool('back', 'Layer down', 'fa-level-down');
		}
		if (!instance.hideTools || instance.hideTools.indexOf('forward') === -1) {
			makeTool('forward', 'Layer up', 'fa-level-up');
		}

		// Add actions
		if (!instance.hideActions || instance.hideActions.indexOf('share') === -1) {
			makeAction('share', 'Share URL', 'fa-link', function() { shareURL(instanceNum); })
		}
		if (!instance.hideActions || instance.hideActions.indexOf('facebook') === -1) {
			makeAction('facebook', 'Share on Facebook', 'fa-facebook', function() { facebookURL(instanceNum); })
		}
		if (!instance.hideActions || instance.hideActions.indexOf('twitter') === -1) {
			makeAction('twitter', 'Share on Twitter', 'fa-twitter', function() { twitterURL(instanceNum); })
		}
		if (!instance.hideActions || instance.hideActions.indexOf('save') === -1) {
			makeAction('save', 'Save', 'fa-floppy-o', function() { save(instanceNum); });
		}
		if (!instance.hideActions || instance.hideActions.indexOf('print') === -1) {
			makeAction('print', 'Print', 'fa-print',  function() { print(instanceNum); });
		}

		// Add custom actions
		/*actions: {
			'custom': {
				icon: 'fa-cog',
				tooltip: 'Custom Action',
				action: function(data) {
					console.log(data);
				}
			}
		}*/
		for (var customAction in instance.actions) {
			makeAction(customAction, instance.actions[customAction].tooltip, instance.actions[customAction].icon, instance.actions[customAction].action);
		}


		// Add drawers
		if (instance.backdrops.length > 1) {
			makeDrawer(drawer_id('Backdrops'), 'Backdrops', 0);
		}
		var i = 1;
		for (var drawer in instance.stickers) {
			makeDrawer(drawer_id(drawer), drawer, i);
			i++;
		}

		// TOOLS

		function makeTool(id, name, iconClass, mirror) {
			var tool = document.createElement('div');
			tool.classList.add('sb_tool');
			tool.classList.add('sb_icon');
			tool.setAttribute('id', id);
			tool.addEventListener('click', function() {
				var thisClick = new Date().getTime();
				if (thisClick - lastClick < 500) { return; } else { lastClick = thisClick; }
				selectTool(instanceNum, id);
			});
			tool.addEventListener('touchstart', function() {
				var thisClick = new Date().getTime();
				if (thisClick - lastClick < 500) { return; } else { lastClick = thisClick; }
				selectTool(instanceNum, id);
			});

			var icon = document.createElement('i');
			icon.classList.add('fa');
			icon.classList.add(iconClass);
			if (mirror) icon.classList.add('fa-flip-horizontal');
			icon.setAttribute('aria-hidden', 'true');

			var tooltip = document.createElement('div');
			tooltip.classList.add('sb_tooltip');
			tooltip.appendChild(document.createTextNode(name));

			tool.appendChild(icon);
			tool.appendChild(tooltip);

			instance.toolNodes[id] = tool;
			toolbar.appendChild(tool);
		}

		// ACTIONS

		function makeAction(id, name, iconClass, onclick) {
			var action = document.createElement('div');
			action.classList.add('sb_action');
			action.classList.add('sb_icon');
			action.setAttribute('id', name);
			action.addEventListener('click', function(e) {
				e.preventDefault();
				var thisClick = new Date().getTime();
				if (thisClick - lastClick < 500) { return; } else { lastClick = thisClick; }
				onclick(instance);
			});
			action.addEventListener('touchstart', function(e) {
				e.preventDefault();
				var thisClick = new Date().getTime();
				if (thisClick - lastClick < 500) { return; } else { lastClick = thisClick; }
				onclick(instance);
			});

			var icon = document.createElement('i');
			icon.classList.add('fa');
			icon.classList.add(iconClass);
			icon.setAttribute('aria-hidden', 'true');

			var tooltip = document.createElement('div');
			tooltip.classList.add('sb_tooltip');
			tooltip.appendChild(document.createTextNode(name));

			action.appendChild(icon);
			action.appendChild(tooltip);

			instance.actionNodes[id] = action;
			actionbar.appendChild(action);
		}

		// DRAWERS

		/*
			stickers: {
				'Plants and Animals': [
					{
						name: ,
						src: ,
						widthPercentage: ,
						heightFxWidth:
					}
				]
			}
		*/

		function drawer_id(name) {
			return 'sb_drawer_' + name.replace(/^a-z/i, '') + '_' + Math.floor(Math.random() * 10000);
		}

		function drawer_scroll(instanceNum, direction) {
			var instance = instances[instanceNum];
			
			var position = instance.drawerButtonBar.scrollLeft;
			var drawerWidth = instance.drawerButtonBar.clientWidth - instance.drawerButtons[0].clientWidth - instance.drawerButtons[1].clientWidth;
			var drawerButtonWidth = instance.drawerButtonSlider.clientWidth;

			if (drawerButtonWidth <= drawerWidth) return;
			
			var scrollable = drawerButtonWidth - drawerWidth;

			if (direction === 'right' && position < scrollable) {
				instance.drawerButtonBar.scrollLeft = position + 4;
			} else if (direction === 'left' && position > 0) {
				instance.drawerButtonBar.scrollLeft = position - 4;
			}
		}

		function scroll_listen(e, direction) {
			e.preventDefault();
			var scrolling = true;

			function scroll() {
				drawer_scroll(instanceNum, direction);
				if (scrolling) setTimeout(scroll, 10);
			}

			function stopScroll() {
				window.removeEventListener('mouseup', stopScroll);
				window.removeEventListener('touchend', stopScroll);
				scrolling = false;
			}

			window.addEventListener('mouseup', stopScroll);
			window.addEventListener('touchend', stopScroll);
			scroll();
		}

		function makeDrawer(id, name, drawerNum) {
			var button = document.createElement('div');
			button.classList.add('sb_drawer');
			button.classList.add('sb_button');
			button.appendChild(document.createTextNode(name));

			button.addEventListener('click', function() {
				openDrawer(instanceNum, id);
			});

			var content = document.createElement('div');
			content.classList.add('sb_drawer');
			content.classList.add('sb_content');

			var sticker, i;
			if (name !== 'Backdrops') {
				for (i = 0; i < instance.stickers[name].length; i++) {
					sticker = instance.stickers[name][i];
					sticker.image.onclick = stickerClickFunc(i);
					content.appendChild(sticker.image);
				}
			} else {
				for (i = 0; i < instance.backdrops.length; i++) {
					sticker = instance.backdrops[i];
					sticker.onclick = backdropClickFunc(i);
					content.appendChild(sticker);
				}
			}

			instance.drawerNodes.button[id] = button;
			instance.drawerNodes.content[id] = content;
			drawerButtonSlider.appendChild(button);
			drawerContentWrapper.appendChild(content);

			function stickerClickFunc(stickerNum) {
				return function() { createObject(instanceNum, name, stickerNum); };
			}

			function backdropClickFunc(stickerNum) {
				return function() { instance.backdrop = instance.backdrops[stickerNum]; render(instanceNum); closeDrawers(instanceNum); };
			}
		}
	}

	function prepareStyles(stylesObj) {
		stylesObj = stylesObj || {};

		var SS = styles;

		/* applicationBG */ 				SS = SS.replace(/#100000/g, stylesObj.applicationBG || '#262626');
		
		/* leftBarBG */ 					SS = SS.replace(/#100001/g, stylesObj.leftBarBG || '#333333');
		/* leftBarButtons */ 				SS = SS.replace(/#100002/g, stylesObj.leftBarButtons || '#333333');
		/* leftBarButtonsHover */ 			SS = SS.replace(/#100003/g, stylesObj.leftBarButtonsHover || '#000000');
		/* leftBarButtonsActive */ 			SS = SS.replace(/#100004/g, stylesObj.leftBarButtonsActive || '#FF1A73');
		/* leftBarIcons */ 					SS = SS.replace(/#100005/g, stylesObj.leftBarIcons || '#999999');
		/* leftBarIconsHover */ 			SS = SS.replace(/#100006/g, stylesObj.leftBarIconsHover || '#FFFFFF');
		/* leftBarIconsActive */ 			SS = SS.replace(/#100007/g, stylesObj.leftBarIconsActive || '#FFFFFF');
		/* leftBarShadow */ 				SS = SS.replace(/0px 0px 0px #100001/g, stylesObj.leftBarShadow || '0px 0px 5px rgba(0, 0, 0, 0.5)');

		/* rightBarBG */ 					SS = SS.replace(/#100011/g, stylesObj.rightBarBG || '#333333');
		/* rightBarButtons */ 				SS = SS.replace(/#100012/g, stylesObj.rightBarButtons || '#333333');
		/* rightBarButtonsHover */ 			SS = SS.replace(/#100013/g, stylesObj.rightBarButtonsHover || '#000000');
		/* rightBarButtonsActive */ 		SS = SS.replace(/#100014/g, stylesObj.rightBarButtonsActive || '#FF1A73');
		/* rightBarIcons */ 				SS = SS.replace(/#100015/g, stylesObj.rightBarIcons || '#999999');
		/* rightBarIconsHover */ 			SS = SS.replace(/#100016/g, stylesObj.rightBarIconsHover || '#FFFFFF');
		/* rightBarIconsActive */ 			SS = SS.replace(/#100017/g, stylesObj.rightBarIconsActive || '#FFFFFF');
		/* rightBarShadow */ 				SS = SS.replace(/0px 0px 0px #100011/g, stylesObj.rightBarShadow || '0px 0px 5px rgba(0, 0, 0, 0.5)');

		/* tooltipText */ 					SS = SS.replace(/#100021/g, stylesObj.tooltipText || '#333333');
		/* tooltipBG */ 					SS = SS.replace(/#100022/g, stylesObj.tooltipBG || '#FFF41A');

		/* drawerBarBG */ 					SS = SS.replace(/#100031/g, stylesObj.drawerBarBG || '#333');
		/* drawerBarButtons */ 				SS = SS.replace(/#100032/g, stylesObj.drawerBarButtons || '#333');
		/* drawerBarButtonsHover */ 		SS = SS.replace(/#100033/g, stylesObj.drawerBarButtonsHover || '#222');
		/* drawerBarButtonsActive */ 		SS = SS.replace(/#100034/g, stylesObj.drawerBarButtonsActive || '#111');
		/* drawerBarText */ 				SS = SS.replace(/#100035/g, stylesObj.drawerBarText || '#AAA');
		/* drawerBarTextHover */ 			SS = SS.replace(/#100036/g, stylesObj.drawerBarTextHover || '#FFF');
		/* drawerBarTextActive */ 			SS = SS.replace(/#100037/g, stylesObj.drawerBarTextActive || '#FFF');
		/* drawerBarShadow */ 				SS = SS.replace(/0px 0px 0px #100031/g, stylesObj.drawerBarShadow || '0px 0px 5px rgba(0, 0, 0, 0.5)');

		/* drawerBG */ 						SS = SS.replace(/#100041/g, stylesObj.drawerBG || '#111');

		/* scrollButtons */ 				SS = SS.replace(/#100051/g, stylesObj.scrollButtons || '#333');
		/* scrollButtonsBorders */ 			SS = SS.replace(/#100052/g, stylesObj.scrollButtonsBorders || '#222');
		/* scrollButtonsIcons */ 			SS = SS.replace(/#100053/g, stylesObj.scrollButtonsIcons || '#999');
		/* scrollButtonsHover */ 			SS = SS.replace(/#100054/g, stylesObj.scrollButtonsHover || '#222');
		/* scrollButtonsBordersHover */ 	SS = SS.replace(/#100055/g, stylesObj.scrollButtonsBordersHover || '#222');
		/* scrollButtonsIconsHover */ 		SS = SS.replace(/#100056/g, stylesObj.scrollButtonsIconsHover || '#FFF');
		
		/* font */							SS = SS.replace(/Arial/g, stylesObj.font || 'Arial');

		var stylesheet = document.createElement('style');
		stylesheet.type = 'text/css';
		if (stylesheet.styleSheet) {
			stylesheet.styleSheet.cssText = SS;
		} else {
			stylesheet.appendChild(document.createTextNode(SS));
		}
		document.getElementsByTagName('head')[0].appendChild(stylesheet);
	}

	function prepareBackdrops(instanceNum, arr) {
		// Zero the image resources for this instantiation

		// Prepare the onload function so that functions are not defined within a loop
		var loadFunc = function(instanceNum) { return function() {
			var instance = instances[instanceNum];
			instance.imagesLoaded++;
			if (instance.imagesLoaded === instance.images) {
				closePopups(instanceNum);
				reconstructURL(instanceNum);
			}

			render(instanceNum); 
		}; };

		for (var i = 0; i < arr.length; i++) {
			// Only accept paths to images as strings
			if (typeof arr[i] !== 'string') { error('Expected path to image as string. Check your stickers and backdrops properties for proper formatting.'); return; }
			if (!arr[i].match(/\.(jpg|jpeg|png|bmp|svg|gif|webp)$/)) { error('Path to non-image provided. Check the paths in your stickers and backdrops properties.'); return; }
			
			// Turn path into image node
			var src = arr[i];
			arr[i] = new Image();
			arr[i].src = src;
			arr[i].setAttribute('width', 'auto');
			arr[i].setAttribute('height', 'auto');
			arr[i].onload = loadFunc(instanceNum);
		}

		return arr;
	}

	/*
		stickers: {
			'Plants and Animals': [
				{
					name: ,
					src: ,
					widthPercentage: ,
					heightFxWidth:
				}
			]
		}
	*/

	function prepareStickers(instanceNum, obj) {
		var totalStickers = 0;

		// Prepare the onload and guide color functions so that functions are not defined within a loop
		var loadFunc = function(instanceNum, obj, drawer, i) { return function() {
			var instance = instances[instanceNum];
			instance.imagesLoaded++;
			if (instance.imagesLoaded === instance.images) {
				closePopups(instanceNum);
				reconstructURL(instanceNum);
			}

			var sticker = retrieveSticker(obj, drawer, i);
			if (!sticker.heightFxWidth) sticker.heightFxWidth = (sticker.image.naturalHeight || sticker.image.height) / (sticker.image.naturalWidth || sticker.image.width) || 1;
			render(instanceNum);
		}; };

		var guideFunc = function() {
			var guideColors = instances[instanceNum].guideColors;
			return guideColors[Math.floor(Math.random() * guideColors.length)];
		};

		var retrieveSticker = function(obj, drawer, i) { return obj[drawer][i]; };

		if (typeof obj !== 'object') { error('Invalid image object provided for stickers.'); return; }

		// Handle each drawer
		for (var drawer in obj) {
			if (typeof obj[drawer] !== 'object' || obj[drawer].length < 0) { error('Did not find expected array of paths in stickers object.'); return; }
			
			// Handle each sticker in this drawer
			var source;
			var sticker;
			for (var i = 0; i < obj[drawer].length; i++) {

				sticker = obj[drawer][i];

				// Ensure name is present
				if (typeof sticker.name !== 'string') { error('Sticker needs a name.'); return; }
				sticker.hash = nameHash(sticker.name);

				// Create image node
				sticker.image = new Image();
				sticker.image.src = sticker.src;
				sticker.image.alt = sticker.name;
				sticker.image.draggable = false;
				sticker.image.setAttribute('width', 'auto');
				sticker.image.setAttribute('height', 'auto');
				sticker.image.onload = loadFunc(instanceNum, obj, drawer, i);

				// Set width percentage
				if (!sticker.widthPercentage) sticker.widthPercentage = 20;
				if (typeof sticker.widthPercentage !== 'number' || sticker.widthPercentage < 1) { error('Sticker widthPercentage must be a number greater than 1.'); return; }

				// Set height as a function of width
				if (!!sticker.heightFxWidth && typeof sticker.heightFxWidth !== 'number') { error('Sticker heightFxWidth must be a number.'); return; }

				// Set location
				if (!sticker.left) sticker.left = 'center';
				if (!sticker.top) sticker.top = 'center';
				if ((typeof sticker.left !== 'number' && typeof sticker.left !== 'string') || (typeof sticker.left === 'string' && sticker.left !== 'center')) { error('Sticker left must be a number (as a percentage) or the string "center".'); return; }
				if ((typeof sticker.top !== 'number' && typeof sticker.top !== 'string') || (typeof sticker.top === 'string' && sticker.top !== 'center')) { error('Sticker top must be a number (as a percentage) or the string "center".'); return; }

				// Set angle
				if (!sticker.angle) sticker.angle = 0;
				if (typeof sticker.angle !== 'number' || sticker.angle < 0 || sticker.angle > 360) { error('Sticker angle must be a number 0-360.'); return; }

				// Assign layer helper function if necessary
				if (!sticker.guideColor) sticker.guideColor = guideFunc;
				if (typeof sticker.guideColor !== 'function' && typeof sticker.guideColor !== 'string') { error('Expected a function or hex string for sticker guide color.'); return; }
				if (typeof sticker.guideColor === 'string' && !sticker.guideColor.match(/#?[a-f\d]{6}/i)) { error('Invalid guide color. Expected a hex string.'); return; }
				if (typeof sticker.guideColor === 'string') {
					sticker.guideColor = hexToRGB(sticker.guideColor);
				}

				totalStickers++;

			}

		}

		return [obj, totalStickers];
	}

	function checkActions(actions) {
		if (!actions) return {};
		if (typeof actions !== 'object') { error('Custom actions expects an object.'); return {}; }

		/*actions: {
			'custom': {
				icon: 'fa-cog',
				tooltip: 'Custom Action',
				action: function(data) {
					console.log(data);
				}
			}
		}*/
		for (var customAction in actions) {
			if (typeof actions[customAction] !== 'object') { error('Each custom action must be an object.'); return {}; }
			if (typeof actions[customAction].icon !== 'string') { error('Please specify a Font Awesome class for your custom action\'s icon property.'); return {}; }
			if (typeof actions[customAction].tooltip !== 'string') { error('Please pass a string for your custom action\'s tooltip property.'); return {}; }
			if (typeof actions[customAction].action !== 'function') { error('Please pass a function for your custom action\'s action property.'); return {}; }
		}

		return actions;
	}

	public = function(args) {
		// Check the passed args and return helpful hints
		if (typeof args.target !== 'string') { error('No target!'); return; }
		if (typeof args.stickers !== 'object') { error('No stickers were specified!'); return; }
		if (typeof args.backdrops !== 'object') { error('No backdrops were specified!'); return; }
		if (!!args.maxWidth && typeof args.maxWidth !== 'number') { error('maxWidth needs to be in pixels'); return; }
		if (!!args.styles) {
			if (!!args.styles.guideColors && typeof args.style.guideColors !== 'object') { error('guideColors should be an array of hex values'); return; }
			if (!!args.styles.guideOpacity && typeof args.style.guideOpacity !== 'number') { error('guideOpacity must be a number 0-1'); return; }
		}
		
		// Check for pre-existing canvas
		if (!!document.querySelector(args.container + ' canvas')) error('Canvas already present in specified container');
		
		var instanceNum = instances.length;

		// Set up the container
		var target = document.querySelector(args.target);
		var container = document.createElement('div');
		container.classList.add('stickerbomb');
		target.appendChild(container);
		
		// Set up the canvas
		var canvas = document.createElement('canvas');
		canvas.classList.add('sb_canvas');
		canvas.setAttribute('width', '' + (args.maxWidth ? args.maxWidth : 800));
		container.appendChild(canvas);
		
		// Set up the context
		var context = canvas.getContext('2d');
		
		// Prepare stickers and backdrops
		var backdrops = prepareBackdrops(instanceNum, args.backdrops);
		var stickers = prepareStickers(instanceNum, args.stickers);
		
		// Check custom tools and actions
		var tools = {};
		var actions = checkActions(args.actions);

		// Set up the stylesheet for this instance
		prepareStyles(args.styles);

		// Prepare guide colors
		var guideColors = [
			'255,244,26'
		];
		if (!!args.styles && !!args.styles.guideColors) guideColors = args.styles.guideColors.map(function(element) { return hexToRGB(element); });

		var guideOpacity = 0.8;
		if (!!args.styles && !!args.styles.guideOpacity) {
			guideOpacity = args.styles.guideOpacity;
		}

		// Prepare guide number color
		var guideNumberColor = '#FFFFFF';
		if (!!args.styles && !!args.styles.guideNumberColor) {
			guideNumberColor = args.styles.guideNumberColor;
		}

		// Create the stickerbomb instance to be stored and referenced
		var instance = {
			target: args.target,
			hash: nameHash(args.target),
			container: container,
			aspectRatio: (args.aspectRatio ? ratioToFloat(args.aspectRatio) : 1.55),
			canvas: canvas,
			context: context,
			stickers: stickers[0],
			backdrops: backdrops,
			backdrop: backdrops[0],
			objects: [],
			canvasHCenter: 0,
			canvasVCenter: 0,
			tool: 'move',

			barNodes: {
				toolbar: false,
				actionbar: false,
				drawerbar: false
			},
			hideTools: args.hideTools || false,
			toolNodes: {},
			actionNodes: {},
			actions: actions,
			hideActions: args.hideActions || false,
			drawerNodes: {
				button: {},
				content: {}
			},

			guides: false,
			guideColors: guideColors,
			guideOpacity: guideOpacity,
			guideNumberColor: guideNumberColor,

			outputImageName: args.outputImageName ? args.outputImageName : false,

			images: backdrops.length + stickers[1],
			imagesLoaded: 0,

			render: function() { render(instanceNum); },
			makePopup: function(html) { makePopup(instanceNum, 'createdPopup', html); },
			closePopups: function() { closePopups(instanceNum, false); }
		};

		instances.push(instance);

		// Set up the interface elements
		insertInterface(container, instanceNum);
		selectTool(instanceNum, 'move');
		

		(function() { resize(instanceNum); })();
		window.addEventListener('load', function() { resize(instanceNum); });
		window.addEventListener('resize', function() { resize(instanceNum); });

		canvas.addEventListener('mousedown', function(e) {
			e.preventDefault();
			closeDrawers(instanceNum);
			instances[instanceNum].guides = true;
			setTimeout(function() { render(instanceNum); }, 100); // Only layer-assist if button stays down
			clickStart(instanceNum, e); });

		canvas.addEventListener('touchstart', function(e) {
			closeDrawers(instanceNum);
			instances[instanceNum].guides = true;
			setTimeout(function() { render(instanceNum); }, 100); // Only layer-assist if button stays down
			clickStart(instanceNum, e); });

		canvas.addEventListener('touchmove', function(e) { e.preventDefault(); });

		canvas.addEventListener('mouseup', function() {
			if (guideTool(instances[instanceNum].tool)) {
				return;
			} else {
				instances[instanceNum].guides = false; render(instanceNum);
			}
		});

		canvas.addEventListener('touchend', function() {
			if (guideTool(instances[instanceNum].tool)) {
				return;
			} else {
				instances[instanceNum].guides = false; render(instanceNum);
			}
		});

		makePopup(instanceNum, 'sb_loading', '<i class="fa fa-spin fa-circle-o-notch" style="font-size: 4rem;"></i><br><br>Loading stickers...');

		return instances[instanceNum]; // Return a reference so that updates are possible
	}; // Create new stickerbomb instance

	return public;
}(stickerbomb || {}));