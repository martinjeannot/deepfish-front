<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-text>
          <v-form v-model="formValid" @submit.prevent="scheduleInterviews">
            <v-layout wrap>
              <v-flex xs12 class="pb-3 text-xs-center">
                <h5 class="headline">
                  Interview scheduling
                </h5>
              </v-flex>
              <v-flex xs6 class="pb-3 pr-2">
                <talent-select
                  v-model="talent"
                  :rules="[rules.required]"
                ></talent-select>
              </v-flex>
              <v-flex xs6 class="pb-3 pl-2">
                <opportunity-select
                  v-model="opportunity"
                  :talent="talent"
                  :rules="[rules.required]"
                ></opportunity-select>
              </v-flex>
              <v-flex xs6 class="pb-3 pr-2">
                <participation-status-select
                  v-model="talentResponseStatus"
                  label="Talent response status"
                  :rules="[rules.required]"
                ></participation-status-select>
              </v-flex>
              <v-flex xs6 class="pb-3 pl-2">
                <participation-status-select
                  v-model="employerResponseStatus"
                  label="Employer response status"
                  readonly
                  :rules="[rules.required]"
                ></participation-status-select>
              </v-flex>
              <v-flex xs6 class="pb-3 pr-2">
                <date-picker-menu
                  v-model="startDate"
                  label="Start date"
                  no-title
                  :rules="[rules.required]"
                ></date-picker-menu>
              </v-flex>
              <v-flex xs6 class="pb-3 pl-2">
                <interview-time-select
                  v-model="startTime"
                  label="Start time"
                  :rules="[rules.required]"
                ></interview-time-select>
              </v-flex>
              <v-flex xs4 class="pb-3 pr-2">
                <interview-format-select
                  v-model="format"
                  :rules="[rules.required]"
                ></interview-format-select>
              </v-flex>
              <v-flex xs4 class="pb-3 px-2">
                <interview-duration-select
                  v-model="duration"
                  :rules="[rules.required]"
                ></interview-duration-select>
              </v-flex>
              <v-flex xs4 class="pb-3 pl-2">
                <interview-location-input-field
                  v-model="location"
                  :format="format"
                  :rules="[rules.required]"
                ></interview-location-input-field>
              </v-flex>
              <v-flex xs12 class="text-xs-center">
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="!formValid"
                  :loading="loading"
                >
                  Schedule
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';
  import TalentSelect from '../../Utilities/TalentSelect';
  import OpportunitySelect from '../../Utilities/OpportunitySelect';
  import ParticipationStatusSelect from '../../Utilities/ParticipationStatusSelect';
  import DatePickerMenu from '../../../Utilities/DatePickerMenu';
  import InterviewTimeSelect from '../../../Utilities/InterviewTimeSelect';
  import InterviewFormatSelect from '../../../Utilities/InterviewFormatSelect';
  import InterviewDurationSelect from '../../../Utilities/InterviewDurationSelect';
  import InterviewLocationInputField from '../../../Utilities/InterviewLocationInputField';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'DataManagementNewInterview',
    components: {
      DataManagementNavigation,
      TalentSelect,
      OpportunitySelect,
      ParticipationStatusSelect,
      DatePickerMenu,
      InterviewTimeSelect,
      InterviewFormatSelect,
      InterviewDurationSelect,
      InterviewLocationInputField,
    },
    data: () => ({
      rules,
      formValid: false,
      talent: null,
      opportunity: null,
      talentResponseStatus: null,
      employerResponseStatus: 'ACCEPTED',
      startDate: null,
      startTime: null,
      format: 'PHONE',
      duration: 30,
      location: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'user',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      scheduleInterviews() {
        this.prepareForApiConsumption();
        const interviews = [this.newInterview()];
        this.api
          .post('/interviews/admin/create-resources', { resources: interviews })
          .then(() => {
            this.showSnackbar(['Success', 'success']);
            this.$router.push({ name: 'AdminDMInterviews' });
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
      newInterview() {
        const startAt = moment(`${this.startDate} ${this.startTime}`);
        return {
          creatorId: this.user._links.self.href.split('/').pop(),
          opportunity: `/${this.opportunity.id}`,
          location: this.location,
          startAt: startAt.format(),
          endAt: moment(startAt).add(this.duration, 'minutes').format(),
          format: this.format,
          talent: `/${this.talent.id}`,
          talentResponseStatus: this.talentResponseStatus,
          employerResponseStatus: this.employerResponseStatus,
        };
      },
    },
  };
</script>

<style scoped>

</style>
