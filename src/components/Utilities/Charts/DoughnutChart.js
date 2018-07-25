import { Doughnut } from 'vue-chartjs';

export default {
  name: 'doughnut-chart',
  extends: Doughnut,
  props: ['data', 'options'],
  mounted() {
    this.renderChart(this.data, this.options);
  },
};
