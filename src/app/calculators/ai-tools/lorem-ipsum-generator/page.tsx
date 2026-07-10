'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'ratione', 'sequi', 'nesciunt',
];

const SENTENCE_STARTERS = [
  'Lorem ipsum dolor sit amet', 'Sed ut perspiciatis unde omnis', 'Nemo enim ipsam voluptatem',
  'Neque porro quisquam est', 'Ut enim ad minima veniam', 'Quis autem vel eum iure',
  'At vero eos et accusamus', 'Nam libero tempore', 'Temporibus autem quibusdam',
  'Itaque earum rerum hic tenetur', 'Nam libero tempore cum soluta',
];

function generateWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(): string {
  const length = Math.floor(Math.random() * 10) + 6;
  const words = [SENTENCE_STARTERS[Math.floor(Math.random() * SENTENCE_STARTERS.length)]];
  for (let i = 1; i < length; i++) {
    words.push(generateWord());
  }
  const sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(sentenceCount: number): string {
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
}

const LoremIpsumGenerator = () => {
  const [paragraphCount, setParagraphCount] = useState<number>(3);
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState<number>(5);
  const [result, setResult] = useState('');

  const generate = () => {
    const paragraphs = Array.from(
      { length: paragraphCount },
      () => generateParagraph(sentencesPerParagraph)
    );
    setResult(paragraphs.join('\n\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const wordCount = result ? result.split(/\s+/).length : 0;
  const charCount = result.length;

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Number of paragraphs</label>
        <Input
          type="number"
          min={1}
          max={20}
          value={paragraphCount}
          onChange={(e) => setParagraphCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Sentences per paragraph</label>
        <Input
          type="number"
          min={1}
          max={20}
          value={sentencesPerParagraph}
          onChange={(e) => setSentencesPerParagraph(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
        />
      </div>
      <Button onClick={generate} className="w-full">Generate Lorem Ipsum</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <div className="flex gap-2 text-xs text-muted-foreground justify-center">
        <span>{wordCount} words</span>
        <span>|</span>
        <span>{charCount} characters</span>
        <span>|</span>
        <span>{paragraphCount} paragraphs</span>
      </div>
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">Copy Text</Button>
      <Textarea readOnly value={result} className="min-h-[250px] text-sm leading-relaxed" />
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      Configure options and click Generate to create placeholder text
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>Lorem Ipsum Generator</strong> creates random placeholder text that mimics the structure and appearance of natural language. It's the industry standard for dummy text in design and publishing.
        </p>
        <p>
          The generator creates text with realistic sentence structures, varied paragraph lengths, and natural word flow, making it ideal for testing layouts, typography, and content placement.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Generation Process:</p>
        <ul className="space-y-2 text-sm">
          <li><strong>Word Pool:</strong> Classical Latin words from Cicero's "De Finibus Bonorum et Malorum" (45 BC).</li>
          <li><strong>Sentence Structure:</strong> Varied sentence lengths (6-15 words) with realistic grammar.</li>
          <li><strong>Paragraph Formation:</strong> Multiple sentences joined to form coherent paragraphs.</li>
        </ul>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm italic">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Standard practice is 3-5 paragraphs with 4-8 sentences each for most layout tests.</li>
          <li>Lorem Ipsum helps focus on design and layout rather than content when prototyping.</li>
          <li>The text is derived from Cicero's philosophical work from 45 BC.</li>
          <li>For multilingual projects, consider using localized placeholder text.</li>
        </ul>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="Lorem Ipsum Generator"
      description="Generate random placeholder text for design and testing"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default LoremIpsumGenerator;
