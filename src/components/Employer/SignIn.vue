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
            <v-form v-model="valid" ref="form" @submit.prevent="signIn">
              <v-layout wrap>
                <v-flex xs12 text-xs-center>
                  <h2>Connexion en tant que RECRUTEUR</h2>
                </v-flex>
                <v-flex xs12>
                  <v-text-field type="email" label="Email" v-model="email" :rules="[rules.required, rules.email]"
                                validate-on-blur required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Mot de passe" v-model="password" :rules="[rules.required]" type="password"
                                required :type="passwordShown ? 'text' : 'password'"
                                :append-icon="passwordShown ? 'visibility' : 'visibility_off'"
                                :append-icon-cb="() => (passwordShown = !passwordShown)"></v-text-field>
                </v-flex>
                <v-flex xs12 text-xs-center>
                  <v-btn type="submit" color="info" :disabled="!valid || loading" :loading="loading">Se connecter</v-btn>
                </v-flex>
                <v-flex xs12 class="mt-2 text-xs-center">
                  <router-link :to="{ name: 'EmployerSignUp' }">S'inscrire</router-link>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                  <router-link :to="{ name: 'PasswordReset' }">Mot de passe oublié ?</router-link>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                  <div>-</div>
                  <router-link :to="{ name: 'TalentSignIn' }">Vous êtes commercial ?</router-link>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const EMAILREGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rules = {
    required: value => !!value || 'Ce champ est obligatoire',
    email: value => EMAILREGEX.test(value) || 'E-mail invalide',
  };

  export default {
    name: 'employer-sign-in',
    data: () => ({
      valid: false,
      rules,
      email: '',
      password: '',
      passwordShown: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'error',
        'alertComponent',
        'isUserAuthenticated',
      ]),
    },
    watch: {
      isUserAuthenticated: {
        handler: 'redirectOnAuthentication',
        immediate: true,
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setError',
        'autoSignIn',
      ]),
      redirectOnAuthentication() {
        if (this.isUserAuthenticated) {
          this.$router.push('/auth/success');
        }
      },
      signIn() {
        if (this.$refs.form.validate()) {
          // axios does not support x-www-form-urlencoded as content-type out of the box yet
          const payload = new URLSearchParams();
          payload.append('grant_type', 'password');
          payload.append('username', this.email);
          payload.append('password', this.password);
          this.prepareForApiConsumption();
          this.api
            .post('/oauth/token', payload, {
              auth: { username: '67e43464e9c0483faaf7b773018b2b60', password: '9c7d7778e0534031aa0ed684bba16546' },
            })
            .then((response) => {
              localStorage.setItem('auth_token', JSON.stringify(response.data));
              this.autoSignIn(response.data); // should set user => watcher
            })
            .catch((error) => {
              let customError = { message: 'Un problème est survenu lors de la connexion' };
              if (error.response.data.error) {
                if (error.response.data.error === 'invalid_grant') {
                  customError = { message: 'Erreur de connexion, êtes-vous déjà inscrit en tant que recruteur ?' };
                } else {
                  customError = { message: error.response.data.error_description };
                }
              }
              this.setError(customError);
            })
            .finally(() => this.clearLoading());
        }
      },
      onDismissed() {
        this.$store.dispatch('clearError');
      },
    },
  };
</script>

<style scoped>

</style>
