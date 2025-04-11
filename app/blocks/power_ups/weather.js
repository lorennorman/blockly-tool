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
    prepareWeather: ({ block, observeData, data: { weatherLocationOptions } }) => {
      // populate weather locations
      if(!weatherLocationOptions.length) {
        weatherLocationOptions = [[ "No locations! Visit Power-Ups -> Weather", "" ]]
        block.setEnabled(false)

      } else if(weatherLocationOptions[0][1] != "") {
        weatherLocationOptions.unshift([ "Select Location", "" ])
      }

      block.replaceDropdownOptions("POWER_UP_ID", weatherLocationOptions)

      // skip the rest if we're in the toolbox
      if(block.isInFlyout) { return }

      // yield so fields can populate, flags can be set
      setTimeout(() => {
        // nope out for insertion markers
        if(block.isInsertionMarker()) { return }

        // auto-disable block, if necessary
        block.setEnabledByLocation()

        // react to incoming forecast data
        const unobserve = observeData('currentWeatherByLocation', (newData = {}) => {
          // if this block is disposed, clean up this listener
          if (block.isDisposed()) { unobserve(); return }
          // update the reference to the injected/updated extension data
          block.currentWeatherByLocation = newData
          // re-run the things that use the data
          block.refreshPropertyOptions({})
        })
      }, 1)
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
       // fake label so it can hold any data
       // gets replaced with a dropdown on load
      label: ""
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
        payload = { weather: {
            powerUpId, weatherTime, weatherProperty
        }}

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
