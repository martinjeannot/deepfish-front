<template>
  <v-layout v-if="loading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else>
    <v-flex xs12>
      <v-layout v-if="alertComponent">
        <v-flex xs12 sm6 offset-sm3>
          <base-alert :type="alertComponent.type" :message="alertComponent.message" :rawHtml="alertComponent.rawHtml"
                      @dismissed="onAlertComponentDismissed"></base-alert>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
            <v-list three-line>
              <v-btn fab small color="primary" right absolute to="/employer/requirements/new">
                <v-icon>add</v-icon>
              </v-btn>
              <template v-if="!requirements.length">
                <v-subheader>Mes besoins</v-subheader>
              </template>
              <template v-for="(requirement, index) in requirements">
                <v-subheader v-if="index === 0">Mes besoins</v-subheader>
                <v-divider></v-divider>
                <v-list-tile :key="requirement.id">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ requirement.name }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      Je recrute un profil {{ requirement.job.l10nKey
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
      ]),
    },
    created() {
      this.prepareForApiConsumption();
      this
        .api(`/requirements/search/findByCompany?company=/${this.user.company.id}&projection=default`)
        .then((response) => {
          this.requirements = response.data._embedded.requirements;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
