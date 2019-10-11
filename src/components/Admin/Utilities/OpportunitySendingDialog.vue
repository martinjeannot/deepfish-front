<template>
  <div>
    <v-dialog v-model="dialog" v-if="talent" max-width="40%">
      <v-container style="background-color: white">
        <v-form v-model="valid" @submit.prevent="sendOpportunity(newOpportunity())">
          <v-layout>
            <v-flex xs12>
              <v-layout>
                <v-flex xs10 style="margin: auto">
                  <h2>Send an opportunity to {{ talent.firstName }}</h2>
                </v-flex>
                <v-flex xs2 class="text-xs-right">
                  <v-btn type="submit" fab small color="success" :loading="loading" :disabled="loading || !valid">
                    <v-icon>send</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <requirement-select
                v-model="selectedRequirement"
              ></requirement-select>
              <v-textarea label="Opportunity pitch" v-model="pitch" rows="7" :rules="[rules.required]"></v-textarea>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-dialog>
    <v-dialog v-model="confirmationDialog" v-if="talent" max-width="40%">
      <v-container style="background-color: white">
        <v-layout>
          <v-flex xs12 class="text-xs-center">
            <h2>A similar opportunity has already been sent !</h2>
            <h3>(same talent, same requirement)</h3>
            <v-btn color="error" class="mt-4" @click="confirmOpportunitySending(newOpportunity())">
              confirm the sending
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import RequirementSelect from './RequirementSelect';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'AdminOpportunitySendingDialog',
    components: {
      RequirementSelect,
    },
    props: ['value', 'talent'],
    data: () => ({
      rules,
      requirements: [],
      valid: false,
      selectedRequirement: null,
      pitch: '',
      requirementsSearchInput: null,
      confirmationDialog: false,
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
        if (requirement) { // clearable property
          this.populatePitch(requirement);
        } else {
          this.selectedRequirement = null;
          this.pitch = '';
        }
      },
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
        'showSnackbar',
        'setSnackbar',
      ]),
      sendOpportunity(opportunity) {
        this.prepareForApiConsumption();
        return this
          .api(`/opportunities?talent=${opportunity.talentId}&requirement=${opportunity.requirementId}`)
          .then((response) => {
            if (response.data.page.totalElements) {
              this.confirmationDialog = true;
              return Promise.resolve();
            }
            return this.confirmOpportunitySending(opportunity);
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
      confirmOpportunitySending(opportunity) {
        this.prepareForApiConsumption();
        return this.api
          .post('/opportunities', opportunity)
          .then((response) => {
            this.dialog = false;
            this.confirmationDialog = false;
            this.setSnackbar({
              show: true,
              text: 'Opportunity sent',
              color: 'success',
              button: {
                color: 'black',
                target: '_blank',
                text: 'show',
                to: { name: 'AdminDMOpportunityView', params: { id: response.data.id } },
              },
            });
            this.$emit('opportunity-sent');
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
      newOpportunity() {
        return {
          creator: this.user._links.self.href,
          talent: this.talent._links.self.href,
          talentId: this.talent.id,
          requirement: this.selectedRequirement._links.self.href,
          requirementId: this.selectedRequirement.id,
          pitch: this.pitch,
        };
      },
      populatePitch(requirement) {
        this.prepareForApiConsumption();
        this.pitch = '';
        this.api(`/opportunities?requirement=${requirement.id}&sort=createdAt,desc&size=1`)
          .then((response) => {
            if (response.data._embedded.opportunities.length) {
              this.pitch = response.data._embedded.opportunities[0].pitch;
            }
          })
          .catch(() => this.showSnackbar(['Error', 'error']))
          .finally(() => this.clearLoading());
      },
    },
  };
</script>

<style scoped>
</style>
