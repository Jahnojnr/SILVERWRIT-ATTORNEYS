  // Navbar scroll effect
     // ===== Preloader Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('mainContent');
    const skipButton = document.getElementById('skipButton');
    const progressBar = document.getElementById('progressBar');
    const progressPercentage = document.getElementById('progressPercentage');
    const casesLoaded = document.getElementById('casesLoaded');
    const clientsLoaded = document.getElementById('clientsLoaded');
    const experienceLoaded = document.getElementById('experienceLoaded');
    
    // Quote slider elements
    const quotes = document.querySelectorAll('.quote');
    const quoteSlider = document.querySelector('.quote-slider');
    
    // Configuration
    const config = {
        minLoadingTime: 4000, // Minimum loading time in ms
        maxLoadingTime: 7000, // Maximum loading time in ms
        progressInterval: 50, // Progress update interval in ms
        quoteChangeInterval: 3000, // Quote change interval in ms
        animationCompleteDelay: 500 // Delay after animations complete
    };
    
    // State variables
    let progress = 0;
    let currentQuoteIndex = 0;
    let loadingComplete = false;
    let startTime = Date.now();
    
    // Initialize the preloader
    function initPreloader() {
        // Start the loading simulation
        simulateLoading();
        
        // Start the quote slider
        startQuoteSlider();
        
        // Start the stats counter
        startStatsCounter();
        
        // Add skip button event listener
        skipButton.addEventListener('click', skipPreloader);
        
        // Add click/tap to skip functionality
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.key === ' ') {
                skipPreloader();
            }
        });
        
        // Optional: Add tap to skip on mobile
        preloader.addEventListener('click', function(e) {
            if (e.target === preloader) {
                skipPreloader();
            }
        });
    }
    
    // Simulate loading progress
    function simulateLoading() {
        const loadingTime = Math.random() * (config.maxLoadingTime - config.minLoadingTime) + config.minLoadingTime;
        const progressSteps = loadingTime / config.progressInterval;
        const progressIncrement = 100 / progressSteps;
        
        const progressInterval = setInterval(() => {
            // Calculate time-based progress
            const elapsedTime = Date.now() - startTime;
            const timeProgress = Math.min((elapsedTime / loadingTime) * 100, 100);
            
            // Add some randomness to make it look more natural
            const randomFactor = 1 + (Math.random() * 0.2 - 0.1); // +/- 10%
            progress = Math.min(progress + (progressIncrement * randomFactor), timeProgress);
            
            // Update progress bar
            updateProgress(progress);
            
            // Check if loading is complete
            if (progress >= 100) {
                clearInterval(progressInterval);
                completeLoading();
            }
        }, config.progressInterval);
    }
    
    // Update progress display
    function updateProgress(value) {
        const roundedValue = Math.min(Math.round(value), 100);
        
        // Update progress bar width
        progressBar.style.width = `${roundedValue}%`;
        
        // Update percentage text
        progressPercentage.textContent = `${roundedValue}%`;
        
        // Update loading message based on progress
        updateLoadingMessage(roundedValue);
    }
    
    // Update loading message based on progress
    function updateLoadingMessage(progress) {
        const messages = [
            { threshold: 0, message: "Initializing Legal Systems" },
            { threshold: 20, message: "Loading Case Database" },
            { threshold: 40, message: "Preparing Legal Documents" },
            { threshold: 60, message: "Consulting Legal Experts" },
            { threshold: 80, message: "Finalizing Legal Strategies" },
            { threshold: 95, message: "Ready to Serve Justice" }
        ];
        
        // Find the appropriate message for current progress
        let currentMessage = "Loading Legal Excellence";
        for (let i = messages.length - 1; i >= 0; i--) {
            if (progress >= messages[i].threshold) {
                currentMessage = messages[i].message;
                break;
            }
        }
        
        // Update the message if it's different
        const messageElement = document.querySelector('.loading-message');
        if (messageElement.textContent !== currentMessage) {
            messageElement.textContent = currentMessage;
            
            // Add a subtle animation for message change
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.style.opacity = '1';
                messageElement.style.transition = 'opacity 0.3s ease';
            }, 10);
        }
    }
    
    // Start the quote slider
    function startQuoteSlider() {
        setInterval(() => {
            // Move to next quote
            quotes[currentQuoteIndex].classList.remove('active');
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            quotes[currentQuoteIndex].classList.add('active');
        }, config.quoteChangeInterval);
    }
    
    // Start the stats counter
    function startStatsCounter() {
        const targetStats = {
            cases: 850,
            clients: 300,
            experience: 15
        };
        
        // Start counters when progress reaches 50%
        const checkProgress = setInterval(() => {
            if (progress >= 50) {
                clearInterval(checkProgress);
                animateCounter(casesLoaded, 0, targetStats.cases, 1500);
                animateCounter(clientsLoaded, 0, targetStats.clients, 1800);
                animateCounter(experienceLoaded, 0, targetStats.experience, 1200);
            }
        }, 100);
    }
    
    // Animate counter from start to end
    function animateCounter(element, start, end, duration) {
        const startTime = Date.now();
        const endTime = startTime + duration;
        
        function updateCounter() {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeProgress = easeOutCubic(progress);
            const currentValue = Math.floor(start + (end - start) * easeProgress);
            
            // Format number with commas
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        updateCounter();
    }
    
    // Easing function for smooth animation
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // Complete the loading process
    function completeLoading() {
        if (loadingComplete) return;
        loadingComplete = true;
        
        // Ensure progress shows 100%
        updateProgress(100);
        
        // Wait for animations to complete
        setTimeout(() => {
            // Add fade-out animation to preloader
            preloader.classList.add('fade-out');
            
            // Show main content after preloader fades out
            setTimeout(() => {
                preloader.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Trigger any post-loading actions
                onContentLoaded();
            }, 800);
        }, config.animationCompleteDelay);
    }
    
    // Skip preloader manually
    function skipPreloader() {
        if (loadingComplete) return;
        
        // Jump to 100% progress
        progress = 100;
        updateProgress(progress);
        
        // Complete loading immediately
        completeLoading();
        
        // Add visual feedback for skip
        skipButton.innerHTML = '<i class="fas fa-check"></i> Skipped';
        skipButton.style.backgroundColor = 'rgba(139, 0, 0, 0.6)';
        skipButton.style.color = 'white';
        skipButton.disabled = true;
    }
    
    // Function called when content is loaded
    function onContentLoaded() {
        console.log('Website content fully loaded');
        
        // Dispatch custom event for other scripts to listen to
        document.dispatchEvent(new CustomEvent('preloaderComplete'));
        
        // Add any post-loading animations or effects to main content
        animateMainContent();
    }
    
    // Animate main content entrance
    function animateMainContent() {
        const elements = mainContent.querySelectorAll('h1, p, button');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }
    
    // Function to show preloader again (for testing/demo)
    window.showPreloaderAgain = function() {
        // Reset state
        progress = 0;
        loadingComplete = false;
        startTime = Date.now();
        
        // Reset displays
        progressBar.style.width = '0%';
        progressPercentage.textContent = '0%';
        casesLoaded.textContent = '0';
        clientsLoaded.textContent = '0';
        experienceLoaded.textContent = '0';
        
        // Reset animations
        const elements = document.querySelectorAll('.logo-svg circle, .logo-svg path, .logo-svg line');
        elements.forEach(element => {
            element.style.animation = 'none';
            void element.offsetWidth; // Trigger reflow
            element.style.animation = '';
        });
        
        // Reset text animations
        document.querySelector('.silver').style.animation = 'none';
        document.querySelector('.attorneys').style.animation = 'none';
        document.querySelector('.firm-tagline').style.animation = 'none';
        document.querySelectorAll('.tagline-line').forEach(line => {
            line.style.animation = 'none';
        });
        document.querySelectorAll('.dot').forEach(dot => {
            dot.style.animation = 'none';
        });
        document.querySelector('.loading-message').style.animation = 'none';
        document.querySelector('.progress-percentage').style.animation = 'none';
        document.querySelectorAll('.stat-item').forEach(item => {
            item.style.animation = 'none';
        });
        document.querySelector('.skip-button').style.animation = 'none';
        
        // Reset quotes
        quotes.forEach(quote => quote.classList.remove('active'));
        quotes[0].classList.add('active');
        currentQuoteIndex = 0;
        
        // Reset skip button
        skipButton.innerHTML = 'Skip Intro <i class="fas fa-forward"></i>';
        skipButton.style.backgroundColor = '';
        skipButton.style.color = '';
        skipButton.disabled = false;
        
        // Show preloader, hide main content
        preloader.style.display = 'flex';
        preloader.classList.remove('fade-out');
        mainContent.style.display = 'none';
        
        // Reinitialize
        setTimeout(() => {
            void document.querySelector('.logo-svg').offsetWidth; // Force reflow
            initPreloader();
        }, 100);
    };
    
    // Start the preloader
    initPreloader();
    
    // Optional: Add loading of actual resources
    window.addEventListener('load', function() {
        // This ensures the preloader waits for all page resources
        // In a real implementation, you might want to check specific resources
        console.log('All page resources loaded');
    });
});

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPreloader: function() {
            // Initialize preloader
            console.log('Preloader module loaded');
        }
    };
}
  
  
  window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Initialize tooltips (if any)
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // ===== Auto Counter Animation =====
document.addEventListener('DOMContentLoaded', function() {
    // Counter elements
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower
    
    // Function to animate counters
    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = target;
            
            // Add plus sign for large numbers
            if (target >= 1000) {
                counter.innerText = target.toLocaleString();
            }
        }
    }
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to handle scroll event for counter animation
    function handleScrollAnimation() {
        counters.forEach(counter => {
            if (isInViewport(counter) && counter.innerText === '0') {
                animateCounter(counter);
            }
        });
    }
    
    // Initialize counters when page loads (if already in viewport)
    setTimeout(() => {
        handleScrollAnimation();
    }, 500);
    
    // Add scroll event listener for counters
    window.addEventListener('scroll', handleScrollAnimation);
    
    // ===== Additional Interactive Features =====
    
    // Add hover effect to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.stat-icon');
            icon.style.transform = 'scale(1.1)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.stat-icon');
            icon.style.transform = 'scale(1)';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to about section when in viewport
    const aboutSection = document.querySelector('.about-section');
    const observerOptions = {
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animate detail items with delay
                const detailItems = entry.target.querySelectorAll('.detail-item');
                detailItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 300 + (index * 200));
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (aboutSection) {
        // Set initial state for animation
        const detailItems = aboutSection.querySelectorAll('.detail-item');
        detailItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        observer.observe(aboutSection);
    }
    
    // Practice areas highlight on hover
    const practiceItems = document.querySelectorAll('.practice-items li');
    practiceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.color = 'var(--primary-color)';
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'all 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.color = '';
            this.style.transform = '';
        });
    });
});

