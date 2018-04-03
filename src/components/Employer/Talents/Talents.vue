<template>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-layout v-if="alertComponent">
      <v-flex xs12 sm6 offset-sm3>
        <base-alert :type="alertComponent.type" :message="alertComponent.message"
                    @dismissed="onAlertComponentDismissed"></base-alert>
      </v-flex>
    </v-layout>
    <v-flex xs12 v-for="requirement in requirements" :key="requirement.id">
      <h3>{{ requirement.name }}</h3>
      <v-container fluid grid-list-xs>
        <v-data-iterator content-tag="v-layout" row wrap :items="requirement.talents" :hide-actions="true">
          <v-flex slot="item" slot-scope="props" xs12>
            <v-card>
              <v-card-title>
                <v-flex xs4 sm2 class="text-xs-center">
                  <v-avatar size="80" class="mr-2">
                    <img :src="props.item.profile.pictureUrl" alt="picture"/>
                  </v-avatar>
                </v-flex>
                <v-flex xs8 sm4>
                  <h4>{{ props.item.firstName }} {{ props.item.lastName[0] }}.</h4>
                  {{ props.item.profile.positions.values[0].title
                  }} chez {{ props.item.profile.positions.values[0].company.name }}
                </v-flex>
                <v-flex xs12 sm6>
                  <v-layout wrap>
                    <v-flex xs6>
                      Compétences en vente complexe
                    </v-flex>
                    <v-flex xs6>
                      <star-rating :rating="props.item.qualification.complexSellingSkillsRating"></star-rating>
                    </v-flex>
                    <v-flex xs6>
                      Compétences en chasse
                    </v-flex>
                    <v-flex xs6>
                      <star-rating :rating="props.item.qualification.huntingSkillsRating"></star-rating>
                    </v-flex>
                    <v-flex xs6>
                      Compétences techniques
                    </v-flex>
                    <v-flex xs6>
                      <star-rating :rating="props.item.qualification.technicalSkillsRating"></star-rating>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="mt-2">
                  Ce profil a <span style="font-weight: bold">{{ props.item.yearsOfExperience
                  }} années d'expérience</span>
                  et se place à <span
                  style="font-weight: bold">{{ props.item.conditions.fixedSalary | formatMonetaryAmount }} €</span>.
                </v-flex>
                <v-flex xs12 v-if="props.item.qualification.recommendation" class="mt-2">
                  <div style="font-weight: bold">L'avis de Deepfish</div>
                  <div>{{ props.item.qualification.recommendation }}</div>
                </v-flex>
              </v-card-title>
              <v-card-actions>
                <v-flex xs6 class="text-xs-center">
                  <v-btn flat color="success" @click.native.stop="selectedTalent = props.item; contactDialog = true">
                    Contacter
                  </v-btn>
                </v-flex>
                <v-flex xs6 class="text-xs-center">
                  <v-btn flat color="error" @click.native.stop="selectedTalent = props.item; declinationDialog = true">
                    Refuser
                  </v-btn>
                </v-flex>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-dialog v-model="contactDialog" v-if="selectedTalent">
      <v-card>
        <v-card-title class="headline">
          <v-flex xs12 class="text-xs-center">
            Comment contacter {{ selectedTalent.firstName }} ?
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12 sm6 class="text-xs-center">
              <v-icon>phone</v-icon>
              {{ selectedTalent.phoneNumber }}
            </v-flex>
            <v-flex xs12 sm6 class="text-xs-center">
              <v-icon>email</v-icon>
              {{ selectedTalent.email }}
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="declinationDialog" v-if="selectedTalent">
      <v-card>
        <v-card-text>

        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'employer-talents',
    data: () => ({
      requirements: [],
      contactDialog: false,
      declinationDialog: false,
      selectedTalent: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'user',
        'alertComponent',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setAlertComponent',
        'onAlertComponentDismissed',
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api(`/opportunities?projection=employer&forwarded=true&requirement.company=${this.user.company.id}`)
        .then((response) => {
          // sort talents by requirements
          response.data._embedded.opportunities.forEach((opportunity) => {
            const foundRequirement = this.requirements
              .find(requirement => requirement.id === opportunity.requirement.id);
            if (foundRequirement) {
              foundRequirement.talents.push(opportunity.talent);
            } else {
              const requirementToAdd = opportunity.requirement;
              requirementToAdd.talents = [];
              requirementToAdd.talents.push(opportunity.talent);
              this.requirements.push(requirementToAdd);
            }
          });
          // display alert if no results
          if (!this.requirements.length) {
            this.setAlertComponent({
              type: 'info',
              message: 'Nous n\'avons pas encore de talents à vous présenter, notre équipe travaille actuellement sur vos besoins',
            });
          }
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
