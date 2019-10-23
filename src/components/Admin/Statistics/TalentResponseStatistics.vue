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
    name: 'TalentResponseStatistics',
    components: {
      StatisticsNavigation,
      DateRangeSelector,
    },
    data: () => ({
      opportunityAcceptanceStatistics: [],
      opportunityDeclinationStatistics: [],
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
              color: '#4CAF50',
              data: this.opportunityAcceptanceStatistics
                .map(point => [this.parseDate(point[0], this.groupBy), point[1]]),
              name: 'Accepted opportunities',
            },
            {
              color: '#F44336',
              data: this.opportunityDeclinationStatistics
                .map(point => [this.parseDate(point[0], this.groupBy), point[1]]),
              name: 'Declined opportunities',
            },
          ],
          title: {
            text: 'Talent Response',
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: {
            allowDecimals: false,
            title: {
              text: 'Talent responses',
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
        const opportunityAcceptanceQuery = `start-date=${this.startDate}&end-date=${this.endDate}&group-by=${this.groupBy}&event-field=talentRespondedAt&talent-status=ACCEPTED`;
        const opportunityDeclinationQuery = `start-date=${this.startDate}&end-date=${this.endDate}&group-by=${this.groupBy}&event-field=talentRespondedAt&talent-status=DECLINED`;
        return Promise.all([
          this.api(`/opportunities/statistics?${opportunityAcceptanceQuery}`),
          this.api(`/opportunities/statistics?${opportunityDeclinationQuery}`),
        ])
          .then(([
                   opportunityAcceptanceResponse,
                   opportunityDeclinationResponse,
                 ]) => {
            this.opportunityAcceptanceStatistics = opportunityAcceptanceResponse.data;
            this.opportunityDeclinationStatistics = opportunityDeclinationResponse.data;
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
