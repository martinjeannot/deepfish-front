<template>
  <v-card>
    <v-layout wrap class="text-xs-center">
      <v-flex
        xs6
        class="pa-3"
        :style="{ borderBottom: 'thin solid grey', borderRight: 'thin solid grey' }"
      >
        <div class="caption grey--text text--darken-2">
          FOND&Eacute;E EN
        </div>
        <div class="title success--text">
          {{ company.foundedIn }}
        </div>
      </v-flex>
      <v-flex
        xs6
        class="pa-3"
        :style="{ borderBottom: 'thin solid grey' }"
      >
        <div class="caption grey--text text--darken-2">
          CHIFFRE D'AFFAIRES
        </div>
        <div class="title success--text">
          {{ company.revenue }}
        </div>
      </v-flex>
      <v-flex
        xs12
        class="pa-3"
        :style="{ borderBottom: 'thin solid grey' }"
      >
        <div class="caption grey--text text--darken-2">
          COLLABORATEURS
        </div>
        <div class="title success--text">
          {{ company.size }}
        </div>
      </v-flex>
      <v-flex
        xs12
        class="pa-3"
      >
        <div class="caption grey--text text--darken-2">
          R&Eacute;F&Eacute;RENCES CLIENTS
        </div>
        <div class="font-weight-bold success--text">
          {{ company.customerReferences }}
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
  export default {
    name: 'TalentOpportunityCompanyStats',
    props: ['company'],
    data: () => ({}),
  };
</script>

<style scoped>

</style>
