class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "703c1021-5311-4b4b-88cc-d36592b73458",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
