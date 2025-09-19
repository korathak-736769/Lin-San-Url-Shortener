"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, BarChart3, Link } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useRouter } from "next/navigation"

interface ClickHistoryResponse {
    success: boolean
    message: string
    data: {
        his_clicks_total: number
        clean_his_clicks: string[]
    }
}

export default function StatsPage() {
    const [lookupUrl, setLookupUrl] = useState("")
    const [lookupClickHistory, setLookupClickHistory] = useState<ClickHistoryResponse["data"] | null>(null)
    const [lookupChartPeriod, setLookupChartPeriod] = useState<"day" | "week" | "month" | "year">("day")
    const [isLookupLoading, setIsLookupLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    // Function to extract short code from URL
    const extractShortCodeFromUrl = (url: string): string | null => {
        try {
            const urlObj = new URL(url)
            const pathParts = urlObj.pathname.split('/')
            if (pathParts.length >= 3 && pathParts[1] === 'link') {
                return pathParts[2]
            }
            return null
        } catch {
            return null
        }
    }

    // Function to lookup click history for existing URL
    const handleLookupStats = async () => {
        if (!lookupUrl.trim()) {
            toast({
                title: "กรุณาใส่ URL",
                description: "โปรดใส่ลิงก์ที่ต้องการดูสถิติ",
                variant: "destructive",
            })
            return
        }

        const extractedShortCode = extractShortCodeFromUrl(lookupUrl)
        if (!extractedShortCode) {
            toast({
                title: "URL ไม่ถูกต้อง",
                description: "กรุณาใส่ลิงก์ที่ย่อจากระบบนี้",
                variant: "destructive",
            })
            return
        }

        setIsLookupLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/his/${extractedShortCode}`)
            const data: ClickHistoryResponse = await response.json()

            if (data.success) {
                setLookupClickHistory(data.data)
                toast({
                    title: "พบข้อมูลสถิติ!",
                    description: "ดึงข้อมูลสถิติเรียบร้อยแล้ว",
                })
            } else {
                throw new Error(data.message)
            }
        } catch (error) {
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่พบข้อมูลสถิติสำหรับลิงก์นี้",
                variant: "destructive",
            })
        } finally {
            setIsLookupLoading(false)
        }
    }

    // Generate chart data for lookup URL
    const generateLookupChartData = () => {
        if (!lookupClickHistory?.clean_his_clicks) return []

        const clicks = lookupClickHistory.clean_his_clicks.map((click) => new Date(click))
        const now = new Date()
        const data = []

        switch (lookupChartPeriod) {
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
            <header className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-primary" />
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-balance">ดูสถิติลิงก์</h1>
                    </div>
                    <p className="text-sm sm:text-base lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-1 sm:px-2">
                        ใส่ลิงก์ที่ย่อแล้วเพื่อดูสถิติการคลิก
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-2 sm:px-4 pb-6 sm:pb-8 lg:pb-16 flex-1 flex flex-col justify-center">
                {/* Back Button */}
                <div className="w-full max-w-4xl mx-auto mb-3 sm:mb-4">
                    <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
                    >
                        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                        กลับหน้าหลัก
                    </Button>
                </div>

                {/* Lookup URL Stats */}
                <Card className="w-full max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="text-center px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                        <CardTitle className="text-lg sm:text-xl lg:text-2xl">ดูสถิติลิงก์เดิม</CardTitle>
                        <CardDescription className="text-xs sm:text-sm lg:text-base">ใส่ลิงก์ที่ย่อแล้วเพื่อดูสถิติการคลิก</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 lg:px-6">
                        <div className="flex flex-col gap-2">
                            <Input
                                type="url"
                                placeholder="https://example.com/abc123"
                                value={lookupUrl}
                                onChange={(e) => setLookupUrl(e.target.value)}
                                className="h-10 sm:h-12 text-xs sm:text-sm lg:text-base px-3 sm:px-4"
                                onKeyDown={(e) => e.key === "Enter" && handleLookupStats()}
                            />
                            <Button
                                onClick={handleLookupStats}
                                disabled={isLookupLoading}
                                className="h-10 sm:h-12 px-4 sm:px-6 lg:px-8 font-semibold text-xs sm:text-sm lg:text-base"
                                size="default"
                            >
                                {isLookupLoading ? "กำลังค้นหา..." : "ดูสถิติ"}
                            </Button>
                        </div>

                        {lookupClickHistory && (
                            <Card className="bg-accent/5 border-accent/20">
                                <CardContent className="pt-4 sm:pt-6 px-3 sm:px-4 lg:px-6">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                        <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                                        <h3 className="font-semibold text-xs sm:text-sm lg:text-base">สถิติการคลิก</h3>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                        {[
                                            { key: "day", label: "วัน" },
                                            { key: "week", label: "สัปดาห์" },
                                            { key: "month", label: "เดือน" },
                                            { key: "year", label: "ปี" },
                                        ].map(({ key, label }) => (
                                            <Button
                                                key={key}
                                                variant={lookupChartPeriod === key ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setLookupChartPeriod(key as typeof lookupChartPeriod)}
                                                className="text-xs px-2 sm:px-3 py-1 sm:py-1.5 h-auto"
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                        <div className="text-center">
                                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent">{lookupClickHistory.his_clicks_total}</div>
                                            <div className="text-xs sm:text-sm text-muted-foreground">ครั้งที่คลิก</div>
                                        </div>

                                        {lookupClickHistory.clean_his_clicks.length > 0 && (
                                            <div className="h-48 sm:h-56 lg:h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={generateLookupChartData()}>
                                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                                        <XAxis
                                                            dataKey="time"
                                                            tick={{ fontSize: 10 }}
                                                            className="text-muted-foreground"
                                                            interval="preserveStartEnd"
                                                        />
                                                        <YAxis
                                                            tick={{ fontSize: 10 }}
                                                            className="text-muted-foreground"
                                                            width={30}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor: "hsl(var(--card))",
                                                                border: "1px solid hsl(var(--border))",
                                                                borderRadius: "6px",
                                                                fontSize: "11px",
                                                            }}
                                                            labelStyle={{ color: "hsl(var(--foreground))" }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="clicks"
                                                            stroke="hsl(var(--primary))"
                                                            strokeWidth={2}
                                                            strokeOpacity={1}
                                                            connectNulls={false}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            dot={{
                                                                fill: "hsl(var(--primary))",
                                                                strokeWidth: 1,
                                                                r: 3,
                                                                fillOpacity: 1
                                                            }}
                                                            activeDot={{
                                                                r: 5,
                                                                stroke: "hsl(var(--primary))",
                                                                strokeWidth: 2,
                                                                fill: "hsl(var(--background))",
                                                            }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}

                                        {lookupClickHistory.clean_his_clicks.length > 0 && (
                                            <div>
                                                <h4 className="font-medium mb-2 text-xs sm:text-sm lg:text-base">การคลิกล่าสุด:</h4>
                                                <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto">
                                                    {lookupClickHistory.clean_his_clicks
                                                        .slice(-5)
                                                        .reverse()
                                                        .map((click, index) => (
                                                            <div key={index} className="text-xs text-muted-foreground font-mono break-all">
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
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/30 backdrop-blur-sm mt-auto">
                <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
                    <div className="text-center space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                            <Link className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Lin-San URL Shortener</span>
                        </div>
                        <p className="text-xs text-muted-foreground px-2">
                            © 2025 Lin-San URL Shortener. สร้างด้วย ❤️ เพื่อความสะดวกของคุณ
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}