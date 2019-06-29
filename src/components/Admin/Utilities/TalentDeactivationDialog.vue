<template>
  <v-dialog v-model="dialog" v-if="talent" max-width="600px">
    <v-card>
      <v-card-text>
        <v-card-title primary-title>
          <v-flex xs12 class="title">
            Deactivate {{ talent.firstName }} {{ talent.lastName }}?
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-flex xs12 class="subheading">
            Why?
            <v-form v-model="valid" ref="form">
              <v-textarea v-model="deactivationReason" label="Deactivation reason*"
                          :rules="[rules.required]"></v-textarea>
              <v-flex xs12>
                Do you want {{ talent.firstName }} to be
                <span class="font-weight-bold">reactivated later</span>?
              </v-flex>
              <v-menu
                v-model="reactivationMenu"
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
                    :value="formattedReactivatedOn"
                    label="Reactivated on (optional)"
                    prepend-icon="event"
                    readonly
                    clearable
                    @click:clear="clearReactivatedOn"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="talent.reactivatedOn"
                  @input="reactivationMenu = false"
                  :no-title="true"
                  :min="now.format()"
                ></v-date-picker>
              </v-menu>
            </v-form>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-flex xs12 class="text-xs-right">
            <v-btn flat color="primary" @click="dialog = false" :disabled="loading">cancel</v-btn>
            <v-btn color="error" @click="deactivateTalent(talent, deactivationReason)"
                   :disabled="!valid" :loading="loading">
              deactivate
            </v-btn>
          </v-flex>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import moment from 'moment';
  import { mapGetters, mapActions } from 'vuex';

  const rules = {
    required: value => !!value || 'This field is required',
  };

  export default {
    name: 'AdminTalentDeactivationDialog',
    props: ['value', 'talent'],
    data: () => ({
      rules,
      loading: false,
      valid: false,
      deactivationReason: '',
      reactivationMenu: false,
      now: moment(),
    }),
    computed: {
      ...mapGetters([
        'user',
      ]),
      dialog: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('update:value', value);
        },
      },
      formattedReactivatedOn() {
        return this.talent.reactivatedOn ? moment(this.talent.reactivatedOn).format('LL') : '';
      },
    },
    methods: {
      ...mapActions([
        'saveTalentData',
        'showSuccessSnackbar',
        'showSnackbar',
      ]),
      deactivateTalent(talent, deactivationReason) {
        if (this.$refs.form.validate()) {
          this.prepareForApiConsumption();
          talent.active = false;
          const comment = `[${moment().format('ll')} - ${this.user.firstName}] talent désactivé \
${this.talent.reactivatedOn ? `(reactivated on ${moment(this.talent.reactivatedOn).format('ll')}) ` : ''}\
=> ${deactivationReason.trim()}`;
          talent.notes = `${talent.notes.trim()}\n\n${comment.trim()}`;
          return this
            .saveTalentData(talent)
            .then(() => {
              this.dialog = false;
              this.deactivationReason = '';
              this.showSuccessSnackbar();
            })
            .catch(() => this.showSnackbar(['Error', 'error']))
            .finally(() => this.clearLoading());
        }
        return Promise.resolve();
      },
      clearReactivatedOn() {
        this.talent.reactivatedOn = null;
      },
      prepareForApiConsumption() {
        this.loading = true;
      },
      clearLoading() {
        this.loading = false;
      },
    },
  };
</script>

<style scoped>

</style>
