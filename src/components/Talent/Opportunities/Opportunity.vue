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
          <v-flex xs3 lg2>
            <v-img :src="opportunity.company.logoURL ? opportunity.company.logoURL : 'static/img/placeholder_150.jpg'"
                   alt="logo"></v-img>
          </v-flex>
          <v-flex xs9 lg10 pl-3>
            <div class="headline">{{ opportunity.company.name }}</div>
            <div class="grey--text">Salaire fixe et localisation : ils respectent tes conditions</div>
            <div v-if="opportunity.requirement.status === 'CLOSED'">
              <v-chip v-html="'L\'offre n\'est plus d\'actualité'" class="text-xs-center pa-2"></v-chip>
            </div>
            <div v-else-if="opportunity.talentStatus !== 'PENDING'">
              <v-chip :color="getOpportunityStatusColor(opportunity.employerStatus)"
                      v-html="getLabelFromOpportunityStatus(opportunity.employerStatus)" class="text-xs-center pa-2">
              </v-chip>
            </div>
          </v-flex>
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
          <v-layout row wrap class="text-xs-center" v-if="opportunity.requirement.status === 'OPEN'">
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
              <v-textarea v-model="opportunity.talentDeclinationReason"
                          multi-line rows="7" :rules="[rules.required]"></v-textarea>
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
                Attention, cette action entraînera le refus de toutes tes
                opportunités en attente et la désactivation de ton profil
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
  import { mapGetters, mapState, mapActions } from 'vuex';

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
      ...mapState([
        'getOpportunityStatusColor',
        'getLabelFromOpportunityStatus',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
        'saveOpportunityData',
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
        const previousState = Object.assign({}, opportunity);
        opportunity.talentStatus = 'ACCEPTED';
        return this
          .saveOpportunity(opportunity, previousState)
          .then(() => {
            this.menuBadges.opportunities = this.menuBadges.opportunities - 1;
            this.$router.push('/talent/opportunities?opportunityAccepted');
          });
      },
      decline(opportunity) {
        const previousState = Object.assign({}, opportunity);
        opportunity.talentStatus = 'DECLINED';
        this.declinationDialog = false;
        return this
          .saveOpportunity(opportunity, previousState)
          .then(() => {
            this.menuBadges.opportunities = this.menuBadges.opportunities - 1;
            this.$router.push('/talent/opportunities');
          });
      },
      saveOpportunity(opportunity, previousState) {
        return this
          .saveOpportunityData({ opportunity, previousState })
          .then(() => this.showSnackbar('Opération terminée avec succès'))
          .catch(() => {
            this.showSnackbar('Erreur');
            this.fetchData();
          });
      },
      declineInBulk() {
        this.bulkDeclinationDialog = false;
        this.api
          .post(`/talents/${this.user.id}/opportunities/bulk-declination`, {
            bulkDeclinationReason: this.bulkDeclinationReason,
          })
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
