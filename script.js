// State for Unit System
let currentUnit = 'metric'; // Default unit system
let lastBMICategory = ''; // Stores the last calculated category for meal plan generation

// --- Theme Management ---
const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');

// Check for saved user preference, if any, on load
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
} else {
    htmlElement.classList.remove('dark');
}

themeToggleBtn.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        htmlElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
});

// --- DOM Elements ---
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const weightInput = document.getElementById('weight');
const weightLabel = document.getElementById('weight-label');
const calculateBtn = document.getElementById('calculate-btn');
const bmiScoreEl = document.getElementById('bmi-score');
const bmiCategoryEl = document.getElementById('bmi-category');
const healthyRangeEl = document.getElementById('healthy-range');
const insightsContentEl = document.getElementById('insights-content');
const resultDisplay = document.getElementById('result-display');
const recommendationsSection = document.getElementById('recommendations-section');
const bmiPointer = document.getElementById('bmi-pointer'); 

// New Feature DOM elements
const ttsBtn = document.getElementById('tts-btn');
const ttsTextNormal = document.getElementById('tts-text-normal');
const ttsTextLoading = document.getElementById('tts-text-loading');
const generateMealPlanBtn = document.getElementById('generate-meal-plan-btn');
const mealPlanOutput = document.getElementById('meal-plan-output');

// Height Fields
const heightCmInput = document.getElementById('height-cm');
const heightMetricGroup = document.getElementById('height-metric-group');
const heightCmLabel = document.getElementById('height-cm-label');
const heightFtInput = document.getElementById('height-ft');
const heightInInput = document.getElementById('height-in');
const heightImperialGroup = document.getElementById('height-imperial-group');

// Meter Segments 
const meterUnderweight = document.getElementById('meter-underweight-segment');
const meterHealthy = document.getElementById('meter-healthy-segment');
const meterOverweight = document.getElementById('meter-overweight-segment');

// Unit Toggle Buttons
const unitMetricBtn = document.getElementById('unit-metric');
const unitImperialBtn = document.getElementById('unit-imperial');

// BMI Categories for Meter (normalized to a visible range of 15-40)
const MIN_BMI_METER = 15.0;
const MAX_BMI_METER = 40.0;
const BMI_RANGE = MAX_BMI_METER - MIN_BMI_METER;
const HEALTHY_MIN = 18.5;
const HEALTHY_MAX = 24.9;
const OVERWEIGHT_MAX = 29.9;

// Calculate segment widths based on the 15-40 range
const underweightWidth = ((HEALTHY_MIN - MIN_BMI_METER) / BMI_RANGE) * 100; 
const healthyWidth = ((HEALTHY_MAX - HEALTHY_MIN) / BMI_RANGE) * 100; 
const overweightWidth = ((OVERWEIGHT_MAX - HEALTHY_MAX) / BMI_RANGE) * 100;

// Set the fixed meter segment widths on load
meterUnderweight.style.width = `${underweightWidth}%`;
meterHealthy.style.width = `${healthyWidth}%`;
meterOverweight.style.width = `${overweightWidth}%`;

// --- STATIC DATA (No AI) ---

