<template>
  <v-layout row wrap>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-flex xs12 class="text-xs-center">
              <h3>NEW ADMIN</h3>
            </v-flex>
            <v-form v-model="valid" ref="form" @submit.prevent="saveNewUser">
              <v-flex xs12>
                <v-text-field label="First name" v-model="uzer.firstName" :rules="[rules.required]"
                              required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Last name" v-model="uzer.lastName" :rules="[rules.required]"
                              required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field type="email" label="Email" v-model="uzer.username"
                              :rules="[rules.required, rules.email]" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field :type="passwordShown ? 'text' : 'password'" label="Password" v-model="uzer.password"
                              :rules="[rules.required, rules.passwordLength]" hint="At least 8 characters"
                              :append-icon="passwordShown ? 'visibility' : 'visibility_off'"
                              :append-icon-cb="() => (passwordShown = !passwordShown)" required></v-text-field>
              </v-flex>
              <v-flex xs12 class="text-xs-center">
                <v-btn type="submit" color="primary" :disabled="!valid || loading" :loading="loading">Save</v-btn>
              </v-flex>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  const EMAILREGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rules = {
    required: value => !!value || 'This field is required',
    email: value => EMAILREGEX.test(value) || 'Invalid e-mail',
    passwordLength: value => (!value || (value && value.length >= 8)) || 'At least 8 characters',
  };

  export default {
    name: 'data-management-new-user',
    components: { DataManagementNavigation },
    data: () => ({
      rules,
      valid: false,
      uzer: null,
      passwordShown: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSuccessSnackbar',
        'showSnackbar',
      ]),
      newUser() {
        return {
          phoneNumber: '0000000000',
          authorities: [{ authority: 'ROLE_ADMIN' }],
          accountNonExpired: true,
          accountNonLocked: true,
          credentialsNonExpired: true,
          enabled: true,
        };
      },
      saveNewUser() {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          this.api
            .post('/users', this.uzer)
            .then((/* response */) => {
              this.$router.push({ name: 'AdminDMUsers' });
              this.showSuccessSnackbar();
            })
            .catch((/* error */) => {
              this.showSnackbar('Error');
            })
            .finally(() => this.clearLoading());
        }
      },
    },
    created() {
      this.uzer = this.newUser();
    },
  };
</script>

<style scoped>

</style>
