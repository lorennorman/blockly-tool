import root_block from './custom/root_block.js'
import selector_feed from './custom/selector_feed.js'
import trigger_reactive from './custom/trigger_reactive.js'
import selector_comparison from './custom/selector_comparison.js'
import action_publish_to_feed from './custom/action_publish_to_feed.js'
import action_send_email from './custom/action_send_email.js'

import math_number from './common/math_number.js'
import text from './common/text.js'
import text_multiline from './common/text_multiline.js'
import logic_boolean from './common/logic_boolean.js'
import logic_null from './common/logic_null.js'

export default {
    // not in toolbox
    root_block,

    //// IO

    // Feeds
    selector_feed,

    // Triggers
    trigger_reactive,

    // Actions
    action_publish_to_feed,
    action_send_email,

    // ---

    //// Tools

    // Values
    math_number,
    text,
    text_multiline,
    logic_boolean,
    logic_null,

    // Comparisons
    selector_comparison,
}