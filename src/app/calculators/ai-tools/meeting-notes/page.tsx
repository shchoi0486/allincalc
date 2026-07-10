'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AgendaItem {
  topic: string;
  presenter: string;
  discussion: string;
  decision: string;
}

interface ActionItem {
  task: string;
  assignee: string;
  deadline: string;
}

function generateMeetingNotes(
  title: string,
  date: string,
  attendees: string,
  agendaItems: AgendaItem[],
  actionItems: ActionItem[]
): string {
  const lines: string[] = [];

  lines.push(`# ${title || '제목 없음'}`);
  lines.push('');
  lines.push('## 회의 정보');
  lines.push(`- **날짜:** ${date || '날짜 미정'}`);
  lines.push(`- **참석자:** ${attendees || '참석자 미정'}`);
  lines.push('');

  if (agendaItems.length > 0 && agendaItems.some(item => item.topic)) {
    lines.push('## 안건 및 논의 사항');
    lines.push('');
    agendaItems.forEach((item, i) => {
      if (item.topic) {
        lines.push(`### ${i + 1}. ${item.topic}`);
        if (item.presenter) lines.push(`- **발표자:** ${item.presenter}`);
        if (item.discussion) lines.push(`- **논의 내용:** ${item.discussion}`);
        if (item.decision) lines.push(`- **결정 사항:** ${item.decision}`);
        lines.push('');
      }
    });
  }

  if (actionItems.length > 0 && actionItems.some(item => item.task)) {
    lines.push('## 액션 아이템');
    lines.push('');
    lines.push('| 작업 | 담당자 | 마감일 |');
    lines.push('|------|--------|--------|');
    actionItems.forEach(item => {
      if (item.task) {
        lines.push(`| ${item.task} | ${item.assignee || '미정'} | ${item.deadline || '미정'} |`);
      }
    });
    lines.push('');
  }

  lines.push('## 메모');
  lines.push('');
  lines.push('- [ ] ');
  lines.push('');
  lines.push('---');
  lines.push('*이 회의록은 회의록 작성기로 생성되었습니다.*');

  return lines.join('\n');
}

