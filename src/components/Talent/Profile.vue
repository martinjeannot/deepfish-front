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
                  <v-form v-model="valid" ref="form" @submit.prevent="saveProfile">
                    <v-layout row class="mb-3">
                      <v-flex xs12>
                        <h3>{{ talent.firstName }} {{ talent.lastName }}</h3>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs12>
                        <v-text-field label="Email" v-model="talent.email" :rules="[rules.required, rules.email]"
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
                        <h4>Niveau de maturité</h4>
                        <v-radio-group v-model="talent.maturityLevel" row>
                          <v-tooltip bottom class="bugfix-vuetify-2171">
                            <v-radio label="Clear water" value="CLEAR_WATER" slot="activator"></v-radio>
                            <div>
                              S’adresse à vous si vous souhaitez quitter rapidement<br>
                              ou dans un futur proche votre entreprise, idéalement<br>
                              à conditions meilleures ou égales
                            </div>
                          </v-tooltip>
                          <v-tooltip bottom class="bugfix-vuetify-2171">
                            <v-radio label="Open water" value="OPEN_WATER" slot="activator"></v-radio>
                            <div>
                              S’adresse à vous si vous êtes relativement bien<br>
                              dans votre entreprise mais restez à l’affut d’une<br>
                              opportunité plus intéressante et que vous répondez<br>
                              aux sollicitations des recruteurs
                            </div>
                          </v-tooltip>
                          <v-tooltip bottom class="bugfix-vuetify-2171">
                            <v-radio label="Deep water" value="DEEP_WATER" slot="activator"></v-radio>
                            <div>
                              S’adresse aux profils qui se sentent bien dans<br>
                              leur entreprise actuelle et qui n’ont pas le temps<br>
                              ou l’envie de faire de la veille mais qui ont des<br>
                              conditions très précises pour lesquelles ils seraient<br>
                              prêts à changer d’entreprise
                            </div>
                          </v-tooltip>
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
      saveProfile() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('prepareForApiConsumption');
          this.$store.getters.api
            .patch(this.talent._links.self.href, this.talent)
            .then((/* response */) => {
              this.$store.dispatch('clearLoading');
            })
            .catch((/* error */) => {
              this.$store.dispatch('setErrorAfterApiConsumption');
            });
        }
      },
    },
    created() {
      this.$store.dispatch('prepareForApiConsumption');
      this.$store.getters.api
        .get(this.$store.getters.user._links.self.href)
        .then((response) => {
          this.$store.dispatch('clearLoading');
          if (response.data.phoneNumber === 'null') {
            response.data.phoneNumber = '';
          }
          this.talent = response.data;
        })
        .catch((/* error */) => {
          this.$store.dispatch('setErrorAfterApiConsumption');
        });
    },
  };
</script>

<style scoped>
  .bugfix-vuetify-2171 {
    flex: 1 1 auto;
  }
</style>
