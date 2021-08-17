<template lang="pug">
#app.w-full.h-screen.container.mx-auto
  h1.text-2xl.my-4 Rust Spawn Time Visualizer

  .flex.mt-2.p-2.rounded.border
    .flex.flex-1.mx-2
      h4.flex-1.text-lg.self-center Respawn Min
      input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="respawnDelayMin")
    .flex.flex-1.mx-2
      h4.flex-1.text-lg.self-center Respawn Max
      input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="respawnDelayMax")

  .mt-2.p-2.rounded.border
    .flex
      h4.flex-1.text-lg.self-center Current Players
      input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="currentPlayers")
    input.mt-8.w-full(type="range", v-model="currentPlayers", min="1", max="500")

  .flex.mt-2.p-2.rounded.border
    .flex-1.mx-2
      .flex
        h4.flex-1.text-lg.self-center Player Base
        input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="playerBase")
      input.mt-8.w-full(type="range", v-model="playerBase", min="1", max="1000")
    .flex-1.mx-2
      .flex
        h4.flex-1.text-lg.self-center Player Scale
        input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="playerScale")
      input.mt-8.w-full(type="range", v-model="playerScale", min="1", max="10", step="0.01")

  .flex.mt-8.p-2.rounded.border
    .flex-1.text-center
      h4.text-lg Player Excess
      span {{ comp_PlayerExcess.toFixed(2) }}
    .flex-1.text-center
      h4.text-lg Player Scale
      span {{ comp_PlayerScale.toFixed(2) }}
    .flex-1.text-center
      h4.text-lg Spawn Delta
      span {{ formatTime(comp_SpawnDelta) }}
    .flex-1.text-center
      h4.text-lg Spawn Variance
      span {{ formatTime(comp_SpawnVariance) }}

  .flex.mt-8.p-2.rounded.border
    .flex-1.text-center
      h4.text-lg Min Spawn Time
      span {{ formatTime(comp_SpawnTimeMin) }}
    .flex-1.text-center
      h4.text-lg Max Spawn Time
      span {{ formatTime(comp_SpawnTimeMax) }}
    .flex-1.text-center
      h4.text-lg Random Spawn Time
      span {{ formatTime(comp_SpawnTimeRandom) }}
</template>

<script>
export default {
  name: "App",
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