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
      block.replaceDropdownOptions("POWER_UP_ID", weatherLocationOptions)
    },

    weatherTimeChangesProperties:  ({ block }) => {
      const weatherTimeField = block.getField('WEATHER_TIME')

      let hasRun = false
      // when the user selects a time option
      weatherTimeField.setValidator(function(weatherTimeKey) {
        // early out if there's no change
        if(hasRun && this.getValue() === weatherTimeKey) {
          return
        }
        // call the mixin to get the new options
        const options = block.propertyOptionsForTime(weatherTimeKey)
        // update the property options
        block.replaceDropdownOptions("WEATHER_PROPERTY", options)

        hasRun = true
      })
    }
  },

  lines: [
    [ "Weather", "CENTER" ],

    [ "At:", {
      field: "POWER_UP_ID",
      options: [
        [ "Loading locations...", ""],
      ]
    }],

    [ "When:", {
      field: "WEATHER_TIME",
      options: [
        [ "Now", "current"],
        [ "In 5 minutes", "forecast_minutes_5"],
        [ "In 30 minutes", "forecast_minutes_30"],
        [ "In 1 hour", "forecast_hours_1"],
        [ "In 2 hours", "forecast_hours_2"],
        [ "In 6 hours", "forecast_hours_6"],
        [ "In 12 hours", "forecast_hours_12"],
        [ "In 24 hours", "forecast_hours_24"],
        [ "Tomorrow", "forecast_days_1"],
        [ "Day after tomorrow", "forecast_days_2"],
        [ "5 days from now", "forecast_days_5"],
      ]
    }],

    [ "Metric:", {
      field: "WEATHER_PROPERTY",
      options: [
        [ "select", "cloudCover"], // default to a real value to avoid a warning on block creation
      ]
    }],
  ],

  generators: {
    json: block => {
      const
        powerUpId = parseInt(block.getFieldValue('POWER_UP_ID'), 10),
        weatherTime = block.getFieldValue('WEATHER_TIME'),
        weatherProperty = block.getFieldValue('WEATHER_PROPERTY'),
        payload = JSON.stringify({
          weather: {
            powerUpId, weatherTime, weatherProperty
          }
        })

      return [ payload, 0 ]
    }
  },

  regenerators: {
    json: blockObject => {
      const payload = blockObject.weather

      return {
        type: "weather",
        fields: {
          POWER_UP_ID: payload.powerUpId.toString(),
          WEATHER_TIME: payload.weatherTime,
          WEATHER_PROPERTY: payload.weatherProperty,
        }
      }
    }
  }
}
