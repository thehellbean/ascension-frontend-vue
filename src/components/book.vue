<template>
  <div v-if="book">
    <h2>{{ book.author }}</h2>
    <h2>{{ book.title }}</h2>

    <p
      class="audio"
      v-for="audio in book.audio"
      v-bind:key="audio.id"
      v-on:click="playAudio(audio)"
    >
      {{ audio.title }}
    </p>

    <md-field>
      <md-file
        v-on:md-change="setAudioUpload($event)"
        accept="audio/*"
        placeholder="Upload audio files"
        multiple
      />
    </md-field>
    <md-button type="submit" class="md-primary" v-on:click="upload($event)">
      Send
    </md-button>
  </div>
</template>

<script>
function audioToObject(api_base, audio) {
      let audioObject = {
        path:
          api_base + 
          "/books/" +
          audio.book_id +
          "/audio/" +
          audio.id,
        title: audio.title,
        progress: audio.progress
      };

    return audioObject;
}

export default {
  name: "book",
  data() {
    return {
      audioUpload: null
    };
  },
  methods: {
    upload(e) {
      e.preventDefault();
      let data = new FormData();
      for (const file of this.audioUpload) {
        data.append("audio[]", file);
      }
      fetch(
        this.$store.state.api_base_url +
          "/books/" +
          this.$route.params.id +
          "/audio",
        {
          body: data,
          method: "POST",
          credentials: "include",
          headers: { "x-csrf-token": this.$store.state.token }
        }
      )
        .then(result => result.json())
        .then(audio => this.$store.commit("getNewAudioFiles", audio.data));
    },
    setAudioUpload(fileList) {
      this.audioUpload = [...fileList];
    },
    playAudio(audio) {
      let audioObject = audioToObject(this.$store.state.api_base_url, audio);
      let audioIndex = this.book.audio.indexOf(audio);
      let followingAudio = this.book.audio.filter((_, index) => index >= audioIndex); 
        let followingAudioObjects = followingAudio.map((following) => audioToObject(this.$store.state.api_base_url, following))

      this.$store.commit("playAudio", audioObject);
      this.$store.commit("replaceQueue", followingAudioObjects);
    }
  },
  computed: {
    book() {
      return this.$store.getters.books.find(el => {
        return el.id === +this.$route.params.id;
      });
    }
  }
};
</script>

<style>
.audio {
  cursor: pointer;
}
</style>
