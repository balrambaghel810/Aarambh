// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('-translate-x-full');
    mobileMenuOverlay.classList.toggle('hidden');
});

mobileMenuOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.add('-translate-x-full');
    mobileMenuOverlay.classList.add('hidden');
});

// Close mobile menu when clicking on links
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.add('-translate-x-full');
        mobileMenuOverlay.classList.add('hidden');
    });
});

// Sticky Navigation with Background Change
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Services Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card[data-category]');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-category');
            
            serviceCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Booking Form Validation and Submission
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateBookingForm()) {
            // Get form data
            const formData = new FormData(bookingForm);
            const bookingData = {};
            formData.forEach((value, key) => {
                bookingData[key] = value;
            });
            
            // Show success modal with booking details
            showBookingSuccess(bookingData);
            
            // Reset form
            bookingForm.reset();
        }
    });
}

function validateBookingForm() {
    let isValid = true;
    const form = document.getElementById('bookingForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        const errorMessage = input.parentElement.querySelector('.error-message');
        
        if (!input.value.trim()) {
            showError(input, errorMessage, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, errorMessage, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            showError(input, errorMessage, 'Please enter a valid phone number');
            isValid = false;
        } else if (input.type === 'date') {
            const selectedDate = new Date(input.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showError(input, errorMessage, 'Please select a future date');
                isValid = false;
            } else {
                hideError(input, errorMessage);
            }
        } else {
            hideError(input, errorMessage);
        }
    });
    
    // Check terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        const errorMessage = termsCheckbox.parentElement.querySelector('.error-message');
        showError(termsCheckbox, errorMessage, 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function showError(input, errorMessage, message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    input.style.borderColor = '#e74c3c';
}

function hideError(input, errorMessage) {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
    input.style.borderColor = '#e8e0d5';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showBookingSuccess(bookingData) {
    const modal = document.getElementById('successModal');
    const bookingDetails = document.getElementById('bookingDetails');
    
    if (modal && bookingDetails) {
        // Format booking details
        const detailsHTML = `
            <div style="background: #f5f0e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h4 style="margin-bottom: 15px; color: #333;">Booking Details:</h4>
                <p><strong>Name:</strong> ${bookingData.name}</p>
                <p><strong>Phone:</strong> ${bookingData.phone}</p>
                <p><strong>Email:</strong> ${bookingData.email}</p>
                <p><strong>Service:</strong> ${bookingData.service}</p>
                <p><strong>Date:</strong> ${formatDate(bookingData.date)}</p>
                <p><strong>Time:</strong> ${bookingData.time}</p>
                ${bookingData.message ? `<p><strong>Message:</strong> ${bookingData.message}</p>` : ''}
            </div>
        `;
        
        bookingDetails.innerHTML = detailsHTML;
        modal.style.display = 'block';
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Modal Close Functionality
const closeButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Gallery Lightbox Functionality
const galleryImages = document.querySelectorAll('.gallery-item');
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');

let currentImageIndex = 0;
const galleryData = [];

// Collect gallery data
galleryImages.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('h3')?.textContent || '';
    const description = item.querySelector('p')?.textContent || '';
    
    galleryData.push({
        src: img.src,
        title: title,
        description: description
    });
});

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    if (lightboxModal) {
        lightboxModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function updateLightboxImage() {
    if (lightboxImage && lightboxTitle && lightboxDescription && galleryData[currentImageIndex]) {
        lightboxImage.src = galleryData[currentImageIndex].src;
        lightboxTitle.textContent = galleryData[currentImageIndex].title;
        lightboxDescription.textContent = galleryData[currentImageIndex].description;
    }
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = galleryData.length - 1;
    } else if (currentImageIndex >= galleryData.length) {
        currentImageIndex = 0;
    }
    
    updateLightboxImage();
}

// Close lightbox
const closeLightbox = document.querySelector('.close-lightbox');
if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
        if (lightboxModal) {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Lightbox navigation
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');

if (prevBtn) prevBtn.addEventListener('click', () => changeImage(-1));
if (nextBtn) nextBtn.addEventListener('click', () => changeImage(1));

// Keyboard navigation for lightbox
window.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.style.display === 'block') {
        if (e.key === 'Escape') {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

// Review Form Functionality
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateReviewForm()) {
            // Show success modal
            const reviewSuccessModal = document.getElementById('reviewSuccessModal');
            if (reviewSuccessModal) {
                reviewSuccessModal.style.display = 'block';
            }
            
            // Reset form
            reviewForm.reset();
            resetRatingStars();
        }
    });
}

function validateReviewForm() {
    let isValid = true;
    const form = document.getElementById('reviewForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        const errorMessage = input.parentElement.querySelector('.error-message');
        
        if (!input.value.trim()) {
            showError(input, errorMessage, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, errorMessage, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            showError(input, errorMessage, 'Please enter a valid phone number');
            isValid = false;
        } else {
            hideError(input, errorMessage);
        }
    });
    
    // Check rating
    const ratingValue = document.getElementById('ratingValue');
    if (ratingValue && ratingValue.value === '0') {
        alert('Please select a rating');
        isValid = false;
    }
    
    // Check terms checkbox
    const reviewTerms = document.getElementById('reviewTerms');
    if (reviewTerms && !reviewTerms.checked) {
        const errorMessage = reviewTerms.parentElement.querySelector('.error-message');
        showError(reviewTerms, errorMessage, 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Rating Stars Functionality
const starsInput = document.querySelectorAll('.stars-input i');
const ratingValue = document.getElementById('ratingValue');

if (starsInput.length > 0) {
    starsInput.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            setRating(rating);
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = index + 1;
            highlightStars(rating);
        });
    });
    
    document.querySelector('.stars-input').addEventListener('mouseleave', () => {
        const currentRating = ratingValue ? parseInt(ratingValue.value) : 0;
        highlightStars(currentRating);
    });
}

