<template>
  <v-select
    v-model="time"
    :items="dateTimes"
    :label="dateTime.format('dddd D MMMM YYYY')"
    :item-disabled="isItemDisabled"
  >
    <template #selection="{ item }">
      {{ item.format('HH:mm') }}
    </template>
    <template #item="{ item }">
      <v-flex
        v-if="unavailableSlots[item.format()]"
        xs12
        :class="['truncate', `${getUnavailabilityColor(unavailableSlots[item.format()])}--text`]"
      >
        {{ item.format('HH:mm') }}
        {{ getUnavailabilityMessage(unavailableSlots[item.format()]) }}
      </v-flex>
      <v-flex xs12 v-else>
        {{ item.format('HH:mm') }}
      </v-flex>
    </template>
  </v-select>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'EmployerInterviewTimeSelect',
    props: [
      'value',
      'dateTime',
      'unavailableSlots',
    ],
    data: () => ({
      startHour: 8,
      endHour: 20,
    }),
    computed: {
      ...mapGetters([
        'user',
      ]),
      // TODO refactor this value-tied property so that parent component use the selected
      // date time directly instead of recomputing a date time object
      time: {
        get() {
          return this.dateTimeMap[this.value];
        },
        set(value) {
          this.$emit('change', value.format('HH:mm'));
        },
      },
      dateTimes() {
        const dateTimes = Array
          .from({ length: (this.endHour - this.startHour) + 1 }, (x, i) => this.startHour + i)
          .map(hours => [0, 30].map(minutes => this.dateTime.clone().hours(hours).minutes(minutes)));
        return [].concat(...dateTimes); // flatten dateTimes
      },
      dateTimeMap() {
        return this.dateTimes.reduce((map, dateTime) => {
          // eslint-disable-next-line no-param-reassign
          map[dateTime.format('HH:mm')] = dateTime;
          return map;
        }, {});
      },
    },
    methods: {
      isItemDisabled(item) {
        return !!this.unavailableSlots[item.format()];
      },
      getUnavailabilityMessage(unavailableSlot) {
        if (this.user.id === unavailableSlot.employerId) {
          return unavailableSlot.talent;
        }
        return 'Talent indisponible';
      },
      getUnavailabilityColor(unavailableSlot) {
        if (this.user.id === unavailableSlot.employerId) {
          switch (unavailableSlot.status) {
            case 'TENTATIVE':
              return 'orange';
            case 'CONFIRMED':
              return 'red';
            default:
              return ''; // should cancel specific text-color class
          }
        }
        return 'red';
      },
    },
  };
</script>

<style scoped>
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
