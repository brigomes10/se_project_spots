import "./index.css";

import { data, info } from "autoprefixer";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
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

api.getInitialCards().then((cards) => {
  console.log(cards);
});

api.getAppInfo().then(([cards, userInfo]) => {
  cards?.forEach((item) => {
    const cardEl = getCardElement(item);
    cardsList.append(cardEl);
  });

  profileNameEl.textContent = userInfo?.name;
  profileDescriptionEl.textContent = userInfo?.about;
  profileAvatar.src = userInfo?.avatar;
});

// Profile elements
const profileAvatar = document.querySelector(".profile__avatar");
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
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseButton = deleteModal.querySelector(".modal__close");
const deleteModalCTA = document.querySelector(".modal__button");
const modalCancelBtn = deleteModal.querySelector(".modal__button-two");

// const selectedCardId = document.querySelector(".modal__button-two");

let selectedCard, selectedCardId;

avatarFormElement.addEventListener("submit", handleAvatarSubmit);

function handleLike(evt, id) {
  let isLiked = true;
  if (evt.target.classList.contains("card__like-btn_active")) {
    evt.target.classList.toggle("card__like-btn_active");
  } else {
    isLiked = false;
    evt.target.classList.toggle("card__like-btn_active");
  }
  api.changeLikeStatus(id, isLiked).then((res) => {});
}

function handleImageClick(data) {
  previewImageEl.src = data.link;
  previewImageEl.alt = data.name;
  previewTitleEl.textContent = data.name;
  openModal(previewModal);
}

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  const cardCaptionEl = previewModal.querySelector("modal_caption");

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_active");
  }

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => handleImageClick(data));

  return cardElement;
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeModal(newPostModal);
    closeModal(editProfileModal);
    closeModal(previewModal);
    closeModal(avatarModal);
    closeModal(deleteModal);
  }
}

function handleAvatarSubmit(event) {
  event.preventDefault();
  console.log(avatarInput.value);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {})
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then((data) => {
      selectedCard.remove();
      closeModal();
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keyup", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
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

deleteModalCloseButton.addEventListener("click", function () {
  closeModal(deleteModal);
});

avatarModalBtn.addEventListener("click", (evt) => {
  openModal(avatarModal);
});

avatarModal.addEventListener("click", function (event) {
  if (event.target.classList.contains(".modal__form")) {
    closeModal(avatarModal);
  }
});

editProfileForm.addEventListener("submit", function (evt) {
  evt.preventDefault();
  console.log(evt.target);
  // submitButton.textContent = "Saving...";
  console.log("Saving...");
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;

      const form = editProfileModal.querySelector("form");
      form.reset();
      resetValidation(form);

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
    });
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

avatarCloseBtn.addEventListener("click", (evt) => {
  closeModal(avatarModal);
});

previewModal.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(previewModal);
  }
});

addCardFormElement.addEventListener("submit", function (evt) {
  evt.preventDefault();
  console.log(evt.target);
  // submitButton.textContent = "Saving...";
  console.log("Saving...");
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  const inputValues = {
    name: nameInput.value,
    link: linkInput.value,
  };

  addCardFormElement.reset();

  submitButton.textContent = "Saving...";

  api
    .createCard(inputValues)
    .then((res) => {
      const cardElement = getCardElement(res);
      cardsList.prepend(cardElement);
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;

      const form = editProfileModal.querySelector("form");
      form.reset();
      resetValidation(form);

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
    });
  console.log("submitting new Post Modal");
});

closeModal(newPostModal);
enableValidation(settings);

deleteModalCTA.addEventListener("click", () => {
  api.deleteCard(selectedCardId).then((res) => {
    selectedCard.remove();
  });

  closeModal(deleteModal);
});

modalCancelBtn.addEventListener("click", (evt) => {
  closeModal(deleteModal);
});
