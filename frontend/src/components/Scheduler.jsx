import React from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import './Scheduler.css';

const Scheduler = () => {
  const eventData = [
    {
      Id: 1,
      Subject: 'Meeting',
      StartTime: new Date(2024, 1, 15, 10, 0),
      EndTime: new Date(2024, 1, 15, 12, 0),
    },
    {
      Id: 2,
      Subject: 'Conference',
      StartTime: new Date(2024, 1, 16, 9, 0),
      EndTime: new Date(2024, 1, 16, 11, 0),
    },
  ];

  return (
    <div className="scheduler">
      <h2>February 2024</h2>
      <ScheduleComponent
        height="550px"
        selectedDate={new Date(2024, 1, 15)}
        eventSettings={{ dataSource: eventData }}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </div>
  );
};

export default Scheduler;