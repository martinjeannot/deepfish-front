<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex
          xs3 sm1
          class="text-xs-center"
        >
          <v-avatar size="50">
            <v-img
              :src="talentProfilePictureUrl"
              alt="picture"
            ></v-img>
          </v-avatar>
        </v-flex>
        <v-flex
          xs9 sm11
        >
          <v-layout wrap align-center fill-height>
            <v-flex xs12 class="title">{{ talent.firstName }} {{ talent.lastName[0] }}.</v-flex>
            <v-flex xs12 class="body-2">
              {{ talent.yearsOfExperience }} ans d'expérience
              <span class="body-1">// Salaire fixe : </span>
              {{ baseSalary }} k€
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'TalentBanner',
    props: {
      talent: Object,
    },
    data: () => ({}),
    computed: {
      talentProfilePictureUrl() {
        if (this.talent.profilePictureUrl && !this.talent.profilePictureUrl.includes('media.licdn.com')) {
          return this.talent.profilePictureUrl;
        }
        return '/static/img/avatar.png';
      },
      baseSalary() {
        return Math.round(this.talent.conditions.fixedSalary / 1000);
      },
    },
  };
</script>

<style scoped>

</style>
