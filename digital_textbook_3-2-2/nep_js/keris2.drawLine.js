// 'use strict';

/******************************************

	drawLine.js -- 18.06.21 -- by spvog

******************************************/

function DrawLine (DRAWLINE, dragObj) {
	this.contentsArea = document.querySelector('.contentsArea');
	this.addPosition = DRAWLINE.addPosition;
	this.userValue = DRAWLINE.userValue;
	this.svgContainer = DRAWLINE.svgContainer;
	this.dragDropPoint = DRAWLINE.dragDropPoint;
	this.setLineValue = DRAWLINE.setLineValue;
	this.createLine = DRAWLINE.createLine;
	this.correct = DRAWLINE.correct;
	
	dragObj.addEventListener('mousedown', this.startDrag.bind(this, dragObj));
	dragObj.addEventListener('touchstart', this.startDrag.bind(this, dragObj));
	dragObj.addEventListener('touchend', this.dragCorrect.bind(this, dragObj));
}
DrawLine.prototype.startDrag = function (dragObj) {
	var self = this;
	
	this.data = this.getDragDropData(dragObj);
	this.svgContainer.style.zIndex = 5;
	if (gVar.dragSingleChoice)
	dragObj.classList.add('active');

	this.contentsArea.addEventListener('touchmove', function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

	this.contentsArea.addEventListener('mousemove', move);
	this.contentsArea.addEventListener('touchmove', move);
	this.contentsArea.addEventListener('mouseup', end);
	this.contentsArea.addEventListener('touchend', end);

	this.addDropEvent(this.dragDropPoint[this.data.pair.type]);

	function move (e) {

		//console.log(e.clientX, e.clientY);

		var viewportOffset = document.getElementsByClassName("contentsArea")[0].getBoundingClientRect();
		// these are relative to the viewport, i.e. the window
		var top_ = viewportOffset.top + gVar.dragAdjY;
		var left_ = viewportOffset.left + gVar.dragAdjX;
		//console.log(top_, left_);
	
		self.data.curPoint.y2 = (event.type == 'touchmove') ? event.touches[0].clientY - top_ : e.clientY - top_;
		self.data.curPoint.x2 = (event.type == 'touchmove') ? event.touches[0].clientX - left_ : e.clientX - left_;
		self.setLineValue(self.data.line, self.data.curPoint);
	}
	function end () {
		self.contentsArea.removeEventListener('mousemove', move);
		self.contentsArea.removeEventListener('touchmove', move);
		self.contentsArea.removeEventListener('mouseup', end);
		self.contentsArea.removeEventListener('touchend', end);

		self.svgContainer.style.zIndex = 0;
		self.removeDropEvent(self.dragDropPoint[self.data.pair.type]);
		dragObj.removeEventListener('touchend', self.dragCorrect.bind(self, dragObj));

		console.dir(self);

		if (self.data.result) {
			self.properdragDropPoint(self.dropObj);

			if (gVar.dragSingleChoice)
			{
				dragObj.classList.add('correct');
				self.dropObj.classList.add('active');
				self.dropObj.classList.add('correct');
			}

			if (gVar.dragSingleChoice)
			{
				var input = (self.dropObj.querySelector('.userValueInput')) ? self.dropObj.querySelector('.userValueInput') : dragObj.querySelector('.userValueInput');
				input.checked = true;

				if (self.data.type === 'start') self.userValue[self.data.index] = self.dropObj.getAttribute(self.data.pair.type);
				else self.userValue[self.data.pair.obj.getAttribute(self.data.pair.type)-1] = self.data.index+1;
			}

			self.correct();
		}
		else {
			self.svgContainer.removeChild(self.data.line);
			dragObj.classList.remove('active');
		}
	}
}
DrawLine.prototype.getDragDropData = function (dragObj) {
	var drag = {}

	drag.type = dragObj.hasAttribute('start') ? 'start' : 'end';
	drag.index = dragObj.getAttribute(drag.type)-1;
	drag.answer = (drag.type === 'start') ? dragObj.getAttribute('answer') : dragObj.getAttribute(drag.type);
	drag.curPoint = this.dragDropPoint[drag.type][drag.index];
	drag.line = this.createLine();
	drag.result = false;

	if (drag.type === 'start') drag.pair = this.dragDropPoint.end[drag.answer-1];
	else for (var i = 0; i < this.dragDropPoint.start.length; i++) {
			if (this.dragDropPoint.start[i].obj.getAttribute('answer') == drag.answer) 
				drag.pair = this.dragDropPoint.start[i];
		}

	return drag;
}
DrawLine.prototype.properdragDropPoint = function (dropObj) {
	var pair = this.data.pair;
	if (gVar.dragSingleChoice)
	{
		this.data.curPoint.y2 = this.dragDropPoint[pair.type][dropObj.getAttribute(pair.type)-1].y1;
		this.data.curPoint.x2 = this.dragDropPoint[pair.type][dropObj.getAttribute(pair.type)-1].x1;
		this.setLineValue(this.data.line, this.data.curPoint);
	}
}
DrawLine.prototype.addDropEvent = function (objArray) {
	for (var i = 0; i < objArray.length; i++) {
		objArray[i].obj.addEventListener('mouseup', this.dragCorrect.bind(this, objArray[i].obj));
		objArray[i].obj.addEventListener('touchend', this.dragCorrect.bind(this, objArray[i].obj));
	}
}
DrawLine.prototype.removeDropEvent = function (objArray) {
	for (var i = 0; i < objArray.length; i++) {
		objArray[i].obj.removeEventListener('mouseup', this.dragCorrect.bind(this, objArray[i].obj));
		objArray[i].obj.removeEventListener('touchend', this.dragCorrect.bind(this, objArray[i].obj));
	}
}
DrawLine.prototype.dragCorrect = function (obj, e) {
	if (e.type === 'touchend') {
		//console.log("touchend");
		if (gVar.dragSingleChoice)
		{
			//console.log("gVar.dragSingleChoice");
			this.dropObj = this.data.pair.obj;
			var answerPoint = {
				x1: this.data.curPoint.x2 > this.data.pair.x1-30,
				x2: this.data.curPoint.x2 < this.data.pair.x1+60,
				y1: this.data.curPoint.y2 > this.data.pair.y1-30,
				y2: this.data.curPoint.y2 < this.data.pair.y1+60,
			}
			if (answerPoint.x1 && answerPoint.x2 && answerPoint.y1 && answerPoint.y2) this.data.result = true;
		}
		else
		{
			console.dir(this.dragDropPoint);

			// WORKING ON......................................................

			this.dragDropPoint["end"].forEach(function (val, idx) {
	
				console.dir(val);

	
				var answerPoint = {
					x1: this.data.curPoint.x2 > this.data.pair.x1-30,
					x2: this.data.curPoint.x2 < this.data.pair.x1+60,
					y1: this.data.curPoint.y2 > this.data.pair.y1-30,
					y2: this.data.curPoint.y2 < this.data.pair.y1+60,
				}
				if (answerPoint.x1 && answerPoint.x2 && answerPoint.y1 && answerPoint.y2) this.data.result = true;
	
			});
		}
	}
	else {
		console.log("touchend else");
		this.dropObj = obj;
		//if (this.data.pair.obj == obj) this.data.result = true;
		//this.data.result = true;

		if (gVar.dragSingleChoice)
		{
			if (this.data.pair.obj == obj) this.data.result = true;
		}
		else
		{
			this.data.result = true;
		}
	}
}