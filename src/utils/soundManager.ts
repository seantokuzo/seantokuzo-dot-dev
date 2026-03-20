/**
 * Sound Manager — Web Audio API, procedurally generated sounds.
 * Lazy-initializes AudioContext on first user interaction.
 * No audio files needed — everything is synthesized.
 */

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let _muted = localStorage.getItem('sound-muted') === 'true'

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext()
    masterGain = ctx.createGain()
    masterGain.gain.value = _muted ? 0 : 0.3
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

function getMaster(): GainNode {
  getCtx()
  return masterGain!
}

// --- Public API ---

export function isMuted(): boolean {
  return _muted
}

export function setMuted(muted: boolean): void {
  _muted = muted
  localStorage.setItem('sound-muted', String(muted))
  if (masterGain) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 0.3, ctx!.currentTime, 0.1)
  }
}

export function toggleMute(): boolean {
  setMuted(!_muted)
  return _muted
}

/**
 * UI interaction click — short, subtle tick.
 */
export function playClick(): void {
  if (_muted) return
  const audio = getCtx()
  const master = getMaster()
  const now = audio.currentTime

  const osc = audio.createOscillator()
  const gain = audio.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(880, now)
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.06)

  gain.gain.setValueAtTime(0.15, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

  osc.connect(gain)
  gain.connect(master)
  osc.start(now)
  osc.stop(now + 0.1)
}

/**
 * Interaction chime — melodic two-note arpeggio.
 */
export function playInteract(): void {
  if (_muted) return
  const audio = getCtx()
  const master = getMaster()
  const now = audio.currentTime

  const notes = [523.25, 659.25] // C5, E5

  notes.forEach((freq, i) => {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    const t = now + i * 0.08

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)

    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.12, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)

    osc.connect(gain)
    gain.connect(master)
    osc.start(t)
    osc.stop(t + 0.35)
  })
}

// --- Ambient ocean ---

let oceanNodes: { source: AudioBufferSourceNode; gain: GainNode } | null = null

/**
 * Start ambient ocean loop. Generated pink-ish noise filtered to sound like surf.
 */
export function startOceanAmbience(): void {
  if (_muted || oceanNodes) return
  const audio = getCtx()
  const master = getMaster()

  // Generate 4 seconds of filtered noise
  const sampleRate = audio.sampleRate
  const length = sampleRate * 4
  const buffer = audio.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  // Brown-ish noise with wave-like amplitude modulation
  let lastOut = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    lastOut = (lastOut + 0.02 * white) / 1.02
    // Amplitude modulation for wave crash feel
    const waveMod = 0.5 + 0.5 * Math.sin((i / sampleRate) * Math.PI * 0.8)
    data[i] = lastOut * 3.5 * waveMod
  }

  const source = audio.createBufferSource()
  source.buffer = buffer
  source.loop = true

  // Low-pass filter for muffled ocean feel
  const filter = audio.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 800
  filter.Q.value = 0.7

  const gain = audio.createGain()
  gain.gain.value = 0.4

  source.connect(filter)
  filter.connect(gain)
  gain.connect(master)
  source.start()

  oceanNodes = { source, gain }
}

/**
 * Stop ambient ocean.
 */
export function stopOceanAmbience(): void {
  if (!oceanNodes) return
  const audio = getCtx()
  oceanNodes.gain.gain.setTargetAtTime(0, audio.currentTime, 0.5)
  const nodes = oceanNodes
  oceanNodes = null
  setTimeout(() => {
    try { nodes.source.stop() } catch { /* already stopped */ }
  }, 2000)
}

/**
 * Cleanup — call on unmount to release resources.
 */
export function dispose(): void {
  stopOceanAmbience()
  if (ctx) {
    ctx.close()
    ctx = null
    masterGain = null
  }
}
