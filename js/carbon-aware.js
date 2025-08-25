// Carbon Aware Website Integration
class CarbonAwareManager {
    constructor() {
        this.currentLevel = null;
        this.currentZone = null;
        this.images = [];
        this.comments = [];
        this.init();
    }

    init() {
        this.captureImages();
        this.captureComments();

        this.createOverlay();

        if (typeof caw !== 'undefined') {
            caw.render({
                target: "carbon-aware-widget",
                callback: (zone, level) => this.handleCarbonLevel(zone, level),
                showBadge: false
            });
        }
    }

    captureImages() {
        this.images = Array.from(document.querySelectorAll('img'));

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newImages = node.querySelectorAll ? node.querySelectorAll('img') : [];
                        newImages.forEach(img => {
                            if (!this.images.includes(img)) {
                                this.images.push(img);
                                this.applyImagePolicy(img);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    captureComments() {
        this.comments = Array.from(document.querySelectorAll('#disqus_thread, .comments, .comment, .disqus_thread, [id*="comment"], [class*="comment"]'));

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node itself is a comment element
                        if (node.id === 'disqus_thread' || node.classList.contains('comments') || node.classList.contains('comment') || node.classList.contains('disqus_thread')) {
                            if (!this.comments.includes(node)) {
                                this.comments.push(node);
                                this.applyCommentPolicy(node);
                            }
                        }

                        const newComments = node.querySelectorAll ? node.querySelectorAll('#disqus_thread, .comments, .comment, .disqus_thread, [id*="comment"], [class*="comment"]') : [];
                        newComments.forEach(comment => {
                            if (!this.comments.includes(comment)) {
                                this.comments.push(comment);
                                this.applyCommentPolicy(comment);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    handleCarbonLevel(zone, level) {
        console.log(`Carbon intensity zone: ${zone}, level: ${level}`);

        this.currentZone = zone;
        this.currentLevel = level;

        this.updateOverlayIndicator(zone, level);

        this.updateBackgroundColor(level);

        this.applyImagePolicyToAll();

        this.applyCommentPolicyToAll();

        this.applyContentStyling(level);

        this.resetOverlayStyling();
    }

    updateBackgroundColor(level) {
        const colors = {
            'high': '#ffffff',                  // Keep white for high (black and white mode)
            'moderate': '#ffffff',                // Keep white for medium
            'low': '#F9F7F1'                    // Light beige
        };

        document.body.style.backgroundColor = colors[level] || '#ffffff';
    }

    applyImagePolicyToAll() {
        this.images.forEach(img => this.applyImagePolicy(img));
    }

    applyCommentPolicyToAll() {
        this.comments.forEach(comment => this.applyCommentPolicy(comment));
    }

    applyImagePolicy(img) {
        if (!this.currentLevel) return;

        if (img.closest('#carbon-aware-overlay') || img.classList.contains('carbon-overlay-image')) {
            return;
        }

        switch (this.currentLevel) {
            case 'high':
                img.style.display = 'none';
                img.setAttribute('data-carbon-hidden', 'true');
                break;

            case 'moderate':
                img.style.display = 'block';
                img.style.filter = 'grayscale(100%)';
                img.removeAttribute('data-carbon-hidden');

                if (img.naturalWidth && img.naturalHeight) {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.naturalWidth * 0.5;
                    canvas.height = img.naturalHeight * 0.5;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const reducedQualityUrl = canvas.toDataURL('image/jpeg', 0.5);
                    img.src = reducedQualityUrl;
                }
                break;

            case 'high':
                img.style.display = 'none';
                img.setAttribute('data-carbon-hidden', 'true');
                break;

            case 'low':
                img.style.display = 'block';
                img.style.filter = 'none';
                img.removeAttribute('data-carbon-hidden');
                break;
        }
    }

        applyCommentPolicy(comment) {
        if (!this.currentLevel) return;

        switch (this.currentLevel) {
            case 'high':
                comment.style.display = 'none';
                comment.setAttribute('data-carbon-hidden', 'true');

                const hiddenIframes = comment.querySelectorAll('iframe');
                hiddenIframes.forEach(iframe => {
                    iframe.style.display = 'none';
                });
                break;

            case 'moderate':
            case 'low':
                comment.style.display = 'block';
                comment.removeAttribute('data-carbon-hidden');

                const visibleIframes = comment.querySelectorAll('iframe');
                visibleIframes.forEach(iframe => {
                    iframe.style.display = '';
                });
                break;
        }
    }

                applyContentStyling(level) {
        const contentElements = document.querySelectorAll('body *:not(img):not(.comments):not(.comment):not(.disqus_thread)');

        contentElements.forEach(element => {
            if (level === 'moderate' || level === 'high') {
                element.style.filter = 'grayscale(100%)';
            } else {
                element.style.filter = '';
            }
        });
    }

    resetOverlayStyling() {
        const overlay = document.getElementById('carbon-aware-overlay');
        if (overlay) {
            overlay.style.filter = '';

            const overlayElements = overlay.querySelectorAll('*');
            overlayElements.forEach(element => {
                element.style.filter = '';
            });
        }
    }



    createOverlay() {
        const masthead = document.querySelector('.wrapper-masthead');
        if (!masthead) {
            console.warn('Could not find .wrapper-masthead container, retrying...');
            setTimeout(() => this.createOverlay(), 100);
            return;
        }

        if (document.getElementById('carbon-aware-overlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'carbon-aware-overlay';
        overlay.innerHTML = `
            <div class="carbon-indicator">
                <div class="location-info">
                    <img src="/resources/location-dot.svg" class="location-icon carbon-overlay-image" alt="Location">
                    <span class="location-value" id="carbon-location">Detecting...</span>
                </div>
                <div class="intensity-info">
                    <span class="intensity-dot" id="intensity-dot"></span>
                    <span class="intensity-text" id="carbon-intensity">Detecting...</span>
                </div>
            </div>
            <div class="carbon-toggle">
                <span class="toggle-label">GRID-AWARE MODE</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="carbon-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .wrapper-masthead {
                position: relative;
            }

            #carbon-aware-widget {
                display: none !important;
            }

            #carbon-aware-overlay {
                position: absolute;
                top: 0;
                left: 0;
                transform: translateY(25%);
                background: transparent;
                padding: 15px;
                color: white;
                font-family: Montserrat, sans-serif;
                font-weight: 300;
                font-size: 8px;
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .carbon-indicator {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .location-info, .intensity-info {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .location-icon, .intensity-dot {
                flex-shrink: 0;
            }

            .location-icon {
                width: 16px;
                height: 16px;
                filter: brightness(0) invert(1);
            }

            .location-value {
                font-weight: 400;
                font-size: 13px;
                line-height: 1;
            }

            .intensity-dot {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background-color: #ccc;
            }

            .intensity-text {
                font-weight: 400;
                font-size: 12px;
                max-width: 200px;
                line-height: 1;
            }

            .carbon-toggle {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .toggle-label {
                font-weight: 400;
                font-size: 12px;
                white-space: nowrap;
            }

            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }

            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 8px;
            }

            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .toggle-slider {
                background-color: #6D9AAE;
            }

            input:checked + .toggle-slider:before {
                transform: translateX(26px);
            }

            .intensity-low {
                color: #6D9AAE;
            }

            .intensity-medium {
                color: #F17E93;
            }

            .intensity-high {
                color: #dc183c;
            }

            .dot-low {
                background-color: #6D9AAE !important;
            }

            .dot-medium {
                background-color: #F17E93 !important;
            }

            .dot-high {
                background-color: #F44336 !important;
            }
        `;

        document.head.appendChild(style);
        masthead.appendChild(overlay);

        const toggle = document.getElementById('carbon-toggle');
        toggle.addEventListener('change', (e) => {
            this.setCarbonAwareMode(e.target.checked);
        });

        this.overlay = overlay;
    }

        updateOverlayIndicator(zone, level) {
        const locationElement = document.getElementById('carbon-location');
        const intensityElement = document.getElementById('carbon-intensity');
        const intensityDot = document.getElementById('intensity-dot');

        if (locationElement) {
            locationElement.textContent = zone || 'Unknown';
        }

        if (intensityElement) {
            let intensityText = 'Detecting...';
            // Levels are defined here https://portal.electricitymaps.com/developer-hub/api/reference#latest-carbon-intensity-level
            if (level) {
                switch (level) {
                    case 'low':
                        intensityText = 'LOW EMISSIONS';
                        break;
                    case 'moderate':
                        intensityText = 'AVERAGE EMISSIONS';
                        break;
                    case 'high':
                        intensityText = 'HIGH EMISSIONS';
                        break;
                    default:
                        intensityText = 'UNKNOWN';
                }
            }
            intensityElement.textContent = intensityText;
            intensityElement.className = 'intensity-text';

            if (level) {
                intensityElement.classList.add(`intensity-${level}`);
            }
        }

        if (intensityDot) {
            intensityDot.className = 'intensity-dot';
            if (level) {
                intensityDot.classList.add(`dot-${level}`);
            }
        }
    }

    setCarbonAwareMode(enabled) {
        if (enabled) {
            if (this.currentLevel) {
                this.handleCarbonLevel(this.currentZone, this.currentLevel);
            }
        } else {
            document.body.style.backgroundColor = '';
            this.images.forEach(img => {
                img.style.display = '';
                img.style.filter = '';
                img.removeAttribute('data-carbon-hidden');
            });
            this.comments.forEach(comment => {
                comment.style.display = '';
                comment.removeAttribute('data-carbon-hidden');
                const iframes = comment.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    iframe.style.display = '';
                });
            });

            const contentElements = document.querySelectorAll('body *:not(img):not(.comments):not(.comment):not(.disqus_thread)');
            contentElements.forEach(element => {
                element.style.filter = '';
            });
        }
    }

    setCarbonLevel(level) {
        this.handleCarbonLevel('test-zone', level);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.carbonAwareManager = new CarbonAwareManager();
});

if (document.readyState === 'loading') {
} else {
    window.carbonAwareManager = new CarbonAwareManager();
}