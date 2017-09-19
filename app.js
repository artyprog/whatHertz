'use strict';

const { h, app } = hyperapp
/** @jsx h */

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

let chooseReaction = (percentCorrect) => {
	let reactionBucket;
	if (percentCorrect === 100) {
		reactionBucket = AUDIO_SAMPLES.reactions.cheering
	} else if (percentCorrect >= 70) {
		reactionBucket = AUDIO_SAMPLES.reactions.applause
	} else if (percentCorrect >= 50) {
		reactionBucket = AUDIO_SAMPLES.reactions.meh
	} else {
		reactionBucket = AUDIO_SAMPLES.reactions.booing
	}
	// Choose random within the chosen bucket
	return reactionBucket[Math.floor(Math.random() * reactionBucket.length)]
}

let playURL = (url) => {
	let sound = new Howl({
		src: [url]
	})
	sound.play()
}

const KeyboardWidget = ({ clickHandler }) =>
	<svg xmlSpace="preserve" width="161px" height="120">
		{/* White keys */}
		<rect style={{ fill: 'white', stroke: 'black' }} x="0" y="0" width="23" height="120" onclick={e => clickHandler('C')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="23" y="0" width="23" height="120" onclick={e => clickHandler('D')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="46" y="0" width="23" height="120" onclick={e => clickHandler('E')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="69" y="0" width="23" height="120" onclick={e => clickHandler('F')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="92" y="0" width="23" height="120" onclick={e => clickHandler('G')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="115" y="0" width="23" height="120" onclick={e => clickHandler('A')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="138" y="0" width="23" height="120" onclick={e => clickHandler('B')} />

		{/* Black keys */}
		<rect style={{ fill: 'black', stroke: 'black' }} x="14.33333" y="0" width="13" height="80" onclick={e => clickHandler('C#')} />
		<rect style={{ fill: 'black', stroke: 'black' }} x="41.66666" y="0" width="13" height="80" onclick={e => clickHandler('Eb')} />
		<rect style={{ fill: 'black', stroke: 'black' }} x="82.25" y="0" width="13" height="80" onclick={e => clickHandler('F#')} />
		<rect style={{ fill: 'black', stroke: 'black' }} x="108.25" y="0" width="13" height="80" onclick={e => clickHandler('G#')} />
		<rect style={{ fill: 'black', stroke: 'black' }} x="134.75" y="0" width="13" height="80" onclick={e => clickHandler('Bb')} />
	</svg>

app({
	state: {
		previousScore: null,
		currentRound: {
			question: null,
			numCorrect: 0,
			numIncorrect: 0
		}
	},
	view: (state, actions) =>
		<main>
			<h1>What Hertz?</h1>

			<h5 style={{
				display: state.previousScore ? 'block' : 'none'
				}}>
				{state.previousScore}
			</h5>

			<div style={{ display: state.currentRound.currentPitch ? 'block' : 'none' }}>

				<h3>{state.currentRound.currentQuestion}</h3>

				<KeyboardWidget clickHandler={actions.handleResponse} />

				<hr />

				Correct: {state.currentRound.numCorrect} - Incorrect: {state.currentRound.numIncorrect}

				<hr />

			</div>

			<button onclick={actions.startRound}>{state.currentRound.currentPitch ? 'Reset' : 'Start'} Round</button>
		</main>,
	actions: {
		resetRound: (state) => {
			state.currentRound = {
				currentQuestion: null,
				currentPitch: null,
				numCorrect: 0,
				numIncorrect: 0,
				pitches: [],
				responses: [],
				previousRoundScore: null
			}
			return state
		},

		startRound: (state, actions) => {
			state.previousScore = null
			actions.resetRound()

			// Choose random pitches to be used for this round
			while (state.currentRound.pitches.length < PITCHES_PER_ROUND) {
				let pitch = AUDIO_SAMPLES.pitches[Math.floor(Math.random() * AUDIO_SAMPLES.pitches.length)]
				if (state.currentRound.pitches.indexOf(pitch) === -1) {
					state.currentRound.pitches.push(pitch)
				}
			}

			actions.advance(state)
		},

		advance: (state, actions) => {
			let nextPitch = state.currentRound.pitches[state.currentRound.responses.length]
			if (nextPitch) {
				let num = state.currentRound.responses.length + 1
				state.currentRound.currentPitch = nextPitch
				state.currentRound.currentQuestion = `Question ${num}: Can you click ${nextPitch.note}?`
				playURL(nextPitch.url);
				return state
			}

			return actions.endRound(state)
		},

		endRound: (state, actions) => {
			state.previousScore = `Your score is ${state.currentRound.numCorrect} / ${state.currentRound.pitches.length}`

			let percentCorrect = (state.currentRound.numCorrect / state.currentRound.pitches.length) * 100
			let reaction = chooseReaction(percentCorrect)
			playURL(reaction.url)

			actions.resetRound()
			return state
		},

		handleResponse: (state, actions, note) => {
			state.currentRound.responses.push(note);
			if (note == state.currentRound.currentPitch.note) {
				state.currentRound.numCorrect++;
			} else {
				state.currentRound.numIncorrect++;
			}
			return actions.advance(state)
		}
	}
})