import root_block from './custom/root_block.js'

import selector_feed from './custom/selector_feed.js'
import selector_comparison from './custom/selector_comparison.js'

import trigger_reactive from './custom/trigger_reactive.js'
import trigger_timer from './custom/trigger_timer.js'
import trigger_schedule from './custom/trigger_schedule.js'

import schedule_hourly from './custom/schedule/hourly.js'
import schedule_daily from './custom/schedule/daily.js'
import schedule_weekly from './custom/schedule/weekly.js'
import schedule_monthly from './custom/schedule/monthly.js'
import schedule_annually from './custom/schedule/annually.js'
import selector_minute from './custom/schedule/selector_minute.js'
import selector_time from './custom/schedule/selector_time.js'
import selector_day_of_week from './custom/schedule/selector_day_of_week.js'
import selector_day_of_month from './custom/schedule/selector_day_of_month.js'
import selector_month from './custom/schedule/selector_month.js'
import selector_months from './custom/schedule/selector_months.js'

import action_publish_to_feed from './custom/action_publish_to_feed.js'
import action_send_email from './custom/action_send_email.js'
import action_send_sms from './custom/action_send_sms.js'
import action_post_webhook from './custom/action_post_webhook.js'

import math_number from './common/math_number.js'
import text from './common/text.js'
import text_multiline from './common/text_multiline.js'
import logic_boolean from './common/logic_boolean.js'
import logic_null from './common/logic_null.js'


export default {
  // not in toolbox
  root_block,

  //// IO

  // Triggers
  trigger_reactive,
  // trigger_timer: { ...trigger_timer, json: toBlockJSON(trigger_timer) },
  trigger_timer,
  trigger_schedule,

  // Actions
  action_publish_to_feed,
  action_send_email,
  action_send_sms,
  action_post_webhook,

  // ---

  //// Tools

  // Feeds
  selector_feed,

  // Schedules
  schedule_hourly,
  schedule_daily,
  schedule_weekly,
  schedule_monthly,
  schedule_annually,
  // Schedule selectors
  selector_minute,
  selector_time,
  selector_day_of_week,
  selector_day_of_month,
  selector_month,
  selector_months,

  // Values
  math_number,
  text,
  text_multiline,
  logic_boolean,
  logic_null,

  // Comparisons
  selector_comparison,
}
