<template>
  <v-container>
    <v-layout row v-if="alertComponent">
      <v-flex xs12 sm6 offset-sm3>
        <base-alert :type="alertComponent.type" :message="alertComponent.message" @dismissed="onDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex xs12 text-xs-center>
                  <v-btn class="linkedin-button" :href="linkedInAuthEndpoint" :disabled="linkedInLoading"
                         :loading="linkedInLoading" @click="linkedInLoading = true">Se connecter avec LinkedIn
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-form v-model="valid" ref="form" @submit.prevent="signIn">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Email" v-model="email" :rules="[rules.required, rules.email]" type="email"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Mot de passe" v-model="password" :rules="[rules.required]" type="password"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 text-xs-center>
                    <v-btn type="submit" :disabled="!valid || loading" :loading="loading">Se connecter</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';

  const EMAILREGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rules = {
    required: value => !!value || 'Ce champ est obligatoire',
    email: value => EMAILREGEX.test(value) || 'E-mail invalide',
  };
  export default {
    name: 'sign-in',
    data: () => ({
      linkedInLoading: false,
      valid: false,
      rules,
      email: '',
      password: '',
    }),
    computed: {
      ...mapGetters([
        'error',
        'alertComponent',
        'loading',
        'user',
      ]),
      linkedInAuthEndpoint() {
        const queryParams = {
          response_type: 'code',
          client_id: '77w79kdr6gql2h',
          redirect_uri: 'http://localhost:8080/auth/linkedin/sign-in',
          // eslint-disable-next-line no-bitwise
          state: ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c => (((c ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >> c / 4).toString(16)),
          scope: 'r_basicprofile r_emailaddress',
        };
        const queryString = Object.keys(queryParams).map(k => `${k}=${encodeURIComponent(queryParams[k])}`).join('&');
        return `https://www.linkedin.com/oauth/v2/authorization?${queryString}`;
      },
    },
    watch: {
      user(user) {
        if (user !== null && user !== undefined) {
          this.$router.push('/employer');
        }
      },
    },
    methods: {
      signIn() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('signIn', {
            email: this.email,
            password: this.password,
          });
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
