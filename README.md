# 💰 Daily Expense Management System

A beautiful, modern expense tracking application built with vanilla HTML, CSS, and JavaScript. Features a soothing pastel color palette, dark/light mode toggle, and comprehensive expense management capabilities.

## ✨ Features

### 🧩 Core Functionality
- **Add New Expenses**: Track date, title, category, and amount
- **View & Manage**: Display all expenses with edit and delete options
- **Search & Filter**: Find expenses by description, category, or date range
- **Persistent Storage**: All data saved in localStorage

### 📊 Analytics & Visualization
- **Expense Summary**: Today, This Week, This Month totals
- **Category Breakdown**: Visual breakdown by expense categories
- **Interactive Charts**: Beautiful doughnut chart using Chart.js
- **Real-time Updates**: All summaries and charts update automatically

### 🎨 Design & UX
- **Modern UI**: Clean, minimal design with soft pastel colors
- **Dark/Light Mode**: Smooth theme switching with persistent preference
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Elegant transitions and hover effects

### 🏷️ Expense Categories
- 🍽️ **Food** - Mint green (#06d6a0)
- ✈️ **Travel** - Cool blue (#5c7cfa)
- 🛍️ **Shopping** - Muted coral (#ef476f)
- 📄 **Bills** - Soft yellow (#ffd166)
- 📦 **Others** - Lavender gray (#dcd7ff)

## 🚀 Getting Started

1. **Download the files**:
   - `index.html`
   - `styles.css`
   - `script.js`

2. **Open in browser**:
   - Simply open `index.html` in any modern web browser
   - No server or installation required!

3. **Start tracking**:
   - Add your first expense using the form
   - View summaries and charts
   - Toggle between light and dark modes

## 📱 Usage

### Adding Expenses
1. Select the date (defaults to today)
2. Enter a descriptive title
3. Choose a category from the dropdown
4. Enter the amount
5. Click "Add Expense"

### Managing Expenses
- **Search**: Use the search bar to find specific expenses
- **Filter**: Filter by category or date range
- **Edit**: Click the "✏️ Edit" button on any expense
- **Delete**: Click the "🗑️ Delete" button (with confirmation)

### Viewing Analytics
- **Summary Cards**: See totals for today, this week, and this month
- **Category Breakdown**: View spending by category
- **Chart**: Interactive doughnut chart showing expense distribution

### Theme Switching
- Click the theme toggle button (🌙/☀️) in the top-right corner
- Your preference is automatically saved

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **Chart.js**: Beautiful, responsive charts
- **localStorage**: Client-side data persistence

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
Daily Expense Management/
├── index.html          # Main HTML structure
├── styles.css          # All styling and themes
├── script.js           # Application logic
└── README.md           # This file
```

## 🎨 Color Palette

### Light Mode
- Background: `#f7f8fa`
- Cards: `#ffffff`
- Text: `#2d3436`
- Primary: `#6c63ff`

### Dark Mode
- Background: `#1e1e2f`
- Cards: `#2d2d44`
- Text: `#e0e0e0`
- Primary: `#6c63ff`

## 📊 Data Storage

All expense data is stored locally in your browser's localStorage. This means:
- ✅ Data persists between browser sessions
- ✅ No internet connection required
- ✅ Complete privacy - data stays on your device
- ⚠️ Data is tied to the specific browser and device

## 🔧 Customization

### Adding New Categories
1. Update the category options in `index.html`
2. Add corresponding colors in `styles.css`
3. Update the category mapping in `script.js`

### Modifying Colors
Edit the CSS custom properties in `:root` and `[data-theme="dark"]` sections of `styles.css`.

### Changing Date Format
Modify the `formatDate()` function in `script.js` to use your preferred date format.

## 🐛 Troubleshooting

### Data Not Saving
- Ensure JavaScript is enabled in your browser
- Check if localStorage is available (some private browsing modes disable it)

### Chart Not Displaying
- Verify internet connection (Chart.js is loaded from CDN)
- Check browser console for any JavaScript errors

### Styling Issues
- Clear browser cache and reload
- Ensure all CSS files are in the same directory as HTML

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

---

**Enjoy tracking your expenses with this beautiful, functional application! 💰✨**
