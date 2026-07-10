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
        <p>
          <strong>인보이스 생성기</strong>는 전문적인 청구서(인보이스)를 손쉽게 작성하고 인쇄할 수 있는 도구입니다. 회사 정보, 고객 정보, 품목 목록, 세율 등을 입력하면 소계·부가세·합계를 자동으로 계산하여 깔끔한 인보이스를 만들어 줍니다.
        </p>
        <p>
          프리랜서, 소상공인, 스타트업, 영업 담당자에게 매출 관리와 고객 청구는 필수 업무입니다. 이 도구는 엑셀이나 회계 소프트웨어 없이도 브라우저에서 바로 청구서를 발급하고 인쇄·PDF 저장할 수 있어 업무 효율을 높입니다.
        </p>
        <p>
          품목을 자유롭게 추가·삭제하고 수량과 단가를 관리할 수 있으며, 비고와 인보이스 번호도 직접 지정할 수 있습니다. 발행 내역을 정리해 거래 명세를 투명하게 관리하는 데 유용합니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          한국의 표준 부가세율은 10%이며, 면세 품목은 0%로 설정합니다. 세금계산서가 필요한 거래는 법적 요건(사업자등록번호, 상호, 공급가액과 세액 구분 등)을 별도로 확인하세요. 이 도구는 참고용 양식입니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">품목별 금액</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">품목 금액 = 수량 × 단가</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">소계 (Subtotal)</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">소계 = Σ (수량 × 단가)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">부가세와 합계</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">부가세 = 소계 × (세율 ÷ 100)</p>
            <p className="font-mono text-sm">합계 = 소계 + 부가세</p>
          </div>
          <p className="text-sm text-muted-foreground">예: 소계 100,000원, 세율 10% → 부가세 10,000원, 합계 110,000원</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">품목 작성</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>품목명은 구체적으로 작성해 고객이 이해하기 쉽게 하세요.</li>
            <li>수량과 단가를 정확히 입력하면 합계가 자동 계산됩니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">세율 설정</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>표준 세율은 10%, 면세 품목은 0%입니다.</li>
            <li>간이과세자 여부를 먼저 확인하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">인보이스 번호</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>고유 번호를 부여해 추적과 대조를 쉽게 하세요.</li>
            <li>연도·월별 번호 체계를 정해 두면 편리합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">인쇄와 보관</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>인쇄 친화 레이아웃으로 PDF 저장이 가능합니다.</li>
            <li>발행 복사본은 거래 내역과 함께 보관하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">법적 요건</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>세금계산서 발행 시 사업자등록번호 등을 기재하세요.</li>
            <li>공급가액과 세액을 구분 기재하는 것이 일반적입니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">비고 활용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>결제 기한·계좌·환불 정책 등을 비고에 적으세요.</li>
            <li>약관을 간략히 적어 분쟁을 예방하세요.</li>
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
