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
              <v-flex xs12 text-xs-center>
                <h2>INSCRIPTION TALENTS</h2>
              </v-flex>
              <v-flex xs12 text-xs-center>
                <v-btn class="linkedin-button" :href="linkedInAuthEndpoint" :disabled="linkedInLoading"
                       :loading="linkedInLoading" @click="linkedInLoading = true">S'inscrire avec LinkedIn
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="mt-3">
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-layout row>
              <v-flex xs12 text-xs-center>
                <h2>INSCRIPTION RECRUTEURS</h2>
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
                  <v-text-field label="Email" v-model="email" :rules="[rules.required, rules.email]" type="email"
                                required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field label="Mobile" v-model="phoneNumber" :rules="[rules.required]" type="text"
                                required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field label="Société" v-model="companyName" :rules="[rules.required]" type="text"
                                required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 text-xs-center>
                  <v-btn type="submit" :disabled="!valid || loading" :loading="loading">S'inscrire</v-btn>
                </v-flex>
                <v-flex xs12 class="text-xs-center">
                  <router-link :to="{ name: 'SignIn' }">Déjà inscrit ?</router-link>
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
    name: 'sign-up',
    data: () => ({
      linkedInLoading: false,
      valid: false,
      rules,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
    }),
    computed: {
      ...mapGetters([
        'error',
        'alertComponent',
        'loading',
        'linkedInAuthEndpoint',
      ]),
    },
    methods: {
      ...mapActions([
        'onAlertComponentDismissed',
        'signUp',
        'logout',
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
  };
</script>

<style scoped>
  .linkedin-button {
    color: #0077B5;
  }
</style>
