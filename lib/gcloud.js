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

import { configRead } from "./gcloud/config/configRead"
import { configSync } from "./gcloud/config/configSync"
import { configWrite } from "./gcloud/config/configWrite"
import { dbCreate, dbList } from "./gcloud/db"
import { pgCreate } from "./gcloud/pg/pgCreate"
import { pgCreateUser } from "./gcloud/pg/pgCreateUser"
import { pgDelete } from "./gcloud/pg/pgDelete"
import { pgList } from "./gcloud/pg/pgList"
import { pgUserList } from "./gcloud/pg/pgUserList"

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
    gcloudConfigRead: configRead,
    gcloudConfigSync: configSync,
    gcloudConfigWrite: configWrite,
    gcloudDbCreate: dbCreate,
    gcloudDbList: dbList,
    gcloudPgCreate: pgCreate,
    gcloudPgCreateUser: pgCreateUser,
    gcloudPgDelete: pgDelete,
    gcloudPgList: pgList,
    gcloudPgUserList: pgUserList,
    gcloudSetupOnce: argv,
  })

  return options
}
