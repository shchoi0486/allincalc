'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Printer } from 'lucide-react';

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
}

let nextId = 1;

const InvoiceGenerator: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    companyName: '',
    companyAddress: '',
    clientName: '',
    clientAddress: '',
    invoiceNumber: `INV-${Date.now().toString(36).toUpperCase()}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    items: [{ id: nextId++, name: '', quantity: 1, price: 0 }],
    taxRate: 10,
    notes: '',
  });

  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { id: nextId++, name: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (id: number) => {
    if (invoice.items.length <= 1) return;
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateField = (field: keyof InvoiceData, value: string | number) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const getSubtotal = () => invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const getTax = () => getSubtotal() * (invoice.taxRate / 100);
  const getTotal = () => getSubtotal() + getTax();

  const handlePrint = () => {
    setShowPreview(true);
    setTimeout(() => window.print(), 100);
  };

  const formatCurrency = (amount: number) => `₩${amount.toLocaleString('ko-KR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">회사명</label>
          <Input
            value={invoice.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            placeholder="회사 이름"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">고객명</label>
          <Input
            value={invoice.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            placeholder="고객 이름"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">회사 주소</label>
          <Input
            value={invoice.companyAddress}
            onChange={(e) => updateField('companyAddress', e.target.value)}
            placeholder="회사 주소"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">고객 주소</label>
          <Input
            value={invoice.clientAddress}
            onChange={(e) => updateField('clientAddress', e.target.value)}
            placeholder="고객 주소"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">인보이스 번호</label>
          <Input
            value={invoice.invoiceNumber}
            onChange={(e) => updateField('invoiceNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">발행일</label>
          <Input
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) => updateField('invoiceDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">세율 (%)</label>
        <Input
          type="number"
          min={0}
          max={100}
          step={0.1}
          value={invoice.taxRate}
          onChange={(e) => updateField('taxRate', parseFloat(e.target.value) || 0)}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">품목</label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> 추가
          </Button>
        </div>
        <div className="space-y-2">
          {invoice.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Input
                className="flex-1"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder="품목명"
              />
              <Input
                className="w-20"
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
              />
              <Input
                className="w-28"
                type="number"
                min={0}
                value={item.price}
                onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                placeholder="단가"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                disabled={invoice.items.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">비고</label>
        <Input
          value={invoice.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="추가 메모 (선택사항)"
        />
      </div>

      <div className="flex space-x-2">
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? '입력으로 돌아가기' : '미리보기'}
        </Button>
        <Button variant="secondary" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-1" /> 인쇄
        </Button>
      </div>
    </div>
  );

  const resultSection = showPreview ? (
    <div className="space-y-4 print:shadow-none">
      <div className="border-2 border-gray-800 p-6 bg-white text-black">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{invoice.companyName || '회사명'}</h2>
            <p className="text-sm text-gray-600">{invoice.companyAddress}</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold">인보이스 (청구서)</h3>
            <p className="text-sm">번호: {invoice.invoiceNumber}</p>
            <p className="text-sm">날짜: {invoice.invoiceDate}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-sm text-gray-500 mb-1">청구 대상:</h4>
          <p className="font-semibold">{invoice.clientName || '고객명'}</p>
          <p className="text-sm text-gray-600">{invoice.clientAddress}</p>
        </div>

        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2">품목</th>
              <th className="text-center py-2 w-20">수량</th>
              <th className="text-right py-2 w-28">단가</th>
              <th className="text-right py-2 w-28">금액</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2">{item.name || '-'}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">{formatCurrency(item.price)}</td>
                <td className="text-right py-2">{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>소계:</span>
              <span>{formatCurrency(getSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>부가세 ({invoice.taxRate}%):</span>
              <span>{formatCurrency(getTax())}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t-2 border-gray-800 pt-2 mt-2">
              <span>합계:</span>
              <span>{formatCurrency(getTotal())}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-sm text-gray-500 mb-1">비고:</h4>
            <p className="text-sm">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-semibold mb-2">요약</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>품목 수:</span>
            <span>{invoice.items.length}개</span>
          </div>
          <div className="flex justify-between">
            <span>소계:</span>
            <span>{formatCurrency(getSubtotal())}</span>
          </div>
          <div className="flex justify-between">
            <span>부가세 ({invoice.taxRate}%):</span>
            <span>{formatCurrency(getTax())}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>합계:</span>
            <span>{formatCurrency(getTotal())}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">「미리보기」 버튼을 눌러 인보이스를 확인하세요.</p>
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg">인보이스 생성기는 전문적인 청구서(인보이스)를 손쉽게 작성하고 인쇄할 수 있는 도구입니다.</p>
        <p>회사 정보, 고객 정보, 품목 목록, 세율 등을 입력하면 소계, 부가세, 합계를 자동 계산하여 깔끔한 인보이스를 생성합니다. 인쇄 버튼을 통해 PDF 저장이나 직접 인쇄가 가능합니다.</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-md mb-2">주요 기능:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>자동 계산:</strong> 소계, 부가세, 합계를 자동 계산</li>
            <li><strong>품목 관리:</strong> 품목 추가/삭제 및 수정 기능</li>
            <li><strong>인쇄 지원:</strong> 인쇄 친화적 레이아웃으로 출력 가능</li>
            <li><strong>커스터마이징:</strong> 세율, 비고 등 자유롭게 수정 가능</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-xl mb-2 border-b-2 border-gray-200 pb-2">인보이스 계산 공식</h3>
          <p className="mb-4">인보이스의 금액은 다음 공식에 따라 계산됩니다.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">1. 품목별 금액</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">품목 금액 = 수량 × 단가</code>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">2. 소계 (Subtotal)</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">소계 = Σ (각 품목의 수량 × 단가)</code>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">3. 부가세 (Tax)</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">부가세 = 소계 × (세율 ÷ 100)</code>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">4. 합계 (Total)</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">합계 = 소계 + 부가세</code>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">인보이스 작성 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>품목 설명:</strong> 품목명은 구체적으로 작성하여 고객이 이해하기 쉽도록 합니다.</li>
            <li><strong>세율 확인:</strong> 한국의 표준 부가세율은 10%이며, 면세 품목의 경우 0%를 설정합니다.</li>
            <li><strong>인보이스 번호:</strong> 고유한 번호를 사용하여 추후 관리 용이성을 높입니다.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 className="font-semibold text-lg mb-2">법적 필수 사항</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>사업자등록번호, 상호, 대표자명 등의 기재가 필요할 수 있습니다.</li>
            <li>세금계산서 발행 시 법적 요건을 반드시 확인하세요.</li>
            <li>품목별 공급가액과 세액을 구분하여 기재하는 것이 일반적입니다.</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="인보이스 생성기"
      description="전문적인 청구서(인보이스)를 작성하고 인쇄할 수 있습니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default InvoiceGenerator;
