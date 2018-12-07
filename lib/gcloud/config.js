// Packages
import { join } from "path"

// Helpers
export async function readConfig(options) {
  const { cwd, event, events, props } = options
  const { operations } = events.get(props)

  event.signal.returnValue = await events.fsReadYaml(
    [...props, "config"],
    {
      path: join(cwd, operations.gcloud.clusters),
      save: true,
    }
  )
}
