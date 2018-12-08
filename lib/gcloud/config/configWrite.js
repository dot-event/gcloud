import { join } from "path"

// Helpers
import { configPaths } from "./configPaths"

export async function configWrite(options) {
  const {
    cwd,
    event,
    events,
    ipAddress,
    password,
    pgId,
    props,
  } = options

  const { secretsPath } = configPaths(options)

  await events.gcloudConfigRead(props, event.options)

  if (pgId) {
    if (ipAddress) {
      await events.set(
        [
          ...props,
          "secretsConfig",
          "pg",
          pgId,
          "ipAddress",
        ],
        ipAddress
      )
    }

    if (password) {
      await events.set(
        [...props, "secretsConfig", "pg", pgId, "password"],
        password
      )
    }
  }

  const { secretsConfig } = await events.get(props)

  await events.fsWriteYaml(props, {
    path: join(cwd, secretsPath),
    yaml: secretsConfig,
  })

  await events.gcloudConfigRead(props, event.options)
}