// ===== Utility Functions =====
// Function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// Function to reset counters (useful for demo purposes)
function resetCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = '0';
    });
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatNumber, resetCounters };
}

// ===== Team & Testimonials Interactive Features =====
document.addEventListener('DOMContentLoaded', function() {
    // Team Cards Animation on Scroll
    const teamCards = document.querySelectorAll('.team-card');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const teamObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                teamObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Set initial state for team cards animation
    teamCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        teamObserver.observe(card);
    });

    // Testimonials Carousel Auto Play
    const testimonialsCarousel = document.getElementById('testimonialsCarousel');
    if (testimonialsCarousel) {
        const carousel = new bootstrap.Carousel(testimonialsCarousel, {
            interval: 6000,
            wrap: true,
            pause: 'hover'
        });

        // Add active slide indicator
        testimonialsCarousel.addEventListener('slid.bs.carousel', function(event) {
            const activeIndex = event.to;
            updateActiveIndicator(activeIndex);
        });

        function updateActiveIndicator(index) {
            const indicators = document.querySelectorAll('.carousel-indicators button');
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.style.transform = 'scale(1.3)';
                    indicator.style.transition = 'transform 0.3s ease';
                } else {
                    indicator.style.transform = 'scale(1)';
                }
            });
        }

        // Initialize active indicator
        updateActiveIndicator(0);
    }

    // Rating Bar Animation
    function animateRatingBars() {
        const ratingBars = document.querySelectorAll('.rating-bar');
        
        ratingBars.forEach(bar => {
            const originalWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = originalWidth;
            }, 300);
        });
    }

    // Animate rating bars when in viewport
    const ratingSection = document.querySelector('.rating-breakdown');
    if (ratingSection) {
        const ratingObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        animateRatingBars();
                    }, 500);
                    ratingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        ratingObserver.observe(ratingSection);
    }

    // Team Member Hover Effects
    teamCards.forEach(card => {
        const teamImg = card.querySelector('.team-img');
        const teamName = card.querySelector('.team-name');
        
        card.addEventListener('mouseenter', function() {
            teamName.style.color = 'var(--primary-color)';
            teamName.style.transition = 'color 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            teamName.style.color = '';
        });
    });

    // Testimonial Card Hover Effect
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 40px rgba(139, 0, 0, 0.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
        });
    });

    // Social Media Links Tooltip
    const socialLinks = document.querySelectorAll('.team-social a');
    socialLinks.forEach(link => {
        link.setAttribute('data-bs-toggle', 'tooltip');
        
        if (link.querySelector('.fa-linkedin')) {
            link.setAttribute('title', 'LinkedIn Profile');
        } else if (link.querySelector('.fa-twitter')) {
            link.setAttribute('title', 'Twitter Profile');
        } else if (link.querySelector('.fa-facebook')) {
            link.setAttribute('title', 'Facebook Profile');
        }
    });

    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Google Reviews Link Handler
    const googleReviewLinks = document.querySelectorAll('a[href*="google"]');
    googleReviewLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
                // In a real implementation, this would link to actual Google reviews
                alert('In a live website, this would link to the firm\'s Google reviews page.');
            }
        });
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // View All Team Members Button Handler
    const viewAllTeamBtn = document.querySelector('.btn-outline-primary-custom');
    if (viewAllTeamBtn && viewAllTeamBtn.textContent.includes('View All Team')) {
        viewAllTeamBtn.addEventListener('click', function(e) {
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
                // Simulate loading more team members
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-users me-2"></i> All Team Members Loaded';
                    this.style.backgroundColor = 'var(--primary-color)';
                    this.style.color = 'white';
                    this.style.borderColor = 'var(--primary-color)';
                }, 1500);
            }
        });
    }
});

