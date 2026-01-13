# Planning Guide

UniDiary Accounting is an elegant expense management platform for startups featuring Aurora-inspired dark aesthetics, real-time budget tracking, and intelligent upcoming expense monitoring.

**Experience Qualities**:
1. **Ethereal** - The interface should feel like floating through a cosmic void with glowing elements and smooth gradients that create depth and atmosphere
2. **Sophisticated** - Professional frosted-glass components and refined typography convey trust and competence for financial management
3. **Responsive** - Every interaction should feel immediate and fluid with smooth animations that guide attention without distracting from core functionality

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused expense tracking tool with dashboard, budget management, and upcoming payments - functional enough for real startup use but streamlined for quick deployment and ease of use.

## Essential Features

### Dashboard Overview
- **Functionality**: Displays key metrics including total expenses, remaining budget, top categories, and upcoming payments
- **Purpose**: Provides at-a-glance financial health check for startup founders
- **Trigger**: Loads automatically on app entry or when clicking "Dashboard" navigation
- **Progression**: App loads → Grainy background animates in → Stats cards fade in with stagger → Charts render with smooth transitions → User scans metrics
- **Success criteria**: All current month data loads within 500ms, charts are interactive, metrics update in real-time

### Expense Management
- **Functionality**: Create, edit, delete, and categorize expenses with date and amount tracking
- **Purpose**: Maintains accurate record of all business spending for budgeting and tax purposes
- **Trigger**: Click "Add Expense" button or edit icon on existing expense
- **Progression**: Click add → Modal slides up → Fill form fields → Select category → Set date → Submit → Toast notification → Expense appears in list with animation
- **Success criteria**: Form validation prevents invalid entries, expenses save to KV store, list updates immediately

### Upcoming Expenses Widget
- **Functionality**: Shows scheduled/recurring expenses with color-coded urgency badges and payment tracking
- **Purpose**: Prevents missed payments and helps with cash flow planning
- **Trigger**: Automatically displays on dashboard, updates daily
- **Progression**: Dashboard loads → Widget appears → Expenses sorted by due date → User sees color badges (red/orange/green) → Click "Mark Paid" → Item archives with fade animation
- **Success criteria**: Overdue items glow red, upcoming items show countdown, marking as paid removes from active list

### Budget Tracking
- **Functionality**: Set monthly budgets per category with visual progress indicators
- **Purpose**: Prevents overspending and maintains financial discipline
- **Trigger**: Click "Set Budget" or edit existing budget
- **Progression**: Open budget modal → Set amount → Choose category → Save → Progress bar appears → Bar fills based on spending → Warning appears at 80% threshold
- **Success criteria**: Progress bars accurately reflect spending percentage, warnings appear before exceeding limits

### Interactive Visualizations
- **Functionality**: Pie chart for category breakdown, bar chart for monthly trends, line chart for budget vs actual
- **Purpose**: Makes financial patterns visible and actionable at a glance
- **Trigger**: Charts load with dashboard, update when filters change
- **Progression**: Dashboard loads → Chart skeletons appear → Data fetches → Charts animate in → Hover shows tooltips → Click segment filters related data
- **Success criteria**: Charts render within 300ms, animations are smooth, tooltips show precise values

## Edge Case Handling

- **No Expenses Yet** - Show welcoming empty state with illustration and "Add Your First Expense" CTA
- **Budget Exceeded** - Display prominent warning banner with red glow, suggest budget adjustment or expense review
- **Invalid Amounts** - Prevent negative numbers, enforce maximum 10 digits, show inline validation errors
- **Past Due Dates** - Allow backdating expenses for forgotten entries, highlight in orange
- **Deleted Categories** - Preserve historical expenses with archived category label, prevent new assignments
- **Offline State** - Show connection status banner, queue changes for sync when reconnected
- **Empty Date Ranges** - Display helpful message suggesting different filters when report has no data

## Design Direction

The design should evoke a sense of floating through deep space with ethereal aurora lights - mysterious yet trustworthy, modern yet timeless. The dark cosmic background with animated gradient blobs creates depth while frosted-glass cards with subtle lavender glows make data feel precious and carefully curated.

## Color Selection

The color scheme draws from cosmic auroras with deep purple-black backgrounds and vibrant accent gradients, creating high contrast for readability while maintaining atmospheric depth.

