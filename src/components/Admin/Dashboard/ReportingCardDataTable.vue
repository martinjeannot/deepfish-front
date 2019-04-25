<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :hide-actions="true"
    :disable-initial-sort="true"
    class="elevation-1"
  >
    <template v-slot:items="props">
      <td>{{ props.item.text }}</td>
      <td class="text-xs-right">{{ props.item.value }}</td>
      <td
        :class="['text-xs-right', getTextColorClass(props.item.evolution)]"
      >
        {{ isNaN(props.item.evolution) ? props.item.evolution : Math.round(props.item.evolution * 100) / 100 + '%'}}
      </td>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: 'ReportingCardDataTable',
    props: [
      'headers',
      'items',
    ],
    methods: {
      getTextColorClass(evolution) {
        if (isNaN(evolution) || evolution === 0) {
          return '';
        }
        return `${evolution > 0 ? 'green' : 'red'}--text`;
      },
    },
  };
</script>

<style scoped>

</style>
