export function configPgId(options) {
  const { cluster, event, pg, service } = options

  event.signal.returnValue = Object.keys(pg).find(pgId => {
    const baseId = pgId.match(/^[^-]+/)[0]

    const clusterMatch =
      baseId.slice(0, cluster.length) === cluster

    if (!clusterMatch) {
      return
    }

    const hasDb =
      !service || pg[pgId].dbs.indexOf(service) > -1

    if (baseId === cluster && hasDb) {
      return true
    }
  })
}
