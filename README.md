 # FitLogic.io - Advanced BMI Calculator & Health Dashboard 🏋️‍♂️🥗

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Built%20With-HTML%20%7C%20Tailwind%20%7C%20JS-blueviolet)

**FitLogic.io** is a modern, fully responsive web application designed to calculate Body Mass Index (BMI) while providing actionable health insights. Unlike standard calculators, this project features a visual gauge, dark mode support, a 7-day meal planner, and interactive Text-to-Speech health facts.

---

## 🌟 Key Features

* **⚡ Instant Calculation:** Supports both **Metric (kg/cm)** and **Imperial (lb/ft/in)** systems.
* **🎨 Dynamic Visual Interface:**
    * **Interactive BMI Meter:** A visual needle gauge that animates to show exactly where the user falls on the BMI spectrum (Underweight, Healthy, Overweight, Obesity).
    * **Smooth Animations:** Custom CSS transitions and fade-ins for a polished user experience.
* **🌙 Dark Mode Support:** Fully integrated dark/light theme toggle that persists user preference via LocalStorage.
* **🧠 Intelligent Insights:** Generates personalized health summaries, recommendations, and facts based on the calculated BMI category.
* **📅 7-Day Meal Planner:** A built-in logic engine that generates a sample weekly meal plan tailored to the user's specific caloric needs (Surplus, Maintenance, or Deficit).
* **🎧 Text-to-Speech (TTS):** Accessibility feature that reads out random health facts using the browser's native Speech Synthesis API.
* **📱 Fully Responsive:** Optimized for desktop, tablet, and mobile devices using Tailwind CSS.

---

## 🛠️ Tech Stack

This project is built as a **Single Page Application (SPA)** contained within a single file for ease of deployment and portability.

* **Core:** HTML5, Vanilla JavaScript (ES6+ Modules).
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN) + Custom CSS for animations.
* **Icons:** Heroicons (SVG).
* **APIs:** Web Speech API (for TTS), LocalStorage API (for theme persistence).

---

## 🚀 Getting Started

Since this project utilizes a CDN for Tailwind CSS, no build steps (like `npm install`) are required.

### Prerequisites
* A modern web browser (Chrome, Firefox, Safari, Edge).
* An internet connection (to load the Tailwind CSS script).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/fitlogic-bmi-calculator.git](https://github.com/yourusername/fitlogic-bmi-calculator.git)
    ```
2.  **Navigate to the folder:**
    ```bash
    cd fitlogic-bmi-calculator
    ```
3.  **Run the app:**
    Simply open the `index.html` file in your browser.
    
    *Tip: For the best experience, use a local development server (like the "Live Server" extension in VS Code) to ensure all browser APIs function correctly.*

---

## 📸 Screenshots

| Light Mode ☀️ | Dark Mode 🌙 |
|:---:|:---:|
| *(Place screenshot here)* | *(Place screenshot here)* |

---

## ⚙️ How It Works

1.  **Input:** The user selects their unit system and enters Age, Gender, Weight, and Height.
2.  **Validation:** The JavaScript engine validates inputs to prevent errors (e.g., negative height).
3.  **Calculation:** * Metric: `Weight (kg) / Height (m)²`
    * Imperial: `(Weight (lb) / Height (in)²) * 703`
4.  **Visualization:** The gauge pointer position is calculated mathematically to map the BMI (15-40 range) to a percentage width on the visual bar.
5.  **Output:** The app unlocks the "Health Insights" and "Meal Plan" sections only after a valid calculation is performed.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improving the meal plan logic or adding more health facts:

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Suman**
* GitHub: [@yourusername](https://github.com/yourusername)

---

*Note: This calculator provides information for educational purposes only and does not constitute medical advice.*