const staticInsights = {
    "Underweight": {
        summary: "Focus on nutrient-dense foods to build strength safely.",
        recommendations: [
            "Eat more frequently (5-6 small meals daily).",
            "Choose energy-dense foods like nuts, avocados, and healthy oils.",
            "Include a source of protein with every meal.",
            "Incorporate strength training to build muscle, not just fat."
        ],
        fact: "Being underweight can weaken your immune system and reduce energy levels."
    },
    "Healthy Weight": {
        summary: "Great job! Focus on maintaining your current habits for long-term health.",
        recommendations: [
            "Continue eating a balanced diet rich in fruits and vegetables.",
            "Stay hydrated and drink plenty of water.",
            "Aim for at least 150 minutes of moderate activity per week.",
            "Prioritize sleep and stress management."
        ],
        fact: "Maintaining a healthy weight significantly reduces the risk of chronic diseases."
    },
    "Overweight": {
        summary: "Small, sustainable changes can lead to big health improvements.",
        recommendations: [
            "Practice portion control and mindful eating.",
            "Increase your daily step count and general movement.",
            "Limit sugary beverages and refined carbohydrates.",
            "Fill half your plate with vegetables at every meal."
        ],
        fact: "Losing just 5-10% of body weight can significantly improve blood pressure and cholesterol."
    },
    "Obesity": {
        summary: "Focus on sustainable lifestyle changes rather than quick fixes.",
        recommendations: [
            "Consult a healthcare provider for a personalized plan.",
            "Focus on whole, unprocessed foods over processed snacks.",
            "Start with low-impact exercises like walking or swimming.",
            "Track your meals to become aware of eating patterns."
        ],
        fact: "Obesity is a complex condition influenced by genetics, environment, and metabolism, not just willpower."
    }
};

