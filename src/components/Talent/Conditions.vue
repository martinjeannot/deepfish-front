<template>
  <div>
    <v-stepper v-model="currentStep">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="currentStep > 1" editable>Mon poste</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="currentStep > 2" editable>Mes souhaits</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" editable>Ma présentation</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <conditions-position></conditions-position>
          <v-btn color="primary" @click.native="currentStep++">Suivant</v-btn>
        </v-stepper-content>
        <v-stepper-content step="2">
          <conditions-wishes></conditions-wishes>
          <v-btn flat @click.native="currentStep--">Précédent</v-btn>
          <v-btn color="primary" @click.native="currentStep++">Suivant</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
          <v-btn flat @click.native="currentStep--">Précédent</v-btn>
          <v-btn color="primary" @click.native="currentStep = 1">Terminer</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
  import ConditionsPosition from './Conditions/Position';
  import ConditionsWishes from './Conditions/Wishes';

  export default {
    name: 'talent-conditions',
    components: {
      ConditionsWishes,
      ConditionsPosition,
    },
    data: () => ({
      currentStep: 0,
    }),
  };
</script>

<style scoped>

</style>
