import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableSubmitBtn,
} from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "703c1021-5311-4b4b-88cc-d36592b73458",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards?.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });

    profileNameEl.textContent = userInfo?.name;
    profileDescriptionEl.textContent = userInfo?.about;
    profileAvatar.src = userInfo?.avatar;
  })
  .catch((error) => console.log(error));

const profileAvatar = document.querySelector(".profile__avatar");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewTitleEl = previewModal.querySelector(".modal__caption");
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close");
const newPostModalSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseButton = deleteModal.querySelector(".modal__close");
const deleteModalCTA = document.querySelector(".modal__button");
const modalCancelBtn = deleteModal.querySelector(".modal__button-two");

let selectedCard, selectedCardId;

avatarFormElement.addEventListener("submit", handleAvatarSubmit);

function handleLike(evt, id) {
  let isLiked = true;

  if (!evt.target.classList.contains("card__like-btn_active")) {
    isLiked = false;
  }

  api
    .changeLikeStatus(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_active");
    })
    .catch((error) => console.log(error));
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

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      document.querySelector(".profile__avatar").src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = "Save";
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
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
  console.log(modal);
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

deleteModal.addEventListener("click", function () {
  closeModal(deleteModal);
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

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
});

editProfileModal.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(editProfileModal);
  }
});

avatarModal.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(avatarModal);
  }
});

newPostModal.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(newPostModal);
  }
});

const addCardFormElement = newPostModal.querySelector(".modal__form");

const nameInput = newPostModal.querySelector("#card-caption-input");
const linkInput = newPostModal.querySelector("#card-link-input");

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

avatarModal.addEventListener("click", () => {});

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
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  const inputValues = {
    name: nameInput.value,
    link: linkInput.value,
  };

  setButtonText(submitButton, true);

  api
    .createCard(inputValues)
    .then((res) => {
      const cardElement = getCardElement(res);
      cardsList.prepend(cardElement);

      addCardFormElement.reset();

      closeModal(newPostModal);
      disableSubmitBtn(submitButton, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
});

enableValidation(settings);

deleteModalCTA.addEventListener("click", (evt) => {
  closeModal(avatarModal);
  deleteModalCTA.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      deleteModalCTA.textContent = "Delete";
      closeModal(deleteModal);
    })
    .catch(console.error);
});

modalCancelBtn.addEventListener("click", (evt) => {
  closeModal(deleteModal);
});
