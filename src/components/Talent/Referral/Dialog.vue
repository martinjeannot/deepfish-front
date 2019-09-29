<template>
  <v-dialog v-model="dialog" maxWidth="650px">
    <referral-card
      @referral-invitations-sent="referralInvitationsSent"
    ></referral-card>
  </v-dialog>
</template>

<script>
  import ReferralCard from './Card';

  export default {
    name: 'TalentReferralDialog',
    props: ['value'],
    components: {
      ReferralCard,
    },
    data: () => ({}),
    computed: {
      dialog: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('update:value', value);
        },
      },
    },
    methods: {
      referralInvitationsSent() {
        this.dialog = false;
      },
    },
  };
</script>

<style scoped>

</style>
