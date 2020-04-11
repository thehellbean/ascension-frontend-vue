import VueRouter from "vue-router";
import Login from "./components/login.vue";
import Home from "./components/home.vue";
import Book from "./components/book.vue";

const routes = [
  { path: "/login", component: Login, name: "login" },
  { path: "/home", component: Home, name: "home" },
  { path: "/book/:id", component: Book, name: "book" }
];

const router = new VueRouter({
  routes
});

export default router;
