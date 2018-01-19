<template>
  <div>
    <v-layout v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12>
        <conditions-company-maturity-levels
          :companyMaturityLevels="companyMaturityLevels"
          :conditions="conditions"
        ></conditions-company-maturity-levels>
        <v-btn color="primary" @click.native="currentStep = 2">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import ConditionsCompanyMaturityLevels from './CompanyMaturityLevels';

  export default {
    components: { ConditionsCompanyMaturityLevels },
    name: 'conditions-position',
    data: () => ({
      valid: false,
      conditions: null,
      companyMaturityLevels: [],
    }),
    computed: {
      ...mapGetters([
        'error',
        'alertComponent',
        'loading',
        'user',
        'api',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
    },
    created() {
      this.$store.dispatch('prepareForApiConsumption');
      Promise
        .all([
          this.$store.getters.api.get(`${this.user._links.conditions.href}?projection=default`),
          this.$store.getters.api.get('/companyMaturityLevels')])
        .then(([conditionsResponse, companyMaturityLevelsResponse]) => {
          this.conditions = conditionsResponse.data;
          this.companyMaturityLevels =
            companyMaturityLevelsResponse.data._embedded.companyMaturityLevels;
          this.$store.dispatch('clearLoading');
        })
        .catch((/* error */) => {
          this.$store.dispatch('setErrorAfterApiConsumption');
        });
    },
  };
</script>

<style scoped>

</style>
