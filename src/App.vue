<template>
  <div id="app">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Welcome to Ascendancy</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list v-if="$store.state.user !== null">
          <md-list-item to="/home">
            <md-icon>book</md-icon>
            <span class="md-list-item-text">Books</span>
          </md-list-item>
          <md-list-item v-on:click="$store.dispatch('logout')">
            <md-icon>logout</md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
        <audioplayer />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import AudioPlayer from "./components/audioplayer.vue";

export default {
  name: "app",
  methods: {
    back() {
      this.$router.back();
    }
  },
  components: {
    audioplayer: AudioPlayer
  },
  mounted: function() {
    this.$store.dispatch("retrieveToken");
    this.$store.dispatch("retrieveLoginStatus");
  },
  computed: {
    api_base_url() {
      return this.$store.state.api_base_url;
    },
    logged_in() {
      return this.$store.state.user !== null;
    },
    username() {
      return this.$store.state.user.username;
    },
    login_status_known() {
      return this.$store.state.login_status_known;
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  top: 0;
  padding-top: 60px;
  height: 100%;
  width: 100%;
}

h1 {
  font-size: 60px;
}

#back {
  float: left;
}

.md-app {
  height: 100%;
}

.audioplayer {
  position: absolute;
  bottom: 100px;
}
</style>