function setRating(rating) {
    if (ratingValue) {
        ratingValue.value = rating;
    }
    highlightStars(rating);
}

function highlightStars(rating) {
    starsInput.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('fas');
            star.classList.remove('far');
            star.style.color = '#d4af37';
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
            star.style.color = '#e8e0d5';
        }
    });
}

function resetRatingStars() {
    setRating(0);
}

// Contact Form Functionality
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            // Show success modal
            const contactSuccessModal = document.getElementById('contactSuccessModal');
            if (contactSuccessModal) {
                contactSuccessModal.style.display = 'block';
            }
            
            // Reset form
            contactForm.reset();
        }
    });
}

function validateContactForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        const errorMessage = input.parentElement.querySelector('.error-message');
        
        if (!input.value.trim()) {
            showError(input, errorMessage, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, errorMessage, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            showError(input, errorMessage, 'Please enter a valid phone number');
            isValid = false;
        } else {
            hideError(input, errorMessage);
        }
    });
    
    // Check terms checkbox
    const contactTerms = document.getElementById('contactTerms');
    if (contactTerms && !contactTerms.checked) {
        const errorMessage = contactTerms.parentElement.querySelector('.error-message');
        showError(contactTerms, errorMessage, 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Membership Form Functionality
const membershipForm = document.getElementById('membershipForm');
if (membershipForm) {
    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateMembershipForm()) {
            // Show success modal (reuse booking success modal)
            const modal = document.getElementById('successModal');
            if (modal) {
                const modalTitle = modal.querySelector('h3');
                const modalBody = modal.querySelector('.modal-body p');
                
                if (modalTitle) modalTitle.textContent = 'Membership Application Submitted!';
                if (modalBody) modalBody.textContent = 'Thank you for your interest in our membership program. We will contact you within 24 hours to complete your membership setup.';
                
                modal.style.display = 'block';
            }
            
            // Reset form
            membershipForm.reset();
        }
    });
}

