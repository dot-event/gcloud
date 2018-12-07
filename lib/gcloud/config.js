import { join } from "path"

// Packages
import deepmerge from "deepmerge"

// Helpers
export async function readConfig(options) {
  const { cwd, event, events, props } = options
  const { operations } = events.get(props)

  const configPath = operations.gcloud.config

  const secretsPath =
    configPath.replace(/\.yaml$/, "") + "-secrets.yaml"

  const config = await events.fsReadYaml(props, {
    path: join(cwd, configPath),
  })

  const secrets = await events.fsReadYaml(props, {
    path: join(cwd, secretsPath),
  })

  const mergedConfig = secrets
    ? deepmerge(config, secrets)
    : config

  await events.set([...props, "config"], mergedConfig)

  event.signal.returnValue = mergedConfig
}
