import Vuex from "vuex";
import Vue from "vue";
import router from "./router";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    login_status_known: false,
    api_base_url: "http://localhost:4000/api/v1",
    books: [],
    booksLoaded: false,
    token: "",
    activeMedia: null,
    queuedMedia: [],
  },
  mutations: {
    login(state, user) {
      state.user = user;
    },
    getBooks(state, books) {
      state.books = books;
      state.booksLoaded = true;
    },
    getNewBook(state, book) {
      state.books.push(book);
    },
    getToken(state, token) {
      state.token = token;
    },
    logout(state) {
      state.user = null;
    },
    getNewAudioFiles(state, audioFiles) {
      audioFiles.forEach(audio => {
        state.books.find(book => book.id === audio.book_id).audio.push(audio);
      });
    },
    playAudio(state, audio) {
      state.activeMedia = audio;
    },
    addToQueue(state, audio) {
      state.queuedMedia.push(audio);
    },
    replaceQueue(state, audio) {
      state.queuedMedia = audio;
    }
  },
  actions: {
    retrieveToken(context) {
      fetch(context.state.api_base_url + "/token", { credentials: "include" })
        .then(res => res.json())
        .then(res => context.commit("getToken", res.data.token));
    },
    retrieveBooks(context) {
      fetch(context.state.api_base_url + "/books", { credentials: "include" })
        .then(res => res.json())
        .then(res => context.commit("getBooks", res.data));
    },
    logout(context) {
      fetch(context.state.api_base_url + "/session", {
        credentials: "include",
        method: "DELETE",
        headers: { "x-csrf-token": context.state.token }
      }).then(() => {
        context.commit("logout");
        router.push("/login");
      });
    },
    async retrieveLoginStatus(context) {
      fetch(context.state.api_base_url + "/session", {
        credentials: "include"
      }).then(async function(response) {
        context.state.login_status_known = true;
        if (response.status === 200) {
          let data = await response.json();
          context.commit("login", data.data.user);
          context.dispatch("retrieveBooks");
          router.push("/home");
        } else {
          router.push("/login");
        }
      });
    }
  },
  getters: {
    books: function(state) {
      return state.books;
    },
    audioPlaying: function(state) {
      return state.audioPlaying;
    },
    activeMedia: function(state) {
      return state.activeMedia;
    },
    queuedMedia: function (state) {
      return state.queuedMedia;
    }
  }
});

export default store;
