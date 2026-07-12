'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { usePathname } from "next/navigation"

import { cn } from "@/utils"
import { buttonVariants } from "@/components/ui/button"

type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const pathname = usePathname()
  const isKo = pathname?.startsWith('/ko') ?? false

  const koLocale = {
    localize: {
      month: (n: number) => [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
      ][n],
      day: (n: number) => ['일', '월', '화', '수', '목', '금', '토'][n],
      ordinalNumber: (n: number) => `${n}번째`,
      era: (n: number) => ['기원전', '서기'][n],
      quarter: (n: number) => `${n + 1}분기`,
      dayPeriod: (period: string) => period === 'am' ? '오전' : '오후',
    },
    formatLong: {
      date: () => 'yyyy년 MM월 dd일',
      time: () => 'HH시 mm분',
      dateTime: () => 'yyyy년 MM월 dd일 HH시 mm분',
    },
  }

  const enLocale = {
    localize: {
      month: (n: number) => [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ][n],
      day: (n: number) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][n],
      ordinalNumber: (n: number) => {
        const s = ['th', 'st', 'nd', 'rd']
        const v = n % 100
        return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
      },
      era: (n: number) => ['BC', 'AD'][n],
      quarter: (n: number) => `Q${n + 1}`,
      dayPeriod: (period: string) => period === 'am' ? 'AM' : 'PM',
    },
    formatLong: {
      date: () => 'MMM d, yyyy',
      time: () => 'hh:mm a',
      dateTime: () => 'MMM d, yyyy hh:mm a',
    },
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md font-medium text-xs text-center flex-1",
        row: "flex w-full mt-2",
        cell: "h-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex-1",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 flex items-center justify-center"
        ),
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-semibold",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
      }}
      locale={(isKo ? koLocale : enLocale) as CalendarProps['locale']}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }