'use strict';

const { h, app } = hyperapp
/** @jsx h */

// Options shown on the keyboard and chosen within a round.
// Must match the keys in AUDIO_SPRITES.x.sprite.
const PITCHES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']

const PITCHES_PER_ROUND = 5

// For now all sprites have identical length/timing.
const STANDARD_AUDIO_SPRITE = {
	'C': [0, 3500],
	'C#': [4000, 3500],
	'D': [8000, 3500],
	'Eb': [12000, 3500],
	'E': [16000, 3500],
	'F': [20000, 3500],
	'F#': [24000, 3500],
	'G': [28000, 3500],
	'G#': [32000, 3500],
	'A': [36000, 3500],
	'Bb': [40000, 3500],
	'B': [44000, 3500]
}

// Played using the Howler audio library
const AUDIO_SPRITES = {
	'epiano': {
		url: 'audio/sprites/epiano.mp3',
		sprite: STANDARD_AUDIO_SPRITE,
	},
	'piano': {
		url: 'audio/sprites/piano.mp3',
		sprite: STANDARD_AUDIO_SPRITE,
	},
	'bells': {
		url: 'audio/sprites/synth-bells.mp3',
		sprite: STANDARD_AUDIO_SPRITE,
	},
	'strings': {
		url: 'audio/sprites/synth-strings.mp3',
		sprite: STANDARD_AUDIO_SPRITE
	}
}

const SPRITE_PLAYER = new Howl({
	// TODO: set this during the game
	src: [AUDIO_SPRITES['epiano'].url],
	sprite: AUDIO_SPRITES['epiano'].sprite
})

const REACTION_SAMPLES = {
	cheering: [
		{ url: 'audio/freesoundeffects.com/cheer.mp3' }
	],
	applause: [
		{ url: 'audio/freesoundeffects.com/applause3.mp3' },
		{ url: 'audio/freesoundeffects.com/applause7.mp3' }
	],
	meh: [
		{ url: 'audio/freesoundeffects.com/applause8.mp3' },
		{ url: 'audio/freesoundeffects.com/applause10.mp3' }
	],
	booing: [
		{ url: 'audio/freesoundeffects.com/boohiss.mp3' },
		{ url: 'audio/freesoundeffects.com/boo3.mp3' },
		{ url: 'audio/freesoundeffects.com/boos3.mp3' }
	]
}

// Choose a reaction sample based on the % of questions answered correctly
let chooseReactionSample = (percentCorrect) => {
	let category;
	if (percentCorrect === 100) {
		category = REACTION_SAMPLES.cheering
	} else if (percentCorrect >= 70) {
		category = REACTION_SAMPLES.applause
	} else if (percentCorrect >= 50) {
		category = REACTION_SAMPLES.meh
	} else {
		category = REACTION_SAMPLES.booing
	}
	// Choose random within the chosen category
	return (category.length > 0) ? category[Math.floor(Math.random() * category.length)] : null
}

// Play one of the pitches loaded up in the sprite player
let playPitch = (pitch) => {
	SPRITE_PLAYER.play(pitch);
}

// Play a given reaction sample
let playReaction = (reactionSample) => {
	playURL(reactionSample.url)
}

// Play an arbitrary audio file
let playURL = (url) => {
	let sound = new Howl({
		src: [url]
	})
	sound.play()
}

const KeyboardWidget = ({ clickHandler }) =>
	<svg xmlSpace="preserve" width="322px" height="240">
		{/* White keys */}
		<rect style={{ fill: 'white', stroke: 'black' }} x="0" y="0" width="46" height="240" onclick={e => clickHandler('C')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="46" y="0" width="46" height="240" onclick={e => clickHandler('D')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="92" y="0" width="46" height="240" onclick={e => clickHandler('E')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="138" y="0" width="46" height="240" onclick={e => clickHandler('F')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="184" y="0" width="46" height="240" onclick={e => clickHandler('G')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="230" y="0" width="46" height="240" onclick={e => clickHandler('A')} />
		<rect style={{ fill: 'white', stroke: 'black' }} x="276" y="0" width="46" height="240" onclick={e => clickHandler('B')} />

		{/* Black keys */}
		<rect style={{ fill: 'black', stroke: 'black' }} x="28.66666" y="0" width="26" height="160" onclick={e => clickHandler('C#')} />
		<rect style={{ fill: 'black', stroke: 'black' }} x="83.33332" y="0" width="26" height="160" onclick={e => clickHandler('Eb')} />
		<rect style={{ fill: 'black', stroke: 'black' }} x="164.5" y="0" width="26" height="160" onclick={e => clickHandler('F#')} />
		<rect style={{ fill: 'black', stroke: 'black' }} x="216.5" y="0" width="26" height="160" onclick={e => clickHandler('G#')} />
		<rect style={{ fill: 'black', stroke: 'black' }} x="269.5" y="0" width="26" height="160" onclick={e => clickHandler('Bb')} />
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

				<button onclick={actions.playCurrentPitch}>Repeat Note</button>

				<KeyboardWidget clickHandler={actions.handleResponse} />

				<hr />

				Correct: {state.currentRound.numCorrect} - Incorrect: {state.currentRound.numIncorrect}

				<hr />

			</div>

			<button onclick={actions.startRound}>{state.currentRound.currentPitch ? 'Reset' : 'Start'} Round</button>
		</main>,
	actions: {
		// Create a clean state
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

		// Choose questions and ask the first one
		startRound: (state, actions) => {
			state.previousScore = null
			actions.resetRound()

			// Choose random pitches to be used for this round
			while (state.currentRound.pitches.length < PITCHES_PER_ROUND) {
				let pitch = PITCHES[Math.floor(Math.random() * PITCHES.length)]
				if (state.currentRound.pitches.indexOf(pitch) === -1) {
					state.currentRound.pitches.push(pitch)
				}
			}

			actions.advance(state)
		},

		// Ask the next question
		advance: (state, actions) => {
			let nextPitch = state.currentRound.pitches[state.currentRound.responses.length]
			if (nextPitch) {
				let num = state.currentRound.responses.length + 1
				state.currentRound.currentPitch = nextPitch
				state.currentRound.currentQuestion = `Question ${num}: Can you click ${nextPitch}?`
				actions.playCurrentPitch()
				return state
			}

			return actions.endRound(state)
		},

		// Finish up the round
		endRound: (state, actions) => {
			state.previousScore = `Your score is ${state.currentRound.numCorrect} / ${state.currentRound.pitches.length}`

			let percentCorrect = (state.currentRound.numCorrect / state.currentRound.pitches.length) * 100
			let reaction = chooseReactionSample(percentCorrect)
			reaction && playReaction(reaction)

			actions.resetRound()
			return state
		},

		// Play the pitch of the current question
		playCurrentPitch: (state) => {
			if (state.currentRound.currentPitch) {
				playPitch(state.currentRound.currentPitch)
			}
		},

		// Called when the user presses a note on the keyboard to
		// indicate their answer
		handleResponse: (state, actions, responsePitch) => {
			state.currentRound.responses.push(responsePitch);
			if (responsePitch == state.currentRound.currentPitch) {
				state.currentRound.numCorrect++;
			} else {
				state.currentRound.numIncorrect++;
			}
			return actions.advance(state)
		}
	}
})