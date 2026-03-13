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
        this.widthSlider = document.getElementById('width');
        this.invertCheckbox = document.getElementById('invertColors');
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
        this.widthSlider.addEventListener('input', (e) => {
            document.getElementById('widthValue').textContent = e.target.value;
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
        if (!this.previewImg.src || this.previewImg.style.display === 'none') {
            this.asciiResult.innerHTML = '<div class="error">Please upload an image first.</div>';
            return;
        }
        
        this.asciiResult.innerHTML = '<div class="loading">Generating ASCII art...</div>';
        
        setTimeout(() => {
            try {
                const img = this.previewImg;
                const width = parseInt(this.widthSlider.value);
                const height = Math.floor((img.naturalHeight / img.naturalWidth) * width * 0.55);
                const invert = this.invertCheckbox.checked;
                
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
                        
                        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        const adjustedBrightness = invert ? 1 - brightness : brightness;
                        
                        const charIndex = Math.floor(adjustedBrightness * (this.asciiChars.length - 1));
                        ascii += this.asciiChars[invert ? this.asciiChars.length - 1 - charIndex : charIndex];
                    }
                    ascii += '\n';
                }
                
                this.asciiResult.textContent = ascii;
                this.asciiResult.style.fontSize = this.fontSizeSlider.value + 'px';
                this.downloadBtn.style.display = 'inline-block';
                
            } catch (error) {
                this.asciiResult.innerHTML = '<div class="error">Error generating ASCII art. Please try again.</div>';
                console.error('ASCII Generation Error:', error);
            }
        }, 50);
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