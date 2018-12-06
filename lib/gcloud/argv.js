export async function argv({ events }) {
  await events.argv({
    alias: {
      cl: ["clusterList"],
      d: ["dry"],
    },
  })
}
