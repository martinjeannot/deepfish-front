<template>
  <v-autocomplete
    v-model="selectedCompanies"
    :cache-items="true"
    item-text="name"
    item-value="id"
    :items="companies"
    label="Companies"
    :loading="loading"
    :return-object="true"
    :search-input.sync="searchInput"
  ></v-autocomplete>
</template>

<script>
  import { debounce } from 'lodash';
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'CompaniesSelect',
    props: {
      value: Array,
      associationResourceUrl: String,
    },
    data: () => ({
      companies: [],
      searchInput: '',
      loading: false,
    }),
    computed: {
      ...mapGetters([
        'api',
      ]),
      selectedCompanies: {
        get() {
          return this.value.map(company => company.id);
        },
        set(selectedCompany) {
          let request;
          let tempSelectedCompanies;
          if (this.value.some(company => company.id === selectedCompany.id)) {
            // unbind existing association
            tempSelectedCompanies = this.value.filter(company => company.id !== selectedCompany.id);
            request = {
              method: 'put',
              url: this.associationResourceUrl,
              data: tempSelectedCompanies.map(company => `/companies/${company.id}`).join('\n'),
            };
          } else {
            // bind new association
            request = {
              method: 'post',
              url: this.associationResourceUrl,
              data: selectedCompany._links.self.href,
            };
            this.value.push(selectedCompany);
            tempSelectedCompanies = this.value;
          }
          request.headers = { 'Content-Type': 'text/uri-list' };
          this.prepareForApiConsumption();
          this
            .api(request)
            .then(() => {
              this.$emit('input', tempSelectedCompanies);
              this.showSnackbar(['OK', 'success']);
            })
            .catch(() => this.showSnackbar(['Error', 'error']))
            .finally(() => this.clearLoading());
        },
      },
    },
    watch: {
      searchInput(value) {
        if (value && value.length >= 2) {
          return this.debouncedSearchCompanies(value);
        }
        return null;
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      searchCompanies(searchInput) {
        this.prepareForApiConsumption();
        return this
          .api(`/companies/search/findByNameContainingAllIgnoreCase?name=${encodeURIComponent(searchInput)}`)
          .then((response) => {
            this.companies = response.data._embedded.companies;
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
      prepareForApiConsumption() {
        this.loading = true;
      },
      clearLoading() {
        this.loading = false;
      },
    },
    created() {
      this.debouncedSearchCompanies = debounce(this.searchCompanies, 600);
    },
  };
</script>

<style scoped>

</style>
