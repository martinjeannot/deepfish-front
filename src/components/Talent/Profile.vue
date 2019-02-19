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
        <v-flex xs12 sm8 offset-sm2 md6 offset-md3>
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs6 md3 class="text-xs-center">
                  <v-avatar size="80">
                    <v-img
                      :src="talent.profilePictureUrl"
                      lazy-src="static/img/avatar.png"
                      alt="picture"
                    ></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex xs4 md4 d-flex align-center text-xs-center text-md-left>
                  <h3>{{ talent.firstName }} {{ talent.lastName }}</h3>
                </v-flex>
                <v-flex xs12 md5 v-if="hasBeenSuccessfullySubmittedOnce" d-flex align-center>
                  <v-btn v-if="talent.active" key="disable" color="error" @click="deactivationDialog = true">
                    Désactiver mon profil
                  </v-btn>
                  <v-btn v-else key="enable" color="success" @click="activateTalent(talent)">
                    Activer mon profil
                  </v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-form v-model="valid" ref="form" @submit.prevent="saveProfile(talent, true)">
                    <v-flex xs12>
                      <v-text-field label="Email" v-model="talent.email" :rules="[rules.required, rules.email]"
                                    type="email" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Numéro mobile" v-model="talent.phoneNumber"
                                    :rules="[rules.required]" type="text" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 class="pt-2">
                      <h4>Quel est ton niveau de maturité ?</h4>
                      <v-radio-group v-model="talent.maturityLevel" :rules="[rules.required]">
                        <v-radio
                          value="CLEAR_WATER"
                          label="Clear water : je suis en recherche active d'un nouveau job le plus vite possible"
                        ></v-radio>
                        <v-radio
                          value="OPEN_WATER"
                          label="Open water : je souhaite quitter mon entreprise prochainement et attends que les opportunités se présentent à moi"
                          class="pt-3"
                        ></v-radio>
                        <v-radio
                          value="DEEP_WATER"
                          label="Deep water : je ne souhaite pas changer d'entreprise mais si mon job idéal se présente, je saisis l'opportunité"
                          class="pt-3"
                        ></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs12 text-xs-center>
                      <v-btn type="submit" :disabled="!valid || loading" :loading="loading" color="primary">
                        Valider
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
    <v-dialog v-model="deactivationDialog" max-width="650px">
      <v-container style="background-color: white">
        <v-form v-model="deactivationValid" @submit.prevent="deactivateTalent(talent)">
          <v-layout row wrap>
            <v-flex xs1>
              <v-icon>warning</v-icon>
            </v-flex>
            <v-flex xs11>
              <h3>
                Attention, cette action entraînera le refus de toutes tes opportunités en attente et la désactivation de ton profil
              </h3>
            </v-flex>
            <v-flex xs12 class="mt-3">
              <h4>Explique-nous la raison de ta désactivation en quelques mots</h4>
            </v-flex>
            <v-flex xs12>
              <v-textarea v-model="talent.deactivationReason" multi-line rows="7"
                          :rules="[rules.required]"></v-textarea>
            </v-flex>
            <v-flex xs12 class="text-xs-right">
              <v-btn type="submit" fab small color="primary" :disabled="!deactivationValid">
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
  import moment from 'moment';
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
      deactivationDialog: false,
      deactivationValid: false,
    }),
    computed: {
      ...mapGetters(['api', 'user', 'loading', 'error', 'alertComponent']),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSuccessSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'setAlertComponent',
        'saveTalentData',
      ]),
      saveProfile(talent, redirectOnConditions) {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          return this.saveTalentData(talent)
            .then((response) => {
              this.talent = response.data;
              this.showSuccessSnackbar();
              if (redirectOnConditions) {
                this.hasBeenSuccessfullySubmittedOnce = true;
                this.$router.push({ name: 'TalentConditions' });
              }
            })
            .catch((/* error */) => {
              this.setErrorAfterApiConsumption();
            })
            .finally(() => this.clearLoading());
        }
        return new Promise();
      },
      activateTalent(talent) {
        talent.previousState = Object.assign({}, talent);
        talent.active = true;
        talent.notes = `[${moment().format('DD/MM/YYYY')}] Le talent s'est réactivé\n\n${talent.notes}`;
        this.saveProfile(talent, false);
      },
      deactivateTalent(talent) {
        talent.previousState = Object.assign({}, talent);
        talent.active = false;
        talent.notes = `[${moment().format('DD/MM/YYYY')}] Le talent s'est désactivé : ${talent.deactivationReason}\n\n${talent.notes}`;
        this.saveProfile(talent, false)
          .then(() => {
            talent.deactivationReason = null;
          });
        this.deactivationDialog = false;
      },
      fetchInitialData() {
        this.prepareForApiConsumption();
        this.api(this.user._links.self.href)
          .then((response) => {
            if (response.data.phoneNumber === 'null') {
              response.data.phoneNumber = '';
              this.setAlertComponent({
                type: 'success',
                message: 'Bienvenue chez Deepfish ! Après avoir complété ton profil, tu pourras remplir tes conditions qui nous permettrons de t\'envoyer les meilleurs opportunités qui matcheront avec !',
              });
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
      if (
        (this.talent.phoneNumber && this.hasBeenSuccessfullySubmittedOnce) ||
        to.name === 'SignIn'
      ) {
        next();
      } else {
        this.setAlertComponent({
          type: 'info',
          message: 'Merci de remplir ton profil en premier lieu',
        });
        next(false);
      }
    },
    created() {
      this.fetchInitialData();
    },
  };
</script>

<style scoped>

</style>
