<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <statistics-navigation></statistics-navigation>
    </v-flex>
    <v-flex xs10>
      <date-range-selector></date-range-selector>
    </v-flex>
  </v-layout>
</template>

<script>
  import StatisticsNavigation from './Navigation';
  import DateRangeSelector from './DateRangeSelector';

  export default {
    name: 'RequirementStatistics',
    components: {
      StatisticsNavigation,
      DateRangeSelector,
    },
    data: () => ({
      startDate: null,
      endDate: null,
    }),
  };
</script>

<style scoped>

</style>
