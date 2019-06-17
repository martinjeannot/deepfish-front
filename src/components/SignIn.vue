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
          <v-tabs v-model="activeTabIndex" fixed-tabs grow hide-slider>
            <v-tab :class="{ 'grey lighten-3': activeTabIndex != 0 }" :ripple="false">Commercial</v-tab>
            <v-tab :class="{ 'grey lighten-3': activeTabIndex != 1 }" :ripple="false">Recruteur</v-tab>
            <v-tab-item>
              <v-card>
                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-alert
                        :value="true"
                        type="info"
                      >
                        <span class="font-weight-bold">LinkedIn</span>
                        ayant mis à jour sa politique de sécurité, vous devrez
                        <span class="font-weight-bold">réautoriser Deepfish à vous identifier</span>
                        via LinkedIn (lors de votre prochaine connexion uniquement).
                      </v-alert>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center">
                      <h2>Connexion en tant que Commercial via LinkedIn</h2>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center">
                      <v-btn color="info" :href="signInLinkedInAuthEndpoint"
                             :disabled="loading" :loading="loading" @click="prepareForApiConsumption()"
                             v-html="'Se connecter en tant que commercial'" large>
                      </v-btn>
                    </v-flex>
                    <v-flex xs12 class="mt-2 text-xs-center">
                      <router-link :to="{ name: 'SignUp' }">S'inscrire</router-link>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card>
                <v-card-text>
                  <v-layout row>
                    <v-flex xs12 class="text-xs-center">
                      <h2>Connexion en tant que RECRUTEUR</h2>
                    </v-flex>
                  </v-layout>
                  <v-form v-model="valid" ref="form" @submit.prevent="signIn">
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field type="email" label="Email" v-model="email" ref="email"
                                      :rules="[rules.required, rules.email]"
                                      validate-on-blur required></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field :type="passwordShown ? 'text' : 'password'" label="Mot de passe"
                                      v-model="password"
                                      :rules="[rules.required]" required
                                      :append-icon="passwordShown ? 'visibility' : 'visibility_off'"
                                      @click:append="() => (passwordShown = !passwordShown)"></v-text-field>
                      </v-flex>
                      <v-flex xs12 text-xs-center>
                        <v-btn type="submit" color="info" :disabled="!valid || loading" :loading="loading">
                          Se connecter
                        </v-btn>
                      </v-flex>
                      <v-flex xs12 class="mt-2 text-xs-center">
                        <router-link :to="{ name: 'SignUp', query: { employer: null } }">S'inscrire</router-link>
                      </v-flex>
                      <v-flex xs12 class="text-xs-center">
                        <router-link :to="{ name: 'PasswordReset' }">Mot de passe oublié ?</router-link>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
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
    name: 'SignIn',
    data: () => ({
      rules,
      activeTabIndex: 0,
      valid: false,
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
        'linkedInAuthEndpoint',
      ]),
      signInLinkedInAuthEndpoint() {
        return this.linkedInAuthEndpoint('sign-in');
      },
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
        'onAlertComponentDismissed',
        'autoSignIn',
        'setAlertComponent',
        'requestAccessToken',
      ]),
      redirectOnAuthentication() {
        if (this.isUserAuthenticated) {
          this.$router.push('/auth/success');
        }
      },
      signIn() {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          this.requestAccessToken({ grant_type: 'password', username: this.email, password: this.password })
            .then((response) => {
              localStorage.setItem('auth_token', JSON.stringify(response.data));
              this.autoSignIn(response.data); // should set user => watcher
            })
            .catch((error) => {
              let customError = { message: 'Un problème est survenu lors de la connexion' };
              if (error.response.data.error) {
                if (error.response.data.error === 'invalid_grant') {
                  customError = {
                    message: 'Erreur de connexion, êtes-vous déjà inscrit en tant que recruteur ?',
                  };
                } else {
                  customError = { message: error.response.data.error_description };
                }
              }
              this.setError(customError);
            })
            .finally(() => this.clearLoading());
        }
      },
    },
    created() {
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'utm_id')) {
        localStorage.setItem('df_utm_id', this.$route.query.utm_id);
      }
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'employer')) {
        this.activeTabIndex = 1;
      }
      // TODO still useful ?
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'employer-sign-up-success')) {
        this.setAlertComponent({
          type: 'success',
          message: 'Félicitations ! Vous allez recevoir un mail avec vos identifiants de connexion',
        });
      }
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'error')) {
        this.setAlertComponent({
          type: 'error',
          message: 'Une erreur est survenue lors de l\'authentification. Si le problème persiste, n\'hésitez pas à nous contacter',
        });
      }
    },
    mounted() {
      // FIXME : VueJS/autofill bug (browsers do not trigger input/change event when autofilling)
      const autofillIntervalId = setInterval(() => {
        if (this.$refs.email && this.$refs.email.value) {
          this.$refs.form.validate();
        }
      }, 1000);
      setTimeout(() => {
        clearInterval(autofillIntervalId);
      }, 3000);
    },
  };
</script>

<style scoped>
  .active-tab {
    color: red;
  }

  .linkedin-button {
    color: #0077b5;
  }
</style>
