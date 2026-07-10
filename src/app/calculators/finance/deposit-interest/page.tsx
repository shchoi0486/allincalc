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

const DepositInterestCalculator: NextPage = () => {
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
    const t = period

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      return { calculationResult: null, error: '모든 필드를 올바르게 입력해주세요.' }
    }
    if (p <= 0) {
      return { calculationResult: null, error: '예치금액은 0보다 커야 합니다.' }
    }
    if (r <= 0) {
      return { calculationResult: null, error: '연 이자율은 0보다 커야 합니다.' }
    }
    if (t <= 0) {
      return { calculationResult: null, error: '예치기간은 0보다 커야 합니다.' }
    }

    const taxRate = taxType === 'general' ? 0.154 : taxType === 'preferential' ? 0.095 : 0
    const monthlyRate = r / 100 / 12
    let totalInterest = 0

    if (interestType === 'simple') {
      totalInterest = p * (r / 100) * (t / 12)
    } else { // 월복리
      totalInterest = p * Math.pow(1 + monthlyRate, t) - p
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
  }, [principal, rate, period, interestType, taxType])

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error)
    } else if (calculationResult) {
      toast.success('예금 이자 계산이 완료되었습니다.')
    }
  }, [calculationResult, error])

  const inputSection = (
    <div className="flex flex-col h-full">
      <div className="space-y-6 flex-grow">
        <div className="space-y-2">
          <Label htmlFor="principal">예치금액 (원)</Label>
          <Input
            id="principal"
            value={principal.toLocaleString()}
            onChange={handleInputChange(setPrincipal)}
            placeholder="예: 10,000,000"
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rate">연 이자율 (%)</Label>
          <Input
            id="rate"
            value={rate.toLocaleString()}
            onChange={handleInputChange(setRate)}
            placeholder="예: 3.5"
            className="text-right"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="period">예치기간 (개월)</Label>
          <Input
            id="period"
            value={period.toLocaleString()}
            onChange={handleInputChange(setPeriod)}
            placeholder="예: 12"
            className="text-right"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="interestType">이자 계산 방식</Label>
            <Select value={interestType} onValueChange={(v: 'simple' | 'compound') => setInterestType(v)}>
              <SelectTrigger id="interestType"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">단리</SelectItem>
                <SelectItem value="compound">월복리</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxType">과세 옵션</Label>
            <Select value={taxType} onValueChange={(v: 'general' | 'preferential' | 'non-taxable') => setTaxType(v)}>
              <SelectTrigger id="taxType"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="general">일반과세 (15.4%)</SelectItem>
                <SelectItem value="preferential">세금우대 (9.5%)</SelectItem>
                <SelectItem value="non-taxable">비과세 (0%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">계산하기</Button>
      </div>
    </div>
  )

  const resultSection = (
    <div className="flex flex-col justify-center h-full">
      {calculationResult ? (
        <div className="space-y-4">
            <div className="text-center pb-4 border-b">
                <p className="text-lg text-muted-foreground">만기 지급액</p>
                <p className="text-4xl sm:text-5xl font-bold text-primary">{calculationResult.finalAmount.toLocaleString()} 원</p>
            </div>
            <Table className="mt-4">
                <TableBody>
                    <TableRow>
                        <TableCell>원금</TableCell>
                        <TableCell className="text-right">{calculationResult.principal.toLocaleString()} 원</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>세전 이자</TableCell>
                        <TableCell className="text-right">{calculationResult.totalInterest.toLocaleString()} 원</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>세금 ({calculationResult.taxRate.toFixed(1)}%)</TableCell>
                        <TableCell className="text-right text-destructive">- {calculationResult.tax.toLocaleString()} 원</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold">
                        <TableCell>세후 이자</TableCell>
                        <TableCell className="text-right">{calculationResult.afterTaxInterest.toLocaleString()} 원</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
      ) : (
        <div className="text-center text-muted-foreground min-h-[200px] flex items-center justify-center">
            <p>{error || '정보를 입력하고 계산하기 버튼을 누르세요.'}</p>
        </div>
      )}
    </div>
  )

  const infoSection = {
    calculatorDescription: (
      <>
        <h2 className="text-2xl font-bold text-foreground mb-4">정기예금 이자 계산기: 잠자는 내 돈, 확실하게 깨우는 법</h2>
        <p className="text-lg text-muted-foreground mb-6">
          재테크의 가장 기본은 ‘잃지 않는 것’에서 시작합니다. 그런 의미에서 <strong>예금</strong>은 변동성이 큰 투자 시장 속에서 여러분의 자산을 가장 안전하게 지키고, 꾸준히 불려 나갈 수 있는 가장 확실하고 안정적인 재테크 수단입니다. 특히 목돈을 일정 기간 묶어두고 약속된 이자를 받는 <strong>정기예금</strong>은 종잣돈을 마련하거나, 주택 계약금, 여행 자금 등 단기적인 금융 목표를 달성하는 데 매우 효과적입니다.
        </p>
        <p className="text-foreground leading-relaxed">
          하지만 같은 금액을 예치하더라도 이자를 계산하는 방식(단리/복리)과 세금(과세/비과세) 적용 여부에 따라 만기 시 손에 쥐게 되는 금액은 크게 달라질 수 있습니다. 많은 사람들이 "연 3.5% 금리"라는 말만 믿고 예금에 가입했다가, 만기 후 세금을 떼고 난 실제 수령액을 보고 실망하는 경우가 많습니다. 복잡한 계산 과정 때문에 자신의 최종 수령액을 정확히 예측하는 데 어려움을 겪기 때문입니다.
        </p>
        <p className="mt-4 text-foreground leading-relaxed">
          <strong>All-in-Calc의 예금 이자 계산기</strong>는 이러한 불편함을 해결하기 위해 만들어졌습니다. 예치할 금액, 기간, 금리만 입력하면, 복잡한 이자 계산과 세금까지 모두 고려하여 만기 시 받게 될 실수령액을 쉽고 빠르게 확인할 수 있습니다. 이 계산기를 통해 아래 질문들에 대한 명확한 답을 얻을 수 있습니다.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-foreground bg-muted p-4 rounded-lg">
          <li>단리와 복리, 어떤 방식이 나에게 더 유리할까?</li>
          <li>내 소중한 이자에서 세금은 얼마나 빠져나갈까? (2025년 기준)</li>
          <li>비과세나 세금우대 혜택을 받으면 얼마나 더 받을 수 있을까?</li>
          <li>1년 만기 예금과 2년 만기 예금의 실제 수령액 차이는 얼마나 될까?</li>
        </ul>
        <p className="mt-6 text-foreground leading-relaxed">
          이제 막연한 기대 대신, 정확한 숫자를 통해 미래를 계획하세요. All-in-Calc과 함께라면 안정적인 자산 증식의 첫걸음이 더욱 쉽고 명확해집니다.
        </p>
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">💰 단리 vs 복리, 이자는 어떻게 계산될까?</h3>
        <p className="text-foreground leading-relaxed mb-6">
          예금 이자를 계산하는 방식은 크게 단리와 복리로 나뉩니다. 어떤 방식을 선택하느냐에 따라, 특히 예치 기간이 길어질수록 만기 수령액에 상당한 차이가 발생합니다. 두 방식의 차이점을 명확히 이해하는 것이 중요합니다.
        </p>
        <div className="space-y-6">
          <div className="p-4 border-l-4 border-primary bg-muted rounded-r-lg">
            <h4 className="font-semibold text-lg mb-2 text-primary">1. 단리 (Simple Interest)</h4>
            <p className="text-muted-foreground mb-3">오직 <strong>처음 예치한 원금</strong>에 대해서만 약속된 이자를 계산하는 방식입니다. 이자가 발생하더라도 이를 원금에 포함시키지 않기 때문에, 매번 동일한 금액의 이자가 발생합니다. 계산이 단순하고 이해하기 쉽다는 특징이 있습니다.</p>
            <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
              <strong>세전 이자 = 원금 × 연이율 × (예치 개월 수 / 12)</strong>
            </p>
          </div>
          <div className="p-4 border-l-4 border-primary bg-muted rounded-r-lg">
            <h4 className="font-semibold text-lg mb-2 text-primary">2. 월복리 (Monthly Compound Interest)</h4>
            <p className="text-muted-foreground mb-3">발생한 이자를 <strong>원금에 합산</strong>하고, 그 합산된 금액을 새로운 원금으로 간주하여 다음 기간의 이자를 계산하는 방식입니다. 이자가 이자를 낳는 구조로, 시간이 지날수록 이자가 기하급수적으로 늘어나는 ‘눈덩이 효과’를 기대할 수 있습니다.</p>
            <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
              <strong>세전 이자 = 원금 × (1 + 월이율) ^ 예치 개월 수 - 원금</strong>
            </p>
            <p className="text-xs text-muted-foreground text-center">* 월이율 = 연이율 / 12</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground mt-10 mb-4">💸 최종 수령액을 결정하는 ‘세금’ (2025년 기준)</h3>
        <p className="text-foreground leading-relaxed">
          예금 이자는 ‘이자소득’으로 분류되어 세금이 부과됩니다. 따라서 최종 수령액은 세전 이자에서 세금을 제외한 금액이 됩니다. 과세 옵션에 따라 공제되는 세율이 다르므로, 자신에게 적용되는 세율을 정확히 아는 것이 중요합니다.
        </p>
        <div className="bg-muted p-4 rounded-md my-4 border border-border border-border">
          <p className="text-center font-semibold text-lg">
            세후 수령액 = 원금 + 세전 이자 - (세전 이자 × 세율)
          </p>
        </div>
        <ul className="list-disc pl-5 mt-6 space-y-4 text-foreground">
          <li><strong>일반과세 (15.4%):</strong> 대부분의 금융상품에 적용되는 기본 세율입니다. 이자소득의 15.4%가 세금으로 원천징수됩니다. (소득세 14% + 지방소득세 1.4%)</li>
          <li><strong>세금우대 (9.5%):</strong> 상호금융기관(농협, 수협, 신협, 새마을금고 등)의 조합원 또는 준조합원인 경우, 1인당 3,000만원 한도 내의 예탁금에 대해 낮은 세율을 적용받을 수 있습니다. (이자소득세 면제, 농어촌특별세 1.4%만 부과) 2025년 현재 이 제도가 유지되고 있으나, 정책 변경 가능성에 유의해야 합니다.</li>
          <li><strong>비과세 (0%):</strong> 만 65세 이상 노인, 장애인, 독립유공자 등이 가입하는 ‘비과세 종합저축’은 1인당 5,000만원 한도 내에서 이자소득에 대한 세금이 완전히 면제됩니다. 절세 혜택이 가장 크므로, 자격이 된다면 반드시 활용해야 합니다.</li>
        </ul>
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-2">계산 예시 (정기예금 1,000만 원, 연 3.5%, 12개월)</h4>
          <p className="text-sm text-muted-foreground">단리 세전 이자 = 10,000,000 × 0.035 × 1 = 350,000원</p>
          <p className="font-mono text-sm text-primary mt-1">일반과세 세금 = 350,000 × 15.4% = 53,900원</p>
          <p className="font-mono text-sm text-primary">세후 수령액 = 10,000,000 + 350,000 − 53,900 = 10,296,100원</p>
          <p className="text-xs text-muted-foreground mt-1">월복리 시 세전 이자는 약 355,750원으로 단리보다 높으며, 비과세라면 세금 53,900원(또는 53,385원)을 추가로 받을 수 있습니다.</p>
        </div>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">💡 이자 한 푼이라도 더 받는 5가지 꿀팁</h3>
        <ul className="space-y-6">
          <li className="p-4 rounded-lg bg-muted shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-primary">1. 발품 대신 ‘손품’을 팔아 금리를 비교하세요.</h4>
            <p className="text-muted-foreground">더 이상 높은 금리를 찾기 위해 여러 은행을 방문할 필요가 없습니다. 금융감독원의 ‘금융상품 한눈에’ 서비스나 은행연합회 소비자포털, 그리고 다양한 핀테크 앱(토스, 카카오뱅크, 뱅크샐러드 등)을 통해 모든 은행의 예금 금리를 실시간으로 비교하고 가장 좋은 조건을 쉽게 찾을 수 있습니다. 0.1%의 금리 차이라도 장기적으로는 큰 차이를 만듭니다.</p>
          </li>
          <li className="p-4 rounded-lg bg-muted shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-primary">2. ‘특판 예금’ 출시 알림을 활용하세요.</h4>
            <p className="text-muted-foreground">은행들은 유동성 확보나 신규 고객 유치를 위해 종종 기본 금리보다 훨씬 높은 금리를 제공하는 ‘특판 예금’을 한시적으로 판매합니다. 판매 시작 몇 시간 만에 한도가 소진될 정도로 인기가 높습니다. 평소 관심 있는 은행의 앱 푸시 알림을 설정해두거나, 재테크 커뮤니티(예: 뽐뿌 재테크 포럼)를 주시하면 좋은 기회를 놓치지 않을 수 있습니다.</p>
          </li>
          <li className="p-4 rounded-lg bg-muted shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-primary">3. ‘만기 자동 연장’은 다시 한번 생각해보세요.</h4>
            <p className="text-muted-foreground">만기 시 자동 연장 옵션은 편리하지만, 연장 시점의 금리가 현재보다 낮을 수 있습니다. 특히 금리 인상기에는 손해가 될 가능성이 높습니다. 만기가 도래하면 자동 연장하기보다는, 그 시점에서 가장 금리가 높은 다른 상품으로 갈아타는(재예치) 것이 대부분의 경우 더 유리합니다. 캘린더에 만기일을 꼭 표시해두세요.</p>
          </li>
          <li className="p-4 rounded-lg bg-muted shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-primary">4. ‘비과세·세금우대’ 혜택을 최대한 활용하세요.</h4>
            <p className="text-muted-foreground">ISA(개인종합자산관리계좌)를 통해 예금을 운용하면 계좌 내에서 발생한 이자 및 배당소득에 대해 200만원(서민형은 400만원)까지 비과세 혜택을 받을 수 있습니다. 또한, 만 65세 이상이거나 장애인 복지법에 따른 장애인이라면 ‘비과세 종합저축’ 한도(5,000만원)를 반드시 활용하여 세금을 아끼는 것이 중요합니다.</p>
          </li>
          <li className="p-4 rounded-lg bg-muted shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-primary">5. 예금자보호법 한도(5,000만 원)를 기억하세요.</h4>
            <p className="text-muted-foreground">만약의 사태에 대비해, 한 금융기관에는 원금과 이자를 합쳐 5,000만 원까지만 예치하는 것이 안전합니다. 예금자보호법은 금융회사가 파산하더라도 1인당 최대 5,000만 원까지 보호해주므로, 이 금액을 초과하는 목돈은 여러 은행에 나누어 예치하는 것이 현명한 방법입니다. 저축은행의 경우 금리가 높은 대신 안정성이 상대적으로 낮을 수 있으므로 이 원칙을 더욱 철저히 지키는 것이 좋습니다.</p>
          </li>
        </ul>
      </>
    ),
  }

  return (
    <CalculatorsLayout
      title="정기예금 이자 계산기"
      description="단리/복리, 과세 옵션을 선택하여 만기 수령액을 계산해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default DepositInterestCalculator