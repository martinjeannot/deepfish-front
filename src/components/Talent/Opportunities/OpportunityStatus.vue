<template>
  <v-stepper>
    <v-stepper-header>
      <v-stepper-step step="1">Opportunité</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="2">Validation Deepfish</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">Validation recruteur</v-stepper-step>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        Help needed ! :) Ici il faudrait expliquer le proessus de recrutement via Deepfish et où on en est dans ce processus
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  export default{
    name: 'TalentOpportunityStatus',
    props: ['opportunity'],
    data: () => ({}),
  };
</script>

<style scoped>

</style>
