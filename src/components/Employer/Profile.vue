<template>
  <v-layout row v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row v-else>
    <v-flex xs12>
      <v-layout row v-if="alertComponent">
        <v-flex xs12 sm6 offset-sm3>
          <base-alert :type="alertComponent.type" :message="alertComponent.message"
                      @dismissed="onDismissed"></base-alert>
        </v-flex>
      </v-layout>
      <v-layout row v-if="employer !== null">
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-form v-model="valid" ref="form" @submit.prevent="saveProfile">
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Prénom" v-model="employer.firstName" :rules="[rules.required]"
                                  required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Nom" v-model="employer.lastName" :rules="[rules.required]"
                                  required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field type="email" label="Email" v-model="employer.username"
                                  :rules="[rules.required, rules.email]" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Numéro mobile" v-model="employer.phoneNumber" :rules="[rules.required]"
                                  required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <h3>Modifier mon mot de passe</h3>
                    <v-text-field :type="passwordShown ? 'text' : 'password'" label="Nouveau mot de passe"
                                  v-model="employer.password" :rules="[rules.passwordLength]"
                                  hint="Au moins 6 caractères"
                                  :append-icon="passwordShown ? 'visibility' : 'visibility_off'"
                                  @click:append="() => (passwordShown = !passwordShown)"></v-text-field>
                  </v-flex>
                  <v-flex xs12 text-xs-center>
                    <v-btn type="submit" :disabled="!valid || loading" :loading="loading">Valider</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const EMAILREGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rules = {
    required: value => !!value || 'Ce champ est obligatoire',
    email: value => EMAILREGEX.test(value) || 'E-mail invalide',
    passwordLength: value => (!value || (value && value.length >= 6)) || 'Au moins 6 caractères',
  };

  export default {
    name: 'employer-profile',
    data: () => ({
      valid: false,
      rules,
      employer: null,
      passwordShown: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'error',
        'alertComponent',
        'loading',
        'user',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'setAlertComponent',
      ]),
      onDismissed() {
        this.onAlertComponentDismissed();
      },
      saveProfile() {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          this.api
            .patch(this.employer._links.self.href, this.employer)
            .then((response) => {
              this.employer = response.data;
              this.setAlertComponent({ type: 'success', message: 'Votre profil a été mis à jour' });
            })
            .catch(() => this.setErrorAfterApiConsumption())
            .finally(() => this.clearLoading());
        }
      },
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api(this.user._links.self.href)
        .then((response) => {
          this.employer = response.data;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
