<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-layout v-if="alertComponent">
      <v-flex xs12 sm6 offset-sm3>
        <base-alert :type="alertComponent.type" :message="alertComponent.message"
                    @dismissed="onAlertComponentDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-flex xs12 v-for="requirement in requirements" :key="requirement.id">
      <h3>{{ requirement.name }}</h3>
      <v-container fluid grid-list-xs>
        <v-data-iterator content-tag="v-layout" row wrap :items="requirement.opportunities" :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card :style="isTalentDeclined(props.item) ? 'display: none' : ''">
              <v-card-title>
                <v-flex xs4 sm2 class="text-xs-center">
                  <v-avatar size="80" class="mr-2">
                    <img :src="props.item.talent.basicProfile.pictureUrl" alt="picture"/>
                  </v-avatar>
                </v-flex>
                <v-flex xs8 sm4>
                  <h4>{{ props.item.talent.firstName }} {{ props.item.talent.lastName[0] }}.</h4>
                  <div v-if="props.item.talent.basicProfile.positions._total">
                    {{ props.item.talent.basicProfile.positions.values[0].title
                    }} chez {{ props.item.talent.basicProfile.positions.values[0].company.name }}
                  </div>
                  <div v-if="getTalentLinkedInProfileUrl(props.item.talent.basicProfile)">
                    <a :href="getTalentLinkedInProfileUrl(props.item.talent.basicProfile)"
                       target="_blank">Voir le profil complet</a>
                  </div>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-layout wrap>
                    <v-flex xs6>
                      Compétences en vente complexe
                    </v-flex>
                    <v-flex xs6>
                      <star-rating :rating="props.item.talent.qualification.complexSellingSkillsRating"></star-rating>
                    </v-flex>
                    <v-flex xs6>
                      Compétences en chasse
                    </v-flex>
                    <v-flex xs6>
                      <star-rating :rating="props.item.talent.qualification.huntingSkillsRating"></star-rating>
                    </v-flex>
                    <v-flex xs6>
                      Compétences techniques
                    </v-flex>
                    <v-flex xs6>
                      <star-rating :rating="props.item.talent.qualification.technicalSkillsRating"></star-rating>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="mt-2">
                  Ce talent a accepté votre opportunité.
                </v-flex>
                <v-flex xs12>
                  Ce profil a <span style="font-weight: bold">{{ props.item.talent.yearsOfExperience
                  }} années d'expérience</span>
                  et se place à <span
                  style="font-weight: bold">{{ props.item.talent.conditions.fixedSalary | formatMonetaryAmount
                  }} €</span> de salaire fixe.
                </v-flex>
                <v-flex xs12 v-if="props.item.talent.conditions.taskTypes.length">
                  Missions acceptées :
                  <v-chip v-for="taskType in props.item.talent.conditions.taskTypes" :key="taskType.id">
                    {{ taskType.l10nKey }}
                  </v-chip>
                </v-flex>
                <v-flex xs12 sm6 v-if="props.item.talent.selfPitch" class="mt-2" style="align-self: flex-start">
                  <div class="pb-2" style="font-weight: bold">La présentation du talent</div>
                  <div style="white-space: pre-wrap">{{ props.item.talent.selfPitch }}</div>
                </v-flex>
                <v-flex xs12 sm6 v-if="props.item.talent.qualification.recommendation" class="mt-2"
                        style="align-self: flex-start">
                  <div class="pb-2" style="font-weight: bold">L'avis de Deepfish</div>
                  <div style="white-space: pre-wrap">{{ props.item.talent.qualification.recommendation }}</div>
                </v-flex>
              </v-card-title>
              <v-card-actions v-if="isTalentPending(props.item)">
                <v-layout row wrap>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn flat color="success" :loading="loading" :disabled="loading"
                           @click.native.stop="acceptTalent(props.item)">
                      Je contacte le talent
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn flat color="info" :loading="loading" :disabled="loading"
                           @click.native.stop="selectedOpportunity = props.item; contactDialog = true">
                      Je veux en parler avec Deepfish
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn flat color="error"
                           @click.native.stop="selectedOpportunity = props.item; declinationDialog = true">
                      Je refuse le talent
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
              <v-card-actions v-if="isTalentAccepted(props.item)">
                <v-layout row wrap>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn flat color="success"
                           @click.native.stop="selectedOpportunity = props.item; acceptanceDialog = true">
                      Je contacte le talent
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn flat color="info" :loading="loading" :disabled="loading"
                           @click.native.stop="selectedOpportunity = props.item; contactDialog = true">
                      Je veux en parler avec Deepfish
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm4 class="text-xs-center">
                    <v-btn flat color="error"
                           @click.native.stop="selectedOpportunity = props.item; declinationDialog = true">
                      Je ne retiens pas ce profil
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-dialog v-model="acceptanceDialog" v-if="selectedOpportunity" max-width="650px">
      <v-card>
        <v-card-title class="headline">
          <v-flex xs12 class="text-xs-center">
            Comment contacter {{ selectedOpportunity.talent.firstName }} ?
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm6 class="text-xs-center">
              <v-icon>phone</v-icon>
              {{ selectedOpportunity.talent.phoneNumber }}
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center">
              <v-icon>email</v-icon>
              {{ selectedOpportunity.talent.email }}
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="contactDialog" v-if="selectedOpportunity" max-width="650px">
      <v-card>
        <v-card-text>
          <v-form v-model="contactFormValid" @submit.prevent="contactAdmins(selectedOpportunity)">
            <v-layout wrap>
              <v-flex xs12>
                <h3>Posez-nous vos questions et nous reviendrons rapidement vers vous :</h3>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="contactMessage" rows="7" :rules="[rules.required]"></v-textarea>
              </v-flex>
              <v-flex xs12 class="text-xs-right">
                <v-btn type="submit" fab small color="primary" :disabled="!contactFormValid || loading"
                       :loading="loading">
                  <v-icon>done</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="declinationDialog" v-if="selectedOpportunity" max-width="650px">
      <v-card>
        <v-card-text>
          <v-form v-model="employerDeclinationValid" @submit.prevent="declineTalent(selectedOpportunity)">
            <v-layout wrap>
              <v-flex xs12>
                <h3>Expliquez la raison de votre refus pour améliorer la recherche :</h3>
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="selectedOpportunity.employerDeclinationReason" rows="7"
                            :rules="[rules.required]"></v-textarea>
              </v-flex>
              <v-flex xs12 class="text-xs-right">
                <v-btn type="submit" fab small color="primary" :disabled="!employerDeclinationValid || loading"
                       :loading="loading">
                  <v-icon>done</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions, mapState } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'employer-talents',
    data: () => ({
      rules,
      requirements: [],
      selectedOpportunity: null,
      acceptanceDialog: false,
      contactDialog: false,
      contactFormValid: false,
      contactMessage: '',
      declinationDialog: false,
      employerDeclinationValid: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
        'user',
        'alertComponent',
      ]),
      ...mapState([
        'getTalentLinkedInProfileUrl',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setAlertComponent',
        'onAlertComponentDismissed',
        'showSnackbar',
      ]),
      isTalentPending(opportunity) {
        return !opportunity.employerStatus || opportunity.employerStatus === 'PENDING';
      },
      isTalentAccepted(opportunity) {
        return opportunity.employerStatus === 'ACCEPTED';
      },
      isTalentDeclined(opportunity) {
        return opportunity.employerStatus === 'DECLINED';
      },
      acceptTalent(opportunity) {
        opportunity.previousState = Object.assign({}, opportunity);
        opportunity.employerStatus = 'ACCEPTED';
        this
          .saveOpportunity(opportunity)
          .then(() => {
            this.selectedOpportunity = opportunity;
            this.acceptanceDialog = true;
          });
      },
      declineTalent(opportunity) {
        opportunity.previousState = Object.assign({}, opportunity);
        opportunity.employerStatus = 'DECLINED';
        this
          .saveOpportunity(opportunity)
          .then(() => {
            this.declinationDialog = false;
          });
      },
      saveOpportunity(opportunityToSave) {
        const opportunity = Object.assign({}, opportunityToSave);
        delete opportunity.requirement;
        delete opportunity.talent;
        delete opportunity.previousState.requirement;
        delete opportunity.previousState.talent;
        this.prepareForApiConsumption();
        return this.api
          .patch(opportunity._links.self.href, opportunity)
          .then(() => this.showSnackbar('Opération terminée avec succès'))
          .catch(() => this.showSnackbar('Erreur'))
          .finally(() => this.clearLoading());
      },
      contactAdmins(opportunity) {
        this.prepareForApiConsumption();
        this.api
          .post('/employers/contact', {
            employerId: this.user.id,
            talentId: opportunity.talent.id,
            message: this.contactMessage,
          })
          .then(() => {
            this.contactDialog = false;
            this.showSnackbar('Merci, nous revenons vers vous sous peu');
          })
          .catch(() => this.showSnackbar('Erreur'))
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this
        .api(`/opportunities?projection=employer&forwarded=true&requirement.company=${this.user.company.id}&employerStatus=PENDING&employerStatus=ACCEPTED&sort=forwardedAt,desc`)
        .then((response) => {
          // sort talents by requirements
          response.data._embedded.opportunities.forEach((opportunity) => {
            const foundRequirement = this.requirements
              .find(requirement => requirement.id === opportunity.requirement.id);
            if (foundRequirement) {
              foundRequirement.opportunities.push(opportunity);
            } else {
              const requirementToAdd = opportunity.requirement;
              requirementToAdd.opportunities = [];
              requirementToAdd.opportunities.push(opportunity);
              this.requirements.push(requirementToAdd);
            }
          });
          // display alert if no results
          if (!this.requirements.length) {
            this.setAlertComponent({
              type: 'info',
              message: 'Nous n\'avons pas encore de talents à vous présenter, vous recevrez un email lorsque vous aurez un nouveau talent',
            });
          }
        })
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
