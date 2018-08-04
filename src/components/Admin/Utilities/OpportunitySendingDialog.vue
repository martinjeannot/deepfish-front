<template>
  <v-dialog v-model="dialog" v-if="talent" max-width="40%">
    <v-container style="background-color: white">
      <v-form v-model="valid" @submit.prevent="sendOpportunity">
        <v-layout>
          <v-flex xs12>
            <v-layout>
              <v-flex xs10 style="margin: auto">
                <h2>Send an opportunity to {{ talent.firstName }}</h2>
              </v-flex>
              <v-flex xs2 class="text-xs-right">
                <v-btn type="submit" fab small color="success" :loading="loading"
                       :disabled="loading || !valid">
                  <v-icon>send</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-select label="Requirement" :items="requirements" v-model="selectedRequirement" :rules="[rules.required]">
              <template slot="selection" slot-scope="data">
                <div class="input-group__selections__comma">
                  {{ data.item.company.name }} - {{ data.item.name }}
                </div>
              </template>
              <template slot="item" slot-scope="data">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title><span style="font-weight: bold">{{ data.item.company.name }}</span>
                      : {{ data.item.name }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>{{ data.item.jobType.l10nKey }} {{ data.item.seniority.l10nKey
                      }} {{ data.item.fixedSalary / 1000 }}K€ {{ data.item.location }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-select>
            <v-textarea label="Opportunity pitch" v-model="pitch" rows="7" :rules="[rules.required]"></v-textarea>
          </v-flex>
        </v-layout>
      </v-form>
    </v-container>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'admin-opportunity-sending-dialog',
    props: ['value', 'requirements', 'talent'],
    data: () => ({
      rules,
      valid: false,
      selectedRequirement: null,
      pitch: '',
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
        'loading',
      ]),
      dialog: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('update:value', value);
        },
      },
    },
    watch: {
      selectedRequirement(requirement) {
        this.populatePitch(requirement);
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
      ]),
      sendOpportunity() {
        this.prepareForApiConsumption();
        this.api
          .post('/opportunities', this.newOpportunity())
          .then((/* response */) => {
            this.dialog = false;
            this.showSnackbar('Opportunity sent');
            this.$emit('opportunity-sent');
          })
          .catch((/* error */) => this.showSnackbar('Error'))
          .finally(() => this.clearLoading());
      },
      newOpportunity() {
        return {
          creator: this.user._links.self.href,
          talent: this.talent._links.self.href,
          requirement: this.selectedRequirement._links.self.href,
          pitch: this.pitch,
        };
      },
      populatePitch(requirement) {
        this.prepareForApiConsumption();
        this.pitch = '';
        this
          .api(`/opportunities?requirement=${requirement.id}&sort=createdAt,desc&size=1`)
          .then((response) => {
            if (response.data._embedded.opportunities.length) {
              this.pitch = response.data._embedded.opportunities[0].pitch;
            }
          })
          .catch(() => this.showSnackbar('Error'))
          .finally(() => this.clearLoading());
      },
    },
  };
</script>

<style scoped>

</style>
