<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 class="pb-3 font-weight-medium">Résumé par {{ talent.firstName }}</v-flex>
        <v-flex xs12 class="text-pre-wrap">{{ talent.selfPitch }}</v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'TalentSelfSummary',
    props: {
      talent: Object,
    },
  };
</script>

<style scoped>
  .text-pre-wrap {
    white-space: pre-wrap;
  }
</style>
