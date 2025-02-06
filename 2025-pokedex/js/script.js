let pokemonRepository = (function () {
  let pokemonList = [];
  let modalContainer = document.querySelector('#modal-container');
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';


  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }


  function getAll() {
    return pokemonList;
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      showModal( pokemon.name, 
        "Height: " + pokemon.height, 
      pokemon.imageUrl);
    });
  }

  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listpokemon = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("button-class");
    listpokemon.appendChild(button);
    pokemonList.appendChild(listpokemon);
    listenForClick(button,pokemon);
  }

  function showModal(name, height, image) {
    modalContainer.innerText = '';
    let modal = document.createElement('div')
    modal.classList.add('modal');
    let closeButtonElement = document.createElement('button');
    
      closeButtonElement.classList.add('modal-close');
      closeButtonElement.innerText = 'Close';
      closeButtonElement.addEventListener('click', hideModal);

      let pokemonName = document.createElement('h1');
      pokemonName.innerText = name;
      let pokemonHeight = document.createElement('p');
      pokemonHeight.innerText = height;
      let pokemonImage = document.createElement('img');

      pokemonImage.setAttribute('src', image);
      pokemonImage.setAttribute('width', '100%');
      pokemonImage.setAttribute('height', '100%');

      modal.appendChild(closeButtonElement);
      modal.appendChild(pokemonName);
      modal.appendChild(pokemonHeight);
      modal.appendChild(pokemonImage);
      modalContainer.appendChild(modal);

      modalContainer.classList.add('is-visible');
     
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();
    }
  });


  modalContainer.addEventListener('click', (e) => {
    let target = e.target;
    if(target  === modalContainer){
    hideModal();
  } 
  });
    
    function hideModal() {
      modalContainer.classList.remove('is-visible');
    }

   function listenForClick(button, pokemon) {
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });
   }

  function loadList() {
   let loading = showLoadingMessage();
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        let pokemon = {
          name: item.name,
          detailsUrl:item.url,
        };
        hideLoadingMessage(loading);
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
      hideLoadingMessage(loading); 
    })
  }

  function loadDetails(pokemon) {
    //First we show loading message
    let loading = showLoadingMessage();
    let url = pokemon.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      //Now we add details to the item
      pokemon.imageUrl = details.sprites.front_default;
      pokemon.height = details.height;
      hideLoadingMessage(loading);
    }).catch(function (e) {
      hideLoadingMessage(loading);
      console.error(e);
    });
  }
  
  function showLoadingMessage()  {
    let loading = document.createElement("div");
    loading.classList.add("loading");
    document.body.appendChild(loading);
    return loading;
  }

  function hideLoadingMessage(loading) {
    loading.remove();
  }




  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

pokemonRepository.loadList().then(function() {
    //now the list is loaded
    pokemonRepository.getAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
});



