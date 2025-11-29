// API Service Class for Dashboard
class ApiService {
    constructor() {
        this.baseURL = 'https://paleturquoise-tarsier-726492.hostingersite.com/api';
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
                // If unauthorized, redirect to login
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Unauthorized');
                }
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
    async login(email, password) {
        const data = await this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.token) {
            this.token = data.token;
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    }

    // Dashboard API methods (require authentication)
    async getDashboardData() {
        const data = await this.request('/dashboard');
        return data.data || {};
    }

    async getDashboardCategories() {
        const data = await this.request('/dashboard/categories');
        return data.data || [];
    }

    async createCategory(categoryData) {
        const data = await this.request('/dashboard/categories', {
            method: 'POST',
            body: categoryData
        });
        return data.data || data;
    }

    async updateCategory(id, categoryData) {
        const data = await this.request(`/dashboard/categories/${id}`, {
            method: 'PUT',
            body: categoryData
        });
        return data.data || data;
    }

    async deleteCategory(id) {
        const data = await this.request(`/dashboard/categories/${id}`, {
            method: 'DELETE'
        });
        return data.data || data;
    }

    async getDashboardOffers() {
        const data = await this.request('/dashboard/offers');
        return data.data || [];
    }

    async createOffer(offerData) {
        const data = await this.request('/dashboard/offers', {
            method: 'POST',
            body: offerData
        });
        return data.data || data;
    }

    async updateOffer(id, offerData) {
        const data = await this.request(`/dashboard/offers/${id}`, {
            method: 'PUT',
            body: offerData
        });
        return data.data || data;
    }

    async deleteOffer(id) {
        const data = await this.request(`/dashboard/offers/${id}`, {
            method: 'DELETE'
        });
        return data.data || data;
    }

    async getDashboardServices() {
        const data = await this.request('/dashboard/services');
        return data.data || [];
    }

    async createService(serviceData) {
        const data = await this.request('/dashboard/services', {
            method: 'POST',
            body: serviceData
        });
        return data.data || data;
    }

    async updateService(id, serviceData) {
        const data = await this.request(`/dashboard/services/${id}`, {
            method: 'PUT',
            body: serviceData
        });
        return data.data || data;
    }

    async deleteService(id) {
        const data = await this.request(`/dashboard/services/${id}`, {
            method: 'DELETE'
        });
        return data.data || data;
    }

    async getWorkers() {
        const data = await this.request('/dashboard/workers');
        return data.data || [];
    }

    async createWorker(workerData) {
        const data = await this.request('/dashboard/workers', {
            method: 'POST',
            body: workerData
        });
        return data.data || data;
    }

    async updateWorker(id, workerData) {
        const data = await this.request(`/dashboard/workers/${id}`, {
            method: 'PUT',
            body: workerData
        });
        return data.data || data;
    }

    async deleteWorker(id) {
        const data = await this.request(`/dashboard/workers/${id}`, {
            method: 'DELETE'
        });
        return data.data || data;
    }

