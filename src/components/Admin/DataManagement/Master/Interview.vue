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
                  <span class="font-weight-bold">
                    EMPLOYER
                  </span>
                  a proposé un entretien
                  <span class="font-weight-bold">
                    {{ getLabelFromInterviewFormat(interview.format) }}
                  </span>
                  à
                  <span class="font-weight-bold">
                    TALENT
                  </span>
                </v-flex>
                <v-flex xs6>
                  Interview status :
                  <span :class="[`${getInterviewStatusColor(interview.status)}--text`, 'font-weight-bold']">
                    {{ interview.status }}
                  </span>
                </v-flex>
                <v-flex xs6>
                  <v-icon>event</v-icon>
                  <span class="font-weight-bold">
                    {{ interview.startAt | formatDate('dddd') }}
                    {{ interview.startAt | formatDate('LL') }}
                  </span> à
                  <span class="font-weight-bold">{{ interview.startAt | formatDate('LT') }}</span>
                </v-flex>
                <v-flex xs6>
                  Employer response :
                  <span
                    :class="[`${getInterviewParticipationStatusColor(interview.employerResponseStatus)}--text`, 'font-weight-bold']"
                  >
                    {{ interview.employerResponseStatus }}
                  </span>
                </v-flex>
                <v-flex xs6>
                  <v-icon>timer</v-icon>
                  {{ getLabelFromInterviewDuration(getInterviewDuration(interview).asMinutes()) }}
                </v-flex>
                <v-flex xs6>
                  Talent response :
                  <span
                    :class="[`${getInterviewParticipationStatusColor(interview.talentResponseStatus)}--text`, 'font-weight-bold']"
                  >
                    {{ interview.talentResponseStatus }}
                  </span>
                </v-flex>
                <v-flex xs6 :class="{'white-space-pre-line': interview.format !== 'PHONE'}">
                  <v-icon v-if="interview.format === 'PHONE'">phone</v-icon>
                  <v-icon v-else-if="interview.format === 'VIDEO'">videocam</v-icon>
                  <v-icon v-else-if="interview.format === 'IN_PERSON'">place</v-icon>
                  {{ interview.location }}
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions, mapState } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  export default {
    name: 'data-management-interview',
    components: { DataManagementNavigation },
    props: ['id'],
    data: () => ({
      interview: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
        'initialLoading',
        'alertComponent',
      ]),
      ...mapState([
        'getInterviewStatusColor',
        'getInterviewParticipationStatusColor',
        'getLabelFromInterviewFormat',
        'getLabelFromInterviewDuration',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
      ]),
      getInterviewDuration(interview) {
        return moment.duration(moment(interview.endAt).diff(interview.startAt));
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this
        .api(`/interviews/${this.id}`)
        .then((response) => {
          this.interview = response.data;
        }).catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>

</style>
