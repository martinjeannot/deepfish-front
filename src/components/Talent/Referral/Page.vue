<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2 lg6 offset-lg3>
      <referral-card
        @referral-invitations-sent="referralInvitationsSent"
      ></referral-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import ReferralCard from './Card';

  export default {
    name: 'TalentReferralPage',
    components: {
      ReferralCard,
    },
    data: () => ({}),
    methods: {
      referralInvitationsSent() {
        this.$router.push({ name: 'TalentOpportunities' });
      },
    },
  };
</script>

<style scoped>

</style>
