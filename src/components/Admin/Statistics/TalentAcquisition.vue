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
                      :nudge-right="40" :return-value.sync="createdAtAfter" lazy transition="scale-transition"
                      offset-y full-width min-width="290px">
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
            <v-flex xs2>
              <v-checkbox label="groupe A" v-model="checkboxGroupA" @change="getStatistics"
                          color="success"></v-checkbox>
            </v-flex>
            <v-flex xs2>
              <v-checkbox label="groupe B" v-model="checkboxGroupB" @change="getStatistics"
                          color="success"></v-checkbox>
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
    name: 'StatisticsTalentAcquisition',
    components: { StatisticsNavigation },
    data: () => ({
      createdAtAfter: moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      createdAtAfterMenu: false,
      createdAtBefore: moment().format('YYYY-MM-DD'),
      createdAtBeforeMenu: false,
      groupBy: 'day',
      globalStatistics: null,
      filteredTalentStatistics: null,
      checkboxGroupA: true,
      checkboxGroupB: true,
    }),
    computed: {
      ...mapGetters(['api', 'loading', 'alertComponent']),
      chartData() {
        return {
          labels: this.globalStatistics.map(point => point[0]),
          datasets: [
            {
              label: 'globalTalents',
              data: this.globalStatistics.map(point => point[1]),
            },
            {
              label: 'Talent',
              data: this.filteredTalentStatistics.map(point => point[1]),
              borderColor: '#00ff00',
              backgroundColor: 'rgba(123, 245, 36, 0.5)',
            },
          ],
        };
      },
    },
    methods: {
      ...mapActions(['prepareForApiConsumption', 'clearLoading']),
      getStatistics() {
        this.prepareForApiConsumption();
        const globalquery = `created-at-after=${this.createdAtAfter}
                          &created-at-before=${this.createdAtBefore}
                          &group-by=${this.groupBy}`;
        let filteredQuery = globalquery;
        if (this.checkboxGroupA) {
          filteredQuery += '&qualification-ranking=1';
        }
        if (this.checkboxGroupB) {
          filteredQuery += '&qualification-ranking=2';
        }
        return Promise.all([
          this.api(`/talents/statistics?${globalquery}`),
          this.api(`/talents/statistics?${filteredQuery}`),
        ])
          .then(([globalResponse, filteredResponse]) => {
            this.globalStatistics = globalResponse.data;
            this.filteredTalentStatistics = filteredResponse.data;
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
