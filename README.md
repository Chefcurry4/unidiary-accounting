# UniDiary Accounting

An elegant, Aurora-themed expense management platform designed specifically for startups. Track expenses, manage budgets, and visualize financial data with a stunning dark interface featuring animated gradients and frosted-glass UI components.

![UniDiary Accounting](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 📊 Dashboard Overview
- Real-time financial metrics and statistics
- Total expenses tracking (monthly and all-time)
- Remaining budget visualization
- Quick insights into spending patterns

### 💰 Expense Tracking
- Add, edit, and delete expenses with ease
- Categorize expenses (Software, Marketing, Salaries, Office, Travel, Equipment, Utilities, Other)
- Support for recurring expenses (weekly, monthly, yearly)
- Date picker and amount input with validation

### ⏰ Upcoming Expenses Widget
- Visual timeline of scheduled/recurring payments
- Color-coded urgency badges:
  - 🔴 **Red**: Overdue (with glow effect)
  - 🟠 **Orange**: Due within 3 days
  - 🟢 **Green**: Upcoming (more than 3 days)
- Quick "Mark as Paid" functionality
- Automatic sorting by due date

### 📈 Budget Management
- Set monthly or yearly budgets by category
- Real-time progress bars showing budget consumption
- Visual warnings at 80% threshold
- Alerts when budgets are exceeded

### 📉 Interactive Charts
- **Pie Chart**: Category breakdown of expenses
- **Bar Chart**: Monthly expense trends
- **Line Chart**: Budget vs. actual spending comparison
- Powered by Recharts with smooth animations

### 🎨 Aurora Dark Theme
Replicates the stunning Aurora (Dark/Night) theme with:
- Deep purple-black background (`#1a0b2e`)
- Soft lavender text (`#e0d4fc`)
- Animated gradient blobs in cosmic colors
- Grainy texture overlay using SVG fractal noise
- Frosted-glass UI components with backdrop blur

## 🚀 Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with custom Aurora theme
- **UI Components**: Shadcn UI v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Phosphor Icons React
- **Data Persistence**: Supabase (PostgreSQL backend)
- **Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/unidiaryaccounting.git
   cd unidiaryaccounting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
unidiaryaccounting/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── GrainyBackground.tsx
│   │   ├── GlassCard.tsx
│   │   ├── StatsOverview.tsx
│   │   ├── UpcomingExpensesWidget.tsx
│   │   ├── Charts.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   └── BudgetOverview.tsx
│   ├── lib/
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── expense-utils.ts # Utility functions
│   │   └── utils.ts         # General utilities
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles and theme
│   └── main.tsx             # Application entry point
├── PRD.md                   # Product Requirements Document
└── README.md
```

## 🎨 Theme Customization

The Aurora theme is defined in `src/index.css` with the following core colors:

```css
:root {
  --background: oklch(0.12 0.08 285);      /* Deep purple-black */
  --foreground: oklch(0.90 0.08 285);      /* Soft lavender */
  --primary: oklch(0.65 0.18 265);         /* Indigo */
  --success: oklch(0.70 0.20 155);         /* Green */
  --warning: oklch(0.75 0.15 75);          /* Orange */
  --destructive: oklch(0.55 0.22 15);      /* Red */
}
```

### Aurora Gradient Colors
The animated background blobs use these colors:
- Purple: `#764ba2`
- Indigo: `#667eea`
- Green: `#43e97b`
- Pink: `#fa709a`
- Blue: `#2980b9`

## 💾 Data Persistence

UniDiary uses Supabase for backend data persistence:

- **Expenses**: Stored in the `expenses` table
- **Budgets**: Stored in the `budgets` table
- **Profiles**: Stored in the `profiles` table

### Setup Instructions

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create the following tables in your Supabase database:

**Expenses Table:**
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  isRecurring BOOLEAN NOT NULL DEFAULT false,
  recurrenceInterval TEXT,
  nextDueDate TEXT,
  isPaid BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Budgets Table:**
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  period TEXT NOT NULL,
  startDate TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Profiles Table:**
```sql
CREATE TABLE profiles (
  userId TEXT PRIMARY KEY,
  bio TEXT,
  location TEXT,
  company TEXT,
  phone TEXT
);
```

3. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables with your Supabase project URL and anon key.

All data is stored securely in Supabase and synced in real-time.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Design

UniDiary is fully responsive across:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

Mobile features include:
- Collapsible navigation
- Touch-optimized controls
- Simplified chart layouts

## 🎯 Key Features Explained

### Upcoming Expenses Intelligence
The platform automatically:
- Calculates days until due for recurring expenses
- Assigns urgency levels based on proximity to due date
- Highlights overdue items with pulsing glow effect
- Sorts expenses by urgency

### Budget Tracking Algorithm
Budget progress is calculated by:
1. Filtering expenses by category (if applicable)
2. Filtering by time period (monthly/yearly)
3. Summing total spent amount
4. Calculating percentage: `(spent / budget) * 100`
5. Applying visual warnings at thresholds

### Category Statistics
The dashboard aggregates expenses by category showing:
- Total amount per category
- Number of transactions
- Percentage of total spending
- Visual breakdown in pie chart

## 🔮 Future Enhancements

Potential features for future releases:
- PDF report export
- Multi-currency support
- Team collaboration features
- Custom category creation
- Advanced filtering and search
- Email notifications for upcoming payments
- Integration with accounting software

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from [StealthFrontend](https://github.com/Chefcurry4/StealthFrontend)
- UI components by [Shadcn UI](https://ui.shadcn.com/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Charts by [Recharts](https://recharts.org/)

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ for startups managing their finances
