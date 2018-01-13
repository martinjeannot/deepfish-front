<template>
  <v-container>
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
        <v-layout row v-if="talent !== null">
          <v-flex xs12 sm6 offset-sm3>
            <v-card>
              <v-card-text>
                <v-container>
                  <v-form v-model="valid" ref="form" @submit.prevent="signIn">
                    <v-layout row>
                      <v-flex xs12>
                        <h3>{{ talent.firstName }} {{ talent.lastName }}</h3>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field label="Email" v-model="talent.username" :rules="[rules.required, rules.email]"
                                      type="email" required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field label="Mobile" v-model="talent.phoneNumber" :rules="[rules.required]" type="text"
                                      required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-radio-group v-model="toto" row>
                          <v-radio label="Option 1" value="radio-1"></v-radio>
                          <v-radio label="Option 2" value="radio-2"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12 text-xs-center>
                        <v-btn type="submit" :disabled="!valid || loading" :loading="loading">Valider</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';

  const EMAILREGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rules = {
    required: value => !!value || 'Ce champ est obligatoire',
    email: value => EMAILREGEX.test(value) || 'E-mail invalide',
  };

  export default {
    name: 'talent-profile',
    data: () => ({
      valid: false,
      rules,
      talent: null,
      toto: null,
    }),
    computed: {
      ...mapGetters([
        'error',
        'alertComponent',
        'loading',
        'user',
      ]),
    },
    methods: {
      onDismissed() {
        this.$store.dispatch('clearError');
      },
    },
    created() {
      this.$store.dispatch('prepareForApiConsumption');
      this.$store.getters.api
        .get(this.$store.getters.user._links.self.href)
        .then((response) => {
          this.$store.dispatch('clearLoading');
          this.talent = response.data;
        })
        .catch((/* error */) => {
          this.$store.dispatch('setErrorAfterApiConsumption');
        });
    },
  };
</script>

<style scoped>

</style>
