import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  state('*', style({
    bottom: '-17px',
    opacity: 1,
    position: 'absolute'
  })),
  transition(':enter', [
    style({ opacity: 0, bottom: '-28px' }),
    animate('300ms ease-in')
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0, bottom: '-28px' }))
  ])
]);
