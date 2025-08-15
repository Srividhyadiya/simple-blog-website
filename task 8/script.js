// Blog post data, now including a 'latest' post
const posts = [
    { title: "The Ultimate Road Trip Guide", description: "Discover the best routes, tips, and tricks for an unforgettable road trip adventure.", category: "travel", isLatest: true },
    { title: "Mastering the Art of Sourdough", description: "A comprehensive guide to baking your own delicious sourdough bread at home.", category: "cooking" },
    { title: "The History of Impressionism", description: "An in-depth look at the Impressionist movement, its key artists, and masterpieces.", category: "art" },
    { title: "Hiking in the Himalayas", description: "Explore the majestic trails and breathtaking views of the world's highest mountains.", category: "nature" },
    { title: "The Future of AI in Daily Life", description: "How artificial intelligence is shaping our world and what to expect next.", category: "technology" },
    { title: "Building a Better Budget", description: "Simple and effective strategies to help you take control of your personal finances.", category: "finance" },
    { title: "A Culinary Tour of Italy", description: "A virtual journey through the best of Italian cuisine, from pasta to pastries.", category: "cooking" },
    { title: "Wildlife Photography Tips", description: "Essential tips and techniques for capturing stunning photos of animals in their natural habitat.", category: "nature" },
    { title: "Museums of Paris", description: "A guide to the most famous art museums in Paris, including the Louvre and Musée d'Orsay.", category: "art" },
    { title: "Planning Your Next Adventure", description: "Everything you need to know to plan a stress-free and exciting trip.", category: "travel" }
];

// Pexels API Key
const API_KEY = 'YOUR_PEXELS_API_KEY'; // Replace with your actual Pexels API key

// Function to fetch a random image from Pexels based on category
async function fetchRandomImage(category, orientation = 'landscape') {
    const url = `https://api.pexels.com/v1/search?query=${category}&per_page=1&orientation=${orientation}&page=${Math.floor(Math.random() * 20) + 1}`;
    const headers = {
        Authorization: API_KEY
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.large2x;
        }
    } catch (error) {
        console.error("Error fetching image:", error);
    }
    return `https://via.placeholder.com/1200x400?text=${category}+Image`; // Fallback image
}

// Function to create and add the latest post card to the DOM
async function createLatestPostCard(post) {
    const imageUrl = await fetchRandomImage(post.category, 'landscape');
    const container = document.getElementById('latest-post-container');
    const cardHtml = `
        <div class="card bg-dark text-white">
            <img src="${imageUrl}" class="card-img" alt="${post.title} Image" style="height: 400px; object-fit: cover;">
            <div class="card-img-overlay d-flex flex-column justify-content-end">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.description}</p>
                <a href="#" class="btn btn-primary mt-2">Read More</a>
            </div>
        </div>
    `;
    container.innerHTML = cardHtml;
}

// Function to create and add a blog post card to the DOM
async function createBlogPostCard(post) {
    const imageUrl = await fetchRandomImage(post.category, 'portrait');
    const cardHtml = `
        <div class="col-md-4 mb-4 blog-post-card" data-category="${post.category}">
            <div class="card">
                <img src="${imageUrl}" class="card-img-top" alt="${post.title} Image">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.description}</p>
                    <a href="#" class="btn btn-primary">Read More</a>
                </div>
            </div>
        </div>
    `;
    return cardHtml;
}

// Function to initialize all blog posts
async function initializeBlogPosts() {
    const latestPost = posts.find(post => post.isLatest);
    if (latestPost) {
        createLatestPostCard(latestPost);
    }

    const regularPosts = posts.filter(post => !post.isLatest);
    const container = document.getElementById('blog-posts-container');
    const promises = regularPosts.map(post => createBlogPostCard(post));
    const cardHtmlArray = await Promise.all(promises);
    container.innerHTML = cardHtmlArray.join('');
}

// Function to handle post filtering
function handlePostFiltering(category) {
    const cards = document.querySelectorAll('.blog-post-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to handle theme toggling
function handleThemeToggle() {
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Function to handle the back-to-top button
window.onscroll = function() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

// Event listeners and initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeBlogPosts();

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Add event listener for theme toggle button
    document.getElementById('theme-toggle').addEventListener('click', handleThemeToggle);

    // Add event listeners for filter buttons
    document.querySelectorAll('.btn[data-category]').forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            handlePostFiltering(category);
        });
    });
});
