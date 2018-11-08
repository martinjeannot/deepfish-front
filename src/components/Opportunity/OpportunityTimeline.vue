<template>
  <v-timeline>
    <v-timeline-item v-for="(item, i) in items" :key="i" :color="item.color" :icon="item.icon" fill-dot>
      <div slot="opposite">
        {{ item.date | formatDate('LLL') }}<br/>
        <span v-if="item.durationFromPreviousEvent" class="font-italic">
          {{ item.durationFromPreviousEvent }} later
        </span>
      </div>
      <v-card>
        <v-card-text v-html="item.text">
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  import moment from 'moment';
  import { mapState } from 'vuex';

  export default {
    name: 'OpportunityTimeline',
    props: ['opportunity'],
    data: () => ({}),
    computed: {
      ...mapState([
        'getOpportunityStatusColor',
      ]),
      items() {
        const items = [];
        items.push({
          date: this.opportunity.createdAt,
          text: `${this.opportunity.creator.firstName} sent this opportunity to ${this.opportunity.talent.firstName} ${this.opportunity.talent.lastName.toUpperCase()}`,
          color: this.getOpportunityStatusColor('PENDING'),
          icon: this.getOpportunityStatusIcon('PENDING'),
        });
        if (this.opportunity.talentRespondedAt) {
          items.push({
            date: this.opportunity.talentRespondedAt,
            text: `${this.opportunity.talent.firstName} responded : ${this.opportunity.talentStatus}
            ${this.opportunity.talentDeclinationReason ? `<br/><span class="font-italic">${this.opportunity.talentDeclinationReason}</span>` : ''}`,
            color: this.getOpportunityStatusColor(this.opportunity.talentStatus),
            icon: this.getOpportunityStatusIcon(this.opportunity.talentStatus),
            durationFromPreviousEvent: moment(this.opportunity.talentRespondedAt)
              .from(this.opportunity.createdAt, true),
          });
        }
        if (this.opportunity.forwardedAt) {
          items.push({
            date: this.opportunity.forwardedAt,
            text: `${this.opportunity.talent.firstName} was sent to ${this.opportunity.company.name}`,
            color: this.getOpportunityStatusColor('PENDING'),
            icon: this.getOpportunityStatusIcon('PENDING'),
            durationFromPreviousEvent: moment(this.opportunity.forwardedAt)
              .from(this.opportunity.talentRespondedAt, true),
          });
        }
        if (this.opportunity.employerRespondedAt) {
          items.push({
            date: this.opportunity.employerRespondedAt,
            text: `${this.opportunity.company.name} responded : ${this.opportunity.employerStatus}
            ${this.opportunity.employerDeclinationReason ? `<br/><span class="font-italic">${this.opportunity.employerDeclinationReason}</span>` : ''}`,
            color: this.getOpportunityStatusColor(this.opportunity.employerStatus),
            icon: this.getOpportunityStatusIcon(this.opportunity.employerStatus),
            durationFromPreviousEvent: moment(this.opportunity.employerRespondedAt)
              .from(this.opportunity.forwardedAt, true),
          });
        }
        return items;
      },
    },
    methods: {
      getOpportunityStatusIcon(opportunityStatus) {
        switch (opportunityStatus) {
          case 'ACCEPTED':
            return 'done';
          case 'PENDING':
            return 'hourglass_empty';
          case 'DECLINED':
            return 'clear';
          default:
            return null;
        }
      },
    },
  };
</script>

<style scoped>

</style>
