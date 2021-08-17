<template lang="pug">
.border.rounded
  .flex.p-2
    .flex.flex-1.mx-2
      h4.flex-1.text-lg.self-center Respawn Min
      input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="respawnDelayMin")
    .flex.flex-1.mx-2
      h4.flex-1.text-lg.self-center Respawn Max
      input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="respawnDelayMax")

  hr.my-1

  .p-2
    .flex
      h4.flex-1.text-lg.self-center Current Players
      input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="currentPlayers")
    input.mt-8.w-full(type="range", v-model="currentPlayers", min="1", max="500")

  hr

  .flex.p-2
    .flex-1.mx-2
      .flex
        h4.flex-1.text-lg.self-center Player Base
        input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="playerBase")
      input.mt-8.w-full(type="range", v-model="playerBase", min="1", max="1000")
    .flex-1.mx-2
      .flex
        h4.flex-1.text-lg.self-center Player Scale
        input.border.rounded.py-2.px-3.text-gray-700(type="number", v-model="playerScale")
      input.mt-8.w-full(type="range", v-model="playerScale", min="0", max="10", step="0.01")

  hr

  .flex.m-4.p-2
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

  hr

  .flex.m-4.p-2
    .flex-1.text-center
      h4.text-lg Min Spawn Time
      span {{ formatTime(comp_SpawnTimeMin) }}
    .flex-1.text-center
      h4.text-lg Max Spawn Time
      span {{ formatTime(comp_SpawnTimeMax) }}
    .flex-1.text-center
      h4.text-lg Random Spawn time
        button.text-base.border.inline.rounded-full.ml-2.py-1.px-2(v-on:click="setRandomSpawnTime") Cycle ↻
      span {{ formatTime(comp_RandomSpawnTime) }}
</template>

<script>
export default {
  name: "SpawnGroups",
  data() {
    return {
      respawnDelayMin: 1800,
      respawnDelayMax: 2200,
      randomSpawnVariance: 0,
      currentPlayers: 400,
      playerScale: 0.5,
      playerBase: 100,
    };
  },
  methods: {
    setRandomSpawnTime() {
      this.randomSpawnVariance = Math.random() * 2 - 1;
    },
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
  created() {
    this.setRandomSpawnTime();
  },
  watch: {
    respawnDelayMin(val) {
      this.setRandomSpawnTime();
    },
    respawnDelayMax(val) {
      this.setRandomSpawnTime();
    },
    currentPlayers(val) {
      this.setRandomSpawnTime();
    },
    playerScale(val) {
      this.setRandomSpawnTime();
    },
    playerBase(val) {
      this.setRandomSpawnTime();
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
    comp_RandomSpawnTime() {
      const seconds = this.comp_SpawnDelta + this.comp_SpawnVariance * this.randomSpawnVariance;
      return seconds;
    },
  },
};
</script>