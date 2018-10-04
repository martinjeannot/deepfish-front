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
                <v-flex xs6 md3 d-flex>
                  <v-avatar size="80">
                    <img :src="talent.basicProfile.pictureUrl" alt="picture"/>
                  </v-avatar>
                </v-flex>
                <v-flex xs4 md4 d-flex align-center  text-xs-center text-md-left>
                  <h3>{{ talent.firstName }} {{ talent.lastName }}</h3>
                </v-flex>
                <v-flex xs12 md5 d-flex align-center>
                  <v-btn key="disable" color="error"  v-if="talent.active" @click="showDialogReason" slot="activator">Je désactive mon profil</v-btn>
                  <v-btn key="enable" color="success" v-else @click="activate">J'active mon profil</v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-form v-model="valid" ref="form" @submit.prevent="saveProfile(true)">
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
    <v-dialog v-model="declinationDialog" max-width="650px">
      <v-container style="background-color: white">
        <v-form v-model="textReason" @submit.prevent="deactivate()">
          <v-layout row wrap>
            <v-flex xs1>
              <v-icon>warning</v-icon>
            </v-flex>
            <v-flex xs11>
              <h3>
                Attention, cette action entraînera le refus de toutes tes
                opportunités en attente
                et la désactivation de ton profil
              </h3>
            </v-flex>
            <v-flex xs12 class="mt-3">
              <h4>Explique-nous la raison de ta désactivation en quelques mots</h4>
            </v-flex>
            <v-flex xs12>
            <v-textarea v-model="talent.deactivationReason"
              multi-line rows="7" :rules="[rules.required]"></v-textarea>
            </v-flex>
            <v-flex xs12 class="text-xs-right">
              <v-btn type="submit" fab small color="primary" :disabled="!textReason">
                <v-icon>done</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-dialog>
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
      declinationDialog: false,
      textReason: false,
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
      saveProfile(redirectOnConditions) {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          this.api
            .patch(this.talent._links.self.href, this.talent)
            .then((/* response */) => {
              if (redirectOnConditions) {
                this.hasBeenSuccessfullySubmittedOnce = true;
                this.$router.push({ name: 'TalentConditions' });
              }
              this.showSuccessSnackbar();
            })
            .catch((/* error */) => {
              this.setErrorAfterApiConsumption();
            })
            .finally(() => this.clearLoading());
        }
      },
      showDialogReason() {
        this.declinationDialog = !this.declinationDialog;
      },
      deactivate() {
        const date = new Date();
        this.talent.active = false;
        this.talent.notes = `
          [${date.getDay()}/${date.getMonth()}/${date.getFullYear()}] Raison de désactivation : - ${this.talent.deactivationReason}
           ${this.talent.notes}`;
        this.declinationDialog = false;
        this.saveProfile(false);
      },
      activate() {
        this.talent.active = true;
        this.saveProfile(false);
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
            this.talent.deactivationReason = null;
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
