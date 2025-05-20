const
  random = Math.random()*100000000, // busts the NodeJS file cache
  makeScheduleMutator = (await import(`../schedule_mutator.js?key=${random}`)).default

export default makeScheduleMutator(
  [ 'all_days', 'one_day', 'days_of_week' ],
  'day_settings',
  'all_days'
)
