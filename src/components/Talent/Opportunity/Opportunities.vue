<template>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    TUTU
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'talent-opportunities',
    data: () => ({
      pendingOpportunities: [],
      acceptedOpportunities: [],
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
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api(`/opportunities?talent=${this.user.id}&status=PENDING&status=ACCEPTED`)
        .then((response) => {
          this.pendingOpportunities = response.data._embedded.opportunities.filter(opportunity => opportunity.status === 'PENDING');
          this.acceptedOpportunities = response.data._embedded.opportunities.filter(opportunity => opportunity.status === 'ACCEPTED');
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
