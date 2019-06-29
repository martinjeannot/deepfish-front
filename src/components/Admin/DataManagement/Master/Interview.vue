<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-layout v-if="initialLoading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
        </v-flex>
      </v-layout>
      <v-layout v-else row wrap>
        <v-flex xs12 v-if="alertComponent">
          <base-alert :type="alertComponent.type" :message="alertComponent.message"
                      @dismissed="onAlertComponentDismissed"></base-alert>
        </v-flex>
        <v-flex xs12 v-if="interview">
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 class="text-xs-center pb-3">
                  <h5 class="headline">
                    <span class="font-weight-bold">
                      {{ interview.company.name }}
                    </span>
                    a proposé un entretien
                    <span class="font-weight-bold">
                      {{ interviewFormat(interview.format).text }}
                    </span>
                    à
                    <span class="font-weight-bold">
                      {{ interview.talent.firstName }} {{ interview.talent.lastName.toUpperCase() }}
                    </span>
                  </h5>
                </v-flex>
                <v-flex xs12 class="text-xs-center pb-3">
                  Interview status :
                  <span :class="[`${getInterviewStatusColor(interview.status)}--text`, 'font-weight-bold']">
                    {{ interview.status }}
                  </span>
                  <v-btn
                    color="error"
                    :disabled="interview.status === 'CANCELLED'"
                    @click="cancellationDialog = true"
                  >
                    Cancel
                  </v-btn>
                </v-flex>
                <v-flex xs6 class="text-xs-right pr-2 pb-3">
                  Employer response :
                  <span
                    :class="[`${getInterviewParticipationStatusColor(interview.employerResponseStatus)}--text`, 'font-weight-bold']"
                  >
                    {{ interview.employerResponseStatus }}
                  </span>
                </v-flex>
                <v-flex xs6 class="pl-2 pb-3">
                  Talent response :
                  <span
                    :class="[`${getInterviewParticipationStatusColor(interview.talentResponseStatus)}--text`, 'font-weight-bold']"
                  >
                    {{ interview.talentResponseStatus }}
                  </span>
                </v-flex>

                <v-flex xs12>
                  <v-form v-model="detailsFormValid" @submit.prevent="saveInterview(interview)">
                    <v-layout wrap>
                      <v-flex xs4 class="pr-2">
                        <v-menu
                          v-model="datePickerMenu"
                          :close-on-content-click="false"
                          full-width
                          max-width="290"
                        >
                          <template #activator="{ on }">
                            <v-text-field
                              :value="startAtDate"
                              :label="datePickerLabel"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                              :rules="[rules.required]"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="startAtDate"
                            @change="datePickerMenu = false"
                          ></v-date-picker>
                        </v-menu>
                        <v-select
                          v-model="startAtTime"
                          :items="times"
                          label="Time"
                          prepend-icon="access_time"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-flex>
                      <v-flex xs4 class="px-2">
                        <v-select
                          v-model="interview.format"
                          :items="interviewFormats"
                          label="Format"
                          :rules="[rules.required]"
                        ></v-select>
                        <v-select
                          v-model="duration"
                          :items="interviewDurations"
                          label="Duration"
                          prepend-icon="timer"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-flex>
                      <v-flex xs4 class="pl-2">
                        <v-text-field
                          v-if="interview.format === 'PHONE'"
                          v-model="interview.location"
                          label="Location"
                          :prepend-icon="locationIcon"
                          :rules="[rules.required]"
                        ></v-text-field>
                        <v-textarea
                          v-else
                          v-model="interview.location"
                          label="Location"
                          :prepend-icon="locationIcon"
                          :rules="[rules.required]"
                        ></v-textarea>
                      </v-flex>
                      <v-flex xs12 class="text-xs-center">
                        <v-btn
                          type="submit"
                          color="primary"
                          :disabled="!detailsFormValid"
                          :loading="loading"
                        >
                          Save
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>

          <v-dialog v-model="cancellationDialog" maxWidth="650px">
            <v-card>
              <v-card-title>
                <v-flex xs12 class="title">
                  Cancel this interview ?
                </v-flex>
              </v-card-title>
              <v-form
                v-model="cancellationFormValid"
                @submit.prevent="cancelInterview(interview, cancelledBy, cancelLinkedInterviews)"
              >
                <v-card-text>
                  <v-flex xs12 class="subheading grey--text text--darken-2">
                    Which side could not make it on schedule ?
                    <v-select
                      v-model="cancelledBy"
                      :items="['TALENT', 'EMPLOYER']"
                      :rules="[rules.required]"
                      class="pb-2"
                    ></v-select>
                    Would you like to cancel all linked interviews as well ?
                    <v-checkbox
                      v-model="cancelLinkedInterviews"
                      label="Cancel linked interviews"
                    ></v-checkbox>
                  </v-flex>
                </v-card-text>
                <v-card-actions>
                  <v-flex xs12 class="text-xs-right">
                    <v-btn
                      type="submit"
                      color="error"
                      :disabled="!cancellationFormValid"
                      flat
                      :loading="loading"
                    >
                      {{ cancelLinkedInterviews ? 'Cancel all' : 'Cancel' }}
                    </v-btn>
                  </v-flex>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions, mapState } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  const interviewDurations = [
    { text: '30 min', value: 30 },
    { text: '1h', value: 60 },
    { text: '1h30', value: 90 },
  ];

  export default {
    name: 'DataManagementInterview',
    components: { DataManagementNavigation },
    props: ['id'],
    data: () => ({
      rules,
      interviewDurations,
      interview: null,
      detailsFormValid: false,
      datePickerDateFormat: 'YYYY-MM-DD',
      datePickerMenu: false,
      cachedDuration: 0,
      cancellationDialog: false,
      cancellationFormValid: false,
      cancelledBy: '',
      cancelLinkedInterviews: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
        'alertComponent',
        'interviewFormat',
      ]),
      interviewFormats() {
        return this.$store.state.interviewFormats.map(
          ({ value, text }) => ({ value, text: `${text.charAt(0).toUpperCase()}${text.slice(1)}` }));
      },
      times() {
        const startHour = 8;
        const endHour = 20;
        const times = Array
          .from({ length: (endHour - startHour) + 1 }, (x, i) => `0${i + startHour}`.slice(-2))
          .map(hour => ['00', '30'].map(minutes => `${hour}:${minutes}`));
        return [].concat(...times); // flatten times
      },
      ...mapState([
        'getInterviewStatusColor',
        'getInterviewParticipationStatusColor',
      ]),
      startAtMoment() {
        return moment(this.interview.startAt);
      },
      startAtDate: {
        get() {
          return this.startAtMoment.format(this.datePickerDateFormat);
        },
        set(value) {
          this.interview.startAt = moment(value).set({
            hour: this.startAtMoment.get('hour'),
            minute: this.startAtMoment.get('minute'),
          }).format();
          this.interview.endAt = moment(value).set({
            hour: this.endAtMoment.get('hour'),
            minute: this.endAtMoment.get('minute'),
          }).format();
        },
      },
      startAtTime: {
        get() {
          return this.startAtMoment.format('HH:mm');
        },
        set(value) {
          this.interview.startAt = moment(`${this.startAtDate} ${value}`).format();
          // since the add method mutates the original moment, we must make a copy
          this.interview.endAt = moment(this.interview.startAt).add(this.cachedDuration, 'minutes').format();
        },
      },
      endAtMoment() {
        return moment(this.interview.endAt);
      },
      duration: {
        get() {
          if (!this.cachedDuration) {
            this.cachedDuration = moment
              .duration(this.endAtMoment.diff(this.interview.startAt))
              .asMinutes();
          }
          return this.cachedDuration;
        },
        set(value) {
          this.cachedDuration = value;
          // since the add method mutates the original moment, we must make a copy
          this.interview.endAt = moment(this.startAtMoment).add(value, 'minutes').format();
        },
      },
      datePickerLabel() {
        return `Date (${this.startAtMoment.format('dddd LL')})`;
      },
      locationIcon() {
        switch (this.interview.format) {
          case 'PHONE':
            return 'phone';
          case 'VIDEO':
            return 'videocam';
          case 'IN_PERSON':
            return 'place';
          default:
            return 'not_listed_location';
        }
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'saveInterviewData',
        'showSnackbar',
      ]),
      getInterview(interviewId) {
        return this.api(`/interviews/${interviewId}?projection=admin`);
      },
      cancelInterview(interview, cancelledBy, cancelLinkedInterviews) {
        this.prepareForApiConsumption();
        this.api
          .post(`${interview._links.self.href}/cancel`, {
            cancelledBy,
            cancelLinkedInterviews,
          })
          .then(() => {
            this.cancellationDialog = false;
            this.showSnackbar(['Success', 'success']);
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .then(() => this.getInterview(this.id))
          .then((response) => {
            this.interview = response.data;
          })
          .catch(() => this.setErrorAfterApiConsumption())
          .finally(() => this.clearLoading());
      },
      saveInterview(interview) {
        this.prepareForApiConsumption();
        return this
          .saveInterviewData({ interview })
          .then(() => this.showSnackbar(['Success', 'success']))
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      return this
        .getInterview(this.id)
        .then((response) => {
          this.interview = response.data;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
