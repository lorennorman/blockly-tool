const
  random = Math.random()*100000000, // busts the NodeJS file cache
  makeScheduleMutator = (await import(`../schedule_mutator.js?key=${random}`)).default

export default makeScheduleMutator(
  [ 'all_minutes', 'one_minute', 'every_minutes_between' ],
  'minute_settings',
  'all_minutes'
)
