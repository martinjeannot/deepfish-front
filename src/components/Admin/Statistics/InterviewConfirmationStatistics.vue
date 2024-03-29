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
    name: 'InterviewConfirmationStatistics',
    components: {
      StatisticsNavigation,
      DateRangeSelector,
    },
    data: () => ({
      phoneInterviewConfirmationStatistics: [],
      inPersonInterviewConfirmationStatistics: [],
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
          series: [
            {
              color: '#9C27B0',
              data: this.phoneInterviewConfirmationStatistics
                .map(point => [this.parseDate(point[0], this.groupBy), point[1]]),
              name: 'Confirmed phone interviews',
            },
            {
              color: '#673AB7',
              data: this.inPersonInterviewConfirmationStatistics
                .map(point => [this.parseDate(point[0], this.groupBy), point[1]]),
              name: 'Confirmed in person interviews',
            },
          ],
          title: {
            text: 'Interview Confirmation',
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: {
            allowDecimals: false,
            title: {
              text: 'Confirmed interviews',
            },
          },
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
        const phoneInterviewConfirmationQuery = `start-date=${this.startDate}&end-date=${this.endDate}&group-by=${this.groupBy}&status=CONFIRMED&format=PHONE`;
        const inPersonInterviewConfirmationQuery = `start-date=${this.startDate}&end-date=${this.endDate}&group-by=${this.groupBy}&status=CONFIRMED&format=IN_PERSON`;
        return Promise.all([
          this.api(`/interviews/statistics?${phoneInterviewConfirmationQuery}`),
          this.api(`/interviews/statistics?${inPersonInterviewConfirmationQuery}`),
        ])
          .then(([
                   phoneInterviewConfirmationResponse,
                   inPersonInterviewConfirmationResponse,
                 ]) => {
            this.phoneInterviewConfirmationStatistics = phoneInterviewConfirmationResponse.data;
            this.inPersonInterviewConfirmationStatistics = inPersonInterviewConfirmationResponse.data;
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
