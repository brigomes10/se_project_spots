import "./index.css";

import { data, info } from "autoprefixer";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../../scripts/validation.js";
import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Golden Gate Bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
// ];
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "703c1021-5311-4b4b-88cc-d36592b73458",
    "Content-Type": "application/json",
  },
});

api.getAppInfo().then(([cards, userInfo]) => {
  console.log(cards);
  cards.forEach((item) => {
    const cardEl = getCardElement(item);
    cardsList.append(cardEl);
  });

  console.log(userInfo);
});

// Profile elements
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// Edit Form Elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close");
const editSubmitBtn = editProfileModal.querySelector(".modal__submit-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

// Preview Modal Elements
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewTitleEl = previewModal.querySelector(".modal__caption");

// Avatar Form Element
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const selectedCard = document.querySelector(".modal__button");
const selectedCardId = document.querySelector(".modal__button-two");

avatarFormElement.addEventListener("submit", handleAvatarSubmit);

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  let cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  //const cardCaptionEl = previewModal.querySelector("modal_caption");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  //cardCaptionEl.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_active");
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard();
    //cardElement = null;
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewTitleEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeModal(newPostModal);
    closeModal(editProfileModal);
    closeModal(previewModal);
  }
}

// TODO- Finish avatar submission handler
function handleAvatarSubmit(event) {
  event.preventDefault();
  console.log(avatarInput.value);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {})
    .catch(console.error);
  console.log(data.avatar);
  // TODO- Make this work(set src of avatar image)
}

function handleDeleteCard(element, data) {
  selectedCard = element;
  selectedCardId = data;
  openModal(deleteModal);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keyup", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");

  const form = modal.querySelector("form");
  form.reset();
  resetValidation(form);

  document.removeEventListener("keydown", handleEscapeKey);
}

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );

  openModal(editProfileModal);
});

const submitButton = document.getElementById("mySubmitButton");
submitButton.disabled = false;

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

editProfileForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      // TODO- Use data argument instead of the input values
      profileNameEl.textContent = editProfileNameInput.value;
      profileDescriptionEl.textContent = editProfileDescriptionInput.value;
      closeModal(editProfileModal);
    })
    .catch(console.error);
});

editProfileModal.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(editProfileModal);
  }
});

// New Post
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

newPostModal.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(newPostModal);
  }
});

const addCardFormElement = newPostModal.querySelector(".modal__form");

// Card Inputs
const nameInput = newPostModal.querySelector("#card-caption-input");
const linkInput = newPostModal.querySelector("#card-link-input");

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModal.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(previewModal);
  }

  addCardFormElement.addEventListener("submit", function (evt) {
    evt.preventDefault();
    // resetValidation(addCardFormElement, [nameInput, linkInput], settings);
    const inputValues = {
      name: nameInput.value,
      link: linkInput.value,
    };

    addCardFormElement.reset();

    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);

    closeModal(newPostModal);
    // resetValidation(addCardFormElement);
    disableSubmitBtn(newPostSubmitBtn);
  });
});

enableValidation(settings);
