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

/*function createTable(data) {
  const tabela = document.getElementById('dataGridBody');

  data.animals.forEach(item => {
    const row = document.createElement('tr');
  
    ['name', 'age', 'gender', 'photos'].forEach(key => {
      const cell = document.createElement('td');
      if (key === 'photos' && item[key].length > 0) {
        const img = document.createElement('img');
        img.src = item[key][0].small;
        cell.appendChild(img);
      } else {
        cell.textContent = item[key];
      }
      row.appendChild(cell);
    });
  
    const detalhesCell = document.createElement('td');
    const btnDetalhes = document.createElement('button');
    btnDetalhes.textContent = 'Detalhes';
    btnDetalhes.className = 'btn btn-primary';
    btnDetalhes.onclick = function() {
      window.location.href = './detalhes.html?id=' + item.id;
    };
    detalhesCell.appendChild(btnDetalhes);
    row.appendChild(detalhesCell);
  
    tabela.appendChild(row);
  });
}*/

function createCards(data) {
  const container = document.getElementById('dataGridBody');

  data.animals.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    ['photos','name', 'age', 'gender'].forEach(key => {
      let col = document.createElement('div');
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
    };
    card.appendChild(detailsButton);

    container.appendChild(card);
  });
}