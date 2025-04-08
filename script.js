// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const cards = document.querySelectorAll('.card');
    const modalPrice = document.getElementById('modal-price');

    const starButtons = document.querySelectorAll('.icon-star-regular, .icon-star');
    const likeButtons = document.querySelectorAll('.icon-thumbs-up');
    const dislikeButtons = document.querySelectorAll('.icon-thumbs-down');
    
    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        cards.forEach(card => {
            const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
            if (searchTerm === '' || cardTitle.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update category counts after filtering
        updateCategoryCounts();
    });
    
    // Star/Favorite toggle functionality
    document.querySelectorAll('.action-button').forEach(button => {
        if (button.querySelector('.icon-star-regular') || button.querySelector('.icon-star')) {
            button.addEventListener('click', function() {
                const starIcon = this.querySelector('.icon-star-regular, .icon-star');
                const countSpan = this.querySelector('span + span') || this.appendChild(document.createElement('span'));
                
                let currentCount = parseInt(this.textContent.trim()) || 0;
                
                if (starIcon.classList.contains('icon-star-regular')) {
                    starIcon.classList.remove('icon-star-regular');
                    starIcon.classList.add('icon-star');
                    starIcon.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath fill='%23ffc107' d='M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z'/%3E%3C/svg%3E\")";
                    currentCount += 1;
                } else {
                    starIcon.classList.remove('icon-star');
                    starIcon.classList.add('icon-star-regular');
                    starIcon.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath fill='%23666' d='M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z'/%3E%3C/svg%3E\")";
                    currentCount = Math.max(0, currentCount - 1);
                }
                
                // Update the count text
                this.textContent = '';
                this.appendChild(starIcon);
                const textNode = document.createTextNode(' ' + currentCount);
                this.appendChild(textNode);
                
                // Add to favorites (could be stored in localStorage)
                saveUserInteraction('favorites', this.closest('.card').querySelector('.card-title').textContent, 
                    starIcon.classList.contains('icon-star'));
            });
        }
    });
    
    // Like functionality
    document.querySelectorAll('.action-button').forEach(button => {
        if (button.querySelector('.icon-thumbs-up')) {
            button.addEventListener('click', function() {
                const likeIcon = this.querySelector('.icon-thumbs-up');
                let currentCount = parseInt(this.textContent.trim()) || 0;
                currentCount += 1;
                
                // Update the count text
                this.textContent = '';
                this.appendChild(likeIcon);
                const textNode = document.createTextNode(' ' + currentCount);
                this.appendChild(textNode);
                
                // Highlight the button temporarily
                this.style.color = '#5375b5';
                setTimeout(() => {
                    this.style.color = '#666';
                }, 300);
                
                // Save the interaction
                saveUserInteraction('likes', this.closest('.card').querySelector('.card-title').textContent, true);
            });
        }
    });
    
    // Dislike functionality
    document.querySelectorAll('.action-button').forEach(button => {
        if (button.querySelector('.icon-thumbs-down')) {
            button.addEventListener('click', function() {
                const dislikeIcon = this.querySelector('.icon-thumbs-down');
                let currentCount = parseInt(this.textContent.trim()) || 0;
                currentCount += 1;
                
                // Update the count text
                this.textContent = '';
                this.appendChild(dislikeIcon);
                const textNode = document.createTextNode(' ' + currentCount);
                this.appendChild(textNode);
                
                // Highlight the button temporarily
                this.style.color = '#5375b5';
                setTimeout(() => {
                    this.style.color = '#666';
                }, 300);
                
                // Save the interaction
                saveUserInteraction('dislikes', this.closest('.card').querySelector('.card-title').textContent, true);
            });
        }
    });
    
    // Card click to view report
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on action buttons
            if (e.target.closest('.action-button') || e.target.closest('.actions-container')) {
                return;
            }
            
            const cardTitle = this.querySelector('.card-title').textContent;
            console.log(`Opening report: ${cardTitle}`);
            
            // Increment view count
            const viewCounter = this.querySelector('.icon-eye').nextSibling;
            let viewCount = parseInt(viewCounter.textContent.trim());
            viewCount++;
            viewCounter.textContent = ' ' + viewCount;
            
            // Here you would typically redirect to the report page
            // window.location.href = `/report/${cardTitle.replace(/\d+\.\s+/, '').trim()}`;
            
            // For demo purposes, simulate a click
            animateCardClick(this);
            
            // Save the view
            saveUserInteraction('views', cardTitle, true);
        });
    });
    
    // Function to animate card click
    function animateCardClick(card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'translateY(-5px)';
        }, 150);
    }
    
    // Function to update category counts based on visible cards
    function updateCategoryCounts() {
        const categories = document.querySelectorAll('.category-section');
        
        categories.forEach(category => {
            const visibleCards = category.querySelectorAll('.card[style="display: block;"], .card:not([style*="display"])').length;
            category.querySelector('.category-count').textContent = visibleCards;
            
            // Hide empty categories
            if (visibleCards === 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
            }
        });
    }
    
    // Function to save user interactions to localStorage
    function saveUserInteraction(type, itemName, value) {
        const storageKey = `kpih_marketplace_${type}`;
        let data = JSON.parse(localStorage.getItem(storageKey) || '{}');
        
        data[itemName] = value;
        localStorage.setItem(storageKey, JSON.stringify(data));
    }
    
    // Function to load user interactions from localStorage
    function loadUserInteractions() {
        const favorites = JSON.parse(localStorage.getItem('kpih_marketplace_favorites') || '{}');
        const likes = JSON.parse(localStorage.getItem('kpih_marketplace_likes') || '{}');
        const dislikes = JSON.parse(localStorage.getItem('kpih_marketplace_dislikes') || '{}');
        const views = JSON.parse(localStorage.getItem('kpih_marketplace_views') || '{}');
        
        // Apply favorites
        cards.forEach(card => {
            const cardTitle = card.querySelector('.card-title').textContent;
            if (favorites[cardTitle]) {
                const starButton = card.querySelector('.icon-star-regular');
                if (starButton) {
                    starButton.classList.remove('icon-star-regular');
                    starButton.classList.add('icon-star');
                    starButton.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath fill='%23ffc107' d='M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z'/%3E%3C/svg%3E\")";
                }
            }
        });
    }
    
    // Initialize user interactions from localStorage
    loadUserInteractions();
    
    // Add sort functionality to actions
    document.querySelectorAll('.action-icon').forEach((icon, index) => {
        icon.addEventListener('click', function() {
            if (index === 0) { // First icon - sort by date
                sortCards('date');
            } else if (index === 1) { // Second icon - sort by popularity
                sortCards('popularity');
            }
        });
    });
    
    // Function to sort cards
    function sortCards(sortBy) {
        const cardSections = document.querySelectorAll('.category-section');
        
        cardSections.forEach(section => {
            const cardGrid = section.querySelector('.card-grid');
            const cards = Array.from(cardGrid.querySelectorAll('.card'));
            
            if (sortBy === 'date') {
                cards.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.date-display').textContent.trim());
                    const dateB = new Date(b.querySelector('.date-display').textContent.trim());
                    return dateB - dateA; // Newest first
                });
            } else if (sortBy === 'popularity') {
                cards.sort((a, b) => {
                    const viewsA = parseInt(a.querySelector('.icon-eye + span')?.textContent || '0');
                    const viewsB = parseInt(b.querySelector('.icon-eye + span')?.textContent || '0');
                    return viewsB - viewsA; // Most viewed first
                });
            }
            
            // Re-append cards in the new order
            cards.forEach(card => cardGrid.appendChild(card));
        });
    }
    
    // Add hover effect for action buttons
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.color = '#5375b5';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.color = '#666';
        });
    });
    
    // User icon dropdown menu
    const userIcon = document.querySelector('.icon-user');
    const body = document.querySelector('body');
    
    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.top = '60px';
    dropdown.style.right = '20px';
    dropdown.style.backgroundColor = '#fff';
    dropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    dropdown.style.borderRadius = '4px';
    dropdown.style.padding = '10px 0';
    dropdown.style.display = 'none';
    dropdown.style.zIndex = '100';
    
    // Add dropdown items
    const dropdownItems = [
        { text: 'My Profile', icon: 'user' },
        { text: 'My Reports', icon: 'bookmark' },
        { text: 'Settings', icon: 'cog' },
        { text: 'Logout', icon: 'sign-out' }
    ];
    
    dropdownItems.forEach(item => {
        const dropdownItem = document.createElement('div');
        dropdownItem.className = 'dropdown-item';
        dropdownItem.style.padding = '8px 15px';
        dropdownItem.style.cursor = 'pointer';
        dropdownItem.style.display = 'flex';
        dropdownItem.style.alignItems = 'center';
        
        dropdownItem.innerHTML = `
            <span style="margin-right: 10px; width: 16px; height: 16px; display: inline-block;"></span>
            ${item.text}
        `;
        
        dropdownItem.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f5f5f7';
        });
        
        dropdownItem.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        dropdown.appendChild(dropdownItem);
    });
    
    body.appendChild(dropdown);
    
    // Toggle dropdown on user icon click
    userIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        if (dropdown.style.display === 'none') {
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        dropdown.style.display = 'none';
    });
});

