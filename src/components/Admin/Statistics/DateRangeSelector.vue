<template>
  <v-card>
    <v-card-text>
      <v-layout>
        <v-flex xs4 class="pr-2">
          <v-menu
            ref="startDateMenu"
            v-model="startDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="startDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template #activator="{ on }">
              <v-text-field
                v-model="startDate"
                label="From"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              @input="$refs.startDateMenu.save(startDate)"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs4 class="px-2">
          <v-menu
            ref="endDateMenu"
            v-model="endDateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="endDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            min-width="290px"
          >
            <template #activator="{ on }">
              <v-text-field
                v-model="endDate"
                label="To"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="endDate"
              @input="$refs.endDateMenu.save(endDate)"
            ></v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs4 class="pl-2">
          <v-select
            v-model="groupBy"
            :items="groupings"
            label="Group by"
          ></v-select>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'DateRangeSelector',
    props: [
      'startDate',
      'endDate',
      'groupBy',
    ],
    data: () => ({
      startDate: moment()
        .subtract(1, 'years')
        .format('YYYY-MM-DD'),
      startDateMenu: false,
      endDate: moment().format('YYYY-MM-DD'),
      endDateMenu: false,
      groupBy: 'day',
      groupings: ['day', 'week', 'month', 'year'],
    }),
  };
</script>

<style scoped>

</style>