const staticMealPlans = {
    "Underweight": [
        { day: "Day 1", goal: "Caloric Surplus", meals: [ { type: "Breakfast", item: "Oatmeal with nuts & banana", description: "High calorie & carb" }, { type: "Lunch", item: "Chicken Avocado Wrap", description: "Healthy fats & protein" }, { type: "Dinner", item: "Salmon with Quinoa", description: "Nutrient dense" }, { type: "Snack", item: "Greek Yogurt & Honey", description: "Protein boost" } ] },
        { day: "Day 2", goal: "Caloric Surplus", meals: [ { type: "Breakfast", item: "Avocado Toast with Eggs", description: "Healthy fats" }, { type: "Lunch", item: "Pasta with Meat Sauce", description: "Carb heavy" }, { type: "Dinner", item: "Steak and Potatoes", description: "High protein & calorie" }, { type: "Snack", item: "Trail Mix", description: "Energy density" } ] },
        { day: "Day 3", goal: "Caloric Surplus", meals: [ { type: "Breakfast", item: "Smoothie with Peanut Butter", description: "Easy calories" }, { type: "Lunch", item: "Turkey Club Sandwich", description: "Balanced meal" }, { type: "Dinner", item: "Chicken Curry with Rice", description: "Flavorful surplus" }, { type: "Snack", item: "Cheese and Crackers", description: "Easy snack" } ] },
        { day: "Day 4", goal: "Caloric Surplus", meals: [ { type: "Breakfast", item: "Bagel with Cream Cheese", description: "Dense carbs" }, { type: "Lunch", item: "Burrito Bowl with Guacamole", description: "Calorie rich" }, { type: "Dinner", item: "Beef Stir Fry", description: "Protein & veg" }, { type: "Snack", item: "Protein Shake", description: "Supplement" } ] },
        { day: "Day 5", goal: "Caloric Surplus", meals: [ { type: "Breakfast", item: "Pancakes with Syrup", description: "Carb load" }, { type: "Lunch", item: "Tuna Salad Sandwich", description: "Protein focus" }, { type: "Dinner", item: "Lasagna", description: "Hearty meal" }, { type: "Snack", item: "Dark Chocolate & Nuts", description: "Healthy fats" } ] },
        { day: "Day 6", goal: "Caloric Surplus", meals: [ { type: "Breakfast", item: "Full English Breakfast", description: "High calorie start" }, { type: "Lunch", item: "Chicken Caesar Wrap", description: "Good fats" }, { type: "Dinner", item: "Lamb Chops with Mash", description: "Protein dense" }, { type: "Snack", item: "Fruit Smoothie", description: "Vitamins" } ] },
        { day: "Day 7", goal: "Caloric Surplus", meals: [ { type: "Breakfast", item: "French Toast", description: "Tasty carbs" }, { type: "Lunch", item: "Burger and Sweet Potato Fries", description: "Treat meal" }, { type: "Dinner", item: "Roast Chicken Dinner", description: "Balanced surplus" }, { type: "Snack", item: "Granola Bar", description: "Quick energy" } ] }
    ],
    "Healthy Weight": [
        { day: "Day 1", goal: "Maintenance", meals: [ { type: "Breakfast", item: "Scrambled Eggs & Toast", description: "Balanced protein/carb" }, { type: "Lunch", item: "Grilled Chicken Salad", description: "Lean protein & veg" }, { type: "Dinner", item: "Baked Cod with Veggies", description: "Light & nutritious" }, { type: "Snack", item: "Apple & Almonds", description: "Fiber & fat" } ] },
        { day: "Day 2", goal: "Maintenance", meals: [ { type: "Breakfast", item: "Greek Yogurt Parfait", description: "Probiotics & protein" }, { type: "Lunch", item: "Turkey & Cheese Roll-ups", description: "Low carb lunch" }, { type: "Dinner", item: "Spaghetti Bolognese", description: "Comfort food" }, { type: "Snack", item: "Carrot Sticks & Hummus", description: "Crunchy snack" } ] },
        { day: "Day 3", goal: "Maintenance", meals: [ { type: "Breakfast", item: "Oatmeal with Berries", description: "Fiber rich" }, { type: "Lunch", item: "Lentil Soup", description: "Plant protein" }, { type: "Dinner", item: "Grilled Steak & Salad", description: "High protein" }, { type: "Snack", item: "Hard Boiled Egg", description: "Protein snack" } ] },
        { day: "Day 4", goal: "Maintenance", meals: [ { type: "Breakfast", item: "Smoothie Bowl", description: "Nutrient dense" }, { type: "Lunch", item: "Quinoa Salad", description: "Complex carbs" }, { type: "Dinner", item: "Chicken Stir Fry", description: "Lean dinner" }, { type: "Snack", item: "Pear", description: "Simple fruit" } ] },
        { day: "Day 5", goal: "Maintenance", meals: [ { type: "Breakfast", item: "Whole Wheat Toast & PB", description: "Sustained energy" }, { type: "Lunch", item: "Tuna Nicoise Salad", description: "Omega-3s" }, { type: "Dinner", item: "Tacos (Lean Beef)", description: "Fun meal" }, { type: "Snack", item: "Popcorn (Air popped)", description: "Whole grain" } ] },
        { day: "Day 6", goal: "Maintenance", meals: [ { type: "Breakfast", item: "Veggie Omelet", description: "Vitamins & protein" }, { type: "Lunch", item: "Chicken Pesto Pasta", description: "Balanced meal" }, { type: "Dinner", item: "Shrimp Scampi", description: "Seafood" }, { type: "Snack", item: "Cottage Cheese", description: "Slow digest protein" } ] },
        { day: "Day 7", goal: "Maintenance", meals: [ { type: "Breakfast", item: "Waffles (Whole Grain)", description: "Weekend breakfast" }, { type: "Lunch", item: "Caprese Salad", description: "Fresh & light" }, { type: "Dinner", item: "Roast Beef & Veggies", description: "Sunday dinner" }, { type: "Snack", item: "Orange", description: "Vitamin C" } ] }
    ],
    "Overweight": [
        { day: "Day 1", goal: "Caloric Deficit", meals: [ { type: "Breakfast", item: "Egg White Omelet", description: "High protein, low fat" }, { type: "Lunch", item: "Grilled Chicken over Greens", description: "Volume eating" }, { type: "Dinner", item: "Zucchini Noodles with Marinara", description: "Low carb sub" }, { type: "Snack", item: "Celery & Hummus", description: "Low cal crunch" } ] },
        { day: "Day 2", goal: "Caloric Deficit", meals: [ { type: "Breakfast", item: "Protein Shake", description: "Meal replacement" }, { type: "Lunch", item: "Turkey Lettuce Wraps", description: "No bread lunch" }, { type: "Dinner", item: "Baked Salmon & Asparagus", description: "Healthy fats" }, { type: "Snack", item: "Berries", description: "Low sugar fruit" } ] },
        { day: "Day 3", goal: "Caloric Deficit", meals: [ { type: "Breakfast", item: "Cottage Cheese & Pineapple", description: "High protein" }, { type: "Lunch", item: "Vegetable Soup", description: "Filling fluid" }, { type: "Dinner", item: "Grilled White Fish", description: "Very lean protein" }, { type: "Snack", item: "Almonds (Portioned)", description: "Healthy fat" } ] },
        { day: "Day 4", goal: "Caloric Deficit", meals: [ { type: "Breakfast", item: "Oatmeal (Water base)", description: "Fiber for fullness" }, { type: "Lunch", item: "Tuna Salad (Light Mayo)", description: "Lean protein" }, { type: "Dinner", item: "Chicken Breast & Broccoli", description: "Staple lean meal" }, { type: "Snack", item: "Cucumber Slices", description: "Hydrating" } ] },
        { day: "Day 5", goal: "Caloric Deficit", meals: [ { type: "Breakfast", item: "Green Smoothie", description: "Nutrient bomb" }, { type: "Lunch", item: "Hard Boiled Eggs & Spinach", description: "Simple protein" }, { type: "Dinner", item: "Turkey Chili (Beanless)", description: "High protein" }, { type: "Snack", item: "Rice Cake", description: "Low cal carb" } ] },
        { day: "Day 6", goal: "Caloric Deficit", meals: [ { type: "Breakfast", item: "Greek Yogurt (0% fat)", description: "Pure protein" }, { type: "Lunch", item: "Sashimi / Sushi Roll (no mayo)", description: "Clean eating" }, { type: "Dinner", item: "Stir Fry Veggies & Tofu", description: "Plant based light" }, { type: "Snack", item: "Grapefruit", description: "Metabolism aid" } ] },
        { day: "Day 7", goal: "Caloric Deficit", meals: [ { type: "Breakfast", item: "Poached Eggs on Greens", description: "Savory start" }, { type: "Lunch", item: "Grilled Shrimp Salad", description: "Low cal protein" }, { type: "Dinner", item: "Lean Steak & Green Beans", description: "Satisfying dinner" }, { type: "Snack", item: "Tea & Dark Chocolate square", description: "Small treat" } ] }
    ]
};
// Map Obesity to Overweight plan for simplicity in this static version
staticMealPlans["Obesity"] = staticMealPlans["Overweight"];

