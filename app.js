// Pilgrim Banking System - Shared JavaScript Utilities

// Global configuration
const CONFIG = {
    bankName: 'Global Bank Pilgrim',
    coinName: 'Pilgrims Coin',
    cashName: 'Pilgrims Cash',
    coinValue: 0.50, // 1 Coin = $0.50 USD
    exchangeRates: {
        'pilgrim-coin': 0.50,
        'pilgrim-cash': 1.0,
        'bitcoin': 45000,
        'ethereum': 3000
    },
    blockchainPartners: [
        'Bitcoin.com',
        'Blockchain.com',
        'CoinMarketCap',
        'CoinGecko',
        'CoinPaprika',
        'PancakeSwap',
        'Uniswap',
        'QuickSwap'
    ]
};

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function generateId(prefix = 'ID') {
    return prefix + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateSerialNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let serial = '';
    for (let i = 0; i < 2; i++) {
        serial += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 8; i++) {
        serial += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return serial;
}

function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function generateWalletAddress() {
    return '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}

function validateBVN(bvn) {
    return /^\d{11}$/.test(bvn);
}

function validateNIN(nin) {
    return /^\d{11}$/.test(nin);
}

// Storage functions
function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        return false;
    }
}

function loadData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading data:', e);
        return null;
    }
}

function removeData(key) {
    localStorage.removeItem(key);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        padding: 1rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Error handling
function handleError(error) {
    console.error('Error:', error);
    showNotification('An error occurred. Please try again.', 'danger');
}

// Confirmation dialog
function confirmAction(message) {
    return confirm(message);
}

// Loading spinner
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="spinner"></div>';
    }
}

function hideLoading(containerId, content) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = content || '';
    }
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (e) {
        console.error('Failed to copy:', e);
        showNotification('Failed to copy to clipboard', 'danger');
        return false;
    }
}

// Currency converter
function convertCurrency(amount, from, to) {
    const fromRate = CONFIG.exchangeRates[from] || 1;
    const toRate = CONFIG.exchangeRates[to] || 1;
    return (amount * fromRate) / toRate;
}

// Bank code lookup
const BANK_CODES = {
    '044': 'Access Bank Nigeria Plc',
    '063': 'Diamond Bank Plc',
    '050': 'Ecobank Nigeria',
    '084': 'Enterprise Bank Plc',
    '070': 'Fidelity Bank Plc',
    '011': 'First Bank of Nigeria Plc',
    '214': 'First City Monument Bank',
    '058': 'Guaranty Trust Bank Plc',
    '301': 'Jaiz Bank',
    '082': 'Keystone Bank Ltd',
    '014': 'Mainstreet Bank Plc',
    '076': 'Skye Bank Plc',
    '039': 'Stanbic IBTC Plc',
    '232': 'Sterling Bank Plc',
    '032': 'Union Bank Nigeria Plc',
    '033': 'United Bank for Africa Plc',
    '215': 'Unity Bank Plc',
    '035': 'WEMA Bank Plc',
    '057': 'Zenith Bank International',
    '101': 'Providus Bank',
    '104': 'Parallex Bank Ltd',
    '303': 'Lotus Bank Ltd',
    '105': 'Premium Trust Bank Ltd',
    '106': 'Signature Bank Ltd',
    '103': 'Globus Bank',
    '102': 'Titan Trust Bank',
    '067': 'Polaris Bank',
    '107': 'Optimus Bank Ltd',
    '068': 'Standard Chartered Bank',
    '100': 'Suntrust Bank',
    '999': 'Adegan Global Bank'
};

function getBankName(code) {
    return BANK_CODES[code] || 'Unknown Bank';
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Pilgrim Banking System initialized');
    
    // Check for existing user session
    const user = loadData('pilgrimUser');
    if (user) {
        console.log('User logged in:', user.username);
    }
    
    // Check for existing admin session
    const admin = loadData('pilgrimAdmin');
    if (admin) {
        console.log('Admin logged in:', admin.username);
    }
});

// Export functions for use in other scripts
window.PilgrimApp = {
    CONFIG,
    formatDate,
    formatCurrency,
    generateId,
    generateSerialNumber,
    generateAccountNumber,
    generateWalletAddress,
    validateEmail,
    validatePhone,
    validateBVN,
    validateNIN,
    saveData,
    loadData,
    removeData,
    showNotification,
    handleError,
    confirmAction,
    showLoading,
    hideLoading,
    copyToClipboard,
    convertCurrency,
    getBankName
};