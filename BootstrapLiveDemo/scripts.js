document.addEventListener("DOMContentLoaded", function(event) {
    // Your code to run since DOM is loaded and ready
    document.getElementById("loadWithXHR").addEventListener("click", function(ev) {
        LoadWithXHR();
    })
    document.addEventListener("click", function(ev) {
        if (ev.target.classList.contains('xhr-page')) {
            const page = ev.target.dataset.page;
            console.log(this);
            console.log(page);
            LoadWithXHR(page);
        }
    });
});
    
function LoadWithXHR(page = 1) {
    const limit = document.getElementById("xhrLimit").value;
    const maxLength = document.getElementById("xhrMaxLength").value;
    const url = `https://catfact.ninja/facts?page=${page}&limit=${limit}&max_length=${maxLength}`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.addEventListener("load", reqListener);
    xhr.send();
}

function reqListener() {
  const data = JSON.parse(this.responseText);
  renderFacts("xhrFactsContainer", "xhrPagination", data);

}

function renderFacts(containerId, paginationId, data) {
    const factsContainer = document.getElementById(containerId);
    const pagination = document.getElementById(paginationId);
    factsContainer.innerHTML = "";
    pagination.innerHTML = "";
    console.log(data);
    data.data.forEach(item => {
        const el = document.createElement("div");
        el.classList = "col-3 border";
        el.innerHTML = item.fact;
        factsContainer.appendChild(el)
    });
    data.links.forEach(item => {
        const el = document.createElement("div");
        el.classList = "d-inline-block border xhr-page";
        el.innerHTML = item.label;
        el.dataset.page = item.label;
        pagination.appendChild(el)
    });
}
    // document.getElementById("loadWithXHR").addEventListener("mouseout", function(ev){
    //     // alert("Get Back Here");
        
    //        ev.target.classList.remove("btn-danger");
    // })
    // document.getElementById("loadWithXHR").addEventListener("mouseover", function(ev){
    //        ev.target.classList.add("btn-danger");
    // })

// document.addEventListener("click", function(ev) {
//     // alert("You clicked on the page");
//     // console.log(ev);
// });
