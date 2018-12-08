export async function configSync(options) {
  const { event, events, props } = options

  const pgList = await events.gcloudPgList(props)

  for (const pgInstance of pgList) {
    const { ipAddresses, name: pgId } = pgInstance

    const { ipAddress } = ipAddresses.find(
      ip => ip.type === "PRIVATE"
    )

    await events.gcloudConfigWrite(props, {
      ...event.options,
      ipAddress,
      pgId,
    })
  }
}
