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
        Opportunité
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
        Validation
        <small v-if="currentStep === 2">
          <v-icon small>location_on</v-icon>
          Vous êtes ici
        </small>
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step
        :editable="true"
        step="3"
      >
        Entretiens
        <small v-if="currentStep === 3">
          <v-icon small>location_on</v-icon>
          Vous êtes ici
        </small>
      </v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <div v-if="opportunity.talentStatus === 'PENDING'">
          Cette opportunité est <span class="font-weight-bold">en attente de réponse</span> de ta part
        </div>
        <div v-else-if="opportunity.talentStatus === 'ACCEPTED'">
          Tu as <span class="success--text">accepté</span> cette opportunité
        </div>
        <div v-else-if="opportunity.talentStatus === 'DECLINED'">
          Tu as <span class="error--text">refusé</span> cette opportunité
        </div>
      </v-stepper-content>

      <v-stepper-content step="2">
        <div v-if="opportunity.talentStatus !== 'ACCEPTED'">
          Si tu acceptes cette opportunité, Deepfish s'assurera une dernière fois du matching et présentera ton profil au recruteur pour validation de sa part
        </div>
        <div v-else>
          <div v-if="opportunity.employerStatus === null">
            Ton profil est en cours de validation par Deepfish
          </div>
          <div v-else-if="opportunity.employerStatus === 'PENDING'">
            Ton profil est en cours de validation par le recruteur
          </div>
          <div v-if="opportunity.employerStatus === 'ACCEPTED'">
            Le recruteur a <span class="success--text">accepté</span> ton profil !
          </div>
          <div v-if="opportunity.employerStatus === 'DECLINED'">
            Le recruteur a <span class="error--text">décliné</span> ton profil
          </div>
        </div>
      </v-stepper-content>

      <v-stepper-content step="3">
        <div v-if="opportunity.employerStatus !== 'ACCEPTED'">
          Si le recruteur valide ton profil, il te proposera des créneaux d'entretiens parmi lesquels tu pourras choisir
        </div>
        <div v-else>
          Tu peux désormais choisir parmi les créneaux proposés et passer les entretiens avec le recruteur
        </div>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  export default{
    name: 'TalentOpportunityStatus',
    props: ['opportunity'],
    data: () => ({}),
    computed: {
      currentStep() {
        if (this.opportunity.talentStatus !== 'ACCEPTED') {
          return 1;
        } else if (this.opportunity.employerStatus !== 'ACCEPTED') {
          return 2;
        } else if (this.opportunity.employerStatus === 'ACCEPTED') {
          return 3;
        }
        return 0;
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
