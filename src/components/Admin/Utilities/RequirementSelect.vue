<template>
  <!-- FIXME : vuetify autocomplete's item-text filter prevent us from searching through company name OR requirement name -->
  <!-- FIXME solution : use a custom filer function -->
  <!-- See https://github.com/vuetifyjs/vuetify/issues/4497 for potential fix -->
  <v-autocomplete
    v-model="requirement"
    clearable
    hide-details
    item-text="company.name"
    item-value="id"
    :items="requirements"
    label="Requirement"
    :loading="loading"
    prepend-icon="work"
    return-object
    :search-input.sync="searchInput"
  >
    <template #selection="{ item }">
      <div class="input-group__selections__comma">
        {{ item.company.name }} - {{ item.name }}
      </div>
    </template>
    <template #item="{ item }">
      <v-list-tile-content>
        <v-list-tile-title>
          <span style="font-weight: bold">{{ item.company.name }}</span> : {{ item.name }}
        </v-list-tile-title>
      </v-list-tile-content>
    </template>
  </v-autocomplete>
</template>

<script>
  import { debounce } from 'lodash';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'RequirementSelect',
    props: [
      'value',
    ],
    data: () => ({
      requirements: [],
      searchInput: '',
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'api',
      ]),
      requirement: {
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
        if (value && value.length >= 2) {
          return this.debouncedSearchRequirements(value);
        }
        return null;
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      searchRequirements(searchInput) {
        this.loading = true;
        return this
          .api(`/requirements/search/findByStatusAndCompanyNameContainingIgnoreCaseOrderByCompanyNameAsc?projection=default&status=OPEN&companyName=${encodeURIComponent(searchInput)}`)
          .then((response) => {
            this.requirements = response.data._embedded.requirements;
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => {
            this.loading = false;
          });
      },
    },
    created() {
      this.debouncedSearchRequirements = debounce(this.searchRequirements, 600);
    },
  };
</script>

<style scoped>

</style>
