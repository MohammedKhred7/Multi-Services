// Sample data for services with icons
const services = [
    {
        id: 1,
        name: "كهرباء منازل",
        description: "خدمات الكهرباء المنزلية المتكاملة من تركيب وصيانة وإصلاح",
        icon: "fas fa-bolt",
        category: "home",
        providersCount: 15
    },
    {
        id: 2,
        name: "سباكة منازل",
        description: "حلول السباكة المنزلية بإشراف فنيين محترفين ومواد عالية الجودة",
        icon: "fas fa-faucet",
        category: "home",
        providersCount: 12
    },
    {
        id: 3,
        name: "دهان وديكور",
        description: "خدمات الدهان والديكور بأحدث التقنيات وأجود أنواع المواد",
        icon: "fas fa-paint-roller",
        category: "home",
        providersCount: 8
    },
    {
        id: 4,
        name: "تجميل سيدات",
        description: "خدمات التجميل المتكاملة للسيدات بأيدي محترفات ومواد آمنة",
        icon: "fas fa-spa",
        category: "beauty",
        providersCount: 20
    },
    {
        id: 5,
        name: "تصفيف شعر",
        description: "أحدث صيحات تصفيف وتنسيق الشعر لجميع المناسبات",
        icon: "fas fa-cut",
        category: "beauty",
        providersCount: 18
    },
    {
        id: 6,
        name: "تدريس خصوصي",
        description: "دروس خصوصية لجميع المراحل الدراسية والمواد التعليمية",
        icon: "fas fa-graduation-cap",
        category: "education",
        providersCount: 25
    },
    {
        id: 7,
        name: "تدريس لغة إنجليزية",
        description: "تعليم اللغة الإنجليزية لجميع المستويات والأعمار",
        icon: "fas fa-language",
        category: "education",
        providersCount: 10
    },
    {
        id: 8,
        name: "ميكانيكا سيارات",
        description: "صيانة وإصلاح السيارات بأسعار منافسة وقطع غيار أصلية",
        icon: "fas fa-car",
        category: "car",
        providersCount: 14
    },
    {
        id: 9,
        name: "نقل عفش",
        description: "خدمات نقل العفش والتغليف المحترف بأسعار مناسبة",
        icon: "fas fa-truck-moving",
        category: "home",
        providersCount: 7
    },
    {
        id: 10,
        name: "تنظيف منازل",
        description: "خدمات تنظيف المنازل والشقق باستخدام أحدث المعدات",
        icon: "fas fa-broom",
        category: "home",
        providersCount: 16
    }
];

// Sample data for service providers
const providers = [
    {
        id: 1,
        name: "أحمد محمد",
        address: "الرياض، حي العليا",
        phone: "+966501234567",
        service: "كهرباء منازل",
        category: "home",
        description: "متخصص في أعمال الكهرباء المنزلية، تركيب وصيانة جميع أنواع التركيبات الكهربائية. خبرة أكثر من 10 سنوات في المجال."
    },
        {
        id: 1,
        name: "سالم محمد",
        address: "المكلاء حي العليا",
        phone: "+966501234567",
        service: "كهرباء منازل",
        category: "home",
        description: "متخصص في أعمال الكهرباء المنزلية، تركيب وصيانة جميع أنواع التركيبات الكهربائية. خبرة أكثر من 10 سنوات في المجال."
    },
    {
        id: 2,
        name: "فاطمة علي",
        address: "جدة، حي الصفا",
        phone: "+966502345678",
        service: "تجميل سيدات",
        category: "beauty",
        description: "تقديم خدمات التجميل للسيدات في المنزل، مكياج، عناية بالبشرة، وعناية بالأظافر. استخدام منتجات طبيعية وآمنة."
    },
    {
        id: 3,
        name: "خالد إبراهيم",
        address: "الدمام، حي الشاطئ",
        phone: "+966503456789",
        service: "تدريس خصوصي",
        category: "education",
        description: "معلم خصوصي لجميع المواد الدراسية، ابتدائي ومتوسط، خبرة 5 سنوات في التدريس. أساليب تعليمية مبتكرة."
    },
    {
        id: 4,
        name: "محمد عبدالله",
        address: "الرياض، حي النخيل",
        phone: "+966504567890",
        service: "سباكة منازل",
        category: "home",
        description: "فني سباكة محترف، إصلاح تسربات المياه، تركيب وصيانة جميع أنواع السباكة. استخدام مواد عالية الجودة."
    },
    {
        id: 5,
        name: "سارة أحمد",
        address: "مكة، حي العزيزية",
        phone: "+966505678901",
        service: "تصفيف شعر",
        category: "beauty",
        description: "تصفيف وتنسيق الشعر لجميع المناسبات، قص، صبغ، وتصفيف حسب الطلب. أحدث صيحات الموضة."
    },
    {
        id: 6,
        name: "يوسف سعيد",
        address: "الرياض، حي الملز",
        phone: "+966506789012",
        service: "ميكانيكا سيارات",
        category: "car",
        description: "ميكانيكي سيارات متخصص، صيانة دورية، إصلاح أعطال المحرك، وكهرباء السيارات. ضمان على العمل."
    },
    {
        id: 7,
        name: "نورة خالد",
        address: "جدة، حي الروضة",
        phone: "+966507890123",
        service: "تدريس لغة إنجليزية",
        category: "education",
        description: "معلمة لغة إنجليزية، تدريس جميع المستويات، تحضير لاختبارات التوفل والآيلتس. منهجية تعليم تفاعلية."
    },
    {
        id: 8,
        name: "عبدالرحمن حسن",
        address: "الدمام، حي الفيصلية",
        phone: "+966508901234",
        service: "دهان وديكور",
        category: "home",
        description: "فني دهان وديكور، استخدام أحدث التقنيات في أعمال الدهان والديكور الداخلي. تنسيق ألوان احترافي."
    },
    {
        id: 9,
        name: "ريماس القحطاني",
        address: "الرياض، حي الورود",
        phone: "+966509012345",
        service: "تنظيف منازل",
        category: "home",
        description: "خدمات تنظيف المنازل والشقق باستخدام معدات متطورة ومنتجات صديقة للبيئة. فريق عمل مدرب."
    },
    {
        id: 10,
        name: "فيصل الحربي",
        address: "جدة، حي الزهراء",
        phone: "+966510123456",
        service: "نقل عفش",
        category: "home",
        description: "خدمات نقل العفش والتغليف المحترف. فريق مدرب وعربات مجهزة. أسعار مناسبة وضمان على الأثاث."
    }
];

