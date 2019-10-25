<template>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'TalentOpportunityTracker',
    props: ['opportunity'],
    data: () => ({}),
    computed: {
      ...mapGetters([
        'api',
        'isUserTalent',
      ]),
    },
    methods: {
      ...mapActions([
        'saveOpportunityData',
      ]),
    },
    created() {
      if (this.isUserTalent && !this.opportunity.seenByTalentAt) {
        this.opportunity.seenByTalentAt = moment.utc();
        return this.saveOpportunityData({ opportunity: this.opportunity });
      }
      return Promise.resolve();
    },
  };
</script>

<style scoped>

</style>
