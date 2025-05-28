// src/app/imu/layout.tsx
import { ReactNode } from 'react'

export default function IMULayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
