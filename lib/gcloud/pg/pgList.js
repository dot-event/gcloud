export async function pgList(options) {
  const { event, events, props } = options

  const { out } = await events.spawn([...props, "pgList"], {
    args: ["sql", "list", "--format=json"],
    command: "gcloud",
    json: true,
  })

  event.signal.returnValue = out
}
