// Global variables
let isAdmin = false;
let allProperties = [];
let allOffers = [];

// Admin credentials
const ADMIN_USERNAME = 'anas';
const ADMIN_PASSWORD = '1234';

// WhatsApp number for contact
const WHATSAPP_NUMBER = '+963988295085';

// Check for saved admin session on load
function checkAdminSession() {
    const savedAdmin = localStorage.getItem('isAdmin');
    if (savedAdmin === 'true') {
        isAdmin = true;
        showAdminPanel();
    }
}

// Save admin session
function saveAdminSession() {
    localStorage.setItem('isAdmin', 'true');
}

// Clear admin session
function clearAdminSession() {
    localStorage.setItem('isAdmin', 'false');
}

// Notification function
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    
    let icon = '✓';
    if (type === 'error') icon = '✕';
    else if (type === 'warning') icon = '⚠';
    else if (type === 'success') icon = '✓';
    
    notification.innerHTML = '<span class="notification-icon">' + icon + '</span><span class="notification-message">' + message + '</span>';
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Image Preview Function - adds to existing, doesn't replace
function previewImages(input, previewId) {
    const preview = document.getElementById(previewId);
    
    // Check if there are already images in preview (from existing property)
    const existingContainers = preview.querySelectorAll('.preview-image-container');
    const hasExisting = existingContainers.length > 0;
    
    if (input.files && input.files.length > 0) {
        // Only clear if there are no existing images
        if (!hasExisting) {
            preview.innerHTML = '';
        }
        
        const files = Array.from(input.files);
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'preview-image-container new';
                imgContainer.style.position = 'relative';
                imgContainer.style.display = 'inline-block';
                imgContainer.style.margin = '5px';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'preview-image';
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                
                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.innerHTML = '✕';
                deleteBtn.style.cssText = 'position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px;';
                deleteBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    imgContainer.remove();
                    const newFiles = Array.from(input.files).filter((_, i) => i !== index);
                    const dataTransfer = new DataTransfer();
                    newFiles.forEach(f => dataTransfer.items.add(f));
                    input.files = dataTransfer.files;
                };
                
                imgContainer.appendChild(deleteBtn);
                imgContainer.appendChild(img);
                preview.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Video Preview Function - adds to existing, doesn't replace
function previewVideos(input, previewId) {
    const preview = document.getElementById(previewId);
    
    // Check if there are already videos in preview (from existing property)
    const existingContainers = preview.querySelectorAll('.preview-video-container');
    const hasExisting = existingContainers.length > 0;
    
    if (input.files && input.files.length > 0) {
        // Only clear if there are no existing videos
        if (!hasExisting) {
            preview.innerHTML = '';
        }
        
        const files = Array.from(input.files);
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'preview-video-container new';
                videoContainer.style.marginBottom = '15px';
                videoContainer.style.position = 'relative';
                
                const video = document.createElement('video');
                video.src = e.target.result;
                video.className = 'preview-video';
                video.controls = true;
                video.preload = 'metadata';
                video.style.width = '100%';
                video.style.maxHeight = '200px';
                video.style.borderRadius = '10px';
                
                const fileName = document.createElement('p');
                fileName.textContent = '🎬 ' + file.name;
                fileName.style.color = '#aaa';
                fileName.style.fontSize = '12px';
                fileName.style.marginTop = '5px';
                
                // Delete button - prevent form submission
                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.innerHTML = '✕';
                deleteBtn.style.cssText = 'position: absolute; top: 5px; right: 5px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px; z-index: 10;';
                deleteBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Remove from preview
                    videoContainer.remove();
                    // Create new FileList without this file
                    const newFiles = Array.from(input.files).filter((_, i) => i !== index);
                    const dataTransfer = new DataTransfer();
                    newFiles.forEach(f => dataTransfer.items.add(f));
                    input.files = dataTransfer.files;
                };
                
                videoContainer.appendChild(deleteBtn);
                videoContainer.appendChild(video);
                videoContainer.appendChild(fileName);
                preview.appendChild(videoContainer);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Keep old function for compatibility
function previewVideo(input, previewId) {
    previewVideos(input, previewId);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession(); // Check for saved admin session
    loadProperties();
    loadOffers();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Property form
    document.getElementById('propertyForm').addEventListener('submit', handleAddProperty);
    
    // Offer form
    document.getElementById('offerForm').addEventListener('submit', handleAddOffer);
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
}

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        isAdmin = true;
        saveAdminSession(); // Save session
        showAdminPanel();
        showNotification('تم تسجيل الدخول بنجاح!', 'success');
    } else {
        showNotification('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// Show admin panel (shared function)
function showAdminPanel() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'block';
    
    // Show properties section alongside admin panel
    document.getElementById('properties').style.display = 'block';
    
    loadProperties();
    loadOffers();
    loadPropertiesForAdmin();
    loadOffersForAdmin();
}

// Logout
function logout() {
    isAdmin = false;
    clearAdminSession(); // Clear session
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    
    // Keep properties visible
    document.getElementById('properties').style.display = 'block';
    loadProperties();
}

// Modal functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Show section
function showSection(sectionId) {
    const sections = ['properties', 'offers'];
    sections.forEach(s => {
        document.getElementById(s).style.display = s === sectionId ? 'block' : 'none';
    });
    
    if (sectionId === 'properties') loadProperties();
    if (sectionId === 'offers') loadOffers();
    
    // Hide admin tabs when viewing properties or offers
    const adminTabs = ['addProperty', 'addOffer', 'manageProperties'];
    adminTabs.forEach(t => {
        const el = document.getElementById(t);
        if (el) {
            el.style.display = 'none';
        }
    });
    
    // Keep admin panel visible if logged in
    if (isAdmin) {
        document.getElementById('adminPanel').style.display = 'block';
    }
}

// Admin tabs
function showAdminTab(tabId) {
    const tabs = ['addProperty', 'addOffer', 'manageProperties'];
    tabs.forEach(t => {
        const el = document.getElementById(t);
        if (el) {
            el.style.display = t === tabId ? 'block' : 'none';
        }
    });
    
    if (tabId === 'manageProperties') {
        loadPropertiesForAdmin();
        loadOffersForAdmin();
    }
}

// Add Property
async function handleAddProperty(e) {
    e.preventDefault();
    
    const form = e.target;
    const editId = form.dataset.editId;
    const isEditMode = editId && editId.length > 0;
    
    const priceUSD = document.getElementById('propertyPriceUSD').value;
    const priceSYP = document.getElementById('propertyPriceSYP').value;
    const imageFiles = document.getElementById('propertyImage').files;
    const videoFile = document.getElementById('propertyVideo');
    
    showNotification(isEditMode ? 'جاري تحديث العقار...' : 'جاري إضافة العقار...', 'warning');
    
    try {
        let imageUrls = [];
        let videoUrls = [];
        
        // Upload images to Cloudinary if selected
        if (imageFiles && imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'anas01');
                
                const response = await fetch('https://api.cloudinary.com/v1_1/ds1bx7gbk/image/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                imageUrls.push(data.secure_url);
            }
        }
        
        // Upload videos to Cloudinary if selected
        if (videoFile && videoFile.files && videoFile.files.length > 0) {
            const videoFilesList = Array.from(videoFile.files);
            for (let i = 0; i < videoFilesList.length; i++) {
                const file = videoFilesList[i];
                const videoFormData = new FormData();
                videoFormData.append('file', file);
                videoFormData.append('upload_preset', 'anas01');
                
                const videoResponse = await fetch('https://api.cloudinary.com/v1_1/ds1bx7gbk/video/upload', {
                    method: 'POST',
                    body: videoFormData
                });
                
                const videoData = await videoResponse.json();
                if (videoData.secure_url) {
                    videoUrls.push(videoData.secure_url);
                }
            }
        }
        
        const property = {
            type: document.getElementById('propertyType').value,
            title: document.getElementById('propertyTitle').value,
            description: document.getElementById('propertyDesc').value,
            priceUSD: priceUSD ? parseInt(priceUSD) : 0,
            priceSYP: priceSYP ? parseInt(priceSYP) : 0,
            street: document.getElementById('propertyStreet').value,
            area: parseInt(document.getElementById('propertyArea').value) || 0,
            rooms: parseInt(document.getElementById('propertyRooms').value) || 0,
            ownership: document.getElementById('propertyOwnership').value,
            direction: document.getElementById('propertyDirection').value,
            videoUrls: videoUrls,
            status: document.getElementById('propertyStatus').value || 'available'
        };
        
        if (isEditMode) {
            const doc = await window.db.collection('properties').doc(editId).get();
            const existingData = doc.data();
            
            // Keep existing images if no new ones added
            if (imageUrls.length === 0) {
                property.imageUrls = existingData.imageUrls || [];
            } else {
                property.imageUrls = [...(existingData.imageUrls || []), ...imageUrls];
            }
            
            // Keep existing videos if no new ones added
            if (videoUrls.length === 0) {
                property.videoUrls = existingData.videoUrls || [];
            } else {
                property.videoUrls = [...(existingData.videoUrls || []), ...videoUrls];
            }
            
            await window.db.collection('properties').doc(editId).update(property);
            showNotification('تم التحديث بنجاح!', 'success');
            
            // Reset edit mode
            delete form.dataset.editId;
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'إضافة العقار';
        } else {
            property.imageUrls = imageUrls;
            property.videoUrls = videoUrls;
            property.createdAt = new Date().toISOString();
            await window.db.collection('properties').add(property);
            showNotification('تم الرفع بنجاح!', 'success');
        }
        
        document.getElementById('propertyForm').reset();
        
        // Clear previews
        document.getElementById('propertyPreview').innerHTML = '';
        document.getElementById('propertyVideoPreview').innerHTML = '';
        
        // Switch to properties view
        showSection('properties');
        loadProperties();
        loadPropertiesForAdmin();
    } catch (error) {
        console.error('Error adding property:', error);
        showNotification('حدث خطأ: ' + error.message, 'error');
    }
}

// Add Offer
async function handleAddOffer(e) {
    e.preventDefault();
    
    const priceUSD = document.getElementById('offerPriceUSD').value;
    const priceSYP = document.getElementById('offerPriceSYP').value;
    const oldPriceUSD = document.getElementById('offerOldPriceUSD').value;
    const oldPriceSYP = document.getElementById('offerOldPriceSYP').value;
    const imageFiles = document.getElementById('offerImage').files;
    
    showNotification('جاري إضافة العرض...', 'warning');
    
    try {
        let imageUrls = [];
        
        // Upload images to Cloudinary if selected
        if (imageFiles && imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'anas01');
                
                const response = await fetch('https://api.cloudinary.com/v1_1/ds1bx7gbk/image/upload', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                imageUrls.push(data.secure_url);
            }
        }
        
        const offer = {
            title: document.getElementById('offerTitle').value,
            description: document.getElementById('offerDesc').value,
            priceUSD: priceUSD ? parseInt(priceUSD) : 0,
            priceSYP: priceSYP ? parseInt(priceSYP) : 0,
            oldPriceUSD: oldPriceUSD ? parseInt(oldPriceUSD) : 0,
            oldPriceSYP: oldPriceSYP ? parseInt(oldPriceSYP) : 0,
            imageUrls: imageUrls,
            createdAt: new Date().toISOString()
        };
        
        await window.db.collection('offers').add(offer);
        showNotification('تم إضافة العرض بنجاح!', 'success');
        document.getElementById('offerForm').reset();
        loadOffers();
    } catch (error) {
        console.error('Error adding offer:', error);
        showNotification('حدث خطأ في إضافة العرض: ' + error.message, 'error');
    }
}

