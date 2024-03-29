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
        icon="group_add"
        color="red"
        entity-name="Talents"
        statistics-route-name="AdminTalentAcquisitionStatistics"
        :weekly-statistics="weeklyTalentAcquisitionStatistics"
        :monthly-statistics="monthlyTalentAcquisitionStatistics"
      ></reporting-card>
    </v-flex>

    <!-- Requirements reporting card -->
    <v-flex
      xs12
      sm6
      xl5
      :class="['pb-3', {'pl-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Requirements"
        icon="work"
        color="orange"
        entity-name="Requirements"
        statistics-route-name="AdminRequirementStatistics"
        :weekly-statistics="weeklyRequirementsStatistics"
        :monthly-statistics="monthlyRequirementsStatistics"
      ></reporting-card>
    </v-flex>

    <!-- Sent opportunities reporting card -->
    <v-flex
      xs12
      sm6
      xl5 offset-xl1
      :class="['pb-3', {'pr-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Opportunity sending"
        icon="assignment"
        color="amber lighten-1"
        entity-name="Opportunities"
        statistics-route-name="AdminOpportunitySendingStatistics"
        :weekly-statistics="weeklyOpportunitiesStatistics"
        :monthly-statistics="monthlyOpportunitiesStatistics"
      ></reporting-card>
    </v-flex>

    <!-- Talent accepted opportunities reporting card -->
    <v-flex
      xs12
      sm6
      xl5
      :class="['pb-3', {'pl-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Talent accepted opportunities"
        icon="assignment_turned_in"
        color="green"
        entity-name="Opportunities"
        statistics-route-name="AdminTalentResponseStatistics"
        :weekly-statistics="weeklyTalentAcceptedOpportunitiesStatistics"
        :monthly-statistics="monthlyTalentAcceptedOpportunitiesStatistics"
      ></reporting-card>
    </v-flex>

    <!-- Employer accepted talents reporting card -->
    <v-flex
      xs12
      sm6
      xl5 offset-xl1
      :class="['pb-3', {'pr-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Employer accepted talents"
        icon="how_to_reg"
        color="blue"
        entity-name="Talents"
        statistics-route-name="AdminEmployerResponseStatistics"
        :weekly-statistics="weeklyEmployerAcceptedTalentsStatistics"
        :monthly-statistics="monthlyEmployerAcceptedTalentsStatistics"
      ></reporting-card>
    </v-flex>

    <!-- Confirmed interviews reporting card -->
    <v-flex
      xs12
      sm6
      xl5
      :class="['pb-3', {'pl-2': $vuetify.breakpoint.smAndUp}]"
    >
      <reporting-card
        title="Interview confirmation"
        icon="event"
        color="purple"
        entity-name="Interviews"
        statistics-route-name="AdminInterviewConfirmationStatistics"
        :weekly-statistics="weeklyConfirmedInterviewsStatistics"
        :monthly-statistics="monthlyConfirmedInterviewsStatistics"
      ></reporting-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions } from 'vuex';
  import ReportingCard from './ReportingCard';

  export default {
    name: 'AdminDashboard',
    components: {
      ReportingCard,
    },
    data: () => ({
      weeklyTalentAcquisitionStatistics: [],
      monthlyTalentAcquisitionStatistics: [],
      weeklyRequirementsStatistics: [],
      monthlyRequirementsStatistics: [],
      weeklyOpportunitiesStatistics: [],
      monthlyOpportunitiesStatistics: [],
      weeklyTalentAcceptedOpportunitiesStatistics: [],
      monthlyTalentAcceptedOpportunitiesStatistics: [],
      weeklyEmployerAcceptedTalentsStatistics: [],
      monthlyEmployerAcceptedTalentsStatistics: [],
      weeklyConfirmedInterviewsStatistics: [],
      monthlyConfirmedInterviewsStatistics: [],
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
      const startOfWeek4WeeksAgo = moment().subtract(4, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
      const startOfMonth12MonthsAgo = moment().subtract(12, 'months').startOf('month').format('YYYY-MM-DD');
      return Promise.all([
        this.api(`/talents/statistics?start-date=${startOfWeek4WeeksAgo}&end-date=${now}&group-by=week`),
        this.api(`/talents/statistics?start-date=${startOfMonth12MonthsAgo}&end-date=${now}&group-by=month`),
        this.api(`/requirements/statistics?start-date=${startOfWeek4WeeksAgo}&end-date=${now}&group-by=week`),
        this.api(`/requirements/statistics?start-date=${startOfMonth12MonthsAgo}&end-date=${now}&group-by=month`),
        this.api(`/opportunities/statistics?start-date=${startOfWeek4WeeksAgo}&end-date=${now}&group-by=week`),
        this.api(`/opportunities/statistics?start-date=${startOfMonth12MonthsAgo}&end-date=${now}&group-by=month`),
        this.api(`/opportunities/statistics?start-date=${startOfWeek4WeeksAgo}&end-date=${now}&group-by=week&event-field=talentRespondedAt&talent-status=ACCEPTED`),
        this.api(`/opportunities/statistics?start-date=${startOfMonth12MonthsAgo}&end-date=${now}&group-by=month&event-field=talentRespondedAt&talent-status=ACCEPTED`),
        this.api(`/opportunities/statistics?start-date=${startOfWeek4WeeksAgo}&end-date=${now}&group-by=week&event-field=employerAcceptedAt`),
        this.api(`/opportunities/statistics?start-date=${startOfMonth12MonthsAgo}&end-date=${now}&group-by=month&event-field=employerAcceptedAt`),
        this.api(`/interviews/statistics?start-date=${startOfWeek4WeeksAgo}&end-date=${now}&group-by=week&status=CONFIRMED`),
        this.api(`/interviews/statistics?start-date=${startOfMonth12MonthsAgo}&end-date=${now}&group-by=month&status=CONFIRMED`),
      ])
        .then(([
                 weeklyTalentAcquisitionStatisticsResponse,
                 monthlyTalentAcquisitionStatisticsResponse,
                 weeklyRequirementsStatisticsResponse,
                 monthlyRequirementsStatisticsResponse,
                 weeklyOpportunitiesStatisticsResponse,
                 monthlyOpportunitiesStatisticsResponse,
                 weeklyTalentAcceptedOpportunitiesStatisticsResponse,
                 monthlyTalentAcceptedOpportunitiesStatisticsResponse,
                 weeklyEmployerAcceptedTalentsStatisticsResponse,
                 monthlyEmployerAcceptedTalentsStatisticsResponse,
                 weeklyConfirmedInterviewsStatisticsResponse,
                 monthlyConfirmedInterviewsStatisticsResponse,
               ]) => {
          this.weeklyTalentAcquisitionStatistics = weeklyTalentAcquisitionStatisticsResponse.data;
          this.monthlyTalentAcquisitionStatistics = monthlyTalentAcquisitionStatisticsResponse.data;
          this.weeklyRequirementsStatistics = weeklyRequirementsStatisticsResponse.data;
          this.monthlyRequirementsStatistics = monthlyRequirementsStatisticsResponse.data;
          this.weeklyOpportunitiesStatistics = weeklyOpportunitiesStatisticsResponse.data;
          this.monthlyOpportunitiesStatistics = monthlyOpportunitiesStatisticsResponse.data;
          this.weeklyTalentAcceptedOpportunitiesStatistics =
            weeklyTalentAcceptedOpportunitiesStatisticsResponse.data;
          this.monthlyTalentAcceptedOpportunitiesStatistics =
            monthlyTalentAcceptedOpportunitiesStatisticsResponse.data;
          this.weeklyEmployerAcceptedTalentsStatistics =
            weeklyEmployerAcceptedTalentsStatisticsResponse.data;
          this.monthlyEmployerAcceptedTalentsStatistics =
            monthlyEmployerAcceptedTalentsStatisticsResponse.data;
          this.weeklyConfirmedInterviewsStatistics = weeklyConfirmedInterviewsStatisticsResponse.data;
          this.monthlyConfirmedInterviewsStatistics =
            monthlyConfirmedInterviewsStatisticsResponse.data;
        })
        .catch(() => this.showSnackbar(['Error', 'error']))
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
