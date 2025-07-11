import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("🚀 Code generation request received")

  // Initialize with safe defaults
  let prompt = "modern website"
  let apiKey = ""

  // Step 1: Safely extract request data
  try {
    const body = await request.json()
    prompt = body.prompt || "modern website"
    console.log("📝 Prompt received:", prompt)
  } catch {
    console.log("⚠️ Using default prompt due to parsing error")
  }

  // Step 2: Safely get API key
  try {
    apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
  } catch {
    console.log("⚠️ Environment variable access failed")
  }

  // Step 3: If no API key, return fallback immediately
  if (!apiKey) {
    console.log("🔑 No API key - returning fallback")
    return NextResponse.json({
      files: generateFallbackWebsite(prompt),
      error: false,
      fallback: true,
      message: "Demo mode - API key not configured",
    })
  }

  // Step 4: Try AI generation with complete error isolation
  console.log("🤖 Attempting AI generation...")

  const aiResult = await attemptAIGeneration(prompt, apiKey)

  if (aiResult.success && aiResult.files) {
    console.log("✅ AI generation successful")
    return NextResponse.json({
      files: aiResult.files,
      error: false,
      fallback: false,
    })
  }

  // Step 5: Return professional fallback
  console.log("🎨 Using professional fallback")
  return NextResponse.json({
    files: generateFallbackWebsite(prompt),
    error: false,
    fallback: true,
    message: "Demo mode - AI service busy",
  })
}

// Completely isolated AI generation function
async function attemptAIGeneration(prompt: string, apiKey: string) {
  try {
    // Use gemini-1.5-flash-8b (lighter model) to reduce overload
    const { generateText } = await import("ai")
    const { google } = await import("@ai-sdk/google")

    const systemPrompt = `Create a modern website. Return only JSON:
{
  "files": [
    {
      "name": "index.html",
      "type": "file",
      "path": "/index.html", 
      "content": "<!DOCTYPE html>..."
    }
  ]
}`

    const userPrompt = `Create a ${prompt} using HTML5, CSS3, TailwindCSS, and JavaScript.`

    // Use lighter model and reduced settings
    const result = await Promise.race([
      generateText({
        model: google("gemini-1.5-flash-8b", { apiKey }), // Lighter model
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 2000, // Reduced tokens
        temperature: 0.3, // Lower temperature
      }),
      new Promise(
        (_, reject) => setTimeout(() => reject(new Error("timeout")), 10000), // 10s timeout
      ),
    ])

    if (result && typeof result === "object" && "text" in result) {
      const parsed = parseAIResponse(result.text, prompt)
      if (parsed.success) {
        return { success: true, files: parsed.files }
      }
    }
  } catch (error) {
    console.log("🤖 AI generation failed:", error instanceof Error ? error.message : "Unknown error")
  }

  return { success: false, files: null }
}

// Safe AI response parsing
function parseAIResponse(text: string, prompt: string) {
  try {
    // Try to extract JSON
    let jsonText = text
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1]
    }

    const parsed = JSON.parse(jsonText)

    if (parsed.files && Array.isArray(parsed.files) && parsed.files.length > 0) {
      const cleanFiles = parsed.files.map((file: any) => ({
        name: file.name || "index.html",
        type: file.type || "file",
        path: file.path || `/${file.name || "index.html"}`,
        content: file.content || "",
      }))

      return { success: true, files: cleanFiles }
    }
  } catch {
    // If JSON parsing fails, create HTML from text
    if (text.includes("<!DOCTYPE html>")) {
      return {
        success: true,
        files: [
          {
            name: "index.html",
            type: "file",
            path: "/index.html",
            content: text,
          },
        ],
      }
    }
  }

  return { success: false, files: null }
}

// Generate professional fallback website
function generateFallbackWebsite(prompt: string) {
  const websiteType = detectWebsiteType(prompt)
  const title = `${websiteType.charAt(0).toUpperCase() + websiteType.slice(1)} Website`

  return [
    {
      name: "index.html",
      type: "file",
      path: "/index.html",
      content: generateFallbackHTML(title, prompt),
    },
    {
      name: "styles.css",
      type: "file",
      path: "/styles.css",
      content: generateFallbackCSS(),
    },
    {
      name: "script.js",
      type: "file",
      path: "/script.js",
      content: generateFallbackJS(title),
    },
  ]
}

function detectWebsiteType(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes("portfolio") || lowerPrompt.includes("personal")) return "portfolio"
  if (lowerPrompt.includes("landing") || lowerPrompt.includes("saas")) return "landing"
  if (lowerPrompt.includes("blog") || lowerPrompt.includes("article")) return "blog"
  if (lowerPrompt.includes("ecommerce") || lowerPrompt.includes("shop")) return "ecommerce"
  if (lowerPrompt.includes("restaurant") || lowerPrompt.includes("food")) return "restaurant"
  if (lowerPrompt.includes("dashboard") || lowerPrompt.includes("admin")) return "dashboard"

  return "modern"
}

