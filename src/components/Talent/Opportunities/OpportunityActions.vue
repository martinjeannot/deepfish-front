<template>
  <div>
    <v-card>
      <v-card-text>
        <v-layout
          wrap
          class="text-xs-center"
        >
          <v-flex
            xs12 sm6
            class="pb-3"
            :style="[$vuetify.breakpoint.xsOnly ? {paddingLeft: '45px'} : '']"
          >
            <v-btn
              color="success"
              :loading="loading"
              @click="accept(opportunity)"
            >
              Accepter
            </v-btn>
            <v-tooltip top>
              <template #activator="{ on }">
                <v-icon
                  large
                  v-on="on"
                  class="pl-2"
                  style="margin-bottom: -10px"
                >
                  help
                </v-icon>
              </template>
              <span>Accepter l'opportunité et poursuivre le processus de recrutement</span>
            </v-tooltip>
          </v-flex>
          <v-flex
            xs12 sm6
            class="pb-3"
          >
            <v-btn
              color="primary"
              @click="questionDialog = true"
            >
              Poser une question
            </v-btn>
          </v-flex>
          <v-flex
            xs12 sm6
            :class="[{'pb-3': $vuetify.breakpoint.xsOnly}]"
            :style="[$vuetify.breakpoint.xsOnly ? {paddingLeft: '45px'} : '']"
          >
            <v-btn
              color="warning"
              @click="declinationDialog = true"
            >
              Refuser
            </v-btn>
            <v-tooltip top>
              <template #activator="{ on }">
                <v-icon
                  large
                  v-on="on"
                  class="pl-2"
                  style="margin-bottom: -10px"
                >
                  help
                </v-icon>
              </template>
              <span>Refus visible uniquement par Deepfish, tes raisons de refus améliorent le matching</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs12 sm6>
            <v-btn
              color="error"
              @click="deactivationDialog = true"
            >
              Se désactiver
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

    <v-dialog v-model="questionDialog" max-width="650px">
      <v-card>
        <v-card-title>
          <v-flex xs12 class="title">
            Pour faire le bon choix
          </v-flex>
        </v-card-title>
        <v-form v-model="questionFormValid" @submit.prevent="askQuestion(opportunity)">
          <v-card-text>
            <v-flex xs12 class="subheading grey--text text--darken-2">
              Des questions à propos de l'opportunité ou de l'entreprise ? On te répond au plus vite !
              <v-textarea
                v-model="questionContent"
                :rules="[rules.required]"
              ></v-textarea>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-flex xs12 class="text-xs-right">
              <v-btn flat color="primary" @click="questionDialog = false">Annuler</v-btn>
              <v-btn type="submit" color="primary" :disabled="!questionFormValid" :loading="loading">
                Envoyer
              </v-btn>
            </v-flex>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="declinationDialog" max-width="650px">
      <v-card>
        <v-card-title>
          <v-flex xs12 class="title">
            Pour améliorer le matching
          </v-flex>
        </v-card-title>
        <v-form v-model="declinationFormValid" @submit.prevent="decline(opportunity, declinationReason)">
          <v-card-text>
            <v-flex xs12 class="subheading grey--text text--darken-2">
              Explique-nous la raison de ton refus en quelques mots :
              <v-textarea
                v-model="declinationReason"
                rows="7"
                :rules="[rules.required]"
              ></v-textarea>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-flex xs12 class="text-xs-right">
              <v-btn flat color="warning" @click="declinationDialog = false">Annuler</v-btn>
              <v-btn type="submit" color="warning" :disabled="!declinationFormValid" :loading="loading">
                Refuser
              </v-btn>
            </v-flex>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deactivationDialog" max-width="650px">
      <v-card>
        <v-card-title>
          <v-flex xs12 class="title">
            Plus à l'écoute ?
          </v-flex>
        </v-card-title>
        <v-form v-model="deactivationFormValid" @submit.prevent="deactivate(user.id, deactivationReason)">
          <v-card-text>
            <v-flex xs12 class="subheading grey--text text--darken-2">
              Explique-nous la raison de ta désactivation en quelques mots :
              <v-textarea
                v-model="deactivationReason"
                rows="7"
                :rules="[rules.required]"
              ></v-textarea>
              <v-icon>warning</v-icon>
              Attention, cette action entraînera le refus de toutes tes opportunités en attente<br/>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-flex xs12 class="text-xs-right">
              <v-btn flat color="error" @click="deactivationDialog = false">Annuler</v-btn>
              <v-btn type="submit" color="error" :disabled="!deactivationFormValid" :loading="loading">
                Se désactiver
              </v-btn>
            </v-flex>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'TalentOpportunityActions',
    props: ['opportunity'],
    data: () => ({
      rules,
      questionDialog: false,
      questionFormValid: false,
      questionContent: '',
      declinationDialog: false,
      declinationFormValid: false,
      declinationReason: '',
      deactivationDialog: false,
      deactivationFormValid: false,
      deactivationReason: '',
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
        'saveOpportunityData',
      ]),
      accept(opportunity) {
        this.prepareForApiConsumption();
        const previousState = Object.assign({}, opportunity);
        opportunity.talentStatus = 'ACCEPTED';
        return this
          .saveOpportunity(opportunity, previousState)
          .then(() => {
            this.$router.push('/talent/opportunities?opportunity-accepted');
          })
          .finally(() => this.clearLoading());
      },
      askQuestion(opportunity) {
        this.prepareForApiConsumption();
        this.api
          .post(`/opportunities/${opportunity.id}/ask-question`, {
            question: this.questionContent,
          })
          .then(() => {
            this.questionDialog = false;
            this.questionContent = '';
            this.showSnackbar(['Merci, nous revenons vers toi sous peu', 'success']);
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.clearLoading());
      },
      decline(opportunity, talentDeclinationReason) {
        this.prepareForApiConsumption();
        const previousState = Object.assign({}, opportunity);
        opportunity.talentStatus = 'DECLINED';
        opportunity.talentDeclinationReason = talentDeclinationReason;
        return this
          .saveOpportunity(opportunity, previousState)
          .then(() => {
            this.$router.push('/talent/opportunities');
          })
          .finally(() => this.clearLoading());
      },
      deactivate(talentId, deactivationReason) {
        this.prepareForApiConsumption();
        return this.api
          .post(`/talents/${talentId}/opportunities/bulk-declination`, {
            bulkDeclinationReason: deactivationReason,
          })
          .then(() => {
            this.showSnackbar(['Opération terminée avec succès', 'success']);
            this.$router.push('/talent/opportunities');
          })
          .catch(() => {
            this.$emit('opportunity-refresh');
            this.showSnackbar(['Erreur', 'error']);
          })
          .finally(() => this.clearLoading());
      },
      saveOpportunity(opportunity, previousState) {
        return this
          .saveOpportunityData({ opportunity, previousState })
          .then(() => this.showSnackbar(['Opération terminée avec succès', 'success']))
          .catch((error) => {
            this.$emit('opportunity-refresh');
            this.showSnackbar(['Erreur', 'error']);
            return Promise.reject(error);
          });
      },
    },
  };
</script>

<style scoped>

</style>
