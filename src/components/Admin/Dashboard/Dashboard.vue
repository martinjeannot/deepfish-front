<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else wrap>
    <!-- Talent acquisition reporting card -->
    <v-flex
      xs12
      sm6
      xl5 offset-xl1
      :class="['pb-3', {'pr-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Talent acquisition"
        icon="people"
        color="blue"
        entity-name="Talents"
        :weekly-statistics="weeklyTalentAcquisitionStatistics"
        :monthly-statistics="monthlyTalentAcquisitionStatistics"
      ></reporting-card>
    </v-flex>

    <!-- Sent opportunities reporting card -->
    <v-flex
      xs12
      sm6
      xl5
      :class="['pb-3', {'pl-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Sent opportunities"
        icon="assignment"
        color="orange"
        entity-name="Opportunities"
        :weekly-statistics="weeklyOpportunitiesStatistics"
        :monthly-statistics="monthlyOpportunitiesStatistics"
      ></reporting-card>
    </v-flex>

    <!-- Talent accepted opportunities reporting card -->
    <v-flex
      xs12
      sm6
      xl5 offset-xl1
      :class="['pb-3', {'pr-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Talent accepted opportunities"
        icon="assignment"
        color="light-green"
        entity-name="Opportunities"
        :weekly-statistics="weeklyTalentAcceptedOpportunitiesStatistics"
        :monthly-statistics="monthlyTalentAcceptedOpportunitiesStatistics"
      ></reporting-card>
    </v-flex>

    <!-- Employer accepted opportunities reporting card -->
    <v-flex
      xs12
      sm6
      xl5
      :class="['pb-3', {'pl-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Employer accepted talents"
        icon="event"
        color="green"
        entity-name="Talents"
        :weekly-statistics="weeklyEmployerAcceptedOpportunitiesStatistics"
        :monthly-statistics="monthlyEmployerAcceptedOpportunitiesStatistics"
      ></reporting-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions } from 'vuex';
  import ReportingCard from './ReportingCard';

  export default {
    name: 'admin-dashboard',
    components: {
      ReportingCard,
    },
    data: () => ({
      weeklyTalentAcquisitionStatistics: [],
      monthlyTalentAcquisitionStatistics: [],
      weeklyOpportunitiesStatistics: [],
      monthlyOpportunitiesStatistics: [],
      weeklyTalentAcceptedOpportunitiesStatistics: [],
      monthlyTalentAcceptedOpportunitiesStatistics: [],
      weeklyEmployerAcceptedOpportunitiesStatistics: [],
      monthlyEmployerAcceptedOpportunitiesStatistics: [],
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
      const now = moment().format('YYYY-MM-DD');
      const startOfWeek3MonthsAgo = moment().subtract(3, 'months').startOf('isoWeek').format('YYYY-MM-DD');
      const startOfMonth4MonthsAgo = moment().subtract(4, 'months').startOf('month').format('YYYY-MM-DD');
      return Promise.all([
        this.api(`/talents/statistics?created-at-after=${startOfWeek3MonthsAgo}&created-at-before=${now}&group-by=week`),
        this.api(`/talents/statistics?created-at-after=${startOfMonth4MonthsAgo}&created-at-before=${now}&group-by=month`),
        this.api(`/opportunities/statistics?created-at-after=${startOfWeek3MonthsAgo}&created-at-before=${now}&group-by=week`),
        this.api(`/opportunities/statistics?created-at-after=${startOfMonth4MonthsAgo}&created-at-before=${now}&group-by=month`),
        this.api(`/opportunities/statistics?created-at-after=${startOfWeek3MonthsAgo}&created-at-before=${now}&group-by=week&talent-status=ACCEPTED`),
        this.api(`/opportunities/statistics?created-at-after=${startOfMonth4MonthsAgo}&created-at-before=${now}&group-by=month&talent-status=ACCEPTED`),
        this.api(`/opportunities/statistics?created-at-after=${startOfWeek3MonthsAgo}&created-at-before=${now}&group-by=week&employer-status=ACCEPTED`),
        this.api(`/opportunities/statistics?created-at-after=${startOfMonth4MonthsAgo}&created-at-before=${now}&group-by=month&employer-status=ACCEPTED`),
      ])
        .then(([
                 weeklyTalentAcquisitionStatisticsResponse,
                 monthlyTalentAcquisitionStatisticsResponse,
                 weeklyOpportunitiesStatisticsResponse,
                 monthlyOpportunitiesStatisticsResponse,
                 weeklyTalentAcceptedOpportunitiesStatisticsResponse,
                 monthlyTalentAcceptedOpportunitiesStatisticsResponse,
                 weeklyEmployerAcceptedOpportunitiesStatisticsResponse,
                 monthlyEmployerAcceptedOpportunitiesStatisticsResponse,
               ]) => {
          this.weeklyTalentAcquisitionStatistics = weeklyTalentAcquisitionStatisticsResponse.data;
          this.monthlyTalentAcquisitionStatistics = monthlyTalentAcquisitionStatisticsResponse.data;
          this.weeklyOpportunitiesStatistics = weeklyOpportunitiesStatisticsResponse.data;
          this.monthlyOpportunitiesStatistics = monthlyOpportunitiesStatisticsResponse.data;
          this.weeklyTalentAcceptedOpportunitiesStatistics =
            weeklyTalentAcceptedOpportunitiesStatisticsResponse.data;
          this.monthlyTalentAcceptedOpportunitiesStatistics =
            monthlyTalentAcceptedOpportunitiesStatisticsResponse.data;
          this.weeklyEmployerAcceptedOpportunitiesStatistics =
            weeklyEmployerAcceptedOpportunitiesStatisticsResponse.data;
          this.monthlyEmployerAcceptedOpportunitiesStatistics =
            monthlyEmployerAcceptedOpportunitiesStatisticsResponse.data;
        })
        .catch(() => this.showSnackbar(['Error', 'error']))
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
