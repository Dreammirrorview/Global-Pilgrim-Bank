// Pilgrim Customer Wallet - Dashboard JavaScript

// Global variables
let currentWalletUser = null;

// Initialize wallet dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadWalletUserData();
    initializeWalletForms();
    updateWalletDisplays();
});

// Load wallet user data from localStorage
function loadWalletUserData() {
    const userStr = localStorage.getItem('walletUser');
    if (userStr) {
        currentWalletUser = JSON.parse(userStr);
        document.getElementById('walletUserName').textContent = currentWalletUser.fullName;
    }
}

// Save wallet user data to localStorage
function saveWalletUserData() {
    if (currentWalletUser) {
        localStorage.setItem('walletUser', JSON.stringify(currentWalletUser));
    }
}

// Update all displays
function updateWalletDisplays() {
    if (!currentWalletUser) return;
    
    // Update overview
    const balance = currentWalletUser.balance || 0;
    const totalReceived = currentWalletUser.totalReceived || 0;
    
    document.getElementById('walletBalance').textContent = '$' + balance.toFixed(2);
    document.getElementById('totalReceived').textContent = '$' + totalReceived.toFixed(2);
    
    // Update account info
    document.getElementById('walletAccountNumber').textContent = currentWalletUser.accountNumber || 'N/A';
    document.getElementById('walletAddress').textContent = currentWalletUser.walletAddress || 'Not generated';
    document.getElementById('walletEmail').textContent = currentWalletUser.email || 'N/A';
    document.getElementById('walletPhone').textContent = currentWalletUser.phone || 'N/A';
    
    // Update receive section
    document.getElementById('receiveWalletAddress').textContent = currentWalletUser.walletAddress || 'Not generated';
    document.getElementById('receiveAccountNumber').textContent = currentWalletUser.accountNumber || 'N/A';
    
    // Update profile
    document.getElementById('walletProfileFullName').value = currentWalletUser.fullName || '';
    document.getElementById('walletProfileEmail').value = currentWalletUser.email || '';
    document.getElementById('walletProfilePhone').value = currentWalletUser.phone || '';
    document.getElementById('walletProfileAccountNumber').value = currentWalletUser.accountNumber || '';
    document.getElementById('walletProfileAddress').value = currentWalletUser.walletAddress || 'Not generated';
    
    // Update transaction table
    updateWalletTransactionTable();
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.wallet-section').forEach(section => {
        section.style.display = 'none';
    });
    
    document.getElementById(sectionId).style.display = 'block';
    
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Update wallet transaction table
function updateWalletTransactionTable() {
    const tableBody = document.getElementById('walletTransactionTable');
    
    if (!currentWalletUser || !currentWalletUser.transactions || currentWalletUser.transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No transactions yet</td></tr>';
        return;
    }
    
    const sortedTransactions = [...currentWalletUser.transactions].reverse().slice(0, 10);
    
    tableBody.innerHTML = sortedTransactions.map(tx => {
        const date = new Date(tx.date).toLocaleDateString();
        const statusClass = tx.status === 'completed' ? 'success' : 'warning';
        const amountDisplay = tx.type === 'receive' ? '+$' + tx.amount : '-$' + tx.amount;
        const amountClass = tx.type === 'receive' ? '#4caf50' : '#f44336';
        
        return `
            <tr>
                <td>${date}</td>
                <td style="text-transform: capitalize;">${tx.type}</td>
                <td>${tx.recipient || tx.sender || '-'}</td>
                <td style="color: ${amountClass}; font-weight: bold;">${amountDisplay}</td>
                <td><span class="alert alert-${statusClass}" style="padding: 0.25rem 0.5rem; display: inline-block;">${tx.status}</span></td>
            </tr>
        `;
    }).join('');
}

// Initialize wallet forms
function initializeWalletForms() {
    // Send to type change
    document.getElementById('sendToType').addEventListener('change', function() {
        const type = this.value;
        document.getElementById('bankSelection').style.display = type === 'bank' ? 'block' : 'none';
        document.getElementById('accountNameField').style.display = type === 'bank' ? 'block' : 'none';
    });
    
    // Send money form
    document.getElementById('walletSendForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const sendToType = document.getElementById('sendToType').value;
        const recipient = document.getElementById('walletRecipient').value;
        const amount = parseFloat(document.getElementById('walletSendAmount').value);
        const description = document.getElementById('walletSendDescription').value;
        
        if (!currentWalletUser) {
            alert('Please login first');
            return;
        }
        
        if (amount > (currentWalletUser.balance || 0)) {
            alert('Insufficient balance');
            return;
        }
        
        // Deduct from balance
        currentWalletUser.balance -= amount;
        
        // Create transaction
        const transaction = {
            id: generateTransactionId(),
            date: new Date().toISOString(),
            type: 'send',
            recipient: recipient,
            amount: amount,
            description: description,
            status: 'completed'
        };
        
        currentWalletUser.transactions = currentWalletUser.transactions || [];
        currentWalletUser.transactions.push(transaction);
        
        saveWalletUserData();
        updateWalletDisplays();
        
        alert('Money sent successfully! Transaction ID: ' + transaction.id);
        this.reset();
    });
}

// Generate transaction ID
function generateTransactionId() {
    return 'WLT' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Copy wallet address
function copyWalletAddress() {
    const address = document.getElementById('receiveWalletAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        alert('Wallet address copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy address');
    });
}

// Copy account number
function copyAccountNumber() {
    const accountNumber = document.getElementById('receiveAccountNumber').textContent;
    navigator.clipboard.writeText(accountNumber).then(() => {
        alert('Account number copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy account number');
    });
}

// Change password
function changeWalletPassword() {
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) {
        alert('Password change cancelled');
        return;
    }
    
    if (currentPassword !== currentWalletUser.password) {
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
    
    currentWalletUser.password = newPassword;
    saveWalletUserData();
    
    alert('Password changed successfully! Please login again with your new password.');
    logout();
}

// Logout
function logout() {
    localStorage.removeItem('walletUser');
    window.location.href = 'index.html';
}