<template>
  <div>
    <p>{{ message }}</p>
    <input v-model="username" type="text" placeholder="Username" />
    <br />
    <input v-model="password" type="text" placeholder="Password" />
    <br />
    <button v-on:click="login">Login</button>
  </div>
</template>

<script>
export default {
  name: "login",
  data: function() {
    return {
      message: "",
      username: "",
      password: ""
    };
  },
  computed: {
    api_base_url: function() {
      return this.$store.state.api_base_url;
    }
  },
  methods: {
    login: function() {
      var self = this;
      fetch(self.api_base_url + "/session", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "x-csrf-token": self.$store.state.token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: self.username,
          password: self.password
        })
      }).then(function(response) {
        if (response.status === 200) {
          response.json().then(data => {
            self.$store.commit("login", data.data);
            self.$store.dispatch("retrieveBooks");
          });
          self.$router.push("/home");
        } else {
          response.json().then(body => (self.message = body.errors.detail));
        }
      });
    }
  }
};
</script>
