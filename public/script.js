document.addEventListener('DOMContentLoaded', () => {
    fetch('/data')
      .then(response => response.json())
      .then(data => {
        // Update the HTML with the fetched data
        const imageElement = document.getElementById('image');
        imageElement.src = data.imageUrl;
  
        const descriptionElement = document.getElementById('description');
        descriptionElement.textContent = data.description;
      })
      .catch(error => {
        console.log('Error:', error);
      });
  });
  