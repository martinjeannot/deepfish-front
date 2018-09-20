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
                <v-text-field slot="activator" v-model="createdAtAfter" label="Created at after"
                  prepend-icon="event" readonly></v-text-field>
                <v-date-picker v-model="createdAtAfter" @input="$refs.createdAtAfterMenu.save(createdAtAfter); getStatistics()"></v-date-picker>
              </v-menu>
               <v-layout row wrap>
                <v-flex xs6>
                  <label>groupe A:</label>
                  <v-checkbox v-model="checkboxGroupA" @change="getStatistics"></v-checkbox>
                </v-flex>
                <v-flex xs6>
                  <label>groupe B:</label>
                  <v-checkbox v-model="checkboxGroupB" @change="getStatistics"></v-checkbox>
                </v-flex>
               </v-layout>
            </v-flex>
            <v-flex xs4>
              <v-menu ref="createdAtBeforeMenu" v-model="createdAtBeforeMenu" :close-on-content-click="false"
                :nudge-right="40" :return-value.sync="createdAtBefore" lazy transition="scale-transition"
                offset-y full-width min-width="290px">
                <v-text-field slot="activator" v-model="createdAtBefore" label="Created at before"
                  prepend-icon="event" readonly></v-text-field>
                <v-date-picker v-model="createdAtBefore" @input="$refs.createdAtBeforeMenu.save(createdAtBefore); getStatistics()"></v-date-picker>
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
  name: 'statistics-talent-acquisition',
  components: { StatisticsNavigation },
  data: () => ({
    createdAtAfter: moment()
      .subtract(1, 'months')
      .format('YYYY-MM-DD'),
    createdAtAfterMenu: false,
    createdAtBefore: moment().format('YYYY-MM-DD'),
    createdAtBeforeMenu: false,
    groupBy: 'day',
    Globalstatistics: null,
    filteredTalentStatistics: null,
    checkboxGroupA: false,
    checkboxGroupB: false,
  }),
  computed: {
    ...mapGetters(['api', 'loading', 'alertComponent']),
    chartData() {
      return {
        labels: this.Globalstatistics.map(point => point[0]),
        datasets: [
          {
            label: 'globalTalents',
            data: this.Globalstatistics.map(point => point[1]),
          },
          {
            label: 'Talent',
            data: this.filteredTalentStatistics.map(point => point[1]),
            borderColor: '#00ff00',
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
        this.api(
          `/talents/statistics?${globalquery}`),
        this.api(
        `/talents/statistics?${filteredQuery}`),
      ])
        .then((response) => {
          this.Globalstatistics = response[0].data;
          this.filteredTalentStatistics = response[1].data;
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
