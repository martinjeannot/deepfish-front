<template>
  <v-layout row wrap>
    <v-layout v-if="alertComponent">
      <v-flex xs12 sm8 offset-sm2>
        <base-alert :type="alertComponent.type" :message="alertComponent.message"
                    @dismissed="onAlertComponentDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-card-title>
          <v-flex xs12 class="text-xs-center">
            <h1>Réinitialisation de votre mot de passe</h1>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-flex xs12 class="text-xs-center pb-3">
            Saisissez l'adresse email avec laquelle vous vous êtes inscrit.
          </v-flex>
          <v-flex xs12 sm6 offset-sm3>
            <v-form v-model="valid" ref="form" @submit.prevent="resetPassword">
              <v-text-field label="Email" v-model="email" :rules="[rules.required, rules.email]" type="email"
                            required></v-text-field>
              <div class="text-xs-center">
                <v-btn type="submit" :disabled="!valid || loading" :loading="loading" color="info">
                  Recevoir un nouveau mot de passe
                </v-btn>
              </div>
            </v-form>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const EMAILREGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rules = {
    required: value => !!value || 'Ce champ est obligatoire',
    email: value => EMAILREGEX.test(value) || 'E-mail invalide',
  };

  export default {
    name: 'password-reset',
    data: () => ({
      rules,
      valid: false,
      email: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'alertComponent',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setAlertComponent',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
      ]),
      resetPassword() {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          this.api
            .post('/employers/password-reset', {
              email: this.email,
            })
            .then((response) => {
              if (response.data === 'OK') {
                this.$refs.form.reset();
                this.setAlertComponent({
                  type: 'success',
                  message: 'Un nouveau mot de passe a été envoyé sur votre adresse email',
                });
              } else {
                this.setAlertComponent({
                  type: 'error',
                  message: 'Nous n\'avons pas pu réinitialiser votre mot de passe, avez-vous rentré la bonne adresse email ?',
                });
              }
            })
            .catch(() => this.setErrorAfterApiConsumption())
            .finally(() => this.clearLoading());
        }
      },
    },
  };
</script>

<style scoped>

</style>
