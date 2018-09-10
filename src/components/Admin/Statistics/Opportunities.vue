<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <statistics-navigation></statistics-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-text v-if="loading">
          <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
          </v-flex>
        </v-card-text>
        <v-card-text v-else>
          <line-chart :data="chartData"></line-chart>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import StatisticsNavigation from './Navigation';

  export default {
    name: 'statistics-opportunities',
    components: { StatisticsNavigation },
    data: () => ({
      statistics: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
      chartData() {
        return {
          labels: this.statistics.map(point => point[0]),
          datasets: [{
            label: 'Total',
            data: this.statistics.map(point => point[1]),
          }],
        };
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this.api('/opportunities/statistics?datepart=day')
        .then((response) => {
          this.statistics = response.data;
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
