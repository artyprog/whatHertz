(function(){
	"use strict";

	var PITCHES = [
		{ name: 'A', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68437__pinkyfinger__piano-a.wav' },
		{ name: 'Bb', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68439__pinkyfinger__piano-bb.wav' },
		{ name: 'B', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68438__pinkyfinger__piano-b.wav' },
		{ name: 'C', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68441__pinkyfinger__piano-c.wav' },
		{ name: 'C#', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68440__pinkyfinger__piano-c.wav' },
		{ name: 'D', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68442__pinkyfinger__piano-d.wav' },
		{ name: 'Eb', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68444__pinkyfinger__piano-eb.wav' },
		{ name: 'E', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68443__pinkyfinger__piano-e.wav' },
		{ name: 'F', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68446__pinkyfinger__piano-f.wav' },
		{ name: 'F#', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68445__pinkyfinger__piano-f.wav' },
		{ name: 'G', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68447__pinkyfinger__piano-g.wav' },
		{ name: 'G#', audio: 'freesound.org/4409__pinkyfinger__piano-notes-1-octave/68448__pinkyfinger__piano-g.wav' }
	];

	var PITCHES_PER_ROUND = 5;

	var roundState = null;

	function startRound() {
		roundState = {
			currentPitch: null,
			numCorrect: 0,
			numIncorrect: 0,
			pitches: [],
			responses: []
		};

		// Choose random pitches to be used for this round
		while (roundState.pitches.length < PITCHES_PER_ROUND) {
			var pitch = PITCHES[Math.floor(Math.random() * PITCHES.length)];
			if (roundState.pitches.indexOf(pitch) === -1) {
				roundState.pitches.push(pitch);
			}
		}

		document.getElementById('last-score').innerHTML = '';

		document.getElementById('round-content').style.display = 'block';

		askNextQuestion();
	}

	function askNextQuestion() {
		var nextPitch = roundState.pitches[roundState.responses.length];
		if (nextPitch) {
			askQuestion(nextPitch);
		} else {
			finishRound();
		}
	}

	function askQuestion(pitch) {
		var num = roundState.responses.length + 1;
		document.getElementById('question').innerHTML = 'Question ' + num + ': Can you click ' + pitch.name + '?';
		roundState.currentPitch = pitch;
		playQuestion(pitch);
	}

	function evalAnswer(answer) {
		if (!roundState.currentPitch) {
			alert('Not ready to accept a response.');
			return;
		}
		roundState.responses.push(answer);
		if (answer == roundState.currentPitch.name) {
			roundState.numCorrect++;
		} else {
			roundState.numIncorrect++;
		}

		updateScoreboard();
		askNextQuestion();
	}

	function updateScoreboard() {
		var correct = roundState ? roundState.numCorrect : 'n/a';
		var incorrect = roundState ? roundState.numIncorrect : 'n/a';
		document.getElementById('num-correct').innerHTML = correct;
		document.getElementById('num-incorrect').innerHTML = incorrect;
	}

	function finishRound() {
		document.getElementById('last-score').innerHTML = 'Your score is ' + roundState.numCorrect + ' / ' + roundState.pitches.length;
		document.getElementById('round-content').style.display = 'none';

		var percentCorrect = (roundState.numCorrect / roundState.pitches.length) * 100;

		var sound;
		if (percentCorrect === 100) {
			sound = 'freesoundeffects.com/cheer.wav';
		} else if (percentCorrect >= 70) {
			sound = 'freesoundeffects.com/applause3.wav';
			// or applause7.wav'
		} else if (percentCorrect >= 50) {
			sound = 'freesoundeffects.com/applause8.wav';
			// or applause10.wav
		} else {
			sound = 'freesoundeffects.com/boo3.wav';
			// or boohiss.wav
			// or boos3.wav
		}
		var url = 'http://erikvorkink.com/temp/audio/' + sound;
		playURL(url);
	}

	function initClickHandlers() {
		document.getElementById('start-round-btn').addEventListener('click', startRound);

		var buttons = document.getElementsByClassName('response-btn');
		for (var i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', onResponseBtnClick, false);
		}
	}

	function onResponseBtnClick(event) {
		if (!event.target) {
			alert('Invalid response.');
			return;
		}
		var response = event.target.getAttribute('data-response');
		if (!response) {
			alert('Invalid response.');
			return;
		}

		evalAnswer(response);
	}

	function playURL(url) {
		var sound = new Howl({
			src: [url],
			html5: true // to bypass CORS for now
		});
		sound.play();
	}

	function playQuestion(pitch) {
		var url = 'http://erikvorkink.com/temp/audio/' + pitch.audio;
		playURL(url);
	}

	initClickHandlers();

})();