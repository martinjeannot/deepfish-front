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
          title="Type d'entreprises acceptés"
          :referenceDomainObjects="companyMaturityLevels"
          associationResourceName="companyMaturityLevels"
          class="mb-5"
        ></synchronized-checkbox-list>
        <synchronized-checkbox-list
          :conditions="conditions"
          title="Type de postes acceptés"
          :referenceDomainObjects="jobs"
          associationResourceName="jobs"
          class="mb-5"
        ></synchronized-checkbox-list>
        <synchronized-checkbox-list
          :conditions="conditions"
          title="Type de ventes acceptés"
          :referenceDomainObjects="commodityTypes"
          associationResourceName="commodityTypes"
          class="mb-5"
        ></synchronized-checkbox-list>
        <synchronized-checkbox-list
          :conditions="conditions"
          title="Missions acceptées"
          :referenceDomainObjects="taskTypes"
          associationResourceName="taskTypes"
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
      jobs: [],
      commodityTypes: [],
      taskTypes: [],
    }),
    computed: {
      ...mapGetters([
        'api',
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
          this.api(`${this.user._links.conditions.href}?projection=default`),
          this.api('/companyMaturityLevels'),
          this.api('/jobs'),
          this.api('/commodityTypes'),
          this.api('taskTypes'),
        ])
        .then(([
                 conditionsResponse,
                 companyMaturityLevelsResponse,
                 jobsResponse,
                 commodityTypesResponse,
                 taskTypesResponse,
               ]) => {
          this.conditions = conditionsResponse.data;
          this.companyMaturityLevels =
            companyMaturityLevelsResponse.data._embedded.companyMaturityLevels;
          this.jobs = jobsResponse.data._embedded.jobs;
          this.commodityTypes = commodityTypesResponse.data._embedded.commodityTypes;
          this.taskTypes = taskTypesResponse.data._embedded.taskTypes;
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
