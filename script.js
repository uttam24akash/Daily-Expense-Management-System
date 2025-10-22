// Daily Expense Management System - JavaScript

class ExpenseManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.expenses = this.loadExpenses();
        this.chart = null;
        this.currentEditId = null;
        
        this.initializeAuth();
        this.initializeEventListeners();
        this.setDefaultDate();
        this.renderExpenses();
        this.updateSummary();
        this.initializeChart();
        this.initializeTheme();
    }

    // Authentication methods
    initializeAuth() {
        if (this.currentUser) {
            this.showMainApp();
        } else {
            this.showLoginPage();
        }
    }

    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    showLoginPage() {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('mainContainer').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'block';
        document.getElementById('userName').textContent = this.currentUser ? this.currentUser.name : 'Guest User';
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Authentication event listeners
        document.querySelectorAll('.login-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-login-tab');
                this.switchLoginTab(tab);
            });
        });

        document.getElementById('signInForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.signIn();
        });

        document.getElementById('signUpForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.signUp();
        });

        document.getElementById('guestLogin').addEventListener('click', () => {
            this.guestLogin();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Form submission
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
        });

        // Edit form submission
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateExpense();
        });

        // Modal controls
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => {
            this.renderExpenses();
        });

        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.renderExpenses();
        });

        document.getElementById('dateFrom').addEventListener('change', () => {
            this.renderExpenses();
        });

        document.getElementById('dateTo').addEventListener('change', () => {
            this.renderExpenses();
        });

        // Theme toggles
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        document.getElementById('themeToggleLarge').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Settings page functionality
        document.getElementById('exportJSON').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportPDF();
        });

        document.getElementById('exportImage').addEventListener('click', () => {
            this.exportImage();
        });

        document.getElementById('importData').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        document.getElementById('clearData').addEventListener('click', () => {
            this.clearAllData();
        });

        // Close modal on outside click
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });
    }

    // Set default date to today
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
    }

    // Load expenses from localStorage
    loadExpenses() {
        const userKey = this.currentUser ? `expenses_${this.currentUser.email}` : 'guest_expenses';
        const stored = localStorage.getItem(userKey);
        return stored ? JSON.parse(stored) : [];
    }

    // Save expenses to localStorage
    saveExpenses() {
        const userKey = this.currentUser ? `expenses_${this.currentUser.email}` : 'guest_expenses';
        localStorage.setItem(userKey, JSON.stringify(this.expenses));
    }

    // Authentication methods
    switchLoginTab(tab) {
        document.querySelectorAll('.login-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
        
        document.querySelector(`[data-login-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Form`).classList.add('active');
    }

    signIn() {
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.setCurrentUser(user);
            this.expenses = this.loadExpenses();
            this.showMainApp();
            this.renderExpenses();
            this.updateSummary();
            this.updateChart();
            this.showNotification(`Welcome back, ${user.name}!`, 'success');
        } else {
            this.showNotification('Invalid email or password', 'error');
        }
    }

    signUp() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        const users = this.getUsers();
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            this.showNotification('Email already exists', 'error');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        this.setCurrentUser(newUser);
        this.expenses = this.loadExpenses();
        this.showMainApp();
        this.renderExpenses();
        this.updateSummary();
        this.updateChart();
        this.showNotification(`Account created successfully, ${name}!`, 'success');
    }

    guestLogin() {
        this.setCurrentUser(null);
        this.expenses = this.loadExpenses();
        this.showMainApp();
        this.renderExpenses();
        this.updateSummary();
        this.updateChart();
        this.showNotification('Logged in as guest. Data will not be saved permanently.', 'info');
    }

    logout() {
        this.setCurrentUser(null);
        this.expenses = this.loadExpenses();
        this.showLoginPage();
        this.showNotification('Logged out successfully', 'success');
    }

    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Add new expense
    addExpense() {
        const form = document.getElementById('expenseForm');
        const formData = new FormData(form);
        
        const expense = {
            id: Date.now().toString(),
            date: formData.get('date'),
            title: formData.get('title').trim(),
            category: formData.get('category'),
            amount: parseFloat(formData.get('amount'))
        };

        // Validation
        if (!this.validateExpense(expense)) {
            return;
        }

        this.expenses.unshift(expense);
        this.saveExpenses();
        this.renderExpenses();
        this.updateSummary();
        this.updateChart();
        this.resetForm();
        this.showNotification('Expense added successfully!', 'success');
    }

    // Validate expense data
    validateExpense(expense) {
        if (!expense.title) {
            this.showNotification('Please enter a title/description', 'error');
            return false;
        }
        if (!expense.category) {
            this.showNotification('Please select a category', 'error');
            return false;
        }
        if (!expense.amount || expense.amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return false;
        }
        return true;
    }

    // Update existing expense
    updateExpense() {
        const form = document.getElementById('editForm');
        const formData = new FormData(form);
        
        const updatedExpense = {
            id: this.currentEditId,
            date: formData.get('date'),
            title: formData.get('title').trim(),
            category: formData.get('category'),
            amount: parseFloat(formData.get('amount'))
        };

        if (!this.validateExpense(updatedExpense)) {
            return;
        }

        const index = this.expenses.findIndex(expense => expense.id === this.currentEditId);
        if (index !== -1) {
            this.expenses[index] = updatedExpense;
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.updateChart();
            this.closeModal();
            this.showNotification('Expense updated successfully!', 'success');
        }
    }

    // Delete expense
    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.updateChart();
            this.showNotification('Expense deleted successfully!', 'success');
        }
    }

    // Edit expense
    editExpense(id) {
        const expense = this.expenses.find(expense => expense.id === id);
        if (expense) {
            this.currentEditId = id;
            document.getElementById('editId').value = id;
            document.getElementById('editDate').value = expense.date;
            document.getElementById('editTitle').value = expense.title;
            document.getElementById('editCategory').value = expense.category;
            document.getElementById('editAmount').value = expense.amount;
            this.showModal();
        }
    }

    // Show modal
    showModal() {
        document.getElementById('editModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeModal() {
        document.getElementById('editModal').classList.remove('show');
        document.body.style.overflow = 'auto';
        this.currentEditId = null;
    }

    // Reset form
    resetForm() {
        document.getElementById('expenseForm').reset();
        this.setDefaultDate();
    }

    // Get filtered expenses
    getFilteredExpenses() {
        let filtered = [...this.expenses];

        // Search filter
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(expense => 
                expense.title.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter').value;
        if (categoryFilter) {
            filtered = filtered.filter(expense => expense.category === categoryFilter);
        }

        // Date range filter
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        
        if (dateFrom) {
            filtered = filtered.filter(expense => expense.date >= dateFrom);
        }
        if (dateTo) {
            filtered = filtered.filter(expense => expense.date <= dateTo);
        }

        return filtered;
    }

    // Render expenses list
    renderExpenses() {
        const expensesList = document.getElementById('expensesList');
        const expenseCount = document.getElementById('expenseCount');
        const filteredExpenses = this.getFilteredExpenses();

        expenseCount.textContent = `${filteredExpenses.length} expense${filteredExpenses.length !== 1 ? 's' : ''}`;

        if (filteredExpenses.length === 0) {
            expensesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-text">No expenses found</div>
                    <div class="empty-state-subtext">Try adjusting your search or filters</div>
                </div>
            `;
            return;
        }

        expensesList.innerHTML = filteredExpenses.map(expense => `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-title">${this.escapeHtml(expense.title)}</div>
                    <div class="expense-meta">
                        <span class="expense-category ${expense.category}">${this.getCategoryEmoji(expense.category)} ${this.getCategoryName(expense.category)}</span>
                        <span>${this.formatDate(expense.date)}</span>
                    </div>
                </div>
                <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                <div class="expense-actions">
                    <button class="btn btn-sm btn-secondary" onclick="expenseManager.editExpense('${expense.id}')">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="expenseManager.deleteExpense('${expense.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Update summary
    updateSummary() {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const todayTotal = this.expenses
            .filter(expense => expense.date === today)
            .reduce((sum, expense) => sum + expense.amount, 0);

        const weekTotal = this.expenses
            .filter(expense => expense.date >= weekAgo)
            .reduce((sum, expense) => sum + expense.amount, 0);

        const monthTotal = this.expenses
            .filter(expense => expense.date >= monthAgo)
            .reduce((sum, expense) => sum + expense.amount, 0);

        document.getElementById('todayTotal').textContent = `$${todayTotal.toFixed(2)}`;
        document.getElementById('weekTotal').textContent = `$${weekTotal.toFixed(2)}`;
        document.getElementById('monthTotal').textContent = `$${monthTotal.toFixed(2)}`;

        this.updateCategoryBreakdown();
    }

    // Update category breakdown
    updateCategoryBreakdown() {
        const categoryBreakdown = document.getElementById('categoryBreakdown');
        const categories = ['food', 'travel', 'shopping', 'bills', 'others'];
        
        const categoryTotals = categories.map(category => {
            const total = this.expenses
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + expense.amount, 0);
            return { category, total };
        }).filter(item => item.total > 0);

        if (categoryTotals.length === 0) {
            categoryBreakdown.innerHTML = '<div class="empty-state-subtext">No expenses by category yet</div>';
            return;
        }

        categoryBreakdown.innerHTML = categoryTotals.map(item => `
            <div class="category-item ${item.category}">
                <span class="category-name">${this.getCategoryEmoji(item.category)} ${this.getCategoryName(item.category)}</span>
                <span class="category-amount">$${item.total.toFixed(2)}</span>
            </div>
        `).join('');
    }

    // Initialize chart
    initializeChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#06d6a0', // food
                        '#5c7cfa', // travel
                        '#ef476f', // shopping
                        '#ffd166', // bills
                        '#dcd7ff'  // others
                    ],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
        this.updateChart();
    }

    // Update chart
    updateChart() {
        if (!this.chart) return;

        const categories = ['food', 'travel', 'shopping', 'bills', 'others'];
        const categoryNames = ['Food', 'Travel', 'Shopping', 'Bills', 'Others'];
        const categoryEmojis = ['🍽️', '✈️', '🛍️', '📄', '📦'];

        const categoryData = categories.map(category => {
            return this.expenses
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + expense.amount, 0);
        });

        const filteredData = categoryData.filter((value, index) => value > 0);
        const filteredLabels = categoryNames.filter((label, index) => categoryData[index] > 0);
        const filteredEmojis = categoryEmojis.filter((emoji, index) => categoryData[index] > 0);

        this.chart.data.labels = filteredLabels.map((label, index) => `${filteredEmojis[index]} ${label}`);
        this.chart.data.datasets[0].data = filteredData;
        this.chart.update();
    }

    // Tab navigation
    switchTab(tabName) {
        // Remove active class from all tabs and pages
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        
        // Add active class to selected tab and page
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-page`).classList.add('active');
        
        // Update data based on current tab
        if (tabName === 'view-expenses') {
            this.renderExpenses();
        } else if (tabName === 'analytics') {
            this.updateSummary();
            this.updateChart();
        } else if (tabName === 'settings') {
            this.updateSettingsInfo();
        }
    }

    // Theme management
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcons = document.querySelectorAll('.theme-icon');
        const themeTexts = document.querySelectorAll('.theme-text');
        
        themeIcons.forEach(icon => {
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        });
        
        themeTexts.forEach(text => {
            text.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        });
    }

    // Settings page functionality
    updateSettingsInfo() {
        const totalExpenses = this.expenses.length;
        const totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        document.getElementById('totalExpensesCount').textContent = totalExpenses;
        document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;
    }

    exportData() {
        const dataStr = JSON.stringify(this.expenses, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('JSON data exported successfully!', 'success');
    }

    async exportPDF() {
        try {
            this.showNotification('Generating PDF report...', 'info');
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Set up the document
            doc.setFont('helvetica');
            doc.setFontSize(20);
            doc.text('Daily Expense Management Report', 20, 30);
            
            doc.setFontSize(12);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
            doc.text(`Total Expenses: ${this.expenses.length}`, 20, 55);
            
            const totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
            doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, 65);
            
            // Add summary section
            doc.setFontSize(14);
            doc.text('Expense Summary', 20, 85);
            
            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            const todayTotal = this.expenses.filter(expense => expense.date === today).reduce((sum, expense) => sum + expense.amount, 0);
            const weekTotal = this.expenses.filter(expense => expense.date >= weekAgo).reduce((sum, expense) => sum + expense.amount, 0);
            const monthTotal = this.expenses.filter(expense => expense.date >= monthAgo).reduce((sum, expense) => sum + expense.amount, 0);
            
            doc.setFontSize(10);
            doc.text(`Today: $${todayTotal.toFixed(2)}`, 30, 100);
            doc.text(`This Week: $${weekTotal.toFixed(2)}`, 30, 110);
            doc.text(`This Month: $${monthTotal.toFixed(2)}`, 30, 120);
            
            // Add expenses list
            doc.setFontSize(14);
            doc.text('Expense Details', 20, 140);
            
            let yPosition = 155;
            const pageHeight = doc.internal.pageSize.height;
            
            this.expenses.forEach((expense, index) => {
                if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(9);
                const expenseText = `${index + 1}. ${expense.title} - $${expense.amount.toFixed(2)} (${expense.category}) - ${this.formatDate(expense.date)}`;
                doc.text(expenseText, 20, yPosition);
                yPosition += 8;
            });
            
            // Add category breakdown
            doc.addPage();
            doc.setFontSize(14);
            doc.text('Category Breakdown', 20, 30);
            
            const categories = ['food', 'travel', 'shopping', 'bills', 'others'];
            yPosition = 45;
            
            categories.forEach(category => {
                const categoryTotal = this.expenses
                    .filter(expense => expense.category === category)
                    .reduce((sum, expense) => sum + expense.amount, 0);
                
                if (categoryTotal > 0) {
                    doc.setFontSize(10);
                    doc.text(`${this.getCategoryName(category)}: $${categoryTotal.toFixed(2)}`, 30, yPosition);
                    yPosition += 8;
                }
            });
            
            // Save the PDF
            doc.save(`expense-report-${new Date().toISOString().split('T')[0]}.pdf`);
            this.showNotification('PDF report generated successfully!', 'success');
            
        } catch (error) {
            console.error('PDF Export Error:', error);
            this.showNotification('Failed to generate PDF report', 'error');
        }
    }

    async exportImage() {
        try {
            this.showNotification('Generating image...', 'info');
            
            // Switch to analytics page to capture the chart and summary
            const currentTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
            this.switchTab('analytics');
            
            // Wait for the page to render
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Capture the analytics page
            const analyticsPage = document.getElementById('analytics-page');
            const canvas = await html2canvas(analyticsPage, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                width: analyticsPage.scrollWidth,
                height: analyticsPage.scrollHeight
            });
            
            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `expense-analytics-${new Date().toISOString().split('T')[0]}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                this.showNotification('Image exported successfully!', 'success');
            }, 'image/jpeg', 0.95);
            
            // Switch back to original tab
            this.switchTab(currentTab);
            
        } catch (error) {
            console.error('Image Export Error:', error);
            this.showNotification('Failed to generate image', 'error');
        }
    }

    importData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    this.expenses = importedData;
                    this.saveExpenses();
                    this.renderExpenses();
                    this.updateSummary();
                    this.updateChart();
                    this.updateSettingsInfo();
                    this.showNotification('Data imported successfully!', 'success');
                } else {
                    this.showNotification('Invalid file format', 'error');
                }
            } catch (error) {
                this.showNotification('Error reading file', 'error');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all expense data? This action cannot be undone.')) {
            this.expenses = [];
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.updateChart();
            this.updateSettingsInfo();
            this.showNotification('All data cleared successfully!', 'success');
        }
    }

    // Utility functions
    getCategoryName(category) {
        const names = {
            food: 'Food',
            travel: 'Travel',
            shopping: 'Shopping',
            bills: 'Bills',
            others: 'Others'
        };
        return names[category] || category;
    }

    getCategoryEmoji(category) {
        const emojis = {
            food: '🍽️',
            travel: '✈️',
            shopping: '🛍️',
            bills: '📄',
            others: '📦'
        };
        return emojis[category] || '📦';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-hover);
            border-left: 4px solid;
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;

        // Set border color based on type
        const colors = {
            success: '#00b894',
            error: '#e17055',
            warning: '#fdcb6e',
            info: '#6c63ff'
        };
        notification.style.borderLeftColor = colors[type] || colors.info;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
let expenseManager;
document.addEventListener('DOMContentLoaded', () => {
    expenseManager = new ExpenseManager();
});

// Export for global access
window.expenseManager = expenseManager;
