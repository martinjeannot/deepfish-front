<template>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-flex xs12>
      <v-layout v-if="alertComponent">
        <v-flex xs12 sm8 offset-sm2>
          <base-alert :type="alertComponent.type" :message="alertComponent.message" :rawHtml="alertComponent.rawHtml"
                      @dismissed="onAlertComponentDismissed"></base-alert>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12 sm8 offset-sm2>
          <v-card>
            <v-card-title>
              <v-flex xs12 class="text-xs-center">
                <div class="headline">Déclarer un nouveau besoin</div>
              </v-flex>
            </v-card-title>
            <v-card-title class="text-xs-center">
              <v-layout row wrap>
                <v-flex xs12 sm5>
                  <v-btn color="info" :to="{ name: 'EmployerTypeformRequirement' }" target="_blank">
                    En ligne
                    <v-icon right>desktop_windows</v-icon>
                  </v-btn>
                  <div class="font-italic">(~5 min)</div>
                </v-flex>
                <v-flex xs12 sm2 class="py-3 font-weight-bold">OU</v-flex>
                <v-flex xs12 sm5>
                  <v-btn color="info" :to="{ name: 'EmployerCalendlyRequirement' }" target="_blank">
                    Par téléphone
                    <v-icon right>phone</v-icon>
                  </v-btn>
                  <div class="font-italic">(~15 min)</div>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>
          <v-card v-if="requirements.length" class="mt-4">
            <v-list three-line>
              <template v-for="(requirement, index) in requirements">
                <v-subheader v-if="index === 0" :key="requirement.id + '-subheader'">Mes besoins</v-subheader>
                <v-divider :key="requirement.id + '-divider'"></v-divider>
                <v-list-tile :key="requirement.id + '-list-tile'">
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <router-link :to="{name: 'EmployerRequirement', params: {id: requirement.id}}">
                        {{ requirement.name }}
                      </router-link>
                    </v-list-tile-title>
                    <v-list-tile-sub-title v-if="requirement.jobType">
                      Je recrute un profil {{ requirement.jobType.l10nKey
                      }} avec une expérience {{ requirement.seniority.l10nKey }} sur {{ requirement.location
                      }} pour un salaire fixe maxi de {{ requirement.fixedSalary / 1000 }}K€
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'employer-requirements',
    data: () => ({
      requirements: [],
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'alertComponent',
        'user',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'clearLoading',
        'setAlertComponent',
      ]),
    },
    async created() {
      this.prepareForApiConsumption();
      const newRequirementCreated = Object.prototype.hasOwnProperty.call(this.$route.query, 'newRequirementCreated');
      const meetingScheduled = Object.prototype.hasOwnProperty.call(this.$route.query, 'meetingScheduled');
      if (newRequirementCreated) {
        // waiting for the backend to save the newly created requirement in db
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      this.api(`/requirements/search/findByCompany?company=/${this.user.company.id}&projection=default`)
        .then((response) => {
          this.requirements = response.data._embedded.requirements;
          if (newRequirementCreated) {
            this.setAlertComponent({
              type: 'success',
              message: 'Nouveau besoin enregistré ! Vous serez notifié par mail dès reception d\'un nouveau profil',
            });
          } else if (meetingScheduled) {
            this.setAlertComponent({
              type: 'success',
              message: 'Votre demande a bien été prise en compte ! N\'oubliez pas d\'ajouter l\'évènement à votre calendrier',
            });
          } else if (!this.requirements.length) {
            this.setAlertComponent({
              type: 'success',
              message: 'Bienvenue chez Deepfish ! Vous pouvez dès maintenant exprimer votre premier besoin en recrutement',
            });
          }
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
