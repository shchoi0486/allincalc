'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from 'sonner'
import { formatNumber, parseNumber } from '@/utils/formatNumber'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const DepositInterestCalculator: NextPage = () => {
  const { dict, locale } = useI18n();
  const t = dict.depositInterest;
  const isKo = locale === 'ko';

  const [principal, setPrincipal] = useState<number>(10000000)
  const [rate, setRate] = useState<number>(3.5)
  const [period, setPeriod] = useState<number>(12)
  const [interestType, setInterestType] = useState<'simple' | 'compound'>('simple')
  const [taxType, setTaxType] = useState<'general' | 'preferential' | 'non-taxable'>('general')

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''))
    setter(isNaN(value) ? 0 : value)
  }

  const { calculationResult, error } = useMemo(() => {
    const p = principal
    const r = rate
    const tt = period

    if (isNaN(p) || isNaN(r) || isNaN(tt)) {
      return { calculationResult: null, error: t.errorAllFields }
    }
    if (p <= 0) {
      return { calculationResult: null, error: t.errorPrincipal }
    }
    if (r <= 0) {
      return { calculationResult: null, error: t.errorRate }
    }
    if (tt <= 0) {
      return { calculationResult: null, error: t.errorPeriod }
    }

    const taxRate = taxType === 'general' ? 0.154 : taxType === 'preferential' ? 0.095 : 0
    const monthlyRate = r / 100 / 12
    let totalInterest = 0

    if (interestType === 'simple') {
      totalInterest = p * (r / 100) * (tt / 12)
    } else {
      totalInterest = p * Math.pow(1 + monthlyRate, tt) - p
    }

    const tax = totalInterest * taxRate
    const afterTaxInterest = totalInterest - tax
    const finalAmount = p + afterTaxInterest

    return {
      calculationResult: {
        principal: p,
        totalInterest: Math.floor(totalInterest),
        tax: Math.floor(tax),
        afterTaxInterest: Math.floor(afterTaxInterest),
        finalAmount: Math.floor(finalAmount),
        taxRate: taxRate * 100,
      },
      error: null,
    }
  }, [principal, rate, period, interestType, taxType, t.errorAllFields, t.errorPrincipal, t.errorRate, t.errorPeriod])

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error)
    } else if (calculationResult) {
      toast.success(t.toastSuccess)
    }
  }, [calculationResult, error, t.toastSuccess])

  const inputSection = (
    <div className="flex flex-col h-full">
      <div className="space-y-6 flex-grow">
        <div className="space-y-2">
          <Label htmlFor="principal">{t.inputs.principal}</Label>
          <Input
            id="principal"
            value={principal.toLocaleString()}
            onChange={handleInputChange(setPrincipal)}
            placeholder={t.placeholders.principal}
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rate">{t.inputs.annualRate}</Label>
          <Input
            id="rate"
            value={rate.toLocaleString()}
            onChange={handleInputChange(setRate)}
            placeholder={t.placeholders.annualRate}
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">{t.inputs.period}</Label>
          <Input
            id="period"
            value={period.toLocaleString()}
            onChange={handleInputChange(setPeriod)}
            placeholder={t.placeholders.period}
            className="text-right"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="interestType">{t.inputs.interestType}</Label>
            <Select value={interestType} onValueChange={(v: 'simple' | 'compound') => setInterestType(v)}>
              <SelectTrigger id="interestType"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">{t.interestTypeOptions.simple}</SelectItem>
                <SelectItem value="compound">{t.interestTypeOptions.compound}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxType">{t.inputs.taxType}</Label>
            <Select value={taxType} onValueChange={(v: 'general' | 'preferential' | 'non-taxable') => setTaxType(v)}>
              <SelectTrigger id="taxType"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t.taxTypeOptions.general}</SelectItem>
                <SelectItem value="preferential">{t.taxTypeOptions.preferential}</SelectItem>
                <SelectItem value="non-taxable">{t.taxTypeOptions.nonTaxable}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">{t.calculate}</Button>
      </div>
    </div>
  )

  const resultSection = (
    <div className="flex flex-col justify-center h-full">
      {calculationResult ? (
        <div className="space-y-4">
            <div className="text-center pb-4 border-b">
                <p className="text-lg text-muted-foreground">{t.results.maturityAmount}</p>
                <p className="text-4xl sm:text-5xl font-bold text-primary">{calculationResult.finalAmount.toLocaleString()}{isKo ? '원' : ' KRW'}</p>
            </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground min-h-[200px] flex items-center justify-center">
            <p>{error || t.placeholder}</p>
        </div>
      )}
    </div>
  )

  const fullWidthSection = calculationResult ? (
    <Table>
        <TableBody>
            <TableRow>
                <TableCell>{t.results.principal}</TableCell>
                <TableCell className="text-right">{calculationResult.principal.toLocaleString()}{isKo ? '원' : ' KRW'}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>{t.results.preTaxInterest}</TableCell>
                <TableCell className="text-right">{calculationResult.totalInterest.toLocaleString()}{isKo ? '원' : ' KRW'}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>{t.results.tax} ({calculationResult.taxRate.toFixed(1)}%)</TableCell>
                <TableCell className="text-right text-destructive">- {calculationResult.tax.toLocaleString()}{isKo ? '원' : ' KRW'}</TableCell>
            </TableRow>
            <TableRow className="font-semibold">
                <TableCell>{t.results.afterTaxInterest}</TableCell>
                <TableCell className="text-right">{calculationResult.afterTaxInterest.toLocaleString()}{isKo ? '원' : ' KRW'}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
  ) : null

  const infoSection = {
    calculatorDescription: (
      <>
        <div dangerouslySetInnerHTML={{ __html: t.descriptionContent }} />
          <TermGlossary items={[
            { term: isKo ? '단리 (Simple Interest)' : 'Simple Interest', desc: isKo ? '처음 예치한 원금에 대해서만 이자를 계산하는 방식으로, 매 기간 동일한 금액의 이자가 발생합니다.' : 'Interest is calculated only on the initially deposited principal, so the same amount of interest accrues each period.' },
            { term: isKo ? '복리 (Compound Interest)' : 'Compound Interest', desc: isKo ? '발생한 이자를 원금에 합산하여 그 합산액을 다시 원금으로 삼아 이자를 계산하는 방식입니다. 기간이 길어질수록 자산이 기하급수적으로 불어납니다.' : 'Earned interest is added to the principal and the sum becomes the new principal; assets grow exponentially over longer periods.' },
            { term: isKo ? '이자소득 과세' : 'Interest Income Tax', desc: isKo ? '예금 이자에는 일반과세(15.4%), 세금우대(9.5%), 비과세(0%) 중 하나의 세율이 적용되며, 세율에 따라 실수령액이 크게 달라집니다.' : 'Deposit interest is taxed at general (15.4%), tax-preferred (9.5%), or non-taxable (0%); the rate greatly changes the net amount received.' },
          ]} />
      </>
    ),
    calculationFormula: (
      <div dangerouslySetInnerHTML={{ __html: t.formulaContent }} />
    ),
    usefulTips: (
      <div dangerouslySetInnerHTML={{ __html: t.tipsContent }} />
    ),
  }

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={t.fullWidthTitle}
      infoSection={infoSection}
    />
  )
}

export default DepositInterestCalculator
