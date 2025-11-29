// API Configuration
const API_BASE_URL = 'https://paleturquoise-tarsier-726492.hostingersite.com/api';

// DOM Elements
const hideTitle = document.getElementById('hide-title');
const searchServices = document.getElementById('search-services');
const servicesContainer = document.getElementById('services-container');
const providersContainer = document.getElementById('providers-container');
const providersSection = document.getElementById('providers-section');
const servicesSearch = document.getElementById('services-search');
const providersSearch = document.getElementById('providers-search');
const loginLink = document.getElementById('login-link');
const loginModal = document.getElementById('login-modal');
const closeModal = document.querySelector('.close-modal');
const loginForm = document.getElementById('login-form');
const backToServices = document.getElementById('back-to-services');
const selectedServiceTitle = document.getElementById('selected-service-title');
const pagination = document.getElementById('pagination');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const scrollTopBtn = document.getElementById('scroll-top');
const adsContainer = document.getElementById('ads-container');
const categoriesContainer = document.getElementById('categories-container');
const categoriesSection = document.getElementById('categories');


// Global variables
let services = [];
let providers = [];
let ads = [];
let categories = [];
let currentPage = 1;
const providersPerPage = 6;
let currentProviders = [];
let currentService = null;
let filteredServices = [];

// Default images
const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
const DEFAULT_PROVIDER_IMAGE = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

// API Service Class
class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Handle FormData vs JSON
        const isFormData = options.body instanceof FormData;
        
        const config = {
            headers: {
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Don't set Content-Type for FormData
        if (!isFormData) {
            config.headers['Content-Type'] = 'application/json';
        }

        // Add authorization header if token exists
        if (this.token && !endpoint.includes('/login')) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check for API error status
            if (data.status === 'error') {
                throw new Error(data.message || 'API error');
            }
            
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

            // Auth methods
            async login(phone, password) {
                const data = await this.request('/login', {
                    method: 'POST',
                    body: JSON.stringify({ phone, password })
                });
                
                // لو تم تسجيل الدخول بنجاح
                if (data.status === "success" && data.data) {
                    this.token = data.data;
                    localStorage.setItem('authToken', data.data);
                    localStorage.setItem('user', JSON.stringify('admin'));

                    // 👈 Redirect here
                    window.location.href = "dashboard.html";
                } else {
                    alert(data.message || "خطأ في تسجيل الدخول");
                }

                return data;
            }


    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    // Public API methods
    async getOffers() {
        const data = await this.request('/offers');
        return data.data || [];
    }

    async getCategories() {
        const data = await this.request('/categories');
        return data.data || [];
    }

    async getServices() {
        const data = await this.request('/services');
        return data.data || [];
    }
}

// Initialize API service
const apiService = new ApiService();

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // User is logged in
        loginLink.textContent = 'لوحة التحكم';
        loginLink.href = 'dashboard.html';
    } else {
        // User is not logged in
        loginLink.textContent = 'تسجيل الدخول';
        loginLink.href = '#';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    setupEventListeners();
    trackVisitor();
    checkAuth();
});

// Load data from API
async function loadData() {
    try {
        showLoading();
        
        // Load categories, services, and offers in parallel
        const [categoriesData, servicesData, offersData] = await Promise.all([
            apiService.getCategories(),
            apiService.getServices(),
            apiService.getOffers()
        ]);

        // Transform API data to match your existing structure
        categories = transformCategoriesData(categoriesData);
        services = transformServicesData(servicesData);
        ads = transformOffersData(offersData);
        
        // Extract providers from categories data (users in services)
        providers = extractProvidersFromCategories(categoriesData);
        
        // Set filtered services to all services initially
        filteredServices = [...services];
        
        console.log('Loaded data:', { categories, services, providers, ads });

        displayCategories(categories);
        displayServices(filteredServices);
        displayAds(ads);
        
    } catch (error) {
        console.error('Error loading data:', error);
        showDialog('خطأ', 'حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.');
        
        // Fallback to sample data if API fails
        loadSampleData();
    } finally {
        hideLoading();
    }
}

// Transform categories data
function transformCategoriesData(apiData) {
    return apiData.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image || DEFAULT_CATEGORY_IMAGE,
        services_count: category.services ? category.services.length : 0
    }));
}

