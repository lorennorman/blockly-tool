import Feeds from './feeds.js'
import Logic from './logic.js'
import Matchers from './matchers.js'
import Math from './math.js'
import Notifications from './notifications.js'
import PowerUps from './power_ups.js'
import Text from './text.js'
import Triggers from './triggers.js'
import Utility from './utility.js'
import Variables from './variables.js'
import Web from './web.js'

// specify toolbox categories in the order we wish them to appear
export default [
  Triggers,
  Matchers,
  { kind: 'sep' },
  Logic,
  Math,
  Text,
  Variables,
  Feeds,
  Notifications,
  Web,
  PowerUps,
  Utility
]
