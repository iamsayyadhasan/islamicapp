// Node.js script to generate subtle, high-quality PCM WAV sound assets for Islamic Companion
const fs = require('fs');
const path = require('path');

function generateWavBuffer({ sampleRate = 44100, durationSec, sampleFn }) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataByteLength = numSamples * 2; // 16-bit mono = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataByteLength);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataByteLength, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(1, 22); // num channels (1 = mono)
  buffer.writeUInt32LE(sampleRate, 24); // sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate (sampleRate * numChannels * bitsPerSample/8)
  buffer.writeUInt16LE(2, 32); // block align (numChannels * bitsPerSample/8)
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataByteLength, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = sampleFn(t, i, numSamples);
    // clamp to [-1, 1]
    sample = Math.max(-1, Math.min(1, sample));
    // 16-bit PCM integer: -32768 to 32767
    const intSample = Math.round(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// 1. Clock-like Tick: Short, clean, subtle mechanical escapement tick (~75ms, 50-150ms range)
function generateClockTickWav() {
  const sampleRate = 44100;
  const durationSec = 0.075; // 75 ms

  return generateWavBuffer({
    sampleRate,
    durationSec,
    sampleFn: (t, i, total) => {
      // 1.2ms smooth micro-attack to avoid speaker pop while keeping sharp transient
      const attackTime = 0.0012;
      const attack = t < attackTime ? t / attackTime : 1;

      // Escapement impulse: high-frequency transient (2800 Hz) decaying in ~5ms
      const impulseFreq = 2800;
      const impulseDecay = Math.exp(-t / 0.005);
      const impulse = Math.sin(2 * Math.PI * impulseFreq * t) * impulseDecay * 0.55;

      // Clock gear/body resonance: crisp metallic horological tick (1850 Hz + 2450 Hz) decaying over 18ms
      const bodyDecay = Math.exp(-t / 0.018);
      const bodyTone1 = Math.sin(2 * Math.PI * 1850 * t) * 0.6;
      const bodyTone2 = Math.sin(2 * Math.PI * 2450 * t) * 0.4;
      const body = (bodyTone1 + bodyTone2) * bodyDecay * 0.45;

      // Combined subtle clock tick (gentle 0.26 amplitude for quiet prayer setting)
      return (impulse + body) * attack * 0.26;
    },
  });
}

// 2. Target Complete Chime: Subtle, serene harmonic chime (~550ms)
function generateCompleteWav() {
  const sampleRate = 44100;
  const durationSec = 0.55;

  return generateWavBuffer({
    sampleRate,
    durationSec,
    sampleFn: (t, i, total) => {
      // 15ms gentle attack
      const attackTime = 0.015;
      const attack = t < attackTime ? t / attackTime : 1;

      // Exponential decay envelope over 500ms
      const decay = Math.exp(-t / 0.16);

      // Serene warm chords: 528 Hz (calm) + 792 Hz (harmonic fifth) + 1056 Hz (gentle overtone)
      const tone1 = Math.sin(2 * Math.PI * 528 * t);
      const tone2 = Math.sin(2 * Math.PI * 792 * t) * 0.45;
      const tone3 = Math.sin(2 * Math.PI * 1056 * t) * 0.2;

      const combined = (tone1 + tone2 + tone3) / 1.65;

      // Gentle subtle volume (0.28 peak amplitude)
      return combined * attack * decay * 0.28;
    },
  });
}

const outDir = path.resolve(__dirname, '../assets/sounds');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'tasbeeh-tick.wav'), generateClockTickWav());
fs.writeFileSync(path.join(outDir, 'tasbeeh-complete.wav'), generateCompleteWav());

console.log(
  'Successfully generated clock-like tasbeeh-tick.wav (75ms) and tasbeeh-complete.wav in assets/sounds/',
);
