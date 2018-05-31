<template>
  <div>
    <v-layout row v-if="alertComponent">
      <v-flex xs12 sm6 offset-sm3>
        <base-alert :type="alertComponent.type" :message="alertComponent.message"
                    @dismissed="onAlertComponentDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 class="text-xs-center">
                <h2>Inscription en tant que COMMERCIAL</h2>
              </v-flex>
              <v-flex xs12 text-xs-center>
                <v-btn color="info" :href="linkedInAuthEndpoint" :disabled="linkedInLoading"
                       :loading="linkedInLoading" @click="linkedInLoading = true">S'inscrire avec LinkedIn
                </v-btn>
              </v-flex>
              <v-flex xs12 class="mt-2 text-xs-center">
                <router-link :to="{ name: 'TalentSignIn' }">Déjà inscrit ?</router-link>
              </v-flex>
              <v-flex xs12 class="text-xs-center">
                <div>-</div>
                <router-link :to="{ name: 'EmployerSignUp' }">Vous êtes recruteur ?</router-link>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'talent-sign-up',
    data: () => ({
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'error',
        'alertComponent',
        'linkedInAuthEndpoint',
      ]),
    },
    methods: {
      ...mapActions([
        'onAlertComponentDismissed',
      ]),
    },
  };
</script>

<style scoped>

</style>