// Extract providers from categories data
function extractProvidersFromCategories(categoriesData) {
    const providers = [];
    
    categoriesData.forEach(category => {
        if (category.services && Array.isArray(category.services)) {
            category.services.forEach(service => {
                if (service.users && Array.isArray(service.users)) {
                    service.users.forEach(user => {
                        providers.push({
                            id: user.id,
                            name: user.name,
                            address: user.address,
                            phone: user.phone,
                            service: service.name,
                            category: category.name,
                            description: user.services_details && user.services_details.length > 0 
                                ? user.services_details[0].pivot.details 
                                : 'لا يوجد وصف',
                            image: user.image || DEFAULT_PROVIDER_IMAGE
                        });
                    });
                }
            });
        }
    });
    
    return providers;
}

// Data transformation functions
function transformServicesData(apiData) {
    return apiData.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description || `خدمة ${service.name}`,
        category: service.category ? service.category.name : 'عام',
        category_id: service.category ? service.category.id : null,
        providersCount: service.users_count || 0,
        image: service.image || DEFAULT_SERVICE_IMAGE
    }));
}

function transformOffersData(apiData) {
    return apiData.map(offer => ({
        id: offer.id,
        title: offer.name,
        image: offer.image || 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        description: offer.details,
        startDate: offer.start_date,
        endDate: offer.end_date,
        duration: offer.duration,
        remainingDays: offer.remaining_days
    }));
}

// Display categories
function displayCategories(categoriesToShow) {
    categoriesContainer.innerHTML = '';
    
    if (categoriesToShow.length === 0) {
        categoriesContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">لا توجد فئات متاحة</p>';
        return;
    }
    
    categoriesToShow.forEach(category => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('data-category', category.id);
        
        card.innerHTML = `
            <div class="service-image">
                <img src="${category.image}" alt="${category.name}" onerror="this.src='${DEFAULT_CATEGORY_IMAGE}'">
            </div>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <div class="service-meta">
                <span class="providers-count">${category.services_count} خدمة</span>
            </div>
        `;
        
        card.addEventListener('click', () => filterServicesByCategory(category));
        categoriesContainer.appendChild(card);
    });
}

// Filter services by category
function filterServicesByCategory(category) {
    if (category.id === 'all') {
        filteredServices = [...services];
        selectedServiceTitle.textContent = 'جميع الخدمات';
    } else {
        filteredServices = services.filter(service => service.category_id === category.id);
        selectedServiceTitle.textContent = `خدمات ${category.name}`;
    }
    
    // Show services section and hide categories
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    servicesContainer.style.display = 'grid';
    providersSection.style.display = 'none';
    hideTitle.style.display = 'none';
    searchServices.style.display = 'block';
    
    displayServices(filteredServices);
}

// Display services in the container
function displayServices(servicesToShow) {
    servicesContainer.innerHTML = '';
    
    if (servicesToShow.length === 0) {
        servicesContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">لا توجد خدمات مطابقة للبحث</p>';
        return;
    }
    
    servicesToShow.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('data-category', service.category_id);
        
        card.innerHTML = `
            <div class="service-image">
                <img src="${service.image}" alt="${service.name}" onerror="this.src='${DEFAULT_SERVICE_IMAGE}'">
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
            <div class="service-meta">
                <span class="providers-count">${service.providersCount} مقدم خدمة</span>
            </div>
        `;
        
        card.addEventListener('click', () => showProvidersForService(service));
        servicesContainer.appendChild(card);
    });
}

