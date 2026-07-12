'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Printer } from 'lucide-react';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

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
  const { dict } = useI18n();
  const t = dict.invoiceGenerator;

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

  const formatCurrency = (amount: number) => `${'\u20A9'}${amount.toLocaleString('ko-KR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.inputs.companyName}</label>
          <Input
            value={invoice.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            placeholder={t.inputs.companyNamePlaceholder}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.inputs.clientName}</label>
          <Input
            value={invoice.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            placeholder={t.inputs.clientNamePlaceholder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.inputs.companyAddress}</label>
          <Input
            value={invoice.companyAddress}
            onChange={(e) => updateField('companyAddress', e.target.value)}
            placeholder={t.inputs.companyAddressPlaceholder}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.inputs.clientAddress}</label>
          <Input
            value={invoice.clientAddress}
            onChange={(e) => updateField('clientAddress', e.target.value)}
            placeholder={t.inputs.clientAddressPlaceholder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.inputs.invoiceNumber}</label>
          <Input
            value={invoice.invoiceNumber}
            onChange={(e) => updateField('invoiceNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.inputs.invoiceDate}</label>
          <Input
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) => updateField('invoiceDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t.inputs.taxRate}</label>
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
          <label className="text-sm font-medium">{t.inputs.items}</label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" /> {t.inputs.addItem}
          </Button>
        </div>
        <div className="space-y-2">
          {invoice.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Input
                className="flex-1"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder={t.inputs.itemName}
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
                placeholder={t.inputs.unitPrice}
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
        <label className="block text-sm font-medium mb-1">{t.inputs.notes}</label>
        <Input
          value={invoice.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder={t.inputs.notesPlaceholder}
        />
      </div>

      <div className="flex space-x-2">
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? t.inputs.backToInput : t.inputs.preview}
        </Button>
        <Button variant="secondary" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-1" /> {t.inputs.print}
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-semibold mb-2">{t.results.summary}</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{t.results.itemCount}</span>
            <span>{invoice.items.length}{t.results.countUnit}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.results.subtotal}</span>
            <span>{formatCurrency(getSubtotal())}</span>
          </div>
          <div className="flex justify-between">
            <span>{t.results.tax.replace('{rate}', String(invoice.taxRate))}</span>
            <span>{formatCurrency(getTax())}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>{t.results.total}</span>
            <span>{formatCurrency(getTotal())}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">{t.results.previewHint}</p>
    </div>
  );

  const fullWidthSection = showPreview ? (
    <div className="space-y-4 print:shadow-none">
      <div className="border-2 border-gray-800 p-6 bg-white text-black">
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{invoice.companyName || t.inputs.companyName}</h2>
            <p className="text-sm text-gray-600">{invoice.companyAddress}</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold">{t.preview.invoiceLabel}</h3>
            <p className="text-sm">{t.preview.number} {invoice.invoiceNumber}</p>
            <p className="text-sm">{t.preview.date} {invoice.invoiceDate}</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-sm text-gray-500 mb-1">{t.preview.billTo}</h4>
          <p className="font-semibold">{invoice.clientName || t.inputs.clientName}</p>
          <p className="text-sm text-gray-600">{invoice.clientAddress}</p>
        </div>

        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2">{t.preview.itemHeader}</th>
              <th className="text-center py-2 w-20">{t.preview.quantityHeader}</th>
              <th className="text-right py-2 w-28">{t.preview.unitPriceHeader}</th>
              <th className="text-right py-2 w-28">{t.preview.amountHeader}</th>
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
              <span>{t.preview.subtotalLabel}</span>
              <span>{formatCurrency(getSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.preview.taxLabel.replace('{rate}', String(invoice.taxRate))}</span>
              <span>{formatCurrency(getTax())}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t-2 border-gray-800 pt-2 mt-2">
              <span>{t.preview.totalLabel}</span>
              <span>{formatCurrency(getTotal())}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-sm text-gray-500 mb-1">{t.preview.notesLabel}</h4>
            <p className="text-sm">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  ) : null;

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{t.info.title}</strong> {t.info.p1}
        </p>
        <p>{t.info.p2}</p>
        <p>{t.info.p3}</p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          {t.info.tip}
        </p>
        <TermGlossary
          items={[
            { term: t.glossary.invoice.term, desc: t.glossary.invoice.desc },
            { term: t.glossary.vat.term, desc: t.glossary.vat.desc },
            { term: t.glossary.subtotal.term, desc: t.glossary.subtotal.desc },
            { term: t.glossary.taxInvoice.term, desc: t.glossary.taxInvoice.desc },
          ]}
        />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.itemAmount}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">{t.formula.itemFormula}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.subtotal}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">{t.formula.subtotalFormula}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.taxTotal}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">{t.formula.taxFormula}</p>
            <p className="font-mono text-sm">{t.formula.totalFormula}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t.formula.example}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.itemEntry}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.itemTip1}</li>
            <li>{t.tips.itemTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.taxSetup}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.taxTip1}</li>
            <li>{t.tips.taxTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.invoiceNumber}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.numTip1}</li>
            <li>{t.tips.numTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.printStore}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.printTip1}</li>
            <li>{t.tips.printTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.legalReqs}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.legalTip1}</li>
            <li>{t.tips.legalTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.notes}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.notesTip1}</li>
            <li>{t.tips.notesTip2}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="grouped"
      inputSection={inputSection}
      resultSection={resultSection}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={t.preview.title}
      infoSection={infoSection}
    />
  );
};

export default InvoiceGenerator;
