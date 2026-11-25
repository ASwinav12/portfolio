'use client'

import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PrintButton() {
  return (
    <Button variant="secondary" onClick={() => window.print()} className="no-print">
      <Printer size={16} /> Print / Save as PDF
    </Button>
  )
}