// Display providers in the container with pagination
function displayProviders(providersToShow, page = 1) {
    providersContainer.innerHTML = '';
    
    if (providersToShow.length === 0) {
        providersContainer.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">لا توجد نتائج مطابقة للبحث</p>';
        pagination.innerHTML = '';
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(providersToShow.length / providersPerPage);
    const startIndex = (page - 1) * providersPerPage;
    const endIndex = startIndex + providersPerPage;
    const paginatedProviders = providersToShow.slice(startIndex, endIndex);
    
    // Display providers
    paginatedProviders.forEach(provider => {
        const card = document.createElement('div');
        card.className = 'provider-card';
        
        card.innerHTML = `
            <div class="provider-image">
                <img src="${provider.image}" alt="${provider.name}" onerror="this.src='${DEFAULT_PROVIDER_IMAGE}'">
            </div>
            <div class="card-header">
                <h3>${provider.name}</h3>
                <p>${provider.service}</p>
            </div>
            <div class="card-body">
                <div class="provider-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${provider.address}</p>
                    <p><i class="fas fa-phone"></i> ${provider.phone}</p>
                    <p><i class="fas fa-info-circle"></i> ${provider.description}</p>
                </div>
                <div class="provider-actions">
                    <button class="action-btn copy-btn" onclick="copyNumber('${provider.phone}')">
                        <i class="fas fa-copy"></i> نسخ الرقم
                    </button>
                    <button class="action-btn whatsapp-btn" onclick="contactWhatsApp('${provider.phone}')">
                        <i class="fab fa-whatsapp"></i> واتساب
                    </button>
                </div>
            </div>
        `;
        
        providersContainer.appendChild(card);
    });
    
    // Display pagination
    displayPagination(totalPages, page);
}

// Display pagination buttons
function displayPagination(totalPages, currentPage) {
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayProviders(currentProviders, currentPage - 1);
        }
    });
    pagination.appendChild(prevButton);
    
    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            displayProviders(currentProviders, i);
        });
        pagination.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayProviders(currentProviders, currentPage + 1);
        }
    });
    pagination.appendChild(nextButton);
}

// Show providers for a specific service
function showProvidersForService(service) {
    currentService = service;
    currentProviders = providers.filter(provider => provider.service === service.name);
    
    // Update UI
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    servicesContainer.style.display = 'none';
    categoriesContainer.style.display = 'none';
    categoriesSection.style.display = 'none'  
    providersSection.style.display = 'block';
    hideTitle.style.display = 'none';
    searchServices.style.display = 'none';
    selectedServiceTitle.textContent = `مقدمو خدمة ${service.name}`;
    
    // Reset search and pagination
    providersSearch.value = '';
    currentPage = 1;
    displayProviders(currentProviders, currentPage);
}

// Back to services
function backToServicesHandler() {
    servicesContainer.style.display = 'grid';
    providersSection.style.display = 'none';
    categoriesContainer.style.display = 'grid'
    categoriesSection.style.display = 'block'  
    searchServices.style.display = 'block';
    hideTitle.style.display = 'block';
    servicesSearch.value = '';
    displayServices(filteredServices);
}

