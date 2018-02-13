<template>
  <v-layout>
    <v-flex xs2 class="pa-2" style="padding-top: 12px!important;">
      <v-layout wrap class="elevation-1 pa-2" style="background-color: white">
        <div class="pt-1"></div>
        <v-flex xs12>
          <v-checkbox v-for="talentMaturityLevel in talentMaturityLevels"
                      :key="talentMaturityLevel.key"
                      :value="talentMaturityLevel.key"
                      :label="talentMaturityLevel.label"
                      v-model="talentMaturityLevelsCriterion"
          ></v-checkbox>
        </v-flex>
        <v-flex xs12 class="text-xs-right">
          <v-btn @click="search" fab small color="primary">
            <v-icon>search</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs10>
      <v-container fluid grid-list-md>
        <v-data-iterator content-tag="v-layout" row wrap :items="talents" :rows-per-page-items="rowsPerPageItems"
                         :pagination.sync="pagination">
          <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg3>
            <v-card>
              <v-card-title>
                <v-avatar size="50" class="mr-2">
                  <img :src="props.item.profile.pictureUrl" alt="picture"/>
                </v-avatar>
                <h4>{{ props.item.lastName.toUpperCase() }} {{ props.item.firstName }}</h4>
                <v-btn fab small color="primary" @click.native.stop="opportunityDialog = true">
                  <v-icon>send</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-tile>
                  <v-list-tile-content>Lorem:</v-list-tile-content>
                  <v-list-tile-content class="align-end">4/5</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Ipsum:</v-list-tile-content>
                  <v-list-tile-content class="align-end">3/5</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Dolor:</v-list-tile-content>
                  <v-list-tile-content class="align-end">4/5</v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </v-flex>
    <v-dialog v-model="opportunityDialog" max-width="40%">
      <v-container style="background-color: white">
        <v-layout>
          <v-flex xs12>
            SELECT REQUIREMENT
          </v-flex>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  const talentMaturityLevels = [
    { key: 'CLEAR_WATER', label: 'Clear water' },
    { key: 'OPEN_WATER', label: 'Open water' },
    { key: 'DEEP_WATER', label: 'Deep water' },
  ];

  export default {
    name: 'admin-search',
    data: () => ({
      talents: [],
      talentMaturityLevels,
      talentMaturityLevelsCriterion: [],
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4,
      },
      items: [
        {
          value: false,
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%',
        },
        {
          value: false,
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%',
        },
        {
          value: false,
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%',
        },
        {
          value: false,
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%',
        },
        {
          value: false,
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%',
        },
        {
          value: false,
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%',
        },
        {
          value: false,
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%',
        },
        {
          value: false,
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%',
        },
        {
          value: false,
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%',
        },
        {
          value: false,
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%',
        },
      ],
      opportunityDialog: false,
    }),
    computed: {
      ...mapGetters([
        'api',
        'loading',
      ]),
    },
    methods: {
      ...mapActions([
        'prepareForApiConsumption',
        'clearLoading',
      ]),
      search() {
        this.prepareForApiConsumption();
        // talentMaturityLevels
        let talentMaturityLevelsQueryString = '';
        if (this.talentMaturityLevelsCriterion.length) {
          this.talentMaturityLevelsCriterion.forEach((talentMaturityLevel, index) => {
            talentMaturityLevelsQueryString += index ? '&' : '';
            talentMaturityLevelsQueryString += `maturityLevel=${talentMaturityLevel}`;
          });
        }
        // API consumption
        this
          .api(`/talents?${talentMaturityLevelsQueryString}`)
          .then((response) => {
            this.talents = response.data._embedded.talents;
          })
          .finally(() => this.clearLoading());
      },
    },
  };
</script>

<style scoped>

</style>
