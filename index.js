document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#locationForm");
  const residentList = document.querySelector("#residentList");
  const body = document.body;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const locationId = document.querySelector("#locationId").value;

    fetch(`https://rickandmortyapi.com/api/location/${locationId}`)
      .then((response) => response.json())
      .then((locationData) => {
        // Cambiar el color de fondo según el criterio especificado
        updateBackgroundColor(locationId);

        // Mostrar información de la localización
        displayLocationInfo(locationData);

        // Obtener los 5 primeros residentes de la localización
        return Promise.all(
          locationData.residents.slice(0, 5).map(fetchCharacterInfo)
        );
      })
      .then((charactersData) => {
        // Mostrar información de los residentes
        displayCharactersInfo(charactersData);
      })
      .catch((error) => console.error("Error:", error));
  });

  function fetchCharacterInfo(characterURL) {
    return fetch(characterURL).then((response) => response.json());
  }

  function displayLocationInfo(locationData) {
    // Mostrar información de la localización
    console.log("Nombre de la localización:", locationData.name);
  }

  function displayCharactersInfo(charactersData) {
    // Limpiar la lista de residentes antes de agregar nuevos elementos
    residentList.innerHTML = "";

    // Mostrar información de los residentes
    charactersData.forEach((character) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <div class="character-container">
          <img src="${character.image}" alt="${character.name}" class="character-image" data-toggle="modal" data-target="#characterModal${character.id}">
          <div class="character-info">
            <h2>${character.name}</h2>
            <p>Status: ${character.status}</p>
            <p>Species: ${character.species}</p>
            <p>Origin: ${character.origin.name}</p>
            <p>Episodes:
              <a href="${character.episode[0]}">Episode 1</a>,
              <a href="${character.episode[1]}">Episode 2</a>,
              <a href="${character.episode[2]}">Episode 3</a>
            </p>
          </div>
        </div>
      `;
      residentList.appendChild(listItem);

      // Agregar eventos de hover y clic a las imágenes
      const characterImage = listItem.querySelector(".character-image");
      characterImage.addEventListener("mouseover", () => {
        characterImage.style.cursor = "pointer";
      });

      characterImage.addEventListener("click", () => {
        // Mostrar el modal al dar clic en la imagen
        $(`#characterModal${character.id}`).modal("show");
      });
    });

    // Agregar modales para cada personaje
    charactersData.forEach((character) => {
      const modalContent = `
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${character.name}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Status: ${character.status}</p>
            <p>Species: ${character.species}</p>
            <p>Origin: ${character.origin.name}</p>
            <p>Episodes:
              <a href="${character.episode[0]}">Episode 1</a>,
              <a href="${character.episode[1]}">Episode 2</a>,
              <a href="${character.episode[2]}">Episode 3</a>
            </p>
          </div>
        </div>
      `;

      const modal = document.createElement("div");
      modal.classList.add("modal", "fade");
      modal.id = `characterModal${character.id}`;
      modal.innerHTML = modalContent;
      document.body.appendChild(modal);
    });
  }

  function updateBackgroundColor(locationId) {
    // Cambiar el color de fondo según el criterio especificado
    if (locationId < 50) {
      body.style.backgroundColor = "green";
    } else if (locationId >= 50 && locationId < 80) {
      body.style.backgroundColor = "blue";
    } else {
      body.style.backgroundColor = "red";
    }
  }
});
