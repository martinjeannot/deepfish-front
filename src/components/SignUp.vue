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
              <v-form v-model="valid" ref="form" @submit.prevent="signUp">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="First name" v-model="firstName" :rules="[rules.required]" type="text"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Last name" v-model="lastName" :rules="[rules.required]" type="text"
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
                    <v-text-field label="Phone number" v-model="phoneNumber" :rules="[rules.required]" type="text"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Company" v-model="companyName" :rules="[rules.required]" type="text"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 text-xs-center>
                    <v-btn type="submit" :disabled="!valid || loading" :loading="loading">Sign up</v-btn>
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
    required: value => !!value || 'This field is required',
    email: value => EMAILREGEX.test(value) || 'E-mail must be valid',
  };
  export default {
    name: 'sign-up',
    data: () => ({
      valid: false,
      rules,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      /* password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ], */
    }),
    computed: {
      ...mapGetters([
        'error',
        'alertComponent',
        'loading',
      ]),
    },
    methods: {
      signUp() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('signUp', {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            companyName: this.companyName,
          }).then(() => {
            if (!this.error) {
              this.$router.push('/');
              this.$store.dispatch('setAlertComponent', {
                type: 'success',
                message: 'Enregistrement réalisé avec succès !',
              });
            }
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

</style>
