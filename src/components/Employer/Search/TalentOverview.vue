<template>
  <v-card>
    <v-card-text>
      {{ talent.firstName }}
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'EmployerSearchTalentOverview',
    props: {
      talent: Object,
    },
  };
</script>

<style scoped>

</style>
