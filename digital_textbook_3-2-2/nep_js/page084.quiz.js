// 'use strict';

/****************************************

	quiz.js -- 18.06.21 -- by spvog

****************************************/


// fetch assessmentItem from html 
var QUIZ = (function () {
	var quiz = {
		start: function () {
			// ZOOM.set();
			/********************************************************************** 
			                              [zoomRate]
			  1. zoomRate를 가져오는 함수 실행 - viewer에서 리사이징하는 경우에 zoomRate가 갱신되는데 시간이 필요하므로 0.5초 뒤 실행되도록 설정
			  2. zoomRate에 영향을 받지 않는 상대적인 값(event.clientX 같은 event value, % 등)에는 zoomRate를 적용하지 않음
			  3. 그 외에 각 element들의 style값(width, height, top, left 등)에 zoomRate를 곱해줌
			    <ex> dot's width * zoomRate
			  4. svg는 내부 element의 위치값이 zoomRate의 영향을 받아 작아지거나/커지므로 zoomRate로 작아진 만큼 다시 키워야 함
			    <ex> x1 = 50 * (1 / zoomRate) 혹은 x1 = 50 / zoomRate
			  5. element 이동 시키기
			    1) element가 마우스의 가운데 위치해야 하는 경우:
			       event의 현재 위치값 - (element의 크기 / 2 * zoomRate)
			    2) element가 가운데 위치하지 않는 경우:
			       (시작지검 * zoomRate) + (event의 현재 위치값 - event가 시작된 위치값)

			**********************************************************************/
			var assess = document.querySelectorAll('assessmentItem');
			[].forEach.call(assess, function(val, idx){
				val.setAttribute('quiz-index', idx+1);
				new Quiz(val);
			});
		},
		correctCheck: function (curQuiz) {

			if (gVar.quizCheckAnswer)
			{
				// ------------------------------------------------------------------ //
					console.log('correct: ', curQuiz.isCorrect);
					console.log('itemObject: ', curQuiz.container);
					console.log('value: ', curQuiz.answer);
					console.log('userValue: ', curQuiz.userValue);
					console.log('description: ', curQuiz.description);
					console.log('pageNumber: ', curQuiz.pageNumber);
				// ------------------------------------------------------------------ //
				
				if (gVar.quizSendAnswer)
				{
					DTCaliperSensor.fire({
						correct: curQuiz.isCorrect, // 정답 여부입력 [true, false] 중에서 택일
						itemObject: curQuiz.container, // 해당 문항 객체
						value: curQuiz.answer, // 실제 정답 데이터 입력 <correctResponse>에 입력된 값이랑 동일
						userValue: curQuiz.userValue, // 유저가 실제로 입력한 값
						description: curQuiz.description, // 문항에 대한 설명
						pageNumber: curQuiz.pageNumber // 교과서 페이지 번호 값
					});
				}
			}
		},
		resetUserValue: function (input) {
			var passId = [];
			input.forEach(function(val, idx){
				val.checked = false;
				passId.push(val.id);
			});
			// delete user input data
			// if (parent.API_ANNOTATION_INPUT_DELETE) parent.API_ANNOTATION_INPUT_DELETE(passId.join(','));
		}
	}
	quiz.start();
	return quiz;
})();

