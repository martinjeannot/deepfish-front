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
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="mb-2">
        <v-card-title>
          <v-icon
            large
            color="primary"
            class="pr-3"
          >
            people
          </v-icon>
          <div class="text-uppercase pr-2">
            Talent acquisition
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">info</v-icon>
            </template>
            <span>{{ statisticsInfo }}</span>
          </v-tooltip>
        </v-card-title>
        <v-sparkline
          :value="talentAcquisitionStatistics.map(point => point[1])"
          show-labels
          color="primary"
          :width="chartWidth"
          :padding="chartPadding"
          :smooth="chartSmoothing"
          stroke-linecap="round"
          auto-draw
        ></v-sparkline>
      </v-card>
      <v-card class="mb-2">
        <v-card-title>
          <v-icon
            large
            color="grey"
            class="pr-3"
          >
            assignment
          </v-icon>
          <div class="text-uppercase pr-2">
            Sent opportunities
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">info</v-icon>
            </template>
            <span>{{ statisticsInfo }}</span>
          </v-tooltip>
        </v-card-title>
        <v-sparkline
          :value="opportunitiesStatistics.map(point => point[1])"
          show-labels
          color="grey"
          :width="chartWidth"
          :padding="chartPadding"
          :smooth="chartSmoothing"
          stroke-linecap="round"
          auto-draw
        ></v-sparkline>
      </v-card>
      <v-card class="mb-2">
        <v-card-title>
          <v-icon
            large
            color="green lighten-2"
            class="pr-3"
          >
            assignment
          </v-icon>
          <div class="text-uppercase pr-2">
            Talent accepted opportunities
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">info</v-icon>
            </template>
            <span>{{ statisticsInfo }}</span>
          </v-tooltip>
        </v-card-title>
        <v-sparkline
          :value="talentAcceptedOpportunitiesStatistics.map(point => point[1])"
          show-labels
          color="green lighten-2"
          :width="chartWidth"
          :padding="chartPadding"
          :smooth="chartSmoothing"
          stroke-linecap="round"
          auto-draw
        ></v-sparkline>
      </v-card>
      <v-card class="mb-2">
        <v-card-title>
          <v-icon
            large
            color="green darken-2"
            class="pr-3"
          >
            assignment
          </v-icon>
          <div class="text-uppercase pr-2">
            Employer accepted opportunities
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">info</v-icon>
            </template>
            <span>{{ statisticsInfo }}</span>
          </v-tooltip>
        </v-card-title>
        <v-sparkline
          :value="employerAcceptedOpportunitiesStatistics.map(point => point[1])"
          show-labels
          color="green darken-2"
          :width="chartWidth"
          :padding="chartPadding"
          :smooth="chartSmoothing"
          stroke-linecap="round"
          auto-draw
        ></v-sparkline>
      </v-card>
      <v-card class="mb-2">
        <v-card-title>
          <v-icon
            large
            color="green accent-4"
            class="pr-3"
          >
            event
          </v-icon>
          <div class="text-uppercase">
            Scheduled interviews
          </div>
        </v-card-title>
        <div class="pb-3 text-xs-center font-italic">
          COMING SOON
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'admin-dashboard',
    data: () => ({
      talentAcquisitionStatistics: [],
      opportunitiesStatistics: [],
      talentAcceptedOpportunitiesStatistics: [],
      employerAcceptedOpportunitiesStatistics: [],
      statisticsInfo: 'Weekly statistics over the last 3 months',
      chartWidth: 400,
      chartPadding: 16,
      chartSmoothing: 4,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
      ]),
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
      const before = moment().format('YYYY-MM-DD');
      const after = moment().subtract(3, 'months').startOf('isoWeek').format('YYYY-MM-DD');
      return Promise.all([
        this.api(`/talents/statistics?created-at-after=${after}&created-at-before=${before}&group-by=week`),
        this.api(`/opportunities/statistics?created-at-after=${after}&created-at-before=${before}&group-by=week`),
        this.api(`/opportunities/statistics?created-at-after=${after}&created-at-before=${before}&group-by=week&talent-status=ACCEPTED`),
        this.api(`/opportunities/statistics?created-at-after=${after}&created-at-before=${before}&group-by=week&employer-status=ACCEPTED`),
      ])
        .then(([
                 talentAcquisitionStatisticsResponse,
                 opportunitiesStatisticsResponse,
                 talentAcceptedOpportunitiesStatisticsResponse,
                 employerAcceptedOpportunitiesStatisticsResponse,
               ]) => {
          this.talentAcquisitionStatistics = talentAcquisitionStatisticsResponse.data;
          this.opportunitiesStatistics = opportunitiesStatisticsResponse.data;
          this.talentAcceptedOpportunitiesStatistics =
            talentAcceptedOpportunitiesStatisticsResponse.data;
          this.employerAcceptedOpportunitiesStatistics =
            employerAcceptedOpportunitiesStatisticsResponse.data;
        })
        .catch(() => this.showSnackbar('Error'))
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
