<template>
  <div>
    <v-stepper v-model="currentStep">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="currentStep > 1">Mon poste</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :complete="currentStep > 2">Mes souhaits</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">Ma présentation</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <conditions-position></conditions-position>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
          <v-btn color="primary" @click.native="currentStep = 3">Continue</v-btn>
          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-card color="grey lighten-1" class="mb-5" height="200px"></v-card>
          <v-btn color="primary" @click.native="currentStep = 1">Continue</v-btn>
          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
  import ConditionsPosition from './Conditions/Position';

  export default {
    name: 'talent-conditions',
    components: { ConditionsPosition },
    data: () => ({
      currentStep: 0,
    }),
  }
  ;
</script>

<style scoped>

</style>
