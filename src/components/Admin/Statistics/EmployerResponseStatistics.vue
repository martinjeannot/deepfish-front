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
    name: 'EmployerResponseStatistics',
    components: {
      StatisticsNavigation,
      DateRangeSelector,
    },
    data: () => ({
      talentAcceptanceStatistics: [],
      talentDeclinationStatistics: [],
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
              color: '#2196F3',
              data: this.talentAcceptanceStatistics
                .map(point => [this.parseDate(point[0], this.groupBy), point[1]]),
              name: 'Accepted talents',
            },
            {
              color: '#FF9800',
              data: this.talentDeclinationStatistics
                .map(point => [this.parseDate(point[0], this.groupBy), point[1]]),
              name: 'Declined talents',
            },
          ],
          title: {
            text: 'Employer Response',
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: {
            allowDecimals: false,
            title: {
              text: 'Employer responses',
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
        const talentAcceptanceQuery = `start-date=${this.startDate}&end-date=${this.endDate}&group-by=${this.groupBy}&event-field=employerAcceptedAt`;
        const talentDeclinationQuery = `start-date=${this.startDate}&end-date=${this.endDate}&group-by=${this.groupBy}&event-field=employerDeclinedAt`;
        return Promise.all([
          this.api(`/opportunities/statistics?${talentAcceptanceQuery}`),
          this.api(`/opportunities/statistics?${talentDeclinationQuery}`),
        ])
          .then(([
                   talentAcceptanceResponse,
                   talentDeclinationResponse,
                 ]) => {
            this.talentAcceptanceStatistics = talentAcceptanceResponse.data;
            this.talentDeclinationStatistics = talentDeclinationResponse.data;
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