// Contact Form Submit
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const request = {
        name: document.getElementById('contactName').value,
        phone: document.getElementById('contactPhone').value,
        message: document.getElementById('contactMessage').value,
        propertyType: document.getElementById('contactPropertyType').value,
        budget: document.getElementById('contactBudget').value,
        createdAt: new Date().toISOString()
    };
    
    try {
        await window.db.collection('requests').add(request);
        showNotification('تم إرسال طلبك بنجاح! سنتواصل معك قريباً', 'success');
        document.getElementById('contactForm').reset();
    } catch (error) {
        console.error('Error submitting request:', error);
        showNotification('حدث خطأ في إرسال الطلب', 'error');
    }
}

// Helper functions
function getTypeIcon(type) {
    const icons = {
        house: '🏠',
        apartment: '🏢',
        villa: '🏡',
        farm: '🌾',
        land: '🌍',
        shop: '🏪'
    };
    return icons[type] || '🏢';
}

function getTypeName(type) {
    const names = {
        house: 'بيت',
        apartment: 'شقة',
        villa: 'فيلا',
        farm: 'مزرعة',
        land: 'أرض',
        shop: 'محل'
    };
    return names[type] || type;
}

// Show property details in modal
function showPropertyDetails(prop) {
    const modal = document.getElementById('propertyModal');
    const content = document.getElementById('propertyModalContent');
    
    let priceText = '';
    if (prop.priceUSD && prop.priceUSD > 0) {
        priceText = prop.priceUSD.toLocaleString() + ' دولار';
    }
    if (prop.priceSYP && prop.priceSYP > 0) {
        if (priceText) priceText += ' | ';
        priceText += prop.priceSYP.toLocaleString() + ' ل.س';
    }
    
    // Build images gallery if multiple images
    let imagesHtml = '';
    if (prop.imageUrls && prop.imageUrls.length > 0) {
        if (prop.imageUrls.length === 1) {
            imagesHtml = '<img src="' + prop.imageUrls[0] + '" alt="' + prop.title + '" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 10px; cursor: pointer;" onclick="showLightbox(\'' + prop.imageUrls[0] + '\')">';
        } else {
            imagesHtml = '<div style="display: grid; grid-template-columns: repeat(' + Math.min(prop.imageUrls.length, 3) + ', 1fr); gap: 10px;">';
            prop.imageUrls.forEach(img => {
                imagesHtml += '<img src="' + img + '" alt="' + prop.title + '" style="width: 100%; height: 150px; object-fit: cover; border-radius: 10px; cursor: pointer;" onclick="showLightbox(\'' + img + '\')">';
            });
            imagesHtml += '</div>';
        }
    } else if (prop.imageData) {
        imagesHtml = '<img src="' + prop.imageData + '" alt="' + prop.title + '" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 10px; cursor: pointer;" onclick="showLightbox(\'' + prop.imageData + '\')">';
    } else {
        imagesHtml = '<div style="font-size: 100px; text-align: center; padding: 50px;">' + getTypeIcon(prop.type) + '</div>';
    }
    
    // Build videos if exist
    let videoHtml = '';
    if (prop.videoUrls && prop.videoUrls.length > 0) {
        videoHtml = '<div style="margin-top: 15px;">';
        if (prop.videoUrls.length === 1) {
            videoHtml += '<p style="color: #888; margin-bottom: 10px;">🎬 فيديو العقار:</p>' +
                '<video controls style="width: 100%; max-height: 400px; border-radius: 10px;">' +
                    '<source src="' + prop.videoUrls[0] + '" type="video/mp4">' +
                    'المتصفح لا يدعم تشغيل الفيديو' +
                '</video>';
        } else {
            videoHtml += '<p style="color: #888; margin-bottom: 10px;">🎬 فيديوهات العقار (' + prop.videoUrls.length + '):</p>' +
                '<div style="display: grid; grid-template-columns: repeat(' + Math.min(prop.videoUrls.length, 2) + ', 1fr); gap: 10px;">';
            prop.videoUrls.forEach((vid, idx) => {
                videoHtml += '<video controls style="width: 100%; max-height: 200px; border-radius: 10px;">' +
                    '<source src="' + vid + '" type="video/mp4">' +
                    'المتصفح لا يدعم تشغيل الفيديو' +
                '</video>';
            });
            videoHtml += '</div>';
        }
        videoHtml += '</div>';
    }
    
    content.innerHTML = 
        '<div style="color: #888; margin-bottom: 20px;">' +
            '<span style="background: #444; color: #fff; padding: 5px 15px; border-radius: 4px; font-size: 14px;">' + getTypeName(prop.type) + '</span>' +
        '</div>' +
        '<h2 style="color: #fff; margin: 10px 0;">' + prop.title + '</h2>' +
        '<p style="color: #fff; font-size: 28px; font-weight: bold; margin: 10px 0;">' + (priceText || 'السعر غير محدد') + '</p>' +
        imagesHtml +
        videoHtml +
        '<div style="margin-top: 20px; padding: 15px; background: #0d0d0d; border-radius: 8px;">' +
            '<h3 style="color: #888; margin: 10px 0;">التفاصيل:</h3>' +
            '<p style="color: #ccc; margin: 5px 0;">📐 المساحة: ' + (prop.area || 'غير محددة') + ' م²</p>' +
            '<p style="color: #ccc; margin: 5px 0;">🛏️ الغرف: ' + (prop.rooms || '0') + '</p>' +
            (prop.street ? '<p style="color: #ccc; margin: 5px 0;">📍 الموقع: ' + prop.street + '</p>' : '') +
            (prop.description ? '<p style="color: #ccc; margin: 10px 0; padding: 10px; background: #1a1a1a; border-radius: 5px;">' + prop.description + '</p>' : '') +
        '</div>';
    
    modal.style.display = 'block';
}

