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
            <v-tab :class="{ 'grey lighten-3': activeTabIndex != 0 }" :ripple="false">Candidat</v-tab>
            <v-tab :class="{ 'grey lighten-3': activeTabIndex != 1 }" :ripple="false">Entreprise</v-tab>
            <v-tab-item>
              <v-card>
                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12 class="text-xs-center">
                      <h2>Inscription en tant que candidat via LinkedIn</h2>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center">
                      <v-btn color="info" :href="signUpLinkedInAuthEndpoint"
                             :disabled="loading" :loading="loading" @click="prepareForApiConsumption()"
                             v-html="'S\'inscrire en tant que candidat'" large>
                      </v-btn>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center pt-2 grey--text text--darken-2">
                      100% confidentiel
                      <v-tooltip bottom>
                        <template #activator="{ on }">
                          <v-icon v-on="on">help</v-icon>
                        </template>
                        <div>
                          Nous utilisons uniquement : nom, prénom, email, photo de profil.<br/>
                          Aucun accès à vos contacts ni aucune modification sur votre profil.
                        </div>
                      </v-tooltip>
                    </v-flex>
                    <v-flex xs12 class="mt-2 text-xs-center">
                      <router-link :to="{ name: 'SignIn' }">Déjà inscrit ?</router-link>
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
                      <h2>Inscription en tant que recruteur</h2>
                    </v-flex>
                  </v-layout>
                  <v-form v-model="valid" ref="form" @submit.prevent="submitSignUpForm">
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field label="Prénom" v-model="firstName" :rules="[rules.required]" type="text"
                                      required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field label="Nom" v-model="lastName" :rules="[rules.required]" type="text"
                                      required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field label="Entreprise" v-model="companyName" :rules="[rules.required]" type="text"
                                      required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field label="Email" v-model="email" :rules="[rules.required, rules.email]" type="email"
                                      required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field label="Numéro mobile" v-model="phoneNumber" :rules="[rules.required]" type="text"
                                      required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 text-xs-center>
                        <v-btn type="submit" color="info" :disabled="!valid || loading" :loading="loading">S'inscrire
                        </v-btn>
                      </v-flex>
                      <v-flex xs12 class="mt-2 text-xs-center">
                        En cliquant, j'accepte les <a href="https://www.deepfish.co/cgu/cgu.pdf" target="_blank">CGU</a>
                      </v-flex>
                      <v-flex xs12 class="text-xs-center">
                        <router-link :to="{ name: 'SignIn', query: { employer: null } }">Déjà inscrit ?</router-link>
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
    name: 'EmployerSignUp',
    data: () => ({
      rules,
      activeTabIndex: 0,
      valid: false,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
    }),
    computed: {
      ...mapGetters([
        'loading',
        'error',
        'alertComponent',
        'linkedInAuthEndpoint',
      ]),
      signUpLinkedInAuthEndpoint() {
        return this.linkedInAuthEndpoint('sign-up');
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'onAlertComponentDismissed',
        'signUp',
        'logout',
        'setAlertComponent',
      ]),
      submitSignUpForm() {
        if (this.$refs.form.validate()) {
          this.signUp({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            companyName: this.companyName,
          }).then((response) => {
            if (!this.error) {
              this.logout();
              localStorage.setItem('auth_token', JSON.stringify(response.data));
              location.href = location.origin;
            }
          });
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
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'error')) {
        this.setAlertComponent({
          type: 'error',
          message: 'Une erreur est survenue lors de l\'authentification. Si le problème persiste, n\'hésitez pas à nous contacter',
        });
      }
    },
  };
</script>

<style scoped>

</style>
