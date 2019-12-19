<template>
  <v-stepper :value="currentStep">
    <v-stepper-header>
      <v-stepper-step
        :color="step1Color"
        :complete="currentStep > 1"
        edit-icon="check"
        editable
        error-icon="close"
        :rules="step1Rules"
        step="1"
      >
        Offre
        <small v-if="currentStep === 1">
          <v-icon small>location_on</v-icon>
          Vous êtes ici
        </small>
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step
        :color="step2Color"
        :complete="currentStep > 2"
        edit-icon="check"
        editable
        error-icon="close"
        :rules="step2Rules"
        step="2"
      >
        Entretiens
        <small v-if="currentStep === 2">
          <v-icon small>location_on</v-icon>
          Vous êtes ici
        </small>
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <div v-if="opportunity.talentStatus === 'PENDING'">
          Cette offre est <span class="font-weight-bold">en attente de réponse</span> de ta part
        </div>
        <div v-else-if="opportunity.talentStatus === 'ACCEPTED'">
          Tu as <span class="success--text">accepté</span> cette offre
        </div>
        <div v-else-if="opportunity.talentStatus === 'DECLINED'">
          Tu as <span class="error--text">refusé</span> cette offre
        </div>
      </v-stepper-content>

      <v-stepper-content step="2">
        <div v-if="opportunity.talentStatus !== 'ACCEPTED'">
          <div v-if="opportunity.employerStatus === 'ACCEPTED'">
            Tu peux désormais choisir parmi les créneaux proposés et passer les entretiens avec le recruteur
          </div>
          <div v-else>
            Après acceptation de son offre, le recruteur reviendra vers toi pour te proposer des créneaux d'entretiens
          </div>
        </div>
        <div v-else>
          <div v-if="opportunity.employerStatus === 'PENDING'">
            Le recruteur va revenir vers toi pour te proposer des créneaux d'entretiens
          </div>
          <div v-else-if="opportunity.employerStatus === 'ACCEPTED'">
            Tu peux désormais choisir parmi les créneaux proposés et passer les entretiens avec le recruteur
          </div>
          <div v-else-if="opportunity.employerStatus === 'DECLINED'">
            Le recruteur n'a pas souhaité donné suite
          </div>
        </div>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  export default{
    name: 'TalentOpportunityStatus',
    props: {
      opportunity: Object,
    },
    data: () => ({}),
    computed: {
      currentStep() {
        if (this.opportunity.talentStatus !== 'ACCEPTED') {
          return 1;
        }
        return 2;
      },
      step1Color() {
        switch (this.opportunity.talentStatus) {
          case 'ACCEPTED':
            return 'success';
          case 'DECLINED':
            return 'error';
          default:
            return 'primary';
        }
      },
      step1Rules() {
        return [() => this.opportunity.talentStatus !== 'DECLINED'];
      },
      step2Color() {
        switch (this.opportunity.employerStatus) {
          case 'ACCEPTED':
            return 'success';
          case 'DECLINED':
            return 'error';
          default:
            return 'primary';
        }
      },
      step2Rules() {
        return [() => this.opportunity.employerStatus !== 'DECLINED'];
      },
    },
    created() {
    },
  };
</script>

<style scoped>

</style>
