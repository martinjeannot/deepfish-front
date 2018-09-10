<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <statistics-navigation></statistics-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-text>
          COMING SOON
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import StatisticsNavigation from './Navigation';

  export default {
    name: 'statistics-talent-acquisition',
    components: { StatisticsNavigation },
    data: () => ({}),
  };
</script>

<style scoped>

</style>
