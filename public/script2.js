document.addEventListener('DOMContentLoaded', () => {
    fetch('/data')
      .then(response => response.json())
      .then(data => {
        // Update the HTML with the fetched data
        const imageElement = document.getElementById('image2');
        imageElement.src = data.imageUrl;
  
        const descriptionElement = document.getElementById('description2');
        descriptionElement.textContent = data.description;
      })
      .catch(error => {
        console.log('Error:', error);
      });
  });
  