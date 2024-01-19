const apiKey = 'KrfQapL62L5UvlKSnVSTCf6sRz58l8pZoGARQSYGbdboUmXCtI';
const secret = 'XrOp57E46Frfv0Yu2bm0CjR8AzCvxhD1uYOD7p64';
const authUrl = 'https://api.petfinder.com/v2/oauth2/token';
const caesUrl = 'https://api.petfinder.com/v2/animals?type=dog';

$.ajax({
  url: authUrl,
  method: 'POST',
  data: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secret}`,
  success: function(data) {
    const accessToken = data.access_token;
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
  },
  error: function(error) {
    console.error('Erro:', error);
  }
});


function createCards(data) {
  const container = document.getElementById('dataGridBody');

  data.animals.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    ['photos','name', 'age', 'gender'].forEach(key => {
      let cardItem = document.createElement('div'); // Altere 'col' para 'cardItem'
      cardItem.className = 'card-item';

      if (key === 'photos' && item[key].length > 0) {
        const img = document.createElement('img');
        img.src = item[key][0].small;
        cardItem.appendChild(img);
      } 
      else {
        const text = document.createElement('p');
        text.textContent = item[key];
        cardItem.appendChild(text);
      }
      card.appendChild(cardItem);
    });

    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Detalhes';
    detailsButton.className = 'btn btn-primary';
    detailsButton.onclick = function() {
      window.location.href = './detalhes.html?id=' + item.id;
      let urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get('id');
    };
    card.appendChild(detailsButton);

    const favButton = document.createElement('button');
    favButton.textContent = 'Adicionar aos Favoritos';
    favButton.className = 'btn btn-secondary';
    favButton.onclick = function() {
      favButton.onclick = function() {
        let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
        favoritos.push(item);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
      
        console.log('Adicionado aos favoritos:', item.id);
      };
    };
    card.appendChild(favButton);

    container.appendChild(card);
  });
}

function createCardsFavoritos(data) {
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('dataGridBodyFavoritos');
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    favoritos.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      Object.keys(item).forEach(key => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';

        if (key === 'photos' && item[key].length > 0) {
          const img = document.createElement('img');
          img.src = item[key][0].small;
          cardItem.appendChild(img);
        } else {
          const text = document.createElement('p');
          text.textContent = item[key];
          cardItem.appendChild(text);
        }
        card.appendChild(cardItem);
      });

      container.appendChild(card);
    });
  });
}

function detalhes() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  console.log(id);
  const url = `https://api.petfinder.com/v2/animals/${id}`;

  $.ajax({
    url: authUrl,
    method: 'POST',
    data: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secret}`,
    success: function(data) {
      const accessToken = data.access_token;
      $.ajax({
        url: url,
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        success: function(data) {
          console.log(data);
          createDetails(data);        
        },
        error: function(error) {
          console.error('Erro:', error);
        }
      });
    },
    error: function(error) {
      console.error('Erro:', error);
    }
  });
}

function createDetails(data) {
  const container = document.getElementById('detalhes');

  const img = document.createElement('img');
  if (data.animal.photos.length > 0) {
    img.src = data.animal.photos[0].large;
  }
  container.appendChild(img);

  const name = document.createElement('h2');
  name.textContent = data.animal.name;
  container.appendChild(name);

  const description = document.createElement('p');
  description.textContent = data.animal.description;
  container.appendChild(description);
}