const staticHealthFacts = [
    "Did you know? Muscle tissue burns more calories at rest than fat tissue, so strength training helps metabolism.",
    "Staying hydrated is crucial. Sometimes your body confuses thirst for hunger.",
    "Eating slowly gives your brain time to register that you are full, preventing overeating.",
    "Fiber-rich foods like oats and vegetables keep you feeling full for longer.",
    "Sleep deprivation can increase hunger hormones, making it harder to manage weight.",
    "Walking just 30 minutes a day can significantly improve cardiovascular health."
];

// --- Utility Functions ---

function switchUnits(unit) {
    currentUnit = unit;
    
    if (unit === 'metric') {
        unitMetricBtn.classList.add('bg-violet-600', 'text-white');
        unitMetricBtn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300', 'dark:bg-slate-700', 'dark:text-slate-300', 'dark:hover:bg-slate-600');
        unitImperialBtn.classList.remove('bg-violet-600', 'text-white');
        unitImperialBtn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300', 'dark:bg-slate-700', 'dark:text-slate-300', 'dark:hover:bg-slate-600');
        
        heightMetricGroup.style.display = 'block';
        heightImperialGroup.style.display = 'none';
        
        weightLabel.textContent = 'Weight (kg)';
        weightInput.placeholder = 'e.g., 75';

        heightFtInput.value = '';
        heightInInput.value = '';
        
    } else { // imperial
        unitImperialBtn.classList.add('bg-violet-600', 'text-white');
        unitImperialBtn.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300', 'dark:bg-slate-700', 'dark:text-slate-300', 'dark:hover:bg-slate-600');
        unitMetricBtn.classList.remove('bg-violet-600', 'text-white');
        unitMetricBtn.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300', 'dark:bg-slate-700', 'dark:text-slate-300', 'dark:hover:bg-slate-600');

        heightMetricGroup.style.display = 'none';
        heightImperialGroup.style.display = 'grid';

        weightLabel.textContent = 'Weight (lb)';
        weightInput.placeholder = 'e.g., 165';

        heightCmInput.value = '';
    }
}