    async logout() {
        try {
            await this.request('/dashboard/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            this.token = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    }
}

// Dashboard Data Management with API Integration
class DashboardManager {
    constructor() {
        this.apiService = new ApiService();
        this.providers = [];
        this.services = [];
        this.ads = [];
        this.categories = [];
        
        this.checkAuthentication();
    }
    
    async checkAuthentication() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log('No token found, redirecting to login...');
            window.location.href = 'index.html';
            return;
        }
        
        try {
            // Verify token is still valid by making a test request
            console.log('Verifying authentication...');
            await this.apiService.getDashboardData();
            console.log('Authentication successful, initializing dashboard...');
            await this.init();
        } catch (error) {
            console.error('Authentication failed:', error);
            this.showDialog('خطأ', 'فشل المصادقة. يرجى تسجيل الدخول مرة أخرى.');
            setTimeout(() => {
                this.logout();
            }, 2000);
        }
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.loadStatistics();
        this.loadCategoriesTable();
        this.loadProvidersTable();
        this.loadServicesTable();
        this.loadAdsTable();
        this.setupCharts();
    }
    
    async loadData() {
        try {
            this.showLoading();
            
            console.log('Loading dashboard data...');
            
            // Load all data in parallel
            const [workersData, servicesData, offersData, categoriesData] = await Promise.all([
                this.apiService.getWorkers(),
                this.apiService.getDashboardServices(),
                this.apiService.getDashboardOffers(),
                this.apiService.getDashboardCategories()
            ]);
            
            console.log('Data loaded:', { workersData, servicesData, offersData, categoriesData });
            
            this.providers = this.transformWorkersData(workersData);
            this.services = this.transformServicesData(servicesData);
            this.ads = this.transformOffersData(offersData);
            this.categories = categoriesData;
            
            console.log('Transformed data:', { 
                providers: this.providers, 
                services: this.services, 
                ads: this.ads, 
                categories: this.categories 
            });
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showDialog('خطأ', 'حدث خطأ في تحميل البيانات');
            
            // Fallback to localStorage data
            this.providers = JSON.parse(localStorage.getItem('providers')) || [];
            this.services = JSON.parse(localStorage.getItem('services')) || [];
            this.ads = JSON.parse(localStorage.getItem('ads')) || [];
            this.categories = JSON.parse(localStorage.getItem('categories')) || [];
        } finally {
            this.hideLoading();
        }
    }
    
    transformWorkersData(apiData) {
        if (!apiData || !Array.isArray(apiData)) return [];
        
        return apiData.map(worker => ({
            id: worker.id,
            name: worker.name || 'غير معروف',
            phone: worker.phone || worker.mobile || 'غير متوفر',
            address: worker.address || 'غير محدد',
            image: worker.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            services: worker.services || [],
            services_details: worker.services_details || []
        }));
    }
    
    transformServicesData(apiData) {
        if (!apiData || !Array.isArray(apiData)) return [];
        
        return apiData.map(service => ({
            id: service.id,
            name: service.name || 'غير معروف',
            category: service.category ? service.category.name : (service.category_id || 'عام'),
            category_id: service.category_id,
            image: service.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            users_count: service.users_count || 0
        }));
    }
    
    transformOffersData(apiData) {
        if (!apiData || !Array.isArray(apiData)) return [];
        
        return apiData.map(offer => ({
            id: offer.id,
            title: offer.name || offer.title || 'غير معروف',
            image: offer.image || 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            description: offer.details || offer.description || 'لا يوجد وصف',
            category: offer.category ? offer.category.name : (offer.category_id || 'عام'),
            category_id: offer.category_id,
            startDate: offer.start_date || offer.startDate,
            endDate: offer.end_date || offer.endDate,
            duration: offer.duration,
            remainingDays: offer.remaining_days
        }));
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
        document.getElementById('add-category-btn').addEventListener('click', () => this.openCategoryModal());
        document.getElementById('add-provider-btn').addEventListener('click', () => this.openProviderModal());
        document.getElementById('add-service-btn').addEventListener('click', () => this.openServiceModal());
        document.getElementById('add-ad-btn').addEventListener('click', () => this.openAdModal());
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
        
        document.getElementById('cancel-category').addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-provider').addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-service').addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancel-ad').addEventListener('click', () => this.closeAllModals());
        
        // Form submissions
        document.getElementById('category-form').addEventListener('submit', (e) => this.handleCategorySubmit(e));
        document.getElementById('provider-form').addEventListener('submit', (e) => this.handleProviderSubmit(e));
        document.getElementById('service-form').addEventListener('submit', (e) => this.handleServiceSubmit(e));
        document.getElementById('ad-form').addEventListener('submit', (e) => this.handleAdSubmit(e));
        
        // Add service field button
        document.getElementById('add-service-field').addEventListener('click', () => this.addServiceField());
        
        // Image preview handlers
        this.setupImagePreviews();
        
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
        
        // Logout functionality
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-secondary';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> تسجيل الخروج';
        logoutBtn.addEventListener('click', () => this.logout());
        document.querySelector('.sidebar-footer').appendChild(logoutBtn);
    }
    
