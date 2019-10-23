<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <statistics-navigation></statistics-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-text>
          <date-range-selector
            :start-date.sync="startDate"
            :end-date="endDate"
            :group-by.sync="groupBy"
            @change="getStatistics"
          ></date-range-selector>

          <v-flex xs12 v-if="loading">
            <v-flex xs12 class="text-xs-center">
              <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
            </v-flex>
          </v-flex>
          <v-flex xs12 v-else>
            <highcharts :options="chartOptions"></highcharts>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapState, mapGetters, mapActions } from 'vuex';
  import StatisticsNavigation from './Navigation';
  import DateRangeSelector from './DateRangeSelector';

  export default {
    name: 'InterviewStatistics',
    components: {
      StatisticsNavigation,
      DateRangeSelector,
    },
    data: () => ({
      confirmedPhoneInterviewsStatistics: [],
      confirmedInPersonInterviewsStatistics: [],
      startDate: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      groupBy: 'month',
    }),
    computed: {
      ...mapState([
        'parseDate',
      ]),
      ...mapGetters([
        'api',
        'loading',
      ]),
      chartOptions() {
        return {
          title: {
            text: 'Interviews',
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: {
            title: {
              text: 'Interviews',
            },
          },
          series: [
            {
              name: 'Confirmed phone interviews',
              data: this.confirmedPhoneInterviewsStatistics
                .map(point => [this.parseDate(point[0], this.groupBy), point[1]]),
            },
            {
              name: 'Confirmed in person interviews',
              data: this.confirmedInPersonInterviewsStatistics
                .map(point => [this.parseDate(point[0], this.groupBy), point[1]]),
            },
          ],
        };
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
      getStatistics() {
        this.prepareForApiConsumption();
        const confirmedPhoneInterviewsQuery = `start-date=${this.startDate}&end-date=${this.endDate}&group-by=${this.groupBy}&status=CONFIRMED&format=PHONE`;
        const confirmedInPersonInterviewsQuery = `start-date=${this.startDate}&end-date=${this.endDate}&group-by=${this.groupBy}&status=CONFIRMED&format=IN_PERSON`;
        return Promise.all([
          this.api(`/interviews/statistics?${confirmedPhoneInterviewsQuery}`),
          this.api(`/interviews/statistics?${confirmedInPersonInterviewsQuery}`),
        ])
          .then(([
                   confirmedPhoneInterviewsResponse,
                   confirmedInPersonInterviewsResponse,
                 ]) => {
            this.confirmedPhoneInterviewsStatistics = confirmedPhoneInterviewsResponse.data;
            this.confirmedInPersonInterviewsStatistics = confirmedInPersonInterviewsResponse.data;
          })
          .finally(() => this.clearLoading());
      },
    },
    created() {
      return this.getStatistics();
    },
  };
</script>

<style scoped>

</style>