function Quiz (container) {
	this.container = container;
	this.type = container.getAttribute('data-response-type');
	this.pageNumber = container.getAttribute('data-page-number');
	this.description = container.getAttribute('data-description');
	this.answer = container.querySelector('correctResponse').innerText;
	this.hintBox = container.querySelector('modalFeedback');
	this.hintBtn = container.querySelector('.hintBtn');
	this.answerBtn = container.querySelector('.answerBtn');
	this.resetBtn = container.querySelector('.resetBtn');
	this.userValue = null;
	this.isCorrect = false;

	this.choiceQuiz = function () {
		switch (this.type) {
			case 'singleChoice': new SINGLECHOICE(this); break;
			case 'multipleChoice': new MULTICHOICE(this); break;
			case 'True/False': new TRUEFALSE(this); break;
			case 'fillInTheBlank': new FILLINTHEBLANK(this); break;
			case 'drawLine': new DRAWLINE(this); break;
		}
	}
	this.toggleHint = function () {
		if (this.hintBox.style.display !== 'block') {
			this.hintBox.style.display = 'block';
			this.hintBtn.innerHTML = '힌트 닫기';
		}
		else {
			this.hintBox.style.display = 'none';
			this.hintBtn.innerHTML = '힌트 보기';
		}
	}
	this.insertCorrect = function () {
		this.container.classList.add('complete');
		QUIZ.correctCheck(this);
        this.answerBtn.style.display = "none";
        this.resetBtn.style.display = "block";
	}
	this.resetUserValue = function (input) {
		QUIZ.resetUserValue(input);
        this.answerBtn.style.display = "block";
        this.resetBtn.style.display = "none";
    }

	// event
	this.hintBtn.addEventListener('click', this.toggleHint.bind(this));
	this.answerBtn.addEventListener('click', this.insertCorrect.bind(this));

	// start
	this.choiceQuiz();
}
// SINGLECHOICE ---------------------------------------------------------------- //
function SINGLECHOICE (quiz) {console.log('SINGLECHOICE Start---------->');

	this.singleChoiceObj = convertArray(quiz.container.querySelectorAll('.singleChoiceObj'));
	this.checkImg = convertArray(quiz.container.querySelectorAll('.singleChoiceObj .checkImg'));
	this.userValueInput = convertArray(quiz.container.querySelectorAll('.singleChoiceObj .userValueInput'));

	this.watchProperty = function (self) {
		var watch = setInterval(function () {
			for (var i = 0; i < self.singleChoiceObj.length; i++) {
				var element = self.singleChoiceObj[i].querySelector('.userValueInput');
				if (element.checked === true) {
					self.selectObj(self.singleChoiceObj[i], i);
					clearInterval(watch);
				}
			}
		}, 100);
	}
	this.selectObj = function (obj, index) {
		this.reset();

		var curCheckImg = obj.querySelector('.checkImg');
		var curUserValue = obj.querySelector('.userValueInput');

		obj.classList.add('selected');
		curUserValue.checked = true;
		quiz.userValue = index+1;
		quiz.isCorrect = (quiz.answer == quiz.userValue) ? true : false;
	}
	this.resetObj = function () {
		this.singleChoiceObj.forEach(function(val, idx){
			if (val.classList.contains('selected')) val.classList.remove('selected');
		});
	}
	this.setObj = function () {
		for (var i = 0; i < this.singleChoiceObj.length; i++) {
			this.singleChoiceObj[i].addEventListener('click', this.selectObj.bind(this, this.singleChoiceObj[i], i));
		}
		this.singleChoiceObj[quiz.answer-1].setAttribute('answer', '');
		this.watchProperty(this);
	}
	this.reset = function () {
		this.resetObj();
		quiz.resetUserValue(this.userValueInput);
		quiz.userValue = null;
		quiz.isCorrect = null;
		quiz.container.classList.remove('complete');
	}

	quiz.resetBtn.addEventListener('click', this.reset.bind(this));
	this.setObj();
}
// MULTICHOICE ---------------------------------------------------------------- //
function MULTICHOICE (quiz) {console.log('MULTICHOICE Start---------->');
	this.multiChoiceObj = convertArray(quiz.container.querySelectorAll('.multiChoiceObj'));
	this.checkImg = convertArray(quiz.container.querySelectorAll('.multiChoiceObj .checkImg'));
	this.userValueInput = convertArray(quiz.container.querySelectorAll('.multiChoiceObj .userValueInput'));
	this.quizAnswerArray = (quiz.answer.includes(' ')) ? quiz.answer.replace(' ', '').split(',') : quiz.answer.split(',');
	this.userAnswerArray = [];

	this.watchProperty = function (self) {
		var userValue = [];
		var watch = setInterval(function () {
			for (var i = 0; i < self.multiChoiceObj.length; i++) {
				var element = self.multiChoiceObj[i].querySelector('.userValueInput');
				if (element.checked === true) userValue.push(i+1);
			}
			if (userValue.length > 0) {
				self.selectedObj(userValue);
				clearInterval(watch);
			}
		}, 100);
	}
	this.selectedObj = function (index) {
		var self = this;
		index.forEach(function (val, idx) {
			var obj = self.multiChoiceObj[val-1],
				input = obj.querySelector('.userValueInput');

			obj.classList.add('selected');
			obj.input = true;
		})

		sort(index);
		this.userAnswerArray = index;
		quiz.answer = this.quizAnswerArray.join(', ');
		quiz.userValue = this.userAnswerArray.join(', ');
		quiz.isCorrect = (quiz.answer == quiz.userValue) ? true : false;
	}
	this.toggleObj = function (obj, index) {
		var curCheckImg = obj.querySelector('.checkImg');
		var curUserValue = obj.querySelector('.userValueInput');

		if (curUserValue.checked) {
			obj.classList.remove('selected');
			curUserValue.checked = false;
			if (this.userAnswerArray.includes(index+1)) {
				var self = this;
				this.userAnswerArray.forEach(function (val, idx) {
					if (val == index+1) self.userAnswerArray.splice(idx, 1);
				});
			}
		}
		else {
			obj.classList.add('selected');
			curUserValue.checked = true;
			if (this.userAnswerArray === [] || !this.userAnswerArray.includes(index+1)) this.userAnswerArray.push(index+1);
		}
		
		sort(this.userAnswerArray);
		quiz.answer = this.quizAnswerArray.join(', ');
		quiz.userValue = (this.userAnswerArray.length == 0) ? null : this.userAnswerArray.join(', ');
		quiz.isCorrect = (quiz.answer == quiz.userValue) ? true : false;
	}
	this.resetObj = function () {
		this.multiChoiceObj.forEach(function(val, idx){
			if (val.classList.contains('selected')) val.classList.remove('selected');
		});
	}
	
	this.setObj = function () {
		sort(this.quizAnswerArray);

		for (var i = 0; i < this.multiChoiceObj.length; i++) {
			this.multiChoiceObj[i].addEventListener('click', this.toggleObj.bind(this, this.multiChoiceObj[i], i));
		}
		for (var i = 0; i < this.quizAnswerArray.length; i++) this.multiChoiceObj[this.quizAnswerArray[i]-1].setAttribute('answer', '');

		this.watchProperty(this);
	}
	this.reset = function () {
		this.resetObj();
		quiz.resetUserValue(this.userValueInput);
		quiz.userValue = null;
		quiz.isCorrect = null;
		quiz.container.classList.remove('complete');
		this.userAnswerArray = [];
	}

	quiz.resetBtn.addEventListener('click', this.reset.bind(this));
	this.setObj();
}
// TRUEFALSE ---------------------------------------------------------------- //
function TRUEFALSE (quiz) {console.log('TRUEFALSE Start---------->');

	this.tfChoiceObj = convertArray(quiz.container.querySelectorAll('.tfChoiceObj'));
	this.checkImg = convertArray(quiz.container.querySelectorAll('.tfChoiceObj .checkImg'));
	this.userValueInput = convertArray(quiz.container.querySelectorAll('.tfChoiceObj .userValueInput'));

	this.watchProperty = function (self) {
		var watch = setInterval(function () {
			for (var i = 0; i < self.tfChoiceObj.length; i++) {
				var element = self.tfChoiceObj[i].querySelector('.userValueInput');
				if (element.checked === true) {
					self.selectObj(self.tfChoiceObj[i]);
					clearInterval(watch);
				}
			}
		}, 100);
	}
	this.selectObj = function (obj, index) {
		this.reset();

		var curCheckImg = obj.querySelector('.checkImg');
		var curUserValue = obj.querySelector('.userValueInput');

		obj.classList.add('selected');
		curUserValue.checked = true;
		quiz.userValue = obj.getAttribute('value');
		quiz.isCorrect = (quiz.answer == quiz.userValue) ? true : false;
	}
	this.resetObj = function () {
		[].forEach.call(this.tfChoiceObj, function(val, idx){
			if (val.classList.contains('selected')) val.classList.remove('selected');
		});
	}
	this.setObj = function () {
		for (var i = 0; i < this.tfChoiceObj.length; i++) {
			this.tfChoiceObj[i].addEventListener('click', this.selectObj.bind(this, this.tfChoiceObj[i], i));
		}
		var idx = (quiz.answer == 'true') ? 0 : 1;
		this.tfChoiceObj[idx].setAttribute('answer', '');
		this.watchProperty(this);
	}
	this.reset = function () {
		this.resetObj();
		quiz.resetUserValue(this.userValueInput);
		quiz.userValue = null;
		quiz.isCorrect = null;
		quiz.container.classList.remove('complete');
	}

	quiz.resetBtn.addEventListener('click', this.reset.bind(this));
	this.setObj();
}
// FILLINTHEBLANK ---------------------------------------------------------------- //
function FILLINTHEBLANK (quiz) {console.log('FILLINTHEBLANK Start---------->');

	this.inputContainer = convertArray(quiz.container.querySelectorAll('.inputContainer'));
	this.quizAnswerArray = (quiz.answer.includes(', ')) ? quiz.answer.replace(', ').split(',') : quiz.answer.split(',');

	this.watchProperty = function (self) {
		var watch = setInterval(function () {
			for (var i = 0; i < self.inputContainer.length; i++) {
				var input = self.inputContainer[i].querySelector('input');
				if (input.value !== '') {
					self.keyDown(self.inputContainer[i]);
					clearInterval(watch);
				}
			}
		}, 100);
	}
	this.keyDown = function (obj, index) {
		var curUserValue = obj.querySelector('input').value;

		quiz.userValue = (curUserValue !== '') ? curUserValue : null;
		quiz.isCorrect = (quiz.answer == quiz.userValue) ? true : false;
	}
	this.clearInputValue = function () {
		[].forEach.call(this.inputContainer, function(val, idx){
			var input = val.querySelector('input');
			input.value = '';

			// delete user input data
			if (parent.API_ANNOTATION_INPUT_DELETE) parent.API_ANNOTATION_INPUT_DELETE(input.id);
		});
	}
	this.setInput = function () {
		for (var i = 0; i < this.inputContainer.length; i++) {
			var inputAnswer = this.inputContainer[i].querySelector('.inputAnswer');
			inputAnswer.innerHTML = '정답 : '+ this.quizAnswerArray[i];

			this.inputContainer[i].addEventListener('keyup', this.keyDown.bind(this, this.inputContainer[i]));
		}
		this.watchProperty(this);
	}
	this.reset = function () {
		this.clearInputValue();
		quiz.userValue = null;
		quiz.isCorrect = null;
		quiz.container.classList.remove('complete');
	}

	quiz.resetBtn.addEventListener('click', this.reset.bind(this));
	this.setInput();
}
// DRAWLINE ---------------------------------------------------------------- //
function DRAWLINE (quiz) {console.log('DRAWLINE Start---------->');
	var self = this;

	this.addPosition = {
		left: document.getElementById('container').offsetLeft,
		top: document.getElementById('container').offsetTop,
	};
	this.svgContainer = quiz.container.querySelector('.svgContainer');
	this.startObj = convertArray(quiz.container.querySelectorAll('.startLineContainer > li'));
	this.endObj = convertArray(quiz.container.querySelectorAll('.endLineContainer > li'));
	this.userValueInput = convertArray(quiz.container.querySelectorAll('.userValueInput'));
	this.quizAnswerArray = (quiz.answer.includes(', ')) ? quiz.answer.replace(/, /g, ',').split(',') : quiz.answer.split(',');
	this.userValue = new Array(this.quizAnswerArray.length);
	this.answerMode = 'answer';

	this.watchProperty = function () {
		var watch = setInterval(function () {
			// log('watchProperty');
			for (var i = 0; i < self.endObj.length; i++) {
				//console.log("endObj@watchProperty : "+i);
				var input = self.endObj[i].querySelector('.userValueInput');
				if (input.checked === true) {
					var obj = self.endObj[i];
					var index = obj.getAttribute('end');
					var pairObj = quiz.container.querySelector('.startLineContainer > li[answer="'+index+'"]');
					var pairObjIndex = pairObj.getAttribute('start');
					var curPoint = {
							x1: self.dragDropPoint.start[pairObjIndex-1].x1,
							y1: self.dragDropPoint.start[pairObjIndex-1].y1,
							x2: self.dragDropPoint.end[index-1].x1,
							y2: self.dragDropPoint.end[index-1].y1,
						};

					if (gVar.dragSingleChoice)
					{
						obj.classList.add('active');
						obj.classList.add('correct');
						pairObj.classList.add('active');
						pairObj.classList.add('correct');
					}
					var line = self.createLine();
					self.setLineValue(line, curPoint);

					//log('watchProperty, '+self.endObj[i].getAttribute('end'));
					// checked(self.endObj[i]);
					clearInterval(watch);
				}
			}
		}, 100);

		function checked (obj) {
			var line = self.createLine(),
				index = obj.getAttribute('end'),
				pairObj = quiz.container.querySelector('.startLineContainer > li[answer="'+index+'"]'),
				pairObjIndex = pairObj.getAttribute('start'),
				curPoint = {
					x1: self.dragDropPoint.start[pairObjIndex-1].x1,
					y1: self.dragDropPoint.start[pairObjIndex-1].y1,
					x2: self.dragDropPoint.end[index-1].x1,
					y2: self.dragDropPoint.end[index-1].y1,
				};
			//log(index)
			if (gVar.dragSingleChoice)
			{
				obj.classList.add('active');
				obj.classList.add('correct');
				pairObj.classList.add('active');
				pairObj.classList.add('correct');
			}
			self.setLineValue(line, curPoint);
		}
	}
	this.createLine = function () {
		var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		line.style.visivility = 'visible';
		this.svgContainer.appendChild(line);
		return line;
	}
	this.setLineValue = function (line, curPoint) {
		var zoom = 1/ZOOM.rate;
		line.setAttribute('x1', curPoint.x1*zoom);
		line.setAttribute('y1', curPoint.y1*zoom);
		line.setAttribute('x2', curPoint.x2*zoom);
		line.setAttribute('y2', curPoint.y2*zoom);
		// log((curPoint.x2*zoom)+', '+(curPoint.y2*zoom));
		//console.log((curPoint.x1*zoom)+', '+(curPoint.y1*zoom)+', '+(curPoint.x2*zoom)+', '+(curPoint.y2*zoom));
		//console.dir(line);
	}
	this.correct = function () {
		quiz.userValue = this.userValue.join(', ');
		quiz.isCorrect = (quiz.answer == quiz.userValue) ? true : false;
	}
	this.removeLine = function () {
		var lineArray = [],
			container = this.svgContainer,
			lines = container.querySelectorAll('line');

		for (var i = 0; i < lines.length; i++) if (!lines[i].hasAttribute('answer')) lineArray.push(lines[i]);

		lineArray.forEach(function (val) { container.removeChild(val); });
	}
	this.createAnswerLine = function () {
		for (var i = 0; i < this.quizAnswerArray.length; i++) {
			var line = this.createLine();
			line.setAttribute('answer', '');
			//console.log(this.dragDropPoint.start[i].x1);
			this.setLineValue(line, {
				x1: this.dragDropPoint.start[i].x1,
				y1: this.dragDropPoint.start[i].y1,
				x2: this.dragDropPoint.end[this.quizAnswerArray[i]-1].x1,
				y2: this.dragDropPoint.end[this.quizAnswerArray[i]-1].y1,
			})
		}

		if (!gVar.dragSingleChoice)
		{
			for (var i = 0; i < Object.keys(gVar.dragMultiLine).length; i++)
			{
				if (typeof gVar.dragMultiLine[i+1] != "undefined")
				{
					for (var j = 0; j < gVar.dragMultiLine[i+1].length; j++)
					{
						var line = this.createLine();
						line.setAttribute('answer', '');
						this.setLineValue(line, {
							x1: this.dragDropPoint.start[Object.keys(gVar.dragMultiLine)[i]-1].x1,
							y1: this.dragDropPoint.start[Object.keys(gVar.dragMultiLine)[i]-1].y1,
							x2: this.dragDropPoint.end[gVar.dragMultiLine[i+1][j]-1].x1,
							y2: this.dragDropPoint.end[gVar.dragMultiLine[i+1][j]-1].y1,
						})
					}
				}
			}
		}
	}
	this.setDrag = function () {//log('setDrag');
		var getPoint = {
				start: [
					{x: 90, y: 332},
					{x: 176, y: 332},
					{x: 265, y: 332},
					{x: 362, y: 332},
					{x: 462, y: 332},
				],
				end: [
					{x: 90, y: 377},
					{x: 176, y: 377},
					{x: 265, y: 377},
					{x: 362, y: 377},
					{x: 462, y: 377},
				]
			}
		this.dragDropPoint = { start: [], end: [] };
		this.startObj.forEach(function (val, idx) {
			new DrawLine(self, val);
			val.setAttribute('answer', self.quizAnswerArray[idx]);
			val.setAttribute('start', idx+1);
			//console.log(ZOOM.rate);
			var objInfo = {
				y1: getPoint.start[idx].y*ZOOM.rate,
				x1: getPoint.start[idx].x*ZOOM.rate,
				obj: val,
				type: 'start'
			}
			self.dragDropPoint.start.push(objInfo);
			console.dir(objInfo);
		});

		this.endObj.forEach(function (val, idx) {
			new DrawLine(self, val);
			val.setAttribute('end', idx+1);
			var objInfo = {
				y1: getPoint.end[idx].y*ZOOM.rate,
				x1: getPoint.end[idx].x*ZOOM.rate,
				obj: val,
				type: 'end'
			}
			self.dragDropPoint.end.push(objInfo);
		});
		this.createAnswerLine();
		this.watchProperty();
	}
	this.resetDrag = function () {
		var correct = document.querySelectorAll('.correct');

		for (var i = 0; i < correct.length; i++) {
			correct[i].classList.remove('correct');
			correct[i].classList.remove('active');
		}
	}
	this.reset = function () {
		this.removeLine();
		this.resetDrag();
		quiz.resetUserValue(this.userValueInput);
		quiz.userValue = null;
		quiz.isCorrect = null;
		quiz.container.classList.remove('complete');
		this.answerMode = 'answer';
	}
	// 2018.08.28 add answer toggle
	this.answerToggle = function () {
		if (this.answerMode == 'answer')
        {
            this.answerMode = 'reset';
        }
		else
        {
			this.answerMode = 'answer';
			quiz.container.classList.remove('complete');
		}
	}

	quiz.resetBtn.addEventListener('click', this.reset.bind(this));
	// 2018.08.28 add answer toggle
	quiz.answerBtn.addEventListener('click', this.answerToggle.bind(this));
	loadScriptFile('./nep_js/keris2.drawLine.js', function(){
		//console.log("loadScriptFile");
		//console.log("ZOOM.rate:"+ZOOM.rate);
		var interval = setInterval(function(){//log("ZOOM.rate:"+ZOOM.rate);
			if (ZOOM.rate) {
				clearInterval(interval);
				self.setDrag();
			}
		}, 10);
	});
}

