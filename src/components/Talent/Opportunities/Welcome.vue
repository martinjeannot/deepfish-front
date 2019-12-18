<template>
  <v-layout wrap>
    <talent-referral-dialog
      :value.sync="talentReferralDialog"
    ></talent-referral-dialog>
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
          <v-flex xs12 class="text-xs-center py-2">
            <v-icon
              color="primary"
              :size="61"
            >
              perm_phone_msg
            </v-icon>
          </v-flex>
          <v-flex xs12 class="text-xs-center font-weight-bold pb-2">
            Nous échangeons sur ton parcours
          </v-flex>
          <v-flex xs12 class="text-xs-center grey--text text--darken-2">
            Nous allons réaliser un rapide entretien téléphonique pour mettre en avant ton profil auprès des recruteurs de la plateforme.
            <a target="_blank" href="https://calendly.com/deepfish/tal">Choisis un créneau ici</a>
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
              visibility
            </v-icon>
          </v-flex>
          <v-flex xs12 class="text-xs-center font-weight-bold pb-2">
            Ton profil est rendu visible pour les recruteurs
          </v-flex>
          <v-flex xs12 class="text-xs-center grey--text text--darken-2">
            Tu vas recevoir plusieurs offres détaillées en direct des recruteurs. Ton profil reste invisible de ton employeur actuel et de tes ex-employeurs
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
              assignment_turned_in
            </v-icon>
          </v-flex>
          <v-flex xs12 class="text-xs-center font-weight-bold pb-2">
            Tu acceptes les offres intéressantes
          </v-flex>
          <v-flex xs12 class="text-xs-center grey--text text--darken-2">
            Tu acceptes les offres qui t'intéressent pour échanger avec le recruteur
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
            Les recruteurs te proposent 3 créneaux d'échange via la plateforme, tu valides celui qui te convient le mieux
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-flex xs12 class="text-xs-center">
      <v-btn
        color="primary"
        @click.native.stop="talentReferralDialog = true"
      >
        Parrainer un collègue commercial
      </v-btn>
      <div class="font-weight-bold">500€ à gagner !</div>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import TalentReferralDialog from '../Referral/Dialog';

  export default {
    name: 'TalentOpportunitiesWelcome',
    components: {
      TalentReferralDialog,
    },
    data: () => ({
      talentReferralDialog: false,
    }),
    computed: {
      ...mapGetters([
        'user',
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
        message: 'Ton inscription est terminée ! Ton profil reste confidentiel tant qu\'il n\'a pas été validé par notre équipe.',
      });
    },
  };
</script>

<style scoped>
  .height-100 {
    height: 100%;
  }
</style>
