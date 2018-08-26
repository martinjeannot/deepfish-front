<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else wrap>
    <v-flex xs12 class="text-xs-center">
      <h1>Admin dashboard</h1>
    </v-flex>
    <v-flex xs6>Coming soon</v-flex>
    <v-flex xs6>
      <!-- <line-chart :data="opportunityChartData"></line-chart> -->
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'admin-dashboard',
    data: () => ({
      opportunityStatistics: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
      ]),
      opportunityChartData() {
        return {
          labels: this.opportunityStatistics.map(point => point[0]),
          datasets: [{
            label: 'Total',
            data: this.opportunityStatistics.map(point => point[1]),
          }],
        };
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
    },
    created() {
      this.prepareForApiConsumption(true);
      this.api('/opportunities/statistics?datepart=day')
        .then((response) => {
          this.opportunityStatistics = response.data;
        })
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
