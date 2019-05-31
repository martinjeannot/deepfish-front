<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else wrap>
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
    >
      <v-card>
        <v-card-text>
          <div
            v-html="opportunity.company.description"
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
      <v-flex xs12 style="height: calc(100% - 96px)">
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
            v-html="opportunity.pitch"
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
            // TODO REMOVE
            // this.opportunity.company.coverImageUrl = 'https://cdn.welcometothejungle.co/uploads/website_organization/cover_image/wttj_fr/small_fr-certinergy.jpg';
            // this.opportunity.company.logoURL = 'https://deepfish-static.s3.amazonaws.com/companies/11c74751-4e24-4268-bf7d-01c2927c9e6a/logo.png';
            // this.opportunity.company.topImageUrl = 'https://cdn.welcometothejungle.co/uploads/image/file/8974/154902/small_b1b03f9b-094b-44b4-8a8e-aa413cee32e7.jpg';
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

</style>
