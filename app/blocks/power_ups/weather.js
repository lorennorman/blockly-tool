const
  random = Math.random()*100000000, // busts the NodeJS file cache
  weatherMixin = (await import(`./weather_mixin.js?key=${random}`)).default

export default {
  type: "weather",

  toolbox: {
    label: "Retrieve current or forecast weather information for a pre-configured location."
  },

  visualization: {
    colour: 360,
    tooltip: "Current and forecast weather conditions"
  },

  mixins: [
    'replaceDropdownOptions',
    { weatherMixin }
  ],

  extensions: {
    populateWeatherLocations: ({ block, data: { weatherLocationOptions } }) => {
      if(!weatherLocationOptions.length) {
        weatherLocationOptions = [[ "No locations! Visit Power-Ups -> Weather", "" ]]
        block.setEnabled(false)

      } else if(weatherLocationOptions[0][1] != "") {
        weatherLocationOptions.unshift([ "Select Location", "" ])
      }

      block.replaceDropdownOptions("POWER_UP_ID", weatherLocationOptions)
    },

    requireWeatherLocationSelection: ({ block }) => {
      const
        locationField = block.getField('POWER_UP_ID'),
        // disable the block if the input is invalid or is an orphan
        locationValidator = function(powerUpId) {
          (powerUpId === "" || !block.getParent())
            ? block.setEnabled(false)
            : block.setEnabled(true)
        }

      // run whenever the input changes
      locationField.setValidator(locationValidator)

      // run after Blockly's disableOrphans listener fires
      block.setOnChange(function({ type, element, newValue, blockId }) {
        // verify it is this block being enabled
        if(blockId === block.id && type === "change" && element === "disabled" && newValue === false) {
          // potentially re-disables the block
          locationValidator(locationField.getValue())
        }
      })

      // run right now, on load, unless we're in the toolbox
      if(!block.isInFlyout) {
        locationValidator(locationField.getValue())
      }
    },

    weatherTimeChangesProperties: ({ block }) => {
      const weatherTimeField = block.getField('WEATHER_TIME')

      let hasRun = false
      // when the user selects a time option
      weatherTimeField.setValidator(function(weatherTimeKey) {
        // early out after first run if there's no change
        if(hasRun && this.getValue() === weatherTimeKey) { return }

        // call the mixin to get the new options
        const options = block.propertyOptionsForTime(weatherTimeKey)
        // update the property options and the property help
        block.replaceDropdownOptions("WEATHER_PROPERTY", options)
        block.updateHelpTextForWeatherProperty()

        hasRun = true
      })
    },

    weatherPropertyChangesHint: ({ block }) => {
      const weatherPropertyField = block.getField('WEATHER_PROPERTY')

      let hasRun = false
      // when the user selects a property option
      weatherPropertyField.setValidator(function(weatherPropertyKey) {
        // early out after first run if there's no change
        if(hasRun && this.getValue() === weatherPropertyKey) { return }

        block.updateHelpTextForWeatherProperty(weatherPropertyKey)

        hasRun = true
      })
    }
  },

  lines: [
    [ "Weather", "CENTER" ],

    [ "At:", {
      field: "POWER_UP_ID",
      options: [
        [ "Loading locations...", "" ],
      ]
    }],

    [ "When:", {
      field: "WEATHER_TIME",
      options: [
        [ "Now", "current" ],
        [ "In 5 minutes", "forecast_minutes_5" ],
        [ "In 30 minutes", "forecast_minutes_30" ],
        [ "This hour", "forecast_hours_0" ],
        [ "In 1 hour", "forecast_hours_1" ],
        [ "In 2 hours", "forecast_hours_2" ],
        [ "In 6 hours", "forecast_hours_6" ],
        [ "In 12 hours", "forecast_hours_12" ],
        [ "In 24 hours", "forecast_hours_24" ],
        [ "Today", "forecast_days_0" ],
        [ "Tomorrow", "forecast_days_1" ],
        [ "In 2 days", "forecast_days_2" ],
        [ "In 3 days", "forecast_days_3" ],
        [ "In 4 days", "forecast_days_4" ],
        [ "In 5 days", "forecast_days_5" ],
        [ "In 6 days", "forecast_days_6" ],
        [ "In 7 days", "forecast_days_7" ],
        [ "In 8 days", "forecast_days_8" ],
        [ "In 9 days", "forecast_days_9" ],
      ]
    }],

    [ "Metric:", {
      field: "WEATHER_PROPERTY",
      options: [
        [ "select", "cloudCover" ], // default to a real value to avoid a warning on block creation
      ]
    }],

    [ "", {
      field: "WEATHER_PROPERTY_HELP",
      label: ""
    }],
  ],

  generators: {
    json: block => {
      const
        powerUpId = parseInt(block.getFieldValue('POWER_UP_ID'), 10),
        weatherTime = block.getFieldValue('WEATHER_TIME'),
        weatherProperty = block.getFieldValue('WEATHER_PROPERTY'),
        payload = powerUpId
          ? { weather: {
                powerUpId, weatherTime, weatherProperty
            }}
          : null

      return [ JSON.stringify(payload), 0 ]
    }
  },

  regenerators: {
    json: blockObject => {
      const payload = blockObject.weather

      return {
        type: "weather",
        fields: {
          POWER_UP_ID: String(payload.powerUpId),
          WEATHER_TIME: payload.weatherTime,
          WEATHER_PROPERTY: payload.weatherProperty,
        }
      }
    }
  }
}