    setupImagePreviews() {
        // Category image preview
        document.getElementById('category-image').addEventListener('change', function(e) {
            const preview = document.getElementById('category-image-preview');
            preview.innerHTML = '';
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Service image preview
        document.getElementById('service-image').addEventListener('change', function(e) {
            const preview = document.getElementById('service-image-preview');
            preview.innerHTML = '';
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Provider image preview
        document.getElementById('provider-image').addEventListener('change', function(e) {
            const preview = document.getElementById('provider-image-preview');
            preview.innerHTML = '';
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Ad image preview
        document.getElementById('ad-image').addEventListener('change', function(e) {
            const preview = document.getElementById('ad-image-preview');
            preview.innerHTML = '';
            
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    async logout() {
        this.showConfirmationDialog('تأكيد', 'هل تريد تسجيل الخروج؟', async () => {
            try {
                await this.apiService.logout();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
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
        
        document.getElementById('categories-count').textContent = this.categories.length;
        document.getElementById('providers-count').textContent = this.providers.length;
        document.getElementById('services-count').textContent = this.services.length;
        document.getElementById('ads-count').textContent = this.ads.length;
        document.getElementById('visitors-count').textContent = visitorCount;
    }
    
    loadCategoriesTable() {
        const tbody = document.getElementById('categories-table-body');
        tbody.innerHTML = '';
        
        if (this.categories.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        لا توجد فئات
                    </td>
                </tr>
            `;
            return;
        }
        
        this.categories.forEach(category => {
            const servicesCount = category.services ? category.services.length : 0;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>${category.description || 'لا يوجد وصف'}</td>
                <td>
                    <img src="${category.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}" 
                         alt="${category.name}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                </td>
                <td>${servicesCount}</td>
                <td>
                    <div class="action-icons">
                        <span class="action-icon edit" onclick="dashboard.editCategory('${category.id}')">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span class="action-icon delete" onclick="dashboard.deleteCategory('${category.id}')">
                            <i class="fas fa-trash"></i>
                        </span>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    loadProvidersTable() {
        const tbody = document.getElementById('providers-table-body');
        tbody.innerHTML = '';
        
        if (this.providers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px;">
                        لا توجد بيانات لمقدمي الخدمات
                    </td>
                </tr>
            `;
            return;
        }
        
        this.providers.forEach(provider => {
            const servicesList = provider.services && provider.services.length > 0 
                ? provider.services.map(s => s.name).join(', ')
                : 'لا توجد خدمات';
                
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${provider.name}</td>
                <td>${provider.phone}</td>
                <td>${provider.address}</td>
                <td>
                    <img src="${provider.image}" 
                         alt="${provider.name}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                </td>
                <td>${servicesList}</td>
                <td>
                    <div class="action-icons">
                        <span class="action-icon edit" onclick="dashboard.editProvider('${provider.id}')">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span class="action-icon delete" onclick="dashboard.deleteWorker('${provider.id}')">
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
        
        if (this.services.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        لا توجد بيانات للخدمات
                    </td>
                </tr>
            `;
            return;
        }
        
        this.services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.name}</td>
                <td>${service.category}</td>
                <td>
                    <img src="${service.image}" 
                         alt="${service.name}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                </td>
                <td>${service.users_count}</td>
                <td>
                    <div class="action-icons">
                        <span class="action-icon edit" onclick="dashboard.editService('${service.id}')">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span class="action-icon delete" onclick="dashboard.deleteService('${service.id}')">
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
        
        if (this.ads.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px;">
                        لا توجد بيانات للإعلانات
                    </td>
                </tr>
            `;
            return;
        }
        
        this.ads.forEach(ad => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ad.title}</td>
                <td>
                    <img src="${ad.image}" 
                         alt="${ad.title}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
                </td>
                <td>${ad.description}</td>
                <td>${ad.category}</td>
                <td>${ad.startDate}</td>
                <td>${ad.endDate}</td>
                <td>
                    <div class="action-icons">
                        <span class="action-icon edit" onclick="dashboard.editAd('${ad.id}')">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span class="action-icon delete" onclick="dashboard.deleteOffer('${ad.id}')">
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
        const ctx = document.getElementById('providersChart');
        if (!ctx) return;
        
        const chartCtx = ctx.getContext('2d');
        
        // Group providers by category
        const categoryCounts = {};
        this.providers.forEach(provider => {
            // Count providers by their services categories
            if (provider.services && provider.services.length > 0) {
                provider.services.forEach(service => {
                    const category = service.category || 'عام';
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                });
            } else {
                const category = 'عام';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }
        });
        
        const categories = Object.keys(categoryCounts);
        const counts = Object.values(categoryCounts);
        
        // If no data, show empty state
        if (categories.length === 0) {
            ctx.style.display = 'none';
            ctx.parentElement.innerHTML += '<p style="text-align: center; padding: 20px;">لا توجد بيانات للعرض</p>';
            return;
        }
        
        new Chart(chartCtx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        '#007B83',
                        '#FFD166',
                        '#0097A7',
                        '#e6b84a',
                        '#FF6B6B',
                        '#4ECDC4'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true
                    }
                }
            }
        });
    }
    
    setupAdsChart() {
        const ctx = document.getElementById('adsChart');
        if (!ctx) return;
        
        const chartCtx = ctx.getContext('2d');
        const activeAds = this.ads.filter(ad => {
            if (!ad.endDate) return false;
            return new Date(ad.endDate) >= new Date();
        }).length;
        const inactiveAds = this.ads.length - activeAds;
        
        // If no data, show empty state
        if (this.ads.length === 0) {
            ctx.style.display = 'none';
            ctx.parentElement.innerHTML += '<p style="text-align: center; padding: 20px;">لا توجد بيانات للعرض</p>';
            return;
        }
        
        new Chart(chartCtx, {
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
                        position: 'bottom',
                        rtl: true
                    }
                }
            }
        });
    }
    
    openCategoryModal(category = null) {
        const modal = document.getElementById('category-modal');
        const title = document.getElementById('category-modal-title');
        const form = document.getElementById('category-form');
        
        if (category) {
            title.textContent = 'تعديل فئة';
            document.getElementById('category-id').value = category.id;
            document.getElementById('category-name').value = category.name;
            document.getElementById('category-description').value = category.description || '';
            
            // Show current image if exists
            const preview = document.getElementById('category-image-preview');
            preview.innerHTML = '';
            if (category.image) {
                const img = document.createElement('img');
                img.src = category.image;
                preview.appendChild(img);
            }
        } else {
            title.textContent = 'إضافة فئة';
            form.reset();
            document.getElementById('category-id').value = '';
            document.getElementById('category-image-preview').innerHTML = '';
        }
        
        modal.style.display = 'flex';
    }
    
    openProviderModal(provider = null) {
        const modal = document.getElementById('provider-modal');
        const title = document.getElementById('provider-modal-title');
        const form = document.getElementById('provider-form');
        
        // Update services options
        this.updateServicesOptions();
        
        if (provider) {
            title.textContent = 'تعديل مقدم خدمة';
            document.getElementById('provider-id').value = provider.id;
            document.getElementById('provider-name').value = provider.name;
            document.getElementById('provider-phone').value = provider.phone;
            document.getElementById('provider-address').value = provider.address;
            
            // Show current image if exists
            const preview = document.getElementById('provider-image-preview');
            preview.innerHTML = '';
            if (provider.image) {
                const img = document.createElement('img');
                img.src = provider.image;
                preview.appendChild(img);
            }
            
            // Load services
            this.loadProviderServices(provider);
        } else {
            title.textContent = 'إضافة مقدم خدمة';
            form.reset();
            document.getElementById('provider-id').value = '';
            document.getElementById('provider-image-preview').innerHTML = '';
            document.getElementById('provider-services-container').innerHTML = '';
            this.addServiceField(); // Add one empty service field
        }
        
        modal.style.display = 'flex';
    }
    
    openServiceModal(service = null) {
        const modal = document.getElementById('service-modal');
        const title = document.getElementById('service-modal-title');
        const form = document.getElementById('service-form');
        
        // Update category options
        this.updateCategoryOptions('service-category');
        
        if (service) {
            title.textContent = 'تعديل خدمة';
            document.getElementById('service-id').value = service.id;
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-category').value = service.category_id;
            
            // Show current image if exists
            const preview = document.getElementById('service-image-preview');
            preview.innerHTML = '';
            if (service.image) {
                const img = document.createElement('img');
                img.src = service.image;
                preview.appendChild(img);
            }
        } else {
            title.textContent = 'إضافة خدمة';
            form.reset();
            document.getElementById('service-id').value = '';
            document.getElementById('service-image-preview').innerHTML = '';
        }
        
        modal.style.display = 'flex';
    }
    
    openAdModal(ad = null) {
        const modal = document.getElementById('ad-modal');
        const title = document.getElementById('ad-modal-title');
        const form = document.getElementById('ad-form');
        
        // Update category options
        this.updateCategoryOptions('ad-category');
        
        if (ad) {
            title.textContent = 'تعديل إعلان';
            document.getElementById('ad-id').value = ad.id;
            document.getElementById('ad-title').value = ad.title;
            document.getElementById('ad-description').value = ad.description;
            document.getElementById('ad-category').value = ad.category_id;
            document.getElementById('ad-start-date').value = ad.startDate;
            document.getElementById('ad-end-date').value = ad.endDate;
            
            // Show current image if exists
            const preview = document.getElementById('ad-image-preview');
            preview.innerHTML = '';
            if (ad.image) {
                const img = document.createElement('img');
                img.src = ad.image;
                preview.appendChild(img);
            }
        } else {
            title.textContent = 'إضافة إعلان';
            form.reset();
            document.getElementById('ad-id').value = '';
            document.getElementById('ad-image-preview').innerHTML = '';
        }
        
        modal.style.display = 'flex';
    }
    
    updateCategoryOptions(selectId) {
        const select = document.getElementById(selectId);
        if (!this.categories || this.categories.length === 0) {
            console.log('No categories loaded yet');
            return;
        }
        
        select.innerHTML = '<option value="">اختر الفئة</option>';
        
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
        });
    }
    
    updateServicesOptions() {
        // This will be used when creating service fields
        this.services = this.services || [];
    }
    
    addServiceField(serviceId = '', details = '') {
        const container = document.getElementById('provider-services-container');
        const index = container.children.length;
        
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'service-field';
        fieldDiv.innerHTML = `
            <select name="services[]" class="form-input" required>
                <option value="">اختر الخدمة</option>
                ${this.services.map(service => 
                    `<option value="${service.id}" ${service.id === serviceId ? 'selected' : ''}>${service.name}</option>`
                ).join('')}
            </select>
            <input type="text" name="services_details[]" class="form-input" placeholder="تفاصيل الخدمة" value="${details}" required>
            <button type="button" class="remove-service" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(fieldDiv);
    }
    
    loadProviderServices(provider) {
        const container = document.getElementById('provider-services-container');
        container.innerHTML = '';
        
        if (provider.services && provider.services.length > 0) {
            provider.services.forEach((service, index) => {
                const details = provider.services_details && provider.services_details[index] 
                    ? provider.services_details[index] 
                    : '';
                this.addServiceField(service.id, details);
            });
        } else {
            this.addServiceField(); // Add one empty field
        }
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    async handleCategorySubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('save-category-btn');
        this.setButtonLoading(submitBtn, true);
        
        const id = document.getElementById('category-id').value;
        const formData = new FormData();
        
        formData.append('name', document.getElementById('category-name').value);
        formData.append('description', document.getElementById('category-description').value);
        
        const imageFile = document.getElementById('category-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        try {
            if (id) {
                await this.updateCategory(id, formData);
            } else {
                await this.createCategory(formData);
            }
            
            this.closeAllModals();
            await this.loadData();
            this.loadStatistics();
            this.loadCategoriesTable();
            this.setupCharts();
            
        } catch (error) {
            console.error('Error saving category:', error);
            this.showDialog('خطأ', 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }
    
    async handleProviderSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('save-provider-btn');
        this.setButtonLoading(submitBtn, true);
        
        const id = document.getElementById('provider-id').value;
        const formData = new FormData();
        
        formData.append('name', document.getElementById('provider-name').value);
        formData.append('phone', document.getElementById('provider-phone').value);
        formData.append('address', document.getElementById('provider-address').value);
        
        const imageFile = document.getElementById('provider-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        // Add services
        const serviceSelects = document.querySelectorAll('select[name="services[]"]');
        const serviceDetails = document.querySelectorAll('input[name="services_details[]"]');
        
        serviceSelects.forEach((select, index) => {
            if (select.value) {
                formData.append('services[]', select.value);
                formData.append('services_details[]', serviceDetails[index].value);
            }
        });
        
        try {
            if (id) {
                await this.updateWorker(id, formData);
            } else {
                await this.createWorker(formData);
            }
            
            this.closeAllModals();
            await this.loadData();
            this.loadStatistics();
            this.loadProvidersTable();
            this.setupCharts();
            
        } catch (error) {
            console.error('Error saving provider:', error);
            this.showDialog('خطأ', 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }
    
    async handleServiceSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('save-service-btn');
        this.setButtonLoading(submitBtn, true);
        
        const id = document.getElementById('service-id').value;
        const formData = new FormData();
        
        formData.append('name', document.getElementById('service-name').value);
        formData.append('category_id', document.getElementById('service-category').value);
        
        const imageFile = document.getElementById('service-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        try {
            if (id) {
                await this.updateService(id, formData);
            } else {
                await this.createService(formData);
            }
            
            this.closeAllModals();
            await this.loadData();
            this.loadStatistics();
            this.loadServicesTable();
            this.setupCharts();
            
        } catch (error) {
            console.error('Error saving service:', error);
            this.showDialog('خطأ', 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }
    
    async handleAdSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('save-ad-btn');
        this.setButtonLoading(submitBtn, true);
        
        const id = document.getElementById('ad-id').value;
        const formData = new FormData();
        
        formData.append('name', document.getElementById('ad-title').value);
        formData.append('details', document.getElementById('ad-description').value);
        formData.append('category_id', document.getElementById('ad-category').value);
        formData.append('start_date', document.getElementById('ad-start-date').value);
        formData.append('end_date', document.getElementById('ad-end-date').value);
        
        const imageFile = document.getElementById('ad-image').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        try {
            if (id) {
                await this.updateOffer(id, formData);
            } else {
                await this.createOffer(formData);
            }
            
            this.closeAllModals();
            await this.loadData();
            this.loadStatistics();
            this.loadAdsTable();
            this.setupCharts();
            
        } catch (error) {
            console.error('Error saving ad:', error);
            this.showDialog('خطأ', 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }
    
    async createCategory(categoryData) {
        await this.apiService.createCategory(categoryData);
        this.showDialog('نجاح', 'تم إضافة الفئة بنجاح');
    }
    
    async updateCategory(id, categoryData) {
        await this.apiService.updateCategory(id, categoryData);
        this.showDialog('نجاح', 'تم تحديث الفئة بنجاح');
    }
    
    async deleteCategory(id) {
        this.showConfirmationDialog('تأكيد الحذف', 'هل أنت متأكد من حذف هذه الفئة؟', async () => {
            try {
                await this.apiService.deleteCategory(id);
                await this.loadData();
                this.loadStatistics();
                this.loadCategoriesTable();
                this.setupCharts();
                this.showDialog('نجاح', 'تم حذف الفئة بنجاح');
            } catch (error) {
                console.error('Error deleting category:', error);
                this.showDialog('خطأ', 'حدث خطأ أثناء حذف الفئة');
            }
        });
    }
    
    async createWorker(workerData) {
        await this.apiService.createWorker(workerData);
        this.showDialog('نجاح', 'تم إضافة مقدم الخدمة بنجاح');
    }
    
    async updateWorker(id, workerData) {
        await this.apiService.updateWorker(id, workerData);
        this.showDialog('نجاح', 'تم تحديث مقدم الخدمة بنجاح');
    }
    
    async deleteWorker(id) {
        this.showConfirmationDialog('تأكيد الحذف', 'هل أنت متأكد من حذف مقدم الخدمة؟', async () => {
            try {
                await this.apiService.deleteWorker(id);
                await this.loadData();
                this.loadStatistics();
                this.loadProvidersTable();
                this.setupCharts();
                this.showDialog('نجاح', 'تم حذف مقدم الخدمة بنجاح');
            } catch (error) {
                console.error('Error deleting provider:', error);
                this.showDialog('خطأ', 'حدث خطأ أثناء حذف مقدم الخدمة');
            }
        });
    }
    
    async createService(serviceData) {
        await this.apiService.createService(serviceData);
        this.showDialog('نجاح', 'تم إضافة الخدمة بنجاح');
    }
    
    async updateService(id, serviceData) {
        await this.apiService.updateService(id, serviceData);
        this.showDialog('نجاح', 'تم تحديث الخدمة بنجاح');
    }
    
    async deleteService(id) {
        this.showConfirmationDialog('تأكيد الحذف', 'هل أنت متأكد من حذف الخدمة؟', async () => {
            try {
                await this.apiService.deleteService(id);
                await this.loadData();
                this.loadStatistics();
                this.loadServicesTable();
                this.setupCharts();
                this.showDialog('نجاح', 'تم حذف الخدمة بنجاح');
            } catch (error) {
                console.error('Error deleting service:', error);
                this.showDialog('خطأ', 'حدث خطأ أثناء حذف الخدمة');
            }
        });
    }
    
    async createOffer(offerData) {
        await this.apiService.createOffer(offerData);
        this.showDialog('نجاح', 'تم إضافة الإعلان بنجاح');
    }
    
    async updateOffer(id, offerData) {
        await this.apiService.updateOffer(id, offerData);
        this.showDialog('نجاح', 'تم تحديث الإعلان بنجاح');
    }
    
    async deleteOffer(id) {
        this.showConfirmationDialog('تأكيد الحذف', 'هل أنت متأكد من حذف الإعلان؟', async () => {
            try {
                await this.apiService.deleteOffer(id);
                await this.loadData();
                this.loadStatistics();
                this.loadAdsTable();
                this.setupCharts();
                this.showDialog('نجاح', 'تم حذف الإعلان بنجاح');
            } catch (error) {
                console.error('Error deleting ad:', error);
                this.showDialog('خطأ', 'حدث خطأ أثناء حذف الإعلان');
            }
        });
    }
    
    editCategory(id) {
        const category = this.categories.find(c => c.id === id);
        if (category) {
            this.openCategoryModal(category);
        } else {
            this.showDialog('خطأ', 'لم يتم العثور على الفئة');
        }
    }
    
    editProvider(id) {
        const provider = this.providers.find(p => p.id === id);
        if (provider) {
            this.openProviderModal(provider);
        } else {
            this.showDialog('خطأ', 'لم يتم العثور على مقدم الخدمة');
        }
    }
    
    editService(id) {
        const service = this.services.find(s => s.id === id);
        if (service) {
            this.openServiceModal(service);
        } else {
            this.showDialog('خطأ', 'لم يتم العثور على الخدمة');
        }
    }
    
    editAd(id) {
        const ad = this.ads.find(a => a.id === id);
        if (ad) {
            this.openAdModal(ad);
        } else {
            this.showDialog('خطأ', 'لم يتم العثور على الإعلان');
        }
    }
    
    setButtonLoading(button, isLoading) {
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
    
    showLoading() {
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
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
    
    showDialog(title, message) {
        const dialog = document.getElementById('custom-dialog');
        const dialogTitle = document.getElementById('dialog-title');
        const dialogMessage = document.getElementById('dialog-message');
        
        dialogTitle.textContent = title;
        dialogMessage.textContent = message;
        dialog.style.display = 'flex';
        
        const confirmBtn = document.getElementById('dialog-confirm-btn');
        confirmBtn.onclick = () => {
            dialog.style.display = 'none';
        };
    }
    
    showConfirmationDialog(title, message, onConfirm) {
        const dialog = document.getElementById('confirmation-dialog');
        const dialogTitle = document.getElementById('confirmation-title');
        const dialogMessage = document.getElementById('confirmation-message');
        
        dialogTitle.textContent = title;
        dialogMessage.textContent = message;
        dialog.style.display = 'flex';
        
        const confirmBtn = document.getElementById('confirmation-confirm-btn');
        const cancelBtn = document.getElementById('confirmation-cancel-btn');
        
        const closeDialog = () => {
            dialog.style.display = 'none';
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
        };
        
        confirmBtn.onclick = () => {
            closeDialog();
            if (onConfirm) onConfirm();
        };
        
        cancelBtn.onclick = closeDialog;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    window.dashboard = new DashboardManager();
});