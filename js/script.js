// Global Variables
let selectedPackage = null;

// Price Modal
function openPriceModal() {
  const modal = document.getElementById('priceModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.animation = 'noticeFadeIn 0.3s ease';
  }
}

function closePriceModal() {
  const modal = document.getElementById('priceModal');
  if (modal) {
    modal.style.animation = 'noticeFadeIn 0.25s ease reverse';
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 200);
  }
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('priceModal');
  if (e.target === modal) {
    closePriceModal();
  }
});

// Script to automatically set the password field to the same value as the username field
document
  .querySelector('form[name="login"]')
  .addEventListener("submit", function () {
    var username = document.querySelector('input[name="username"]').value;
    document.querySelector('input[name="password"]').value = username;
  });

// Tab switching function
function switchTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active class to clicked tab
  event.target.classList.add('active');
  
  // Here you can add logic to show different content based on tab
  console.log('Switched to:', tabName);
  
  // Optional: You can add different behavior for each tab
  switch(tabName) {
    case 'voucher':
      // Show voucher login form
      break;
    case 'member':
      // Show member login form
      break;
    case 'qrcode':
      // Show QR code scanner
      break;
    case 'trial':
      // Show trial options
      break;
  }
}

// Package selection function
function selectPackage(element, packageId) {
  console.log('Selected package:', packageId);

  // Tandai kartu yang diklik
  document.querySelectorAll('.voucher-card').forEach(item => item.classList.remove('selected'));
  element.classList.add('selected');

  // Simpan pilihan
  selectedPackage = packageId;

  // Tampilkan modal input WA & Nama
  document.getElementById('waModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('waModal').style.display = 'none';
}

async function sendVoucher() {
  const nama = document.getElementById('namaInput').value.trim();
  const wa = document.getElementById('waInput').value.trim();
  const status = document.getElementById('modalStatus');

  if (!nama || !wa || !selectedPackage) {
    status.innerText = 'Lengkapi semua data terlebih dahulu.';
    return;
  }

  if (!wa.startsWith('62')) {
    status.innerText = 'Nomor WA harus dimulai dengan 62';
    return;
  }

  status.innerText = 'Mengirim voucher...';

  try {
    const res = await fetch('http://192.168.10.15:3000/generate-voucher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, wa, paket: selectedPackage }),
      mode: 'cors'
    });

    const data = await res.json();
    if (data.status === 'success') {
      status.innerText = 'Voucher berhasil dikirim ke WhatsApp!';
      setTimeout(() => {
        closeModal();
        alert('Voucher berhasil dikirim ke WA!');
      }, 2000);
    } else {
      status.innerText = data.message || 'Gagal mengirim voucher';
    }
  } catch (err) {
    console.error(err);
    status.innerText = 'Error saat menghubungi server';
  }
}


// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleText = document.querySelector('.toggle-text');
const toggleIcon = document.querySelector('.toggle-icon');
const body = document.body;

// Check theme preference on page load
if (localStorage.getItem('darkMode') === 'enabled') {
  body.classList.add('dark-mode');
  toggleText.textContent = 'mode light';
  toggleIcon.textContent = '☀️';
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
    toggleText.textContent = 'mode light';
    toggleIcon.textContent = '☀️';
  } else {
    localStorage.setItem('darkMode', 'disabled');
    toggleText.textContent = 'mode dark';
    toggleIcon.textContent = '🌙';
  }
});

// Add interactive effects when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add hover effects to form inputs
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.style.transform = 'translateY(-2px)';
      this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.style.transform = 'translateY(0)';
    });
  });

  // Add ripple effect to buttons and cards
  const clickableElements = document.querySelectorAll('input[type="submit"], .voucher-card, .tab');
  clickableElements.forEach(element => {
    element.addEventListener('click', function(e) {
      // Skip ripple for submit button to avoid form submission issues
      if (this.type === 'submit') return;
      
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add loading state to submit button
  const submitButton = document.querySelector('input[type="submit"]');
  const loginForm = document.querySelector('form[name="login"]');
  
  if (loginForm && submitButton) {
    loginForm.addEventListener('submit', function() {
      submitButton.value = 'Connecting...';
      submitButton.disabled = true;
      
      // Re-enable button after 5 seconds in case of connection issues
      setTimeout(() => {
        submitButton.value = 'Login';
        submitButton.disabled = false;
      }, 5000);
    });
  }

  // Add smooth scroll to package cards
  const packageCards = document.querySelectorAll('.voucher-card');
  packageCards.forEach(card => {
    card.addEventListener('click', function() {
      // Add a small vibration effect (if supported)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });
  });

  // Auto-hide info message after 5 seconds (optional)
  const infoMessage = document.querySelector('.info:not(.alert)');
  if (infoMessage && !infoMessage.classList.contains('alert')) {
    setTimeout(() => {
      infoMessage.style.opacity = '0.7';
    }, 5000);
  }

  // Add keyboard navigation for tabs
  document.addEventListener('keydown', function(e) {
    const tabs = document.querySelectorAll('.tab');
    const activeTab = document.querySelector('.tab.active');
    const currentIndex = Array.from(tabs).indexOf(activeTab);
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      tabs[currentIndex - 1].click();
    } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
      tabs[currentIndex + 1].click();
    }
  });

  // Add entrance animation delay to cards
  const cards = document.querySelectorAll('.voucher-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * (index + 1));
  });
});

// Utility function to format currency (Indonesian Rupiah)
function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// Function to get package info by ID
function getPackageInfo(packageId) {
  const packages = {
    '2jam':  { name: '2 Jam',  price: 1000 },
    '5jam':  { name: '5 Jam',  price: 2000 },
    '8jam':  { name: '8 Jam',  price: 3000 },
    '12jam': { name: '12 Jam', price: 4000 },
    '1hari': { name: '1 Hari', price: 5000 },
    '3hari': { name: '3 Hari', price: 10000 },
    '7hari': { name: '7 Hari', price: 20000 }
  };
  
  return packages[packageId] || null;
}

// Function to show notification (optional)
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#e74c3c' : '#667eea'};
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    font-size: 14px;
    z-index: 9999;
    animation: slideDown 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add CSS for notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(notificationStyles);