function generateFallbackHTML(title: string, prompt: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - VibesCode.AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body class="font-inter bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold gradient-text">
                        ${title}
                    </h1>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#home" class="nav-link">Home</a>
                    <a href="#about" class="nav-link">About</a>
                    <a href="#services" class="nav-link">Services</a>
                    <a href="#contact" class="nav-link">Contact</a>
                </div>
                <button id="mobile-menu-btn" class="md:hidden text-gray-500 hover:text-gray-700 transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-gradient min-h-screen flex items-center justify-center text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        
        <!-- Animated Background Elements -->
        <div class="floating-element floating-1"></div>
        <div class="floating-element floating-2"></div>
        <div class="floating-element floating-3"></div>
        
        <div class="relative z-10 text-center max-w-5xl mx-auto px-4">
            <div class="animate-fade-in-up">
                <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Welcome to Your
                    <span class="block text-purple-200 animate-pulse">${title}</span>
                </h1>
                <p class="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto leading-relaxed">
                    Built with cutting-edge web technologies: HTML5, CSS3, TailwindCSS, and JavaScript ES6+
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="cta-button bg-white text-purple-600 hover:bg-purple-50 transform hover:scale-105">
                        Get Started
                    </button>
                    <button class="cta-button border-2 border-white text-white hover:bg-white hover:text-purple-600 transform hover:scale-105">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="about" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">Modern Features</h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Experience the power of modern web development
                </p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="feature-card group">
                    <div class="feature-icon bg-gradient-to-r from-purple-500 to-pink-500">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-4 group-hover:text-purple-600 transition-colors">Lightning Fast</h3>
                    <p class="text-gray-600">Optimized performance with modern web technologies and best practices for speed.</p>
                </div>
                
                <div class="feature-card group">
                    <div class="feature-icon bg-gradient-to-r from-blue-500 to-cyan-500">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Responsive Design</h3>
                    <p class="text-gray-600">Perfect experience across all devices with mobile-first responsive approach.</p>
                </div>
                
                <div class="feature-card group">
                    <div class="feature-icon bg-gradient-to-r from-green-500 to-emerald-500">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-4 group-hover:text-green-600 transition-colors">Accessible</h3>
                    <p class="text-gray-600">Built with accessibility in mind, ensuring everyone can use your website.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
                <p class="text-xl text-gray-600">Comprehensive solutions for your digital needs</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="service-card">
                    <h3 class="text-xl font-semibold mb-3">Web Development</h3>
                    <p class="text-gray-600 mb-4">Custom websites built with modern technologies</p>
                    <div class="text-purple-600 font-semibold">Learn More →</div>
                </div>
                
                <div class="service-card">
                    <h3 class="text-xl font-semibold mb-3">UI/UX Design</h3>
                    <p class="text-gray-600 mb-4">Beautiful and intuitive user experiences</p>
                    <div class="text-purple-600 font-semibold">Learn More →</div>
                </div>
                
                <div class="service-card">
                    <h3 class="text-xl font-semibold mb-3">Mobile Apps</h3>
                    <p class="text-gray-600 mb-4">Native and cross-platform mobile solutions</p>
                    <div class="text-purple-600 font-semibold">Learn More →</div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section id="contact" class="py-20 hero-gradient text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl font-bold mb-6">Ready to Build Something Amazing?</h2>
            <p class="text-xl mb-8 text-purple-100 max-w-3xl mx-auto">
                Let's create your next digital masterpiece together
            </p>
            <button class="cta-button bg-white text-purple-600 hover:bg-purple-50 transform hover:scale-105">
                Start Your Project
            </button>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div class="col-span-2">
                    <div class="text-2xl font-bold mb-4">${title}</div>
                    <p class="text-gray-400 mb-6">Built with modern web technologies and best practices</p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="#home" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
                        <li><a href="#about" class="text-gray-400 hover:text-white transition-colors">About</a></li>
                        <li><a href="#services" class="text-gray-400 hover:text-white transition-colors">Services</a></li>
                        <li><a href="#contact" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Contact</h3>
                    <ul class="space-y-2 text-gray-400">
                        <li>hello@example.com</li>
                        <li>+1 (555) 123-4567</li>
                        <li>123 Web Street</li>
                        <li>Digital City, DC 12345</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 ${title}. All rights reserved. Built with ❤️ using modern web technologies.</p>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`
}

function generateFallbackCSS(): string {
  return `/* Modern CSS3 Styles */
* {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    --text-dark: #1a202c;
    --text-light: #718096;
    --bg-light: #f7fafc;
    --shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
}

html {
    scroll-behavior: smooth;
}

body {
    line-height: 1.6;
    color: var(--text-dark);
    background-color: var(--bg-light);
}

/* Gradient Backgrounds */
.hero-gradient {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    position: relative;
}

.hero-gradient::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
}