// Close property modal
function closePropertyModal() {
    document.getElementById('propertyModal').style.display = 'none';
}

// Show image in lightbox
function showLightbox(imageUrl) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    img.src = imageUrl;
    modal.style.display = 'block';
}

// Close lightbox
function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    modal.style.display = 'none';
    const img = document.getElementById('lightboxImage');
    if (img) {
        img.style.display = 'block';
    }
    const video = document.getElementById('lightboxVideo');
    if (video) {
        video.style.display = 'none';
        video.pause();
    }
}

// Show video in modal
function showVideoModal(videoUrl) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    img.style.display = 'none';
    
    let video = document.getElementById('lightboxVideo');
    if (!video) {
        video = document.createElement('video');
        video.id = 'lightboxVideo';
        video.controls = true;
        video.style.cssText = 'max-width: 90%; max-height: 90%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 10px;';
        modal.appendChild(video);
    }
    video.src = videoUrl;
    video.style.display = 'block';
    modal.style.display = 'block';
}

// Load Properties
async function loadProperties() {
    try {
        const snapshot = await window.db.collection('properties')
            .orderBy('createdAt', 'desc')
            .get();
        
        allProperties = [];
        snapshot.forEach(doc => {
            allProperties.push({ id: doc.id, ...doc.data() });
        });
        
        displayProperties(allProperties);
    } catch (error) {
        console.error('Error loading properties:', error);
    }
}

