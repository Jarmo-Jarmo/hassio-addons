const siteList = document.getElementById('siteList');
const addSiteBtn = document.getElementById('addSiteBtn');
const siteModal = document.getElementById('siteModal');
const siteForm = document.getElementById('siteForm');
const modalTitle = document.getElementById('modalTitle');

const siteName = document.getElementById('siteName');
const siteUrl = document.getElementById('siteUrl');
const siteTimer = document.getElementById('siteTimer');
const siteLastVisited = document.getElementById('siteLastVisited');
const siteIcon = document.getElementById('siteIcon');
const siteId = document.getElementById('siteId');

let sites = [];

// --- Helper Functions ---
function openModal(editSite = null) {
    siteModal.classList.remove('hidden');
    if (editSite) {
        modalTitle.textContent = 'Edit Site';
        siteId.value = editSite.id;
        siteName.value = editSite.name;
        siteUrl.value = editSite.url;
        siteTimer.value = editSite.timerHours;
        siteLastVisited.value = editSite.lastVisited || 0;
        siteIcon.value = editSite.icon || '';
    } else {
        modalTitle.textContent = 'Add Site';
        siteForm.reset();
        siteId.value = '';
    }
}

function closeModal() {
    siteModal.classList.add('hidden');
}

function fetchSites() {
    fetch('/sites')
        .then(res => res.json())
        .then(data => {
            sites = data;
            renderSites();
        });
}

function renderSites() {
    const now = Math.floor(Date.now() / 1000);
    // Calculate time left for each site
    sites.forEach(site => {
        const elapsed = now - (site.lastVisited || 0);
        site.timeLeft = Math.max(site.timerHours * 3600 - elapsed, 0);
    });

    // Sort: ready now first, then ascending time left
    sites.sort((a, b) => a.timeLeft - b.timeLeft);

    siteList.innerHTML = '';
    sites.forEach(site => {
        const li = document.createElement('li');
        li.className = site.timeLeft === 0 ? 'ready' : 'locked';
        li.innerHTML = `
            <img src="${site.icon || 'icons/icon-192.png'}" alt="${site.name}" class="site-icon">
            <span class="site-name">${site.name}</span>
            <span class="timer">${formatTime(site.timeLeft)}</span>
            <button class="editBtn" data-id="${site.id}">Edit</button>
            <button class="deleteBtn" data-id="${site.id}">Delete</button>
        `;
        siteList.appendChild(li);
    });
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

function saveSite(e) {
    e.preventDefault();
    const payload = {
        name: siteName.value,
        url: siteUrl.value,
        timerHours: parseInt(siteTimer.value),
        lastVisited: parseInt(siteLastVisited.value) || 0,
        icon: siteIcon.value
    };

    let method = 'POST';
    let url = '/sites';
    if (siteId.value) {
        payload.id = parseInt(siteId.value);
        url = `/sites/${payload.id}`;
        method = 'DELETE'; // Will delete first then POST new? Or update backend supports conflict handling
    }

    fetch('/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(() => {
        fetchSites();
        closeModal();
    });
}

function deleteSite(id) {
    fetch(`/sites/${id}`, { method: 'DELETE' })
        .then(() => fetchSites());
}

// --- Event Listeners ---
addSiteBtn.addEventListener('click', () => openModal());
document.getElementById('cancelBtn').addEventListener('click', closeModal);

siteForm.addEventListener('submit', saveSite);

siteList.addEventListener('click', e => {
    if (e.target.classList.contains('editBtn')) {
        const id = parseInt(e.target.dataset.id);
        const site = sites.find(s => s.id === id);
        openModal(site);
    }
    if (e.target.classList.contains('deleteBtn')) {
        const id = parseInt(e.target.dataset.id);
        deleteSite(id);
    }
});

// --- Initial Load ---
fetchSites();
setInterval(renderSites, 1000); // update countdown timers every second

// Optional: register service worker for push notifications
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
