// Packages
import dotArgv, { argvRelay } from "@dot-event/argv"
import dotLog from "@dot-event/log"
import dotSpawn from "@dot-event/spawn"
import dotStore from "@dot-event/store"

// Helpers
import { argv } from "./gcloud/argv"
import {
  clusterCreate,
  clusterList,
} from "./gcloud/cluster"
import { dbCreate, dbList } from "./gcloud/db"
import { pgCreate, pgList } from "./gcloud/pg"

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
    gcloudClusterCreate: clusterCreate,
    gcloudClusterList: clusterList,
    gcloudDbCreate: dbCreate,
    gcloudDbList: dbList,
    gcloudPgCreate: pgCreate,
    gcloudPgList: pgList,
    gcloudSetupOnce: argv,
  })

  return options
}
