// valeur page par defaut
let currentPage = 1;

// Récupérez l'élément p par son ID
const pageNumberParagraph = document.getElementById("pageNumber");

// fonction pour update le numero de page
function updatePage() {
  pageNumberParagraph.textContent = "Page : " + currentPage;
}

// boutron precedent
const prevButton = document.getElementById("prev");
prevButton.style.display = "none";
// Gérez le clic sur le bouton "Précédent"
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updatePage();
    request();
  }
});

// boutron suivant
const nextButton = document.getElementById("next");
nextButton.style.display = "none";
// Gérez le clic sur le bouton "Suivant"
nextButton.addEventListener("click", () => {
  currentPage++;
  updatePage();
  request();
});

updatePage();

// requete des films en fonction de la searchbar --> réutilisé pour le passage de page suivante
function request() {
  const valueResearchBar = document.getElementById("valueResearchBar").value;
  // demande requete pour un resultat en FR --> &language=fr-FR&include_image_language=fr,null
  fetch(
    `https://api.themoviedb.org/3/search/movie?query=${valueResearchBar}&api_key=515a4fedb841d248a01f2ce68f01a9a8&page=${currentPage}s&language=fr-FR&include_image_language=fr,null`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      // div texte VIDE
      const resultResearchBar = document.getElementById("resultResearchBar");
      //si la reponse est superieur a 0 alors on genere une map qui integre chaque film
      if (response.results.length > 0) {
        const html = response.results.map((movie) => {
          //genere un lien de limage si elle existe
          const imageUrl =
            movie.poster_path === null
              ? null
              : `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
          //si elle existe mais pas accessible alors remplcé par une div image indisponible
          const imageTag = imageUrl
            ? `<img class="posterMovie" width="150" height="225" src="${imageUrl}" alt="${movie.title}">`
            : '<p class="imgNull">Image indisponible</p>';
          // on retourne le html pour chaque length
          return `
              <div class="movie" id="${movie.id}" onclick="recupererID(this)">
                  ${imageTag}
                <h2>${movie.title}</h2>
              </div>
            `;
        });
        //si on est sur la page un on desactive le bouton precedent
        if (currentPage === 1) {
          prevButton.style.display = "none";
          //sinon on le reactive a partir de la page 2
        } else {
          prevButton.style.display = "inline";
        }
        // garder actif
        nextButton.style.display = "inline";

        resultResearchBar.innerHTML = html.join("");
      } else {
        // si la page suivante est vide desactive le bouton suivant pour empecher d'aller plus loin
        nextButton.style.display = "none";
        resultResearchBar.innerHTML = "Aucun résultat trouvé";
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

//===================================================================

//token d'acces a l'api
const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MTVhNGZlZGI4NDFkMjQ4YTAxZjJjZTY4ZjAxYTlhOCIsInN1YiI6IjY1MzIyYTc0NDgxMzgyMDBjNWUzZjYyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iPAFTZqeRE_VvqZMPM83XlXo4q_i1YqOjaVMJGT2_bE"; // Remplacez "votre-jeton-ici" par votre véritable jeton d'accès
// bouton searchBar qui redefinie la page a 1 pour la requete a chaque nouvelel recherche
document.getElementById("searchBar").addEventListener("click", (event) => {
  event.preventDefault();
  currentPage = 1;
  pageNumberParagraph.textContent = "Page : " + currentPage;

  request();
});
// recupere l'id configuré via le .map quand on clique sur une div et permet donc de realiser une nouvelle requete ciblé sur un film spcifique
function recupererID(element) {
  var id = element.id;
  console.log(id);
  //requete vers un film specifique
  fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=515a4fedb841d248a01f2ce68f01a9a8&language=fr-FR&include_image_language=fr,null`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      // cible la div specificMovie
      const specificMovie = document.getElementById("specificMovie");
      // permet de mettre la reponse dans un tableau pour le .map
      const data = [response];
      // si la valeur recus est superieur a 0 genere un .map
      if (data && data.length > 0) {
        const html = data.map((data) => {
          //verifie si un lien est enregistré dans la requete
          const imageUrl =
            data.backdrop_path === null
              ? null
              : `https://image.tmdb.org/t/p/w500/${data.backdrop_path}`;

          const imageTag = imageUrl
            ? `<img class=""  height="225" src="${imageUrl}" alt="${data.title}">`
            : '<p class="imgNull">Image indisponible</p>';
          // genere la .map
          return `
                <div class="reviewMovie">
                ${imageTag}
                    <h2>${data.title}</h2>
                    <p>${data.overview}</p>
                    <p>date de publication : ${data.release_date}</p>
                </div>
            `;
        });

        specificMovie.innerHTML = html.join("");
      } else {
        specificMovie.innerHTML = "Aucun résultat trouvé";
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
