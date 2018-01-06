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
              <v-form v-model="valid" ref="form" @submit.prevent="signIn">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Email" v-model="email" :rules="[rules.required, rules.email]" type="email"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field label="Password" v-model="password" :rules="[rules.required]" type="password"
                                  required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12 text-xs-center>
                    <v-btn type="submit" :disabled="!valid || loading" :loading="loading">Sign in</v-btn>
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
    name: 'sign-in',
    data: () => ({
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

</style>