// Sample data for ads
const ads = [
    {
        id: 1,
        title: "خصم 20% على خدمات الكهرباء",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "احصل على خصم 20% على جميع خدمات الكهرباء المنزلية حتى نهاية الشهر",
        startDate: "2023-10-01",
        endDate: "2023-10-31"
    },
    {
        id: 2,
        title: "عرض خاص للعناية بالبشرة",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "جلسات عناية بالبشرة بأسعار مخفضة لفترة محدودة",
        startDate: "2023-10-05",
        endDate: "2023-10-25"
    },
    {
        id: 3,
        title: "دورات تدريسية مكثفة",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        description: "دورات تدريسية مكثفة لجميع المراحل الدراسية بأسعار تنافسية",
        startDate: "2023-10-10",
        endDate: "2023-11-10"
    }
];

// DOM Elements

const hideTitle = document.getElementById('hide-title');
const searchServices = document.getElementById('search-services');
const servicesContainer = document.getElementById('services-container');
const providersContainer = document.getElementById('providers-container');
const providersSection = document.getElementById('providers-section');
const servicesSearch = document.getElementById('services-search');
const providersSearch = document.getElementById('providers-search');
const backToServices = document.getElementById('back-to-services');
const selectedServiceTitle = document.getElementById('selected-service-title');
const pagination = document.getElementById('pagination');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const scrollTopBtn = document.getElementById('scroll-top');
const adsContainer = document.getElementById('ads-container');

// Pagination variables
let currentPage = 1;
const providersPerPage = 6;
let currentProviders = [];
let currentService = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayServices(services);
    displayAds(ads);
    setupEventListeners();
    trackVisitor();
});

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
        card.setAttribute('data-category', service.category);
        
        card.innerHTML = `
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
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
    searchServices.style.display = 'block';
    hideTitle.style.display = 'block';
    servicesSearch.value = '';
    displayServices(services);
}

// Setup event listeners
function setupEventListeners() {
    // Services search
    servicesSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredServices = services.filter(service => 
            service.name.toLowerCase().includes(searchTerm) ||
            service.description.toLowerCase().includes(searchTerm)
        );
        displayServices(filteredServices);
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
}

// Display ads in the container
function displayAds(adsToShow) {
    adsContainer.innerHTML = '';
    
    adsToShow.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'ad-card';
        
        card.innerHTML = `
            <img src="${ad.image}" alt="${ad.title}" class="ad-image">
            <div class="ad-content">
                <h3 class="ad-title">${ad.title}</h3>
                <p class="ad-description">${ad.description}</p>
                <p><small>من ${ad.startDate} إلى ${ad.endDate}</small></p>
            </div>
        `;
        
        adsContainer.appendChild(card);
    });
}

// Copy phone number to clipboard
function copyNumber(number) {
    navigator.clipboard.writeText(number)
        .then(() => {
            showAlert(`تم نسخ الرقم: ${number}`);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showAlert('فشل في نسخ الرقم، يرجى المحاولة مرة أخرى');
        });
}

// Open WhatsApp with pre-filled message
function contactWhatsApp(number) {
    const message = encodeURIComponent("مرحباً! أرغب في الاستفسار عن الخدمة التي تقدمها.");
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
}

// Show alert message
function showAlert(message) {
    // Remove existing alert if any
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    document.body.appendChild(alert);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Track visitor count
function trackVisitor() {
    let visitors = localStorage.getItem('websiteVisitors');
    if (!visitors) {
        visitors = 1;
    } else {
        visitors = parseInt(visitors) + 1;
    }
    localStorage.setItem('websiteVisitors', visitors);
}

// Scroll to services section
function scrollToServices() {
    document.getElementById('services').scrollIntoView({ 
        behavior: 'smooth' 
    });
}