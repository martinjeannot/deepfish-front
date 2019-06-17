<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-flex v-if="alertComponent" xs12 sm8 offset-sm2>
      <base-alert :type="alertComponent.type" :message="alertComponent.message"
                  @dismissed="onAlertComponentDismissed"></base-alert>
    </v-flex>
    <v-flex v-if="requirement" xs12 sm8 offset-sm2>
      <v-card>
        <v-card-title :primary-title="true">
          <div class="headline">
            {{ requirement.name }}
          </div>
        </v-card-title>
        <v-card-text>
          <v-flex xs12 class="text-xs-center">
            <v-btn color="primary" @click="requirementUpdateDialog = true">Modifier</v-btn>
          </v-flex>
          <v-flex v-if="requirement.typeform" xs12>
            <typeform-answers :typeform="requirement.typeform"></typeform-answers>
          </v-flex>
          <v-flex v-else xs12>
            <v-flex xs12 class="pb-3">
              <span class="font-weight-bold">Fonction</span> : {{ requirement.jobType.l10nKey }}
            </v-flex>
            <v-flex xs12 class="pb-3">
              <span class="font-weight-bold">Expérience</span> : {{ requirement.seniority.l10nKey }}
            </v-flex>
            <v-flex xs12 class="pb-3">
              <span class="font-weight-bold">Localisation</span> : {{ requirement.location }}
            </v-flex>
            <v-flex xs12>
              <span class="font-weight-bold">Salaire fixe maximum</span>
              : {{ requirement.fixedSalary | formatMonetaryAmount }} €
            </v-flex>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>

    <v-dialog v-model="requirementUpdateDialog" max-width="650px">
      <v-card>
        <v-card-title>
          <v-flex xs12 class="title">
            Votre besoin a évolué ?
          </v-flex>
        </v-card-title>
        <v-form v-model="requirementUpdateFormValid" @submit.prevent="sendRequirementUpdate">
          <v-card-text>
            <v-flex xs12 class="subheading grey--text text--darken-2">
              Communiquez-nous les modifications sur votre besoin et nous adapterons notre recherche en conséquence :
              <v-textarea
                v-model="requirementUpdateMessage"
                rows="9"
                :rules="[rules.required]"
              ></v-textarea>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-flex xs12 class="text-xs-right">
              <v-btn flat color="primary" @click="requirementUpdateDialog = false">Annuler</v-btn>
              <v-btn type="submit" flat color="primary" :disabled="!requirementUpdateFormValid" :loading="loading">
                Envoyer
              </v-btn>
            </v-flex>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import TypeformAnswers from './TypeformAnswers';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'EmployerRequirement',
    components: { TypeformAnswers },
    props: ['id'],
    data: () => ({
      rules,
      requirement: null,
      requirementUpdateDialog: false,
      requirementUpdateFormValid: false,
      requirementUpdateMessage: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
        'typeformAnswers',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'clearLoading',
        'showSnackbar',
      ]),
      sendRequirementUpdate() {
        this.prepareForApiConsumption();
        return this.api
          .post(`/requirements/${this.requirement.id}/send-update`, {
            message: this.requirementUpdateMessage,
          })
          .then(() => {
            this.requirementUpdateDialog = false;
            this.requirementUpdateMessage = '';
            this.showSnackbar(['Merci, nous reviendrons vers vous si besoin', 'success']);
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      return this
        .api(`/requirements/${this.id}?projection=employer`)
        .then((response) => {
          this.requirement = response.data;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
