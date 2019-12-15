<template>
  <div>
    <v-stepper v-model="currentStep" @input="scrollToTop">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="currentStep > 1">Mon poste souhaité (1 question)</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="currentStep > 2">Mes exigences (3 questions)</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Ma présentation (2 questions)</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <conditions-position></conditions-position>
          <v-btn color="primary" @click.native="currentStep++">Suivant</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <conditions-wishes :fixed-salary-valid.sync="fixedSalaryValid"></conditions-wishes>
          <v-alert :value="!fixedSalaryValid" type="info">
            Nous avons besoin de tes
            <v-btn small @click="scrollToTop">prétentions salariales</v-btn>
            pour t'envoyer des opportunités qui les respectent
          </v-alert>
          <v-btn flat @click.native="currentStep--">Précédent</v-btn>
          <v-btn color="primary" @click.native="currentStep++" :disabled="!fixedSalaryValid">Suivant</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <conditions-self-pitch></conditions-self-pitch>
          <v-btn flat @click.native="currentStep--">Précédent</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
  import ConditionsPosition from './Conditions/Position';
  import ConditionsWishes from './Conditions/Wishes';
  import ConditionsSelfPitch from './Conditions/SelfPitch';

  export default {
    name: 'TalentConditions',
    components: {
      ConditionsPosition,
      ConditionsWishes,
      ConditionsSelfPitch,
    },
    data: () => ({
      currentStep: 0,
      fixedSalaryValid: false,
    }),
    methods: {
      scrollToTop() {
        window.scrollTo(0, 0);
      },
    },
  };
</script>

<style scoped>

</style>
