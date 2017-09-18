(function(){
	'use strict';

	const AUDIO_SAMPLES = {
		pitches: [
			{ note: 'A', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68437__pinkyfinger__piano-a.wav' },
			{ note: 'Bb', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68439__pinkyfinger__piano-bb.wav' },
			{ note: 'B', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68438__pinkyfinger__piano-b.wav' },
			{ note: 'C', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68441__pinkyfinger__piano-c.wav' },
			{ note: 'C#', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68440__pinkyfinger__piano-c.wav' },
			{ note: 'D', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68442__pinkyfinger__piano-d.wav' },
			{ note: 'Eb', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68444__pinkyfinger__piano-eb.wav' },
			{ note: 'E', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68443__pinkyfinger__piano-e.wav' },
			{ note: 'F', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68446__pinkyfinger__piano-f.wav' },
			{ note: 'F#', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68445__pinkyfinger__piano-f.wav' },
			{ note: 'G', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68447__pinkyfinger__piano-g.wav' },
			{ note: 'G#', url: 'audio/freesound.org/4409__pinkyfinger__piano-notes-1-octave/68448__pinkyfinger__piano-g.wav' }
		],
		reactions: {
			cheering: [
				{ url: 'audio/freesoundeffects.com/cheer.wav' }
			],
			applause: [
				{ url: 'audio/freesoundeffects.com/applause3.wav' },
				{ url: 'audio/freesoundeffects.com/applause7.wav' }
			],
			meh: [
				{ url: 'audio/freesoundeffects.com/applause8.wav' },
				{ url: 'audio/freesoundeffects.com/applause10.wav' }
			],
			booing: [
				{ url: 'audio/freesoundeffects.com/boohiss.wav' },
				{ url: 'audio/freesoundeffects.com/boo3.wav' },
				{ url: 'audio/freesoundeffects.com/boos3.wav' }
			]
		}
	};

	const PITCHES_PER_ROUND = 5;

	let roundState = null;

	let startRound = () => {
		roundState = {
			currentPitch: null,
			numCorrect: 0,
			numIncorrect: 0,
			pitches: [],
			responses: []
		};

		// Choose random pitches to be used for this round
		while (roundState.pitches.length < PITCHES_PER_ROUND) {
			let pitch = AUDIO_SAMPLES.pitches[Math.floor(Math.random() * AUDIO_SAMPLES.pitches.length)];
			if (roundState.pitches.indexOf(pitch) === -1) {
				roundState.pitches.push(pitch);
			}
		}

		document.getElementById('last-score').innerHTML = '';

		document.getElementById('round-content').style.display = 'block';

		askNextQuestion();
	};

	let askNextQuestion = () => {
		let nextPitch = roundState.pitches[roundState.responses.length];
		if (nextPitch) {
			askQuestion(nextPitch);
		} else {
			finishRound();
		}
	};

	let askQuestion = (pitch) => {
		let num = roundState.responses.length + 1;
		document.getElementById('question').innerHTML = `Question ${num}: Can you click ${pitch.note}?`;
		roundState.currentPitch = pitch;
		playURL(pitch.url);
	};

	let evalAnswer = (answer) => {
		if (!roundState.currentPitch) {
			alert('Not ready to accept a response.');
			return;
		}
		roundState.responses.push(answer);
		if (answer == roundState.currentPitch.note) {
			roundState.numCorrect++;
		} else {
			roundState.numIncorrect++;
		}

		updateScoreboard();
		askNextQuestion();
	};

	let updateScoreboard = () => {
		let correct = roundState ? roundState.numCorrect : 'n/a';
		let incorrect = roundState ? roundState.numIncorrect : 'n/a';
		document.getElementById('num-correct').innerHTML = correct;
		document.getElementById('num-incorrect').innerHTML = incorrect;
	};

	let finishRound = () => {
		document.getElementById('last-score').innerHTML = `Your score is ${roundState.numCorrect} / ${roundState.pitches.length}`;
		document.getElementById('round-content').style.display = 'none';

		let percentCorrect = (roundState.numCorrect / roundState.pitches.length) * 100;

		let reaction = chooseReaction(percentCorrect);
		playURL(reaction.url);
	};

	let chooseReaction = (percentCorrect) => {
		let reactionBucket;
		if (percentCorrect === 100) {
			reactionBucket = AUDIO_SAMPLES.reactions.cheering;
		} else if (percentCorrect >= 70) {
			reactionBucket = AUDIO_SAMPLES.reactions.applause;
		} else if (percentCorrect >= 50) {
			reactionBucket = AUDIO_SAMPLES.reactions.meh;
		} else {
			reactionBucket = AUDIO_SAMPLES.reactions.booing;
		}
		// Choose random within the chosen bucket
		return reactionBucket[Math.floor(Math.random() * reactionBucket.length)];
	};

	let initClickHandlers = () => {
		document.getElementById('start-round-btn').addEventListener('click', startRound);

		let buttons = document.getElementsByClassName('response-btn');
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', onResponseBtnClick, false);
		}
	};

	let onResponseBtnClick = (event) => {
		if (!event.target) {
			alert('Invalid response.');
			return;
		}
		let response = event.target.getAttribute('data-response');
		if (!response) {
			alert('Invalid response.');
			return;
		}

		evalAnswer(response);
	};

	let playURL = (url) => {
		let sound = new Howl({
			src: [url]
		});
		sound.play();
	};

	initClickHandlers();

})();