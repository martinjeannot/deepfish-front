<template>
  <v-card class="full-height-centered">
    <v-card-text>
      <v-layout wrap class="text-xs-center">
        <v-flex xs12 class="caption grey--text text--darken-2">
          LIEU DE TRAVAIL
        </v-flex>
        <v-flex xs1 align-self-center class="hidden-sm-and-up">
          <v-icon>location_on</v-icon>
        </v-flex>
        <v-flex xs11 sm12 class="pb-2 white--text">
          <v-icon class="hidden-xs-only">location_on</v-icon>
          <a
            :href="`http://maps.google.com/?q=${opportunity.company.headquartersAddress}`"
            target="_blank"
          >
            {{ opportunity.company.headquartersAddress }}
          </a>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'TalentOpportunityMap',
    props: ['opportunity'],
    date: () => ({}),
  };
</script>

<style scoped>
  .full-height-centered {
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
