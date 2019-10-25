<template>
  <v-layout>
    <v-flex xs4 class="pr-2">
      <v-menu
        ref="startDateMenu"
        v-model="startDateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template #activator="{ on }">
          <v-text-field
            v-model="startDateValue"
            label="From"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="startDateValue"
          @input="$refs.startDateMenu.save(startDateValue); $emit('change')"
        ></v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex xs4 class="px-2">
      <v-menu
        ref="endDateMenu"
        v-model="endDateMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
      >
        <template #activator="{ on }">
          <v-text-field
            v-model="endDateValue"
            label="To"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="endDateValue"
          @input="$refs.endDateMenu.save(endDateValue); $emit('change')"
        ></v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex xs4 class="pl-2">
      <v-select
        v-model="groupByValue"
        :items="groupings"
        label="Group by"
        @change="$emit('change')"
      ></v-select>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'DateRangeSelector',
    props: [
      'startDate',
      'endDate',
      'groupBy',
    ],
    data: () => ({
      startDateMenu: false,
      endDateMenu: false,
      groupings: ['day', 'week', 'month', 'year'],
    }),
    computed: {
      startDateValue: {
        get() {
          return this.startDate;
        },
        set(value) {
          this.$emit('update:start-date', value);
        },
      },
      endDateValue: {
        get() {
          return this.endDate;
        },
        set(value) {
          this.$emit('update:end-date', value);
        },
      },
      groupByValue: {
        get() {
          return this.groupBy;
        },
        set(value) {
          this.$emit('update:group-by', value);
        },
      },
    },
  };
</script>

<style scoped>

</style>