// ===== Utility Functions =====

// Function to handle team member modal (for expanded view)
function openTeamMemberModal(memberId) {
    // This function would open a modal with detailed team member info
    console.log('Opening team member modal for ID:', memberId);
    // Implementation for modal would go here
}

// Function to filter team by expertise
function filterTeamByExpertise(expertise) {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        const expertiseTags = card.querySelectorAll('.expertise-tag');
        let hasExpertise = false;
        
        expertiseTags.forEach(tag => {
            if (tag.textContent.toLowerCase().includes(expertise.toLowerCase())) {
                hasExpertise = true;
            }
        });
        
        if (hasExpertise) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to reset team filter
function resetTeamFilter() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.5s ease';
    });
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openTeamMemberModal,
        filterTeamByExpertise,
        resetTeamFilter
    };
}

// Add CSS for fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ===== Google Maps & Footer Interactive Features =====

// Initialize Google Map
function initMap() {
    // Silverwrit Attorneys location coordinates
    const officeLocation = { lat: 9.0765, lng: 7.3986 }; // Abuja coordinates
    
    // Map options
    const mapOptions = {
        center: officeLocation,
        zoom: 16,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "gamma": 0.01
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "saturation": -31
                    },
                    {
                        "lightness": -33
                    },
                    {
                        "weight": 2
                    },
                    {
                        "gamma": 0.8
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8B0000"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 30
                    },
                    {
                        "saturation": 30
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "saturation": 20
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 20
                    },
                    {
                        "saturation": -20
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 10
                    },
                    {
                        "saturation": -30
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "saturation": 25
                    },
                    {
                        "lightness": 25
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": -20
                    }
                ]
            }
        ]
    };
    
    // Create map
    const map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    
    // Custom marker icon
    const markerIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="#8B0000" stroke="white" stroke-width="3"/>
                <circle cx="20" cy="20" r="8" fill="white"/>
                <path d="M20,10 L20,30 M10,20 L30,20" stroke="white" stroke-width="2"/>
            </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40)
    };
    
    // Add marker
    const marker = new google.maps.Marker({
        position: officeLocation,
        map: map,
        title: 'Silverwrit Attorneys',
        icon: markerIcon,
        animation: google.maps.Animation.DROP
    });
    
    // Info window content
    const infoWindowContent = `
        <div class="map-info-window">
            <div class="info-window-header">
                <h4>Silverwrit Attorneys</h4>
            </div>
            <div class="info-window-body">
                <p><i class="fas fa-map-marker-alt"></i> 14 Alexandria Crescent, Wuse 2, Abuja</p>
                <p><i class="fas fa-phone-alt"></i> 0916 793 5575</p>
                <p><i class="fas fa-clock"></i> Open 24 Hours</p>
            </div>
            <div class="info-window-actions">
                <button onclick="getDirections()" class="btn-get-directions">
                    <i class="fas fa-directions"></i> Get Directions
                </button>
            </div>
        </div>
    `;
    
    // Info window
    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 300
    });
    
    // Open info window on marker click
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
    
    // Open info window by default
    setTimeout(() => {
        infoWindow.open(map, marker);
    }, 1000);
    
    // Store map and marker for other functions
    window.silverwritMap = map;
    window.silverwritMarker = marker;
    
    // Add map click listener to close info window
    map.addListener('click', function() {
        infoWindow.close();
    });
    
    // Add CSS for info window
    addMapInfoWindowStyles();
}

