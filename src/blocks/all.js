import action_root from "./custom/action_root.js"

import io_controls_if from "./custom/io_controls_if.js"
import io_logic_compare from "./custom/io_logic_compare.js"
import logic_operation from "./common/logic_operation.js"
import logic_negate from "./common/logic_negate.js"
import logic_boolean from "./common/logic_boolean.js"
import logic_ternary from "./common/logic_ternary.js"

import math_number from "./common/math_number.js"
import math_arithmetic from "./common/math_arithmetic.js"

import text from "./common/text.js"
import text_multiline from "./common/text_multiline.js"

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

  // Logic
  io_controls_if,
  logic_ternary,
  io_logic_compare,
  logic_operation,
  logic_negate,
  logic_boolean,

  // Math
  math_number,
  math_arithmetic,

  // Text
  text,
  text_multiline,

  // Variables
  // variables_set,
  // variables_get,

  // Feeds
  feed_selector,

  // Actions
  // action_webhook,
  // action_email,
  // action_sms,
  action_publish,
  action_log,
}
