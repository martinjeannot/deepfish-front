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
          <v-flex xs12 class="subheading grey--text text--darken-2">
            Please tell us why:
            <v-form v-model="valid" ref="form">
              <v-textarea v-model="deactivationReason" :rules="[rules.required]"></v-textarea>
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
    name: 'admin-talent-deactivation-dialog',
    props: ['value', 'talent'],
    data: () => ({
      rules,
      loading: false,
      valid: false,
      deactivationReason: '',
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
          const comment = `[${moment().format('ll')} - ${this.user.firstName}] talent désactivé => ${deactivationReason.trim()}`;
          talent.notes = `${talent.notes.trim()}\n\n${comment.trim()}`;
          return this
            .saveTalentData(talent)
            .then(() => {
              this.dialog = false;
              this.deactivationReason = '';
              this.showSuccessSnackbar();
            })
            .catch(() => this.showSnackbar('Error'))
            .finally(() => this.clearLoading());
        }
        return Promise.resolve();
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
