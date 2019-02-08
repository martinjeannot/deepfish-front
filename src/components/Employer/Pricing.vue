<template>
  <v-layout row wrap>
    <v-flex xs12 sm5 offset-sm1 md4 offset-md2
            :class="[{'pb-3': $vuetify.breakpoint.xsOnly}, {'pr-2': $vuetify.breakpoint.smAndUp}]">
      <v-card>
        <v-img src="https://cdn.vuetifyjs.com/images/cards/road.jpg" height="200px">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12>
                <span class="headline">Le plus simple</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
        <v-card-title primary-title>
          <v-flex xs12 class="text-xs-center">
            <div class="headline">
              <span class="font-weight-bold">20%</span>
              du
              <span class="font-weight-bold">salaire fixe</span>
            </div>
            <span class="grey--text text--darken-2">Paiement en 3 tiers *</span>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-flex xs12 class="text-xs-center pb-3">
            <div class="pa-2 headline">
              Profils qualifiés
              <v-icon color="success">done</v-icon>
            </div>
            <v-divider></v-divider>
            <div class="pa-2 headline">
              Profils à l'écoute
              <v-icon color="success">done</v-icon>
            </div>
            <v-divider></v-divider>
            <div class="pa-2 headline">
              Intéressés pour vous rejoindre
              <v-icon color="success">done</v-icon>
            </div>
          </v-flex>
          <v-flex xs12 class="grey--text text--darken-2">
            * 1/3 à l'accord, 1/3 au démarrage, 1/3 à validation des 4 mois d'essai
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 sm5 md4
            :class="[{'pl-2': $vuetify.breakpoint.smAndUp}]">
      <v-card>
        <v-img src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" height="200px">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12>
                <span class="headline white--text">Le plus sûr</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
        <v-card-title primary-title>
          <v-flex xs12 class="text-xs-center">
            <div class="headline">
              <span class="font-weight-bold">2%/mois</span>
              du
              <span class="font-weight-bold">salaire fixe</span>
            </div>
            <span class="grey--text text--darken-2">Pendant 12 mois</span>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-flex xs12 class="text-xs-center pb-3">
            <div class="pa-2 headline">
              Profils qualifiés
              <v-icon color="success">done</v-icon>
            </div>
            <v-divider></v-divider>
            <div class="pa-2 headline">
              Profils à l'écoute
              <v-icon color="success">done</v-icon>
            </div>
            <v-divider></v-divider>
            <div class="pa-2 headline">
              Intéressés pour vous rejoindre
              <v-icon color="success">done</v-icon>
            </div>
          </v-flex>
          <v-flex xs12 class="white--text">
            * 1/3 à l'accord, 1/3 au démarrage, 1/3 à validation des 4 mois d'essai
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'employer-pricing',
    data: () => ({}),
  };
</script>

<style scoped>

</style>
