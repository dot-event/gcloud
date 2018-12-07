import { join } from "path"

// Packages
import deepmerge from "deepmerge"

// Helpers
export async function readConfig(options) {
  const { cwd, event, events, props } = options
  const { configPath, secretsPath } = paths(options)

  const baseConfig = await events.fsReadYaml(
    [...props, "baseConfig"],
    {
      path: join(cwd, configPath),
      save: true,
    }
  )

  const secretsConfig = await events.fsReadYaml(
    [...props, "secretsConfig"],
    {
      path: join(cwd, secretsPath),
      save: true,
    }
  )

  const config = secretsConfig
    ? deepmerge(baseConfig, secretsConfig)
    : baseConfig

  await events.set([...props, "config"], config)

  event.signal.returnValue = config
}

export async function writeSecret(options) {
  const { cwd, events, password, pgId, props } = options
  const { secretsPath } = paths(options)

  if (pgId && password) {
    await events.set(
      [
        ...options.props,
        "secretsConfig",
        "pg",
        pgId,
        "instances",
        "password",
      ],
      password
    )
  }

  const secretsConfig = await events.get([
    ...options.props,
    "secretsConfig",
  ])

  await events.fsWriteYaml(props, {
    path: join(cwd, secretsPath),
    yaml: secretsConfig,
  })
}

function paths({ events, props }) {
  const { operations } = events.get(props)
  const configPath = operations.gcloud.config

  const secretsPath =
    configPath.replace(/\.yaml$/, "") + "-secrets.yaml"

  return { configPath, secretsPath }
}
