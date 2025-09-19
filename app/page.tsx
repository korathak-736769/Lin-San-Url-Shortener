"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Copy, Link, BarChart3, Shield, Zap, Github } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useRouter } from "next/navigation"

interface CreateLinkResponse {
  success: boolean
  message: string
  data: {
    _id: string
    long_url: string
    short_code: string
    his_clicks: any[]
    createdAt: string
    updatedAt: string
  }
}

interface ClickHistoryResponse {
  success: boolean
  message: string
  data: {
    his_clicks_total: number
    clean_his_clicks: string[]
  }
}

export default function HomePage() {
  const [longUrl, setLongUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [shortCode, setShortCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [clickHistory, setClickHistory] = useState<ClickHistoryResponse["data"] | null>(null)
  const [chartPeriod, setChartPeriod] = useState<"day" | "week" | "month" | "year">("day")
  const { toast } = useToast()
  const router = useRouter()

  const handleShortenUrl = async () => {
    if (!longUrl.trim()) {
      toast({
        title: "กรุณาใส่ URL",
        description: "โปรดใส่ URL ที่ต้องการย่อ",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ long_url: longUrl }),
      })

      const data: CreateLinkResponse = await response.json()

      if (data.success) {
        const generatedShortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${data.data.short_code}`
        setShortUrl(generatedShortUrl)
        setShortCode(data.data.short_code)
        toast({
          title: "สำเร็จ!",
          description: "ย่อลิงก์เรียบร้อยแล้ว",
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error instanceof Error ? error.message : "ไม่สามารถย่อลิงก์ได้",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      toast({
        title: "คัดลอกแล้ว!",
        description: "คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถคัดลอกได้",
        variant: "destructive",
      })
    }
  }

  const fetchClickHistory = async () => {
    if (!shortCode) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/his/${shortCode}`)
      const data: ClickHistoryResponse = await response.json()

      if (data.success) {
        setClickHistory(data.data)
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลสถิติได้",
        variant: "destructive",
      })
    }
  }

  const generateChartData = () => {
    if (!clickHistory?.clean_his_clicks) return []

    const clicks = clickHistory.clean_his_clicks.map((click) => new Date(click))
    const now = new Date()
    const data = []

    switch (chartPeriod) {
      case "day":
        // Last 24 hours by hour
        for (let i = 23; i >= 0; i--) {
          const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
          const hourStart = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours())
          const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)
          const clickCount = clicks.filter((click) => click >= hourStart && click < hourEnd).length
          data.push({
            time: hourStart.getHours() + ":00",
            clicks: clickCount,
          })
        }
        break

      case "week":
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate())
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
          const clickCount = clicks.filter((click) => click >= dayStart && click < dayEnd).length
          data.push({
            time: dayStart.toLocaleDateString("th-TH", { weekday: "short" }),
            clicks: clickCount,
          })
        }
        break

      case "month":
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
          const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate())
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
          const clickCount = clicks.filter((click) => click >= dayStart && click < dayEnd).length
          data.push({
            time: dayStart.getDate().toString(),
            clicks: clickCount,
          })
        }
        break

      case "year":
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
          const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
          const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 1)
          const clickCount = clicks.filter((click) => click >= monthStart && click < monthEnd).length
          data.push({
            time: monthStart.toLocaleDateString("th-TH", { month: "short" }),
            clicks: clickCount,
          })
        }
        break
    }

    return data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Link className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-balance">Lin-San ลิ้นสั้น</h1>
          </div>
          <p className="text-base sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-2">
            บริการย่อลิงก์ฟรี ใช้งานง่าย ปลอดภัย พร้อมติดตามสถิติการคลิก
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8 sm:pb-16 flex-1 flex flex-col justify-center">
        {/* URL Shortener Form */}
        <Card className="w-full max-w-4xl mx-auto mb-6 sm:mb-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">ย่อลิงก์ของคุณ</CardTitle>
            <CardDescription className="text-sm sm:text-base">ใส่ URL ที่ต้องการย่อ แล้วกดปุ่มย่อลิงก์</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="url"
                placeholder="https://example.com/very/long/url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="flex-1 h-12 text-sm sm:text-base"
                onKeyDown={(e) => e.key === "Enter" && handleShortenUrl()}
              />
              <Button
                onClick={handleShortenUrl}
                disabled={isLoading}
                className="h-12 px-6 sm:px-8 font-semibold"
                size="lg"
              >
                {isLoading ? "กำลังย่อ..." : "ย่อลิงก์"}
              </Button>
            </div>

            {shortUrl && (
              <Card className="bg-muted/50 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs sm:text-sm">
                      ลิงก์ที่ย่อแล้ว
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Input value={shortUrl} readOnly className="flex-1 font-mono text-xs sm:text-sm bg-background" />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none shrink-0 bg-transparent"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        คัดลอก
                      </Button>
                      <Button
                        onClick={fetchClickHistory}
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none shrink-0 bg-transparent"
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        สถิติ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {clickHistory && (
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-4 w-4 text-accent" />
                    <h3 className="font-semibold text-sm sm:text-base">สถิติการคลิก</h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { key: "day", label: "วัน" },
                      { key: "week", label: "สัปดาห์" },
                      { key: "month", label: "เดือน" },
                      { key: "year", label: "ปี" },
                    ].map(({ key, label }) => (
                      <Button
                        key={key}
                        variant={chartPeriod === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setChartPeriod(key as typeof chartPeriod)}
                        className="text-xs"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-accent">{clickHistory.his_clicks_total}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">ครั้งที่คลิก</div>
                    </div>

                    {clickHistory.clean_his_clicks.length > 0 && (
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateChartData()}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="time" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                              labelStyle={{ color: "hsl(var(--foreground))" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="clicks"
                              stroke="hsl(var(--primary))"
                              strokeWidth={3}
                              strokeOpacity={1}
                              connectNulls={false}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              dot={{
                                fill: "hsl(var(--primary))",
                                strokeWidth: 2,
                                r: 4,
                                fillOpacity: 1
                              }}
                              activeDot={{
                                r: 6,
                                stroke: "hsl(var(--primary))",
                                strokeWidth: 2,
                                fill: "hsl(var(--background))",
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {clickHistory.clean_his_clicks.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-sm sm:text-base">การคลิกล่าสุด:</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {clickHistory.clean_his_clicks
                            .slice(-5)
                            .reverse()
                            .map((click, index) => (
                              <div key={index} className="text-xs text-muted-foreground font-mono">
                                {new Date(click).toLocaleString("th-TH")}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Card className="text-center border-0 bg-card/30 backdrop-blur-sm">
              <CardContent className="pt-6 px-4">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">รวดเร็ว</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-pretty">ย่อลิงก์ได้ในพริบตา ไม่ต้องรอนาน</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-card/30 backdrop-blur-sm">
              <CardContent className="pt-6 px-4">
                <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">ปลอดภัย</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-pretty">เข้ารหัสข้อมูลและรักษาความเป็นส่วนตัว</p>
              </CardContent>
            </Card>
            {/* 
            <Card className="text-center border-0 bg-card/30 backdrop-blur-sm">
              <CardContent className="pt-6 px-4">
                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">ติดตามสถิติ</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-pretty">ดูจำนวนการคลิกและประวัติการใช้งาน</p>
              </CardContent>
            </Card> */}

            <Card
              className="text-center border-0 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={() => router.push("/stats")}
            >
              <CardContent className="pt-6 px-4">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full w-fit mx-auto mb-4">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">ดูสถิติลิงก์เดิม</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-pretty">ใส่ลิงก์ที่ย่อแล้วเพื่อดูสถิติ</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 bg-background/50"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/stats")
                  }}
                >
                  ไปดูสถิติ
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Second row - 1 centered card */}
          {/* <div className="flex justify-center">
            <div className="w-full sm:w-1/3">

            </div>
          </div> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Github className="h-4 w-4" />
              <span>สร้างโดย</span>
              <a
                href="https://github.com/korathak-736769"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                korathak-736769
              </a>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 Lin-San URL Shortener. สร้างด้วย ❤️ เพื่อความสะดวกของคุณ
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
