'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/I18nProvider';

const randomNames = ['John', 'Jane', 'Alex', 'Sam', 'Chris', 'Pat', 'Morgan', 'Taylor', 'Jordan', 'Casey'];
const randomCities = ['Seoul', 'Tokyo', 'New York', 'London', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Mumbai', 'Dubai'];
const randomEmails = ['user', 'test', 'demo', 'admin', 'hello', 'info', 'contact', 'support', 'sales', 'dev'];

function generateRandomValue(key: string): any {
  const lower = key.toLowerCase();
  if (lower.includes('name') || lower.includes('first')) return randomNames[Math.floor(Math.random() * randomNames.length)];
  if (lower.includes('last')) return randomNames[Math.floor(Math.random() * randomNames.length)];
  if (lower.includes('email')) return `${randomEmails[Math.floor(Math.random() * randomEmails.length)]}@example.com`;
  if (lower.includes('age') || lower.includes('year')) return Math.floor(Math.random() * 60) + 18;
  if (lower.includes('city') || lower.includes('location')) return randomCities[Math.floor(Math.random() * randomCities.length)];
  if (lower.includes('price') || lower.includes('amount') || lower.includes('salary')) return Math.floor(Math.random() * 100000) + 1000;
  if (lower.includes('id')) return Math.floor(Math.random() * 10000) + 1;
  if (lower.includes('active') || lower.includes('enabled')) return Math.random() > 0.3;
  if (lower.includes('date') || lower.includes('time')) return new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  if (lower.includes('score') || lower.includes('rating')) return Math.floor(Math.random() * 100);
  if (lower.includes('status')) return ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)];
  return Math.floor(Math.random() * 1000);
}

const JsonGenerator = () => {
  const { dict, locale } = useI18n();
  const t = dict.jsonGenerator;
  const isKo = locale === 'ko';
  const [itemCount, setItemCount] = useState<number>(3);
  const [keyNames, setKeyNames] = useState('name, age, email, city');
  const [result, setResult] = useState('');

  const generate = () => {
    const keys = keyNames.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keys.length === 0) {
      alert(t.alertMessage);
      return;
    }
    const items = Array.from({ length: itemCount }, (_, i) => {
      const obj: Record<string, any> = {};
      keys.forEach(key => {
        obj[key] = generateRandomValue(key);
      });
      return obj;
    });
    setResult(JSON.stringify(items, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const downloadJSON = () => {
    const blob = new Blob([result], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.itemCountLabel}</label>
        <Input
          type="number"
          min={1}
          max={100}
          value={itemCount}
          onChange={(e) => setItemCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.keyNamesLabel}</label>
        <Input
          value={keyNames}
          onChange={(e) => setKeyNames(e.target.value)}
          placeholder="name, age, email, city"
        />
      </div>
      <Button onClick={generate} className="w-full">{t.button}</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1">{t.copyButton}</Button>
        <Button variant="outline" size="sm" onClick={downloadJSON} className="flex-1">{t.downloadButton}</Button>
      </div>
      <Textarea readOnly value={result} className="min-h-[300px] font-mono text-xs" />
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
          <strong>JSON Generator</strong> creates random JSON data based on your specified key names and number of items. This is useful for testing APIs, prototyping, and filling mock databases.
        </p>
        <p>
          The generator intelligently detects key types from their names (e.g., keys containing "age" will generate numbers, "email" will generate email addresses) and creates realistic sample data.
        </p>
        <TermGlossary items={[
          { term: 'JSON', desc: isKo ? 'JavaScript Object Notation의 약자로, 키와 값의 쌍으로 데이터를 표현하는 가벼운 텍스트 기반 데이터 형식입니다. API 통신과 설정 파일에 널리 쓰입니다.' : 'Short for JavaScript Object Notation, a lightweight text-based data format that represents data as key-value pairs. Widely used for API communication and configuration files.' },
          { term: isKo ? '키-값 쌍(Key-Value Pair)' : 'Key-Value Pair', desc: isKo ? 'JSON에서 데이터를 표현하는 기본 단위입니다. "name": "John"처럼 고유한 키에 해당하는 값을 묶어 데이터의 의미를 정의합니다.' : 'The basic unit of data in JSON. It binds a value to a unique key—like "name": "John"—to define the meaning of the data.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">How it works:</p>
        <ul className="space-y-2 text-sm">
          <li><strong>Key Detection:</strong> The generator analyzes each key name to determine the appropriate data type and format.</li>
          <li><strong>Data Generation:</strong> For each item, random values are generated based on the detected key type.</li>
          <li><strong>Output:</strong> Results are formatted as a valid JSON array with proper indentation.</li>
        </ul>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-center font-mono text-sm">
            {'{'} "name": "John", "age": 28, "email": "user@example.com" {'}'}
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Use descriptive key names so the generator can infer the right data type.</li>
          <li>Keep the number of items reasonable for testing purposes.</li>
          <li>You can copy the output directly or download it as a .json file.</li>
          <li>Use this data for API testing, database seeding, or UI prototyping.</li>
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

export default JsonGenerator;
