'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplify(numer: number, denom: number): [number, number] {
  if (denom === 0) return [numer, denom];
  const sign = (numer < 0) !== (denom < 0) ? -1 : 1;
  const g = gcd(Math.abs(numer), Math.abs(denom));
  return [sign * Math.abs(numer) / g, Math.abs(denom) / g];
}

export default function FractionCalculatorPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [num1, setNum1] = useState('');
  const [den1, setDen1] = useState('');
  const [operator, setOperator] = useState('+');
  const [num2, setNum2] = useState('');
  const [den2, setDen2] = useState('');
  const [result, setResult] = useState<{ numer: number; denom: number; decimal: number } | null>(null);

  const calculate = useCallback(() => {
    const n1 = parseInt(num1);
    const d1 = parseInt(den1);
    const n2 = parseInt(num2);
    const d2 = parseInt(den2);
    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2) || d1 === 0 || d2 === 0) {
      setResult(null);
      return;
    }
    let rn: number, rd: number;
    switch (operator) {
      case '+': rn = n1 * d2 + n2 * d1; rd = d1 * d2; break;
      case '-': rn = n1 * d2 - n2 * d1; rd = d1 * d2; break;
      case '×': rn = n1 * n2; rd = d1 * d2; break;
      case '÷':
        if (n2 === 0) { setResult(null); return; }
        rn = n1 * d2; rd = d1 * n2;
        break;
      default: return;
    }
    const [sn, sd] = simplify(rn, rd);
    setResult({ numer: sn, denom: sd, decimal: sn / sd });
  }, [num1, den1, num2, den2, operator]);

  const reset = () => { setNum1(''); setDen1(''); setNum2(''); setDen2(''); setResult(null); };

  const FractionInput = ({ num, setNum, den, setDen, label }: { num: string; setNum: (v: string) => void; den: string; setDen: (v: string) => void; label: string }) => (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex items-center space-x-2">
        <div className="text-center">
          <Input type="number" value={num} onChange={e => setNum(e.target.value)} placeholder={isKo ? '분자' : 'Num'} className="w-20 text-center" />
          <div className="h-px bg-foreground my-1" />
          <Input type="number" value={den} onChange={e => setDen(e.target.value)} placeholder={isKo ? '분모' : 'Den'} className="w-20 text-center" />
        </div>
      </div>
    </div>
  );

  const inputSection = (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <FractionInput num={num1} setNum={setNum1} den={den1} setDen={setDen1} label={L('분수 1', 'Fraction 1')} />
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger className="w-16 mt-6">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+">+</SelectItem>
            <SelectItem value="-">-</SelectItem>
            <SelectItem value="×">×</SelectItem>
            <SelectItem value="÷">÷</SelectItem>
          </SelectContent>
        </Select>
        <FractionInput num={num2} setNum={setNum2} den={den2} setDen={setDen2} label={L('분수 2', 'Fraction 2')} />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculate} className="flex-1">{L('계산', 'Calculate')}</Button>
        <Button onClick={reset} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div>
      {result ? (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{L('계산 결과', 'Result')}</p>
            <div className="text-center my-2">
              <span className="font-mono text-2xl font-bold">
                {result.numer}
              </span>
              <span className="mx-1">/</span>
              <span className="font-mono text-2xl font-bold">
                {result.denom}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {L('소수:', 'Decimal:')} {result.decimal.toFixed(6)}
            </p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-1">{L('단계별 계산', 'Step-by-Step')}</p>
            <p className="text-xs font-mono">
              {num1}/{den1} {operator} {num2}/{den2}
            </p>
            <p className="text-xs font-mono mt-1">
              = {result.numer * (operator === '÷' ? 1 : 1)}/{result.denom}
              {result.numer !== result.numer || result.denom !== result.denom ? ` = ${result.numer}/${result.denom}` : ''}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">{isKo ? '분수를 입력하세요' : 'Enter fractions to calculate'}</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{L('분수 계산기', 'Fraction Calculator')}</strong>{L('는 두 분수 간의 사칙연산(+, -, ×, ÷)을 수행하고 결과를 기약분수와 소수로 동시에 보여주는 도구입니다.', ' performs arithmetic operations (+, -, ×, ÷) between two fractions and displays the result as both a simplified fraction and a decimal.')}
        </p>
        <p>
          {L('분수는 정수로 표현할 수 없는 수의 크기를 나타낼 때 사용되며, 전체(분모) 중 일부(분자)를 의미합니다.', 'Fractions are used to express values that cannot be represented as whole numbers, where the denominator represents the whole and the numerator represents the part.')}
        </p>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {L('이 계산기는 결과를 기약분수(분자와 분모의 최대공약수로 나눈 형태)로 자동 약분하여 가장 간단한 형태로 보여줍니다.', 'This calculator automatically simplifies the result to a reduced fraction (divided by the GCD of numerator and denominator) for the simplest form.')}
        </p>
        <TermGlossary items={[
          { term: L('분수(Fraction)', 'Fraction'), desc: L('전체를 같은 크기로 나눈 것 중 일부를 나타내는 수. 예: 3/4는 4등분 중 3개.', 'A number representing parts of a whole divided into equal pieces. E.g., 3/4 means 3 out of 4 parts.') },
          { term: L('분자(Numerator)', 'Numerator'), desc: L('분수에서 위에 오는 수로, 전체 중 몇 개인지를 나타냅니다.', 'The top number in a fraction, indicating how many parts are taken.') },
          { term: L('분모(Denominator)', 'Denominator'), desc: L('분수에서 아래에 오는 수로, 전체를 몇 등분했는지를 나타냅니다. 0이 될 수 없습니다.', 'The bottom number in a fraction, indicating into how many equal parts the whole is divided. Cannot be zero.') },
          { term: L('기약분수', 'Reduced Fraction'), desc: L('분자와 분모의 최대공약수(GCD)로 나누어 더 이상 약분할 수 없는 형태의 분수입니다.', 'A fraction where the numerator and denominator have been divided by their GCD so it cannot be simplified further.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('덧셈/뺄셈', 'Addition/Subtraction')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">a/b + c/d = (a×d + c×b) / (b×d)</p>
            <p className="font-mono text-lg font-bold mt-2">a/b - c/d = (a×d - c×b) / (b×d)</p>
          </div>
          <p className="text-sm mt-2">{L('분모가 다를 때: 통분(최소공배수) 후 분자끼리 연산', 'When denominators differ: find LCM, then operate on numerators')}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('곱셈', 'Multiplication')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">a/b × c/d = (a×c) / (b×d)</p>
          </div>
          <p className="text-sm mt-2">{L('분자 × 분자, 분모 × 분모', 'Numerator × Numerator, Denominator × Denominator')}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">{L('나눗셈', 'Division')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">a/b ÷ c/d = a/b × d/c = (a×d) / (b×c)</p>
          </div>
          <p className="text-sm mt-2">{L('나눗셈은 역수를 곱하는 것으로 변환', 'Division is converted to multiplication by the reciprocal')}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('약분 (GCD)', 'Simplification (GCD)')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">GCD(a, b): 유클리드 호제법</p>
          </div>
          <p className="text-sm mt-2">{L('최대공약수(GCD)로 나누어 기약분수로 변환', 'Divide by the Greatest Common Divisor (GCD) to get the reduced fraction')}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('계산 예시', 'Examples')}</h4>
          <div className="space-y-3 mt-2">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold text-sm">{L('덧셈 예시', 'Addition Example')}</p>
              <p className="font-mono text-xs mt-1">1/2 + 1/3 = (1×3 + 1×2) / (2×3) = 5/6</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold text-sm">{L('곱셈 예시', 'Multiplication Example')}</p>
              <p className="font-mono text-xs mt-1">2/3 × 3/4 = 6/12 = 1/2</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold text-sm">{L('나눗셈 예시', 'Division Example')}</p>
              <p className="font-mono text-xs mt-1">3/5 ÷ 2/7 = 3/5 × 7/2 = 21/10</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('유용한 팁', 'Useful Tips')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{L('분모가 0인 분수는 정의되지 않습니다. 반드시 분모를 확인하세요.', 'A fraction with a denominator of 0 is undefined. Always check the denominator.')}</li>
            <li>{L('분수를 소수로 변환하려면 분자를 분모로 나누세요.', 'To convert a fraction to decimal, divide the numerator by the denominator.')}</li>
            <li>{L('가분수(예: 7/3)를 대분수(예: 2 1/3)로 변환하려면: 분모로 나눈 몫이 정수 부분, 나머지가 새로운 분자.', 'To convert an improper fraction (e.g., 7/3) to a mixed number (e.g., 2 1/3): quotient is the whole part, remainder is the new numerator.')}</li>
            <li>{L('통분: 두 분수의 분모를 같게 만들려면 각 분수의 분자와 분모를 상대 분모의 수만큼 곱합니다.', 'Finding a common denominator: multiply the numerator and denominator of each fraction by the other denominator.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '분수 계산기' : 'Fraction Calculator'}
      description={isKo ? '두 분수의 사칙연산을 수행하고 기약분수와 소수로 결과를 표시합니다.' : 'Perform arithmetic on two fractions and see the result as a simplified fraction and decimal.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
