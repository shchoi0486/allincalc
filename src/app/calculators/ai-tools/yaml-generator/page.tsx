'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const randomNames = ['John', 'Jane', 'Alex', 'Sam', 'Chris', 'Pat', 'Morgan', 'Taylor', 'Jordan', 'Casey'];
const randomCities = ['Seoul', 'Tokyo', 'New York', 'London', 'Paris', 'Berlin', 'Sydney', 'Toronto'];

function generateRandomValue(key: string): string | number | boolean {
  const lower = key.toLowerCase();
  if (lower.includes('name')) return randomNames[Math.floor(Math.random() * randomNames.length)];
  if (lower.includes('age') || lower.includes('year')) return Math.floor(Math.random() * 60) + 18;
  if (lower.includes('email')) return `user${Math.floor(Math.random() * 1000)}@example.com`;
  if (lower.includes('city') || lower.includes('location')) return randomCities[Math.floor(Math.random() * randomCities.length)];
  if (lower.includes('price') || lower.includes('amount')) return Math.floor(Math.random() * 10000) + 100;
  if (lower.includes('id')) return Math.floor(Math.random() * 10000) + 1;
  if (lower.includes('active') || lower.includes('enabled')) return Math.random() > 0.3;
  return Math.floor(Math.random() * 1000);
}

function yamlValue(val: string | number | boolean): string {
  if (typeof val === 'string') return val.includes(':') || val.includes('#') ? `"${val}"` : val;
  return String(val);
}

const YamlGenerator = () => {
  const [itemCount, setItemCount] = useState<number>(3);
  const [keyNames, setKeyNames] = useState('name, age, email, city, active');
  const [result, setResult] = useState('');

  const generate = () => {
    const keys = keyNames.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keys.length === 0) {
      alert('Please enter at least one key name.');
      return;
    }

    let yaml = '---\nitems:\n';

    for (let i = 0; i < itemCount; i++) {
      yaml += `  - id: ${i + 1}\n`;
      keys.forEach(key => {
        const value = generateRandomValue(key);
        yaml += `    ${key}: ${yamlValue(value)}\n`;
      });
    }

    yaml += '...\n';
    setResult(yaml);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const downloadYAML = () => {
    const blob = new Blob([result], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-data.yaml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Number of items</label>
        <Input
          type="number"
          min={1}
          max={100}
          value={itemCount}
          onChange={(e) => setItemCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Key names (comma separated)</label>
        <Input
          value={keyNames}
          onChange={(e) => setKeyNames(e.target.value)}
          placeholder="name, age, email, city"
        />
      </div>
      <Button onClick={generate} className="w-full">Generate YAML</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1">Copy</Button>
        <Button variant="outline" size="sm" onClick={downloadYAML} className="flex-1">Download</Button>
      </div>
      <Textarea readOnly value={result} className="min-h-[300px] font-mono text-xs" />
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      Configure options and click Generate to create YAML data
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>YAML Generator</strong> creates random YAML data with proper indentation and formatting. YAML is commonly used for configuration files, CI/CD pipelines, and data serialization.
        </p>
        <p>
          The output follows YAML best practices with proper document markers (--- and ...) and correct indentation for readability.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">YAML Format:</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <pre className="text-xs font-mono">
{`---
items:
  - id: 1
    name: John
    age: 28
    email: user@example.com
...`}
          </pre>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong>---:</strong> Document start marker.</li>
          <li><strong>Items:</strong> List of generated records using YAML sequence syntax.</li>
          <li><strong>Key-value pairs:</strong> Each field on a new line with proper indentation.</li>
          <li><strong>...:</strong> Document end marker.</li>
        </ul>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>YAML uses indentation (spaces, not tabs) to define structure.</li>
          <li>Strings containing special characters are automatically quoted.</li>
          <li>Common use cases: Docker Compose, Kubernetes configs, CI/CD pipelines.</li>
          <li>YAML is a superset of JSON - valid JSON is also valid YAML.</li>
        </ul>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="YAML Generator"
      description="Generate random YAML data with custom structure"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default YamlGenerator;
