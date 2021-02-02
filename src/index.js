import axios from "axios";

class App {
  constructor() {
    this.offset = 1;
    this.characters = document.getElementById("lista-personagens");
    this.searchInput = document.getElementById("search-input");
    this.searchButton = document.getElementById("button-search");
    this.indexPage = document.getElementById("index");
    this.principalContent = document.getElementsByClassName(
      "principal-content"
    );

    this.getCharacters();
    this.eventButton();
  }

  eventButton() {
    this.searchButton.onclick = () => this.searchCharacter();
  }

  // loadEvent() {
  //   this.loading = document.querySelector(".spinner-wraper");
  //   this.loading.classList.add("d-none");
  // }

  async getCharacters(character = null) {
    try {
      const url = `http://localhost:3333/characters?offset=${this.ofsset}`;

      if (character !== null) {
        url += `&nameStartsWith=${character}`;
      }
      const result = await axios.get(url);

      this.populate(result.data);
      this.paginate(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  async getCharactersInfo(id) {
    try {
      const url = `http://localhost:3333/characters/${id}`;

      const result = await axios.get(url);

      this.getCharactersInfo(result.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  populate(data) {
    this.characters.innerHTML = "";
    if (data <= 0) {
      this.charactersContent.innerHTML = `<p><i class="fas fa-exclamation-circle"></i> Personagem não encontrado</p>`;
    }

    data.forEach((item) => {
      if (item.thumbnail.path.includes("image_not_available")) {
        const character = `<div class="card m-2" style="width: 200px">
                            <img class="card-img-top img-button" title="${item.name}" data-id="${item.id}" src="./img/marvelo-logo.jpg" alt="">
                            <div class="card-body">
                              <h5 class="card-title text-center text-muted">${item.name}</h5>
                            </div>
                          </div>`;

        this.charactersContent.innerHTML += character;
      } else {
        const character = `<div class="card m-2" style="width: 200px">
                            <img class="card-img-top img-button" title="${item.name}" data-id="${item.id}" src="${item.thumbnail.path}.${item.thumbnail.extension}" alt="">
                            <div class="card-body">
                              <h5 class="card-title text-center text-muted">${item.name}</h5>
                            </div>
                          </div>`;

        this.charactersContent.innerHTML += character;
      }
    });

    for (let image of this.images) {
      image.onclick = (event) => this.getCharacterInfo(event.target.dataset.id);
    }
  }

  paginate(total) {
    document.querySelector(".pagination").innerHTML += "";
    const pages = Math.ceil(total / 100); // math.ceil arredonda para cima
    for (let i = 1; i <= pages; i++) {
      const li = `<li class="page-item"><a class="page-link" href="#" data-page="${i}" >${i}</a></li>`;
      document.querySelector(".pagination").innerHTML += li;
    }
    for (let link of document.getElementsByClassName("page-link")) {
      link.onclick = (event) => {
        const page = event.target.dataset.page;
        this.offset = (parseInt(page) - 1) * 100;
        this.getCharacters();
      };
    }
  }

  charactersInfo() {
    const image = `${data[0].thumbnail.path}.${data[0].thumbnail.extension}`;
    const name = data[0].name;
    let descriptionCharacter = data[0].description;

    if (!descriptionCharacter) {
      descriptionCharacter =
        "Informação não encontrada para esse personagem, tente outro!";
    }

    this.indexPage.innerHTML = `<i class="fas fa-long-arrow-alt-left mr-2"></i> Back to homepage`;
    this.searchInput.parentNode.remove();
    this.principalContent.innerHTML = `<div class="row bg-light rounded-top p-3">
    <div class="col-12 d-flex">
        <div>
          <img src="${image}" height="300" alt="">
        </div>
        <div class="card-body">
          <h2 class="card-title mb-3">${name}</h2><hr>
          <p class="card-text"><span class="font-weight-bold">Description: </span>${description}</p>
        </div>
    </div>
  </div>
  <div class="row bg-light rounded-bottom p-3">
    <p class="col-12 font-weight-bold">Comics: </p>
    <ul class="col-12" id="hqs"></ul>
  </div>`;
  }

  searchCharacter() {
    const name = this.searchInput.value.toLowerCase();
    console.log(name);
  }
}

const app = new App();

app.getCharacters();
