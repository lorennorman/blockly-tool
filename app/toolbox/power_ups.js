export default {
  name: 'Power-Ups',
  colour: 360,

  callback: workspace => {
    const contents = [
      { kind: 'label', text: "Your Configured Power-Ups" },
      { kind: 'label', text: "Weather Locations:" },
    ]

    const weatherLocations = workspace.extensionData?.weatherLocations || []

    if(weatherLocations.length) {
      contents.push.apply(contents, weatherLocations.map(location => ({
        kind: 'block',
        type: 'weather',
        fields: {
          LAT: location.lat,
          LON: location.lon,
          POWER_UP_ID: location.powerUpId,
        }
      })))

    } else {
      contents.push({
        kind: 'label',
        text: "None. Visit Power-Ups: Weather and create some."
      })
    }

    return contents
  }
}