// Display Properties
function displayProperties(properties) {
    const grid = document.getElementById('propertiesGrid');
    
    if (properties.length === 0) {
        grid.innerHTML = '<p class="loading">لا توجد عقارات متاحة حالياً</p>';
        return;
    }
    
    grid.innerHTML = properties.map(prop => {
        let priceText = '';
        if (prop.priceUSD && prop.priceUSD > 0) {
            priceText = prop.priceUSD.toLocaleString() + ' دولار';
        }
        if (prop.priceSYP && prop.priceSYP > 0) {
            if (priceText) priceText += ' | ';
            priceText += prop.priceSYP.toLocaleString() + ' ل.س';
        }
        
        // Build media sections side by side like Instagram - images and videos next to each other
        let imageHtml = '';
        const imageUrls = prop.imageUrls || [];
        const videoUrls = prop.videoUrls || [];
        
        // Build images grid
        if (imageUrls.length > 0) {
            if (imageUrls.length === 1) {
                imageHtml = '<div style="width: 100%; height: 100%;"><img src="' + imageUrls[0] + '" alt="' + prop.title + '" style="width: 100%; height: 100%; object-fit: cover;"></div>';
            } else if (imageUrls.length === 2) {
                imageHtml = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px; width: 100%; height: 100%;">' +
                    '<div><img src="' + imageUrls[0] + '" style="width: 100%; height: 100%; object-fit: cover;"></div>' +
                    '<div><img src="' + imageUrls[1] + '" style="width: 100%; height: 100%; object-fit: cover;"></div>' +
                    '</div>';
            } else if (imageUrls.length >= 3) {
                imageHtml = '<div style="display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; gap: 2px; width: 100%; height: 100%;">' +
                    '<div style="grid-row: 1 / 3;"><img src="' + imageUrls[0] + '" style="width: 100%; height: 100%; object-fit: cover;"></div>' +
                    '<div><img src="' + imageUrls[1] + '" style="width: 100%; height: 100%; object-fit: cover;"></div>' +
                    '<div style="position: relative;"><img src="' + imageUrls[2] + '" style="width: 100%; height: 100%; object-fit: cover;"></div>';
                if (imageUrls.length > 3) {
                    imageHtml += '<div style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 14px; font-weight: bold;">+' + (imageUrls.length - 3) + '</div>';
                }
                imageHtml += '</div>';
            }
        }
        
        // Build videos with play button in center - click opens modal
        let videoHtml = '';
        if (videoUrls.length > 0) {
            if (videoUrls.length === 1) {
                // Single video with play button overlay
                videoHtml = '<div style="width: 100%; height: 100%; position: relative; background: #000;">' +
                    '<div onclick="showVideoModal(\'' + videoUrls[0] + '\')" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">' +
                    '<div style="width: 0; height: 0; border-top: 15px solid transparent; border-bottom: 15px solid transparent; border-left: 25px solid #e74c3c; margin-left: 5px;"></div>' +
                    '</div>' +
                    '<video style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;"><source src="' + videoUrls[0] + '" type="video/mp4"></video></div>';
            } else if (videoUrls.length >= 2) {
                // Multiple videos grid with play button
                videoHtml = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px; width: 100%; height: 100%;">';
                videoUrls.slice(0, 4).forEach((vid, idx) => {
                    videoHtml += '<div style="position: relative; background: #000;">' +
                        '<div onclick="showVideoModal(\'' + vid + '\')" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;">' +
                        '<div style="width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 18px solid #e74c3c; margin-left: 3px;"></div>' +
                        '</div>' +
                        '<video style="width: 100%; height: 100%; object-fit: cover; opacity: 0.7;"><source src="' + vid + '" type="video/mp4"></video>';
                    if (idx === 3 && videoUrls.length > 4) {
                        videoHtml += '<div style="position: absolute; bottom: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 14px; font-weight: bold;">+' + (videoUrls.length - 4) + '</div>';
                    }
                    videoHtml += '</div>';
                });
                videoHtml += '</div>';
            }
        }
        
        // Combine both sections side by side
        let mediaHtml = '';
        if (imageHtml && videoHtml) {
            // Both images and videos - show side by side (like Instagram grid)
            const totalSections = 2;
            const imageWidth = '50%';
            const videoWidth = '50%';
            mediaHtml = '<div style="display: flex; width: 100%; height: 100%;">' +
                '<div style="width: ' + imageWidth + '; height: 100%;">' + imageHtml + '</div>' +
                '<div style="width: ' + videoWidth + '; height: 100%;">' + videoHtml + '</div>' +
                '</div>';
        } else if (imageHtml) {
            mediaHtml = imageHtml;
        } else if (videoHtml) {
            mediaHtml = videoHtml;
        }
        
        const imageUrl = imageUrls.length > 0 ? imageUrls[0] : '';
        
        // Make property clickable
        const propJson = JSON.stringify(prop).replace(/"/g, '&quot;').replace(/'/g, "&#39;");
        
        const status = prop.status || 'available';
        const statusText = status === 'available' ? 'متاح' : status === 'sold' ? 'تم البيع' : status === 'under_construction' ? 'قيد البناء' : status === 'reserved' ? 'محجوز' : 'متاح';
        const statusClass = status === 'available' ? 'status-available' : status === 'sold' ? 'status-sold' : status === 'under_construction' ? 'status-construction' : 'status-reserved';
        
        // Get ownership name
        const ownershipNames = { 'owned': 'ملك', 'rent': 'إيجار', 'commercial': 'تجاري' };
        const directionNames = { 'north': 'شمال', 'south': 'جنوب', 'east': 'شرق', 'west': 'غرب', 'northeast': 'شمال شرق', 'northwest': 'شمال غرب', 'southeast': 'جنوب شرق', 'southwest': 'جنوب غرب' };
        const ownershipText = prop.ownership ? (ownershipNames[prop.ownership] || prop.ownership) : '';
        const directionText = prop.direction ? (directionNames[prop.direction] || prop.direction) : '';
        
        // WhatsApp message with property details and image
        const imageLink = (prop.imageUrls && prop.imageUrls.length > 0) ? prop.imageUrls[0] : '';
        const videoLinks = prop.videoUrls || [];
        let videoLinkText = '';
        if (videoLinks.length > 0) {
            videoLinkText = '\n\n🎬 فيديوهات العقار:';
            videoLinks.forEach((vid, idx) => {
                videoLinkText += '\n' + (idx + 1) + ') ' + vid;
            });
        }
        const message = 'مرحباً، أرغب في الاستفسار عن العقار:\n' + prop.title + '\n' + (priceText ? 'السعر: ' + priceText : '') + (prop.area ? '\nالمساحة: ' + prop.area + ' م²' : '') + (prop.rooms ? '\nالغرف: ' + prop.rooms : '') + (prop.street ? '\nالموقع: ' + prop.street : '') + (ownershipText ? '\nالملكية: ' + ownershipText : '') + (directionText ? '\nالاتجاه: ' + directionText : '') + videoLinkText;
        const whatsappUrl = imageLink ? 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message) + '&media=' + encodeURIComponent(imageLink) : 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
        
        // Share button - send to WhatsApp with image
        const shareMessage = 'عقار للبيع: ' + prop.title + ' - ' + (priceText || '') + (prop.street ? ' - ' + prop.street : '') + videoLinkText;
        const shareUrl = imageLink ? 'https://wa.me/?text=' + encodeURIComponent(shareMessage) + '&media=' + encodeURIComponent(imageLink) : 'https://wa.me/?text=' + encodeURIComponent(shareMessage);
        
        return '<div class="property-card" onclick="showPropertyDetails(' + propJson + ')" style="cursor: pointer;">' +
            '<div class="property-image' + (mediaHtml ? '' : ' no-image') + '">' + mediaHtml + '</div>' +
            '<div class="property-info">' +
                '<div class="property-header-row">' +
                    '<span class="property-type">' + getTypeName(prop.type) + '</span>' +
                    '<span class="property-status-badge ' + statusClass + '">' + statusText + '</span>' +
                '</div>' +
                '<h3 class="property-title">' + prop.title + '</h3>' +
                '<p class="property-price">' + (priceText || 'السعر غير محدد') + '</p>' +
                '<div class="property-details">' +
                    (prop.area ? '<p><span class="detail-label">المساحة:</span> ' + prop.area + ' م²</p>' : '') +
                    (prop.rooms ? '<p><span class="detail-label">الغرف:</span> ' + prop.rooms + '</p>' : '') +
                    (prop.street ? '<p><span class="detail-label">الموقع:</span> ' + prop.street + '</p>' : '') +
                    (ownershipText ? '<p><span class="detail-label">الملكية:</span> ' + ownershipText + '</p>' : '') +
                    (directionText ? '<p><span class="detail-label">الاتجاه:</span> ' + directionText + '</p>' : '') +
                '</div>' +
                '<div class="action-buttons">' +
                    '<a href="' + whatsappUrl + '" target="_blank" class="whatsapp-btn" onclick="event.stopPropagation();">تواصل عبر واتساب</a>' +
                    '<a href="' + shareUrl + '" target="_blank" class="share-btn" onclick="event.stopPropagation();">مشاركة</a>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

// Load Offers
async function loadOffers() {
    try {
        const snapshot = await window.db.collection('offers')
            .orderBy('createdAt', 'desc')
            .get();
        
        allOffers = [];
        snapshot.forEach(doc => {
            allOffers.push({ id: doc.id, ...doc.data() });
        });
        
        displayOffers(allOffers);
    } catch (error) {
        console.error('Error loading offers:', error);
    }
}

// Display Offers
function displayOffers(offers) {
    const grid = document.getElementById('offersGrid');
    
    if (offers.length === 0) {
        grid.innerHTML = '<p class="loading">لا توجد عروض خاصة حالياً</p>';
        return;
    }
    
    grid.innerHTML = offers.map(offer => {
        let priceText = '';
        if (offer.priceUSD && offer.priceUSD > 0) {
            priceText = offer.priceUSD.toLocaleString() + ' دولار';
        }
        if (offer.priceSYP && offer.priceSYP > 0) {
            if (priceText) priceText += ' | ';
            priceText += offer.priceSYP.toLocaleString() + ' ل.س';
        }
        
        let oldPriceText = '';
        if (offer.oldPriceUSD && offer.oldPriceUSD > 0) {
            oldPriceText = offer.oldPriceUSD.toLocaleString() + ' دولار';
        }
        if (offer.oldPriceSYP && offer.oldPriceSYP > 0) {
            if (oldPriceText) oldPriceText += ' | ';
            oldPriceText += offer.oldPriceSYP.toLocaleString() + ' ل.س';
        }
        
        // Show image if available
        let imageHtml = '';
        if (offer.imageUrls && offer.imageUrls.length > 0) {
            imageHtml = '<img src="' + offer.imageUrls[0] + '" alt="' + offer.title + '" style="width: 100%; height: 100%; object-fit: cover;">';
        }
        // No fallback icon - leave empty if no image
        
        const offerJson = JSON.stringify(offer).replace(/"/g, '&quot;').replace(/'/g, "&#39;");
        
        return '<div class="property-card offer-card" onclick="showOfferDetails(' + offerJson + ')" style="cursor: pointer;">' +
            '<div class="property-image' + (offer.imageUrls && offer.imageUrls.length > 0 ? '' : ' no-image') + '">' + imageHtml + '</div>' +
            '<div class="property-info">' +
                '<span class="offer-tag">⭐ عرض خاص</span>' +
                '<h3 class="property-title">' + offer.title + '</h3>' +
                '<p class="property-price">' + (priceText || 'السعر غير محدد') + '</p>' +
                (oldPriceText ? '<p class="old-price">قبل: ' + oldPriceText + '</p>' : '') +
                '<p>' + offer.description + '</p>' +
            '</div>' +
        '</div>';
    }).join('');
}

// Show offer details in modal
function showOfferDetails(offer) {
    const modal = document.getElementById('propertyModal');
    const content = document.getElementById('propertyModalContent');
    
    let priceText = '';
    if (offer.priceUSD && offer.priceUSD > 0) {
        priceText = offer.priceUSD.toLocaleString() + ' دولار';
    }
    if (offer.priceSYP && offer.priceSYP > 0) {
        if (priceText) priceText += ' | ';
        priceText += offer.priceSYP.toLocaleString() + ' ل.س';
    }
    
    let oldPriceText = '';
    if (offer.oldPriceUSD && offer.oldPriceUSD > 0) {
        oldPriceText = offer.oldPriceUSD.toLocaleString() + ' دولار';
    }
    if (offer.oldPriceSYP && offer.oldPriceSYP > 0) {
        if (oldPriceText) oldPriceText += ' | ';
        oldPriceText += offer.oldPriceSYP.toLocaleString() + ' ل.س';
    }
    
    // Build images gallery
    let imagesHtml = '';
    if (offer.imageUrls && offer.imageUrls.length > 0) {
        if (offer.imageUrls.length === 1) {
            imagesHtml = '<img src="' + offer.imageUrls[0] + '" alt="' + offer.title + '" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 10px; cursor: pointer;" onclick="showLightbox(\'' + offer.imageUrls[0] + '\')">';
        } else {
            imagesHtml = '<div style="display: grid; grid-template-columns: repeat(' + Math.min(offer.imageUrls.length, 3) + ', 1fr); gap: 10px;">';
            offer.imageUrls.forEach(img => {
                imagesHtml += '<img src="' + img + '" alt="' + offer.title + '" style="width: 100%; height: 150px; object-fit: cover; border-radius: 10px; cursor: pointer;" onclick="showLightbox(\'' + img + '\')">';
            });
            imagesHtml += '</div>';
        }
    } else {
        imagesHtml = '<div style="font-size: 100px; text-align: center; padding: 50px;">🎯</div>';
    }
    
    content.innerHTML = 
        '<div style="color: #888; margin-bottom: 20px;">' +
            '<span style="background: #444; color: #fff; padding: 5px 15px; border-radius: 4px; font-size: 14px;">⭐ عرض خاص</span>' +
        '</div>' +
        '<h2 style="color: #fff; margin: 10px 0;">' + offer.title + '</h2>' +
        '<p style="color: #fff; font-size: 28px; font-weight: bold; margin: 10px 0;">' + (priceText || 'السعر غير محدد') + '</p>' +
        (oldPriceText ? '<p style="color: #666; font-size: 18px; text-decoration: line-through; margin: 5px 0;">قبل: ' + oldPriceText + '</p>' : '') +
        imagesHtml +
        '<div style="margin-top: 20px; padding: 15px; background: #0d0d0d; border-radius: 8px;">' +
            '<h3 style="color: #888; margin: 10px 0;">التفاصيل:</h3>' +
            '<p style="color: #ccc; margin: 10px 0; padding: 10px; background: #1a1a1a; border-radius: 5px;">' + offer.description + '</p>' +
        '</div>';
    
    modal.style.display = 'block';
}

// Filter Properties
function filterProperties() {
    const typeFilter = document.getElementById('filterType').value;
    const priceFilter = document.getElementById('filterPrice').value;
    
    let filtered = [...allProperties];
    
    if (typeFilter) {
        filtered = filtered.filter(p => p.type === typeFilter);
    }
    
    if (priceFilter) {
        const [min, max] = priceFilter.split('-');
        filtered = filtered.filter(p => {
            const price = p.priceUSD || 0;
            if (max) {
                return price >= parseInt(min) && price <= parseInt(max);
            }
            return price >= parseInt(min);
        });
    }
    
    displayProperties(filtered);
}

// Load Properties for Admin
async function loadPropertiesForAdmin() {
    try {
        const snapshot = await window.db.collection('properties')
            .orderBy('createdAt', 'desc')
            .get();
        
        const list = document.getElementById('propertiesList');
        
        if (snapshot.empty) {
            list.innerHTML = '<p>لا توجد عقارات</p>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const prop = doc.data();
            let priceText = '';
            if (prop.priceUSD) priceText += prop.priceUSD + ' دولار';
            if (prop.priceSYP) priceText += (priceText ? ' | ' : '') + prop.priceSYP + ' ل.س';
            
            const status = prop.status || 'available';
            const statusText = status === 'available' ? 'متاح' : status === 'sold' ? 'تم البيع' : status === 'under_construction' ? 'قيد البناء' : status === 'reserved' ? 'محجوز' : 'متاح';
            const statusClass = status === 'available' ? 'status-available' : status === 'sold' ? 'status-sold' : status === 'under_construction' ? 'status-construction' : 'status-reserved';
            
            html += '<div class="admin-property-card">' +
                '<div class="admin-property-info">' +
                    '<h4>' + prop.title + '</h4>' +
                    '<p class="admin-property-type">' + getTypeName(prop.type) + '</p>' +
                    '<p class="admin-property-price">' + priceText + '</p>' +
                    '<p class="admin-property-location">' + (prop.street || 'غير محدد') + '</p>' +
                    '<span class="admin-property-status ' + statusClass + '">' + statusText + '</span>' +
                '</div>' +
                '<div class="admin-property-actions">' +
                    '<select onchange="updatePropertyStatus(\'' + doc.id + '\', this.value)" class="status-select">' +
                        '<option value="available" ' + (status === 'available' ? 'selected' : '') + '>متاح</option>' +
                        '<option value="sold" ' + (status === 'sold' ? 'selected' : '') + '>تم البيع</option>' +
                        '<option value="under_construction" ' + (status === 'under_construction' ? 'selected' : '') + '>قيد البناء</option>' +
                        '<option value="reserved" ' + (status === 'reserved' ? 'selected' : '') + '>محجوز</option>' +
                    '</select>' +
                    '<button class="edit-btn" onclick="editProperty(\'' + doc.id + '\')">تعديل</button>' +
                    '<button class="delete-btn" onclick="deleteProperty(\'' + doc.id + '\')">حذف</button>' +
                '</div>' +
            '</div>';
        });
        
        list.innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Load Offers for Admin
async function loadOffersForAdmin() {
    try {
        const snapshot = await window.db.collection('offers')
            .orderBy('createdAt', 'desc')
            .get();
        
        const list = document.getElementById('offersList');
        
        if (snapshot.empty) {
            list.innerHTML = '<p>لا توجد عروض</p>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const offer = doc.data();
            html += '<div class="request-card">' +
                '<h4>🎯 ' + offer.title + '</h4>' +
                '<p>' + offer.price + ' JD' + (offer.oldPrice ? ' - قبل: ' + offer.oldPrice + ' JD' : '') + '</p>' +
                '<button class="delete-btn" onclick="deleteOffer(\'' + doc.id + '\')">🗑️ حذف</button>' +
            '</div>';
        });
        
        list.innerHTML = html;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Delete Property
async function deleteProperty(id) {
    if (confirm('هل أنت متأكد من حذف هذا العقار؟')) {
        try {
            await window.db.collection('properties').doc(id).delete();
            showNotification('تم حذف العقار بنجاح!', 'success');
            loadProperties();
            loadPropertiesForAdmin();
        } catch (error) {
            console.error('Error deleting property:', error);
            showNotification('حدث خطأ في حذف العقار', 'error');
        }
    }
}

// Update Property Status
async function updatePropertyStatus(id, status) {
    try {
        await window.db.collection('properties').doc(id).update({
            status: status
        });
        showNotification('تم تحديث الحالة بنجاح', 'success');
        loadProperties();
        loadPropertiesForAdmin();
    } catch (error) {
        showNotification('حدث خطأ في التحديث', 'error');
    }
}

// Edit Property - fill the form with property data
function editProperty(id) {
    window.db.collection('properties').doc(id).get().then(doc => {
        if (!doc.exists) {
            showNotification('العقار غير موجود', 'error');
            return;
        }
        
        const prop = doc.data();
        
        // Fill form fields
        document.getElementById('propertyTitle').value = prop.title || '';
        document.getElementById('propertyType').value = prop.type || 'apartment';
        document.getElementById('propertyStatus').value = prop.status || 'available';
        document.getElementById('propertyPriceUSD').value = prop.priceUSD || '';
        document.getElementById('propertyPriceSYP').value = prop.priceSYP || '';
        document.getElementById('propertyArea').value = prop.area || '';
        document.getElementById('propertyRooms').value = prop.rooms || '';
        document.getElementById('propertyStreet').value = prop.street || '';
        document.getElementById('propertyDesc').value = prop.description || '';
        document.getElementById('propertyOwnership').value = prop.ownership || '';
        document.getElementById('propertyDirection').value = prop.direction || '';
        
        // Show existing images with delete option
        const imagePreview = document.getElementById('propertyPreview');
        imagePreview.innerHTML = '';
        if (prop.imageUrls && prop.imageUrls.length > 0) {
            prop.imageUrls.forEach((imgUrl, idx) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'preview-image-container';
                imgContainer.style.position = 'relative';
                imgContainer.style.display = 'inline-block';
                imgContainer.style.margin = '5px';
                
                const img = document.createElement('img');
                img.src = imgUrl;
                img.style.width = '100px';
                img.style.height = '100px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                
                // Delete button for existing image
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '✕';
                deleteBtn.style.cssText = 'position: absolute; top: -5px; right: -5px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px;';
                deleteBtn.onclick = function() {
                    if (confirm('هل تريد حذف هذه الصورة؟')) {
                        // Remove from array and update
                        prop.imageUrls.splice(idx, 1);
                        window.db.collection('properties').doc(id).update({ imageUrls: prop.imageUrls });
                        imgContainer.remove();
                        showNotification('تم حذف الصورة', 'success');
                    }
                };
                
                imgContainer.appendChild(deleteBtn);
                imgContainer.appendChild(img);
                imagePreview.appendChild(imgContainer);
            });
        }
        
        // Show existing videos with delete option
        const videoPreview = document.getElementById('propertyVideoPreview');
        videoPreview.innerHTML = '';
        if (prop.videoUrls && prop.videoUrls.length > 0) {
            prop.videoUrls.forEach((vidUrl, idx) => {
                const videoContainer = document.createElement('div');
                videoContainer.className = 'preview-video-container';
                videoContainer.style.marginBottom = '15px';
                videoContainer.style.position = 'relative';
                
                const video = document.createElement('video');
                video.src = vidUrl;
                video.controls = true;
                video.preload = 'metadata';
                video.style.width = '100%';
                video.style.maxHeight = '200px';
                video.style.borderRadius = '10px';
                
                const fileName = document.createElement('p');
                fileName.textContent = '🎬 فيديو ' + (idx + 1);
                fileName.style.color = '#aaa';
                fileName.style.fontSize = '12px';
                fileName.style.marginTop = '5px';
                
                // Delete button for existing video - uses event.stopPropagation to prevent form submission
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '✕';
                deleteBtn.type = 'button';
                deleteBtn.style.cssText = 'position: absolute; top: 5px; right: 5px; background: #e74c3c; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 12px; z-index: 10;';
                deleteBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('هل تريد حذف هذا الفيديو؟')) {
                        prop.videoUrls.splice(idx, 1);
                        window.db.collection('properties').doc(id).update({ videoUrls: prop.videoUrls });
                        videoContainer.remove();
                        showNotification('تم حذف الفيديو', 'success');
                    }
                };
                
                videoContainer.appendChild(deleteBtn);
                videoContainer.appendChild(video);
                videoContainer.appendChild(fileName);
                videoPreview.appendChild(videoContainer);
            });
        }
        
        // Store the property ID for update
        document.getElementById('propertyForm').dataset.editId = id;
        
        // Change button text
        const submitBtn = document.querySelector('#propertyForm button[type="submit"]');
        submitBtn.textContent = 'تحديث العقار';
        submitBtn.dataset.editMode = 'true';
        
        // Show the add property tab
        showAdminTab('addProperty');
        
        showNotification('تم تحميل بيانات العقار للتعديل', 'success');
    }).catch(error => {
        console.error('Error loading property:', error);
        showNotification('حدث خطأ في تحميل البيانات', 'error');
    });
}

// Delete Offer
async function deleteOffer(id) {
    if (confirm('هل أنت متأكد من حذف هذا العرض؟')) {
        try {
            await window.db.collection('offers').doc(id).delete();
            showNotification('تم حذف العرض بنجاح!', 'success');
            loadOffers();
            loadOffersForAdmin();
        } catch (error) {
            console.error('Error deleting offer:', error);
            showNotification('حدث خطأ في حذف العرض', 'error');
        }
    }
}

// Load Requests
async function loadRequests() {
    try {
        const snapshot = await window.db.collection('requests')
            .orderBy('createdAt', 'desc')
            .get();
        
        const list = document.getElementById('requestsList');
        
        if (snapshot.empty) {
            list.innerHTML = '<p>لا توجد طلبات</p>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const req = doc.data();
            html += '<div class="request-card">' +
                '<h4>👤 ' + req.name + '</h4>' +
                '<p>📱 ' + req.phone + '</p>' +
                '<p>🏠 ' + getTypeName(req.propertyType) + '</p>' +
                '<p>💰 الميزانية: ' + req.budget + '</p>' +
                '<p>💬 ' + req.message + '</p>' +
                '<button class="delete-btn" onclick="deleteRequest(\'' + doc.id + '\')">🗑️ حذف</button>' +
            '</div>';
        });
        
        list.innerHTML = html;
    } catch (error) {
        console.error('Error loading requests:', error);
    }
}

// Delete Request
async function deleteRequest(id) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        try {
            await window.db.collection('requests').doc(id).delete();
            showNotification('تم حذف الطلب بنجاح!', 'success');
            loadRequests();
        } catch (error) {
            console.error('Error deleting request:', error);
            showNotification('حدث خطأ في حذف الطلب', 'error');
        }
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    
    const propertyModal = document.getElementById('propertyModal');
    if (event.target === propertyModal) {
        propertyModal.style.display = 'none';
    }
    
    const lightboxModal = document.getElementById('lightboxModal');
    if (event.target === lightboxModal) {
        lightboxModal.style.display = 'none';
    }
};
