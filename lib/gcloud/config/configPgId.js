export function configPgId(options) {
  const { cluster, event, pg, service } = options

  event.signal.returnValue = Object.keys(pg).find(pgId => {
    const baseId = pgId.replace(/-[^-]+$/, "")

    const clusterMatch =
      baseId.slice(0, cluster.length) === cluster

    if (!clusterMatch) {
      return
    }

    const hasDb = pg[pgId].dbs.indexOf(service) > -1

    if (baseId === cluster && hasDb) {
      return true
    }

    const serviceId = baseId.match(/-([^-])$/)

    if (serviceId && hasDb) {
      return service === serviceId[1]
    }
  })
}