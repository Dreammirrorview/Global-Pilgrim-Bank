// Pilgrim Investment Platform - Dashboard JavaScript

// Global variables
let currentInvestor = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadInvestorData();
    initializeForms();
    updateDisplays();
});

// Load investor data from localStorage
function loadInvestorData() {
    const userStr = localStorage.getItem('investmentUser');
    if (userStr) {
        currentInvestor = JSON.parse(userStr);
        document.getElementById('invUserName').textContent = currentInvestor.fullName;
    }
}

// Save investor data to localStorage
function saveInvestorData() {
    if (currentInvestor) {
        localStorage.setItem('investmentUser', JSON.stringify(currentInvestor));
    }
}

// Update all displays
function updateDisplays() {
    if (!currentInvestor) return;
    
    // Update overview
    const totalInvestment = currentInvestor.totalInvestment || 0;
    const sharesOwned = currentInvestor.sharesOwned || 0;
    const totalDividends = currentInvestor.totalDividends || 0;
    
    document.getElementById('totalInvestment').textContent = '$' + totalInvestment.toFixed(2);
    document.getElementById('sharesOwned').textContent = sharesOwned;
    document.getElementById('totalDividends').textContent = '$' + totalDividends.toFixed(2);
    
    // Update account info
    document.getElementById('invAccountNumber').textContent = currentInvestor.accountNumber || 'N/A';
    document.getElementById('invSerialNumber').textContent = currentInvestor.serialNumber || 'N/A';
    document.getElementById('invType').textContent = (currentInvestor.investmentType || 'N/A').replace('-', ' ').toUpperCase();
    document.getElementById('regDate').textContent = currentInvestor.dateRegistered ? new Date(currentInvestor.dateRegistered).toLocaleDateString() : 'N/A';
    document.getElementById('accountStatus').textContent = (currentInvestor.status || 'N/A').toUpperCase();
    
    // Update investment details
    document.getElementById('detailShares').textContent = sharesOwned;
    document.getElementById('detailInvestment').textContent = '$' + totalInvestment.toFixed(2);
    
    const shareValue = sharesOwned > 0 ? totalInvestment / sharesOwned : 0;
    document.getElementById('shareValue').textContent = '$' + shareValue.toFixed(2);
    document.getElementById('portfolioValue').textContent = '$' + totalInvestment.toFixed(2);
    
    // Update contact form
    document.getElementById('contactName').value = currentInvestor.fullName || '';
    document.getElementById('contactAccount').value = currentInvestor.accountNumber || '';
    document.getElementById('contactSerial').value = currentInvestor.serialNumber || '';
    document.getElementById('contactEmail').value = currentInvestor.email || '';
    
    // Update profile
    document.getElementById('invProfileFullName').value = currentInvestor.fullName || '';
    document.getElementById('invProfileEmail').value = currentInvestor.email || '';
    document.getElementById('invProfilePhone').value = currentInvestor.phone || '';
    document.getElementById('invProfileAccountNumber').value = currentInvestor.accountNumber || '';
    document.getElementById('invProfileSerialNumber').value = currentInvestor.serialNumber || '';
    document.getElementById('invProfileAddress').value = currentInvestor.address || '';
    
    // Update tables
    updateDividendTable();
    updateTransactionTable();
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.investment-section').forEach(section => {
        section.style.display = 'none';
    });
    
    document.getElementById(sectionId).style.display = 'block';
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Update dividend table
function updateDividendTable() {
    const tableBody = document.getElementById('dividendTable');
    
    if (!currentInvestor || !currentInvestor.monthlyDividends || currentInvestor.monthlyDividends.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No dividend payments yet</td></tr>';
        return;
    }
    
    const sortedDividends = [...currentInvestor.monthlyDividends].reverse();
    
    tableBody.innerHTML = sortedDividends.map(div => {
        const statusClass = div.status === 'paid' ? 'success' : 'warning';
        
        return `
            <tr>
                <td>${div.monthYear}</td>
                <td>${div.shares}</td>
                <td>$${div.dividendPerShare.toFixed(2)}</td>
                <td>$${div.totalDividend.toFixed(2)}</td>
                <td><span class="alert alert-${statusClass}" style="padding: 0.25rem 0.5rem; display: inline-block;">${div.status}</span></td>
            </tr>
        `;
    }).join('');
}

// Update transaction table
function updateTransactionTable() {
    const tableBody = document.getElementById('invTransactionTable');
    
    if (!currentInvestor || !currentInvestor.transactions || currentInvestor.transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No transactions yet</td></tr>';
        return;
    }
    
    const sortedTransactions = [...currentInvestor.transactions].reverse().slice(0, 10);
    
    tableBody.innerHTML = sortedTransactions.map(tx => {
        const date = new Date(tx.date).toLocaleDateString();
        const statusClass = tx.status === 'completed' ? 'success' : 'warning';
        const amountDisplay = tx.type === 'credit' ? '+$' + tx.amount : '-$' + tx.amount;
        const amountClass = tx.type === 'credit' ? '#4caf50' : '#f44336';
        
        return `
            <tr>
                <td>${date}</td>
                <td style="text-transform: capitalize;">${tx.type}</td>
                <td>${tx.description}</td>
                <td style="color: ${amountClass}; font-weight: bold;">${amountDisplay}</td>
                <td><span class="alert alert-${statusClass}" style="padding: 0.25rem 0.5rem; display: inline-block;">${tx.status}</span></td>
            </tr>
        `;
    }).join('');
}

// Initialize forms
function initializeForms() {
    // Contact admin form
    document.getElementById('contactAdminForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = document.getElementById('contactMessage').value;
        
        if (!currentInvestor) {
            alert('Please login first');
            return;
        }
        
        // Create transaction record
        const transaction = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            type: 'message',
            description: 'Message sent to admin',
            amount: 0,
            status: 'completed'
        };
        
        currentInvestor.transactions = currentInvestor.transactions || [];
        currentInvestor.transactions.push(transaction);
        
        saveInvestorData();
        updateDisplays();
        
        alert('Message sent successfully to:\nadeganglobal@gmail.com\npilgrimshares@gmail.com\n\nYour message: ' + message);
        
        document.getElementById('contactMessage').value = '';
    });
}

// Generate transaction ID
function generateTransactionId() {
    return 'INV' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Change password
function changePassword() {
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) {
        alert('Password change cancelled');
        return;
    }
    
    if (currentPassword !== currentInvestor.password) {
        alert('Current password is incorrect');
        return;
    }
    
    const newPassword = prompt('Enter new password:');
    if (!newPassword) {
        alert('Password change cancelled');
        return;
    }
    
    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    currentInvestor.password = newPassword;
    saveInvestorData();
    
    alert('Password changed successfully! Please login again with your new password.');
    logout();
}

// Logout
function logout() {
    localStorage.removeItem('investmentUser');
    window.location.href = 'index.html';
}