export async function disksList({ event, events, props }) {
  const { out } = await events.spawn(
    [...props, "disksList"],
    {
      args: ["compute", "disks", "list", "--format=json"],
      command: "gcloud",
      json: true,
    }
  )

  event.signal.returnValue = out
}
