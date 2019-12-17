<template>
  <v-card>
    <v-card-text>
      <v-layout wrap>
        <v-flex xs12 class="grey--text text--darken-2">
          Votre Client Executive
        </v-flex>
        <v-flex
          xs6 sm5 md3 lg2
          class="text-xs-center"
        >
          <v-avatar size="50">
            <v-img
              alt="picture"
              lazy-src="/static/img/avatar.png"
              :src="profilePictureUrl"
            ></v-img>
          </v-avatar>
        </v-flex>
        <v-flex
          xs6 sm7 md9 lg10
        >
          <v-layout wrap align-center fill-height>
            <v-flex xs12 class="font-weight-bold">
              {{ clientExecutive.firstName }}
            </v-flex>
            <v-flex xs12 class="font-weight-bold">
              {{ clientExecutive.lastName }}
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
          {{ clientExecutive.phoneNumber }}
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
          {{ clientExecutive.email }}
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
    data: () => ({}),
    computed: {
      profilePictureUrl() {
        return `${process.env.DEEPFISH_STATIC_BASE_URL}/users/${this.clientExecutive.id}/profile-picture.jpeg`;
      },
    },
  };
</script>

<style scoped>

</style>
