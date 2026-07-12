'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/I18nProvider';

const randomNames = ['John', 'Jane', 'Alex', 'Sam', 'Chris', 'Pat', 'Morgan', 'Taylor', 'Jordan', 'Casey'];
const randomCities = ['Seoul', 'Tokyo', 'New York', 'London', 'Paris', 'Berlin', 'Sydney', 'Toronto'];

function generateRandomValue(field: string): string {
  const lower = field.toLowerCase();
  if (lower.includes('name')) return randomNames[Math.floor(Math.random() * randomNames.length)];
  if (lower.includes('age') || lower.includes('year')) return String(Math.floor(Math.random() * 60) + 18);
  if (lower.includes('email')) return `user${Math.floor(Math.random() * 1000)}@example.com`;
  if (lower.includes('city') || lower.includes('location')) return randomCities[Math.floor(Math.random() * randomCities.length)];
  if (lower.includes('price') || lower.includes('amount')) return String(Math.floor(Math.random() * 10000) + 100);
  if (lower.includes('id')) return String(Math.floor(Math.random() * 10000) + 1);
  if (lower.includes('active') || lower.includes('enabled')) return Math.random() > 0.3 ? 'true' : 'false';
  return String(Math.floor(Math.random() * 1000));
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const XmlGenerator = () => {
  const { dict, locale } = useI18n();
  const t = dict.xmlGenerator;
  const isKo = locale === 'ko';
  const [rootElement, setRootElement] = useState('data');
  const [itemName, setItemName] = useState('item');
  const [fieldNames, setFieldNames] = useState('name, age, email, city');
  const [itemCount, setItemCount] = useState<number>(3);
  const [result, setResult] = useState('');

  const generate = () => {
    const fields = fieldNames.split(',').map(f => f.trim()).filter(f => f.length > 0);
    if (fields.length === 0) {
      alert(t.alertMessage);
      return;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n`;

    for (let i = 0; i < itemCount; i++) {
      xml += `  <${itemName}>\n`;
      fields.forEach(field => {
        const tagName = field.replace(/\s+/g, '_');
        xml += `    <${tagName}>${escapeXml(generateRandomValue(field))}</${tagName}>\n`;
      });
      xml += `  </${itemName}>\n`;
    }

    xml += `</${rootElement}>`;
    setResult(xml);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const downloadXML = () => {
    const blob = new Blob([result], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-data.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.rootLabel}</label>
        <Input value={rootElement} onChange={(e) => setRootElement(e.target.value)} placeholder="data" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.itemLabel}</label>
        <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="item" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.fieldLabel}</label>
        <Input value={fieldNames} onChange={(e) => setFieldNames(e.target.value)} placeholder="name, age, email, city" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.countLabel}</label>
        <Input
          type="number"
          min={1}
          max={100}
          value={itemCount}
          onChange={(e) => setItemCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
        />
      </div>
      <Button onClick={generate} className="w-full">{t.button}</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1">{t.copyButton}</Button>
        <Button variant="outline" size="sm" onClick={downloadXML} className="flex-1">{t.downloadButton}</Button>
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
          <strong>XML Generator</strong> creates well-formed random XML documents based on your specified element names and structure. Useful for testing XML parsers, SOAP services, and configuration file generation.
        </p>
        <p>
          The generator produces valid XML with proper indentation, escaping special characters as needed, and supporting both element and attribute configurations.
        </p>
        <TermGlossary items={[
          { term: 'XML', desc: isKo ? 'eXtensible Markup Language의 약자로, 태그를 사용해 데이터를 구조화하고 전송하는 마크업 언어입니다. HTML과 달리 사용자가 직접 태그를 정의할 수 있습니다.' : 'Short for eXtensible Markup Language, a markup language that structures and transmits data using tags. Unlike HTML, users can define their own tags.' },
          { term: isKo ? '이스케이프(Escaping)' : 'Escaping', desc: isKo ? 'XML 등 마크업 언어에서 <, >, & 같은 특수 문자가 태그와 혼동되지 않도록 &lt;, &gt;, &amp; 등으로 변환하는 처리입니다.' : 'In markup languages like XML, the process of converting special characters such as <, >, & into &lt;, &gt;, &amp; so they are not confused with tags.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">XML Structure:</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <pre className="text-xs font-mono">
{`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item>
    <fieldName>value</fieldName>
  </item>
</root>`}
          </pre>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong>Root element:</strong> The outermost container element.</li>
          <li><strong>Item elements:</strong> Each repeated record in the collection.</li>
          <li><strong>Field elements:</strong> Individual data values within each record.</li>
        </ul>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Use meaningful element names that describe your data structure.</li>
          <li>XML element names cannot contain spaces or start with numbers.</li>
          <li>The generator automatically escapes special XML characters (&lt;, &gt;, &amp;, etc.).</li>
          <li>Useful for testing XML-based APIs and configuration files.</li>
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

export default XmlGenerator;
