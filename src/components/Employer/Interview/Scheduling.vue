<template>
  <v-layout v-if="initialLoading">
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
    </v-flex>
  </v-layout>
  <v-layout v-else row wrap>
    <v-flex v-if="alertComponent" xs12 sm8 offset-sm2>
      <base-alert :type="alertComponent.type" :message="alertComponent.message"
                  @dismissed="onAlertComponentDismissed"></base-alert>
    </v-flex>
    <v-flex xs12 class="text-xs-center">
      <h4 class="display-1">Planifier un entretien</h4>
      <h6 class="title pt-2">avec</h6>
      <v-flex xs12 class="d-inline-flex">
        <v-avatar size="80">
          <v-img
            :src="talent.profilePictureUrl"
            lazy-src="static/img/avatar.png"
            alt="picture"
          ></v-img>
        </v-avatar>
        <h5 class="headline align-self-center pl-3">{{ talent.firstName }} {{ talent.lastName[0] }}.</h5>
      </v-flex>
    </v-flex>
    <v-flex xs12 sm9 md8 offset-md2 :class="['pt-3', {'offset-sm1-5': $vuetify.breakpoint.smOnly}]">
      <v-card>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm4 :class="{'px-2': $vuetify.breakpoint.smAndUp}">
              <v-select :items="interviewFormats" v-model="format" label="Type"></v-select>
            </v-flex>
            <v-flex xs12 sm4 :class="{'px-2': $vuetify.breakpoint.smAndUp}">
              <v-select :items="interviewDurations" v-model="duration" label="Durée"></v-select>
            </v-flex>
            <v-flex xs12 sm4 :class="{'px-2': $vuetify.breakpoint.smAndUp}">
              <v-text-field
                v-if="format === 'PHONE'"
                v-model="location"
                label="N° de téléphone"
              ></v-text-field>
              <v-textarea
                v-else
                v-model="location"
                label="Lieu"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 class="text-xs-center">
              <h6 class="title">Veuillez choisir 3 créneaux à proposer au talent</h6>
            </v-flex>
            <v-flex xs12 class="text-xs-center my-3">
              <v-date-picker v-model="selectedDates" multiple
                             :min="min.format(datePickerDateFormat)"></v-date-picker>
            </v-flex>
            <v-flex xs12 sm4 v-for="(slotNumber, slotIndex) in numberOfSlots" :key="'slot-' + slotNumber"
                    :class="[{'py-1': $vuetify.breakpoint.xsOnly}, {'px-2': $vuetify.breakpoint.smAndUp}]">
              <v-select
                v-if="slotIndex < selectedDateTimes.length"
                :items="times"
                :value="selectedTimes[slotIndex]"
                @change="onSelectedTimesChange(slotIndex, $event)"
                :label="selectedDateTimes[slotIndex].format('dddd D MMMM YYYY')"
              ></v-select>
              <v-flex v-else xs12 class="text-xs-center v-text-field placeholder">
                Créneau(x) restant(s) à choisir : {{ numberOfSlots - selectedDateTimes.length }}
              </v-flex>
            </v-flex>
            <v-flex xs12 class="text-xs-center pt-3">
              <v-btn
                color="primary"
                @click.stop="confirmationDialog = true"
                :disabled="selectedDateTimes.length < numberOfSlots"
              >
                proposer ces créneaux
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="confirmationDialog" max-width="700px">
      <v-card>
        <v-card-text>
          <v-layout row wrap class="text-xs-center">
            <v-flex xs12 class="pb-2">
              Vous souhaitez proposer au talent un entretien
              <span class="font-weight-bold">{{ interviewFormat(format).text }}</span>
              d'environ
              <span class="font-weight-bold">{{ getLabelFromInterviewDuration(duration) }}</span>
              sur les créneaux suivants :
            </v-flex>
            <v-flex xs12 class="py-2"
                    v-for="selectedDateTime in sortedSelectedDateTimes"
                    :key="'selectedDateTime-' + selectedDateTime">
              {{ selectedDateTime.format('dddd D MMMM YYYY [à] HH:mm') }}
            </v-flex>
            <v-flex xs12 class="font-italic py-3">
              Vous serez notifié dès que {{ talent.firstName }} acceptera l'un d'entre eux.
            </v-flex>
            <v-flex xs6>
              <v-btn flat color="primary" @click="confirmationDialog = false" :disabled="loading">annuler</v-btn>
            </v-flex>
            <v-flex xs6>
              <v-btn color="primary" @click="scheduleInterviews" :loading="loading">confirmer</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions, mapState } from 'vuex';

  const interviewDurations = [
    { text: '30 min', value: 30 },
    { text: '1h', value: 60 },
    { text: '1h30', value: 90 },
  ];

  export default {
    name: 'employer-interview-scheduling',
    props: ['talentId', 'opportunityId'],
    data: () => ({
      talent: null,
      interviewDurations,
      duration: 30,
      format: 'PHONE',
      location: '',
      numberOfSlots: 3,
      min: moment().add('1', 'days'),
      selectedDateTimes: [],
      datePickerDateFormat: 'YYYY-MM-DD',
      confirmationDialog: false,
    }),
    computed: {
      ...mapGetters([
        'user',
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
        'interviewFormat',
      ]),
      ...mapState([
        'getLabelFromInterviewDuration',
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
      selectedDates: {
        get() {
          return this.selectedDateTimes
            .map(selectedDateTime => selectedDateTime.format(this.datePickerDateFormat));
        },
        set(selectedDates) {
          if (selectedDates.length <= this.numberOfSlots) {
            if (selectedDates.length > this.selectedDateTimes.length) {
              // add new selected date (starts at 18:00)
              this.selectedDateTimes.push(moment(`${selectedDates[selectedDates.length - 1]}T18`));
            } else {
              // remove existing selected date
              this.selectedDateTimes = this.selectedDateTimes
                .filter(selectedDateTime => selectedDates
                  .includes(selectedDateTime.format(this.datePickerDateFormat)));
            }
          } else {
            // error : too many slots
          }
        },
      },
      selectedTimes() {
        return this.selectedDateTimes.map(selectedDateTime => selectedDateTime.format('HH:mm'));
      },
      sortedSelectedDateTimes() {
        return [...this.selectedDateTimes]
          .sort((firstDateTime, secondDateTime) => firstDateTime.diff(secondDateTime));
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'showSnackbar',
      ]),
      scheduleInterviews() {
        this.prepareForApiConsumption();
        const interviews = this.selectedDateTimes
          .map(selectedDateTime => this.newInterview(selectedDateTime));
        this.api
          .post('/interviews/list', { resources: interviews })
          .then(() => {
            this.showSnackbar(['Opération terminée avec succès', 'success']);
            this.$router.push({ name: 'EmployerTalents' });
          })
          .catch(() => this.showSnackbar(['Erreur', 'error']))
          .finally(() => this.clearLoading());
      },
      newInterview(startAt) {
        return {
          creatorId: this.user.id,
          opportunity: `/${this.opportunityId}`,
          location: this.location,
          startAt: startAt.format(),
          endAt: moment(startAt).add(this.duration, 'minutes').format(),
          format: this.format,
          talent: `/${this.talentId}`,
          employer: this.user._links.self.href,
        };
      },
      onSelectedTimesChange(slotIndex, value) {
        this.$set(this.selectedDateTimes, slotIndex, moment(`${this.selectedDates[slotIndex]} ${value}`));
      },
    },
    created() {
      this.location = this.user.phoneNumber;
      this.prepareForApiConsumption(true);
      this.api(`/talents/${this.talentId}?projection=employer`)
        .then((talentResponse) => {
          this.talent = talentResponse.data;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
  .offset-sm1-5 {
    margin-left: 12.5%;
  }

  .placeholder {
    height: 64px;
    border: solid #1976D2;
    border-radius: 1em;
    padding-top: 14px;
  }
</style>