- **Primary Color**: Indigo (#667eea / oklch(0.65 0.18 265)) - Represents trust and technology, used for primary actions and key interactive elements
- **Secondary Colors**: Deep purple-black (#1a0b2e / oklch(0.12 0.08 285)) for backgrounds, soft lavender (#e0d4fc / oklch(0.90 0.08 285)) for text, creating a cohesive cosmic palette
- **Accent Color**: Aurora gradient array using purple (#764ba2), indigo (#667eea), green (#43e97b), pink (#fa709a), blue (#2980b9) - Attention-grabbing animated blobs and status indicators
- **Foreground/Background Pairings**: 
  - Background (#1a0b2e): Lavender text (#e0d4fc) - Ratio 11.2:1 ✓
  - Card (rgba(0,0,0,0.3)): Lavender text (#e0d4fc) - Ratio 13.5:1 ✓
  - Primary (#667eea): Dark purple text (#1a0b2e) - Ratio 7.8:1 ✓
  - Input (rgba(0,0,0,0.4)): Lavender text (#e0d4fc) - Ratio 14.1:1 ✓

## Font Selection

Typography should feel modern and technical yet approachable - clean sans-serifs with geometric precision that complement the cosmic theme without feeling cold.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold / 32px / -0.02em tracking / Lavender
  - H2 (Section Headers): Inter Semibold / 24px / -0.01em tracking / Lavender
  - H3 (Card Titles): Inter Medium / 18px / normal tracking / Lavender
  - Body (Primary): Inter Regular / 14px / normal tracking / Lavender 90%
  - Body (Muted): Inter Regular / 14px / normal tracking / Lavender 60%
  - Labels: Inter Medium / 12px / 0.02em tracking / Lavender 70%
  - Numbers (Amounts): Inter Semibold / 20px / -0.01em / Lavender (tabular-nums)

## Animations

Animations should feel weightless and ethereal like objects floating in zero gravity, with smooth easing that suggests organic cosmic movement rather than mechanical precision.

- **Gradient Blobs**: Infinite slow movement (20-30s duration) with custom cubic-bezier easing, creating organic aurora-like flows
- **Card Entrances**: Fade up with 300ms duration, staggered by 50ms for list items, scale from 0.95 to 1.0
- **Hover States**: Subtle scale (1.02) and glow increase over 200ms, suggesting levitation
- **Modal Transitions**: Slide up from bottom (mobile) or scale from center (desktop) with backdrop blur, 250ms duration
- **Chart Animations**: Sequential bar/segment rendering with 400ms delay between elements, spring physics for final values
- **Status Changes**: Color transitions over 300ms, combined with subtle pulse animation for emphasis

## Component Selection

- **Components**: 
  - Card for all data containers with frosted-glass styling
  - Dialog for expense forms and budget settings
  - Button with primary (filled indigo) and secondary (outlined) variants
  - Input with dark translucent background and lavender borders
  - Select for category dropdowns
  - Progress bars for budget tracking
  - Badge for status indicators (overdue/upcoming)
  - Tabs for dashboard sections
  - Calendar (react-day-picker) for date selection
  - Toast (sonner) for notifications
  - Recharts for visualizations
  
- **Customizations**: 
  - Custom GrainyBackground component with SVG fractal noise filter
  - AuroraBlob component for animated gradient spheres
  - GlassCard wrapper applying backdrop-blur-xl and translucent backgrounds
  - Custom Progress component with gradient fills
  
- **States**: 
  - Buttons: Default (solid indigo), hover (scale + glow), active (scale down), disabled (40% opacity)
  - Inputs: Default (border lavender 30%), focus (border lavender 60% + ring glow), error (border red + shake)
  - Cards: Default (subtle border), hover (border brighten + shadow glow)
  
- **Icon Selection**: 
  - Wallet for expenses, ChartBar for budget, Calendar for upcoming, Plus for add actions
  - TrendingUp/Down for positive/negative trends
  - Warning for budget alerts, Check for completed items
  - All icons from @phosphor-icons/react at default 24px weight
  
- **Spacing**: 
  - Container padding: p-6 (24px) on desktop, p-4 (16px) on mobile
  - Card gaps: gap-4 (16px) for related items
  - Section spacing: space-y-6 (24px) between major sections
  - Grid gaps: gap-6 (24px) for dashboard cards
  
- **Mobile**: 
  - Single column layout below 768px
  - Sticky header with hamburger menu
  - Bottom sheet dialogs instead of centered modals
  - Touch-friendly 44px minimum tap targets
  - Charts switch to simplified mobile variants (pie → list, complex bar → simple bar)
