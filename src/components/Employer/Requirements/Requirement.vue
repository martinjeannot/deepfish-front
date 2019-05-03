<template>
  <v-layout v-if="loading">
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
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import TypeformAnswers from './TypeformAnswers';

  export default {
    name: 'employer-requirement',
    components: { TypeformAnswers },
    props: ['id'],
    data: () => ({
      requirement: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'alertComponent',
        'typeformAnswers',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'setErrorAfterApiConsumption',
        'clearLoading',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      return this
        .api(`/requirements/${this.id}?projection=employer`)
        .then((response) => {
          this.requirement = response.data;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
