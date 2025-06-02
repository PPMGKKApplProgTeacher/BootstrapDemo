document.addEventListener("DOMContentLoaded", function(event) {
    // Your code to run since DOM is loaded and ready
    document.getElementById("loadFetchFacts").addEventListener("click",function(e){
        loadFetchFacts();
    },false);
    document.getElementById("loadWithXHR").addEventListener("click",function(e){
        loadXHRFacts();
    },false);

    const fields = [
      document.getElementById('exampleFormControlInput1'),
      document.getElementById('inputPassword5'),
      document.getElementById('select'),
      document.getElementById('exampleFormControlTextarea1')
    ];

    const progressBar = document.querySelector('.progress-bar');
    const totalFields = fields.length;
    let filled = new Set();

    function updateProgress() {
      let completedCount = 0;
      filled.clear(); // Reset and recalculate
      fields.forEach((field, i) => {
        if (field.value && field.value.trim() !== '') {
          filled.add(i);
        }
      });
      completedCount = filled.size;
      const percent = (completedCount / totalFields) * 100;
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${Math.round(percent)}%`;
    }

    // Attach listeners to all fields
    fields.forEach(field => {
      const eventType = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventType, updateProgress);
    });
});

  
  function renderFacts(containerId, paginationId, data, loaderFunc, limit, maxLength) {
    const factsContainer = document.getElementById(containerId);
    const pagination = document.getElementById(paginationId);
    factsContainer.innerHTML = '';
    pagination.innerHTML = '';

    // Render fact cards
    data.data.forEach(item => {
      const col = document.createElement('div');
      col.className = 'col-md-3';
      col.innerHTML = `
        <div class="border p-3 bg-white shadow-sm rounded">
          ${item.fact}
        </div>`;
      factsContainer.appendChild(col);
    });

    // Render pagination buttons
    data.links.forEach(link => {
      if (link.url !== null) {
        const btn = document.createElement('button');
        btn.className = `btn btn-sm ${link.active ? 'btn-dark' : 'btn-outline-secondary'}`;
        btn.textContent = link.label;
        btn.onclick = () => {
          const url = new URL(link.url);
          const page = url.searchParams.get("page");
          loaderFunc(parseInt(page), limit, maxLength);
        };
        pagination.appendChild(btn);
      }
    });
  }

  // FETCH IMPLEMENTATION
  function loadFetchFacts(page = 1) {
    const limit = document.getElementById('fetchLimit').value;
    const maxLength = document.getElementById('fetchMaxLength').value;
    const url = `https://catfact.ninja/facts?page=${page}&limit=${limit}&max_length=${maxLength}`;

    fetch(url)
      .then(response => response.json())
      .then(data => renderFacts('fetchFactsContainer', 'fetchPagination', data, loadFetchFacts, limit, maxLength))
      .catch(error => console.error('Fetch error:', error));
  }

  // XHR IMPLEMENTATION
  function loadXHRFacts(page = 1) {
    const limit = document.getElementById('xhrLimit').value;
    const maxLength = document.getElementById('xhrMaxLength').value;
    const url = `https://catfact.ninja/facts?page=${page}&limit=${limit}&max_length=${maxLength}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        renderFacts('xhrFactsContainer', 'xhrPagination', data, loadXHRFacts, limit, maxLength);
      } else {
        console.error('XHR error:', xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error('XHR request failed');
    };
    xhr.send();
  }