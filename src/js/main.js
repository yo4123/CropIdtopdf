// Import our custom CSS
import '../scss/styles.scss'
 


// Import all of Bootstrap's JS
 
import Cropper from 'cropperjs'; // Import   cropperjs
import jsPDF from 'jspdf'; // Import  jsPDF




$(document).ready(function() {
    let cropper;
    const image = $('#image')[0];  // Convert to DOM element
    const cropButton = $('#cropButton')[0];  // Convert to DOM element
    const fileInput = $('#fileInput')[0];  // Convert to DOM element
    const saveButton = $('#saveButton')[0]; // Convert to DOM element
   
    const maincroppedcontainer = $('#MaincroppedContainer'); // No es necesario convertirlo

    let fileLoaded = false;

    // Event listener load image
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function() {
                image.src = reader.result;
                if (cropper) {
                    cropper.destroy();
                }
                cropper = new Cropper(image, {
                    aspectRatio: 3 / 2,
                    viewMode: 2,
                    autoCropArea: 1,
                });
                fileLoaded = true;
            }
            reader.readAsDataURL(file);
        } else {
            fileLoaded = false;
            image.src = '';
            if (cropper) {
                cropper.destroy();
            }
        }
    });

   
    cropButton.addEventListener('click', function() {
 
    
        if (!fileLoaded) {
            fileInput.focus();
            return;
        }
    
        const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 300
        });
    
        const croppedImage = new Image();
        croppedImage.src = canvas.toDataURL();
    
        const croppedImageContainer = document.createElement('div');
        croppedImageContainer.classList.add('cropped-image-container');
        croppedImageContainer.appendChild(croppedImage);
        maincroppedcontainer.append(croppedImageContainer);
 
        // add class Bootstrap Icons
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('bi', 'bi-trash3');
    
        // add delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-image-button');
        deleteButton.appendChild(deleteIcon);
    
        // add delete button
        croppedImageContainer.appendChild(deleteButton);

        
    });
    
 

    // delegate delete events
    maincroppedcontainer.on('click', '.delete-image-button', function() {
        const index = $(this).closest('.cropped-image-container').index(); // Obtener el índice del contenedor padre
        deleteImage(index);  
    });

    // Event listener for save button
    saveButton.addEventListener('click', function() {
        const croppedImageContainers = document.querySelectorAll('.cropped-image-container');
        if (croppedImageContainers.length === 0) {
            alert('No hay imágenes para guardar.');
            return;
        }

        const pdf = new jsPDF();

        let x = 50;
        let y = 10;
        const imageWidth = 90;
        const imageHeight = 60;

        croppedImageContainers.forEach(function(container, index) {
            if (index !== 0) {
                y += 110;
            }

            const imgData = container.querySelector('img').src;
            pdf.addImage(imgData, 'JPEG', x, y, imageWidth, imageHeight);
        });

        pdf.save('imagenes.pdf');
    });

    // Function delete image
function deleteImage(index) {
    $('.cropped-image-container').eq(index).remove();  
    
    // add icon to delete button
    const deleteIcon = $('<i>').addClass('bi bi-trash3');
    const deleteButton = $('<button>').addClass('delete-image-button').append(deleteIcon);
    
    // add  delete button
    $('.cropped-image-container').eq(index).append(deleteButton);
}

});
