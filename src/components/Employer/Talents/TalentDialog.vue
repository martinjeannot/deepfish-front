<template>
  <v-dialog
    v-model="dialog"
  >
    <v-card color="grey lighten-4">
      <v-card-text>
        <v-layout v-if="initialLoading" wrap>
          <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
          </v-flex>
        </v-layout>
        <v-layout v-else wrap>
          <v-flex v-if="alertComponent" xs12>
            <base-alert :type="alertComponent.type" :message="alertComponent.message"
                        @dismissed="onAlertComponentDismissed"></base-alert>
          </v-flex>
          <v-layout v-if="talent" wrap>
            <v-flex xs12 class="pb-3">
              <talent-banner :talent="talent"></talent-banner>
            </v-flex>
            <v-flex xs12 class="pb-3">
              <talent-advocate-summary :talent="talent"></talent-advocate-summary>
            </v-flex>
            <v-flex xs12 class="pb-3">
              <talent-self-summary :talent="talent"></talent-self-summary>
            </v-flex>
            <v-flex v-if="talent.fullProfile" xs12>
              <talent-profile-experience-timeline
                :jobs="talent.fullProfile.jobs"
              ></talent-profile-experience-timeline>
              <talent-profile-education-timeline
                :schools="talent.fullProfile.schools"
              ></talent-profile-education-timeline>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import TalentBanner from '@/components/Employer/Talent/TalentBanner';
  import TalentAdvocateSummary from '@/components/Employer/Talent/TalentAdvocateSummary';
  import TalentSelfSummary from '@/components/Employer/Talent/TalentSelfSummary';
  import TalentProfileExperienceTimeline from '@/components/Common/Talent/ExperienceTimeline';
  import TalentProfileEducationTimeline from '@/components/Common/Talent/EducationTimeline';

  export default {
    name: 'EmployerTalentDialog',
    components: {
      TalentBanner,
      TalentAdvocateSummary,
      TalentSelfSummary,
      TalentProfileExperienceTimeline,
      TalentProfileEducationTimeline,
    },
    props: {
      value: Boolean,
      id: String,
    },
    data: () => ({
      talent: null,
      initialLoading: false,
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
        'alertComponent',
      ]),
      dialog: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('update:value', value);
        },
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
      ]),
      prepareForApiConsumption(onCreated = false) {
        if (onCreated) {
          this.initialLoading = true;
        } else {
          this.loading = true;
        }
      },
      clearLoading(onCreated = false) {
        if (onCreated) {
          this.initialLoading = false;
        } else {
          this.loading = false;
        }
      },
      fetchInitialData(onCreated = false) {
        this.prepareForApiConsumption(onCreated);
        const promises = [
          this.api(`/talents/${this.id}?projection=employer`),
          this.api(`/requirements?company=${this.user.company.id}&version=2`),
        ];
        return Promise
          .all(promises)
          .then((responses) => {
            const [talentResponse, requirementsResponse] = responses;
            this.talent = talentResponse.data;
            this.requirements = requirementsResponse.data._embedded.requirements
              .filter(requirement => requirement.jobFunction === this.talent.jobFunction);
          })
          .catch(() => this.setErrorAfterApiConsumption())
          .finally(() => this.clearLoading(onCreated));
      },
    },
    created() {
      return this.fetchInitialData(true);
    },
  };
</script>

<style scoped>

</style>
