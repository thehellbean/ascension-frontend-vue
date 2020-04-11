<template>
  <div class="add-book-menu">
    <form novalidate class="md-layout" @submit.prevent="validateBook">
      <md-card class="md-layout-item md-size-25 md-small-size-100">
        <md-progress-bar
          v-if="loadingCache || sending"
          md-mode="indeterminate"
        />
        <md-card-header>
          <div class="md-title">Add Book</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-autocomplete
                v-model="bookForm.author"
                :md-options="
                  autoCompleteResults
                    .map(el => el.authors)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    )
                "
                v-on:md-closed="deselect('author')"
                v-on:md-selected="authorSelected($event)"
                v-on:md-changed="authorChanged($event)"
              >
                <label>Author(s)</label>
              </md-autocomplete>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-autocomplete
                v-model="bookForm.title"
                v-on:md-closed="deselect('title')"
                :md-options="autoCompleteResults.map(el => el.title)"
                v-on:md-selected="autocompleteSelected($event, 'title')"
              >
                <label>Title</label>
              </md-autocomplete>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-autocomplete
                v-model="bookForm.isbn"
                v-on:md-closed="deselect('isbn')"
                :md-options="autoCompleteResults.map(el => el.isbn)"
                v-on:md-selected="autocompleteSelected($event, 'isbn')"
              >
                <label>ISBN</label>
              </md-autocomplete>
            </div>
            <div class="md-layout-item md-size-100 md-small-size-100">
              <md-chips id="categories" md-placeholder="Categories"></md-chips>
            </div>
          </div>
        </md-card-content>

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending"
            >Send</md-button
          >
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
export default {
  name: "add-book",
  data() {
    return {
      bookForm: {
        author: "",
        title: "",
        isbn: ""
      },
      loadingCache: false,
      sending: false,
      cachedResults: [],
      autoCompleteResults: []
    };
  },
  methods: {
    deselect(field) {
      if (this.bookForm[field].length > 3 && this.cachedResults.length === 0) {
        let url = new URL(this.$store.state.api_base_url + "/books/isbn");
        url.search = new URLSearchParams({ ...this.bookForm });

        this.loadingCache = true;

        let self = this;
        fetch(url, { credentials: "include" })
          .then(res => res.json())
          .then(res => {
            self.cachedResults = res.data;
            self.cachedResults = self.cachedResults.map(el => {
              el.authors = el.authors.join(", ");
              return el;
            });

            self.autoCompleteResults = self.cachedResults;
            self.loadingCache = false;
          });
      }
    },
    validateBook() {
      for (let key in this.bookForm) {
        if (this.bookForm[key] === "") {
          console.log("Tried to submit invalid value");
          return;
        }
      }

      this.saveBook();
    },
    saveBook() {
      this.sending = true;

      let payload = JSON.stringify({ book: this.bookForm });

      fetch(this.$store.state.api_base_url + "/books", {
        credentials: "include",
        body: payload,
        method: "POST",
        headers: {
          "x-csrf-token": this.$store.state.token,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
        .then(res => res.json())
        .then(res => {
          this.$store.commit("getNewBook", res.data);
          this.sending = false;
        });
    },
    autocompleteSelected(selection, type) {
      let selected_item = this.autoCompleteResults.find(
        el => el[type] === selection
      );
      if (selected_item) {
        this.bookForm.author = selected_item.authors;
        this.bookForm.title = selected_item.title;
        this.bookForm.isbn = selected_item.isbn;
      }
    },
    authorSelected(selection) {
      this.autoCompleteResults = this.cachedResults.filter(
        el => el.authors === selection
      );
    },
    authorChanged(term) {
      if (term === "") {
        this.autoCompleteResults = this.cachedResults;
      }
    }
  }
};
</script>
