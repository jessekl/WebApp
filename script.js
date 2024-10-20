const routeForm = document.getElementById('route-form');
const destinationInput = document.getElementById('destination');
const start = [65.00849587940017, 25.494293018734233];
const getLocation = document.getElementById('get-location');

const map = L.map('map').setView(start, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
}).addTo(map);

class RouteManager {
  constructor() {
    this.routeLayer = null;
  }

  // Need this for refreshing the route
  addRoute(route) {
    if (this.routeLayer) {
      map.removeLayer(this.routeLayer);
    }
    this.routeLayer = L.polyline(route, { color: 'blue' }).addTo(map);
    map.fitBounds(this.routeLayer.getBounds());
  }
}
const routeManager = new RouteManager();

async function fetchRouteData(destination) {
  const startLocation = [65.00849587940017, 25.494293018734233];
  const url = `https://router.project-osrm.org/route/v1/driving/${startLocation[1]},${startLocation[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
  } catch (error) {
    console.error(error);
    alert('Failed to fetch route data. Please try again.');
    throw error;
  }
}

// route submit
routeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const destination = destinationInput.value.split(',').map(Number);
  if (destination.length !== 2 || isNaN(destination[0]) || isNaN(destination[1])) {
    alert('Please enter a valid destination latitude and longitude.');
    return;
  }

  try {
    const route = await fetchRouteData(destination);
    routeManager.addRoute(route);
  } catch (error) {
    console.error(error);
  }
});
// User location
getLocation.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const start = [position.coords.latitude, position.coords.longitude];
      destinationInput.value = `${position.coords.latitude},${position.coords.longitude}`;
    }, error => {
      alert('Unable to retrieve your location.');
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function () {
    const target = this.getAttribute('href').substring(1);

    document.querySelectorAll('main > section').forEach(section => section.classList.add('hidden'));

    const targetSection = document.getElementById(target);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }
    if (target === 'route-finder') {
      map.invalidateSize();
    }
  });
});

class FeaturedProjectCarousel {
  constructor(articleContainer) {
    this.articles = articleContainer;
    this.projects = [];
    this.currentIndex = 0;

    document.getElementById('prev').addEventListener('click', () => this.navigateTo('prev'));
    document.getElementById('next').addEventListener('click', () => this.navigateTo('next'));

    this.fetchRepos();
  }

  async fetchRepos() {
    try {
      const response = await fetch(`https://api.github.com/users/jessekl/repos`);
      const data = await response.json();
      await Promise.all(data.map(repo => this.fetchRepoReadme(repo)));
    } catch (error) {
      console.error('Error fetching repository information:', error);
      alert('Error fetching repository information.');
    }
    this.updateVisibility();
  }

  async fetchRepoReadme(repo) {
  try {
    if (!repo.contents_url) return;

    const response = await fetch(repo.contents_url.replace('{+path}', 'README.md'));
    const readmeData = await response.json();
    const markdownContent = atob(readmeData.content);
    const htmlContent = markdownContent.replace(/^# (.*)$/gm, '<h1>$1</h1>')
                                       .replace(/^## (.*)$/gm, '<h2>$1</h2>')
                                       .replace(/^### (.*)$/gm, '<h3>$1</h3>')
                                       .replace(/^(.*)$/gm, '<p>$1</p>')
                                       .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
                                       .replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>');
    const article = document.createElement('article');
    article.innerHTML = `
      <h2><a href="${repo.html_url}">${repo.full_name}</a></h2>
      <div class="readme">${htmlContent}</div>
    `;
    this.articles.appendChild(article);
    this.projects.push(article);
  } catch (error) {
    console.error(`Error fetching README file for ${repo.full_name}:`, error);
  }
}

  navigateTo(direction) {
    if (this.projects.length > 0) {
      this.currentIndex = (this.currentIndex + (direction === 'next' ? 1 : -1) + this.projects.length) % this.projects.length;
      this.updateVisibility();
    }
  }

  updateVisibility() {
    this.projects.forEach((project, index) => project.classList.toggle('hidden', index !== this.currentIndex));
    if (this.projects.length > 0) {
      document.getElementById('featured-project').classList.remove('hidden');
    } else {
      document.getElementById('featured-project').classList.add('hidden');
    }
  }
}

new FeaturedProjectCarousel(document.getElementById('article-container'));
