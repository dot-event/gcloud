export async function argv({ events }) {
  await events.argv({
    alias: {
      a: ["apply"],
      cc: ["clusterCreate"],
      cl: ["clusterList"],
      cr: ["configRead"],
      cs: ["configSync"],
      cw: ["configWrite"],
      dc: ["dbCreate"],
      dl: ["dbList"],
      f: ["force"],
      oc: ["onlyCluster"],
      op: ["onlyPg"],
      pc: ["pgCreate"],
      pcu: ["pgCreateUser"],
      pl: ["pgList"],
      pul: ["pgUserList"],
    },
  })
}
