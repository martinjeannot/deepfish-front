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
        <v-card-title primary-title style="height: 93px">
          <v-flex xs12 class="text-xs-center">
            <div class="headline">
              <span class="font-weight-bold">20%</span>
              du
              <span class="font-weight-bold">salaire fixe</span>
              *
            </div>
            <span class="grey--text text--darken-2">Paiement au démarrage</span>
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
              Intéressés pour rejoindre votre ESN
              <v-icon color="success">done</v-icon>
            </div>
            <v-divider></v-divider>
            <div class="pa-2 headline">
              Garantie de remplacement durant les 4 premiers mois d'essai
              <v-icon color="success">done</v-icon>
            </div>
          </v-flex>
          <v-flex xs12 class="grey--text text--darken-2">
            * salaire fixe annuel hors variable
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 sm5 md4
            :class="[{'pl-2': $vuetify.breakpoint.smAndUp}]">
      <v-card height="100%">
        <v-img src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" height="200px">
          <v-container fill-height fluid>
            <v-layout fill-height>
              <v-flex xs12>
                <span class="headline white--text">Le plus sûr</span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-img>
        <v-card-title primary-title style="height: 93px">
          <v-flex xs12 class="text-xs-center">
            <div class="headline">
              <span class="font-weight-bold">2%/mois</span>
              du
              <span class="font-weight-bold">salaire fixe</span>
              *
            </div>
            <span class="grey--text text--darken-2">Pendant 12 mois</span>
          </v-flex>
        </v-card-title>
        <v-card-text style="height: calc(100% - 200px - 93px)">
          <v-flex xs12 class="text-xs-center pb-3" style="height: calc(100% - 21px)">
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
              Intéressés pour rejoindre votre ESN
              <v-icon color="success">done</v-icon>
            </div>
            <v-divider></v-divider>
            <div class="pa-2 headline">
              Arrêt de la facturation si départ prématuré du commercial
              <v-icon color="success">done</v-icon>
            </div>
          </v-flex>
          <v-flex xs12 class="grey--text text--darken-2">
            * salaire fixe annuel hors variable
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'EmployerPricing',
    data: () => ({}),
  };
</script>

<style scoped>

</style>