.gradient-text {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Navigation */
.nav-link {
    @apply text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200;
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    background-color: var(--primary-color);
    transition: all 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
    left: 0;
}

/* Buttons */
.cta-button {
    @apply px-8 py-4 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300;
    box-shadow: var(--shadow);
}

.cta-button:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-2px);
}

/* Cards */
.feature-card {
    @apply text-center p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white;
    transform: translateY(0);
}

.feature-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-hover);
}

.feature-icon {
    @apply w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center;
    box-shadow: var(--shadow);
}

.service-card {
    @apply p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer;
    border-left: 4px solid transparent;
}

.service-card:hover {
    border-left-color: var(--primary-color);
    transform: translateX(4px);
}

/* Floating Elements */
.floating-element {
    @apply absolute rounded-full opacity-20;
    animation: float 6s ease-in-out infinite;
}

.floating-1 {
    @apply w-20 h-20 bg-white;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.floating-2 {
    @apply w-16 h-16 bg-purple-300;
    top: 60%;
    right: 15%;
    animation-delay: 2s;
}

.floating-3 {
    @apply w-12 h-12 bg-pink-300;
    bottom: 30%;
    left: 20%;
    animation-delay: 4s;
}

/* Animations */
@keyframes float {
    0%, 100% { 
        transform: translateY(0px) rotate(0deg); 
    }
    33% { 
        transform: translateY(-20px) rotate(120deg); 
    }
    66% { 
        transform: translateY(-10px) rotate(240deg); 
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

.animate-fade-in-up {
    animation: fadeInUp 1s ease-out;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-gradient h1 {
        @apply text-4xl;
    }
    
    .hero-gradient p {
        @apply text-lg;
    }
    
    .cta-button {
        @apply px-6 py-3 text-sm;
    }
    
    .floating-element {
        display: none;
    }
    
    .feature-card {
        @apply p-6;
    }
}

@media (max-width: 480px) {
    .hero-gradient h1 {
        @apply text-3xl;
    }
    
    .hero-gradient p {
        @apply text-base;
    }
}

/* Loading States */
.loading {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Focus States for Accessibility */
button:focus,
a:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Smooth Transitions */
* {
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
}

/* Print Styles */
@media print {
    .floating-element,
    nav,
    footer {
        display: none;
    }
    
    .hero-gradient {
        background: white;
        color: black;
    }
}`
}

function generateFallbackJS(title: string): string {
  return `// Modern JavaScript ES6+ for ${title}
console.log('🚀 ${title} - Modern website loaded with cutting-edge technologies!');

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
    console.log('🎨 Initializing modern website features...');
    
    setupSmoothScrolling();
    setupNavigationEffects();
    setupButtonEffects();
    setupCardAnimations();
    setupIntersectionObserver();
    setupKeyboardNavigation();
    setupMobileMenu();
    setupPerformanceMonitoring();
    
    console.log('✨ Website initialization complete!');
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navigation scroll effects
function setupNavigationEffects() {
    let lastScrollY = window.scrollY;
    
    const throttledScroll = throttle(() => {
        const nav = document.querySelector('nav');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.classList.add('backdrop-blur-md', 'bg-opacity-95');
        } else {
            nav.classList.remove('backdrop-blur-md', 'bg-opacity-95');
        }
        
        // Hide/show nav on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }, 100);
    
    window.addEventListener('scroll', throttledScroll);
}

// Button hover and click effects
function setupButtonEffects() {
    document.querySelectorAll('button, .cta-button').forEach(button => {
        // Hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
        
        // Click effects with ripple
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = \`
                position: absolute;
                width: \${size}px;
                height: \${size}px;
                left: \${x}px;
                top: \${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            \`;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Card hover animations
function setupCardAnimations() {
    document.querySelectorAll('.feature-card, .service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    document.querySelectorAll('.feature-card, .service-card, section h2').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Keyboard navigation support
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.altKey) {
            switch(e.key) {
                case 'h':
                    e.preventDefault();
                    document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'a':
                    e.preventDefault();
                    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 's':
                    e.preventDefault();
                    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'c':
                    e.preventDefault();
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            console.log('Mobile menu clicked - Add mobile menu functionality here');
            // Add mobile menu toggle functionality
        });
    }
}

// Performance monitoring
function setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('Performance:', entry.name, entry.duration + 'ms');
            }
        });
        
        try {
            perfObserver.observe({ entryTypes: ['navigation', 'paint'] });
        } catch (e) {
            console.log('Performance observer not supported');
        }
    }
    
    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage helpers
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    }
};

// Modern fetch wrapper
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = \`
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
\`;
document.head.appendChild(style);

// Initialize theme handling
const initTheme = () => {
    const savedTheme = storage.get('theme') || 'light';
    document.body.classList.add(\`theme-\${savedTheme}\`);
};

// Initialize on load
initTheme();

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
`
}