function imperialToInches(ft, inch) {
    return (ft * 12) + inch;
}

function calculateBMI(weight, heightA, heightB = 0) {
    if (currentUnit === 'metric') {
        // Metric: kg / m^2
        const heightM = heightA / 100; 
        return weight / (heightM * heightM);
    } else {
        // Imperial: (lb / in^2) * 703
        const totalInches = imperialToInches(heightB, heightA);
        return (weight / (totalInches * totalInches)) * 703;
    }
}

function getBMICategory(bmi) {
    let category, color;
    if (bmi < 18.5) {
        category = "Underweight";
        color = "text-amber-600 dark:text-amber-400"; 
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = "Healthy Weight";
        color = "text-emerald-600 dark:text-emerald-400"; 
    } else if (bmi >= 25.0 && bmi <= 29.9) {
        category = "Overweight";
        color = "text-orange-600 dark:text-orange-400"; 
    } else { // bmi >= 30.0
        category = "Obesity";
        color = "text-red-600 dark:text-red-400"; 
    }
    return { category, color };
}

function calculateHealthyRange(heightA, heightB = 0) {
    let h2;
    let unit = currentUnit === 'metric' ? 'kg' : 'lb';

    if (currentUnit === 'metric') {
        const heightM = heightA / 100;
        h2 = heightM * heightM;
        // Min/Max BMI * m^2
        const minWeight = 18.5 * h2;
        const maxWeight = 24.9 * h2;
        return { min: minWeight.toFixed(1), max: maxWeight.toFixed(1), unit };

    } else {
        const totalInches = imperialToInches(heightB, heightA);
        h2 = totalInches * totalInches;
        // (Min/Max BMI / 703) * in^2
        const conversionFactor = 703;
        const minWeight = (18.5 / conversionFactor) * h2;
        const maxWeight = (24.9 / conversionFactor) * h2;
        return { min: minWeight.toFixed(1), max: maxWeight.toFixed(1), unit };
    }
}

function updateBMIMeter(bmi) {
    let pointerPosition;

    if (bmi <= MIN_BMI_METER) {
        // Capped at the start
        pointerPosition = 0;
    } else if (bmi >= MAX_BMI_METER) {
        // Capped at the end
        pointerPosition = 100;
    } else {
        // Calculate position percentage within the range 15 to 40
        pointerPosition = ((bmi - MIN_BMI_METER) / BMI_RANGE) * 100;
    }
    
    bmiPointer.style.left = `calc(${pointerPosition}% - 0.25px)`; 
}

// --- STATIC INSIGHTS LOGIC ---

function generateRecommendation(bmi, category, age, gender) { 
    insightsContentEl.innerHTML = `
        <div class="flex items-center justify-center py-6 text-violet-600 dark:text-violet-400">
            <svg class="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="font-medium">Analyzing data...</p>
        </div>
    `;
    calculateBtn.disabled = true;
    recommendationsSection.classList.remove('show');

    // Simulate delay
    setTimeout(() => {
        const insights = staticInsights[category];
        if (!insights) {
            insightsContentEl.innerHTML = `<p class="text-red-500">Could not generate insights.</p>`;
            calculateBtn.disabled = false;
            return;
        }

        let sourceHtml = `
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-slate-400 animate-fade-in-up delay-300">
                <p class="font-medium mb-2">General Health Guidelines:</p>
                <ul class="list-disc ml-5 space-y-1">
                    <li>Standard BMI categories (WHO/CDC).</li>
                    <li>Consult a doctor for personalized medical advice.</li>
                </ul>
            </div>
        `;

        insightsContentEl.innerHTML = `
            <div class="prose max-w-none text-gray-700 dark:text-slate-300">
                <p class="font-semibold text-lg mb-2 animate-fade-in-up delay-100">${insights.summary}</p>
                <ul class="list-disc ml-5 mb-4 animate-fade-in-up delay-200">
                    ${insights.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
                <div class="bg-violet-50 dark:bg-slate-800 p-3 rounded border border-violet-100 dark:border-slate-700 text-violet-800 dark:text-violet-300 text-sm animate-fade-in-up delay-300">
                    <strong>Did you know?</strong> ${insights.fact}
                </div>
            </div>
            ${sourceHtml}
        `;
        
        recommendationsSection.classList.add('show');
        calculateBtn.disabled = false;
    }, 600);
}

