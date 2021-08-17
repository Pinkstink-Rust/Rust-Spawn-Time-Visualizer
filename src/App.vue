<template lang="pug">
#app.w-full.h-screen.container.mx-auto.py-4
  h1.text-3xl.mb-4 Rust Spawn Time Visualizer

  h1.text-lg.mb-2 Spawn Groups
  <spawn-groups />

  //- hr.my-8
  
  //- h1.text-lg.mb-2 Population Groups
  //- p.muted Work in progress...
</template>

<script>
import SpawnGroups from "./components/SpawnGroups.vue";

export default {
  name: "App",
  components: {
    SpawnGroups,
  },
  data() {
    return {
      respawnDelayMin: 1800,
      respawnDelayMax: 2200,
      maxPlayers: 400,
      currentPlayers: 400,
      playerScale: 0.5,
      playerBase: 100,
    };
  },
  methods: {
    formatTime(time) {
      var sec_num = parseInt(time, 10); // don't forget the second param
      var minutes = Math.floor(sec_num / 60);
      var seconds = sec_num - minutes * 60;

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      return minutes + ":" + seconds;
    },
  },
  computed: {
    comp_PlayerExcess() {
      const playerBase = +this.playerBase;
      const currentPlayers = +this.currentPlayers;
      const clamped = Math.max(1, playerBase);
      if (currentPlayers <= clamped) return 0;
      return (currentPlayers - clamped) / clamped;
    },
    comp_PlayerScale() {
      const playerScale = +this.playerScale;
      return Math.max(1, this.comp_PlayerExcess * playerScale);
    },
    comp_SpawnDelta() {
      // (this.respawnDelayMax + this.respawnDelayMin) * 0.5f / SpawnHandler.PlayerScale(Spawn.player_scale);
      const respawnDelayMax = +this.respawnDelayMax;
      const respawnDelayMin = +this.respawnDelayMin;
      return ((respawnDelayMax + respawnDelayMin) * 0.5) / this.comp_PlayerScale;
    },
    comp_SpawnVariance() {
      // (this.respawnDelayMax - this.respawnDelayMin) * 0.5f / SpawnHandler.PlayerScale(Spawn.player_scale);
      const respawnDelayMax = +this.respawnDelayMax;
      const respawnDelayMin = +this.respawnDelayMin;
      return ((respawnDelayMax - respawnDelayMin) * 0.5) / this.comp_PlayerScale;
    },
    comp_SpawnTimeMin() {
      const seconds = this.comp_SpawnDelta - this.comp_SpawnVariance;
      return seconds;
    },
    comp_SpawnTimeMax() {
      const seconds = this.comp_SpawnDelta + this.comp_SpawnVariance;
      return seconds;
    },
    comp_SpawnTimeRandom() {
      const seconds = this.comp_SpawnDelta + this.comp_SpawnVariance * (Math.random() * 2 - 1);
      return seconds;
    },
  },
};
</script>