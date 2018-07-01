<template>
  <v-layout row v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-flex xs12>
      <v-layout v-if="alertComponent">
        <v-flex xs12 sm6 offset-sm3>
          <base-alert :type="alertComponent.type" :message="alertComponent.message"
                      @dismissed="onAlertComponentDismissed"></base-alert>
        </v-flex>
      </v-layout>
      <v-layout v-if="talent !== null">
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs8 d-flex align-center>
                  <h3>{{ talent.firstName }} {{ talent.lastName }}</h3>
                </v-flex>
                <v-flex xs4 text-xs-right>
                  <v-avatar size="80">
                    <img :src="talent.basicProfile.pictureUrl" alt="picture"/>
                  </v-avatar>
                </v-flex>
                <v-flex xs12>
                  <v-form v-model="valid" ref="form" @submit.prevent="saveProfile">
                    <v-flex xs12>
                      <v-text-field label="Email" v-model="talent.email" :rules="[rules.required, rules.email]"
                                    type="email" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Numéro mobile" v-model="talent.phoneNumber" :rules="[rules.required]"
                                    type="text" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <h4>Quel est ton niveau de maturité ?</h4>
                      <v-radio-group v-model="talent.maturityLevel" row :rules="[rules.required]">
                        <v-tooltip bottom class="bugfix-vuetify-2171">
                          <v-radio label="Clear water" value="CLEAR_WATER" slot="activator"
                                   class="hidden-xs-only"></v-radio>
                          <v-radio label="Clear" value="CLEAR_WATER" slot="activator"
                                   class="hidden-sm-and-up"></v-radio>
                          <div>
                            Je suis en recherche active d'un nouveau job le plus vite possible
                          </div>
                        </v-tooltip>
                        <v-tooltip bottom class="bugfix-vuetify-2171">
                          <v-radio label="Open water" value="OPEN_WATER" slot="activator"
                                   class="hidden-xs-only"></v-radio>
                          <v-radio label="Open" value="OPEN_WATER" slot="activator" class="hidden-sm-and-up"></v-radio>
                          <div>
                            Je souhaite quitter mon entreprise prochainement<br/>
                            et attends que les opportunités se présentent à moi
                          </div>
                        </v-tooltip>
                        <v-tooltip bottom class="bugfix-vuetify-2171">
                          <v-radio label="Deep water" value="DEEP_WATER" slot="activator"
                                   class="hidden-xs-only"></v-radio>
                          <v-radio label="Deep" value="DEEP_WATER" slot="activator" class="hidden-sm-and-up"></v-radio>
                          <div>
                            Je ne souhaite pas changer d'entreprise mais<br/>
                            si mon job idéal se présente, je saisis l'opportunité
                          </div>
                        </v-tooltip>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs12 text-xs-center>
                      <v-btn type="submit" :disabled="!valid || loading" :loading="loading" color="primary">Valider
                      </v-btn>
                    </v-flex>
                  </v-form>
                </v-flex>
              </v-layout>
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
  };

  export default {
    name: 'talent-profile',
    data: () => ({
      valid: false,
      rules,
      talent: null,
      hasBeenSuccessfullySubmittedOnce: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
        'loading',
        'error',
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
        'setAlertComponent',
      ]),
      saveProfile() {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          this.api
            .patch(this.talent._links.self.href, this.talent)
            .then((/* response */) => {
              this.hasBeenSuccessfullySubmittedOnce = true;
              this.showSuccessSnackbar();
              this.$router.push({ name: 'TalentConditions' });
            })
            .catch((/* error */) => {
              this.setErrorAfterApiConsumption();
            })
            .finally(() => this.clearLoading());
        }
      },
      fetchInitialData() {
        this.prepareForApiConsumption();
        this.api(this.user._links.self.href)
          .then((response) => {
            if (response.data.phoneNumber === 'null') {
              response.data.phoneNumber = '';
            } else {
              this.hasBeenSuccessfullySubmittedOnce = true;
            }
            this.talent = response.data;
          })
          .catch((/* error */) => {
            this.setErrorAfterApiConsumption();
          })
          .finally(() => this.clearLoading());
      },
    },
    beforeRouteLeave(to, from, next) {
      if ((this.talent.phoneNumber && this.hasBeenSuccessfullySubmittedOnce) || to.name === 'TalentSignIn') {
        next();
      } else {
        this.setAlertComponent({ type: 'info', message: 'Merci de remplir ton profil en premier lieu' });
        next(false);
      }
    },
    created() {
      this.fetchInitialData();
    },
  };
</script>

<style scoped>
  .bugfix-vuetify-2171 {
    flex: 1 1 auto;
  }
</style>
