import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const inputData = document.querySelector('input');
const container = document.querySelector('div');

const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  container.append(loader);
};

const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
};

form.addEventListener('submit', e => {
  e.preventDefault();
  const userRequest = inputData.value;
  showLoader();
  gallery.innerHTML = '';
  searchImages(userRequest);
});

function searchImages(userRequest) {
  const personalKey = '42271684-72e9093d4988315267462c0c1';
  const url = `https://pixabay.com/api/?key=${personalKey}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      } else {
        return response.json();
      }
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      } else {
        const markup = data.hits
          .map(data => {
            return `<li class="gallery-item"><a href="${data.webformatURL}">
          <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}"></a>
          <p><b>Likes: </b>${data.likes}</p>
          <p><b>Views: </b>${data.views}</p>
          <p><b>Comments: </b>${data.comments}</p>
          <p><b>Downloads: </b>${data.downloads}</p>
          </li>`;
          })
          .join('');
        gallery.insertAdjacentHTML('afterbegin', markup);
        const lightbox = new SimpleLightbox('.gallery a', properties);
        lightbox.on('show.simplelightbox');
        lightbox.refresh();
        form.reset();
      }
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      hideLoader();
    });
}

const properties = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  animation: 250,
};