// Setup event listeners
function setupEventListeners() {
    // Services search
    servicesSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filtered = filteredServices.filter(service => 
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm)
        );
        displayServices(filtered);
    });
    
    // Providers search
    providersSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        if (!currentService) return;
        
        const filteredProviders = providers.filter(provider => 
            provider.service === currentService.name && (
                provider.name.toLowerCase().includes(searchTerm) ||
                provider.description.toLowerCase().includes(searchTerm) ||
                provider.address.toLowerCase().includes(searchTerm)
            )
        );
        
        currentProviders = filteredProviders;
        currentPage = 1;
        displayProviders(currentProviders, currentPage);
    });
    
    // Back to services button
    backToServices.addEventListener('click', backToServicesHandler);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // Scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Login modal
    loginLink.addEventListener('click', function(e) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            e.preventDefault();
            loginModal.style.display = 'flex';
        }
    });
    
    closeModal.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const phone = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!phone || !password) {
            showDialog('خطأ', 'يرجى إدخال رقم الهاتف وكلمة المرور');
            return;
        }
        
        const submitBtn = document.getElementById('login-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        try {
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
            
            const result = await apiService.login(phone, password);
            
            if (result.token) {
                loginModal.style.display = 'none';
                showDialog('نجاح', 'تم تسجيل الدخول بنجاح!');
                checkAuth();
                
                // Redirect to dashboard after successful login
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showDialog('خطأ', 'فشل تسجيل الدخول. يرجى التحقق من البيانات المدخلة.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showDialog('خطأ', 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        } finally {
            // Hide loading state
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Display ads in the container
function displayAds(adsToShow) {
    adsContainer.innerHTML = '';
    
    adsToShow.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'ad-card';
        
        card.innerHTML = `
            <img src="${ad.image}" alt="${ad.title}" class="ad-image" onerror="this.src='https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'">
            <div class="ad-content">
                <h3 class="ad-title">${ad.title}</h3>
                <p class="ad-description">${ad.description}</p>
                <p><small>من ${ad.startDate} إلى ${ad.endDate}</small></p>
                ${ad.remainingDays !== undefined ? `<p><small>متبقي: ${ad.remainingDays} يوم</small></p>` : ''}
            </div>
        `;
        
        adsContainer.appendChild(card);
    });
}

// Utility functions
function copyNumber(number) {
    navigator.clipboard.writeText(number)
        .then(() => {
            showDialog('نجاح', `تم نسخ الرقم: ${number}`);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showDialog('خطأ', 'فشل في نسخ الرقم، يرجى المحاولة مرة أخرى');
        });
}

function contactWhatsApp(number) {
    const message = encodeURIComponent("مرحباً! أرغب في الاستفسار عن الخدمة التي تقدمها.");
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
}

// Dialog functions
function showDialog(title, message) {
    const dialog = document.getElementById('custom-dialog');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogMessage = document.getElementById('dialog-message');
    
    dialogTitle.textContent = title;
    dialogMessage.innerHTML = message;
    dialog.style.display = 'flex';
    
    // Add event listener to confirm button
    const confirmBtn = document.getElementById('dialog-confirm-btn');
    confirmBtn.onclick = function() {
        dialog.style.display = 'none';
    };
}

function showConfirmationDialog(title, message, onConfirm) {
    const dialog = document.getElementById('confirmation-dialog');
    const dialogTitle = document.getElementById('confirmation-title');
    const dialogMessage = document.getElementById('confirmation-message');
    
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    dialog.style.display = 'flex';
    
    // Add event listeners
    const confirmBtn = document.getElementById('confirmation-confirm-btn');
    const cancelBtn = document.getElementById('confirmation-cancel-btn');
    
    const closeDialog = function() {
        dialog.style.display = 'none';
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
    };
    
    confirmBtn.onclick = function() {
        closeDialog();
        if (onConfirm) onConfirm();
    };
    
    cancelBtn.onclick = closeDialog;
}

// Loading functions
function showLoading() {
    let loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 18px;
        `;
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007B83; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                جاري التحميل...
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    }
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        button.disabled = true;
    } else {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        button.disabled = false;
    }
}

// Fallback to sample data if API fails
function loadSampleData() {
    categories = [
        {
            id: 1,
            name: "خدمات المنازل",
            description: "جميع خدمات الصيانة والتحسين للمنازل",
            image: DEFAULT_CATEGORY_IMAGE,
            services_count: 5
        }
    ];
    
    services = [
        {
            id: 1,
            name: "كهرباء منازل",
            description: "خدمات الكهرباء المنزلية المتكاملة من تركيب وصيانة وإصلاح",
            category: "خدمات المنازل",
            category_id: 1,
            providersCount: 15,
            image: DEFAULT_SERVICE_IMAGE
        }
    ];
    
    providers = [
        {
            id: 1,
            name: "أحمد محمد",
            address: "الرياض، حي العليا",
            phone: "+966501234567",
            service: "كهرباء منازل",
            category: "خدمات المنازل",
            description: "متخصص في أعمال الكهرباء المنزلية، تركيب وصيانة جميع أنواع التركيبات الكهربائية. خبرة أكثر من 10 سنوات في المجال.",
            image: DEFAULT_PROVIDER_IMAGE
        }
    ];
    
    ads = [
        {
            id: 1,
            title: "خصم 20% على خدمات الكهرباء",
            image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            description: "احصل على خصم 20% على جميع خدمات الكهرباء المنزلية حتى نهاية الشهر",
            startDate: "2023-10-01",
            endDate: "2023-10-31"
        }
    ];
    
    filteredServices = [...services];
    displayCategories(categories);
    displayServices(filteredServices);
    displayAds(ads);
}

function trackVisitor() {
    let visitors = localStorage.getItem('websiteVisitors');
    if (!visitors) {
        visitors = 1;
    } else {
        visitors = parseInt(visitors) + 1;
    }
    localStorage.setItem('websiteVisitors', visitors);
}

function scrollToCategories() {
    document.getElementById('categories').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function scrollToServices() {
    document.getElementById('services').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Initialize dialogs
document.addEventListener('DOMContentLoaded', function() {
    // Close dialogs when clicking outside
    const dialogs = document.querySelectorAll('.dialog');
    dialogs.forEach(dialog => {
        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                dialog.style.display = 'none';
            }
        });
    });
});