# 🔗 Zyppd

A modern, feature-rich URL shortener built with Next.js 14, offering custom domains, advanced analytics, and premium features for businesses and professionals.

## ✨ Features

### 🆓 Free Tier
- Create custom short links
- Password protection for links
- Link expiration dates
- Basic analytics (clicks, countries, referrers)
- Branded short links with zyppd.cc domain

### 👑 Premium Tier
- Custom domains (use your own domain)
- Advanced analytics with detailed charts
- Unlimited links
- API access
- Priority support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth App (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishikesh-suvarna/zyppd.git
   cd zyppd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/zyppd"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # App
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Google)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## 📖 Usage

### Creating Short Links

1. Sign in with your Google account
2. Go to the Dashboard
3. Click "Create New Link"
4. Enter your URL and optional settings:
   - Custom short code
   - Password protection
   - Expiration date
   - Title and description

### Analytics

View detailed analytics for your links:
- Click statistics over time
- Geographic data (countries)
- Referrer information
- Device and browser data

### Custom Domains (Premium)

1. Upgrade to Premium
2. Go to Settings → Custom Domains
3. Add your domain
4. Follow DNS setup instructions
5. Use your domain for short links

## 🛠️ API Reference

### Authentication
All API endpoints require authentication via NextAuth session.

### Create Link
```bash
POST /api/links
Content-Type: application/json

{
  "originalUrl": "https://example.com",
  "shortCode": "my-link",
  "title": "My Link",
  "password": "secret123",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### Get Links
```bash
GET /api/links?page=1&limit=10&search=example
```

### Get Analytics
```bash
GET /api/links/{linkId}/analytics
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Your app URL | ✅ |
| `NEXTAUTH_SECRET` | NextAuth secret key | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Public app URL | ✅ |

## 📁 Project Structure

```
zyppd/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── [shortCode]/       # Dynamic redirect pages
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: rishikeshsuvarna@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/rishikesh-suvarna/zyppd/issues)