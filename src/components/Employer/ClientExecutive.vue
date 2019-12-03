<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 class="body-2">
          Votre Client Executive
        </v-flex>
        <v-flex xs12 class="subheading">
          David Branellec
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default{
    name: 'EmployerClientExecutive',
    props: {
      clientExecutive: Object,
    },
  };
</script>

<style scoped>

</style>
