# ASCII Portrait Generator

Transform your photos into stunning ASCII art using keyboard characters. This ultra-detailed converter creates black and white portraits with exceptional precision and artistic quality.

## Features

- 🎨 **70+ Character Mapping** - Advanced grayscale representation using the full character spectrum
- ⚡ **Ultra-High Detail** - 300+ character width for exceptional detail preservation
- 🎯 **Real-time Preview** - Instant conversion with adjustable parameters
- 💾 **Download Ready** - Export your ASCII art as text files
- 🌙 **Black & White Theme** - Clean, minimalist monochrome design
- 📱 **Fully Responsive** - Works perfectly on all devices

## How It Works

1. Upload any image or use the default `me.jpg`
2. Adjust brightness, contrast, and font size settings
3. Click "Generate ASCII" to create your portrait
4. Download the result as a text file

## Technical Details

### Character Mapping
The generator uses a sophisticated 70+ character gradient:
```
$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`'. 
```

### Image Processing
- **Weighted Grayscale**: 0.299R + 0.587G + 0.114B for accurate luminance
- **Local Contrast Enhancement**: Edge detection for sharper details
- **Gamma Correction**: 0.6 gamma for enhanced contrast
- **Dithering System**: Smooth gradient transitions
- **Anti-aliasing**: Sub-pixel precision for smooth character transitions

### Resolution
- **Width**: 300 characters (2.5x standard detail)
- **Height**: Auto-calculated maintaining aspect ratio
- **Line Height**: 0.6 for tight character packing
- **Letter Spacing**: 0.02em for maximum density

## Usage

### Online
1. Open `index.html` in your web browser
2. Click "Start Generating" on the landing page
3. Upload an image or use the default
4. Adjust settings as needed
5. Generate and download your ASCII art

### Local Development
```bash
# Clone the repository
git clone https://github.com/Glairozz/ASCII_PortraitGenerator.git

# Navigate to the project
cd ASCII_PortraitGenerator

# Open index.html in your browser
```

## Browser Compatibility
- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge

## File Structure
```
ASCII_PortraitGenerator/
├── index.html          # Main application
├── style.css          # Black and white styling
├── script.js          # ASCII conversion logic
├── me.jpg             # Default portrait image
└── README.md          # This file
```

## Customization

### Adjust Character Set
Edit the `asciiChars` array in `script.js` to customize the character mapping:
```javascript
this.asciiChars = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`'. ';
```

### Modify Resolution
Change the width parameter in the generate function:
```javascript
const width = 300; // Increase for more detail, decrease for faster processing
```

### Theme Customization
All styling is in `style.css` with a black and white color scheme:
- Background: `#000` (black)
- Text: `#fff` (white)
- Accents: `#666`, `#333` (gray tones)

## Performance Tips
- Larger images take longer to process
- Reduce width for faster conversion
- Use smaller images for quick previews
- High detail works best with portraits and faces

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is open source and available under the MIT License.

## Examples

### Before
Upload any portrait image

### After
Get detailed ASCII art like:
```
$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'.
```

---

Created with ❤️ for ASCII art enthusiasts and digital artists.