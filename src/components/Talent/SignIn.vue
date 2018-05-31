<template>
  <div>
    <v-layout row v-if="alertComponent">
      <v-flex xs12 sm6 offset-sm3>
        <base-alert :type="alertComponent.type" :message="alertComponent.message" @dismissed="onDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 text-xs-center>
                <h2>Connexion en tant que COMMERCIAL</h2>
              </v-flex>
              <v-flex xs12 text-xs-center>
                <v-btn color="info" :href="linkedInAuthEndpoint" :disabled="loading"
                       :loading="loading" @click="loading = true">Se connecter avec LinkedIn
                </v-btn>
              </v-flex>
              <v-flex xs12 class="mt-2 text-xs-center">
                <router-link :to="{ name: 'TalentSignUp' }">S'inscrire</router-link>
              </v-flex>
              <v-flex xs12 class="text-xs-center">
                <div>-</div>
                <router-link :to="{ name: 'EmployerSignIn' }">Vous êtes recruteur ?</router-link>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'talent-sign-in',
    data: () => ({
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'error',
        'alertComponent',
        'isUserAuthenticated',
        'linkedInAuthEndpoint',
      ]),
    },
    watch: {
      isUserAuthenticated: {
        handler: 'redirectOnAuthentication',
        immediate: true,
      },
    },
    methods: {
      redirectOnAuthentication() {
        if (this.isUserAuthenticated) {
          this.$router.push('/auth/success');
        }
      },
      onDismissed() {
        this.$store.dispatch('clearError');
      },
    },
  };
</script>

<style scoped>
  .linkedin-button {
    color: #0077B5;
  }
</style>
