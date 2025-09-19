"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, Link } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Link className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-balance">Lin-San</h1>
          </div>
        </div>

        {/* 404 Card */}
        <Card className="max-w-md mx-auto shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl">ไม่พบลิงก์</CardTitle>
            <CardDescription className="text-base">ขออภัย ลิงก์ที่คุณค้นหาไม่มีอยู่ในระบบ หรืออาจถูกลบไปแล้ว</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">กรุณาตรวจสอบลิงก์อีกครั้ง หรือกลับไปหน้าหลักเพื่อสร้างลิงก์ใหม่</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/")} className="w-full font-semibold" size="lg">
                <Home className="h-4 w-4 mr-2" />
                กลับหน้าหลัก
              </Button>
              <Button onClick={() => router.back()} variant="outline" className="w-full" size="lg">
                ย้อนกลับ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="text-sm text-muted-foreground">
            <p>© 2025 Lin-San URL Shortener. สร้างด้วย ❤️ เพื่อความสะดวกของคุณ</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