// --- STATIC MEAL PLAN LOGIC ---

async function generateMealPlan() {
    generateMealPlanBtn.disabled = true;
    
    mealPlanOutput.innerHTML = `
        <div class="flex items-center justify-center py-6 text-violet-600 dark:text-violet-400">
            <svg class="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="font-medium">Creating your personalized 7-day meal plan...</p>
        </div>
    `;
    
    await new Promise(r => setTimeout(r, 500));

    try {
        let planKey = lastBMICategory;
        if (!staticMealPlans[planKey]) {
            if (planKey === 'Obesity') planKey = 'Overweight';
            else planKey = 'Healthy Weight';
        }

        const mealPlan = staticMealPlans[planKey];
        
        let html = '';
        mealPlan.forEach((dayPlan, index) => {
            const delayClass = `delay-${Math.min((index + 1) * 100, 700)}`; // Stagger effect
            html += `
                <div class="mb-8 animate-fade-in-up ${delayClass}">
                    <h3 class="text-xl font-bold text-violet-600 dark:text-violet-400 mb-2">${dayPlan.day}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Goal: ${dayPlan.goal}</p>
                    <div class="overflow-x-auto">
                        <table class="meal-table w-full rounded-lg overflow-hidden">
                            <thead>
                                <tr>
                                    <th class="w-1/4">Meal</th>
                                    <th class="w-1/3">Item</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dayPlan.meals.map(meal => `
                                    <tr>
                                        <td class="meal-type text-sm">${meal.type}</td>
                                        <td class="font-medium text-gray-800 dark:text-slate-200">${meal.item}</td>
                                        <td class="text-sm text-gray-600 dark:text-slate-400">${meal.description}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        });

        mealPlanOutput.innerHTML = html;

    } catch (error) {
        mealPlanOutput.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
                <p class="font-bold">Error retrieving Meal Plan.</p>
            </div>
        `;
    } finally {
        generateMealPlanBtn.disabled = false;
    }
}

// --- NATIVE BROWSER TTS LOGIC ---

function playHealthFact() {
    ttsBtn.disabled = true;
    ttsTextNormal.classList.add('hidden');
    ttsTextLoading.classList.remove('hidden');

    // Pick a random fact
    const randomFact = staticHealthFacts[Math.floor(Math.random() * staticHealthFacts.length)];

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(randomFact);
        utterance.lang = 'en-US';
        utterance.rate = 1; // Normal speed
        
        // Try to set a pleasant voice if available
        const voices = window.speechSynthesis.getVoices();
        // Prefer a female voice for "Assistant" feel if possible (optional polish)
        const preferredVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Google US English'));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
            ttsBtn.disabled = false;
            ttsTextNormal.classList.remove('hidden');
            ttsTextLoading.classList.add('hidden');
        };

        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            ttsBtn.disabled = false;
            ttsTextNormal.classList.remove('hidden');
            ttsTextLoading.classList.add('hidden');
        };

        window.speechSynthesis.speak(utterance);
    } else {
        alert("Sorry, your browser does not support Text-to-Speech.");
        ttsBtn.disabled = false;
        ttsTextNormal.classList.remove('hidden');
        ttsTextLoading.classList.add('hidden');
    }
}


// --- Main Controller ---

function handleCalculation() {
    const weight = parseFloat(weightInput.value);
    const age = parseInt(ageInput.value);
    const gender = genderSelect.value;
    
    let heightA, heightB = 0; 

    let isValid = true;
    let errorMsg = '';

    // Height validation
    if (currentUnit === 'metric') {
        heightA = parseFloat(heightCmInput.value);
        if (isNaN(heightA) || heightA <= 0) {
            isValid = false;
            errorMsg = 'Please enter a valid height in centimeters.';
        }
    } else {
        const ft = parseInt(heightFtInput.value || 0);
        const inch = parseInt(heightInInput.value || 0);
        heightB = ft;
        heightA = inch; 
        if (isNaN(ft) || isNaN(inch) || (ft === 0 && inch === 0)) {
            isValid = false;
            errorMsg = 'Please enter a valid height in feet and inches.';
        }
    }

    // General validation
    if (isNaN(weight) || weight <= 0) {
        isValid = false;
        errorMsg = 'Please enter a valid weight.';
    }
    if (isNaN(age) || age < 1 || age > 120) {
        isValid = false;
        errorMsg = 'Please enter a valid age (1-120).';
    }
    
    resultDisplay.classList.remove('show');
    recommendationsSection.classList.remove('show');

    ttsBtn.disabled = true;
    generateMealPlanBtn.disabled = true;

    if (!isValid) {
        bmiScoreEl.textContent = 'Invalid Input';
        bmiScoreEl.className = 'text-5xl font-extrabold text-red-600 dark:text-red-400 mb-4 transition duration-500';
        bmiCategoryEl.textContent = errorMsg;
        healthyRangeEl.innerHTML = '';
        insightsContentEl.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 p-4 rounded-lg">Validation Error: ${errorMsg}</div>`;
        mealPlanOutput.innerHTML = `<p class="text-center text-red-700 dark:text-red-400">Fix validation errors to enable features.</p>`;
        resultDisplay.classList.add('show');
        return;
    }

    // 1. Calculate BMI
    const bmi = calculateBMI(weight, heightA, heightB); 
    const { category, color } = getBMICategory(bmi);
    const healthyRange = calculateHealthyRange(heightA, heightB);
    lastBMICategory = category; 

    // 2. Update UI
    bmiScoreEl.textContent = bmi.toFixed(1);
    bmiScoreEl.className = `text-5xl font-extrabold ${color} mb-4 transition duration-500`;
    bmiCategoryEl.textContent = `Classification: ${category}`;
    healthyRangeEl.innerHTML = `
        Healthy range (18.5 - 24.9) is:
        <span class="font-bold text-gray-900 dark:text-white">${healthyRange.min} - ${healthyRange.max} ${healthyRange.unit}</span>.
    `;
    
    setTimeout(() => {
        resultDisplay.classList.add('show');
        updateBMIMeter(bmi); 
        ttsBtn.disabled = false; 
        generateMealPlanBtn.disabled = false; 
        mealPlanOutput.innerHTML = `<p class="text-center text-gray-600 dark:text-gray-400">Click 'Generate 7-Day Meal Plan' above.</p>`;
    }, 50);

    // 3. Generate Recommendations (Static)
    generateRecommendation(bmi, category, age, gender);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
     bmiPointer.style.left = `calc(0% - 0.25px)`;
     insightsContentEl.innerHTML = `<div class="text-center py-4 text-gray-600 dark:text-gray-400">Enter your details and click 'Calculate' to receive your personalized health insights!</div>`;
     
     calculateBtn.addEventListener('click', handleCalculation);
     unitMetricBtn.addEventListener('click', () => switchUnits('metric'));
     unitImperialBtn.addEventListener('click', () => switchUnits('imperial'));
     ttsBtn.addEventListener('click', playHealthFact);
     generateMealPlanBtn.addEventListener('click', generateMealPlan);

     switchUnits(currentUnit);
});