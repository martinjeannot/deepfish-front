<template>
  <v-layout>
    <v-flex xs2 class="pr-3">
      <data-management-navigation></data-management-navigation>
    </v-flex>
    <v-flex xs10>
      <v-layout v-if="initialLoading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
        </v-flex>
      </v-layout>
      <v-layout v-else>
        <v-flex xs12>
          <v-flex xs12 v-if="alertComponent">
            <base-alert :type="alertComponent.type" :message="alertComponent.message"
                        @dismissed="onAlertComponentDismissed"></base-alert>
          </v-flex>
          <v-layout v-if="company">
            <v-flex xs4 class="pr-3">
              <v-card>
                <v-card-text>
                  <v-flex xs12 class="text-xs-center mb-3">
                    <h2>{{ company.name }}</h2>
                  </v-flex>
                  <v-flex v-if="company.logoURL" xs12 class="text-xs-center mb-3">
                    <v-img :src="company.logoURL"></v-img>
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Registration</span> : {{
                    company.createdAt | formatDate('LLL') }}
                  </v-flex>
                  <v-flex xs12 class="mb-3">
                    <span style="font-weight: bold">Employers :</span>
                    <v-list>
                      <v-list-tile v-for="employer in company.employers" :key="employer.id">
                        <v-list-tile-content>
                          <router-link :to="{ name: 'AdminDMEmployer', params: {id: employer.id} }">
                            {{ employer.firstName }} {{ employer.lastName.toUpperCase() }}
                          </router-link>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs8>
              <v-card>
                <v-tabs grow>
                  <v-tab>Profile</v-tab>
                  <v-tab>Description</v-tab>
                  <v-tab>Images</v-tab>
                  <v-tab>Requirements</v-tab>
                  <v-tab-item>
                    <v-form v-model="companyProfileFormValid" @submit.prevent="saveCompany(company)">
                      <v-card-text>
                        <v-layout wrap>
                          <v-flex xs12 sm6 class="pr-2">
                            <v-text-field
                              v-model="company.name"
                              label="Company name"
                              placeholder="Deepfish"
                              :rules="[rules.required]"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pl-2">
                            <v-text-field
                              v-model="company.websiteUrl"
                              label="Website URL"
                              placeholder="https://www.deepfish.co/"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pr-2">
                            <v-text-field
                              v-model="company.size"
                              label="Size"
                              placeholder="2800 dont 50 commerciaux"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pl-2">
                            <v-text-field
                              v-model="company.headquartersAddress"
                              label="Headquarters address"
                              placeholder="42 Avenue des Champs-Élysées, 75008 Paris"
                              @change="resetCompanyHeadquartersGeocode(company)"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pr-2">
                            <v-text-field
                              v-model="company.foundedIn"
                              label="Year of founding"
                              placeholder="2018"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pl-2">
                            <v-text-field
                              v-model="company.revenue"
                              label="Revenue"
                              placeholder="7M€"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field
                              v-model="company.customerReferences"
                              label="Customer references"
                              placeholder="Orange, Canal+, Sephora, Hermes, TF1, Technip, Renault"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 class="py-2">
                            <h6 class="title">Social</h6>
                          </v-flex>
                          <v-flex xs12 sm6 class="pr-2">
                            <v-text-field
                              v-model="company.facebookUrl"
                              label="Facebook URL"
                              placeholder="https://www.facebook.com/Deepfish-183214365456134/"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pl-2">
                            <v-text-field
                              v-model="company.instagramUrl"
                              label="Instagram URL"
                              placeholder="https://www.instagram.com/deepfish.co/"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pr-2">
                            <v-text-field
                              v-model="company.linkedinUrl"
                              label="LinkedIn URL"
                              placeholder="https://www.linkedin.com/company/deepfish/"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pl-2">
                            <v-text-field
                              v-model="company.twitterUrl"
                              label="Twitter URL"
                              placeholder="https://twitter.com/deepfish_co"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 class="pr-2">
                            <v-text-field
                              v-model="company.youtubeUrl"
                              label="Youtube URL"
                              placeholder="https://www.youtube.com/channel/UCWj9LP1-EIH-Ie1gnQXkdvA"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 class="text-xs-right">
                            <v-btn type="submit" color="primary"
                                   :disabled="!companyProfileFormValid"
                                   :loading="loading"
                            >
                              Save
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-form>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card-text>
                      <v-textarea v-model="company.description"
                                  label="Description"
                                  rows="25"
                      ></v-textarea>
                      <div class="text-xs-right">
                        <v-btn
                          color="primary"
                          :loading="loading"
                          @click="saveCompany(company)"
                        >
                          Save
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-tab-item>
                  <v-tab-item>
                    <v-card-text>
                      <v-flex xs12>
                        <h6 class="title">Logo</h6>
                      </v-flex>
                      <v-flex xs12 class="pb-3">
                        <upload-zone
                          :id="'logo-dropzone'"
                          :uri="`/companies/${company.id}/upload-logo`"
                          :files="company.logoURL ? [{file: {}, url: company.logoURL}] : []"
                        ></upload-zone>
                      </v-flex>
                      <v-flex xs12>
                        <h6 class="title">Cover image</h6>
                      </v-flex>
                      <v-flex xs12 class="pb-3">
                        <upload-zone
                          :id="'cover-dropzone'"
                          :uri="`/companies/${company.id}/upload-cover`"
                          :files="company.coverImageUrl ? [{file: {}, url: company.coverImageUrl}] : []"
                        ></upload-zone>
                      </v-flex>
                      <v-flex xs12>
                        <h6 class="title">Top image</h6>
                      </v-flex>
                      <v-flex xs12 class="pb-3">
                        <upload-zone
                          :id="'top-dropzone'"
                          :uri="`/companies/${company.id}/upload-top`"
                          :files="company.topImageUrl ? [{file: {}, url: company.topImageUrl}] : []"
                        ></upload-zone>
                      </v-flex>
                      <v-flex xs12>
                        <h6 class="title">Bottom image</h6>
                      </v-flex>
                      <v-flex xs12>
                        <upload-zone
                          :id="'bottom-dropzone'"
                          :uri="`/companies/${company.id}/upload-bottom`"
                          :files="company.bottomImageUrl ? [{file: {}, url: company.bottomImageUrl}] : []"
                        ></upload-zone>
                      </v-flex>
                    </v-card-text>
                  </v-tab-item>
                  <v-tab-item>
                    <v-data-table :items="requirements" :headers="requirementHeaders">
                      <template slot="items" slot-scope="props">
                        <td>{{ props.item.createdAt | formatDate('LLL') }}</td>
                        <td>{{props.item.name}}</td>
                        <td class="justify-center layout">
                          <v-btn icon color="primary" :to="{ name: 'AdminDMRequirement', params: {id: props.item.id} }">
                            <v-icon>visibility</v-icon>
                          </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </v-tab-item>
                </v-tabs>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DataManagementNavigation from '../Navigation';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'DataManagementCompany',
    components: { DataManagementNavigation },
    props: ['id'],
    data: () => ({
      rules,
      company: null,
      companyProfileFormValid: false,
      requirements: null,
      requirementHeaders: [
        { text: 'Received at', value: 'createdAt' },
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'id', sortable: false },
      ],
    }),
    computed: {
      ...mapGetters([
        'api',
        'initialLoading',
        'loading',
        'alertComponent',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
        'showSuccessSnackbar',
        'setErrorAfterApiConsumption',
        'onAlertComponentDismissed',
        'saveCompanyData',
      ]),
      saveCompany(company) {
        this.prepareForApiConsumption();
        return this
          .saveCompanyData(company)
          .then(() => this.showSnackbar(['Success', 'success']))
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
      resetCompanyHeadquartersGeocode(company) {
        company.headquartersGeocode = null;
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      return Promise.all([
        this.api(`/companies/${this.id}?projection=default`),
        this.api(`/requirements?company=${this.id}`),
      ])
        .then(([companiesResponse, requirementsResponse]) => {
          this.company = companiesResponse.data;
          this.requirements = requirementsResponse.data._embedded.requirements;
          return this.api(this.company._links.employers.href);
        })
        .then((response) => {
          this.company.employers = response.data._embedded.employers;
        })
        .catch(() => this.setErrorAfterApiConsumption())
        .finally(() => this.clearLoading(true));
    },
  };
</script>

<style scoped>
</style>
