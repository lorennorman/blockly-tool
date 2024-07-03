import action_root from "./custom/action_root.js"
import when_feeds_update from "./custom/when_feeds_update.js"
import when_feed_changes from "./custom/when_feed_changes.js"
import when_scheduled from "./custom/when_scheduled.js"

import hourly from "./custom/schedule/hourly.js"
import daily from "./custom/schedule/daily.js"
import weekly from "./custom/schedule/weekly.js"
import monthly from "./custom/schedule/monthly.js"
import annually from "./custom/schedule/annually.js"
import selector_time from "./custom/schedule/selector_time.js"
import selector_minute from "./custom/schedule/selector_minute.js"
import selector_hours from "./custom/schedule/selector_hours.js"
import selector_days from "./custom/schedule/selector_days.js"
import selector_day_of_week from "./custom/schedule/selector_day_of_week.js"
import selector_day_of_month from "./custom/schedule/selector_day_of_month.js"
import selector_month from "./custom/schedule/selector_month.js"
import selector_months from "./custom/schedule/selector_months.js"

import io_controls_if from "./custom/io_controls_if.js"
import io_logic_compare from "./custom/io_logic_compare.js"
import io_logic_operation from "./custom/io_logic_operation.js"
import io_logic_negate from "./custom/io_logic_negate.js"
import logic_boolean from "./common/logic_boolean.js"
// import io_logic_ternary from "./custom/io_logic_ternary.js"

import math_number from "./common/math_number.js"
import io_math_arithmetic from "./custom/io_math_arithmetic.js"

import text from "./common/text.js"
import text_multiline from "./common/text_multiline.js"
import io_text_join from "./custom/text_join.js"
import text_template from "./custom/text_template.js"
import text_compare from "./custom/text_compare.js"
import text_regex from "./custom/text_regex.js"

import variables_set from "./common/variables_set.js"
import variables_get from "./common/variables_get.js"

import feed_selector from "./custom/feed_selector.js"

import action_webhook from "./custom/action_webhook.js"
import action_email from "./custom/action_email.js"
import action_sms from "./custom/action_sms.js"
import action_publish from "./custom/action_publish.js"
import action_log from "./custom/action_log.js"



export default {
  // root block
  action_root,
  when_feed_changes,
  when_feeds_update,
  when_scheduled,

  schedule_hourly: hourly,
  schedule_daily: daily,
  // schedule_weekly: weekly,
  // schedule_monthly: monthly,
  // schedule_annually: annually,
  selector_time,
  selector_minute,
  selector_hours,
  selector_days,
  selector_day_of_week,
  selector_day_of_month,
  selector_month,
  selector_months,

  // Logic
  io_controls_if,
  // io_logic_ternary,
  io_logic_operation,
  io_logic_negate,
  logic_boolean,

  // Math
  math_number,
  io_logic_compare,
  io_math_arithmetic,

  // Text
  text,
  text_multiline,
  io_text_join,
  text_template,
  text_compare,
  // text_regex,

  // Variables
  variables_get,
  variables_set,

  // Feeds
  feed_selector,

  // Actions
  action_webhook,
  action_email,
  action_sms,
  action_publish,
  action_log,
}
