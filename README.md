# How Old Is Me? 🎂

A modern, elegant age calculator web app with detailed time breakdowns, astrological information, historical events, and life statistics.

![How Old Is Me Screenshot](screenshot.png)

## 🌟 Features

### Core Functionality
- **Basic Age Calculation**: Precise age in years, months, and days
- **Detailed Time Units**: Age in multiple formats (months, weeks, days, hours, minutes, seconds)
- **Visual Representations**: Charts and progress bars showing age statistics
- **Dark/Light Mode**: Elegant UI that adapts to your preference

### Specialized Information
- **Astrological Details**: 
  - Zodiac sign with personality traits
  - Birth day of the week
  - Days until next birthday
  - Moon phase at birth
- **Historical Context**: 
  - Events from your birth year
  - Famous people who share your birthday
- **Life Statistics**:
  - Life expectancy visualization
  - Sleeping hours calculation
  - Heartbeats and breaths estimation
  - Interactive life timeline
- **Fun Facts**: Entertaining facts about your age

### User Experience
- **Profile Management**: Save and load multiple birth dates
- **Share Functionality**: Share your age results with others
- **Print Capability**: Generate printable age reports
- **Beautiful UI**: Glass morphism design with smooth animations
- **Fully Responsive**: Works perfectly on all devices
- **Accessible**: Designed with accessibility in mind

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with:
  - CSS Variables
  - Flexbox
  - Glass morphism effects
  - Responsive design
  - Dark/Light theme
  - Custom animations
- **Vanilla JavaScript** - Pure JS with no frameworks
- **Chart.js** - For data visualization
- **Font Awesome** - For icons
- **Google Fonts (Inter)** - For typography

## 📂 Project Structure

```
how-old-is-me/
├── assets/
│   ├── css/
│   │   ├── styles.css         # Main styles
│   │   ├── form-styles.css    # Form-specific styles
│   │   ├── result-styles.css  # Result display styles
│   │   └── scrollbar.css      # Custom scrollbar styles
│   ├── js/
│   │   ├── script.js          # Core functionality
│   │   ├── life-stats-enhancer.js # Life statistics calculations
│   │   ├── fun-facts.js       # Fun facts generator
│   │   ├── tab-animations.js  # Tab switching animations
│   │   └── result-animations.js # Results display animations
│   └── images/
│       └── ...                # App images
├── favicon.ico                # App favicon
├── index.html                 # Main HTML file
└── README.md                  # Documentation
```

## 🧠 How It Works

1. **Input**: User enters their birthdate, name (optional), and region
2. **Calculation**: App processes the data to calculate age in various formats
3. **Visualization**: Results are displayed in an organized, tabbed interface
4. **Interaction**: Users can switch between different views, save profiles, share results

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/how-old-is-me.git
cd how-old-is-me
```

2. Open `index.html` in your browser or use a local development server:
```bash
# If you have Python installed
python -m http.server

# If you have Node.js installed
npx serve
```

3. The app should now be running at `http://localhost:8000` or similar

## 📱 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## 🔮 Future Enhancements

- Integration with social media platforms for better sharing
- Additional languages support
- More detailed historical events
- Customizable themes
- Offline functionality with PWA support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- Chart.js for the visualization library
- Font Awesome for the icons
- Google Fonts for the Inter typeface

---

Made with ❤️ by [Minhaz](https://bio.link/minhazabedin)
