<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="pt-5 text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <talent-opportunities-welcome
    v-else-if="!totalItems"
  ></talent-opportunities-welcome>
  <v-layout v-else row wrap>
    <v-layout v-if="alertComponent">
      <v-flex xs12 sm6 offset-sm3>
        <base-alert :type="alertComponent.type" :message="alertComponent.message"
                    @dismissed="onAlertComponentDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-flex xs8>
      <v-flex xs12>
        <h2>Mes offres en attente</h2>
        <v-container fluid grid-list-md>
          <v-data-iterator
            :items="pendingOpportunities"
            :hide-actions="true"
            content-tag="v-layout" row wrap
          >
            <v-flex xs12 slot="item" slot-scope="props">
              <opportunity-overview
                :opportunity="props.item"
              ></opportunity-overview>
            </v-flex>
            <v-flex xs12 slot="no-data">
              <v-alert v-if="totalItems" type="success" :value="true">
                Tout est OK, aucune offre en attente
              </v-alert>
              <v-alert v-else type="info" :value="true">
                Tu n'as pas encore reçu d'offre
              </v-alert>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-flex>
      <v-flex xs12>
        <h2>Mes offres en cours</h2>
        <v-container fluid grid-list-md>
          <v-data-iterator
            :items="inProcessOpportunities"
            :hide-actions="true"
            content-tag="v-layout" row wrap
          >
            <v-flex slot="item" slot-scope="props" xs12>
              <opportunity-overview
                :opportunity="props.item"
              ></opportunity-overview>
            </v-flex>
            <v-flex xs12 slot="no-data">
              <v-alert type="info" :value="true">
                Tu n'as pas encore d'offres en cours
              </v-alert>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-flex>
      <v-flex xs12>
        <h2>Mes offres archivées</h2>
        <v-container fluid grid-list-md>
          <v-data-iterator
            :items="dismissedOpportunities"
            :hide-actions="true"
            content-tag="v-layout" row wrap
          >
            <v-flex slot="item" slot-scope="props" xs12>
              <opportunity-overview
                :opportunity="props.item"
              ></opportunity-overview>
            </v-flex>
            <v-flex xs12 slot="no-data">
              <v-alert type="info" :value="true">
                Tu n'as pas encore d'offres archivées
              </v-alert>
            </v-flex>
          </v-data-iterator>
        </v-container>
      </v-flex>
    </v-flex>
    <v-flex
      xs4
      :class="['pt-5', 'pl-3', {'fixed': $vuetify.breakpoint.smAndUp}]"
    >
      <talent-advocate
        :talent-advocate="user.talentAdvocate"
      ></talent-advocate>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapState, mapActions } from 'vuex';
  import TalentAdvocate from '@/components/Talent/TalentAdvocate';
  import TalentOpportunitiesWelcome from './Welcome';
  import OpportunityOverview from './OpportunityOverview';

  export default {
    name: 'TalentOpportunities',
    components: {
      TalentAdvocate,
      TalentOpportunitiesWelcome,
      OpportunityOverview,
    },
    data: () => ({
      pendingOpportunities: [],
      inProcessOpportunities: [],
      dismissedOpportunities: [],
      totalItems: 0,
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'alertComponent',
        'user',
        'menuBadges',
      ]),
      ...mapState([
        'getOpportunityStatusColor',
        'getLabelFromOpportunityStatus',
      ]),
      calendlyUrl() {
        return `${process.env.TALENT_CALENDLY_URL}?name=${this.user.firstName}%20${this.user.lastName}&email=${this.user.email}&a1=${this.user.phoneNumber}`;
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setAlertComponent',
        'onAlertComponentDismissed',
      ]),
    },
    filters: {
      hideText(value) {
        if (!value) return '';
        return value.replace(/./gi, '?');
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this.api(`/opportunities?projection=talent-interviews&version=2&talent=${this.user.id}&sort=createdAt,desc`)
        .then((response) => {
          this.totalItems = response.data.page.totalElements;
          this.pendingOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.requirement.status === 'OPEN' && opportunity.talentStatus === 'PENDING');
          this.menuBadges.opportunities = this.pendingOpportunities.length;
          this.inProcessOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.requirement.status === 'OPEN' && opportunity.talentStatus === 'ACCEPTED' && opportunity.employerStatus !== 'DECLINED');
          this.inProcessOpportunities.forEach((opportunity) => {
            if (opportunity.interviews.some(
                interview => moment().utcOffset(interview.startTimeZone).isBefore(interview.startAt)
                && interview.talentResponseStatus === 'NEEDS_ACTION')) {
              opportunity.badged = true;
              this.menuBadges.opportunities += 1;
            }
          });
          this.dismissedOpportunities = response.data._embedded.opportunities
            .filter(opportunity => opportunity.requirement.status === 'CLOSED' || opportunity.talentStatus === 'DECLINED' || opportunity.employerStatus === 'DECLINED');
          // opportunity accepted
          if (Object.prototype.hasOwnProperty.call(this.$route.query, 'opportunity-accepted')) {
            this.setAlertComponent({
              type: 'success',
              message: 'OK, le recruteur va revenir vers toi pour te proposer des créneaux d\'échange !',
            });
          }
        })
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
  .blurred-image {
    -webkit-filter: blur(18px);
    filter: blur(18px);
  }

  .blurred-text {
    -webkit-filter: blur(4px);
    filter: blur(4px);
  }

  .fixed {
    position: fixed;
    right: 24px;
  }
</style>
