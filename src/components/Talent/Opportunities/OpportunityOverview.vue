<template>
  <v-card
    :to="isDismissed ? null : {name: 'TalentOpportunity', params: {id: opportunity.id}}"
  >
    <v-card-text>
      <v-layout wrap>
        <v-flex xs4 sm2 md1>
          <v-img
            :src="companyLogoUrl"
            alt="logo" max-width="100px"
          ></v-img>
        </v-flex>
        <v-flex xs8 sm4 md7>
          <v-flex xs12 class="title">
            {{ opportunity.company.name }}
          </v-flex>
          <v-flex xs12>
            <span class="body-2">{{ opportunity.name }}</span>
            - Salaire fixe proposé :
            <span class="body-2">{{ opportunity.baseSalaryFrom}}k€ à {{ opportunity.baseSalaryTo }}k€</span>
          </v-flex>
          <v-flex v-if="opportunity.employerStatus !== 'DECLINED'" xs12>
            <div class="body-2">Message du recruteur</div>
            {{ pitchExtract }}
          </v-flex>
          <v-flex v-else xs12>
            <div class="body-2">Message du recruteur</div>
            {{ opportunity.employerDeclinationReason }}
          </v-flex>
        </v-flex>
        <v-flex xs12 sm6 md4 class="text-xs-center" pt-3>
          <v-badge overlap color="red">
            <v-icon v-if="badged" slot="badge" color="white">priority_high</v-icon>
            <v-chip
              v-html="chipText"
              :color="chipColor"
              :outline="chipOutline"
              class="pa-3"
            ></v-chip>
          </v-badge>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'TalentOpportunityOverview',
    props: {
      opportunity: Object,
    },
    computed: {
      isDismissed() {
        return this.opportunity.requirement.status === 'CLOSED'
          || this.opportunity.talentStatus === 'DECLINED'
          || this.opportunity.employerStatus === 'DECLINED';
      },
      companyLogoUrl() {
        if (this.opportunity.company.logoURL) {
          return this.opportunity.company.logoURL;
        }
        return '/static/img/placeholder_150.jpg';
      },
      pitchExtract() {
        const extractLength = 150;
        if (this.opportunity.pitch.length > extractLength) {
          return `${this.opportunity.pitch.substr(0, extractLength)}...`;
        }
        return this.opportunity.pitch;
      },
      badged() {
        if (this.opportunity.requirement.status === 'CLOSED') {
          return false;
        }
        return !!(this.opportunity.badged || this.opportunity.talentStatus === 'PENDING');
      },
      chipText() {
        if (this.opportunity.requirement.status === 'CLOSED') {
          return 'Plus d\'actualité';
        }
        if (this.opportunity.talentStatus === 'DECLINED') {
          return 'Refusé';
        }
        if (this.opportunity.employerStatus === 'DECLINED') {
          return 'Non concluant';
        }
        if (this.opportunity.talentStatus === 'PENDING') {
          return 'En attente d\'une réponse de ta part';
        }
        if (this.opportunity.talentStatus === 'ACCEPTED') {
          return 'Process en cours';
        }
        return 'N/A';
      },
      chipColor() {
        if (this.opportunity.requirement.status === 'CLOSED'
          || this.opportunity.talentStatus === 'DECLINED'
          || this.opportunity.employerStatus === 'DECLINED') {
          return 'grey lighten-2';
        }
        if (this.opportunity.talentStatus === 'PENDING') {
          return 'red';
        }
        if (this.opportunity.talentStatus === 'ACCEPTED') {
          return 'green';
        }
        return 'grey lighten-2';
      },
      chipOutline() {
        return this.opportunity.requirement.status === 'OPEN'
          && this.opportunity.talentStatus === 'PENDING';
      },
    },
    data: () => ({}),
  };
</script>

<style scoped>

</style>
