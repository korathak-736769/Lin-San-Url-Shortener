# Lin-San URL Shortener

A modern, free URL shortening service built with Next.js 14, featuring real-time click analytics and a beautiful responsive design.

## ✨ Features

- 🚀 **Lightning Fast** - Shorten URLs instantly with no delays
- 🔒 **Secure** - Data encryption and privacy protection
- 📊 **Analytics** - Track click statistics with interactive charts
- 📱 **Responsive** - Perfect experience on all devices
- 🎨 **Modern UI** - Beautiful design with Tailwind CSS and shadcn/ui
- 🇹🇭 **Thai Language** - Full Thai language support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Font**: Geist Sans & Mono
- **Analytics**: Vercel Analytics

## 📱 Pages

### Home Page (`/`)
- URL shortening interface
- Real-time click statistics for newly created links
- Interactive charts (day/week/month/year views)
- Feature showcase cards

### Stats Page (`/stats`)
- Look up statistics for existing shortened URLs
- Same analytics features as home page
- Mobile-optimized responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/korathak-736769/Lin-San-Url-Shortener.git
cd Lin-San-Url-Shortener
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 API Integration

The application integrates with a backend API for:

- `POST /link` - Create shortened URLs
- `GET /link/his/{shortCode}` - Retrieve click statistics

### API Response Format

#### Create Link Response
```json
{
  "success": true,
  "message": "Link created successfully",
  "data": {
    "_id": "string",
    "long_url": "string",
    "short_code": "string",
    "his_clicks": [],
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Click History Response
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "his_clicks_total": 42,
    "clean_his_clicks": ["2025-09-20T10:30:00Z", "..."]
  }
}
```

## 🎨 Design Features

### Responsive Layout
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - `sm:` - 640px and up (tablets)
  - `lg:` - 1024px and up (desktops)

### Feature Cards Layout
- **First Row**: 3 cards (Fast, Secure, Analytics)
- **Second Row**: 1 centered card (View Existing Stats)

### Interactive Charts
- **Time Periods**: Day, Week, Month, Year views
- **Real-time Data**: Live click tracking
- **Responsive**: Adapts to screen size

## 🔧 Components Structure

```
components/
├── ui/                 # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── toast.tsx
│   └── toaster.tsx
└── theme-provider.tsx

app/
├── layout.tsx         # Root layout with Toaster
├── page.tsx          # Home page
├── stats/
│   └── page.tsx      # Statistics page
└── globals.css       # Global styles
```

## 📱 Mobile Optimization

### Home Page
- Responsive grid layout
- Touch-friendly buttons
- Optimized input fields
- Collapsible navigation

### Stats Page
- Smaller chart dimensions on mobile
- Compact period selection buttons
- Improved spacing and typography
- Enhanced touch targets

## 🎯 Features in Detail

### URL Shortening
- Instant URL shortening
- Custom short codes generation
- Copy to clipboard functionality
- Input validation

### Analytics Dashboard
- Real-time click tracking
- Interactive line charts
- Multiple time period views
- Recent clicks history
- Total click counter

### User Experience
- Toast notifications for user feedback
- Loading states and animations
- Error handling and validation
- Responsive design patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**korathak-736769**
- GitHub: [@korathak-736769](https://github.com/korathak-736769)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for your convenience | สร้างด้วย ❤️ เพื่อความสะดวกของคุณ
