<template>
  <v-layout row wrap v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex xs12 sm6 offset-sm3 v-if="alertComponent">
      <base-alert :type="alertComponent.type" :message="alertComponent.message"
                  @dismissed="onAlertComponentDismissed"></base-alert>
    </v-flex>
    <v-flex xs12 sm6 offset-sm3 v-if="admin !== null">
      <v-card>
        <v-card-text>
          <v-form v-model="valid" ref="form" @submit.prevent="saveProfile">
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="First name" v-model="admin.firstName" :rules="[rules.required]"
                              required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Last name" v-model="admin.lastName" :rules="[rules.required]"
                              required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field type="email" label="Email" v-model="admin.username" :rules="[rules.required, rules.email]"
                              readonly required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field :type="passwordShown ? 'text' : 'password'" label="Nouveau mot de passe"
                              v-model="admin.password" :rules="[rules.passwordLength]"
                              hint="At least 8 characters"
                              :append-icon="passwordShown ? 'visibility' : 'visibility_off'"
                              @click:append="() => (passwordShown = !passwordShown)"></v-text-field>
              </v-flex>
              <v-flex xs12 text-xs-center>
                <v-btn type="submit" color="primary" :disabled="!valid || loading" :loading="loading">Valider</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
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
    passwordLength: value => (!value || (value && value.length >= 8)) || 'At least 8 characters',
  };

  export default {
    name: 'AdminProfile',
    data: () => ({
      rules,
      valid: false,
      admin: null,
      passwordShown: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
        'initialLoading',
        'loading',
        'alertComponent',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSuccessSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
      ]),
      saveProfile() {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          this.api
            .patch(this.admin._links.self.href, this.admin)
            .then((response) => {
              this.admin = response.data;
              this.showSuccessSnackbar();
            })
            .catch(() => this.setErrorAfterApiConsumption())
            .finally(() => this.clearLoading());
        }
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this.api(this.user._links.self.href)
        .then((response) => {
          this.admin = response.data;
        })
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
