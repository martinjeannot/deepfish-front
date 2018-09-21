<template>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title>
          <v-layout>
            <v-flex xs3 md3 lg2 mr-3>
              <v-img :src="opportunity.company.logoURL" alt="logo"></v-img>
            </v-flex>
            <v-flex xs9 md9 lg10>
              <div class="headline">{{ opportunity.company.name }}</div>
              <div class="grey--text">Fonction proposée : {{ opportunity.jobType.l10nKey }}</div>
              <div class="grey--text">Localisation : {{ opportunity.location }}</div>
              <div class="grey--text">Salaire fixe : il respecte tes conditions</div>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-flex xs12 class="pb-2">
            <span style="font-style: italic">{{ opportunity.company.name }}</span> :
          </v-flex>
          <v-flex xs12 class="pb-3" style="white-space: pre-wrap" v-html="opportunity.company.description"
                  v-linkified></v-flex>
          <v-flex xs12 style="white-space: pre-wrap" v-html="opportunity.pitch" v-linkified></v-flex>
        </v-card-text>
        <v-card-actions v-if="opportunity.talentStatus === 'PENDING'">
          <v-layout row wrap class="text-xs-center">
            <v-flex xs12 sm4>
              <v-btn flat color="success" @click="accept(opportunity)">J'accepte</v-btn>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn flat color="warning" @click="declinationDialog = true">Je refuse</v-btn>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn flat color="error" @click="bulkDeclinationDialog = true">Je me désactive</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog v-model="declinationDialog" max-width="650px">
      <v-container style="background-color: white">
        <v-form v-model="declinationValid" @submit.prevent="decline(opportunity)">
          <v-layout row wrap>
            <v-flex xs12>
              <h4>Explique-nous la raison de ton refus en quelques mots</h4>
            </v-flex>
            <v-flex xs12>
              <v-textarea v-model="opportunity.talentDeclinationReason" multi-line rows="7"
                          :rules="[rules.required]"></v-textarea>
            </v-flex>
            <v-flex xs12 class="text-xs-right">
              <v-btn type="submit" fab small color="primary" :disabled="!declinationValid">
                <v-icon>done</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-dialog>
    <v-dialog v-model="bulkDeclinationDialog" max-width="650px">
      <v-container style="background-color: white">
        <v-form v-model="bulkDeclinationValid" @submit.prevent="declineInBulk(opportunity)">
          <v-layout row wrap>
            <v-flex xs1>
              <v-icon>warning</v-icon>
            </v-flex>
            <v-flex xs11>
              <h3>
                Attention, cette action entraînera le refus de toutes tes opportunités en attente et la désactivation de ton profil
              </h3>
            </v-flex>
            <v-flex xs12 class="mt-3">
              <h4>Explique-nous la raison de ton refus en quelques mots</h4>
            </v-flex>
            <v-flex xs12>
              <v-textarea v-model="bulkDeclinationReason" multi-line rows="7" :rules="[rules.required]"></v-textarea>
            </v-flex>
            <v-flex xs12 class="text-xs-center">
              <v-btn type="submit" flat color="error" :disabled="!bulkDeclinationValid">Je confirme cette action</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'opportunity',
    props: ['id'],
    data: () => ({
      rules,
      opportunity: null,
      declinationDialog: false,
      declinationValid: false,
      bulkDeclinationDialog: false,
      bulkDeclinationValid: false,
      bulkDeclinationReason: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'user',
        'menuBadges',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
        'setAlertComponent',
      ]),
      fetchData() {
        this.prepareForApiConsumption();
        this.api(`/opportunities/${this.id}?projection=talent`)
          .then((response) => {
            this.opportunity = response.data;
          })
          .finally(() => this.clearLoading());
      },
      accept(opportunity) {
        opportunity.previousState = Object.assign({}, opportunity);
        opportunity.talentStatus = 'ACCEPTED';
        this
          .saveOpportunity(opportunity)
          .then(() => {
            this.menuBadges.opportunities = this.menuBadges.opportunities - 1;
            this.$router.push('/talent/opportunities');
            this.setAlertComponent({
              type: 'success',
              message: `${opportunity.company.name} va maintenant découvrir ton profil complet (non anonymisé) et revenir vers toi si son intérêt est confirmé`,
            });
          });
      },
      decline(opportunity) {
        opportunity.previousState = Object.assign({}, opportunity);
        opportunity.talentStatus = 'DECLINED';
        this.declinationDialog = false;
        this
          .saveOpportunity(opportunity)
          .then(() => {
            this.menuBadges.opportunities = this.menuBadges.opportunities - 1;
            this.$router.push('/talent/opportunities');
          });
      },
      saveOpportunity(opportunity) {
        const opportunityData = Object.assign({}, opportunity);
        delete opportunityData.requirement;
        return this.api
          .patch(opportunity._links.self.href, opportunityData)
          .then(() => this.showSnackbar('Opération terminée avec succès'))
          .catch(() => {
            this.showSnackbar('Erreur');
            this.fetchData();
          });
      },
      declineInBulk() {
        this.bulkDeclinationDialog = false;
        this.api.post(`/talents/${this.user.id}/opportunities/bulk-declination`, { bulkDeclinationReason: this.bulkDeclinationReason })
          .then(() => {
            this.menuBadges.opportunities = 0;
            this.$router.push('/talent/opportunities'); // refresh data
            this.showSnackbar('Opération terminée avec succès');
          })
          .catch(() => {
            this.fetchData();
            this.showSnackbar('Erreur');
          });
      },
    },
    created() {
      this.fetchData();
    },
  };
</script>

<style scoped>

</style>
