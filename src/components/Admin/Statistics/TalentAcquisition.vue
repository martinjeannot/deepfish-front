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
              <v-menu
                ref="createdAtAfterMenu"
                v-model="createdAtAfterMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="createdAtAfter"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template #activator="{ on }">
                  <v-text-field
                    v-model="createdAtAfter"
                    label="Created at after"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="createdAtAfter"
                  @input="$refs.createdAtAfterMenu.save(createdAtAfter); getStatistics()"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4>
              <v-menu
                ref="createdAtBeforeMenu"
                v-model="createdAtBeforeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="createdAtBefore"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template #activator="{ on }">
                  <v-text-field
                    v-model="createdAtBefore"
                    label="Created at before"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="createdAtBefore"
                  @input="$refs.createdAtBeforeMenu.save(createdAtBefore); getStatistics()"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs4 class="pl-3">
              <v-select
                :items="['day', 'week', 'month', 'year']"
                v-model="groupBy"
                label="Group by"
                @change="getStatistics"
              ></v-select>
            </v-flex>
            <v-flex xs12 v-if="loading">
              <v-flex xs12 class="text-xs-center">
                <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
              </v-flex>
            </v-flex>
            <v-flex xs12 v-else>
              <highcharts :options="chartOptions"></highcharts>
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
    name: 'TalentAcquisitionStatistics',
    components: { StatisticsNavigation },
    data: () => ({
      createdAtAfter: moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      createdAtAfterMenu: false,
      createdAtBefore: moment().format('YYYY-MM-DD'),
      createdAtBeforeMenu: false,
      groupBy: 'day',
      statistics: [],
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
      chartOptions() {
        return {
          title: {
            text: 'Talent acquisition',
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: {
            title: {
              text: 'Talents',
            },
          },
          series: [
            {
              name: 'Talents',
              data: this.statistics.map(point => [this.parseDate(point[0]), point[1]]),
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
        const query = `created-at-after=${this.createdAtAfter}&created-at-before=${this.createdAtBefore}&group-by=${this.groupBy}`;
        return Promise.all([
          this.api(`/talents/statistics?${query}`),
        ])
          .then(([
                   response,
                 ]) => {
            this.statistics = response.data;
          })
          .finally(() => this.clearLoading());
      },
      parseDate(dateString) {
        if (this.groupBy === 'week') {
          return moment()
            .startOf('isoWeek')
            .isoWeekYear(dateString.split('-')[0])
            .isoWeek(dateString.split('-')[1])
            .valueOf();
        }
        return Date.parse(dateString);
      },
    },
    created() {
      this.getStatistics();
    },
  };
</script>

<style scoped>
</style>
