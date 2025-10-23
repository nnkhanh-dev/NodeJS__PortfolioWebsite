/**
 * Blog Table of Contents Generator
 * Tự động tạo mục lục từ các thẻ h2 và h3 trong nội dung blog
 */

document.addEventListener('DOMContentLoaded', function() {
    const blogContent = document.querySelector('.blog-content');
    const tocContainer = document.getElementById('table-of-contents');
    
    if (!blogContent || !tocContainer) {
        return;
    }

    // Lấy tất cả các heading h2 và h3
    const headings = blogContent.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
        tocContainer.style.display = 'none';
        return;
    }

    // Tạo cấu trúc mục lục
    let tocHTML = '<ul class="toc-list">';
    let currentH2Index = 0;
    
    headings.forEach((heading, index) => {
        const headingText = heading.textContent.trim();
        const headingId = `heading-${index}`;
        
        // Thêm ID cho heading nếu chưa có
        if (!heading.id) {
            heading.id = headingId;
        }
        
        // Tạo slug từ text
        const slug = headingText
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        heading.id = slug || headingId;
        
        // Loại bỏ chỉ số La Mã ở đầu (I., II., III., IV., ...)
        const cleanText = headingText.replace(/^[IVX]+\.\s*/i, '').trim();
        
        if (heading.tagName === 'H2') {
            // Đóng ul của h3 trước đó nếu có
            if (currentH2Index > 0) {
                tocHTML += '</ul></li>';
            }
            
            tocHTML += `
                <li class="toc-item toc-h2">
                    <a href="#${heading.id}" class="toc-link toc-link-h2">
                        <span class="toc-number">${++currentH2Index}</span>
                        <span class="toc-text">${cleanText}</span>
                    </a>
                    <ul class="toc-sublist">
            `;
        } else if (heading.tagName === 'H3') {
            tocHTML += `
                <li class="toc-item toc-h3">
                    <a href="#${heading.id}" class="toc-link toc-link-h3">
                        <span class="toc-bullet">•</span>
                        <span class="toc-text">${cleanText}</span>
                    </a>
                </li>
            `;
        }
    });
    
    // Đóng các tag còn lại
    if (currentH2Index > 0) {
        tocHTML += '</ul></li>';
    }
    tocHTML += '</ul>';
    
    // Thêm vào container (không có toggle button)
    tocContainer.innerHTML = `
        <div class="toc-header">
            <svg class="toc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <h3 class="toc-title">Mục lục</h3>
        </div>
        <div class="toc-content">
            ${tocHTML}
        </div>
    `;
    
    // Thêm smooth scroll khi click
    const tocLinks = tocContainer.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offset = 100; // Offset từ top
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
