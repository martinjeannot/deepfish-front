<template>
  <div>
    <v-layout v-if="initialLoading">
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular indeterminate color="primary" :size="70"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout wrap v-else>
      <v-flex xs12>
        <span class="subheading">Mettez-vous en valeur en quelques mots</span>
      </v-flex>
      <v-form v-model="valid" ref="form" @submit.prevent="saveProfile" style="width: 100%">
        <v-flex xs12>
          <v-text-field v-model="talent.selfPitch" multi-line rows="9" :rules="[rules.maxLength]" :counter="1000"
                        :readonly="loading"></v-text-field>
        </v-flex>
        <v-flex xs12 class="text-xs-right">
          <v-btn type="submit" :disabled="!valid || loading">Valider</v-btn>
        </v-flex>
      </v-form>
    </v-layout>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  const rules = {
    maxLength: value => value.length < 1001 || 'Votre présentation est trop longue',
  };

  export default {
    name: 'conditions-self-pitch',
    data: () => ({
      initialLoading: false,
      loading: false,
      talent: null,
      valid: false,
      rules,
    }),
    computed: {
      ...mapGetters([
        'api',
        'user',
      ]),
    },
    methods: {
      prepareForApiConsumption(initialLoading = false) {
        this.initialLoading = initialLoading;
        this.loading = true;
      },
      clearLoading() {
        this.initialLoading = false;
        this.loading = false;
      },
      saveProfile() {
        this.prepareForApiConsumption();
        this.api
          .patch(this.user._links.talent.href, this.talent)
          .finally(() => this.clearLoading());
      },
    },
    created() {
      this.prepareForApiConsumption(true);
      this
        .api(this.user._links.talent.href)
        .then((response) => {
          this.talent = response.data;
        })
        .finally(() => this.clearLoading());
    },
  };
</script>

<style scoped>

</style>
