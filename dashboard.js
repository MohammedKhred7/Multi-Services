// Dashboard Data Management
class DashboardManager {
    constructor() {
        this.providers = JSON.parse(localStorage.getItem('providers')) || [];
        this.services = JSON.parse(localStorage.getItem('services')) || [];
        this.ads = JSON.parse(localStorage.getItem('ads')) || [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadStatistics();
        this.loadProvidersTable();
        this.loadServicesTable();
        this.loadAdsTable();
        this.setupCharts();
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(item.getAttribute('data-tab'));
            });
        });
        
        // Add buttons
        document.getElementById('add-provider-btn').addEventListener('click', () => this.openProviderModal());
        document.getElementById('add-service-btn').addEventListener('click', () => this.openServiceModal());
        document.getElementById('add-ad-btn').addEventListener('click', () => this.openAdModal());
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        document.getElementById('cancel-provider').addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-service').addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-ad').addEventListener('click', () => this.closeAllModals());
        
        // Form submissions
        document.getElementById('provider-form').addEventListener('submit', (e) => this.handleProviderSubmit(e));
        document.getElementById('service-form').addEventListener('submit', (e) => this.handleServiceSubmit(e));
        document.getElementById('ad-form').addEventListener('submit', (e) => this.handleAdSubmit(e));
        
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }
    
    switchTab(tabId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
    
    loadStatistics() {
        const visitorCount = localStorage.getItem('websiteVisitors') || 0;
        
        document.getElementById('providers-count').textContent = this.providers.length;
        document.getElementById('services-count').textContent = this.services.length;
        document.getElementById('ads-count').textContent = this.ads.length;
        document.getElementById('visitors-count').textContent = visitorCount;
    }
    
    loadProvidersTable() {
        const tbody = document.getElementById('providers-table-body');
        tbody.innerHTML = '';
        
        this.providers.forEach(provider => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${provider.name}</td>
                <td>${provider.service}</td>
                <td>${provider.phone}</td>
                <td>${provider.address}</td>
                <td>${this.getCategoryName(provider.category)}</td>
                <td>
                    <div class="action-icons">
                        <span class="action-icon edit" onclick="dashboard.editProvider(${provider.id})">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span class="action-icon delete" onclick="dashboard.deleteProvider(${provider.id})">
                            <i class="fas fa-trash"></i>
                        </span>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    loadServicesTable() {
        const tbody = document.getElementById('services-table-body');
        tbody.innerHTML = '';
        
        this.services.forEach(service => {
            const providersCount = this.providers.filter(p => p.service === service.name).length;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.name}</td>
                <td>${this.getCategoryName(service.category)}</td>
                <td>${providersCount}</td>
                <td>
                    <div class="action-icons">
                        <span class="action-icon edit" onclick="dashboard.editService(${service.id})">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span class="action-icon delete" onclick="dashboard.deleteService(${service.id})">
                            <i class="fas fa-trash"></i>
                        </span>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    loadAdsTable() {
        const tbody = document.getElementById('ads-table-body');
        tbody.innerHTML = '';
        
        this.ads.forEach(ad => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ad.title}</td>
                <td><img src="${ad.image}" alt="${ad.title}"></td>
                <td>${ad.description}</td>
                <td>${ad.startDate}</td>
                <td>${ad.endDate}</td>
                <td>
                    <div class="action-icons">
                        <span class="action-icon edit" onclick="dashboard.editAd(${ad.id})">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span class="action-icon delete" onclick="dashboard.deleteAd(${ad.id})">
                            <i class="fas fa-trash"></i>
                        </span>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    setupCharts() {
        this.setupProvidersChart();
        this.setupAdsChart();
    }
    
    setupProvidersChart() {
        const ctx = document.getElementById('providersChart').getContext('2d');
        const categories = ['خدمات المنازل', 'التجميل', 'التعليم', 'خدمات السيارات'];
        const counts = categories.map(cat => 
            this.providers.filter(p => this.getCategoryName(p.category) === cat).length
        );
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        '#007B83',
                        '#FFD166',
                        '#0097A7',
                        '#e6b84a'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    setupAdsChart() {
        const ctx = document.getElementById('adsChart').getContext('2d');
        const activeAds = this.ads.filter(ad => new Date(ad.endDate) >= new Date()).length;
        const inactiveAds = this.ads.length - activeAds;
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['الإعلانات النشطة', 'الإعلانات المنتهية'],
                datasets: [{
                    data: [activeAds, inactiveAds],
                    backgroundColor: [
                        '#007B83',
                        '#FFD166'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    openProviderModal(provider = null) {
        const modal = document.getElementById('provider-modal');
        const title = document.getElementById('provider-modal-title');
        const form = document.getElementById('provider-form');
        
        if (provider) {
            title.textContent = 'تعديل مقدم خدمة';
            document.getElementById('provider-id').value = provider.id;
            document.getElementById('provider-name').value = provider.name;
            document.getElementById('provider-service').value = provider.service;
            document.getElementById('provider-phone').value = provider.phone;
            document.getElementById('provider-category').value = provider.category;
            document.getElementById('provider-address').value = provider.address;
            document.getElementById('provider-description').value = provider.description;
        } else {
            title.textContent = 'إضافة مقدم خدمة';
            form.reset();
            document.getElementById('provider-id').value = '';
        }
        
        modal.style.display = 'flex';
    }
    
    openServiceModal(service = null) {
        const modal = document.getElementById('service-modal');
        const title = document.getElementById('service-modal-title');
        const form = document.getElementById('service-form');
        
        if (service) {
            title.textContent = 'تعديل خدمة';
            document.getElementById('service-id').value = service.id;
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-category').value = service.category;
        } else {
            title.textContent = 'إضافة خدمة';
            form.reset();
            document.getElementById('service-id').value = '';
        }
        
        modal.style.display = 'flex';
    }
    
    openAdModal(ad = null) {
        const modal = document.getElementById('ad-modal');
        const title = document.getElementById('ad-modal-title');
        const form = document.getElementById('ad-form');
        
        if (ad) {
            title.textContent = 'تعديل إعلان';
            document.getElementById('ad-id').value = ad.id;
            document.getElementById('ad-title').value = ad.title;
            document.getElementById('ad-image').value = ad.image;
            document.getElementById('ad-description').value = ad.description;
            document.getElementById('ad-start-date').value = ad.startDate;
            document.getElementById('ad-end-date').value = ad.endDate;
        } else {
            title.textContent = 'إضافة إعلان';
            form.reset();
            document.getElementById('ad-id').value = '';
        }
        
        modal.style.display = 'flex';
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    handleProviderSubmit(e) {
        e.preventDefault();
        
        const id = document.getElementById('provider-id').value;
        const providerData = {
            name: document.getElementById('provider-name').value,
            service: document.getElementById('provider-service').value,
            phone: document.getElementById('provider-phone').value,
            category: document.getElementById('provider-category').value,
            address: document.getElementById('provider-address').value,
            description: document.getElementById('provider-description').value
        };
        
        if (id) {
            // Edit existing provider
            this.updateProvider(parseInt(id), providerData);
        } else {
            // Add new provider
            this.addProvider(providerData);
        }
        
        this.closeAllModals();
        this.loadStatistics();
        this.loadProvidersTable();
        this.setupCharts();
    }
    
    handleServiceSubmit(e) {
        e.preventDefault();
        
        const id = document.getElementById('service-id').value;
        const serviceData = {
            name: document.getElementById('service-name').value,
            category: document.getElementById('service-category').value
        };
        
        if (id) {
            // Edit existing service
            this.updateService(parseInt(id), serviceData);
        } else {
            // Add new service
            this.addService(serviceData);
        }
        
        this.closeAllModals();
        this.loadStatistics();
        this.loadServicesTable();
        this.setupCharts();
    }
    
    handleAdSubmit(e) {
        e.preventDefault();
        
        const id = document.getElementById('ad-id').value;
        const adData = {
            title: document.getElementById('ad-title').value,
            image: document.getElementById('ad-image').value,
            description: document.getElementById('ad-description').value,
            startDate: document.getElementById('ad-start-date').value,
            endDate: document.getElementById('ad-end-date').value
        };
        
        if (id) {
            // Edit existing ad
            this.updateAd(parseInt(id), adData);
        } else {
            // Add new ad
            this.addAd(adData);
        }
        
        this.closeAllModals();
        this.loadStatistics();
        this.loadAdsTable();
        this.setupCharts();
    }
    
    addProvider(providerData) {
        const newProvider = {
            id: this.generateId(),
            ...providerData
        };
        this.providers.push(newProvider);
        this.saveData();
        this.showAlert('تم إضافة مقدم الخدمة بنجاح');
    }
    
    updateProvider(id, providerData) {
        const index = this.providers.findIndex(p => p.id === id);
        if (index !== -1) {
            this.providers[index] = { id, ...providerData };
            this.saveData();
            this.showAlert('تم تحديث مقدم الخدمة بنجاح');
        }
    }
    
    deleteProvider(id) {
        if (confirm('هل أنت متأكد من حذف مقدم الخدمة؟')) {
            this.providers = this.providers.filter(p => p.id !== id);
            this.saveData();
            this.loadStatistics();
            this.loadProvidersTable();
            this.setupCharts();
            this.showAlert('تم حذف مقدم الخدمة بنجاح');
        }
    }
    
    addService(serviceData) {
        const newService = {
            id: this.generateId(),
            ...serviceData
        };
        this.services.push(newService);
        this.saveData();
        this.showAlert('تم إضافة الخدمة بنجاح');
    }
    
    updateService(id, serviceData) {
        const index = this.services.findIndex(s => s.id === id);
        if (index !== -1) {
            this.services[index] = { id, ...serviceData };
            this.saveData();
            this.showAlert('تم تحديث الخدمة بنجاح');
        }
    }
    
    deleteService(id) {
        if (confirm('هل أنت متأكد من حذف الخدمة؟')) {
            this.services = this.services.filter(s => s.id !== id);
            this.saveData();
            this.loadStatistics();
            this.loadServicesTable();
            this.setupCharts();
            this.showAlert('تم حذف الخدمة بنجاح');
        }
    }
    
    addAd(adData) {
        const newAd = {
            id: this.generateId(),
            ...adData
        };
        this.ads.push(newAd);
        this.saveData();
        this.showAlert('تم إضافة الإعلان بنجاح');
    }
    
    updateAd(id, adData) {
        const index = this.ads.findIndex(a => a.id === id);
        if (index !== -1) {
            this.ads[index] = { id, ...adData };
            this.saveData();
            this.showAlert('تم تحديث الإعلان بنجاح');
        }
    }
    
    deleteAd(id) {
        if (confirm('هل أنت متأكد من حذف الإعلان؟')) {
            this.ads = this.ads.filter(a => a.id !== id);
            this.saveData();
            this.loadStatistics();
            this.loadAdsTable();
            this.setupCharts();
            this.showAlert('تم حذف الإعلان بنجاح');
        }
    }
    
    editProvider(id) {
        const provider = this.providers.find(p => p.id === id);
        if (provider) {
            this.openProviderModal(provider);
        }
    }
    
    editService(id) {
        const service = this.services.find(s => s.id === id);
        if (service) {
            this.openServiceModal(service);
        }
    }
    
    editAd(id) {
        const ad = this.ads.find(a => a.id === id);
        if (ad) {
            this.openAdModal(ad);
        }
    }
    
    generateId() {
        return Date.now();
    }
    
    getCategoryName(category) {
        const categories = {
            'home': 'خدمات المنازل',
            'beauty': 'التجميل',
            'education': 'التعليم',
            'car': 'خدمات السيارات'
        };
        return categories[category] || category;
    }
    
    saveData() {
        localStorage.setItem('providers', JSON.stringify(this.providers));
        localStorage.setItem('services', JSON.stringify(this.services));
        localStorage.setItem('ads', JSON.stringify(this.ads));
    }
    
    showAlert(message) {
        // Remove existing alert if any
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create new alert
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = message;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.left = '50%';
        alert.style.transform = 'translateX(-50%)';
        alert.style.backgroundColor = '#007B83';
        alert.style.color = 'white';
        alert.style.padding = '1rem 2rem';
        alert.style.borderRadius = '4px';
        alert.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        alert.style.zIndex = '1001';
        
        document.body.appendChild(alert);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new DashboardManager();
});