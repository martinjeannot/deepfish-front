<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <statistics-navigation></statistics-navigation>
    </v-flex>
    <v-flex xs10>
      <v-card>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs4>
              <v-menu ref="createdAtAfterMenu" v-model="createdAtAfterMenu" :close-on-content-click="false"
                      :nudge-right="40" :return-value.sync="createdAtAfter" lazy transition="scale-transition" offset-y
                      full-width min-width="290px">
                <template #activator="{ on }">
                  <v-text-field v-model="createdAtAfter" label="Created at after" prepend-icon="event" readonly
                                v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="createdAtAfter"
                               @input="$refs.createdAtAfterMenu.save(createdAtAfter); getStatistics()"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4>
              <v-menu ref="createdAtBeforeMenu" v-model="createdAtBeforeMenu" :close-on-content-click="false"
                      :nudge-right="40" :return-value.sync="createdAtBefore" lazy transition="scale-transition"
                      offset-y full-width min-width="290px">
                <template #activator="{ on }">
                  <v-text-field v-model="createdAtBefore" label="Created at before" prepend-icon="event" readonly
                                v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="createdAtBefore"
                               @input="$refs.createdAtBeforeMenu.save(createdAtBefore); getStatistics()"></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4 class="pl-3">
              <v-select :items="['day', 'week', 'month', 'year']" v-model="groupBy" label="Group by"
                        @change="getStatistics"></v-select>
            </v-flex>
            <v-flex xs12 v-if="loading">
              <v-flex xs12 class="text-xs-center">
                <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
              </v-flex>
            </v-flex>
            <v-flex xs12 v-else>
              <line-chart :data="chartData" :height="180"></line-chart>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions } from 'vuex';
  import StatisticsNavigation from './Navigation';

  export default {
    name: 'StatisticsOpportunities',
    components: { StatisticsNavigation },
    data: () => ({
      createdAtAfter: moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      createdAtAfterMenu: false,
      createdAtBefore: moment().format('YYYY-MM-DD'),
      createdAtBeforeMenu: false,
      groupBy: 'day',
      allOpportunitiesStatistics: null,
      talentPendingOpportunitiesStatistics: null,
      talentAcceptedOpportunitiesStatistics: null,
      talentDeclinedOpportunitiesStatistics: null,
      employerPendingOpportunitiesStatistics: null,
      employerAcceptedOpportunitiesStatistics: null,
      employerDeclinedOpportunitiesStatistics: null,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
      chartData() {
        return {
          labels: this.allOpportunitiesStatistics.map(point => point[0]),
          datasets: [
            {
              label: 'All opportunities',
              data: this.allOpportunitiesStatistics.map(point => point[1]),
              fill: false,
            },
            {
              label: 'Talent PENDING',
              data: this.talentPendingOpportunitiesStatistics.map(point => point[1]),
              borderColor: '#FFCC80',
              fill: false,
            },
            {
              label: 'Talent ACCEPTED',
              data: this.talentAcceptedOpportunitiesStatistics.map(point => point[1]),
              borderColor: '#A5D6A7',
              fill: false,
            },
            {
              label: 'Talent DECLINED',
              data: this.talentDeclinedOpportunitiesStatistics.map(point => point[1]),
              borderColor: '#EF9A9A',
              fill: false,
            },
            {
              label: 'Employer PENDING',
              data: this.employerPendingOpportunitiesStatistics.map(point => point[1]),
              borderColor: '#EF6C00',
              fill: false,
            },
            {
              label: 'Employer ACCEPTED',
              data: this.employerAcceptedOpportunitiesStatistics.map(point => point[1]),
              borderColor: '#2E7D32',
              fill: false,
            },
            {
              label: 'Employer DECLINED',
              data: this.employerDeclinedOpportunitiesStatistics.map(point => point[1]),
              borderColor: '#C62828',
              fill: false,
            },
          ],
        };
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
      getStatistics() {
        this.prepareForApiConsumption();
        const allOpportunitiesQuery = `created-at-after=${this.createdAtAfter}&created-at-before=${this.createdAtBefore}&group-by=${this.groupBy}`;
        const talentPendingOpportunitiesQuery = `created-at-after=${this.createdAtAfter}&created-at-before=${this.createdAtBefore}&group-by=${this.groupBy}&talent-status=PENDING`;
        const talentAcceptedOpportunitiesQuery = `created-at-after=${this.createdAtAfter}&created-at-before=${this.createdAtBefore}&group-by=${this.groupBy}&talent-status=ACCEPTED`;
        const talentDeclinedOpportunitiesQuery = `created-at-after=${this.createdAtAfter}&created-at-before=${this.createdAtBefore}&group-by=${this.groupBy}&talent-status=DECLINED`;
        const employerPendingOpportunitiesQuery = `created-at-after=${this.createdAtAfter}&created-at-before=${this.createdAtBefore}&group-by=${this.groupBy}&employer-status=PENDING`;
        const employerAcceptedOpportunitiesQuery = `created-at-after=${this.createdAtAfter}&created-at-before=${this.createdAtBefore}&group-by=${this.groupBy}&employer-status=ACCEPTED`;
        const employerDeclinedOpportunitiesQuery = `created-at-after=${this.createdAtAfter}&created-at-before=${this.createdAtBefore}&group-by=${this.groupBy}&employer-status=DECLINED`;
        return Promise
          .all([
            this.api(`/opportunities/statistics?${allOpportunitiesQuery}`),
            this.api(`/opportunities/statistics?${talentPendingOpportunitiesQuery}`),
            this.api(`/opportunities/statistics?${talentAcceptedOpportunitiesQuery}`),
            this.api(`/opportunities/statistics?${talentDeclinedOpportunitiesQuery}`),
            this.api(`/opportunities/statistics?${employerPendingOpportunitiesQuery}`),
            this.api(`/opportunities/statistics?${employerAcceptedOpportunitiesQuery}`),
            this.api(`/opportunities/statistics?${employerDeclinedOpportunitiesQuery}`),
          ])
          .then(([
                   allOpportunitiesResponse,
                   talentPendingOpportunitiesResponse,
                   talentAcceptedOpportunitiesResponse,
                   talentDeclinedOpportunitiesResponse,
                   employerPendingOpportunitiesResponse,
                   employerAcceptedOpportunitiesResponse,
                   employerDeclinedOpportunitiesResponse,
                 ]) => {
            this.allOpportunitiesStatistics = allOpportunitiesResponse.data;
            this.talentPendingOpportunitiesStatistics = talentPendingOpportunitiesResponse.data;
            this.talentAcceptedOpportunitiesStatistics = talentAcceptedOpportunitiesResponse.data;
            this.talentDeclinedOpportunitiesStatistics = talentDeclinedOpportunitiesResponse.data;
            this.employerPendingOpportunitiesStatistics = employerPendingOpportunitiesResponse.data;
            this.employerAcceptedOpportunitiesStatistics = employerAcceptedOpportunitiesResponse.data;
            this.employerDeclinedOpportunitiesStatistics = employerDeclinedOpportunitiesResponse.data;
          })
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.getStatistics();
    },
  };
</script>

<style scoped>

</style>
