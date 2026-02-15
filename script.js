class ASCIIGenerator {
    constructor() {
        this.asciiChars = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'.  ';
        this.init();
        this.loadDefaultImage();
    }

    init() {
        this.landingPage = document.getElementById('landingPage');
        this.generatorSection = document.getElementById('generatorSection');
        this.startBtn = document.getElementById('startBtn');
        this.backBtn = document.getElementById('backBtn');
        
        this.imageInput = document.getElementById('imageInput');
        this.brightnessSlider = document.getElementById('brightness');
        this.contrastSlider = document.getElementById('contrast');
        this.fontSizeSlider = document.getElementById('fontSize');
        this.generateBtn = document.getElementById('generateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.previewImg = document.getElementById('previewImg');
        this.asciiResult = document.getElementById('asciiResult');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.showGenerator());
        this.backBtn.addEventListener('click', () => this.showLanding());
        
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.brightnessSlider.addEventListener('input', (e) => {
            document.getElementById('brightnessValue').textContent = e.target.value;
        });
        this.contrastSlider.addEventListener('input', (e) => {
            document.getElementById('contrastValue').textContent = e.target.value;
        });
        this.fontSizeSlider.addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = e.target.value;
            this.asciiResult.style.fontSize = e.target.value + 'px';
        });
        this.generateBtn.addEventListener('click', () => this.generateASCII());
        this.downloadBtn.addEventListener('click', () => this.downloadASCII());
    }

    showGenerator() {
        this.landingPage.style.display = 'none';
        this.generatorSection.style.display = 'block';
        this.loadDefaultImage();
    }

    showLanding() {
        this.generatorSection.style.display = 'none';
        this.landingPage.style.display = 'flex';
    }

    loadDefaultImage() {
        this.previewImg.src = 'me.jpg';
        this.previewImg.style.display = 'block';
        this.previewImg.style.maxWidth = '280px';
        this.previewImg.style.maxHeight = '280px';
        document.getElementById('defaultPreview').style.display = 'none';
        this.previewImg.onload = () => {
            this.generateBtn.disabled = false;
        };
        this.previewImg.onerror = () => {
            document.getElementById('defaultPreview').style.display = 'block';
            this.previewImg.style.display = 'none';
        };
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.previewImg.src = event.target.result;
                this.previewImg.style.display = 'block';
                this.previewImg.style.maxWidth = '280px';
                this.previewImg.style.maxHeight = '280px';
                document.getElementById('defaultPreview').style.display = 'none';
                this.generateBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    }

    generateASCII() {
        this.asciiResult.innerHTML = '<div class="loading">Generating ASCII art...</div>';
        
        setTimeout(() => {
            try {
                const img = this.previewImg;
                const width = 300;
                const height = Math.floor((img.naturalHeight / img.naturalWidth) * width * 0.35);
                
                this.canvas.width = width;
                this.canvas.height = height;
                
                this.ctx.filter = `brightness(${100 + parseInt(this.brightnessSlider.value)}%) contrast(${this.contrastSlider.value}%)`;
                this.ctx.drawImage(img, 0, 0, width, height);
                
                const imageData = this.ctx.getImageData(0, 0, width, height);
                const pixels = imageData.data;
                
                let ascii = '';
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const offset = (y * width + x) * 4;
                        const r = pixels[offset];
                        const g = pixels[offset + 1];
                        const b = pixels[offset + 2];
                        
                        // Calculate brightness with weighted grayscale for better detail
                        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        
                        // Apply contrast enhancement and sharpening
                        let adjustedBrightness = brightness;
                        
                        // Apply local contrast enhancement
                        const surroundingPixels = this.getSurroundingBrightness(pixels, x, y, width, height);
                        const localContrast = brightness - surroundingPixels;
                        adjustedBrightness = brightness + localContrast * 0.3;
                        
                        // Apply gamma correction
                        adjustedBrightness = Math.pow(Math.max(0, Math.min(1, adjustedBrightness)), 0.6);
                        
                        // Anti-aliasing with sub-pixel precision
                        const preciseIndex = adjustedBrightness * (this.asciiChars.length - 1);
                        const charIndex = Math.floor(preciseIndex);
                        const fractional = preciseIndex - charIndex;
                        
                        // Add dithering for smoother gradients
                        if (fractional > 0.5 && Math.random() > (1 - fractional)) {
                            ascii += this.asciiChars[Math.min(this.asciiChars.length - 1, this.asciiChars.length - 1 - charIndex - 1)];
                        } else {
                            ascii += this.asciiChars[this.asciiChars.length - 1 - charIndex];
                        }
                    }
                    ascii += '\n';
                }
                
                this.asciiResult.textContent = ascii;
                this.asciiResult.style.fontSize = this.fontSizeSlider.value + 'px';
                this.downloadBtn.style.display = 'inline-block';
                
            } catch (error) {
                this.asciiResult.innerHTML = '<div class="error">Error generating ASCII art. Please try again.</div>';
            }
        }, 100);
    }

    getSurroundingBrightness(pixels, x, y, width, height) {
        let totalBrightness = 0;
        let count = 0;
        
        // Sample surrounding pixels for edge detection
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const offset = (ny * width + nx) * 4;
                    const r = pixels[offset];
                    const g = pixels[offset + 1];
                    const b = pixels[offset + 2];
                    totalBrightness += (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                    count++;
                }
            }
        }
        
        return count > 0 ? totalBrightness / count : 0;
    }

    downloadASCII() {
        const text = this.asciiResult.textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-portrait.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the ASCII generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ASCIIGenerator();
});