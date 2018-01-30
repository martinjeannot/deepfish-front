<template>
  <v-container>
    <v-layout v-if="loading">
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
        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <v-card>
              <v-form v-model="requirementValid" ref="requirementForm" @submit.prevent="saveRequirement">
                <v-card-title class="d-block">
                  <h2 class="pb-2">{{ requirement.name }}</h2>
                  <v-text-field v-model="requirement.name" label="Nom du besoin"></v-text-field>
                </v-card-title>
                <v-card-text>
                  <span>Je recrute un profil&nbsp;</span>
                  <v-select :items="jobs" v-model="requirement.job" item-value="_links.self.href" item-text="l10nKey"
                            append-icon="" class="d-inline-flex w-auto"></v-select>
                  <span>avec une expérience&nbsp;</span>
                  <v-select :items="seniorities" v-model="requirement.seniority" item-value="_links.self.href"
                            item-text="l10nKey" append-icon="" class="d-inline-flex w-auto"></v-select>
                  <span>sur&nbsp;</span>
                  <v-text-field v-model="requirement.location" class="d-inline-flex" style="width: 8rem"></v-text-field>
                  <span>pour un salaire fixe maxi de&nbsp;</span>
                  <v-text-field type="number" v-model="fixedSalaryInK" class="d-inline-flex"
                                style="width: 4rem; direction: rtl"></v-text-field>
                  <span>K€</span>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn type="submit">Créer un nouveau besoin</v-btn>
                  </v-flex>
                </v-card-text>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'employer-requirements',
    data: () => ({
      jobs: [],
      seniorities: [],
      company: null,
      requirement: null,
      requirementValid: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'alertComponent',
        'user',
      ]),
      fixedSalaryInK: {
        get() {
          return this.requirement.fixedSalary / 1000;
        },
        set(fixedSalaryInK) {
          this.requirement.fixedSalary = fixedSalaryInK * 1000;
        },
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'clearLoading',
        'setAlertComponent',
      ]),
      newRequirement() {
        return {
          createdBy: this.user.id,
          company: this.company._links.self.href,
          name: 'Mon nouveau besoin',
          job: this.jobs[0]._links.self.href,
          seniority: this.seniorities[0]._links.self.href,
          location: 'Paris',
          fixedSalary: 45000,
        };
      },
      saveRequirement() {
        if (this.$refs.requirementForm.validate()) {
          this.prepareForApiConsumption();
          this.api
            .post('/requirements', this.requirement)
            .then(() => {
              this.setAlertComponent({
                type: 'success',
                message: 'Nouveau besoin enregistré avec succès ! Nous revenons vers vous sous 48h',
              });
              this.requirement = this.newRequirement();
            })
            .catch(() => this.setErrorAfterApiConsumption())
            .finally(() => this.clearLoading());
        }
      },
    },
    created() {
      this.prepareForApiConsumption();
      Promise
        .all([
          this.api('/jobs'),
          this.api('/seniorities'),
          this.api(this.user._links.company.href),
        ])
        .then(([
                 jobsResponse,
                 senioritiesResponse,
                 companyResponse]) => {
          this.jobs = jobsResponse.data._embedded.jobs;
          this.seniorities = senioritiesResponse.data._embedded.seniorities;
          this.company = companyResponse.data;
          this.requirement = this.newRequirement();
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>
  .w-auto {
    width: auto;
  }
</style>
