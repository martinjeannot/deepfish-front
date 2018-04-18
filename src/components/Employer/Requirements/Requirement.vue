<template>
  <v-layout v-if="loading || requirement == null">
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
                <v-layout row wrap>
                  <v-flex xs10>
                    <h2 class="pb-2">Créer un nouveau besoin</h2>
                  </v-flex>
                  <v-flex xs2 class="text-xs-right">
                    <v-btn type="submit" fab small color="success" :disabled="!requirementValid">
                      <v-icon>done</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-text-field v-model="requirement.name" hide-details label="Nom du besoin"></v-text-field>
              </v-card-title>
              <v-card-text>
                <span>Je recrute un profil&nbsp;</span>
                <v-select :items="jobs" v-model="requirement.job" item-value="_links.self.href" item-text="l10nKey"
                          hide-details append-icon="" class="d-inline-flex w-auto"></v-select>
                <span>avec une expérience&nbsp;</span>
                <v-select :items="seniorities" v-model="requirement.seniority" item-value="_links.self.href"
                          item-text="l10nKey" hide-details append-icon="" class="d-inline-flex w-auto"></v-select>
                <span>sur&nbsp;</span>
                <v-text-field placeholder="Paris" v-model="requirement.location" :rules="[rules.required]" hide-details
                              class="d-inline-flex" style="width: 8rem"></v-text-field>
                <span>pour un salaire fixe maxi de&nbsp;</span>
                <span style="white-space: nowrap">
                  <v-text-field type="number" placeholder="45" v-model="fixedSalaryInK" :rules="[rules.positive]"
                                hide-details class="d-inline-flex" style="width: 4rem; direction: rtl"></v-text-field>
                  K€
                </span>
              </v-card-text>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'Ce champ est obligatoire',
    positive: value => value > 0 || 'La valeur doit être supérieure à 0',
    passwordLength: value => (!value || (value && value.length >= 6)) || 'Au moins 6 caractères',
  };

  export default {
    name: 'employer-requirements',
    data: () => ({
      rules,
      jobs: [],
      seniorities: [],
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
          return this.requirement.fixedSalary ? this.requirement.fixedSalary / 1000 : '';
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
          company: `/${this.user.company.id}`,
          name: 'Mon nouveau besoin',
          job: this.jobs[0]._links.self.href,
          seniority: this.seniorities[0]._links.self.href,
          location: '',
          fixedSalary: 0,
        };
      },
      saveRequirement() {
        if (this.$refs.requirementForm.validate()) {
          this.prepareForApiConsumption();
          this.api
            .post('/requirements', this.requirement)
            .then((response) => {
              this.user.requirements.push(response.data);
              this.$router.push('/employer/requirements');
              this.setAlertComponent({
                type: 'success',
                message: 'Nouveau besoin enregistré avec succès ! Nous revenons vers vous sous 48h',
              });
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
        ])
        .then(([
                 jobsResponse,
                 senioritiesResponse,
               ]) => {
          this.jobs = jobsResponse.data._embedded.jobs;
          this.seniorities = senioritiesResponse.data._embedded.seniorities;
          this.requirement = this.newRequirement();
          if (!this.user.requirements.length) {
            this.setAlertComponent({
              type: 'success',
              message: 'Bienvenue sur Deepfish ! Vous pouvez dès maintenant nous confier votre premier besoin en recrutement',
            });
          }
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
