<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 class="grey--text text--darken-2">
          Ton Talent Advocate attitré
        </v-flex>
        <v-flex
          xs6 sm5 md3 lg2
          class="text-xs-center"
        >
          <v-avatar size="50">
            <v-img
              :src="profilePictureUrl"
              alt="picture"
            ></v-img>
          </v-avatar>
        </v-flex>
        <v-flex
          xs6 sm7 md9 lg10
        >
          <v-layout wrap align-center fill-height>
            <v-flex xs12 class="font-weight-bold">
              {{ talentAdvocate.firstName }}
            </v-flex>
            <v-flex xs12 class="font-weight-bold">
              {{ talentAdvocate.lastName }}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex
          xs6 sm5 md3 lg2
          class="text-xs-center"
        >
          <v-icon>phone</v-icon>
        </v-flex>
        <v-flex
          xs6 sm7 md9 lg10
        >
          {{ talentAdvocate.phoneNumber }}
        </v-flex>
        <v-flex
          xs6 sm5 md3 lg2
          class="text-xs-center"
        >
          <v-icon>email</v-icon>
        </v-flex>
        <v-flex
          xs6 sm7 md9 lg10
        >
          {{ talentAdvocate.email }}
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'TalentTalentAdvocate',
    props: {
      talentAdvocate: Object,
    },
    data: () => ({}),
    computed: {
      profilePictureUrl() {
        return 'static/img/avatar.png';
      },
    },
  };
</script>

<style scoped>

</style>
