<template>
  <v-card>
    <v-card-text>
      <v-layout justify-space-around>
        <v-btn
          v-if="company.facebookUrl"
          icon
          :href="company.facebookUrl"
          target="_blank"
        >
          <v-icon>fab fa-facebook-f</v-icon>
        </v-btn>
        <v-btn
          v-if="company.instagramUrl"
          icon
          :href="company.instagramUrl"
          target="_blank"
        >
          <v-icon>fab fa-instagram</v-icon>
        </v-btn>
        <v-btn
          v-if="company.linkedinUrl"
          icon
          :href="company.linkedinUrl"
          target="_blank"
        >
          <v-icon>fab fa-linkedin-in</v-icon>
        </v-btn>
        <v-btn
          v-if="company.twitterUrl"
          icon
          :href="company.twitterUrl"
          target="_blank"
        >
          <v-icon>fab fa-twitter</v-icon>
        </v-btn>
        <v-btn
          v-if="company.youtubeUrl"
          icon
          :href="company.youtubeUrl"
          target="_blank"
        >
          <v-icon>fab fa-youtube</v-icon>
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'TalentOpportunitySocialMedia',
    props: ['company'],
    date: () => ({}),
  };
</script>

<style scoped>

</style>
