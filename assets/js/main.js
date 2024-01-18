const apiKey = 'KrfQapL62L5UvlKSnVSTCf6sRz58l8pZoGARQSYGbdboUmXCtI';
const secret = 'XrOp57E46Frfv0Yu2bm0CjR8AzCvxhD1uYOD7p64';
const authUrl = 'https://api.petfinder.com/v2/oauth2/token';
const animalsUrl = 'https://api.petfinder.com/v2/animals?type=dog';

$.ajax({
  url: authUrl,
  method: 'POST',
  data: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${secret}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  success: function(data) {
    const accessToken = data.access_token;
    $.ajax({
      url: animalsUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      success: function(data) {
        const tbody = document.getElementById('dataGridBody');
        console.log('Data:', data);

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
        
          const detailsCell = document.createElement('td');
          const detailsButton = document.createElement('button');
          detailsButton.textContent = 'Details';
          detailsButton.className = 'btn btn-primary';
          detailsButton.onclick = function() {
            console.log('Details button clicked for item:', item);
          };
          detailsCell.appendChild(detailsButton);
          row.appendChild(detailsCell);
        
          tbody.appendChild(row);
        });
      },
      error: function(error) {
        console.error('Error:', error);
      }
    });
  },
  error: function(error) {
    console.error('Error:', error);
  }
});