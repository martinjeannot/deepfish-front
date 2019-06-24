<template>
  <v-autocomplete
    v-model="talent"
    clearable
    :filter="fullNameFilter"
    :items="talents"
    label="Talent"
    :loading="loading"
    prepend-icon="people"
    return-object
    :rules="rules"
    :search-input.sync="searchInput"
  >
    <template #selection="{ item }">
      {{ item.firstName }} {{ item.lastName.toUpperCase() }}
    </template>
    <template #item="{ item }">
      <v-avatar class="mr-3">
        <v-img
          :src="item.profilePictureUrl"
          lazy-src="/static/img/avatar.png"
        ></v-img>
      </v-avatar>
      {{ item.firstName }} {{ item.lastName.toUpperCase() }}
    </template>
  </v-autocomplete>
</template>

<script>
  import { debounce } from 'lodash';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'TalentSelect',
    props: [
      'value',
      'rules',
    ],
    data: () => ({
      talents: [],
      searchInput: '',
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'api',
      ]),
      talent: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
    },
    watch: {
      searchInput(value) {
        if (value && value.length >= 3) {
          return this.debouncedSearchTalents(value);
        }
        return null;
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      searchTalents(searchInput) {
        this.loading = true;
        return this
          .api(`/talents/search/findByActiveTrueAndLastNameContainingOrActiveTrueAndFirstNameContainingAllIgnoreCase?lastName=${encodeURIComponent(searchInput)}&firstName=${encodeURIComponent(searchInput)}`)
          .then((response) => {
            this.talents = response.data._embedded.talents;
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => {
            this.loading = false;
          });
      },
      fullNameFilter(item, queryText/* , itemText */) {
        const lastName = item.lastName.toLocaleLowerCase();
        const firstName = item.firstName.toLocaleLowerCase();
        const lowerCaseQueryText = queryText.toLocaleLowerCase();
        return lastName.indexOf(lowerCaseQueryText) > -1
          || firstName.indexOf(lowerCaseQueryText) > -1;
      },
    },
    created() {
      this.debouncedSearchTalents = debounce(this.searchTalents, 600);
    },
  };
</script>

<style scoped>

</style>
