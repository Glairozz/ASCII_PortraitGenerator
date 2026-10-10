// ASCII Portrait Studio - High-Quality ASCII Art Generator

class ASCIIStudio {
    constructor() {
        // Character sets ordered from dense to sparse
        this.charSets = {
            minimal: '@%#*+=-:. ',
            standard: '@%#*o+=-:. ',
            detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`\'. '
        };
        
        this.currentImage = null;
        this.currentImageDataUrl = null;
        this.renderTimer = null;
        this.isRendering = false;
        this.zoom = 1;
        
        // Default settings
        this.settings = {
            charSet: 'standard',
            customChars: '',
            width: 100,
            fontSize: 6,
            brightness: 0,
            contrast: 100,
            gamma: 1.0,
            invert: false,
            colorMode: 'monochrome',
            preset: 'classic'
        };
        
        this.init();
    }
    
    init() {
        // Landing page elements
        this.landingPage = document.getElementById('landingPage');
        this.studioSection = document.getElementById('studioSection');
        this.navStartBtn = document.getElementById('navStartBtn');
        this.heroStartBtn = document.getElementById('heroStartBtn');
        this.ctaStartBtn = document.getElementById('ctaStartBtn');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        // Studio elements
        this.studioBackBtn = document.getElementById('studioBackBtn');
        this.uploadArea = document.getElementById('uploadArea');
        this.imageInput = document.getElementById('imageInput');
        this.replaceImageBtn = document.getElementById('replaceImageBtn');
        this.imageInfo = document.getElementById('imageInfo');
        this.fileNameEl = document.getElementById('fileName');
        this.fileSizeEl = document.getElementById('fileSize');
        this.imgDimensionsEl = document.getElementById('imgDimensions');
        
        // Controls
        this.presetSelect = document.getElementById('presetSelect');
        this.charSetSelect = document.getElementById('charSetSelect');
        this.customCharInput = document.getElementById('customCharInput');
        this.widthSlider = document.getElementById('widthSlider');
        this.widthValue = document.getElementById('widthValue');
        this.fontSizeSlider = document.getElementById('fontSizeSlider');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.brightnessSlider = document.getElementById('brightnessSlider');
        this.brightnessValue = document.getElementById('brightnessValue');
        this.contrastSlider = document.getElementById('contrastSlider');
        this.contrastValue = document.getElementById('contrastValue');
        this.gammaSlider = document.getElementById('gammaSlider');
        this.gammaValue = document.getElementById('gammaValue');
        this.colorModeSelect = document.getElementById('colorModeSelect');
        this.invertCheckbox = document.getElementById('invertCheckbox');
        
        // Preview elements
        this.previewTabs = document.querySelectorAll('.preview-tab');
        this.asciiView = document.getElementById('asciiView');
        this.comparisonViewEl = document.getElementById('comparisonView');
        this.asciiResult = document.getElementById('asciiResult');
        this.emptyState = document.getElementById('emptyState');
        this.fitToScreenBtn = document.getElementById('fitToScreenBtn');
        this.zoomInBtn = document.getElementById('zoomInBtn');
        this.zoomOutBtn = document.getElementById('zoomOutBtn');
        this.zoomLevelEl = document.getElementById('zoomLevel');
        this.comparisonCanvas = document.getElementById('comparisonCanvas');
        this.comparisonSlider = document.getElementById('comparisonSlider');
        this.statusText = document.getElementById('statusText');
        this.outputInfo = document.getElementById('outputInfo');
        
        // Action buttons
        this.resetBtn = document.getElementById('resetBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadMenuBtn = document.getElementById('downloadMenuBtn');
        this.exportDropdown = document.getElementById('exportDropdown');
        
        // Canvas for processing
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Comparison state
        this.comparisonCtx = this.comparisonCanvas.getContext('2d');
        this.isDraggingSlider = false;
        this.sliderPos = 50;
        
        this.setupEventListeners();
        this.setupExampleCards();
    }
    
    setupEventListeners() {
        // Landing page
        this.navStartBtn.addEventListener('click', () => this.showStudio());
        this.heroStartBtn.addEventListener('click', () => this.showStudio());
        this.ctaStartBtn.addEventListener('click', () => this.showStudio());
        
        this.studioBackBtn.addEventListener('click', () => this.showLanding());
        
        // Upload
        this.uploadArea.addEventListener('click', () => this.imageInput.click());
        this.replaceImageBtn.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.processUploadedFile(file);
            }
        });
        
        // Controls
        this.presetSelect.addEventListener('change', (e) => {
            this.settings.preset = e.target.value;
            this.applyPreset(e.target.value);
            this.debouncedRender();
        });
        
        this.charSetSelect.addEventListener('change', (e) => {
            this.settings.charSet = e.target.value;
            this.customCharInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
            this.debouncedRender();
        });
        
        this.customCharInput.addEventListener('input', (e) => {
            this.settings.customChars = e.target.value;
            this.debouncedRender();
        });
        
        this.widthSlider.addEventListener('input', (e) => {
            this.settings.width = parseInt(e.target.value);
            this.widthValue.textContent = e.target.value;
            this.debouncedRender();
        });
        
        this.fontSizeSlider.addEventListener('input', (e) => {
            this.settings.fontSize = parseFloat(e.target.value);
            this.fontSizeValue.textContent = e.target.value;
            this.updateFontSize();
        });
        
        this.brightnessSlider.addEventListener('input', (e) => {
            this.settings.brightness = parseInt(e.target.value);
            this.brightnessValue.textContent = e.target.value;
            this.debouncedRender();
        });
        
        this.contrastSlider.addEventListener('input', (e) => {
            this.settings.contrast = parseInt(e.target.value);
            this.contrastValue.textContent = e.target.value;
            this.debouncedRender();
        });
        
        this.gammaSlider.addEventListener('input', (e) => {
            this.settings.gamma = parseFloat(e.target.value);
            this.gammaValue.textContent = e.target.value;
            this.debouncedRender();
        });
        
        this.colorModeSelect.addEventListener('change', (e) => {
            this.settings.colorMode = e.target.value;
            this.debouncedRender();
        });
        
        this.invertCheckbox.addEventListener('change', (e) => {
            this.settings.invert = e.target.checked;
            this.debouncedRender();
        });
        
        // Preview tabs
        this.previewTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.previewTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const view = tab.dataset.view;
                document.getElementById('asciiView').classList.toggle('active', view === 'ascii');
                document.getElementById('comparisonView').classList.toggle('active', view === 'comparison');
                if (view === 'comparison' && this.currentImage) {
                    this.drawComparison();
                }
            });
        });
        
        // Zoom controls
        this.fitToScreenBtn.addEventListener('click', () => {
            this.zoom = 1;
            this.updateZoomDisplay();
            this.asciiResult.style.transform = `scale(${this.zoom})`;
        });
        this.zoomInBtn.addEventListener('click', () => {
            this.zoom = Math.min(this.zoom * 1.25, 5);
            this.updateZoomDisplay();
            this.asciiResult.style.transform = `scale(${this.zoom})`;
        });
        this.zoomOutBtn.addEventListener('click', () => {
            this.zoom = Math.max(this.zoom * 0.8, 0.1);
            this.updateZoomDisplay();
            this.asciiResult.style.transform = `scale(${this.zoom})`;
        });
        
        // Actions
        this.resetBtn.addEventListener('click', () => this.resetSettings());
        this.copyBtn.addEventListener('click', () => this.copyASCII());
        this.downloadMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.exportDropdown.style.display = this.exportDropdown.style.display === 'block' ? 'none' : 'block';
            const rect = e.target.getBoundingClientRect();
            this.exportDropdown.style.left = rect.left + 'px';
            this.exportDropdown.style.top = (rect.bottom + 5) + 'px';
        });
        
        // Export items
        document.querySelectorAll('.export-item').forEach(item => {
            item.addEventListener('click', () => {
                this.exportDropdown.style.display = 'none';
                const type = item.dataset.export;
                this.exportASCII(type);
            });
        });
        
        // Click outside to close dropdown
        document.addEventListener('click', () => {
            this.exportDropdown.style.display = 'none';
        });
        
        // Comparison slider
        this.comparisonSlider.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDraggingSlider = true;
        });
        document.addEventListener('mousemove', (e) => {
            if (!this.isDraggingSlider) return;
            const rect = this.comparisonCanvas.getBoundingClientRect();
            this.sliderPos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            this.comparisonSlider.style.left = this.sliderPos + '%';
            this.drawComparison();
        });
        document.addEventListener('mouseup', () => {
            this.isDraggingSlider = false;
        });
        
        // Touch support for comparison
        this.comparisonSlider.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isDraggingSlider = true;
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (!this.isDraggingSlider) return;
            e.preventDefault();
            const rect = this.comparisonCanvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.sliderPos = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
            this.comparisonSlider.style.left = this.sliderPos + '%';
            this.drawComparison();
        }, { passive: false });
        document.addEventListener('touchend', () => {
            this.isDraggingSlider = false;
        });
    }
    
    setupExampleCards() {
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', () => {
                const preset = card.dataset.preset;
                this.showStudio();
                setTimeout(() => {
                    this.presetSelect.value = preset;
                    this.settings.preset = preset;
                    this.applyPreset(preset);
                    this.debouncedRender();
                }, 100);
            });
        });
    }
    
    showStudio() {
        this.landingPage.style.display = 'none';
        this.studioSection.style.display = 'block';
        window.scrollTo(0, 0);
    }
    
    showLanding() {
        this.studioSection.style.display = 'none';
        this.landingPage.style.display = 'block';
        window.scrollTo(0, 0);
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.processUploadedFile(file);
        }
    }
    
    processUploadedFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            this.currentImageDataUrl = event.target.result;
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.updateImageInfo(file, img);
                this.showImageInPreview();
                this.debouncedRender();
                this.showToast('Image uploaded successfully', 'success');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    updateImageInfo(file, img) {
        this.imageInfo.style.display = 'block';
        this.fileNameEl.textContent = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;
        this.fileSizeEl.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        this.imgDimensionsEl.textContent = img.naturalWidth + ' × ' + img.naturalHeight;
    }
    
    showImageInPreview() {
        this.emptyState.style.display = 'none';
        this.asciiResult.style.display = 'block';
    }
    
    applyPreset(preset) {
        switch(preset) {
            case 'classic':
                this.settings.charSet = 'standard';
                this.settings.width = 100;
                this.settings.brightness = 0;
                this.settings.contrast = 100;
                this.settings.gamma = 1.0;
                this.settings.invert = false;
                this.settings.colorMode = 'monochrome';
                break;
            case 'high-contrast':
                this.settings.charSet = 'standard';
                this.settings.width = 120;
                this.settings.brightness = 10;
                this.settings.contrast = 150;
                this.settings.gamma = 0.8;
                this.settings.invert = false;
                this.settings.colorMode = 'monochrome';
                break;
            case 'fine-detail':
                this.settings.charSet = 'detailed';
                this.settings.width = 160;
                this.settings.brightness = 0;
                this.settings.contrast = 110;
                this.settings.gamma = 1.0;
                this.settings.invert = false;
                this.settings.colorMode = 'monochrome';
                break;
            case 'minimal':
                this.settings.charSet = 'minimal';
                this.settings.width = 80;
                this.settings.brightness = -5;
                this.settings.contrast = 130;
                this.settings.gamma = 1.0;
                this.settings.invert = false;
                this.settings.colorMode = 'monochrome';
                break;
            case 'terminal-green':
                this.settings.charSet = 'standard';
                this.settings.width = 100;
                this.settings.brightness = 0;
                this.settings.contrast = 120;
                this.settings.gamma = 1.0;
                this.settings.invert = false;
                this.settings.colorMode = 'terminal-green';
                break;
            case 'amber-terminal':
                this.settings.charSet = 'standard';
                this.settings.width = 100;
                this.settings.brightness = 5;
                this.settings.contrast = 120;
                this.settings.gamma = 1.0;
                this.settings.invert = false;
                this.settings.colorMode = 'terminal-amber';
                break;
            case 'cyberpunk':
                this.settings.charSet = 'detailed';
                this.settings.width = 120;
                this.settings.brightness = 10;
                this.settings.contrast = 140;
                this.settings.gamma = 0.9;
                this.settings.invert = false;
                this.settings.colorMode = 'cyberpunk';
                break;
            case 'inverted':
                this.settings.charSet = 'standard';
                this.settings.width = 100;
                this.settings.brightness = 0;
                this.settings.contrast = 100;
                this.settings.gamma = 1.0;
                this.settings.invert = true;
                this.settings.colorMode = 'monochrome';
                break;
        }
        
        // Update UI
        this.charSetSelect.value = this.settings.charSet;
        this.customCharInput.style.display = this.settings.charSet === 'custom' ? 'block' : 'none';
        this.widthSlider.value = this.settings.width;
        this.widthValue.textContent = this.settings.width;
        this.brightnessSlider.value = this.settings.brightness;
        this.brightnessValue.textContent = this.settings.brightness;
        this.contrastSlider.value = this.settings.contrast;
        this.contrastValue.textContent = this.settings.contrast;
        this.gammaSlider.value = this.settings.gamma;
        this.gammaValue.textContent = this.settings.gamma;
        this.colorModeSelect.value = this.settings.colorMode;
        this.invertCheckbox.checked = this.settings.invert;
    }
    
    resetSettings() {
        this.presetSelect.value = 'classic';
        this.settings.preset = 'classic';
        this.applyPreset('classic');
        this.debouncedRender();
        this.showToast('Settings reset to defaults', 'info');
    }
    
    debouncedRender() {
        if (!this.currentImage) return;
        if (this.renderTimer) {
            clearTimeout(this.renderTimer);
        }
        this.setStatus('Rendering...', 'loading');
        this.renderTimer = setTimeout(() => {
            this.renderASCII();
        }, 150);
    }
    
    renderASCII() {
        if (!this.currentImage) return;
        this.isRendering = true;
        
        const charSet = this.getCurrentCharSet();
        const width = Math.max(10, Math.min(200, this.settings.width));
        
        // Calculate height maintaining aspect ratio
        const aspectRatio = this.currentImage.naturalWidth / this.currentImage.naturalHeight;
        const charAspect = 0.55; // Approximate character aspect ratio
        const height = Math.max(5, Math.floor((width / aspectRatio) * charAspect));
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Apply filters
        const brightness = 100 + this.settings.brightness;
        const contrast = this.settings.contrast;
        const gamma = this.settings.gamma;
        
        this.ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        this.ctx.drawImage(this.currentImage, 0, 0, width, height);
        
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        
        let ascii = '';
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const offset = (y * width + x) * 4;
                let r = pixels[offset];
                let g = pixels[offset + 1];
                let b = pixels[offset + 2];
                
                // Apply gamma correction
                if (gamma !== 1.0) {
                    r = Math.pow(r / 255, 1 / gamma) * 255;
                    g = Math.pow(g / 255, 1 / gamma) * 255;
                    b = Math.pow(b / 255, 1 / gamma) * 255;
                }
                
                // Calculate luminance (perceptual)
                let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
                
                if (this.settings.invert) {
                    luminance = 1 - luminance;
                }
                
                // Clamp
                luminance = Math.max(0, Math.min(1, luminance));
                
                // Map to character
                const charIndex = Math.floor(luminance * (charSet.length - 1));
                ascii += charSet[charIndex];
            }
            ascii += '\n';
        }
        
        this.asciiResult.textContent = ascii;
        this.updateFontSize();
        this.updateOutputInfo(width, height, charSet.length);
        this.setStatus('Ready', 'ready');
        
        // Draw comparison if tab is active
        if (document.getElementById('comparisonView').classList.contains('active')) {
            this.drawComparison();
        }
        
        this.isRendering = false;
    }
    
    getCurrentCharSet() {
        if (this.settings.charSet === 'custom') {
            return this.settings.customChars || ' .:-=+*#%@';
        }
        return this.charSets[this.settings.charSet] || this.charSets.standard;
    }
    
    updateFontSize() {
        this.asciiResult.style.fontSize = this.settings.fontSize + 'px';
        this.asciiResult.style.lineHeight = (this.settings.fontSize * 0.9) + 'px';
    }
    
    updateOutputInfo(width, height, charCount) {
        this.outputInfo.textContent = `${width}×${height} chars • ${charCount} char set • ${this.settings.colorMode}`;
    }
    
    updateZoomDisplay() {
        this.zoomLevelEl.textContent = Math.round(this.zoom * 100) + '%';
    }
    
    drawComparison() {
        if (!this.currentImage) return;
        
        // Set canvas size
        const container = document.querySelector('.comparison-container');
        const rect = container.getBoundingClientRect();
        const maxWidth = rect.width - 40;
        const maxHeight = 500;
        
        const aspectRatio = this.currentImage.naturalWidth / this.currentImage.naturalHeight;
        let canvasWidth = maxWidth;
        let canvasHeight = maxWidth / aspectRatio;
        
        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = maxHeight * aspectRatio;
        }
        
        this.comparisonCanvas.width = canvasWidth;
        this.comparisonCanvas.height = canvasHeight;
        this.comparisonCanvas.style.width = canvasWidth + 'px';
        this.comparisonCanvas.style.height = canvasHeight + 'px';
        
        // Draw original
        this.comparisonCtx.drawImage(this.currentImage, 0, 0, canvasWidth, canvasHeight);
        
        // Draw split line effect would require more complex rendering
        // For now, just draw original
        this.comparisonCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.comparisonCtx.drawImage(this.currentImage, 0, 0, canvasWidth, canvasHeight);
    }
    
    setStatus(text, type) {
        this.statusText.textContent = text;
        this.statusText.className = 'status-text status-' + type;
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    copyASCII() {
        const text = this.asciiResult.textContent;
        if (!text || text.trim() === '') {
            this.showToast('Nothing to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('ASCII copied to clipboard', 'success');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('ASCII copied to clipboard', 'success');
        });
    }
    
    exportASCII(type) {
        const text = this.asciiResult.textContent;
        if (!text || text.trim() === '') {
            this.showToast('Nothing to export', 'error');
            return;
        }
        
        if (type === 'txt') {
            this.exportTXT(text);
        } else if (type === 'png') {
            this.exportPNG(text);
        } else if (type === 'svg') {
            this.exportSVG(text);
        }
    }
    
    exportTXT(text) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ascii-portrait-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('TXT exported', 'success');
    }
    
    exportPNG(text) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const fontSize = this.settings.fontSize * 2; // Higher resolution
        ctx.font = fontSize + 'px "JetBrains Mono", "Courier New", monospace';
        
        const lines = text.split('\n');
        const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
        const lineHeight = fontSize * 0.9;
        const padding = 20;
        
        canvas.width = maxWidth + padding * 2;
        canvas.height = lines.length * lineHeight + padding * 2;
        
        // Set background
        ctx.fillStyle = this.getBackgroundColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text color
        ctx.fillStyle = this.getTextColor();
        ctx.font = fontSize + 'px "JetBrains Mono", "Courier New", monospace';
        ctx.textBaseline = 'top';
        
        lines.forEach((line, i) => {
            ctx.fillText(line, padding, padding + i * lineHeight);
        });
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ascii-portrait-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.showToast('PNG exported', 'success');
        });
    }
    
    exportSVG(text) {
        const lines = text.split('\n').filter(l => l !== '');
        const fontSize = this.settings.fontSize;
        const lineHeight = fontSize * 0.9;
        const padding = 10;
        
        const escapeXml = (str) => {
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        };
        
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="${lines.length * lineHeight + padding * 2}" viewBox="0 0 600 ${lines.length * lineHeight + padding * 2}">
  <rect width="100%" height="100%" fill="${this.getBackgroundColorHex()}"/>
  <text font-family="JetBrains Mono, monospace" font-size="${fontSize}" fill="${this.getTextColorHex()}" xml:space="preserve">`;
        
        lines.forEach((line, i) => {
            svg += `<tspan x="${padding}" y="${padding + i * lineHeight}">${escapeXml(line)}</tspan>`;
        });
        
        svg += `</text>
</svg>`;
        
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ascii-portrait-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('SVG exported', 'success');
    }
    
    getBackgroundColor() {
        if (this.settings.colorMode === 'terminal-green') return '#000000';
        if (this.settings.colorMode === 'terminal-amber') return '#000000';
        if (this.settings.colorMode === 'cyberpunk') return '#0a0a0f';
        return '#09090D';
    }
    
    getBackgroundColorHex() {
        if (this.settings.colorMode === 'terminal-green') return '#000000';
        if (this.settings.colorMode === 'terminal-amber') return '#000000';
        if (this.settings.colorMode === 'cyberpunk') return '#0a0a0f';
        return '#09090D';
    }
    
    getTextColor() {
        if (this.settings.colorMode === 'terminal-green') return '#00ff00';
        if (this.settings.colorMode === 'terminal-amber') return '#ffbf00';
        if (this.settings.colorMode === 'cyberpunk') return '#22D3EE';
        return '#F4F4F7';
    }
    
    getTextColorHex() {
        if (this.settings.colorMode === 'terminal-green') return '#00ff00';
        if (this.settings.colorMode === 'terminal-amber') return '#ffbf00';
        if (this.settings.colorMode === 'cyberpunk') return '#22D3EE';
        return '#F4F4F7';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ASCIIStudio();
});
