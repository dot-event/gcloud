// Packages
import dotArgv, { argvRelay } from "@dot-event/argv"
import dotLog from "@dot-event/log"
import dotSpawn from "@dot-event/spawn"
import dotStore from "@dot-event/store"

// Helpers
import { apply } from "./gcloud/apply"
import { argv } from "./gcloud/argv"
import {
  clusterCreate,
  clusterDelete,
  clusterList,
} from "./gcloud/cluster"
import { readConfig, writeSecret } from "./gcloud/config"
import { dbCreate, dbList } from "./gcloud/db"
import {
  pgCreate,
  pgCreateUser,
  pgDelete,
  pgList,
} from "./gcloud/pg"

// Composer
export default function(options) {
  const { events } = options

  if (events.ops.has("gcloud")) {
    return options
  }

  dotArgv({ events })
  dotLog({ events })
  dotSpawn({ events })
  dotStore({ events })

  events.onAny({
    gcloud: argvRelay,
    gcloudApply: apply,
    gcloudClusterCreate: clusterCreate,
    gcloudClusterDelete: clusterDelete,
    gcloudClusterList: clusterList,
    gcloudDbCreate: dbCreate,
    gcloudDbList: dbList,
    gcloudPgCreate: pgCreate,
    gcloudPgCreateUser: pgCreateUser,
    gcloudPgDelete: pgDelete,
    gcloudPgList: pgList,
    gcloudReadConfig: readConfig,
    gcloudSetupOnce: argv,
    gcloudWriteSecret: writeSecret,
  })

  return options
}
