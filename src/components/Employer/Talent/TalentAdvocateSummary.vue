<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-layout wrap align-center fill-height class="pb-3">
          <v-flex xs9 class="font-weight-medium">
            Résumé par {{ talent.talentAdvocate.firstName }} {{ talent.talentAdvocate.lastName }},
            notre Talent Advocate
          </v-flex>
          <v-flex xs3 class="text-xs-right">
            <v-avatar size="40">
              <v-img
                :src="talentAdvocateProfilePictureUrl"
                alt="TAProfilePic"
              ></v-img>
            </v-avatar>
          </v-flex>
        </v-layout>
        <v-flex xs12 class="text-pre-wrap">{{ talent.qualification.recommendation }}</v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'TalentAdvocateSummary',
    props: {
      talent: Object,
    },
    computed: {
      talentAdvocateProfilePictureUrl() {
        return this.talent.talentAdvocate.profilePictureUrl ?
          this.talent.talentAdvocate.profilePictureUrl :
          '/static/img/avatar.png';
      },
    },
  };
</script>

<style scoped>
  .text-pre-wrap {
    white-space: pre-wrap;
  }
</style>
