<template>
  <v-layout wrap>
    <v-flex v-if="alertComponent" xs12 sm8 offset-sm2 class="pb-3">
      <base-alert :type="alertComponent.type" :message="alertComponent.message"
                  @dismissed="onAlertComponentDismissed"></base-alert>
    </v-flex>
    <v-flex xs12 sm8 offset-sm2 class="pb-4">
      <h5 class="headline">Et maintenant ?</h5>
      <v-divider></v-divider>
    </v-flex>

    <v-flex xs12 sm4 offset-sm2
            :class="['pb-4', {'pr-2': $vuetify.breakpoint.smAndUp}]"
    >
      <v-card
        class="height-100"
      >
        <v-card-text>
          <v-flex xs12 class="text-xs-center" style="margin-top: -36px">
            <v-chip color="indigo darken-2" dark class="font-weight-bold">
              1
            </v-chip>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-progress-circular
              color="primary"
              indeterminate
              :rotate="360"
              :size="80"
            >
              <span class="caption">Matching en cours</span>
            </v-progress-circular>
          </v-flex>
          <v-flex xs12 class="text-xs-center font-weight-bold pb-2">
            Nous sélectionnons les meilleures opportunités
          </v-flex>
          <v-flex xs12 class="text-xs-center grey--text text--darken-2">
            Notre algorithme de matching ainsi que nos équipes travaillent dès à présent pour te proposer les meilleures opportunités
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span v-on="on"><a>respectant tes conditions.</a></span>
              </template>
              <span>Tu peux mettre à jour tes conditions à tout moment et t'assurer de recevoir les opportunités qui te correspondent le mieux</span>
            </v-tooltip>
            Le matching peut prendre plusieurs heures, tu recevras un email de notification à chaque nouvelle opportunité reçue.
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 sm4
            :class="['pb-4', {'pl-2': $vuetify.breakpoint.smAndUp}]"
    >
      <v-card
        class="height-100"
      >
        <v-card-text>
          <v-flex xs12 class="text-xs-center" style="margin-top: -36px">
            <v-chip color="indigo darken-2" dark class="font-weight-bold">
              2
            </v-chip>
          </v-flex>
          <v-flex xs12 class="text-xs-center py-2">
            <v-icon
              color="primary"
              :size="61"
            >
              assignment
            </v-icon>
          </v-flex>
          <v-flex xs12 class="text-xs-center font-weight-bold pb-2">
            Tu choisis tes opportunités
          </v-flex>
          <v-flex xs12 class="text-xs-center grey--text text--darken-2">
            Tu acceptes ou non chaque opportunité en découvrant les détails sur l'entreprise et le poste.
            Tes raisons de refus, accessibles uniquement à Deepfish, nous permettent d'augmenter la pertinence des opportunités que tu recevras par la suite !
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 sm4 offset-sm2
            :class="['pb-4', {'pr-2': $vuetify.breakpoint.smAndUp}]"
    >
      <v-card
        class="height-100"
      >
        <v-card-text>
          <v-flex xs12 class="text-xs-center" style="margin-top: -36px">
            <v-chip color="indigo darken-2" dark class="font-weight-bold">
              3
            </v-chip>
          </v-flex>
          <v-flex xs12 class="text-xs-center py-2">
            <v-icon
              color="primary"
              :size="61"
            >
              perm_phone_msg
            </v-icon>
          </v-flex>
          <v-flex xs12 class="text-xs-center font-weight-bold pb-2">
            Tu échanges avec nous
          </v-flex>
          <v-flex xs12 class="text-xs-center grey--text text--darken-2">
            Lors de l'acceptation de ta première opportunité, tu choisis un créneau d'échange de 15 min avec Deepfish.
            Cet échange a pour but de valider tes attentes et de mettre en avant ton profil.
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 sm4
            :class="['pb-4', {'pl-2': $vuetify.breakpoint.smAndUp}]"
    >
      <v-card
        class="height-100"
      >
        <v-card-text>
          <v-flex xs12 class="text-xs-center" style="margin-top: -36px">
            <v-chip color="indigo darken-2" dark class="font-weight-bold">
              4
            </v-chip>
          </v-flex>
          <v-flex xs12 class="text-xs-center py-2">
            <v-icon
              color="primary"
              :size="61"
            >
              question_answer
            </v-icon>
          </v-flex>
          <v-flex xs12 class="text-xs-center font-weight-bold pb-2">
            Tu échanges avec l'entreprise
          </v-flex>
          <v-flex xs12 class="text-xs-center grey--text text--darken-2">
            Les recruteurs des opportunités que tu as acceptées te proposent des créneaux d'échange directement via la plateforme.
            Il ne te reste qu'à choisir parmi les créneaux proposés.
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 class="text-xs-center">
      <v-btn
        href="https://deepfish.typeform.com/to/Ppmd7e"
        target="_blank"
        color="primary"
      >
        Parrainer un collègue commercial
      </v-btn>
      <div class="font-weight-bold">500€ à gagner !</div>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'TalentOpportunitiesWelcome',
    data: () => ({}),
    computed: {
      ...mapGetters([
        'alertComponent',
      ]),
    },
    methods: {
      ...mapActions([
        'setAlertComponent',
        'onAlertComponentDismissed',
      ]),
    },
    created() {
      this.setAlertComponent({
        type: 'success',
        message: 'Félicitations, ton inscription est terminée !',
      });
    },
  };
</script>

<style scoped>
  .height-100 {
    height: 100%;
  }
</style>
