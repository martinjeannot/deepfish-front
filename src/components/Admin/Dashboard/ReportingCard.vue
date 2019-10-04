<template>
  <v-card
    class="mt-4 mx-auto"
  >
    <v-sheet
      class="v-sheet--offset mx-auto"
      :color="color"
      elevation="12"
      max-width="calc(100% - 32px)"
    >
      <v-sparkline
        :value="trendLineValues"
        color="white"
        :padding="trendLinePadding"
        :auto-draw="true"
      ></v-sparkline>
      <v-flex
        xs12
        class="text-xs-center white--text"
        :style="{paddingBottom: trendLinePadding + 'px'}"
      >
        Montlhy statistics over the last year
      </v-flex>
    </v-sheet>

    <v-card-title>
      <v-icon
        large
        :color="color"
        class="pr-3"
      >
        {{ icon }}
      </v-icon>
      <div
        class="text-uppercase pr-2"
      >
        {{ title }}
      </div>
    </v-card-title>

    <v-card-text>
      <v-layout wrap>
        <v-flex
          xs12
          sm6
          :class="[{'pr-2': $vuetify.breakpoint.smAndUp}, {'pb-2': $vuetify.breakpoint.xsOnly}]"
        >
          <reporting-card-data-table
            :headers="weeklyDataTableHeaders"
            :items="weeklyDataTableItems"
          ></reporting-card-data-table>
        </v-flex>

        <v-flex
          xs12
          sm6
          :class="[{'pl-2': $vuetify.breakpoint.smAndUp}]"
        >
          <reporting-card-data-table
            :headers="monthlyDataTableHeaders"
            :items="monthlyDataTableItems"
          ></reporting-card-data-table>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import moment from 'moment';
  import ReportingCardDataTable from './ReportingCardDataTable';

  export default {
    name: 'ReportingCard',
    components: { ReportingCardDataTable },
    props: [
      'title',
      'icon',
      'color',
      'entityName',
      'weeklyStatistics',
      'monthlyStatistics',
    ],
    data: () => ({
      trendLinePadding: 8,
    }),
    computed: {
      trendLineValues() {
        const values = this.monthlyStatistics.map(point => point[1]);
        // last element = current week element (always at 0 at the beginning of the week)
        values.pop(); // improved morale
        return values;
      },
      weeklyDataTableHeaders() {
        return [
          { text: 'Week', value: 'text', sortable: false },
          { text: this.entityName, value: 'value', sortable: false },
          { text: 'Evolution (%)', value: 'evolution', sortable: false },
        ];
      },
      monthlyDataTableHeaders() {
        return [
          { text: 'Month', value: 'text', sortable: false },
          { text: this.entityName, value: 'value', sortable: false },
          { text: 'Evolution (%)', value: 'evolution', sortable: false },
        ];
      },
      weeklyDataTableItems() {
        return this.weeklyStatistics
          .slice(-5) // removing extra data + copy array before reversing it
          .reverse()
          .map((point, index, array) => ({
            text: index ? point[0] : 'Current week',
            value: point[1],
            evolution: index && index + 1 !== array.length ? this.computeEvolution(point[1], array[index + 1][1]) : 'N/A',
          }))
          .slice(0, -1);
      },
      monthlyDataTableItems() {
        return this.monthlyStatistics
          .slice(-5) // removing extra data + copy array before reversing it
          .reverse()
          .map((point, index, array) => ({
            text: index ? moment(point[0]).format('MMMM') : 'Current month',
            value: point[1],
            evolution: index && index + 1 !== array.length ? this.computeEvolution(point[1], array[index + 1][1]) : 'N/A',
          }))
          .slice(0, -1);
      },
    },
    methods: {
      computeEvolution(va, vd) {
        return vd ? ((va - vd) / vd) * 100 : 'N/A';
      },
    },
  };
</script>

<style scoped>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
</style>
