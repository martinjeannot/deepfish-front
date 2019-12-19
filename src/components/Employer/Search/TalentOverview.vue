<template>
  <v-card
    height="100%"
    @click="talentDialog = true"
  >
    <employer-talent
      v-if="talentDialog"
      :value.sync="talentDialog"
      :id="talent.id"
      @opportunity-sent="onOpportunitySent"
    ></employer-talent>
    <v-card-text
      class="h-100"
    >
      <v-layout wrap class="h-100">
        <v-flex xs4>
          <v-avatar size="50">
            <v-img
              alt="picture"
              lazy-src="/static/img/avatar.png"
              :src="profilePictureUrl"
            ></v-img>
          </v-avatar>
        </v-flex>
        <v-flex xs8>
          <v-layout wrap>
            <v-flex xs12>
              <span class="title">{{ talent.firstName }}</span>
            </v-flex>
            <v-flex xs12>
              <span v-if="talent.fullProfile && talent.fullProfile.jobs.length">
                <span class="body-2">{{ talent.fullProfile.jobs[0].jobTitle }}</span>
                chez
                {{ talent.fullProfile.jobs[0].companyName }}
              </span>
              <span v-else class="font-italic grey--text">Info non disponible</span>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs6>
          <div class="text-xs-center subheading grey--text text--darken-2">
            Salaire fixe
          </div>
          <div class="text-xs-center title">
            {{ baseSalary }} k€
          </div>
        </v-flex>
        <v-flex xs6>
          <div class="text-xs-center subheading grey--text text--darken-2">
            Expérience
          </div>
          <div class="text-xs-center title">
            {{ talent.yearsOfExperience }} ans
          </div>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapActions } from 'vuex';
  import EmployerTalent from '@/components/Employer/Talent/Talent';

  export default {
    name: 'EmployerSearchTalentOverview',
    components: {
      EmployerTalent,
    },
    props: {
      talent: Object,
    },
    data: () => ({
      talentDialog: false,
    }),
    computed: {
      profilePictureUrl() {
        if (this.talent.profilePictureUrl && !this.talent.profilePictureUrl.includes('media.licdn.com')) {
          return this.talent.profilePictureUrl;
        }
        return '/static/img/avatar.png';
      },
      baseSalary() {
        return Math.round(this.talent.baseSalary / 1000);
      },
    },
    methods: {
      ...mapActions([
        'showSnackbar',
      ]),
      onOpportunitySent(opportunity) {
        this.$emit('opportunity-sent', opportunity);
      },
    },
  };
</script>

<style scoped>
  .h-100 {
    height: 100%;
  }
</style>