const MeetingNotes = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [attendees, setAttendees] = useState('');
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    { topic: '', presenter: '', discussion: '', decision: '' },
  ]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    { task: '', assignee: '', deadline: '' },
  ]);
  const [result, setResult] = useState('');

  const updateAgendaItem = (index: number, field: keyof AgendaItem, value: string) => {
    const updated = [...agendaItems];
    updated[index] = { ...updated[index], [field]: value };
    setAgendaItems(updated);
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { topic: '', presenter: '', discussion: '', decision: '' }]);
  };

  const removeAgendaItem = (index: number) => {
    if (agendaItems.length > 1) {
      setAgendaItems(agendaItems.filter((_, i) => i !== index));
    }
  };

  const updateActionItem = (index: number, field: keyof ActionItem, value: string) => {
    const updated = [...actionItems];
    updated[index] = { ...updated[index], [field]: value };
    setActionItems(updated);
  };

  const addActionItem = () => {
    setActionItems([...actionItems, { task: '', assignee: '', deadline: '' }]);
  };

  const removeActionItem = (index: number) => {
    if (actionItems.length > 1) {
      setActionItems(actionItems.filter((_, i) => i !== index));
    }
  };

  const generate = () => {
    setResult(generateMeetingNotes(title, date, attendees, agendaItems, actionItems));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">회의 제목</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="프로젝트 팀 미팅"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">회의 날짜</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">참석자</label>
        <Input
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          placeholder="홍길동, 김철수, 이영희"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">안건</label>
        {agendaItems.map((item, i) => (
          <div key={i} className="p-3 bg-background border border-border rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-muted-foreground">안건 {i + 1}</span>
              {agendaItems.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeAgendaItem(i)} className="h-6 text-xs">삭제</Button>
              )}
            </div>
            <Input
              value={item.topic}
              onChange={(e) => updateAgendaItem(i, 'topic', e.target.value)}
              placeholder="안건 주제"
              className="h-8 text-xs"
            />
            <Input
              value={item.presenter}
              onChange={(e) => updateAgendaItem(i, 'presenter', e.target.value)}
              placeholder="발표자"
              className="h-8 text-xs"
            />
            <Textarea
              value={item.discussion}
              onChange={(e) => updateAgendaItem(i, 'discussion', e.target.value)}
              placeholder="논의 내용"
              className="min-h-[60px] text-xs"
            />
            <Input
              value={item.decision}
              onChange={(e) => updateAgendaItem(i, 'decision', e.target.value)}
              placeholder="결정 사항"
              className="h-8 text-xs"
            />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addAgendaItem} className="w-full">안건 추가</Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">액션 아이템</label>
        {actionItems.map((item, i) => (
          <div key={i} className="p-3 bg-background border border-border rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-muted-foreground">작업 {i + 1}</span>
              {actionItems.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => removeActionItem(i)} className="h-6 text-xs">삭제</Button>
              )}
            </div>
            <Input
              value={item.task}
              onChange={(e) => updateActionItem(i, 'task', e.target.value)}
              placeholder="작업 내용"
              className="h-8 text-xs"
            />
            <div className="flex gap-2">
              <Input
                value={item.assignee}
                onChange={(e) => updateActionItem(i, 'assignee', e.target.value)}
                placeholder="담당자"
                className="h-8 text-xs"
              />
              <Input
                type="date"
                value={item.deadline}
                onChange={(e) => updateActionItem(i, 'deadline', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addActionItem} className="w-full">액션 아이템 추가</Button>
      </div>

      <Button onClick={generate} className="w-full">회의록 생성</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">마크다운 복사</Button>
      <Textarea readOnly value={result} className="min-h-[400px] font-mono text-xs leading-relaxed" />
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      회의 정보를 입력하고 회의록 생성을 클릭하세요
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">회의록 작성기</strong>는 회의 중 논의된 안건, 결정 사항, 액션 아이템 등을 체계적으로 기록하고, 표준화된 마크다운(Markdown) 형식의 회의록을 자동으로 생성하는 업무 생산성 도구입니다. 회의 제목, 날짜, 참석자, 안건별 논의 내용, 액션 아이템 등을 구조화된 폼에 입력하기만 하면 깔끔한 형식의 회의록이 즉시 생성됩니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          팀 미팅, 프로젝트 회의, 스프린트 리뷰, 세미나, 워크숍 등 다양한 유형의 회의에서 활용할 수 있습니다. 회의 중이나 직후에 이 도구를 사용하면 회의 내용을 빠르게 정리할 수 있으며, 생성된 회의록은 마크다운 형식으로 제공되어 GitHub, Notion, Obsidian, Confluence 등 주요 협업 도구에 바로 통합할 수 있습니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          회의록의 핵심 요소인 액션 아이템(작업 내용, 담당자, 마감일)을 별도로 관리할 수 있어, 회의 후속 조치를 체계적으로 추적하는 데에도 유용합니다. 안건은 추가/삭제가 가능하여 회의 규모에 따라 유연하게 조절할 수 있습니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          웹 브라우저에서 바로 사용 가능하며, 생성된 회의록은 마크다운 복사 버튼으로 클립보드에 복사하여 메일, 채팅, 문서 등에 즉시 공유할 수 있습니다. 회의록 표준화를 통해 팀 전체의 커뮤니케이션 효율성을 높여주는 실용적인 도구입니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">회의록 생성 알고리즘:</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          본 도구는 <strong className="text-foreground">구조화 데이터 → 마크다운 변환 알고리즘</strong>을 사용합니다. 사용자가 입력한 회의 정보(제목, 날짜, 참석자, 안건, 액션 아이템)를 마크다운 문법으로 자동 변환하여 표준화된 회의록 문서를 생성합니다.
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">1단계 - 회의 기본 정보 구성:</strong> 회의 제목을 마크다운 제목(#), 날짜와 참석자를 목록(-) 형식으로 변환합니다. 입력되지 않은 정보는 "미정"으로 표시됩니다.</p>
          <p><strong className="text-foreground">2단계 - 안건 및 논의 사항 정리:</strong> 각 안건을 번호 매긴 소제목(###)으로 구성하고, 발표자, 논의 내용, 결정 사항을 각각 마크다운 목록(-) 형식으로 변환합니다. 빈 안건은 자동으로 제외됩니다.</p>
          <p><strong className="text-foreground">3단계 - 액션 아이템 테이블 생성:</strong> 액션 아이템(작업, 담당자, 마감일)을 마크다운 표(|) 형식으로 변환합니다. 이 형식은 GitHub, Notion 등에서 테이블로 깔끔하게 렌더링됩니다.</p>
          <p><strong className="text-foreground">4단계 - 메모 영역 및 출처 표시:</strong> 추가 메모를 위한 빈 체크리스트(- [ ]) 영역과 회의록 생성 출처를 하단에 자동으로 추가합니다.</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">출력 형식:</strong> Markdown - GitHub, Notion, Obsidian, Confluence, Typora 등 모든 마크다운 지원 플랫폼에서 바로 사용 가능합니다. 별도의 포맷 변환 없이 복사-붙여넣기만으로 깔끔한 회의록이 완성됩니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">효과적인 사용법과 팁:</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. 회의 중 실시간으로 기록하세요</p>
            <p>회의가 진행되는 동안 이 도구를 옆에 두고 안건과 논의 내용을 실시간으로 입력하면, 회의 종료 즉시 완성된 회의록을 확보할 수 있습니다. 회의 후 기억에 의존하는 것보다 정확하고 완전한 회의록을 작성할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. 액션 아이템은 구체적으로 작성하세요</p>
            <p>"마케팅 자료 준비"보다는 "2분기 마케팅 예산 계획서 작성 (PDF)"처럼 구체적이고 측정 가능한 형태로 작성하세요. 담당자와 마감일을 반드시 지정하여 회의 후속 조치가 이행되도록 관리하세요.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. 안건은 주제별로 나누어 입력하세요</p>
            <p>하나의 안건에 여러 가지 주제가 섞이면 가독성이 떨어집니다. 각 안건을 하나의 명확한 주제로 정의하고, 필요하면 안건을 추가하여 분리하세요. "안건 추가" 버튼으로 원하는 만큼 안건을 생성할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">4. 마크다운 형식의 장점을 활용하세요</p>
            <p>생성된 회의록은 마크다운 형식이므로, GitHub 레포지토리의 문서로 저장하거나, Notion 페이지에 붙여넣기 하거나, Obsidian 메모로 활용할 수 있습니다. 각 플랫폼에서 자동으로 예쁜 서식으로 렌더링됩니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">5. 팀 공유 문서에 업데이트하세요</p>
            <p>생성된 회의록을 팀이 공유하는 문서(Notion, Google Docs, Confluence 등)에 바로 업데이트하세요. 모든 팀원이 회의 내용과 액션 아이템을 확인할 수 있도록 하면 투명한 협업이 가능합니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">6. 정기적인 회의록 관리 습관을 만드세요</p>
            <p>매 회의마다 이 도구를 사용하여 일관된 형식의 회의록을 작성하면, 시간 경과에 따른 의사 결정 추적과 프로젝트 관리가 훨씬 수월해집니다. 회의록 파일명에 날짜를 포함하는 것도 좋은 습관입니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">7. 메모 영역을 적극 활용하세요</p>
            <p>회의록 하단의 메모 영역은 회의 중 떠오른 아이디어, 추후 논의가 필요한 사항, 개인 메모 등을 기록하는 데 유용합니다. 체크리스트(- [ ]) 형식으로 제공되어 할 일 관리 도구로도 활용할 수 있습니다.</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="회의록 작성기"
      description="체계적인 회의록을 마크다운 형식으로 자동 생성합니다"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default MeetingNotes;
