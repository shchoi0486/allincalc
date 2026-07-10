'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const MORSE_MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
  G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
  M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
  ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-',
  '@': '.--.-.', ' ': '/',
};

const REVERSE_MAP: Record<string, string> = {};
Object.entries(MORSE_MAP).forEach(([char, morse]) => {
  REVERSE_MAP[morse] = char;
});

function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map(char => MORSE_MAP[char] || char)
    .join(' ');
}

function morseToText(morse: string): string {
  return morse
    .split(' ')
    .map(code => {
      if (code === '/') return ' ';
      return REVERSE_MAP[code] || code;
    })
    .join('');
}

function playMorse(morse: string) {
  const ctx = new AudioContext();
  let time = ctx.currentTime;
  const dotDuration = 0.08;
  const dashDuration = dotDuration * 3;
  const symbolGap = dotDuration;
  const letterGap = dotDuration * 3;

  morse.split('').forEach(symbol => {
    if (symbol === '.') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 600;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dotDuration);
      osc.start(time);
      osc.stop(time + dotDuration);
      time += dotDuration + symbolGap;
    } else if (symbol === '-') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 600;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dashDuration);
      osc.start(time);
      osc.stop(time + dashDuration);
      time += dashDuration + symbolGap;
    } else if (symbol === ' ') {
      time += letterGap;
    }
  });
}

const MorseCode = () => {
  const [mode, setMode] = useState<'textToMorse' | 'morseToText'>('textToMorse');
  const [textInput, setTextInput] = useState('');
  const [morseInput, setMorseInput] = useState('');
  const [result, setResult] = useState('');

  const convert = () => {
    if (mode === 'textToMorse') {
      const morse = textToMorse(textInput);
      setResult(morse);
    } else {
      const text = morseToText(morseInput);
      setResult(text);
    }
  };

  const playSound = () => {
    if (result && mode === 'textToMorse') {
      playMorse(result);
    } else if (mode === 'morseToText' && morseInput) {
      playMorse(morseInput);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={mode === 'textToMorse' ? 'default' : 'outline'}
          onClick={() => { setMode('textToMorse'); setResult(''); }}
          className="flex-1"
        >
          Text → Morse
        </Button>
        <Button
          variant={mode === 'morseToText' ? 'default' : 'outline'}
          onClick={() => { setMode('morseToText'); setResult(''); }}
          className="flex-1"
        >
          Morse → Text
        </Button>
      </div>

      {mode === 'textToMorse' ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Text input</label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text to convert to Morse code..."
            className="min-h-[100px]"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">Morse code (use dots, dashes, and spaces; / for word gaps)</label>
          <Input
            value={morseInput}
            onChange={(e) => setMorseInput(e.target.value)}
            placeholder=". - .-. / .--. .-.. .- -. . -.-. --- -.. ."
            className="font-mono"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={convert} className="flex-1">Convert</Button>
        <Button variant="outline" onClick={playSound} className="flex-1">Play Sound</Button>
      </div>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">Copy Result</Button>
      <Textarea readOnly value={result} className="min-h-[100px] font-mono text-xs" />
      <p className="text-xs text-muted-foreground text-center">
        {mode === 'textToMorse' ? `${textInput.length} characters → ${result.split(' ').length} symbols` : `${morseInput.split(' ').length} symbols → ${result.length} characters`}
      </p>
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      Enter text or Morse code and click Convert
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>Morse Code Translator</strong> converts between plain text and International Morse Code. Morse code uses dots (.) and dashes (-) to represent letters, numbers, and special characters.
        </p>
        <p>
          This tool supports bidirectional conversion and includes a sound playback feature that generates the actual audio tones for the Morse code pattern.
        </p>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
          <p><strong>A</strong> = .-  |  <strong>B</strong> = -...  |  <strong>C</strong> = -.-.  |  <strong>D</strong> = -..  |  <strong>E</strong> = .</p>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Morse Code Structure:</p>
        <ul className="space-y-2 text-sm">
          <li><strong>Dot (.)</strong> = short signal (1 unit duration)</li>
          <li><strong>Dash (-)</strong> = long signal (3 units duration)</li>
          <li><strong>Letter gap</strong> = 3 units between letters</li>
          <li><strong>Word gap</strong> = 7 units between words (represented by /)</li>
        </ul>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="font-mono text-xs text-center">SOS: ... --- ...</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Morse code is case-insensitive - uppercase and lowercase letters produce the same code.</li>
          <li>Use / (space-slash-space) to separate words in Morse code.</li>
          <li>SOS (... --- ...) is the universal distress signal - recognizable even without knowing Morse code.</li>
          <li>The sound playback uses a 600Hz sine wave, which is the standard frequency for Morse code audio.</li>
        </ul>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="Morse Code Translator"
      description="Convert between text and International Morse Code"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default MorseCode;
