const
  random = Math.random()*100000000, // busts the NodeJS file cache
  makeScheduleMutator = (await import(`../schedule_mutator.js?key=${random}`)).default

export default makeScheduleMutator(
  [ 'all_hours', 'one_hour', 'every_hours_between' ],
  'hour_settings',
  'all_hours'
)
