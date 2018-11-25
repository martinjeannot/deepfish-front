<template>
  <div>
    <v-layout v-if="loading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-flex xs12>
        <synchronized-checkbox-list
          :conditions="conditions"
          title="Quels types d'entreprises acceptes-tu ?"
          :referenceDomainObjects="companyMaturityLevels"
          associationResourceName="companyMaturityLevels"
          class="mb-5"
        ></synchronized-checkbox-list>
        <synchronized-checkbox-list
          :conditions="conditions"
          title="Quels types de ventes acceptes-tu ?"
          :referenceDomainObjects="commodityTypes"
          associationResourceName="commodityTypes"
          class="mb-5"
        ></synchronized-checkbox-list>
        <synchronized-checkbox-list
          :conditions="conditions"
          title="Quelles missions acceptes-tu ?"
          :referenceDomainObjects="taskTypes"
          associationResourceName="taskTypes"
          class="mb-5"
        ></synchronized-checkbox-list>
        <synchronized-checkbox-list
          :conditions="conditions"
          title="Quels types de spécialisation acceptes-tu ?"
          :referenceDomainObjects="industryTypes"
          associationResourceName="industryTypes"
          class="mb-5"
        ></synchronized-checkbox-list>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import SynchronizedCheckboxList from './SynchronizedCheckboxList';

  export default {
    components: {
      SynchronizedCheckboxList,
    },
    name: 'conditions-position',
    data: () => ({
      valid: false,
      conditions: null,
      companyMaturityLevels: [],
      commodityTypes: [],
      taskTypes: [],
      industryTypes: [],
    }),
    computed: {
      ...mapGetters([
        'api',
        'error',
        'alertComponent',
        'loading',
        'user',
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
          this.api(`${this.user._links.conditions.href}?projection=default`),
          this.api('/companyMaturityLevels?sort=orderIndex,asc'),
          this.api('/commodityTypes?sort=orderIndex,asc'),
          this.api('/taskTypes?sort=orderIndex,asc'),
          this.api('/industryTypes?sort=orderIndex,asc'),
        ])
        .then(([
                 conditionsResponse,
                 companyMaturityLevelsResponse,
                 commodityTypesResponse,
                 taskTypesResponse,
                 industryTypesResponse,
               ]) => {
          this.conditions = conditionsResponse.data;
          this.companyMaturityLevels =
            companyMaturityLevelsResponse.data._embedded.companyMaturityLevels;
          this.commodityTypes = commodityTypesResponse.data._embedded.commodityTypes;
          this.taskTypes = taskTypesResponse.data._embedded.taskTypes;
          this.industryTypes = industryTypesResponse.data._embedded.industryTypes;
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
