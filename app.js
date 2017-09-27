'use strict'

const { h, app } = hyperapp
/** @jsx h */


const PITCHES_PER_ROUND = 5

const EMPTY_ROUND = {
	currentPitch: null, // "Bb"
	numCorrect: 0,
	numIncorrect: 0,
	pitches: [], // "F", "A", "D"
	responses: [], // "F", "G#"
}

// Options shown on the keyboard and chosen within a round.
// Must match the keys in AUDIO_SPRITES.x.sprite.
const PITCHES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']

// For now all sprites have identical length/timing
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
		name: 'Electric Piano',
		url: 'audio/sprites/epiano.mp3',
		sprite: STANDARD_AUDIO_SPRITE,
	},
	'piano': {
		name: 'Piano',
		url: 'audio/sprites/piano.mp3',
		sprite: STANDARD_AUDIO_SPRITE,
	},
	'bells': {
		name: 'Bells',
		url: 'audio/sprites/synth-bells.mp3',
		sprite: STANDARD_AUDIO_SPRITE,
	},
	'strings': {
		name: 'Strings',
		url: 'audio/sprites/synth-strings.mp3',
		sprite: STANDARD_AUDIO_SPRITE
	}
}

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
	],
	correct: [
		{ url: 'audio/freesound.org/66136__theta4__ding30603-spedup.mp3' }
	],
	incorrect: [
		{ url: 'audio/freesound.org/21871__nofeedbak__sarahbuzzer.mp3' }
	]
}

let spritePlayer = null

// Load the give audio sprite into the sprite player
const loadAudioSprite = (sprite) => {
	spritePlayer = new Howl({
		src: [sprite.url],
		sprite: sprite.sprite
	})
}

// Choose a reaction sample based on the % of questions answered correctly
const chooseRoundReactionSample = (percentCorrect) => {
	let category
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
const playPitch = (pitch) => {
	if (!spritePlayer) throw 'Invalid sprite player'
	spritePlayer.play(pitch)
}

// Play multiple pitches at once
const playChord = (pitches) => {
	pitches.forEach(pitch => playPitch(pitch))
}

// Play a given reaction sample
const playReaction = (reactionSample) => {
	playURL(reactionSample.url)
}

// Play an arbitrary audio file
const playURL = (url) => {
	let sound = new Howl({
		src: [url]
	})
	sound.play()
}

const InstrumentButtonWidget = ({ instrument, label, activeInstrument, clickHandler }) =>
	<button
		class={`mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect ${instrument === activeInstrument ? 'mdl-button--accent' : ''}`}
		onclick={e => clickHandler(instrument)}>
		{label}
	</button>

const KeyboardWidget = ({ clickHandler }) =>
	<svg id="keyboard" xmlSpace="preserve" width="322px" height="240">
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
		instrument: 'epiano',
		previousScore: null,
		activeRound: EMPTY_ROUND,
		hasActiveRound: false
	},
	view: (state, actions) =>
		<main>
			<h2 style={{ display: state.hasActiveRound ? 'none' : 'block' }}>What Hertz?</h2>
			<h5 style={{ display: state.hasActiveRound ? 'none' : 'block' }}>Name that pitch!</h5>

			<div id="instruments" style={{ display: state.hasActiveRound ? 'none' : 'block' }}>
				{Object.keys(AUDIO_SPRITES).map((instrument) =>
					<InstrumentButtonWidget
						instrument={instrument}
						label={AUDIO_SPRITES[instrument].name}
						activeInstrument={state.instrument}
						clickHandler={actions.setInstrument}
					/>
				)}
			</div>

			<h5 style={{ display: state.previousScore ? 'block' : 'none' }}>
				{state.previousScore}
			</h5>

			<div style={{ display: state.hasActiveRound ? 'block' : 'none' }}>

				<h3 id="question">Pitch # {`${state.activeRound.responses.length + 1}`}</h3>

				<KeyboardWidget clickHandler={actions.handleResponse} />

				<div id="score">
					<span class="mdl-badge" data-badge={`${state.activeRound.numCorrect}`}>Correct</span>
					&nbsp;&nbsp;
					<span class="mdl-badge mdl-badge--no-background"
						data-badge={`${state.activeRound.numIncorrect}`}>Incorrect</span>
				</div>

			</div>

			<div style={{ display: state.hasActiveRound ? 'none' : 'block' }}>
				<button
					class="mdl-button mdl-button--colored mdl-button--raised mdl-js-button mdl-js-ripple-effect"
					onclick={actions.startRound}>
					{state.previousScore ? 'Play Again' : "Let's Play!"}
				</button>
			</div>

			</div>

		</main>,

	events: {
		load(state, actions) {
			// Load up the default instrument
			let sprite = AUDIO_SPRITES[state.instrument]
			loadAudioSprite(sprite)
		}
	},

	actions: {
		setInstrument: (state, actions, instrument) => {
			state.instrument = instrument // "piano"

			let sprite = AUDIO_SPRITES[instrument]
			loadAudioSprite(sprite)
			playChord(['C', 'E', 'G', 'Bb'])

			return state
		},

		// Create a clean state
		resetRound: (state) => {
			state.activeRound = _.cloneDeep(EMPTY_ROUND);
			return state
		},

		// Choose questions and ask the first one
		startRound: (state, actions) => {
			state.previousScore = null
			actions.resetRound()

			// Choose random pitches to be used for this round
			while (state.activeRound.pitches.length < PITCHES_PER_ROUND) {
				let pitch = PITCHES[Math.floor(Math.random() * PITCHES.length)]
				if (state.activeRound.pitches.indexOf(pitch) === -1) {
					state.activeRound.pitches.push(pitch)
				}
			}
			state.hasActiveRound = true
			actions.advance(state)
			return state
		},

		// Ask the next question
		advance: (state, actions) => {
			let nextPitch = state.activeRound.pitches[state.activeRound.responses.length]
			if (nextPitch) {
				state.activeRound.currentPitch = nextPitch
				actions.playCurrentPitch()
				return state
			}

			return actions.endRound(state)
		},

		// Finish up the round
		endRound: (state, actions) => {
			state.previousScore = `You identified ${state.activeRound.numCorrect} ${state.activeRound.numCorrect === 1 ? 'pitch' : 'pitches'} correctly`

			let percentCorrect = (state.activeRound.numCorrect / state.activeRound.pitches.length) * 100
			let reaction = chooseRoundReactionSample(percentCorrect)
			reaction && playReaction(reaction)

			state.hasActiveRound = false
			return state
		},

		// Play the pitch of the current question
		playCurrentPitch: (state) => {
			if (state.activeRound.currentPitch) {
				playPitch(state.activeRound.currentPitch)
			}
		},

		// Called when the user presses a note on the keyboard to
		// indicate their answer
		handleResponse: (state, actions, responsePitch) => {
			state.activeRound.responses.push(responsePitch)

			let reaction
			if (responsePitch == state.activeRound.currentPitch) {
				reaction = REACTION_SAMPLES['correct'][0]
				state.activeRound.numCorrect++
			} else {
				reaction = REACTION_SAMPLES['incorrect'][0]
				state.activeRound.numIncorrect++
			}
			reaction && playReaction(reaction)

			// Wait a bit for the user to process whether their answer
			// was correct or not before moving on.
      		return update => {
      			setTimeout(() => actions.advance(state), 1500)
      		}
		}
	}
})