// Popup Elements
const modal = document.getElementById('popupModal');
const closeModalBtn = document.querySelector('.close-button');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalViews = document.getElementById('modal-views');
const purchaseBtn = document.getElementById('purchase-btn');

// Function to show modal
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

function showModal(card) {
    const imageSrc = card.querySelector('.card-image')?.src || '';
    const title = card.querySelector('.card-title')?.textContent || '';
    const date = card.querySelector('.meta-left .meta-text')?.textContent.trim() || 'N/A';
    const views = card.querySelector('.icon-eye + .meta-text')?.textContent.trim() || '0';
    const price = parseInt(card.dataset.price || "0");
    const discountPrice = card.dataset.discountPrice ? parseInt(card.dataset.discountPrice) : null;

    const modal = document.getElementById('popupModal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalViews = document.getElementById('modal-views');
    const modalPrice = document.getElementById('modal-price');
    const purchaseBtn = document.getElementById('purchase-btn');

    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modalDate.textContent = `Ngày tạo: ${date}`;
    modalViews.textContent = `Lượt xem: ${views}`;

    if (discountPrice && discountPrice < price) {
        modalPrice.innerHTML = `<span class="original-price">${formatPrice(price)}</span> 
                                <span class="discount-price">${formatPrice(discountPrice)}</span>`;
        purchaseBtn.textContent = `Mua ngay với ${formatPrice(discountPrice)}`;
    } else {
        modalPrice.innerHTML = `<span class="discount-price">${formatPrice(price)}</span>`;
        purchaseBtn.textContent = `Mua ngay với ${formatPrice(price)}`;
    }

    modal.style.display = 'flex';

    purchaseBtn.onclick = function () {
        alert(`Bạn đã chọn mua báo cáo "${title}" với giá ${formatPrice(discountPrice || price)}`);
    };
}

// Gán sự kiện khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Gán click cho toàn bộ card
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.classList.contains('buy-now-text') || e.target.closest('.action-button') || e.target.closest('.actions-container')) return;
            showModal(this);
        });
    });

    // Gán click cho "Mua ngay" trong overlay
    document.querySelectorAll('.buy-now-text').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation(); // tránh trigger card click
            const card = this.closest('.card');
            showModal(card);
        });
    });

    // Đóng popup
    document.querySelector('.close-button').addEventListener('click', () => {
        document.getElementById('popupModal').style.display = 'none';
    });

    // Click outside modal content để đóng
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('popupModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
