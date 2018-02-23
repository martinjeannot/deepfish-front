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
          <div>
            <div class="headline">{{ this.opportunity.companyName }}</div>
            <span class="grey--text">Fonction proposé : {{ this.opportunity.job.l10nKey }}</span>
          </div>
        </v-card-title>
        <v-card-text>Bla bla bla, on met quoi ici à part le pitch ?</v-card-text>
        <v-card-actions v-if="this.opportunity.status === 'PENDING'">
          <v-layout row wrap class="text-xs-center">
            <v-flex xs12 sm4>
              <v-btn flat color="success" @click="accept">Accepter</v-btn>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn flat color="warning" @click="declinationDialog = true">Décliner</v-btn>
            </v-flex>
            <v-flex xs12 sm4>
              <v-btn flat color="error" @click="bulkRefusalDialog = true">Refuser tout</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-dialog v-model="declinationDialog" max-width="40%">
      <v-container style="background-color: white">
        <v-form v-model="opportunityDeclinationValid" @submit.prevent="decline">
          <v-layout row wrap>
            <v-flex xs12>
              <h4>Expliquez la raison de votre refus en quelques mots</h4>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="opportunity.refusalReason" multi-line rows="7"
                            :rules="[rules.required]"></v-text-field>
            </v-flex>
            <v-flex xs12 class="text-xs-right">
              <v-btn type="submit" fab small color="primary" :disabled="!opportunityDeclinationValid">
                <v-icon>done</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-dialog>
    <v-dialog v-model="bulkRefusalDialog" max-width="40%">
      <v-container style="background-color: white">
        <v-layout row wrap>
          <v-flex xs1>
            <v-icon>warning</v-icon>
          </v-flex>
          <v-flex xs11>
            <h3>
              Attention, cette action entraînera le refus de toutes vos opportunités en attente et la désactivation de votre profil</h3>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn flat color="error" @click="refuseInBulk">Je confirme cette action</v-btn>
          </v-flex>
        </v-layout>
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
      opportunityDeclinationValid: false,
      bulkRefusalDialog: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'user',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      fetchData() {
        this.prepareForApiConsumption();
        this.api(`/opportunities/${this.id}?projection=partial`)
          .then((response) => {
            this.opportunity = response.data;
          })
          .finally(() => this.clearLoading());
      },
      accept() {
        this.opportunity.status = 'ACCEPTED';
        this.saveOpportunity();
      },
      decline() {
        this.opportunity.status = 'REFUSED';
        this.declinationDialog = false;
        this.saveOpportunity();
      },
      saveOpportunity() {
        this.api
          .patch(this.opportunity._links.self.href, this.opportunity)
          .then(() => this.showSnackbar('Opération terminée avec succès'))
          .catch(() => {
            this.fetchData();
            this.showSnackbar('Erreur');
          });
      },
      refuseInBulk() {
        this.bulkRefusalDialog = false;
        this.api.post(`/talents/${this.user.id}/opportunities/bulk-refusal`)
          .then(() => {
            this.$router.push('/talent/opportunities');
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
