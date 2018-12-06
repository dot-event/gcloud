export async function argv({ events }) {
  await events.argv({
    alias: {
      cc: ["clusterCreate"],
      cl: ["clusterList"],
      dc: ["dbCreate"],
      dl: ["dbList"],
      pc: ["pgCreate"],
      pl: ["pgList"],
    },
  })
}
