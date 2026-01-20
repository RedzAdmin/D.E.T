// D.E.T CONTACT GAIN - Frontend Script
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    
    // Stats elements
    const elements = {
        targetCount: document.getElementById('targetCount'),
        currentCount: document.getElementById('currentCount'),
        progressCurrent: document.getElementById('progressCurrent'),
        progressTarget: document.getElementById('progressTarget'),
        remainingCount: document.getElementById('remainingCount'),
        progressFill: document.getElementById('progressFill'),
        progressPercentage: document.getElementById('progressPercentage'),
        modalProgress: document.getElementById('modalProgress')
    };
    
    // API Configuration
    const API = {
        BASE_URL: 'http://localhost:3000/api',
        ENDPOINTS: {
            STATS: '/stats',
            SUBMIT: '/contacts'
        }
    };
    
    // Load initial stats
    loadStats();
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate
        if (!validateForm()) return;
        
        // Get data
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim().toLowerCase()
        };
        
        // Show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        try {
            // Submit to API
            const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.SUBMIT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update stats
                loadStats();
                
                // Show success modal
                showModal(result);
                
                // Reset form
                contactForm.reset();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Network error. Please try again.');
            console.error('Error:', error);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Join Batch';
        }
    });
    
    // Modal close
    closeModal.addEventListener('click', () => {
        successModal.style.display = 'none';
    });
    
    // Functions
    async function loadStats() {
        try {
            const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.STATS}`);
            const data = await response.json();
            
            if (data.success) {
                updateUI(data.batch);
            }
        } catch (error) {
            console.log('Stats load error:', error);
        }
    }
    
    function updateUI(batch) {
        // Update all elements
        elements.targetCount.textContent = batch.target;
        elements.currentCount.textContent = batch.current;
        elements.progressCurrent.textContent = batch.current;
        elements.progressTarget.textContent = batch.target;
        
        // Calculate remaining
        const remaining = batch.target - batch.current;
        elements.remainingCount.textContent = remaining > 0 ? remaining : 0;
        
        // Update progress bar
        const percentage = (batch.current / batch.target) * 100;
        elements.progressFill.style.width = `${percentage}%`;
        elements.progressPercentage.textContent = `${Math.round(percentage)}%`;
        
        // Update modal
        elements.modalProgress.textContent = `${batch.current}/${batch.target}`;
    }
    
    function validateForm() {
        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const terms = document.getElementById('agreeTerms').checked;
        
        // Simple validation
        if (name.length < 2) {
            alert('Please enter your full name');
            return false;
        }
        
        if (!phone.startsWith('+') || phone.length < 10) {
            alert('Please enter valid WhatsApp number with country code (e.g., +2347030626048)');
            return false;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            alert('Please enter valid email address');
            return false;
        }
        
        if (!terms) {
            alert('Please agree to the terms');
            return false;
        }
        
        return true;
    }
    
    function showModal(result) {
        // Update modal message based on batch status
        const message = result.batchComplete ? 
            '🎉 Batch complete! VCF files are being sent to all participants via email.' :
            '✅ You\'ve been added to the batch! When we reach 50 participants, you\'ll receive the VCF file via email.';
        
        document.querySelector('.modal-body p').textContent = message;
        successModal.style.display = 'flex';
    }
    
    // Auto-refresh stats every 30 seconds
    setInterval(loadStats, 30000);
});