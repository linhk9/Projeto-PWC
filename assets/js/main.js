const apiKey = 'KrfQapL62L5UvlKSnVSTCf6sRz58l8pZoGARQSYGbdboUmXCtI';
const secret = 'XrOp57E46Frfv0Yu2bm0CjR8AzCvxhD1uYOD7p64';
const authUrl = 'https://api.petfinder.com/v2/oauth2/token';
const caesUrl = 'https://api.petfinder.com/v2/animals?type=dog';
const caesDetalhesUrl = 'https://api.petfinder.com/v2/animals';

function paginaCorreta(pageName) {
  const url = window.location.href.split('?')[0];
  const parts = url.split('/');
  const currentPage = parts[parts.length - 1];
  return currentPage.startsWith(pageName); 
}

$.ajax({
  url: authUrl,
  method: 'POST',
  data: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secret}`,
  success: function(data) {
    const accessToken = data.access_token;

    if (paginaCorreta('caes')) {
      $.ajax({
        url: caesUrl,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        success: function(data) {    
          createCards(data);
        },
        error: function(error) {
          console.error('Erro:', error);
        }
      });
    } else if (paginaCorreta('favoritos')) {
        const favoritos = JSON.parse(localStorage.getItem('favoritosAtivos'));

        CardsFavoritos(favoritos);
        

    } else if (paginaCorreta('detalhes')) {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      console.log(id);
    
      $.ajax({
        url: caesDetalhesUrl +  '/' + id,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        success: function(data) {
          createDetails(data);        
        },
        error: function(error) {
          console.error('Erro:', error);
        }
      });
    }
  },
  error: function(error) {
    console.error('Erro:', error);
  }
});

function createCards(data) {
  const container = document.getElementById('dataGridBody');

  data.animals.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.alt = '...';
    img.src = item.photos.length > 0 ? item.photos[0].small : '';
    img.onerror = function() {
        this.parentNode.removeChild(this);
    };
    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const text = document.createElement('p');
    text.className = 'card-text';
    text.textContent = item.name + ', ' + item.age + ', ' + item.gender;
    cardBody.appendChild(text);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const detailsButton = document.createElement('a');
    detailsButton.textContent = 'Mais Detalhes';
    detailsButton.className = 'btn btn-sm btn-outline-secondary';
    detailsButton.href = './detalhes.html?id=' + item.id;
    btnGroup.appendChild(detailsButton);

    const favoritesButton = document.createElement('a');
    favoritesButton.textContent = 'Adicionar aos Favoritos';
    favoritesButton.className = 'btn btn-sm btn-outline-secondary';
    favoritesButton.addEventListener('click', function() {
      let favorites = JSON.parse(localStorage.getItem('favoritosAtivos')) || [];
      if (!favorites.some(favorite => favorite.id === item.id)) {
          favorites.push(item);
          localStorage.setItem('favoritosAtivos', JSON.stringify(favorites));
      }
    });
    btnGroup.appendChild(favoritesButton);

    const cardFooter = document.createElement('div');
    cardFooter.className = 'd-flex justify-content-between align-items-center';
    cardFooter.appendChild(btnGroup);

    cardBody.appendChild(cardFooter);
    card.appendChild(cardBody);
    col.appendChild(card);

    container.appendChild(col);
  });
}

function CardsFavoritos(data) {
  const container = document.getElementById('dataGridFavoritos');

  if (data.length === 0) {
    container.textContent = 'Sem favoritos adicionados';
    return;
  }

  console.log(data);
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.alt = '...';
    img.src = item.photos.length > 0 ? item.photos[0].small : '';
    img.onerror = function() {
        this.parentNode.removeChild(this);
    };
    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const text = document.createElement('p');
    text.className = 'card-text';
    text.textContent = item.name + ', ' + item.age + ', ' + item.gender;
    cardBody.appendChild(text);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const detailsButton = document.createElement('a');
    detailsButton.textContent = 'Mais Detalhes';
    detailsButton.className = 'btn btn-sm btn-outline-secondary';
    detailsButton.href = './detalhes.html?id=' + item.id;
    btnGroup.appendChild(detailsButton);

    const favoritesButton = document.createElement('a');
    favoritesButton.textContent = 'Remover dos Favoritos';
    favoritesButton.className = 'btn btn-sm btn-outline-secondary';
    favoritesButton.addEventListener('click', function() {
      const localFavorites = localStorage.getItem('favoritosAtivos');
      let favorites = JSON.parse(localFavorites) || [];
      const index = favorites.findIndex(favorite => favorite.id === item.id);
      if (index !== -1) {
          favorites.splice(index, 1);
          localStorage.setItem('favoritosAtivos', JSON.stringify(favorites));
      }
      location.reload();
    });
    btnGroup.appendChild(favoritesButton);

    const cardFooter = document.createElement('div');
    cardFooter.className = 'd-flex justify-content-between align-items-center';
    cardFooter.appendChild(btnGroup);

    cardBody.appendChild(cardFooter);
    card.appendChild(cardBody);
    col.appendChild(card);

    container.appendChild(col);
  });
}

function createDetails(data) {
  const container = document.getElementById('adotarMain');

  const table = document.querySelector('.table tbody');

  const row = document.createElement('tr');

  const name = document.createElement('td');
  name.textContent = data.animal.name;
  row.appendChild(name);

  const age = document.createElement('td');
  // Assuming data.animal.age exists
  age.textContent = data.animal.age;
  row.appendChild(age);

  const img = document.createElement('td');
  const imgTag = document.createElement('img');
  if (data.animal.photos.length > 0) {
    imgTag.src = data.animal.photos[0].medium;
  }
  img.appendChild(imgTag);
  row.appendChild(img);

  const description = document.createElement('td');
  description.textContent = data.animal.description;
  row.appendChild(description);
  
  table.appendChild(row);
  
  const adoptButton = document.createElement('button');
  adoptButton.textContent = 'Adotar';
  adoptButton.className = 'btn btn-sm btn-outline-secondary';
  adoptButton.addEventListener('click', function() {
    let caesAdotados = JSON.parse(localStorage.getItem('caesAdotados')) || [];
    caesAdotados.push(data.animal);
    localStorage.setItem('caesAdotados', JSON.stringify(caesAdotados));
  });
  
  container.appendChild(adoptButton);
}