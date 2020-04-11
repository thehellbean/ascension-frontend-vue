<template>
  <div class="book-cards">
    <md-card
      md-with-hover
      v-for="book in books"
      v-bind:key="book.id"
      v-on:click.native="focusBook(book)"
    >
      <md-ripple>
        <md-card-header>
          <div class="md-title">{{ book.title }}</div>
          <div class="md-subhead">{{ book.author }}</div>
        </md-card-header>

        <md-card-content>
        </md-card-content>
      </md-ripple>
    </md-card>
    <br />
    <md-button
      v-on:click="showAddBook = !showAddBook"
      class="md-icon-button md-raised md-primary"
      id="add-book"
    >
      <transition name="fade">
        <md-icon class="button-icon" key="more" v-if="!showAddBook"
          >add</md-icon
        >
        <md-icon class="button-icon" key="less" v-else>expand_less</md-icon>
      </transition>
    </md-button>

    <transition name="book-menu-transition">
      <add-book v-if="showAddBook"></add-book>
    </transition>
  </div>
</template>

<script>
import AddBook from "./add-book.vue";

export default {
  name: "home",
  data() {
    return {
      showAddBook: false
    };
  },
  components: {
    "add-book": AddBook
  },
  computed: {
    api_base_url() {
      return this.$store.state.api_base_url;
    },
    books() {
      return this.$store.state.books;
    }
  },
  methods: {
    focusBook(book) {
      this.$router.push("/book/" + book.id);
    },
    addBook() {}
  }
};
</script>

<style lang="scss" scoped>
.book-cards {
  text-align: left;
}

.md-card {
  max-width: 20%;
  margin: 4px;
  display: inline-block;
  vertical-align: top;

  .md-ripple {
    padding-left: 8px;
    padding-right: 8px;
  }
}

#add-book {
  margin-top: 15px;
}

.book-menu-transition-enter-active {
  transition: all 0.4s ease;
}

.book-menu-transition-leave-active {
  transition: all 0.4s ease;
}

.book-menu-transition-enter,
.book-menu-transition-leave-to {
  transform: translateY(-200px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.button-icon {
  position: absolute;
  left: -12px;
  top: -12px;
}
</style>
