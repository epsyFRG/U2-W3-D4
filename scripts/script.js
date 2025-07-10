// Richiesta di esempio (non usata realmente per mostrare immagini)
fetch("https://api.pexels.com/v1/search?query=nature", {
  headers: {
    Authorization: "kLnZyp79Kv2SPVOvmbrlrkhbgErHpSIbpVdK7z",
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })

// Quando la pagina è pronta...
document.addEventListener("DOMContentLoaded", function () {
  // Seleziono i bottoni e il contenitore delle immagini
  const loadBtn = document.getElementById("load-images-btn") // Bottone "Load Images"
  const imagesRow = document.getElementById("images-row") // Contenitore delle card
  const loadSecondaryBtn = document.getElementById("load-secondary-images-btn") // Bottone "Load Secondary Images"
  console.log("Bottone secondary:", loadSecondaryBtn)
  const searchForm = document.getElementById("search-form") // Form di ricerca
  const searchInput = document.getElementById("search-input") // Campo di ricerca

  // Funzione che carica le immagini da Pexels (se funzionasse da browser)
  function loadImagesFromQuery(query) {
    fetch(`https://api.pexels.com/v1/search?query=${query}`, {
      headers: {
        Authorization: "kLnZyp79Kv2SPVOvmbrlrkhbgErHpSIbpVdK7z",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        imagesRow.innerHTML = "" // Svuoto il contenitore
        // Per ogni foto ricevuta...
        data.photos.forEach((photo) => {
          // Creo la card con tutti i dati e bottoni
          imagesRow.innerHTML += `
            <div class="col-md-4">
              <div class="card mb-4 shadow-sm h-100">
                <img src="${
                  photo.src.medium
                }" class="bd-placeholder-img card-img-top w-100 h-100 img-detail-link" style="object-fit:cover; min-height:200px; max-height:400px; cursor:pointer;" data-img="${encodeURIComponent(
            photo.src.large
          )}" data-artist="${encodeURIComponent(
            photo.photographer
          )}" data-artisturl="${encodeURIComponent(photo.photographer_url)}" />
                <div class="card-body">
                  <h5 class="card-title artist-detail-link" style="cursor:pointer;" data-img="${encodeURIComponent(
                    photo.src.large
                  )}" data-artist="${encodeURIComponent(
            photo.photographer
          )}" data-artisturl="${encodeURIComponent(photo.photographer_url)}">${
            photo.photographer
          }</h5>
                  <p class="card-text">ID: ${photo.id}</p>
                  <a href="${
                    photo.url
                  }" target="_blank" class="btn btn-primary btn-sm">Vedi su Pexels</a>
                  <button type="button" class="btn btn-sm btn-outline-success btn-view" data-img="${
                    photo.src.large
                  }">View</button>
                  <button type="button" class="btn btn-sm btn-outline-danger btn-hide">Hide</button>
                </div>
                <div class="card-footer text-muted text-end">${photo.id}</div>
              </div>
            </div>
          `
        })
        // Aggiungo la funzionalità "Hide" a tutti i bottoni corrispondenti
        const hideButtons = imagesRow.querySelectorAll(".btn-hide")
        hideButtons.forEach((btn) => {
          btn.addEventListener("click", function () {
            const card = btn.closest(".col-md-4") // Trova la card più vicina
            if (card) card.remove() // Rimuove la card
          })
        })
        // Aggiungo la funzionalità di dettaglio a immagine e nome artista
        const imgLinks = imagesRow.querySelectorAll(".img-detail-link")
        const artistLinks = imagesRow.querySelectorAll(".artist-detail-link")
        function goToDetail(e) {
          // Prendo i dati dalla card
          const img = e.target.getAttribute("data-img")
          const artist = e.target.getAttribute("data-artist")
          const artistUrl = e.target.getAttribute("data-artisturl")
          // Apro la pagina di dettaglio passando i dati nell'URL
          window.location.href = `detail.html?img=${img}&artist=${artist}&artistUrl=${artistUrl}`
        }
        imgLinks.forEach((img) => img.addEventListener("click", goToDetail))
        artistLinks.forEach((link) =>
          link.addEventListener("click", goToDetail)
        )
        // Modale per visualizzare l'immagine grande
        if (!document.getElementById("imgModal")) {
          const modalHtml = `
            <div class="modal fade" id="imgModal" tabindex="-1" aria-labelledby="imgModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="imgModalLabel">Immagine</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body text-center">
                    <img id="modal-img" src="" alt="Immagine" class="img-fluid" style="max-height:70vh; object-fit:contain;" />
                  </div>
                </div>
              </div>
            </div>
          `
          document.body.insertAdjacentHTML("beforeend", modalHtml)
        }
        // Aggiungo la funzionalità "View" a tutti i bottoni corrispondenti
        const viewButtons = imagesRow.querySelectorAll(".btn-view")
        viewButtons.forEach((btn) => {
          btn.addEventListener("click", function () {
            const imgUrl = btn.getAttribute("data-img") // Prendo l'url dell'immagine grande
            const modalImg = document.getElementById("modal-img")
            modalImg.src = imgUrl // Metto l'immagine nel modale
            const modal = new bootstrap.Modal(
              document.getElementById("imgModal")
            )
            modal.show() // Apro il modale
          })
        })
      })
  }

  // Quando clicchi su "Load Images" carica immagini di criceti
  loadBtn.addEventListener("click", function (e) {
    e.preventDefault()
    loadImagesFromQuery("hamsters")
  })

  // Quando clicchi su "Load Secondary Images" carica immagini di tigri
  loadSecondaryBtn.addEventListener("click", function (e) {
    e.preventDefault()
    console.log("Hai cliccato su Load Secondary Images")
    loadImagesFromQuery("tigers")
  })

  // Filtro locale delle card in base al nome
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault()
    const query = searchInput.value.trim().toLowerCase()

    // Se il campo è vuoto, mostra tutte le card
    if (!query) {
      document.querySelectorAll("#images-row .col-md-4").forEach((card) => {
        card.style.display = ""
      })
      return
    }

    // Filtra le card in base al nome
    document.querySelectorAll("#images-row .col-md-4").forEach((card) => {
      const photographer = card
        .querySelector(".card-title")
        .textContent.toLowerCase()
      if (photographer.includes(query)) {
        card.style.display = ""
      } else {
        card.style.display = "none"
      }
    })
  })
})
