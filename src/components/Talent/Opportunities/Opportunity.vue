<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else wrap>
    <opportunity-tracker
      :opportunity="opportunity"
    ></opportunity-tracker>

    <v-flex xs12 v-if="alertComponent">
      <base-alert
        :type="alertComponent.type"
        :message="alertComponent.message"
        @dismissed="onAlertComponentDismissed"
      ></base-alert>
    </v-flex>

    <v-flex xs12 class="pb-3">
      <opportunity-cover
        :opportunity="opportunity"
      ></opportunity-cover>
    </v-flex>

    <v-flex
      xs12 sm5
      :class="['pb-3', {'pr-3': $vuetify.breakpoint.smAndUp}]"
    >
      <v-img
        :src="opportunity.company.topImageUrl"
        height="100%"
        max-height="362px"
      ></v-img>
    </v-flex>
    <v-flex
      xs12 sm7
      class="pb-3"
    >
      <v-flex xs12 class="pb-3">
        <opportunity-company-stats
          :company="opportunity.company"
        ></opportunity-company-stats>
      </v-flex>
      <v-flex xs12>
        <opportunity-status-line
          :opportunity="opportunity"
        ></opportunity-status-line>
      </v-flex>
    </v-flex>

    <v-flex
      v-if="opportunity.talentStatus === 'PENDING'"
      xs12
      class="pb-3"
    >
      <opportunity-actions
        :opportunity="opportunity"
        @opportunity-refresh="getOpportunity(id)"
      ></opportunity-actions>
    </v-flex>

    <v-flex
      v-if="opportunity.employerStatus === 'ACCEPTED'"
      xs12
    >
      <opportunity-interviews
        :opportunity="opportunity"
      ></opportunity-interviews>
    </v-flex>

    <v-flex
      xs12 sm7
      :class="['pb-3', {'pr-3': $vuetify.breakpoint.smAndUp}]"
      :style="[$vuetify.breakpoint.smAndUp ? {'min-height': '25rem'} : '']"
    >
      <v-card class="h-100">
        <v-card-text>
          <div class="pb-3">
            <span class="body-2">{{ opportunity.employer.firstName }}</span>
            de chez
            <span class="font-italic">{{ opportunity.company.name }}</span>
          </div>
          <div
            v-html="opportunity.pitch"
            v-linkified
            style="white-space: pre-wrap"
          ></div>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex
      xs12 sm5
      class="pb-3"
    >
      <v-flex xs12 class="pb-3">
        <opportunity-social-media
          :company="opportunity.company"
        ></opportunity-social-media>
      </v-flex>
      <v-flex
        xs12
        :style="[$vuetify.breakpoint.smAndUp ? {height: 'calc(100% - 96px)'} : {height: '20rem'}]"
      >
        <opportunity-map
          :opportunity="opportunity"
        ></opportunity-map>
      </v-flex>
    </v-flex>

    <v-flex
      xs12 sm6
      :class="[{'pb-3': $vuetify.breakpoint.xsOnly}, {'pr-3': $vuetify.breakpoint.smAndUp}]"
    >
      <v-img
        :src="opportunity.company.bottomImageUrl"
        height="100%"
      ></v-img>
    </v-flex>
    <v-flex
      xs12 sm6
    >
      <v-card style="height: 100%">
        <v-card-text>
          <div
            v-html="opportunity.company.description"
            v-linkified
            style="white-space: pre-wrap"
          ></div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import OpportunityCover from './OpportunityCover';
  import OpportunityCompanyStats from './OpportunityCompanyStats';
  import OpportunityStatusLine from './OpportunityStatusLine';
  import OpportunityActions from './OpportunityActions';
  import OpportunityInterviews from './OpportunityInterviews';
  import OpportunitySocialMedia from './OpportunitySocialMedia';
  import OpportunityMap from './OpportunityMap';
  import OpportunityTracker from './OpportunityTracker';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'TalentOpportunity',
    components: {
      OpportunityCover,
      OpportunityCompanyStats,
      OpportunityStatusLine,
      OpportunityActions,
      OpportunityInterviews,
      OpportunitySocialMedia,
      OpportunityMap,
      OpportunityTracker,
    },
    props: ['id'],
    data: () => ({
      rules,
      opportunity: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
      ]),
      getOpportunity(opportunityId) {
        return this
          .api(`/opportunities/${opportunityId}?projection=talent`)
          .then((response) => {
            this.opportunity = response.data;
          })
          .catch(() => this.setErrorAfterApiConsumption());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      return this
        .getOpportunity(this.id)
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
  .h-100 {
    height: 100%;
  }
</style>
