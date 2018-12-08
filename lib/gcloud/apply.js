// Helpers
import { applyCluster } from "./apply/cluster"
import { applyPg } from "./apply/pg"

export async function apply(options) {
  const { event, events, props } = options

  await events.gcloudReadConfig(props, event.options)

  await applyCluster(options)
  await applyPg(options)
}
