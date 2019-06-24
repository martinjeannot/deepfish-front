<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    full-width
    max-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        :value="formattedDate"
        :label="label"
        prepend-icon="event"
        :rules="rules"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      :no-title="noTitle"
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
  import moment from 'moment';

  export default {
    name: 'DatePickerMenu',
    props: [
      'value',
      'label',
      'no-title',
      'rules',
    ],
    data: () => ({
      menu: false,
    }),
    computed: {
      date: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
      formattedDate() {
        return this.value ? moment(this.value).format('dddd LL') : '';
      },
    },
  };
</script>

<style scoped>

</style>
