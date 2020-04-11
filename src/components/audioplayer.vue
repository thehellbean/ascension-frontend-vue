<template>
  <div class="audioplayer">
    <md-button
      v-on:click="togglePlay()"
      class="md-icon-button md-raised md-primary"
    >
      <md-icon class="button-icon" v-if="playing">pause</md-icon>
      <md-icon class="button-icon" v-else>play_arrow</md-icon>
    </md-button>

    <p>{{ song.title }}</p>
    <p>{{ currentTime }} / {{ durationFormat }}</p>
    <p v-if="nextUp">Next up: {{ nextUp.title }}</p>
  </div>
</template>

<script>
const staticPlayerData = {
  intervalID: null,
};

let parseTime = function(time) {
  let minutes = "" + Math.trunc(time / 60);
  let seconds = "" + Math.trunc(time % 60);

  if (minutes.length < 2) {
    minutes = "0" + minutes;
  }

  if (seconds.length < 2) {
    seconds = "0" + seconds;
  }

  return `${minutes}:${seconds}`;
};

export default {
  name: "audioplayer",
  methods: {
    updateCurrentTime() {
      this.currentTime = parseTime(this.audioElement.currentTime);
    },
    publishProgress() {
      let time = Math.trunc(this.audioElement.currentTime);
      fetch(this.song.path + '/progress',
          { credentials: 'include', 
              headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': this.$store.state.token
              },
              method: 'POST', 
              body: JSON.stringify({ progress: time }) 
          });
    },
    togglePlay() {
      if (this.playing) {
        this.audioElement.pause();
        this.publishProgress();
      } else {
        this.audioElement.play();
      }

      this.playing = !this.playing;
    }
  },
  updated: function() {
    if (this.stateSong.path !== this.song.path) {
      this.audioElement.src = this.stateSong.path;
      this.song = this.stateSong;
      this.playing = true;

      if (this.song.progress !== undefined) {
        this.audioElement.fastSeek(this.song.progress);
      }

      this.audioElement.play();

      staticPlayerData.intervalID = setInterval(this.updateCurrentTime, 100);
    }
  },
  created: function() {
    this.audioElement = new Audio();
    this.audioElement.addEventListener("loadeddata", () => {
      this.duration = this.audioElement.duration;
    });
  },
  watch: {
    stateSong: function() {
      this.$forceUpdate();
    }
  },
  data() {
    return {
      song: "",
      audioElement: null,
      currentTime: 0,
      duration: 0,
      playing: false,
    };
  },
  computed: {
    stateSong() {
      return this.$store.getters.activeMedia;
    },
    durationFormat() {
      return parseTime(this.duration);
    },
    nextUp() {
      if (this.$store.getters.queuedMedia.length >= 2) {
          return this.$store.getters.queuedMedia[1];
      } else {
          return null;
        }
    }
  }
};
</script>

<style>
.audioplayer {
  height: 100px;
  width: 90%;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

.audioplayer p {
  text-align: center;
}

.audioplayer .md-icon.md-icon-font {
  display: block;
  cursor: pointer;
}
</style>