function validateMembershipForm() {
    let isValid = true;
    const form = document.getElementById('membershipForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        const errorMessage = input.parentElement.querySelector('.error-message');
        
        if (!input.value.trim()) {
            showError(input, errorMessage, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, errorMessage, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            showError(input, errorMessage, 'Please enter a valid phone number');
            isValid = false;
        } else {
            hideError(input, errorMessage);
        }
    });
    
    // Check terms checkbox
    const memberTerms = document.getElementById('memberTerms');
    if (memberTerms && !memberTerms.checked) {
        const errorMessage = memberTerms.parentElement.querySelector('.error-message');
        showError(memberTerms, errorMessage, 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

// Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletterEmail');
        if (emailInput && isValidEmail(emailInput.value)) {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Thank you for subscribing!';
            successMessage.style.cssText = `
                background: #27ae60;
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
                text-align: center;
            `;
            
            newsletterForm.appendChild(successMessage);
            newsletterForm.reset();
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });
}

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// Blog Category Filter
const categoryButtons = document.querySelectorAll('.category-btn');
const blogCards = document.querySelectorAll('.blog-card[data-category]');

if (categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-category');
            
            blogCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Service Booking from Services Page
function bookService(serviceName) {
    // Store the service name in sessionStorage
    sessionStorage.setItem('selectedService', serviceName);
    
    // Redirect to booking page
    window.location.href = 'booking.html';
}

// Offer Booking from Offers Page
function bookOffer(offerName) {
    // Store the offer name in sessionStorage
    sessionStorage.setItem('selectedOffer', offerName);
    
    // Redirect to booking page
    window.location.href = 'booking.html';
}

// Membership Selection from Membership Page
function selectMembership(membershipType) {
    // Store the membership type in sessionStorage
    sessionStorage.setItem('selectedMembership', membershipType);
    
    // Redirect to booking page
    window.location.href = 'booking.html';
}

// Load pre-selected values on booking page
window.addEventListener('load', () => {
    // Check if we're on the booking page
    if (window.location.pathname.includes('booking.html')) {
        const serviceSelect = document.getElementById('service');
        
        // Load selected service
        const selectedService = sessionStorage.getItem('selectedService');
        if (selectedService && serviceSelect) {
            // Find and select the service option
            for (let option of serviceSelect.options) {
                if (option.text.includes(selectedService)) {
                    option.selected = true;
                    break;
                }
            }
        }
        
        // Load selected offer
        const selectedOffer = sessionStorage.getItem('selectedOffer');
        if (selectedOffer && serviceSelect) {
            // Add offer to the message field
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `I'm interested in the ${selectedOffer} offer.`;
            }
        }
        
        // Load selected membership
        const selectedMembership = sessionStorage.getItem('selectedMembership');
        if (selectedMembership && serviceSelect) {
            // Add membership to the message field
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `I'm interested in the ${selectedMembership} membership.`;
            }
        }
        
        // Clear sessionStorage
        sessionStorage.removeItem('selectedService');
        sessionStorage.removeItem('selectedOffer');
        sessionStorage.removeItem('selectedMembership');
    }
});

// Scroll to Review Form
function scrollToReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Load More Reviews Functionality
function loadMoreReviews() {
    // This would typically load more reviews from a server
    // For demo purposes, we'll show a message
    const button = event.target;
    button.textContent = 'Loading...';
    
    setTimeout(() => {
        button.textContent = 'No More Reviews';
        button.disabled = true;
        button.style.opacity = '0.5';
    }, 1000);
}

// Set minimum date for booking to today
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Initialize page animations
window.addEventListener('load', () => {
    // Add fade-in animation to elements
    const animatedElements = document.querySelectorAll('.service-card, .offer-card, .testimonial-card, .blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Print functionality for membership details
function printMembershipDetails() {
    window.print();
}

// Copy contact information to clipboard
function copyContactInfo(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const toast = document.createElement('div');
        toast.textContent = 'Copied to clipboard!';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #27ae60;
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 10000;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    });
}

// Add click-to-copy functionality to contact information
document.addEventListener('DOMContentLoaded', () => {
    const contactElements = document.querySelectorAll('.contact-card p');
    
    contactElements.forEach(element => {
        if (element.textContent.includes('+91') || element.textContent.includes('@')) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                copyContactInfo(element.textContent.trim());
            });
        }
    });
});

// Initialize tooltips for better UX
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Initialize tooltips when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTooltips);
