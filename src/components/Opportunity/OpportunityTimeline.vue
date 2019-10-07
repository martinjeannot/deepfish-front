<template>
  <v-timeline>
    <v-timeline-item
      v-for="(event, i) in events"
      :key="i"
      :color="event.color"
      :icon="event.icon"
      fill-dot
    >
      <div slot="opposite">
        {{ event.date | formatDate('LLL') }}<br/>
        <span v-if="event.durationFromPreviousEvent" class="font-italic">
          {{ event.durationFromPreviousEvent }} later
        </span>
      </div>
      <v-card>
        <v-card-text v-html="event.text">
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
      events() {
        let events = [];
        // add all events in chronological order to ease sorting
        events.push({
          date: this.opportunity.createdAt,
          text: `Opportunity sent to ${this.opportunity.talent.firstName} ${this.opportunity.talent.lastName.toUpperCase()}`,
          color: this.getOpportunityStatusColor('PENDING'),
          icon: 'send',
        });
        if (this.opportunity.seenByTalentAt) {
          events.push({
            date: this.opportunity.seenByTalentAt,
            text: `Seen by ${this.opportunity.talent.firstName}`,
            color: 'primary',
            icon: 'done_all',
          });
        }
        if (this.opportunity.talentRespondedAt) {
          events.push({
            date: this.opportunity.talentRespondedAt,
            text: `${this.opportunity.talent.firstName} responded : ${this.opportunity.talentStatus}
            ${this.opportunity.talentDeclinationReason ? `<br/><span class="font-italic">${this.opportunity.talentDeclinationReason}</span>` : ''}`,
            color: this.getOpportunityStatusColor(this.opportunity.talentStatus),
            icon: this.getOpportunityStatusIcon(this.opportunity.talentStatus),
          });
        }
        if (this.opportunity.forwardedAt) {
          events.push({
            date: this.opportunity.forwardedAt,
            text: `${this.opportunity.talent.firstName} was sent to ${this.opportunity.company.name}`,
            color: this.getOpportunityStatusColor('PENDING'),
            icon: 'forward',
          });
        }
        if (this.opportunity.employerAcceptedAt) {
          events.push({
            date: this.opportunity.employerAcceptedAt,
            text: `${this.opportunity.company.name} ACCEPTED ${this.opportunity.talent.firstName}`,
            color: this.getOpportunityStatusColor('ACCEPTED'),
            icon: this.getOpportunityStatusIcon('ACCEPTED'),
          });
        }
        if (this.opportunity.employerDeclinedAt) {
          events.push({
            date: this.opportunity.employerDeclinedAt,
            text: `${this.opportunity.company.name} DECLINED ${this.opportunity.talent.firstName}
            ${this.opportunity.employerDeclinationReason ? `<br/><span class="font-italic">${this.opportunity.employerDeclinationReason}</span>` : ''}`,
            color: this.getOpportunityStatusColor('DECLINED'),
            icon: this.getOpportunityStatusIcon('DECLINED'),
          });
        }
        // sort events chronologically
        // eslint-disable-next-line no-nested-ternary
        events.sort((a, b) => ((a.date > b.date) ? 1 : (b.date > a.date) ? -1 : 0));
        events = events.map((event, i) => (i ? {
          ...event,
          durationFromPreviousEvent: moment(event.date).from(events[i - 1].date, true),
        } : event));
        return events;
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
