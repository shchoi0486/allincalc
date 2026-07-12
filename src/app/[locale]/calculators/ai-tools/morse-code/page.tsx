'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n/I18nProvider';

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
  const { dict, locale } = useI18n();
  const t = dict.morseCode;
  const isKo = locale === 'ko';
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
          {t.textToMorse}
        </Button>
        <Button
          variant={mode === 'morseToText' ? 'default' : 'outline'}
          onClick={() => { setMode('morseToText'); setResult(''); }}
          className="flex-1"
        >
          {t.morseToText}
        </Button>
      </div>

      {mode === 'textToMorse' ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.textInputLabel}</label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t.textInputPlaceholder}
            className="min-h-[100px]"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.morseInputLabel}</label>
          <Input
            value={morseInput}
            onChange={(e) => setMorseInput(e.target.value)}
            placeholder={t.morseInputPlaceholder}
            className="font-mono"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={convert} className="flex-1">{t.convertButton}</Button>
        <Button variant="outline" onClick={playSound} className="flex-1">{t.playButton}</Button>
      </div>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">{t.copyButton}</Button>
      <Textarea readOnly value={result} className="min-h-[100px] font-mono text-xs" />
      <p className="text-xs text-muted-foreground text-center">
        {mode === 'textToMorse'
          ? t.statsTextToMorse.replace('{chars}', String(textInput.length)).replace('{symbols}', String(result.split(' ').length))
          : t.statsMorseToText.replace('{symbols}', String(morseInput.split(' ').length)).replace('{chars}', String(result.length))
        }
      </p>
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      {t.emptyPrompt}
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
        <TermGlossary items={[
          { term: isKo ? '모스 부호' : 'Morse Code', desc: isKo ? '짧은 신호(점)와 긴 신호(대시)의 조합으로 문자, 숫자, 기호를 나타내는 통신 부호입니다.' : 'A communication code that represents letters, numbers, and symbols using a combination of short signals (dots) and long signals (dashes).' },
          { term: isKo ? '점(Dot)과 대시(Dash)' : 'Dot and Dash', desc: isKo ? '모스 부호를 구성하는 두 가지 기본 신호입니다. 점은 1단위, 대시는 3단위의 길이로 발신되며, 이 조합으로 각 문자를 구분합니다.' : 'The two basic signals that make up Morse code. A dot is sent at 1 unit length and a dash at 3 units; their combinations distinguish each character.' },
          { term: isKo ? '국제 모스 부호' : 'International Morse Code', desc: isKo ? '전 세계에서 통용되는 모스 부호 표준입니다. 문자·숫자뿐 아니라 단어 사이 구분 기호(/) 등이 정해져 있습니다.' : 'The internationally recognized Morse code standard. It defines characters, numbers, and the word separator (/) among others.' },
        ]} />
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
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
      variant="split"
     />
  );
};

export default MorseCode;