// Function to get directions
function getDirections() {
    const destination = "14 Alexandria Crescent, Wuse 2, Abuja 900288";
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(mapsUrl, '_blank');
}

// Add styles for map info window
function addMapInfoWindowStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .map-info-window {
            font-family: 'Open Sans', sans-serif;
            padding: 10px;
        }
        .info-window-header h4 {
            color: #8B0000;
            margin: 0 0 10px 0;
            font-size: 1.1rem;
            font-family: 'Playfair Display', serif;
        }
        .info-window-body {
            margin-bottom: 10px;
        }
        .info-window-body p {
            margin: 5px 0;
            font-size: 0.9rem;
            color: #333;
            display: flex;
            align-items: center;
        }
        .info-window-body i {
            color: #8B0000;
            margin-right: 8px;
            width: 16px;
        }
        .btn-get-directions {
            background-color: #8B0000;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            transition: background-color 0.3s ease;
        }
        .btn-get-directions:hover {
            background-color: #6a0000;
        }
        .btn-get-directions i {
            margin-right: 5px;
        }
    `;
    document.head.appendChild(style);
}

// ===== Footer Interactive Features =====
document.addEventListener('DOMContentLoaded', function() {
    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Get Directions Button
    const getDirectionsBtn = document.getElementById('getDirections');
    if (getDirectionsBtn) {
        getDirectionsBtn.addEventListener('click', getDirections);
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            if (emailInput.value) {
                // Save original button content
                const originalContent = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Show success message
                    submitBtn.innerHTML = '<i class="fas fa-check"></i>';
                    submitBtn.style.backgroundColor = '#28a745';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalContent;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                        emailInput.value = '';
                        
                        // Show temporary success message
                        showNotification('Thank you for subscribing to our newsletter!', 'success');
                    }, 2000);
                }, 1500);
            }
        });
    }
    
    // Emergency Phone Click Tracking
    const emergencyPhone = document.querySelector('.emergency-phone');
    if (emergencyPhone) {
        emergencyPhone.addEventListener('click', function() {
            // Track emergency call click (for analytics)
            console.log('Emergency call initiated');
            // In a real implementation, you might want to send this to Google Analytics
        });
    }
    
    // Smooth Scroll for Footer Links
    document.querySelectorAll('footer a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Social Media Link Hover Effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
    
    // Practice Area Links Animation
    const practiceLinks = document.querySelectorAll('.footer-links a');
    practiceLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(90deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // Current Year in Copyright
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2024', currentYear);
    }
    
    // Map click outside to close any open info windows
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.map-container') && !e.target.closest('.gm-style-iw')) {
            // Close Google Maps info window if open
            if (window.infoWindow) {
                window.infoWindow.close();
            }
        }
    });
});

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 30px;
                right: 30px;
                background-color: white;
                color: #333;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 9999;
                transform: translateX(150%);
                transition: transform 0.5s ease;
                border-left: 4px solid #8B0000;
            }
            .notification-success {
                border-left-color: #28a745;
            }
            .notification-content {
                display: flex;
                align-items: center;
                flex: 1;
            }
            .notification-content i {
                margin-right: 10px;
                font-size: 1.2rem;
            }
            .notification-success .notification-content i {
                color: #28a745;
            }
            .notification-close {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                margin-left: 15px;
                font-size: 1rem;
                transition: color 0.3s ease;
            }
            .notification-close:hover {
                color: #333;
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode && notification.classList.contains('show')) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }
    }, 5000);
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMap,
        getDirections,
        showNotification
    };
}

