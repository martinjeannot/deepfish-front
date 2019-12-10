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
            :class="[{'pb-3': $vuetify.breakpoint.xsOnly}]"
            :style="[$vuetify.breakpoint.xsOnly ? {paddingLeft: '45px'} : '']"
          >
            <v-btn
              color="success"
              :loading="loading"
              :disabled="!isUserTalent"
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
              <span>Accepter l'offre et échanger avec le recruteur</span>
            </v-tooltip>
          </v-flex>
          <v-flex
            xs12 sm6
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
              <span>Refuser l'offre avec une raison de refus visible par le recruteur</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

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
              <v-btn type="submit" color="warning"
                     :disabled="!declinationFormValid || !isUserTalent"
                     :loading="loading"
              >
                Refuser
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
      declinationDialog: false,
      declinationFormValid: false,
      declinationReason: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'user',
        'isUserTalent',
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
        opportunity.employerStatus = 'PENDING'; // auto-forward
        return this
          .saveOpportunity(opportunity, previousState)
          .then(() => {
            this.$router.push('/talent/opportunities?opportunity-accepted');
          })
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
